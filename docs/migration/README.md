# جرد نقل unix.sa من Shopify لسلة (SEO + 301)

الملفات دي اتسحبت من Shopify Admin API (قراءة بس) يوم 2026-11-02. الهدف إن كل رابط متأرشف في جوجل يتعمله 301 للرابط الجديد في سلة، وكل منتج يفضل بعنوان ووصف الـ SEO بتوعه.

## الملفات

| الملف | فيه إيه |
|---|---|
| `shopify-urls.csv` | كل رابط قديم: منتجات، كولكشنز، صفحات، مدونات ومقالات، ومعاهم نسخة `/en/...`. عمود `new_salla_url` فاضي، بيتملي بعد ما المنتجات تتعمل على سلة. |
| `product-seo.csv` | لكل منتج: الـ handle والحالة والاسم و`seo_title` و`seo_description` بالعربي زي ما هي. |
| `product-content.csv` | المحتوى اللي جاي من الـ metafields: المميزات (`custom.key_features`)، العناية (`descriptors.care_guide`)، المنتجات المكمّلة (`custom.complements`، handles مفصولة بـ `\|`)، وصفحات جدول المقاسات. |
| `shopify-existing-redirects.csv` | الـ 301 الموجودة حاليًا في Shopify (`path,target`). |

## الأعداد

- **المنتجات: 109**
  - ACTIVE: 80
  - DRAFT: 26
  - UNLISTED: 2 (`bag-charm` و`timeless-gym-blue-bag`)، شغالين بالرابط المباشر بس
  - ARCHIVED: 1 (`untitled-jun21_00-21-47`، منتج فاضي)
- **الكولكشنز: 13**
- **الصفحات: 18** (17 منشورة وواحدة لأ هي `data-sharing-opt-out`). منهم 5 صفحات جدول مقاسات و4 صفحات بتاعة تطبيقات (wishlist / swym / calc).
- **المدونات: 2** (`news` و`leggings-blog`). **المقالات: 4**، منهم 2 منشورين و2 مش منشورين.
- **الريدايركت الموجودة في Shopify: 103**
- **اللغات:** العربي أساسي (من غير prefix) والإنجليزي منشور على `/en/`، على نفس الدومين `unix.sa` في ماركت السعودية والشرق الأوسط. يعني كل رابط ليه نسخة `/en/...`، وعشان كده `shopify-urls.csv` فيه 292 صف (146 عربي و146 إنجليزي).

الرابط اللي حالته DRAFT أو ARCHIVED أو UNPUBLISHED مكتوب جنبه في الـ notes: "not public — redirect only if indexed". يعني نعمله 301 بس لو ظهر في Search Console.

## نواقص الـ SEO

- `soft-touch-microfiber-towel-navy-velvet` (ACTIVE): مالوش **seo_title**، وجوجل بيستخدم اسم المنتج بداله. لازم نكتبه في سلة.
- `untitled-jun21_00-21-47` (ARCHIVED): مالوش عنوان ولا وصف، ومش هيتنقل أصلًا.
- باقي الـ 107 منتج عندهم الاتنين.
- 13 منتج DRAFT (`flexy-*` و`air-flexy-*` و`flow-*`) ومعاهم `bag-charm` و`soft-touch-towel-set-blush-navy`: مفيش عندهم key_features ولا care_guide. وكمان `unix-gift-card` مالوش care_guide.
- الصفحات `wishlist` و`swym-*` و`calc-*` و`سياسة-الشحن`: مالهاش SEO title/description.
- صفحات جدول المقاسات عناوين الـ SEO بتاعتها إنجليزي وبصيغة تسويقية مش مرتبطة بالصفحة، فالأحسن تتراجع.

## صفحات جدول المقاسات (handle → العنوان)

- `unix-sport-size-chart`: يونكس توب سبورت SC
- `unix-bottom-sport-sc`: يونكس بوتوم سبورت SC
- `unix-top-comfy-sc`: يونكس توب كومفي SC
- `unix-bottom-comfy-sc`: يونكس بوتوم كومفي SC
- `unix-relax-robe-sc`: روب الاسترخاء يونكس SC

المنتجات المفردة بتستخدم `size_chart`، والأطقم بتستخدم `size_chart_top` مع `size_chart_bottom`.

## العائلات حسب اللون (مستنتجة من الـ handles)

- **Sculpting**: `sculpting-bra-top-*` و`sculpting-leggings-*` و`sculpting-set-*`، بلونين: chocolate وvanilla
- **Core Control**: `core-control-bra-top-*` و`core-control-leggings-*` و`core-control-set-*`، بلونين: black وmidnight-blue
- **Curve Enhance**: `curve-enhance-bra-top-*` (whip-pink, toffee)، و`curve-enhance-pockets-leggings-*` (whip-pink, toffee, black)، و`curve-enhance-set-*` (whip-pink, toffee)
- **Comfy**: `comfy-lounge-shirt-*` و`comfy-lounge-pants-*` و`comfy-boyfriend-shirt-*` و`comfy-pants-lounge-set-*`، بلونين: sky-blue وwhip-pink. أما `comfy-lounge-shorts-whip-pink` و`comfy-lounge-shorts-set-whip-pink` فلون واحد بس.
- **Waist Tone**: `waist-tone-hoodie-*` و`waist-tone-pants-*` و`waist-tone-set-*`، بلونين: grey وoff-white
- **Femme Scoop**: `femme-scoop-long-sleeves-top-*`، بلونين: black وcream-white
- **Bamboo**: `bamboo-t-shirt-*` و`bamboo-tank-top-*` و`bamboo-lounge-pants-*` بالألوان cream وespresso-foam وcold-blue. و`bamboo-3-pieces-set-*` بالألوان cream وdusk وcold-blue. خلي بالك: نفس اللون اسمه `espresso-foam` في القطع و`dusk` في الطقم.
- **Sailor**: `sailor-collar-hoodie-*` و`sailor-wide-pants-*` و`sailor-set-*`، بلونين: cloudy-grey وblack
- **Soft Angle**: `soft-angle-top-*`، بلونين: vanilla وchocolate
- **Halo Back**: `halo-back-top-*`، بتلات ألوان: cream وsmokey وstray-night-blue
- **Twist**: `twist-top-*`، بلونين: row-coal وsilver
- **Soft Touch Towel**: `soft-touch-microfiber-towel-*`، بلونين: navy-velvet وblush-dust. ومعاهم الطقم `soft-touch-towel-set-blush-navy`.
- **Timeless Gym Bag**: `timeless-gym-bag-with-charm-stray-night-blue` (ACTIVE)، و`timeless-gym-blue-bag` (UNLISTED)، و`timeless-gym-bag-powder-pink` (DRAFT). الأسماء مش موحدة.
- **Water Bottle**: `your-everyday-water-bottle-*`، والفرق بينهم في الحجم (470ml و700ml) مش اللون.
- **DRAFT ومش منشورة**: `flexy-bra-top-*` (ice-blue, earthy-berries, black)، و`flexy-wide-pants-*` (black, ice-blue, earthy-berries)، و`air-flexy-jacket-*` (earthy-berries, black, stray-night-blue)، و`flow-bra-top-*` و`flow-leggings-*` (stray-night-blue, row-coal)
- **Soft / Pearla / الشموع**: منتجات بلون واحد. Soft أبيض وPearla لولو، والشمعتين Amalfi وSheer كل واحدة ريحة مختلفة.
- **نسخ قديمة مكررة (DRAFT)**: `*-old` (3 أطقم bamboo و2 أطقم pearla)، و`bamboo-set-with-tshirt-*` و`bamboo-set-with-tank-top-*`.

## ملاحظات على الريدايركت القديمة

- في ريدايركت بتلف في سلسلة، زي `/products/core-control-set` اللي بيروح على `core-control-set-black-new`، والـ `-new` هو كمان بيروح على handle تاني. في سلة لازم كل مسار قديم يروح **على طول للرابط النهائي** من غير سلسلة.
- `/products/core-control-set-black-new` مالوش ريدايركت في Shopify، يعني 4 ريدايركت بتوصل لرابط ميت: `/products/core-control-set` و`/products/core-control-black-set` و`/ar/products/core-control-set` و`/ar/products/core-control-set-black-new`. المفروض يروحوا على `core-control-set-black`.
- `/ar/products/soft-pyjama-set-new` و`/ar/products/core-control-set-black-new` و`/ar/products/timeless-gym-bag-with-charm-stray-night-blue` بيروحوا لنفس الـ handle من غير `/ar`. ده من أيام ما كان العربي على `/ar/`.
- فيه روابط `/policies/...` (زي refund-policy) بيستخدمها Shopify بس مش ظاهرة في الـ API ده. ضيفيها لو ظهرت في Search Console.

## الخطوات

1. **استيراد المنتجات لسلة.** استخدمي `product-seo.csv` عشان عنوان ووصف الـ SEO، و`product-content.csv` للمميزات والعناية والمكمّلات وجداول المقاسات.
2. **ملء `new_salla_url`** في `shopify-urls.csv`. لكل صف نكتب الرابط الفعلي اللي سلة طلّعته بعد الاستيراد. ماتخمّنيش شكل روابط سلة، اكتبي اللي اتعمل فعلًا. والمنتجات الـ DRAFT اللي مش هتتنقل نوديها على أقرب كولكشن.
3. **إضافة الـ 301** في إعدادات إعادة التوجيه في سلة **قبل تحويل الـ DNS**: كل صفوف `shopify-urls.csv` (العربي و`/en/`)، ومعاها مسارات `shopify-existing-redirects.csv` بعد ما نوجهها للرابط النهائي على طول.
4. **التحقق من Search Console**: نطابق تقرير الصفحات المفهرسة مع الجدول، ونرفع الـ sitemap الجديد، ونتابع أخطاء 404 أول أسبوعين بعد التحويل.
