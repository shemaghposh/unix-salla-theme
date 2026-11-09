# UNIX Theme: Performance Playbook (knowledge base for `unix-perf-auditor`)

Course notes from official sources (web.dev Learn Performance and Core Web Vitals articles, Chrome
Lighthouse / CrUX / PageSpeed Insights docs, MDN, Salla docs), applied to this repo.
`docs/PERFORMANCE.md` stays the record of what was built and measured; this file is the *rules*.
Researched 2026-11-09. Anything not confirmed by a primary source is marked **UNVERIFIED**.

**Budgets (ROADMAP 6.2):** Lighthouse mobile ≥ 85 · theme JS < 150KB gzip per page · LCP < 2.5s ·
CLS < 0.05 (stricter than Google's 0.1 "good") · INP < 200ms. Baseline to beat: live unix.sa (Shopify)
scores **41** on mobile Lighthouse.

**Rule format:** rule · *impact* · `check` (command or grep in this repo) · source.

---

## 0. The scoreboard: what the numbers mean

| Metric | Good | Poor | Percentile | Lighthouse weight |
|---|---|---|---|---|
| LCP | ≤ 2.5s | > 4.0s | p75, mobile and desktop separately | 25% |
| CLS | ≤ 0.1 (our budget 0.05) | > 0.25 | p75 | 25% |
| INP | ≤ 200ms | > 500ms | p75 (field only) | — (TBT is the lab proxy) |
| TBT | — | — | lab only | **30%** |
| FCP | ≤ 1.8s | > 3.0s | p75 | 10% |
| Speed Index | — | — | lab only | 10% |
| TTFB (experimental) | ≤ 800ms | > 1.8s | p75 | — |

Sources: https://web.dev/articles/lcp · https://web.dev/articles/cls · https://web.dev/articles/inp ·
https://developers.google.com/speed/docs/insights/v5/about ·
https://developer.chrome.com/docs/lighthouse/performance/performance-scoring

- **Score bands:** 0–49 red, 50–89 orange, 90–100 green. Our 85 target is "needs improvement" orange,
  unix.sa's 41 is red. · source: performance-scoring (above).
- **TBT + CLS + LCP = 80% of the score.** A score drop is almost always one of these three. Read them
  first, not the opportunity list. · same source.
- **INP is not in the Lighthouse score.** Lighthouse has no user; it reports TBT. INP is only known from
  field data (CrUX) or from DevTools "Live metrics" while you tap the page yourself.

---

## 1. Lab vs field: which number to trust

1. **Field (CrUX) is what Google ranks on; lab (Lighthouse) is for debugging.** Field data is the last
   28 days of real Chrome users at p75; lab is one simulated load. They can disagree. · *impact: decides
   which number goes in the launch report* · check: PSI shows both blocks; record both separately ·
   https://developers.google.com/speed/docs/insights/v5/about
2. **The Salla preview and the demo store have no field data.** CrUX only includes pages that are publicly
   discoverable (200, no `noindex`) and "sufficiently popular" (threshold undisclosed). A preview or a new
   store will show "no data". Until unix.sa runs on Salla for ~28 days, every number we have is lab. ·
   check: PSI field block says "No data" → record "field: n/a" · https://developer.chrome.com/docs/crux/methodology
3. **CrUX excludes iOS Chrome and Safari.** Only Chrome on Android/desktop with usage stats on contributes.
   Many Saudi shoppers are on iPhone, so CrUX under-represents them; Safari has no LCP/INP API at all
   for RUM either (**UNVERIFIED** for current Safari versions). · same source.
4. **PSI falls back to origin data** when a URL has too few samples. After launch, a PDP may show the
   *origin's* p75, not its own. Note which one you recorded. · PSI about page (above).
5. **bfcache restores are counted as page views in CrUX** with CLS/INP reset to 0 and near-instant LCP. Good
   bfcache eligibility improves field numbers without changing lab numbers. · https://web.dev/articles/bfcache

---

## 2. Lighthouse / PSI lab conditions (know what you are simulating)

- **Mobile preset ("Slow 4G"):** RTT 150ms, 1.6 Mbps down / 750 Kbps up, **4x CPU slowdown**, simulated
  throttling by default ("Lantern": one fast load, then modelled). ·
  https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md
- **Emulated device:** PSI docs still say "mid-tier Moto G4"; current Lighthouse emulates a Moto G Power
  (412×823 CSS px, DPR 1.75) — **UNVERIFIED** (the emulation doc does not state it). Practical effect: a
  `sizes="100vw"` image is chosen for ~721 device px, so our 768w candidate is what Lighthouse downloads.
- **Run-to-run variance is real.** Causes listed by Chrome: A/B tests, routing, the test machine,
  extensions, antivirus. Run 3–5 times and take the median; never compare one PSI run to one DevTools run.
  · performance-scoring source.
- **DevTools Lighthouse ≠ PSI.** A local run uses your own CPU; check "CPU/Memory Power" (benchmarkIndex)
  at the bottom of the report and keep it in the record. Calibrate before comparing. · throttling.md.
- **PSI runs from a Google datacenter (North America, Europe or Asia),** not from Riyadh. TTFB to Salla's
  servers in the lab is therefore not what Saudi shoppers see; field TTFB after launch is the truth. ·
  PSI about page.

---

## 3. LCP: Largest Contentful Paint (< 2.5s)

### 3.1 What can be LCP (and what can't)

- Candidates: `<img>`, `<image>` in SVG, `<video>` (poster load **or** first-frame paint, whichever is
  earlier), CSS `url()` backgrounds, and block elements with text. · https://web.dev/articles/lcp
- **Excluded by Chromium:** elements with opacity 0, elements that cover the *full viewport* (treated as
  background), and low-entropy placeholder images. · same.
  - **UNIX consequence:** a `unix-hero--full` hero image that fills the whole mobile viewport may be
    ignored, and LCP falls to the hero `<h1>`. That `<h1>` animates in from `opacity: 0`
    (`unix-hero.scss:106`, `--d-reveal: 800ms`, staggered 60ms), so while it is transparent it is not a
    candidate either → up to ~0.9s of element render delay. Check which element PSI names as LCP.
  - Text in a web font during the font *block* period does not count (we use `swap`, so fallback text
    paints and counts).

### 3.2 The four sub-parts (debug LCP by sub-part, not as one number)

| Sub-part | Target share | UNIX lever |
|---|---|---|
| TTFB | ~40% | Salla's server/CDN: not ours. Record it, don't chase it. |
| Resource load delay | < 10% | LCP `<img>` in server HTML, never lazy, `fetchpriority="high"` |
| Resource load duration | ~40% | right-sized `cdn(width)` + `srcset`/`sizes`; merchant export (§10) |
| Element render delay | < 10% | render-blocking CSS/fonts in `<head>`; hero text reveal animation |

Source: https://web.dev/articles/optimize-lcp (shares are guidelines, not absolute numbers).
Check: PSI → "Largest Contentful Paint element" diagnostic / DevTools Performance → "LCP by phase" insight.

### 3.3 Rules

1. **Never lazy-load the LCP image.** Lazy LCP "will always lead to unnecessary resource load delay". ·
   *impact: often 0.5–1s+* · `grep -rn 'fetchpriority="high"' src/views` and confirm each hit is
   `loading="eager"` (hero `unix-hero.twig:100`, gallery `unix-gallery.twig:83,93`, PLP banner
   `pages/product/index.twig:70`, blog `single.twig:77`, cart `cart.twig:84`) · optimize-lcp.
2. **`fetchpriority="high"` on exactly one image per page** (the LCP). More than one or two "makes priority
   setting unhelpful". Images otherwise start at Low and are boosted only after layout. · *impact: Google
   Flights 2.6s → 1.9s* · `grep -rn 'fetchpriority' src/views` and reason per page type; header logo is
   gated by `logo_high` (`header.twig:72`) · https://web.dev/articles/fetch-priority
3. **`fetchpriority="low"` on non-first carousel slides** that sit above the fold; lazy alone can still
   be boosted to High. · *impact: Oodle demo ~2s faster load* · gallery slides after the first are
   `loading="lazy"` only (`unix-gallery.twig:83,93`) — consider adding `fetchpriority="low"` if PSI shows
   slide 2 competing · fetch-priority.
4. **The LCP resource must be discoverable in the HTML.** If it is only referenced from CSS or JS (CSS
   background, JS-set `src`, a `salla-*` web component's shadow DOM), add
   `<link rel="preload" as="image" imagesrcset=… imagesizes=… fetchpriority="high">` (omit `href` when
   using `imagesrcset`). · *impact: removes the load-delay sub-part* · `grep -rn 'rel="preload"' src/views`
   (none today; not needed while LCP images are server-rendered `<img>`) ·
   https://web.dev/learn/performance/resource-hints
5. **Preload ≠ priority.** Preload fixes discovery; `fetchpriority` fixes priority. Don't preload what the
   preload scanner already sees in `<img src>`. · fetch-priority.
6. **Keep the head short and non-blocking so the LCP can render.** Render-blocking CSS in `<head>` blocks
   the whole page; parser-blocking scripts in `<head>` block everything below. · *impact: element render
   delay* · `grep -n '<link rel="stylesheet"\|<script' src/views/layouts/master.twig` — today: `app.css`,
   `theme.font.path` (unused, `master.twig:93`), `sallaicons.css`, Google Fonts CSS (`:99`/`:101`) are
   all blocking; scripts are `defer` · https://web.dev/learn/performance/understanding-the-critical-path
7. **Don't animate the LCP element from opacity 0.** An element at opacity 0 is not a candidate; a fade-in
   on the hero heading pushes LCP to the end of the animation. · *impact: up to `--d-reveal` 800ms +
   stagger* · `grep -n 'opacity: 0\|animation:' src/assets/styles/04-components/unix-hero.scss` · lcp
   article (opacity exclusion). Fix options (keep the look): start at `opacity: .01`-ish is a known
   workaround but **UNVERIFIED** as still effective; safer is animating `transform` only on the h1.
8. **Video as LCP:** poster load or first frame, whichever first. A `<video>` without `poster` whose
   source is attached after `load` cannot be an early LCP. Always render a real `<img>` (or `poster`)
   for the first frame. · https://web.dev/articles/lcp · https://web.dev/articles/lazy-loading-video

---

## 4. CLS: Cumulative Layout Shift (< 0.05)

- CLS = the largest **session window** (shifts < 1s apart, window ≤ 5s), not the sum of the visit.
  Shifts within 500ms of a tap/click/keypress are excluded (`hadRecentInput`); scroll is **not** input. ·
  https://web.dev/articles/cls

1. **Every `<img>`, `<video>`, `<iframe>` has `width` + `height` (or CSS `aspect-ratio`),** with
   `height: auto` in CSS. · *impact: the #1 CLS cause* · `grep -rn '<img' src/views | grep -v 'width='`
   then read multi-line hits; also `<source … width height>` inside `<picture>` for art direction
   (hero does this, `unix-hero.twig:92`) · https://web.dev/articles/optimize-cls
2. **Art-directed `<picture>` needs per-source dimensions** when the mobile and desktop ratios differ
   (mobile 2:3 vs desktop 16:9 in the hero). `<source width height>` is supported. · `grep -n '<source'
   src/views -r` · optimize-cls (dimensions rule; per-source support **UNVERIFIED** in older Safari).
3. **Reserve space for anything late:** `salla-*` web components (they render after hydration), the
   announcement bar, app banners, review widgets. Use `min-height` / `aspect-ratio` on the host; never
   collapse the reserved box if it stays empty. · *impact: 0.02–0.2 per late block* · DevTools Performance
   → Layout shifts track / "Layout shift culprits" insight · optimize-cls.
4. **Insert late content below, not above.** Shifts near the top move more pixels. No banner injected above
   the header after load. · optimize-cls.
5. **Animate with `transform`/`opacity`, never `top/left/width/height`.** Abrupt non-composited movement
   counts as shift. Sticky header hide/show must be `transform` (check `unix-header` styles). ·
   `grep -rn 'transition:.*\(top\|height\|inset\)' src/assets/styles` · cls + optimize-cls.
6. **Web fonts:** `swap` can shift if fallback metrics differ. Options: `font-display: optional` (font
   used only if ready within ~100ms), or tune the fallback with `size-adjust` / `ascent-override`. Our
   choice is `swap` (DS) → measure font-swap shifts on Arabic headings (Somar) and body (Plex) on a cold
   cache. · `grep -n 'font-display\|size-adjust' src/assets/styles -r` ·
   https://web.dev/articles/font-best-practices · https://web.dev/learn/performance/optimize-web-fonts
7. **Transparent header over the hero must be server-rendered** (it is: `data-header-overlay` in
   `unix-hero.twig:82`), so JS doesn't re-flow the page. · keep.
8. **Make pages bfcache-eligible** so Back restores without new shifts (see §8). · optimize-cls.

---

## 5. INP and long tasks (< 200ms; TBT in the lab)

- **Long task = > 50ms on the main thread;** its blocking time is the excess over 50ms. TBT sums that
  between FCP and TTI (lab). · https://web.dev/articles/optimize-long-tasks
- INP phases: input delay → processing → presentation delay. · https://web.dev/articles/inp

1. **Ship less JS on load.** Parse/compile/execute during load creates long tasks that delay the first
   tap. · *impact: TBT is 30% of the score* · `pnpm prod` then `gzip -c public/<file>.js | wc -c` per
   entry; per-page = `app.js` + page entry + `product-card.js` + `main-menu.js` (+ `add-product-toast.js`)
   + chunks loaded before `load` · https://web.dev/articles/optimize-inp
2. **Code-split by need, not by page.** Keep the existing on-demand chunks on demand (`sweetalert2`,
   `fslightbox`, `animejs`, `size-finder`). · `grep -rn 'import(' src/assets/js` · PERFORMANCE.md §4.
3. **Keep event callbacks short; update the UI first, defer the rest** (`requestAnimationFrame` then
   `setTimeout`, or `await scheduler.yield()` with a fallback — not in Safari). · `grep -rn
   'scheduler.yield\|setTimeout' src/assets/js` · optimize-inp, optimize-long-tasks.
4. **No layout thrashing:** don't read `offsetHeight`/`getBoundingClientRect` right after writing styles
   in the same task. · `grep -rn 'offsetHeight\|getBoundingClientRect\|scrollHeight' src/assets/js` and
   check each is not after a style write in a loop · optimize-inp.
5. **Scroll handlers: throttle to `requestAnimationFrame`, or use `IntersectionObserver`.** Note
   `passive` matters for `touchstart`/`wheel` (cancelable); `scroll` events are not cancelable, so
   `{passive:true}` on scroll is harmless but not the fix — the rAF throttle is. · `grep -rn
   "addEventListener('scroll'" src/assets/js` → `brands.js:13` runs `toggleClassIf` on every scroll event
   without rAF (brands page only, low priority) · optimize-inp (callbacks), MDN passive listeners
   (**UNVERIFIED** citation not fetched).
6. **Smaller DOM = shorter presentation delay.** Use `content-visibility: auto` on long below-the-fold
   sections (footer, PLP grids) with `contain-intrinsic-size` to avoid scroll jumps. · `grep -rn
   'content-visibility' src/assets/styles` (none today) · optimize-inp.
7. **Third-party/app scripts injected by Salla hooks count toward TBT** but are not ours (see §9). In the
   Lighthouse "Reduce JavaScript execution time" / "third-party" breakdown, separate theme bundles
   (`/themes/…/public/` path, **UNVERIFIED** exact path) from Salla and merchant tags.

---

## 6. Images

### 6.1 Responsive images (`srcset`/`sizes`)

1. **Width descriptors need `sizes`,** or they don't work. `sizes` must describe the real CSS width
   (vw, px, calc; no %). · *impact: wrong `sizes` = 2–4× bytes on mobile* · `grep -rn 'srcset' src/views`
   and confirm a `sizes` on each `<img>`/`<source>` · https://web.dev/learn/performance/image-performance
   · https://web.dev/articles/serve-responsive-images
2. **3–5 candidates per image** is the common range; more is better for bytes, worse for markup. Our
   pattern: mobile 480/768/1080, desktop 1280/1920/2560 (hero); 480/800/1200 (PDP gallery). ·
   serve-responsive-images.
3. **`src` is the fallback for browsers ignoring `srcset`;** make it a sensible middle size (we use 800
   / 1080). · same.
4. **Lighthouse flags an image if it is ≥ 4 KiB bigger than its rendered size × DPR** ("Properly size
   images", now inside "Improve image delivery" in Lighthouse 13). ·
   https://developer.chrome.com/docs/lighthouse/performance/uses-responsive-images
5. **Every merchant/product image goes through Salla's `|cdn(width)`** (or `cdn(w,h)`), never the raw
   URL, so the CDN serves a resized copy. · *impact: a raw 3000px upload can be 1–3 MB on a phone* ·
   `grep -rnE 'src="\{\{ ?[a-z_.]+ ?\}\}"|srcset="\{\{ ?[a-z_.]+ ?\}\}"' src/views` → today:
   `home/unix-collection-overlay.twig:83-84` (raw `image_mobile` / `image`) and
   `home/unix-featured-products.twig:100` (raw `media`). Zoom dialog `unix-gallery.twig:161` uses the
   original on purpose (lazy, inside a closed dialog).
   - **`cdn(width)` is not documented.** Salla's docs describe `cdn` only as "links of pre-defined files
     such as font and saicon" with no width arguments (https://docs.salla.dev/421929m0). Raed itself
     uses `cdn(70,70)` / `cdn(48,48)` and our build uses `cdn(width)`; that it really resizes, and
     whether it also converts to WebP/AVIF, is **UNVERIFIED** — check in the preview's Network panel
     (response size, `content-type`, dimensions) and record the result in `PERFORMANCE.md`.

### 6.2 Formats and compression

1. **Photos → lossy JPEG/WebP/AVIF; logos/icons → SVG; no text in images; animation → `<video>`, never
   GIF.** · https://web.dev/articles/choose-the-right-image-format
2. **AVIF can save > 50% vs JPEG "in some cases"; WebP usually beats JPEG.** Order `<source>` AVIF →
   WebP → JPEG if you hand-roll `<picture>`. On Salla, the format the shopper gets depends on the CDN
   (**UNVERIFIED**, see 6.1.5), so the merchant's upload format matters most. ·
   https://web.dev/learn/performance/image-performance
3. **There is no universal quality setting;** test levels and inspect, watching chroma artifacts on
   flat-colour areas (our sand `#d8c5b8` backgrounds band easily). · image-performance.
4. **Lighthouse's yardstick is JPEG quality 85:** it re-encodes at 85 and flags images where that saves
   ≥ 4 KiB. Uploading at ≤ 85 keeps "Efficiently encode images" quiet. ·
   https://developer.chrome.com/docs/lighthouse/performance/uses-optimized-images
5. **`decoding="async"`** helps only on very large images; harmless elsewhere. Don't put it on the LCP
   image's critical path expectations (it's fine either way). · image-performance.
6. **`loading="lazy"` on everything below the fold;** `eager` (default) on the LCP. · image-performance.

### 6.3 Page weight

- **Target total transfer < 1,600 KiB; Lighthouse warns above 5,000 KiB.** Hero video bytes count once
  they load (after `load`), so they hit this audit even when they don't hurt LCP. ·
  https://developer.chrome.com/docs/lighthouse/performance/total-byte-weight

---

## 7. Video (hero, video tiles, PDP video slides)

1. **Background video: `muted playsinline loop`, `preload="none"`, attach the source only when needed.**
   `playsinline` is required for autoplay on iOS; set `video.muted = true` as a property too. ·
   *impact: video never competes with LCP* · `grep -rn '<video' -A6 src/views` → hero
   (`unix-hero.twig:105-110`) and tiles (`unix-video-tiles.twig:80-84`) comply; hero attaches `src`
   after `window.load` (`unix-hero.js:59-63`) · https://web.dev/articles/lazy-loading-video
2. **`autoplay` videos start downloading immediately, even off-screen.** That's why we don't use the
   `autoplay` attribute and call `play()` from JS instead. · https://web.dev/learn/performance/video-performance
3. **A visible image underneath (or `poster`) is the LCP for a video hero.** If the video is the LCP,
   give it a poster and preload that poster with `fetchpriority="high"` (you can't set fetchpriority on
   `poster`). Never `loading="lazy"` an LCP video. · lazy-loading-video.
   - **Gap:** `unix-hero.twig:105` has no `poster`, and the image only renders when `image_desktop` /
     `image_mobile` is set. A **video-only** hero (allowed by the schema; unix.sa itself has fallback
     images, SPEC §4.1) has no image LCP: LCP becomes the animated `<h1>` (§3.3 rule 7) or the first
     frame after `load`. Merchant rule: always upload the fallback images (§10). Theme option: warn in
     the editor or fall back to a poster field.
4. **Skip video under `prefers-reduced-motion` and Save-Data.** · `grep -rn 'saveData' src/assets/js`
   (hero and tiles comply) · resource-hints (Save-Data), DS §8.1.
5. **Pause off-screen video** (IntersectionObserver). Hero does (`unix-hero.js:65-72`). · keep.
6. **Formats:** MDN's first choice is WebM/AV1 with MP4/H.264 fallback; AV1 can be up to 50% smaller
   than H.264 but Safari only decodes it on recent hardware (iPhone 15 Pro, 16+, M3). The first
   `<source>` that the browser *can* play wins, so order matters. Today the hero takes one URL per
   breakpoint (MP4) → **H.264 MP4 is the only safe single format.** ·
   https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Video_codecs ·
   https://web.dev/learn/performance/video-performance
7. **Strip the audio track** from background loops (`ffmpeg -an`). · video-performance.
8. **Downscale before encoding:** "1080p reduced to 720p … much smaller while having much higher visual
   quality" at a given size; 24–30 fps is enough. · MDN codec guide.
9. **Replace any GIF with a muted looping `<video>`.** · video-performance.

---

## 8. Fonts

Current setup (`master.twig:82-102`, `unix-tokens.scss:9-18`): Google Fonts CSS for one family per
language (Plex Sans Arabic or Open Sans), `display=swap`, preconnects to both Google origins; Somar Bold
self-hosted WOFF2 (35.7 KB), `swap`, Arabic `unicode-range`.

1. **Preconnect to both Google Fonts origins; the font-file origin needs `crossorigin`.** Without it the
   preconnect is wasted and a second connection opens. · *impact: ~1 RTT (150ms in the lab)* ·
   `grep -n 'preconnect' src/views/layouts/master.twig` (`:82-83`, compliant) ·
   https://web.dev/learn/performance/resource-hints · https://web.dev/articles/font-best-practices
2. **Self-hosting is usually faster than a third-party origin** (no extra connection), but you lose
   Google's automatic per-script `unicode-range` slicing unless you subset yourself. · *impact: removes
   a render-blocking cross-origin CSS request + a connection* · candidate for 6.2 follow-up; license
   check first (IBM Plex and Open Sans are OFL) · https://web.dev/learn/performance/optimize-web-fonts
   · font-best-practices.
3. **Google Fonts already serves `unicode-range` subsets per script;** an Arabic page only downloads the
   Arabic slice plus Latin if Latin glyphs appear. Don't add `&subset=`. `&text=` (up to 90% smaller) is
   only for fixed strings like a logo. · font-best-practices · https://developers.google.com/fonts/docs/css2
4. **Request only the weights you use.** Arabic: `wght@300;400;500;700`; English: `300;400;600;700`
   (`master.twig:99,101`). Each weight × script slice is a file. Grep the built CSS for `font-weight:300`
   use before keeping 300. · `grep -o 'font-weight:[0-9]*' public/app.css | sort | uniq -c` · css2 docs.
5. **WOFF2 only** (30% smaller than WOFF; universal support). · font-best-practices. Somar complies.
6. **Preload only the one font that renders above the fold, with `crossorigin`, and the exact URL**
   (a different query string = double download). Candidate: `Somar-Bold.woff2` for the Arabic hero h1;
   blocked today by the `asset`-filter URL question (PERFORMANCE.md §5). · optimize-web-fonts.
7. **`font-display`: `swap` for brand text that must appear in the brand font; `optional` for the best
   CLS/LCP.** We keep `swap` (DS) and must verify the swap doesn't push CLS over 0.05. · font-best-practices.
8. **Inline `@font-face` in `<head>`** (not the font files) lets fonts be discovered earlier; the gain is
   capped while `app.css` is still render-blocking. Low priority. · optimize-web-fonts.
9. **Drop dead font CSS:** `theme.font.path` (`master.twig:93`) is render-blocking and its font is never
   used (`--font-main` overrides it). Removing it is pending Salla review requirements (ROADMAP 6.6). ·
   critical-path article.

---

## 9. Third parties and what Salla injects (outside our control)

- **What we control:** everything in `src/views`, `src/assets`, and the order of hooks in `master.twig`.
- **What Salla controls:** the Twilight SDK (`salla.*`) and the `salla-*` web components are injected by
  the theme engine, not bundled by us (https://docs.salla.dev/422610m0.md); the `{% hook head %}`
  output (SEO meta); and **`head:end` / `body:end` hooks, where Salla documents "third-party analytics
  scripts" and custom stylesheets** (https://docs.salla.dev/twilight-engine/hooks-overview). Merchant
  pixels (Snap, TikTok, Meta, GA/GTM) and apps arrive here. Their size and blocking behaviour are
  **not documented** → measure them, don't assume.

1. **Attribute TBT by origin.** In Lighthouse: "Reduce JavaScript execution time" and the third-party
   summary. Record theme vs Salla vs merchant-tag ms separately in every audit. ·
   https://web.dev/articles/optimizing-content-efficiency-loading-third-party-javascript
2. **Theme scripts are always `defer` (or `async`).** · `grep -n '<script' src/views -r | grep -v
   'defer\|async\|type="application/ld+json"'` → only the small inline config in `master.twig:72` ·
   same source.
3. **Every pixel the merchant adds must justify itself.** Recommend the merchant loads tags through one
   tag manager, not five separate pixels; remove tags with no owner. · same source.
4. **Measure a script's cost with DevTools request blocking:** block the domain, re-run Lighthouse 3×,
   compare medians. · same source.
5. **Preconnect only to the 1–3 most critical cross-origin hosts** (preconnects compete). Candidate: the
   Salla image CDN host that serves the LCP image, if it differs from the document origin — host name
   **UNVERIFIED** (read it from the LCP request in the Network panel). · resource-hints.

---

## 10. bfcache (instant Back/Forward)

1. **No `unload` listeners;** use `pagehide`. · `grep -rn "'unload'\|\"unload\"" src/assets/js` (none) ·
   https://web.dev/articles/bfcache
2. **`Cache-Control: no-store` blocks bfcache** — Salla sets headers, not us; record what the HTML
   response sends (**UNVERIFIED** for Salla storefront pages). · bfcache.
3. **Close open connections in `pagehide`, reopen in `pageshow`;** refresh cart/auth state when
   `event.persisted` is true (cart count can be stale after Back). · `grep -rn 'pageshow\|persisted'
   src/assets/js` (none today) · bfcache.
4. **Test:** DevTools → Application → Back/forward cache → Run test; fix "Actionable" items. Lighthouse
   has a bfcache audit. · bfcache.

---

## 11. CSS

1. **One render-blocking stylesheet, as small as possible.** `app.css` is global (≈346KB min / ~54KB gz).
   Page-only styles (account, blog, loyalty, Raed home blocks) can move to per-page CSS loaded in the
   page's `styles` block. · *impact: FCP/LCP render delay* · `wc -c public/app.css; gzip -c
   public/app.css | wc -c` · critical-path article; PERFORMANCE.md §6.
2. **Non-matching `media` makes a stylesheet non-blocking** (e.g. `media="print"`), useful for
   desktop-only CSS on mobile. · critical-path article.
3. **Lighthouse "Reduce unused CSS"** lists bytes per file; use DevTools Coverage to confirm before
   deleting (Salla components render classes at runtime). · PERFORMANCE.md §3 method.

---

## 12. How to measure UNIX on Salla (step by step)

**Before you start**
1. `pnpm prod` in the main session (never two builds at once). Record raw and gzip size of every file
   in `public/`: `for f in public/*.js public/*.css; do echo "$f $(wc -c <"$f") $(gzip -c "$f" | wc -c)"; done`.
2. Commit with `git add -A public` (new hashed chunks) and make sure `salla theme preview` serves this
   commit (theme 705562203 on the UNIX Demo store, branch `main`).
3. Make sure the demo store has **real-weight content**: the real hero video + fallback images, ≥ 12
   products with full galleries, a category banner. Lighthouse on an empty demo is meaningless.

**Pages (always the same URLs, written into PERFORMANCE.md)**
- Home (AR), home (EN), one PDP with sizes + video slide, one PLP (category with banner), cart with 2
  items (lab only: needs a session → DevTools, not PSI).

**Lab run A: PageSpeed Insights (primary, comparable with unix.sa)**
4. Open https://pagespeed.web.dev, paste the **preview URL**. If PSI can't reach it (preview needs a
   login cookie or token — **UNVERIFIED**), use run B for that page.
5. Mobile tab. Run **3–5 times**, record the **median** score and its LCP/CLS/TBT/FCP/SI.
6. Run the **same procedure on unix.sa** (same page types, same day) so "41 → x" is apples to apples.

**Lab run B: Chrome DevTools Lighthouse (pages PSI can't reach, and debugging)**
7. Fresh Chrome profile or Incognito, no extensions. DevTools → Lighthouse → Mode: Navigation, Device:
   Mobile, Category: Performance, throttling: default simulated ("Slow 4G", 4x CPU).
8. Record benchmarkIndex ("CPU/Memory Power" in the footer). If very different from PSI's, adjust CPU
   slowdown per the throttling doc, or don't compare with PSI numbers.

**Debug run C: DevTools Performance panel**
9. CPU 4x / network "Slow 4G", record a reload. Read: **LCP by phase** (TTFB / load delay / load
   duration / render delay), **Layout shift culprits**, long tasks (> 50ms) and who owns them.
10. Network panel: filter `Img` → the LCP request must start in the first wave with **priority High**;
    check the served width/format/bytes of `cdn(width)` URLs; filter `JS` → sum theme bytes (gzip
    "transferred").
11. "Live metrics" view: tap the menu, add to cart, open size finder, change options → note INP-like
    interaction times.
12. Application → Back/forward cache → Run test on home and PDP.

**What to record (one row per page, in `docs/PERFORMANCE.md` §6)**

| Field | Example |
|---|---|
| Date, commit, page URL, AR/EN | 2026-11-12 · abc1234 · /ar/… |
| Tool + Lighthouse version + device/throttling | PSI · LH 13 · mobile Slow 4G 4x |
| Score (median of n runs, n) | 87 (5) |
| LCP s + **LCP element** + phase split | 2.1s · `img.unix-hero__image` · 0.6/0.1/1.2/0.2 |
| CLS + top shift culprit | 0.02 · font swap h1 |
| TBT ms + top 3 scripts (theme / Salla / merchant) | 180 · app.js 40, twilight 90, gtm 50 |
| FCP, SI | 1.4s, 2.8s |
| Total transfer KiB, theme JS KiB gz | 1,240 · 78 |
| Field (CrUX) p75 LCP/CLS/INP or "n/a" | n/a (preview) |
| bfcache eligible? blocking reasons | yes / "Cache-Control: no-store" |

Never fill a field you didn't measure: write ⏳ and the exact test to run.

**After launch (field)**
13. Weekly: PSI field block for unix.sa home + top PDP; CrUX origin p75 for LCP/CLS/INP (mobile).
    Expect 28 days before the Salla build fully replaces Shopify data. Search Console → Core Web Vitals
    report groups URLs by status.

---

## 13. Image and video export settings for the merchant

Widths follow the `cdn(width)` candidates and `width`/`height` attributes already in the views, so the
CDN never upscales and the reserved box matches the file. Upload at **the largest candidate** (not a
3000px+ camera original). Quality numbers: start at the values below, then inspect (web.dev: no
universal setting); **≤ 85 JPEG** matches Lighthouse's yardstick.

| Slot (view) | Ratio | Upload size (px) | Format and quality |
|---|---|---|---|
| Hero desktop image (`unix-hero.twig:91`) | 16:9 | 2560 × 1440 | JPEG q 75–80 (or WebP q ~75) · target ≤ 350 KB |
| Hero mobile image (`:95-99`) — **always upload; it is the LCP and the video's stand-in** | 2:3 | 1080 × 1620 | JPEG q 75–80 · target ≤ 200 KB |
| Product gallery (`unix-gallery.twig:79-93`) | 2:3 | 1200 × 1800 (zoom shows the original, so ≤ 2000 px tall) | JPEG q 80 · target ≤ 250 KB |
| Collection banner PLP (`pages/product/index.twig:65`) | 4:5 mobile / 16:9 wide | 1920 wide | JPEG q 75–80 |
| Collection overlay (`unix-collection-overlay.twig:83-84`) | 4:5 | desktop 1200 × 1500, mobile 800 × 1000 (served raw today → keep these sizes exactly) | JPEG q 75 · ≤ 200 KB |
| Video tile poster (`unix-video-tiles.twig:74`) | 3:4 | 720 × 960 (×2 = 1440 × 1920 optional) | JPEG q 75 |
| Featured products slide (`unix-featured-products.twig:100`, served raw today) | 2:3 | 800 × 1200 | JPEG q 75–80 |
| Logo (`header.twig:73`, `cdn(240)`) | 120 × 48 box | 240 × 96 PNG (transparent) or SVG if Salla accepts it (**UNVERIFIED**) | PNG-8 / optimised |

Sources: https://web.dev/articles/serve-responsive-images (3–5 sizes, src fallback) ·
https://developer.chrome.com/docs/lighthouse/performance/uses-optimized-images (q 85 yardstick) ·
https://web.dev/articles/choose-the-right-image-format · https://web.dev/learn/performance/image-performance.
The KB targets are our own budget derived from the 1,600 KiB page target (**UNVERIFIED** as an official
per-image number).

**Format note:** export sRGB, strip metadata, no progressive-JPEG requirement. WebP/AVIF uploads are
fine if Salla's dashboard accepts them and its CDN serves them as-is (**UNVERIFIED**); JPEG is the safe
default. Check text-on-sand areas for banding at the chosen quality.

**Video (hero desktop / hero mobile / video tiles)**

| Setting | Value | Why / source |
|---|---|---|
| Container / codec | MP4, H.264 (AVC), High profile | plays everywhere; the hero takes one URL per breakpoint — MDN codec guide |
| Audio | **none** (`-an`) | background loop, muted anyway — web.dev video-performance |
| Resolution | desktop 1920 × 1080 max (1280 × 720 preferred); mobile 720 × 1080 (2:3) or 720 × 1280 (9:16 cropped by `object-fit: cover`) | downscaling gives a smaller file at better quality — MDN |
| Frame rate | 24–30 fps | "anything from 24 FPS upward … satisfactorily smooth" — MDN |
| Length | 6–15 s seamless loop | our recommendation (**UNVERIFIED**) |
| Quality | x264 CRF ~23–28, `-preset slow`, `-movflags +faststart`, `-pix_fmt yuv420p` | standard x264 practice; CRF values **UNVERIFIED** (MDN gives no web CRF) |
| File size target | mobile ≤ 2 MB, desktop ≤ 4 MB | page-weight budget (§6.3); **UNVERIFIED** as official |
| Poster / fallback image | always upload the hero images above | LCP — web.dev lazy-loading-video |

Example (merchant or designer):
`ffmpeg -i hero.mov -an -vf "scale=720:-2,fps=30" -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart hero-mobile.mp4`

Salla's upload limits for theme video fields, and whether Salla transcodes uploads, are **UNVERIFIED**:
check the dashboard's error message and the served file's size/codec in the Network panel.

---

## 14. Audit checklist (quick grep pass before every perf report)

```
grep -rn 'fetchpriority="high"' src/views                 # one per page type, all eager
grep -rn 'loading="lazy"' src/views | grep -i 'hero\|gallery'   # none on LCP slots
grep -rnE 'src="\{\{ ?[a-z_.]+ ?\}\}"' src/views           # raw (non-cdn) merchant images
grep -rn '<img' src/views | grep -v 'width='               # then read multi-line hits for dims
grep -rn '<video' -A6 src/views                            # muted playsinline preload=none, no autoplay attr
grep -n '<link rel="stylesheet"\|<script' src/views/layouts/master.twig   # blocking head
grep -rn "addEventListener('scroll'" src/assets/js         # rAF or IO, no thrash
grep -rn 'import(' src/assets/js                           # on-demand chunks still on demand
grep -rn "'unload'\|no-store" src/assets/js                # bfcache blockers
```

---

## 15. Known findings in the current code (2026-11-09)

| # | file:line | Rule | Effect | Severity |
|---|---|---|---|---|
| 1 | `src/views/components/home/unix-collection-overlay.twig:83-84` | §6.1.5 raw URL, no `cdn`, no `srcset` | full-size uploads on mobile (lazy, below fold: bytes, not LCP) | medium |
| 2 | `src/views/components/home/unix-featured-products.twig:100` | §6.1.5 raw `media`, no `srcset` | same | medium |
| 3 | `src/views/components/home/unix-hero.twig:105-110` | §7.3 no `poster`; image optional | video-only hero has no image LCP | medium (merchant rule mitigates) |
| 4 | `src/assets/styles/04-components/unix-hero.scss:106` (+ `unix-tokens.scss:129`) | §3.3.7 hero text fades from opacity 0 over 800ms | if the h1 is LCP (no image, or full-viewport image excluded) LCP waits for the fade | medium, verify LCP element in PSI |
| 5 | `src/views/layouts/master.twig:93` | §8.9 unused render-blocking `theme.font.path` CSS | one blocking request | low–medium, pending 6.6 |
| 6 | `src/views/layouts/master.twig:99,101` | §8.2 third-party render-blocking font CSS | 1 extra origin + blocking CSS | low–medium, A/B self-hosting |
| 7 | `src/assets/js/brands.js:13` | §5.5 scroll handler without rAF | class toggles every scroll event | low (brands page only) |
| 8 | `src/views/components/product/unix-gallery.twig:83,93` | §3.3.3 later slides could take `fetchpriority="low"` | minor contention on PDP | low, only if PSI shows it |
| 9 | none (bfcache) | §10.3 no `pageshow`/`persisted` handling | stale cart count after Back | low, verify |

---

## Sources

- web.dev Learn Performance: https://web.dev/learn/performance/image-performance ·
  https://web.dev/learn/performance/video-performance · https://web.dev/learn/performance/optimize-web-fonts ·
  https://web.dev/learn/performance/resource-hints · https://web.dev/learn/performance/understanding-the-critical-path
- Core Web Vitals: https://web.dev/articles/lcp · https://web.dev/articles/optimize-lcp ·
  https://web.dev/articles/cls · https://web.dev/articles/optimize-cls · https://web.dev/articles/inp ·
  https://web.dev/articles/optimize-inp · https://web.dev/articles/optimize-long-tasks
- Loading: https://web.dev/articles/fetch-priority · https://web.dev/articles/lazy-loading-video ·
  https://web.dev/articles/font-best-practices · https://web.dev/articles/serve-responsive-images ·
  https://web.dev/articles/choose-the-right-image-format · https://web.dev/articles/bfcache ·
  https://web.dev/articles/optimizing-content-efficiency-loading-third-party-javascript
- Tools: https://developer.chrome.com/docs/lighthouse/performance/performance-scoring ·
  https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md ·
  https://developer.chrome.com/docs/lighthouse/performance/uses-optimized-images ·
  https://developer.chrome.com/docs/lighthouse/performance/uses-responsive-images ·
  https://developer.chrome.com/docs/lighthouse/performance/total-byte-weight ·
  https://developers.google.com/speed/docs/insights/v5/about · https://developer.chrome.com/docs/crux/methodology
- Media/fonts: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Video_codecs ·
  https://developers.google.com/fonts/docs/css2
- Salla: https://docs.salla.dev/421929m0 (helpers/filters, `cdn`) · https://docs.salla.dev/422610m0.md
  (Twilight SDK) · https://docs.salla.dev/twilight-engine/hooks-overview (hooks)
