# UNIX (unix.sa) — Shopify theme blueprint for the Salla Twilight rebuild

Source: live MAIN theme `gid://shopify/OnlineStoreTheme/157938581671`, "UNIX — 20% offer removed". It is based on **Strive**, a Swipe-family theme with Dawn lineage: Swiper.js carousels, `<sticky-header>`, `<cart-drawer>` and pubsub.
Store: Saudi Arabia, SAR. Money format is `{{amount}} ر.س`. The default locale is Arabic (RTL), and English is a second published language under `/en`.
Every file referenced here is saved verbatim next to this spec, in the same folder structure.

---

## 1. Global design tokens

### 1.1 Base units
- `html { font-size: 10px }`. All `rem` values below use 1rem = 10px.
- Container: `.container` is full-width up to `max-width: 1904px`. Side padding is **2rem** on mobile and **3.2rem** from 1200px up.
- Breakpoints used throughout: 576, 750 (the mobile/desktop split), 990, 1100 (the drawer menu hides at 1100 and up), 1200, 1360 and 1600px.
- Radii (from settings_data): `--border-radius-main: 16px` for cards, banners and images, and `--border-radius-button: 30px` for pill buttons. The theme defaults were 6/6, so UNIX changed both.
- Section padding presets (`snippets/section-padding.liquid`), given as mobile → desktop (≥750px):
  - `xs`: 1.6 → 3.2rem
  - `s`: 2.4 → 4rem
  - `m`: 3.2 → 6.4rem
  - `l`: 4 → 8rem
  - `xl`: 6.4 → 11.2rem
  - `no-indent`: 0
- Margins follow the same scale (`section-margin.liquid`).
- `--spaced-section`: 5rem on mobile and 16rem from 990px up.
- Motion: `--duration-short: 100ms`, `--duration-default: 250ms`, `--duration-long: 500ms`.

### 1.2 Color schemes (hex, from `config/settings_data.json`)
Schemes map to CSS variables in `snippets/_color-vars.liquid`:
- `colors_background_1` → `--color-background`
- `colors_text` → `--color-foreground`
- `colors_solid_button_background` → `--color-button`
- `colors_outline_button_labels` → `--color-button-secondary`. Note that this field is the secondary button's *background*.
- `colors_secondary_button_labels` → `--color-button-secondary-text`
- `color_border` → `--color-border`
- `color_accent` → `--color-accent`

The **first scheme (background-1) is also `:root`**.

| Scheme id | Used for | bg1 / bg2 | text / secondary / title | primary btn bg (hover) / label | secondary btn bg (hover) / label | tertiary label / border | input bg / focus | border | accent | price new / old / sale |
|---|---|---|---|---|---|---|---|---|---|---|
| **background-1** (`:root`) | page default, header bg, collapsible on list pages | #ffffff / #e9e9e9 | #1c313d / #666666 / #1c313d | #1c313d (#395361) / #f2eccd | #e9e9e9 (#dfdfdf) / #1c313d | #1c313d / #e2dcdb | #e9e9e9 / #e2dcdb | #e2dcdb | – | #000000 / #666666 / #d60202 |
| background-2 | FAQ rows (`row_color_scheme`) | #e9e9e9 / #ffffff | #1c313d / #666666 | #1c313d (#395361) / #f2eccd | #ffffff (#dfdfdf) / #1c313d | | #ffffff | #e2dcdb | – | |
| background-3 | (disabled sections) | #1c313d / #1f1f1f | #ffffff | #1c313d / #f2eccd | #ffffff / #1c313d | | #152936 | #e2dcdb | #f2eccd | #fff / #ccc / #666 |
| background-4 | – | #1c313d / #1f1f1f | #f2eccd | | | | | | | |
| **scheme-29a5b044… ("Cream", the MAIN brand scheme)** | footer, trust strip, tabs section, featured-products, banner-grid, blog, FAQ, product recs, cart, badges, quick-buy, cart drawer | **#f5f1ea** / #e8e0d5 | **#241e1a** / #8a8079 / #241e1a | **#373542** (#4b4960) / #f5f1ea | **#373542** (hover #ddd3c6) / #f5f1ea (hover label #241e1a) | #241e1a / #ddd3c6 (tertiary hover bg #e8e0d5) | #efeae1 / #8b7355 | **#ddd3c6** | **#8b7355** | #241e1a / #8a8079 / #8a8079 |
| **scheme-7a3489a3… ("Sand / overlay")** | hero media-banner, featured-collection overlay, featured-collections, blog cards | **#d8c5b8** / #2b2420 | #ffffff / #ffffff / #f5f1ea | #373542 (#4b4960) / #f5f1ea | #241e1a (#8b7355) / #f5f1ea | #f5f1ea / #f5f1ea (hover bg #8b7355) | #2b2420 / #a8927d | #a8927d | #a8927d | #f5f1ea / #a8927d / #a8927d |
| **scheme-d82e0a29… ("Ink")** | announcement bar, collection banner | **#363441** / #363441 | **#f3eeea** | #1c313d (#395361) / #f2eccd | #e9e9e9 / #1c313d | | | #e2dcdb | – | |
| scheme-9d65d6fe… ("Mocha") | unused | #f5f1ea / #e8e0d5 | #2b2420 / #efeae1 / #f5f1ea | #8b7355 (#6f5c44) / #f5f1ea | | | #efeae1 / #8b7355 | #ddd3c6 | #8b7355 | |

**Brand palette (use these names in Salla):**

| Token | Hex | Notes |
|---|---|---|
| ink | **#373542** | Buttons, outline buttons, header icons over the hero. Hover is #4b4960. |
| ink-dark | #241e1a | Text on cream |
| cream | **#f5f1ea** | Main section background, button labels |
| sand | #e8e0d5 | Secondary surface |
| input | #efeae1 | Input background |
| line | #ddd3c6 | Borders |
| taupe | #8b7355 | Accent, stars, histogram bars, input focus |
| muted | #8a8079 | Secondary text, old price |
| hero-sand | #d8c5b8 | Hero banner background |
| announce | #363441 | Bar background, with text #f3eeea |
| navy | #1c313d | Legacy navy, the default text color on white pages |
| butter | #f2eccd | Default button label |
| National Day green | #14532D | Campaign only |

Size-finder palette:
- ink #22323E
- paper #F8F6F2
- ok-green #2F5D46

### 1.3 Typography
- **Arabic locale (the default):** everything uses **IBM Plex Sans Arabic**, loaded from Google Fonts at weights 300/400/500/700. The fallbacks are Tahoma and sans-serif.
  - Heading weight is overridden to 400.
  - All letter-spacing is set to 0.
- **Arabic headings:** `assets/custom-arabic-headings.css` (loaded only when the locale contains `ar`) applies the bundled **Somar Bold** (`assets/Somar-Bold.woff2`, preloaded, `@font-face` family "Somar", weights 600–800) to every `h1`–`h4`, `.h0`–`.h4`, `.title`, `.section-heading` and the main section title classes.
  - Style: `font-weight: 700; letter-spacing: -0.01em; line-height: 1.32; word-spacing: .02em`.
  - `strong` inside headings gets weight 800.
  - Section titles use `clamp(2.4rem, 1.55rem + 3.9vw, 4.6rem)` with line-height 1.3. This covers popular-products, featured-collections, featured-collection, featured-blog, collapsible-content, product-markers and banner-grid.
  - The hero `.media-banner__heading.hero-display` uses `clamp(3.6rem, 2.2rem + 6vw, 8rem)` with line-height 1.28.
  - On mobile (≤749px), headings get `line-height: 1.4`, `text-wrap: balance` and `overflow-wrap: break-word`.
- **English locale:** Open Sans for everything (300–700). The Montserrat set in settings is overridden by `snippets/_fonts.liquid`.
- **Scales from settings:**
  - body_scale 1.17; body line-height 1.4 (default)
  - h1 1.30, h2 1.18, h3 1.08, h4 1.12 (default)
  - heading line-height 1.3, heading letter-spacing -0.3 (both ignored for Arabic)
  - card heading scale 1.06
- **Base sizes** (multiply by the scale). Each list gives the base size first, then the size from each breakpoint up:
  - h1: 2.95rem; 3rem from 750px; 3.2rem from 1360px; 3.6rem from 1600px
  - h2: 1.9rem; 2.2rem from 750px; 2.6rem from 1360px; 2.8rem from 1600px
  - h3: 1.6rem; 1.8rem from 750px; 2rem from 1600px
  - h4: 1.4rem; 1.6rem from 750px
  - body: 1.2rem; 1.3rem from 750px; 1.4rem from 1600px
  - body-large: 1.4rem; 1.5rem from 750px; 1.57rem from 1600px
  - body-xl: 1.6rem; 1.7rem from 750px; 1.8rem from 1600px
  - body-small: 1.05rem; 1.2rem from 750px
  - body-xs: 1.05rem
- **Hero display (English):** `clamp(3.8rem, 2.2rem + 4.5vw, 8.4rem)`, line-height 1.05, letter-spacing -0.02em. For `:lang(ar)` this becomes line-height 1.3 and letter-spacing 0.

### 1.4 Buttons (`assets/base.css` + overrides)
- **Base:** `min-height: 4.4rem; padding: 0 2.4rem; font-size: 1.4rem; border-radius: 30px`. The button font family applies (IBM Plex in Arabic).
- **Hover mechanic (all filled buttons):** a `::before` layer in the hover color slides up from `translateY(100%+1px)` to `none`, and the label sits above it with `z-index: 1`. Duration is 250ms.
- **Variants:**
  - **primary:** bg `--color-button` (#373542 on cream), label #f5f1ea, hover fill #4b4960.
  - **secondary:** bg `--color-button-secondary` (#373542 on cream), label #f5f1ea. Hover fill is #ddd3c6 with the label turning #241e1a.
  - **tertiary:** transparent with `inset 0 0 0 .1rem` border #ddd3c6. Hover fills #e8e0d5.
  - **outline** (custom; `unix-custom.css` + `custom-arabic-headings.css`): transparent, `color: #373542; box-shadow: inset 0 0 0 .12rem #373542`. On hover, a #373542 fill slides up and the label turns #f5f1ea. Used for "تصفحي الجميع", "تسوقي الان" and the 404 page.
  - **simple / underline:** text link with an animated 1px underline (background-size 0 → 100%).
  - **Hero CTA `.media-banner__cta--underline`:** 1.5rem text with `padding-bottom: .6rem` and a 1px underline drawn by `::after`. On hover the underline scales to 0.55, with the transform origin at the start side. `--ghost` is the pill variant: border 1px currentColor, `padding: 1.5rem 3.2rem`, `backdrop-filter: blur(2px)`.
- **Disabled:** opacity .5.

### 1.5 Other globals (settings_data)
- **Product card:**
  - Secondary text shows the vendor.
  - Sale, sold-out and custom badges all use the Cream scheme.
  - Swatches: `card_color_swatches_mode: full`.
- **Quick view / quick add:**
  - Enabled, including on mobile.
  - Button style is primary on desktop, appearing on hover; on mobile it is a link.
  - The "more" label reads "تسوقي الان".
- **Predictive search:** on. The collection button label reads "تسوق الان".
- **Pagination:** numbered pages.
- **Cart:**
  - `cart_type` is **drawer** (the schema default; not overridden).
  - The drawer uses the Cream scheme and shows a "view cart" button.
  - Empty cart heading: "لا تفوّتي جديدنا!"
  - Empty cart text: "سلتك فارغة الآن، اكتشفي تشكيلتنا واملئيها بما يعجبك"
  - Free-shipping slider: **off** (`show_shipping: false`). Its configured values are min_spend 600 and messages "أنفقي ||amount|| إضافية للحصول على شحن مجاني داخل السعودية" / "مبروك! أصبحتِ مؤهلة للشحن المجاني!".
- **Misc:**
  - Currency code is enabled.
  - Back-to-top button is on.
  - Breadcrumbs are off.
  - Dark mode is off (`color_scheme: light`).
  - Favicon: `shop_images/Favicon_b253d7fe-….png`.
- **Social links:** none are set in theme settings. The social icons are hard-coded in the trust strip (§3.3).

---

## 2. Header group (`sections/header-group.json`)

Order:
1. **countdown-timer-bar** (DISABLED). Its text, for reference: "Free Shipping Across Saudi Arabia on Orders Above 600 SAR".
2. **announcement-bar:**
   - Height 40px on desktop and mobile. Scheme "Ink": bg #363441, text #f3eeea.
   - Swiper autoplay with 4s per slide and 0.8s transition (`assets/announcement.js`).
   - Slides:
     1. "وصلت مجموعتنا الجديدة: Sailor وHalo Back وSoft Angle"
     2. "شحن مجاني داخل السعودية للطلبات فوق 500 ر.س". Note that this says 500, while the FAQ and settings say 600, so it needs confirming.
   - Centered text, one line, no links.
   - National Day override (date-gated 2026-09-07 → 2026-10-14; now inactive): bar bg #14532D and text #F5F1EA via `unix-nd-bar.css`.
3. **header:**
   - **Layout:** `logo_position: center-logo`, giving three zones:
     - **Start side** (right in RTL): mobile hamburger drawer, desktop burger button and inline menu.
     - **Center:** logo, 120px wide (`shop_images/rArOZG772n6jswJQnKO8gU6afFM.png`).
     - **End side:** AR/EN toggle pill, search icon, account icon, cart icon with count bubble. Swym injects its wishlist launcher icon with a count.
   - `min-height: 6rem`. Bottom border on (`header--border`).
   - **Inline menu:** `main-menu`, shown at ≥1100px. A CSS rule (`unix-custom.css`) hides Home, About, Blog and Gift Card links from the inline desktop row; they stay in the burger and drawer menus.
   - **Desktop burger menu** (block `desktop_burger_menu`): opens `main-menu` in a side panel. A promo card is enabled but has no image or text.
   - **Mega menu:** block disabled.
   - **Search:** modal or predictive search, no tabs. Product results use 3/4 cover images with vendor.
   - **Account:** modal component on (`customer-account-main-menu`).
   - **Language selector:** on. It renders a compact **AR | EN pill toggle** (`snippets/header-lang-toggle.liquid` + `custom-language-mobile.css`):
     - Pill: bg = input color, `padding: .3rem; border-radius: 30px`.
     - Buttons: `padding: .5rem .9rem; font-size: 1.2rem`.
     - The active button gets a white bg and `box-shadow: 0 1px 4px rgba(shadow, .12)`.
     - The country selector is off.
   - **Sticky:** `sticky_header_type: on-scroll-up`. The header hides on scroll down and slides back in on scroll up with `transform .15s ease-out`. Once sticky, the bg is solid `rgb(var(--color-background))` (white).
   - **Transparent overlay on the home hero:** the hero sets `enable_header_overlay`, which adds `.color-background-overlay`, so the header sits on top of the video. The premium CSS in `section-media-banner.css` forces **brand-dark (#373542) icons and logo** over the hero, plus a cart bubble with #373542 bg and white text. The hero section is pulled up with `margin-top: calc(var(--header-height)*-1)`.
   - **Mobile drawer** (`header-drawer.liquid`, below 1100px): customized to an **inline accordion** (`unix-custom.css`). Submenus expand underneath their parent instead of sliding panels, with the caret rotated 90° (RTL) and child links indented by 1.6rem at .95em. Region and language pickers remain sliding panels.

Mobile promo inside the drawer: disabled.

---

## 3. Footer group (`sections/footer-group.json`)

### 3.1 Footer section (scheme Cream: bg #f5f1ea, text #241e1a)
Column blocks, in order:
1. `link_list` "Policies" (English duplicate, DISABLED)
2. `link_list` **"سياسات"** → menu `footer`
3. `link_list` **"القائمة"** → menu `footer-menu`
4. `shop_details` (DISABLED)
5. `subscribe`: heading **"لا يفوتك جديدنا :"**, an email field and a primary button (ink pill)

Settings:
- Logo 120px (same PNG as the header) in the bottom row
- `show_social: true`, though no social URLs are set, so nothing shows
- Copyright year and shop name on
- Policies row off
- "Follow on Shop" on

On mobile the link lists collapse into accordions (`default_open: false`).

### 3.2 Bottom row
`.footer__content-bottom` holds the logo, copyright, (policies) and Follow on Shop.

### 3.3 Trust strip (`custom-liquid` → `snippets/unix-trust.liquid` + `assets/unix-trust.css`)
This is the last band on every page. It uses the Cream bg and is centered, with `max-width: 74rem` and padding `1.2rem 0 3.6rem`. Contents, top to bottom:
1. **Icon tiles:**
   - Tiles are 4.6rem (4.2rem on mobile), radius 14px, white bg, `box-shadow: 0 0 0 1px rgba(55,53,66,.1)`, icon color #373542 at 2.1rem, gap 1.2rem.
   - Icons in order: phone (`tel:+966573616566`), WhatsApp (`https://wa.me/966573616566`), Instagram (`https://www.instagram.com/unix_theclub`), TikTok (`https://www.tiktok.com/@unix_theclub`).
   - Hover colors: WhatsApp #25D366, Instagram #C13584, TikTok #000.
2. **Credentials:**
   - Commercial registration: a Saudi Business Center badge image (`cdn…/files/caf0145a-3812-44c1-be62-422577a1def6.png`, 5.6rem wide) beside "السجل التجاري" / **1009084709**.
   - Trademark: "العلامة التجارية" / **TM-01-00-14674-25**.
   - Labels are 1.3rem at opacity .75; values are 1.35rem with `dir="ltr"`.
3. **Payment row:** top border `1px rgba(55,53,66,.14)`, padding-top 2.4rem, gap .7rem.
   - Every mark sits in the same box: 4.8×3.1rem, radius 5px, white, hairline shadow.
   - Order: Tamara (`files/tamara.png`), Tabby (`files/tabby2.svg`), then Shopify's enabled card brands (Visa, Mastercard, Apple Pay and so on, as SVG), then mada (`files/mada-circle.png`).
4. **Rights line:** "جميع الحقوق محفوظة لـ UNIX © 2026", 1.2rem, opacity .45.

CDN base for these images: `https://cdn.shopify.com/s/files/1/0710/2791/6967/files/`.

---

## 4. Homepage (`templates/index.json`): sections in exact order

DISABLED sections are listed only for completeness; do **not** build them.

### 4.1 `media_banner_NJrzt4`: HERO (media-banner)
- **Layout:**
  - Full width; scheme Sand (#d8c5b8 bg, white text).
  - `layout_style: minimal`, `section_height: adapt`.
  - Header overlay on; `overlay_style: gradient-bottom` with `opacity_overlay: 0.5`.
  - Content `text_align: bottom-left`, which ends up on the bottom-right in RTL. `text_width: medium` (max 59rem at 750px, 65rem at 1200px, 87rem at 1360px).
- **Media:**
  - **Video** (`show_video: true`): desktop `files/videos/Unix.mp4`, mobile `files/videos/Unix (1).mp4`.
  - Fallback images: desktop `shop_images/i-1.jpg` (16/9), mobile `shop_images/hf_20260712_211438_a282bcf3-….webp` (2/3).
- **Motion:** `fade-up` with stagger. Blocks start at opacity 0 and `translateY(2.4rem)`, then transition over .8s `cubic-bezier(.22,.61,.36,1)` once `.is-inview` is added. A scroll indicator chevron (4.4rem button, bobbing animation) sits at bottom center.
- **Blocks:**
  1. Subheading **"UNIX NEW COLLECTION"**. Minimal style: 1.1rem, uppercase, letter-spacing .12em (.04em in Arabic), opacity .6.
  2. Heading (h1, `hero-display`) **"تحركي بثقة."**
  3. Text **"ملابس رياضية و بيجامات صُممت لكل لحظة في يومك"** (1.5rem, line-height 1.6, opacity .85).
  4. Button **"اكتشفي المجموعة"**, style *underline* → `/collections/new-collection`.
  5. Divider (mobile alignment `after`).
- Block spacing: 1.2rem; 2.4rem between the text and the CTA.
- Marquee is off. For reference its text is "حركة ، رياضة ، استرخاء ، يونكس معك في كل تفاصيل يومك".

### 4.2 `offer_home` (custom-liquid → `unix-offer`, mode `home`)
This currently **renders nothing**: the 2+ activewear 20% offer was stopped on 31 Oct 2026. Keep a placeholder slot only.

### 4.3 `products_with_tabs`: "المفضلة دائما"
- **Layout:**
  - Scheme Cream. Heading **"المفضلة دائما"** (h2 tag, h3 size; centered and 21px on mobile via custom CSS).
  - Padding s/s.
  - 4 products per row on desktop and 2 on mobile, as a carousel (Swiper with prev/next arrows and pagination).
- **Cards:** image 2/3 `contain`, secondary image on hover, vendor shown, no description.
- **Tabs:** pills that scroll horizontally. Each is `padding: .9rem 2.4rem; min-height: 3.8rem; gap: .8rem`, styled as a button. The active tab is `button--secondary` (ink); inactive tabs are tertiary.
  1. **"وصل حديثًا"**: collection `new-collection`, 8 products. Tab button "تسوّقي الجديد" → `/collections/new-collection`.
  2. **"الأكثر مبيعا"**: manual products `comfy-boyfriend-shirt-sky-blue`, `soft-pyjama-set`, `waist-tone-pants-off-white`, `core-control-bra-top-black`, `curve-enhance-set-toffee`.
  3. **"توبات كومفي"**: collection `comfy-top`, 4 products.
  4. **"اطقم كومفي"**: collection `comfy-set`, 4 products.
  5. **"ليقينز رياضية"**: collection `legging`, 4 products.
- **Bottom button:** **"تصفحي الجميع"**, style *outline* → `https://unix.sa/collections/all-products`.

### 4.4 `featured_collection_PU8y3X`: "جديد من يونكس" (featured-collection, layout `overlay`)
- Collection `new-collection`, shown as a product carousel over the collection image with overlay opacity .3.
- Scheme Sand.
- Subheading "NEW COLLECTION". Heading **"جديد من يونكس"** (h1 size, h2 tag).
- Cards: 2/3 `contain`, with secondary image and vendor.
- No padding.

### 4.5 `featured_collections_YMJcqj`: "حركة. رياضة. استرخاء." (featured-collections)
- **Layout:** full width, scheme Sand.
- **Header content:** text aligned left (start), width large.
  - Heading **"حركة. رياضة. استرخاء."** (h1 size).
  - Text in bold: "مجموعة صُممت بعناية لتكون جميلة و عملية في الوقت ذاته، لتأخذك من تمارينك الصباحية إلى استرخائك المسائي".
  - Button **"تسوقي الان"**, *outline* → `/collections`.
- **Color override:** custom CSS forces the heading, subheading and info text to **#373542** because they sit on a light image. The info block gets padding-top 35px.
- **Cards:** 3 collection cards, ratio 3/4, h2 titles.
  1. `set`: image `shop_images/Product2_d8c6124a-….webp`, overlay .1
  2. `comfy-set`: image `shop_images/Comfy_Collection.webp`, overlay .2
  3. `accessories`: image `shop_images/Accessories_Collection.webp`, overlay .2
- `show_video: true`, but no video is set. Mobile media ratio is 3/4.

### 4.6 `product_markers_DaXLdg` (DISABLED)
Shoppable image "تصفحي جديد يونكس و أكثر القطع مبيعًا".

### 4.7 `featured-products`: "اختاري قطعتك المفضلة لوقت الاسترخاء"
- Scheme Cream; padding m/m.
- 3 products per view, as a carousel with swipe on mobile.
- Each item pairs a lifestyle image with its product card. Custom CSS gives `.featured-products__item-image` a **16px radius**.
- Products:
  1. `pearla-lounge-set-pants-pearl`, image `website-interface-02.webp`
  2. `curve-enhance-set-whip-pink`, image `IMG_8005.webp`
  3. `waist-tone-hoodie-off-white`, image `website-interface-04.webp`
  4. `bamboo-3-pieces-set-cold-blue`, image `website-interface-03.webp`
- Card image ratio 2/3 `contain`, vendor shown.

### 4.8 `banner-grid`: two video tiles
- 2 columns on desktop; 1 column on mobile with swipe. Gap 24px.
- Ratio 3/4 on both desktop and mobile. Scheme Cream; padding-top l.
- Tile 1: video `files/videos/WhatsApp Video 2026-08-01 at 16.35.30.mp4`. The whole card is a link (`full_link`) → `/collections/all`. Overlay .2, image parallax on, no text.
- Tile 2: video `…16.37.58.mp4`. Scheme background-3, overlay .2, no text and no link.

### 4.9–4.11 Disabled sections
- countdown_B7eKBG
- popular-products_2
- popular_products_QQMD6b

### 4.12 `featured_blog`: "من عالم UNIX"
- **Source and layout:**
  - Blog `news`, scheme Cream.
  - Columns layout: 4 per row on desktop, carousel; up to 7 posts (3 on mobile).
  - Heading **"من عالم UNIX"** (in `<strong>`, h3 size).
  - Padding l/l.
- **Card content:**
  - First post card: tags, date and author.
  - Other cards: no image; date and excerpt shown.
  - Images are portrait when present.
- **Button:** "تصفّحي المقالات", primary.

### 4.13–4.17 Disabled sections
- media_banner_myDdjy
- popular-products
- multicolumn
- logo-list
- featured-collection

### 4.18 `collapsible-content`: FAQ "إجابات لكل تفصيلة"
- **Layout:**
  - `layout: border`, scheme Cream, rows use background-2 (#e9e9e9).
  - Centered heading **"إجابات لكل تفصيلة"** with text "جمعنا لكِ أكثر الأسئلة تكرارًا، لتتسوّقي بثقة وراحة".
  - Show more (primary) and show less (secondary) buttons.
  - FAQPage JSON-LD schema on. Padding l/l.
- **Q&A, in order:**
  1. **كيف أعرف مقاسي المناسب؟** (open by default) — explains the «اعرفي مقاسك» tool and the cm size chart.
  2. **هل توفرون شحن مجاني ؟** — free shipping over **600 SAR** within KSA.
  3. **ما الأقمشة التي تستخدمونها ؟** — nylon/spandex activewear, soft cotton-blend loungewear, care advice.
  4. **إلى أين تشحنون، وكم يستغرق التوصيل؟** — KSA, GCC and worldwide; 1–4 business days in KSA; tracking link by email and SMS.
  5. **ما سياسة الإرجاع؟** — request within 24h of receipt; unused, tags on; sale items are final; contact `info@unix.sa`.
  6. **ما وسائل الدفع التي تقبلونها؟** — mada, Visa, Mastercard, Tabby, Tamara.
  7. **هل يمكنني الدفع بالتقسيط؟** — yes, via Tabby and Tamara.

The full Arabic answer text is in `templates/index.json`.

---

## 5. Product page (`templates/product.json` + `sections/main-product.liquid`)

### 5.1 Main section settings
- **Gallery:**
  - Desktop: `slider_previews` (main slider plus a thumbnail strip). `desktop_alignment: right`, so media sits on the right in LTR terms; in RTL this is the start side.
  - Mobile: `slider`, with the gallery placed *before* the info.
  - Aspect 2/3, `contain`. All variant media shown.
  - Zoom on desktop and mobile; modal zoom uses `contain`.
- **Padding:** bottom l.
- **Custom:** mobile `.product__outer { padding-top: 0 }`, so the photo sits flush under the header.

### 5.2 Info column blocks, in order
1. vendor (DISABLED)
2. **title**: h1 tag, h2 size (Somar Bold in Arabic)
3. **price**:
   - Sale price and compare-at price, with a sale badge in the Cream scheme.
   - "Taxes included" and shipping-policy note (`body-xs`).
   - Shopify installments `payment_terms` form beneath.
4. **unix_promo_code** (custom_liquid): `{% render 'unix-nd-code' %}{% render 'unix-offer', mode: 'chip' %}`. Both currently render nothing: the National Day KSA96 code ended 14 Oct 2026 and the offer was stopped. This is the slot for a copy-to-clipboard promo chip (see §8).
5. **unix_tamara**: Tamara summary widget (`snippets/tamara.liquid`):
   - Script `https://cdn.tamara.co/widget-v2/tamara-widget.js`.
   - Config: publicKey `c4ecb8b5-4de1-4781-8620-1eb1371c3a16`, country SA, lang = locale, `type="tamara-summary"`, inline-type 2, `badgePosition` right, font 14px, amount = product price.
6. **Tabby** app block (`tabby-pay-later` "cart-no-rerender"): Tabby installment promo.
7. **variant_picker**:
   - `picker_type: button`, with option labels shown.
   - Colour uses Shopify swatches (`shopify_swatch`), portrait variant image.
   - The G: Combined Listings swatches app is also active, but its swatches are hidden on cards.
8. **unix_size_finder**: «اعرفي مقاسك» quiz (see §8.1).
9. **size_guide_custom** (inline custom liquid):
   - Underlined text buttons "دليل المقاسات", "دليل مقاسات الأعلى" and "دليل مقاسات الأسفل".
   - They read metaobject/page refs from `product.metafields.custom.size_chart`, `size_chart_top` and `size_chart_bottom`, and open full-screen modals: `rgba(0,0,0,.5)` scrim; a white card with max-width 900px, max-height 90vh, radius 12px and padding 16px; × close at top-left; content is the `.rte` of the chart page.
10. **buy_buttons**:
    - Quantity selector.
    - **Add to cart:** full-width primary pill (#373542 / #f5f1ea).
    - **Dynamic checkout:** Apple Pay / Shop Pay "Buy it now".
    - Gift card recipient form when applicable.
11. **unix_shipping_estimate**: "متى يصلك طلبك؟" delivery estimator (see §8.3).
12. inventory, tags and popup: all DISABLED.
13. **pickup_availability**: standard.
14. **dropdown_information ×3** (accordions, closed):
    - **"الوصف"** → `product.description`
    - **"مميزات المنتج"** → `product.metafields.custom.key_features`
    - **"تعليمات العناية"** → `product.metafields.descriptors.care_guide`
15. **Judge.me preview badge** (stars plus review count) at the bottom of the info column.

Swym's wishlist button is injected by the app on the product page.

### 5.3 Sections below the main section
1. **complete_the_look** (custom section `sections/complete-the-look.liquid`):
   - Heading **"أكملي الإطلالة"**.
   - Reads `product.metafields.custom.complements` (a list of product references); limit 2; price shown; scheme background-1.
   - Padding 32px top and 40px bottom.
   - Each item has an "أضيفي" quick-add button that opens the variant modal.
2. **apps**: **Judge.me review widget**, real data, max-width 1200, no shop reviews.
3. **product-recommendations**:
   - Heading **"قد يعجبك أيضًا"**; scheme Cream; 4 columns, no carousel; 2 columns on mobile.
   - Cards 2/3 `contain`.
   - Button "عرض الكل" (secondary) → `/collections/all`.
   - Padding s/l.
4. popular_products_LKpNjw: DISABLED.

`templates/product.slideshow.json` is an alternate template, also saved.

### 5.4 Metafields the product page depends on
| Metafield | Used for |
|---|---|
| `custom.size_chart`, `custom.size_chart_top`, `custom.size_chart_bottom` | Size chart page refs |
| `custom.fit_delta` | Number |
| `custom.size_fit_style` | Text containing "small" or "large" |
| `custom.key_features` | Product features accordion |
| `descriptors.care_guide` | Care instructions accordion |
| `custom.complements` | Product list for "Complete the look" |
| `judgeme.badge` | Review stars |

---

## 6. Collection page (`templates/collection.json`)
1. **main-collection-banner:**
   - Scheme Ink (#363441 bg, #f3eeea text).
   - h1 title, collection description shown, no image (`image_ratio: small`).
2. **main-collection-product-grid:**
   - 12 products per page; 4 columns on desktop, 2 on mobile.
   - Cards 2/3 `contain`, with secondary image and vendor.
   - **Filtering:** on, `filter_type: horizontal_united` (a horizontal filter bar). The highlighted horizontal filter is **"مقاس"**. Filters are not sticky; sorting is on.
   - Image filters: 4/5 cover, 2 columns.
   - Padding-bottom m. Pagination is numbered.
3. rich-text: DISABLED.

`collection.activewear-offer` is the same grid with 24 per page and a `unix-offer` hero slot, which is currently empty.

**Product card** (`snippets/product-card.liquid`):
- **Image:** `.card--product` with the image at 2/3 `contain` and a hover swap to the second image.
- **Overlays on the image:**
  - Badges top-left: sale, sold out, or custom (Cream scheme, `body-xs`).
  - Swym wishlist heart, absolutely positioned on the image corner and injected by the app.
  - Quick view / add button on hover; a link on mobile.
- **Text below the image:**
  - Vendor (`body-small`, links to the vendor).
  - Title (`.card__title h3`, IBM Plex in Arabic).
  - Price: new price in #241e1a, old price #8a8079 struck through.
  - **Judge.me stars** (`unix-card-stars`): rendered only if the product has reviews. The stars are #8b7355 SVG, repainted by `unix-stars.css`.
- Colour swatches from the Combined Listings app are hidden on cards.

---

## 7. Cart

### 7.1 Cart drawer (the primary cart; `snippets/cart-drawer.liquid`)
- **Panel:** slides in from the side (side edge not verified for RTL; swipe-to-close is enabled). Scheme Cream. Overlay scrim.
- **Header:**
  - Title "تمت الإضافة (n)" (`general.cart.item_added`) plus a close ×.
  - Optional free-shipping slider (off).
  - **National Day gift progress bar** (`unix-nd-gift`), shown only during the campaign window, which is now over. After the window, the snippet removes leftover gift lines and renders `unix-offer` mode `cart`, which is empty.
- **Empty state:** "لا تفوّتي جديدنا!" with the empty text and a primary button to all products.
- **Line items:**
  - Image 6.8rem and title.
  - Variant options, quantity stepper and remove icon.
  - Line price, including discounts.
- **Cashback note** (`snippets/cashback-note.liquid`), between the items and the footer (see §8.4).
- **Footer:**
  - Subtotal (`body-large`, shown with the currency code).
  - Tax note.
  - Checkout primary button.
  - "View cart" button.
  - Judge.me cart-drawer widget (app embed). `unix-stars.css` hides reviews inside the drawer.
- **Saudi Address Finder app embed:** injects a "national address" map widget into `.cart-drawer__bottom`. `unix-address-map.css`/`.js` turn it into three states (§8.6) and keep the checkout buttons pinned.

### 7.2 Cart page (`templates/cart.json`)
1. **main-cart-items:** no cart note; padding-bottom l. Contains `subtotal` and `buttons` blocks. Renders the shipping slider if enabled.
2. **cashback-note-section:** the cashback note in a wrapper.
3. **popular-products "اختيارات تناسبك":**
   - Scheme Cream; 4 per row, carousel.
   - Manual products: `femme-scoop-long-sleeves-top-cream-white`, `femme-scoop-long-sleeves-top-black`, `core-control-bra-top-midnight-blue`, `core-control-bra-top-black`, `curve-enhance-bra-top-toffee`.
   - Cards 3/4 cover.

---

## 8. Custom UNIX features (what each does)

### 8.1 Size finder v2: `snippets/unix-size-finder.liquid` + `assets/unix-size-finder.js` (40KB) + `.css`
- **When it renders:** only when the product has a size option. The option name contains "مقاس" or "Size".
- **Data passed to the script:**
  - **Category**, inferred from `product.type`:
    - contains "legging" → `leggings`
    - contains "bra" → `bra`
    - contains "hood" → `hoodie`
    - contains "pant", "short" or "jogger" → `wide`
    - otherwise → `topFitted`
  - **Chart family:** `comfy` if the size-chart page handle contains "comfy"; otherwise `sport`.
  - **Fit delta:** from `custom.fit_delta`. If that is empty, `size_fit_style` containing "small" gives +0.33 and "large" gives −0.33.
  - **Language** and **form id**.
- **Closed state:** a bar button with:
  - a circular icon (3.4rem, bordered)
  - title **"اعرفي مقاسك"** with the subtitle "أسئلة سريعة، أقل من ٢٠ ثانية"
  - a chevron
  - paper bg #F8F6F2, 1px line `rgba(34,50,62,.18)`, square corners
  
  Once a profile exists, the title becomes "مقاسك في هذه القطعة" with an «تعديل» (edit) link.
- **Quiz:** on mobile it opens as a bottom sheet (fixed, max-height 86svh, top radius 1.4rem, grab handle). Steps, with a progress counter `i / n`:
  1. Height (6 ranges in cm)
  2. Usual sportswear size (XS–XL, or "ما أدري")
  3. Optional reference brand (Lululemon, Nike, Adidas, Gymshark, Alo, Zara, H&M) and her size in it
  4. Body shape (4 options)
  5. Bra band and cup, for tops
  6. Fit preference per category (for example "ضمّ قوي / متوسط / خفيف ومريح")
  7. Optional weight, with "أفضّل ما أذكر" (prefer not to say) given equal weight
- **Engine:**
  1. Estimates bust, underbust, waist and hip in cm against a UK 6–14 body chart (with a separate Comfy chart).
  2. Blends three signals with weights brand .45, usual size .35 and body .20.
  3. Scores each size on the measurements that matter for the category.
  4. Applies the fit preference and the per-product delta.
- **Result:**
  - The recommended size, with an explanation, a "between sizes" note and a confidence level.
  - Selects the size radio automatically. If that size is sold out, it falls back to the nearest available size.
  - Sets get a separate answer for each picker (top and bottom).
- **Persistence:** the profile is saved to `localStorage` under `unix_fit_v2`. The recommendation is written as hidden line-item properties for return calibration.
- Arabic digits are used in the Arabic UI.

### 8.2 Size guide modals
Inline custom liquid, described in §5.2 item 9.

### 8.3 Delivery estimate: `snippets/unix-shipping-estimate.liquid` + `unix-shipping.css`
- **Box:** title "متى يصلك طلبك؟" with a truck icon. Border `1px rgba(55,53,66,.16)`, radius 12px, padding 1.4×1.6rem.
- **Country select:** Saudi Arabia, UAE, Kuwait, Bahrain, Oman, Qatar, Jordan, Egypt, Lebanon.
- **City select** (shown only for KSA), grouped into delivery tiers:
  - Tier 1, Riyadh → "يوم إلى يومين عمل"
  - Tier 2, Jeddah, Makkah, Madinah, Dammam, Khobar, Dhahran, Jubail, Al Ahsa, Taif, Qatif → "يومين إلى ثلاثة أيام عمل"
  - Tier 3, 36 other cities plus "مدينة أخرى" → "ثلاثة إلى ستة أيام عمل"
  - International → "خمسة إلى عشرة أيام عمل"
- **Result:** "يصلك خلال **X**" with a note. The local note explains that business days run Sunday to Thursday and start once the order ships; the international note says the estimate depends on customs.

### 8.4 Cashback note: `snippets/cashback-note.liquid`
- **Amount:** 10% of the selected variant price (on the product page) or of the cart subtotal.
- **Copy:**
  - Guests and customers with no credit: "يرجع لكِ **X ر.س** رصيدًا بعد استلام طلبك", with "كاش باك ١٠٪ · صالح ٦ أشهر" and, for guests, a "سجّلي دخولك لاستخدام رصيدك" login link.
  - Customers with store-credit balance: "عندكِ **X** رصيد — طبّقيه عند إتمام الطلب".
- **Style:** a 7px dot in #8a7f6d; card bg `rgba(55,53,66,.05)`, radius 14px, padding 15×16px.
- **Placement:** cart drawer and cart page. It is not rendered on the product page template.

### 8.5 SAR symbol script: `assets/unix-sar.js`
Runs only on non-Arabic pages and is loaded via `unix-nd-bar.liquid`. A TreeWalker plus a MutationObserver replace the text "ر.س" with "SAR" in all prices, including ones that arrive later (drawer, quick view, variant change). Arabic pages keep "ر.س".

### 8.6 Saudi Address Finder in the cart drawer: `unix-address-map.css/.js`
A state machine with three states on the app widget root:
- `una-collapsed`: header row only
- open: the map is capped at about a third of the screen
- `una-done`: the saved-address card

It uses a MutationObserver to wire up the app's open, cancel and edit controls, scrolls the map or card into view, makes the drawer footer scrollable, and keeps the checkout buttons pinned.

### 8.7 National Day campaign (inactive since 14 Oct 2026, kept date-gated)
All four parts use the window 2026-09-07 21:00Z → 2026-10-14 07:59Z.
- `unix-nd-bar`: green announcement bar.
- `unix-nd-code`: green "اليوم الوطني ٩٦ · ١٥٪ خصم بكود **KSA96** · نسخ" copy pill.
- `unix-nd-gift` + `unix-nd-gift.js`: gift-with-purchase progress bar in the drawer.
  - Tiers: 599 → hair clip (variant 46960924229799), 899 → 470 ml bottle (46960930062503), 1199 → Amalfi candle (47033767690407).
  - The script adds or removes a single gift line tagged `_unix_nd_gift` (highest tier only) to match automatic Buy-X-Get-Y discounts.
  - After the window, it removes leftover gift lines.

A reusable pattern for Salla: promo code chip, gift progress bar.

### 8.8 Offer placeholder: `snippets/unix-offer.liquid`
Currently empty. It had modes home, chip, cart and hero for a "2+ activewear 20% off" offer, which ended 31 Oct 2026.

### 8.9 Promo chip styles (retired UNIX10)
`.unix-promo` in `unix-custom.css`: a dashed pill with `1px dashed rgba(55,53,66,.32)`, radius 999px, padding 1×1.8rem, the code in bold with letter-spacing .08em, and a "copy" CTA. It is hidden by `unix-hide-promo.css`. Use this style for any future code chip.

### 8.10 Offers calculator: `page.unix-calc` → `snippets/unix-calc.liquid` + `unix-calc.js/css`
An internal, noindex, password-locked page. It decrypts cost data (PBKDF2 + AES-GCM, from `files/unix-calc-data.json`) and calculates offer margins against live prices. It is **not customer-facing**, so do not port it to the storefront.

### 8.11 Header and menu customizations
AR/EN pill toggle (§2), inline-menu link pruning (§2), mobile accordion drawer (§2), and the brand-dark header over the hero.

### 8.12 Complete the look
Custom section, §5.3.

---

## 9. Apps and integrations
| App | How it appears | Notes for the Salla rebuild |
|---|---|---|
| **Judge.me Reviews** | Core embed; product preview badge; review widget section; card stars via `metafields.judgeme.badge`; cart-drawer widget (hidden by CSS) | Branded by `unix-reviews.css`: buttons #373542 with 30px radius, histogram #8b7355 on #e8e0d5, text #241e1a/#8a8079. `unix-stars.css` repaints the new-widget `.jm-star-rating__font-icon` as SVG stars in #8b7355. In Salla, use native reviews or an equivalent app, styled the same way. |
| **Swym Wishlist Plus** | Header launcher icon with count; heart on collection cards (advanced collections wishlist on); product page button | Use Salla's native wishlist heart on cards and in the header. |
| **Tamara** | Product widget (custom snippet) | Salla has native Tamara. |
| **Tabby** | Product app block | Salla has native Tabby. |
| **Saudi Address Finder** | Cart drawer national-address map | Salla handles addresses natively. |
| **G: Combined Listings** | Colour swatches linking sibling products (hidden on cards) | Salla: product options or linked products. |
| SW Back in Stock | Embed | Salla: "notify me" when out of stock. |
| Parkour Facebook Pixel, Parkour TikTok Pixel | Embeds | Salla marketing integrations. |
| Microsoft Clarity | Embed | Custom script. |
| Google/YouTube store widget | Floating widget at left-bottom, 36px margins (16/46 on mobile) | Optional. |
| Hextom translate, Essential Upsell | Disabled | – |

---

## 10. RTL handling
- `<html dir>` is set by `snippets/direction.liquid`: `rtl` for `ar` and other RTL languages, otherwise `ltr`. `lang` is the locale ISO code.
- Arabic-only CSS loads conditionally (`custom-arabic-headings.css`, the Somar preload). Arabic fonts switch via `_fonts.liquid`, and all letter-spacing is 0 for Arabic.
- The theme uses logical properties in custom code: `margin-inline`, `padding-inline-start`, `inset-inline-start`, `text-align: start`.
- Explicit `[dir=rtl]` and `html[dir='rtl']` overrides: hero CTA arrow direction, menu caret rotation, size-finder chevron, select arrow position (LTR override in `unix-shipping.css`).
- "left" settings render on the start side in RTL. For example, hero text `bottom-left` appears bottom-right, and featured-collections `text_align: left` reads as right-aligned.
- The size-guide modal close button is fixed at the top-left. In the size-finder and trust strip, numbers and codes are wrapped in `dir="ltr"`.
- Prices: the Arabic storefront shows "X ر.س"; English shows "X SAR" (via `unix-sar.js`).
- Copy addresses the customer in the feminine form (تسوّقي، اكتشفي، أضيفي), and every customer-facing string is Arabic. Keep this tone.

---

## 11. Rebuild notes and gaps
- The menus `main-menu`, `footer`, `footer-menu` and `customer-account-main-menu` are Shopify navigation objects. They are not in the theme files, so pull their link lists separately with the `menus` query.
- Image references (`shopify://shop_images/...`, `shopify://files/videos/...`) are store Files and must be downloaded and re-uploaded to Salla.
- Inconsistency: the announcement bar says free shipping over **500 ر.س**, but the FAQ and `min_spend` say **600**. Confirm with the client.
- Placeholder English content (Strive demo text) remains in `page.about`, `page.contact` (a New York address) and the FAQ on `list-collections`. Do not port it.
- `locales/ar.json` (saved) holds all the Arabic UI strings: cart, product, filters and so on.

---

## 12. SEO in the Shopify theme (reference for ROADMAP 3.11)
- **Structured data:** `sections/main-product.liquid` prints `{{ product | structured_data }}` (Shopify's Product JSON-LD); `sections/header.liquid` prints `Organization` (name, logo, sameAs, url) on every page and `WebSite` with a `SearchAction` on the home page; the FAQ section prints `FAQPage`. **Salla mapping (6.4, D129):** Salla's head prints `Organization`, `WebPage` and the `Product`; the theme adds only what Salla doesn't print: `WebSite` + `SearchAction` (home), `FAQPage`, `BlogPosting`, and `BreadcrumbList` when the breadcrumbs are hidden (DS §14).
- **Head:** `layout/theme.liquid` prints the title, meta description and `<link rel="canonical">`; OG/Twitter come from the `meta-tags` snippet; hreflang comes from Shopify's `content_for_header`.
- **Colours:** each colour is a separate product with its own URL, title and SEO description («اسم الموديل | اللون»); the G: Combined Listings app links them as swatches (verified on the live store, 2026-11-02). Owner decision: keep colours as separate indexable products in Salla.
- **Headings:** the product title block uses an `h1` tag at h2 size.
- In the Salla theme the split between platform-owned and theme-owned SEO is in DESIGN-SYSTEM §14.
