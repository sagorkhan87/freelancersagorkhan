/* =========================================================
   OLYMPIAD NOTICE BADGE — injection + navigation
   Include AFTER notice-badge.css, anywhere before </body>
   on your existing portfolio page. It looks for an element
   with id="oly-badge-mount" inside your hero section; if it
   can't find one, it falls back to appending itself to the
   first <section> / hero container it can find.
   ========================================================= */
(function () {
  // Each entry becomes one floating badge. Add more objects here any time
  // you want another badge — no other code needs to change.
  var BADGES = [
    {
      id: "oly-badge",
      extraClass: "",
      url: "olympiad-hub.html",
      label: "চলমান অলিম্পিয়াড দেখুন",
      text: "চলমান কিছু অলিম্পিয়াড"
    },
    {
      id: "oly-badge-freelance",
      extraClass: "oly-badge-wrap--freelance",
      url: "freelance-journey.html",
      label: "ফ্রিল্যান্সিং যাত্রা শুরু করুন",
      text: "ফ্রিল্যান্সিং যাত্রা শুরু করুন এখনই"
    }
  ];

  function buildBadge(cfg) {
    var wrap = document.createElement("div");
    wrap.className = "oly-badge-wrap" + (cfg.extraClass ? " " + cfg.extraClass : "");
    wrap.innerHTML =
      '<div class="oly-badge" id="' + cfg.id + '" role="button" tabindex="0" ' +
      'aria-label="' + cfg.label + '">' +
      '<span class="oly-badge-dot"></span>' +
      '<span class="oly-badge-text">' + cfg.text + "</span>" +
      "</div>";
    return wrap;
  }

  function goTo(url) {
    var supportsVT = typeof document.startViewTransition === "function";
    if (supportsVT) {
      document.startViewTransition(function () {
        window.location.href = url;
      });
      return;
    }
    document.body.classList.add("oly-page-exit");
    setTimeout(function () {
      window.location.href = url;
    }, 460);
  }

  function init() {
    var mount = document.getElementById("oly-badge-mount");
    var hero = null;

    if (!mount) {
      hero =
        document.querySelector("[data-hero]") ||
        document.querySelector(".hero") ||
        document.querySelector("header") ||
        document.body;
      if (getComputedStyle(hero).position === "static") {
        hero.style.position = "relative";
      }
    }

    BADGES.forEach(function (cfg) {
      var badge = buildBadge(cfg);
      (mount || hero).appendChild(badge);

      var el = document.getElementById(cfg.id);
      el.addEventListener("click", function () { goTo(cfg.url); });
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goTo(cfg.url);
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
