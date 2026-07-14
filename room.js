/* =========================================================
   Article Room logic
   Data (slidesData, certData, roomMeta, getRoomInfo) comes
   from data.js, loaded before this file.
   Articles are saved in the browser's localStorage, scoped
   per room, so each card / slide keeps its own collection.
   ========================================================= */

let currentRoomId = "about";
let storageKey = "articles_about";
let pendingImages = []; // data URLs staged for the article being composed
let editingId = null;

document.addEventListener("DOMContentLoaded", () => {
  currentRoomId = getRoomIdFromURL();
  storageKey = `articles_${currentRoomId}`;
  document.body.classList.add(`room-page--${currentRoomId}`);

  initNoticeBar();
  initParticles();
  initMoneyEffects();
  initScrollTop();
  renderRoomHeader();

  // roomPageContent (from roomContent.js) only has entries for the
  // 3 redesigned pages: about / skills / awards.
  const galleryData = (typeof roomPageContent !== "undefined") ? roomPageContent[currentRoomId] : null;

  // award-0, cert-2, video-1, etc. — a single slide/certificate/video opened
  // from its homepage slider. These get the same smooth zoom + detail-page
  // treatment as About / Skills / Awards, instead of the old composer.
  const singleItemMatch = /^(award|cert|video)-(\d+)$/.exec(currentRoomId);

  if (galleryData) {
    document.getElementById("legacyRoot").hidden = true;
    document.getElementById("galleryRoot").hidden = false;
    initGalleryPage(galleryData);
  } else if (singleItemMatch) {
    document.getElementById("legacyRoot").hidden = true;
    document.getElementById("galleryRoot").hidden = false;
    renderSingleItemDetail(singleItemMatch[1], parseInt(singleItemMatch[2], 10));
  } else {
    // Any other room id (contact, etc.) keeps the original article composer.
    initImagePicker();
    initForm();
    initLightbox();
    renderArticles();
  }
});

/* =========================================================
   NEW: Gallery overview + Details pages
   (About Me / My Skills / My Awards)
   ========================================================= */

function initGalleryPage(data) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const card = id ? data.cards.find(c => c.id === id) : null;

  if (card) {
    renderDetailView(data, card);
  } else {
    renderOverview(data);
  }
}

/* ---- Overview: 4 top photos + 2 rows of 4 cards ---- */
function renderOverview(data) {
  const root = document.getElementById("galleryRoot");
  const info = getRoomInfo(currentRoomId);

  root.innerHTML = `


    <div class="gallery-top-wrap">
      <div class="gallery-top">
        ${[...data.topImages, ...data.topImages].map(item => `
          <div class="gallery-top__item">
            <img src="${item.img}" alt="${escapeHTML(item.alt || info.title)}" loading="lazy">
            <span class="gallery-top__glass"></span>
            <span class="gallery-top__sheen"></span>
          </div>
        `).join("")}
      </div>
    </div>

    ${currentRoomId === "skills" ? "" : `
    <h2 class="gallery-row-label">Stories</h2>
    <div class="gallery-grid" id="galleryRow1"></div>
    ${data.cards.length > 4 ? `<div class="gallery-grid" id="galleryRow2"></div>` : ""}
    `}
  `;

  if (currentRoomId !== "skills") {
    fillCardRow(document.getElementById("galleryRow1"), data.cards.slice(0, 4));
    if (data.cards.length > 4) {
      fillCardRow(document.getElementById("galleryRow2"), data.cards.slice(4, 8));
    }
  }
}

function fillCardRow(container, cards) {
  if (!container) return;

  container.innerHTML = cards.map(card => `
    <button type="button" class="gallery-card" data-id="${card.id}">
      <span class="gallery-card__photo"><img src="${card.img}" alt="${escapeHTML(card.title)}" loading="lazy"></span>
      <span class="gallery-card__body">
        <h3>${escapeHTML(card.title)}</h3>
        <p>${escapeHTML(card.excerpt || "")}</p>
        <span class="gallery-card__cta"><i class="fa-solid fa-arrow-right"></i> Read full story</span>
      </span>
    </button>
  `).join("");

  container.querySelectorAll(".gallery-card").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = cards.find(c => c.id === btn.dataset.id);
      const imgEl = btn.querySelector("img");
      if (card && imgEl) openDetail(card, imgEl);
    });
  });
}

/* ---- Stash the clicked photo's position + navigate to the details page ---- */
function openDetail(card, imgEl) {
  const rect = imgEl.getBoundingClientRect();
  try {
    sessionStorage.setItem("roomTransition", JSON.stringify({
      id: card.id,
      room: currentRoomId,
      src: imgEl.currentSrc || imgEl.src,
      rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
    }));
  } catch (e) { /* sessionStorage unavailable — animation just won't play */ }

  window.location.href = `room.html?room=${encodeURIComponent(currentRoomId)}&id=${encodeURIComponent(card.id)}`;
}

/* ---- Details page: big hero photo + full write-up ---- */
function renderDetailView(data, card) {
  const root = document.getElementById("galleryRoot");
  const info = getRoomInfo(currentRoomId);
  document.title = `${card.title} — ${info.title} | Freelancer Sagor Khan`;

  const paragraphs = (card.detail || "")
    .split(/\n\s*\n/)
    .map(p => `<p>${escapeHTML(p)}</p>`)
    .join("");

  root.innerHTML = `
    <a href="room.html?room=${encodeURIComponent(currentRoomId)}" class="detail-back">
      <i class="fa-solid fa-arrow-left"></i> Back to ${escapeHTML(info.title)}
    </a>

    <div class="detail-hero">
      <img id="detailHeroImg" src="${card.img}" alt="${escapeHTML(card.title)}">
      <div class="detail-hero__caption">
        <h1>${escapeHTML(card.title)}</h1>
        ${card.excerpt ? `<p>${escapeHTML(card.excerpt)}</p>` : ""}
      </div>
    </div>

    <div class="detail-body">${paragraphs}</div>
  `;

  playDetailEntryTransition(card);
}

/* ---- Smooth "shared element" zoom from the gallery card into the hero image ----
   No image-generation or experimental browser API involved: we simply clone the
   clicked photo at its old on-screen position/size (saved in sessionStorage just
   before navigating) and animate that clone to the new hero photo's position/size,
   then swap it out for the real hero image once the animation finishes. */
function playDetailEntryTransition(card) {
  let stored = null;
  try { stored = JSON.parse(sessionStorage.getItem("roomTransition") || "null"); } catch (e) { /* ignore */ }
  sessionStorage.removeItem("roomTransition");

  const heroImg = document.getElementById("detailHeroImg");
  if (!stored || !heroImg || stored.id !== card.id) return; // direct link / refresh / back-nav — skip animation

  const clone = document.createElement("img");
  clone.src = stored.src;
  clone.className = "transition-clone";
  clone.style.top = stored.rect.top + "px";
  clone.style.left = stored.rect.left + "px";
  clone.style.width = stored.rect.width + "px";
  clone.style.height = stored.rect.height + "px";
  clone.style.borderRadius = "16px";
  document.body.appendChild(clone);

  heroImg.style.opacity = "0";

  // Wait a frame so the details page has finished laying out before we
  // read the hero's final position and start the transition toward it.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const heroRect = heroImg.getBoundingClientRect();
      clone.style.transition =
        "top .65s cubic-bezier(.22,.9,.32,1), left .65s cubic-bezier(.22,.9,.32,1), " +
        "width .65s cubic-bezier(.22,.9,.32,1), height .65s cubic-bezier(.22,.9,.32,1), " +
        "border-radius .65s ease";
      clone.style.top = heroRect.top + "px";
      clone.style.left = heroRect.left + "px";
      clone.style.width = heroRect.width + "px";
      clone.style.height = heroRect.height + "px";
      clone.style.borderRadius = "0px";
    });
  });

  clone.addEventListener("transitionend", () => {
    heroImg.style.opacity = "1";
    clone.remove();
  }, { once: true });
}

/* =========================================================
   NEW: Single-item detail page
   Used when opening ONE award photo / ONE certificate / ONE
   video from its homepage slider (e.g. award-0, cert-2,
   video-1). Reuses the same detail-page look, meta pills and
   shared-element zoom animation as the About/Skills/Awards
   gallery cards above.
   ========================================================= */
function renderSingleItemDetail(type, idx) {
  const sourceByType = {
    award: (typeof slidesData !== "undefined") ? slidesData : [],
    cert: (typeof certData !== "undefined") ? certData : [],
    video: (typeof videosData !== "undefined") ? videosData : []
  };
  const labelByType = {
    award: { back: "Back to Award Winning Photos", anchor: "awards" },
    cert: { back: "Back to Certificate Collection", anchor: "awards" },
    video: { back: "Back to Memorable Videos", anchor: "videos" }
  };

  const list = sourceByType[type] || [];
  const item = list[idx];
  const root = document.getElementById("galleryRoot");
  const label = labelByType[type] || { back: "Back to Portfolio", anchor: "home" };

  if (!item) {
    root.innerHTML = `
      <a href="index.html" class="detail-back"><i class="fa-solid fa-arrow-left"></i> Back to Portfolio</a>
      <p class="empty-state">Sorry, that item couldn't be found.</p>
    `;
    return;
  }

  document.title = `${item.title} | Freelancer Sagor Khan`;

  const metaPills = [];
  const categoryText = item.category || item.subtitle;
  if (categoryText) metaPills.push(`<span class="detail-meta__pill"><i class="fa-solid fa-tag"></i> ${escapeHTML(categoryText)}</span>`);
  if (item.date) metaPills.push(`<span class="detail-meta__pill"><i class="fa-solid fa-calendar-days"></i> ${escapeHTML(item.date)}</span>`);
  const metaHTML = metaPills.length ? `<div class="detail-meta">${metaPills.join("")}</div>` : "";

  const bodyText = item.description || item.subtitle || "";
  const paragraphs = bodyText
    .split(/\n\s*\n/)
    .map(p => `<p>${escapeHTML(p)}</p>`)
    .join("") || "<p>More details coming soon.</p>";

  if (type === "video") {
    root.innerHTML = `
      <a href="index.html#${label.anchor}" class="detail-back"><i class="fa-solid fa-arrow-left"></i> ${label.back}</a>

      <div class="detail-hero detail-hero--video">
        ${buildVideoPlayerHTML(item)}
      </div>

      <div class="detail-title-block">
        <h1>${escapeHTML(item.title)}</h1>
        ${metaHTML}
      </div>

      <div class="detail-body">${paragraphs}</div>
    `;
  } else {
    root.innerHTML = `
      <a href="index.html#${label.anchor}" class="detail-back"><i class="fa-solid fa-arrow-left"></i> ${label.back}</a>

      <div class="detail-hero">
        <img id="detailHeroImg" src="${item.img}" alt="${escapeHTML(item.title)}">
        <div class="detail-hero__caption">
          <h1>${escapeHTML(item.title)}</h1>
          ${item.subtitle ? `<p>${escapeHTML(item.subtitle)}</p>` : ""}
        </div>
      </div>

      ${metaHTML}

      <div class="detail-body">${paragraphs}</div>
    `;
  }

  playSingleItemTransition(`${type}-${idx}`);
}

/* ---- Builds a big video player: a YouTube embed if "youtube" is set,
   otherwise an HTML5 <video> using the "video" file path. ---- */
function buildVideoPlayerHTML(item) {
  if (item.youtube) {
    return `<iframe
      src="https://www.youtube.com/embed/${encodeURIComponent(item.youtube)}"
      title="${escapeHTML(item.title)}"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen></iframe>`;
  }
  if (item.video) {
    return `<video controls preload="metadata" poster="${item.thumb || ""}">
      <source src="${item.video}" type="video/mp4">
      Your browser doesn't support embedded video playback.
    </video>`;
  }
  return `<div class="detail-hero__missing"><i class="fa-solid fa-video-slash"></i> Video not available yet.</div>`;
}

/* ---- Same shared-element zoom used by playDetailEntryTransition, but
   generalized to work with either an <img>, <video> or <iframe> hero. ---- */
function playSingleItemTransition(expectedId) {
  let stored = null;
  try { stored = JSON.parse(sessionStorage.getItem("roomTransition") || "null"); } catch (e) { /* ignore */ }
  sessionStorage.removeItem("roomTransition");

  const heroWrap = document.querySelector(".detail-hero");
  const heroMedia = heroWrap ? heroWrap.querySelector("img, video, iframe") : null;
  if (!stored || !heroWrap || !heroMedia || stored.id !== expectedId) return; // direct link / refresh — skip animation

  const clone = document.createElement("img");
  clone.src = stored.src;
  clone.className = "transition-clone";
  clone.style.top = stored.rect.top + "px";
  clone.style.left = stored.rect.left + "px";
  clone.style.width = stored.rect.width + "px";
  clone.style.height = stored.rect.height + "px";
  clone.style.borderRadius = "16px";
  document.body.appendChild(clone);

  heroMedia.style.opacity = "0";

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const heroRect = heroWrap.getBoundingClientRect();
      clone.style.transition =
        "top .65s cubic-bezier(.22,.9,.32,1), left .65s cubic-bezier(.22,.9,.32,1), " +
        "width .65s cubic-bezier(.22,.9,.32,1), height .65s cubic-bezier(.22,.9,.32,1), " +
        "border-radius .65s ease";
      clone.style.top = heroRect.top + "px";
      clone.style.left = heroRect.left + "px";
      clone.style.width = heroRect.width + "px";
      clone.style.height = heroRect.height + "px";
      clone.style.borderRadius = "0px";
    });
  });

  clone.addEventListener("transitionend", () => {
    heroMedia.style.opacity = "1";
    clone.remove();
  }, { once: true });
}

function getRoomIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("room") || "about";
}

/* ===================== Header ===================== */
function renderRoomHeader() {
  const info = (typeof getRoomInfo === "function") ? getRoomInfo(currentRoomId) : null;
  const icon = document.getElementById("roomIcon");
  const title = document.getElementById("roomTitle");
  const subtitle = document.getElementById("roomSubtitle");
  const composerLabel = document.getElementById("composerLabel");

  const data = info || { title: "Articles", subtitle: "Publish your story here", icon: "fa-newspaper" };

  if (currentRoomId === "about") {
    icon.innerHTML = `<img src="award pic/Sagor1.jpg" alt="${data.title}" class="room-header__photo">`;
  } else {
    icon.innerHTML = `<i class="fa-solid ${data.icon}"></i>`;
  }
  title.textContent = data.title;
  subtitle.textContent = data.subtitle;
  composerLabel.textContent = `Write a new article for "${data.title}"`;
  document.title = `${data.title} — Article Room | Freelancer Sagor Khan`;
}

/* ===================== Notice bar (shared) ===================== */
function initNoticeBar() {
  const track = document.getElementById("noticeTrack");
  if (!track || typeof noticeText === "undefined") return;
  track.innerHTML = `<span>${noticeText}</span><span>${noticeText}</span>`;
}

/* ===================== Storage helpers ===================== */
function loadArticles() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch (e) {
    return [];
  }
}

function saveArticles(articles) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(articles));
    return true;
  } catch (e) {
    alert("Could not save — your browser storage may be full. Try using fewer or smaller photos.");
    return false;
  }
}

/* ===================== Image picker (staged previews) ===================== */
function initImagePicker() {
  const input = document.getElementById("articleImages");
  const preview = document.getElementById("imagePreview");

  input.addEventListener("change", () => {
    const files = Array.from(input.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        pendingImages.push(e.target.result);
        renderPreview();
      };
      reader.readAsDataURL(file);
    });
    input.value = "";
  });

  function renderPreview() {
    preview.innerHTML = "";
    pendingImages.forEach((src, i) => {
      const item = document.createElement("div");
      item.className = "image-preview__item";
      item.innerHTML = `<img src="${src}" alt="Preview ${i + 1}"><button type="button" class="image-preview__remove" data-i="${i}"><i class="fa-solid fa-xmark"></i></button>`;
      preview.appendChild(item);
    });
  }

  preview.addEventListener("click", (e) => {
    const btn = e.target.closest(".image-preview__remove");
    if (!btn) return;
    const i = Number(btn.dataset.i);
    pendingImages.splice(i, 1);
    renderPreview();
  });

  // Expose so form reset can clear thumbnails too
  window.__clearImagePreview = () => {
    pendingImages = [];
    preview.innerHTML = "";
  };
}

/* ===================== Composer form ===================== */
function initForm() {
  const form = document.getElementById("articleForm");
  const titleInput = document.getElementById("articleTitle");
  const contentInput = document.getElementById("articleContent");
  const submitBtn = document.getElementById("submitBtn");
  const cancelBtn = document.getElementById("cancelEditBtn");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    if (!title || !content) return;

    const articles = loadArticles();

    if (editingId) {
      const idx = articles.findIndex(a => a.id === editingId);
      if (idx !== -1) {
        articles[idx].title = title;
        articles[idx].content = content;
        if (pendingImages.length) articles[idx].images = pendingImages.slice();
      }
    } else {
      articles.unshift({
        id: `art_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        title,
        content,
        images: pendingImages.slice(),
        date: new Date().toISOString()
      });
    }

    if (saveArticles(articles)) {
      resetForm();
      renderArticles();
    }
  });

  cancelBtn.addEventListener("click", resetForm);

  function resetForm() {
    form.reset();
    window.__clearImagePreview();
    editingId = null;
    submitBtn.innerHTML = `<i class="fa-solid fa-upload"></i> Publish Article`;
    cancelBtn.hidden = true;
  }

  window.__startEdit = (article) => {
    titleInput.value = article.title;
    contentInput.value = article.content;
    pendingImages = article.images ? article.images.slice() : [];
    window.__clearImagePreview();
    pendingImages.forEach(src => {
      const preview = document.getElementById("imagePreview");
      const item = document.createElement("div");
      item.className = "image-preview__item";
      item.innerHTML = `<img src="${src}" alt="Preview"><button type="button" class="image-preview__remove"><i class="fa-solid fa-xmark"></i></button>`;
      preview.appendChild(item);
    });
    editingId = article.id;
    submitBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Save Changes`;
    cancelBtn.hidden = false;
    document.getElementById("composer").scrollIntoView({ behavior: "smooth", block: "start" });
  };
}

/* ===================== Render article gallery ===================== */
function renderArticles() {
  const list = document.getElementById("articleList");
  const empty = document.getElementById("emptyState");
  const articles = loadArticles();

  list.innerHTML = "";

  if (articles.length === 0) {
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  articles.forEach((article, position) => {
    const card = document.createElement("article");
    card.className = "article-card";

    const images = article.images || [];
    let galleryHTML = "";

    if (images.length === 1) {
      galleryHTML = `<div class="article-card__gallery article-card__gallery--single"><img src="${images[0]}" alt="${escapeHTML(article.title)}" data-i="0"></div>`;
    } else if (images.length === 2) {
      galleryHTML = `<div class="article-card__gallery article-card__gallery--two">${images.map((src, i) => `<img src="${src}" alt="${escapeHTML(article.title)}" data-i="${i}">`).join("")}</div>`;
    } else if (images.length === 3) {
      galleryHTML = `<div class="article-card__gallery article-card__gallery--three">${images.map((src, i) => `<img src="${src}" alt="${escapeHTML(article.title)}" data-i="${i}">`).join("")}</div>`;
    } else if (images.length >= 4) {
      const shown = images.slice(0, 4);
      const extra = images.length - 4;
      galleryHTML = `<div class="article-card__gallery">${shown.map((src, i) => {
        const isLast = i === 3 && extra > 0;
        return `<span class="${isLast ? "article-card__more" : ""}" ${isLast ? `data-more="+${extra}"` : ""}><img src="${src}" alt="${escapeHTML(article.title)}" data-i="${i}"></span>`;
      }).join("")}</div>`;
    }

    const dateStr = new Date(article.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    const serial = String(position + 1).padStart(2, "0");

    card.innerHTML = `
      ${galleryHTML}
      <div class="article-card__body">
        <div class="article-card__top">
          <span class="article-card__serial">${serial}</span>
          <div>
            <h3>${escapeHTML(article.title)}</h3>
            <span class="article-card__date">${dateStr} ${images.length ? `• ${images.length} photo${images.length > 1 ? "s" : ""}` : ""}</span>
          </div>
        </div>
        <p class="article-card__text">${escapeHTML(article.content)}</p>
        <div class="article-card__actions">
          <button class="icon-btn" data-action="edit" data-id="${article.id}" aria-label="Edit"><i class="fa-solid fa-pen"></i></button>
          <button class="icon-btn icon-btn--danger" data-action="delete" data-id="${article.id}" aria-label="Delete"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    `;

    list.appendChild(card);

    // Wire up this card's lightbox triggers (each photo knows its siblings)
    card.querySelectorAll(".article-card__gallery img").forEach(img => {
      img.addEventListener("click", () => openLightbox(images, Number(img.dataset.i)));
    });
  });

  // Wire up edit/delete
  list.querySelectorAll("[data-action='delete']").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!confirm("Delete this article? This cannot be undone.")) return;
      const articles = loadArticles().filter(a => a.id !== btn.dataset.id);
      saveArticles(articles);
      renderArticles();
    });
  });

  list.querySelectorAll("[data-action='edit']").forEach(btn => {
    btn.addEventListener("click", () => {
      const article = loadArticles().find(a => a.id === btn.dataset.id);
      if (article) window.__startEdit(article);
    });
  });
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ===================== Lightbox (with prev/next through an article's photos) ===================== */
let lightboxImages = [];
let lightboxIndex = 0;

function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", () => stepLightbox(-1));
  nextBtn.addEventListener("click", () => stepLightbox(1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });
}

function openLightbox(images, index) {
  lightboxImages = images;
  lightboxIndex = index;
  renderLightbox();
  document.getElementById("lightbox").classList.add("open");
}

function stepLightbox(dir) {
  if (!lightboxImages.length) return;
  lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
  renderLightbox();
}

function renderLightbox() {
  const img = document.getElementById("lightboxImg");
  const count = document.getElementById("lightboxCount");
  const nav = lightboxImages.length > 1;
  document.getElementById("lightboxPrev").style.display = nav ? "flex" : "none";
  document.getElementById("lightboxNext").style.display = nav ? "flex" : "none";
  img.src = lightboxImages[lightboxIndex];
  count.textContent = nav ? `${lightboxIndex + 1} / ${lightboxImages.length}` : "";
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
}

/* ===================== Scroll-to-top (shared) ===================== */
function initScrollTop() {
  const btn = document.getElementById("scrollTop");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ===================== Ambient particle background (shared) ===================== */
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
      x: Math.random() * width, y: Math.random() * height,
      r: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
  }
  function tick() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 6; ctx.shadowColor = p.color;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  resize(); createParticles();
  window.addEventListener("resize", () => { resize(); createParticles(); });
  if (!prefersReducedMotion) tick();
}

/* ===================== Falling money + cursor scatter (shared) ===================== */
function initMoneyEffects() {
  const canvas = document.getElementById("moneyCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  let width, height;
  function resize() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener("resize", resize);

  const rainDrops = [];
  const burstDrops = [];
  const glyphs = ["$", "৳"];
  const goldTones = ["#FFC107", "#ffd35c", "#e0a800"];

  function makeRainDrop() {
    return {
      x: Math.random() * width, y: -20 - Math.random() * height,
      size: 14 + Math.random() * 14, speed: 0.6 + Math.random() * 1.2,
      drift: (Math.random() - 0.5) * 0.4, rotation: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
      color: goldTones[Math.floor(Math.random() * goldTones.length)],
      opacity: 0.25 + Math.random() * 0.35
    };
  }
  const RAIN_COUNT = Math.min(28, Math.floor(width / 55));
  for (let i = 0; i < RAIN_COUNT; i++) rainDrops.push(makeRainDrop());

  function spawnBurst(x, y, count = 6) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2.5;
      burstDrops.push({
        x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 1.2,
        gravity: 0.06, size: 12 + Math.random() * 10, rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.15,
        glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
        color: goldTones[Math.floor(Math.random() * goldTones.length)],
        life: 1
      });
    }
  }

  let lastBurst = 0;
  window.addEventListener("mousemove", (e) => {
    const now = performance.now();
    if (now - lastBurst < 90) return;
    lastBurst = now;
    spawnBurst(e.clientX, e.clientY, 3);
  });
  window.addEventListener("touchmove", (e) => {
    const now = performance.now();
    if (now - lastBurst < 120) return;
    lastBurst = now;
    const t = e.touches[0];
    if (t) spawnBurst(t.clientX, t.clientY, 3);
  }, { passive: true });

  function drawGlyph(x, y, size, rotation, glyph, color, alpha) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(rotation);
    ctx.globalAlpha = alpha;
    ctx.font = `700 ${size}px Poppins, sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 10;
    ctx.fillText(glyph, 0, 0);
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);
    rainDrops.forEach(d => {
      d.y += d.speed; d.x += d.drift; d.rotation += d.rotSpeed;
      if (d.y > height + 30) Object.assign(d, makeRainDrop(), { y: -30 });
      drawGlyph(d.x, d.y, d.size, d.rotation, d.glyph, d.color, d.opacity);
    });
    for (let i = burstDrops.length - 1; i >= 0; i--) {
      const b = burstDrops[i];
      b.vy += b.gravity; b.x += b.vx; b.y += b.vy; b.rotation += b.rotSpeed;
      b.life -= 0.018;
      if (b.life <= 0) { burstDrops.splice(i, 1); continue; }
      drawGlyph(b.x, b.y, b.size, b.rotation, b.glyph, b.color, Math.max(b.life, 0));
    }
    requestAnimationFrame(tick);
  }
  tick();
}
