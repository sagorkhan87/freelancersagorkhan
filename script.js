/* =========================================================
   Freelancer Sagor Khan — Portfolio Script
   Photo/certificate data lives in data.js (loaded before this file)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initMobileMenu();
  initScrollSpy();
  initNoticeBar();
  initRoomLinks();

  buildSlider({
    data: slidesData,
    roomPrefix: "award",
    trackId: "sliderTrack",
    dotsId: "sliderDots",
    prevId: "prevArrow",
    nextId: "nextArrow",
    icon: "fa-trophy"
  });

  buildSlider({
    data: certData,
    roomPrefix: "cert",
    trackId: "certTrack",
    dotsId: "certDots",
    prevId: "certPrevArrow",
    nextId: "certNextArrow",
    icon: "fa-certificate"
  });

  buildSlider({
    data: (typeof videosData !== "undefined") ? videosData : [],
    roomPrefix: "video",
    trackId: "videoTrack",
    dotsId: "videoDots",
    prevId: "videoPrevArrow",
    nextId: "videoNextArrow",
    icon: "fa-clapperboard",
    kind: "video"
  });

  initScrollReveal();
  initScrollTop();
  initParticles();
  initMoneyEffects();
});

/* ===================== Navbar shrink on scroll ===================== */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    if (window.scrollY > 40) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ===================== Mobile menu toggle ===================== */
function initMobileMenu() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    menu.classList.toggle("open");
    toggle.classList.toggle("active");
  });

  menu.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.classList.remove("active");
    });
  });
}

/* ===================== Active link underline on scroll ===================== */
function initScrollSpy() {
  const links = document.querySelectorAll(".nav-link");
  if (!links.length) return;
  const sections = Array.from(links)
    .map(link => document.getElementById(link.dataset.section))
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach(link => {
      link.classList.toggle("active", link.dataset.section === id);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: "-40% 0px -50% 0px", threshold: 0 });

  sections.forEach(section => observer.observe(section));
}

/* ===================== Sliding notice bar ===================== */
function initNoticeBar() {
  const track = document.getElementById("noticeTrack");
  if (!track || typeof noticeText === "undefined") return;

  // Repeat the text so the marquee loop has no visible seam
  track.innerHTML = `<span>${noticeText}</span><span>${noticeText}</span>`;
}

/* ===================== Card buttons -> article rooms ===================== */
function initRoomLinks() {
  document.querySelectorAll("[data-room]").forEach(el => {
    el.addEventListener("click", (e) => {
      const room = el.dataset.room;
      if (!room) return;
      e.preventDefault();
      window.location.href = `room.html?room=${encodeURIComponent(room)}`;
    });
  });
}

/* ===================== Shared-element transition stash =====================
   Saves the clicked photo's on-screen position + src just before navigating
   to room.html, so the details page (room.js) can animate a smooth zoom
   from this exact spot — the same "shared element" technique already used
   by the About / Skills / Awards gallery pages.
================================================================================ */
function stashRoomTransition(imgEl, id) {
  const rect = imgEl.getBoundingClientRect();
  try {
    sessionStorage.setItem("roomTransition", JSON.stringify({
      id,
      src: imgEl.currentSrc || imgEl.src,
      rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
    }));
  } catch (e) { /* sessionStorage unavailable — animation just won't play */ }
}

/* ===================== Reusable slider builder =====================
   Used for both the "Award Winning Photos" slider and the
   "Certificate Collection" slider. Clicking the CENTER slide opens
   that item's article room (room.html); clicking a side slide just
   brings it to the center like before.
======================================================================= */
function buildSlider({ data, roomPrefix, trackId, dotsId, prevId, nextId, icon, kind = "image" }) {
  const track = document.getElementById(trackId);
  const dotsWrap = document.getElementById(dotsId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);

  if (!track || !data || data.length === 0) return;

  const isVideo = kind === "video";
  const ctaLabel = isVideo
    ? `<i class="fa-solid fa-circle-play"></i> Watch Video`
    : `<i class="fa-solid fa-arrow-up-right-from-square"></i> View Details`;

  let current = 0;
  let autoTimer;

  const slideEls = data.map((slide, i) => {
    const el = document.createElement("div");
    el.className = "slide";
    el.dataset.index = i;
    // Videos store their still frame in "thumb"; photos/certs store it in "img".
    const thumbSrc = isVideo ? slide.thumb : slide.img;
    el.innerHTML = `
      <img src="${thumbSrc}" alt="${slide.title}" loading="lazy">
      ${isVideo ? `<span class="slide__playbtn"><i class="fa-solid fa-circle-play"></i></span>` : ""}
      <span class="slide__cta">${ctaLabel}</span>
      <div class="slide__overlay">
        <i class="fa-solid ${icon}"></i>
        <div>
          <h4>${slide.title}</h4>
          <p>${slide.subtitle}</p>
        </div>
      </div>
    `;
    track.appendChild(el);
    return el;
  });

  const dotEls = data.map((_, i) => {
    const dot = document.createElement("button");
    dot.className = "dot-btn";
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
    return dot;
  });

  function render() {
    const total = slideEls.length;
    slideEls.forEach((el, i) => {
      let diff = i - current;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;

      if (diff === 0) el.dataset.pos = "center";
      else if (diff === -1 || diff === total - 1) el.dataset.pos = "left";
      else if (diff === 1 || diff === -(total - 1)) el.dataset.pos = "right";
      else el.dataset.pos = "hidden";
    });

    dotEls.forEach((dot, i) => dot.classList.toggle("active", i === current));
  }

  function goTo(index) {
    const total = slideEls.length;
    current = (index + total) % total;
    render();
    restartAuto();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function restartAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 5000);
  }

  function openRoom(index) {
    const slideEl = slideEls[index];
    const imgEl = slideEl ? slideEl.querySelector("img") : null;
    if (imgEl) stashRoomTransition(imgEl, `${roomPrefix}-${index}`);
    window.location.href = `room.html?room=${roomPrefix}-${index}`;
  }

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  track.addEventListener("click", (e) => {
    const slideEl = e.target.closest(".slide");
    if (!slideEl) return;
    const pos = slideEl.dataset.pos;
    const idx = Number(slideEl.dataset.index);
    if (pos === "left") { prev(); return; }
    if (pos === "right") { next(); return; }
    if (pos === "center") { openRoom(idx); }
  });

  // Swipe support
  let touchStartX = 0;
  track.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (diff > 50) prev();
    else if (diff < -50) next();
  });

  // Keyboard support (only when this slider is in view)
  document.addEventListener("keydown", (e) => {
    const rect = track.getBoundingClientRect();
    const sliderVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (!sliderVisible) return;
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });

  render();
  restartAuto();
}

/* ===================== Fade-in reveal on scroll ===================== */
function initScrollReveal() {
  const targets = document.querySelectorAll("[data-aos]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(t => observer.observe(t));
}

/* ===================== Scroll-to-top button ===================== */
function initScrollTop() {
  const btn = document.getElementById("scrollTop");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ===================== Ambient particle background ===================== */
function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [];
  let width, height;

  const colors = ["rgba(255,193,7,0.6)", "rgba(41,182,255,0.6)"];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.min(70, Math.floor((width * height) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  resize();
  createParticles();
  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });

  if (!prefersReducedMotion) {
    tick();
  }
}

/* ===================== Cursor "SKS" label =====================
   A single canvas overlay draws a fixed pink "SKS" label that sticks
   exactly to the mouse (or finger, on touch) position — no fading,
   no drifting, just follows the cursor 1:1.
   Respects prefers-reduced-motion (the effect is skipped entirely).
=================================================================== */
function initMoneyEffects() {
  const canvas = document.getElementById("moneyCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  let width, height;
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const TEXT = "SKS";
  const COLOR = "#ff4fa3"; // pink
  const OFFSET_X = 18;
  const OFFSET_Y = -18;

  let pointerX = null;
  let pointerY = null;
  let visible = false;

  window.addEventListener("mousemove", (e) => {
    pointerX = e.clientX;
    pointerY = e.clientY;
    visible = true;
  });

  window.addEventListener("mouseleave", () => {
    visible = false;
  });

  window.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    if (t) {
      pointerX = t.clientX;
      pointerY = t.clientY;
      visible = true;
    }
  }, { passive: true });

  window.addEventListener("touchend", () => {
    visible = false;
  });

  function tick() {
    ctx.clearRect(0, 0, width, height);

    if (visible && pointerX !== null && pointerY !== null) {
      ctx.save();
      ctx.font = `700 18px Poppins, sans-serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = COLOR;
      ctx.shadowColor = COLOR;
      ctx.shadowBlur = 8;
      ctx.fillText(TEXT, pointerX + OFFSET_X, pointerY + OFFSET_Y);
      ctx.restore();
    }

    requestAnimationFrame(tick);
  }

  tick();
}
