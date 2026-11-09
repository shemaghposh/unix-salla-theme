# Salla Twilight: course notes for UNIX theme agents

Studied 2026-11-09 from primary sources only. For agents that build (`unix-theme-architect`) or review (`unix-design-reviewer`, `unix-code-reviewer`, `unix-launch-gatekeeper`) this theme.

**How to read a rule:** each rule has four parts: **Rule** · **Why** · **Check** (a grep or file in this repo) · **Source**.
Anything marked **UNVERIFIED** has no primary source behind it. The note says how to confirm it.

## 0. Sources and how to re-fetch them

- **Official docs:** docs.salla.dev publishes a Markdown copy of every page. Fetch `https://docs.salla.dev/llms.txt` for the index (813 pages), then fetch any page with a `.md` suffix (e.g. `https://docs.salla.dev/twilight-engine/technical-review.md`). This is faster and more complete than HTML scraping. A few SDK pages (`twilight-sdk/event.md`, `helpers.md`, `languages.md`) return the HTML app shell instead of Markdown. Read those with WebFetch.
- **Real behaviour of the SDK and web components:** the GitHub repos `SallaApp/twilight` and `SallaApp/twilight-components` are **not public** (GitHub API 404 on 2026-11-09). The ground truth is the npm packages Salla publishes, which are already installed here:
  - `node_modules/@salla.sa/twilight` (2.14.612). Types are in `types/` (`types/event/*.d.ts`, `types/api/**`).
  - `node_modules/@salla.sa/twilight-components` (2.14.612). Every prop, event and slot is in `dist/docs.json` (149 components). Render source is in `dist/collection/components/<tag>/<tag>.js`.
  - The storefront injects the *latest* versions at runtime, not these exact ones. Re-check after `pnpm update`.
- **Starter theme:** https://github.com/SallaApp/theme-raed (`master`, v1.358.0). Our base is commit `98515ac` (NOTICE.md). Upstream is only 3 commits ahead as of 2026-11-09: refund receipt, plus two "Update theme configuration" commits.

Source keys used below:

| Key | URL |
|---|---|
| JSON | https://docs.salla.dev/twilight-engine/twilight-json.md |
| DIR | https://docs.salla.dev/twilight-engine/directory-structure.md |
| SETUP | https://docs.salla.dev/twilight-engine/setup-theme.md |
| HOME | https://docs.salla.dev/twilight-engine/home-page.md |
| PAGES | https://docs.salla.dev/twilight-engine/pages-overview.md |
| PDP | https://docs.salla.dev/twilight-engine/single-product.md |
| TWIG | https://docs.salla.dev/twilight-engine/flavoured-twig.md |
| L10N | https://docs.salla.dev/twilight-engine/localizations.md |
| MASTER | https://docs.salla.dev/twilight-engine/master-layouts.md |
| HOOKS | https://docs.salla.dev/twilight-engine/hooks-template.md |
| CSSVAR | https://docs.salla.dev/twilight-engine/css-variables.md |
| FONTS | https://docs.salla.dev/twilight-engine/custom-fonts.md |
| DEV | https://docs.salla.dev/twilight-engine/develop-theme.md |
| PUB | https://docs.salla.dev/twilight-engine/publish-theme.md |
| REQ | https://docs.salla.dev/twilight-engine/requirments-overview.md |
| MAINREQ | https://docs.salla.dev/twilight-engine/main-requirements-review.md |
| TECH | https://docs.salla.dev/twilight-engine/technical-review.md |
| UX | https://docs.salla.dev/twilight-engine/uxui-review.md |
| META | https://docs.salla.dev/twilight-engine/metadata-review.md |
| PRELAUNCH | https://docs.salla.dev/twilight-engine/prelaunch-review.md |
| CHLOG | https://docs.salla.dev/twilight-engine/changelog.md |
| CLI-PREVIEW | https://docs.salla.dev/salla-cli/themes-commands-preview.md |
| CLI-PUBLISH | https://docs.salla.dev/salla-cli/themes-commands-publish.md |
| CLI-TROUBLE | https://docs.salla.dev/salla-cli/troubleshooting.md |
| SDK | https://docs.salla.dev/twilight-sdk/overview.md |
| EVT | https://docs.salla.dev/twilight-sdk/event.md |
| CFG | https://docs.salla.dev/twilight-sdk/configuration.md |
| STORAGE | https://docs.salla.dev/twilight-sdk/storage.md |
| CART-ADD | https://docs.salla.dev/twilight-sdk/cart-add-item.md |
| WISH | https://docs.salla.dev/twilight-sdk/wishlist-toggle.md |
| WC-USAGE | https://docs.salla.dev/twilight-js-components/usage.md |
| WC-CUST | https://docs.salla.dev/twilight-js-components/customization.md |
| PKG-SDK | `node_modules/@salla.sa/twilight/types` (npm, published by Salla) |
| PKG-WC | `node_modules/@salla.sa/twilight-components/dist` (npm, published by Salla) |
| RAED | https://github.com/SallaApp/theme-raed |

---

## 1. Directory structure and page templates

1. **Rule:** Page templates have fixed names and paths: `src/views/pages/{index,cart,loyalty,page-single,thank-you}.twig`, `pages/product/{index,single}.twig`, `pages/blog/{index,single}.twig`, `pages/brands/{index,single}.twig`, `pages/customer/{profile,notifications,wishlist}.twig` and `pages/customer/orders/{index,single}.twig`. "The pre-defined pages' names and paths are **not changeable**."
   **Why:** The engine resolves routes to these exact files. A renamed file means a blank or 404 page.
   **Check:** `find src/views/pages -name '*.twig' | sort`. On 2026-11-09 it matched Raed's set exactly (plus `customer/wallet.twig`, `testimonials.twig` and `partials/`).
   **Source:** PAGES, DIR.
2. **Rule:** The master layout lives at `src/views/layouts/master.twig`. Locales are `src/locales/<code>.json`. Components live under `src/views/components/**`.
   **Why:** The engine and the Partners Portal look in these places.
   **Check:** `ls src/views/layouts src/locales`.
   **Source:** DIR, MASTER, L10N.
3. **Rule:** Pages extend `"layouts.master"` and fill the blocks `styles`, `head`, `content` and `scripts`. Page JS goes in `{% block scripts %}` as a deferred `<script>` loaded through `|asset` (or `asset()`).
   **Why:** It is the documented shape. Hooks and SEO rely on the master layout.
   **Check:** `grep -n "block scripts" -A2 src/views/pages/index.twig`.
   **Source:** MASTER, HOME.
4. **Rule:** The home page renders merchant-arranged sections through `{% component home %}`. The partner or merchant shows and hides each Theme Feature and Theme Component from the portal or editor. A hard-coded static home is allowed but "highly advised" against.
   **Why:** Merchant flexibility. Static content ignores store settings.
   **Check:** `grep -n "component home" src/views/pages/index.twig`.
   **Source:** HOME.

## 2. twilight.json

5. **Rule:** `twilight.json` sits in the repo root. It holds author info, `settings` (global), `features` and `components` (custom). The documented author keys are `version`, `theme_name`, `repo_url` and `support_url`. Raed actually uses `name`, `repository`, `author_email` and `support_url`, and so do we.
   **Why:** The portal syncs the theme definition from this file through GitHub.
   **Check:** `head -10 twilight.json; tail -8 twilight.json`.
   **Source:** JSON, SETUP, RAED `twilight.json`.
6. **Rule:** Settings are read with `theme.settings.get("<id>")`, which takes an optional default as its second argument (Raed usage). A type of `string` with `format: hidden` stores a non-editable value.
   **Why:** This is the only documented accessor.
   **Check:** `grep -rn "theme.settings.get" src/views | head`.
   **Source:** JSON, MASTER.
7. **Rule:** `features` lists built-in items. Pre-defined home components carry the `component-` prefix (e.g. `component-youtube`). "Developer must remove the Theme Features that will not be used in the theme."
   **Why:** Unused features show up in the merchant editor and render Raed sections we never styled.
   **Check:** `node -e 'console.log(require("./twilight.json").features)'`. Ours is `mega-menu, fonts, breadcrumb, unite-cards-height, menu-images, filters`, with no `component-*`. OK.
   **Source:** HOME, JSON.
8. **Rule:** A custom component needs `name`, `title`, `icon` (a `sicon-*`), `path` and `fields`. `path: "home.x"` maps to `src/views/components/home/x.twig`. Components may live anywhere under `src/views/components/`.
   **Why:** A missing file breaks the editor and the page.
   **Check:** `for p in $(grep -o '"path": "[^"]*"' twilight.json | cut -d'"' -f4); do test -f "src/views/components/$(echo $p|tr . /).twig" || echo MISSING $p; done`. All 9 resolved on 2026-11-09.
   **Source:** JSON, HOME.
9. **Rule:** The portal documents only these field kinds: **String, Numeric, Boolean, List**, plus **Collection** ("a group of fields that has a mix of the four"). Doc examples show `type`/`format` pairs `boolean/switch`, `string/image`, `string/textarea`, `string/hidden`, `collection/collection` (with `minLength`/`maxLength` on the item count, and `required`), `dropdown-list` and `url`.
   **Why:** Only use formats the editor knows.
   **Check:** `grep -o '"format": *"[a-z-]*"' twilight.json | sort | uniq -c`.
   **Source:** SETUP, JSON, HOME.
   - UNVERIFIED: no official page lists every `format` (e.g. `variable-list`, `items`, `static`, `title`, `line`, `description`, `icon`, `integer`, `collection` with `source`). These are taken from RAED's `twilight.json`, which uses all of them, so they work in practice. To check, open the portal's component settings editor and see which field kinds it offers.
   - **No video upload field is documented.** The only media format in the docs is `image`. Our videos are MP4 **URL text fields** (`twilight.json` ids `video_desktop`, `video_mobile`, `tiles.video`, all `string/text`). Keep it that way unless Salla documents a video format. UNVERIFIED whether the `image` uploader accepts video. Try it in the demo store editor before relying on it.
10. **Rule:** Field and string lengths: TECH 1.4 says "Validate `Length` in Twilight *(Maximum is `1000`)*".
    **Why:** It is a technical-review item, so it can cause rejection.
    **Check:** `grep -o '"maxLength": *[0-9]*' twilight.json | sort | uniq -c`.
    **Source:** TECH.
    - **Possible violation:** 7 settings declare more than 1000: `twilight.json:606` (`unix_colour_links`, 20000), `:630` (`unix_size_finder_data`, 20000), `:680`, `:708`, `:764` (delivery cities, 2000), `:736` (4000) and `:816` (`unix_complete_look_data`, 20000). The wording is ambiguous: it may mean the `maxLength` we declare or the length of the saved value. Treat both as a risk.
11. **Rule:** Multilingual text fields use `"multilanguage": true` (Raed uses it on 10 fields). In Twig, the value can come back as a per-language object. Our code reads `value[language.code]` (`src/views/components/home/unix-faq.twig:43`).
    **Why:** Without the guard, AR/EN content leaks across languages or prints "Array".
    **Check:** `grep -rn "language.code" src/views/components`.
    **Source:** RAED `twilight.json`. The Twig value shape is UNVERIFIED in the docs; confirm it by dumping `component` in preview.
12. **Rule:** Merchant settings must not be able to inject HTML (see §8 rule 46). A `static` setting's `value` HTML is authored by us, not by the merchant, and follows the Raed pattern.
    **Check:** `grep -n '"type": "static"' -A4 twilight.json | grep value`.
    **Source:** TECH 2.4, RAED.

## 3. Twig helpers and filters (Twilight-flavoured)

13. **Rule:** The helpers are `trans(key, replace=[], locale)`, `pluralize(key, count)`, `link(url, params)`, `page('cart')`, `is_page('product.single')`, `is_current_url(pattern)` and `old(name)`. Nothing else is documented. Do not invent helpers.
    **Source:** TWIG.
14. **Rule:** The filters are `asset` (theme files, e.g. `'app.css'|asset`), `cdn` (Salla pre-defined files such as fonts and `fonts/sallaicons.css`), `currency` and its alias `money`, `date` (localized; overrides Twig's), `number` (Arabic digits when the merchant enables them), `time_ago`, `is_placeholder`, `camel_case`, `kebab_case`, `snake_case` and `studly_case`.
    **Why:** `asset` resolves to the theme's deployed path. A hard-coded `/public/...` URL breaks in preview and in production.
    **Check:** `grep -rn "src=\"/\|href=\"/public" src/views` (expect nothing); `grep -n "|asset\||cdn" src/views/layouts/master.twig`.
    **Source:** TWIG.
15. **Rule:** Use `theme.set('placeholder', 'images/…')` to override the placeholder image and `|is_placeholder` to detect it. `theme.set()` is also how a request-scoped flag can be written (we use `unix_runtime_home_h1`).
    **Source:** TWIG (placeholder). That `theme.set` works as a general runtime flag is UNVERIFIED in the docs; it is observed working in our `pages/index.twig`.
16. **Rule:** `{% component 'path' %}` renders a component, as in `{% component 'header.breadcrumbs' %}`, `'product.offer'`, `'comments'` and `'product.similar-products'`. CHLOG says to stop using `{% component 'header.menu' %}` and `{% component 'footer.menu' %}` and to use `<salla-menu>` instead.
    **Check:** `grep -rn "component 'header.menu'\|component 'footer.menu'" src/views` (expect none).
    **Source:** PDP, CHLOG.

## 4. Localization

17. **Rule:** Every UI string comes from `src/locales/*.json` through `trans()` (Twig) or `salla.lang.get()` (JS). "Theme should use localization and not static string."
    **Why:** It is a technical-review item (TECH 1.2), and our own CLAUDE.md requires it.
    **Check:** `grep -rnP '>\s*[\x{0600}-\x{06FF}][^<{]{2,}<' src/views` and `grep -rnP '>\s*[A-Za-z][A-Za-z ]{3,}\s*</' src/views`. Both were empty on 2026-11-09.
    **Source:** TECH, L10N.
18. **Rule:** "Arabic and English Languages should be supported when adding new keys". English is the fallback language.
    **Check:** this node script returned `ar-only 0 en-only 0` on 2026-11-09: `node -e 'const a=require("./src/locales/ar.json"),e=require("./src/locales/en.json");const f=(o,p="")=>Object.entries(o).flatMap(([k,v])=>typeof v=="object"?f(v,p+k+"."):[p+k]);const A=new Set(f(a)),E=new Set(f(e));console.log([...A].filter(k=>!E.has(k)),[...E].filter(k=>!A.has(k)))'`.
    **Source:** L10N.
19. **Rule:** Best practice is "All texts should be in 3 levels, eg. level1.level2.level3". Reuse platform keys (Localazy `twilight` project) before adding new ones. Overriding an existing key is allowed.
    **Why:** It is a soft rule. Our `blocks.unix.<area>.<key>` keys are 4 levels deep, which goes against the advice but is not listed as a rejection item.
    **Source:** L10N.
20. **Rule:** JS translations are loaded asynchronously. Read them only after `salla.lang.onLoaded()` (PKG-SDK `types/lib/lang.d.ts`: `onLoaded(cb?) => Promise<void>`, `get(key, replacements?, locale?)`).
    **Check:** `grep -rn "salla.lang.get" src/assets/js | head`, then confirm each call site is inside `onLoaded` or runs after a user action.
    **Source:** PKG-SDK.

## 5. Master layout, hooks, CSS variables, fonts

21. **Rule:** The master layout **must** include the hooks `head:start`, `head` and `head:end` inside `<head>`, `body:classes` in the body class, and `body:start` and `body:end`. Salla injects SEO meta through `head`, and the SDK plus web components through `body:end` (SDK: "`salla.init()` … called automatically … thanks to the body:end hook").
    **Why:** Without them, no SEO tags, no SDK and no apps.
    **Check:** `grep -n "hook" src/views/layouts/master.twig`. All present (lines 84, 86, 118, 120, 130, 140).
    **Source:** MASTER, HOOKS, SDK.
22. **Rule:** Keep the documented page hooks so that apps (Tabby, Tamara, reviews, etc.) can mount.
    - Product: `product:index.items.start/end`, `product:single.description(.start/.end)`, `product:single.form.start/end`.
    - Cart: `cart:items.start/end`, `cart:summary.start/end`, `cart:submit.start/end`.
    - Thank-you: `thank-you:start`, `thank-you:items.start/end`, `thank-you:end`.
    - Brands, blog and customer: as listed in HOOKS.
    - Every component automatically gets `component:{path}.start/.end`. Pages get `{page-slug}:start/end`.
    **Check:** `grep -rhoE "\{% hook '?[a-z:._-]+'? %\}" src/views | sort | uniq -c`.
    - **Resolved (6a527eb):** `cart:submit.start` and `cart:submit.end` now wrap `salla-cart-summary-card` in `src/views/pages/cart.twig` (Raed omits them).
    **Source:** HOOKS, PDP.
23. **Rule:** Twilight web components read `--font-main`, `--color-primary`, `--color-primary-dark`, `--color-primary-light` and `--color-primary-reverse` on `:root`. The developer may bind them to `theme.color.*` and `theme.font.*` (merchant-editable) **or set fixed values**, which "would prevent the merchant from altering the theme's typeface or color scheme".
    **Why:** Our D6 locks brand colours. That is an explicitly allowed pattern.
    **Check:** `grep -rn "\-\-color-primary" src/views/layouts/master.twig src/assets/styles | head`.
    **Source:** CSSVAR, WC-USAGE.
24. **Rule:** Custom fonts: copy them into `public/` with the webpack CopyPlugin and reference them through `|asset` in `@font-face`.
    **Check:** `ls public/fonts`; `grep -rn "Somar" src/views src/assets/styles | head`.
    **Source:** FONTS.

## 6. Web components (`salla-*`)

25. **Rule:** The engine injects the latest Twilight SDK and web components into every page. **Never bundle them.** Raed's `src/assets/js/twilight.js` is "just for IDE purpose, and it shouldn't be in webpack bundle output".
    **Why:** Bundling ships a duplicate, possibly older copy and breaks `customElements.define`. It also adds size.
    **Check:** `grep -n "twilight.js" webpack.config.js` (it must be in `exclude`, line 41); `grep -c "defineCustomElements" public/*.js` (expect 0).
    **Source:** SDK, WC-USAGE, `src/assets/js/twilight.js` header.
26. **Rule:** Only use props that exist (as attribute names in kebab-case). The full list per tag is in `node_modules/@salla.sa/twilight-components/dist/docs.json`.
    **Check:** run the attribute audit script below. On 2026-11-09 it found only Raed-inherited extras:
    - `modal-title` on `salla-modal` is not a declared prop, but the source reads `this.host.getAttribute('modal-title')` (salla-modal.js:74), so it works.
    - `loader-position` on `salla-add-product-button` is ignored (see rule 31).
    - `dateFormat` on `salla-datetime-picker` should be `date-format` (inherited from Raed `customer/profile.twig`).
    **Source:** PKG-WC.
    ```sh
    node -e 'const d=require("./node_modules/@salla.sa/twilight-components/dist/docs.json");const t=process.argv[1];console.log(d.components.find(c=>c.tag==t)?.props.map(p=>p.attr))' salla-slider
    ```
27. **Rule:** Listen to component custom events by their documented name. Examples from docs.json: `salla-modal` emits `modalVisibilityChanged` and `modalBack`; `salla-products-list` emits `productsFetched` and `selectionChanged`; `salla-product-options` and `salla-filters` emit `changed`; `salla-add-product-button` emits `success` and `failed`; `salla-slider` emits `afterInit`, `slideChange` and others; `salla-tel-input` emits `phoneEntered`; `salla-verify` emits `verified`. Use `customElements.whenDefined('salla-x')` (or `el.componentOnReady()`) before calling methods.
    **Source:** WC-USAGE, PKG-WC.
28. **Rule:** Slots exist only where docs.json lists them. Examples: `salla-slider` has `items` and `thumbs`; `salla-modal` has `footer` (and `loading`); `salla-user-menu` has `trigger` and `login-btn`; `salla-contacts` has `contact`; `salla-payments` has `cod`, `payment` and `sbc`; `salla-localization-modal` has `header`, `footer`, `language` and `currency`; `salla-gifting` has `widget-btn-content`. Children passed to a component **without** a matching slot are not rendered.
    **Check:** compare `slot="…"` in `src/views` with `docs.json`.
    **Source:** PKG-WC.
29. **Rule:** Style components by their public `s-*` classes and the CSS variables. Twilight components are Tailwind-based. Raed's safelist must stay in `tailwind.config.js` `content` so the component classes survive purging.
    **Check:** `grep -n "safe-list\|twilight-tailwind" tailwind.config.js`.
    **Source:** WC-CUST, WC-USAGE.
30. **Rule:** Price strings from `salla.money()` contain markup (the new SAR symbol). Write them with `innerHTML`, never `innerText` or `textContent`. CHLOG says "**Refactor Code**: Use `innerHTML` instead of `innerText` for displaying Cart/Product prices."
    **Check:** `grep -rn "money(" src/assets/js | grep -i "textContent\|innerText"` (none on 2026-11-09).
    **Source:** CHLOG (2.14.73, 2.14.122).

## 7. JS SDK (`salla.*`)

31. **Rule:** Wait for the SDK before you call it. `salla.onReady(cb)` resolves immediately when `salla.status === 'ready'`, and otherwise waits for `twilight::initiated` (from the minified source). The type comment says `onReady` "will be available even salla object is not loaded yet". `salla.isInitiated` is set when `twilight::initiated` fires.
    **Check:** `grep -rn "salla.onReady" src/assets/js` (app.js:255, main-menu.js:33, wishlist-card.js:23, unix-size-charts.js:188).
    **Source:** PKG-SDK `types/index.d.ts`, `dist/esm/index.js`.
32. **Rule:** Events: `salla.event.on(name, cb)`, `.once`, `.emit`/`.dispatch`, and module aliases `salla.event.<module>.on<Action>(cb)`. The SDK also exposes `salla.<module>.event.on<Action>` (e.g. `salla.cart.event.onItemAdded`). **`salla.event.onlyWhen(name)` runs immediately if the event has already fired.** `on` and `once` do not replay past events.
    **Why:** A listener registered after the event has fired never runs (see Gotchas).
    **Source:** EVT, SDK, PKG-SDK `types/event/*`.
33. **Rule:** These are the event names that actually exist; use them instead of guessing.
    - **Cart:** `onUpdated(cart_summary)`, `onItemAdded`, `onItemUpdated`, `onItemDeleted`, `onLatestFetched`, `onSubmitted`, `onDetailsFetched`, `onCouponAdded`, `onCouponDeleted`, `on*Failed` variants, and the `onQuickOrder*` and `onPriceQuote*` events.
    - **Product:** `onPriceUpdated` / `onPriceUpdateFailed` (string name `product::price.updated[.failed]`), `onSizeGuideFetched`, `onDetailFetched`, `onProductListFetchSucceeded`, `onProductOptionsFetched` and others.
    - **Wishlist:** only `onAdded`, `onRemoved`, `onAdditionFailed` and `onRemovingFailed`. There is **no toggle event**; `toggle` calls add or remove.
    - **Component-namespaced strings** found in the package: `salla-filters::changed`, `salla-filters::reset`, `filters::fetched`, `filters::hidden`, `salla-products-list::products.fetched`, `login::open`, `search::open`, `scopes::open`, `rating::open`, `rating::edit`, `rating::delete`, `size-guide::open`, `cart::submit.failed` and `Product Added` (analytics).
    **Check:** `grep -rlF "<event>" node_modules/@salla.sa/twilight-components/dist/collection node_modules/@salla.sa/twilight/dist`. Every event our code uses was found.
    **Source:** PKG-SDK `types/event/cart.d.ts`, `product.d.ts`, `wishlist.d.ts`; WISH.
34. **Rule:** API methods (PKG-SDK `types/api`):
    - **Cart:** `salla.cart.addItem({id, quantity, options:{optionId:valueId}, notes})`, `quickAdd`, `updateItem`, `deleteItem`, `details(cartId|null, ['options'|'attachments'])`, `latest()`, `getCurrentCartId()`, `submit()`, `addCoupon` and `deleteCoupon`.
    - **Product:** `salla.product.getPrice(id|FormData)`, `getSizeGuides(id)`, `fetch(query)`, `fetchOptions(ids)`.
    - **Wishlist:** `salla.wishlist.add`, `remove` and `toggle(id)`. These need an authenticated customer (WISH: "Payload `authenticated`").
    - **Order:** `salla.order.createCartFromOrder`.
    - **Menus:** `salla.api.component.getMenus()`.
    **Why:** Business logic must stay on these APIs (our CLAUDE.md rule).
    **Source:** PKG-SDK, CART-ADD, WISH, SDK.
35. **Rule:** Config: `salla.config.get('user.id')`, `salla.config.get('currencies.SAR.code')`, `salla.config.isGuest()` (used in Raed and in our code), `salla.config.currencies()` and `salla.config.languages()`. Storage is `salla.storage.get`/`set`/`remove` (localStorage). The wishlist cache key `salla::wishlist` is used by Raed.
    **Source:** CFG, STORAGE, RAED.
36. **Rule:** Inside a theme, never call `salla.init()`. The engine does it. Do not load `cdn.salla.network/js/twilight/...` yourself.
    **Check:** `grep -rn "salla.init(\|js/twilight/" src` (expect none).
    **Source:** SDK.
37. **Rule:** CHLOG says not to cast `form.id.value` to an integer in cart logic (Raed PR #638).
    **Check:** `grep -n "form.id.value" src/assets/js/cart.js` (line 105 compares without casting; OK).
    **Source:** CHLOG.

## 8. Salla CLI and workflow

38. **Rule:** `salla theme preview` (alias `salla theme p`) runs from the theme root. It requires `salla login` (Partners) and GitHub access via a PAT. It starts a local asset server, opens a preview browser on a demo store, watches files, hot-reloads, and **asks to commit and push** changes to the synced repo. Options: `--store=<name|id>`, `--with-editor`, `--browser=<name>`.
    **Why:** Preview commits to the synced repo. On this project, the user's memory says to keep commits deliberate.
    **Source:** CLI-PREVIEW, DEV.
39. **Rule:** Do not enable IDE auto-save during preview. Too many requests can get the IP blocked (`ETIMEDOUT`).
    **Source:** CLI-PREVIEW.
40. **Rule:** CLI troubleshooting:
    - If assets are not served from `localhost:8000`, choose the preview browser when the CLI prompts.
    - On a 404, try another demo store.
    - On "Non-existent Theme ID", run `salla login` again.
    - On "CLI Request Failure", reconnect GitHub with all permissions.
    **Source:** CLI-TROUBLE.
41. **Rule:** `webpack.config.js` must include the Twilight watcher: `new ThemeWatcher()` from `@salla.sa/twilight/watcher`.
    **Check:** `grep -n ThemeWatcher webpack.config.js` (line 3 is present; confirm it is in `plugins`).
    **Source:** DEV.
42. **Rule:** `salla theme publish` re-checks the code, commits, and requests publishing. Publishing can also be done from the portal ("Complete Theme publication" → listing → "Send publication request" with a Category and Changelog). **Every update, even for a private theme, needs a new publish request and a new review.**
    **Why:** Plan the timing: hotfixes after launch are not instant.
    **Source:** CLI-PUBLISH, PUB.
43. **Rule:** Read the warnings Salla writes into the latest commit message on the synced GitHub repo after each push.
    **Check:** `git log -1 origin/main` after a portal sync.
    **Source:** PUB.
44. **Rule:** Installation modes are public, beta and private. A private theme installs only through its installation link.
    **Source:** SETUP §9.

## 9. Performance and size requirements

45. **Rule:** Size limits: "Theme size should not exceed `1mb`" (TECH 1.1). MAINREQ 3.8 refines this: **public ≤ 1MB, private ≤ 2MB**. UNIX is private, so its limit is **2MB**.
    **Check:** `find public -type f -exec stat -f %z {} + | awk '{s+=$1} END {print s/1024 " KiB"}'`. On 2026-11-09: 1076.5 KiB built output, of which `public/images` is 425.6 KiB (mostly `public/images/previews/*.jpg` editor thumbnails).
    UNVERIFIED: what Salla measures (built `public/`, the whole repo, or source). The repo also tracks `reference/` (8.1 MB, 424 files) and `docs/`, about 11.75 MiB in total. If Salla measures the synced repo, we are far over the limit. Ask Salla support or test with a dry-run publish request. Moving the preview JPGs to jsDelivr only (already their URL) would trim `public/`.
    **Source:** TECH, MAINREQ.
46. **Rule:** The Lighthouse **average** across the home, product and collection pages, on desktop **and** mobile, must be at least 60 for performance and at least 90 for accessibility, measured on the default preview store. (Our internal budgets in DESIGN-SYSTEM and PERFORMANCE are stricter.)
    **Source:** TECH 2.1.
47. **Rule:** Count network requests. A request per product (or similar N+1 pattern) is a review flag.
    **Check:** `grep -rn "product.api.fetch\|getSizeGuides\|api.request" src/assets/js`. `unix-featured-products.js:90` makes one batched fetch per section (OK). Size charts make one call per PDP (OK).
    **Source:** TECH 1.5.

## 10. Security

48. **Rule:** The reviewer will "Search for any usage for |raw" and "Make sure that there is no usage allows the merchant to add custom html either as component or settings."
    **Check:** `grep -rn '|raw' src/views` (29 hits on 2026-11-09). Every hit must be one of these:
    - (a) Salla-managed rich content: `product.description`, `page.content`, `article.body`, `category.description`, `brand.description`, `order.instructions`;
    - (b) our own SVG or translation strings;
    - (c) `json_encode|raw` inside `<script type="application/(ld+)json">`. PHP's `json_encode` escapes `/` by default, so `</script>` cannot break out. UNVERIFIED that Salla's Twig keeps the default flags; test by saving a setting containing `</script>` and viewing the page source.
    - `unix-faq.twig:109` renders `row.answer|raw` only for locale defaults (`html: true` is set at line 61). Merchant rows are forced to `html: false` (line 48). OK.
    - `unix-size-finder.twig:37` and `product/single.twig:459` print **merchant settings** as `json_encode|raw` in JSON script tags. That is acceptable only under (c).
    **Source:** TECH 2.4.
49. **Rule:** Inside web components, `salla-modal` renders `modal-title` and `sub-title` via `innerHTML` (salla-modal.js:203). Never pass customer-controlled text into them.
    **Check:** `grep -rn "salla-modal" src/views | grep "title="`.
    **Source:** PKG-WC.
50. **Rule:** Escape every value you interpolate into `innerHTML` templates in JS.
    **Check:** `grep -rn 'innerHTML = `' src/assets/js`.
    - **Resolved (b8cce00, cf59d23):** `add-product-toast.js` escapes option name/value, product URL/image, cart URL and icon URL; `product-card.js` escapes name, subtitle, badges, URLs and `add_to_cart_label`; `escapeHTML(null)` returns `''` (LESSONS 22). Was: Raed's toast interpolated `${opt.name}`/`${opt.value}` unescaped (self-XSS via text-input options).
    **Source:** general security (TECH 2.4).

## 11. Review checklist (what the Salla team checks)

51. **Main requirements (MAINREQ):**
    - A clear industry; ours is Fashion.
    - Custom components "should offer many fields".
    - **Uniqueness vs Raed:** "substantively different". The reviewer overrides Raed's `views` with ours and diffs them visually (3.2). The theme needs a cohesive look across index, product, collection, blog, search and cart (3.5), plus special customization (3.6).
52. **UI/UX (UX):**
    - **Product page:**
      - full title, price and all photos without layout breaks;
      - variant images on selection, and a tax-included indicator;
      - variant select, and an add-to-cart that is disabled or changed when sold out;
      - the first available variant on load;
      - reviews, and dynamic checkout buttons on by default;
      - **social sharing: direct link, Twitter and WhatsApp (4.1.12–13)**; Restored on the PDP (D135, 6a527eb).
      - rich media: YouTube, embedded video and 3D (4.1.15).
    - **Collection page:** title, description and image. Grid items need a linked, untruncated title, price, image and sale badge, and an empty-collection message.
    - **Cart:** per line, the title, unit price, image, final price and quantity controls; also the total, a tax indicator and a checkout button. Support notes, automatic discounts and dynamic checkout.
    - **Search:** a no-results message; products, blogs and pages; a 404 page with next steps.
    - **Customer:** first and last name, birthdate, gender, email, mobile, marketing opt-in and delete account.
53. **Metadata (META):**
    - Name under 14 characters, one word, no industry or e-commerce terms, and **not used on other platforms**.
    - Support email, site, phone, live chat and docs link, with replies within **2 business days**.
    - Price: at least 1,000 SAR for a private theme.
    - Screenshots: **at least 4**, unique AR and EN titles and descriptions, **"Images contain no text or logos"**, desktop and mobile views. Videos may be up to 2 minutes.
    - A changelog is required.
    - Preview store: real (non-lorem) content; a product on sale, a sold-out product or variant, and a multi-variant product; no info about the theme itself; no store icon.
    - PUB states "at least 3 images … 1366x768", which conflicts with META (4) and with the 1600×1200 the portal showed us (`docs/PUBLISH.md` §3). Follow the strictest: 4 or more, at the size the portal demands.
54. **Pre-launch (PRELAUNCH):** pricing, revenue share and financial alignment.
55. **Keep in sync with Raed** (TECH 1.3, 2.6): track Raed updates and merge enhancements.
    **Check:** `gh api 'repos/SallaApp/theme-raed/compare/98515ac...master' --jq '.ahead_by'` (3 on 2026-11-09).

---

## Gotchas we must not hit

Only what the sources support.

- **G1. `salla-add-product-button` hides your slot content in two states.** When `product-status="out-and-notify"` with notify channels, or when an out-of-stock option or subscribed options exist, it renders `<salla-product-availability>` and wraps the default `<slot>` in `<span class="s-hidden">`. Our custom label (`{{ unix_atc_label }}`, `product/single.twig:327`) disappears in those states. That is expected, so do not "fix" it with CSS that un-hides `.s-hidden`. Source: PKG-WC `salla-add-product-button.js:356-360`.
- **G2. `salla-add-product-button` forces `loader-position="center"`.** It spreads our attributes and then sets `"loader-position": "center"` on its inner `salla-button`, so `loader-position="end"` (`product/single.twig:318`, `wishlist-card.js:55`) does nothing. Source: same file, line 369.
- **G3. `salla-add-product-button` renders nothing inside a Swiper duplicate slide** (`.swiper-slide-duplicate`). Looped sliders show empty buttons on clones. Source: same file, lines 352-354.
- **G4. `salla-modal` hides its default slot while loading.** With `is-loading`, the content sits inside `div.s-hidden` until loading ends. The host itself carries `s-hidden` until opened (salla-modal.js:97, 157, 194). The same host-level `s-hidden` pattern applies to `salla-drawer`. Do not query or measure modal content before `modalVisibilityChanged`. Source: PKG-WC.
- **G5. Events are not replayed.** `salla.event.on()` misses events that fired before registration. Page JS runs after `salla.onReady`, while components such as `salla-filters` may already have emitted `filters::fetched`. Our `src/assets/js/partials/unix-plp.js:116` relies on `on('filters::fetched')` to unhide the filter button. If the button stays hidden on fast loads, switch to `salla.event.onlyWhen('filters::fetched')` or read the component state directly. UNVERIFIED whether it races in practice; test on a throttled and an unthrottled load. Source: EVT (`onlyWhen` semantics).
- **G6. `salla.lang.get()` before translations load returns the key.** Wrap it in `salla.lang.onLoaded()`. Source: PKG-SDK.
- **G7. Money must use `innerHTML`** (the SAR symbol is markup). Source: CHLOG.
- **G8. Do not bundle `@salla.sa/twilight` or `twilight-components`.** The engine injects the latest version, and `src/assets/js/twilight.js` must stay excluded in webpack. Source: SDK, WC-USAGE.
- **G9. No documented video field type.** Use a URL `string` field for MP4s and `image` for posters. Do not assume `format: "image"` accepts MP4 (UNVERIFIED). Source: SETUP, JSON.
- **G10. Page file names and paths are fixed.** Never rename or move `src/views/pages/**`. Source: PAGES.
- **G11. Unused `component-*` features must be removed** from `features`. Source: HOME.
- **G12. Unknown attributes are silently ignored** (e.g. `dateFormat` instead of `date-format`). Check them against `docs.json`. Source: PKG-WC.
- **G13. Preview commits to GitHub**, and auto-save can get the IP blocked. Source: CLI-PREVIEW.
- **G14. Any update to the live theme requires a new review**, even for a private theme. Source: PUB.
- **G15. Wishlist calls need a logged-in customer.** For guests, open login (`salla.event.dispatch('login::open')`) instead of calling `toggle`. Source: WISH. UNVERIFIED whether the SDK opens login itself; test as a guest.
- **G16. `{% component 'header.menu' %}` and `{% component 'footer.menu' %}` are deprecated.** Use `<salla-menu>`. Source: CHLOG.

## Review rejection risks (current repo, 2026-11-09)

Ordered by likely impact. Each risk is something a Salla reviewer can point at.

| # | Risk | Evidence (file:line) | Source | Suggested action |
|---|---|---|---|---|
| R1 | Twilight length validation (max 1000) exceeded | `twilight.json:606, 630, 680, 708, 736, 764, 816` (`maxLength` 2000–20000) | TECH 1.4 | Ask Salla whether 1.4 means `maxLength`; else split data or move it to JSON files or settings under 1000 |
| R2 | ~~Social sharing removed from the PDP~~ **Resolved 6a527eb (D135):** `<salla-social-share>` back, setting `unix_pdp_share` on by default | `src/views/pages/product/single.twig:183` comment (D54); no `salla-social-share` in `src/views` (Raed has one) | UX 4.1.12–13 | Record it as a deliberate D-number and be ready to restore `<salla-social-share>` if review insists |
| R3 | Screenshots break metadata rules (**rules fixed in `docs/PUBLISH.md` §3 by 6a527eb; the screenshots themselves still need redoing**) | `docs/PUBLISH.md` §3: 3 shots at 1366×768 taken from unix.sa (they contain logo and text) | META 4.7, 4.9, 4.10; PUB | Make 4+ shots at the portal size, desktop and mobile, without overlaid text or logos, with AR and EN titles |
| R4 | Theme size measurement unclear | Built `public/` is 1076.5 KiB (under the 2MB private cap); the tracked repo is about 11.75 MiB with `reference/` | TECH 1.1, MAINREQ 3.8 | Confirm what is measured; consider moving `reference/` out of the synced repo |
| R5 | `|raw` audit | 29 hits (`grep -rn '\|raw' src/views`); merchant settings go to `json_encode\|raw` at `unix-size-finder.twig:37` and `product/single.twig:459` | TECH 2.4 | Be ready to explain each hit; consider `json_encode(constant('JSON_HEX_TAG'))` or another escape-safe output (UNVERIFIED that Salla's Twig allows `constant`) |
| R6 | ~~Unescaped option text in the add-to-cart toast~~ **Resolved b8cce00, cf59d23** | `src/assets/js/partials/add-product-toast.js` (`${opt.name}`, `${opt.value}`) | TECH 2.4 | Escape it with the existing `escapeHTML` |
| R7 | ~~Missing documented hooks~~ **Resolved 6a527eb** | `src/views/pages/cart.twig` has no `cart:submit.start/end` | HOOKS | Add both hooks around the checkout button |
| R8 | Uniqueness vs Raed | Reviewers diff our `views` against Raed | MAINREQ 3.1–3.7 | Low risk: our home components and PDP are custom |
| R9 | ~~Unknown attribute~~ **Resolved 6a527eb** (`date-format`) | `src/views/pages/customer/profile.twig:41` `dateFormat` (Raed-inherited) | PKG-WC | Change it to `date-format` |
| R10 | Lighthouse averages | Must be at least 60 for performance and 90 for accessibility, desktop and mobile, home + PDP + PLP | TECH 2.1 | Run on the demo store before 6.6 and record the numbers in `docs/PERFORMANCE.md` |
| R11 | Theme name | "UNIX" is a widely used OS name, against "Not used on other platforms" | META 1.10 | Low risk for a private theme; keep the AR name «يونكس» ready |

## Quick audit commands

```sh
# Unknown salla-* attributes (compare with docs.json)
node -e 'const d=require("./node_modules/@salla.sa/twilight-components/dist/docs.json");for(const c of d.components)if(process.argv.slice(1).includes(c.tag))console.log(c.tag,c.props.map(p=>p.attr).join(" "),"| events:",c.events.map(e=>e.event).join(" "),"| slots:",c.slots.map(s=>s.name).join(" "))' salla-modal salla-slider
# maxLength over 1000
grep -n '"maxLength": *[0-9]\{4,\}' twilight.json
# raw filter
grep -rn '|raw' src/views
# money written as text
grep -rn "money(" src/assets/js | grep -i "textContent\|innerText"
# hooks present
grep -rhoE "\{% hook '?[a-z:._-]+'? %\}" src/views | sort -u
# built size
find public -type f -exec stat -f %z {} + | awk '{s+=$1} END {print s/1024 " KiB"}'
```
