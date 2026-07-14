/* =========================================================
   ABOUT STORY — page logic
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initTopbarPin();
  initMoneyMap();
  initHeroReveal();
  initOrbitSystem();
  initTimeline();
  initShowcase();
  initStats();
});

/* ---------------------------------------------------------
   0. Safety net for the top "আমার সম্পর্কে" liquid-glass bar.
   The real fix is in about-story.css (neutralising any
   transform/filter/perspective on <html>/<body> that would
   otherwise break `position:fixed`'s viewport-relative
   containing block) — this just re-asserts fixed positioning
   on scroll in case something else ever sets an inline style
   on the bar, so it can never drift from the top.
--------------------------------------------------------- */
function initTopbarPin(){
  const bar = document.getElementById("asLiquidTopbar");
  if (!bar) return;
  const lock = () => {
    if (getComputedStyle(bar).position !== "fixed") {
      bar.style.position = "fixed";
    }
  };
  lock();
  window.addEventListener("scroll", lock, { passive: true });
  window.addEventListener("resize", lock);
}

/* ---------------------------------------------------------
   1. Money-flow globe — a real WebGL 3D Earth (Three.js),
   textured with an actual world-map image, rotating/drag-
   able, with real US $100 bill photos flying — in slow,
   cinematic motion — from each real income-source country
   into Bangladesh. Positions and dollar amounts are real
   figures:
     - Remittances (Bangladesh Bank / IOM-DTM "Remittance
       Snapshot 2024-2025", 2025 calendar year)
     - China / Japan are Bangladesh's export-earning trade
       partners rather than remittance sources, so they're
       tagged separately and sourced from Bangladesh Bank /
       Export Promotion Bureau (EPB) FY2024-25 export data
       and Daily Star / ExportGenius reporting.
   The scene also carries a small set of real-referenced
   space elements (Moon with an actual lunar texture,
   a satellite, an astronaut, passing rockets) since the
   backdrop beyond Earth is outer space — built from NASA/
   ESA-style open imagery via three.js's own texture set,
   not a pasted image.
--------------------------------------------------------- */

// Real income sources → Bangladesh.
// lat/lon = real geographic coordinates. amount = approx.
// USD billions.
const REMIT_SOURCES = [
  { name: "সৌদি আরব",         code: "KSA", lat: 24.7,  lon: 46.7,   amount: 5.03, type: "remit" },
  { name: "সংযুক্ত আরব আমিরাত", code: "UAE", lat: 24.5,  lon: 54.4,   amount: 4.16, type: "remit" },
  { name: "যুক্তরাষ্ট্র",        code: "USA", lat: 38.9,  lon: -77.0,  amount: 3.49, type: "remit" },
  { name: "যুক্তরাজ্য",         code: "UK",  lat: 51.5,  lon: -0.12,  amount: 3.17, type: "remit" },
  { name: "মালয়েশিয়া",        code: "MY",  lat: 3.15,  lon: 101.7,  amount: 2.80, type: "remit" },
  { name: "ইতালি",            code: "IT",  lat: 41.9,  lon: 12.5,   amount: 1.65, type: "remit" },
  { name: "কুয়েত",            code: "KW",  lat: 29.37, lon: 47.98,  amount: 1.55, type: "remit" },
  { name: "জাপান",            code: "JP",  lat: 36.2,  lon: 138.25, amount: 1.44, type: "export" },
  { name: "কাতার",            code: "QA",  lat: 25.29, lon: 51.53,  amount: 0.95, type: "remit" },
  { name: "ওমান",             code: "OM",  lat: 23.61, lon: 58.54,  amount: 0.77, type: "remit" },
  { name: "চীন",              code: "CN",  lat: 35.86, lon: 104.2,  amount: 0.67, type: "export" },
  { name: "সিঙ্গাপুর",         code: "SG",  lat: 1.35,  lon: 103.82, amount: 0.62, type: "remit" }
];
const BD_COORD = { lat: 23.685, lon: 90.356 };

function initMoneyMap() {
  const section = document.getElementById("asMap");
  const host = document.querySelector(".as-globe-host");
  const canvas = document.getElementById("asGlobeCanvas");
  const loading = document.getElementById("asGlobeLoading");
  if (!section || !host || !canvas || !window.THREE) {
    if (loading) loading.innerHTML = "<span>থ্রিডি গ্লোব সাপোর্ট করছে না এই ব্রাউজারে</span>";
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const RADIUS = 100;

  function latLonToVec3(lat, lon, r) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
  }
  // cinematic ease: cruises, then a quick, energetic final approach into BD
  function easeApproach(t) {
    return t < 0.55 ? (t / 0.55) * 0.7 : 0.7 + (1 - Math.pow(1 - (t - 0.55) / 0.45, 3)) * 0.3;
  }

  // ---- scene / camera / renderer ----
  const scene = new THREE.Scene();
  // narrower FOV + a bit more distance = a clean, wide-enough framing that
  // keeps Bangladesh large in shot while still showing the full horizon,
  // the satellite's colours, and the astronaut/rockets without cropping
  const camera = new THREE.PerspectiveCamera(37, host.clientWidth / host.clientHeight, 0.1, 3000);
  camera.position.set(0, 26, 300);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) {
    if (loading) loading.innerHTML = "<span>থ্রিডি গ্লোব লোড করা যায়নি</span>";
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(host.clientWidth, host.clientHeight);
  // filmic tone-mapping + correct colour space = real photographic contrast
  // instead of the flat, washed-out look of raw linear textures
  if ("outputEncoding" in renderer) renderer.outputEncoding = THREE.sRGBEncoding;
  if ("toneMapping" in renderer) {
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
  }

  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const sun = new THREE.DirectionalLight(0xfff3d6, 1.35);
  sun.position.set(220, 140, 180);
  scene.add(sun);
  // faint blue "earthshine" fill from the dark side, the way real orbital
  // photography never shows a fully black night limb
  const fill = new THREE.DirectionalLight(0x33507a, 0.18);
  fill.position.set(-200, -80, -140);
  scene.add(fill);

  // ---- starfield ----
  const starGeo = new THREE.BufferGeometry();
  const starCount = 1100;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const r = 700 + Math.random() * 900;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(Math.random() * 2 - 1);
    starPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    starPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    starPos[i * 3 + 2] = r * Math.cos(ph);
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 1.3, sizeAttenuation: true, opacity: 0.7, transparent: true })));

  const loader = new THREE.TextureLoader();
  loader.crossOrigin = "anonymous";

  // ---- deep-space props: Moon, satellite, astronaut, passing rockets ----
  const spaceGroup = new THREE.Group();
  scene.add(spaceGroup);

  // real lunar photo texture (three.js's own NASA-sourced moon map)
  const moonTex = loader.load("https://threejs.org/examples/textures/planets/moon_1024.jpg");
  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(26, 32, 32),
    new THREE.MeshPhongMaterial({ map: moonTex, shininess: 0 })
  );
  moon.position.set(-420, 160, -650);
  spaceGroup.add(moon);

  // realistic satellite — "বাংলাদেশ স্যাটেলাইট-১" — built with the real
  // anatomy of a comms satellite: a gold-foil-wrapped bus, a solar array
  // with an actual cell-grid texture, a parabolic dish + whip antennas,
  // and attitude-control thrusters, in Bangladesh's green/red colours.
  function makeCellPanelTexture(cellColor, gridColor) {
    const c = document.createElement("canvas");
    c.width = 256; c.height = 128;
    const g2 = c.getContext("2d");
    g2.fillStyle = cellColor;
    g2.fillRect(0, 0, 256, 128);
    g2.strokeStyle = gridColor;
    g2.lineWidth = 2;
    for (let x = 0; x <= 256; x += 16) { g2.beginPath(); g2.moveTo(x, 0); g2.lineTo(x, 128); g2.stroke(); }
    for (let y = 0; y <= 128; y += 16) { g2.beginPath(); g2.moveTo(0, y); g2.lineTo(256, y); g2.stroke(); }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }
  function makeFoilTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g2 = c.getContext("2d");
    const grad = g2.createLinearGradient(0, 0, 64, 64);
    grad.addColorStop(0, "#f2d98a");
    grad.addColorStop(0.5, "#c99a3e");
    grad.addColorStop(1, "#f2d98a");
    g2.fillStyle = grad;
    g2.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }
  function makeSatLabel(text) {
    const c = document.createElement("canvas");
    c.width = 460; c.height = 100;
    const g2 = c.getContext("2d");
    g2.fillStyle = "rgba(4,20,12,.74)";
    roundRect(g2, 4, 20, 452, 60, 14);
    g2.fill();
    g2.strokeStyle = "#c21e26";
    g2.lineWidth = 2.5;
    roundRect(g2, 4, 20, 452, 60, 14);
    g2.stroke();
    g2.font = "700 32px 'Hind Siliguri', Poppins, sans-serif";
    g2.fillStyle = "#eafff2";
    g2.textAlign = "center";
    g2.textBaseline = "middle";
    g2.fillText(text, 230, 51);
    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: true });
    const spr = new THREE.Sprite(mat);
    spr.scale.set(15, 3.3, 1);
    return spr;
  }

  const satGroup = new THREE.Group();

  // central bus (deep flag-green) + gold MLI thermal-blanket wrap
  const satBus = new THREE.Mesh(
    new THREE.BoxGeometry(4.4, 4.4, 6.4),
    new THREE.MeshStandardMaterial({ color: 0x00552f, metalness: 0.5, roughness: 0.45 })
  );
  satGroup.add(satBus);
  const satFoil = new THREE.Mesh(
    new THREE.CylinderGeometry(2.7, 2.7, 1.5, 24, 1, true),
    new THREE.MeshStandardMaterial({ map: makeFoilTexture(), metalness: 0.85, roughness: 0.25, side: THREE.DoubleSide })
  );
  satFoil.rotation.z = Math.PI / 2;
  satGroup.add(satFoil);

  // red flag-accent band + circular emblem on the bus face
  const satRedBand = new THREE.Mesh(
    new THREE.BoxGeometry(4.42, 0.6, 6.42),
    new THREE.MeshStandardMaterial({ color: 0xc21e26, metalness: 0.4, roughness: 0.5 })
  );
  satGroup.add(satRedBand);
  const satEmblem = new THREE.Mesh(
    new THREE.CircleGeometry(1.0, 24),
    new THREE.MeshStandardMaterial({ color: 0xc21e26, metalness: 0.3, roughness: 0.5, side: THREE.DoubleSide })
  );
  satEmblem.position.set(0, 0, 3.21);
  satGroup.add(satEmblem);

  // solar arrays — boom + panel with a real cell-grid texture, green cells
  // with a red edge trim
  [-1, 1].forEach(side => {
    const boom = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 3.4, 8),
      new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.7, roughness: 0.35 })
    );
    boom.rotation.z = Math.PI / 2;
    boom.position.set(side * (2.2 + 1.7), 0, 0);
    satGroup.add(boom);

    const panelTex = makeCellPanelTexture("#0a8a4a", "#053d20");
    panelTex.repeat.set(3, 1);
    const solarPanel = new THREE.Mesh(
      new THREE.BoxGeometry(11, 0.25, 4.6),
      new THREE.MeshStandardMaterial({ map: panelTex, metalness: 0.55, roughness: 0.3 })
    );
    solarPanel.position.set(side * (2.2 + 3.4 + 5.5), 0, 0);
    satGroup.add(solarPanel);

    const trim = new THREE.Mesh(
      new THREE.BoxGeometry(11.1, 0.28, 0.3),
      new THREE.MeshStandardMaterial({ color: 0xc21e26, metalness: 0.3, roughness: 0.5 })
    );
    trim.position.set(side * (2.2 + 3.4 + 5.5), 0, 2.3);
    satGroup.add(trim);
  });

  // parabolic dish antenna, facing forward, with its feed horn
  const dish = new THREE.Mesh(
    new THREE.SphereGeometry(2.1, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.42),
    new THREE.MeshStandardMaterial({ color: 0xf4f4f4, metalness: 0.15, roughness: 0.5, side: THREE.DoubleSide })
  );
  dish.rotation.x = Math.PI;
  dish.position.set(0, 0.6, 3.6);
  satGroup.add(dish);
  const feed = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 1.6, 8),
    new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.7, roughness: 0.3 })
  );
  feed.rotation.x = Math.PI / 2;
  feed.position.set(0, 0.6, 4.6);
  satGroup.add(feed);

  // whip/omni antennas + small attitude-control thrusters at the corners
  [-1, 1].forEach(side => {
    const whip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 3, 6),
      new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.6, roughness: 0.3 })
    );
    whip.position.set(side * 1.4, 2.9, -2.8);
    satGroup.add(whip);
  });
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
    const thruster = new THREE.Mesh(
      new THREE.ConeGeometry(0.22, 0.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.6, roughness: 0.4 })
    );
    thruster.position.set(sx * 2.1, -2.1, sz * 3.1);
    thruster.rotation.x = Math.PI;
    satGroup.add(thruster);
  });

  // "বাংলাদেশ স্যাটেলাইট-১" name badge — a sprite always billboards
  // toward the camera even as the satellite orbits and spins
  const satLabel = makeSatLabel("বাংলাদেশ স্যাটেলাইট-১");
  satLabel.position.set(0, -3.4, 0);
  satGroup.add(satLabel);

  // navigation strobe lights — small red (port/left) and green (starboard/
  // right) LEDs on the solar-array booms, the way real spacecraft and
  // aircraft carry them; they slowly pulse for a living, realistic feel
  const navLights = [];
  [[-1, 0xff2222], [1, 0x22ff66]].forEach(([side, col]) => {
    const led = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 10, 10),
      new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 1.4, metalness: 0.2, roughness: 0.3 })
    );
    led.position.set(side * (2.2 + 3.4 + 10.6), 0, 0);
    satGroup.add(led);
    navLights.push(led);
  });

  satGroup.scale.setScalar(1.3);
  scene.add(satGroup);
  const satOrbitR = RADIUS + 55, satOrbitTilt = 0.35;
  let satAngle = 0;

  // astronaut + rockets built from real 3D geometry (metal cylinders, cones,
  // spheres with proper lit materials) instead of flat cartoon emoji — reads
  // as solid hardware / a suited figure from any viewing angle.
  function makeGlowSprite(colorIn, colorOut) {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g2 = c.getContext("2d");
    const grad = g2.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, colorIn);
    grad.addColorStop(1, colorOut);
    g2.fillStyle = grad;
    g2.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
    return new THREE.Sprite(mat);
  }

  function makePanelLineTexture() {
    const c = document.createElement("canvas");
    c.width = 128; c.height = 256;
    const g2 = c.getContext("2d");
    g2.fillStyle = "#e7e9ee";
    g2.fillRect(0, 0, 128, 256);
    g2.strokeStyle = "rgba(70,75,85,.4)";
    g2.lineWidth = 1.5;
    for (let y = 20; y < 256; y += 26) { g2.beginPath(); g2.moveTo(0, y); g2.lineTo(128, y); g2.stroke(); }
    g2.strokeStyle = "rgba(70,75,85,.25)";
    for (let x = 16; x < 128; x += 16) { g2.beginPath(); g2.moveTo(x, 0); g2.lineTo(x, 256); g2.stroke(); }
    // faint weathering streaks
    g2.strokeStyle = "rgba(40,45,55,.12)";
    g2.lineWidth = 3;
    for (let i = 0; i < 6; i++) { g2.beginPath(); g2.moveTo(Math.random() * 128, 0); g2.lineTo(Math.random() * 128, 256); g2.stroke(); }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 1);
    return tex;
  }
  function makeCheckerTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g2 = c.getContext("2d");
    const n = 8, cell = 64 / n;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      g2.fillStyle = (x + y) % 2 === 0 ? "#1a1c1f" : "#eef0f3";
      g2.fillRect(x * cell, y * cell, cell, cell);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.repeat.set(3, 1);
    return tex;
  }

  function buildRocket() {
    const g = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ map: makePanelLineTexture(), metalness: 0.55, roughness: 0.4 });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0xc23b3b, metalness: 0.3, roughness: 0.5 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x2b2e33, metalness: 0.6, roughness: 0.4 });
    const checkerMat = new THREE.MeshStandardMaterial({ map: makeCheckerTexture(), metalness: 0.3, roughness: 0.5 });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.3, 7, 24), bodyMat);
    g.add(body);

    // classic roll-pattern checkerboard band, real launch-vehicle detail
    const rollBand = new THREE.Mesh(new THREE.CylinderGeometry(1.17, 1.17, 0.9, 24), checkerMat);
    rollBand.position.y = 1.1;
    g.add(rollBand);

    const nose = new THREE.Mesh(new THREE.ConeGeometry(1.15, 2.4, 24), trimMat);
    nose.position.y = 7 / 2 + 2.4 / 2;
    g.add(nose);

    const collar = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.4, 24), trimMat);
    collar.position.y = 7 / 2 - 0.3;
    g.add(collar);

    const windowMesh = new THREE.Mesh(
      new THREE.CircleGeometry(0.42, 16),
      new THREE.MeshStandardMaterial({ color: 0x8fd6ff, metalness: 0.7, roughness: 0.1, emissive: 0x1c4a63, emissiveIntensity: 0.4 })
    );
    windowMesh.position.set(0, -0.6, 1.16);
    g.add(windowMesh);

    // raceway conduit running the length of the hull (cabling/plumbing)
    const raceway = new THREE.Mesh(new THREE.BoxGeometry(0.22, 6.6, 0.22), darkMat);
    raceway.position.set(0, -0.1, 1.28);
    g.add(raceway);

    // grid fins near the nose (real recoverable-booster detail)
    for (let i = 0; i < 4; i++) {
      const finGroup = new THREE.Group();
      const lattice = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.06, 1.1), darkMat);
      finGroup.add(lattice);
      for (let k = -2; k <= 2; k++) {
        const barA = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.07, 0.05), darkMat);
        barA.position.z = k * 0.22;
        finGroup.add(barA);
        const barB = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.07, 1.1), darkMat);
        barB.position.x = k * 0.22;
        finGroup.add(barB);
      }
      const ang = (i / 4) * Math.PI * 2;
      finGroup.position.set(Math.cos(ang) * 1.3, 2.3, Math.sin(ang) * 1.3);
      finGroup.rotation.y = ang;
      g.add(finGroup);
    }

    // folded landing legs at the base
    for (let i = 0; i < 4; i++) {
      const ang = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 2.2, 8), darkMat);
      leg.position.set(Math.cos(ang) * 1.25, -7 / 2 + 0.4, Math.sin(ang) * 1.25);
      leg.rotation.z = Math.cos(ang) * 0.5;
      leg.rotation.x = -Math.sin(ang) * 0.5;
      g.add(leg);
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.5), darkMat);
      foot.position.set(Math.cos(ang) * 1.9, -7 / 2 - 0.55, Math.sin(ang) * 1.9);
      g.add(foot);
    }

    // engine skirt + a real multi-nozzle cluster instead of one toy cone
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.35, 0.7, 24), darkMat);
    skirt.position.y = -7 / 2 - 0.35;
    g.add(skirt);
    const flames = [];
    const nozzlePositions = [[0, 0], [0.55, 0.55], [-0.55, 0.55], [0.55, -0.55], [-0.55, -0.55]];
    nozzlePositions.forEach(([nx, nz]) => {
      const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.32, 0.9, 16), darkMat);
      nozzle.position.set(nx, -7 / 2 - 1.05, nz);
      g.add(nozzle);
      const flame = makeGlowSprite("rgba(255,205,130,1)", "rgba(255,90,30,0)");
      flame.scale.set(1.0, 2.6, 1);
      flame.position.set(nx, -7 / 2 - 2, nz);
      g.add(flame);
      flames.push(flame);
    });
    g.userData.flames = flames;

    g.scale.setScalar(2.35);
    return g;
  }

  function makeChestPanelTexture() {
    const c = document.createElement("canvas");
    c.width = 128; c.height = 96;
    const g2 = c.getContext("2d");
    g2.fillStyle = "#cfd3d9";
    g2.fillRect(0, 0, 128, 96);
    g2.strokeStyle = "#7c828a";
    g2.lineWidth = 2;
    g2.strokeRect(6, 6, 116, 84);
    const colors = ["#e23b3b", "#3fae5c", "#e0b23a", "#3a8bd6"];
    colors.forEach((col, i) => {
      g2.fillStyle = col;
      g2.fillRect(14 + i * 26, 16, 16, 16);
    });
    g2.fillStyle = "#20242a";
    g2.fillRect(14, 46, 100, 26);
    g2.fillStyle = "#7bffb0";
    g2.font = "600 14px monospace";
    g2.fillText("BD-01", 22, 64);
    return new THREE.CanvasTexture(c);
  }

  function buildAstronaut() {
    const g = new THREE.Group();
    const suitMat = new THREE.MeshStandardMaterial({ color: 0xe9ecf0, metalness: 0.05, roughness: 0.65 });
    const jointMat = new THREE.MeshStandardMaterial({ color: 0xc7ccd3, metalness: 0.1, roughness: 0.6 });
    const visorMat = new THREE.MeshPhysicalMaterial({ color: 0xffcf6b, metalness: 0.7, roughness: 0.12, clearcoat: 0.6, emissive: 0x3a2400, emissiveIntensity: 0.25 });
    const packMat = new THREE.MeshStandardMaterial({ color: 0xd7dae0, metalness: 0.2, roughness: 0.55 });

    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.8, 2.6, 16), suitMat);
    g.add(torso);

    // chest control & display module (real EVA-suit detail)
    const chestPanel = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.85, 0.12),
      new THREE.MeshStandardMaterial({ map: makeChestPanelTexture(), metalness: 0.2, roughness: 0.5 })
    );
    chestPanel.position.set(0, 0.35, 0.88);
    g.add(chestPanel);

    const pack = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.9, 0.85), packMat);
    pack.position.set(0, 0.1, -0.95);
    g.add(pack);
    // backpack vents/ribbing
    for (let i = -1; i <= 1; i++) {
      const vent = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.1, 0.05), jointMat);
      vent.position.set(0, 0.1 + i * 0.55, -1.4);
      g.add(vent);
    }

    const helmet = new THREE.Mesh(new THREE.SphereGeometry(1.05, 24, 24), suitMat);
    helmet.position.y = 1.9;
    g.add(helmet);
    const neckRing = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.9, 0.3, 16), jointMat);
    neckRing.position.y = 1.05;
    g.add(neckRing);
    const visor = new THREE.Mesh(new THREE.SphereGeometry(0.78, 20, 20, 0, Math.PI * 1.4, 0, Math.PI * 0.75), visorMat);
    visor.position.set(0, 1.9, 0.25);
    visor.rotation.y = -Math.PI / 2;
    g.add(visor);
    // helmet headlamps, mounted either side of the visor
    [-1, 1].forEach(side => {
      const lamp = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.15, 12),
        new THREE.MeshStandardMaterial({ color: 0xfff6d8, emissive: 0xfff2b0, emissiveIntensity: 0.8, metalness: 0.3, roughness: 0.3 })
      );
      lamp.rotation.z = Math.PI / 2;
      lamp.position.set(side * 0.72, 2.15, 0.75);
      g.add(lamp);
    });

    [-1, 1].forEach(side => {
      const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.36, 12, 12), suitMat);
      shoulder.position.set(side * 1.05, 0.85, 0.1);
      g.add(shoulder);
      const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.28, 1.4, 12), suitMat);
      upperArm.position.set(side * 1.15, 0.75, 0.1);
      upperArm.rotation.z = side * 0.9;
      g.add(upperArm);
      const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), jointMat);
      elbow.position.set(side * 1.55, 0.2, 0.32);
      g.add(elbow);
      const foreArm = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 1.2, 12), suitMat);
      foreArm.position.set(side * 1.85, -0.1, 0.55);
      foreArm.rotation.z = side * 1.7;
      foreArm.rotation.x = 0.5;
      g.add(foreArm);
      const glove = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12), jointMat);
      glove.position.set(side * 2.25, -0.55, 0.9);
      g.add(glove);
    });

    [-1, 1].forEach(side => {
      const hip = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 12), suitMat);
      hip.position.set(side * 0.42, -1.15, 0.1);
      g.add(hip);
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.34, 1.5, 12), suitMat);
      thigh.position.set(side * 0.5, -1.75, 0.3);
      thigh.rotation.z = side * -0.25;
      thigh.rotation.x = 0.5;
      g.add(thigh);
      const knee = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12), jointMat);
      knee.position.set(side * 0.58, -2.35, 0.68);
      g.add(knee);
      const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.26, 1.3, 12), suitMat);
      shin.position.set(side * 0.65, -2.75, 0.9);
      shin.rotation.x = 1.15;
      g.add(shin);
      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.75), jointMat);
      boot.position.set(side * 0.7, -3.35, 1.35);
      g.add(boot);
    });

    const tetherPts = [];
    for (let i = 0; i <= 12; i++) tetherPts.push(new THREE.Vector3(-1.3 - i * 0.35, -1 - Math.sin(i * 0.5) * 0.4, -1 - i * 0.5));
    const tether = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(tetherPts),
      new THREE.LineBasicMaterial({ color: 0xaab0b8, transparent: true, opacity: 0.5 })
    );
    g.add(tether);

    g.scale.setScalar(7.9);
    return g;
  }

  const astronaut = buildAstronaut();
  astronaut.position.set(190, 90, -180);
  astronaut.rotation.set(0.4, 0.9, 0.15);
  scene.add(astronaut);

  const rockets = [];
  for (let i = 0; i < 2; i++) {
    const r = buildRocket();
    scene.add(r);
    rockets.push({
      group: r,
      t: i * 0.5,
      speed: 0.00022 + i * 0.00006,
      from: new THREE.Vector3(-480 + i * 60, -220 + i * 90, -300 - i * 120),
      to: new THREE.Vector3(480 - i * 40, 260 - i * 60, -120 + i * 100)
    });
  }

  // occasional shooting stars
  const shootingStars = [];
  function spawnShootingStar() {
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(-26, -9, 0)]);
    const mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
    const line = new THREE.Line(geo, mat);
    line.position.set(300 + Math.random() * 300, 150 + Math.random() * 250, -400 - Math.random() * 300);
    scene.add(line);
    shootingStars.push({ mesh: line, life: 0, maxLife: 60 + Math.random() * 30 });
  }

  // ---- earth group (globe rotates as one unit) ----
  const globe = new THREE.Group();
  scene.add(globe);

  const dayTex = loader.load(
    "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
    () => { if (loading) loading.classList.add("is-hidden"); },
    undefined,
    () => { if (loading) loading.innerHTML = "<span>ম্যাপ টেক্সচার লোড করা যায়নি</span>"; }
  );
  if ("encoding" in dayTex) dayTex.encoding = THREE.sRGBEncoding;
  const specTex = loader.load("https://threejs.org/examples/textures/planets/earth_specular_2048.jpg");
  const normalTex = loader.load("https://threejs.org/examples/textures/planets/earth_normal_2048.jpg");
  const cloudTex = loader.load("https://threejs.org/examples/textures/planets/earth_clouds_1024.png");
  const billTex = loader.load("assets/dollar-100.jpg");
  if ("encoding" in billTex) billTex.encoding = THREE.sRGBEncoding;
  const BILL_ASPECT = 1133 / 475; // real note's width/height ratio

  // higher-poly sphere so terrain relief (normal map) reads smoothly this
  // close up, instead of faceting like a low-poly globe
  const earthMesh = new THREE.Mesh(
    new THREE.SphereGeometry(RADIUS, 128, 128),
    new THREE.MeshPhongMaterial({
      map: dayTex,
      specularMap: specTex,
      normalMap: normalTex,
      normalScale: new THREE.Vector2(0.85, 0.85),
      specular: new THREE.Color(0x2a2a2a),
      shininess: 9
    })
  );
  globe.add(earthMesh);

  // real cloud layer, slightly above the surface, drifting independently —
  // this alone is what makes it read as an actual photographed planet
  // instead of a flat texture sphere
  const cloudMesh = new THREE.Mesh(
    new THREE.SphereGeometry(RADIUS * 1.008, 96, 96),
    new THREE.MeshPhongMaterial({ map: cloudTex, transparent: true, depthWrite: false, opacity: 0.65 })
  );
  globe.add(cloudMesh);

  // Fresnel-style atmosphere rim — thin and bright only at the grazing
  // edge, the way a real limb-glow looks from orbit
  const atmo = new THREE.Mesh(
    new THREE.SphereGeometry(RADIUS * 1.025, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0x5fc2ff, transparent: true, opacity: 0.16, side: THREE.BackSide })
  );
  globe.add(atmo);
  const atmoOuter = new THREE.Mesh(
    new THREE.SphereGeometry(RADIUS * 1.055, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0x2f7fd6, transparent: true, opacity: 0.07, side: THREE.BackSide })
  );
  globe.add(atmoOuter);

  // ---- Bangladesh pin (glows brighter each time a bill arrives) ----
  const bdPos = latLonToVec3(BD_COORD.lat, BD_COORD.lon, RADIUS + 1.5);
  const bdPin = new THREE.Mesh(
    new THREE.SphereGeometry(1.8, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffc107 })
  );
  bdPin.position.copy(bdPos);
  globe.add(bdPin);
  const bdRing = new THREE.Mesh(
    new THREE.RingGeometry(2.2, 2.6, 32),
    new THREE.MeshBasicMaterial({ color: 0xffc107, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
  );
  bdRing.position.copy(bdPos);
  bdRing.lookAt(bdPos.clone().multiplyScalar(2));
  globe.add(bdRing);
  const bdFlash = new THREE.Mesh(
    new THREE.RingGeometry(0.1, 5, 40),
    new THREE.MeshBasicMaterial({ color: 0xffe9a8, transparent: true, opacity: 0, side: THREE.DoubleSide })
  );
  bdFlash.position.copy(bdPos);
  bdFlash.lookAt(bdPos.clone().multiplyScalar(2));
  globe.add(bdFlash);
  const arrivalPulses = [];

  // ---- source markers + flowing dollar-bill particles (no visible arc line) ----
  const maxAmount = Math.max(...REMIT_SOURCES.map(s => s.amount));
  const flowParticles = [];

  function makeLabelSprite(text, accent) {
    const c = document.createElement("canvas");
    c.width = 320; c.height = 74;
    const g = c.getContext("2d");
    // soft pill backdrop so overlapping labels stay legible
    g.fillStyle = "rgba(4,8,16,.62)";
    roundRect(g, 4, 14, 312, 46, 12);
    g.fill();
    g.strokeStyle = accent;
    g.lineWidth = 1.5;
    roundRect(g, 4, 14, 312, 46, 12);
    g.stroke();
    g.font = "600 24px Poppins, sans-serif";
    g.fillStyle = "rgba(255,255,255,.95)";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(text, 160, 38);
    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: true });
    const spr = new THREE.Sprite(mat);
    spr.scale.set(27, 6.25, 1);
    return spr;
  }
  function roundRect(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }

  REMIT_SOURCES.forEach((src, i) => {
    const startPos = latLonToVec3(src.lat, src.lon, RADIUS + 0.6);
    const scale = 0.9 + (src.amount / maxAmount) * 1.6;
    const color = src.type === "export" ? 0x34d399 : 0x29b6ff;

    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.9 * scale, 12, 12),
      new THREE.MeshBasicMaterial({ color })
    );
    dot.position.copy(startPos);
    globe.add(dot);

    const tag = src.type === "export" ? "রপ্তানি আয়" : "রেমিট্যান্স";
    // stagger label distance a touch per marker so nearby Gulf-country
    // pins (KSA/UAE/Qatar/Oman/Kuwait) don't stack directly on top of
    // each other from the default viewing angle.
    const labelDist = 1.1 + (i % 4) * 0.045;
    const label = makeLabelSprite(`${src.name} · ${tag} $${src.amount}B`, src.type === "export" ? "#34d399" : "#ffc107");
    label.position.copy(startPos.clone().multiplyScalar(labelDist));
    globe.add(label);

    // invisible flight path (quadratic bezier hugging close to the surface,
    // like it's wrapping around the Earth rather than floating off it) —
    // no drawn line, only the bill sprites travel along it
    const mid = startPos.clone().add(bdPos).multiplyScalar(0.5);
    mid.setLength(RADIUS + RADIUS * 0.085 * (0.5 + src.amount / maxAmount));
    const curve = new THREE.QuadraticBezierCurve3(startPos, mid, bdPos);

    // two bills per route, offset in time — quick, energetic pace
    for (let b = 0; b < 2; b++) {
      const billW = 8.5 + Math.random() * 2.5;
      const mat = new THREE.SpriteMaterial({ map: billTex, transparent: true, depthTest: true });
      const spr = new THREE.Sprite(mat);
      spr.scale.set(billW, billW / BILL_ASPECT, 1);
      globe.add(spr);
      flowParticles.push({
        curve,
        t: (Math.random() + b * 0.5) % 1,
        speed: 0.00075 + Math.random() * 0.00045,
        arrived: false,
        mesh: spr
      });
    }
  });

  // ---- resize ----
  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener("resize", resize);
  resize();

  // ---- drag-to-rotate, always settling back to face Bangladesh ----
  // Facing angle computed from Bangladesh's real coordinates so the
  // pin sits toward the viewer by default.
  const baseRotY = Math.atan2(-bdPos.x, bdPos.z);
  const baseRotX = -0.12;
  let rotY = baseRotY, rotX = baseRotX;
  let autoSpin = true;
  let dragging = false, lastX = 0, lastY = 0;

  canvas.addEventListener("pointerdown", e => {
    dragging = true; autoSpin = false;
    lastX = e.clientX; lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", e => {
    if (!dragging) return;
    rotY += (e.clientX - lastX) * 0.005;
    rotX += (e.clientY - lastY) * 0.005;
    rotX = Math.max(-1.1, Math.min(1.1, rotX));
    lastX = e.clientX; lastY = e.clientY;
  });
  ["pointerup", "pointerleave", "pointercancel"].forEach(ev =>
    canvas.addEventListener(ev, () => { dragging = false; setTimeout(() => (autoSpin = true), 2200); })
  );

  let shootTimer = 0;

  function render() {
    const now = performance.now();
    if (autoSpin && !reduceMotion) {
      // Gentle sway centered on Bangladesh, then settle back to it —
      // the globe always ends up facing Bangladesh, never drifts away.
      const targetY = baseRotY + Math.sin(now * 0.00028) * 0.14;
      rotY += (targetY - rotY) * 0.02;
      rotX += (baseRotX - rotX) * 0.02;
    }
    globe.rotation.y = rotY;
    globe.rotation.x = rotX;
    if (!reduceMotion) cloudMesh.rotation.y += 0.00012;

    if (!reduceMotion) {
      // orbiting satellite
      satAngle += 0.0026;
      satGroup.position.set(
        Math.cos(satAngle) * satOrbitR,
        Math.sin(satAngle) * satOrbitR * satOrbitTilt,
        Math.sin(satAngle) * satOrbitR
      );
      satGroup.rotation.y = -satAngle;
      satGroup.rotation.z = 0.3;
      const strobe = 0.55 + Math.abs(Math.sin(now * 0.0035)) * 1.1;
      navLights.forEach(led => { led.material.emissiveIntensity = strobe; });

      // slow astronaut tumble/drift in zero-g (full 3D rotation, not a flat spin)
      astronaut.rotation.x += 0.0012;
      astronaut.rotation.y += 0.0009;
      astronaut.position.y = 90 + Math.sin(now * 0.0004) * 12;

      // rockets cruising past in the background, nose pointed along their
      // real direction of travel, with a flickering engine flame
      rockets.forEach(r => {
        r.t += r.speed;
        if (r.t > 1) r.t = 0;
        r.group.position.lerpVectors(r.from, r.to, r.t);
        const dir = r.to.clone().sub(r.from).normalize();
        r.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        const a = r.t < 0.08 ? r.t / 0.08 : (r.t > 0.9 ? (1 - r.t) / 0.1 : 1);
        const op = Math.max(0, a);
        r.group.traverse(o => { if (o.material) { o.material.transparent = true; o.material.opacity = op; } });
        const flames = r.group.userData.flames;
        if (flames) {
          flames.forEach(flame => {
            const flicker = 0.75 + Math.random() * 0.35;
            flame.scale.set(1.0 * flicker, (2.6 + Math.random() * 0.8) * flicker, 1);
          });
        }
      });

      // occasional shooting star
      shootTimer++;
      if (shootTimer > 220 + Math.random() * 200) { spawnShootingStar(); shootTimer = 0; }
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.life++;
        s.mesh.material.opacity = Math.max(0, 1 - s.life / s.maxLife);
        s.mesh.position.x -= 3;
        s.mesh.position.y -= 1;
        if (s.life > s.maxLife) { scene.remove(s.mesh); shootingStars.splice(i, 1); }
      }

      // dollar bills — quick flight that hugs the globe and rushes in
      // lengthwise, long edge leading, as it dives into Bangladesh
      flowParticles.forEach(p => {
        p.t += p.speed;
        if (p.t > 1) { p.t = 0; p.arrived = false; }
        if (!p.arrived && p.t > 0.985) { p.arrived = true; arrivalPulses.push({ time: now }); }
        const eased = easeApproach(p.t);
        const pos = p.curve.getPoint(eased);
        p.mesh.position.copy(pos);

        // orient the note's long edge along its real direction of travel,
        // projected into screen space, instead of a random tumble
        const aheadT = Math.min(eased + 0.015, 1);
        const behindT = Math.max(eased - 0.015, 0);
        const worldAhead = p.curve.getPoint(aheadT).applyMatrix4(globe.matrixWorld);
        const worldBehind = p.curve.getPoint(behindT).applyMatrix4(globe.matrixWorld);
        const camAhead = worldAhead.applyMatrix4(camera.matrixWorldInverse);
        const camBehind = worldBehind.applyMatrix4(camera.matrixWorldInverse);
        p.mesh.material.rotation = Math.atan2(camAhead.y - camBehind.y, camAhead.x - camBehind.x);

        if (!p.mesh.userData.baseScale) p.mesh.userData.baseScale = p.mesh.scale.clone();
        const base = p.mesh.userData.baseScale;
        // fade in on departure, fade out gently as it settles into Bangladesh
        const alpha = p.t < 0.05 ? p.t / 0.05 : (p.t > 0.93 ? Math.max(0, (1 - p.t) / 0.07) : 1);
        // thin toward the short edge as it nears Bangladesh, so it reads as
        // diving in lengthwise rather than just shrinking in place
        const thin = p.t > 0.75 ? Math.max(0.2, 1 - (p.t - 0.75) * 3.4) : 1;
        const land = p.t > 0.92 ? Math.max(0.3, 1 - (p.t - 0.92) * 6) : 1;
        p.mesh.scale.set(base.x * land, base.y * thin * land, 1);
        p.mesh.material.opacity = Math.max(0.12, alpha);
        p.mesh.material.transparent = true;
      });

      // Bangladesh arrival glow — a soft flash + brief pulse each landing
      let pulseScale = 1, flashOpacity = 0;
      for (let i = arrivalPulses.length - 1; i >= 0; i--) {
        const age = now - arrivalPulses[i].time;
        if (age > 900) { arrivalPulses.splice(i, 1); continue; }
        const p = age / 900;
        pulseScale += (1 - p) * 1.6;
        flashOpacity = Math.max(flashOpacity, (1 - p) * 0.85);
      }
      bdRing.scale.setScalar(pulseScale);
      bdPin.scale.setScalar(1 + (pulseScale - 1) * 0.35);
      bdFlash.material.opacity = flashOpacity;
      bdFlash.scale.setScalar(1 + (1 - flashOpacity / 0.85 || 0) * 2);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  if (reduceMotion && loading) {
    setTimeout(() => loading.classList.add("is-hidden"), 800);
  }
}

/* ---------------------------------------------------------
   2. Hero entrance reveal
--------------------------------------------------------- */
function initHeroReveal() {
  const els = Array.prototype.slice.call(document.querySelectorAll("#asHero .as-reveal"));
  if (!els.length) return;

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // staggered entrance for the hero lines/CTA — pure CSS transition,
  // no external animation library needed
  els.forEach((el, i) => {
    el.style.transition = "opacity 1s cubic-bezier(.19,1,.22,1), transform 1s cubic-bezier(.19,1,.22,1)";
    el.style.transitionDelay = reduceMotion ? "0s" : (0.3 + i * 0.15) + "s";
  });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      els.forEach(el => { el.style.opacity = 1; el.style.transform = "none"; });
    });
  });

  // section headings fade/rise in as they scroll into view
  const heads = document.querySelectorAll(".as-section-head");
  if (!heads.length) return;

  if (reduceMotion || typeof IntersectionObserver === "undefined") {
    heads.forEach(head => {
      Array.prototype.forEach.call(head.children, child => {
        child.style.opacity = 1;
        child.style.transform = "none";
      });
    });
    return;
  }

  heads.forEach(head => {
    Array.prototype.forEach.call(head.children, child => {
      child.style.opacity = 0;
      child.style.transform = "translateY(24px)";
      child.style.transition = "opacity .8s ease-out, transform .8s ease-out";
    });
  });

  const headIo = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      Array.prototype.forEach.call(entry.target.children, (child, i) => {
        child.style.transitionDelay = (i * 0.1) + "s";
        child.style.opacity = 1;
        child.style.transform = "none";
      });
      headIo.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: "0px 0px -18% 0px" });
  heads.forEach(head => headIo.observe(head));
}

/* ---------------------------------------------------------
   3. Skills solar system
--------------------------------------------------------- */
const SKILLS = [
  { name: "Digital Marketing", icon: "fa-solid fa-bullhorn", ring: 1, offset: 0, period: 14000, color: "#d946ef",
    experience: "৪+ বছর", projects: "৫০+", tools: "Meta Ads, Analytics" },
  { name: "HTML5", icon: "fa-brands fa-html5", ring: 1, offset: 120, period: 14000, color: "#e34f26",
    experience: "৬+ বছর", projects: "৭০+", tools: "VS Code, Emmet" },
  { name: "3D Animation", icon: "fa-solid fa-cube", ring: 1, offset: 240, period: 14000, color: "#6366f1",
    experience: "২+ বছর", projects: "১৫+", tools: "Blender, After Effects" },
  { name: "SEO", icon: "fa-solid fa-magnifying-glass-chart", ring: 2, offset: 0, period: 20000, color: "#22c55e",
    experience: "৪+ বছর", projects: "৪৫+", tools: "Search Console, Ahrefs" },
  { name: "Python Programming", icon: "fa-brands fa-python", ring: 2, offset: 120, period: 20000, color: "#3776ab",
    experience: "৩+ বছর", projects: "২০+", tools: "Django, Automation Scripts" },
  { name: "Google Advertisement", icon: "fa-brands fa-google", ring: 2, offset: 240, period: 20000, color: "#4285f4",
    experience: "৩+ বছর", projects: "৩০+", tools: "Google Ads, Tag Manager" },
  { name: "Web Development", icon: "fa-solid fa-code", ring: 3, offset: 0, period: 27000, color: "#a855f7",
    experience: "৬+ বছর", projects: "৮০+", tools: "HTML, CSS, JS, PHP" },
  { name: "Social Media Marketing", icon: "fa-solid fa-share-nodes", ring: 3, offset: 180, period: 27000, color: "#ec4899",
    experience: "৪+ বছর", projects: "৪০+", tools: "Facebook, Instagram, LinkedIn" }
  // এখানে skill যোগ/বাদ দিলে ring (1/2/3) আর offset (ডিগ্রি) অনুযায়ী গ্রহগুলো নিজে থেকেই কক্ষপথে সাজবে
];

// hex রঙ থেকে rgba() স্ট্রিং বানানোর ছোট হেল্পার — গ্রহগুলোকে
// liquid-glass ইফেক্টে নিজের স্কিল-কালারে হালকা টিন্ট করার জন্য
function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map(c => c + c).join("") : clean;
  const num = parseInt(full, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// একই রঙের একটু হালকা (সাদার দিকে মেশানো) ভার্সন — গ্লাস স্ফিয়ারের
// উপরের অংশে চকচকে হাইলাইট থেকে নিচের গাঢ় রঙে মিহি রূপান্তরের জন্য
function lightenHex(hex, amount) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map(c => c + c).join("") : clean;
  const num = parseInt(full, 16);
  const r = Math.round(((num >> 16) & 255) + (255 - ((num >> 16) & 255)) * amount);
  const g = Math.round(((num >> 8) & 255) + (255 - ((num >> 8) & 255)) * amount);
  const b = Math.round((num & 255) + (255 - (num & 255)) * amount);
  return `rgb(${r}, ${g}, ${b})`;
}

function initOrbitSystem() {
  const system = document.getElementById("asOrbitSystem");
  const panel = document.getElementById("asInfoPanel");
  if (!system || !panel) return;

  const ringRadiusPct = { 1: 0.38, 2: 0.64, 3: 0.92 };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const nodes = SKILLS.map((skill, i) => {
    const el = document.createElement("div");
    el.className = "as-planet";
    el.style.setProperty("--planet-tint", skill.color);
    el.style.setProperty("--planet-tint-soft", lightenHex(skill.color, 0.4));
    el.style.setProperty("--planet-glow", hexToRgba(skill.color, 0.6));
    el.innerHTML = `<i class="${skill.icon}"></i><span>${skill.name}</span>`;
    system.appendChild(el);

    const state = { skill, el, angle: (skill.offset / 360) * Math.PI * 2, paused: false };

    el.addEventListener("mouseenter", () => { state.paused = true; el.classList.add("is-hovered"); });
    el.addEventListener("mouseleave", () => { state.paused = false; el.classList.remove("is-hovered"); });
    el.addEventListener("click", () => selectPlanet(state));
    el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectPlanet(state); } });
    el.tabIndex = 0;

    return state;
  });

  function selectPlanet(state) {
    nodes.forEach(n => n.el.classList.remove("is-active"));
    state.el.classList.add("is-active");
    renderInfo(state.skill);
  }

  function renderInfo(skill) {
    // প্যানেলের চারপাশে স্কিলের নিজস্ব রঙে একটা কালারফুল গ্লো —
    // প্রতিবার নতুন স্কিল সিলেক্ট করলে হালকা পালস অ্যানিমেশন সহ জ্বলে ওঠে
    panel.style.setProperty("--panel-glow", hexToRgba(skill.color, 0.55));
    panel.style.setProperty("--panel-border", hexToRgba(skill.color, 0.55));
    panel.classList.remove("is-pulsing");
    void panel.offsetWidth; // reflow so the pulse animation restarts every click
    panel.classList.add("is-pulsing");

    panel.innerHTML = `
      <div class="as-info-body">
        <div class="as-info-body__head">
          <span class="as-info-body__icon" style="background:${hexToRgba(skill.color, 0.28)}; color:${skill.color}; box-shadow:0 0 22px ${hexToRgba(skill.color, 0.5)};"><i class="${skill.icon}"></i></span>
          <h3>${skill.name}</h3>
        </div>
        <div class="as-info-row"><span>অভিজ্ঞতা</span><span>${skill.experience}</span></div>
        <div class="as-info-row"><span>প্রজেক্ট সম্পন্ন</span><span>${skill.projects}</span></div>
        <div class="as-info-row"><span>ব্যবহৃত টুলস</span><span>${skill.tools}</span></div>
      </div>`;
  }

  function frame(ts) {
    const rect = system.getBoundingClientRect();
    const R = rect.width / 2;
    nodes.forEach(state => {
      if (!state.paused && !reduceMotion) {
        state.angle += ((Math.PI * 2) / state.skill.period) * 16;
      }
      const radius = R * ringRadiusPct[state.skill.ring];
      const x = Math.cos(state.angle) * radius;
      const y = Math.sin(state.angle) * radius;
      state.el.style.transform = `translate(${x}px, ${y}px)`;
    });
    if (!reduceMotion) requestAnimationFrame(frame);
  }

  // Kick off the orbit loop (frame() self-schedules further frames)
  requestAnimationFrame(frame);
}

/* ---------------------------------------------------------
   4. Timeline
--------------------------------------------------------- */
function initTimeline() {
  const track = document.getElementById("asTimelineTrack") || document.querySelector(".as-timeline-track");
  const fill = document.getElementById("asTimelineFill");
  const items = document.querySelectorAll(".as-timeline-item");
  if (!track || !items.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("is-in");
    });
  }, { threshold: 0.35 });
  items.forEach(i => io.observe(i));

  function updateFill() {
    const rect = track.getBoundingClientRect();
    const viewH = window.innerHeight;
    const visible = Math.min(Math.max(viewH * 0.6 - rect.top, 0), rect.height);
    const pct = rect.height ? (visible / rect.height) * 100 : 0;
    fill.style.height = Math.min(pct, 100) + "%";
  }
  window.addEventListener("scroll", updateFill, { passive: true });
  window.addEventListener("resize", updateFill);
  updateFill();
}

/* ---------------------------------------------------------
   5. Previous Works — floating liquid-glass boxes.
   Each box drifts freely inside the stage — left/right,
   up/down — and gently bounces off the edges, like the
   crystal-clear glass droplets in the reference photo.
   Click a box to zoom it into a large panel with the photo,
   headline, and a full description underneath.

   এখানে নিজের কাজের ছবি বসাতে চাইলে নিচের PROJECTS অ্যারেতে
   প্রতিটি আইটেমের `image` ফিল্ডে নিজের ছবির লিংক (URL) বা
   আপলোড করা ছবির path বসিয়ে দিন। `title` = বক্সের নিচে ছোট
   হেডলাইন, `description` = ক্লিক করলে বড় প্যানেলে দেখানো
   বিস্তারিত লেখা। আইটেম যত খুশি যোগ/বাদ দেওয়া যাবে।
--------------------------------------------------------- */
const PROJECTS = [
  {
    title: "Google Reputation Management",
    image: "images/google-ads-1.jpg",
    description: "গুগল রেপুটেশন ম্যানেজমেন্ট — একজন ক্লায়েন্টের ব্যবসায়িক প্রোফাইলের অনলাইন সুনাম গড়ে তোলার দায়িত্ব সফলভাবে সম্পন্ন করা হয়েছে, যার ফলে ক্লায়েন্ট থেকে ৫.০ রেটিংসহ সন্তোষজনক ফিডব্যাক পাওয়া গেছে (\"Great service. Highly recommend.\")। নেতিবাচক রিভিউ ব্যবস্থাপনা, পজিটিভ কাস্টমার ফিডব্যাক সংগ্রহ এবং প্রোফাইল অপটিমাইজেশনের মাধ্যমে ব্র্যান্ডের বিশ্বাসযোগ্যতা ও অনলাইন উপস্থিতি শক্তিশালী করা হয়েছে।"
  },
  {
    title: "Google Reviews Boost Campaign",
    image: "images/google-ads-2.jpg",
    description: "গুগল রিভিউ গ্রোথ ক্যাম্পেইন — জুন থেকে আগস্ট, ২০২৪ পর্যন্ত একটানা একটি ব্যবসার গুগল রেপুটেশন উন্নয়নে কাজ করা হয়েছে। কাস্টমারদের কাছ থেকে অথেন্টিক রিভিউ সংগ্রহ, রেসপন্স ম্যানেজমেন্ট এবং লোকাল সার্চ ভিজিবিলিটি বৃদ্ধির মাধ্যমে ব্যবসাটিকে গুগল সার্চ ও ম্যাপে আরও বেশি বিশ্বাসযোগ্য ও দৃশ্যমান করে তোলা হয়েছে — দীর্ঘমেয়াদী ক্লায়েন্ট সম্পর্কের একটি সফল উদাহরণ।"
  },
  {
    title: "Notice Badge",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
    description: "ইন্টারেক্টিভ বিজ্ঞপ্তি উইজেট — যেকোনো ওয়েবসাইটে সহজে বসানো যায় এমন একটি হালকা, কাস্টমাইজেবল নোটিফিকেশন কম্পোনেন্ট, CSS অ্যানিমেশন ও ভ্যানিলা জাভাস্ক্রিপ্ট দিয়ে তৈরি।"
  },
  {
    title: "YouTube Channel Management",
    image: "images/youtube-ai-sagor-khan.jpg",
    description: "ইউটিউব চ্যানেল ম্যানেজমেন্ট — \"ai Sagor Khan\" চ্যানেলটি একদম শুরু থেকে গড়ে তুলে ৫,০০০+ সাবস্ক্রাইবার ও ৬৯টি ভিডিওর একটি সক্রিয় কমিউনিটিতে পরিণত করা হয়েছে। চ্যানেল ব্র্যান্ডিং, আকর্ষণীয় থাম্বনেইল ডিজাইন, শর্টস কনটেন্ট প্ল্যানিং, SEO-বান্ধব টাইটেল-ট্যাগ অপটিমাইজেশন এবং নিয়মিত আপলোড শিডিউল বজায় রেখে দর্শক সংখ্যা ও এনগেজমেন্ট ধারাবাহিকভাবে বৃদ্ধি করা হয়েছে।"
  },
  {
    title: "Landing Page",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=1200&auto=format&fit=crop",
    description: "হাই-কনভার্শন ল্যান্ডিং পেজ — পরিষ্কার লেআউট, দ্রুত লোড টাইম এবং স্পষ্ট কল-টু-অ্যাকশন নিয়ে ডিজাইন করা একটি ল্যান্ডিং পেজ যা ভিজিটরকে কাস্টমারে রূপান্তরে সাহায্য করে।"
  },
  {
    title: "Gaming Channel Growth",
    image: "images/youtube-s1-esports.jpg",
    description: "গেমিং কমিউনিটি চ্যানেল ম্যানেজমেন্ট — \"S1 Esports\" চ্যানেলের সম্পূর্ণ পরিচালনার দায়িত্ব নিয়ে ৮৬০+ সাবস্ক্রাইবার ও ৩৫টি ভিডিও নিয়ে একটি প্রাণবন্ত গেমিং কমিউনিটি গড়ে তোলা হয়েছে। চ্যানেল আর্ট ও লোগো ডিজাইন, কনটেন্ট স্ট্র্যাটেজি প্ল্যানিং এবং পারফরম্যান্স অ্যানালিটিক্স ট্র্যাকিং করে প্রতিটি আপলোডে ভিউ ও সাবস্ক্রাইবার গ্রোথ কার্ভ ধারাবাহিকভাবে ঊর্ধ্বমুখী রাখা হয়েছে।"
  }
  // চাইলে এখানে আরো আইটেম যোগ/বাদ দেওয়া যাবে — নিচের বক্সগুলো সংখ্যা অনুযায়ী নিজে থেকেই সাজিয়ে নেবে
];

function initShowcase() {
  const stage = document.getElementById("asShowcaseStage");
  if (!stage) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- build the lightbox (once) ----
  const lightbox = document.createElement("div");
  lightbox.className = "as-lightbox";
  lightbox.id = "asLightbox";
  lightbox.innerHTML = `
    <div class="as-lightbox-backdrop"></div>
    <div class="as-lightbox-panel">
      <button type="button" class="as-lightbox-close" aria-label="বন্ধ করুন"><i class="fa-solid fa-xmark"></i></button>
      <div class="as-lightbox-media"><img id="asLightboxImg" src="" alt=""></div>
      <h3 id="asLightboxTitle"></h3>
      <p id="asLightboxDesc"></p>
    </div>`;
  document.body.appendChild(lightbox);

  const lbImg = lightbox.querySelector("#asLightboxImg");
  const lbTitle = lightbox.querySelector("#asLightboxTitle");
  const lbDesc = lightbox.querySelector("#asLightboxDesc");

  function openLightbox(proj) {
    lbImg.src = proj.image;
    lbImg.alt = proj.title;
    lbTitle.textContent = proj.title;
    lbDesc.textContent = proj.description;
    lightbox.classList.add("is-open");
  }
  function closeLightbox() {
    lightbox.classList.remove("is-open");
  }
  lightbox.querySelector(".as-lightbox-close").addEventListener("click", closeLightbox);
  lightbox.querySelector(".as-lightbox-backdrop").addEventListener("click", closeLightbox);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeLightbox();
  });

  // ---- build the floating boxes ----
  const items = PROJECTS.map(proj => {
    const el = document.createElement("div");
    el.className = "as-glass-box";
    el.innerHTML = `
      <div class="as-glass-box__media"><img src="${proj.image}" alt="${proj.title}" loading="lazy"></div>
      <h4>${proj.title}</h4>`;
    el.addEventListener("click", () => openLightbox(proj));
    stage.appendChild(el);
    return el;
  });

  // (re)compute travel bounds and give each box a starting
  // position + a random direction/speed the first time round
  function layout() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    items.forEach(el => {
      const bw = el.offsetWidth;
      const bh = el.offsetHeight;
      el._bounds = { w: Math.max(w - bw, 10), h: Math.max(h - bh, 10) };
      if (el._x === undefined) {
        el._x = Math.random() * el._bounds.w;
        el._y = Math.random() * el._bounds.h;
        const speed = 0.3 + Math.random() * 0.35;
        const angle = Math.random() * Math.PI * 2;
        el._vx = Math.cos(angle) * speed;
        el._vy = Math.sin(angle) * speed;
      } else {
        el._x = Math.min(el._x, el._bounds.w);
        el._y = Math.min(el._y, el._bounds.h);
      }
      el.style.transform = `translate3d(${el._x}px, ${el._y}px, 0)`;
    });
  }
  layout();
  window.addEventListener("resize", layout);

  if (reduceMotion) return;

  // pause a box's drift while it's being hovered, or while the
  // lightbox is open, so nothing moves under the reader's cursor
  const paused = new Set();
  items.forEach(el => {
    el.addEventListener("mouseenter", () => paused.add(el));
    el.addEventListener("mouseleave", () => paused.delete(el));
  });

  function tick() {
    const lightboxOpen = lightbox.classList.contains("is-open");
    items.forEach(el => {
      if (paused.has(el) || lightboxOpen) return;
      const b = el._bounds;
      el._x += el._vx;
      el._y += el._vy;
      if (el._x <= 0) { el._x = 0; el._vx *= -1; }
      if (el._x >= b.w) { el._x = b.w; el._vx *= -1; }
      if (el._y <= 0) { el._y = 0; el._vy *= -1; }
      if (el._y >= b.h) { el._y = b.h; el._vy *= -1; }
      el.style.transform = `translate3d(${el._x}px, ${el._y}px, 0)`;
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ---------------------------------------------------------
   6. Stats counters
--------------------------------------------------------- */
function initStats() {
  const nums = document.querySelectorAll(".as-stat-num");
  if (!nums.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  nums.forEach(n => io.observe(n));

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1400;
    const start = performance.now();
    function step(ts) {
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
}
