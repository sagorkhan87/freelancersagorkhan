/* =========================================================
   OLYMPIAD HUB — page logic
   Reads NOTICE_TEXTS / OLYMPIADS from js/olympiad-data.js
   (loaded before this file). You should not need to edit
   this file to add or change content — see olympiad-data.js.
   ========================================================= */

const STATUS_LABEL = { open: "উন্মুক্ত", closing: "শীঘ্রই বন্ধ হচ্ছে", closed: "সমাপ্ত" };

/* ---------------- realistic rotating 3D Earth ---------------- */
function initEarth(){
  var texture = document.getElementById("olyEarthTexture");
  var clouds  = document.getElementById("olyEarthClouds");
  var pin     = document.getElementById("olyBdPin");
  var stage   = document.getElementById("olyEarthStage");
  if(!texture || !clouds || !pin || !stage) return;

  var BD_LON = 90.4, BD_LAT = 23.8;   // Bangladesh's real coordinates
  var EARTH_PERIOD = 18000;           // ms per full rotation — brisk, smooth spin
  var CLOUD_PERIOD = 19000;           // clouds drift a bit faster (parallax)
  var reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var introDelay = reduceMotion ? 0 : 4300;
  var introDone = false;
  var start = null;

  setTimeout(function(){ introDone = true; }, introDelay);
  if(reduceMotion) pin.style.transition = "none";

  function earthPixelOffset(centerLon, stageW, imgW){
    var norm = ((centerLon % 360) + 360) % 360;
    var pixelCenter = (norm / 360) * imgW;
    return (stageW / 2) - pixelCenter;
  }

  function positionPin(centerLon, stageW){
    var diff = ((BD_LON - centerLon + 540) % 360) - 180; // normalize to -180..180
    var diffRad = diff * Math.PI / 180;
    var latRad = BD_LAT * Math.PI / 180;

    var x = Math.sin(diffRad) * Math.cos(latRad);
    var y = Math.sin(latRad);
    var depth = Math.cos(diffRad) * Math.cos(latRad);

    var R = stageW / 2;
    pin.style.left = (R + x * R * 0.92) + "px";
    pin.style.top  = (R - y * R * 0.92) + "px";

    var visible = Math.max(0, Math.min(1, (depth + 0.08) / 0.28));
    pin.style.opacity = introDone ? visible : 0;
  }

  function render(centerEarthLon, centerCloudLon){
    var stageW = stage.clientWidth || 1;
    var imgW = stageW * 2; // 2:1 texture inside a square stage
    texture.style.backgroundPositionX = earthPixelOffset(centerEarthLon, stageW, imgW) + "px";
    clouds.style.backgroundPositionX  = earthPixelOffset(centerCloudLon, stageW, imgW) + "px";
    positionPin(centerEarthLon, stageW);
  }

  if(reduceMotion){
    render(BD_LON, BD_LON);
    return;
  }

  function frame(ts){
    if(start === null) start = ts;
    var elapsed = ts - start;
    var earthLon = BD_LON + (elapsed / EARTH_PERIOD) * 360;
    var cloudLon = BD_LON + (elapsed / CLOUD_PERIOD) * 360;
    render(earthLon, cloudLon);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ---------------- ambient hero particles ---------------- */
function buildParticles(){
  const host = document.getElementById("olyParticles");
  if(!host) return;
  const count = window.innerWidth < 640 ? 12 : 22;
  for(let i = 0; i < count; i++){
    const p = document.createElement("span");
    p.className = "oly-particle";
    p.style.left = Math.random() * 100 + "%";
    p.style.top = 40 + Math.random() * 55 + "%";
    p.style.animationDuration = (6 + Math.random() * 8) + "s";
    p.style.animationDelay = (Math.random() * 8) + "s";
    host.appendChild(p);
  }
}

/* ---------------- sliding notice bar ---------------- */
function buildNotice(){
  const track = document.getElementById("olyNoticeTrack");
  if(!track || typeof NOTICE_TEXTS === "undefined") return;
  // duplicate the sequence so the loop is seamless
  const sequence = NOTICE_TEXTS.concat(NOTICE_TEXTS);
  track.innerHTML = sequence.map(t =>
    '<span class="oly-notice-item"><span class="oly-notice-dot"></span>' + escapeHtml(t) + "</span>"
  ).join("");
}

function escapeHtml(str){
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

/* ---------------- Olympiad cards ---------------- */
function cardTemplate(item, index){
  const status = item.status in STATUS_LABEL ? item.status : "open";
  const closed = status === "closed";
  const hasUrl = !!item.url;

  return (
    '<article class="oly-card" data-index="' + index + '" data-url="' + escapeHtml(item.url || "") + '"' +
      (hasUrl && !closed ? ' tabindex="0" role="link" aria-label="' + escapeHtml(item.title) + ' — নতুন ট্যাবে খুলুন"' : "") +
    ">" +
      '<div class="oly-card-media">' +
        '<span class="oly-status" data-status="' + status + '">' + STATUS_LABEL[status] + "</span>" +
        '<span class="oly-category">' + escapeHtml(item.category) + "</span>" +
        '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
        '<h3 class="oly-card-title">' + escapeHtml(item.title) + "</h3>" +
      "</div>" +
      '<div class="oly-card-body">' +
        '<p class="oly-card-desc">' + escapeHtml(item.description) + "</p>" +
        '<div class="oly-meta">' +
          '<div class="oly-meta-item"><span class="oly-meta-label">ইভেন্ট তারিখ</span><span class="oly-meta-value">' + escapeHtml(item.eventDate) + "</span></div>" +
          '<div class="oly-meta-item"><span class="oly-meta-label">রেজিস্ট্রেশন ডেডলাইন</span><span class="oly-meta-value">' + escapeHtml(item.deadline) + "</span></div>" +
          '<div class="oly-meta-item"><span class="oly-meta-label">আয়োজক</span><span class="oly-meta-value">' + escapeHtml(item.organizer) + "</span></div>" +
        "</div>" +
        '<div class="oly-card-actions">' +
          '<button type="button" class="oly-btn oly-btn-gold"' + (closed ? " disabled" : "") + ">" +
            (closed ? "রেজিস্ট্রেশন বন্ধ" : "বিস্তারিত ও রেজিস্ট্রেশন") +
          "</button>" +
        "</div>" +
      "</div>" +
    "</article>"
  );
}

function renderCards(){
  const host = document.getElementById("olyCards");
  if(!host || typeof OLYMPIADS === "undefined") return;
  host.innerHTML = OLYMPIADS.map(cardTemplate).join("");

  host.querySelectorAll(".oly-card").forEach(card => {
    const url = card.getAttribute("data-url");
    if(!url) return;

    const open = () => window.open(url, "_blank", "noopener");

    card.addEventListener("click", (e) => {
      if(e.target.closest("[disabled]")) return;
      open();
    });

    // keyboard access for focusable cards (Enter / Space)
    card.addEventListener("keydown", (e) => {
      if(e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      open();
    });
  });

  if("IntersectionObserver" in window){
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add("oly-in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .15, rootMargin: "0px 0px -60px 0px" });
    host.querySelectorAll(".oly-card").forEach(c => io.observe(c));
  } else {
    host.querySelectorAll(".oly-card").forEach(c => c.classList.add("oly-in-view"));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initEarth();
  buildParticles();
  buildNotice();
  renderCards();
});
