# Lessons learned (UNIX Salla theme)

Every agent reads this before building or reviewing. Each lesson is a real bug or rework we already paid for, with the commit that fixed it. **When you fix a new bug, add a lesson here in the same commit.**

Format: what went wrong · the rule now · how to check · commit.

## Salla components and runtime
1. **A `salla-*` component hid its slot with a class the theme never styled.** `salla-add-product-button` wraps the slot in `<span class="s-hidden">` for `out-and-notify`. Our CSS had no `.s-hidden`, so «نفدت الكمية» showed twice. · Rule: when a component renders twice or shows something it shouldn't, inspect its light-DOM wrappers and check that the theme styles every `s-*` utility class it relies on. · Check: `grep -rn "s-hidden" src/assets/styles`. · 0c2f657
2. **`salla.lang` doesn't contain theme keys.** The size finder and card heart showed raw keys. · Rule: JS strings fall back to the bundled locale strings, not just `salla.lang.get`. · 8a9bc20
3. **Salla's own labels are masculine.** The card add-to-cart used Salla's «أضف للسلة». · Rule: pass the theme's feminine `trans()` label into `salla-*` components wherever they accept a label or slot. · 46759ed
4. **Carousel navigation didn't attach when a tab rendered late.** · Rule: wait for `componentOnReady()` and retry once per instance; never assume a web component is upgraded at `DOMContentLoaded`. · ebc5464, bfa39b0
5. **Checkout button could stay locked.** Listeners were added on every render, and a failed request never released the lock. · Rule: register listeners once, release on `.catch`, add a timeout (15s), and release on `pageshow` (bfcache). · fc06a49, b058ba7
6. **Product card heart styled the outer host, not the real button.** · Rule: style and set `aria-pressed` on the inner `<button>` that receives focus, and revert the state if the API call fails. · e465d64
22. **Merchant text went into `innerHTML` unescaped.** The add-to-cart toast printed option names and values (`${opt.name}: ${opt.value}`), and the product card printed the name, subtitle, preorder label and promotion title raw, so a merchant-entered `<img onerror>` would run (Salla TECH 2.4). · Rule: every API string or URL interpolated into a JS template goes through the component's `escapeHTML()`, attributes included; only theme-owned strings and `salla.money()` output skip it. · Check: `grep -n '\${this.product\|\${opt' src/assets/js/partials/*.js` and confirm each hit is wrapped. · 6.1 KB audit (2026-11-09)

## Twig
7. **A nested Twig comment turned a usage example into a live self-include.** Twig comments don't nest; `{# … {# … #} … #}` closes early. · Rule: never put `{# #}` inside a comment. · Check: `pnpm twig:check`. · d9d4a01, 51f192e
8. **`|date` on a missing value crashed the JSON-LD.** · Rule: guard every optional field before a filter (`{% if x %}` or `|default('')`). · 4f111fd, d0246a1
9. **PHP-Twig arrow functions broke our checker, not Salla.** · Rule: keep `scripts/twig-check.mjs` in sync with what Salla's Twig supports. · 38dab65
10. **Empty editor fields rendered blank sections.** · Rule: an empty field shows the unix.sa default (D115); test every component with all fields empty. · cdcf732, 0530d70

## Parity with unix.sa
11. **We guessed sizes and ratios instead of measuring.** Card images, page edge, gaps and heading sizes were redone 3 times. · Rule: measure on live unix.sa (DevTools computed styles at 390px and 1440px) or read `reference/shopify-theme/` before building. Never eyeball. · 42c1b7a, c4b8052, 3286f4b
12. **A setting that looked like a theme bug was the demo store's setting.** Breadcrumbs showed because the demo store had them on; the code default was correct. · Rule: before "fixing" what you see in preview, check the editor settings on the demo store. · 3baa30c
13. **Editor section names didn't say which theme they belong to.** · Rule: every component title starts with «يونكس · » / "UNIX · ". · 3baa30c

## Copy and i18n
14. **Masculine Arabic slipped into dashboard labels.** · Rule: every Arabic string addresses the shopper in the feminine voice; reviewers grep new keys in `ar.json`. · b68e5c8, b8a7691
15. **Price row showed «0 ﷼».** · Rule: price, sale price and "from" rows are mutually exclusive, and a zero or missing value renders nothing. · e9ecaf9

## Accessibility
16. **Touch targets under 44px on cards and filters.** · Rule: 44×44px minimum hit area in AR and EN (D114). · ebb078c
17. **Sold-out state was shown with opacity and greyscale only.** Low contrast, and colour isn't enough. · Rule: sold-out uses `--c-text-muted` plus text («نفدت الكمية»), never opacity. · 35a6e31, 0c2f657
23. **Product card had two or three tab stops to the same URL, and the first was named by the merchant's image alt** («IMG_2041»). · Rule: one focusable link per card, named by the product name (the title link); the image link and the full-image overlay link are `tabindex="-1" aria-hidden="true"` (A11Y R17.1–17.2). · Check: `grep -n 'href="\${' src/assets/js/partials/product-card.js`. · 6.1 KB audit (2026-11-09)
24. **We claimed the announcement bar met WCAG 2.2.2 because it paused on hover and focus.** The Understanding doc says hover/focus-only pausing is not a mechanism. · Rule: anything that moves or auto-updates for more than 5s gets a visible pause/stop button (fixed name + `aria-pressed`, 44px hit area), and the pause holds until the shopper presses it again. · Check: `grep -rn "setTimeout\|setInterval" src/assets/js/partials` and confirm each rotating UI has a toggle. · 6.3 KB audit (2026-11-09)
25. **Raed's `.btn--collapse` (PDP add note / upload file) never exposed its state, and the closed panel's textarea stayed a hidden tab stop** (opacity 0 only). · Rule: every disclosure trigger gets `aria-expanded` + `aria-controls` kept in sync by the JS, and a collapsed panel is `visibility: hidden` (or `hidden`/`inert`), never just transparent. · Check: `grep -rn "btn--collapse\|data-show=" src/views`. · 6.3 KB audit (2026-11-09)
26. **Tabbing backwards could put the focused element under the fixed header or the mobile sticky add-to-cart bar** (WCAG 2.4.11). · Rule: `html` carries `scroll-padding-block-start: var(--header-h)` and, on the PDP below 576, `scroll-padding-block-end: var(--sticky-atc-h)`; any new fixed bar adds its height there. · Check: `grep -rn "scroll-padding" src/assets/styles`. · 6.3 KB audit (2026-11-09)

## Performance
18. **The LCP image path pointed to a size Salla's CDN didn't serve well.** · Rule: images go through `|cdn(width)` with a real `srcset`; preconnects come before stylesheets in `master.twig`. · 27abcc0
27. **Two home sections still printed raw merchant image URLs** (`unix-collection-overlay`, `unix-featured-products`), so phones downloaded the full upload. · Rule: no `src="{{ url }}"` for a merchant or product image; always `|cdn(width)` with `srcset`/`sizes` matching the CSS width, and guard empty or object values first (`|default('')|trim`, `is iterable`). When JS swaps `src` later, remove `srcset` first. · Check: `grep -rnE 'src="\{\{ ?[a-z_.]+ ?\}\}"' src/views`. · 6.2 KB audit (2026-11-09)
28. **The hero `<video>` had no `poster`.** · Rule: a video gets the fallback image as `poster`, reusing a URL the page already downloads (the img `src`, or `currentSrc` in JS) so it costs no extra request. · Check: `grep -rn '<video' -A8 src/views | grep poster`. · 6.2 KB audit (2026-11-09)
19. **Preview images hot-linked from places Salla's reviewers can't load.** · Rule: images in `twilight.json` previews use the jsDelivr `@main/public/images/previews/` path. · fc06a49

## Process
20. **The CLI asked to commit while an agent was mid-edit,** and a preview requested an unpushed commit ("Tag already exists"). · Rule: `salla theme preview` only after a clean, pushed tree, and only from the project folder. · Session 2026-11-09
21. **Inherited Raed CSS used raw colours and physical properties** and failed the design gate late. · Rule: any file touched from Raed is converted to tokens and logical properties in the same commit. · 52ec05b
