/* =========================================================
   Animated local-time clock widget
   Uses the visitor's own device clock + timezone — this is
   always the correct time for wherever they actually are,
   with no location permission prompt required.
   ========================================================= */

function initClock() {
  const hourHand = document.getElementById("clockHour");
  const minuteHand = document.getElementById("clockMinute");
  const secondHand = document.getElementById("clockSecond");
  const digital = document.getElementById("clockDigital");
  const zoneLabel = document.getElementById("clockZone");

  if (!hourHand || !minuteHand || !secondHand || !digital) return;

  // Resolve a human-friendly place name from the browser's timezone
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const city = tz.split("/").pop().replace(/_/g, " ");
    if (zoneLabel) zoneLabel.textContent = city || "Local Time";
  } catch (e) {
    if (zoneLabel) zoneLabel.textContent = "Local Time";
  }

  function tick() {
    const now = new Date();
    const h = now.getHours() % 12;
    const m = now.getMinutes();
    const s = now.getSeconds();

    const secDeg = s * 6;
    const minDeg = m * 6 + s * 0.1;
    const hourDeg = h * 30 + m * 0.5;

    hourHand.setAttribute("transform", `rotate(${hourDeg} 100 100)`);
    minuteHand.setAttribute("transform", `rotate(${minDeg} 100 100)`);
    secondHand.setAttribute("transform", `rotate(${secDeg} 100 100)`);

    digital.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }

  tick();
  setInterval(tick, 1000);
}

document.addEventListener("DOMContentLoaded", initClock);
