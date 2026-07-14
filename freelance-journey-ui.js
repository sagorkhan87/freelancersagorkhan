/* =========================================================
   SAGOR KHAN — page interactions (scroll reveal, counters,
   scrollspy nav, magnetic buttons, custom cursor)
   Pure vanilla JS, no dependencies.
   ========================================================= */
(function () {
  "use strict";

  /* =========================================================
     👉 আপনার নিজের প্রোফাইল লিংক এখানে বসান / পরিবর্তন করুন।
     শুধু নিচের ভ্যালুগুলো (" " এর মধ্যে থাকা লিংক) বদলে দিলেই
     ফুটারের সব সোশ্যাল আইকন আপনার নিজের প্রোফাইলে নিয়ে যাবে।
     ========================================================= */
  var SOCIAL_LINKS = {
    facebook: "https://www.facebook.com/",
    linkedin: "https://bd.linkedin.com/in/freelancersagorkhan",
    youtube: "https://youtube.com/@freelancersagorkhan",
    instagram: "https://www.instagram.com/1sagorkhan1?igsh=Z2NiMDlwbm81eGxm",
    x: "https://x.com/mdSagoralikhan",
    whatsapp: "https://wa.me/8801XXXXXXXXX"
  };

  /* apply the links above onto every footer social icon */
  var socialLinkEls = Array.prototype.slice.call(document.querySelectorAll("[data-social]"));
  socialLinkEls.forEach(function (el) {
    var key = el.getAttribute("data-social");
    var url = SOCIAL_LINKS[key];
    if (url) el.setAttribute("href", url);
  });

  var BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  function toBengali(num) {
    return String(Math.round(num)).replace(/\d/g, function (d) { return BN_DIGITS[+d]; });
  }

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- scroll reveal ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (revealEls.length) {
    revealEls.forEach(function (el) {
      var dir = el.getAttribute("data-reveal");
      var revealClass = dir === "pop" ? "fj-reveal-pop" : "fj-reveal";
      el.classList.add(revealClass);
    });

    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- animated counters ---------- */
  var counters = Array.prototype.slice.call(document.querySelectorAll(".fj-counter"));
  if (counters.length) {
    function animateCounter(el) {
      var target = parseFloat(el.getAttribute("data-count-to") || "0");
      if (reduceMotion) { el.textContent = toBengali(target); return; }
      var duration = 1400;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = toBengali(target * eased);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (typeof IntersectionObserver === "undefined") {
      counters.forEach(animateCounter);
    } else {
      var counterIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { counterIo.observe(el); });
    }
  }

  /* ---------- scrollspy nav ---------- */
  var nav = document.getElementById("fjNav");
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll("ul a")) : [];
  var sections = navLinks
    .map(function (a) {
      var id = a.getAttribute("href");
      if (!id || id.charAt(0) !== "#") return null;
      var section = document.querySelector(id);
      return section ? { link: a, section: section } : null;
    })
    .filter(Boolean);

  if (sections.length && typeof IntersectionObserver !== "undefined") {
    var spyIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var match = sections.filter(function (s) { return s.section === entry.target; })[0];
        if (!match) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove("is-active"); });
          match.link.classList.add("is-active");
        }
      });
    }, { threshold: 0.35, rootMargin: "-20% 0px -55% 0px" });
    sections.forEach(function (s) { spyIo.observe(s.section); });
  }

  /* ---------- review card: click anywhere on it -> pink glow ---------- */
  var reviewCard = document.getElementById("fjReviewCard");
  if (reviewCard) {
    reviewCard.addEventListener("click", function () {
      reviewCard.classList.toggle("is-glow");
    });
  }

  /* ---------- "Free Consultation" -> scroll to footer + glow social icons ---------- */
  var freeConsult = document.getElementById("fjFreeConsult");
  var footerSocial = document.getElementById("fjFooterSocial");
  var contactSection = document.getElementById("contact");
  if (freeConsult) {
    freeConsult.addEventListener("click", function (e) {
      e.stopPropagation(); // don't also toggle the review card glow
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
      if (footerSocial) footerSocial.classList.add("is-glow");
    });
  }

  /* ---------- YouTube trigger -> fullscreen video modal ---------- */
  var ytTrigger = document.getElementById("fjYtTrigger");
  var videoModal = document.getElementById("fjVideoModal");
  var videoFrame = document.getElementById("fjVideoFrame");

  if (ytTrigger && videoModal && videoFrame) {
    var videoSrc = videoFrame.getAttribute("data-video-src") || "";

    function openVideoModal() {
      videoFrame.setAttribute("src", videoSrc);
      videoModal.classList.add("is-open");
      videoModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    function closeVideoModal() {
      videoModal.classList.remove("is-open");
      videoModal.setAttribute("aria-hidden", "true");
      videoFrame.setAttribute("src", ""); // stop playback
      document.body.style.overflow = "";
    }

    ytTrigger.addEventListener("click", openVideoModal);
    Array.prototype.slice.call(videoModal.querySelectorAll("[data-video-close]")).forEach(function (el) {
      el.addEventListener("click", closeVideoModal);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && videoModal.classList.contains("is-open")) closeVideoModal();
    });
  }

  /* ---------- sticky nav shrink on scroll ---------- */
  if (nav) {
    var lastState = false;
    function onScroll() {
      var shrink = window.scrollY > 40;
      if (shrink !== lastState) {
        nav.classList.toggle("is-scrolled", shrink);
        lastState = shrink;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- magnetic buttons ---------- */
  if (!reduceMotion && window.matchMedia && window.matchMedia("(pointer: fine)").matches) {
    var magnets = Array.prototype.slice.call(document.querySelectorAll(".fj-magnetic"));
    magnets.forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = "translate(" + (x * 0.18) + "px," + (y * 0.28) + "px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "translate(0,0)";
      });
    });

    /* ---------- custom cursor dot ---------- */
    var cursor = document.getElementById("fjCursor");
    if (cursor) {
      cursor.classList.add("is-active");
      window.addEventListener("mousemove", function (e) {
        cursor.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px)";
      }, { passive: true });
      var hoverables = document.querySelectorAll("a, button, .fj-magnetic");
      hoverables.forEach(function (el) {
        el.addEventListener("mouseenter", function () { cursor.classList.add("is-hover"); });
        el.addEventListener("mouseleave", function () { cursor.classList.remove("is-hover"); });
      });
    }
  }
})();
