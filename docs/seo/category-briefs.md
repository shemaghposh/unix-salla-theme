# Category tree and page briefs for the Salla store, 2026-11-10

Owner: `unix-seo-specialist`. Status: **draft for client approval** (PLAN Phase 1, «التصنيفات»).

Inputs I read: `docs/seo/PLAYBOOK.md`, `docs/seo/keywords-ksa-2026-11.md` (every volume below comes from that file: Keyword Planner, KSA, Arabic, pulled 2026-11-09/10), `docs/migration/PLAN.md`, `docs/migration/README.md` with `product-seo.csv`, `product-content.csv` and `shopify-urls.csv`, `docs/demo-data/CLAUDE-DESKTOP-STORE-SETUP-PROMPT.md` (the current 11-category tree), `docs/SPEC.md` §4.18 and §6, and the reference home FAQ (`reference/shopify-theme/templates/index.json`).

I didn't touch `redirect-map-draft.csv` or `product-seo-draft.csv`, which another agent owns.

---

## 1. Answer

- **The tree grows from 11 to 13 categories.** I added two: **سبورت برا** (split out of «توبات رياضية») and **هوديز**. I renamed five existing categories after their head keywords. I did **not** add a separate «تيشيرتات» category: the renamed sports-tops category owns «تيشيرت رياضي» instead (see decision 4).
- **«ليقنز نسائي» is the strongest page.** It owns «ليقنز» (5,400) and «ليقنز نسائي» (1,600). **«بيجامات وملابس نوم»** owns a cluster of more than 5,000 a month across all its spellings.
- **The theme prints the category name as the only `h1` and the category description as server-rendered HTML above the grid.** There is no slot below the grid, and Salla's docs don't confirm that `category.description` exists (D77). Both points need action before these briefs can go live as written (§6).

---

## 2. Proposed category tree

**Salla controls the URL** (PLAYBOOK §9.1 [SALLA-SEO]). Each category has an SEO title, a description and a «رابط مخصص» (custom link). When the custom link is empty, Salla builds the slug from the category name. On Arabic stores that slug is usually **Arabic text**, which is percent-encoded when shared (`%D9%84%D9%8A...`). The full pattern (`/ar/<slug>/c<id>`?) is still **UNVERIFIED** (PLAYBOOK §0 row 6, §9.1).

**Slug recommendation** (industry practice; Google allows localised words in UTF-8 [G-URL] [G-MULTI]; this is a small ranking factor):
1. If Salla lets you set **one slug per language**, use the short Arabic slug below on `/ar/` and the Latin slug on `/en/`.
2. If it allows **only one slug for both languages**, use the **Latin slug**. It reads cleanly in both, isn't encoded when shared, and stays close to the old Shopify handles.
3. Use 1–3 words, no stop words, and never a year or a season. Whatever you choose, set it **before** the 301 map is built. Every renamed slug after launch costs one more redirect (PLAYBOOK R1.3, R1.12).

| # | Arabic name (= H1) | English name (= EN H1) | Short AR slug | EN slug | Parent | Status | Old Shopify collection | Active products |
|---|---|---|---|---|---|---|---|---|
| 1 | وصل حديثًا | New In | `وصل-حديثا` | `new-in` | — | Kept | `/collections/new-collection` | rolling |
| 2 | **ملابس رياضية نسائية** | Women's Activewear | `ملابس-رياضية` | `activewear` | — | **Renamed** from «ملابس رياضية» | `/collections/sport` (+ `activewear-collection` → 301 here) | all sport (≈ 34) |
| 3 | **ليقنز نسائي** | Women's Leggings | `ليقنز` | `leggings` | 2 | **Renamed** from «ليقينز رياضية» | `/collections/legging` | 7 |
| 4 | **سبورت برا** | Sports Bras | `سبورت-برا` | `sports-bras` | 2 | **New** (split from «توبات رياضية») | — (bra tops were in `/collections/tops`) | 6 |
| 5 | **تيشيرتات وتوبات رياضية** | Sports Tops & T-Shirts | `توبات-رياضية` | `sports-tops` | 2 | **Renamed** from «توبات رياضية» (bra tops move to 4) | `/collections/tops` | 9 |
| 6 | أطقم رياضية | Sports Sets | `اطقم-رياضية` | `sports-sets` | 2 | Kept (name); new title and copy | `/collections/set` | 6 (+4 hoodie sets cross-listed) |
| 7 | **هوديز نسائية** | Women's Hoodies | `هودي-نسائي` | `hoodies` | 2 | **New** | — | 4 hoodies + 4 hoodie sets |
| 8 | **بيجامات وملابس نوم** | Pyjamas & Sleepwear | `بيجامات` | `pyjamas` | — | **Renamed** from «بيجامات كومفي» | `/collections/home-wear` | 30 |
| 9 | **قمصان وبلايز كومفي** | Comfy Tops & Shirts | `قمصان-كومفي` | `comfy-tops` | 8 | **Renamed** from «توبات كومفي» | `/collections/comfy-top` | 12 |
| 10 | **بناطيل وشورتات كومفي** | Comfy Pants & Shorts | `بناطيل-كومفي` | `comfy-pants` | 8 | **Renamed** from «بناطيل كومفي» | `/collections/comfy-bottom` | 9 |
| 11 | أطقم كومفي | Lounge Sets | `اطقم-كومفي` | `lounge-sets` | 8 | Kept (AR); **EN renamed** from «Comfy Sets» | `/collections/comfy-set` | 9 |
| 12 | إكسسوارات | Accessories | `اكسسوارات` | `accessories` | — | Kept | `/collections/accessories` | 11 |
| 13 | الأكثر مبيعًا | Best Sellers | `الاكثر-مبيعا` | `best-sellers` | — | Kept | `/collections/best-sellers` | rolling |

`/collections/all-products` («كل المنتجات») has no Salla category. The redirect agent decides its target.

**Menu note.** «ليقنز نسائي» and «هوديز نسائية» sit under «ملابس رياضية نسائية» in the tree. They should also appear as **top-level links in the header menu and in the footer**, because Google weighs the number of internal links and the click depth, not the URL path [G-ECOM-STRUCT].

### 2.1 Which products go where (from `product-seo.csv`, ACTIVE only)

Salla lets a product sit in more than one category. Cross-listing is fine. What must not be shared is a **keyword**: §3 gives each keyword one owner.

| Category | Products (families × colours) |
|---|---|
| ليقنز نسائي (7) | Sculpting (vanilla, chocolate) · Core Control (black, midnight blue) · Curve Enhance with pockets (whip pink, toffee, black) |
| سبورت برا (6) | Sculpting bra top (vanilla, chocolate) · Core Control bra top (black, midnight blue) · Curve Enhance bra top (whip pink, toffee) |
| تيشيرتات وتوبات رياضية (9) | Halo Back (cream, smokey, stray night blue) · Twist (row coal, silver) · Soft Angle (vanilla, chocolate) · Femme Scoop long sleeves (black, cream white) |
| أطقم رياضية (6 + 4) | Sculpting set ×2 · Core Control set ×2 · Curve Enhance set ×2; cross-listed: Waist Tone set ×2, Sailor set ×2 |
| هوديز نسائية (4 + 4) | Waist Tone hoodie (grey, off-white) · Sailor hoodie (cloudy grey, black); cross-listed: Waist Tone set ×2, Sailor set ×2 |
| ملابس رياضية نسائية | Everything above, plus Waist Tone wide pants ×2 and Sailor wide pants ×2 (these four have no subcategory, see §3) |
| قمصان وبلايز كومفي (12) | Comfy lounge shirt ×2 · Comfy Boyfriend shirt ×2 · Soft shirt · Pearla shirt · Bamboo t-shirt ×3 · Bamboo tank top ×3 |
| بناطيل وشورتات كومفي (9) | Comfy pants ×2 · Comfy shorts · Soft shorts · Pearla pants · Pearla shorts · Bamboo pants ×3 |
| أطقم كومفي (9) | Soft pyjama set · Comfy pants set ×2 · Comfy shorts set · Pearla set (pants) · Pearla set (shorts) · Bamboo 3-piece set ×3 |
| بيجامات وملابس نوم (30) | Everything in 9 + 10 + 11 |
| إكسسوارات (11) | Water bottle 470/700 ml · Timeless gym bag · Soft Touch towel ×2 + towel set · Amalfi and Sheer candles · Grip & Go hair clip · gift card (· bag charm, unlisted) |

**Categories I considered and rejected** (too few products: PLAYBOOK §5.4, thin pages [G-SPAM]):
- **بناطيل رياضية** (260 + «بناطيل رياضية نسائيه» 90). There are only 4 products (Waist Tone and Sailor wide pants). The parent «ملابس رياضية نسائية» owns the term for now. Create the category once there are 6 or more products.
- **ليقنز أسود** (320). Only 2 black leggings. The leggings page owns the term (PLAYBOOK §8.3 exception, not met yet).
- **شورت رياضي نسائي** (170). UNIX has no sports shorts; the Comfy and Soft shorts are loungewear.
- **جاكيت رياضي نسائي** (140). Wait until Air Flexy (DRAFT) is published.

---

## 3. Keyword ownership (one owner per keyword)

Rule: one topic, one page; spelling variants are not separate pages (PLAYBOOK §5.4, §10.1 [G-AIOPT]). The home page owns the brand terms (unix 880, يونكس 480). Product pages own product name + colour.

| Owner page | Primary keyword (vol.) | Variants and spellings it also owns (vol.) | Not ours / do not target |
|---|---|---|---|
| ليقنز نسائي | **ليقنز** 5,400 + **ليقنز نسائي** 1,600 | ليقينز 210 · ليقنز رياضي 140 · ليقنز نسائي رياضي 110 · ليقنز رياضي نسائي 70 · ليقنز اسود 320 · بنطلون ليقنز 260 · سروال ليقنز 140 · ليقنز نسائي قطن 110 (answered in the FAQ: not cotton) · ليقنز هاي ويست 20 · ليقنز بيج/ابيض 50/90 · leggings | ليقنز حوامل 110 · ليقنز قصير/شورت 70/90 (no product) · ليقنز بنات 110 (ambiguous intent) · ماهو الليقنز 70 → blog post |
| ملابس رياضية نسائية | **ملابس رياضية نسائية** 1,900 | ملابس رياضيه نسائيه 140 · ملابس نسائيه رياضيه 110 · ملابس نسائية رياضة 110 · لبس رياضي نسائي 260 · ملابس رياضية نسائية ماركة 90 · محل ملابس رياضيه نسائيه 50 · ملابس رياضية للجيم نسائية 40 · **بناطيل رياضية** 260 · بناطيل رياضية نسائيه 90 | «…سنتربوينت» 110 (competitor brand) |
| تيشيرتات وتوبات رياضية | **تيشيرت رياضي** 590 | تي شيرت رياضي نسائي 140 · تيشيرت رياضي نسائي 140 · توب رياضي 70 | — |
| سبورت برا | **سبورت برا** 170 | برا سبورت 140 · برا سبورت مبطن 10 · سبورت برا دعم عالي 10 · برا سبورت قطن 10 | — |
| أطقم رياضية | **طقم رياضي نسائي** 320 | اطقم رياضية نسائية 110 · بدلة رياضية نسائية 90 · بدله رياضية نسائي 90 · ترنج رياضي نسائي 70 | — |
| هوديز نسائية | **هودي نسائي** 1,000 | طقم هودي نسائي 40 · hoodie | هودي نسائي طويل 50 (no long hoodie) · هودي اديداس نسائي 40 |
| بيجامات وملابس نوم | **بيجامات نسائية** 720 / نسائيه 720 · **ملابس نوم نسائي** 1,300 | بجامه نسائيه 1,600 · بجايم نسائيه 880 · ملابس نوم نسائية 390 · بيجامة نسائية 260 · بيجامات نوم نسائية 140 · بيجامات نسائية قطن / بيجامة قطن نسائي 260/260 · بيجامات قطنية نسائية 70 · طقم بيجاما نسائي 50 · بيجامات نسائية فخمة 110 (audit) · winter variants (§5) | بجامه كاروهات 480 (no plaid) · بيجامات بناتية 320 (younger audience) · ستان/ساتان/حرير 70 each, مخمل 50 (no such fabric, [يحتاج تأكيد] for Soft's finish) · ماركات عالمية 70 |
| قمصان وبلايز كومفي | **بلايز نسائية** 720 | قمصان نسائية 320 | (intent risk: many searchers want going-out blouses) |
| بناطيل وشورتات كومفي | — (no data) | بنطلون بيت / شورت بيت: **not pulled** | — |
| أطقم كومفي | **لاونج وير** 70 | lounge set / lounge sets 170 (audit, EN) | طقم بيجاما → parent page |

**Cannibalisation checks:**
- The parent «ملابس رياضية نسائية» mentions «ليقنز» **once**, as a link to the leggings page, and never in its title or H2s.
- The pyjama parent owns every بيجامة/بجامة/ملابس نوم term. «أطقم كومفي» uses «لاونج وير / طقم لاونج» and never «بيجامة» in its title.
- The sports-bra page doesn't use «توب رياضي» in its title. That term belongs to the tops page, even though the products are named «توب سبورت برا».
- Colour variants: no colour category. Colour lives in product titles (already in `product-seo.csv`) and in one H2 on the leggings page.

---

## 4. Briefs

Shared rules for every brief:
- **H1 = the Salla category name.** The theme prints `category.name` as the only `h1` (§6). So the name in the table above is the H1, and it is also the menu label.
- **Title and meta** go in Salla's category SEO fields (PLAYBOOK §9.1). The title pattern is `<keyword> | تسوّقي من UNIX` (PLAYBOOK §3.3). Every title is ≤ 51 Arabic characters and every meta ≤ 145, measured. Google sets no character limit [G-TITLE] [G-SNIPPET-META]; 60/155 is industry practice.
- **No free-shipping number** in titles or metas until the client confirms 500 or 600 SAR (PLAYBOOK §3.3; SPEC §4.18 says 600, the announcement bar says 500).
- **Intro** (2–3 sentences) goes above the grid. **The guide below the grid** is about 150–250 words, answer-first: each H2 opens with a one-sentence answer. Google has no preferred word count [G-HELPFUL], so write until the question is answered and stop.
- **FAQ:** visible text. FAQPage JSON-LD is optional and gives no rich result (PLAYBOOK §2.9 [G-UPD]). Answers use only facts from `product-content.csv`, `product-seo.csv` and the unix.sa FAQ. «[يحتاج تأكيد]» marks what I couldn't confirm.
- **Shared facts used:**
  - delivery in KSA 1–4 working days, to the GCC and worldwide, with a tracking link by email and SMS
  - returns and exchanges within 24 hours of receipt, unused with tags, sale items final, via info@unix.sa
  - the «اعرفي مقاسك» tool on every product page, plus a size chart in cm
  - payment by mada, Visa, Mastercard, Tabby and Tamara on unix.sa ([يحتاج تأكيد] on Salla)

---

### 4.1 ليقنز نسائي (Women's Leggings), the top page

**عربي**

- **الكلمة الأساسية:** ليقنز (5,400) + ليقنز نسائي (1,600).
- **التهجئات والكلمات القريبة:** ليقينز، ليقنز رياضي، ليقنز نسائي رياضي، بنطلون ليقنز، سروال ليقنز، ليقنز أسود، leggings. اكتبي «ليقنز» في العنوان والـ H1، والباقي مرة واحدة بشكل طبيعي في النص (PLAYBOOK §3.3، §10.2).
- **عنوان SEO:** ليقنز نسائي بخصر عالٍ يحتضن القوام | تسوّقي من UNIX
- **الوصف:** ليقنز نسائي بخصر عالٍ من نايلون وسباندكس مرن: Sculpting للنحت، وCore Control بخصر كورسيه، وCurve Enhance بجيوب. اختاري قصّتكِ وتسوّقي الآن.
- **H1:** ليقنز نسائي
- **المقدمة (فوق المنتجات):** ليقنز UNIX بخصر عالٍ وقماش مرن من النايلون والسباندكس، يحتضن القوام ويتحرك معكِ من التمرين إلى باقي يومكِ. ثلاث قصّات لثلاث رغبات: Sculpting بقماش مزدوج ينحت، وCore Control بخصر كورسيه، وCurve Enhance بجيوب جانبية.
- **H2 تحت المنتجات (جواب أولًا):**
  1. **أي ليقنز يناسبكِ؟** للنحت والتماسك اختاري Sculpting، ولشدّ الوسط اختاري Core Control، وللجيوب والخياطة الخلفية على شكل قلب اختاري Curve Enhance.
  2. **خامة ليقنز رياضي تتنفس وتتمدد:** مزيج نايلون وسباندكس، مرونة 85–95% في الطول و125–140% في العرض. (هنا تُذكر «ليقينز» و«بنطلون ليقنز» مرة واحدة.)
  3. **ليقنز أسود وألوان هادئة:** الأسود في Core Control وCurve Enhance، ومعه فانيلا وتشوكلت وتوفي ووردي كريمي وأزرق ليلي.
  4. **نسّقيه مع سبورت برا من نفس الموديل:** رابط لصفحة سبورت برا وصفحة أطقم رياضية.
  5. **العناية بالليقنز:** ماء بارد، تجفيف بالهواء، بدون مبيّض أو نشّافة أو غسيل جاف.
- **الأسئلة الشائعة:**
  1. **هل ليقنز UNIX قطن؟** لا. كل الليقنز من مزيج نايلون وسباندكس مرن، عشان يثبت على الجسم ويتمدد مع الحركة.
  2. **أي ليقنز فيه جيوب؟** ليقنز Curve Enhance، بجيوب جانبية ما تضيف حجمًا.
  3. **هل الليقنز يشفّ مع الانحناء؟** [يحتاج تأكيد: اختبار السكوات لكل موديل]. قماش Sculpting مزدوج ومتماسك.
  4. **كيف أعرف مقاسي؟** في صفحة كل ليقنز أداة «اعرفي مقاسكِ»: أسئلة سريعة تقترح لكِ المقاس، ومعها جدول المقاسات بالسنتيمتر. المقاسات المتوفرة: [يحتاج تأكيد].
  5. **كم يوصل الطلب؟** من 1 إلى 4 أيام عمل داخل السعودية، ونشحن لدول الخليج والعالم.
- **روابط داخلية:** سبورت برا، أطقم رياضية، تيشيرتات وتوبات رياضية، ملابس رياضية نسائية (الأب)، ومقالي المدونة «دليل مقاسات الليقنز» و«العناية بالليقنز» (`unix-leggings-size-guide` و`unix-leggings-care-guide` مسودات، ويحتاجون قرار نشر في PLAN Phase 1). وكل ليقنز في وصفه يرجع لهذه الصفحة.

**English**

- **Primary:** leggings / women's leggings (EN volumes not pulled).
- **Title:** Women's Leggings, High-Waisted | Shop UNIX
- **Meta:** High-waisted women's leggings in a soft nylon-spandex stretch: Sculpting to sculpt, Core Control with a corset waist, Curve Enhance with pockets. Shop now.
- **H1:** Women's Leggings
- **Intro:** UNIX leggings are high-waisted and cut from a soft nylon-spandex stretch that holds you and moves with you, from training to the rest of your day. Three cuts: double-layer Sculpting, corset-waist Core Control, and Curve Enhance with side pockets.
- **H2s:** Which leggings suit you? · A fabric that breathes and stretches · Black leggings and quiet colours · Pair them with a matching sports bra · Leggings care.
- **FAQ:** Are UNIX leggings cotton? (No: nylon-spandex.) · Which leggings have pockets? (Curve Enhance.) · Are they squat-proof? [to confirm] · How do I find my size? (The size finder plus a cm chart; size range [to confirm].) · How long is delivery? (1–4 working days in KSA.)

---

### 4.2 ملابس رياضية نسائية (Women's Activewear), parent

**عربي**

- **الكلمة الأساسية:** ملابس رياضية نسائية (1,900).
- **التهجئات والكلمات القريبة:** ملابس رياضيه نسائيه، لبس رياضي نسائي، ملابس رياضية للجيم، بناطيل رياضية (حتى يصير لها تصنيف).
- **عنوان SEO:** ملابس رياضية نسائية بتصاميم هادئة | تسوّقي من UNIX
- **الوصف:** ملابس رياضية نسائية من UNIX: ليقنز وسبورت برا وتوبات وأطقم وهوديز بخامات مرنة تتنفس معكِ في التمرين ويومكِ الطويل. شحن لكل مناطق المملكة.
- **H1:** ملابس رياضية نسائية
- **المقدمة:** ملابس UNIX الرياضية مصممة لحركتكِ: خامات مرنة تتنفس، وقصّات تبرز القوام بهدوء، وألوان تنسّقينها بسهولة. من الجيم واليوغا والبيلاتس إلى السفر ويومكِ العادي.
- **H2 تحت المنتجات:**
  1. **وش تلقين في ملابس UNIX الرياضية؟** جواب بسطر واحد، ثم روابط: ليقنز نسائي، سبورت برا، تيشيرتات وتوبات رياضية، أطقم رياضية، هوديز نسائية.
  2. **لأي تمرين؟** Halo Back وTwist لليوغا والبيلاتس والجيم والجري، وSoft Angle للجيم والبيلاتس، وفي Core Control دعم خفيف للنشاط المنخفض والمتوسط.
  3. **بناطيل رياضية واسعة:** بنطلون Waist Tone وبنطلون Sailor الواسع، للسفر والتمرين والإطلالات اليومية.
  4. **خامات تتحرك معكِ:** قطع الأكتيف وير من نايلون وسباندكس مرن.
  5. **من السعودية لكِ:** براند سعودي، والتوصيل من 1 إلى 4 أيام عمل داخل المملكة.
- **الأسئلة الشائعة:**
  1. **وين ألقى ملابس رياضية نسائية في السعودية؟** في unix.sa. UNIX براند سعودي للملابس الرياضية واللاونج وير، يوصل داخل المملكة من 1 إلى 4 أيام عمل، ويشحن للخليج والعالم.
  2. **ما الأقمشة المستخدمة؟** نايلون وسباندكس مرن للأكتيف وير، مصمم للدعم والتنفس.
  3. **ما سياسة الإرجاع؟** طلب الإرجاع أو الاستبدال خلال 24 ساعة من الاستلام، لقطعة غير مستخدمة ومعها بطاقاتها. المنتجات المخفّضة لا تُرجع.
  4. **هل أقدر أقسّط؟** على unix.sa عبر تابي وتمارا. [يحتاج تأكيد على سلة]
  5. **هل الشحن مجاني؟** [يحتاج تأكيد: الحد 500 أو 600 ر.س داخل السعودية].
- **روابط داخلية:** كل التصنيفات الفرعية الخمسة، و«بيجامات وملابس نوم» («لأوقات الراحة»)، ومن الهوم والفوتر.

**English**

- **Title:** Women's Activewear, Quietly Refined | Shop UNIX
- **Meta:** Women's activewear from UNIX: leggings, sports bras, tops, sets and hoodies in breathable stretch fabrics for training and long days. Ships across KSA.
- **H1:** Women's Activewear
- **Intro:** UNIX activewear is made for how you move: breathable stretch fabrics, cuts that shape quietly, and colours that pair with ease, from the gym, yoga and Pilates to travel and everyday.
- **H2s:** What's in the range · Which workout · Wide-leg sports pants · Fabrics that move with you · From Saudi Arabia to you.
- **FAQ:** Where can I buy women's activewear in Saudi Arabia? · What fabrics do you use? · Returns policy · Instalments [to confirm on Salla] · Free shipping [threshold to confirm].

---

### 4.3 تيشيرتات وتوبات رياضية (Sports Tops & T-Shirts)

**عربي**

- **الكلمة الأساسية:** تيشيرت رياضي (590).
- **التهجئات والكلمات القريبة:** تي شيرت رياضي نسائي، تيشيرت رياضي نسائي، توب رياضي.
- **عنوان SEO:** تيشيرت رياضي نسائي وتوبات للتمرين | تسوّقي من UNIX
- **الوصف:** تيشيرتات وتوبات رياضية نسائية لليوغا والبيلاتس والجيم: ظهر مفتوح يهوّي، وأكمام طويلة بفتحات إبهام، وقصّات تثبت مع حركتكِ. تسوّقي الآن من UNIX.
- **H1:** تيشيرتات وتوبات رياضية
- **المقدمة:** توبات UNIX الرياضية لتمرينكِ ويومكِ: قصّات تثبت في مكانها مع الحركة، وتفاصيل تهوية في الظهر، وملمس ناعم على البشرة. نسّقيها مع الليقنز بخصر عالٍ لإطلالة متكاملة.
- **H2 تحت المنتجات:**
  1. **أي توب لتمرينكِ؟** Halo Back وTwist لليوغا والبيلاتس والجيم والجري، وSoft Angle للجيم والبيلاتس، وFemme Scoop للتمارين الخفيفة والمتوسطة.
  2. **أكمام طويلة أو ظهر مفتوح؟** Twist بأكمام طويلة وفتحات إبهام، وFemme Scoop بأكمام طويلة وقصّة قصيرة، وHalo Back بظهر مفتوح دائري.
  3. **تنسيقها مع الليقنز:** روابط لليقنز نسائي ولأطقم رياضية.
  4. **تبحثين عن تيشيرت للبيت؟** رابط لتيشيرت Bamboo في «قمصان وبلايز كومفي». هذا يفصل نية البحث بين الصفحتين ويمنع التنافس بينهما.
- **الأسئلة الشائعة:**
  1. **هل التوبات فيها دعم للصدر؟** Femme Scoop بقصّة داعمة للتمارين الخفيفة والمتوسطة. باقي الموديلات: [يحتاج تأكيد]. وللدعم اختاري من صفحة سبورت برا.
  2. **من أي خامة؟** Femme Scoop من نايلون وسباندكس مرن. Halo Back وTwist وSoft Angle: [يحتاج تأكيد: الخامة غير مكتوبة في بيانات المنتج].
  3. **هل تنفع لليوغا؟** نعم، Halo Back وTwist مصممين لليوغا والبيلاتس والجيم والجري.
  4. **كيف أعرف مقاسي؟** أداة «اعرفي مقاسكِ» وجدول مقاسات الأعلى الرياضي في صفحة كل قطعة.
- **روابط داخلية:** سبورت برا، ليقنز نسائي، أطقم رياضية، قمصان وبلايز كومفي، الأب.
- **⚠️ تحذير عن نية البحث:** معظم الموديلات توبات بأكمام طويلة أو قصّة قصيرة، مش تيشيرت كلاسيكي بأكمام قصيرة. ممكن الصفحة تترتب على «تيشيرت رياضي» ببطء أو بنسبة نقر أقل. هذا ما يمنع الاستهداف، بس ما نوعد بنتيجة.

**English**

- **Title:** Women's Sports Tops & T-Shirts | Shop UNIX
- **Meta:** Women's sports tops for yoga, Pilates and the gym: open backs that breathe, long sleeves with thumbholes and cuts that stay put as you move. Shop UNIX.
- **H1:** Sports Tops & T-Shirts
- **Intro:** UNIX sports tops for training and the day after it: cuts that stay put, airy back details, and a soft hand on the skin. Pair them with high-waisted leggings.
- **H2s:** Which top for your workout · Long sleeves or open back · Pair with leggings · Looking for a lounge tee? (→ Comfy Tops).
- **FAQ:** Do the tops have bust support? · What fabric? [to confirm for 3 models] · Are they good for yoga? · How do I find my size?

---

### 4.4 سبورت برا (Sports Bras), new

**عربي**

- **الكلمة الأساسية:** سبورت برا (170). مع «برا سبورت» (140) المجموع حوالي 310.
- **التهجئات والكلمات القريبة:** برا سبورت، توب سبورت برا، sports bra، حمالة صدر رياضية (ما عندنا رقم لها).
- **عنوان SEO:** سبورت برا نسائي بقصّات أنيقة | تسوّقي من UNIX
- **الوصف:** سبورت برا من UNIX بقماش ناعم يتنفس وتمدد مرن: Sculpting بطبقتين، وCore Control بياقة مربعة، وCurve Enhance بتصميم هالتر. نسّقيه مع الليقنز.
- **H1:** سبورت برا
- **المقدمة:** سبورت برا UNIX ناعم ومرن، يثبت مع حركتكِ ويبدو أنيقًا وحده أو تحت طبقة خفيفة. ثلاث قصّات تكمّل الليقنز من نفس الموديل.
- **H2 تحت المنتجات:**
  1. **أي برا سبورت يناسبكِ؟** Sculpting بقماش بطبقتين وحزام سفلي للثبات، وCore Control بياقة مربعة ودعم خفيف، وCurve Enhance بياقة هالتر وظهر مكشوف وحزام سفلي داعم.
  2. **مستوى الدعم:** Core Control للنشاط المنخفض والمتوسط. الباقي: [يحتاج تأكيد]. لا تكتبي «دعم عالي» قبل التأكيد.
  3. **من التمرين للإطلالة اليومية:** Curve Enhance وCore Control مصممين للرياضة والإطلالات اليومية.
  4. **كمّلي الطقم:** روابط لليقنز نسائي ولأطقم رياضية.
- **الأسئلة الشائعة:**
  1. **وين ألقى سبورت برا كويسة؟** (سؤال الأوديت) في unix.sa تلقين ثلاث قصّات من نايلون وسباندكس مرن، وكل وحدة لها ليقنز من نفس الموديل. اختاري حسب الدعم والقصّة اللي تبينها، والتوصيل داخل السعودية من 1 إلى 4 أيام عمل.
  2. **هل السبورت برا مبطّن؟ هل البطانة تنشال؟** [يحتاج تأكيد]
  3. **هل أقدر ألبسه بدون شيء فوقه؟** نعم. Core Control وCurve Enhance مصممين للرياضة والإطلالات اليومية.
  4. **كيف أعرف مقاسي؟** أداة «اعرفي مقاسكِ» وجدول مقاسات الأعلى الرياضي في صفحة كل قطعة.
  5. **كيف أغسله؟** ماء بارد، تجفيف بالهواء، بدون مبيّض أو نشّافة.
- **روابط داخلية:** ليقنز نسائي، أطقم رياضية، تيشيرتات وتوبات رياضية، الأب.

**English**

- **Title:** Sports Bras | Shop UNIX
- **Meta:** UNIX sports bras in soft, breathable stretch fabric: two-layer Sculpting, square-neck Core Control and halter Curve Enhance. Pair with leggings.
- **H1:** Sports Bras
- **Intro:** UNIX sports bras are soft and stretchy, stay put as you move, and look finished on their own or under a light layer. Three cuts, each with matching leggings.
- **H2s:** Which sports bra suits you · Support level ([to confirm] except Core Control: light, low–medium) · From workout to everyday · Complete the set.
- **FAQ:** Where can I find a good sports bra? · Padded / removable pads? [to confirm] · Can I wear it on its own? · Sizing · Care.

---

### 4.5 أطقم رياضية (Sports Sets)

**عربي**

- **الكلمة الأساسية:** طقم رياضي نسائي (320).
- **التهجئات والكلمات القريبة:** اطقم رياضية نسائية (110)، بدلة رياضية نسائية (90)، بدله رياضية نسائي (90)، ترنج رياضي نسائي (70). بدلة وترنج تناسب أطقم Waist Tone وSailor (هودي مع بنطلون واسع).
- **عنوان SEO:** طقم رياضي نسائي متناسق | تسوّقي من UNIX
- **الوصف:** أطقم رياضية نسائية من UNIX: سبورت برا وليقنز من نفس الموديل، وأطقم هودي مع بنطلون واسع. إطلالة متكاملة بلون واحد، جاهزة للتمرين ويومكِ.
- **H1:** أطقم رياضية
- **المقدمة:** أطقم UNIX الرياضية تجمع القطعتين بلون واحد وقصّة متناسقة، فتجهزين لتمرينكِ بخطوة وحدة. اختاري سبورت برا مع ليقنز، أو هودي مع بنطلون واسع.
- **H2 تحت المنتجات:**
  1. **سبورت برا وليقنز من نفس الموديل:** Sculpting وCore Control وCurve Enhance.
  2. **بدلة رياضية بهودي وبنطلون واسع:** Waist Tone (هودي قصير بسحّاب) وSailor (ياقة بحرية).
  3. **الطقم أو القطع منفصلة؟** كل قطعة متوفرة لوحدها كمان، مع روابط لليقنز وسبورت برا وهوديز. الفرق في السعر: [يحتاج تأكيد].
  4. **المقاسات في الطقم:** الطقم يستخدم جدول مقاسات الأعلى وجدول الأسفل.
- **الأسئلة الشائعة:**
  1. **هل أقدر أختار مقاس مختلف للتوب والليقنز؟** [يحتاج تأكيد: خيارات المقاس في الطقم على سلة]
  2. **وش الفرق بين الأطقم؟** Sculpting للنحت بقماش مزدوج، وCore Control بخصر كورسيه وتفاصيل شبكية، وCurve Enhance بجيوب وخياطة خلفية على شكل قلب.
  3. **هل في طقم يصلح للسفر؟** Waist Tone وSailor مصممين للسفر والتمرين والإطلالات اليومية.
  4. **سياسة الإرجاع؟** خلال 24 ساعة من الاستلام، غير مستخدم ومعه البطاقات، والمخفّض لا يُرجع.
- **روابط داخلية:** ليقنز نسائي، سبورت برا، هوديز نسائية، الأب.

**English**

- **Title:** Women's Sports Sets | Shop UNIX
- **Meta:** Matching women's sports sets from UNIX: a sports bra and leggings from the same line, plus hoodie and wide-leg pant sets. One colour, one complete look.
- **H1:** Sports Sets
- **Intro:** UNIX sports sets pair two pieces in one colour and one cut, so getting ready takes a single step. Choose a sports bra with leggings, or a hoodie with wide-leg pants.
- **H2s:** Sports bra + leggings · Hoodie + wide-leg pants · Set or separates · Sizing in a set.
- **FAQ:** Different sizes for top and bottom? [to confirm] · How do the sets differ? · Which set travels well? · Returns.

---

### 4.6 هوديز نسائية (Women's Hoodies), new

**عربي**

- **الكلمة الأساسية:** هودي نسائي (1,000).
- **التهجئات والكلمات القريبة:** هوديز، طقم هودي نسائي (40)، hoodie. اكتبي «هودي» بالياء في كل مكان.
- **عنوان SEO:** هودي نسائي بقصّات عصرية مريحة | تسوّقي من UNIX
- **الوصف:** هودي نسائي من UNIX: Waist Tone القصير بسحّاب أمامي، وSailor بياقة بحرية ونصف سحّاب. للسفر والتمرين ويومكِ، ومعه بنطلون واسع يكمّل الطقم.
- **H1:** هوديز نسائية
- **المقدمة:** هوديز UNIX تجمع الراحة والقصّة النظيفة: Waist Tone القصير يبرز الخصر بسحّاب أمامي، وSailor بياقة بحرية ونصف سحّاب. البسيه للسفر أو التمرين أو يومكِ، أو كمّليه بالبنطلون الواسع من نفس الموديل.
- **H2 تحت المنتجات:**
  1. **أي هودي يناسبكِ؟** لقصّة قصيرة تبرز الخصر اختاري Waist Tone، ولقصّة مريحة بطابع بحري اختاري Sailor.
  2. **طقم هودي نسائي:** Waist Tone وSailor كل واحد له بنطلون واسع وطقم كامل. رابط لأطقم رياضية.
  3. **للسفر والتمرين والإطلالة اليومية:** Waist Tone من خامة منسدلة ناعمة، وSailor بأساور مريحة للحركة.
  4. **تنسيق الهودي:** مع الليقنز أو البنطلون الواسع.
- **الأسئلة الشائعة:**
  1. **هل هودي Waist Tone قصير؟** نعم، طوله قصير ومصمم لإبراز الخصر، وله سحّاب أمامي.
  2. **هل في طقم هودي وبنطلون؟** نعم، طقم Waist Tone وطقم Sailor، كل واحد بلونين.
  3. **من أي خامة؟** Waist Tone من نايلون وسباندكس مرن. Sailor: [يحتاج تأكيد].
  4. **هل الهودي مناسب للشتاء؟** [يحتاج تأكيد: وزن القماش والدفء]. لا تكتبي «شتوي» بدون تأكيد.
  5. **كيف أعرف مقاسي؟** أداة «اعرفي مقاسكِ» وجدول مقاسات الأعلى الرياضي.
- **روابط داخلية:** أطقم رياضية، ليقنز نسائي، ملابس رياضية نسائية، وصفحات بنطلون Waist Tone وSailor.

**English**

- **Title:** Women's Hoodies | Shop UNIX
- **Meta:** Women's hoodies from UNIX: the cropped Waist Tone with a front zip and the Sailor with a sailor collar and half zip. For travel, training and every day.
- **H1:** Women's Hoodies
- **Intro:** UNIX hoodies pair comfort with a clean cut: the cropped Waist Tone with a front zip, and the Sailor with a sailor collar and half zip. Wear one alone or with its matching wide-leg pants.
- **H2s:** Which hoodie suits you · Hoodie sets · For travel, training and every day · How to style it.
- **FAQ:** Is Waist Tone cropped? · Is there a hoodie-and-pants set? · Fabric? [Sailor to confirm] · Warm enough for winter? [to confirm] · Sizing.

---

### 4.7 بيجامات وملابس نوم (Pyjamas & Sleepwear)

**عربي**

- **الكلمة الأساسية:** بيجامات نسائية (720 + 720) وملابس نوم نسائي (1,300).
- **التهجئات والكلمات القريبة:** بجامة/بجامه نسائيه (1,600)، بجايم نسائيه (880)، بيجامة نسائية (260)، ملابس نوم نسائية (390)، بيجامات نوم نسائية (140)، بيجامات قطن (260)، طقم بيجاما (50). **على الصفحة اكتبي «بيجامة/بيجامات» صح**، واستخدمي «بجامة» و«بجايم» مرة واحدة بشكل طبيعي، مثل: «بيجامات (أو بجايم مثل ما نقولها)». لا تكدّسي التهجئات (PLAYBOOK §3.3، R3.5).
- **عنوان SEO:** بيجامات وملابس نوم نسائية ناعمة | تسوّقي من UNIX
- **الوصف:** بيجامات وملابس نوم نسائية من UNIX: مزيج قطن مريح، وبامبو ناعم يتنفس، وكتان وقطن في Pearla. قصّات واسعة للبيت والنوم والسفر. اختاري طقمكِ الآن.
- **H1:** بيجامات وملابس نوم
- **المقدمة:** بيجامات UNIX كومفي للحظاتكِ الهادئة: أقمشة ناعمة تتنفس، وقصّات واسعة تريحكِ في النوم والبيت والسفر. اختاري طقمًا كاملًا أو نسّقي القطع على مزاجكِ.
- **H2 تحت المنتجات:**
  1. **أي بيجامة تناسبكِ؟** Comfy من مزيج القطن والبوليستر بياقة متباينة، وBamboo من البامبو الناعم المضاد للبكتيريا، وPearla من الكتان والقطن بأزرار لؤلؤية، وSoft بحواف سوداء متباينة.
  2. **بيجامات قطن أو بامبو أو كتان؟** جواب صريح بالخامة لكل خط. هذا يجاوب على بحث «بيجامات قطن» بدون ادعاء إن كل القطع قطن 100%.
  3. **أطقم أو قطع منفصلة:** روابط لقمصان وبلايز كومفي، وبناطيل وشورتات كومفي، وأطقم كومفي.
  4. **للبيت والنوم والسفر:** Bamboo وPearla مصممين للاسترخاء والسفر.
  5. **العناية:** Comfy بالغسالة على 30، وBamboo وSoft بماء بارد، وPearla بماء بارد ونشّافة بدون حرارة.
- **الأسئلة الشائعة:**
  1. **هل البيجامات قطن؟** Comfy مزيج قطن وبوليستر، وPearla كتان وقطن، وBamboo بامبو مع نسبة بسيطة من السباندكس، وSoft بوليستر معالج ناعم.
  2. **هل عندكم بيجامات شتوية؟** المجموعة الحالية خفيفة وتتنفس. [يحتاج تأكيد: أي إطلاق شتوي قادم]. انظري §5.
  3. **وش الفرق بين Comfy وBamboo وPearla؟** جواب من سطرين: الخامة والقصّة واللحظة المناسبة لكل خط.
  4. **كيف أعرف مقاسي؟** في صفحة كل قطعة أداة «اعرفي مقاسكِ» وجدول مقاسات كومفي بالسنتيمتر.
  5. **كم يوصل الطلب؟** من 1 إلى 4 أيام عمل داخل السعودية.
- **روابط داخلية:** التصنيفات الفرعية الثلاثة، ومقال مدونة مستقبلي «تنسيق اللاونج وير» (PLAN Phase 6)، والهوم.

**English**

- **Title:** Women's Pyjamas & Sleepwear | Shop UNIX
- **Meta:** Women's pyjamas and sleepwear from UNIX: soft cotton-blend Comfy, breathable Bamboo and linen-cotton Pearla. Relaxed cuts for home, sleep and travel.
- **H1:** Pyjamas & Sleepwear
- **Intro:** UNIX Comfy pyjamas are made for your quiet hours: soft, breathable fabrics and relaxed cuts for sleep, home and travel. Choose a full set or mix the pieces your way.
- **H2s:** Which pyjamas suit you · Cotton, bamboo or linen? · Sets or separates · For home, sleep and travel · Care.
- **FAQ:** Are the pyjamas cotton? (By line, as above.) · Winter pyjamas? [to confirm] · Comfy vs Bamboo vs Pearla · Sizing · Delivery.

---

### 4.8 Comfy subcategories (short briefs)

All three inherit facts and FAQ answers from 4.7. Each one gets **2–3 FAQs** and a 100–150-word guide, so it isn't a copy of the parent (PLAYBOOK §5.4).

**قمصان وبلايز كومفي / Comfy Tops & Shirts**
- **الكلمة:** بلايز نسائية (720) + قمصان نسائية (320).
- **عنوان SEO:** قمصان وبلايز نسائية مريحة للبيت | تسوّقي من UNIX
- **الوصف:** قمصان وبلايز كومفي من UNIX: قميص Boyfriend الواسع، وتيشيرت وتانك توب Bamboo الناعم، وقميص Pearla من الكتان والقطن. راحة هادئة لكل يوم.
- **H1:** قمصان وبلايز كومفي
- **المقدمة:** قمصان وبلايز UNIX كومفي بأقمشة ناعمة وقصّات مريحة، تلبسينها في البيت أو تحت جاكيت خفيف في يومكِ.
- **H2:** قميص واسع أو تيشيرت؟ · تانك توب Bamboo بحمالة صدر مدمجة · تنسيقها مع بناطيل كومفي.
- **الأسئلة:**
  1. هل تانك توب Bamboo فيه دعم؟ (حمالة صدر مدمجة بدعم خفيف.)
  2. هل قميص Boyfriend واسع؟ (قصّة واسعة جدًا.)
- **EN:** Comfy Tops & Shirts | Shop UNIX. Meta: Comfy tops from UNIX: the oversized Boyfriend shirt, soft Bamboo tees and tanks, and the linen-cotton Pearla shirt. Quiet comfort for every day.
- ⚠️ «بلايز نسائية» has broad intent (blouses for going out). Expect a slow ranking. The page is still the honest owner.

**بناطيل وشورتات كومفي / Comfy Pants & Shorts**
- **الكلمة:** لا يوجد رقم. اسحبي «بنطلون بيت نسائي» و«شورت بيت» من Keyword Planner.
- **عنوان SEO:** بناطيل وشورتات بيت واسعة ومريحة | تسوّقي من UNIX
- **الوصف:** بناطيل وشورتات كومفي من UNIX بخصر مطاطي مريح وقصّات واسعة: Comfy من مزيج القطن، وBamboo بخصر عالٍ، وPearla من الكتان والقطن. للبيت والسفر.
- **H1:** بناطيل وشورتات كومفي
- **H2:** بنطلون واسع أو شورت؟ · خصر مريح طول اليوم · نسّقيها مع قمصان كومفي.
- **الأسئلة:**
  1. هل البنطلون فيه جيوب؟ (Comfy وPearla فيهم جيوب. Bamboo: [يحتاج تأكيد].)
  2. هل الخصر مطاطي؟ (نعم. في Bamboo مخفي تحت حزام V.)
- **EN:** Comfy Pants & Shorts | Shop UNIX. Meta: Comfy pants and shorts from UNIX with easy elastic waists and relaxed cuts: cotton-blend Comfy, high-waisted Bamboo and linen-cotton Pearla.

**أطقم كومفي / Lounge Sets**
- **الكلمة:** لاونج وير (70) + «lounge set» (170، من الأوديت، إنجليزي).
- **عنوان SEO:** أطقم لاونج وير نسائية | تسوّقي من UNIX
- **الوصف:** أطقم لاونج وير من UNIX: قميص وبنطلون أو شورت من نفس القماش، وطقم Bamboo بثلاث قطع. أقمشة ناعمة تتنفس لأيامكِ الهادئة في البيت والسفر.
- **H1:** أطقم كومفي
- **H2:** طقم بقطعتين أو بثلاث؟ · Pearla للسفر والإطلالات الهادئة · طقم Soft الكلاسيكي.
- **الأسئلة:**
  1. وش في طقم Bamboo؟ (تيشيرت وتانك توب بحمالة مدمجة وبنطلون واسع بخصر عالٍ.)
  2. هل أقدر ألبس طقم Pearla برا البيت؟ (مصمم للاسترخاء والسفر والإطلالات اليومية.)
- **EN:** Lounge Sets | Shop UNIX. Meta: Women's lounge sets from UNIX: a shirt with pants or shorts in one fabric, and the three-piece Bamboo set. Soft, breathable pieces for slow days.
- **Rule:** never put «بيجامة» in this title (the parent owns it).

### 4.9 Utility categories

These target no keyword. Give each one a unique one-line meta, no FAQ and no long copy:
- **وصل حديثًا:** «أحدث قطع UNIX من الأكتيف وير واللاونج وير، أول بأول. اكتشفي الجديد وتسوّقي الآن.»
- **الأكثر مبيعًا:** «القطع اللي اختارتها عميلات UNIX أكثر من غيرها: ليقنز وأطقم وبيجامات. تسوّقي المفضّلة.»
- **إكسسوارات:** «إكسسوارات UNIX لتمرينكِ ويومكِ: حقيبة الجيم، وزجاجة المياه، ومناشف Soft Touch، وشموع عطرية وبطاقة هدايا.»

---

## 5. Seasonal notes

| Cluster | Monthly volume (from the keywords file) | What UNIX has today | Recommendation |
|---|---|---|---|
| **Winter pyjamas:** بيجامة شتوية نسائية 390 · بيجامات نسائية شتوية 320 · بيجامة نسائية شتوية 320 · بجايم شتويه نسائيه 140 · بجامه شتويه نسائيه 110 | ≈ 1,280 combined (these are annual averages; the monthly peak is **not pulled**) | Nothing winter-weight. Comfy, Bamboo, Pearla and Soft are all described as light and breathable. | **Don't put «شتوية» in any title, H1 or meta.** That would be inaccurate, and Google rewrites inaccurate titles [G-TITLE]. Answer honestly in the FAQ (4.7 Q2). If a winter line launches (velvet «مخمل» 50, fleece), create a subcategory **«بيجامات شتوية»** under the pyjama parent with a **permanent URL**: keep it live all year and refresh the copy each season (industry practice), rather than a new URL every winter. |
| **Hoodies** (هودي نسائي 1,000) | Monthly split not pulled | Waist Tone and Sailor | Hoodie demand is likely higher in Nov–Feb, but that is **unverified**. Check Google Trends (SA) before planning. Feature the hoodie category on the home page in winter, and don't call it «شتوي» until fabric warmth is confirmed. |
| **Summer** | — | Pearla (linen-cotton) and Bamboo (moisture-regulating) | Summer is when «يتنفس» and «كتان» matter. Rotate the pyjama intro in May–Aug to lead with Pearla and Bamboo, keeping the same URL, title and H1. |
| **Ramadan / Eid, White Friday, National Day (23 Sep)** | No data | Gift card, sets | Use the existing category pages and the home page for campaigns. **Don't create sale-only URLs** that die after the campaign; they produce 404s or soft 404s (PLAYBOOK R1.4). |

To make these notes reliable, pull Keyword Planner monthly volumes (`monthly_search_volumes`) for the winter-pyjama and hoodie terms, plus Google Trends SA for 5 years.

---

## 6. Theme check (read-only) → for `unix-theme-architect`

File: `src/views/pages/product/index.twig` (the Salla product-listing / category template).

| Line | Finding | Impact | Fix |
|---|---|---|---|
| 40–44, 57–59 | **The category description is server-rendered.** `category.description` is read, any `<h1>` is demoted to `<h2>` (LESSONS 32), and it prints with `|raw` inside `.unix-plp-banner__desc`, **in the Ink banner directly under the `h1`, above the grid**. It is on by default (`twilight.json:1083–1087`, `unix_collection_show_description` = true). It is in the HTML, not added by JS. ✅ | — | — |
| 43 | **UNVERIFIED that the variable exists (D77).** Salla's documented product-listing variables list `category.name`, `url`, `sub_categories` and `image`, and no `description` [SALLA-TW-PLP]. Salla's dashboard documents a category **SEO** description [SALLA-SEO], but not a visible on-page description. If `category.description` is empty or is the SEO meta, none of the copy in §4 renders. | **High.** Without it, the category pages have no visible copy. | Test on the demo store: give one category a dashboard description with an `<h2>`, then check View Source. If it's missing, the copy needs a theme source (a per-category text field in settings, or a Salla hook), with a D-number. |
| 57–59 vs 162–172 | **There is no slot below the grid.** The whole description prints above the products. A 150–250-word guide with H2s would push the grid below the fold on mobile. PLAYBOOK §5.3 (industry practice) says to keep the grid first. | **Medium.** It's a UX and conversion cost more than a ranking one. | Split the merchant description at the first `<hr>`: the part before it goes in the banner (the 2–3-sentence intro), and the part after it renders in a new server-rendered `<section class="unix-plp-guide">` after line 172 and before the hook at 208. The content stays merchant-owned (CLAUDE.md). The FAQ can live in that lower part as `<h3>` questions or `<details>`. This covers PLAN Phase 4's «أسئلة شائعة ظاهرة للتصنيف» without new settings. FAQPage JSON-LD is optional and gives no rich result (PLAYBOOK §2.9). |
| 53 | The `h1` is `category.name`, so **the name in §2 is the H1 and the menu label**. That's why the names are short and keyword-led. ✅ | — | — |
| 162–168 | **The product links are client-rendered** (`<salla-products-list>`). The initial HTML has no `<a href>` to products. Google can render JS, but it "doesn't click" a load-more button [G-PAGINATION], and category pages should link to their products [G-ECOM-STRUCT]. | **Medium.** The pyjama category has 30 products. | Live check: URL Inspection → rendered HTML on «بيجامات» → confirm all product `<a href>` appear without a click, and whether `salla-products-list` uses numbered pages, load-more or infinite scroll. If products are hidden behind a click, rely on Salla's sitemap (PLAYBOOK §8.2) and link each family from the guide text in §4. |
| 31 | The BreadcrumbList fallback prints only **Home › Category**. For subcategories (ليقنز under ملابس رياضية) the parent crumb is missing (PLAN Phase 4 open item). It renders only when visible breadcrumbs are off (default off, `twilight.json:517`). | **Low.** Breadcrumb rich results show on desktop only [G-UPD]. | Add the parent crumb if Salla exposes the parent in Twig (UNVERIFIED; the global category model has `parent_id`). Otherwise leave it. |
| 69 | The banner image alt is `category.name`, translated per language. ✅ | — | — |

**Verdict (theme-side, PLP):** PASS, conditional on the D77 check. Two improvements are recommended: the `<hr>` split for copy below the grid, and the rendered-links check.

---

## 7. Recommendations (impact · effort · owner · when)

| # | Action | Impact | Effort | Owner | When |
|---|---|---|---|---|---|
| 1 | Confirm on the demo store that `category.description` renders (D77) | High (gates all of §4) | 15 min | Client + theme-architect | Before content entry |
| 2 | Approve the tree and names in §2, then rename and add categories in Salla **before import**, so products land in final categories and the 301 map points to final URLs | High | 1 h | Client | PLAN Phase 1 |
| 3 | Fill in the leggings and pyjama pages first (title, meta, intro, guide, FAQ) | High: these hold the two biggest clusters (≈ 7,500 and > 5,000/mo) | 2 h | Content | Phase 2 |
| 4 | Theme: `<hr>` split for the guide below the grid | Medium | Small | theme-architect | Phase 4 |
| 5 | Activewear parent, hoodies, sports tops, sports bras, sports sets | Medium | 3 h | Content | Phase 2 |
| 6 | Fill in every «[يحتاج تأكيد]» (size range, squat test, bra padding and support, Sailor and top fabrics, hoodie warmth, set sizing, free-shipping threshold) | Medium (trust, PLAYBOOK §5.1) | Client answers | Client | Before publishing the copy |
| 7 | Comfy subcategories and utility metas | Low | 1 h | Content | Phase 2 |
| 8 | Publish the 2 leggings blog drafts and link them from 4.1 | Medium | Client decision | Client | Phase 1 |

**Honest expectation:** copy and names put the right page in front of each cluster. They won't move rankings much by themselves, from a base of 22 organic visits a month and 7 keywords (audit, PLAN). Speed, indexing, links and time do more of the work (the audit gives 3–12 months).

---

## 8. Data needed / unverified

- **Salla:** whether a visible category description exists (D77), slugs per language, the URL pattern, the pagination mode of `salla-products-list`, and the parent category in Twig.
- **Product facts:** see §7 row 6.
- **Product data conflict to pass to the product-SEO agent:** the `soft-pyjama-set` seo_title says «بيجاما قطنية فاخرة», and `soft-shirt` says «من مزيج القطن», but `product-content.csv` gives the fabric as «بوليستر المعالج». The fabric claim in the title is inaccurate.
- **Keyword data not pulled:** English (`/en/`) volumes; monthly seasonality; «بنطلون بيت» and «شورت بيت»; Search Console queries (Supermetrics trial ended, PLAN). Export them from GSC → Performance → Queries.
- **The setup prompt is now stale:** `docs/demo-data/CLAUDE-DESKTOP-STORE-SETUP-PROMPT.md` step 4 still lists the old 11 names. Update it once §2 is approved (I don't own that file).
- **Playbook updates I propose:**
  1. §0 row 3 / §9.1: the 301 tool is no longer "no bulk import". PLAN lists `POST /custom-urls/import`; the status code is still unverified.
  2. §5.3: "80–150 words (as in the PLAN)" should say length follows the questions [G-HELPFUL]. This task used 150–250.
  3. Add a §5.3 rule: "the category name is the H1 in this theme".
  4. `keywords-ksa-2026-11.md` line 11 still names the owner «ليقينز رياضية».

---

## 9. Sources

Rules are cited by PLAYBOOK key. Full URLs are in PLAYBOOK §14. I re-opened [G-ECOM-STRUCT] and [G-PAGINATION] today (2026-11-10).
- [G-ECOM-STRUCT] https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure
- [G-PAGINATION] https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading
- [G-TITLE] https://developers.google.com/search/docs/appearance/title-link
- [G-SNIPPET-META] https://developers.google.com/search/docs/appearance/snippet
- [G-HELPFUL] https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- [G-AIOPT] https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- [G-SPAM] https://developers.google.com/search/docs/essentials/spam-policies
- [G-URL] https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites
- [G-MULTI] https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
- [G-UPD] https://developers.google.com/search/updates
- [SALLA-SEO] https://help.salla.sa/article/%D8%AA%D8%AD%D8%B3%D9%8A%D9%86-%D8%B8%D9%87%D9%88%D8%B1-%D9%85%D8%AA%D8%AC%D8%B1%D9%83-%D8%B9%D9%84%D9%89-%D9%85%D8%AD%D8%B1%D9%83%D8%A7%D8%AA-%D8%A7%D9%84%D8%A8%D8%AD%D8%AB-seo/oi134aj2ud6ts12ysumrm5za
- [SALLA-TW-PLP] Twilight products-listing page: https://docs.salla.dev/422559m0 (its variable schema didn't render; a search summary listed `category` = name, url, sub_categories, image)
