# Post-launch audit of the live unix.sa, 2026-11-23

**Scope:** domain, email, SEO and redirects, speed, catalogue data, and a full shopper walkthrough (390 mobile and 1440 desktop, AR and EN).
**Method:** read-only. No order was placed and nothing on the store was changed.

## Source reports
- SEO: `docs/seo/POST-MIGRATION-AUDIT-2026-11-23.md`. Redirects: `docs/seo/redirects-for-salla-2026-11-23.csv` (424 rows). Unresolved: `docs/seo/redirects-unresolved-2026-11-23.csv` (25 rows).
- Salla import file: `~/Downloads/unix-salla-import/for-claude-desktop/custom-urls-unix-424.xlsx`.
- Catalogue: scratchpad `audit/catalog-audit.md` and its CSVs. Speed: scratchpad `compare/raw/lh/live_*.json`.
- Visual: `tools/visual-qa/shots/live-2026-11-23/`. Defect copies: `~/Desktop/unix-visual-qa/2026-11-23-live/`.

## Owner, Salla dashboard (now)

| # | Issue | Fix |
|---|---|---|
| 1 | «تعليقة للحقيبة» (p149315191) is public at 0 SAR and can be added to the cart | Hide the product |
| 2 | «حقيبة الجيم اليومية \| ازرق داكن» (p434066593) is public. It was unlisted on Shopify, duplicates the bag with the charm, and its EN page is in Arabic | Hide it, or translate it |
| 3 | Every old Shopify URL returns 404 | Import the 424 custom links, then curl-test them |
| 4 | No free-shipping rule existed, although the site says «فوق 500» | Add it in الشحن ← المزيد ← الشحن المجاني (in progress) |
| 5 | Email DNS: no SPF, and the second google-site-verification TXT has Arabic text pasted in | Add `v=spf1 include:_spf.google.com ~all`, fix the TXT, then add DKIM from Google Admin |
| 6 | The 2 home video tiles hotlink cdn.shopify.com (one is 2.58 MB) | Re-upload the compressed tiles to Salla before Shopify closes |
| 7 | Content contradictions (see below) | Owner decides the policy; edit the Salla pages |
| 8 | Category pages show one 4★ store review that complains about late delivery | Unpublish it, or turn off store testimonials on categories |
| 9 | Home tab «الأكثر مبيعا» CTA has no link | Link the tab to category c1993896765 in the theme editor |

**Content contradictions:**
- Free shipping: 500 on the site, 600 in the FAQ and About pages.
- Returns: 14 days in About, 3 days in the policy, 24 hours on the Contact page.
- Payment: the FAQ and About mention Tabby and Tamara, which are not active.
- Delivery time: 1–4 days in the FAQ, 2–3 days on the product page.

## Owner, this week
- **20 set prices.** Salla prices each set as the sum of its pieces minus 2%.
  - 13 sets are dearer than Shopify: towels +23.44, Comfy pants sets +22.84, pyjama +14.04, Curve Enhance +12.04, and others.
  - 7 sets are cheaper: Waist Tone −11.76, Bamboo −2.14, Sailor −0.56.
  - The 61 single products match Shopify exactly.
- **Option name «اختاري مقاسك».** Rename it to «المقاس». It shows in the cart line as «اختاري مقاسك: M» and causes the doubled «اختاري اختاري».
- **Set size guides.** All 19 clothing sets carry only the bottom guide.
- **Two empty SKUs:** waist-tone-hoodie-off-white size M, and timeless-gym-bag-with-charm-stray-night-blue. These matter for Premium shipping.
- **Gifting block** «أهدِ من تحب»: unix.sa never had it, and its copy is masculine. Turn it off.
- **Footer menus** repeat من نحن, الأسئلة الشائعة and تواصل معنا, and call the same page by two names.
- **Salla support:**
  - /sitemap.xml returns 404.
  - unix-glo.com is dead; ask for a 301 to unix.sa.
  - The store username is still unix-glo.com. Apple Pay was tested on an iPhone and validates for unix.sa.
  - The video CDN sends no Content-Type.
- **Search Console:**
  - Fix the TXT record and verify the property.
  - Export top pages and links.
  - Request indexing for home, the 11 categories and the top 10 products.
  - Watch the 404 report weekly for 8 weeks.
- **SEO data:**
  - Import the product SEO titles and descriptions; they are auto-clipped mid-word.
  - The home title is only «يونكس».
  - EN products have only a «Description» accordion.
  - 5 EN products have Arabic image alt text.
- **Colour links:**
  - Add the Soft Touch towel family.
  - Fix the labels: Starry Night Blue, «فانيلا» vs «فانيليا», «كحلي» vs «أزرق ليلي».
- **Names:** missing hamza (اسود, اوف وايت, ازرق), double spaces, and «CURVE ENHANCE» in capitals.
- **Ads and bio links** still point to Shopify paths and unix-glo.com.

## Theme update batch (code, needs Salla review)
1. **#418 on every page.**
   - Cause: Cloudflare Fonts rewrites `<link id="unix-fonts">`, so hydration fails at the root and the whole page re-renders on the client.
   - Fix: self-host IBM Plex Sans Arabic (`app/routes/__root.tsx:63-66, 89-107`).
   - Biggest speed win, and it clears a Best Practices failure.
2. **Quick view «اختاري الخيارات» shows no add-to-cart button** in 2 of 3 tries. The `salla-add-product-button` is never hydrated (LESSONS 39/48 family). **Major.**
3. **Desktop transparent header over the hero video.**
   - Cream icons vanish on light frames.
   - The header stays transparent while the mega menu is open.
4. **Products-tabs CTA renders with no href.** Don't render the button without a link.
5. **Category testimonials block.**
   - A raw Salla style, and a second h1.
   - EN shows Arabic text.
   - Add a theme toggle.
6. **No filters drawer on categories** (D80/4.2). Check whether Salla returns filters. "Price: low to high" puts the sets first.
7. **«اختاري اختاري مقاسك أولًا».** The translation key is combined with the option name.
8. **Hero first paint is blank** for 1–2 s. The headings below are unstyled until the CSS loads.
9. **Cart page.**
   - The size shows as a dropdown instead of «المقاس: M».
   - Salla's masculine strings show: أرسل كهدية، أضف إلى السلة، لديك كوبون خصم؟
10. **Size-guide table on sets** is 58 px wider than the modal: the XL column is cut, with no scroll hint. Sets should also load their pieces' guides.
11. **The XL size wraps alone** onto a second row (4-column grid) on single products.
12. **Drawer after adding a set** shows a skeleton for 7 s or more; a single product takes 2.6 s.
13. **Zoom modal** is intermittently blank for the first second, and its arrows are 0×0.
14. **JS error** `Cannot read properties of undefined (reading 'id')` on categories, /products and /search.
15. **PDP weight.**
    - Thumbnails are eager and preloaded while hidden on mobile.
    - Slides 2–5 fetch early.
    - 147 JS chunks (86 under 1 KB).
    - 253 KB of inline critical CSS on the PDP.
16. **SEO in code.**
    - Category hreflang points at non-canonical EN slugs.
    - Static pages are self-canonical on any slug.
    - JSON-LD has `sku: null`.
    - Fall back from Arabic alt text on EN pages.
17. **Hero video:** add `<source type="video/mp4">` as a hedge for the missing Content-Type.
18. **Set price on the PDP and cards: show the pieces' sum struck through next to the set price** (new D-number; the owner asked for it, 2026-11-23).
    - Today only the cart shows the strikethrough.
    - Salla sends `is_on_sale:false` and only `starting_price` for `group_products`, but the PDP's bundle data carries the piece prices (e.g. 269 + 209).
    - The cards' listing data has to be checked.
    - Hide the strikethrough when the sum equals the set price: Waist Tone stays 588 with no discount, by the owner's decision.

## Speed (mobile Lighthouse, median of 3)

| Page | Perf | LCP |
|---|---|---|
| Home AR | 78 | 4.05 s |
| Home EN | 83 | 3.24 s |
| Category | 83 | 3.86 s |
| Set PDP | 79 | 3.69 s |
| Single PDP | 81 | 3.74 s |

- A11y 99–100, SEO 92–100, CLS about 0.
- Theme JS is 442 KB, against a 150 KB budget.
- Salla SSR TTFB is about 0.5–0.8 s.

## Passed
- **Domain and SSL:** the certificate runs to Feb 2027. www and http send 301 to unix.sa. MX works.
- **Apple Pay** validates for unix.sa.
- **Catalogue:** all 81 products are live in AR and EN. Singles match Shopify prices. Stock matches. All 420 images load. Descriptions have no Shopify leftovers.
- **Colour links:** all 120 paths return 200.
- **Buying flow:** add to cart, quantity, remove, coupon error, and the hand-off to checkout-next all work. The free-shipping bar moves.
- **Pages:** the static pages and the 404 work.
- **No horizontal scroll** on any page measured.
- **WhatsApp FAB** doesn't overlap the sticky add-to-cart bar.

## Not covered
- Sales, orders, conversion and abandoned carts: the Salla connector was disconnected.
- Real iPhone Safari (only Apple Pay was tested).
- Some phone AR screenshots were captured but not re-viewed; see the visual report.
