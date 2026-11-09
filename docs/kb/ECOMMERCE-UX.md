# E-commerce UX knowledge base (course notes for UNIX review agents)

Audience: `unix-shopper-walkthrough`, `unix-design-reviewer`, `unix-launch-gatekeeper` and any agent that judges conversion or UX on the UNIX Salla theme.
Compiled: 2026-11-09. Language: English. Scope: Arabic-first (RTL), mostly mobile, SAR prices, KSA payments.

## How to use this file

- Each rule has four parts: **Rule** · **Evidence** · **Check on our theme** · **Source**.
- Source types:
  - **research (Baymard/NN/g)**: large-sample usability testing or benchmarks.
  - **platform guidance**: official docs from Salla, Google, Tabby/Tamara or a regulator.
  - **industry practice**: vendor surveys, trade press or common merchant practice. Treat it as weaker evidence.
- **Numbers**: a number appears only when the cited page states it. Baymard figures come from different benchmark years and sample sizes, so quote the figure with its source, not as a universal fact.
- **UNVERIFIED** means the claim came from a secondary summary or search snippet and was not confirmed on the primary page. Don't quote it to the client as fact.
- **Precedence.** This file never overrides `docs/DESIGN-SYSTEM.md`, the "match unix.sa first" goal or a D-number in `docs/ROADMAP.md`. If a rule here conflicts with unix.sa parity, the recommendation must be **"optional, as a setting toggle"** with a suggested D-number. Never "fix" a §12 intended difference.
- **Limits.** Most Baymard detail sits behind its Premium paywall. The rules below use only the free articles. No study here was run on Saudi shoppers unless marked KSA.

---

## 0. The ten highest-impact rules (read these first)

1. Show the **full cost early**: price, VAT status, shipping cost or free-shipping threshold. Extra costs are the top abandonment reason (40%) in Baymard's survey.
2. Show a **delivery date, not a speed**, on the product page and at checkout (§3.9).
3. Make **sizing complete**: chart in cm, how-to-measure, a fit note and the model's size and height, all next to the size buttons (§4).
4. Show sizes as **buttons**, with sold-out sizes visible and marked (§3.4).
5. Show the **product on a real human model**, including at least one unstyled shot (§3.2).
6. **Summarise or link the return/exchange policy on the product page** (§3.10). 60% of users look for it there.
7. **Installments (Tabby/Tamara) under the price**, and payment marks the KSA shopper recognises (Mada, Apple Pay) (§8).
8. Give **clear add-to-cart feedback** that keeps the shopper in control (§5.1).
9. Keep **mobile galleries swipeable and zoomable** (§9).
10. Never let **aesthetics hide function**: quiet luxury may be minimal, but labels, prices and controls must stay visible (§11).

---

## 1. Home page

**H1. Make the catalogue type obvious in the first screen.**
- **Evidence:** In Baymard's 2015 mobile benchmark, 42% of sites had home pages that didn't let users infer what kind of catalogue they had landed on. 70% of test subjects scrolled the whole home page "to get an overview of my options".
- **Check:** At 375px, does the first screen (hero + header) say "women's activewear/loungewear" in image *and* words? Is the hero headline merchant text from `home.unix-hero` fields, not empty?
- **Source:** research (Baymard). https://baymard.com/blog/mobile-ecommerce-search-and-navigation

**H2. Show the range of product types on the home page.**
- **Evidence:** In Baymard's homepage benchmark, 6% of sites showed fewer than 40% of their product types on the home page. On mobile the categories aren't permanently visible in the navigation, so the home page carries more of the job of showing the range.
- **Check:** Do `unix-collections-grid` and `unix-products-tabs` together expose every top category (leggings, sports bras, sets, loungewear, etc.)?
- **Source:** research (Baymard). https://baymard.com/blog/ecommerce-homepage-ux

**H3. Promote popular categories and subcategories so users can skip broad top-level scopes.**
- **Evidence:** 62% of sites didn't help users pick a well-defined scope from the home page.
- **Check:** Do the collection tiles link to specific collections (for example "Leggings"), not only to "All products"?
- **Source:** research (Baymard). https://baymard.com/blog/ecommerce-homepage-ux

**H4. Avoid ad-like home content.**
- **Evidence:** 59% of sites showed overly aggressive ad-like content. NN/g adds that users tend to ignore animations that look like ads.
- **Check:** Look at the offer strip, announcement bar and popups. Are there more than one competing promo per screen? Is anything flashing or moving that isn't the hero video?
- **Source:** research (Baymard, NN/g). https://baymard.com/blog/ecommerce-homepage-ux · https://www.nngroup.com/articles/designing-effective-carousels/

**H5. Carousels: no auto-rotation on mobile, at most five frames, clear indicators, and key content duplicated elsewhere.**
- **Evidence:** In Baymard's homepage benchmark, 36% of sites used a carousel and 75% of those implemented it incorrectly. NN/g: people often miss every frame after the first. Don't auto-advance on mobile. Dots are weak cues on mobile. Controls belong inside the carousel. Let part of the next frame bleed into view to signal there is more.
- **Check:** `unix-hero.js`, `unix-collection-overlay.js`, `unix-products-tabs.js`. Does anything autoplay below `md`? Do the arrows meet the 44px tap target? Does the next card peek in? Does `prefers-reduced-motion` stop motion?
- **Source:** research (Baymard, NN/g). https://baymard.com/blog/ecommerce-homepage-ux · https://www.nngroup.com/articles/designing-effective-carousels/

**H6. Make clickable things look clickable, with clear hit areas.**
- **Evidence:** 43% of sites didn't make clickable elements and their hit areas clear, up from 18% in 2018. In Baymard's mobile list research, 28% of sites failed to give clear hit areas in product lists.
- **Check:** Is every image tile a link? Are text-only CTAs ("تسوقي الآن") styled as links or buttons? Is the whole card clickable, not just the title?
- **Source:** research (Baymard). https://baymard.com/blog/ecommerce-homepage-ux · https://baymard.com/blog/mobile-ecommerce-search-and-navigation

**H7. Keep search prominent.**
- **Evidence:** 22% of sites didn't present search prominently. In Baymard's mobile testing, search was the preferred product-finding strategy, seen as faster than category navigation.
- **Check:** `header.twig` (`unix_header_show_search`, default on). Is the search icon in the mobile header, with a 44px target?
- **Source:** research (Baymard). https://baymard.com/blog/ecommerce-homepage-ux · https://baymard.com/blog/mobile-ecommerce-search-and-navigation

**H8. Language and country switch must be correct and easy.**
- **Evidence:** 35% of sites implemented country or language selection incorrectly.
- **Check:** Does the AR/EN switch keep the same page (product to product, not back to home)? Is it labelled in the target language ("English" / "العربية")?
- **Source:** research (Baymard). https://baymard.com/blog/ecommerce-homepage-ux

**H9. Provide curated or thematic paths (gifting, "complete the look", seasonal edits).**
- **Evidence:** 34% of sites in Baymard's mobile benchmark offered no thematic browsing.
- **Check:** Is there a merchant-editable "edit" or "new in" path (collection overlay, tabs)? Ramadan, Eid and National Day edits are relevant seasonal themes for KSA (industry practice).
- **Source:** research (Baymard). https://baymard.com/blog/mobile-ecommerce-search-and-navigation

---

## 2. Category page (PLP) and filtering

**P1. Offer the four core sorts: price, user rating, best-selling, newest.**
- **Evidence:** 64% of sites didn't offer all four (Baymard guideline title, via search snippet).
- **Check:** The sort control in `unix-plp.js` / the collection grid (DS §8.30). Which sort options does Salla expose, and are they all shown?
- **Source:** research (Baymard). https://baymard.com/blog/essential-sort-types

**P2. Show colour variations as swatches on list items.**
- **Evidence:** On 57% of sites not all colour variations were available in the product list. Baymard recommends swatches in list items rather than text or nothing, and found a horizontally scrolling swatch list performed best on mobile. Baymard's mobile research says 75% of colour options weren't visible in the list (search snippet, Aug 2023 article).
- **Check:** UNIX models each colour as a separate product (D72/D133, colour links on the PDP only). The product card in `product-card.js` shows no colour swatches. That is a list-level gap, so any fix should be **optional, as a setting toggle**.
- **Source:** research (Baymard). https://baymard.com/blog/mobile-interactive-color-swatches

**P3. Allow multiple values of the same filter type (OR logic).**
- **Evidence:** 15% of sites didn't allow it (Baymard guideline title, via search snippet).
- **Check:** In the filters drawer (DS §8.31), can she pick both S *and* M, or both black *and* beige?
- **Source:** research (Baymard). https://baymard.com/research/ecommerce-product-lists

**P4. Show applied filters as an overview she can remove one by one.**
- **Evidence:** Baymard reports 28% to 32% of sites failing on applied-filter display, depending on the edition (UNVERIFIED which figure is current).
- **Check:** After closing the filters drawer, are the active filters visible above the grid as removable chips, with "clear all"?
- **Source:** research (Baymard). https://baymard.com/blog/ecommerce-product-lists-report-and-benchmark

**P5. Mobile filters: keep the results count visible, update live, and use a plain word ("الفلاتر"), not just an icon.**
- **Evidence:** NN/g recommends a tray over the results rather than a separate screen. The total number of results should always be visible, results should update as filters are picked, and the button should use a word like "Filter". Baymard: 78% of mobile sites were "poor" to "mediocre" in product-list UX, against 58% on desktop (2025 benchmark, via search snippet).
- **Check:** `pages/product/index.twig:177` (filters drawer). Does it show "عرض N منتج" on the apply button? Is the trigger labelled with text?
- **Source:** research (NN/g, Baymard). https://www.nngroup.com/articles/mobile-faceted-search/ · https://baymard.com/research/ecommerce-product-lists

**P6. Price filter is expected.**
- **Evidence:** 80% of users in Baymard mobile testing tried to filter by price regardless of product type (UNVERIFIED: secondary citation only).
- **Check:** Is a price filter present in the drawer?
- **Source:** research (Baymard, secondary). https://baymard.com/research/ecommerce-product-lists

**P7. Show the most useful list-item information: name, price (with sale price), and stock status. Mark sold-out items clearly.**
- **Evidence:** NN/g: show availability before checkout. In Baymard's 2015 testing, sites with mediocre product-list usability had abandonment rates of 67–90%, against 17–33% for sites with a slightly optimised toolset (old data, from the search snippet).
- **Check:** `product-card.js:55-62` shows the sold-out badge first, like unix.sa. Is the sale price shown with the original struck through, and does the price use the SAR symbol consistently?
- **Source:** research (NN/g, Baymard). https://www.nngroup.com/articles/ecommerce-product-pages/ · https://baymard.com/blog/ecommerce-product-lists-report-and-benchmark

**P8. Category hierarchy: not too deep, not too shallow, not overlapping.**
- **Evidence:** 38% of sites in Baymard's mobile benchmark had hierarchy problems.
- **Check:** Does the mobile menu (DS §8.7) put a product in more than one confusing parent? Are there "View all" links at each level?
- **Source:** research (Baymard). https://baymard.com/blog/mobile-ecommerce-search-and-navigation

**P9. Mobile navigation: hidden menus are less discoverable. Back them up with in-page links.**
- **Evidence:** NN/g (179 participants): hidden navigation reduced content discoverability by more than 20% compared with visible or combo navigation. On mobile, hidden navigation was used in 57% of cases against 86% for combo navigation. Show visible links when there are 4 or fewer top-level items. With more, hiding them is reasonable but should be backed by in-page links.
- **Check:** Does the home page carry category links (collection grid) so the hamburger isn't the only path?
- **Source:** research (NN/g). https://www.nngroup.com/articles/hamburger-menus/

---

## 3. Product page (PDP)

**D1. Core components every PDP needs:** a clear name, images with enlarged views, the full price including product-specific charges, selectable options, availability, add to cart with feedback, and a concise description.
- **Evidence:** NN/g, 49 sites studied.
- **Check:** `pages/product/single.twig:180-430` order: title, price, promo, installments, options, size finder, size charts, buy buttons, delivery estimate, accordions, rating.
- **Source:** research (NN/g). https://www.nngroup.com/articles/ecommerce-product-pages/

**D2. Show apparel on a real human model, with at least one unstyled image.**
- **Evidence:** In Baymard's apparel research, 21% of sites didn't show apparel on a human model. In the PDP benchmark, 23% didn't show wearable products on a model. Cut-outs on white didn't show drape, fit or length, and some participants skipped products that lacked model shots. Mannequins and virtual models drew negative reactions ("cheap"). Styling such as rolled sleeves hides true length, so include at least one unstyled shot.
- **Check:** This is merchant content. Agents should check the demo and live catalogue images, not the code. The gallery (`unix-gallery.twig`) must keep model images first, as uploaded.
- **Source:** research (Baymard). https://baymard.com/blog/human-model · https://baymard.com/blog/apparel-5-best-practices

**D3. Give "in scale" cues.**
- **Evidence:** 42% of users tried to judge product size from the images. 37% of sites in the PDP benchmark had no "in scale" images.
- **Check:** For worn items the human body is the scale, so this follows from D2. For bags or bottles, is there an on-body or in-hand shot?
- **Source:** research (Baymard). https://baymard.com/blog/current-state-ecommerce-product-page-ux

**D4. Sizes as buttons, with sold-out sizes visible and marked.**
- **Evidence:** In the apparel research, 70% of sites didn't use buttons for each size or implemented them wrongly. In the PDP benchmark, 57% didn't. When sizes were hidden in a drop-down, participants overlooked the selector, were disappointed by what was available, and triggered avoidable errors.
- **Check:** `pages/partials/product/options.twig:35-38` uses buttons, a diagonal strike on sold-out sizes and a visually hidden "نفدت الكمية" label. Confirm on device that the strike has enough contrast and that sold-out sizes stay selectable when notify-me is on.
- **Source:** research (Baymard). https://baymard.com/blog/apparel-5-best-practices · https://baymard.com/blog/current-state-ecommerce-product-page-ux

**D5. Put the size guide link right next to the size buttons, prominent enough to see at a glance.**
- **Evidence:** Baymard lists this among the 10 required size-information elements and notes that nearly all benchmarked sites do it correctly. Some sites put the link too far away or make it too subdued.
- **Check:** The size finder and size charts render right after the options (`single.twig:278-281`). Is the trigger text clear ("دليل المقاسات"), not a faint underline?
- **Source:** research (Baymard). https://baymard.com/blog/apparel-size-information

**D6. Reviews: show a summary, allow filtering by rating, show negative reviews, and mark verified buyers.**
- **Evidence:** NN/g: shoppers often read negative reviews first. Baymard: up to 95% of users consult reviews before buying. 89% of sites didn't respond to negative reviews. 63% didn't let users browse reviewer photos across reviews (90% in the apparel benchmark).
- **Check:** `salla-comments` (DS §8.26). Can the merchant reply? Do review photos open in a gallery that moves across reviews? Salla controls this, so note gaps instead of re-implementing.
- **Source:** research (NN/g, Baymard). https://www.nngroup.com/articles/ecommerce-product-pages/ · https://baymard.com/blog/current-state-ecommerce-product-page-ux

**D7. Add an aggregate "fit" score to reviews (too small … too large).**
- **Evidence:** 24% of apparel sites didn't have one. A bar scale from "too small" to "too large" tested well. One shopper faced 2,155 reviews and gave up looking for fit information.
- **Check:** Salla reviews have no fit dimension. This is a gap and needs a client decision (strategic, suggest a D-number). Don't build a custom review system (hard rule: use `salla-*`).
- **Source:** research (Baymard). https://baymard.com/blog/apparel-5-best-practices

**D8. Show a total-cost estimate near the buy section (shipping cost or free-shipping threshold).**
- **Evidence:** 67% of sites didn't. Extra costs were the top abandonment reason at 40%, and 12% abandoned because they couldn't see or calculate the total up front.
- **Check:** `single.twig:234-236` shows the tax line and "الشحن يُحسب عند إتمام الطلب" (D124). Is the free-shipping threshold visible on the PDP, or only in the cart drawer (`unix-free-shipping.js`)?
- **Source:** research (Baymard). https://baymard.com/blog/current-state-ecommerce-product-page-ux · https://baymard.com/lists/cart-abandonment-rate

**D9. Show an estimated delivery *date* (not "3–5 business days"), and keep the window narrow.**
- **Evidence:** 41% of sites didn't show a delivery date at shipping selection. Users treat the date as a promise. Testers hesitated when windows ran beyond about 5–7 days. Date ranges beat speed ranges. Account for cutoff times, weekends and holidays. Fetch asynchronously with a speed fallback. 20% of shoppers abandoned because delivery was too slow.
- **Check:** `unix-delivery-estimate.twig` / `.js` (DS §8.24). Does it output dates such as "يصلك بين الأحد ١٦ و الثلاثاء ١٨ نوفمبر"? Does it skip the KSA weekend (Friday) and public holidays (Eid, National Day)? Is it per city if possible?
- **Source:** research (Baymard). https://baymard.com/blog/shipping-speed-vs-delivery-date · https://baymard.com/lists/cart-abandonment-rate

**D10. Summarise or link the return/exchange policy on the PDP.**
- **Evidence:** 44% of sites didn't. 60% of users looked for return information on the product page (1,032 respondents). 15% of 1,026 US shoppers had abandoned an order in the last quarter over an unsatisfactory return policy. Another Baymard survey puts it at 13%.
- **Check:** **Gap.** `single.twig` has no returns/exchange line or link near the buy buttons or in the accordions (`single.twig:381-405` renders only the description). Suggested fix: a one-line merchant-set note (for example "استبدال واسترجاع خلال ٧ أيام") linking to the policy page, as a theme setting. Optional if unix.sa doesn't show it.
- **Source:** research (Baymard). https://baymard.com/blog/current-state-ecommerce-product-page-ux

**D11. Saving for later must be easy.**
- **Evidence:** 89% of sites made "save" features hard to use. 21% of 1,193 respondents relied on them. Some abandoned saving when forced to create an account.
- **Check:** The wishlist shows from 640px only (`single.twig:329`, D123). On mobile it is absent from the PDP. That is parity with unix.sa, so any change is optional.
- **Source:** research (Baymard). https://baymard.com/blog/current-state-ecommerce-product-page-ux

**D12. Descriptions: key facts first, no marketing padding, explain unfamiliar terms.**
- **Evidence:** NN/g: descriptions should be complete but concise. Put key information at the start and explain unfamiliar terms. Show the same kind of information for every variant and similar product.
- **Check:** Is fabric composition visible without opening three accordions? Do "Features" and "Care" exist? Salla has no metafields (D56), so `salla-metadata` custom fields are the route.
- **Source:** research (NN/g). https://www.nngroup.com/articles/ecommerce-product-pages/

**D13. Relevant cross-sells only.**
- **Evidence:** 50% of sites had no cross-sells or inconsistently related ones. NN/g: too many recommendations distract.
- **Check:** "أكملي الإطلالة" and "قد يعجبك أيضًا" (DS §8.27). Are they the same collection or complementary items, not random?
- **Source:** research (Baymard, NN/g). https://baymard.com/blog/mobile-ecommerce-search-and-navigation · https://www.nngroup.com/articles/ecommerce-product-pages/

**D14. Mobile sticky add-to-cart must not hide content or the real button.**
- **Evidence:** No primary study found for this exact pattern. It is common industry practice. UNVERIFIED as a conversion driver.
- **Check:** `unix-sticky-atc.js`. Does it hide while the real button is in view? Does it carry the selected size? Does it avoid covering the iOS Safari bottom bar and the cookie banner?
- **Source:** industry practice.

---

## 4. Size guide and fit (apparel)

Baymard's apparel research: **83% of desktop and 87% of mobile apparel sites failed to give sufficient size information** (they missed one or more of the 10 elements below). Its "5 best practices" article reports 82% failing.

**S1. The 10 size-information elements (check each one):**
1. Conventional sizes (XS–XL) or a conversion to them.
2. Numeric sizes where relevant (UK/EU numbers).
3. Measurements. Baymard says inches *and* cm. For KSA, **cm first** is the norm (industry practice). Inches are optional.
4. International conversions (UK/EU/US). UNIX uses UK women's sizing (XS=UK6 … XL=UK14, `unix-size-finder-model.js`).
5. How to measure, ideally with a human-model image showing where.
6. Charts specific to each product type (leggings, bras, tops). Avoid one generic chart. Irrelevant charts damage trust.
7. The size-guide link next to the size selector (see D5).
8. The browser Back button closes the size guide (it must not exit to the PLP). The overlay also needs a clear close.
9. A link to customer service or WhatsApp inside the size guide.
10. The model's measurements and the size she wears, next to the model image.
- **Check:** `unix-size-charts.twig` (DS §8.23) and `unix-size-finder.twig` (DS §8.11). For item 8, does the size dialog push a history state so the Android back gesture closes it? For item 9, is there a WhatsApp link inside the dialog? For item 10, there is no model-info field on the PDP: **gap**.
- **Source:** research (Baymard). https://baymard.com/blog/apparel-size-information

**S2. Plain fit notes help ("runs small, size up").**
- **Evidence:** Baymard cites a "runs half a size small" note as something users valued, best paired with the size guide.
- **Check:** Is there a merchant field for a per-product fit note ("قصّة ضيّقة، اختاري مقاسك المعتاد")? `salla-metadata` could hold it.
- **Source:** research (Baymard). https://baymard.com/blog/apparel-size-information

**S3. An interactive size finder helps.**
- **Evidence:** 36% of Baymard's test sites didn't have one (from the search snippet of Baymard's size-finder page).
- **Check:** The UNIX size finder exists (3.3). Its thresholds are "START" assumptions to be calibrated against keep/exchange data (`unix-size-finder-model.js` header). Flag that to the client.
- **Source:** research (Baymard). https://baymard.com/ecommerce-design-examples/size-finder

---

## 5. Cart drawer and cart page

**C1. Clear add-to-cart feedback that keeps the shopper in control.**
- **Evidence:** NN/g: give clear confirmation after add to cart, either a persistent notice or a confirmation with "continue shopping". Baymard treats the added-to-cart response as a high-importance guideline (#603, Premium only, so no detail).
- **Check:** `add-product-toast.js` (DS §8.49) and the cart drawer (DS §8.33). Does adding open the drawer *or* show a toast, not both? Can she continue shopping in one tap? Does focus move into the drawer and come back on close?
- **Source:** research (NN/g, Baymard). https://www.nngroup.com/articles/ecommerce-product-pages/ · https://baymard.com/ecommerce-design-examples/added-to-cart-confirmation

**C2. Show the total and the cost logic in the cart (subtotal, VAT status, shipping or threshold).**
- **Evidence:** 40% abandoned over extra costs. 12% abandoned because they couldn't calculate the total up front.
- **Check:** `unix-cart-drawer.twig:84-95` shows the subtotal and a tax line. The free-shipping bar is at line 47. Is the remaining amount shown in SAR ("باقي ٥٠ ر.س للشحن المجاني")?
- **Source:** research (Baymard). https://baymard.com/lists/cart-abandonment-rate

**C3. Quantity controls as buttons (or buttons plus a field).**
- **Evidence:** 95% of sites didn't use buttons, or buttons plus a text field, for cart quantity updates (main article figure; a related title says 61%).
- **Check:** Cart drawer item rows. Are +/− buttons at least 44px?
- **Source:** research (Baymard). https://baymard.com/blog/current-state-of-checkout-ux

**C4. Make sold-out or unavailable cart lines obvious.**
- **Evidence:** NN/g: show stock status before checkout.
- **Check:** `unix-cart-drawer.twig:30` (`data-i18n-sold-out`) and `cart.twig:137`. Does the line say why and offer removal?
- **Source:** research (NN/g). https://www.nngroup.com/articles/ecommerce-product-pages/

**C5. Installments and payment marks near the cart total (reassurance before checkout).**
- **Evidence:** Tabby's docs place its promo component on product *and cart* pages. Checkout.com (KSA, 2026): 36% say paying with their preferred method is a top priority, and 25% say being unable to could erode trust. Baymard: 9% abandoned because there weren't enough payment methods.
- **Check:** **Gap.** The cart drawer footer (`unix-cart-drawer.twig:84-95`) has no `salla-installment` and no payment marks. Check `cart.twig` the same way. Suggest it as **optional, as a setting toggle**.
- **Source:** platform guidance (Tabby), industry practice (Checkout.com), research (Baymard). https://docs.tabby.ai/pay-in-4-custom-integration/on-site-messaging · https://www.checkout.com/blog/mastering-payments-saudi-arabia · https://baymard.com/lists/cart-abandonment-rate

**C6. Gift options (gift message, hide price) are expected for gifting purchases.**
- **Evidence:** 78% of sites didn't show gifting options on the PDP. 68% didn't let users mark gifts in the cart.
- **Check:** Salla's gifting feature (if the store enables it). Does the theme render it? Gifting is relevant for Eid.
- **Source:** research (Baymard). https://baymard.com/blog/current-state-ecommerce-product-page-ux · https://baymard.com/blog/current-state-of-checkout-ux

---

## 6. Checkout handoff (Salla hosts checkout)

Salla owns the checkout, so the theme controls only the handoff and what the shopper already believes when she arrives.

**K1. Guest checkout and no forced account.**
- **Evidence:** 18% abandoned because the site required an account. 56% of sites didn't save account creation for the confirmation step.
- **Check:** Does the checkout button in `unix-cart-drawer.twig:90` go straight to checkout? Salla's checkout uses mobile and OTP login. Note: Checkout.com reports that 25% of KSA consumers often abandon when asked for a one-time password, so the OTP step is a known friction outside the theme's control. Flag it to the client and don't claim the theme can fix it.
- **Source:** research (Baymard), industry practice (Checkout.com). https://baymard.com/lists/cart-abandonment-rate · https://baymard.com/blog/current-state-of-checkout-ux · https://www.checkout.com/blog/mastering-payments-saudi-arabia

**K2. Keep the checkout short.**
- **Evidence:** 17% abandoned because checkout was too long or complicated. Most sites need only 8 form fields. The 2024 average was 11.3. Fixing solvable checkout issues could lift conversion by 35.26% for an average large site.
- **Check:** Out of theme scope (Salla). Don't add custom pre-checkout steps or popups between the cart and checkout.
- **Source:** research (Baymard). https://baymard.com/blog/checkout-flow-average-form-fields · https://baymard.com/lists/cart-abandonment-rate

**K3. Explain why a phone number is needed.**
- **Evidence:** 68% of survey respondents were reluctant to give a phone number at checkout. 47% of sites didn't explain why it was required.
- **Check:** The phone/OTP prompt is Salla's. If the theme shows any login modal copy (`salla-login-modal`), it should say why (order updates and delivery).
- **Source:** research (Baymard). https://baymard.com/blog/current-state-of-checkout-ux

**K4. Payment security perception.**
- **Evidence:** 19% of 1,026 US adults abandoned because they didn't trust the site with their card. Users judge security by gut feeling, brand recognition and how secure the page *looks*. Layout bugs can look like phishing. Having some visible seal or padlock mattered more than which one. KSA (Checkout.com 2026): 27% abandoned checkouts over security concerns.
- **Check:** No broken layout, mixed fonts or misaligned elements on the cart and PDP. Payment marks via `salla-payments` in the footer (`footer.twig:209-210`). Maroof or Saudi Business Center badges if the client has them.
- **Source:** research (Baymard), industry practice (Checkout.com). https://baymard.com/blog/perceived-security-of-payment-form · https://www.checkout.com/blog/mastering-payments-saudi-arabia

**K5. A declined card is a large risk; make retrying easy.**
- **Evidence:** KSA: 57% would go to a competitor or abandon if a payment was declined despite having funds. Baymard: 10% abandoned over a declined card.
- **Check:** Out of theme scope. Make sure the cart persists so she can come back and retry with another method.
- **Source:** industry practice (Checkout.com), research (Baymard). https://www.checkout.com/blog/mastering-payments-saudi-arabia · https://baymard.com/lists/cart-abandonment-rate

---

## 7. Search

**Q1. Autocomplete should exist and work well.**
- **Evidence:** 80% of sites offer autocomplete, but only 19% reach the highest performance level. 69% leave users at risk through poor misspelling support. Autocomplete changes how and what users search for (Baymard snippets).
- **Check:** Salla's `salla-search`. Does it suggest products as she types in Arabic? Test common spellings: "ليقنز" / "ليجنز" / "لقنز", "سبورت برا" / "صدرية رياضية", "طقم".
- **Source:** research (Baymard). https://baymard.com/ecommerce-search/articles

**Q2. Support synonyms and suggest categories.**
- **Evidence:** 70% of sites failed on product-type synonyms. 72% didn't suggest relevant categories in autocomplete.
- **Check:** Can the merchant add Arabic and English synonyms in Salla (tags or keywords)? Does "leggings" in Arabic mode find the products?
- **Source:** research (Baymard). https://baymard.com/blog/mobile-ecommerce-search-and-navigation

**Q3. "No results" must never be a dead end.**
- **Evidence:** 88% of sites had no-results pages without context-based help, which is "essentially a dead-end for the user".
- **Check:** The empty state (DS §8.47) on search. Does it offer popular categories, best sellers or WhatsApp help?
- **Source:** research (Baymard). https://baymard.com/blog/mobile-ecommerce-search-and-navigation

---

## 8. Trust, policies and KSA context

**T1. KSA e-commerce law: the store must show complete price information (including taxes and extra fees), the merchant's contact channels, payment and delivery procedures, and the return right.**
- **Evidence:** Salla's summary of the Saudi E-Commerce Law: full price including taxes and fees, contact channels in adverts, payment and delivery procedures, warranty information, and a 7-day return right from receipt (exceptions include custom-made items and items damaged by misuse; manufacturing defects stay returnable). Secondary sources: cancellation if delivery is more than 15 days late; fines up to SAR 1 million. Sources disagree on whether the 7 days run from receipt or from the contract date (UNVERIFIED; check the official text).
- **Check:** Footer (`footer.twig:10-13`): CR, VAT, phone and WhatsApp present. Policy pages exist and are linked in the footer. VAT status shown under the price (D124).
- **Source:** platform guidance (Salla Help), regulator summaries. https://help.salla.sa/en/article/e-commerce-law/di3p4uro9bna3ezsld2fjznr · https://saudipedia.com/en/e-commerce-law-in-saudi-arabia

**T2. Free delivery is the top purchase driver in KSA. Make the free-shipping threshold visible early.**
- **Evidence:** Statista/DataReportal: free delivery was the top driver of online purchases among Saudi internet users in Q2 2025 (from search snippet; UNVERIFIED on the primary page).
- **Check:** Announcement bar (DS §8.6) and free-shipping bar (DS §8.34). Is the threshold stated in SAR on the announcement bar and in the cart?
- **Source:** industry practice. https://www.statista.com/statistics/1392651/saudi-arabia-online-purchase-drivers/

**T3. Payment mix: wallets (Apple Pay), Mada and BNPL are expected; cash on delivery is declining.**
- **Evidence:** Checkout.com (2026): 65% of KSA adults use digital wallets monthly or more often. 36% say paying with their preferred method is a top priority. Shares of individual methods (for example Apple Pay 36%, Mada 22%, BNPL 5%) appeared only in search snippets: **UNVERIFIED**. COD decline figures (64–66%) are from secondary reports: **UNVERIFIED**.
- **Check:** Footer payment marks (`salla-payments`). PDP installments (`single.twig:261`, `salla-installment`). Do Mada and Apple Pay marks show? Apple Pay express on the PDP via Salla quick buy (D117)?
- **Source:** industry practice. https://www.checkout.com/blog/mastering-payments-saudi-arabia

**T4. BNPL messaging under the price, re-rendered when the price changes.**
- **Evidence:** Tabby's docs: the promo goes on the product and cart pages, ideally right below the price, and must re-initialise when variant or quantity changes the price. The with-price snippet works only in SAR, AED or KWD.
- **Check:** `salla-installment price="{{ product.price }}"` (`single.twig:261`). Does it update when a size with a different price is picked? Does it update on the EN site or in another currency?
- **Source:** platform guidance (Tabby). https://docs.tabby.ai/pay-in-4-custom-integration/on-site-messaging

**T5. WhatsApp is the expected support channel; place it where doubt happens (size guide, PDP, empty search), not only in the footer.**
- **Evidence:** A 2022 survey by the Saudi Center for Public Opinion Polling (1,220 adults, reported by Arab News) found WhatsApp is the most used app in KSA. Claims that "70%+ of Saudis prefer WhatsApp for service" are from vendor blogs without sources: **UNVERIFIED**. Baymard (S1 item 9) separately supports a service link inside the size guide.
- **Check:** WhatsApp is only in the footer (`footer.twig:52-55, 136-139`). Consider an optional WhatsApp link in the size dialog and PDP (setting toggle; avoid a floating bubble, see §11).
- **Source:** industry practice (Arab News survey), research (Baymard). https://www.arabnews.com/node/2054631 · https://baymard.com/blog/apparel-size-information

**T6. Returns and exchange clarity reduces risk for a first-time buyer.**
- **Evidence:** 13% abandoned over an unsatisfactory return policy (Baymard). 60% look for return info on the PDP. The 7-day statutory right (T1) is the minimum.
- **Check:** See D10. The policy page should state the window, who pays return shipping, whether exchange or refund applies, and how (WhatsApp, form).
- **Source:** research (Baymard). https://baymard.com/lists/cart-abandonment-rate

**T7. Arabic-first: build in Arabic from the ground up, don't translate English layouts.**
- **Evidence:** No credible measured study was found. Sources assert it as expert opinion (Zoho). **UNVERIFIED** as a statistic; treat it as industry practice.
- **Check:** Arabic is the default locale. Feminine voice (CLAUDE.md). Directional icons flip. Prices read naturally in RTL ("١٢٠ ر.س" or "120 ر.س", consistently). No English-only labels in the AR UI.
- **Source:** industry practice. https://www.zoho.com/en-mea/techbizz/ways-to-build-customer-trust-in-saudi-retail.html

**T8. Cart abandonment is structurally high in the region, so every trust signal counts.**
- **Evidence:** Baymard global average: 70.22% (50 studies, 2006–2025). Checkout.com cites Statista for an MEA rate of 93% (UNVERIFIED primary).
- **Check:** Use this as context only. Don't promise the client a specific uplift.
- **Source:** research (Baymard), industry practice. https://baymard.com/lists/cart-abandonment-rate · https://www.checkout.com/blog/mastering-payments-saudi-arabia

---

## 9. Mobile

**M1. Speed is conversion.**
- **Evidence:** Think with Google (2017; over 900,000 mobile sites, emulated 3G): 53% of visits are abandoned if a mobile site takes longer than 3 seconds to load. The data is old, so cite the date.
- **Check:** `docs/PERFORMANCE.md` budgets (LCP < 2.5s, CLS < 0.05, JS < 150KB gz). Hero video and image weight on 4G.
- **Source:** platform guidance (Google). https://thinkwithgoogle.com/intl/en-gb/marketing-strategies/app-and-mobile/mobile-page-speed-new-industry-benchmarks

**M2. Galleries: support swipe, pinch-zoom and double-tap; prefer thumbnails over dots.**
- **Evidence:** Mobile testers nearly always swipe and use dots only when swiping fails. 40% of mobile sites (2016) failed to support pinch and tap gestures, often because page zoom was disabled in the viewport. Load higher-resolution images on zoom. Only 24% of mobile sites used thumbnails. Baymard still recommends thumbnails, because dots cause problems (search snippets).
- **Check:** `unix-gallery.twig` / `.js` (DS §8.20). Does the viewport meta allow zoom (no `user-scalable=no`)? Does the zoom view load a larger image? Is the image count shown ("٢ / ٦")? Does a swipe past the last image do something sensible?
- **Source:** research (Baymard). https://baymard.com/blog/mobile-image-gestures · https://baymard.com/blog/always-use-thumbnails-additional-images

**M3. Touch targets of at least 44px; nothing important hidden behind the iOS bottom bar.**
- **Evidence:** NN/g: controls placed below a carousel can be hidden by a mobile tab bar. Make buttons large and high-contrast. (44px is the project rule, DS §4.)
- **Check:** Size buttons, swatches (`--swatch-size`), quantity +/−, drawer close, sticky ATC with `env(safe-area-inset-bottom)`.
- **Source:** research (NN/g). https://www.nngroup.com/articles/designing-effective-carousels/

**M4. No auto-rotating content on mobile.**
- **Evidence:** NN/g: auto-forwarding on mobile slows the page, and users who scroll quickly miss it. Baymard: 30% of mobile sites used auto-rotating home carousels.
- **Check:** See H5.
- **Source:** research (NN/g, Baymard). https://www.nngroup.com/articles/designing-effective-carousels/ · https://baymard.com/blog/mobile-ecommerce-search-and-navigation

**M5. Social traffic lands on the PDP or a collection, not the home page.**
- **Evidence:** No study found. Industry practice: the persona (Noura) often arrives from Instagram or TikTok ads, which open in in-app browsers.
- **Check:** Does the PDP work as a landing page (brand header visible, trust line, delivery date, installments above the fold or one swipe away)? Test in the Instagram in-app browser: does Apple Pay appear there? (It may not, which is an UNVERIFIED platform limitation.)
- **Source:** industry practice.

---

## 10. Apparel-specific

| # | Rule | Evidence | Check on our theme | Source |
|---|------|----------|--------------------|--------|
| A1 | **Fit info**: complete size chart in cm, how-to-measure, product-type-specific chart, fit note | 83% desktop / 87% mobile apparel sites insufficient | `unix-size-charts.twig`, `unix-size-finder.twig`. Per-product-type chart? Fit note field? | research (Baymard) https://baymard.com/blog/apparel-size-information |
| A2 | **Model size**: state the model's height, measurements and size worn ("العارضة طولها ١٧٠ سم وتلبس مقاس S") | Baymard lists it as one of 10 size elements. No test data quantifies it. | **Gap**: no field. Suggest a merchant field (metadata or a per-product setting) shown under the gallery or above the size buttons | research (Baymard) https://baymard.com/blog/apparel-size-information · https://baymard.com/blog/human-model |
| A3 | **Fabric**: composition, weight or feel, opacity ("غير شفّاف" / squat-proof), stretch, care | NN/g: explain unfamiliar terms and answer specific questions. The persona fears see-through fabric. No numeric study on opacity. | Fabric is inside the description accordion only. Is composition visible quickly? The swatch fabric photo exists (D133 fifth field) | research (NN/g) https://www.nngroup.com/articles/ecommerce-product-pages/ |
| A4 | **Colour swatches**: visual swatches (not text) on the PDP and ideally the PLP. Thumbnails match the chosen colour. | 57% of sites didn't show all colour variations in the list. 54% didn't update thumbnails to the searched colour (2016 title). | PDP: `unix-colour-links.twig` (circle swatches, D133). PLP: none (P2) | research (Baymard) https://baymard.com/blog/mobile-interactive-color-swatches |
| A5 | **Sold-out sizes**: keep them visible and marked, not removed. Ideally clickable to subscribe. | Drop-downs hid availability and caused disappointment (Baymard). Vendor docs: the notify button only works if sold-out variants stay selectable. | `options.twig:35-38` strike plus a hidden label. `notify_options_availability` keeps them enabled | research (Baymard) https://baymard.com/blog/apparel-5-best-practices · industry practice https://help.stoqapp.com/en/article/help-notify-me-button-appears-on-all-variants-or-visible-on-in-stock-products-o964bf |
| A6 | **Back in stock**: offer "notify me" per sold-out size, with channels the shopper uses (SMS, email; WhatsApp if Salla supports it) | No Baymard public data found. **UNVERIFIED** as a conversion lever; standard practice. | `single.twig:322-326` passes `product.notify_availability` channels and subscribed options to Salla's component. Test: pick a sold-out size, then is the notify CTA obvious? | industry practice / platform (Salla) |
| A7 | **Human-model imagery**, at least one unstyled, real models not mannequins | 21% of apparel sites lack model images. Mannequins judged "cheap". | Merchant content plus gallery order | research (Baymard) https://baymard.com/blog/human-model |
| A8 | **Fit subscore in reviews** | 24% of apparel sites lack one | Gap. Salla limitation, needs a client decision | research (Baymard) https://baymard.com/blog/apparel-5-best-practices |
| A9 | **Reviewer photos** browsable across reviews | 90% of apparel sites fail | `salla-comments` capability, Salla-owned | research (Baymard) https://baymard.com/blog/apparel-5-best-practices |
| A10 | **Size help inside the guide**: WhatsApp or service link | 1 of the 10 Baymard size elements | Gap (T5) | research (Baymard) https://baymard.com/blog/apparel-size-information |

---

## 11. Things that hurt quiet-luxury brands

Quiet luxury means restraint, space, fine type and few accents (DS §0). The research shows where restraint turns into lost sales.

**L1. Aesthetics buy forgiveness for small problems, not big ones.**
- **Evidence:** NN/g, aesthetic-usability effect: users see attractive interfaces as easier to use and forgive *minor* issues, but not major ones. Beauty can also mask problems in testing, because people praise the visuals after struggling.
- **Check:** In walkthroughs, judge what the shopper *does* (finds her size, sees the total), not whether the page "looks premium".
- **Source:** research (NN/g). https://www.nngroup.com/articles/aesthetic-usability-effect/

**L2. Hidden navigation and icon-only controls.** Minimal headers often hide everything behind a hamburger.
- **Evidence:** NN/g: hidden navigation cut discoverability by more than 20%. NN/g: use words like "Filter", not cryptic icons.
- **Check:** Header icons have accessible names. Filters, sort and size guide use text labels.
- **Source:** research (NN/g). https://www.nngroup.com/articles/hamburger-menus/ · https://www.nngroup.com/articles/mobile-faceted-search/

**L3. Low-contrast "elegant" text** (light grey on cream, hairline fonts, tiny caps) for prices, VAT lines, sold-out marks and size-guide links.
- **Evidence:** Baymard: some sites make the size-guide link "too subdued". 43% of sites failed to make clickable elements clear.
- **Check:** DS §1.3 contrast table. AA for every text that carries information (price, tax line, sold-out strike, delivery date).
- **Source:** research (Baymard). https://baymard.com/blog/apparel-size-information · https://baymard.com/blog/ecommerce-homepage-ux

**L4. Withholding price or cost information "to stay clean".** Hiding the shipping cost, the threshold or installments until checkout.
- **Evidence:** 40% abandon over extra costs, and 12% because the total couldn't be calculated up front.
- **Check:** D8, C2, T2.
- **Source:** research (Baymard). https://baymard.com/lists/cart-abandonment-rate

**L5. Cut-out-only or heavily styled imagery.** Editorial shots that hide fit and length.
- **Evidence:** See D2. Users need an unstyled on-body view.
- **Source:** research (Baymard). https://baymard.com/blog/human-model

**L6. Ad-like clutter: popups, countdowns, floating chat bubbles, stacked badges, multiple promo strips.** These break the luxury signal *and* are ignored as ads.
- **Evidence:** 59% of sites had overly aggressive ad-like content. NN/g: users ignore ad-like animation. (Floating-bubble harm is industry practice, UNVERIFIED.)
- **Check:** One accent per view (DS rule). One promo surface per screen. WhatsApp as an inline link rather than a floating bubble.
- **Source:** research (Baymard, NN/g). https://baymard.com/blog/ecommerce-homepage-ux · https://www.nngroup.com/articles/designing-effective-carousels/

**L7. Fake urgency and fake scarcity.** "Only 2 left!" on everything, perpetual countdowns.
- **Evidence:** No Baymard or NN/g figure was retrieved here. KSA law requires accurate product information (T1). Fake claims are a legal and trust risk. **UNVERIFIED** as a conversion effect.
- **Check:** Any scarcity copy must come from real stock data (Salla), never hard-coded.
- **Source:** platform guidance (Salla Help, e-commerce law summary). https://help.salla.sa/en/article/e-commerce-law/di3p4uro9bna3ezsld2fjznr

**L8. Slow "cinematic" pages.** Large hero videos, heavy fonts, animation libraries.
- **Evidence:** 53% of mobile visits abandoned over 3 seconds (Google, 2017).
- **Check:** M1 and the perf budgets. The hero video poster is the LCP, with `fetchpriority="high"`.
- **Source:** platform guidance (Google). https://thinkwithgoogle.com/intl/en-gb/marketing-strategies/app-and-mobile/mobile-page-speed-new-industry-benchmarks

**L9. Mannequins, AI or virtual models to keep a "clean" look.**
- **Evidence:** Testers judged them cheap or low quality.
- **Source:** research (Baymard). https://baymard.com/blog/human-model

**L10. Visual glitches.** Misaligned RTL elements, a mixed Latin/Arabic font fallback, broken icons.
- **Evidence:** Baymard: layout bugs make users suspect hacking or phishing, and some abandon even at major brands.
- **Check:** RTL review (DS §7), font fallback, `icon-dir` flips, no FOUT on the price.
- **Source:** research (Baymard). https://baymard.com/blog/perceived-security-of-payment-form

**L11. Luxury cues that help (context, not rules).** An academic review of 81 luxury homepages found that luxury sites tend to use darker backgrounds, large or full-screen stage content and a horizontal navigation bar. A survey of 201 participants found aesthetic formality and appeal build a sense of luxury, moderated by brand familiarity. These are lab and survey results with no conversion data.
- **Source:** research (academic). https://www.emerald.com/insight/content/doi/10.1108/IJRDM-01-2013-0013/full/html · https://ro.uow.edu.au/dubaipapers/866

---

## 12. Gaps this research suggests in the current theme (for triage, not yet decided)

These are observations from a quick code read on 2026-11-09. Each needs a parity check against `reference/shopify-theme/` before it becomes a task. Anything unix.sa lacks is **optional, as a setting toggle**, with a D-number.

| Gap | Where | Rules |
|-----|-------|-------|
| No return/exchange summary or link near the buy box | `src/views/pages/product/single.twig:348-405` (only delivery estimate and description) | D10, T6 |
| No model height or size worn | PDP, no field | A2, S1 item 10 |
| No WhatsApp or service link inside the size guide or PDP | WhatsApp only in `src/views/components/footer/footer.twig:52-55,136-139` | S1 item 9, T5 |
| No installments or payment marks in the cart drawer | `src/views/components/cart/unix-cart-drawer.twig:84-95` | C5, T3 |
| No colour swatches on product cards (each colour is a separate product) | `src/assets/js/partials/product-card.js` | P2, A4 |
| No fit subscore in reviews (Salla limitation) | `salla-comments` (`single.twig:498`) | D7, A8 |
| Mobile PDP has no save/wishlist (D123, parity) | `single.twig:329` | D11 |
| Free-shipping threshold not on PDP (only cart bar and announcement) | `single.twig:234-236` | D8, T2 |
| Fabric, care and opacity only inside the description accordion | `single.twig:381-405` (D56) | A3, D12 |
| Size-finder thresholds are unvalidated "START" values | `src/assets/js/partials/unix-size-finder-model.js` header | S3 |
| To verify on device: size-dialog Back behaviour, gallery pinch-zoom, delivery-date holiday logic, Arabic search misspellings | various | S1 item 8, M2, D9, Q1 |

---

## Source list

- Baymard: cart abandonment statistics. https://baymard.com/lists/cart-abandonment-rate
- Baymard: checkout form fields. https://baymard.com/blog/checkout-flow-average-form-fields
- Baymard: current state of checkout UX. https://baymard.com/blog/current-state-of-checkout-ux
- Baymard: current state of product page UX. https://baymard.com/blog/current-state-ecommerce-product-page-ux
- Baymard: apparel, 5 best practices. https://baymard.com/blog/apparel-5-best-practices
- Baymard: apparel size information. https://baymard.com/blog/apparel-size-information
- Baymard: human model images. https://baymard.com/blog/human-model
- Baymard: homepage UX. https://baymard.com/blog/ecommerce-homepage-ux
- Baymard: mobile search and navigation (2015). https://baymard.com/blog/mobile-ecommerce-search-and-navigation
- Baymard: delivery date vs shipping speed. https://baymard.com/blog/shipping-speed-vs-delivery-date
- Baymard: perceived security and trust seals. https://baymard.com/blog/perceived-security-of-payment-form
- Baymard: mobile interactive colour swatches. https://baymard.com/blog/mobile-interactive-color-swatches
- Baymard: mobile image gestures. https://baymard.com/blog/mobile-image-gestures
- Baymard: thumbnails for additional images. https://baymard.com/blog/always-use-thumbnails-additional-images
- Baymard: product lists research hub. https://baymard.com/research/ecommerce-product-lists
- Baymard: essential sort types. https://baymard.com/blog/essential-sort-types
- Baymard: search articles. https://baymard.com/ecommerce-search/articles
- NN/g: UX guidelines for e-commerce product pages (2019). https://www.nngroup.com/articles/ecommerce-product-pages/
- NN/g: carousel usability. https://www.nngroup.com/articles/designing-effective-carousels/
- NN/g: hamburger menus and hidden navigation (2016). https://www.nngroup.com/articles/hamburger-menus/
- NN/g: mobile faceted search with a tray (2015). https://www.nngroup.com/articles/mobile-faceted-search/
- NN/g: aesthetic-usability effect. https://www.nngroup.com/articles/aesthetic-usability-effect/
- Think with Google: mobile page speed benchmarks (2017). https://thinkwithgoogle.com/intl/en-gb/marketing-strategies/app-and-mobile/mobile-page-speed-new-industry-benchmarks
- Tabby: on-site messaging docs. https://docs.tabby.ai/pay-in-4-custom-integration/on-site-messaging
- Salla Help: Saudi e-commerce law. https://help.salla.sa/en/article/e-commerce-law/di3p4uro9bna3ezsld2fjznr
- Saudipedia: e-commerce law. https://saudipedia.com/en/e-commerce-law-in-saudi-arabia
- Checkout.com: payments in Saudi Arabia (June 2026). https://www.checkout.com/blog/mastering-payments-saudi-arabia
- Arab News: WhatsApp most popular app among Saudis (2022). https://www.arabnews.com/node/2054631
- Statista: Saudi online purchase drivers. https://www.statista.com/statistics/1392651/saudi-arabia-online-purchase-drivers/
- Kluge et al. (2013), luxury web atmospherics. https://www.emerald.com/insight/content/doi/10.1108/IJRDM-01-2013-0013/full/html
- Shen, Vel & Khalifa (2016), website design for luxury brands. https://ro.uow.edu.au/dubaipapers/866

## Gaps in the research itself

- No public Baymard data on cart drawers versus cart pages, sticky add-to-cart, or back-in-stock flows (paywalled or not studied).
- No credible Saudi-specific numbers found on return expectations, delivery-speed expectations for fashion, WhatsApp support preference, or Arabic-language preference.
- Payment-method shares for KSA came only from search snippets. Re-verify with the Checkout.com "MENA Digital Commerce 2026" report before quoting.
- Most Baymard studies are US/EU samples. Apply them to KSA with judgement and validate with the store's own analytics once live.
