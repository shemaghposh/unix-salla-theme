# UNIX Theme: Performance (ROADMAP 6.2)

Targets (ROADMAP 6.2 and the Phase 2 DoD): Lighthouse Mobile Performance at least 85, theme JS under
150KB gzip per page, LCP under 2.5s, CLS under 0.05.

This file records what each page loads, what 6.2 changed and why, and the numbers still to be measured.
The audit was done by reading the source and the last committed build in `public/`. Nothing was built on
the `feat/6.2-performance` branch, so the "after" sizes below are estimates until `pnpm prod` runs.

---

## 1. What loads where

| Asset | Loaded on | How | Before 6.2 (minified) |
|---|---|---|---|
| `app.css` | every page | `<link>` in `<head>`, render-blocking | 330,901 B in `public/` (444KB per the main session's latest build) |
| `fonts/sallaicons.css` (Salla CDN) | every page | `<link>`, render-blocking | Salla's file |
| `theme.font.path` (Salla dashboard font CSS) | every page | `<link>`, render-blocking | Salla's file (see §5, kept) |
| Google Fonts CSS | every page | `<link>`, render-blocking, preconnected, `display=swap` | both families on every page |
| `Somar-Bold.woff2` | pages with Arabic headings | `@font-face` in `unix-tokens.scss`, `swap`, Arabic `unicode-range` | 35,752 B |
| `product-card.js`, `main-menu.js`, `add-product-toast.js` | every page | `defer` in `<head>` | 10.9KB, 7.7KB, 7.4KB |
| `app.js` (+ `wishlist.js`, `blog.js`) | every page | `defer` at the end of `<body>` | 113,768 B |
| `home.js` | home | page `scripts` block | 46,548 B |
| `product.js` (+ `products.js`) | product page and product listings | page `scripts` block | 68,280 B |
| `checkout.js`, `account.js`, `order.js`, `pages.js`, `testimonials.js` | their pages | page `scripts` block | 6.2KB, 1.6KB, 1KB, 2KB, 0.9KB |

### Biggest sources found

**CSS**
1. **`postcss-preset-env` with no browserslist.** The default query includes Opera Mini, so preset-env
   turned on every fallback:
   - **RTL bug.** `logical-properties-and-values` (postcss-logical) rewrites each logical property to
     one physical side, left-to-right. In the built `public/app.css`, for example:
     - `inset-inline-start: 0` on the start-side drawer became `left: 0`;
     - `margin-inline-start` on the menu chevron became `margin-left`;
     - `inset-inline-end` on the cart badge became `right`.

     In the Arabic store, every `inline-start/end` rule in the `unix-*` components rendered on the
     wrong side.
   - **Duplicated declarations.** `custom-properties` wrote a static fallback before every `var()`
     declaration, for example `color:#373542;color:var(--c-action)`. Nearly every `unix-*` declaration
     uses a token, so this roughly doubled those rules. Extra vendor prefixes (`-o-object-fit`, …) and
     `:not(.does-not-exist)` specificity hacks were added on top.
2. **Dead Raed partials and selectors** (§3).
3. **Tailwind.** The `content` globs (`src/views/**/*.twig`, `src/assets/js/**/*.js`) were already tight,
   with no safelist. `@tailwindcss/line-clamp` duplicated utilities that have been in the Tailwind core
   since 3.3 (3.4 is installed). `@tailwindcss/forms` stays because `.form-input`, `.form-select` and
   Salla's form controls rely on its base reset.

**JS**
1. **`sweetalert2`** resolves to `sweetalert2.esm.all.js`, about 79KB minified with its CSS-in-JS. That
   was roughly two-thirds of `app.js`, on every page, and it is only used to show Salla notifications.
2. **`animejs`** (about 17KB minified) was in `app.js` on every page. Raed's `app.anime()` helper also
   exposed it as a global (`window.anime`). Nothing calls `app.anime()`, but two page scripts use the
   global directly:
   - `blog.js` uses it for the like-count tween;
   - `loyalty.js` uses it for the star spin and points count-up (DS §8.45).
3. **`fslightbox`** (31KB minified) was in `home.js`. No home block renders `[data-fslightbox]`. It was
   also loaded eagerly in `product.js`, where only video slides use it.
4. **`lite-youtube-embed`** was in `product.js`, but no product view renders `<lite-youtube>`.
5. **Babel** used the same default browserslist, so all theme JS was transpiled to ES5. That means
   classes, arrow functions, async/await and spread were all rewritten, with helpers added.

---

## 2. Build targets (commit `perf(6.2): modern browserslist…`)

- `package.json → browserslist`: Chrome, Edge and Firefox 100+, Android Chrome and Firefox 100+,
  Safari and iOS 15.4+, Samsung Internet 19+, Opera 86+. The theme already relies on `:has()`, `svh`
  and `dvh`, and `color-mix()`, and Salla's web components are ES modules, so older browsers were
  never fully supported.
- `postcss.config.js`: `'logical-properties-and-values': false` is set explicitly. Logical properties
  reach the browser as written whatever the targets are, so RTL can't regress through the build again.
- Effects:
  - The RTL rules are fixed: inline-start and inline-end follow `dir`.
  - Custom-property fallbacks and most prefixes go away.
  - Babel stops emitting ES5.
- **Visual note:** this is the one 6.2 change that alters rendering. Every `unix-*` rule that uses
  `*-inline-start/end` now lands on the side the DS intends in Arabic. Before, it was mirrored to the
  left-to-right side. Check this in the preview (§7).

## 3. Dead CSS removed (commit `perf(6.2): remove dead Raed SCSS…`)

Each selector below was grepped in three places: `src/views`, `src/assets/js`, and the markup that
`node_modules/@salla.sa/twilight-components/dist/components` renders. None of them matched in any of
the three, and no `@apply` depends on them.

| File | Removed |
|---|---|
| `01-settings/fonts.scss` | whole file (empty) |
| `04-components/filters.scss` | whole file (empty) |
| `04-components/menus.scss` | whole file (comment only) |
| `04-components/user-menu.scss` | whole file: `.dropdown__trigger`, `.dropdown__menu`, `.dropdown-toggler`, `.cat-filter` |
| `05-utilities/font-customization.scss` | whole file: `.btn--add-to-cart` |
| `02-generic/common.scss` | `.remove-item-btn`, `.no-scrollbar`, `.grid-trigger`, `.basis-0`, `.gradient-bg`, `.cart-submit-wrap`, `.blog-category`, `.slide-in-start` |
| `04-components/user-pages.scss` | `.order-file`, `.profile-header`, `.rating-header`, `.thankyou-breadcrumbs`, `.thankyou-block`, `.blog-single` |
| `04-components/product.scss` | `.share-btns-list`, `.pie-wrapper`, `.model-viewer-wrapper`, `.switcher-3d-view`, `.magnify-wrapper` |
| `03-elements/buttons.scss` | `.btn--delete`, `--quantity`, `__text`, `--rounded-gray`, `--circle-gray`, `--icon`, `--share`, `--danger`, `button.btn--coupon`, `salla-button.has-coupon/.has-not-coupon`, `.link--primary` |

**Kept on purpose.** These are used by Salla components, by our views, or by `@apply`:

- **Used by twilight-components:**
  - `.tooltip-content` and `.icon-trigger` (`tooltip.scss`)
  - `.single-order-header-item` and `.s-file-upload-profile-image`
  - `.spinner-loader`, `.hide-scroll`, `.flip-x`, `.cart-thumb`, `.copy-icon`
  - `.s-verify-back`, `.s-rating-modal-wrap`, `.s-localization-modal-inner`
  - `.btn--close` and `.btn--close-sm`, `.btn--wishlist`, `.rounded-icon`
  - `.rtl-range-*`, `.swiper-lazy`, and the `rubberBand` keyframes
- **Re-skinned in `unix-controls.scss`:** `.btn--primary`, `.btn--outline*`.
- **Applied from other rules:** `.btn--rounded-full` and `.grow-0`, via `@apply` in `home-blocks.scss`
  and `buttons.scss`.
- **Raed home blocks the merchant can still add:** `home-blocks.scss`, `slider.scss`,
  `testimonials.scss`, `brands.scss`, `loyalty.scss`, `gifting.scss`. Removing them waits on decisions
  about which Raed blocks stay in `twilight.json`.
- **Not decided:**
  - `.s-app-install-banner`: its markup comes from Salla's runtime, not the npm package, so it could not
    be proven dead.
  - `.tag`: the generic name has too many false hits to prove it unused.
  - `virtooal.scss`: the try-on app injects that markup.

## 4. JS (commit `perf(6.2): load SweetAlert2 and fslightbox on demand…`)

| Change | Where | Safe because |
|---|---|---|
| SweetAlert2 loads through `import()`, and the promise is cached | `app.js` | The notifier already returned a promise. Same `Swal.fire` and `mixin` options. A failed load is retried on the next notification. |
| Warm cache | `app.js` | After `load`, `requestIdleCallback` (or a `setTimeout` fallback) fetches the chunk, so the first toast doesn't wait on the network. This is off the critical path, and errors are ignored. |
| `fallbackNotify()` | `app.js`, DS §10 | If the chunk can't load, errors and object (confirm or modal) messages fall back to `alert()` with markup stripped by `DOMParser`. Success and info toasts are only logged. Both return paths `.catch()` into it, and the object path keeps `.then(type)` after the catch. |
| `app.anime()`, `partials/anime.js` and the `window.anime` global removed from `app.js` | `app.js` | Nothing calls `app.anime()`; the only mention is a commented-out line in `cart.js`. The global had two users. The first fix missed both, and the reviewer caught it. |
| Blog like count is now a plain text update | `blog.js` | Same number, without the tween and scale. The reduced-motion branch only guarded the scale, so it is gone. |
| `animejs` loads through `import()` on the loyalty page only | `loyalty.js` (`pages` entry), `package.json` keeps `animejs` | Same timeline. Under reduced motion, or if the chunk fails to load, the final points show without animation. |
| `initiateDropdowns()` removed | `app.js` | No markup renders `.dropdown__trigger`. Its styles went in §3. |
| fslightbox import removed | `home.js` | `[data-fslightbox]` only exists in `product/unix-gallery.twig`, and no Salla component reads `window.fslightbox`. |
| fslightbox loads through `import()` only when `[data-fslightbox]` exists | `product.js` | On import, fslightbox scans the page itself, the same as the static import did. |
| `lite-youtube-embed` import removed | `product.js` | No `<lite-youtube>` in product views. The YouTube home block keeps it in `home.js`. |

These are the first async chunks in the theme. webpack writes them as `[name].[contenthash].js` next to
the entries in `public/`, and `publicPath: 'auto'` loads them from the same CDN folder as the script that
asked for them.

**Recorded, not changed:**
- `product-card.js`, `main-menu.js` and `add-product-toast.js` are `defer` scripts in `<head>` that load on
  every page. They are small and needed by the header and cards.
- `wishlist.js` and `blog.js` are bundled into `app` on every page. Both are small and gate themselves
  by page.
- `unix-size-finder.js` (24KB source) and its model are bundled into `product.js`, which also serves
  product listings. It could become a chunk once the measured `product.js` size is known.

## 5. Loading audit (commit `perf(6.2): one Google Fonts family per language…`)

| Check | Result |
|---|---|
| Fonts use `font-display: swap` | Yes. Somar has `swap` and an Arabic-only `unicode-range`. Google Fonts uses `&display=swap`. |
| Google Fonts | **Fixed:** only the current language's family is requested (IBM Plex Sans Arabic or Open Sans), because `--font-main` uses just that one. Preconnects are kept. |
| Font preload | Not added. `Somar-Bold.woff2` is requested from `app.css` by a relative URL. A `<link rel=preload>` built with Twig's `asset` filter may resolve to a different URL (query string) and download twice. Try it only after checking the URL in the preview's network panel. |
| `fetchpriority="high"` only on the LCP image | **Fixed:** removed from the header logo on the product page (the gallery image is the LCP image) and from `home/fixed-banner.twig` (it was `lazy` and `high` together). The hero, gallery, collection banner, blog and cart first images keep `high`, per DS. |
| `loading="lazy"` elsewhere | Yes in the `unix-*` views that were checked: images outside the LCP slot are `lazy`, and hero and video-tile videos load after `window.load` or when near the viewport (DS §8.1, §8.16). The header logo is `eager` by design (DS §6). Phase 6.3 or 6.4 should do a full pass over the older Raed home blocks. |
| Render-blocking third-party in `master.twig` | Google Fonts CSS (kept blocking: an async swap would add font-swap CLS risk against the 0.05 budget; A/B it in Lighthouse). Salla's `sallaicons.css` is needed. Salla's `theme.font.path` CSS is **kept but unused**: `--font-main` overrides the dashboard font, so its font files never download, but the CSS request still blocks. Remove it after confirming that Salla's theme review doesn't require it. |
| Scripts | All theme scripts are `defer`. There is one small inline config `<script>`. |

## 6. Expected vs measured

The "expected" values below are estimates from reading the code. Fill in "measured" after `pnpm prod`
and Lighthouse runs on `salla theme preview`.

| Metric | Before | Expected after 6.2 | Measured |
|---|---|---|---|
| `app.css` (min) | 330.9KB (444KB reported) | about 230–270KB (fallbacks, prefixes and dead Raed CSS gone) | ⏳ |
| `app.js` (min) | 113.8KB | about 25–35KB (no Swal, no anime, modern Babel) | ⏳ |
| `sweetalert2.[hash].js` chunk | — | about 75–80KB, first notification only | ⏳ |
| `home.js` (min) | 46.5KB | about 10–15KB (no fslightbox, modern Babel) | ⏳ |
| `product.js` (min) | 68.3KB | about 30–35KB (fslightbox on demand, no lite-youtube) | ⏳ |
| `fslightbox.[hash].js` chunk | — | about 31KB, product pages with a video slide only | ⏳ |
| Theme JS per page (gz): home, PDP, PLP, cart | ⏳ | well under 150KB | ⏳ |
| Lighthouse Mobile Performance: home, PDP, PLP | ⏳ | at least 85 | ⏳ |
| LCP (mobile): home hero, PDP gallery | ⏳ | under 2.5s | ⏳ |
| CLS: home, PDP, PLP | ⏳ | under 0.05 | ⏳ |

## 7. Check in `salla theme preview`

1. **RTL sides (most important):**
   - the menu drawer opens from the right in Arabic and from the left in English;
   - the cart badge sits on the inline-end corner of the cart icon;
   - the mega-menu chevron sits after the label;
   - the PLP filter drawer and the cart drawer come from the sides their DS sections give (inline-start
     or inline-end);
   - account nav and order rows look correct.

   Compare against unix.sa. Before 6.2 the built CSS put all of these on the left-to-right side.
2. **Notifications:**
   - add to wishlist and log in or out: toasts appear (first one after a short chunk fetch);
   - a coupon error still shows the SweetAlert modal;
   - the network panel shows `sweetalert2.[hash].js` loading from the theme's CDN folder.
3. **Product with a video slide:**
   - clicking it opens fslightbox;
   - `fslightbox.[hash].js` loads only on such products.
4. **Home YouTube block** still plays (lite-youtube).
5. **English pages** use Open Sans and Arabic pages use IBM Plex Sans Arabic. There should be no
   fallback-font flash beyond the usual swap.
6. **Lighthouse mobile** on home, a PDP, a PLP and the cart: record the results in §6 and the ROADMAP
   6.2 row.
