# UNIX theme: Twig → React migration brief

Researched 2026-11-11 from primary sources (the Salla React docs, the `theme-raed-react` repo, npm and the Salla CLI package). Nothing in this file has been built or tested yet. Every fact has a source tag such as **[D-settings]**, and the tags are listed in §0. Anything we could not confirm from a source is marked **UNVERIFIED**.

---

## 0. Sources

| Tag | URL (React docs pages also serve Markdown: add `.md`) |
|---|---|
| B | https://salla.dev/blog/salla-themes-react/ (published 2026-10-15, edited 2026-10-26; read through `https://salla.dev/wp-json/wp/v2/posts?slug=salla-themes-react`) |
| D-index | https://docs.salla.dev/twilight/react/llms.txt (the index of the React section; the root `https://docs.salla.dev/llms.txt` has no React pages) |
| D-full | https://docs.salla.dev/twilight/react/llms-full.txt (the whole React section in one file, about 1 MB) |
| D-what | https://docs.salla.dev/twilight/react/start/what-is-a-theme |
| D-fw | https://docs.salla.dev/twilight/react/start/frameworks |
| D-qs | https://docs.salla.dev/twilight/react/start/quick-start |
| D-struct | https://docs.salla.dev/twilight/react/start/project-structure |
| D-how | https://docs.salla.dev/twilight/react/start/how-it-works |
| D-ai | https://docs.salla.dev/twilight/react/start/build-with-ai |
| D-routes | https://docs.salla.dev/twilight/react/guide/routes-and-pages |
| D-data | https://docs.salla.dev/twilight/react/guide/loading-data |
| D-layout | https://docs.salla.dev/twilight/react/guide/layout-and-components |
| D-slots | https://docs.salla.dev/twilight/react/guide/hooks-and-slots |
| D-style | https://docs.salla.dev/twilight/react/guide/styling |
| D-fonts | https://docs.salla.dev/twilight/react/guide/icons-and-fonts |
| D-wcstyle | https://docs.salla.dev/twilight/react/guide/style-web-components |
| D-i18n | https://docs.salla.dev/twilight/react/guide/languages-and-rtl |
| D-settings | https://docs.salla.dev/twilight/react/guide/settings |
| D-tj | https://docs.salla.dev/twilight/react/guide/twilight-json |
| D-seo | https://docs.salla.dev/twilight/react/guide/seo-and-head |
| D-sdk | https://docs.salla.dev/twilight/react/guide/salla-sdk-and-events |
| D-perf | https://docs.salla.dev/twilight/react/guide/performance |
| D-wc | https://docs.salla.dev/twilight/react/web-components |
| D-card | https://docs.salla.dev/twilight/react/components/product-card |
| D-blocks | https://docs.salla.dev/twilight/react/components/home-blocks |
| D-addblock | https://docs.salla.dev/twilight/react/recipes/add-a-home-block |
| D-home | https://docs.salla.dev/twilight/react/routes/home |
| D-pdp | https://docs.salla.dev/twilight/react/routes/product |
| D-redir | https://docs.salla.dev/twilight/react/routes/seo-redirects |
| D-twighooks | https://docs.salla.dev/twilight/react/slots/from-twig |
| D-cli | https://docs.salla.dev/twilight/react/local-development/cli-commands |
| D-create | https://docs.salla.dev/twilight/react/local-development/create-a-theme |
| D-prereq | https://docs.salla.dev/twilight/react/local-development/prerequisites |
| D-link | https://docs.salla.dev/twilight/react/local-development/link-a-store |
| D-editor | https://docs.salla.dev/twilight/react/local-development/theme-editor |
| D-pub | https://docs.salla.dev/twilight/react/local-development/publish |
| D-portal | https://docs.salla.dev/twilight/react/local-development/partners-portal |
| D-review | https://docs.salla.dev/twilight/react/local-development/review-requirements |
| D-design | https://docs.salla.dev/twilight/react/local-development/design-requirements |
| D-vite | https://docs.salla.dev/twilight/react/local-development/vite-plugin |
| D-change | https://docs.salla.dev/twilight/react/changelog |
| G-readme | https://github.com/SallaApp/theme-raed-react/blob/master/README.md |
| G-pkg | https://github.com/SallaApp/theme-raed-react/blob/master/package.json |
| G-agents | https://github.com/SallaApp/theme-raed-react/blob/master/AGENTS.md (the repo's `CLAUDE.md` contains only `@AGENTS.md`) |
| G-forks | https://github.com/SallaApp/theme-raed-react/blob/master/FORKS.md |
| G-tj | https://github.com/SallaApp/theme-raed-react/blob/master/twilight.json |
| G-router | https://github.com/SallaApp/theme-raed-react/blob/master/app/router.tsx |
| G-tree | https://api.github.com/repos/SallaApp/theme-raed-react/git/trees/HEAD?recursive=1 (254 files; repo created 2026-10-07, last push 2026-11-10, MIT) |
| N-engine | https://registry.npmjs.org/@salla.sa/twilight-theme-engine (latest 1.0.172, published 2026-11-11) |
| N-cli | https://registry.npmjs.org/@salla.sa/cli (latest 3.2.64, published 2026-10-29, `engines.node >=22.12.0`) |
| N-wcr | https://registry.npmjs.org/@salla.sa/twilight-components-react (latest 3.0.48) |
| N-raed | https://registry.npmjs.org/@salla.sa/theme-raed (latest 1.0.64; this is the package `salla theme create` downloads) |

---

## 1. What the React stack is, exactly

### 1.1 Headline facts and the conflicts between sources

| Question | Answer | Source |
|---|---|---|
| Framework | **TanStack Start + Vite + React 19.** Next.js is "Planned. Not available yet." The blog's "React.js and Next.js" describes where Salla is heading, not what ships today. | D-fw, G-readme, G-pkg (`react 19.2.8`, `@tanstack/react-start ~1.168`, `vite 8.2.2`) |
| Is there any Next.js code? | The engine package exports `./nextjs`, which contains head, link and document-class adapter utilities. The docs say Next.js themes are not supported, so we don't use it. | N-engine (`dist/nextjs/index.d.ts`), D-fw |
| Server runtime | SSR in **workerd (Cloudflare Workers runtime)**. The engine depends on `@cloudflare/vite-plugin`, `wrangler` and `@sentry/cloudflare`, and `app/server.ts` wraps the handler in `withThemeSentry`. Salla builds and hosts the theme, so no deploy config ships with it. | G-readme, N-engine (`dependencies`), G-tree |
| "salla-next-sdk" | **Not on npm.** `salla-next-sdk`, `@salla.sa/next-sdk` and `@salla.sa/salla-next-sdk` all return "Not found", and the docs never use the name. The real pieces are `@salla.sa/twilight-theme-engine` (engine, routes, hooks, API client), `@salla.sa/twilight-components-react` (React wrappers) and the existing browser SDK `window.salla` (`@salla.sa/twilight` 3.x), which the engine starts. We read the blog's requirement "uses salla-next-sdk" as "is built on the engine". **UNVERIFIED** until Salla confirms it (Q3). | N-*, D-sdk, D-change |
| Lighthouse bar | The blog says "> 85". The docs' review page says the home, category and product pages must **average ≥ 60 for performance and ≥ 90 for accessibility, on desktop and mobile**, measured on the default preview store. We aim for ≥ 85, which our own 6.2 budget already requires, and that clears both. | B, D-review |
| CLI command | The blog says `salla theme init --stack react`. **That command doesn't exist** in CLI 3.2.64: no `init` theme command and no `--stack` flag. The real command is `salla theme create [-t react] [-n name] [-s store] [-y]`, whose description is "Create a new React theme". | B, D-cli, N-cli (bundle strings) |
| Node | Docs: Node ≥ 20.19 and pnpm ≥ 10. The starter README: Node 22.22.2+, 24.15.0+ or 26+, and pnpm 10. The CLI: `node >=22.12.0`. In practice we use Node 24.15+. | D-prereq, G-readme, N-cli |
| Package manager | **pnpm only.** Other package managers install duplicate shared libraries, and the theme fails at render time. We already use pnpm. | D-qs |
| Deadlines | Blog: from **1 Nov 2026** only React themes can be published, and from **end of Nov 2026** only React themes are listed in the marketplace. Twig submissions were accepted for 5 days after the launch. Merchant support for Twig themes runs "until at least the end of the year". Changelog: "Every theme must move to React by the end of November 2026." | B (timeline, FAQ 2 and 4), D-change |
| Partner Portal | Theme creation is React-only (blog FAQ 11). The Portal's "Add custom component" button still writes a Twig file, which is a known trap. | B, D-portal |
| Preview store | Each theme needs its **own dedicated preview store**. A demo store can be the preview store of only one theme. | B (FAQ 7), D-portal |

### 1.2 Architecture in one paragraph
A React theme is a small project that sits on top of `@salla.sa/twilight-theme-engine`. The engine already provides every storefront route (home, product, category, cart, blog, account and so on), the data loading, i18n with RTL, the `window.salla` SDK, cart and login, and the SSR build. The theme contains only what is different: the layout, components, overridden routes, slot content, settings and translations [D-what]. A request goes through middleware in `app/start.ts` (store and visitor), then the engine matches a route (`/{-$locale}/…`) and runs the route **loader** on the server. Theme overrides are applied, the server sends HTML and the browser hydrates it. After that, links navigate on the client [D-how]. Salla's guidance is to make the smallest change that works: a setting first, then a slot, then a component, and only then a whole page [D-what].

### 1.3 Project layout (starter = Raed for React)
These are the files we own [D-struct, G-agents]:
- `app/routes.ts`: the manifest of custom or overriding routes, as `route('/path','file.tsx')`.
- `app/routes/__root.tsx`: `<html lang dir>`, `TwilightProvider translations layout`, `ThemeStylesheet` and `ThemeHeadContent`.
- `app/router.tsx`: `registerHomeComponents`, `registry.register/override`, `registerThemeHooks()`.
- `app/components/`, `app/hooks/` (`index.tsx` holds the slot registrations), `app/lib/` and `app/styles/` (ITCSS `01-settings`…`05-utilities`, plus `critical.scss` and `critical-product.scss`).
- `locales/ar.json` and `locales/en.json`, `twilight.json`, `vite.config.ts` (`twilightReact({ localesDir })`) and `public/`.

These files are generated and must not be edited: `app/routeTree.gen.ts`, and any `app/routes/*` file whose first line is `// @auto-generated`. To own one of those routes, delete that line or point `routes.ts` at your own file [D-struct, D-pdp].

`FORKS.md` records every engine component copied into the theme, along with the engine version it was forked from. Forks must be diffed by hand against `tailwind/<path>.tsx.txt` in the engine package on every engine upgrade [G-forks].

Scripts: `pnpm dev | build | typecheck | test` (Vitest) and `pnpm check:manifest` (`twilight-check-manifest`) [G-readme].

### 1.4 twilight.json, settings and components
- The file still holds `settings`, `components` and `features` [D-change]. A React theme **must add `"type": "react"`**: the CLI decides between React and Twig from that key or from the engine dependency [D-tj, N-cli]. The dashboard reads only `settings`, `components`, `features`, `support_url` and `groups` [D-tj]. The starter also adds a `groups` array (header and footer) [G-tj].
- There are six setting `type`s, the same set we already use: `boolean`, `items`, `string`, `number`, `collection` and `static`. Any other type makes the publish fail [D-tj].
- Rules for home blocks: each block needs `title`, `key`, `path` and `fields`. Field ids may use only letters, digits, `- . _`. `required` and `multichoice` must be booleans. A collection must have `fields` plus whole-number `minLength` and `maxLength` [D-tj].
- `pnpm check:manifest` (with `--strict` to fail on warnings too) checks the file. `vite dev` prints manifest errors whenever the file is saved [D-tj].
- **Reading a setting:** `const { settings } = useTheme(); settings.unix_x`. For settings that default to on, test `!== false` (a store that never saved the setting has no value). Dropdown values arrive either as a string or as `[{value}]` [D-settings, G-agents].
- **Home blocks:** declare the block in `components` with `path: "home.unix-hero"`, write a component that receives `{ data }` (one key per field id), and register it in `app/router.tsx` with `registerHomeComponents({ ...DefaultHomeComponents, 'unix-hero': UnixHero })`. If the spread is left out, every built-in block disappears. `registerHomeComponentConfig` reserves height so the page doesn't shift [D-addblock].
- **Rendering of home blocks:** the first three blocks render with the page, and later blocks mount when they scroll into view [D-addblock, D-blocks]. The SEO impact of this is in §3, phase 6.
- **Built-in blocks** are switched on with `features: ["component-fixed-banner", …]`. Their keys are `fixed-banner`, `photos-slider`, `square-photos`, `parallax-background`, `youtube`, `store-features`, `testimonial` (no s), `fixed-products`, `products-slider`, `featured-products:style1|2|3` and `bundle-component` [D-blocks].
- **Customizer:** `salla theme dev` shows a floating local settings panel at `/__twilight/editor` that reads the local `twilight.json` [D-qs, D-vite]. `salla theme dev --editor`, which is the same as `salla theme preview`, frames the local dev server inside the real merchant theme editor. Nothing is uploaded. It needs `salla login`, a theme with a GitHub repo, and the theme installed on at least one store [D-editor]. Merchant settings are versioned, and `?versionId=` renders a draft [D-link].

### 1.5 i18n and RTL
- The locale comes from the URL prefix `/{-$locale}` (`/ar/…`, `/en/…`). On a multilingual store, a URL without a prefix **redirects to the default language**, `/ar` for Arabic stores. `ar`, `fa`, `he` and `ur` are RTL [D-i18n, D-home].
- Locale files use **flat dotted keys** (`"pages.cart.total": "…"`), not nested objects [D-i18n, D-change].
- In code: `const { t, locale, isRTL } = useTranslation(); t('key', 'fallback')`. Placeholders use `{{name}}`. Salla's Laravel-style plurals go through `formatSallaPlural` [D-i18n].
- **The store's own Salla translations are looked up first, and theme files are only the fallback** [D-i18n]. For us this means a shared key can silently get Salla's masculine wording (LESSONS 3). Every UNIX string must live under our own namespace (`blocks.unix.*`), which our current keys mostly already do.
- Layout uses logical utilities and CSS (`ms-*`, `ps-*`, `text-start`) [D-i18n], which is already our rule.

### 1.6 Styling
- The styling stack is Tailwind 3 plus SCSS in the **same ITCSS folders we already have** (`01-settings`…`05-utilities`) [D-style]. Tailwind must scan the engine's and the wrappers' `dist` files [D-style].
- The engine sets `--color-primary(-dark|-light|-reverse)` and `--font-main` on `<html>` from the merchant's dashboard choices. It also adds `color-mode-dark|light` and `footer-is-dark|light` body classes [D-style].
- Our own font (Somar) goes in `app/styles/fonts/` and is declared with `@font-face`. Salla advises keeping `--font-main` for body text [D-fonts]. This conflicts with our locked brand fonts (DS §2, D6); see §2.1.
- Salla Icons (`sicon-*`) are loaded by the engine [D-fonts].
- Critical CSS can be inlined per route: `ThemeStylesheet critical={…}` together with `bootClient`. The client waits up to 2.5 s for `fetchpriority="high"` images and then hydrates [D-perf].

### 1.7 Web components and React equivalents (cart, add to cart, options, auth)
The order of preference is: native engine component (`Link`, `ProductCard`, `Breadcrumb`, `Image`, `Modal`, `Drawer`, `toast`), then native React from `@salla.sa/twilight-components-react` (`SallaButton`, `SallaProductsList`, `SallaProductsSlider`, `SallaSlider`), then a wrapper (`import { SallaX } from '@salla.sa/twilight-components-react/x'`), and only then the raw `<salla-x>` tag [D-wc, G-agents].
- The docs catalogue 112 `salla-*` tags. Wrappers exist for `salla-product-options`, `salla-add-product-button`, `salla-quick-buy`, `salla-installment`, `salla-comments`, `salla-rating-stars`, `salla-reviews`, `salla-login-modal`, `salla-search`, `salla-filters`, `salla-cart-coupons`, `salla-gifting`, `salla-product-size-guide` and others [D-wc].
- Components render into the light DOM and are styled through their `s-*` classes, as in Twig. The exceptions are `salla-hook` and the options popup of `salla-multiple-bundle-product`, which use shadow DOM [D-wcstyle].
- **Product card:** to replace it everywhere, call both `registry.register('product:card', X)` and then `registry.override(...)`; `override` alone does nothing. Only these registry keys resolve: `product:card`, `product:gallery`, `product:list-page`, `product:list-skeleton`, `account:layout-pending` and `home:*` [D-layout, D-card].
- **Cart and wishlist actions:** `window.salla.cart.addItem(...)`, `salla.wishlist.toggle(...)` or the hooks `useWishlist`, `useProduct` and `useCoupon`. SDK calls are allowed only in event handlers and effects, because the server has no `window` [D-sdk].
- **Events:** subscribe in `useEffect` with `salla.event.on('cart::updated', fn)` and always `off` the same function in the cleanup. If the SDK isn't ready yet, wait for the `theme::ready` document event. New events: `route::changing`, `route::changed` and `Product Viewed` (the engine emits that one itself) [D-sdk].
- `Salla.hooks` (component hooks) are unchanged [D-change].
- **Template hooks become slots:** `<HookSlot name>` plus `hookRegistry.register(name, handler, priority)`. Most names are unchanged (all `cart:*`, `product:single.*`, `thank-you:*`, `customer:*`). Renamed: `product:index.items.*` → `product:list.items.*` and `blog:index.items.*` → `blog:items.*`. With no slot: `component:header.menu.*`, `body:classes` (use `useDocumentClass` instead) and `<page-slug>:start/end` [D-twighooks].

### 1.8 SEO, head and SSR
- Each built-in route has a `head`, wired with `withHead(Route, override?)`. It fills the title (with ` - Store` appended), description, canonical, Open Graph, Twitter and hreflang [D-seo, D-home].
- **The product route already emits a `Product` JSON-LD** (SKU, images, Offer, brand, rating, gtin8, mpn) with `product.url` as the canonical [D-pdp].
- A head description accepts `jsonLd`, `meta`, `links` and `scripts`, so our own Organization, BreadcrumbList, BlogPosting and FAQPage blocks go there [D-seo]. Whether the engine root also emits Organization or WebSite JSON-LD is **UNVERIFIED**; we must check View Source before writing ours (D129: exactly one of each).
- **Not in the server HTML:** on the PDP, related products, reviews, the offer banner and testimonials load in the browser when scrolled into view [D-pdp]. Home blocks after the third mount on scroll [D-addblock]. Product short links resolve only in the browser [D-redir].
- Redirects are thrown from a loader (TanStack `redirect`). The engine keeps Twig's legacy URLs alive, for example `/offers` → `/products?source=offers` and `/profile` → `/account/profile` [D-seo, D-redir].

### 1.9 CLI and preview flow
| Step | Command | Source |
|---|---|---|
| Install and check | `npm i -g @salla.sa/cli` (3.x), `salla theme doctor` | D-prereq |
| Create | `salla theme create --type react --name "UNIX"`. In interactive mode it offers to create a private GitHub repo, which `--yes` skips. It downloads `@salla.sa/theme-raed@latest` | D-create, N-cli |
| Run locally | `salla theme dev [--store <id>] [--port]`. The store is saved in `.env` as `VITE_STORE_DOMAIN`. Locally, `?storeId=` overrides it. Store settings are cached for one hour in dev | D-link |
| Real editor | `salla theme preview` or `salla theme dev --editor` | D-editor |
| Publish | `salla theme publish`: pushes the source to the theme repo, and **Salla builds it from that commit**. It asks for categories, price and AR and EN change logs of at least 25 characters each | D-pub |
| Twig-only | `salla theme serve` and `salla theme sync` refuse to run in a React folder. In a Twig folder, `salla theme preview` still works | D-cli, N-cli |

### 1.10 Publish and review requirements (React docs)
- **Size:** a public theme can be at most 1 MB and a **private theme at most 2 MB** [D-review]. Whether that counts the source or the build is **UNVERIFIED**.
- **Price:** a private theme costs 1,000 to 50,000 SAR, one-time; a public one 250 to 50,000 SAR. You need at least 4 screenshots and at least 1 category. The partner account needs a **verified company ID and services certificate**. Every update, including to a private theme, goes through a new request and a new review. A theme is read-only while it is in review [D-pub, D-portal].
- **Technical:** every customer-facing string comes from the locale files. No request per product or per list item. Lighthouse averages as in §1.1. Works in Chrome, Firefox, Safari and Edge on every screen size. **No setting or block lets a merchant add HTML, and setting text is never rendered with `dangerouslySetInnerHTML`.** Engine and Raed fixes must be kept up to date [D-review].
- **Design (every theme):** its own header, footer and product card (with a sold-out state). On the PDP: tax note, option-driven images, first available combination preselected, sold-out handling, reviews, **quick-buy buttons on by default**, and sharing by link, X and WhatsApp. On the PLP: category name, description and image, plus an empty state. On the cart: order notes, coupons, quick-buy and checkout. Search and 404 behaviour. Every field of the account profile. Home blocks: store features, flash discount, fixed products, products slider, featured products, testimonials, brands, blog, YouTube and banners [D-design]. Whether a **private** theme is held to the full home-block list is **UNVERIFIED** (Q6).
- **Blog checklist:** uses the SDK (see §1.1), no jQuery, no `.twig` files, product content in View Source, and standard Salla apps (Chat, Analytics) still working after client-side navigation [B].
- **AI tooling:** Salla publishes an agent kit (`claude plugin marketplace add SallaApp/salla-partners-agent-kit`) and a Partners MCP at `https://partners.mcp.salla.dev`, which includes a `salla_themes_docs` tool [D-ai, G-agents].

---

## 2. Inventory of our Twig theme, and what carries over

### 2.1 Counts (from the repo, 2026-11-11)
| Item | Count |
|---|---|
| Twig files in `src/views` | **55**: 2 layouts, 18 page templates plus 2 page partials (`partials/product/options`, `reservations`), and 33 components |
| Components by folder | home 14 (our 13 `unix-*` plus Raed's `testimonials`), product 7, header 3, cart 3, seo 3, blog 1, footer 1, root 1 (`unix-whatsapp-url`) |
| Twig lines | about 6,280 |
| Home components registered in `twilight.json` | **13** (`home.unix-hero`, `unix-offer-strip`, `unix-products-tabs`, `unix-collection-overlay`, `unix-collections-grid`, `unix-featured-products`, `unix-video-tiles`, `unix-blog`, `unix-faq`, `unix-perks`, `unix-reviews`, `unix-shop-look`, `unix-size-help`) |
| Theme settings | **103** entries (including static titles and lines). 14 ids are shared with Raed React: `header_is_sticky`, `enable_more_menu`, `product_show_breadcrumbs`, `product_index_show_breadcrumbs`, `enable_add_product_toast`, `notify_when_available_in_card`, `sticky_add_to_cart`, `slider_background_size` and 6 static entries |
| `features` | `mega-menu`, `fonts`, `breadcrumb`, `unite-cards-height`, `menu-images`, `filters`. No `component-*` built-in blocks |
| JS | 15 page entries and 36 partials, about 6,550 lines, vanilla (no jQuery found). Dependencies: `animejs`, `fslightbox`, `sweetalert2` |
| SCSS | 71 files in ITCSS, about 14,000 lines; `unix-tokens.scss` is 404 lines |
| Locales | `ar.json` and `en.json` each have 354 leaf keys (`blocks` 338, `pages` 14, `common` 2), nested |
| `salla-*` tags used | 67 distinct. 8 of them are **not in the React docs catalogue**: `salla-add-product-toast`, `salla-bullet-delivery-tag`, `salla-cart-summary-card`, `salla-order-payment`, `salla-order-rewards`, `salla-review-order-item`, `salla-thank-you-header`, `salla-thank-you-page`. Whether they still exist in `twilight-components` 3.x is **UNVERIFIED** |
| Decisions | 134 distinct D-numbers in ROADMAP |

### 2.2 Carries over as-is (or with mechanical edits)
| Asset | Why it carries | Work |
|---|---|---|
| `docs/DESIGN-SYSTEM.md`, `SPEC.md`, the `reference/` export and every D-number | They are independent of the platform | None. DS §12 intended differences stay |
| `unix-tokens.scss` and the SCSS tree | The React starter uses the same ITCSS folders, Tailwind 3 and SCSS [D-style] | Copy into `app/styles/`. Remove selectors for Twig-only markup (Raed Twig classes such as `.btn--*` and `s-*` overrides that no longer apply) and keep the `.s-*` overrides for web components we still use [D-wcstyle]. Split out `critical.scss` and `critical-product.scss` [D-perf] |
| Fonts (`Somar-Bold.woff2`, IBM Plex Sans Arabic) | `@font-face` next to the styles [D-fonts] | Salla recommends keeping `--font-main` for body text. Our brand lock (D6) overrides that. Record it as a D-number and keep the `"fonts"` feature off, or justify it in review (Q7) |
| Locales | The content is the same; only the shape differs (nested → flat dotted keys) [D-i18n] | Script the flattening: `blocks.unix.hero.cta` stays the same string as the key. All 354 keys stay identical, so `trans('x')` becomes `t('x', fallback)` |
| `twilight.json` settings and component ids | Same schema and six types [D-tj]. Salla asks that names stay identical so its migration can work [B FAQ 8] | Add `"type": "react"` (and optionally `groups`). **Keep every `id`, `path` and field id unchanged.** Run `pnpm check:manifest --strict` |
| `docs/kb/A11Y.md`, `PERF-PLAYBOOK.md`, `ECOMMERCE-UX.md` | These are web and WCAG rules | Small edits only (Lighthouse bars, the critical-CSS mechanism) |
| `docs/kb/LESSONS.md` | Most lessons are platform-independent: `salla-*` slots and labels (1–6), XSS (22, 33, 35), parity (11–13), copy (14–15), a11y (16–17, 23–26, 32), images (18, 27, 28), owner decisions (38) | Twig lessons 7–9 become historical. Lesson 10 (empty fields) still applies |
| Migration and SEO docs (`docs/migration`, `docs/seo`) | Content plan, keywords and briefs | The **301 targets need to be rechecked**: React redirects unprefixed URLs to `/ar/…` [D-i18n], and PLAN.md line 93 already suspects `/ar/<slug>/p<id>`. Point 301s at the final `/ar/` URL to avoid redirect chains |

### 2.3 Must be rebuilt (Twig, `webpack` and imperative DOM JS → React)
Approach for each feature: the **engine** gives it for free; a **slot** injects into an engine page; **own** means our own React component; a **fork** means a copied engine component recorded in `FORKS.md`.

| Feature (current file) | React approach | Notes |
|---|---|---|
| Master layout (`layouts/master.twig`), skip link, `<main tabindex>` | Own `ThemeLayout` passed to `TwilightProvider layout` [D-layout] | Keep the engine's global modals (login, offer, scopes) |
| Announcement bar (`announcement-bar.twig`, `unix-announcement.js`) | Own component in the header. Optional: `advertisement` API [D-index] | Pause control (LESSONS 24); settings `unix_announcement_*` |
| Header, mega menu, mobile drawer, lang toggle, search (`header.twig`, `main-menu.js`, `unix-drawer.js`, `unix-header.js`) | Own `Header`. Menus from the `menu` API module. Engine `Drawer`, and `SallaSearch` wrapper [D-index, D-wc] | Transparent-over-hero logic through `useDocumentClass`. Sticky hide and reveal |
| Footer (`footer.twig`, `unix-footer.js`) | Own `Footer` (or a fork of the engine footer) with `SallaMenu`, `SallaContacts`, `SallaPayments` and trust badges | `footer:newsletter` hook → `footer:start/end` slot (check the catalogue) |
| Product card (`product-card.js`, 430 lines) | `registry` `product:card`, wrapping the engine `ProductCard` [D-layout, D-card] | Required by review [D-design]. Heart `aria-pressed`, one link per card (LESSONS 6, 23) |
| Add-to-cart toast (`add-product-toast.js`) | Slot `body:end` plus `cart::item.added`, like the starter [D-slots, D-sdk] | Feminine labels |
| Cart drawer (`unix-cart-drawer.js`, 398 lines), free-shipping bar, installments, cart picks | Own drawer with engine `Drawer`, `cart` API and `useCoupon`. Cart data includes the free-shipping bar [D-index] | No engine slot inside drawers [D-full] |
| Cart page (`cart.twig`, `cart.js`), cashback note, submit hooks | Fork of `CartPage` (like Raed) or slots `cart:items.*`, `cart:summary.*`, `cart:submit.*` [D-twighooks] | Review asks for notes, coupons and quick-buy [D-design] |
| PDP shell (`product/single.twig`) | Fork of the product route, keeping `Product.loader` and `withHead(Product)` [D-pdp] | Engine Product JSON-LD replaces ours (D129) |
| Gallery 4:5 with thumbs and zoom (`unix-gallery.js`) | `registry` `product:gallery`, or a fork of `ProductGallery` [D-layout, G-forks] | LCP `Image priority` [D-perf] |
| Options as buttons, validation (`options.twig`, `validate-product-options.js`) | `SallaProductOptions` wrapper plus `useProduct` (live price and stock) [D-wc, D-slots] | The first available combination must be preselected [D-design] |
| Size finder (`unix-size-finder.js` + `-model.js`, about 875 lines) | Own component in slot `product:single.description` or in our forked PDP. **The algorithm (weights, steps, `unix_fit_v2`) ports unchanged** as a pure TS module | It selects the size through the options component; re-test against the React wrapper's API |
| Size charts (`unix-size-charts.js`) | `SallaProductSizeGuide` wrapper or SDK `product.getSizeGuides`, inside engine `Modal` [D-wc, D-index] | |
| Colour links (`unix-colour-links.twig`) | Own component that reads `settings.unix_colour_links` (plain text parsed) | Links through engine `Link` |
| Delivery estimate (`unix-delivery-estimate.js`) | Own component, logic ported as is | Settings `unix_delivery_*` |
| PDP share (`unix-pdp-share.js`) | Own component or `salla-social-share` | Review requires link, X and WhatsApp [D-design] |
| Installments (Tamara, Tabby) | `SallaInstallment` wrapper [D-wc] | Slot order: `product:single.description` comes before the installment widget [D-full] |
| Sticky add-to-cart (`unix-sticky-atc.js`), buy now (`unix-buy-now.js`) | Fork of `AddToCartForm` (Raed forks it too) [G-forks]. Quick buy is on by default [D-design] | |
| Reviews (`salla-comments`, `salla-rating-stars`) | Wrappers. They **load client-side on scroll** [D-pdp] | Judge.me styling through `s-*` classes |
| Complete the look and related (`unix-pdp-related.js`) | Slots `product:related.start/end` or the forked PDP, using `product.list` for a batch fetch | "No request per product" [D-review] |
| PLP banner, grid, filters drawer (`unix-plp.js`, `salla-filters`) | `registry` `product:list-page`, as Raed does [G-router, G-forks] | SSR the category name and description |
| Home components (13) | One React component each, registered under the same keys (§3, phase 5) | All fields stay identical |
| Shop the look (`unix-shop-look.js`) | Own component. Hotspot products fetched in **one** `product.list` call by ids | |
| Video tiles, hero video (play only while visible, pause button) | Own components. Video `poster` from `currentSrc` (LESSONS 28) | |
| Home reviews (`unix-reviews-home.js`) | Own block using `SallaReviews`, or the built-in `testimonial` block [D-blocks] | |
| Blog block, blog pages, article card | Own block. Blog routes forked or slotted (`blog:items.*`, `blog:single.*`) [D-twighooks] | Article JSON-LD through head `jsonLd` |
| Account pages, orders, wallet, wishlist, notifications, loyalty, thank-you | **The engine routes as they are**, restyled with SCSS, then forked only where our DS needs it (5.x tasks) | Every profile field must stay [D-design] |
| JSON-LD (`seo/unix-jsonld-site`, `-breadcrumb`, `-article`, plus FAQPage in `unix-faq`) | `withHead(..., r => ({...r, jsonLd}))` on the root, the routes and the home route [D-seo] | View Source check (D129) |
| WhatsApp URL helper, `|cdn(width)` | TS helper; engine `Image` (CDN sizing, lazy, aspect ratio) [D-perf] | |
| `animejs`, `sweetalert2` | Drop both. CSS animations are preferred [D-perf]; engine `toast` and `Modal` | Saves bundle size |
| `fslightbox` | The starter keeps it as a dependency [G-pkg] | Our zoom uses `<dialog>` (D45–D47). Keep that |
| webpack, `scripts/twig-check.mjs`, `pnpm twig:check` | Replaced by Vite, `pnpm typecheck`, Vitest and `check:manifest` [G-readme] | Delete them with the Twig code |

**Rules we must re-check against the React review rules:**
- The FAQ prints its **default answers (from the locale files) as raw HTML**, while merchant answers already use `nl2br`. React review forbids rendering setting text as HTML [D-review]. Locale HTML is ours and not merchant text, but avoid `dangerouslySetInnerHTML` entirely (Q8).
- Merchant links (`variable-list`) still need the http(s) or `/path` allow-list (LESSONS 35).

---

## 3. Phased migration plan

Assumption: one developer with the existing agents, working from `theme-raed-react` (the blog says "use the new React project as your foundation rather than trying to convert every Twig file") [B]. All design decisions are already made, so the work is engineering plus parity checks. Estimates are working days and **do not include Salla's review time**.

| Phase | Scope | Exit check | Estimate |
|---|---|---|---|
| **0. Decide and unblock** | Get answers to §4 (above all Q1, Q2 and Q5). Partner account verification (company ID and services certificate) [D-portal]. Create the React theme in the Portal (this also creates the private GitHub repo) [D-portal]. Create a **new dedicated demo store** and fill it with the PREVIEW.md fixtures [B FAQ 7]. Decide on the repo: a new repo, or a `react/` branch here with the Twig version archived on a tag | Theme listed in `salla theme list`; demo store has real products | 1–2 days of work (external waiting can take longer) |
| **1. Foundation** | `salla theme create --type react`. Vite and Tailwind content paths. Copy tokens and SCSS into `app/styles`. Fonts. Flatten locales (354 keys). Port `twilight.json` exactly and add `"type":"react"`. `__root.tsx` (lang and dir, translations, critical CSS). Rewrite `docs/kb/SALLA-TWILIGHT.md` as a React KB from §1 and point the agents at it | `pnpm build`, `typecheck` and `check:manifest --strict` pass; `/ar` and `/en` render with UNIX tokens | 3–5 |
| **2. Shared components** | ThemeLayout, announcement, header (mega menu, drawer, search, lang), footer, product card (registry), toast, cart drawer with free-shipping bar and installments, primitives (drawer and modal focus trap from DS §8.9) | Design and a11y review PASS on shell pages; keyboard and RTL | 6–9 |
| **3. PDP** (most important for conversion) | Forked PDP: gallery, info column, options, size finder, size charts, delivery, colour links, cashback, share, installments, sticky ATC and buy now, reviews, complete the look, related | View Source contains name, price and description; options and images sync; sold-out flows | 6–8 |
| **4. Other pages** | PLP (`product:list-page`) with banner and filters, cart page, thank-you, blog index and article, page-single, brands, loyalty, testimonials, the account pages (engine first, then restyle) | Every page from SPEC renders at both locales | 5–7 |
| **5. Home components** | All 13 blocks with identical keys and fields, `registerHomeComponentConfig` heights, empty-field defaults (LESSONS 10), preview images | Each block works with all fields empty and with all fields filled; LCP hero `priority` | 6–9 |
| **6. Settings parity** | Walk all 103 settings in the real editor (`salla theme preview`) and record every change and its effect. A setting counts as migrated only when changing it visibly works [B] | Settings checklist all ticked | 2–3 |
| **7. SEO and SSR** | Organization, WebSite, Breadcrumb, BlogPosting and FAQPage through `jsonLd`, with no duplicate Product (D129). Canonical and hreflang. **SSR-critical content in loaders, not in on-scroll blocks:** the hero, the products-tabs first tab and the FAQ text should sit in the first three blocks or be fetched by the home loader. Update the 301 map for `/ar/` | View Source on home, product, category and article; Rich Results test | 2–3 |
| **8. Performance** | Lighthouse mobile ≥ 85 on home, PLP and PDP (≥ 60 and ≥ 90 are the documented minimums [D-review]). Narrow imports, `React.lazy` drawers, `RenderWhenVisible`, image sizes, size ≤ 2 MB | Numbers recorded in `docs/PERFORMANCE.md` | 3–5 |
| **9. Review and launch** | Full design, code, a11y, SEO and launch-gatekeeper pass. Browser matrix (Chrome, Firefox, Safari, Edge; iOS and Android). Test Salla apps (Chat, Analytics) after client-side navigation [B]. Screenshots (at least 4), listing, change log, then `salla theme publish` | Gatekeeper READY. Publication request sent | 3–5 |
| **Total** | | | **35–53 working days ≈ 7–11 weeks**, plus Salla review (calendar time unknown; every rejection costs a new cycle [D-review]) |

### Top risks
1. **The deadline has already passed for Twig.** Twig submissions closed 5 days after 15 Oct, and from 1 Nov only React themes are publishable [B]. Our private Twig theme 705562203 is very likely **unpublishable**, so the live store can't launch on it unless Salla makes an exception (Q1). Launch timing for unix.sa now depends on this migration.
2. **The platform is days old and changing fast.** The engine shipped 1.0.172 today [N-engine], and the starter was created on 7 Oct [G-tree]. Every fork has to be re-diffed on each engine upgrade [G-forks], and keeping up with releases is a review rule [D-review]. Keep forks to a minimum: the PDP, the PLP and maybe the cart.
3. **Sources disagree** (Next.js vs TanStack, "salla-next-sdk", Lighthouse 85 vs 60/90, `init --stack` vs `create`) [B vs D-*]. We build to the docs and the starter, and aim for the stricter number.
4. **SSR gaps.** On-scroll home blocks and PDP reviews and related products aren't in View Source [D-addblock, D-pdp]. SEO-critical content must be in loaders.
5. **Translation precedence.** Salla's store strings override theme strings for shared keys, so masculine copy could reappear [D-i18n]. Keep every key in our namespace.
6. **Brand-font lock vs `--font-main` guidance** [D-fonts], and **built-in home blocks expected by design review** that our theme doesn't have (brands, YouTube, flash discount and others) [D-design]. This could get the theme rejected (Q6, Q7).
7. **Eight `salla-*` tags we use are missing from the React catalogue** (§2.1). The size finder relies on driving `salla-product-options` from outside, which has to be re-proven with the React wrapper.
8. **Account and store logistics:** the partner verification is still pending (memory: 2026-11-09), a new preview store is needed, and a private theme must cost at least 1,000 SAR [D-pub, D-portal].

---

## 4. Open questions for Salla support

1. **Theme 705562203 (private Twig, UNIX Demo):** can it still be submitted or installed as a private theme for one store after 1 Nov 2026, even as a stopgap until the React version is approved? If yes, until when will it run on a live store, given "at least the end of the year" [B FAQ 4]?
2. **Linking:** blog FAQ 5 and 9 describe linking a React theme to its Twig version (same name, ratings carried over). Does this apply to a **private** theme that was never published? Should we create the React theme as a new theme in the Portal, or is there a "convert" path for 705562203?
3. **"salla-next-sdk":** the blog requires it, but no such package exists on npm and the docs never name it. Is building on `@salla.sa/twilight-theme-engine` + `@salla.sa/twilight-components-react` + `window.salla` the same thing? Is a Next.js variant required later?
4. **Performance bar:** the blog says Lighthouse > 85, while the review docs say an average of ≥ 60 for performance and ≥ 90 for accessibility. Which one applies to a private theme, measured how (mobile or desktop, which store)?
5. **Preview store:** a private theme for one merchant: does it still need its own dedicated preview store, and can the merchant's real store (unix.sa on Salla Pro) be that store?
6. **Design requirements for private themes:** must a private, single-store theme ship every home block in the design list (brands, YouTube, flash discount, store features, testimonials, banners), or only what that store uses?
7. **Fonts:** may a private theme lock the brand fonts (Somar and IBM Plex Sans Arabic) and leave the `fonts` feature off, or does review require following `--font-main`?
8. **HTML in locale strings:** may theme-owned translation strings (our default FAQ answers with `<p>`, `<strong>` and `mailto`) be rendered as HTML, given that the rule bans merchant setting HTML?
9. **Price rule:** is the minimum of 1,000 SAR for a private theme charged to the merchant even when the partner and the merchant are the same company? Can it be waived or set for a single store?
10. **Size limit:** does the private-theme limit of 2 MB apply to the source repository or to the built output?
11. **Settings migration:** will the Raed migration tool [B FAQ 8] be available to partner themes, and does it match settings by `id` and home blocks by `path`? (We are keeping both identical either way.)
12. **URLs:** on a store whose default language is Arabic, is the canonical Arabic URL always `/ar/<slug>/p<id>`, or can the unprefixed URL be canonical? We need the answer to finalise the Shopify → Salla 301 map.
13. **Web components:** are `salla-thank-you-page`, `salla-thank-you-header`, `salla-cart-summary-card`, `salla-order-payment`, `salla-order-rewards`, `salla-review-order-item`, `salla-bullet-delivery-tag` and `salla-add-product-toast` retired in 3.x, and what replaces each one?
