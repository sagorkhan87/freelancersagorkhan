# Olympiad Hub — Integration Guide

## Files
```
olympiad-hub.html         ← the full Olympiad Hub page (hero, Earth, cards, footer)
css/olympiad-hub.css       ← styles for the hub page (hero + article cards)
css/notice-badge.css       ← styles for the floating badge (goes on your EXISTING site)
js/olympiad-hub.js         ← renders cards, Earth rotation, scroll reveal, particles
js/olympiad-data.js        ← ★ the only file you edit to add/change Olympiads
js/notice-badge.js         ← injects the badge + handles the click transition
demo-index.html            ← a minimal example showing the badge attached to a hero
```

`olympiad-hub.html` links `css/olympiad-hub.css` and `js/olympiad-data.js` + `js/olympiad-hub.js`
directly — keep the `css/` and `js/` folders next to it when you copy the page into your project.

## 1. Add the badge to your existing homepage
In your portfolio's `<head>`:
```html
<link rel="stylesheet" href="css/notice-badge.css">
```
Right before `</body>`:
```html
<script src="js/notice-badge.js"></script>
```
The script looks for a `data-hero` attribute (or falls back to `.hero`, then `<header>`) and
attaches the floating capsule to it automatically — **no HTML markup needed on your side.**
If you want to control the exact spot, add an empty `="oly-badge-mount"></div>`
anywhere inside your hero and it will be used instead.

Nothing else in your existing page is touched. All badge styles are scoped under `.oly-badge*`
and CSS variables prefixed `--oly-*`, so they won't collide with your current CSS.

## 2. Drop in the hub page
Copy `olympiad-hub.html`, the `css/` and `js/` folders into your site's root (same level as
`index.html`). Clicking the badge navigates to `olympiad-hub.html` with a fade/blur transition
(uses the View Transitions API when the browser supports it, with a CSS fallback otherwise).

The "← হোমপেজে ফিরুন" link at the top of the hub page points to `index.html` — update the
`href` if your homepage file is named differently.

## 3. Add or edit Olympiads
Open **`js/olympiad-data.js`** only. Add a new object to the `OLYMPIADS` array:

```js
{
  image: "https://...",              // featured image
  title: "প্রতিযোগিতার নাম",
  description: "এক/দুই লাইনের সংক্ষিপ্ত বিবরণ",
  eventDate: "১৫ সেপ্টেম্বর, ২০২৬",
  deadline: "৩১ আগস্ট, ২০২৬",
  organizer: "আয়োজক প্রতিষ্ঠান",
  category: "গণিত",
  status: "open",                    // "open" | "closing" | "closed"
  url: "https://external-site.com"
}
```
A new card appears automatically — no other code changes needed. `status: "closed"` disables
the registration button; clicking anywhere on an open/closing card (or pressing Enter/Space
while it's focused) opens `url` in a new tab.

You can also edit `NOTICE_TEXTS` in the same file to change what the sliding gold notice bar
above the cards says.

## The hero — realistic rotating 3D Earth
The hero's globe is a photorealistic, satellite-style Earth built from two independently
animated equirectangular texture layers (day map + cloud map, CC BY 4.0, Solar System Scope /
NASA imagery via Wikimedia Commons) inside a circular, shaded "sphere" — plus an atmosphere
glow, specular highlight, and a light sweep on load. No 3D library or build step is used.

- The Earth turns slowly and continuously; the cloud layer drifts at a slightly different
  speed for a natural parallax effect.
- Bangladesh is marked with a pulsing gold radar-beacon. Its screen position is recalculated
  every frame using real orthographic sphere projection from Bangladesh's coordinates
  (90.4°E, 23.8°N), so the glow always stays correctly locked onto Bangladesh as the globe
  spins, and fades out when it rotates to the far side.
- `prefers-reduced-motion` is respected: the animation loop is skipped and the globe renders
  once, facing Bangladesh.

## Notes
- Everything is vanilla HTML/CSS/JS — no build step, no dependencies beyond Google Fonts and
  the Earth's two texture images.
- Respects `prefers-reduced-motion` throughout (hero entrance, notice bar, Earth rotation).
- Cards are keyboard-accessible (tab to a card, press Enter/Space to open it) in addition to
  being clickable.
- Fonts used: Baloo Da 2 (display), Hind Siliguri (body), JetBrains Mono (labels/meta/data) —
  loaded from Google Fonts in `olympiad-hub.html`. Add the same `<link>` tags to your main site
  if you want the badge's font to render before the hub page has loaded.
- Swap the placeholder Unsplash image URLs in `js/olympiad-data.js` for your own hosted images
  whenever you're ready.
