# UNIX SEO Playbook (دليل الـ SEO لـ UNIX)

Knowledge base for the agent that runs SEO for **UNIX (unix.sa)**, a Saudi women's activewear and loungewear brand moving from **Shopify to Salla** (custom Twilight theme). Arabic first (RTL), English second (`/en/`).

- **Compiled:** 2026-11-09. Every rule below was checked against the page it cites, opened on that date.
- **How to read the citations:** each rule ends with a link key such as [G-MOVE]. The keys resolve to full URLs in **§14 Sources**, and every key is a clickable link.
- **Confidence labels:**
  - **Official**: Google Search Central, Google Search Console Help, Google Business Profile Help, Salla help or docs, schema.org, or web.dev.
  - **Vendor**: a crawler operator's own documentation (OpenAI, Perplexity).
  - **Industry**: common practice from third parties. It is labelled every time and is never stated as Google policy.
  - **UNVERIFIED**: not confirmed by a primary source. Test it or ask before relying on it.
- **Project context:** `docs/migration/PLAN.md` (the migration plan), `docs/ROADMAP.md` D129 (which structured data Salla prints and which the theme prints), and `docs/DESIGN-SYSTEM.md` §14.

---

## 0. Changes to the current plan (read first)

| # | The plan assumed | What the sources say | Action |
|---|---|---|---|
| 1 | FAQPage JSON-LD gives FAQ rich results, and FAQ schema helps GEO. | **FAQ rich results are gone for every site.** Google deprecated them with effect from **2026-05-07** and removed the documentation on **2026-06-15**: "The FAQ rich result feature is no longer shown in Google Search results." (The 2023 limit to government and health sites has now become a full removal.) Google also says there is "no special schema.org structured data" needed for AI Overviews and AI Mode. [G-UPD] [G-AIF] [G-AIOPT] | Keep **visible** FAQ content, because it helps users and is answerable text. FAQPage JSON-LD is now optional and low priority. It does no harm (§2.9). Don't sell it to the client as a rich-result or AI win. |
| 2 | The Change of Address tool would be used. | It applies **only to a domain or subdomain change**. UNIX keeps `unix.sa`, and only the platform and paths change. "Don't use it for … path-only changes." [G-MOVE] [GSC-COA] | Don't use it. Follow the "site move with URL changes" process (§1). |
| 3 | Salla has a 301 redirect tool with bulk upload. | **UNVERIFIED.** No Salla help or docs page documents a 301 tool. The only bulk import is **"Custom links" (روابط مخصصة)**, documented as branded short links. Its redirect status code (301 or 302) is not documented. [SALLA-LINKS] An industry comparison from 2026-10 also found no official Salla redirect documentation. [IND-ANAS] | **Launch blocker.** Ask Salla support, in writing, for the redirect mechanism, the status code, bulk import, and whether arbitrary old paths such as `/products/x` and `/collections/y` are accepted. Then test with `curl -I`. |
| 4 | Salla prints canonical and hreflang correctly. | Salla's own help centre tells merchants to add **hreflang through Google Tag Manager** and discusses canonical through GTM. It never states that the platform prints them. [SALLA-HREF] [SALLA-CANON] The theme comment in `master.twig` assumes Salla does. | Verify on the live store with View Source (not the rendered DOM). If they're missing, add server-rendered tags in the theme instead of GTM (§4.5). |
| 5 | `ItemList` on category pages and `WebSite` + `SearchAction` will add rich results. | ItemList carousels support only Course, Movie, Recipe and Restaurant. [G-CAROUSEL] The sitelinks search box was removed on **2024-11-21**. [G-SLSB] Breadcrumb rich results show on **desktop only** (2025-01). [G-UPD] [G-BREAD] | Keep `WebSite` with `name` and `alternateName` for the site name, on the **domain root only**. `SearchAction` is harmless but does nothing. `ItemList` is optional and has no rich-result value. |
| 6 | The Arabic URLs stay at the root. | Salla's hreflang article shows its language versions as `/ar/` and `/en/` prefixes. [SALLA-HREF] If Salla serves Arabic at `/ar/…`, **every** Arabic Shopify URL changes. The plan already estimates about 292 redirects. | Confirm the live URL pattern before building the 301 map. |

---

## 1. Site move with URL changes (نقل الموقع مع تغيير الروابط)

**Which case applies:** same domain (`unix.sa`), new platform, new paths. In Google's terms this is a **site move with URL changes**. It is not a domain change. [G-MOVE]

### 1.1 Rules

| Rule | Do | Don't | Source |
|---|---|---|---|
| R1.1 Use server-side permanent redirects. | Use a 301 or 308 from every old URL. | Don't use meta refresh or JS redirects except as a last resort. | [G-MOVE] |
| R1.2 Map one to one. | Send each old URL to its closest equivalent. Many-to-one is fine when pages were truly merged. | Don't send everything to the home page. Google may treat that as a soft 404. | [G-MOVE] |
| R1.3 No chains. | Point straight to the final URL. Google follows up to 10 hops but advises fewer than 5, ideally 3 or fewer. Resolve the 6 existing Shopify chains in the map. | Don't send old → old-redirect → new. | [G-MOVE] |
| R1.4 Use 404 or 410 for content that is truly gone. | Return 404 for archived products that have no replacement and no traffic. | Don't send dead products to an unrelated page. | [G-MOVE] |
| R1.5 Keep the redirects. | Keep them for at least 1 year, ideally indefinitely. | Don't delete the redirect table after launch. | [G-MOVE] |
| R1.6 Build the old URL inventory from several sources. | Use sitemaps, analytics top pages, the GSC Links report, the CMS export, server logs, images, and files. | Don't map from the sitemap alone. | [G-MOVE] |
| R1.7 Update everything on the new site. | Self-referencing canonicals, hreflang to the new URLs, and internal links pointing to the final URLs. | Don't leave internal links that hit a redirect. | [G-MOVE] |
| R1.8 Robots and noindex. | Remove dev-time `noindex` and `Disallow`. If there is no robots.txt, return a 404 for it. | Don't launch with a staging block. Google lists this as a top mistake. | [G-MOVE] |
| R1.9 Sitemaps. | Keep a sitemap of the old URLs and one of the new URLs. Submit the new one when the redirects are live. Redirect warnings on the old sitemap are expected. | Don't remove the old sitemap before Google has recrawled it. | [G-MOVE] |
| R1.10 Search Console. | Verify every variant (www and non-www, http and https). Keep verification after the move. Re-upload any disavow file. Set crawl rate to "Let Googlebot determine". | Don't lose the verification meta tag or file in the theme switch. | [G-MOVE] |
| R1.11 Change of Address. | Use it **only** for domain or subdomain changes. | Don't use it for this move (same domain). It also doesn't apply to HTTP→HTTPS, www↔non-www, or hosting changes. | [G-MOVE] [GSC-COA] |
| R1.12 One change at a time. | Keep the content, titles and structure as stable as practical at switch-over. | Don't rename every category and rewrite every title on DNS day without tracking each change. | [G-MOVE] |
| R1.13 Time the move. | Choose a low-traffic period and make sure the server has capacity for heavier crawling. | Don't switch during a sale peak. | [G-MOVE] |
| R1.14 Update external links. | Update social profiles, ad campaigns and the top backlinks (prioritize by traffic). | Don't rely on the redirects forever for links you control. | [G-MOVE] |

**Example map row (`redirects-final.csv`):**
```
from,to
/products/sculpting-leggings-vanilla,/ar/<salla-slug>/p123456789     ← final URL only, 200 OK
/collections/leggings,/ar/<category-slug>/c987654321
/blogs/leggings-blog/how-to-choose,/ar/blog/<post-slug>
/ar/pages/%d8%a7%d9%84%d8%a3%d8%b3%d8%a6%d9%84%d8%a9_%d8%a7%d9%84%d8%b4%d8%a7%d8%a6%d8%b9%d8%a9,/ar/<faq-page>
```
The Salla URL patterns above are **UNVERIFIED** placeholders. Use the real exported URLs.

### 1.2 Timeline and monitoring

- A medium site takes **a few weeks or more** before Google shows the new URLs. Every old and new URL must be crawled at least once. Expect ranking fluctuation. [G-MOVE]
- **Days 0–14:** check the Page indexing report daily ("Not found (404)", "Page with redirect", "Soft 404") along with server and 404 logs. Fix each new 404 with a redirect. [G-MOVE] [GSC-PIR]
- **Weeks 2–8:** compare indexed page counts and Performance report clicks for the old and new URLs. Old URLs should drop out as "Page with redirect". [GSC-PIR]
- **Shopify:** don't cancel it until the 404s are near zero and all media (hero video, images) is re-hosted on Salla. This is project rule PLAN.md Phase 6. Hosting continuity matters only for assets still served from Shopify's CDN, because the domain itself moves.

---

## 2. E-commerce structured data (البيانات المنظمة)

### 2.0 General rules (they apply to every type)
- Mark up only what users can see on the page. The markup must be a true representation of the page. [G-SDPOL]
- Required properties missing means no rich result. Recommended properties improve eligibility. [G-SDPOL]
- Put the markup on the page it describes. Link related nodes with `@id`. [G-SDPOL]
- Violations cause a manual action (loss of rich results, not of ranking). [G-SDPOL]
- JS-injected JSON-LD is allowed, but it must be tested. [G-JS]
- **Never duplicate an entity.** Salla prints Organization, WebPage and Product (project D129, measured on preview). The theme must not print a second Product or Organization. Use the Rich Results Test on the live site to confirm.

### 2.1 Product: merchant listing (the main target for UNIX)
UNIX sells directly, so **merchant listings** is the correct experience. Meeting its requirements also covers product snippets. [G-PRODUCT]

| Level | Property | Notes |
|---|---|---|
| **Required** | `name` | |
| **Required** | `image` | Crawlable URLs. Multiple aspect ratios are recommended (1x1, 4x3, 16x9). |
| **Required** | `offers` | Must be a nested `Offer`, **not `AggregateOffer`** (the merchant must be the seller). |
| Recommended | `aggregateRating`, `review` | See §2.3. |
| Recommended | `brand.name` | `{"@type":"Brand","name":"UNIX"}`, one brand only. |
| Recommended | `color`, `material`, `pattern`, `size` (text or `SizeSpecification`) | Apparel attributes. |
| Recommended | `audience` → `PeopleAudience.suggestedGender` = `https://schema.org/Female` | Women's activewear. |
| Recommended | `gtin`/`gtin13`… (numeric only), `mpn`, `sku` (no spaces) | Salla has GTIN and MPN fields, see §9. |
| Recommended | `description`, `category`, `inProductGroupWithID`, `isVariantOf` | |
Source: [G-MERCHANT]

**Offer**

| Level | Property | Example |
|---|---|---|
| **Required** | `price` (> 0) | `229.00` |
| **Required** | `priceCurrency` (ISO 4217) | `"SAR"` |
| Recommended | `availability` (one value) | `https://schema.org/InStock` |
| Recommended | `itemCondition` | `https://schema.org/NewCondition` |
| Recommended | `priceValidUntil` | A past date may block display. |
| Recommended | `shippingDetails` (`OfferShippingDetails`: `shippingRate`, `shippingDestination.addressCountry`="SA", `deliveryTime.handlingTime/transitTime` in `DAY`) | Use `0` for free shipping. |
| Recommended | `hasMerchantReturnPolicy` | Org-level is preferred. Required in it: `applicableCountry`, `returnPolicyCategory`. Add `merchantReturnDays` when `MerchantReturnFiniteReturnWindow`. |
| Recommended | `validFrom` / `validThrough` | For sale windows. |
| Sale price | `priceSpecification` with `priceType: https://schema.org/StrikethroughPrice` holds the **original** price. `offers.price` holds the **sale** price. | Don't put `priceType` on the active price. |
Source: [G-MERCHANT]. Dated changes: sale-price effective dates clarified **2026-07-07**, merchant shipping policy markup **2025-11-12**, return policy and loyalty docs **2025-06-10 / 2025-07-11**, price encoding **2025-02-13**. [G-UPD]

**Variants (colours and sizes).** Use `ProductGroup` with `productGroupID`, `variesBy` (`https://schema.org/color`, `https://schema.org/size`) and `hasVariant`. Each variant needs a unique `sku` or `gtin`, and **each variant must be preselectable by a distinct URL** (query parameter). On a single-page setup there must be one canonical URL for the group, without the variant parameters. [G-VARIANTS] [G-URL]. *UNIX status:* the theme dropped its own ProductGroup (D129) because Twig can't see the other variants' prices. Whether Salla's Product covers variants is **UNVERIFIED**.

**Example (merchant listing, minimal valid plus the useful extras):**
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "ليقنز سكلبتنق بخصر عالٍ – فانيلا",
  "image": ["https://unix.sa/.../1x1.jpg", "https://unix.sa/.../4x3.jpg"],
  "description": "ليقنز رياضي نسائي بخصر عالٍ يشد ويتحرك معك…",
  "sku": "SCULPT-VAN-M",
  "brand": {"@type": "Brand", "name": "UNIX"},
  "color": "فانيلا",
  "size": "M",
  "material": "Nylon/Elastane",
  "audience": {"@type": "PeopleAudience", "suggestedGender": "https://schema.org/Female"},
  "offers": {
    "@type": "Offer",
    "url": "https://unix.sa/ar/<slug>/p123",
    "price": 229.00,
    "priceCurrency": "SAR",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition"
  }
}
```

### 2.2 Product snippets (for reference)
- Required: `name`, plus **one** of `review`, `aggregateRating` or `offers`. [G-SNIPPET]
- Use `Offer`, not `AggregateOffer`, to be eligible for the price-drop enhancement. [G-SNIPPET]
- Pros and cons (`positiveNotes`/`negativeNotes`) apply **only to editorial review pages**, never to merchant product pages or customer reviews. [G-SNIPPET]

### 2.3 Review and AggregateRating, including self-serving reviews
- **AggregateRating, required:** `ratingValue`, plus `ratingCount` **or** `reviewCount`, plus `itemReviewed` (implicit when nested in Product). [G-REVIEW]
- **Review, required:** `author` (a Person or Organization, valid name under 100 characters), `reviewRating.ratingValue`, `itemReviewed` (implicit when nested). Recommended: `datePublished`, `bestRating`, `worstRating`. [G-REVIEW]
- **Self-serving rule:** pages about `LocalBusiness` or `Organization` are **ineligible** for review stars when the entity controls reviews about itself, including through embedded third-party widgets. [G-REVIEW]
  - Do: put review markup on **Product** pages, about that product.
  - Don't: add `aggregateRating` to the UNIX `Organization` or `OnlineStore` node, or to the home page about the store.
- Ratings must be **visible on the page**. They must be about a specific item, not a category. Don't aggregate reviews from other sites. No fake or undisclosed incentivized reviews. [G-REVIEW]
- The reviewer `name` must be a real Person or Team, not promotional text such as "خصم 50%". [G-SNIPPET] [G-MERCHANT]
- **Category pages:** don't mark up an aggregate rating for the category. Reviews must concern a specific item. [G-REVIEW]

### 2.4 BreadcrumbList
- Required: `itemListElement`, with each `ListItem` holding `position` (1 = start), `name`, and `item` (URL). `item` may be omitted on the last crumb. [G-BREAD]
- The trail should reflect a typical user path, not mirror the URL. You don't need a crumb for the domain root or for the page itself. [G-BREAD]
- **Dated:** since 2025-01-22 breadcrumbs show on **desktop only**. [G-UPD]
- Arabic `name` values on Arabic pages and English values on `/en/` pages.

### 2.5 ItemList (category pages)
- Google's carousel rich result supports **only Course list, Movie, Recipe and Restaurant**, and all items must be the same type. Products are not supported. [G-CAROUSEL]
- So `ItemList` of products on a category page earns **no Google rich result**. It is valid schema.org, so it's harmless if accurate. Priority: low. Category pages are better served by visible copy and internal links (§5.3).

### 2.6 Organization / OnlineStore
- There are **no required properties**. Recommended: `name`, `alternateName`, `url`, `logo` (at least 112×112, crawlable), `sameAs` (Instagram, TikTok, Snapchat, X), `contactPoint`, `email`, `telephone`, `address`, `vatID`/`taxID` (must match the address country), `hasMerchantReturnPolicy`, `hasShippingService`. [G-ORG]
- Use the most specific subtype. Google names **`OnlineStore`** for e-commerce. [G-ORG]
- Place it on the home page or the About page. It isn't needed on every page. [G-ORG]
- Salla prints Organization (D129). Check that it has the logo, `sameAs` and a return policy. Fill the gaps through Salla settings first and the theme second, without duplicating the node.

### 2.7 WebSite (site name)
- Required: `name` and `url` (the canonical home page). Recommended: `alternateName` (for example "يونكس", "UNIX Activewear"). [G-SITENAME]
- It **must be on the home page at the domain root**. Google says a path such as `/de/index.html` doesn't qualify. [G-SITENAME] → If Salla makes `/ar/` the Arabic home and `/` redirects, make sure the WebSite node is on the URL Google treats as the root.
- Use one WebSite node only, and nest the site-name properties in the existing one. [G-SITENAME]
- `SearchAction`: the sitelinks search box was removed on 2024-11-21. There's no need to remove the markup, and it does nothing. [G-SLSB]

### 2.8 Return and shipping policy markup
- Organization-level `hasMerchantReturnPolicy` is recommended for most products. A product-level policy overrides it. [G-MERCHANT] [G-ORG]
- Merchant-level shipping policy markup has been supported since 2025-11-12. [G-UPD]
- Return example for KSA: `applicableCountry: "SA"`, `returnPolicyCategory: MerchantReturnFiniteReturnWindow`, `merchantReturnDays: <from the policy page>`, `returnMethod: ReturnByMail`, `returnFees: <real value>`. **Never invent policy values.** Copy them from the published policy page.

### 2.9 FAQPage: status as of November 2026
- **Timeline:**
  - 2023-08-08: limited to "well-known, authoritative government and health sites". [G-FAQ2023]
  - 2026-05-08: a deprecation notice says the feature "will no longer appear in Google Search starting May 7, 2026". [G-UPD]
  - 2026-06-15: the documentation was removed because "The FAQ rich result feature is no longer shown in Google Search results." [G-UPD]
- **Is it still worth adding?**
  - Google rich results: **no**. The type no longer appears in the Search gallery. [G-GALLERY]
  - Google AI Overviews and AI Mode: Google says there is "no special schema.org structured data that you need to add". It also says structured data "isn't required" for generative AI. It still recommends structured data broadly, for rich-result eligibility. [G-AIF] [G-AIOPT]
  - Other AI engines (ChatGPT, Perplexity, Gemini app): no primary source found saying they use FAQPage. **UNVERIFIED.** Industry claims exist but are not evidence.
  - Harm: Google's 2023 note said unused structured data "doesn't cause problems". [G-FAQ2023]
- **Rule for UNIX:**
  - Do: write real Q&A content visibly on the page (answers to shipping, sizing and fabric questions). That is answerable text for every engine.
  - If FAQPage JSON-LD is kept, print it **once per page**, matching the visible Q&A exactly. schema.org: `FAQPage` → `mainEntity` → `Question`/`acceptedAnswer`. [SCHEMA-FAQ]
  - Don't: build features or promise the client results on the basis of FAQ rich results. Don't add FAQs with no user value just to carry the schema.

---

## 3. Titles and meta descriptions (العناوين والوصف)

### 3.1 How Google builds title links
- Sources, in order: `<title>`, the main visible title, `<h1>` and other headings, `og:title`, prominent text, other on-page text, anchor text, inbound link text, and `WebSite` structured data. [G-TITLE]
- **There is no character limit.** Titles are truncated to the device width. [G-TITLE] Industry practice: about 50–60 Latin characters fits most desktop SERPs. Arabic glyph widths differ, so check the SERP preview rather than counting characters.
- Google rewrites a title when it is half-empty, obsolete, inaccurate, boilerplate across many pages, or **in a different language or script from the page**. [G-TITLE]

**Rules**
- R3.1 Give every page a unique, descriptive title. Don't use "الرئيسية" alone or a repeated template that varies by one word. [G-TITLE]
- R3.2 Put the brand once, at the start or end, with a delimiter (`|`, `-`, `:`). Use fuller branding only on the home page. [G-TITLE]
- R3.3 Make the main `<h1>` clearly the main title (one per page) and consistent with `<title>`. [G-TITLE]
- R3.4 **Match the page language and script.** Arabic pages get Arabic titles. Don't transliterate (`leggings` → `ليقنز` is a loanword in Arabic script, which is fine; `Legginz Riyadi` in Latin on an Arabic page is not). [G-TITLE]
- R3.5 No keyword stuffing or repetition. [G-TITLE]
- R3.6 Don't use robots.txt to keep pages out of results. Use `noindex`. [G-TITLE] [G-ROBOTS]

### 3.2 How Google builds snippets
- Snippets come **primarily from page content**. The meta description is used when it describes the page better. **There is no length limit.** [G-SNIPPET-META]
- Do: write a unique description per page, include concrete details (price range, fabric, shipping), and generate them programmatically if needed as long as they're human-readable and varied. [G-SNIPPET-META]
- Don't: use keyword lists, the same description site-wide, or two-word descriptions. [G-SNIPPET-META]
- Controls: `nosnippet`, `max-snippet:[n]`, `data-nosnippet`. [G-SNIPPET-META]
- Industry practice: about 140–160 characters fits most SERPs. Front-load the benefit.

### 3.3 Arabic e-commerce templates (Saudi dialect, feminine voice)

| Page | Title pattern | Example title | Example meta description |
|---|---|---|---|
| Home | `UNIX \| <core category> في السعودية` | UNIX \| ملابس رياضية نسائية ولاونج وير في السعودية | ملابس رياضية ولاونج وير نسائية بتصاميم أنيقة وخامات تتحرك معك. ليقنز، أطقم، هوديز وبيجامات. شحن لكل مناطق المملكة، تسوّقي الآن من UNIX. |
| Category | `<keyword> \| تسوّقي من UNIX` | ليقنز رياضي نسائي بخصر عالٍ \| تسوّقي من UNIX | ليقنز رياضية تنحت القوام وتتحرك معك، بخامات سريعة الجفاف ومقاسات من XS إلى XL. شحن مجاني فوق <الحد> ر.س. تسوّقي الآن. |
| Product | `<product name> – <colour> \| UNIX` | ليقنز سكلبتنق بخصر عالٍ – فانيلا \| UNIX | ليقنز سكلبتنق بخصر عالٍ ولون فانيلا، خامة ناعمة تشد بدون ما تضغط ومناسبة للتمرين واليوم الطويل. اختاري مقاسك واطلبيه الحين. |
| Blog | `<question or topic> \| مدونة UNIX` | كيف تختارين مقاس الليقنز المناسب؟ \| مدونة UNIX | دليل عملي لاختيار مقاس الليقنز حسب الخصر والورك، مع جدول مقاسات UNIX ونصائح للعناية بالقطعة. |
| EN product | `<Product> – <Colour> \| UNIX` | Sculpting High-Waist Leggings – Vanilla \| UNIX | High-waist sculpting leggings in vanilla. Soft, squat-proof fabric for training and all-day wear. Free shipping over <threshold> SAR in Saudi Arabia. |

**Arabic writing rules**
- Use the feminine imperative (تسوّقي، اختاري، اطلبي), per CLAUDE.md.
- **The free-shipping threshold is inconsistent in the source content (500 vs 600 SAR, SPEC §11).** Don't publish a number until the client confirms it.
- Put the head term early, because the right edge truncates first in RTL. Keep "UNIX" in Latin, since it is the registered brand. The Arabic alternate "يونكس" goes in `alternateName`, not in every title.
- Use one spelling of the head term in the title and work the variants into the body and description naturally (§10). Don't stack variants ("ليقنز ليقينز لقنز").
- Price: Google discourages volatile prices in titles (its example is flights). [G-TITLE] Leave prices out of titles. Prices may go in descriptions if they're kept current.

---

## 4. Multilingual and hreflang (تعدد اللغات)

### 4.1 Structure
- Use **separate URLs per language**. Subdirectories (`/en/`) are fine (same host, low maintenance). [G-MULTI]
- Google detects language from the **visible content**. It ignores `lang` attributes and the URL for this purpose. Keep `lang`/`dir` anyway for accessibility and browsers. [G-MULTI]
- **One language per page.** Don't put side-by-side translations on one page. Translating only the boilerplate is bad UX. [G-MULTI]
- **Don't auto-redirect by browser language or IP.** Googlebot crawls mostly from the US without `Accept-Language`. Use a visible language switcher. [G-MULTI]

### 4.2 hreflang rules
- Three equivalent methods are available: HTML `<link>`, HTTP header, or sitemap. Using more than one adds nothing. [G-HREFLANG]
- **Self-reference plus every alternate** on every version. Links must be **bidirectional**, or Google ignores them. [G-HREFLANG]
- Codes: ISO 639-1 language, with an optional ISO 3166-1 region. A region alone is invalid. [G-HREFLANG]
  - For UNIX: `ar` (or `ar-SA`) and `en` (or `en-SA`). Industry practice: use language-only `ar`/`en` unless you have regional variants. Either is valid under Google's format.
- `x-default` is the fallback for unmatched languages. For UNIX, point it at the Arabic default. [G-HREFLANG]
- Use fully qualified absolute URLs with `https://`. Put the tags in a well-formed `<head>`. [G-HREFLANG]

```html
<!-- on BOTH https://unix.sa/ar/<slug>/p123 and https://unix.sa/en/<slug>/p123 -->
<link rel="alternate" hreflang="ar" href="https://unix.sa/ar/<slug>/p123">
<link rel="alternate" hreflang="en" href="https://unix.sa/en/<slug>/p123">
<link rel="alternate" hreflang="x-default" href="https://unix.sa/ar/<slug>/p123">
<link rel="canonical" href="<this page's own URL>">
```

### 4.3 Canonical interaction
- Each language version should be **self-canonical**. "Make sure to specify a canonical page in the same language." Never canonical `/en/x` to `/ar/x`. [G-CANON]
- Translated pages are not duplicates. They count as duplicates only if the main content is left untranslated. [G-HREFLANG]
  - → **An English page with untranslated Arabic product copy is a duplicate risk.** Translate the product copy fully, not only the UI.
- Canonical strength: redirect, then rel=canonical, then sitemap inclusion. Don't canonicalize with robots.txt. Use absolute URLs. [G-CANON]

### 4.4 RTL considerations
- Google doesn't use `dir`/`lang` for language detection. [G-MULTI] RTL is a UX and accessibility matter. Keep `<html lang="ar" dir="rtl">` and `<html lang="en" dir="ltr">`.
- Industry practice: URLs may contain Arabic words. Google's URL guidance allows localized words and requires UTF-8. [G-MULTI] They appear percent-encoded when shared, which is why many Saudi stores use English slugs on both languages. Decision for UNIX: pending (PLAN.md Phase 1).
- Mixed-direction strings (Arabic plus "UNIX" or "XS") need the Unicode bidi handling the theme already applies. That is not an SEO factor.

### 4.5 Salla specifics for hreflang and canonical
- Salla's help shows language versions as `/ar/` and `/en/` and suggests adding hreflang **via GTM**. Its example code points both languages at the same URL, which is wrong. Don't copy it. [SALLA-HREF]
- Salla's sitemap only includes English product URLs when multilingual is on, English is added, and products have English names. [SALLA-SEO-EN]
- JS-injected canonicals are honoured, but HTML is preferred and there must be only one canonical tag. [G-JS]
  - **Agent rule:** check View Source on the live store.
    - If Salla's server HTML already has canonical and hreflang, add nothing.
    - If not, prefer theme Twig output in `<head>` over GTM, and never ship two canonicals.

---

## 5. Helpful content, E-E-A-T and product pages (المحتوى المفيد)

### 5.1 Principles (Google)
- Write people-first content. Ask the "Who, How, Why" questions. "Why" is "perhaps the most important". [G-HELPFUL]
- E-E-A-T is not a single ranking factor, and **trust matters most**. [G-HELPFUL]
- **There is no preferred word count.** Writing to a length is a warning sign. [G-HELPFUL]
- Mass AI text without oversight counts as low effort. Using AI mainly to manipulate rankings is spam. [G-HELPFUL] [G-SPAM]
- Generative AI search rewards **non-commodity content**: "unique expert or experienced takes that go beyond common knowledge". [G-AIOPT]

### 5.2 Product page structure (UNIX standard)
Each product description, under the single product `<h1>` (no `<h1>` inside the description):
1. **Opening line (1–2 sentences):** what it is and who it's for, with the head term once.
2. **`<h2>` المميزات:** 3–6 bullets. Use concrete claims you can verify (high waist, pockets, squat-proof, quick-dry).
3. **`<h2>` الخامة والعناية:** the fabric composition (the real %), washing instructions.
4. **`<h2>` المقاس والقصّة:** the model's height and size, fit notes, a link to the size guide.
5. **`<h2>` لمين القطعة دي / تنسيقها:** occasions, plus links to matching pieces and the category.
6. Visible Q&A (optional) and customer reviews.

Do:
- Add first-hand detail only UNIX can give: fit notes from real try-ons, fabric weight (GSM), how it behaves in Saudi heat.
- Use real product photos with descriptive `alt` (§7.3).

Don't:
- Copy supplier text.
- Write the same description across colour variants with only the colour changed. Shared copy is fine, but add variant-specific lines.
- Generate unreviewed AI copy.

Sources: [G-HELPFUL] [G-AIOPT] [G-VARIANTS]

### 5.3 Category pages
- Link menu → categories → subcategories → products with plain `<a href>`. Googlebot doesn't use the site search, so products reachable only by search may not be found. [G-ECOM-STRUCT]
- Feature best-sellers from the home page and link products from blog posts. More internal links signal importance. [G-ECOM-STRUCT]
- Industry practice (not Google policy): add a short intro (2–3 sentences) above the grid and a fuller guide (80–150 words, as in the PLAN) below it. Cover the head term, its variants and links to sibling categories. Keep the grid first on mobile.

### 5.4 Thin content and duplication
- Avoid scaled, unoriginal pages "no matter how it's created". [G-SPAM]
- Don't create a category per keyword variant (ليقنز / ليقينز). One page targets all the variants (§10). Separate pages for variants are thin duplicates.
- Empty filter combinations should return 404, not an empty 200 page. [G-FACET]

### 5.5 Reviews
- Customer reviews on product pages must be genuine, visible and specific to the product. Incentivized reviews must be disclosed. [G-REVIEW]
- Salla has native reviews and ratings settings (إعدادات وإدارة الأسئلة والتقييمات). Use them. Don't re-implement them. [SALLA-HELP]
- Editorial content (blog "best leggings for…"): follow Google's review guidance. Use first-hand evidence, measurements and comparisons, discuss trade-offs, and justify any "best" claim. [G-REVIEWS-WRITE]

---

## 6. AI features (AI Overviews / AI Mode) and GEO

### 6.1 Google official
- **Eligibility:** the page must be indexed and eligible to show with a snippet. "There are no additional requirements… nor other special optimizations necessary." [G-AIF]
- **No special markup and no AI text files:** "no special schema.org structured data that you need to add". Structured data must match the visible text. [G-AIF]
- **llms.txt:** "Google Search ignores them." Keeping them for other services is fine. Clarified **2026-06-15**. [G-AIOPT] [G-UPD]
- **Myths Google lists:** chunking content into tiny pieces, rewriting for AI, chasing long-tail variations, inauthentic mentions. None of these is needed or helpful. [G-AIOPT]
- **What helps:**
  - non-commodity first-hand content with clear headings
  - high-quality images and video
  - current **Merchant Center** and **Business Profile** data, which "can make products … visible in both AI responses and other Google Search results"
  - crawlable internal links
  - good page experience
  - important content kept as text

  [G-AIF] [G-AIOPT]
- **Controls:**
  - Googlebot robots.txt rules control access.
  - `nosnippet`, `data-nosnippet`, `max-snippet` and `noindex` limit what is shown.
  - `Google-Extended` controls Gemini training and grounding, and "does not impact a site's inclusion in Google Search". [G-AIF] [G-CRAWLERS]
  - **New (2026-10-21):** a site-wide **"Search generative AI control" in Search Console** manages inclusion in AI Overviews and AI Mode. [G-CONTROL] [G-UPD] **UNIX: leave it enabled (included).**
  - Google plans to support the AIPREF training signal (`__usage_ai-training`) in early 2027. [G-CRAWLERS]
- **Reporting:** AI Overviews and AI Mode traffic is counted in the GSC Performance report under "Web" (AI Mode since 2025-06-16). There is no separate AI filter in the official docs. [G-AIF] [G-UPD]
- **Preferred sources** now apply in AI Mode and AI Overviews (2026-05-27). [G-UPD]
- **Agents:** browser agents read screenshots, the DOM and the accessibility tree. Google points to the Universal Commerce Protocol (UCP) as an emerging standard. [G-AIOPT] The accessible, semantic theme markup is therefore also agent-friendly.

### 6.2 Other engines (vendor docs)

| Engine | Crawler | Rule for UNIX | Source |
|---|---|---|---|
| ChatGPT search | `OAI-SearchBot` (search), `GPTBot` (training), `ChatGPT-User` (user-triggered, robots.txt "may not apply") | **Allow `OAI-SearchBot`.** Blocking it removes UNIX from ChatGPT search answers. GPTBot is a separate business decision. Changes take about 24 h. | [OPENAI-BOTS] |
| Perplexity | `PerplexityBot` (search index, not training), `Perplexity-User` (ignores robots.txt) | **Allow `PerplexityBot`.** | [PPLX-BOTS] |
| Gemini app | Google crawlers plus the `Google-Extended` token for training and grounding | Blocking Google-Extended doesn't affect Search, but it removes UNIX content from Gemini grounding. Recommendation: allow. | [G-CRAWLERS] |

**Agent check:** Salla lets the merchant edit robots.txt. [SALLA-SEO] Make sure none of the above is disallowed.

### 6.3 Industry GEO practice (labelled Industry, not official)
- Get UNIX mentioned on Saudi pages that AI engines cite, such as listicles ("أفضل مواقع ملابس رياضية نسائية في السعودية"), fashion and fitness media, and Reddit or forum threads. Do this with **authentic** coverage only. Google warns that inauthentic mentions are less helpful than they seem. [G-AIOPT]
- Keep facts consistent across the site, Salla, GBP, Instagram and marketplaces (name, founding story, shipping and return terms).
- Answer the high-intent questions in plain text (the audit's «وين ألقى سبورت برا كويسة؟», «وش أحسن موقع…»). Put each one on the relevant category page or in a blog post.
- Publish comparison and sizing content with original data (measurements, fabric tests).
- Track prompts monthly (§12.2). There's no official API for this, so do it by manual sampling.
- Salla offers an **LLMs.txt** editor. [SALLA-SEO] It is harmless and ignored by Google. [G-AIOPT] Keep it short and factual if it's used.

---

## 7. Core Web Vitals and images

### 7.1 Metrics (current)

| Metric | Good | Measures |
|---|---|---|
| LCP | ≤ 2.5 s | Loading |
| INP | ≤ 200 ms | Responsiveness. It **replaced FID in March 2024**. |
| CLS | ≤ 0.1 | Visual stability |

- Assess at the **75th percentile** of page loads, mobile and desktop separately. A page passes only if all three pass. [WEB-VITALS] [G-CWV] [G-UPD]
- The "needs improvement" and "poor" thresholds are shown as graphics only on web.dev. Industry-standard values are LCP > 4 s, INP > 500 ms and CLS > 0.25 = poor. The rendered text wasn't readable, so these are **UNVERIFIED** against the page.
- Google "highly recommends" good CWV. They align with what the ranking systems reward, but no weight is published. [G-CWV]
- Project budgets (PERFORMANCE.md): Lighthouse mobile ≥ 85 and CLS < 0.05 are stricter than Google's thresholds. Keep them.

### 7.2 LCP and image rules (web.dev)
- **Never lazy-load the LCP image.** [WEB-LCP]
- Put `fetchpriority="high"` on the LCP `<img>` (one or two images at most). [WEB-LCP]
- The LCP image must be discoverable in the initial HTML. No CSS background or JS-only `data-src` unless it's preloaded. [WEB-LCP]
- Serve right-sized, modern formats (WebP or AVIF) from a CDN, ideally on the same origin. [WEB-LCP]
- Give every `<img>`/`<video>` `width` and `height` (or `aspect-ratio`), with the same aspect ratio across `srcset`. [WEB-CLS]
- Reserve space for late content (promo bars, review widgets). Use `font-display: optional` or tuned fallbacks for fonts. Animate only with `transform`. [WEB-CLS]

### 7.3 Image SEO (Google)
- Use `<img src>`. **Google doesn't index CSS background images.** [G-IMAGES]
- Write descriptive `alt` in the page language without stuffing. Example: `alt="ليقنز سكلبتنق بخصر عالٍ لون فانيلا – منظر جانبي"`. [G-IMAGES]
- Use short descriptive filenames and translate them per language where possible (`sculpting-leggings-vanilla-side.webp`). [G-IMAGES]
- Use `srcset` and `sizes` with a `src` fallback. Supported formats: BMP, GIF, JPEG, PNG, WebP, SVG, AVIF. Place images near relevant text. [G-IMAGES]
- Salla: alt text is set per image when uploading (Add image → Alt). [SALLA-SEO-EN]

---

## 8. Crawling and indexing (الزحف والفهرسة)

### 8.1 robots.txt
- It controls crawling, not indexing. A disallowed URL can still be indexed without content. Use `noindex` to keep a page out. [G-ROBOTS]
- Don't block CSS or JS that the page needs to render. [G-ROBOTS]
- Don't combine `Disallow` and `noindex` on the same URL, because Google can't see a `noindex` it can't crawl. [G-ROBOTS]
- Salla: edit it at Marketing tools → تحسين محركات البحث → General settings → ملف Robots.txt. [SALLA-SEO] [SALLA-SEO-EN]
- **UNIX check:** the old Shopify robots.txt blocked the blog (audit). Make sure the blog, categories, `/en/` and the AI search bots are allowed.

### 8.2 Sitemaps
- Limits: 50 MB uncompressed or 50,000 URLs. Use a sitemap index for more. UTF-8, absolute canonical URLs. [G-SITEMAP]
- `<lastmod>` is used only if it is consistently accurate. `<priority>` and `<changefreq>` are ignored. [G-SITEMAP]
- Submit in GSC, or add a `Sitemap:` line to robots.txt. Submission is a hint. [G-SITEMAP]
- Salla: copy the sitemap URL from the SEO settings page and submit it in GSC → Sitemaps. English URLs need multilingual enabled and English names entered. [SALLA-SEO] [SALLA-SEO-EN]

### 8.3 Faceted navigation and filter URLs
- If filtered URLs don't need to rank (the usual case), **block them in robots.txt** or put the filters in `#fragments`. Canonical and nofollow are weaker. [G-FACET]
- If they're allowed: use `&` separators, a consistent filter order, and **return 404 for empty or invalid combinations**. [G-FACET]
- Exception (industry practice): a filter with real search demand, such as colour "ليقنز أسود", deserves a **real category or subcategory** with its own copy, not an indexable filter URL.
- **UNVERIFIED:** Salla's filter and sort URL parameters. Inspect the live category URLs after applying filters, then write the robots.txt rules against the real parameter names.

### 8.4 Pagination
- Give each page a unique URL (`?page=2`) with a **self-canonical**. Don't canonical everything to page 1. [G-PAGINATION]
- `rel=next/prev` is not used by Google. Link the pages sequentially with `<a href>`. [G-PAGINATION]
- Infinite scroll and "load more" must be backed by crawlable paginated links. Never put page numbers in a `#fragment`. [G-PAGINATION]
- Sorted or filtered variants should be `noindex` or blocked. [G-PAGINATION]

### 8.5 URL design
- Use descriptive words, `?key=value` parameters, no session or tracking parameters in internal links, and consistent case. Each variant gets its own URL (path or parameter), with a canonical that omits optional parameters. [G-URL]

### 8.6 Search Console reports to watch

| Report | Watch for | Source |
|---|---|---|
| Page indexing | "Not found (404)", "Soft 404", "Page with redirect" (expected for old URLs), "Duplicate, Google chose different canonical than user", "Crawled/Discovered – currently not indexed", "Blocked by robots.txt", "Excluded by noindex" | [GSC-PIR] |
| Sitemaps | Fetch status and discovered URL counts for the new sitemap | [G-SITEMAP] |
| Performance (Web) | Clicks, impressions, CTR and position for Arabic vs English, brand vs non-brand. AI features traffic is included here. | [G-AIF] |
| URL Inspection | Google-selected canonical, rendered HTML, live redirect test | [G-MOVE] |
| Enhancements / Shopping (merchant listings, product snippets, breadcrumbs) | Errors after any theme release | [G-PRODUCT] |
| Core Web Vitals | Mobile URL groups failing LCP, INP or CLS | [G-CWV] |
| Manual actions / Security | After the move, should be empty | [G-MOVE] |
| Settings → Search generative AI control | Keep inclusion on | [G-CONTROL] |

---

## 9. Salla specifics (ما تتحكم فيه سلة وما يضيفه الثيم)

### 9.1 What Salla controls (merchant dashboard)

| Feature | Where | Status | Source |
|---|---|---|---|
| Home page title, description, keywords; link display; per-market SEO | Marketing → تحسين محركات البحث → الصفحة الرئيسية | Official | [SALLA-SEO] |
| Product SEO: title, description, **custom URL** (blank = default URL) | Product → تحسينات SEO → حفظ بيانات المنتج | Official | [SALLA-SEO] |
| Category SEO: title, custom link, description | Products → التصنيفات والخيارات → التصنيفات → تحسينات SEO | Official | [SALLA-SEO] |
| Brand SEO: title, custom link, description | Products → التصنيفات والخيارات → الماركات → تحسينات SEO | Official | [SALLA-SEO] |
| Quick SEO auto-fill for empty product, category and brand fields ("doesn't replace regular SEO") | SEO → تحسين صفحات المتجر | Official | [SALLA-SEO] |
| robots.txt editor | SEO → General settings | Official | [SALLA-SEO] |
| LLMs.txt editor; sitemap URL copy | SEO → General settings | Official | [SALLA-SEO] |
| Sitemap (English URLs only with multilingual on and English names) | Automatic | Official | [SALLA-SEO-EN] |
| GTIN and MPN per product and per variant, printed "in the product page code" for search engines | Product → Advanced → الكميات والمخزون → المخزون | Official | [SALLA-GTIN] |
| Image alt text | Image upload → Alt | Official | [SALLA-SEO-EN] |
| Google site verification (TXT record app); Google Merchant Center app and feeds; GTM app | App store | Official | [SALLA-APPS] [SALLA-TIPS] |
| HTTPS (free SSL on every store) | Automatic | Official | [SALLA-BASICS] |
| Custom links (short branded paths; bulk import via template with columns for link, type and item ID or URL; Arabic or encoded paths allowed) | المتجر وقنوات البيع → روابط مخصصة | Official, **but a redirect status code is not documented** | [SALLA-LINKS] |
| **301 redirects for old URLs** | ? | **UNVERIFIED. No official doc found.** | [IND-ANAS] |
| **Canonical tags** | ? | **UNVERIFIED as native.** Salla's help discusses canonical via GTM. Project D129 notes say Salla's head hook prints it. Confirm. | [SALLA-CANON] |
| **hreflang** | ? | **UNVERIFIED as native.** Salla's help recommends GTM. | [SALLA-HREF] |
| **Native JSON-LD** (Organization, WebPage, Product) | `{% hook head %}` | Measured on preview by the project (D129). **Not documented by Salla.** Salla's help documents adding schema via GTM. | [SALLA-SCHEMA] |
| The SEO feature requires the Pro plan | — | **UNVERIFIED** (industry claim). Ask Salla. | [IND-ANAS] |
| URL pattern (`/ar/<slug>/p<id>`?) | — | **UNVERIFIED.** Confirm on the live store. | PLAN.md |

### 9.2 What the theme can add (Twilight)
- `master.twig` is the layout for every page. The head hooks are `{% hook 'head:start' %}`, `{% hook head %}` and `{% hook 'head:end' %}`, which are "commonly used to add meta-data and SEO-related tags". [SALLA-LAYOUTS]
- **The theme owns:**
  - semantic HTML: one `<h1>`, the heading hierarchy, `<a href>` navigation, breadcrumbs UI
  - image markup: `width`/`height`, `fetchpriority`, `loading`, `srcset`, alt fallback
  - JSON-LD that Salla doesn't print. Per D129 that is `WebSite` on the home page, `BreadcrumbList` when the visible breadcrumbs are hidden, `BlogPosting`, and the optional `FAQPage`.
  - visible category copy and FAQ sections fed from component fields
  - CWV performance
- **The theme must not:** print a second Product or Organization, a second canonical, or titles and meta that override Salla's merchant fields. Merchant content stays in settings (CLAUDE.md).
- **Gap-fill policy:** if live verification shows Salla's Product lacks `offers`, `brand`, `aggregateRating`, `gtin` or `priceSpecification` (StrikethroughPrice), first try the Salla field. Only if no field exists, extend the markup in the theme by adding to the same entity through `@id`, not a second Product. Record a D-number.

### 9.3 Tools Salla points to
- GTM Custom HTML tags for schema, hreflang and canonical. [SALLA-SCHEMA] [SALLA-HREF] Use them only as a last resort. Google honours JS-injected JSON-LD and canonicals, but prefers HTML, and duplicates cause unpredictable results. [G-JS]

---

## 10. Arabic keyword research for Saudi Arabia (البحث عن الكلمات)

### 10.1 What Google says
- Google's systems understand synonyms and meaning, so you don't need to chase every long-tail variation. [G-AIOPT] Treat spelling variants as **one topic, one page**.

### 10.2 Variants to cover (industry practice, not Google policy)

| Concept | Saudi and common variants | Rule |
|---|---|---|
| Leggings | ليقنز · ليقينز · لقنز · ليجنز · ليغنز · leggings | Pick the dominant spelling per GSC and Keyword Planner data (the audit shows "ليقنز" as the head term). Use it in the H1, title and slug. Use 1–2 variants naturally in the body and alt text. |
| Taa marbuta | رياضية / رياضيه · نسائية / نسائيه | Write correct ة on the page. Users type ه. Google generally normalizes this, but the claim is **UNVERIFIED**. Check GSC queries. |
| Hamza | أطقم / اطقم · أسود / اسود | Use correct hamza on the page. Variants appear in queries. |
| Alif maqsura | ى / ي (مستوى / مستوي) | Same approach. |
| Dialect | الحين، وش، وين، أبي | Use them in Q&A and blog questions, which mirror real queries. Use neutral Modern Standard Arabic (MSA) with a light Saudi tone in product copy. |
| English loans | هودي / hoodie · لاونج وير / loungewear · سبورت برا / sports bra · ست / set | Arabic pages: use the Arabic script form plus the English term once (in the description or alt) where users search in English. English pages: English only. |
| Brand and product names | UNIX, Sculpting, Waist Tone, Bamboo | Keep product line names in Latin inside Arabic titles. The audit shows brand queries are about 73% of organic traffic. |

### 10.3 Methods and tools
- **Official sources of truth:**
  - GSC Performance → Queries (filter `/ar/` vs `/en/`, brand vs non-brand)
  - Merchant Center performance
  - Google Keyword Planner (Google Ads, region = Saudi Arabia, language = Arabic)
  - Google Trends (region SA)

  Keyword Planner and Trends weren't opened for this playbook, so their specific features are not cited.
- **Industry tools:** Semrush or Ahrefs (Saudi database), Google autocomplete and "People also ask" from a Saudi locale, TikTok and Instagram search (Saudi women search for fashion there), Salla's internal store search terms, and competitors' category names (Saudi activewear brands).
- **Process:**
  1. Seed list: the audit keywords (ملابس رياضية نسائية 1,900; هودي نسائي 1,000; …).
  2. Expand with the variants above.
  3. Group by intent and by SERP overlap (variants whose SERPs share 7 or more of the top 10 URLs are one page). This is industry practice.
  4. Map one cluster to one URL.
  5. Record the head term in the page brief.

---

## 11. Local and brand (البراند والحضور المحلي)

### 11.1 Google Business Profile for an online brand
- **Eligibility:** GBP requires "a physical location that customers can visit" or that the business "travels to customers". Virtual offices are ineligible. [GBP-GUIDE]
- **UNIX is online-only.** It's **not eligible** unless it has a staffed location customers can visit during stated hours (a showroom or pickup point), or a real travel-to-customer service. Delivery alone is not travelling to customers. This last point is an interpretation, and the delivery-only exception in the guidelines covers food brands only. [GBP-GUIDE]
- **Do:**
  - If a showroom or pickup point exists, create one profile.
  - Use the exact real-world name "UNIX".
  - Choose the correct category.
- **Don't:**
  - Add keywords to the name ("UNIX ملابس رياضية نسائية الرياض"). This risks suspension.
  - Use a virtual office or co-working desk without signage and customer hours.

  [GBP-GUIDE]
- **Correction to PLAN.md** ("Google Business Profile لـ UNIX"): make it conditional on a physical customer-facing location.
- **Alternatives for an online brand:**
  - Merchant Center (free listings and AI shopping visibility) [G-AIOPT] [G-ECOM-SHARE]
  - an Organization/OnlineStore markup with `sameAs` [G-ORG]
  - consistent brand facts everywhere

### 11.2 Digital PR and link building in KSA
- **Google policy:**
  - Buying or selling links for ranking, excessive exchanges, and guest posts or press releases with optimized anchors are link spam.
  - Paid or sponsored links must use `rel="sponsored"` or `rel="nofollow"`. [G-SPAM]
  - Influencer and blogger posts that are paid or gifted need `sponsored`.
- **Industry practice (KSA):**
  - Saudi fashion, fitness and lifestyle media (features, founder story, Saudi-made or Saudi-designed angle).
  - Women's fitness studios and run clubs (partnerships, event kits, with genuine links from their sites).
  - Gift guides around Ramadan, Eid, Saudi National Day (23 Sep) and Founding Day (22 Feb).
  - "Best activewear brands in Saudi" listicles, by pitching for honest inclusion.
  - Data-led PR with original data (sizing survey of Saudi women, fabric heat test).
  - Reclaim unlinked brand mentions.
  - Fix the 24 referring domains / 499 backlinks (audit) through the 301s so none breaks.
- **Don't:**
  - Use PBNs, link packages from Khamsat or Fiverr, or keyword-anchor guest posts.
  - Seed inauthentic AI mentions. [G-AIOPT]

---

## 12. Checklists and reporting

### 12.1 Pre-approval checklist (run on every page before approving)
Mark each item ✅ / ❌ / N/A. Any ❌ in the **Blockers** group means do not approve.

**Blockers**
- [ ] Returns **200** (or the intended 301 → 200 in one hop). No redirect chain. [G-MOVE]
- [ ] Not `noindex` unless intended. Not disallowed in robots.txt. [G-ROBOTS]
- [ ] Exactly **one** `rel=canonical`, absolute, self-referencing (or deliberately pointing at the canonical in the **same language**). [G-CANON] [G-JS]
- [ ] hreflang set present: self + alternate + `x-default`, absolute, bidirectional (spot-check the other language). [G-HREFLANG]
- [ ] Exactly **one** `<h1>`, matching the page topic. `<title>` and `<h1>` are consistent and in the page's language and script. [G-TITLE]
- [ ] Structured data validates in the Rich Results Test. No duplicate Product or Organization. Marked-up values (price, availability, rating) equal the visible values. [G-SDPOL]
- [ ] Product: `offers.price` > 0, `priceCurrency: "SAR"`, a nested Offer (not AggregateOffer). Ratings, if marked up, are visible. [G-MERCHANT] [G-REVIEW]
- [ ] No review markup about UNIX itself on Organization or home. [G-REVIEW]

**Quality**
- [ ] Title is unique, the head term is early, the brand appears once, there are no stuffed variants. [G-TITLE]
- [ ] Meta description is unique, specific and benefit-led, with no unconfirmed shipping figures. [G-SNIPPET-META]
- [ ] Copy is people-first with first-hand detail. No `<h1>` inside the description. No copied supplier text. [G-HELPFUL]
- [ ] Internal links: category ↔ product, related products, at least 1 link from a relevant blog or category, plain `<a href>`. [G-ECOM-STRUCT]
- [ ] Images: `<img>` with descriptive alt in the page language, `width`/`height`, the LCP image not lazy and with `fetchpriority=high`, WebP or AVIF. [G-IMAGES] [WEB-LCP] [WEB-CLS]
- [ ] English version fully translated (main content, not just the UI). [G-HREFLANG] [G-MULTI]
- [ ] Mobile Lighthouse ≥ 85 and CLS < 0.05 (project budget). Field CWV are good, where CrUX data exists. [WEB-VITALS]
- [ ] Arabic copy uses the feminine voice, correct ة/أ spelling, and the dominant keyword spelling (§10).
- [ ] Filter, sort and empty-state URLs are not indexable (blocked, `noindex`, or 404 for empty). [G-FACET] [G-PAGINATION]
- [ ] If FAQ: visible, genuinely useful, and FAQPage printed at most once. No rich-result claim. [G-UPD]

### 12.2 Monthly SEO report template

```
# UNIX SEO report: <Month YYYY>
Period: <dates> vs previous month vs same month last year (when available)
Baseline (audit 2026-09-24): 22 organic visits/mo, 7 ranking keywords (5 brand), Lighthouse mobile 41.

## 1. Headline (3 bullets max)
- Win / issue / next action

## 2. Organic performance (GSC Performance → Web)
| KPI | This month | Prev | Δ | Target |
| Clicks (total) | | | | |
| Clicks non-brand | | | | |
| Impressions | | | | |
| CTR | | | | |
| Avg position (non-brand, top 20 terms) | | | | |
| Clicks /ar/ vs /en/ | | | | |
| Organic sessions & revenue (GA4) | | | | |
| Organic conversion rate | | | | |

## 3. Keywords (tracked set, Saudi Arabia, Arabic + English)
| Keyword (variant group) | URL | Position | Δ | Impressions |
| ملابس رياضية نسائية | | | | |
| ليقنز رياضي نسائي (+ليقينز/لقنز) | | | | |
| هودي نسائي | | | | |
| … | | | | |
Keywords in top 3 / top 10 / top 20: _ / _ / _

## 4. Indexing & technical (GSC)
| Indexed pages | Not indexed (by reason) | 404 count | Soft 404 | Redirect errors | Sitemap status |
New 404s this month → fixed? (list)
Canonical mismatches ("Google chose different canonical") → list
Robots.txt changes → none / diff

## 5. Rich results & Merchant
| Merchant listings valid/invalid | Product snippets valid/invalid | Breadcrumbs | Merchant Center disapprovals |

## 6. Core Web Vitals (GSC CWV report + CrUX, mobile)
| Good URLs % | LCP p75 | INP p75 | CLS p75 | Lighthouse mobile (home/category/product) |

## 7. AI visibility (manual sample, Industry method)
10 fixed prompts × (Google AI Mode, ChatGPT, Perplexity, Gemini), Saudi locale, Arabic + English:
| Prompt | Engine | UNIX mentioned? | Cited URL | Competitors cited |
e.g. «وش أحسن موقع أشتري منه ملابس رياضية نسائية في السعودية؟», «ليقنز رياضي نسائي ما يشف»
Mention rate: _/40 (prev _/40)

## 8. Authority
| Referring domains (new/lost) | Notable links/PR | Unlinked mentions reclaimed | Branded search impressions |

## 9. Content shipped
| Page/post | Target cluster | Published | Early impressions |

## 10. Next month: top 5 actions (owner, due date)
```

**KPI definitions**
- Non-brand = queries that don't contain unix, يونكس or يونيكس.
- AI mention rate is a sampled indicator, not a Google metric.
- GSC includes AI Overviews and AI Mode traffic inside Web. There is no official split. [G-AIF]

---

## 13. Unverified items (resolve before relying on them)
1. Salla's **301 redirect** mechanism, status code, bulk import, and support for arbitrary old paths. [SALLA-LINKS] [IND-ANAS]
2. Whether Salla prints **canonical** and **hreflang** in server HTML on the live store, and whether its hreflang is correct (self plus alternates plus x-default). [SALLA-HREF] [SALLA-CANON]
3. Salla's **native JSON-LD** contents: Product `offers`, `brand`, `gtin`, `aggregateRating`, variants, `StrikethroughPrice`, return policy. The project has measured part of it on preview only (D129).
4. The live **URL pattern** (`/ar/` prefix? slug control? `p<id>` suffix?) and whether Arabic is at the root.
5. Whether the **SEO tools need the Pro plan**. This is an industry claim. [IND-ANAS]
6. Salla **filter and sort parameter** names (for the robots.txt rules).
7. Whether Google normalizes ة/ه and أ/ا in Arabic queries. There is no primary source. Check GSC query data.
8. Whether ChatGPT, Perplexity or Gemini use FAQPage or any schema. There is no primary source.
9. The CWV "needs improvement" and "poor" thresholds. web.dev shows them only as images.
10. Free-shipping threshold: 500 vs 600 SAR (SPEC §11). This is a client decision.

---

## 14. Sources (every URL opened for this playbook, 2026-11-09)

**Google Search Central (official)**
- [G-MOVE]: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- [G-PRODUCT]: https://developers.google.com/search/docs/appearance/structured-data/product
- [G-MERCHANT]: https://developers.google.com/search/docs/appearance/structured-data/merchant-listing
- [G-SNIPPET]: https://developers.google.com/search/docs/appearance/structured-data/product-snippet
- [G-VARIANTS]: https://developers.google.com/search/docs/appearance/structured-data/product-variants
- [G-REVIEW]: https://developers.google.com/search/docs/appearance/structured-data/review-snippet
- [G-BREAD]: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- [G-ORG]: https://developers.google.com/search/docs/appearance/structured-data/organization
- [G-SITENAME]: https://developers.google.com/search/docs/appearance/site-names
- [G-CAROUSEL]: https://developers.google.com/search/docs/appearance/structured-data/carousel
- [G-GALLERY]: https://developers.google.com/search/docs/appearance/structured-data/search-gallery
- [G-SDPOL]: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- [G-FAQ-DOC]: https://developers.google.com/search/docs/appearance/structured-data/faqpage (removed; resolves to the changelog)
- [G-FAQ2023]: https://developers.google.com/search/blog/2023/08/howto-faq-changes
- [G-SLSB]: https://developers.google.com/search/blog/2024/10/sitelinks-search-box
- [G-UPD]: https://developers.google.com/search/updates
- [G-AIF]: https://developers.google.com/search/docs/appearance/ai-features
- [G-AIOPT]: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- [G-CONTROL]: https://developers.google.com/search/docs/crawling-indexing/control-what-you-share
- [G-CRAWLERS]: https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers
- [G-TITLE]: https://developers.google.com/search/docs/appearance/title-link
- [G-SNIPPET-META]: https://developers.google.com/search/docs/appearance/snippet
- [G-HREFLANG]: https://developers.google.com/search/docs/specialty/international/localized-versions
- [G-MULTI]: https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
- [G-CANON]: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- [G-JS]: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- [G-HELPFUL]: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- [G-SPAM]: https://developers.google.com/search/docs/essentials/spam-policies
- [G-ECOM]: https://developers.google.com/search/docs/specialty/ecommerce
- [G-ECOM-STRUCT]: https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure
- [G-URL]: https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites
- [G-PAGINATION]: https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading
- [G-REVIEWS-WRITE]: https://developers.google.com/search/docs/specialty/ecommerce/write-high-quality-reviews
- [G-ECOM-SHARE]: https://developers.google.com/search/docs/specialty/ecommerce/share-your-product-data-with-google
- [G-ECOM-LAUNCH]: https://developers.google.com/search/docs/specialty/ecommerce/how-to-launch-an-ecommerce-website
- [G-FACET]: https://developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation
- [G-ROBOTS]: https://developers.google.com/search/docs/crawling-indexing/robots/intro
- [G-SITEMAP]: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- [G-CWV]: https://developers.google.com/search/docs/appearance/core-web-vitals
- [G-IMAGES]: https://developers.google.com/search/docs/appearance/google-images
- (opened, 404): https://developers.google.com/search/docs/specialty/ecommerce/write-high-quality-product-descriptions

**Google Help (official)**
- [GSC-COA]: https://support.google.com/webmasters/answer/9370220
- [GSC-PIR]: https://support.google.com/webmasters/answer/7440203
- [GBP-GUIDE]: https://support.google.com/business/answer/3038177

**web.dev (official)**
- [WEB-VITALS]: https://web.dev/articles/vitals
- [WEB-LCP]: https://web.dev/articles/optimize-lcp
- [WEB-CLS]: https://web.dev/articles/optimize-cls

**schema.org (official)**
- [SCHEMA-FAQ]: https://schema.org/FAQPage (V30.1, 2026-09-16)

**Salla (official)**
- [SALLA-HELP]: https://help.salla.sa/
- [SALLA-SEO]: https://help.salla.sa/article/%D8%AA%D8%AD%D8%B3%D9%8A%D9%86-%D8%B8%D9%87%D9%88%D8%B1-%D9%85%D8%AA%D8%AC%D8%B1%D9%83-%D8%B9%D9%84%D9%89-%D9%85%D8%AD%D8%B1%D9%83%D8%A7%D8%AA-%D8%A7%D9%84%D8%A8%D8%AD%D8%AB-seo/oi134aj2ud6ts12ysumrm5za
- [SALLA-SEO-EN]: https://help.salla.sa/en/article/improve-store-seo/gmzx0xblr3ajerkciyoxke1e
- [SALLA-LINKS]: https://help.salla.sa/article/%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9-%D9%88%D8%A5%D9%86%D8%B4%D8%A7%D8%A1-%D8%A7%D9%84%D8%B1%D9%88%D8%A7%D8%A8%D8%B7-%D8%A7%D9%84%D9%85%D8%AE%D8%B5%D8%B5%D8%A9-%D9%88%D8%A7%D8%B3%D8%AA%D9%8A%D8%B1%D8%A7%D8%AF%D9%87%D8%A7/nxylsaq54xtwx71wmm1ophea
- [SALLA-GTIN]: https://help.salla.sa/article/%D8%A5%D8%B6%D8%A7%D9%81%D8%A9-mpn-gtin-%D9%84%D8%AA%D8%B9%D8%B2%D9%8A%D8%B2-%D8%B8%D9%87%D9%88%D8%B1-%D8%A7%D9%84%D9%85%D9%86%D8%AA%D8%AC-%D8%B9%D9%84%D9%89-%D9%85%D8%AD%D8%B1%D9%83%D8%A7%D8%AA-%D8%A7%D9%84%D8%A8%D8%AD%D8%AB/e66aj1t93yqvmixcw3dk06t2
- [SALLA-TIPS]: https://help.salla.sa/en/category/%F0%9F%94%8E-search-engine-tips/et8k630jmszfrkt6e1vkefik
- [SALLA-APPS]: https://help.salla.sa/en/subcategory/seo-apps/iunuby1tszmghhxuq85om9z0
- [SALLA-HREF]: https://help.salla.sa/en/article/set-up-hreflang-tags-google-tag-manager/e4qayap1smxcpr4n7bmyms3j
- [SALLA-CANON]: https://help.salla.sa/en/article/improve-seo-google-tag-manager/x179kyls756fltpfn1gbhau1
- [SALLA-SCHEMA]: https://help.salla.sa/en/article/schema-markup-google-tag-manager/yj8l5ed3epzxihm0epc2to5m
- [SALLA-BASICS]: https://help.salla.sa/en/article/seo-basics/hu11ou0tf7qfonzwff8wdyc5
- [SALLA-LAYOUTS]: https://docs.salla.dev/422552m0

**Vendor (crawler operators)**
- [OPENAI-BOTS]: https://developers.openai.com/api/docs/bots (redirected from https://platform.openai.com/docs/bots)
- [PPLX-BOTS]: https://docs.perplexity.ai/guides/bots

**Industry (labelled; supplementary only)**
- [IND-ANAS]: https://www.anasrashed.com/2026/10/salla-vs-zid-vs-shopify-seo.html (Salla vs Zid vs Shopify SEO comparison, 2026-10)

[G-MOVE]: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
[G-PRODUCT]: https://developers.google.com/search/docs/appearance/structured-data/product
[G-MERCHANT]: https://developers.google.com/search/docs/appearance/structured-data/merchant-listing
[G-SNIPPET]: https://developers.google.com/search/docs/appearance/structured-data/product-snippet
[G-VARIANTS]: https://developers.google.com/search/docs/appearance/structured-data/product-variants
[G-REVIEW]: https://developers.google.com/search/docs/appearance/structured-data/review-snippet
[G-BREAD]: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
[G-ORG]: https://developers.google.com/search/docs/appearance/structured-data/organization
[G-SITENAME]: https://developers.google.com/search/docs/appearance/site-names
[G-CAROUSEL]: https://developers.google.com/search/docs/appearance/structured-data/carousel
[G-GALLERY]: https://developers.google.com/search/docs/appearance/structured-data/search-gallery
[G-SDPOL]: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
[G-FAQ2023]: https://developers.google.com/search/blog/2023/08/howto-faq-changes
[G-SLSB]: https://developers.google.com/search/blog/2024/10/sitelinks-search-box
[G-UPD]: https://developers.google.com/search/updates
[G-AIF]: https://developers.google.com/search/docs/appearance/ai-features
[G-AIOPT]: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
[G-CONTROL]: https://developers.google.com/search/docs/crawling-indexing/control-what-you-share
[G-CRAWLERS]: https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers
[G-TITLE]: https://developers.google.com/search/docs/appearance/title-link
[G-SNIPPET-META]: https://developers.google.com/search/docs/appearance/snippet
[G-HREFLANG]: https://developers.google.com/search/docs/specialty/international/localized-versions
[G-MULTI]: https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
[G-CANON]: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
[G-JS]: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
[G-HELPFUL]: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
[G-SPAM]: https://developers.google.com/search/docs/essentials/spam-policies
[G-ECOM-STRUCT]: https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure
[G-URL]: https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites
[G-PAGINATION]: https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading
[G-REVIEWS-WRITE]: https://developers.google.com/search/docs/specialty/ecommerce/write-high-quality-reviews
[G-ECOM-SHARE]: https://developers.google.com/search/docs/specialty/ecommerce/share-your-product-data-with-google
[G-FACET]: https://developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation
[G-ROBOTS]: https://developers.google.com/search/docs/crawling-indexing/robots/intro
[G-SITEMAP]: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
[G-CWV]: https://developers.google.com/search/docs/appearance/core-web-vitals
[G-IMAGES]: https://developers.google.com/search/docs/appearance/google-images
[GSC-COA]: https://support.google.com/webmasters/answer/9370220
[GSC-PIR]: https://support.google.com/webmasters/answer/7440203
[GBP-GUIDE]: https://support.google.com/business/answer/3038177
[WEB-VITALS]: https://web.dev/articles/vitals
[WEB-LCP]: https://web.dev/articles/optimize-lcp
[WEB-CLS]: https://web.dev/articles/optimize-cls
[SCHEMA-FAQ]: https://schema.org/FAQPage
[SALLA-HELP]: https://help.salla.sa/
[SALLA-SEO]: https://help.salla.sa/article/%D8%AA%D8%AD%D8%B3%D9%8A%D9%86-%D8%B8%D9%87%D9%88%D8%B1-%D9%85%D8%AA%D8%AC%D8%B1%D9%83-%D8%B9%D9%84%D9%89-%D9%85%D8%AD%D8%B1%D9%83%D8%A7%D8%AA-%D8%A7%D9%84%D8%A8%D8%AD%D8%AB-seo/oi134aj2ud6ts12ysumrm5za
[SALLA-SEO-EN]: https://help.salla.sa/en/article/improve-store-seo/gmzx0xblr3ajerkciyoxke1e
[SALLA-LINKS]: https://help.salla.sa/article/%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9-%D9%88%D8%A5%D9%86%D8%B4%D8%A7%D8%A1-%D8%A7%D9%84%D8%B1%D9%88%D8%A7%D8%A8%D8%B7-%D8%A7%D9%84%D9%85%D8%AE%D8%B5%D8%B5%D8%A9-%D9%88%D8%A7%D8%B3%D8%AA%D9%8A%D8%B1%D8%A7%D8%AF%D9%87%D8%A7/nxylsaq54xtwx71wmm1ophea
[SALLA-GTIN]: https://help.salla.sa/article/%D8%A5%D8%B6%D8%A7%D9%81%D8%A9-mpn-gtin-%D9%84%D8%AA%D8%B9%D8%B2%D9%8A%D8%B2-%D8%B8%D9%87%D9%88%D8%B1-%D8%A7%D9%84%D9%85%D9%86%D8%AA%D8%AC-%D8%B9%D9%84%D9%89-%D9%85%D8%AD%D8%B1%D9%83%D8%A7%D8%AA-%D8%A7%D9%84%D8%A8%D8%AD%D8%AB/e66aj1t93yqvmixcw3dk06t2
[SALLA-TIPS]: https://help.salla.sa/en/category/%F0%9F%94%8E-search-engine-tips/et8k630jmszfrkt6e1vkefik
[SALLA-APPS]: https://help.salla.sa/en/subcategory/seo-apps/iunuby1tszmghhxuq85om9z0
[SALLA-HREF]: https://help.salla.sa/en/article/set-up-hreflang-tags-google-tag-manager/e4qayap1smxcpr4n7bmyms3j
[SALLA-CANON]: https://help.salla.sa/en/article/improve-seo-google-tag-manager/x179kyls756fltpfn1gbhau1
[SALLA-SCHEMA]: https://help.salla.sa/en/article/schema-markup-google-tag-manager/yj8l5ed3epzxihm0epc2to5m
[SALLA-BASICS]: https://help.salla.sa/en/article/seo-basics/hu11ou0tf7qfonzwff8wdyc5
[SALLA-LAYOUTS]: https://docs.salla.dev/422552m0
[OPENAI-BOTS]: https://developers.openai.com/api/docs/bots
[PPLX-BOTS]: https://docs.perplexity.ai/guides/bots
[IND-ANAS]: https://www.anasrashed.com/2026/10/salla-vs-zid-vs-shopify-seo.html
