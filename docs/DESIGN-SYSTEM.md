# UNIX Design System — v1.0

> المرجع الوحيد لأي قرار تصميم في ثيم يونكس على سلة.
> أي قيمة مش موجودة هنا **ماتتكتبش في الكود**. لو محتاجها ضيفها هنا الأول، وبعدين في `unix-tokens.scss`.
> **المرجع الحقيقي للأصل:** `reference/shopify-theme/` (تصدير ثيم unix.sa، للقراية بس، شوف `reference/README.md`) هو الـ ground truth للمحتوى وترتيب السكاشن والسلوك. الفروقات المقصودة في §12 بتكسب عليه.

**الاتجاه:** *Quiet Luxury — Editorial Activewear.*
هادي وواثق ومساحاته واسعة. الصورة هي البطل، والواجهة بتتراجع لورا. مستوحى من ثيم شوبيفاي الحالي (`docs/SPEC.md`)، بس **أرقى** بتلات حاجات:

1. مساحات بيضا أكتر.
2. ألوان أقل وأهدى.
3. حركة أنعم.

---

## 0. المبادئ

| # | المبدأ | معناه عمليًا |
|---|---|---|
| P1 | **الصورة أولًا** | صور المنتجات واللايف ستايل تاخد أكبر مساحة. مافيش إطارات ولا ظلال على الصور. |
| P2 | **الهدوء = الفخامة** | لون accent واحد بس في الشاشة. مافيش أحمر صارخ ولا badges كتير. |
| P3 | **العربي أصل مش ترجمة** | التصميم بيتعمل RTL الأول، والإنجليزي هو اللي بيتعكس. |
| P4 | **كل رقم من النظام** | المسافات والأحجام والألوان من الـ tokens بس. ممنوع أي قيمة سحرية (magic number). |
| P5 | **الحركة بتشرح، مش بتزيّن** | كل animation ليها سبب: feedback، أو انتقال، أو توجيه للعين. |
| P6 | **متاح للكل** | تباين AA كحد أدنى، ولمس بحجم 44px، وكيبورد كامل. **استثناءات مقصودة لمطابقة unix.sa، كلها فوق حد WCAG 2.5.8 (24px):** لينكات شريط الإعلانات 40px (D10). *(زراير AR/EN بقت 44 × 44 بمساحة لمس شفافة من 6.4، D114 اتقفل، §8.7)* |
| P7 | **ترتيب التاب = ترتيب العين** | أي `order` أو `display: contents` يغيّر الترتيب الظاهر لازم ترتيب التاب يفضل نفس ترتيب العين (WCAG 2.4.3)؛ غير كده استثناء بـ D-number. |

---

## 1. الألوان

### 1.1 Primitives (القيم الخام)

| Token | Hex | الاستخدام |
|---|---|---|
| `--unix-ink-900` | `#241e1a` | النص الأساسي |
| `--unix-ink-700` | `#373542` | الأزرار جوه سكاشن scheme «Cream» و«Sand» (§1.4)، و brand ink |
| `--unix-ink-600` | `#4b4960` | hover الأزرار دي |
| `--unix-navy-900` | `#1c313d` | **الزرار الأساسي** على الأبيض، وأيقونات الهيدر ولينكاته، زي `colors_solid_button_background` في scheme الـ root بتاع unix.sa (`background-1`) *(6.4، D116)* |
| `--unix-navy-700` | `#395361` | hover الزرار الأساسي (`colors_solid_button_background_hover`) *(6.4، D116)* |
| `--unix-cream-200` | `#f2eccd` | نص الزرار الأساسي (`colors_solid_button_labels`) *(6.4، D116)* |
| `--unix-stone-600` | `#736a63` | النص الثانوي *(أغمق من الـ #8a8079 القديم عشان التباين)* |
| `--unix-stone-700` | `#6b625b` | الـ placeholder جوه الحقول *(أُضيف في المرحلة 1: stone-600 على input تباينه 4.41)* |
| `--unix-taupe-700` | `#6f5c44` | الـ accent لما يبقى نص أو لينك |
| `--unix-taupe-500` | `#8b7355` | الـ accent في الأشكال: النجوم، والـ focus ring، والـ progress |
| `--unix-sand-300` | `#d8c5b8` | خلفيات scheme «Sand»: `--c-surface-sand` (التوكن العام)، والهيرو من خلال الـ alias `--c-hero-bg` (§13.1) |
| `--unix-sand-200` | `#e8e0d5` | سطح ثانوي، و hover للـ tertiary |
| `--unix-line` | `#ddd3c6` | البوردرات والفواصل |
| `--unix-input` | `#efeae1` | خلفية الحقول |
| `--unix-cream-50` | `#f5f1ea` | خلفية سكاشن scheme «Cream» بتاعة unix.sa (`--c-bg-cream`): الفوتر، وسكاشن الهوم، و«اختيارات تناسبك»، و«قد يعجبك أيضًا»، وشارات الكارت. *(كانت الخلفية الأساسية لحد 6.4، D109)* |
| `--unix-paper` | `#fbf9f5` | سطح مرفوع: الدرج، والمودال، والكارت وقت الـ hover |
| `--unix-white` | `#ffffff` | **الخلفية الأساسية** (`--c-bg`): الهيدر والصفحات، زي scheme الـ root في unix.sa (`background-1`: 255,255,255) *(6.4، D109)* |
| `--unix-grey-100` | `#e9e9e9` | panel رمادي وزرار ثانوي على الأبيض (`--c-panel`)، زي `--color-background-secondary` و `--color-button-secondary` في unix.sa *(6.4)* |
| `--unix-grey-200` | `#dfdfdf` | hover الزرار الثانوي ده (`--c-panel-hover`)، زي `--color-button-secondary-hover` *(6.4)* |
| `--unix-slate-500` | `#778899` | حلقة لون الموديل الحالي (`--c-swatch-ring`، §8.28)، زي بوردر `mpg-swatch__option` المختار في unix.sa (rgb 119,136,153) *(6.4، D133)* |
| `--unix-announce` | `#363441` | خلفية شريط الإعلانات |
| `--unix-announce-text` | `#f3eeea` | نص شريط الإعلانات (scheme «Ink» في SPEC §2) |
| `--unix-success` | `#2f5d46` | التوفر، و«مقترح» والثقة العالية في الـ Size Finder (عن طريق `--c-success`) |
| `--unix-danger` | `#b3261e` | الأخطاء، والخصم *(بحذر)* |

### 1.2 Semantic (الاستخدام في الكود)
الكود **بيستخدم الـ semantic بس**، مش الـ primitives.

| Semantic | → Primitive |
|---|---|
| `--c-bg` | **white** *(خلفية الصفحة؛ كانت cream-50 لحد 6.4، D109)* |
| `--c-bg-cream` | cream-50 *(سكاشن scheme «Cream» في unix.sa بالظبط: الفوتر وشريط الثقة، و«المفضلة دائما»، و«اختاري قطعتك المفضلة» وكارتها، والفيديوهين، و«من عالم UNIX»، والأسئلة الشائعة، و«اختيارات تناسبك» في السلة، و«قد يعجبك أيضًا» في صفحة المنتج، وشارات وزرار الإضافة فوق صورة الكارت. «أكملي الإطلالة» أبيض زي الأصل. D109)* |
| `--c-panel` / `--c-panel-hover` | grey-100 / grey-200 *(panel السلة الفاضية وزرار «مواصلة التسوق»، 6.4)* |
| `--c-swatch-ring` | slate-500 *(حلقة `--line-w` حوالين دايرة لون المنتج الحالي في ألوان الموديل، §8.28؛ 3.6:1 على الأبيض. D133)* |
| `--c-text-on-panel` | stone-700 *(النص الثانوي على `--c-panel`؛ stone-600 تباينه 4.36 مايعديش، 6.4)* |
| `--c-surface` | paper |
| `--c-surface-muted` | sand-200 |
| `--c-text` | ink-900 |
| `--c-text-muted` | stone-600 |
| `--c-text-inverse` | cream-50 |
| `--c-action` | **navy-900** *(كان ink-700 لحد 6.4؛ جوه سكاشن Cream/Sand بيرجع ink-700، §1.4، D116)* |
| `--c-action-hover` | **navy-700** *(جوه Cream/Sand: ink-600)* |
| `--c-on-action` | **cream-200** *(النص والأيقونات فوق `--c-action`: الزرار الأساسي، والتاب النشط، وعدد السلة، والـ badges؛ جوه Cream/Sand: cream-50. D116)* |
| `--c-accent` | taupe-500 |
| `--c-accent-text` | taupe-700 |
| `--c-border` | line |
| `--c-field` | input |
| `--c-price-sale` | danger |
| `--c-price-old` | stone-600 + line-through |
| `--c-placeholder` | stone-700 *(placeholder على `--c-field`)* |
| `--c-success` | success *(التوفر، و«مقترح» في الـ Size Finder، ومبالغ الإضافة في المحفظة §8.48؛ اتسجّل هنا في 6.1)* |
| `--c-scrim` | `linear-gradient(to top, rgb(36 30 26 / .55), transparent 60%)` *(التدرّج الغامق تحت النص فوق الصور، §8.1، §8.14؛ اتسجّل هنا في 6.1؛ «جديد من يونكس» مابقاش بيستخدمه من D122)* |
| `--c-backdrop` | `rgb(36 30 26 / .32)` *(خلفية الدرج والمودال، §5 «Drawer»، §8.9؛ اتسجّل هنا في 6.1)* |
| `--c-announce` | announce *(خلفية شريط الإعلانات، أُضيفت في المرحلة 1)* |
| `--c-announce-text` | announce-text `#f3eeea` *(نص شريط الإعلانات)* |
| `--c-hover-tint` | `color-mix(currentColor 8%, transparent)` *(خلفية الـ hover لأزرار الأيقونات، بتمشي مع الهيدر العادي والشفاف)* |
| `--c-press-tint` | `color-mix(currentColor 14%, transparent)` *(حالة الـ active لنفس الأزرار)* |
| `--c-border-overlay` | `color-mix(ink-700 18%, transparent)` *(خط الهيدر الشفاف فوق الهيرو، unix.sa `--color-border: 55,53,66,.18` في `section-media-banner.css`، §8.7؛ 6.4)* |

توكنز المرحلة 2 الجديدة (`--c-surface-sand`، و `--c-hero-bg`، و `--c-text-brand`، و `--c-overlay`، و `--c-hero-scrim`) في §13.1. (`--c-scrim-top` اتشال في 6.4، D122.)

### 1.3 التباين (اتقاس بمعادلة WCAG)

| النص / الخلفية | النسبة | الحكم |
|---|---|---|
| ink-900 / cream | 14.6 | ✅ AAA |
| ink-700 / cream | 10.7 | ✅ AAA |
| stone-600 / cream | 4.7 | ✅ AA |
| taupe-700 / cream | 5.7 | ✅ AA |
| stone-700 / input (`--c-placeholder` / `--c-field`) | 4.97 | ✅ AA |
| ~~stone-600 / input~~ | 4.41 | ❌ مايتستخدمش جوه الحقول |
| ~~stone-600 / sand-200~~ | 4.0 | ❌ النص الثانوي بيبقى `--c-text` على خلفية الـ hover |
| announce-text / announce | 10.6 | ✅ AAA |
| ink-700 / sand-300 (`--c-text-brand` / `--c-surface-sand`) | 7.2 | ✅ AAA |
| ~~#8a8079 / cream~~ | 3.4 | ❌ اتشال |
| ink-900 / white (`--c-text` / `--c-bg`) | 16.5 | ✅ AAA *(6.4، D109)* |
| ink-700 / white (`--c-action`) | 12.0 | ✅ AAA *(6.4)* |
| stone-600 / white (`--c-text-muted` / `--c-bg`) | 5.3 | ✅ AA *(6.4)* |
| taupe-700 / white (`--c-accent-text`) | 6.4 | ✅ AA *(6.4)* |
| حلقة الفوكس taupe-500 / white (`--c-accent` / `--c-bg`) | 4.5 | ✅ 3:1 *(6.4)* |
| ink-900 / grey-100 (`--c-text` / `--c-panel`) | 13.6 | ✅ AAA *(6.4)* |
| stone-700 / grey-100 (`--c-text-on-panel` / `--c-panel`) | 4.9 | ✅ AA *(6.4)* |
| ~~stone-600 / grey-100~~ | 4.36 | ❌ → `--c-text-on-panel` *(6.4)* |
| ink-700 / grey-100 (زرار AR/EN غير النشط 12px، لحد D116) | 9.9 | ✅ AAA *(6.4؛ كان `--c-text-muted` 4.36 ❌)* |
| cream-200 / navy-900 (`--c-on-action` / `--c-action`، الزرار الأساسي) | 11.3 | ✅ AAA *(6.4، D116)* |
| cream-200 / navy-700 (الزرار وقت الـ hover) | 6.8 | ✅ AA *(6.4، D116)* |
| navy-900 / white (`--c-action` كنص: أيقونات ولينكات الهيدر) | 13.5 | ✅ AAA *(6.4، D116)* |
| navy-900 / grey-100 (`--c-action` / `--c-panel`، زرار AR/EN غير النشط 12px) | 11.1 | ✅ AAA *(6.4، D116)* |
| navy-900 / cream-50 | 12.0 | ✅ AAA *(6.4، D116)* |
| cream-50 / ink-700 (`--c-on-action` / `--c-action` جوه Cream/Sand) | 10.7 | ✅ AAA *(6.4)* |
| حلقة الفوكس taupe-500 / navy-900 | 3.01 | ✅ 3:1 بالعافية؛ الحلقة بتتحط برا الزرار على خلفية الصفحة. **ممنوع** حلقة بـ offset داخلي (inset) فوق خلفية navy *(6.4)* |
| حلقة الفوكس taupe-500 / grey-100 (`--c-accent` / `--c-panel`) | 3.7 | ✅ 3:1 *(6.4)* |
| slate-500 / white (`--c-swatch-ring` / `--c-bg`، حلقة اللون الحالي §8.28) | 3.6 | ✅ 3:1 *(6.4، D133)* |
| slate-500 / cream-50 (`--c-swatch-ring` / `--c-bg-cream`) | 3.2 | ✅ 3:1 *(6.4، D133)* |
| taupe-500 / white، حلقة الفوكس على الصفحة (دواير ألوان الموديل §8.28) | 4.49 | ✅ (≥3:1) *(6.4، D133)* |
| border-overlay / white (الخط الداخلي على دواير الألوان الفاتحة §8.28) | ≈1.4 | ⚠️ **استثناء (6.4، D133):** خط رفيع على الدواير الفاتحة زي unix.sa؛ اسم اللون في `aria-label`/`title` بتوع اللينك وفي label «اللون:» |
| ink-900 / grey-200 (hover الزرار `--c-panel-hover`) | 12.4 | ✅ AAA *(6.4)* |
| ~~taupe-500 كنص~~ | 4.0 | ❌ للأشكال بس |
| أبيض / sand-300 | 1.7 | ❌ **نص الهيرو لازم scrim** (§8.1) |
| cream / صورة «جديد من يونكس» تحت `--c-overlay` 30–60% | حسب الصورة | ⚠️ **استثناء (6.4، D122):** من غير scrims زي unix.sa، فـ AA للعنوان ونص الكروت مش مضمون على الصور الفاتحة. الحماية: أقل opacity 30%، والتاجر مسؤول يختار صورة غامقة كفاية أو يعلّي التعتيم. لازم فحص على كل صورة جديدة |
| stone-600 / paper (`--c-text-muted` / `--c-surface`) | 5.0 | ✅ AA (النص الثانوي جوه الـ panels والكروت) *(6.3)* |
| success / paper (`--c-success` / `--c-surface`) | 7.2 | ✅ AAA (مبالغ الإضافة في المحفظة §8.48، و«مقترح») *(6.1)* |
| danger / paper (`--c-price-sale` / `--c-surface`) | 6.2 | ✅ AA (الخصم والسعر المخفّض ومبالغ الخصم في المحفظة) *(6.1)* |
| حلقة الفوكس taupe-500 / cream (`--c-accent` / `--c-bg`) | 4.0 | ✅ (حد العناصر غير النصية 3:1، WCAG 1.4.11) *(6.3)* |
| حلقة الفوكس taupe-500 / paper (`--c-accent` / `--c-surface`) | 4.3 | ✅ 3:1 *(6.3)* |
| حلقة الفوكس taupe-500 / sand-200 (`--c-accent` / `--c-surface-muted`) | 3.4 | ✅ 3:1 *(6.3)* |
| ~~حلقة الفوكس taupe-500 / sand-300~~ (`--c-accent` / `--c-surface-sand`) | 2.69 | ❌ → الحلقة فوق `--c-surface-sand` بلون `--c-text-brand` (7.2) *(6.3، `unix-collections-grid.scss`)* |

---


### 1.4 Color schemes: الزرار الأساسي حسب الـ scheme (6.4، D116)
unix.sa بيلوّن الزرار الأساسي حسب scheme السكشن (`config/settings_data.json`):
- **scheme الـ root (`background-1`، أبيض) والسكاشن اللي مالهاش scheme** (صفحة المنتج، والسلة، والتصنيف، والحساب، والهيدر، ودرج السلة والمنيو): خلفية `#1c313d` ونص `#f2eccd`، و hover `#395361` ← `--c-action` navy-900 / `--c-on-action` cream-200 / `--c-action-hover` navy-700.
- **scheme «Cream» (`scheme-29a5b044…`) و«Sand» (`scheme-7a3489a3…`)**: خلفية `#373542` ونص `#f5f1ea`، و hover `#4b4960`. التاب النشط في «المفضلة دائما» (`button--secondary` = `colors_outline_button_labels` `#373542` ونص `colors_secondary_button_labels` `#f5f1ea`) من نفس العيلة.
- **في الكود:** `unix-tokens.scss` بيرجّع `--c-action` / `--c-action-hover` / `--c-on-action` (وعيلة `--color-primary` بتاعة سلة) لـ ink-700 / ink-600 / cream-50 على الـ root بتاع كل سكشن Cream/Sand: `.unix-hero`، `.unix-offer`، `.unix-ptabs` (التابات و«اختيارات تناسبك»)، `.unix-collection-overlay`، `.unix-collections-grid`، `.unix-fprods`، `.unix-video-tiles`، `.unix-blog`، `.unix-faq`، `.unix-footer`، `.unix-trust`، `.unix-recs`. أي سكشن Cream/Sand جديد يتضاف للقايمة دي.
## 2. التايبوجرافي

### 2.1 العائلات
| الدور | عربي | إنجليزي |
|---|---|---|
| Display / Headings | **Somar Bold** (700–800)، والبديل IBM Plex Sans Arabic 700 | Open Sans 600 |
| Body / UI | **IBM Plex Sans Arabic** (300/400/500/700) | Open Sans (400/600) |
| أرقام وأسعار | IBM Plex Sans Arabic، مع `font-variant-numeric: tabular-nums` | نفسه |

- **عائلات الخط (tokens):** `--f-body` (= `--font-main`: IBM Plex Sans Arabic في العربي و Open Sans في الإنجليزي، من `master.twig`) و `--f-heading` (`"Somar", var(--font-main)`). العناوين `h1`–`h4` وزنها `--fw-bold` في العربي و `--fw-semibold` في الإنجليزي (Open Sans 600، الجدول اللي فوق) *(6.1)*.
- **أوزان الخط (tokens، المرحلة 3.8):** `--fw-regular` 400، و `--fw-medium` 500، و `--fw-semibold` 600، و `--fw-bold` 700. IBM Plex Sans Arabic محمّل 300/400/500/700 بس (مافيهوش 600)، و Somar وزن Bold واحد، فأي 600 في الأصل على الخطوط دي بيبقى `--fw-bold`. Open Sans (الإنجليزي) فيه 600. `--fw-semibold` بيرجع لـ 700 في العربي (مافيش وش 600)، ومستخدم في الـ Size Finder (3.3).
- Somar بيتحمّل بـ `font-display: swap` و `unicode-range` على الحروف العربي بس، فالحروف اللاتيني في العناوين بتروح للخط اللي بعده.

### 2.2 المقياس (fluid، الأساس 16px، النسبة 1.25)

| Token | الحجم (mobile → desktop) | Line-height | الاستخدام |
|---|---|---|---|
| `--t-display` | `clamp(40px, 6vw + 16px, 88px)` | 1.2 | عنوان الهيرو |
| `--t-h1` | `clamp(32px, 3.5vw + 16px, 56px)` | 1.25 | عنوان الصفحة |
| `--t-h2` | `clamp(26px, 2.6vw + 14px, 44px)` | 1.3 | عنوان السكشن |
| `--t-h3` | `clamp(20px, 1.2vw + 14px, 28px)` | 1.35 | اسم المنتج في صفحته |
| `--t-h4` | `18px → 20px` | 1.4 | عناوين الكروت والأكورديون |
| `--t-body-lg` | `17px → 18px` | 1.75 | وصف المنتج |
| `--t-body` | `15px → 16px` | 1.7 | النص العادي |
| `--t-small` | `13px → 14px` | 1.6 | الـ meta والـ helper |
| `--t-micro` | `12px` | 1.5 | الـ badges والـ eyebrow (+0.04em للإنجليزي بس) |
| `--t-section` | `clamp(24px, 3.9vw + 15.5px, 46px)` | 1.3 | عناوين سكاشن الهوم و«اختيارات تناسبك» في السلة، زي `custom-arabic-headings.css` في unix.sa (`clamp(2.4rem, 1.55rem + 3.9vw, 4.6rem)` على `.popular-products__title` و `.featured-collections__heading` و `.featured-blog__title` و `.collapsible-content__heading` و `.banner-grid__heading`): 24 (390) ← 46px (من حوالي 780). *(6.4)* |
| `--t-card` | `clamp(12px, .5vw + 10px, 14px)` | 1.4 | سطور كارت المنتج (العلامة، والاسم، والسعر)، زي unix.sa (`.card__title` و `.price`: `1.06 × 1.1rem` = 11.7px تحت 750 و `1.06 × 1.3rem` = 13.8px من 750، و `.card__vendor` `body-small`). الـ clamp بيدّي 12 (390) و 13.8 (768) و 14 (1024+) *(6.4)* |
| `--t-page-title` | `clamp(22px, .875vw + 19px, 33px)` | 1.3 | عنوان بانر التصنيف و«سلة التسوق» (`.unix-size-page-title`)، زي `title--page h2` في unix.sa: 22.4 ← 26 (750) ← 30.7 (1360) ← 33px (1600). الـ clamp بيدّي 22.4 (390) و 25.7 (768) و 31 (1366) و 33 (1600) *(6.4)* |
| `--t-h2-shop` | `22.4px` ← `26px` (750) ← `30.7px` (1360) ← `33px` (1600) | 1.32 | عناوين السكاشن اللي unix.sa بيديها `.h2` بس (مش العناوين اللي ليها clamp في `custom-arabic-headings.css`): «إجابات لكل تفصيلة» (`collapsible-content__title h2`) و«اختاري قطعتك المفضلة…» (`featured-products__title h2`). نفس `.h2` في `base.css` بالظبط: `1.18 × 1.9 / 2.2 / 2.6 / 2.8rem` عند نفس الـ breakpoints (درجات، مش clamp). *(6.4، D119)* |
| `--t-section-sm` | `21px` | 1.3 | عنوان «المفضلة دائما» تحت 750، زي الـ CSS الـ inline بتاع السكشن في unix.sa (`.popular-products__title {font-size: 21px; text-align: center}` تحت 750). من 750 `--t-section`. *(6.4، D119)* |

**قواعد:**
- `h1`–`h4` بياخدوا حجمهم من الجدول ده (`.theme-unix hN`، أقوى من utilities الـ Tailwind زي `text-xl`). لو مستوى العنوان اتغيّر عشان الـ SEO (§14) والشكل لازم يفضل زي ما هو: `.unix-size-h1` / `.unix-size-h2` (نفس `--t-h1` / `--t-h2` بنفس الـ line-height) *(أُضيفت في 3.11)*.
- العربي: `letter-spacing: 0` دايمًا. ممنوع uppercase.
- الإنجليزي: العناوين `-0.01em`، والـ eyebrow uppercase `+0.08em`.
- طول السطر: من 45 لـ 75 حرف (`max-width: 65ch`) لأي فقرة.
- على الموبايل العناوين بتاخد `text-wrap: balance`.

---

## 3. المسافات والجريد

### 3.1 Spacing (شبكة 4px)
`--s-1: 4` · `--s-2: 8` · `--s-3: 12` · `--s-4: 16` · `--s-5: 24` · `--s-6: 32` · `--s-7: 48` · `--s-8: 64` · `--s-9: 96` · `--s-10: 128` (px)

### 3.2 مسافات السكاشن (fluid)
| Token | القيمة | الاستخدام |
|---|---|---|
| `--section-sm` | `clamp(40px, 5vw, 64px)` | السكاشن المتلاصقة |
| `--section-md` | `clamp(64px, 8vw, 112px)` | **الافتراضي** |
| `--section-lg` | `clamp(96px, 11vw, 160px)` | قبل وبعد السكاشن الافتتاحية |

**ملاحظة (المرحلة 2): ربط presets الـ padding بتاعة شوبيفاي** (`snippets/section-padding.liquid`، الـ rem هناك = 10px): `s` و `m` ← `--section-sm` (§8.15، §8.16). `l` (40 / 80 من 750 / 112 من 1440) ← `--section-sm` تحت 750 و `--section-md` من 750 (§8.17).

### 3.3 الجريد
| Breakpoint | العرض | الأعمدة | الـ Gutter | الـ Margin |
|---|---|---|---|---|
| `xs` | < 576 | 4 | 8 | 20 |
| `sm` | ≥ 576 | 8 | 16 | 20 |
| `md` | ≥ 768 | 8 | 20 | 20 |
| `lg` | ≥ 1024 | 12 | 24 | 20 |
| (1200) | ≥ 1200 | 12 | 24 | 32 |
| `xl` | ≥ 1440 | 12 | 32 | 32 |

- أقصى عرض للمحتوى `1440px`. الصور الـ full-bleed بتكسر الجريد عن قصد.
- **Tokens (6.1، كانت في الكود ومش مكتوبة هنا):** `--content-max` = 1440px (أقصى عرض للمحتوى، `.unix-container`)، و `--gutter` (عمود الـ Gutter في الجدول: 8 → 32px حسب الـ breakpoint)، و `--page-margin` (عمود الـ Margin). تحت 576 القيم 8 / 20 زي unix.sa بالقياس (6.4، كانت 12 / 16). **الـ Margin (6.4، D118):** زي `.container` في unix.sa بالظبط: 20px تحت 1200 و 32px من 1200 (`base.css`: `padding 2rem` ← `3.2rem` من 1200)، من غير درجات 24 / 40 / 64 القديمة. القيم بتتغيّر في `unix-tokens.scss` عند نفس الـ breakpoints.
- جريد المنتجات: عمودين على الموبايل، و3 على md، و4 على lg.

### 3.4 ارتفاعات ثابتة (Layout)
الارتفاعات الثابتة (`--announce-h` 40px لشريط الإعلانات على الديسكتوب والموبايل، و `--header-h`) متعرّفة مرة واحدة في جدول الـ component tokens في §4.1.

---

## 4. الشكل والعمق

| Token | القيمة | الاستخدام |
|---|---|---|
| `--r-xs` | 2px | مربعات التحكم فوق صورة كارت المنتج: الـ badge، وأيقونة الإضافة السريعة، وقلب المفضلة (§8.3، §8.4؛ زي unix.sa، اتضاف في 6.4) |
| `--r-sm` | 8px | الحقول، والـ chips، والـ swatches |
| `--r-md` | 16px | الكروت، والصور، والبنرات |
| `--r-lg` | 24px | المودال، والدرج (الركن الداخلي بس). المودال اللي بيملا الشاشة على الموبايل (زي الـ Size Finder تحت md) من غير حواف |
| `--r-pill` | 999px | الأزرار، والـ badges، والـ toggles، ودواير ألوان الموديل وأزرارها النصية (§8.28، 6.4، D133) |
| `--e-0` | none | الافتراضي، لأن الفخامة flat |
| `--e-1` | `0 1px 2px rgb(36 30 26 / .04), 0 4px 16px rgb(36 30 26 / .04)` | الهيدر الـ sticky |
| `--e-2` | `0 8px 40px rgb(36 30 26 / .10)` | الدرج، والمودال، والـ dropdown |

الظل **ماينفعش يتحط على الصور**. البوردر 1px من `--c-border` بس.

### 4.1 مقاسات الكومبوننتس (Component tokens) — *أُضيفت في المرحلة 1*
القيم دي موجودة أصلًا في مواصفات §8، اتحولت لـ tokens عشان الكود مايكتبش أرقام خام.

| Token | القيمة | الاستخدام |
|---|---|---|
| `--announce-h` | 40px | ارتفاع شريط الإعلانات، ديسكتوب وموبايل (SPEC §2، §8.6) |
| `--header-h` | 60px (كل المقاسات) | ارتفاع الهيدر (§8.7). زي unix.sa (`.header {min-height: 6rem}` في كل المقاسات)؛ كان 72px من lg لحد 6.4 |
| `--o-hover` | .6 | الـ hover على أيقونات الهيدر واللينكات اللي من غير خلفية (unix.sa `.header__icon:hover {opacity: .6}`) (§8.7) *(6.4)* |
| `--lang-pad` / `--lang-gap` / `--lang-btn-pad-block` / `--lang-btn-pad-inline` | 3px / 2px / 5px / 9px (7px تحت 576) | حبّة AR/EN في الهيدر، زي `custom-language-mobile.css` في unix.sa (`padding: .3rem`، والزرار `.5rem .9rem` و `.5rem .7rem` تحت 576، و `gap: .2rem` = `--lang-gap` 2px). الحبّة كلها حوالي 74 × 28px (§8.7) *(6.4)* |
| `--lang-chip-w` | 30px (34px من 576) | أقل عرض لكل زرار في حبّة AR/EN = عرضه الطبيعي (النص + `--lang-btn-pad-inline`)، عشان حساب مساحة اللمس يبقى ثابت (§8.7) *(6.4، D114)* |
| `--lang-hit-out` | `calc(var(--tap) - var(--lang-chip-w) - var(--lang-pad) - var(--lang-gap) / 2)` (10px تحت 576، و 6px من 576) | قد إيه مساحة لمس كل زرار AR/EN بتطلع برا الحبّة، عشان كل واحدة `--tap` عرض (§8.7) *(6.4، D114)* |
| `--drawer-menu-w` | `min(600px, 100vw)` | درج المنيو: الشاشة كلها على الموبايل، و 600px بالكتير (unix.sa `.menu-drawer {width: 100%; max-width: 600px}`) (§8.9) *(6.4)* |
| `--pdp-info-max` | 335px | أقصى عرض لعمود معلومات المنتج من lg (unix.sa `.product__info-container {max-width: 33.5rem}` من 990) (§8.21) *(6.4)* |
| `--pdp-media-share` / `--pdp-info-share` | 62fr / 38fr | تقسيم صفحة المنتج من lg: الجاليري ~62% وعمود المعلومات ~38% والمعلومات في نصه بـ `--pdp-info-max` (unix.sa على 1366: جاليري 753px وعمود 461px والمعلومات 335px) (§8.20) *(6.4)* |
| `--pdp-max` | 1215px | أقصى عرض لتقسيم صفحة المنتج (جاليري + معلومات) من lg، في النص، زي unix.sa (`.product__outer--slider-previews {max-width: 121.5rem; margin: 0 auto}` من 990). على 1366: الجاليري 753px (62%) والصورة الكبيرة حوالي 600 × 900 (2:3) جنب thumbnails 144px (§8.20) *(6.4، D123)* |
| `--logo-w` | 100px → 120px (من 576) | عرض اللوجو (§8.7)؛ تحت 576 زي unix.sa (`.header__heading-logo` max-width 10rem). على 360 اللوجو بيصغر لحوالي 80px (`max-inline-size: 100%` في عمود `minmax(0, 1fr)`) من غير overflow؛ كان حوالي 84 قبل مساحة لمس AR/EN (D114) *(6.4)* |
| `--tap` | 44px | أقل مساحة لمس، وزرار إغلاق الدرج (§0 P6، §8.9) |
| `--swatch-size` / `--swatch-dot` | 48px / 42px | دايرة لون الموديل: مساحة اللمس الدايرية (أكبر من `--tap`، P6) والدايرة الملونة جواها: 2px فراغ جوه بوردر 1px (3px من برا الحلقة)، زي `mpg-swatch-circle` في unix.sa (48 / 42) (§8.28) *(6.4، D133)* |
| `--icon-sm` / `--icon-md` | 20px / 24px | مقاسات الأيقونات (§6) |
| `--btn-h` / `--btn-h-sm` / `--btn-h-lg` | 48 / 40 / 56px | ارتفاع الأزرار (§8.2) |
| `--field-h` | 52px | ارتفاع الحقول (§8.5) |
| `--drawer-w` | `min(440px, 92vw)` | عرض الدرج (§8.9) |
| `--line-w` / `--line-w-strong` / `--ring-w` | 1px / 1.2px / 2px | البوردر، وبوردر الـ outline، وحلقة الفوكس |
| `--blur-backdrop` / `--blur-ghost` | 4px / 6px | خلفية الدرج، والزرار الـ ghost (§5، §8.2) |
| `--o-muted` / `--o-disabled` | .7 / .5 | أيقونات الدفع الرمادي (§8.8)، والحالة المعطلة |
| `--z-header` / `--z-dropdown` / `--z-drawer` | 40 / 45 / 60 | ترتيب الطبقات: الهيدر، بعده الـ mega menu، بعده الدرج والمودال |
| ~~`--z-legacy-offcanvas`~~ | ~~10000~~ | **اتشال في 4.2:** فلاتر المنتجات بقت في درج §8.31 بطبقة `--z-drawer`، و mmenu-light اتشال من الكود |
| `--mega-col-min` | 192px | أقل عرض لعمود لينكات في الـ mega menu (§8.7) |
| `--mega-media-max` | 640px | أقصى عرض لمساحة الصورتين في الـ mega menu (§8.7) |
| `--dropdown-min` | 256px | أقل عرض لقايمة «المزيد» المنسدلة |
| `--footer-col-max` / `--footer-news-max` | 240px / 352px | أقصى عرض لبلوك قايمة في الفوتر ولبلوك النشرة من lg (unix.sa `.footer-block--menu` 24rem و `.footer-block--subscribe` 35.2rem) (§8.8) *(6.4)* |
| `--slider-gap` | 8px → 24px (من lg) | المسافة بين الكروت في سلايدر «المفضلة دائما» و«اختيارات تناسبك» (unix.sa `spaceBetween` 8 ثم 24)؛ أرقام `spaceBetween` في الـ twig نسخة منها (§8.15) *(6.4)* |
| `--trust-max` | 740px | عرض محتوى شريط الثقة، فخط أيقونات الدفع أقصر من خط الفوتر (unix.sa `.unix-trust__inner` 74rem) (§8.8) *(6.4)* |
| `--plp-bar-h` | 48px | ارتفاع شريط الفلاتر والترتيب من 576 (unix.sa 4.9rem، على شبكة 4px) (§8.30) *(6.4)* |
| `--pdp-top` | 40px | المسافة بين الهيدر وصفحة المنتج من md (unix.sa ~41px مقاسة)؛ تحت md صفر (§8.20) *(6.4)* |
| `--cart-empty-max` | 596px | عرض panel السلة الفاضية (unix.sa 59.7rem) (§8.35) *(6.4)* |
| `--panel-pad-lg` | 40px | padding الـ panel الرمادي من 576 (unix.sa 4rem) (§8.35) *(6.4)* |

---

## 5. الحركة

| Token | القيمة |
|---|---|
| `--d-fast` | 150ms (hover، وتغيير اللون) |
| `--d-base` | 280ms (الأزرار، والـ fade) |
| `--d-slow` | 480ms (الدرج، والمودال) |
| `--d-reveal` | 800ms (ظهور الصور مع السكرول) |
| `--d-announce` | 4s (مدة ظهور كل رسالة في شريط الإعلانات قبل ما تتبدل، زي `slide_duration: 4` في الأصل. **مش بيتصفّر** مع reduced-motion لأنه مدة عرض مش حركة) |
| `--d-announce-slide` | 800ms (السلايد العمودي بين رسايل شريط الإعلانات، زي `speed: 0.8` في الأصل. بيتصفّر مع reduced-motion) *(أُضيف في دمج المرحلة 1)* |
| `--ease-out` | `cubic-bezier(.22, 1, .36, 1)` (الأساسي) |
| `--ease-in-out` | `cubic-bezier(.65, 0, .35, 1)` (الدرج) |
| `--ease-announce` | `ease` (السلايد العمودي في شريط الإعلانات بس، زي الـ easing الافتراضي بتاع Swiper في الأصل) *(قرار مؤقت D8)* |
| `--press-y` | 1px (الزرار بينزل سنة صغيرة في حالة الـ active) *(أُضيف في المرحلة 1)* |

**أنماط معتمدة:**
- **Button fill:** لون الـ hover بيطلع من تحت لفوق، `translateY(100%)` لحد `0`، في `--d-base`.
- **Image hover:** `scale(1.04)` في `--d-reveal`، والصورة التانية بتظهر بـ crossfade.
- **Reveal on scroll:** `opacity 0→1` و `translateY(16px)→0`، والعناصر ورا بعض بفرق 60ms، ومرة واحدة بس.
- **Drawer:** بيدخل من **ناحية البداية في RTL** (يعني اليمين)، في `--d-slow` مع `--ease-in-out`، و backdrop `rgb(36 30 26 / .32)` مع `blur(4px)`.
- لازم `@media (prefers-reduced-motion: reduce)` يقفل كل حاجة غير الـ opacity.

---

## 6. الأيقونات والصور

- **الأيقونات:** stroke 1.5px، وحجم 20 أو 24، و `currentColor`. نستخدم `sallaicons` لو فيها الأيقونة، وإلا SVG inline. ممنوع الأيقونات الـ filled.
- **نسب الصور:**
  - كارت المنتج **2:3** (`--ratio-product`، 6.4).
  - صفحة المنتج **2:3** (`--ratio-pdp`، 6.4؛ كانت 4:5).
  - بنر التصنيف **16:9** على الديسكتوب و **4:5** على الموبايل. في «جديد من يونكس» (§8.13) **4:5 أدنى في كل المقاسات** (6.4، D122) زي الأصل: المساحة محجوزة من الأول (مافيش CLS)، والصندوق بيطول لو المحتوى أطول.
  - كارت التصنيف (§8.14) **3:4** زي الأصل (SPEC §4.5).
  - الهيرو **2:3 على الموبايل و 16:9 على الديسكتوب** زي unix.sa (بين 560 و 920px)، أو `100svh` لو التاجر اختار «ملء الشاشة» (§8.1).
- **أسلوب الصور:** إضاءة طبيعية، وخلفيات بيج أو رملي، ومن غير فلاتر قوية. ونفس الخلفية لكل صور الكتالوج.
- `loading="lazy"` لكل الصور ما عدا أول صورة في الهيرو (`fetchpriority="high"`).
- **اللوجو** `loading="eager"` دايمًا. `fetchpriority="high"` على اللوجو بس في الصفحات اللي مالهاش صورة LCP محددة (الهيرو §8.1، وأول صورة في المعرض §8.20، وصفحة التصنيف (أول كارت أو صورة التصنيف)، وصورة المقال أو أول كارت مقال §8.42، وأول صورة في السلة). في الصفحات دي الصورة دي هي اللي تاخدها (ROADMAP 6.2).

---

## 7. RTL واللغتين

- استخدم **logical properties بس**: `margin-inline-start`، `padding-inline`، `inset-inline-end`. ممنوع `left` و `right`.
- الأيقونات اللي ليها اتجاه (أسهم وchevrons) بتتعكس بـ `[dir=rtl] .icon-dir { transform: scaleX(-1) }`. استثناء: سهم CTA الهيرو (§8.1، D128).
- الأرقام: أرقام غربية (0-9) في اللغتين، عشان الأسعار والمقاسات تبقى ثابتة.
  - استثناء: نسبة الكاش باك ونص صلاحيته بالأرقام العربية زي الأصل (§8.25، D65).
- العملة: «ر.س» في العربي و «SAR» في الإنجليزي (بيحل محل `unix-sar.js`).

---

## 8. الكومبوننتس

كل كومبوننت ليه: الوظيفة، والحالات، والـ tokens. **الحالات الإجبارية:** default، hover، focus-visible، active، disabled، loading (لو موجودة).

### 8.1 Hero
الكومبوننت `home.unix-hero` (ROADMAP 2.1 · SPEC §4.1 · `reference/shopify-theme/sections/media-banner.liquid` و `assets/section-media-banner.css` و `templates/index.json`). مطابق لـ unix.sa (D6) مع الفروقات المقصودة في §13.2. التوكنز الجديدة في §13.1.
- **الارتفاع:** زي unix.sa، بنسبة الميديا: **2:3 على الموبايل** (`--hero-ratio`) و **16:9 من 576px وطالع** (`--hero-ratio-wide`)، ومحصور بين `--hero-min-h` (560) و `--hero-max-h` (920). فيه اختيار للتاجر «ملء الشاشة» (`100svh` بنفس الحدود). النسبة محجوزة في الـ CSS قبل ما الميديا تحمّل، فمافيش CLS.
- **الميديا:** فيديو أو صورة، و object-fit cover. لحد ما الميديا تحمّل الخلفية `--c-hero-bg` (sand-300، زي scheme «Sand» في الأصل).
  - صورة للديسكتوب وصورة للموبايل (`<picture>`). **التبديل بين الصورتين (والفيديوهين) عند 750px** زي الأصل (`media="(min-width: 750px)"` في `media-banner.liquid`)، بينما **النسبة** بتتبدل عند 576px زي الأصل برضه (`padding-bottom` الديسكتوب من 576px). يعني بين 576 و 749 صورة الموبايل بتتعرض بنسبة 16:9 و cover، بالظبط زي unix.sa.
  - `srcset` بعروض من فلتر سلة `cdn(width)` (موبايل 480/768/1080، ديسكتوب 1280/1920/2560) و `sizes="100vw"`.
  - لو الهيرو أول كومبوننت في الصفحة: `loading="eager"` و `fetchpriority="high"` ومن غير `decoding="async"` (هي صورة الـ LCP)، غير كده `lazy` و `decoding="async"`.
  - الفيديو (ديسكتوب وموبايل، MP4، زي الأصل) بيتحمّل **بعد** `window.load` عشان مايزاحمش صورة الـ LCP. الصورة بتفضل تحته كـ poster لحد ما يشتغل فعلًا، وبعدين بيظهر بـ fade في `--d-base`.
  - **من غير صورة (حالة no-media):** الخلفية `--c-hero-bg` والنص `--c-text` (ink-900 على sand-300 ≈ 7.2، AAA) **ومن غير scrim**، لأن الـ cream على sand تباينه 1.7. لو فيه فيديو بس، الحالة دي بتفضل لحد ما الفيديو يشتغل فعلًا (`is-video-playing`)، وبعدين النص بيرجع cream والـ scrim بيظهر. ومع reduced-motion أو Save-Data الفيديو مابيشتغلش، فبتفضل no-media.
  - الفيديو مابيتحمّلش خالص مع `prefers-reduced-motion` أو `Save-Data`، والصورة بتفضل.
  - زرار إيقاف/تشغيل للفيديو `--tap` (44px) تحت ناحية النهاية، وبيظهر بس لما الفيديو يشتغل. الـ label ثابت («أوقفي الفيديو مؤقتًا») و `aria-pressed="true"` لما الفيديو واقف، والأيقونة بتتبدل. الفيديو بيقف لوحده لما الهيرو يخرج من الشاشة ويرجع لما يرجع (لو الزائرة ماوقفتهوش بإيدها).
- **Scrim إجباري** (لما فيه ميديا) فوق الميديا وتحت النص: `--c-hero-scrim` (§13.1)، نفس فكرة `--c-scrim` (غامق .55 تحت) بس ممتد لـ 85% من الارتفاع بدل 60%، عشان على الموبايل (2:3) النص بيوصل لحوالي 64% من الارتفاع ولازم يفضل كله فوق التدرّج.
- **المحتوى** في ناحية البداية تحت (`bottom-left` في الأصل = يمين تحت في RTL)، و `max-inline-size: 65ch`. الـ padding تحت دايمًا `max(--section-md, --s-9)` عشان المحتوى مايتداخلش مع سهم السكرول ولا زرار الفيديو (الاتنين في أسفل الهيرو). اللون `--c-text-inverse` **من غير opacity** (§13.2)، و `--c-text` في حالة no-media.
  - الترتيب: eyebrow (`--t-micro`، uppercase و +0.08em في الإنجليزي بس) ← العنوان (`--t-display`؛ h1 لأول هيرو فيه عنوان وإلا h2، §14) ← نص (`--t-body`) ← CTA.
  - المسافة بين العناصر `--s-3` (زي الأصل 1.2rem)، وقبل الـ CTA `--s-5` (زي الأصل 2.4rem).
- **CTA:** underline (الافتراضي، زي unix.sa) أو ghost pill. من غير رابط الـ CTA مابيظهرش (مافيش لينكات ميتة).
  - **underline:** `--t-body`، وخط `--line-w` كامل تحته، وسهم → (`--icon-sm`) **مش بيتعكس** في RTL، زي هيرو unix.sa العربي (6.4، D128؛ استثناء من قاعدة `.icon-dir`). مع الـ hover/focus الخط بيقصر لـ `--hero-cta-line` (55%) من ناحية البداية (سلوك الأصل)، والسهم بيتحرك `--s-1` ناحية اتجاهه (→) في الاتجاهين، في `--d-base`. ارتفاع اللمس `--tap`. الـ active زي الـ hover.
  - **ghost:** `.unix-btn.unix-btn--ghost` (§8.2) بلون cream؛ مع الـ hover/focus/active بيتملي `--c-text-inverse` والنص `--c-action`.
  - حلقة الفوكس جوه الهيرو `--ring-w` بلون `currentColor` (cream)، لأن الـ taupe تباينه ضعيف على الصورة.
- **الظهور:** CSS بس من غير JS (فمافيش وميض ولا تأخير على الـ LCP): `opacity 0→1` و `translateY(var(--s-4))→0` في `--d-reveal` مع `--ease-out`، والعناصر ورا بعض بفرق `--d-stagger` (60ms، §5). مع reduced-motion الحركة بتتقفل.
- **سهم السكرول** (زي الأصل، اختياري ومفعّل افتراضيًا): زرار `--btn-h` (48px) في النص تحت على بعد `--s-5`، فيه chevron (`--icon-md`) بيتهز `--s-2` كل `--d-hint`، ومن غير هزّ مع reduced-motion. بيختفي بعد أول سكرول، والضغط عليه بيودّي للسكشن اللي بعده. بيظهر بس لما الـ JS يشتغل.
- **الهيدر فوقه شفاف، من غير أي layout shift (6.4، D113):** `data-header-overlay` بيطلع من السيرفر لما: الهيرو أول كومبوننت (`position == 0`)، وحقل `header_overlay` وإعداد الثيم `unix_header_transparent_home` مش مقفولين (الاتنين مفعّلين افتراضيًا، و null = ماتحفظش = مفعّل)، وفيه **صورة أو فيديو** (فيديو بس زي unix.sa). الهيدر فوق الهيرو بيفضل بلوجو وأيقونات غامقة زي الأصل (§8.7)، فمافيش مشكلة تباين على الـ sand قبل ما الفيديو يشتغل.
  - **السحب لتحت الهيدر في الهيرو نفسه:** `.unix-hero[data-header-overlay] { margin-block-start: calc(var(--header-h) * -1) }`، متعمل في الـ HTML من الأول، فمافيش قفزة. الهيدر مابقاش بيغيّر الـ layout خالص.
  - **ألوان الهيدر الشفاف** بتتطبق بالـ CSS من غير JS: `body:has([data-header-overlay]) .unix-header[data-overlay-capable]`، والـ class `.is-overlay` اللي الـ JS بيحطه بقى fallback للمتصفحات اللي مابتدعمش `:has()` (بيغيّر ألوان بس، مش layout).

### 8.2 Button
| Variant | الخلفية / النص | الـ Hover |
|---|---|---|
| primary | action / on-action (navy `#1c313d` / cream-200 `#f2eccd` على الأبيض؛ ink-700 / cream-50 جوه Cream/Sand، §1.4، D116) | الـ fill بيطلع لـ action-hover (navy-700 `#395361`، زي `colors_solid_button_background_hover`) |
| secondary | surface-muted / text | الـ fill بيطلع لـ line |
| outline | transparent / action، بوردر 1.2px | الـ fill بيطلع لـ action، والنص بيبقى on-action |
| ghost | transparent / currentColor، بوردر 1px | `backdrop-filter: blur(6px)` |
| link | underline 1px | الخط بيكبر من 0 لـ 100% |

- الارتفاع 48px (sm 40، lg 56). الـ padding-inline `--s-6`. الخط `--t-small` 500.
- **«المفضلة دائما» و«حركة. رياضة. استرخاء.» (6.4، بيعدّل D106):** زرار **outline** زي unix.sa (`button_style: outline` في `templates/index.json`، و `.button--outline` في `custom-arabic-headings.css`: شفاف، نص ink-700، حلقة داخلية 1.2px، والـ fill بيطلع من تحت مع الـ hover والنص بيبقى cream): «تصفحي…» في «المفضلة دائما» (§8.15) و«تسوقي الآن» في «حركة. رياضة. استرخاء.» (§8.14).
- **«عرض الكل» وأزرار صف العنوان التانية (6.1، قرار مؤقت D106):** شكل واحد = **primary** (ink pill ونص cream)، زي `button--secondary` في scheme Cream على unix.sa (D70). ده بيشمل و«عرض الكل» في «قد يعجبكِ أيضًا» تحت المنتج (§8.27) وتحت المقال (§8.42)، و«تصفّحي المقالات» (§8.17)، و«اختيارات تناسبك» (§8.35). الـ outline بيفضل للأفعال التانية (مثلًا «مسح الكل» في الفلاتر، و«طباعة» في صفحة الطلب).
- **زرار الأيقونة / الإغلاق (`.unix-icon-btn`، 6.1):** دايرة `--tap` شفافة بلون النص، hover `--c-hover-tint`، active `--c-press-tint`، focus-visible حلقة `--c-accent` جوه الدايرة، disabled `--o-disabled`. كل أزرار إغلاق الأدراج والدايالوجات (المنيو، والفلاتر، والسلة، والـ Size Finder، وجداول المقاسات، وتكبير الجاليري) بتستخدمه، بأيقونة × واحدة (stroke 1.5، `--icon-sm`) في الدايالوجات. الاسم «أغلقي النافذة» (أو «أغلقي القائمة / الفلاتر / السلة / التكبير» حسب العنصر).
- على أجهزة اللمس أي زرار `sm` بياخد `min-block-size: var(--tap)` (P6).
- **Loading:** spinner 16px، والنص بيتخفى بس الزرار عرضه مايتغيرش.
- Salla: نستايل `salla-button` من خلال `.s-button-*` عشان نفس الشكل يبان.

### 8.3 Product Card
- صورة 4:5 بحواف `--r-md`، والصورة التانية بتظهر مع الـ hover.
- تحتها: اسم المنتج (`--t-body` 500، وسطرين بالكتير)، بعده السعر (tabular)، بعده swatches (12px، 5 بالكتير و +N).
- Badge واحد بس بالكتير ناحية البداية فوق: «جديد» أو «خصم» أو «نفد».
- زرار الإضافة السريعة بيظهر مع الـ hover على الديسكتوب، وعلى الموبايل بيبقى أيقونة.
- **ممنوع:** نجوم على الكارت، أو أكتر من badge، أو ظل.
- **التنفيذ (المرحلة 2):** الكارت هو `custom-salla-product-card` بتاع الثيم (`src/assets/js/partials/product-card.js`) جوه `salla-products-slider`، والستايل في `04-components/unix-product-card.scss` تحت الكلاس `.unix-products` (الهوم، وجريد التصنيف 4.2، و«اختيارات تناسبك» 4.4، وتحت صفحة المنتج 3.9). الصورة التانية بتترسم **جوه `.unix-products` بس** ولو الـ API رجّع `images` (السكشن بيطلب `includes='["images"]'`)، وبتظهر بـ crossfade في `--d-reveal` على الأجهزة اللي فيها hover بس؛ برا كده `display: none`. الكارت نفسه `overflow: visible` والقص على صندوق الصورة. تحت الصورة سطر العلامة، والاسم (سطر أو سطرين، **من غير مساحة محجوزة** من 6.4 زي unix.sa)، والسعر سطر، وزرار الإضافة **فوق الصورة** تحت (مش في الـ flow). الـ skeleton بيحجز سطر واحد للاسم، فكارت اسمه سطرين بيطول سطر واحد بعد التحميل (زي الأصل). على الديسكتوب (hover + ≥1024) بيظهر مع الـ hover والفوكس، وعلى الموبايل أيقونة شنطة (مربع `--s-5` كريمي جوه مساحة `--tap`، 6.4) ناحية النهاية والنص بتاعه `sr-only`؛ ولو المنتج نفد أو الزرار مافيهوش أيقونة، مابيظهرش خالص على الموبايل (مافيش دايرة فاضية). الـ subtitle، والتقييم، و tag الشحن المجاني مستخبيين جوه الكارت.
- **العلامة والاسم والسعر (6.4، زي unix.sa):** فوق الاسم سطر العلامة (`product.brand.name` من سلة، وإلا اسم المتجر؛ الأصل `show_vendor: true` = «Unix») `--t-card` `--fw-medium` `--c-text-muted`. الاسم `--t-card` `--fw-semibold` (بيبقى 700 في العربي) `--c-text`، سطرين بالكتير **من غير مساحة سطرين محجوزة** (اتشال `min-block-size: 2lh`)، والسعر `--t-card` `--fw-semibold`. (بيعدّل D20.)
- **زرار الإضافة على الديسكتوب:** مستخبي تمامًا وهو مش ظاهر (`opacity: 0` و `visibility: hidden`، والـ visibility بتتأخر لآخر الـ fade)، فمابيبانش منه أثر باهت فوق الصورة؛ بيظهر مع الـ hover أو لما فوكس الكيبورد يدخل الكارت.
- **الـ swatches على الكارت:** مش متعملة، لأن بيانات كارت سلة مافيهاش ألوان الخيارات (D24). ألوان الموديل في صفحة المنتج بس (§8.28).
- **قلب المفضلة (6.3):** على كل كارت عمودي، فوق ناحية **النهاية** على بعد `--s-3` (الـ badge ناحية البداية). مساحة لمس `--tap` والظاهر مربع `--s-5` `--c-bg-cream` بحواف `--r-xs` (الشكل تحت؛ hover `--c-surface-muted`، active `--press-y`)، والأيقونة SVG inline (قلب stroke 1.5 بـ `--icon-sm`) بلون `--c-text`؛ **المحفوظ = القلب مليان** (`fill: currentColor`، الاستثناء الوحيد على «ممنوع الأيقونات الـ filled» في §6، لأن الحالة لازم تبان من غير لون). focus-visible حلقة `--ring-w` `--c-accent`. الـ `aria-label` ثابت ومترجم ومحايد لأنه toggle: «{الاسم} في المفضلة» / "Save {name}" (`blocks.unix.card.wishlist`)، والحالة في `aria-pressed` بس (`true` = محفوظ) على الـ host وعلى الـ `<button>` اللي جواه، وبتتحدّث مع الضغطة (وبترجع لو سلة رفضت، مثلًا زائرة مش مسجّلة) ومع أحداث `salla.wishlist` (`wishlist.js`).
- **شكل أزرار التحكم فوق الصورة (6.4، زي unix.sa):** مساحة اللمس `--tap` شفافة، والجزء الظاهر **الأيقونة بس على الصورة من غير خلفية** (قرار صاحب البراند 6.4؛ كان مربع `--s-5` `--c-bg` زي unix.sa، والمربع لسه بيظهر `--c-surface-muted` مع الـ hover على أجهزة الماوس بس، بحواف `--r-xs`)، والأيقونة `--icon-sm` بلون `--c-text`، في نص مساحة اللمس. المربع بعيد `--s-3` عن ركن الصورة (مساحة اللمس بتطلع برا بالفرق). ده بيتطبّق على أيقونة الشنطة على الموبايل (تحت ناحية النهاية) وعلى قلب المفضلة (فوق ناحية النهاية) بدل الدايرة البيضا. حلقة الفوكس حوالين المربع نفسه (outline-offset سالب). زرار الإضافة على الديسكتوب pill عرض كامل تحت الصورة خلفيته `--c-bg`. hover المربع `--c-surface-muted`.
- **ملاحظة تنفيذ (6.3):** `salla-button shape="icon"` بيرسم `<button class="s-button-element s-button-icon …">` وبينسخ attributes الـ host عليه (منها `class`)، فالستايل على `salla-button.s-product-card-wishlist-btn > .s-button-element`، والـ host هو اللي بيتحط `--s-3` من الركن والـ button جواه `position: static` (عشان قاعدة رائد الـ absolute ماتزقّهوش). الـ toggle بيتنادى مرة واحدة من `product-card.js` (اتشال الـ `onclick` الـ inline اللي كان بيتنسخ على الزرارين).

### 8.4 Badge
مستطيل بحواف `--r-xs`، ارتفاع 24 (`--s-5`)، و `--t-micro` `--fw-regular`. الخلفية `--c-bg-cream` (scheme «Cream» بتاع `badge--custom` في الأصل، D109) والنص `--c-text` (زي unix.sa؛ كان pill على `--c-surface` لحد 6.4). «خصم» بس هو اللي نصه `--c-price-sale`.
- Badge الخصم: «خصم» على الكارت، و «تخفيض» في صفحة المنتج زي unix.sa؛ الاتنين بنص `--c-price-sale`.
- **على كارت سلة (المرحلة 2):** نص الـ badge هو نص سلة نفسه: `promotion_title` اللي التاجر بيكتبه للمنتج، أو label الطلب المسبق. يعني مش دايمًا «جديد» أو «خصم» أو «نفد»، ومش معروف إنه خصم، فبيفضل بلون `--c-text`. بيتقص بـ ellipsis في سطر واحد.

### 8.5 Input / Select
- ارتفاع 52، وخلفية `--c-field`، و `--r-sm`، ومن غير بوردر.
- **Focus:** حلقة 2px `--c-accent` و offset 2px.
- الـ label فوق الحقل (`--t-small` 500). مافيش floating labels.
- **Error:** بوردر `--c-price-sale`، ورسالة تحته فيها أيقونة.

### 8.6 Announcement Bar
مطابق لـ unix.sa (SPEC §2، و `reference/shopify-theme/sections/announcement-bar.liquid` و `assets/announcement.js` و `sections/header-group.json`) بقرار المالك (D6، 2026-11-01).
- ارتفاع ثابت `--announce-h` (40px) على الديسكتوب والموبايل، عشان مايبقاش فيه layout shift. الخلفية `--c-announce` والنص `--c-announce-text` (تباين 10.6، AAA)، والحجم `--t-small`. بيتعرض مرة واحدة بس، أول حاجة جوه `header.twig` فوق الهيدر.
- الرسالة في النص، وسطر واحد بس. لو طويلة على 360px بتتقص بـ ellipsis من غير scroll أفقي.
- **التبديل (زي الأصل: Swiper `direction: vertical`، و `delay` 4s، و `speed` 0.8s، و `loop`):** كل رسالة بتفضل ثابتة تمامًا `--d-announce` (4 ثواني) **بعد** ما السلايد بتاعها يخلص (زي Swiper: أول تبديل بعد 4 ثواني، وكل تبديل بعده كل 4.8 ثانية؛ ومع reduced-motion كل 4 ثواني)، وبعدين سلايد **عمودي** في `--d-announce-slide` (800ms) مع `--ease-announce` (`ease`، زي Swiper، D8): الرسالة الجاية بتطلع من تحت، والحالية بتخرج لفوق، وبعد آخر رسالة بيرجع للأولى (loop). الحركة عمودية فمافيهاش فرق بين RTL و LTR. معمول بـ vanilla JS + CSS (`unix-announcement.js`) من غير Swiper.
- **بيقف** مع الـ hover (زي `pauseOnMouseEnter` في الأصل) أو الـ focus (الشريط نفسه بياخد focus بالكيبورد لما يبقى فيه أكتر من رسالة، فده هو زرار الإيقاف). وبيقف كمان لما التاب يبقى مخفي. *(الـ focus والتاب المخفي إضافات مقصودة، §12)*
- **reduced-motion:** التبديل بيفضل شغال بس من غير سلايد (تبديل فوري، `--d-announce-slide` بيبقى 0ms)، عشان رسالة الشحن المجاني ماتضيعش. *(إضافة مقصودة، §12)*
- **Screen readers:** كل الرسايل موجودة في الـ DOM كـ list جوه `role="region"` ليه `aria-label`، ومافيش `aria-live` (عشان القارئ مايتكلمش كل 4 ثواني). لما الشريط بيتبدل، فيه تلميح مخفي (`sr-only`، مربوط بـ `aria-describedby`) من `blocks.unix.announcement.pause_hint` بيقول إن التركيز على الشريط بيوقفه. لو لينك في رسالة مستنية خد الفوكس، الرسالة دي بتدخل على طول.
- **لينك اختياري لكل رسالة** (فاضي افتراضيًا زي الأصل) *(قرار مؤقت D11)*: underline 1px، و opacity `--o-muted` مع الـ hover. حلقة الـ focus بلون النص (`currentColor` = `--c-announce-text`) جوه الشريط (الـ taupe تباينه ضعيف على الخلفية الغامقة). **استثناء:** هدف اللمس 40px مش 44 لأن الارتفاع مقفول على الأصل (أعلى من حد WCAG 2.5.8 اللي هو 24px)، قرار مؤقت D10).
- **الإعدادات:** `twilight.json → settings`: `unix_announcement_enabled` (مفعّل افتراضيًا)، ورسالتين `unix_announcement_{1,2}_text` (عربي/إنجليزي)، ولينك لكل رسالة `unix_announcement_{1,2}_link` (link picker: منتج أو تصنيف أو صفحة أو رابط خارجي)، و `unix_free_shipping_threshold` (500، D1) اللي بيتحط في الرسالة التانية الافتراضية كرقم صحيح من غير كسور، زي الأصل «500 ر.س». الرسالتين `value` بتاعتهم `null` في `twilight.json`، فالنص الافتراضي جاي من الترجمة باللغتين.
- **القيم الافتراضية (6.4، D115):** سلة بتحفظ الحقل اللي ماتلمسش كـ `''`، فأي رسالة فاضية (`null` أو `''` أو مسافات) بتعرض النص الافتراضي من الترجمة، في الرسالتين: `blocks.unix.announcement.default_1` (المجموعة الجديدة) و `default_2` (الشحن المجاني + الحد). مسح الرسالة مابيخفيهاش؛ الطريقة الوحيدة للإخفاء هي `unix_announcement_enabled` (بيخفي الشريط كله). القاعدة العامة في §9.

### 8.7 Header
مطابق لـ unix.sa على 1366 و 390 (6.4، طلب المالك: «الهيدر زي unix.sa»؛ القيم من `reference/shopify-theme/sections/header.liquid` و `header-group.json` و `assets/header.css` و `custom-language-mobile.css` و `section-media-banner.css`، والـ markup الحي `curl -s https://unix.sa/`).
- **الارتفاع:** `--header-h` 60px في كل المقاسات (الأصل `.header {min-height: 6rem}`؛ كان 72 من lg). الخلفية `--c-bg` (أبيض، D109) وخط تحت `--line-w` `--c-border` (`header--border`).
- **الترتيب في RTL (6.4، زي unix.sa):** ناحية البداية زرار المنيو ☰ **في كل المقاسات** ومن lg بعده اللينكات inline **من غير chevrons** (الـ chevron فاضل بس على زرار «المزيد» بتاعنا). اللوجو في النص (`--logo-w`: 100 تحت 576، و 120 من 576). ناحية النهاية: AR/EN، والبحث، والحساب (من md)، وخط فاصل (من lg: `--line-w` × `--s-6` بلون `--c-border`، و `--s-2` من الناحيتين؛ الأصل `.header__icons + .header__icons::before` 1px × 3.2rem)، والسلة. تحت md الجريد `auto 1fr auto` واللوجو في نص المساحة الفاضية، ومن md `1fr auto 1fr`. المسافة بين الأيقونات صفر تحت md و `--s-1` من md (الأصل 0 / .4rem).
- **الأيقونات (6.4):** نفس رسومات unix.sa بالظبط (SVG inline مليانة `currentColor` جوه viewBox 44 بيملا زرار `--tap`، فالرسمة نفسها حوالي 18–22px): ☰ خطين مستطيلين 18 و 14 × 2 (`icon-hamburger`)، والحساب شخص (`icon-account`)، والسلة شنطة (`icon-cart`)، والبحث عدسة 20 × 20 (`icon-search`، `--icon-sm`). اللون `--c-action`. **الحالات:** hover `opacity: var(--o-hover)` (.6، الأصل) من غير خلفية، active `--o-muted`، focus-visible حلقة `--ring-w` `--c-accent` جوه الزرار، disabled `--o-disabled`. للمسجّلة صورة سلة زي ما هي في مكان أيقونة الحساب (`salla-user-menu`، الـ slot الرسمي `login-btn` للزايرة).
- **لينكات المنيو (من lg):** `--t-body` (15 → 16px؛ الأصل `body` = 1.17 × 1.3rem = 15.2px) بوزن `--fw-regular` (الأصل `--font-body-weight` 400) ولون `--c-action`، و padding-inline `--s-3` (الأصل 1.2rem من 1360)، وارتفاع الهيدر كله. hover/focus: خط `--line-w` بلون النص تحت اللينك على حافة الهيدر (الأصل `span::after` على `bottom: 0`)، active `--o-muted`.
- **القايمة المنسدلة (dropdown و mega):** خلفية `--c-bg`، **من غير حواف ولا ظل**، بوردر `--line-w` `--c-border` وخط فوق `--line-w` `--c-text` (الأصل `.header__submenu` و `border-top: .1rem solid foreground`). اللينكات `--t-body` `--fw-regular` بـ padding-block `--s-2` و padding-inline `--s-5` / `--s-6` (الأصل `.8rem 4rem .8rem 2rem`)، hover `--o-hover`. الـ mega menu (لما تصنيف سلة فيه صور أو منتجات) بنفس الشكل: نفس الخلفية والخطوط، والصور `--r-md` زي ما هي. unix.sa مافيهوش mega (`mega_menu_trigger` فاضي)، فده بيظهر بس لو التاجر ضاف صور للتصنيفات.
- **AR/EN:** حبّة حوالي 74 × 28px (الأصل `custom-language-mobile.css`): خلفية `--c-panel` (الأصل `--color-background-input`، رمادي فاتح على الأبيض)، padding `--lang-pad` (3px) و gap `--lang-gap` (2px)، والزرار `--lang-btn-pad-block` × `--lang-btn-pad-inline` (5 × 9px، و 7px تحت 576) بـ `--t-micro` (12px) و line-height 1. النشط: خلفية `--c-bg` ونص `--c-text` وظل خفيف `--e-1`؛ الباقي `--c-action` (navy، 11.1:1 على `--c-panel`، D116؛ `--c-text-muted` كان 4.36 ومايعديش AA على 12px)، hover `--c-text`. **مساحة اللمس (6.4، D114 اتقفل):** كل زرار له مساحة لمس شفافة `--tap` × `--tap` (pseudo-element)، والاتنين بيتقابلوا في نص الـ gap ويطلعوا برا الحبّة `--lang-hit-out`، وكل زرار أقل عرضه `--lang-chip-w` (عرضه الطبيعي) عشان الحساب يمشي. الحبّة الظاهرة زي ما هي حوالي 74 × 28. في الهيدر الـ margin بتاع الحبّة بيعمل مكان للجزء اللي برا: ناحية النهاية `--lang-hit-out`، وناحية البداية تحت lg `--lang-hit-out` ناقص `--s-2` (الـ gap بتاع الجريد فاضي، ومافيش حاجة ظاهرة قبل الحبّة تحت lg) ومن lg `--lang-hit-out`، فمساحة اللمس مابتغطيش أيقونة البحث. في فوتر درج المنيو الـ margin `--s-1` زي ما هو (حواليها مساحة فاضية).
- **عدد السلة:** دايرة `--icon-sm` (الأصل 2rem) بلون `--c-action` ونص `--c-on-action` (D116) `--t-micro` في الركن فوق ناحية النهاية من مساحة الـ 44. **مابتظهرش والسلة فاضية** (الأصل `.cart-count-bubble:empty`): `data-count` من Twig (`cart.items_count`) وبيتحدّث من `salla.cart.event.onUpdated` (`unix-header.js`).
- **درج المنيو:** بيتفتح من ☰ في كل المقاسات (§8.9).
- **Sticky (`on-scroll-up` في الأصل):** لما الهيدر يخرج من الشاشة بيبقى fixed ومستخبي، بيرجع لما تطلعي لفوق (`transform` في `--d-fast`، الأصل `.15s ease-out`) وبيختفي لما تنزلي، وبياخد `--e-1` وخلفية `--c-bg`. لما ترجعي لأول الصفحة بيرجع لمكانه.
- **عناصر اختيارية (6.4، D112):** كل عنصر في الهيدر ليه مفتاح في إعدادات الثيم (جنب إعدادات الهيدر)، والقيمة الافتراضية لما الإعداد ماتحفظش قبل كده هي اللي في unix.sa: `unix_header_show_lang` (AR/EN، مفعّل)، و `unix_header_show_search` (مفعّل)، و `unix_header_show_account` (مفعّل)، و `unix_header_show_divider` (الخط قبل السلة، مفعّل)، و `unix_header_show_currency` (العملة، **مقفول**: unix.sa مافيهوش عملة). العملة لما تبقى مقفولة بتختفي من الهيدر في كل المقاسات ومن درج المنيو. شريط الإعلانات ليه مفتاحه من الأول (`unix_announcement_enabled`، §8.6).
- **الهيدر الشفاف فوق الهيرو (6.4، D113؛ زي `header-overlay.js` و `section-media-banner.css` في unix.sa):**
  - بيشتغل **افتراضيًا** في الصفحة الرئيسية بس (unix.sa بيعمله بس لما أول سكشن في الصفحة هو الـ media banner؛ مافيش صفحة تانية عندهم فيها هيدر شفاف) لما أول كومبوننت هو الهيرو وفيه **صورة أو فيديو** (فيديو بس زي unix.sa كمان). إعداد الثيم `unix_header_transparent_home` وحقل الهيرو `header_overlay` مفعّلين افتراضيًا وبيتقفلوا بس لو التاجر قفلهم.
  - شريط الإعلانات بيفضل فوق ثابت بلونه (زي الأصل: الهيدر هو آخر سكشن في الـ header group، والـ hero بيتسحب تحت الهيدر بس، `margin-top: calc(var(--header-height) * -1)`).
  - **الشكل وهو فوق الهيرو:** خلفية شفافة، ومن غير ظل، والخط اللي تحت بقى `--c-border-overlay` (ink 18%). اللوجو والأيقونات واللينكات **غامقة** زي unix.sa بالظبط: ink-700 (`--c-action` بيتحوّل لـ `--c-text-brand` على الشريط الشفاف، وعدد السلة نصه `--c-text-inverse`؛ وأول ما الهيدر يبقى solid بيرجع navy، D116) واللوجو الأصلي (`section-media-banner.css`: «force brand-dark icons + logo over hero»، `--color-foreground: 55,53,66`، والـ overlay logo مستخبي). حبّة AR/EN بتفضل على خلفيتها الرمادي `--c-panel` زي unix.sa فوق الهيرو (6.4، D127؛ كانت أبيض 20%)، ونصها `--c-action` حتى في الوضع الفاتح (الكريمي على `--c-panel` مايعديش AA)، وعدد السلة `--c-action`. **وضع فاتح اختياري** (`unix_header_overlay_light`، مقفول افتراضيًا): لو ميديا الهيرو غامقة (زي فيديو الديمو)، الأيقونات واللينكات بتبقى `--c-text-inverse` واللوجو الفاتح `unix_header_logo_inverse` لو اتحط، وعدد السلة cream، وحلقة الفوكس `currentColor`.
  - **الرجوع للهيدر العادي:** زي الأصل، أول ما الهيدر يبقى sticky (بعد ما تنزلي تحت الهيدر) بياخد خلفية `--c-bg` وخطه العادي، ولما ترجعي لأول الصفحة بيرجع شفاف. مافيش تغيير مع الـ hover (الأصل مابيغيّرش). الألوان بالـ CSS من أول رسم (`body:has([data-header-overlay])`) والـ JS (`.is-overlay`) fallback.
  - **حلقة الفوكس في الهيدر الشفاف `currentColor` في الوضعين** (الأيقونات، و AR/EN، ولينكات المنيو، والحساب، والسلة): الـ taupe تباينها 2.69 على الـ sand ومجهول على الميديا، والهيدر بيفضل شفاف وهو عليه الفوكس (زي الأصل، من غير تبديل مع `:focus-within`).
  - **الوضع الفاتح** بيشتغل بس والهيرو بيعرض ميديا فعلًا: فيه صورة، أو الفيديو اشتغل (`is-video-playing`). هيرو فيديو بس بيفضل على الـ sand لحد ما الفيديو يشتغل، فالهيدر بيفضل داكن لحد ساعتها.

### 8.8 Footer
مطابق لـ `reference/shopify-theme/sections/footer-group.json` و `footer.liquid` و `assets/section-footer.css` و `unix-trust.css` (6.4، D111).
- خلفية `--c-bg-cream` (scheme «Cream» في الأصل، D109). **مافيش بوردر ولا margin فوق** (كانوا بيعملوا شريط أبيض قبل الفوتر).
- **الديسكتوب:** 3 بلوكات في صف: «سياسات» (قايمة الفوتر بتاعة سلة، `salla-menu source="footer"`)، و«القائمة» (القايمة التانية، من إعداد الثيم `unix_footer_menu2_links`: سطر لكل لينك «النص | الرابط»؛ سلة فيها قايمتين بس، الهيدر والفوتر)، وبلوك النشرة «لا يفوتك جديدنا :» (العنوان من `unix_footer_newsletter_title` والفورم slot `{% hook 'footer:newsletter' %}` لحد ما D7 يتقفل). العناوين من إعدادات `unix_footer_menu1_title` و `unix_footer_menu2_title` (الافتراضي «سياسات» و«القائمة»). أي بلوك قايمة مافيهوش لينكات بيستخبى (قايمة الفوتر في سلة فاضية، أو إعداد القايمة التانية فاضي)، فمافيش عنوان من غير لينكات. العنوان `--t-h4` و Somar، واللينكات تحت بعض `--t-small` **بلون `--c-text` كامل** (مش muted)، hover `--o-hover`، ومساحة لمس `--tap`.
- **تحتهم:** خط `--line-w` `--c-border`، وبعده صف فيه اللوجو (`--logo-w`) و © السنة واسم المتجر (`{% hook copyright %}`).
- **شريط الثقة (زي ما هو):** مربعات التواصل (الهاتف، وواتساب، وانستجرام، وتيك توك)، والسجل التجاري والعلامة التجارية والرقم الضريبي، وخط أقصر، وأيقونات الدفع.
- **أيقونات الدفع (6.4، زي `unix-trust.css`):** **بألوانها** (مش رمادي)، كل واحدة في مربع أبيض `--c-bg` ببوردر `--line-w` `--c-border` وحواف `--r-xs`. اتشال الـ grayscale و opacity .7.
- **الموبايل (ترتيب unix.sa):** النشرة الأول، بعدها أكورديون «سياسات» و«القائمة» (§8.10، `--tap`، بوردر فوق كل واحد)، بعدها اللوجو و ©، بعدها شريط الثقة.
- «حمّلي التطبيق» (`salla-apps-icons apps-title`، مؤنث) **مقفول افتراضيًا** (`unix_footer_show_apps`، 6.4، D125): unix.sa مافيهوش شارات تطبيقات، وسلة كانت بترسم العنوان حتى من غير شارات. اتشال عمود البراند والوصف، وعمودين «التسوق» و«تواصلي معنا» (unix.sa مافيهومش). إعدادات التواصل لسه شغالة في مربعات شريط الثقة.

### 8.9 Drawer (السلة والمنيو)
- عرضه `min(440px, 92vw)`، وخلفية `--c-surface`، و `--e-2`.
- **درج المنيو (6.4، زي `menu-drawer` في unix.sa):** عرضه `--drawer-menu-w` (الشاشة كلها على الموبايل، و 600px بالكتير)، وخلفية `--c-bg` ومن غير حواف. فوق: زرار الإغلاق ناحية البداية واللوجو في النص وخط `--line-w` تحتهم. اللينكات `--t-h4` (الأصل `body-xl` حوالي 19–20px) بوزن `--fw-regular` ولون `--c-text`، الصف `--s-3` فوق وتحت (حوالي 56px زي الأصل) **من غير خطوط بين العناصر**، و padding-inline `--s-5`. التصنيفات اللي ليها فروع أكورديون (§8.10) **زي unix.sa**: `unix-custom.css` في الأصل بيقلب الـ submenu اللي بيدخل من الجنب بتاع الثيم لأكورديون تحت الأب (SPEC §2؛ «Customers expected the children to open underneath the parent»)، فمافيش submenu من الجنب (6.4، D130). تحت: «تسجيل الدخول» زرار primary عرض كامل تحت 576، وبعده AR/EN.
- **Header:** عنوان وعدد المنتجات وزرار إغلاق 44px.
- **Footer** ثابت تحت: المجموع والأزرار (التفاصيل في سكشن كل درج؛ السلة بتحط الكاش باك بين السطور والفوتر، §8.33).
- **Focus trap**، والـ Esc بيقفله، والفوكس بيرجع للعنصر اللي فتحه.
- **AR/EN في فوتر درج المنيو (6.4):** فاضل رغم إن الهيدر بقى بيعرض AR/EN في كل المقاسات، زي unix.sa اللي درج الموبايل بتاعه (`menu-drawer__bottom`) فيه اختيار اللغة تحت الحساب. الدرج `aria-modal` والصفحة ورا `inert`، فقارئ الشاشة بيلاقي نسخة واحدة بس وقت ما الدرج مفتوح.
- **الصفحة ورا الدرج:** طول ما فيه درج مفتوح `.app-inner` بيبقى `inert` وسكرول الـ body مقفول (`body.unix-drawer-open`). القفل بالعدّ: لو أكتر من درج مفتوحين بيتشال لما آخر واحد يتقفل، و Esc و Tab بيشتغلوا على الدرج اللي فوق بس. مودالات سلة (الدخول، والبحث، والعروض، والفروع) برا `.app-inner` في `master.twig`، فبتفضل شغالة؛ ومودال العملة/اللغة اللي في الهيدر بيتفتح بعد ما الدرج يتقفل. *(4.3، بيحل D83)*

### 8.10 Accordion (الأسئلة والتفاصيل)
- بوردر تحت كل عنصر. العنوان `--t-h4`. أيقونة + بتتحول لـ − (الخط الرأسي بيلف 90° وينطبق على الأفقي، في `--d-base`)، زي unix.sa *(اتعدّلت في 2.9 من «+ بتلف وتبقى ×» عشان تطابق الأصل، D6)*. الأيقونة `--icon-sm` جوه مساحة `--tap` بلون `--c-text-muted`.
- الـ hover `--o-muted` على أجهزة الـ hover بس (`@media (hover:hover)`) في كل الأكورديونات.
- `<details>` أصلية، و `grid-template-rows: 0fr → 1fr` للحركة (على `::details-content` في المتصفحات اللي بتدعمه، وفي الباقي بيفتح على طول).
- **الأسئلة الشائعة** (`home.unix-faq`، ROADMAP 2.9 · SPEC §4.18 · `reference/shopify-theme/sections/collapsible-content.liquid`):
  - عنوان h2 (`--t-h2-shop` بـ line-height 1.32، 6.4، D119: `.h2` عادي في الأصل) ونص (`--t-body`، `--c-text-muted`) في النص، وتحتهم الأسئلة في عمود أقصاه `--faq-max` (908px) من lg. الـ padding `--section-md` فوق وتحت.
  - الصف: padding `--s-4` فوق و `--s-2` تحت، وبوردر `--c-border` تحت كل صف وفوق أول صف (layout «border» في الأصل). السؤال بخط العناوين `--t-h4`، والإجابة `--t-body` بلون `--c-text-muted` (4.7، AA).
  - **سؤال واحد مفتوح في كل مرة** زي الأصل، بـ `<details name>` أصلي من غير JS. أول سؤال مفتوح افتراضيًا (حقل `opened` لكل سؤال).
  - الحالات: hover على الديسكتوب (lg، أجهزة الماوس) الصف المقفول بيبقى `--o-muted`؛ focus-visible حلقة `--c-accent`؛ active السؤال `--o-muted`.
  - **«عرض المزيد / عرض أقل»** (زي الأصل، ممكن يتقفل): لو الأسئلة أكتر من 3، أول 3 ظاهرين، والرابع باهت (`--o-teaser` وفوقه `--c-teaser-fade`، و `inert`)، والباقي `hidden="until-found"` (البحث في الصفحة بيوصلهم ويفتح القايمة). **تحفّظ:** السؤال الرابع الباهت `inert`، فالبحث في الصفحة مابيوصلوش وهي مقفولة (بيظهر عادي بعد «عرض المزيد»). زرار واحد `aria-expanded`: primary وهو مقفول و secondary وهو مفتوح، بعرض كامل على الموبايل وناحية البداية من lg. بعد «عرض المزيد» الفوكس بيروح لأول سؤال ظهر.
  - **FAQPage JSON-LD** (ممكن يتقفل، مفعّل افتراضيًا زي الأصل).

### 8.11 Size Finder
- مودال كامل على الموبايل، وعلى الديسكتوب dialog عرضه 560.
- **المرحلة 3.3** (ROADMAP 3.3 · SPEC §8.1 · `reference/shopify-theme/assets/unix-size-finder.js` + `snippets/unix-size-finder.liquid` + `assets/unix-size-finder.css`). نقل حرفي للموديل (نفس الأسئلة والترتيب والأوزان والتقريب والنصوص):
  - **الموديل:** بيقدّر مقاسات الجسم (صدر، تحت الصدر، خصر، ورك بالسم) من إشارات بأوزان: ماركة + مقاسها (.45)، المقاس المعتاد (.35)، الطول + الوزن عن طريق BMI (.20، لو اتذكر الوزن بس). بعدها شكل الجسم (+3/+4 سم) وصدرية (خلط 70/30). كل مقاس بيتقيّم حسب قياسات الفئة (ليقنز: ورك وخصر؛ صدرية: تحت الصدر وصدر؛ …)، و «بين مقاسين» لو الفرق أقل من .35 خطوة، وقاعدة كل فئة (أكبر، أو أصغر لو بتحب الضمّ القوي، أو كومفي حسب التفضيل). الثقة: عالية/متوسطة/بين مقاسين. الكود: `partials/unix-size-finder-model.js` (pure).
  - **الخطوات:** الطول ← المقاس المعتاد ← الماركة ← مقاسها (لو اختارت ماركة) ← شكل الجسم ← الصدرية (للتوب والصدرية بس) ← الوزن (اختياري، و«أفضّل ما أذكر» بنفس الوزن على الشاشة) ← التفضيل. كل خطوة بتتقدّم بمجرد الاختيار، و«رجوع» من الخطوة التانية.
  - **الزرار (entry row):** عرض كامل تحت اختيار المقاس، خلفية `--c-bg-cream` (unix.sa `--sf-paper` #F8F6F2، أقرب لون في النظام)، بوردر `--line-w` `--c-border`، و**من غير حواف** (radius 0 زي الأصل؛ 6.4، D123)، وارتفاعه على الأقل `--btn-h`. أيقونة مسطرة في دايرة `--sf-ico` بوردر `--c-border`، وسطرين: العنوان `--t-small` 600 `--c-text`، والتاني `--t-micro` `--c-text-muted`. لو المقاس محفوظ: «مقاسك في هذه القطعة: M» و «تعديل». hover: بوردر `--c-text-muted`؛ focus-visible: حلقة `--c-accent`.
  - **الدايلوج:** `<dialog>` أصلي بـ `showModal()` (focus trap و Esc من المتصفح، والفوكس بيرجع للزرار يدويًا)، و `aria-labelledby` على عنوان السؤال الحالي. خلفية `--c-surface`، و `--e-2`، و `--r-lg` من md (§4: المودال)؛ و `::backdrop` = `--c-backdrop`. على الموبايل (< md) بيملا الشاشة (`100dvh`) **من غير حواف** (radius 0، لأنه مالوش ركن ظاهر) مع padding `env(safe-area-inset-bottom)`.
  - **الهيدر:** عدّاد الخطوة «٣ / ٨» (`--t-micro`، `--c-text-muted`، أرقام عربية في العربي، و letter-spacing .04em في الإنجليزي بس)، وزرار إغلاق `.unix-icon-btn` (§8.2، «أغلقي النافذة»). تحته شريط تقدّم مقطّع ارتفاعه `--sf-progress-h`: المقطع الفاضي `--c-border` والمكتمل `--c-action`.
  - **السؤال:** `--t-h4` بخط العناوين، والتلميح `--t-small` `--c-text-muted`، والوحدة («سم»/«كجم») مكتوبة في التلميح وفي `aria-label` المجموعة.
  - **الاختيارات:** `role="radiogroup"` وكل اختيار `role="radio"` + `aria-checked`، والأسهم و Home/End **بتنقل الفوكس بس** (roving tabindex، بتتعكس في RTL)، و Enter/Space (أو الضغط) بيختار ويروح للخطوة اللي بعدها، زي الأصل (الاختيار = تقدّم، فالأسهم ماينفعش تختار). line-height الخلية 1.3 (دور label)، والسؤال 1.4 (دور `--t-h4`، §2)، وسطور التفسير 1.7 (دور body). الشبكة 1/2/3/5 أعمدة زي الأصل، والفجوة `--s-2`. الخلية: ارتفاع `--btn-h`، خلفية `--c-surface`، بوردر `--line-w` `--c-border`، `--r-sm`، نص `--t-small`. المختار: خلفية `--c-action` ونص `--c-on-action`. hover: بوردر `--c-text-muted`؛ active: `--c-press-tint`. المقاسات `--fw-semibold` (و +.04em في الإنجليزي بس، §2.2). «ما أدري / تخطّي / أفضّل ما أذكر» زرار عرض كامل بنص `--c-text-muted` («أفضّل ما أذكر» بلون `--c-text` وبوردر أغمق زي الأصل). أشكال الجسم: رسم `--sf-fig` فوق النص.
  - **الحساب:** «نحسب مقاسك» مع خط بيتحرك (`--sf-think-w`، دورة `--d-sf-scan`) لمدة ثابتة 800ms (زي الأصل). المدة دي توقيت محتوى مش حركة، فمابتتغيرش مع reduced-motion؛ اللي بيتقفل هو حركة الخط بس. ونفس الكلام لقفل الدايلوج بعد «تم اختيار المقاس» (650ms زي الأصل).
  - **النتيجة:** `aria-live="polite"`، وعنوان الدايلوج (مخفي بصريًا) فيه المقاس: «مقاسك: M» (أو «مقاس الهودي: M، مقاس البنطلون: L» للطقم). بلاطة لكل قطعة (الطقم = بلاطتين): بوردر `--line-w` `--c-action`، و `--r-sm`، والمقاس `--t-h1` `--fw-semibold` بـ line-height 1.25 (دور `--t-h1`) جوه `<bdi>` (و +.04em في الإنجليزي بس؛ الـ .06em القديمة اتشالت في 6.1)، والثقة `--t-micro` (العالية بنقطة `--c-success`، و«خلصان» `--c-price-sale`). سطور التفسير `--t-small` `--c-text-muted`. زرار «اختاري M» = `.unix-btn--block` (primary، pill §12)، وبعد الضغط «تم اختيار المقاس» والدايلوج بيقفل بعد `--d-reveal`. «تعديل الإجابات» link، والملاحظة تحت بوردر `--c-border`.
  - **الربط مع سلة:** بيلاقي خيار المقاس جوه `salla-product-options` من اسم الخيار (`مقاس|size`) **ونوعه** (`single-option` أو `thumbnail` بس، مش نص أو تاريخ)، ويختار القيمة بتغيير الـ control الموجود جوه فورم المنتج (radio أو select) و `dispatchEvent(new Event('change', {bubbles:true}))`، من غير أي منطق خيارات خاص بينا. علامة «مقترح» (`--t-micro`، `--c-success`، وبتبقى `--c-text-inverse` لما المقاس ده متختار؛ في وضع الأزرار (3.2) بتفضل `--c-success` لأن الخلفية `--c-surface`) `position: absolute` تحت النص جوه زرار المقاس، فمافيش layout shift. لو اختارت مقاس بإيدها (أي `change` حقيقي على خيار المقاس من أول تحميل الصفحة) أو الخيار له قيمة أصلاً، الأداة مابتغيّرهوش تلقائيًا. لو المقاس خلصان: الأكبر بخطوة (أو الأصغر لو بتحب الضمّ القوي)، أبدًا مش أبعد من خطوة.
  - **الحفظ:** نفس مفتاح الأصل `unix_fit_v2` في localStorage، فالمقاس بيظهر جاهز في كل قطعة، وبيتختار تلقائيًا لو ما اختارتش بإيدها.
  - **الأداء:** الـ JS بتاع الأداة (الموديل + الواجهة، حوالي 20KB قبل الضغط) جزء من `product.js` (import ثابت، من غير chunk منفصل، عشان مانعتمدش على تحميل chunks من CDN سلة). الزرار بيتعرض من السيرفر، والـ DOM بتاع الخطوات مابيتبنيش غير لما تفتح الدايلوج. `window.UnixFit` متاح للمعايرة زي الأصل.
  - **الإعدادات:** `unix_size_finder_enabled` (مفعّل)، و `unix_size_finder_data` (JSON اختياري يغيّر أي جدول من جداول الأصل: `BODY`، `COMFY`، `BRANDS`، `W`، `CATS`، …، و `PRODUCTS` لكل منتج: `{"<id>": {"cat": "leggings", "chart": "comfy", "delta": 0.33}}`). فاضي = بيانات unix.sa. *(قرار مؤقت – محتاج مراجعة)*
- *(الـ bullets القديمة «progress `--c-accent`» و«المقاس بخط display + «مناسب لك» بـ `--unix-success`» اتشالت في 3.3: المرجع هو المواصفات اللي فوق.)*

### 8.12 Offer Strip
الكومبوننت `home.unix-offer-strip` (ROADMAP 2.2 · SPEC §4.2 · `reference/shopify-theme/snippets/unix-offer.liquid` mode `home` و `assets/unix-offer.css` → `.uo-home`). مكانه بعد الهيرو مباشرة زي `offer_home` في الأصل.
- **الأصل حاليًا مابيعرضش حاجة** (عرض «قطعتين أو أكتر خصم 20%» اتوقف 31 أكتوبر 2026). فالقيم الافتراضية كلها فاضية، و **من غير عنوان الشريط مابيظهرش خالص** (مكان محجوز بس). وفيه switch «إظهار» عشان التاجر يخفيه من غير ما يمسح النصوص.
- **الشكل (زي `.uo-home`):** شريط بعرض الصفحة، والمحتوى في النص. الخلفية `--c-action` (ink-700 جوه السكشن ده، §1.4؛ الـ `#22323E` بتاع الأصل مش في النظام) والنص `--c-on-action` (تباين 10.7، AAA). الـ padding `--section-sm` بلوك و `--page-margin` إنلاين.
  - eyebrow (`--t-micro`، uppercase و +0.08em في الإنجليزي بس) ← عنوان h2 (`--t-h2`) ← نص (`--t-small`، `65ch`) ← CTA. المسافة `--s-2`، وقبل الـ CTA `--s-3` زيادة.
  - **من غير opacity** على النصوص (الأصل .7 و .8)، زي الهيرو (§13.2).
- **الشريط كله لينك** لو فيه رابط (زي الأصل)، وإلا `div` عادي من غير CTA.
- **CTA:** `span` بالـ classes `.unix-btn.unix-btn--ghost` بلون cream (pill، §12)، مش عنصر تفاعلي لوحده (الشريط هو اللينك). مع الـ hover/focus/active على الشريط بيتملي `--c-text-inverse` والنص `--c-action`، في `--d-base`.
- **Focus:** حلقة `--ring-w` بلون `--c-text-inverse` جوه الشريط (offset سالب `--s-1`). **Active:** زي الـ hover.

### 8.13 Collection Overlay («جديد من يونكس»، `home.unix-collection-overlay`)
الكومبوننت `home.unix-collection-overlay` (ROADMAP 2.4 · SPEC §4.4 · `reference/shopify-theme/sections/featured-collection.liquid` بـ layout `overlay` و `assets/section-featured-collection.css`). التوكنز في §13.1 والفروقات في §13.2.
- **الإطار:** على الموبايل full-bleed من غير حواف (زي الأصل). من md وطالع جوه `.unix-container` بحواف `--r-md`. من غير margin فوق ولا تحت (الأصل `no-indent`).
- **الخلفية:** صورة التاجر `object-fit: cover`، تحتها `--c-surface-sand`. النسبة **أدنى** 4:5 في كل المقاسات (`--banner-ratio`؛ 6.4، D122: كانت 16:9 من 576px ونص الطول)، زي الأصل (`--mobile-padding-bottom` و `--desktop-padding-bottom` الاتنين 125%)، و**صورة الموبايل** (اختيارية) بتتبدل عند 576px. الصندوق بيطول لو المحتوى أطول (`overflow: clip` مش `hidden`). الصورة `loading="lazy"` و `alt=""` (خلفية، والعنوان هو اللي بيوصف السكشن).
- **التعتيم:** `--c-overlay` بـ opacity من الحقل بس (الافتراضي 30% زي الأصل، والحقل من 30 لـ 60: أقل من 30 مابقاش مسموح من غير scrims). 6.4، D122: اتشال `--c-scrim-top` و `--c-scrim` (كانوا بيخلّوا الصورة بني غامق؛ الأصل wash واحد مسطّح).
- **المحتوى:** صف فوق فيه eyebrow (`--t-micro`، uppercase و +0.08em في الإنجليزي بس) بعده العنوان (`--t-h2`، h2)، باللون `--c-text-inverse`، **والأسهم في آخر نفس الصف** ناحية النهاية (زي grid الأصل `"info info buttons"`). تحت: كاروسيل منتجات التصنيف المختار بـ `salla-products-slider` (`source="categories"`). الأسهم الأصلية بتاعة `salla-slider` مستخبية، وأسهمنا بتتحكم في نفس الـ Swiper (`swiper.slidePrev/slideNext`).
- **المسافات (زي الأصل):** padding-block `--s-5` (20) ثم `--s-6` (32) من lg، و padding-inline `--s-5` (20) ثم `--s-8` (64) من lg. بين العنوان والكروت `--s-7` (الأصل 40).
- **الكروت:** عرض `--card-w-sm` ثم `--card-w-md` من lg، والمسافة بينهم `--s-2` ثم `--s-5` (الأصل 8 / 24)، يعني padding نص المسافة: `--s-1` ثم `--s-3`. الكارت نفسه شفاف، والصورة على `--c-surface` (الأصل: media أبيض)، والاسم والسعر `--c-text-inverse` فوق الـ scrim، والسعر القديم `--c-text-inverse` بـ `--o-muted`. حلقة الفوكس جوه السكشن `--ring-w` بلون `currentColor` (cream). شكل الكارت الباقي من §8.3: السلايدر عليه class `.unix-products` (ستايل الكارت المشترك، §8.15)، والسكشن بيغيّر الألوان بس.
- **الأسهم:** بتظهر من lg بس (الأصل من 990px) ولما الـ slider يكون جاهز، دواير `--tap` ببوردر `--line-w` بلون `currentColor`، و hover بـ `--c-hover-tint`، و active بـ `--c-press-tint`، والمعطّل `--o-disabled`، والفوكس `currentColor`. على الموبايل سحب باللمس.

### 8.14 Collections Grid («حركة. رياضة. استرخاء.»، `home.unix-collections-grid`)
الكومبوننت `home.unix-collections-grid` (ROADMAP 2.5 · SPEC §4.5 · `reference/shopify-theme/sections/featured-collections.liquid` و `assets/section-featured-collections.css` و `assets/featured-collections.js`). التوكنز في §13.1 والفروقات في §13.2.
- **السكشن:** full-width بخلفية `--c-surface-sand`، والمحتوى جوه `.unix-container` ناحية البداية. من غير margin.
- **المسافات (زي الأصل، بتوكنز موجودة):** padding-block `--s-5` (الأصل 20) ثم `--s-7` من lg (الأصل 40 من 1200px). العنوان ← الوصف ← الزرار ← الكروت بينهم `--s-1` (6.4، D121: زي `.featured-collections__wrapper` في الأصل، عمود flex بـ gap .4rem ومن غير margins، والمسافة الظاهرة أغلبها line-height؛ كانت 32 / 24 / 24px).
- **النص:** العنوان `--t-h2` (h2)، بعده الوصف `--t-body` بوزن 700 (الأصل `<strong>`)، وبعدهم زرار primary (§8.2، D106؛ كان outline لحد 6.1)، وحلقة الفوكس بتاعته `--c-text-brand` لأن الـ taupe على sand-300 تباينه 2.69 (§1.3). النص بلون `--c-text-brand`.
- **الزرار (6.4):** outline (§8.2، بيعدّل D106).
- **الكروت:** نسبة 3:4، وحواف `--r-md`، وصورة cover، وفوقها `--c-overlay` بـ opacity من الحقل (الأصل 10% / 20% / 20%) و `--c-scrim`. اسم التصنيف `--t-h4` (h3) بلون `--c-text-inverse` تحت ناحية البداية، padding `--s-3` ثم `--s-5` من lg. الكارت كله لينك (stretched link على `::after`). **حلقة الفوكس على الـ `::after`** (`--ring-w`، offset سالب `--ring-w`، و `border-radius: var(--r-md)` زي الكارت) بلون `--c-text-inverse` فوق الـ scrim، و `--c-text-brand` في الكارت اللي من غير صورة. Hover: الصورة `scale(var(--zoom-hover))` في `--d-reveal` (§5)، ومع reduced-motion مافيش scale. كارت من غير صورة: خلفية `--c-surface-muted` والاسم `--c-text-brand` من غير scrim.
- **الترتيب:** صف أفقي بـ scroll-snap: 1.5 كارت في الشاشة على الموبايل، و 2.5 من 576، و 3 من lg (زي الأصل). المسافة `--s-2`. أقصى عرض للصف `--collections-max`. تحت lg الصف بيوصل لحافة الشاشة ومن غير scroll أفقي للصفحة. الصف نفسه `tabindex="0"` وليه `aria-label` (عشان يتحرك بالكيبورد حتى لو الكروت من غير لينكات).
- **الأسهم (زي الأصل):** بتظهر بس لما الكروت **أكتر من 3**، ومن lg، على جانبي الصف في النص رأسيًا. نفس شكل أسهم §8.13 بس بلون `--c-text-brand` على `--c-surface-sand`. بتحرّك الصف كارت واحد (`scrollBy`، و smooth إلا مع reduced-motion)، وبتتعطّل عند الأطراف. JS صغير vanilla (`partials/unix-collections-grid.js`).

### 8.15 Products Tabs («المفضلة دائما»، `home.unix-products-tabs`) — *المرحلة 2.3*
مطابق لـ `reference/shopify-theme/sections/products-with-tabs.liquid` و `templates/index.json → products_with_tabs` (SPEC §4.3).
- **الخلفية:** `--c-bg-cream` (scheme «Cream» في الأصل، D109).
- **الترتيب (زي الأصل):** من 750px: صف العنوان فيه العنوان (h2 بـ `--t-section`، ناحية البداية؛ و `--t-section-sm` تحت 750) وسهمين prev/next (`--tap`، بيحركوا سلايدر التاب النشط؛ من 6.4 أسهم عادية ← → stroke 1.5 من غير دايرة ولا بوردر زي `swiper-button` في الأصل، hover `--o-muted`، والمعطّل `--o-disabled`) وزرار primary (§8.2، D106)، وتحته التابات، وتحتهم سلايدر المنتجات. أقل من 750px: العنوان في النص، وأقل من 576px الأسهم مستخبية (سوايب بس)، والزرار عرضه كامل تحت السلايدر. أسهم `salla-slider` نفسها مستخبية.
- **العنوان والزرار والسلايدر (6.4، زي unix.sa):** العنوان `--t-section` (§2.2)، وتحت 750 `--t-section-sm` (21px) في النص (D119؛ الـ CSS الـ inline بتاع السكشن في الأصل)، وناحية البداية من 750. الزرار outline (§8.2، بيعدّل D106). السلايدر: المسافة بين الكروت `--slider-gap` (8px، و 24px من lg؛ الأصل `spaceBetween` 8 ثم 24 من 1200)، والسكشن `overflow: hidden` والسلايدر `overflow: visible`، فالكارت اللي بعد آخر كارت ظاهر بيبان طرفه عند حافة الشاشة ناحية النهاية (الأصل `.products-with-tabs {overflow:hidden}` و `__slider {overflow:visible}`). تحت السلايدر **خط تقدّم** رفيع زي الأصل (`swiper-pagination-bullet`: أجزاء لازقة في بعض، ارتفاع `--line-w`، الباقي `--c-border` والنشط `--c-text`)، `--s-5` فوقه، ومستخبي لو كل الكروت ظاهرة. `aria-hidden` لأن الأسهم والسوايب هما التحكم. نفس الكلام على «اختيارات تناسبك» في السلة (§8.35)، اللي **بيستخبى كله بأسهمه** لو المصدر رجّع صفر منتجات.
- **التابات:** pills بتسكرول أفقي من غير ما الصفحة تسكرول. الارتفاع `--tap`، و padding-inline `--s-5`، والمسافة `--s-2`، والخط `--t-small` 500. النشط: خلفية `--c-action` ونص `--c-on-action` (جوه scheme Cream = ink-700 / cream-50، زي `button--secondary` في الأصل، §1.4). الباقي: شفاف بـ inset `--line-w` من `--c-border`، و hover بـ `--c-surface-muted`. لو فيه تاب واحد بس التابات مابتظهرش.
- **ARIA tabs pattern:** `role=tablist/tab/tabpanel`، و `aria-selected`، و roving `tabindex`. الأسهم بتنقل الفوكس حسب الاتجاه (في RTL السهم الشمال = التالي)، و Home/End، والتفعيل بـ Enter/Space (manual activation لأن كل تاب بيعمل request).
- **المنتجات:** `salla-products-slider` لكل تاب. المصدر بنفس ترتيب الأصل: التصنيف (`categories`) لو متحدد، وإلا المنتجات المختارة (`selected`)، وإلا أحدث المنتجات (`latest`) عشان السكشن مايبقاش فاضي. الأعمدة 2 / 3 (md) / 4 (lg) والمسافة `--slider-gap` (§4.1؛ أرقام `spaceBetween` في الـ twig نسخة منها لأن Swiper محتاج px).
- **من غير CLS:** أول تاب بس بيترسم، والباقي جوه `<template>` بيتركّب أول ما التاب يتفعّل (request واحد لكل تاب وقت الحاجة). لحد ما السلايدر يجهز فيه skeleton بنفس الأعمدة ونسبة `--ratio-product` وتلات سطور بنفس مقاس الكارت (`--t-card` / 1.4، و `--s-1` بينهم: العلامة والاسم سطر واحد والسعر، 6.4)، وبيختفي لما الكروت تظهر أو لما `componentOnReady` بتاع السلايدر يخلص (حتى لو المصدر فاضي).
- **الزرار:** نصه ولينكه بيتغيروا مع التاب زي الأصل: نص زرار التاب لو موجود، وإلا «تصفحي + اسم التاب». واللينك: لينك زرار التاب، وإلا لينك التصنيف، وإلا لينك السكشن. لو مافيش لينك بيبقى `aria-disabled`.
- **المسافات:** `--section-sm` فوق وتحت (الأصل `s/s`).

### 8.16 Featured Products («اختاري قطعتك المفضلة لوقت الاسترخاء»، `home.unix-featured-products`) — *المرحلة 2.6*
مطابق لـ `reference/shopify-theme/sections/featured-products.liquid` و `snippets/product-card-horizontal.liquid` و `templates/index.json → featured-products` (SPEC §4.7).
- **صف العنوان (`.section-top`، D120):** العنوان h2 بـ `--t-h2-shop` (D119) ناحية البداية في كل المقاسات، وسهمين ← → `.unix-carousel-arrow` بتوع الثيم ناحية النهاية **من 990 بس** (تحت كده سوايب)؛ أسهم `salla-slider` نفسها مستخبية. تحت السلايدر خط التقدّم المشترك (`.unix-carousel-progress`، §8.15). الاتنين من `js/partials/unix-carousel-nav.js` (مشترك مع §8.15).
- كل عنصر: صورة لايف ستايل من التاجر (`object-fit: cover`، نسبة `--ratio-product` 2:3 زي الأصل 418 × 627، **من غير حواف تحت 990** و `--r-md` من 990) وفوقها تحت ناحية البداية كارت صغير أفقي: صورة المنتج (`--s-8` عرض، نسبة `--ratio-card`، حواف `--r-sm`)، والاسم (`--t-body` 500، سطرين بالكتير)، والسعر (`--t-small`، tabular)، وسهم chevron بيتعكس في RTL (`.icon-dir`). الكارت كله لينك واحد للمنتج.
- الكارت: خلفية `--c-bg-cream`، و padding `--s-3`، وحواف `--r-md`، وعرضه `min(100% - 2 × المسافة، --overlay-card-max)`، وبعده عن حواف الصورة `--s-4` (`--s-5` من md). الـ hover: خلفية `--c-surface`، والصورة اللي ورا بتكبر `--zoom-hover`. الفوكس: حلقة `--ring-w` `--c-accent`. الـ active: `--press-y`.
- كاروسيل `salla-slider`: 1 تحت 750 (سوايب)، و 2 من 750، و 3 من 1200، والمسافة `--s-2` ثم `--s-5` من 750 (زي `featured-products.js` بـ `data-columns: 3`؛ breakpoints على مستوى الكومبوننت زي §8.17). تحت 990 السلايدر من حافة لحافة (`margin-inline` سالب `--page-margin`). قبل ما السلايدر يجهز، الشرايح بتترص بنفس العرض (من غير CLS).
- لو صورة اللايف ستايل فاضية، صورة المنتج بتتحط مكانها. لو سلة مارجعتش بيانات المنتج في Twig، الاسم والسعر والصورة بيتملوا من `salla.product.api` في request واحد للسكشن، ولحد ما ييجوا فيه bars بنفس ارتفاع النص.
- **من غير منتجات مختارة** (القيمة الافتراضية فاضية): 4 شرايح من أحدث المنتجات بصورها، زي fallback الـ «latest» في §8.15.
- منتج اتمسح أو اتخفى: الشريحة بتاعته بتتشال والسلايدر بيتحدّث (`swiper.update()`). لو مافضلش شرايح أو الـ request فشل، السكشن كله بيستخبى.
- **المسافات:** `--section-sm` فوق وتحت (الأصل `m/m`).

### 8.17 Blog «من عالم UNIX» (`home.unix-blog`) — *المرحلة 2.8*
مطابق لـ unix.sa (SPEC §4.12، و `reference/shopify-theme/templates/index.json → featured_blog` و `sections/featured-blog.liquid` و `snippets/article-card.liquid` و `assets/featured-blog.js`). مافيش tokens جديدة، كله من الموجود (منها `--ratio-card` و `--zoom-hover` من §13.1). الفروقات عن الأصل في §13.2.
- **السكشن:** خلفية `--c-bg-cream` (scheme Cream). العنوان `h2` بـ `--t-h2` (زي عناوين السكاشن في الأصل).
- **المسافات (الأصل `l/l` = 40px، و 80px من 750، و 112px من 1440):** `--section-sm` تحت 750 (= 40px بالظبط في المدى ده)، و `--section-md` من 750 (64 → 112، بيوصل 80 عند 1000 و 112 عند 1440). نقطة الـ 750 استثناء على مستوى الكومبوننت زي الأصل (§13.2). شوف الملاحظة في §3.2.
- **الترتيب (زي `section-grid-slider` في الأصل):** من 576 وطالع: العنوان ناحية البداية، وبعده الأسهم، وبعدها زرار primary «تصفّحي المقالات» في صف واحد، والكروت تحتهم. تحت 576: العنوان، بعده الكروت، بعدها الزرار بعرض كامل، والأسهم مخفية (سحب بس، زي الأصل). لو العنوان أو الزرار مش موجودين، الصف بتاعهم بيتشال من الجريد (مافيش gap فاضي).
- **الكاروسيل (زي breakpoints بتاعة `featured-blog.js` مع `columns: 4`):** كارت واحد تحت 576، و 2 من 576، و 3 من 750، و 4 من 1200. ده استثناء على مستوى الكومبوننت من breakpoints الجريد في §3.3 (§13.2). المسافة `--gutter`. السهم بيحرّك صفحة كاملة (الكروت الظاهرة) زي `slidesPerGroup`. على الموبايل الكارت اللي بعده بيبان منه `--s-7`. عمود الأسهم محجوز من الأول (`visibility: hidden`) لحد ما الـ JS يقيس، فمافيش layout shift؛ لو الكروت كلها ظاهرة الأسهم بتفضل مخفية والمكان محجوز. في الأول والآخر السهم بياخد `aria-disabled="true"` (مش `disabled`، عشان الفوكس مايقعش) والضغطة بتتجاهل.
- **العدد:** لحد 7 مقالات، و 3 بس على الموبايل (`post_limit` و `post_limit_mobile` زي الأصل).
- **الكارت (`article-card` في الأصل، من غير صورة):** فوقه خط `--line-w` `--c-border` و `--s-4` padding فوق، وبعدين التاريخ (`--t-small`، `--c-text-muted`، `<time>` بتاريخ متترجم)، والعنوان (`--t-h4`، 3 سطور بالكتير)، والمقتطف (`--t-small`، `--c-text-muted`، أول 150 حرف زي `truncate: 150` في الأصل، و 3 سطور بالكتير). الكارت كله لينك واحد (stretched link)، والـ focus ring حوالين الكارت كله. الـ hover: العنوان بياخد `--o-muted` (.7؛ الأصل .8 ومافيش token ليها، §13.2).
- **صورة اختيارية** (مقفولة افتراضيًا زي الأصل): `--ratio-card` (4:5، §6) بحواف `--r-md` فوق النص، و lazy مع width/height، و `alt=""` لأنها زينة (العنوان هو نص اللينك). لما الصورة بتظهر الخط اللي فوق الكارت بيتشال. الـ hover: `scale(var(--zoom-hover))` في `--d-reveal`.
- **الأسهم:** أزرار دايرة `--tap` (44px)، وبوردر `--line-w` `--c-border`، وأيقونة chevron stroke 1.5 بـ `--icon-sm` بتتعكس في RTL (`.icon-dir`). hover `--c-hover-tint`، و active `--c-press-tint` مع `--press-y`، و disabled (`aria-disabled`) `--o-disabled`.
- **reduced-motion:** السكرول بيبقى فوري (الـ `scroll-behavior: smooth` شغال بس مع `no-preference`)، ومافيش scale على الصورة.

### 8.18 Video Tiles (فيديوهين جنب بعض)
الكومبوننت `home.unix-video-tiles` (ROADMAP 2.7 · SPEC §4.8 · `reference/shopify-theme/sections/banner-grid.liquid` و `assets/section-banner-grid.css` و `assets/banner-grid.js`). مطابق لـ unix.sa مع الفروقات في §13.2، والتوكنز في §13.1.
- **الشكل:** بطاقات فيديو بنسبة `--tile-ratio` (3:4)، وحواف `--r-md`، وطبقة خفيفة `--c-tile-overlay` (.2 زي الأصل)، ومن غير نص افتراضيًا. الخلفية لحد ما الميديا تحمّل `--c-surface-muted`. السكشن cream وفيه padding من فوق بس (`--section-md`).
- **التخطيط:** عمودين من md (768) بمسافة `--s-5` (24 زي الأصل). تحت md: بطاقة واحدة في العرض وسحب أفقي (CSS scroll-snap، من غير Swiper) بمسافة `--s-2` (زي `spaceBetween: 8`). الـ scroll جوه الـ track بس، فالصفحة مافيهاش scroll أفقي.
- **الفيديو:** MP4 من رابط نصي (نفس أسلوب الهيرو، D14)، `muted loop playsinline preload="none"`. الـ src بيتحط بس لما البطاقة تقرب من الشاشة، وبيشتغل وهي ظاهرة ويقف لما تخرج (زي الأصل، حتى لو اتسحبت برا الـ track). صورة الغلاف (lazy، 720×960) تحته لحد ما يشتغل فعلًا، وبعدين بيظهر بـ fade في `--d-base`.
- **reduced-motion / Save-Data:** مافيش تشغيل تلقائي؛ الغلاف بيفضل، وزرار التشغيل بيشغّله لو الزائرة عايزة.
- **زرار إيقاف/تشغيل** لكل بطاقة: دايرة `--tap` (44px) خلفيتها `--c-surface` والأيقونة `--c-action` (تباين مضمون فوق أي فريم)، تحت ناحية النهاية على بعد `--s-3`. hover `--c-surface-muted`، وفوكس حلقة ink جوه الدايرة، و active `--press-y`. البطاقة اللي الزائرة وقفتها بتفضل واقفة.
  - **ARIA زي الهيرو (§8.1):** `aria-label` ثابت «أوقفي الفيديو» (`blocks.unix.video_tiles.pause_video`)، والحالة في `aria-pressed` بس (`true` = الفيديو واقف، والأيقونة بتبقى play). مافيش تبديل للـ label.
- **رابط البطاقة كلها** (`full_link` في الأصل): لينك فوق البطاقة كلها، اسمه للقارئ من النص لو موجود، وإلا من حقل `link_label` (الافتراضي «تسوقي الآن»). مع الـ hover (أجهزة الماوس بس) أو فوكس الكيبورد على اللينك نفسه (`:has(:focus-visible)`) الميديا بتكبر `--zoom-hover` في `--d-reveal` (نمط Image hover في §5)؛ فوكس زرار التشغيل لوحده مابيكبّرش. الفوكس حلقتين جوه البطاقة: cream (`--c-text-inverse`) وجواها ink (`--c-action`)، فواحدة منهم على الأقل بتعدّي 3:1 على أي فريم وعلى خلفية الـ sand لما مافيش ميديا.
- **نص اختياري** على البطاقة: تحت ناحية البداية فوق `--c-scrim`، بلون `--c-text-inverse` و `--t-h4`.

### 8.19 FAQ (الأسئلة الشائعة)
الكومبوننت `home.unix-faq` (ROADMAP 2.9 · SPEC §4.18). المواصفات كاملة تحت §8.10 Accordion (بند «الأسئلة الشائعة»)، والتوكنز في §13.1، والفروقات في §13.2.

### 8.20 Product Gallery (جاليري صفحة المنتج) — *المرحلة 3.1*
مطابق لـ `reference/shopify-theme/sections/main-product.liquid` (`gallery_type: slider_previews`، و `gallery_type_mobile: slider`) و `assets/section-main-product.css` (SPEC §5.1). الكود: `src/views/components/product/unix-gallery.twig` و `04-components/unix-gallery.scss` و `js/partials/unix-gallery.js`.
- **الصور:** نسبة `--ratio-pdp` (2:3 من 6.4، كانت 4:5) ثابتة لكل الشرايح (مكان محجوز، من غير CLS)، والخلفية `--c-surface-muted`. الـ fit من إعداد المتجر `slider_background_size` (الافتراضي `contain` زي الأصل). أول صورة `loading="eager"` و `fetchpriority="high"` (هي الـ LCP)، والباقي `lazy`. الـ `alt` نص الصورة من سلة، وإلا اسم المنتج.
- **الموبايل (أقل من 768px):** سلايدر `salla-slider` بعرض الشاشة كله (full-bleed) ومن غير حواف، سوايب بس (اتجاه السوايب بيتبع `dir`: في RTL الصورة اللي بعدها جاية من الشمال، فالسحب ناحية اليمين بيجيبها، زي Swiper في الأصل). تحته **خط تقدّم واحد** (`swiper-pagination`، الأجزاء لازقة في بعض من غير مسافات، 6.4 زي unix.sa): خط `--line-w` بلون `--c-border` والجزء النشط `--c-text`، ومساحة اللمس لكل جزء ارتفاعها `--tap`. مافيش أسهم ولا thumbnails.
- **تقسيم الصفحة (6.4، زي unix.sa):** تحت lg الجاليري فوق والمعلومات تحته، وعمود المعلومات بعيد `--page-margin` عن حافة الشاشة (`.container--product-details` بياخد `--page-margin` بدل padding الـ Tailwind container اللي كان 10px تحت 768). من lg جريد عمودين: الجاليري `--pdp-media-share` (62%) والمعلومات `--pdp-info-share` (38%)، والمعلومات في نص عمودها بعرض `--pdp-info-max` (335px)، فالمسافة بينهم حوالي 80px على 1366 زي الأصل. الجريد كله أقصاه `--pdp-max` (1215px) في النص (6.4، D123).
- **الديسكتوب (من 768px):** الصورة الكبيرة سلايدر بحواف `--r-md`، وجنبها **ناحية البداية** عمود thumbnails عرضه `--gallery-thumb-w`، والمسافة بينهم `--s-1` (الأصل .4rem). العمود طوله نفس طول الصورة، وبيسكرول جواه لو الصور كتير (من غير scrollbar ظاهر)، والـ thumbnail النشط بيتسكرول لحد ما يبان.
  - **Thumbnail:** زرار (`button`) نسبته `--ratio-pdp` وحواف `--r-sm`. الافتراضي opacity `--o-thumb`، والـ hover والنشط (`aria-current="true"`) opacity 1، في `--d-fast`. Focus-visible: حلقة `--ring-w` `--c-accent` جوه الزرار. Active: `--press-y`. لو فيه صورة واحدة بس العمود مابيظهرش والصورة بتاخد العرض كله.
  - **الأسهم:** زرارين `--tap` فوق الصورة في النص، السابق ناحية البداية والتالي ناحية النهاية، أيقونة سهم خطّي ← → `--icon-md` (6.4، D123: زي `icon-caret` في `swiper-button` الأصل، كانت chevron) بلون `--c-text` من غير خلفية. مع الـ hover بيتحركوا `--s-2` ناحية اتجاههم. Disabled (أول/آخر صورة، مافيش loop) opacity `--o-disabled`. الأيقونات `.icon-dir` بتتعكس في RTL.
- **الزووم (موبايل وديسكتوب زي الأصل):** كل صورة جواها زرار شفاف بيغطيها (`aria-label` «كبّري الصورة 2 من 5»)، **من غير أيقونة عدسة** (6.4، D123: زي `modal-opener` في الأصل، الصورة نفسها هي الزرار). الضغط بيفتح `<dialog>` native بملء الشاشة (`showModal`: الفوكس جوه، Esc بيقفل، والفوكس بيرجع للزرار اللي فتحه، وسكرول الصفحة بيتقفل):
  - الخلفية `--c-bg`. الصور `contain` (زي `image_fit_modal` في الأصل) في شريط أفقي بـ scroll-snap (السوايب native ومظبوط في RTL)، والصور فيه `lazy` فمابتتحمّلش غير لما الدايلوج يتفتح.
  - فوق: عدّاد «2 من 5» (`--t-small`، tabular) ناحية البداية، وزرار إغلاق `--tap` ناحية النهاية. الأسهم السابق/التالي `--tap` على الجنبين من 768px، وأسهم الكيبورد بتنقل حسب الاتجاه.
  - زرار «كبّري الصورة أكثر» (`aria-pressed`) أو الضغط على الصورة بيكبّرها `--zoom-scale` (2×)، والسحب/السكرول جوه الصورة بيحرّكها (scroll native، من غير JS للـ pan). الضغط تاني بيرجّعها.
  - الحركة: الدايلوج بيظهر بـ opacity في `--d-base` بس، وبيتقفل مع reduced-motion.
- **الفيديو والـ 3D:** شريحة الفيديو بتفضل على `fslightbox` بتاع رائد (أيقونة تشغيل)، وشريحة الـ 3D على `model-viewer`. الاتنين مالهمش زووم.
- **مع خيارات المنتج:** `listen-to-thumbnails-option` بتاع `salla-slider` بيفضل شغّال (اختيار لون ليه صورة بيروح لشريحتها)، والـ thumbnails والعدّاد بيتحدّثوا مع `slideChange`.
- **تطبيق سلة للموبايل:** لو `salla.mobile.openGallery` موجودة، هي اللي بتفتح بدل الدايلوج (زي رائد).
- **فوق الصورة:** `promotion_title` بتاع المنتج كـ Badge (§8.4) ناحية البداية فوق، والسعرات (لو موجودة) دايرة `--s-8` خلفيتها `--c-surface` تحت ناحية النهاية. **مافيش زرار مفضلة فوق الصورة** (6.4، D123: unix.sa مافيهوش؛ زرار عمود المعلومات من 640px بس). الحاجات اللي تحت بتتزق فوق شريط التقدّم على الموبايل.
- **الكيبورد:** زرار الزووم بتاع الشريحة الظاهرة بس هو اللي في الـ tab order (الباقي `tabindex=-1`)، بعده الأسهم، بعده الـ thumbnails.

### 8.21 Product Info (عمود معلومات المنتج) — *المرحلة 3.2*
مطابق لترتيب البلوكات في `reference/shopify-theme/templates/product.json` و `sections/main-product.liquid` و `assets/section-main-product.css` (SPEC §5.2). الكود: `src/views/pages/product/single.twig` (عمود المعلومات) و `04-components/unix-pdp-info.scss` و `js/partials/unix-sticky-atc.js`.
- **الترتيب:** العنوان ← السعر ← (مكان كود الخصم، فاضي) ← التقسيط (`salla-installment`، 3.5) ← الخيارات ← «اعرفي مقاسك» (§8.11) ← جداول المقاسات (3.4) ← الكمية والإضافة للسلة ← موعد التوصيل (3.6) ← الأكورديون ← التقييم. العناصر بينها `--s-4` (الأصل 1.6rem).
- **العنوان:** `h1` بحجم `--t-page-title` (6.4: نفس `.h2` في الأصل بالظبط، 22.4 → 31 على 1366 → 33px؛ كان `--t-h3`)، Somar Bold في العربي. **في النص من 768** زي الأصل (`.product__title {text-align:center}`)، و**ناحية البداية تحت 768** (العنوان والسعر) زي ما unix.sa بيعرضه على الموبايل.
- **السعر:** في النص، tabular. السعر الحالي `--t-body-lg` 500 بلون `--c-text`، ولو فيه خصم بلون `--c-price-sale` وجنبه القديم `--t-body` `--c-price-old` مشطوب، و Badge (§8.4) «تخفيض» بنص `--c-price-sale` وبوردر `--line-w` `--c-border` (Badge الـ Cream في الأصل). line-height السعر 1.75 (`--t-body-lg`؛ الأصل بيورّث line-height الـ body). تحته دايمًا `--t-small` `--c-text-muted` «الشحن يُحسب عند إتمام الطلب.»، وقبلها «شامل الضريبة.» لو المنتج خاضع للضريبة (6.4، D124: زي `.product__tax` في الأصل؛ كان «شامل الضريبة» بس). السعر بيتحدّث مع الخيارات (`product.js`) من غير ما مكانه يتغير.
- **الخيارات (variant picker):** `salla-product-options` بوضع الأزرار (`config` = `single-option`/`multiple-option` → `button`) زي `picker_type: button` في الأصل. الزرار (6.4، زي `variant-radios` في الأصل): **مربعات بعرض متساوي بتملا الصف** (4 أعمدة، و 3 أو 2 لو القيم أقل)، **من غير حواف** (`border-radius: 0`) والبوردرات لازقة في بعض (`--line-w` `--c-border`، شكل مسافة 1px)، ارتفاع `--tap`، خلفية `--c-bg`، نص `--t-small` → `--t-body` (الأصل 14 / 16px) بوزن عادي. hover: بوردر `--c-text-muted`؛ المختار: بوردر `--c-text` + حلقة داخلية `--line-w` (يعني 2px غامق)؛ focus-visible: حلقة `--c-accent`؛ active: `--press-y`؛ **خلصان:** `--o-disabled` و**خط مايل** من الركن للركن بلون `--c-text-muted` (بعد الـ opacity بيبان رمادي فاتح زي الأصل؛ `--c-border` كان هيختفي على الأبيض) (الأصل `clip-path: polygon(96% 0,100% 0,4% 100%,0% 100%)`) ومن غير «- نفدت الكمية» ظاهرة (`hide-out-label="true"`). **لقارئ الشاشة** الكلمة فاضلة: `::after` مخفي بصريًا على كل مربع خلصان، نصه من `trans('blocks.unix.pdp_info.sold_out_option')` عن طريق `--unix-out-label` على `salla-product-options` (لأن لما `notify_options_availability` شغال سلة بتسيب الخيار الخلصان مفعّل، فالخط المايل لوحده مايكفيش، WCAG 1.3.1). النجمة الحمرا (`*`) والتلميح «اختر» تحت الـ label مستخبيين زي الأصل. الـ label فوق (`--t-small` 500، زي `.form-label`). الألوان: دايرة `--s-6` بحواف `--r-sm`، والمختار حلقة `--ring-w` `--c-text`. الـ thumbnails حواف `--r-sm`.
- **صندوق الإضافات (`.unix-option-panel`، 6.1):** الوزن، وصف «دليل المقاسات» بتاع رائد (في السلة بس، D60)، والملاحظة والمرفق في `partials/product/options.twig`: panel `--c-surface` وبوردر `--line-w` `--c-border` و `--r-md` و padding `--s-5`، و `--s-4` تحته (بدل كارت رائد الأبيض). خانة الملاحظة حقل §8.5 (`.form-input`، textarea بارتفاع `--field-h` × 2)، وسهم «عرض دليل المقاسات» `.icon-dir`.
- **الكمية + الإضافة:** صف واحد زي الأصل (`product-form__buttons-row`): `salla-quantity-input` عرضه `--qty-w` وارتفاعه `--btn-h`، خلفية `--c-field` ومن غير بوردر، pill (حواف أزرار الأصل)، أزرار +/− `--tap` بلون `--c-text-muted` (hover `--c-text`). بعده `salla-add-product-button` primary pill بياخد باقي العرض، وبعده زرار المفضلة (`--tap`) من 640px. الـ quick buy (Apple Pay) بتاع سلة تحت الصف زي «Buy it now» في الأصل.
- **«اشتري الآن» (6.4، D117، بيلغي D108):** زي «Buy it now» في unix.sa (`show_dynamic_checkout` في `templates/product.json`، و `.product-form__buttons` عمود بمسافة .8rem). `quick-buy` بتاع سلة على `salla-add-product-button` (لو `product.can_quick_buy`)، وزرار الشراء المباشر وزرار Apple Pay (`salla-quick-buy`) **كل واحد في صف لوحده بعرض كامل تحت صف الكمية والإضافة**، بنفس مسافة الصف `--s-2`؛ الـ host و `.s-add-product-button-main` بيبقوا `display: contents`، فزرار الإضافة واخد نصيبه كامل في صف الكمية ونصه مابيتقصّش. **من غير `order`** (P7): الترتيب الظاهر = ترتيب الـ DOM، فمن 640px زرار المفضلة بييجي آخر حاجة في صف لوحده تحت الشراء و Apple Pay (unix.sa مافيهوش مفضلة هنا)؛ ومن غير الشراء المباشر الصف زي ما هو. **زرار الشراء (redirect، light DOM):** primary (§8.2) زي `.shopify-payment-button__button` (نفس `unix-button-base`، بعرض الصف)، من غير أيقونة المحفظة؛ ومعاه زرار الإضافة بيبقى `button--secondary` بتاع الأصل (`--c-panel` ونص `--c-action`، hover `--c-panel-hover`). **ويدجت mini-checkout (shadow DOM):** مابنقدرش نلونه، بس ارتفاعه `--btn-h` وحوافه pill من المتغيرات `--salla-fast-checkout-button-*`، وسلة بترسمه outline، فزرار الإضافة بيفضل primary. **النص:** «اشتري الآن» / «Buy now» من `blocks.unix.pdp_info.buy_now`، بيتحط في `salla.lang` (`pages.products.buy_now`) من `partials/unix-buy-now.js`. Apple Pay زي ما سلة بتديه.
- **الأكورديون:** §8.10 (`<details name>`، واحد مفتوح في كل مرة زي الأصل)، كلهم مقفولين افتراضيًا. العنوان `--t-h4` بخط الـ body 500 (الأصل `h4 body-font`)، والمحتوى (`product.description`) `--t-body` بلون `--c-text-muted`، وبوردر فوق وتحت كل عنصر زي `.about__accordion-item`.
- **زرار الإضافة الثابت (موبايل):** تحت 576px بس (الأصل `max-width: 575px`). شريط ثابت تحت بعرض الشاشة، خلفية `--c-bg` وبوردر فوق `--line-w` `--c-border`، padding `--s-4` و `--page-margin`، وتحت `+ env(safe-area-inset-bottom)` (القيمة دي بتبقى 0 لحد ما الـ viewport meta ياخد `viewport-fit=cover`، ولسه مش متضاف، D57). فقاعات الشات بتطلع فوقه وهو ظاهر بس (`body.unix-sticky-atc-on` تحت 576px). جواه زرار primary عرض كامل بنفس نص زرار الإضافة. بيظهر لما زرار الإضافة الأصلي يبقى برا الشاشة (`IntersectionObserver`، زي الأصل حتى قبل ما توصليله)، وبيختفي لما يرجع يبان أو لما الفوتر يظهر. الضغط عليه بيضغط زرار سلة الحقيقي (مافيش منطق سلة تاني)، وحالة التحميل بتتنقل منه. الظهور: `opacity` و `translateY(100%) → 0` في `--d-base` بـ `--ease-out` (مع reduced-motion فوري). وهو مخفي `inert`، ولو الفوكس جواه وهو بيختفي بيرجع لزرار الإضافة الأصلي. الطبقة `--z-sticky-atc` (تحت الهيدر والدرج). `position: fixed` فمافيش CLS. التاجر يقدر يقفله من إعداد `sticky_add_to_cart`.

### 8.22 Installments (تمارا وتابي) — *المرحلة 3.5*
الكود: `<salla-installment class="unix-pdp-installment">` في `single.twig` و `04-components/unix-installment.scss` (SPEC §5.2 البلوكات 5–6، §9).
- `salla-installment` الأصلي بتاع سلة هو اللي بيحمّل سكربت تمارا v2 وتابي بمفاتيح المتجر من إعدادات سلة؛ إحنا مابنحمّلش أي سكربت ولا مفتاح. مكانه بعد السعر وقبل الخيارات، زي `unix_tamara` و Tabby في الأصل، وترتيبهم (تمارا ثم تابي) زي الأصل.
- ويدجت تمارا v2 جوه shadow DOM: بنوصّل له خط الثيم بس عن طريق `--font-primary` / `--font-secondary` على `tamara-widget` (نفس اللي الأصل بيعمله في `tamaraWidgetConfig.css`).
- الـ wrappers اللي برا الـ shadow (تابي، تمارا v1، Spotii، ميس باي، مدفوع، إمكان، الراجحي، كلارنا): خلفية `--c-surface`، بوردر `--line-w` `--c-border`، `--r-sm`، padding `--s-3` `--s-4` (تابي `padding-inline: --s-4` بس، لأن مسافته العمودية جوه الـ shadow root)، من غير ظل ولا hover، نص `--t-small` `--c-text` على البداية. المسافة بينهم `--s-2`. لو مافيش طريقة تقسيط مفعّلة العنصر مابيظهرش (`:empty`).

### 8.23 Size Charts (جداول المقاسات) — *المرحلة 3.4*
مطابق لبلوك `size_guide_custom` في `reference/shopify-theme/templates/product.json` (SPEC §5.2 بند 9، §8.2). الكود: `src/views/components/product/unix-size-charts.twig` و `04-components/unix-size-charts.scss` و `js/partials/unix-size-charts.js`.
- **مصدر البيانات:** «دليل المقاسات» بتاع سلة نفسه (لوحة التحكم ← جداول المقاسات، وبيتربط بالمنتج)، بدل metafields شوبيفاي. الكومبوننت بيظهر بس لو `product.has_size_guide` وإعداد `unix_size_charts_enabled` مفعّل. المحتوى (اسم الجدول والـ HTML بتاعه) بيتجاب بـ `salla.product.getSizeGuides(id)`، نفس الـ API اللي `salla-product-size-guide` بيستخدمه، بعد `window.load` (طلب واحد خفيف، مش بيزاحم الـ LCP)، أو وقت الضغط لو لسه ماتجابش. *(قرار مؤقت D60)*
- **الأزرار:** نص underline (`--line-w`، offset `--s-1`) بحجم `--t-micro` بلون `--c-text`، من غير خلفية، وارتفاع اللمس `--tap`، والمسافة بينهم `--s-3` (الأصل 12px). من السيرفر بيظهر زرار واحد «دليل المقاسات». لو المنتج ليه أكتر من جدول، الأزرار بتتبني من أسماء الجداول: اسم فيه «أعلى/علوي/top» ← «دليل مقاسات الأعلى»، و«أسفل/سفلي/bottom» ← «دليل مقاسات الأسفل»، وأي اسم تاني ← «دليل المقاسات» (لو هو الوحيد) أو «دليل المقاسات: الاسم»؛ والترتيب: العام، بعده الأعلى، بعده الأسفل (زي الأصل). Hover و active: opacity `--o-muted`؛ focus-visible: الحلقة العامة `--c-accent`.
- **الدايلوج:** `<dialog>` native بـ `showModal()` (الفوكس جوه، و Esc بيقفل، والفوكس بيرجع للزرار اللي فتحه، والضغط على الخلفية بيقفل زي الأصل، وسكرول الصفحة بيتقفل بـ `html:has(...)`). الكارت: عرض `100%` لحد `--sg-dialog-w` (900px زي الأصل) مع هامش `--s-4` من الشاشة على الموبايل، وأقصى ارتفاع `--sg-dialog-max-h` (90dvh)، و padding `--s-4`، وخلفية `--c-surface`، و `--e-2`، وحواف `--r-lg` (§4: المودال؛ الأصل 12px). الخلفية `::backdrop` = `--c-backdrop` (الأصل أسود .5). عنوان الدايلوج `sr-only` (الأصل مالوش عنوان ظاهر). *(قرار مؤقت D61)*
- **زرار الإغلاق:** `.unix-icon-btn` (§8.2، «أغلقي النافذة») فيه × (`--icon-sm`، stroke 1.5) فوق ناحية **النهاية** في هيدر sticky، يعني شمال فوق في العربي زي الأصل (`left: 10px`)، ويمين فوق في الإنجليزي. Hover `--c-hover-tint`، active `--c-press-tint`.
- **المحتوى:** الـ HTML بتاع سلة (`.rte` في الأصل) بـ `--t-small`. الجداول عرض كامل، `border-collapse`، الخلايا padding `--s-2` وبوردر `--line-w` `--c-border` والأرقام tabular، وخلايا العنوان `--c-surface-muted` و 600 (النص عليها `--c-text`، §1.3). لو الجدول أعرض من الشاشة بيسكرول أفقي جوه الكارت بس (مافيش scroll أفقي للصفحة). الصور `max-inline-size: 100%`. لو فيه أكتر من جدول وضغطت قبل ما الأسماء توصل، الجداول كلها بتظهر ورا بعض وكل واحد بعنوانه (`--t-h4`).
- **الحالات:** «لحظة…» لحد ما المحتوى يوصل، ورسالة لو الطلب فشل (والزرار بيفضل شغّال للمحاولة تاني)، في عنصر `role="status"` واحد ثابت في الدايلوج (الـ JS بيغيّر النص بس، وفاضي = مالوش مساحة).
- **السكرول الأفقي:** صندوق كل جدول (`.unix-sg__rte`) `tabindex="0"` و `role="region"` و `aria-label` = اسم الزرار، عشان الكيبورد يقدر يسكرول الجدول العريض؛ حلقة الفوكس جوه الصندوق.
- **الحركة:** الدايلوج بيظهر بـ opacity و `translateY(var(--s-1))` في `--d-base`، وبيتقفل مع reduced-motion.
- **رائد:** صف «دليل المقاسات» بتاع رائد في `pages/partials/product/options.twig` (و `salla-product-size-guide`) مابيظهرش في صفحة المنتج لما الإعداد ده مفعّل، عشان مايبقاش فيه زرارين. في السلة (`is_page('cart')`) بيفضل ظاهر، لأن أزرار يونكس مش هناك (D60).

### 8.24 Delivery Estimate («متى يصلك طلبك؟») — *المرحلة 3.6*
مطابق لـ `reference/shopify-theme/snippets/unix-shipping-estimate.liquid` و `assets/unix-shipping.css` (SPEC §5.2 بند 11، §8.3). الكود: `src/views/components/product/unix-delivery-estimate.twig` و `04-components/unix-delivery-estimate.scss` و `js/partials/unix-delivery-estimate.js`. مكانه تحت أزرار الإضافة للسلة.
- **المنطق (زي الأصل بالحرف):** قايمة الدولة (السعودية أول اختيار، بعدها الدول التانية). السعودية بتظهر قايمة المدن، وأي دولة تانية بتعرض المدة الدولية على طول. المدن في 3 مجموعات (الرياض؛ 10 مدن؛ 36 مدينة + «مدينة أخرى»). النتيجة: «يصلك خلال **المدة**» وتحتها ملاحظة (أيام العمل من الأحد للخميس، أو الجمارك للدولي). تغيير الدولة بيصفّر المدينة.
- **البيانات:** المدد الأربعة وقوايم المدن والدول إعدادات (`unix_delivery_*`، متعددة اللغات)، والفاضي بيرجع لنص unix.sa من الترجمة (نفس نمط شريط الإعلانات §8.6). الفاصل «,» أو «،». الملاحظتين والعناوين من الترجمة بس. *(قرار مؤقت D62)*
- **الصندوق:** بوردر `--line-w` `--c-border` (الأصل ink .16)، وحواف `--r-md` (الأصل 12px)، و padding `--s-3` × `--s-4` (الأصل 14×16px)، ومن غير خلفية (الأصل ink .02، مش باينة). المسافة فوق `--s-4` وتحت `--s-2`.
- **العنوان:** `--t-small` `--c-text`، وأيقونة عربية شحن stroke 1.5 بـ `--icon-sm` بلون `--c-text-muted` (الأصل opacity .55)، والمسافة `--s-2`.
- **القوايم:** `<select>` native (الكيبورد وقارئ الشاشة من المتصفح، و `aria-label` زي الأصل). عرض كامل تحت 768px، وجنب بعض بالتساوي من 768px (الأصل 750). ارتفاع `--tap` (الأصل حوالي 38px؛ §8.5 بيقول 52 بس الصندوق مضغوط زي الأصل)، وخلفية `--c-surface`، وبوردر `--line-w` `--c-border`، و `--r-sm`، والنص `--t-small`. سهم chevron SVG (`--icon-sm`، `--c-text-muted`) ناحية النهاية، يعني شمال في العربي زي الأصل. Hover بوردر `--c-text-muted`، و active بوردر `--c-text`، و focus-visible الحلقة العامة `--c-accent`، و disabled `--o-disabled`. *(قرار مؤقت D63)*
- **النتيجة:** `aria-live="polite"` وموجودة دايمًا في الـ DOM (فاضية = مالهاش مساحة)، عشان الإعلان يشتغل. خط فوقها `--line-w` dashed `--c-border` ومسافة `--s-3`، والنص `--t-small` والمدة 700، والملاحظة `--t-micro` (line-height 1.5) `--c-text-muted` (الأصل opacity .6، اتغيّر عشان التباين AA).

### 8.25 Cashback Note (ملاحظة الكاش باك) — *المرحلة 3.7*
مطابق لـ `reference/shopify-theme/snippets/cashback-note.liquid` (SPEC §7.1، §7.2، §8.4). الكود: `src/views/components/cart/unix-cashback-note.twig` و `04-components/unix-cashback-note.scss` و `js/partials/unix-cashback-note.js`. **مش في صفحة المنتج** (زي الأصل).
- **المكان:** صفحة السلة في العمود الجانبي بعد ملخص الطلب (`salla-cart-summary-card`)، يعني بعد المجموع وزرار الإتمام زي `cashback-note-section` في الأصل (وعلى الموبايل تحت الملخص). في 4.3 بيدخل درج السلة بين المنتجات والفوتر (§8.9). *(قرار مؤقت D66)*
- **المبلغ:** نسبة `unix_cashback_percent` (10) من `cart.sub_total`، مقرّب للهللة زي الأصل، ومكتوب بـ `|money` بتاع سلة. بيتحدّث مع `salla.event.cart.onUpdated` (`sub_total`)، وبيستخبى لو المبلغ صفر.
- **النص:** «يرجع لكِ **المبلغ** رصيدًا بعد استلام طلبك» وتحته «كاش باك ١٠٪ · صالح ٦ أشهر» (النسبة بأرقام عربية في العربي زي الأصل، استثناء من §7؛ والصلاحية من `unix_cashback_validity`). للزائرة: «سجّلي دخولك لاستخدام رصيدك» بيفتح نافذة الدخول بتاعة سلة (`login::open`). سطر رصيد المحفظة الموجود مش متنقل. *(قرار مؤقت D64، D65)*
- **الشكل:** `display: flex`، والمسافة `--s-3` (الأصل 11px)، و padding `--s-4` (الأصل 15×16)، وحواف `--r-md` (الأصل 14px)، والخلفية `--c-note-bg` (ink-700 بـ 5%، زي الأصل بالظبط). نقطة `--s-2` (الأصل 7px) بلون `--c-accent` (الأصل `#8a7f6d`) في نص أول سطر. السطر الأول `--t-body` (line-height 1.7) والمبلغ 600 من غير كسر سطر، والتاني `--t-small` (1.6)، والنقطة في نص أول سطر بـ `calc((var(--t-body) * 1.7 - var(--s-2)) / 2)`. **الاتنين `--c-text`**: الأصل بيبهّت السطر التاني .7، و `--c-text-muted` على الخلفية دي تباينه 4.3 (أقل من AA).
- **لينك الدخول:** زرار نصي underline (`--line-w`، offset `--s-1`) 600 بعد السطر بمسافة `--s-2`، وارتفاع اللمس `--tap` في كل المقاسات (`inline-flex`)؛ تحت 768px بينزل سطر لوحده. Hover و active `--o-muted`، و focus-visible الحلقة العامة.

### 8.26 Reviews (التقييمات) — *المرحلة 3.8*
بديل Judge.me في unix.sa (SPEC §5.3 و §9، و `reference/shopify-theme/assets/unix-reviews.css` و `assets/unix-stars.css` و `templates/product.json` → `apps`). الكومبوننتس بتاعة سلة زي ما هي: `salla-comments` (وجواه `salla-reviews-summary` و `salla-comment-form` و `salla-comment-item`) و `salla-rating-stars`. الستايل من الـ classes العامة بس (`.s-comments-*` و `.s-reviews-summary-*` و `.s-rating-stars-*` و `.s-comment-form-*` و `.s-progress-bar-*`)، ومن غير fork. الكود: `04-components/unix-reviews.scss`.
- **ربط ألوان Judge.me بالتوكنز:** النص `#241e1a` ← `--c-text`. الثانوي `#8a8079` ← `--c-text-muted` (§12). الأزرار `#373542` و hover `#4b4960` ← `--c-action` و `--c-action-hover` (أزرار سلة متربوطة أصلًا، §8.2). النجوم والجزء المليان من شريط التوزيع `#8b7355` ← `--c-accent`. مسار الشريط `#e8e0d5` ← `--c-surface-muted`. النجمة الفاضية والبوردر `#ddd3c6` ← `--c-border`. الحقل `#efeae1` ← `--c-field` وفوكسه `#8b7355` ← حلقة `--c-accent` (§8.5). كارت التقييم `#ffffff` ← `--c-surface` (مافيش أبيض في النظام).
- **الصور الشخصية:** صورة العميلة `--tap` دايرة على `--c-surface-muted`؛ صورة الفورم (لو ظاهرة) `--s-8`.
- **السكشن:** خلفية `--c-bg`، و padding `--section-sm` فوق وتحت، وعرض أقصى `--reviews-max` (1200px، زي `max_width: 1200` في الأصل) في النص، و padding-inline `--page-margin`. العنوان h2 بحجم `--t-h3` ووزن `--fw-bold` (عناوين سكاشن صفحة المنتج في الأصل بـ `h3`)، ونصه من إعداد `unix_reviews_title` وإلا «تقييمات العميلات» (D67). سلة بتظهر العنوان بس لما يكون فيه تقييمات.
- **الملخص:** المتوسط `--t-h2` بخط العناوين و `--fw-bold` و tabular، وجنبه النجوم والعدد (`--t-small`، `--c-text-muted`). صفوف التوزيع: الرقم ونجمة `--c-accent`، والشريط، والنسبة (`--t-micro`، `--c-text-muted`، tabular). الشريط ارتفاعه `--s-2` و pill، المسار `--c-surface-muted` والمليان `--c-accent`. سلة بتكتب لون الشريط وارتفاعه inline، فهنا بس بنستخدم `!important` عشان نغلبهم.
- **كارت التقييم:** خلفية `--c-surface`، وبوردر `--line-w` من `--c-border`، وحواف `--r-md`، و padding `--s-4` (`--s-5` من md)، وبين الكروت `--s-3`. الاسم `--t-body` 500 بخط النص (مش حجم h3 بتاع الثيم)، والتاريخ `--t-small` `--c-text-muted`. علامة «اشترت المنتج»: دايرة `--c-surface-muted` والعلامة `--c-accent-text`، والنص `--t-small` `--c-accent-text` (taupe-700 عشان AA؛ الأصل taupe-500). نص التقييم `--t-body` `--c-text`. رد المتجر: خلفية `--c-bg`، و `--r-sm`، و padding `--s-4`. صور التقييم `--r-sm`.
- **النجوم:** المليانة `--c-accent` والفاضية `--c-border`، في كل مكان (الملخص، والكروت، وجنب اسم المنتج). عدد التقييمات جنبها `--c-text-muted`. الـ label («ممتاز»…) pill خلفيتها `--c-surface-muted` ونصها `--c-text` و `--t-micro`.
- **الفورم والتحكم:** الـ textarea حقل §8.5 (`--c-field`، من غير بوردر، `--r-sm`، ارتفاعه `2 × --field-h`، فوكس `--c-accent`). زرار الإرسال `salla-button` primary (§8.2)، بعرض كامل تحت md زي الأصل. الترتيب `select` حقل §8.5 والـ label بتاعه `--t-small` `--c-text-muted`. «تحميل المزيد» زرار primary. «مفيد» outline small. لينك «تفاصيل التقييم» `--c-accent-text`، والـ hover underline، والفوكس حلقة `--c-accent`.
- **مافيش تقييمات:** الدايرة `--c-surface-muted`، والأيقونة والنص `--c-text-muted`.

### 8.27 «أكملي الإطلالة» و «قد يعجبك أيضًا» (تحت صفحة المنتج) — *المرحلة 3.9*
مطابق لـ `reference/shopify-theme/sections/complete-the-look.liquid` و `sections/product-recommendations.liquid` و `templates/product.json` (SPEC §5.3، §8.12). الترتيب تحت السكشن الرئيسي زي الأصل: «أكملي الإطلالة»، بعدها التقييمات (§8.26)، بعدها «قد يعجبك أيضًا». الـ hooks بتاعة رائد (`before_customer_reviews` و `before_product_recommendations` و `after_product_recommendations`) فاضلة في أماكنها. الكود: `pages/product/single.twig` و `04-components/unix-pdp-related.scss` و `js/partials/unix-pdp-related.js`. الكروت هي كارت المنتج §8.3 (`.unix-products`، و D20/D26) جوه `salla-products-list` (جريد، مش كاروسيل).
- **العناوين:** h2 بحجم `--t-h3` (الأصل `h3` في السكشنين)، والنص من إعدادات الثيم وإلا الترجمة.
- **«أكملي الإطلالة»:** المنتجات من إعداد `unix_complete_look_data` (JSON: رقم المنتج ← أرقام القطع المكمّلة، بديل `custom.complements`، D68)، أول 2 بس (`limit: 2` زي الأصل). لو المنتج مش مكتوب في الإعداد السكشن مابيترسمش خالص، ولو القطع اتمسحت أو الـ JSON غلط بيستخبى. العنوان ناحية البداية، وتحته `--s-5`. الجريد عمودين، و 4 أعمدة من md (يعني القطعتين بياخدوا نص العرض، زي الأصل)، والمسافة `--s-5` بين الصفوف و `--gutter` بين الأعمدة. الـ padding فوق `--s-5` (`--s-6` من md) وتحت `--s-6` (`--section-sm` من md) (الأصل 32 / 40، و ×0.75 على الموبايل).
  - **زرار «أضيفي»** (`salla-add-product-button` نفسه بتاع الكارت): **تحت السعر جوه الـ flow** وبعرض الكارت، ظاهر دايمًا (مش hover ولا أيقونة)، outline (§8.2) بارتفاع `--btn-h-sm` بالماوس، و `--tap` على اللمس (P6)، ومن غير أيقونة الشنطة. النص «أضيفي» (`blocks.unix.complete_look.add`) للمنتج المتاح للبيع بس؛ الطلب المسبق والحجز بيفضلوا بنص سلة. المنتج النافد مالوش زرار (زي الأصل). المنتج اللي فيه خيارات بيتعامل معاه `quickAdd` بتاع سلة.
- **«قد يعجبك أيضًا»:** `salla-products-list` بمصدر `related` بتاع سلة، 4 منتجات (`products_limit: 4`). الخلفية `--c-bg-cream` (scheme Cream، D109)؛ «أكملي الإطلالة» `--c-bg` أبيض زي الأصل. جريد عمودين، و 4 من lg (الأصل عمودين لحد 990 و 4 بعدها؛ 3 أعمدة كانت هتسيب كارت لوحده)، والمسافة `--s-5` و `--gutter`. الترتيب زي `section-grid` في الأصل: من 576 العنوان ناحية البداية والزرار في نفس الصف، وأقل من 576 العنوان في النص والزرار بعرض كامل تحت الكروت. الـ padding فوق `--section-sm`، وتحت `--section-sm` و `--section-md` من 750 (الأصل `s/l`، §3.2). لو سلة مارجعتش منتجات، أو المتجر قافل المنتجات المشابهة، السكشن بيستخبى.
  - **زرار «عرض الكل»:** `.unix-btn` (primary: `--c-action` و `--c-on-action`، ink-700 / cream-50 جوه السكشن Cream ده، §1.4) لأن ده شكل `button--secondary` في scheme Cream على unix.sa وهو واقف (D70). اللينك من إعداد `unix_recommendations_button_link`، وإلا صفحة كل المنتجات (`link('products')`، بدل `/collections/all`).
- **من غير CLS جوه السكشن:** لحد ما الكروت تيجي فيه skeleton بنفس الأعمدة ونسبة `--ratio-card` وتلات سطور (نفس skeleton §8.15)، وبيتشال أول ما يظهر أول كارت.

### 8.28 Colour Links (ألوان الموديل كمنتجات منفصلة) — *المرحلة 3.10*
بديل تطبيق G: Combined Listings في unix.sa (SPEC §5.2 بند 7، §9، و `reference/shopify-theme/snippets/product-linked-products.liquid`). في متجر العميل **كل لون منتج لوحده** (`sculpting-leggings-vanilla` و `-chocolate`…) وليه صفحته و SEO بتاعه، والعنوان «اسم الموديل | اللون». الكود: `pages/product/single.twig` (قراءة الإعداد) و `components/product/unix-colour-links.twig` و `04-components/unix-colour-links.scss`. **مش على الكروت** (unix.sa مخبّيها هناك).
- **مصدر البيانات:** إعداد واحد `unix_colour_links` (textarea متعدد اللغات، والإنجليزي الفاضي بيرجع للعربي)، سطر لكل منتج: `مفتاح المجموعة | رابط المنتج | اسم اللون | #hex | رابط صورة القماش`. الخانتين الأخيرتين اختياريتين، والسطور القديمة بأربع خانات (أو تلاتة) شغالة زي ما هي؛ صورة من غير hex تتكتب بخانة hex فاضية (`… | فانيليا | | https://…`)، أو سطر بأربع خانات الخانة الرابعة فيه بتبدأ بـ `http` بيتقري صورة من غير hex (`… | فانيليا | https://…`). المنتج الحالي = السطر اللي رابطه بينتهي بـ `/p{product.id}`، ومجموعته هي اللي بتظهر. الـ hex اختياري (`#rgb` أو `#rrggbb` بس، أي حاجة تانية بتتشال)، وصورة القماش اختيارية (لازم تبدأ بـ `https://`، غير كده بتتشال). الرابط لازم يبدأ بـ `http` أو `/` (الإعداد بيطلب الرابط الكامل، والمسار اللي بيبدأ بـ `/` بياخد `store.url` قبله). Twig مايقدرش يجيب منتجات تانية، فده الطريق الوحيد إن اللينكات تطلع **من السيرفر** كـ `<a href>` حقيقية (لينكات داخلية الـ crawler يشوفها، 3.11). *(قرار مؤقت D72، والصورة D133)*
- **المكان:** أول حاجة جوه فورم المنتج، قبل خيارات المقاس (مكان «اللون» في variant picker بتاع unix.sa، §8.21). بيظهر بس لو المجموعة فيها منتجين أو أكتر والإعداد `unix_colour_links_enabled` مفعّل.
- **الـ label:** «اللون: فانيليا» (`blocks.unix.colours.label` + اسم لون المنتج الحالي)، `--t-small` 500 بلون `--c-text` والاسم 400، زي `.s-product-options-option-label`. المسافة بينه وبين الدواير `--s-2`. (unix.sa بيكتب «Color : Midnight Blue» بالإنجليزي حتى في العربي لأن التطبيق مش مترجم؛ إحنا بنكتب العربي عن قصد.)
- **القايمة:** `<ul role="list" aria-label="اللون">`، والعناصر جنب بعض بـ wrap ومسافة `--s-3` (unix.sa: دواير 48 بينها حوالي 12px)، بترتيب السطور في الإعداد.
- **الدايرة (فيها hex أو صورة، 6.4، D133، زي `mpg-swatch-circle` في unix.sa):** اللينك نفسه دايرة `--swatch-size` (48px، أكبر من `--tap`) بحواف `--r-pill` وبوردر `--line-w` شفاف، وجواه في النص دايرة اللون `--swatch-dot` (42px): 2px فراغ جوه بوردر 1px (3px من برا الحلقة). لون الدايرة `background-color` inline من الإعداد (محتوى تاجر، مش token)، ولو مافيش hex `--c-surface-muted`. لو فيه صورة قماش بتترسم فوقه `<img>` بـ `object-fit: cover` و `loading="lazy"` و `width`/`height` و `alt=""` (اسم اللون على اللينك)، والـ hex بيفضل باين لحد ما الصورة تحمّل أو لو فشلت. فوق الدايرة خط داخلي رفيع `--line-w` بلون `--c-border-overlay` زي unix.sa؛ على الأبيض تباينه حوالي 1.4 بس، فالدايرة البيضا بالكاد بتبان، واسم اللون في `aria-label`/`title` وفي label «اللون:» (استثناء §1.3). اسم اللون في `aria-label` و `title`. **Hover** (مش الحالي): بوردر اللينك `--c-border`. **الحالي:** `aria-current="page"` وبوردر `--line-w` `--c-swatch-ring` (حلقة رمادي رفيعة بفراغ حوالين الدايرة، زي unix.sa)، و cursor عادي.
- **من غير hex ولا صورة (D73):** زرار نصي pill عشان يقعد جنب الدواير: ارتفاعه `--swatch-size`، padding-inline `--s-4`، خلفية `--c-bg`، بوردر `--line-w` `--c-border`، `--r-pill`، `--t-small` 500. Hover بوردر `--c-text-muted`؛ الحالي بوردر `--c-text` + حلقة داخلية `--line-w`.
- **الحالات:** focus-visible حلقة `--ring-w` `--c-accent` بـ offset `--ring-w` برا الدايرة (أعرض ولون تاني غير حلقة الحالي `--line-w` `--c-swatch-ring`، و 4.49:1 على الأبيض، §1.3)؛ active `--press-y` (مش على الحالي)؛ مافيش disabled لأن الثيم مايعرفش مخزون المنتجات التانية (اللينك بيفتح صفحتها وهي اللي بتقول نفد). الـ transitions `--d-fast` `--ease-out` وبتتقفل مع reduced-motion. RTL: logical properties بس، ومافيش أيقونات اتجاه.

### 8.29 Collection Banner (بانر التصنيف) — *المرحلة 4.1*
مطابق لـ `reference/shopify-theme/sections/main-collection-banner.liquid` و `assets/component-collection-hero.css` و `templates/collection.json → banner` (SPEC §6). الكود: أول `src/views/pages/product/index.twig` و `04-components/unix-plp-banner.scss`. نفس القالب بيخدم التصنيف والعروض والبحث والوسوم وأحدث المنتجات.
- **الألوان (scheme «Ink» في الأصل `#363441` / `#f3eeea`):** خلفية `--c-surface-ink` ونص `--c-text-on-ink` (نفس primitives شريط الإعلانات، تباين 10.6 AAA، §1.3). الوصف بنفس لون النص (مافيش لون ثانوي في الـ scheme ده). حلقة الفوكس جوه البانر `currentColor` لأن الـ taupe على الـ ink تباينه ضعيف.
- **العنوان:** `h1` الصفحة الوحيد (§14): اسم التصنيف، وإلا عنوان الصفحة (العروض، والبحث…). حجمه `--t-page-title` (`.unix-size-page-title`) زي `title--page h2` في الأصل بمقاسه الحقيقي (22.4 → 33px؛ كان `--t-h2` لحد 6.4 وده أكبر من الأصل)، في النص. البانر بيبدأ تحت الهيدر على طول والشريط تحته على طول (مافيش مسافة `space-y` من `<main>` في صفحة التصنيف، ومسار التنقل مقفول افتراضيًا، 6.4). مافيش prefix مخفي «المجموعة:» زي الأصل، عشان الـ `h1` يبقى اسم التصنيف بس *(قرار مؤقت D77)*.
- **الوصف:** تحت العنوان بـ `--s-2` (الأصل .8rem)، `--t-body-lg` (الأصل `body-large`)، وعرض النص كله أقصاه `--plp-banner-text-max` (الأصل 46rem). بيظهر لو سلة بتدّي وصف للتصنيف وإعداد `unix_collection_show_description` مفعّل (افتراضيًا زي الأصل).
- **المسافات:** `--s-5` فوق وتحت (الأصل 20px فوق و 2.5rem تحت الوصف، بـ custom CSS في `collection.json`)، و `padding-inline` بتاع `.unix-container`. البانر عرض الشاشة كله (الخلفية) والمحتوى جوه الكونتينر.
- **الصورة (اختيارية، مقفولة افتراضيًا زي `show_collection_image: false` في الأصل):** لو إعداد `unix_collection_show_image` مفعّل والتصنيف ليه صورة في سلة (`category.image`)، بتظهر تحت النص بـ `--s-4` (`--s-6` من 768، زي الأصل 1.6 / 3.2rem). النسبة `--banner-ratio` (4:5) تحت 576 و `--banner-ratio-wide` (16:9) من 576 (§6، نفس نقطة §8.13)، محجوزة بـ `aspect-ratio` فمافيش CLS، و `object-fit: cover`، وحواف `--r-md`. هي صورة الـ LCP: `loading="eager"` و `fetchpriority="high"` و `srcset` من `cdn(width)` و `width`/`height`. الـ `alt` اسم التصنيف.
- **مافيش حركة ولا عناصر تفاعلية** غير اللينكات اللي ممكن تكون في وصف التاجر (underline بلون النص).

### 8.30 Collection Grid (جريد المنتجات وشريط الترتيب) — *المرحلة 4.2*
مطابق لـ `reference/shopify-theme/sections/main-collection-product-grid.liquid` و `snippets/facets.liquid` (`filter_type: horizontal_united`) و `assets/component-facets.css` و `assets/template-collection.css` (SPEC §6). الكود: `src/views/pages/product/index.twig` و `04-components/unix-plp.scss` و `js/products.js` + `js/partials/unix-plp.js`.
- **منطق سلة زي ما هو:** `salla-products-list` (المصدر `page.slug` / `page.id`، و `filters-results`، و `includes='["images"]'` للصورة التانية) و `salla-filters` و `salla-applied-filters`. مافيش fork، والستايل من الـ classes العامة (`.s-products-list-*` و `.s-filters-*` و `.s-applied-filters-*` و `.s-infinite-scroll-*`).
- **شريط الأدوات (زي `facets__horizontal-top` + `.facets-container`، 6.4):** صف واحد تحت البانر على طول.
  - **تحت 576:** شريط بعرض الشاشة كله (`margin-inline` سالب `--page-margin`) بخط `--line-w` `--c-border` فوق وتحت و padding `--s-2` من كل ناحية (الأصل .8rem). **Sticky** فوق الشاشة (6.4، D132، زي `.facets-container` في الأصل: `position: sticky; top: 0`) بخلفية `--c-bg` وطبقة `--z-plp-bar` (تحت الهيدر والدرج). لما الهيدر يبقى ثابت وظاهر (`.is-stuck` من غير `.is-hidden`) الشريط بينزل تحته على `calc(var(--header-h) - var(--line-w))` (الأصل `top: calc(var(--header-height) - 1px)` لما الهيدر مش مستخبي)، وبيتحرك مع الهيدر `inset-block-start` في `--d-fast` `--ease-out` (من غير حركة مع reduced-motion). من غير `:has()` بيفضل على 0. من غير فلاتر الترتيب بيروح ناحية النهاية. «الفلاتر» والترتيب كل واحد نص العرض وفي نصه، وبينهم خط فاصل `--line-w`. الجريد تحته بـ `--s-7` (الأصل 4rem).
  - **من 576:** من غير خطوط فوق وتحت، الارتفاع `--plp-bar-h`. «الفلاتر» ناحية البداية وبعده خط فاصل بطول الشريط (الأصل `.facets__horizontal-group::after`)، والترتيب ناحية النهاية وقبله خط فاصل (الأصل `.select::before`)، بـ padding `--s-4` جنب كل خط. المسافة `--s-4` (`--s-8` من 1200، الأصل 1.6 / 6.4rem). الجريد تحته بـ `--s-5`.
  - لو مافيش فلاتر (المتجر قافلها، أو التصنيف مافيهوش فلاتر، أو سلة بعتت `filters::hidden`) الزرار بيختفي والترتيب بيفضل ناحية النهاية. الزرار اللي `unix-plp.js` بيحط عليه `hidden` بيتحسب مش موجود: مافيش خط فاصل قبل الترتيب، والترتيب ناحية النهاية.
  - **زرار «الفلاتر»:** أيقونة فلتر stroke 1.5 (`--icon-sm`) + نص `--t-body` 400 (الأصل `body-normal`)، من غير خلفية، ارتفاع `--tap` (و `--plp-bar-h` من 576). Hover: النص `--o-muted` (الأصل foreground .7) على أجهزة الـ hover بس؛ active `--press-y`؛ focus-visible الحلقة العامة. `aria-controls` الدرج و `aria-expanded` و `aria-haspopup="dialog"`. لو فيه فلاتر مختارة جنب النص عددها بين قوسين (tabular).
  - **الترتيب:** `<select id="product-filter">` native (نفس منطق رائد في `products.js`: `?sort=` في الرابط و `sortBy` + `reload()`)، label مخفي «ترتيب حسب» زي الأصل. **نص عادي من غير بوكس** (6.4، زي `.facets-sorting__field` في الأصل): خلفية شفافة ومن غير بوردر، `--t-small` (و `--t-body` من 768)، ارتفاع `--tap` (`--plp-bar-h` من 576)، وسهم ↓ (stroke 1.5، `--icon-sm`، `--c-text`) ناحية النهاية جوه padding النهاية. Hover وactive النص `--o-muted`، و focus-visible الحلقة العامة (inset)، و disabled `--o-disabled`.
- **الفلاتر المختارة** (زي `active-facets` في الأصل): `salla-applied-filters` تحت الشريط بـ `--s-3`: كل فلتر pill (`--r-pill`) خلفيتها `--c-surface` وبوردر `--line-w` `--c-border` ونص `--t-small`، وزرار الشيل جواها `--tap` بأيقونة × (`--icon-sm`، hover `--c-hover-tint`)؛ و«مسح الكل» زرار نصي underline بارتفاع `--tap`. مابيظهرش لو مافيش اختيار.
- **الجريد:** عمودين، و 3 من md، و 4 من lg (§3.3؛ الأصل 2 / 3 من 990 / 4 من 1185، D78). المسافة `--gutter` بين الصفوف والأعمدة تحت 576 (6.4، D126: زي `.collection-product-list--2-mobile` في الأصل، .8rem في الاتجاهين؛ كانت `--s-5` للصفوف)، و `--s-7` بين الصفوف من 576 (الأصل 4.8rem). الكارت هو كارت §8.3 الموحد (`.unix-products`، 4:5، من غير vendor ولا نجوم، D20/D26). أول ما الصفحة تفتح فيه skeleton (نفس skeleton §8.15) صفين (`2 × --cols` كارت) بنفس الأعمدة لحد ما أول كارت يظهر، فمافيش CLS جوه الجريد.
- **الصفحات (D79):** «تحميل المزيد» بتاع سلة (`salla-products-list` بيحمّل الصفحة اللي بعدها بالـ API ويضيفها)، مش أرقام صفحات زي الأصل؛ سلة مافيهاش ترقيم صفحات للتصنيف. الزرار primary (§8.2) في النص بعد الجريد بـ `--s-7`، والـ spinner بتاع سلة وقت التحميل، وجملة «وصلتِ للنهاية» `--t-small` `--c-text-muted` في النص.
- **مافيش نتايج:** placeholder سلة (`.s-products-list-placeholder`) في النص، الأيقونة والنص `--c-text-muted`.
- **إعلان النتايج:** عنصر `role="status"` مخفي (`sr-only`) موجود دايمًا، بيتكتب فيه «تم تحديث النتائج: N منتج» (عدد سلة نفسه `blocks.header.products_count`، و«أكثر من» لو فيه صفحة بعدها) بعد أي فلترة أو ترتيب، مش في أول تحميل.
- **المسافات:** padding تحت `--section-sm` (الأصل `padding_bottom: m`، §3.2)، ومن فوق مافيش (الأصل `no-indent`).

### 8.31 Filters Drawer (درج الفلاتر) — *المرحلة 4.2*
زي `facets__wrapper--horizontal_united` في الأصل: لوحة جانبية بتتفتح من زرار «الفلاتر» **في كل المقاسات** (مش sidebar)، والمقاس بشكل مربعات. الكود: الدرج في `index.twig`، و `Drawer` من `js/partials/unix-drawer.js` (1.3، §8.9)، والتحسينات في `js/partials/unix-plp.js`. سلة بتكتب ارتفاعات و padding inline جوه الفلاتر، فالـ CSS بيستخدم `!important` في الحالات دي بس (نفس استثناء §8.26).
- **الدرج:** نفس درج §8.9 (`.unix-drawer.unix-drawer--start`): بيدخل من ناحية البداية، عرضه `--drawer-w` (الأصل 36.7rem)، خلفية `--c-surface` و `--e-2`، و backdrop `--c-backdrop`. focus trap، و Esc والـ backdrop وزرار × بيقفلوه، والفوكس بيرجع لزرار «الفلاتر». الهيدر: عنوان h2 «الفلاتر» (`--t-h4`) وزرار إغلاق `--tap`.
- **الفوتر الثابت:** «مسح الكل» (`.unix-btn--outline`) بيستدعي `resetFilters()` بتاع `salla-filters`، و«عرض النتائج» (`.unix-btn` primary) بيقفل الدرج؛ الاتنين بالتساوي. سلة بتطبّق الفلتر أول ما يتختار (من غير زرار تطبيق)، والدرج بيفضل مفتوح عشان الاختيار المتعدد، والنتيجة بتتعلن (§8.30).
- **كل فلتر (`salla-filters-widget`):** من غير خلفية ولا حواف، padding `--s-4` فوق وتحت، وخط `--line-w` `--c-border` تحت. العنوان `--t-body` 500 بلون `--c-text` وارتفاعه `--tap`، وعلامة +/− بلون `--c-text-muted` (المفتوح `--c-text`). العنوان بياخد بالـ JS `role="button"` و `tabindex="0"` و `aria-expanded` و Enter/Space (من غير fork). المحتوى بيفتح ويقفل فوري (`height: auto`) عشان سلة بتحسب الارتفاع وهو مخفي.
- **الاختيارات:** كل صف `--tap` ارتفاع، و `--t-small`، والاسم `--c-text` (لون سلة الرمادي تباينه ضعيف). الـ checkbox / radio `accent-color: --c-action` وبوردر `--c-border`، و focus-visible الحلقة العامة. «عرض المزيد» زرار نصي `--c-accent-text` underline بارتفاع `--tap` (بالـ JS `role="button"` و `tabindex="0"`). خانة البحث جوه الفلتر حقل §8.5 مصغّر (`--tap`). حقول السعر (`salla-price-range`) حقول §8.5.
- **الفلتر المميّز (المقاس، `hor_filter: مقاس` في الأصل):** الفلتر اللي اسمه فيه نص إعداد `unix_collection_highlight_filter` (افتراضيًا «مقاس» / «Size») بيتعرض مربعات (`facets__list--hor`): جريد `repeat(auto-fill, minmax(--s-8, 1fr))` بمسافة `--s-2`. كل مربع `--tap` ارتفاع، وخلفية `--c-surface`، وبوردر `--line-w` `--c-border`، و `--r-sm`، و `--t-small` 500 في النص، والـ input نفسه مخفي بصريًا بس فاضل للكيبورد. Hover بوردر `--c-text-muted`؛ المختار بوردر `--c-text` + حلقة داخلية `--line-w` (زي أزرار المقاس §8.21)؛ focus-visible (على الـ input) حلقة `--ring-w` `--c-accent` حوالين المربع؛ active `--press-y`.
- **فلاتر الصور:** unix.sa فيه إعداد فلاتر بصور (`image_filter_ratio: 4/5`، و `image_filter_columns: 2`)، بس فلاتر سلة مافيهاش عرض بالصور، فده مش منطبق هنا (D83).
- **الحركة:** درج §8.9 (`--d-slow` `--ease-in-out`)، والباقي `--d-fast`؛ كله بيتقفل مع reduced-motion.

### 8.32 *(رقم مش مستخدم)*
اتحجز وقت المرحلة 4 ومااتكتبش (مافيش كومبوننت بالرقم ده). سايبينه فاضي عشان الإشارات للأرقام اللي بعده (§8.33 وطالع) ماتتغيرش. *(6.1)*

### 8.33 Cart Drawer (درج السلة) — *المرحلة 4.3*
مطابق لـ `reference/shopify-theme/snippets/cart-drawer.liquid` و `assets/cart-drawer.js` و `assets/components-sections.css` (`.drawer*`) (SPEC §7.1). الكود: `src/views/components/cart/unix-cart-drawer.twig` و `04-components/unix-cart-drawer.scss` و `js/partials/unix-cart-drawer.js`. السلوك الأساسي (focus trap، Esc، الخلفية، رجوع الفوكس) من `Drawer` في `unix-drawer.js` (1.3)، ومافيش منطق سلة من عندنا: البيانات من `salla.cart.api.details(null, ['options'])`، والتعديل `salla.cart.updateItem` / `salla.cart.deleteItem`، والإتمام `salla.cart.submit()`، والتحديث من `salla.cart.event.onUpdated`.
- **بيتفتح من:** أيقونة السلة في الهيدر (`salla-cart-summary`، اللينك بتاعها بيفضل لو الـ JS مااشتغلش)، وبعد كل إضافة للسلة (`salla.cart.event.onItemAdded`) زي unix.sa. وهو شغّال: toast الإضافة بتاع رائد وتنبيه سلة «تمت الإضافة» وحركة الصورة الطايرة للسلة بيتقفلوا (الدرج هو التأكيد). مش موجود في صفحة السلة نفسها (الأيقونة لينك للصفحة). إعداد `unix_cart_drawer_enabled` (مفعّل) زي `cart_type: drawer` في الأصل. *(قرار مؤقت D85)*
- **الجنب:** بيدخل من **ناحية النهاية** (`.unix-drawer--end`: شمال في العربي، يمين في الإنجليزي) زي unix.sa (`justify-content: flex-end` و `[dir=rtl] translate(-100%)`)، يعني من ناحية أيقونة السلة. ده عكس درج المنيو (§5 «Drawer» = ناحية البداية). العرض `--drawer-w`، وخلفية `--c-surface`، و `--e-2`، والركنين الداخليين `--r-lg`، والخلفية `--c-backdrop` + `--blur-backdrop`، والحركة `--d-slow` `--ease-in-out` (§8.9). *(قرار مؤقت D86)*
- **الهيدر:** `h2` «السلة (n)» (`--t-h4`، و n من عدد سلة) وهو اسم الدايلوج (`aria-labelledby`)، وزرار إغلاق `--tap`. تحته شريط الشحن المجاني (§8.34). *(قرار مؤقت D87)*
- **المنتجات:** `ul` بمسافة `--s-5` بين العناصر، و padding `--s-5`. كل عنصر: صورة `--cart-thumb-w` (84px) بنسبة `--ratio-cart-thumb` (3:4، الأصل `cart_image_ratio: 3/4` و cover) وحواف `--r-sm`، والاسم لينك `--t-small` `--c-text` (hover `--o-muted`)، والخيارات `--t-micro` `--c-text-muted` («المقاس: M»)، وسطر تحت فيه الكمية (`salla-quantity-input` بشكل §8.21: pill `--c-field`، عرض `--qty-w`، ارتفاع `--tap`)، والسعر (`--t-small` 500 tabular؛ وقت الخصم السعر بعد الخصم ومعاه القديم `--c-price-old` line-through)، وزرار حذف أيقونة سلة stroke 1.5 `--icon-sm` جوه `--tap` بلون `--c-text-muted` (hover `--c-text`). صورة اللينك `tabindex="-1"` و `aria-hidden` (نفس لينك الاسم). العنصر وهو بيتحدّث: `aria-busy` و `--o-disabled`. المنتج النافد: «نفدت الكمية» بدل السعر.
- **أول فتح:** الصفوف بتتجاب بعد الفتح (عناصر السلة مش موجودة في Twig برا صفحة السلة)، فيه skeleton صفين (`--c-surface-muted`) لحد ما توصل.
- **الكاش باك:** §8.25 بين المنتجات والفوتر، بـ padding-inline `--s-5` (الأصل `.cbk-drawer-wrap {padding: 0 16px}`).
- **الفوتر:** ثابت تحت (§8.9)، بوردر فوق `--line-w` `--c-border`، و padding `--s-5`، والمسافة `--s-4`. «المجموع الفرعي» والمبلغ في صف واحد (`--t-body-lg`، المبلغ 500 tabular). بعده «إتمام الطلب» و «عرض السلة» بعرض كامل، الاتنين `.unix-btn` primary (زي `button--secondary` في scheme Cream على unix.sa، D70). وتحتهم ملاحظة الضريبة `--t-small` `--c-text-muted`. *(قرار مؤقت D89)*
- **فاضية:** «لا تفوّتي جديدنا!» (`--t-body-lg` 500) وتحتها النص (`--t-body` `--c-text-muted`) وزرار primary «تسوقي الآن» لكل المنتجات، بمسافة `--s-4`؛ النصين إعدادات (`unix_cart_empty_*`) والفاضي = نص unix.sa.
- **قارئ الشاشة:** `role="status"` مخفي (`sr-only`) بيقول العدد والمجموع بعد كل تغيير (مش في أول فتح). المجموع نفسه مش live عشان مايتقالش مرتين.
- **reduced-motion:** الدخول والخلفية من غير حركة (`--d-slow` بيبقى 0)، والـ skeleton من غير نبض.

**Tokens (4.3–4.4):**
| Token | القيمة | الاستخدام |
|---|---|---|
| `--cart-thumb-w` | 84px | صورة المنتج في الدرج وفي صفحة السلة على الموبايل (الأصل `.drawer .cart-item__media {width: 8.4rem}`) |
| `--cart-thumb-w-lg` | 120px | صورة المنتج في صفحة السلة من md |
| `--ratio-cart-thumb` | `3 / 4` | نسبة صورة السلة (الأصل `cart_image_ratio: 3/4`) |
| `--cart-aside-w` | 384px | عمود الملخص في صفحة السلة من lg (عرض رائد الأصلي `w-96`) |

### 8.34 Free Shipping Bar (شريط الشحن المجاني) — *المرحلة 4.3*
مكانه في هيدر درج السلة (زي `cart-shipping-slider` في الأصل) وأول حاجة في عمود الملخص في صفحة السلة (بدل كارت الشحن بتاع رائد). الكود: `components/cart/unix-free-shipping.twig` و `04-components/unix-free-shipping.scss` و `js/partials/unix-free-shipping.js`.
- **البيانات:** لو المتجر عنده قاعدة شحن مجاني في سلة (`free_shipping_bar` في بيانات السلة) هي اللي بتحكم (الحد والباقي والنسبة)؛ وإلا حد الثيم `unix_free_shipping_threshold` (500، D1) مقارنة بـ `sub_total`. إعداد `unix_cart_free_shipping` (مفعّل؛ في unix.sa مقفول). *(قرار مؤقت D88)*
- **النص:** «أنفقي **المبلغ** إضافية للحصول على شحن مجاني داخل السعودية»، ولما توصل «مبروك! أصبحتِ مؤهلة للشحن المجاني!» (نص unix.sa بالحرف، بعلامات التعجب بتاعته). `--t-small` `--c-text-muted`، والمبلغ `--c-text` 500. النص `role="status"` (`aria-live="polite"`).
- **الشريط:** مسار ارتفاعه `--s-1` و pill بلون `--c-surface-muted`، والمليان `--c-accent` من ناحية البداية، بعرض النسبة (`--fs-progress`) و transition `--d-base` `--ease-out`. بيستخبى لما الشحن يبقى مجاني. `aria-hidden` (النص هو المعلومة). المسافة بين النص والشريط `--s-2`.
- **بيستخبى** لو السلة فاضية أو الحد صفر أو الإعداد مقفول.

### 8.35 Cart Page (صفحة السلة) — *المرحلة 4.4*
بترتيب `reference/shopify-theme/templates/cart.json` (SPEC §7.2): السطور + الملخص والأزرار، بعدها الكاش باك (§8.25، D66)، بعدها «اختيارات تناسبك». الكود: `pages/cart.twig` و `04-components/unix-cart-page.scss` و `js/cart.js` (رائد، والـ hooks بتاعته متسابة). كومبوننتس سلة زي ما هي (`salla-cart-summary-card` و `salla-cart-coupons` و `salla-cart-item-offers` و `salla-gifting` و `salla-loyalty-panel` و `salla-tiered-offer` و `salla-offer` و `salla-conditional-offer`)، ومتستايلة من الـ classes العامة (`.s-cart-summary-card-*`). *(قرار مؤقت D91)*
- **الصفحة (6.4، D110 بيلغي الـ `h1` المخفي بتاع D91):** مافيش مسار تنقل. أول الصفحة صف `h1` ظاهر «سلة التسوق» (`--t-page-title`، ناحية البداية) وزرار «مواصلة التسوق» (`.unix-btn--panel`: `--c-panel` ونص `--c-text`، والـ fill وقت الـ hover `--c-panel-hover`، زي `button--secondary` في الأصل) ناحية النهاية، و `--s-5` فوق و `--s-4` تحت أقل من 576، و `--s-5` تحت من 576 (الأصل `.page-header` 2.4 / 2.4rem، و 1.6rem تحت بس أقل من 576). تحت 576 الزرار ده بيستخبى ونفس اللينك بعرض كامل تحت السلة (الأصل `.cart__footer-continue`). Grid: عمود واحد، ومن lg السطور + عمود الملخص `--cart-aside-w` (384px) sticky تحت الهيدر، والمسافة `--s-5` (`--s-6` من lg). الـ padding تحت `--section-sm`.
- **السطر:** كارت `--c-surface` ببوردر `--line-w` `--c-border` و `--r-md`، و padding `--s-4` (`--s-5` من md)، وبين السطور `--s-4`. Grid: الصورة (`--cart-thumb-w`، و `--cart-thumb-w-lg` من md، نسبة `--ratio-cart-thumb`، `--r-sm`)، والتفاصيل، والكمية + الإجمالي (تحت التفاصيل على الموبايل، وعمود لوحدهم من md)، وزرار الحذف (§8.33) في الركن ناحية النهاية.
  - **الاسم:** `h2` (عشان الـ outline) بحجم اسم الكارت `--t-body` 500 بخط النص (§8.3)، بدل `unix-size-h1` المؤقت من 3.11.
  - **السعر:** `--t-small` tabular؛ العادي `--c-text`، والمخصوم `--c-price-sale`، والقديم `--c-price-old` line-through. العروض والوزن `--t-small` (العرض `--c-accent-text`).
  - **منتج مجاني:** badge §8.4 (pill، `--c-surface`، `--t-micro`) ناحية البداية فوق الصورة، بدل شريط رائد الأحمر المايل. برا لينك الصورة المخفي (`aria-hidden`) عشان قارئ الشاشة يقراه. أول صورة `eager` و `fetchpriority="high"`.
  - **الكمية:** نفس pill الدرج (§8.33).
- **فاضية (6.4، زي `.is-empty .cart__warnings` في الأصل):** panel رمادي `--c-panel` بحواف `--r-md`، وعرضه أقصاه `--cart-empty-max`، و padding `--s-5` (`--panel-pad-lg` من 576، زي `component-cart.css` في الأصل: 4rem والزرار `width: auto` من 576)، والكلام **ناحية البداية**. جواه «سلتك فارغة» (`h2` بحجم `--t-h4`، الأصل `h3` 17.3 → 21.6px) وتحته بـ `--s-1` نص السلة الفاضية (إعداد `unix_cart_empty_text`، `--t-small` `--c-text-on-panel`) وتحته بـ `--s-4` زرار primary «تسوقي الآن» لكل المنتجات (بعرض كامل تحت 576). مابقاش بيستخدم `.unix-empty` (§8.47).
- **بعد الحذف** الفوكس بيروح لزرار حذف السطر اللي بعده (أو اللي قبله، وإلا `#main-content`). **إضافة منتج من الصفحة** (مثلًا من «اختيارات تناسبك») بتعمل reload دايمًا، لأن السطر الجديد أو الكمية الجديدة مش مرسومين (السطور من السيرفر).
- **عمود الملخص:** شريط الشحن المجاني (§8.34، أول رسمة من Twig بنفس حساب الـ JS، والكارت بيستخبى لو الشريط مخفي) والكوبونات والهدايا في `unix-cart__panel` (`--c-surface`، بوردر `--line-w`، `--r-md`، padding `--s-5`؛ بدل كروت رائد البيضا بظل). `salla-cart-summary-card`: من lg كارت بنفس الشكل؛ أقل من lg سلة بتثبّته تحت الشاشة كـ sheet، وده متساب بحواف فوق `--r-lg` و `--e-2`، والفوتر بياخد padding تحت `--s-10` عشان مايتغطاش. السطور `--t-small` (الـ label `--c-text-muted` والقيمة `--c-text` 500)، والخصم `--c-price-sale` (سلة كاتبة الأحمر بـ `!important`، فبنغلبه بـ `!important`)، والإجمالي `--t-body-lg`، وشارة التوفير `--c-surface-muted` و `--c-text`.
- **«اختيارات تناسبك»:** نفس markup و JS سكشن المنتجات 2.3 (§8.15، كروت §8.3، و `salla-products-slider` 2 / 3 / 4 في الصف) من غير تابات، على شريط `--c-bg-cream` (الأصل scheme «Cream»)، والأسهم أسهم عادية ← → من غير دواير ولا بوردر (زي «المفضلة دائما»؛ hover `--o-muted`)، والعنوان `h2` بحجم `--t-h3` (الأصل `heading_size: h3`) **ناحية البداية في كل المقاسات** (6.4)، وزرار `.unix-btn` primary (زي `button_style: secondary` في Cream، D70) في صف العنوان من 576px وبعرض كامل تحت أقل من كده. المنتجات من إعداد `unix_cart_picks_products`، والفاضي = أحدث المنتجات. *(قرار مؤقت D90)*

### 8.36 Thank-you Page (صفحة الشكر) — *المرحلة 4.5*
صفحة الشكر في unix.sa جزء من checkout شوبيفاي (مش في تصدير الثيم)، فمافيش نص أصلي. الكود: `pages/thank-you.twig` و `04-components/unix-thank-you.scss`. كومبوننتس سلة زي ما هي (`salla-thank-you-page` و `salla-thank-you-header` و `salla-order-shipments` / `salla-order-branch` و `salla-order-payment` و `salla-order-rewards` و `salla-next-order-coupon` و `salla-contacts`) والـ hooks بتاعتها، ومتستايلة من متغيرات سلة: `--color-text-primary` ← `--c-text`، و `--color-text-secondary` ← `--c-text-muted`، و `--color-surface` ← `--c-surface`، و `--color-border-light` ← `--c-border`. *(قرار مؤقت D92)*
- **الصفحة:** `unix-container` بـ padding `--section-sm` فوق وتحت.
- **`h1` واحد:** عنوان سلة `.s-thank-you-header-title` (الكومبوننت بيكتبه `h1`)، بخط العناوين و `--t-h2` و `--fw-bold` (تأكيد هادي، مش عنوان صفحة كبير). نصه `thank_you_title` بتاع التاجر، والفاضي «شكرًا لكِ»، فمايبقاش فاضي أبدًا. الثيم مابيضيفش `h1` تاني.
- **الهيدر:** دايرة النجاح `--s-8` بلون `--c-action` والعلامة `--c-on-action`، والسطر التاني `--t-body` `--c-text-muted` (65ch)، والفاصل `--c-border`، ورقم الطلب والتاريخ `--t-small` `--c-text-muted` tabular (زرار نسخ الرقم `--tap`، hover `--c-text`، focus الحلقة العامة).
- **الكروت** (المنتجات، والكوبون، والفرع): `--c-surface` وبوردر `--line-w` `--c-border` و `--r-md` ومن غير ظل.
- **«تابعي التسوق»:** `.unix-btn` primary في النص بعد آخر سكشن (`--s-6` فوقه) لصفحة كل المنتجات. على الموبايل زرار سلة الثابت تحت الشاشة بيفضل زي ما هو.

### 8.37 Account Shell (هيكل حساب العميلة) والملف الشخصي — *المرحلة 5.1*
مستوحى من `reference/shopify-theme/sections/main-account.liquid` و `assets/customer.css` (`.account__inner` و `.account-address` و `.account-none`). الكود: `layouts/customer.twig` (كل صفحات `pages/customer/**` بتورث منه)، و `pages/customer/profile.twig`، و `04-components/unix-account.scss`، و `js/account.js`. كومبوننتس سلة زي ما هي (`salla-breadcrumb`، و `salla-user-menu inline`، و `salla-file-upload profile-image`، و `salla-tel-input`، و `salla-datetime-picker`، و `salla-verify`، و `salla-user-settings`) ومتستايلة من الـ classes العامة. صفحات الحساب مش مفهرسة ومسؤولية سلة (§14، D74). صفحات الإشعارات والمحفظة بتورث الهيكل، ومحتواها في §8.48 (5.8). *(قرار مؤقت D93، D94)*
- **الصفحة:** `unix-container` على `--c-bg` (من غير شريط رائد الملوّن فوق)، و padding تحت `--section-sm`. مسار التنقل فوق بـ padding `--s-5`؛ سلة بتحط عليه `s-breadcrumb-primary-reverse` في صفحات الحساب، فبنرجّع ألوانه: اللينكات `--c-text-muted` (hover `--c-text`) والصفحة الحالية `--c-text`، و opacity 1.
- **Grid:** عمود واحد، ومن lg القايمة الجانبية `--account-nav-w` (288px، عرض رائد `w-72`) + المحتوى، والمسافة `--s-7`. القايمة sticky تحت الهيدر (`--header-h` + `--s-5`). أقل من lg القايمة الجانبية مش ظاهرة (زي رائد)، والتنقل من أيقونة الحساب في الهيدر (§8.7).
- **القايمة (`salla-user-menu inline`):** panel (`--c-surface`، بوردر `--line-w` `--c-border`، `--r-md`، padding `--s-2`). كل لينك ارتفاعه `--tap`، و padding-inline `--s-4`، والمسافة `--s-3`، و `--t-small` `--c-text`، والأيقونة `--s-4` بلون `--c-text-muted`، و `--r-sm`. hover `--c-hover-tint`، والصفحة الحالية (`aria-current="page"` من `account.js`) خلفية `--c-surface-muted` و `--fw-medium`. الـ badge (عدد الإشعارات) pill `--c-action` / `--c-on-action` `--t-micro` في نهاية السطر (مش absolute). «تسجيل الخروج» آخر عنصر بفاصل `--c-border` فوقه، وبلون `--c-text-muted` مش الأحمر بتاع سلة (`!important` لأن سلة كاتباه كده).
- **الصورة الشخصية (الملف الشخصي بس):** دايرة `--s-9` بخلفية `--c-surface-muted` ونص `--t-micro` `--c-text`، فوق القايمة (وفوق العنوان على الموبايل).
- **رأس الصفحة:** `h1` واحد = `page.title` بتاع سلة، بخط العناوين وحجم `--t-h2` من `.unix-size-h2` (§2.2، زي `title--page h2` في الأصل). في الملف الشخصي فوقه سطر ترحيب `p` «أهلًا {الاسم}» (`--t-small` `--c-text-muted`، نص الأصل `customer.account.greeting`). الصفحات اللي ليها أزرار (الطلب) بتحطها في نفس الصف ناحية النهاية (flex-wrap، المسافة `--s-4`). المسافة تحت الرأس `--s-5`.
- **Panel الحساب (`.unix-account-panel`):** `--c-surface` وبوردر `--line-w` `--c-border` و `--r-md` و padding `--s-5` (`--s-6` من md)، ومن غير ظل. ده بديل كروت رائد البيضا اللي بظل، وبديل `--color-background-secondary` في الأصل (النص الثانوي على sand-200 تباينه 4.0، §1.3). بين الـ panels `--s-5`.
- **الملف الشخصي:** الفورم جوه panel، Grid عمود واحد ومن 576 عمودين، والمسافة `--s-5`. الـ labels `.form-label` والحقول §8.5 (`.form-input` و `.s-form-control` جوه `salla-tel-input` و `salla-datetime-picker`). زرار الحفظ `salla-button` primary (§8.2) بعرض كامل على الموبايل ومن 576 عرضه طبيعي ناحية البداية، و `--s-5` فوقه. `salla-user-settings` (الإشعارات وحذف الحساب) panel لوحده تحته؛ عناوينه `--t-body` `--fw-medium` والوصف `--t-small` `--c-text-muted`.

**Tokens (5.1):**
| Token | القيمة | الاستخدام |
|---|---|---|
| `--account-nav-w` | 288px | عمود قايمة الحساب من lg (عرض رائد `w-72`) |

### 8.38 Orders List (قايمة الطلبات) — *المرحلة 5.2*
مستوحى من `.order-table--main` في `reference/shopify-theme/assets/customer.css` (`sections/main-account.liquid`). الكود: `pages/customer/orders/index.twig` و `04-components/unix-account.scss`. الجدول `salla-orders` بتاع سلة زي ما هو (الفلاتر، والتحميل، و«تحميل المزيد»، وزرار التقييم، ونسخ رقم الطلب) جوه `.unix-account-panel`، ومتستايل من `.s-orders-*`. *(قرار مؤقت D95)*
- **الفلاتر:** أزرار سلة `salla-button` small (§8.2، 44px على اللمس) بمسافة `--s-2`، و `--s-4` تحتها.
- **رأس الجدول (من md):** صف `--c-surface-muted` بحواف `--r-sm` من الناحيتين، والخلايا `--t-small` `--fw-medium` `--c-text` من غير uppercase، و padding `--s-3` `--s-4`. آخر عمود ناحية النهاية.
- **الصفوف:** من غير كروت ولا ظل ولا `border-spacing`: فاصل `--line-w` `--c-border` تحت كل صف (ما عدا الأخير)، والنص `--t-small` `--c-text` tabular، ورقم الطلب `--fw-medium`. مع الـ hover الصف كله بيبقى `--c-text-muted` في `--d-fast` (زي `.tbody:hover` في الأصل). الصف كله لينك (اللينكات الفاضية بتاعة سلة فوق الخلايا). `account.js` بيسيب أول لينك في كل صف بس في ترتيب التاب وبيديله `aria-label` «الطلب رقم {الرقم}» (من `.s-orders-reference-id`)، والباقي `tabindex="-1"` و `aria-hidden`، ومع كل رسمة جديدة من سلة (observer). الفوكس حلقة `--ring-w` `--c-accent` جوه الخلية.
- **الموبايل (أقل من md):** كل صف بلوك، وكل خلية سطر: العنوان (`.s-orders-mobile-title`) `--c-text-muted` بعرض `--s-10` والقيمة جنبه، و padding `--s-3` فوق وتحت الصف.
- **الحالة:** أيقونة سلة + الاسم بلون `--c-text` (لون الحالة اللي التاجر مختاره بيتشال بـ `!important` لأنه inline، والمعنى في النص).
- **التنبيه الأخضر (الكاش باك):** خلفية `--c-note-bg` (§8.25) و `--r-sm` والنص `--t-small` `--c-text`، والأيقونة `--c-success`.
- **«تحميل المزيد»:** زرار سلة primary (§8.2) في النص و `--s-5` فوقه. التحميل: الجدول `--o-disabled`.
- **فاضية (مافيش طلبات خالص):** panel فيه `h2` بحجم `--t-h4` («لم تطلبي أي شيء بعد»)، والنص `--t-body` `--c-text-muted`، وزرار `.unix-btn` primary «تسوقي الآن» لكل المنتجات (`--s-5` فوقه، بعرض كامل تحت 576). النصين إعدادات (`unix_account_orders_empty_*`)، والفاضي = نص unix.sa (`main-account` → `heading_orders` / `text_orders`) بخطاب المؤنث. الفاضي جوه فلتر (من سلة): الأيقونة في دايرة `--s-9` `--c-surface-muted` والنص `--c-text-muted`.

### 8.39 Order Page (صفحة الطلب) — *المرحلة 5.2*
مستوحى من `reference/shopify-theme/sections/main-order.liquid` و `.order-table--details` / `.order-table--total` في `assets/customer.css`. الكود: `pages/customer/orders/single.twig` (منطق رائد والـ hooks و `js/order.js` زي ما هم) و `04-components/unix-account.scss`. كومبوننتس سلة زي ما هي: `salla-edit-order-button`، و `salla-order-branch`، و `salla-order-details`، و `salla-review-order-item`، و `salla-order-totals-card`، و `salla-modal` (إعادة الطلب والإلغاء)، و `salla-rating-modal`، و `salla-rating-stars`. *(قرار مؤقت D96)*
- **الرأس:** `h1` واحد = `page.title` (§8.37، `.unix-size-h2`)، ولو الطلب هدية: badge §8.4 «هدية» جنبه. زرار تعديل الطلب بتاع سلة ناحية النهاية.
- **ملخص الطلب:** panel فيه `dl` (عمود واحد، ومن 576 عمودين): «تاريخ الطلب» و«الحالة» (الـ `dt` `--t-small` `--c-text-muted`، والـ `dd` `--t-body` `--fw-medium` `--c-text` tabular). الحالة أيقونة + اسم بلون `--c-text` (لون التاجر مش مستخدم، زي §8.38)، والدفع المنتهي `--c-price-sale`. تحتها صف أزرار (`--s-3`، flex-wrap): لينكات الطلب (الشحنة، والملفات الرقمية) و«طباعة» `.unix-btn--outline .unix-btn--sm` (اللي بتفتح في تاب جديد عليها سهم `icon-dir`). لو الفاتورة مش متاحة: ملاحظة `--t-small` `--c-text-muted` بدل tooltip رائد، وفيها زرار لينك (§8.2) لطباعة التفاصيل.
- **الملاحظات** (الاسترداد، ومدة تعديل التقييم، والطلب تحت المراجعة): سطر بأيقونة على `--c-note-bg` و `--r-sm` و padding `--s-3` `--s-4`، والنص `--t-small` `--c-text`.
- **تقييم الطلب (`can_rate`):** panel (بدل شريط رائد الملوّن) فيه `h2` بحجم `--t-h4` والنص `--t-small` `--c-text-muted`، وزرار primary «قيّمي» ناحية النهاية (تحت بعرض كامل أقل من 576).
- **الشحنات:** panel لكل شحنة. الرأس (لو فيه شركة شحن): اللوجو (ارتفاعه `--s-6`، `object-fit: contain`) والاسم، وتحتهم الفرع ورقم الشحنة والحالة أو «تتبع الشحنة» (لينك `.unix-btn--link`)، `--t-small`، وفاصل `--c-border` تحت و `--s-4` مسافة.
- **المنتج:** Grid: الصورة (`--cart-thumb-w`، نسبة `--ratio-cart-thumb`، `--r-sm`، `--c-surface-muted` لحد ما تحمّل؛ لينك الصورة `aria-hidden` و `tabindex="-1"` زي §8.33) + التفاصيل. الاسم `h2` بحجم `--t-body` `--fw-medium` (لينك، hover `--o-muted`) زي صفحة السلة (§8.35). تحته `dl` صفوف «الكمية» و«السعر» و«الإجمالي» (`--t-small`، الـ label `--c-text-muted` والقيمة `--c-text` tabular، والإجمالي `--fw-medium`). بين المنتجات فاصل `--c-border` و `--s-5`. التاريخ المتوقع، والحجوزات، و `salla-order-details`، والملاحظة (`--t-small` `--c-text-muted`)، والمرفقات (`dl` ببوردر `--c-border` و `--r-sm`)، و `salla-review-order-item` تحت التفاصيل بمسافة `--s-3`.
- **خيارات الطلب:** panel فيه `h2` `--t-h4` وجدول `--t-small`: الرأس `--c-surface-muted`، والصفوف بفاصل `--c-border`، والسعر ناحية النهاية tabular.
- **الإجماليات (`salla-order-totals-card`):** panel (`.s-order-totals-card-panel`)، وعنوان سلة `h2` بيفضل مخفي (`sr-only` من سلة). الصفوف `--t-small` (الـ label `--c-text-muted` والقيمة `--c-text` tabular) بمسافة `--s-2`، والخصم `--c-price-sale`، والإجمالي النهائي `--t-body-lg` `--fw-medium` بفاصل `--c-border` فوقه، والاسترداد `--c-accent-text`.
- **إعادة الطلب / الإلغاء / إكمال الدفع:** panel، كل صف: `h2` `--t-h4` + وصف `--t-small` `--c-text-muted` ناحية البداية، والزرار ناحية النهاية (تحت بعرض كامل أقل من 576)، وفاصل `--c-border` بين الصفين. إكمال الدفع زرار primary عريض. الإلغاء زرار لينك (من غير أحمر في الصفحة؛ التأكيد الأحمر في مودال سلة).
- **تقييم المتجر والشحن:** panel لكل واحد: `h2` `--t-h4`، والتعليق، و `salla-rating-stars`، وأزرار التعديل والحذف أيقونات `--tap` (بدل 32px بتاعة رائد) بحواف pill (`!important` لأن رائد كاتبها كده في `user-pages.scss`). لو مدة التعديل خلصت: الزرارين disabled وتحتهم ملاحظتين مكتوبتين (انتهاء مدة التعديل والحذف) `--t-small` `--c-text-muted`.

### 8.40 Wishlist (المفضلة) — *المرحلة 5.3*
بديل Swym Wishlist Plus في unix.sa (SPEC §9) هو مفضلة سلة المدمجة (D3): القلب على الكارت وفي صفحة المنتج (§8.20، §8.21) بينادي `salla.wishlist.toggle`، والصفحة `pages/customer/wishlist.twig` فيها `salla-products-list source="wishlist"` بتاعة سلة (و `salla-wishlist-actions` للمشاركة، سلة بتحطه من الـ hook) وكل سطر هو `custom-wishlist-card` بتاع الثيم (`js/partials/wishlist-card.js`). الستايل في `04-components/unix-account.scss`. *(قرار مؤقت D98)*
- **القايمة:** عمود واحد، المسافة `--s-4` (زي سطور صفحة السلة §8.35).
- **السطر:** كارت `--c-surface` ببوردر `--line-w` `--c-border` و `--r-md`، و padding `--s-4` (`--s-5` من md)، ومن غير ظل. Grid: الصورة (`--cart-thumb-w`، نسبة `--ratio-cart-thumb`، `--r-sm`، خلفية `--c-surface-muted`؛ لينك الصورة `aria-hidden` و `tabindex="-1"`) + التفاصيل، وتحتهم الأزرار؛ من md الأزرار عمود تالت ناحية النهاية في نص السطر.
  - **الاسم:** `h2` بحجم `--t-body` `--fw-medium` بخط النص (سطرين بالكتير)، لينك `--c-text` و hover `--o-muted`.
  - **السعر:** `--t-small` tabular؛ وقت التخفيض الجديد `--c-price-sale` والقديم `--c-price-old` line-through (وقارئ الشاشة بيقول «سعر التخفيض» / «السعر الأصلي»).
  - **الإضافة للسلة:** `salla-add-product-button` بتاع سلة `fill="outline"` (§8.2) بعرض كامل على الموبايل، و `--btn-w-wish` من md. بعد الإضافة درج السلة (§8.33) بيتفتح زي أي إضافة.
  - **الحذف:** زرار أيقونة سلة stroke 1.5 `--icon-sm` جوه `--tap` بلون `--c-text-muted` (hover `--c-text`، و `--c-hover-tint`) زي §8.33، بـ `aria-label` «احذفي {الاسم} من المفضلة»، وبينادي `salla.wishlist.remove`. وهو شغّال: `aria-disabled` و `aria-busy` و `--o-disabled` (الزرار بيفضل قابل للفوكس، والضغطة التانية مابتعملش حاجة)، ولو فشل بيرجع شغّال والفوكس عليه. بعد الحذف الفوكس بيروح لزرار حذف أقرب سطر لسه موجود (مش بيختفي، `:not(.fade-out-collapse)`) بعده أو قبله، وإلا عنوان الصفحة، والسطر بيختفي بحركة رائد (`fade-out-collapse`). لما آخر سطر يتشال الصفحة بتعمل reload عشان تظهر الحالة الفاضية.
- **فاضية:** حالة سلة (`.s-products-list-placeholder`) بألوان النظام: الأيقونة في دايرة `--s-9` `--c-surface-muted` و `--c-text-muted`، والنص `--t-body` `--c-text-muted`.
- **مشاركة المفضلة (`salla-wishlist-actions`):** شريط سلة فوق القايمة، أزراره §8.2، و `--s-4` تحته.

**Tokens (5.3):**
| Token | القيمة | الاستخدام |
|---|---|---|
| `--btn-w-wish` | 160px | عرض زرار «أضيفي للسلة» في سطر المفضلة من md (رائد `md:w-40`) |

### 8.41 Blog Index (صفحة المدونة) — *المرحلة 5.4*
مرجع الترتيب `reference/shopify-theme/templates/blog.json` و `sections/main-blog.liquid` (unix.sa: مدونتين `news` و `leggings-blog`). الكود: `pages/blog/index.twig` و `components/blog/unix-article-card.twig` و `04-components/unix-blog-pages.scss`. *(قرار مؤقت D100)*
- **توكنز جديدة (المرحلة 5، `unix-tokens.scss`):** `--ratio-article` = 16 / 9 (صورة المقال الكبيرة والكروت المميزة)، و `--ratio-article-card` = 3 / 2 (كارت الأرشيف والمقالات ذات الصلة، زي `image_ratio: landscape` في الأصل)، و `--prose-max` = 720px (عمود القراية في المقال والصفحات الثابتة، حوالي 65–75 حرف في `--t-body-lg`).
- **الصفحة:** `unix-container`، ومسار التنقل بتاع سلة، وبعده `h1` = عنوان الصفحة (ظاهر دايمًا، بحجم `--t-h2` زي `title--page h2` في الأصل)، والـ padding تحت `--section-sm`.
- **التصنيفات:** صف chips أفقي (`<nav>` + لينكات حقيقية) بدل قايمة رائد الجانبية والـ dropdown: «كل المقالات» + كل تصنيف. الـ chip: ارتفاع `--tap`، و padding-inline `--s-4`، و `--r-sm`، وبوردر `--line-w` `--c-border`، و `--t-small` 500؛ الحالي `aria-current="page"` بوردر `--c-text` وحلقة داخلية `--line-w`؛ hover بوردر `--c-text-muted`؛ active `--c-press-tint`. على الموبايل الصف بيسكرول أفقي (scroll-snap، من غير scrollbar).
- **المميزة (`slides` بتاعة سلة):** لحد 2 كارت كبير (`--ratio-article`) فوق الأرشيف، عمود واحد ثم 2 من md. بدل سلايدر رائد.
- **الأرشيف:** `salla-infinite-scroll` (من غير autoload: زرار «تحميل المزيد» بتاع سلة، وهو `<a href>` لصفحة الصفحة اللي بعدها) في جريد 1 / 2 / 3 أعمدة (أقل من 768 / من 768 / من 1024)، والمسافة `--gutter` أفقي و `--s-7` رأسي.
- **الكارت (`unix-article-card`):** الصورة اختيارية (`--ratio-article-card`، أو `--ratio-article` للمميز) بحواف `--r-md` وخلفية `--c-surface-muted`، و `alt=""` (العنوان هو نص اللينك)، و lazy ما عدا أول كارت في الصفحة (eager و `fetchpriority="high"`، صورة الـ LCP). من غير صورة: خط `--line-w` `--c-border` فوق الكارت زي §8.17. بعدها التاريخ (`<time>`، `--t-small` `--c-text-muted`)، والعنوان (`h2` في الصفحة، `h3` في «قد يعجبكِ أيضًا»؛ `--t-h4`، و `--t-h3` للمميز؛ 3 سطور بالكتير)، والمقتطف (`--t-small` `--c-text-muted`، 150 حرف و 3 سطور). الكارت كله لينك واحد (stretched link) بحلقة الفوكس حواليه. hover: العنوان `--o-muted` والصورة `scale(var(--zoom-hover))` في `--d-reveal`؛ مع reduced-motion مافيش scale. مافيش وسوم على الكارت (لينك جوه لينك).
- **فاضية:** نص «لا توجد مقالات بعد» (`--c-text-muted`) وزرار primary «تسوقي الجديد» لكل المنتجات.

### 8.42 Article (صفحة المقال) — *المرحلة 5.4*
مرجع `reference/shopify-theme/templates/article.json` (`article-header` في النص، `heading_tag: h1`، الوسوم والتاريخ والكاتب) و `sections/main-article.liquid`. الكود: `pages/blog/single.twig` و `components/seo/unix-jsonld-article.twig` و `04-components/unix-blog-pages.scss` و `04-components/unix-rte.scss`. *(قرار مؤقت D101)*
- **مسار التنقل** قبل `<article>` (مش جوه المقال).
- **الهيدر (في النص، عرض `--prose-max`):** الوسوم (لينكات `--t-small` 500 `--c-accent-text`، ارتفاع لمس `--tap`)، والتاريخ (`<time>`، `--t-small` `--c-text-muted`)، والعنوان **`h1` الوحيد** (`--t-h2` زي الأصل، `text-wrap: balance`)، و«بقلم **الاسم**» (لينك للكاتب لو سلة بتدّيه). المسافة بين العناصر `--s-3`.
- **الصورة الكبيرة:** `--ratio-article` و `--r-md`، بعرض المحتوى (`--content-max`)، و eager و `fetchpriority="high"` (صورة الـ LCP) مع width/height. الـ `alt` نص الصورة من سلة، وإلا فاضي.
- **المحتوى:** `.unix-rte` (§8.43) بعرض `--prose-max` و `--t-body-lg`. أي `h1` جوه المحتوى بيتحوّل `h2` من السيرفر (`h1` واحد، §14.2)، وكل صورة جوه المحتوى `loading="lazy"`.
- **الإعجاب والتعليقات** (لو مفعّلين في إعدادات مدونة سلة): زرار الإعجاب pill ارتفاعه `--tap` ببوردر `--c-border` (`aria-pressed` بيتحدّث من `blog.js`). الاسم المقروء = العدد + نص sr-only «أعجبني المقال»، من غير aria-label (العدد أول `span` لأن `blog.js` بيقراه)، و `salla-comments` بتاعة سلة زي ما هي (مستايلة من §8.26).
- **الوسوم في الآخر:** نفس لينكات الهيدر بعد خط `--line-w` `--c-border`.
- **«قد يعجبكِ أيضًا»** (نص unix.sa): سكشن تحت المقال (مش عمود جانبي)، `h2` بحجم `--t-h3`، ولحد 4 كروت §8.41 (`h3`، من غير مقتطف زي `show_excerpt: false` في الأصل) في جريد 1 / 2 / 4 (أقل من 576 / من 576 / من 1024)، وزرار primary صغير «عرض الكل» للمدونة في صف العنوان (§8.2، D106). بيستخبى لو مافيش مقالات ذات صلة.
- **البيانات المنظمة:** `BlogPosting` من السيرفر (§14).

### 8.43 Rich Text (`.unix-rte`) والصفحات الثابتة — *المرحلة 5.4 / 5.5*
محتوى محرر سلة (HTML حر من التاجر) في المقال والصفحات الثابتة. الكود: `04-components/unix-rte.scss`. كل الأحجام من §2.2، وكل حاجة logical properties.
- **العمود:** `max-inline-size: var(--prose-max)` في النص، و `--t-body-lg` بـ line-height 1.75 و `--c-text`، و `overflow-wrap: anywhere` (روابط طويلة). الفقرات `max-width: none` جوه العمود (العمود هو اللي بيحدد الطول).
- **الإيقاع:** المسافة بين البلوكات `--s-5`، وقبل العناوين `--s-7` وبعدها `--s-3`. أول عنصر من غير margin فوق وآخر عنصر من غير margin تحت.
- **العناوين جوه المحتوى:** `h2` `--t-h3`، و `h3` `--t-h4`، و `h4`–`h6` `--t-body-lg` `--fw-bold` (أصغر من عنوان الصفحة، عشان الهرمية تبان).
- **اللينكات:** `--c-accent-text` (5.7:1) بخط تحت `--line-w` و `text-underline-offset` `--s-1`؛ hover `--c-text`؛ focus الحلقة العامة.
- **القوايم:** `disc` / `decimal` (ترجع بعد preflight بتاع Tailwind)، و `padding-inline-start` `--s-5`، وبين العناصر `--s-2`، والعلامة `--c-text-muted`.
- **الاقتباس:** خط `--line-w-strong` `--c-accent` ناحية البداية، و padding-inline-start `--s-5`، و `--c-text-muted`.
- **الصور والفيديو:** `max-inline-size: 100%` و `block-size: auto` و `--r-md`؛ `iframe` و `video` بنسبة `--ratio-article`. الصور lazy (من Twig).
- **المعالجة النصية** (`h1` ← `h2`، و `loading="lazy"`، ولفّ الجداول، بالحروف الصغيرة والكبيرة): بتفترض HTML محرر سلة (tags بحروف صغيرة، ومن غير loading)؛ أي HTML ملصوق من برا ممكن يطلع فيه attribute مكرر، و `</table>` من غير `<table>` بيطلع `</div>` زيادة (D101، D102).
- **الجداول (المقاسات والسياسات):** عرض كامل جوه صندوق `.unix-rte__table` (Twig بيلفّ كل جدول؛ `role="region"` و `tabindex="0"` و `aria-label` «جدول، اسحبي للعرض» عشان الكيبورد وقارئ الشاشة) بيسكرول أفقي لو الجدول أعرض من الشاشة (مش الصفحة كلها)، و `--t-small` tabular، والخلايا padding `--s-2` `--s-3` وبوردر `--line-w` `--c-border`، وصف العناوين `--c-surface-muted` `--fw-bold`. `text-align: start`.
- **الخط الفاصل (`hr`):** `--line-w` `--c-border`، ومسافة `--s-7`.
- **`strong`** `--fw-bold`؛ **`em`** مايل في الإنجليزي بس (العربي من غير italic، §2.2).
- **الصفحة الثابتة (`page-single`، 5.5):** زي `main-page.liquid` في unix.sa: `unix-container`، ومسار التنقل، وبعده `h1` الوحيد = عنوان الصفحة بحجم `--t-h2` (زي `title--page h2`) فوق عمود `--prose-max` (`--s-4` فوقه و `--s-7` تحته)، وبعده المحتوى `.unix-rte`. الـ padding تحت `--section-md` (الأصل `padding_bottom: m`). نفس معالجة المقال من السيرفر (`h1` ← `h2`، والصور lazy، والجداول). تعليقات سلة على الصفحة بس لو `unix_page_comments` مفعّل (مقفول افتراضيًا: unix.sa مافيهوش تعليقات على الصفحات)، تحت خط `--c-border` و `--s-8` مسافة. الصفحات المعمولة بمحرر صفحات سلة (`customised`) بتفضل بالـ hook بتاعها زي ما هي. *(قرار مؤقت D102)*

### 8.44 404 (صفحة غير موجودة) — *المرحلة 5.6*
**مافيش قالب 404 في Twilight:** قايمة صفحات الثيم (`src/views/pages/`: `index` و `product/*` و `cart` و `thank-you` و `loyalty` و `customer/*` و `blog/*` و `brands/*` و `page-single` و `testimonials`) وأنواع `@salla.sa/twilight` مافيهاش صفحة خطأ، فصفحة 404 وكود الحالة 404 **مسؤولية سلة** بالكامل (زي `sitemap.xml` في §14.1). الثيم مابيضيفش ملف مش معروف (ممكن يترفض في رفع الثيم أو يتجاهل). *(قرار مؤقت D103)*
- **لو سلة طلّعت قالب بعدين** (أو لو المعاينة بيّنت إن صفحة سلة بتترسم جوه `layouts/master.twig`): نفس `main-404.liquid` في unix.sa: `h1` واحد «الصفحة غير موجودة» بحجم `--t-h2`، وسطر شرح `--t-body-lg` `--c-text-muted`، وزرار primary يفتح بحث سلة (`salla.search.open()`، §1.5) + لينكات «كل المنتجات» و«الرئيسية»، وبعدها «الأكثر مبيعًا» (4 منتجات، `404.json` في الأصل) بكروت §8.3. النصوص تحت `blocks.unix.not_found.*`.
- **دلوقتي:** الهيدر والفوتر والبحث بتوعنا بيظهروا في صفحة سلة بس لو بتستخدم الـ layout؛ ده يتأكد في المعاينة.

### 8.45 Brands و Loyalty و Testimonials (صفحات رائد) — *المرحلة 5.7*
unix.sa مافيهوش صفحة ماركات ولا برنامج ولاء ولا صفحة آراء (التقييمات في صفحة المنتج §8.26، والكاش باك رصيد محفظة §8.25). الصفحات دي بتفضل موجودة في سلة، فبتاخد **ستايل خفيف بس** من غير إعادة تصميم. الكود: `04-components/unix-legacy-pages.scss` (بعد `brands.scss` و `loyalty.scss`)، ومحصور بـ `.unix-brands` و `.unix-loyalty` و `.unix-testimonials`. *(قرار مؤقت D104)*
- **الكروت** (الماركة، وحرف الماركات، وطرق كسب النقاط، والجوايز، وبانر الولاء): `--c-surface` وبوردر `--line-w` `--c-border` و `--r-md` (الحروف `--r-sm`) ومن غير ظل، بدل الأبيض بظل `shadow-default`. hover بوردر `--c-text-muted`، والفوكس الحلقة العامة، وحروف الماركات `--tap` بالقليل.
- **العناوين:** `h1` الوحيد = اسم الماركة / اسم برنامج الولاء / عنوان صفحة الآراء، بحجم `--t-h2`. وصف الماركة بقى نص (`--c-text-muted`، 65ch) بدل `h2`.
- **لوجو الماركة:** `alt=""` (زينة جنب الاسم الـ `h1`)، و eager لما مافيش بانر (هو صورة الـ LCP)، وإلا lazy. أيقونة الحالة الفاضية `aria-hidden`.
- **الولاء:** حركة النجمة وعدّ النقاط (`loyalty.js`) بتتشال مع reduced-motion والعدد بيظهر على طول. النجمة الكبيرة `--c-accent` بدل الكهرماني، والنجوم الزينة في الخلفية `--c-surface-muted` و `aria-hidden`، والنص الثانوي `--c-text-muted`، وعدد النقاط `--c-text`. ألوان طرق الكسب (`point.color`) من سلة على **الأيقونة والبوردر بس**؛ عدد النقاط (`h3`) بلون `--c-text` لأن تباين لون التاجر مش مضمون *(6.1)*.
- **الآراء:** `unix-container`، والعنوان والترتيب في صف واحد (بيلف على الموبايل)، و `salla-comments` بستايل §8.26 العام، من غير الكارت الأبيض.

### 8.46 Skip link («انتقلي إلى المحتوى») — *المرحلة 6.3*
أول عنصر في الصفحة: لينك «انتقلي إلى المحتوى» لـ `#main-content`، مخفي (sr-only) لحد الفوكس، وبعدها pill `--c-surface` بحلقة `--ring-w` `--c-accent` فوق ناحية البداية، `--z-drawer`. (WCAG 2.4.1)
- **الكود:** أول ابن لـ `.app-inner` في `layouts/master.twig` (قبل `{% hook 'body:start' %}` والهيدر)، `.unix-skip-link` في `04-components/unix-header.scss`. النص `blocks.unix.header.skip` («انتقلي إلى المحتوى» / "Skip to content").
- **الشكل وهو ظاهر:** `position: fixed` على بعد `--s-2` من فوق ومن ناحية البداية، ارتفاع `--tap`، padding-inline `--s-5`، `--r-pill`، خلفية `--c-surface` ونص `--c-text` `--t-small` `--fw-medium`، و `--e-2`. وهو مخفي `clip-path: inset(50%)` (مش `display: none`، عشان يفضل في ترتيب التاب).
- **الهدف:** `<main id="main-content" tabindex="-1">` عشان الفوكس ينتقل له فعلًا (Safari)، ومن غير حلقة على `main` نفسه (`#main-content:focus {outline: none}`).
- `.app-inner` بيبقى `inert` وهو فيه درج مفتوح (§8.9)، فاللينك مابيتوصلش وقتها، وده المطلوب.

### 8.47 Empty state (الحالة الفاضية) — *المرحلة 6.1*
أيقونة `--s-9` دايرة `--c-surface-muted` و`--c-text-muted` (اختيارية) ← عنوان `h2` بحجم `--t-h4` `--fw-medium` ← نص `--t-body` `--c-text-muted` (65ch) ← زرار primary فعل+مفعول. في النص، والمسافة `--s-4`. الدرج نفس الترتيب.
- **الكود:** `.unix-empty` (و `__icon` و `__title` و `__text`) في `04-components/unix-controls.scss`، والزرار `.unix-btn`. padding فوق وتحت `--section-sm` (الدرج `--s-6` `--s-5`). العنوان بخط النص (`--f-body`) عشان الوزن 500 يبان (Somar وزن Bold بس).
- **مستخدمة في:** درج السلة (§8.33؛ العنوان `h3` لأن «السلة (n)» هو الـ `h2`)، ~~وصفحة السلة~~ (من 6.4 الصفحة ليها panel رمادي زي unix.sa، §8.35)، والطلبات من غير طلبات (§8.38، جوه panel)، والمدونة من غير مقالات (§8.41)، والماركات (§8.45، بأيقونة الماركة).
- حالات سلة الفاضية جوه كومبوننتاتها (`salla-placeholder` في الإشعارات، و `.s-products-list-placeholder` في المفضلة والتصنيف، و `.s-orders-no-content` جوه فلتر) بتاخد نفس الشكل من الـ classes بتاعتها.
- بيحل محل: `.unix-cart__empty*` و `.unix-cd__empty-*` و `.unix-account-empty*` و `.unix-blog-index__empty`، ودايرة Tailwind الرمادي (`bg-gray-100` و `text-gray-400`) في صفحات الماركات.

### 8.48 Notifications و Wallet (الإشعارات والمحفظة) — *المرحلة 5.8*
صفحتين جوه هيكل الحساب (§8.37). كومبوننتات سلة زي ما هي (`salla-notifications`، و `salla-wallet` ومعاه `salla-gift-card-redeem`)، ومتستايلة من الـ classes العامة بس (`.s-notifications-*` و `.s-wallet-*` و `.s-placeholder-*`) تحت `.unix-notifications` و `.unix-wallet` (CSS سلة global وممكن يتحمّل بعد `app.css`، فالـ prefix بيكسب بالـ specificity). الكود: `pages/customer/notifications.twig` و `pages/customer/wallet.twig` و `04-components/unix-account.scss`. *(قرار مؤقت D107)*
- **الإشعارات:** القايمة جوه `.unix-account-panel`، وقبلها `h2` مخفي (`sr-only`) «الإشعارات» (`blocks.unix.account.notifications`) عشان عناوين سلة `h4` ماتقفزش من الـ `h1` *(6.3)*. كل إشعار (لينك سلة) صف بفاصل `--line-w` `--c-border` (زي قايمة الطلبات §8.38) بدل الكروت البيضا بظل: padding `--s-4` فوق وتحت، والمسافة `--s-4`. الجرس في دايرة `--tap` `--c-surface-muted` بلون `--c-text`، والجديد الجرس `--c-accent` (شكل، 3.4 على sand-200) والعنوان `--fw-bold`؛ المقروء العنوان `--fw-medium` (بدل رمادي سلة). العنوان (`h4` من سلة) بحجم `--t-body` بخط النص، والنص الفرعي `--t-small` `--c-text-muted`، والتاريخ `--t-small` `--c-text-muted` tabular (جنب النص من md، وتحته على الموبايل). hover النص `--c-text-muted`، و active `--o-muted`، و focus-visible حلقة `--ring-w` `--c-accent`. «تحميل المزيد» زرار سلة primary في النص (`--s-5` فوقه). الفاضية: `salla-placeholder` بشكل §8.47.
- **المحفظة:** كارت الرصيد panel (`--c-surface`، بوردر `--line-w` `--c-border`، `--r-md`، padding `--s-5`): العلامة دايرة `--s-7` `--c-surface-muted`، والرقم `--t-h4` `--fw-bold` tabular، والـ label `--t-small` `--c-text-muted`. جدول الحركات panel واحد (`--c-surface`، بوردر، `--r-md`): رأس `--c-surface-muted` و `--t-small` `--fw-medium` من غير uppercase، وصفوف بفاصل `--c-border` بدل الكروت، والخلايا `--t-small` tabular، والعناوين على الموبايل `--c-text-muted` بعرض `--s-10` (زي §8.38). المبلغ بإشارته: الإضافة `--c-success` والخصم `--c-price-sale` (الإشارة بتشرح المعنى من غير اللون). نوع الحركة pill واحد هادي (`--c-surface-muted` / `--c-text`) بدل ألوان سلة الأربعة. الفاضية بشكل §8.47.
- **مش في إيدنا:** `salla-gift-card-redeem` (قسيمة الهدية جنب كارت الرصيد) بشكل سلة، وعنوان الإشعار `h4` (مستوى سلة، مابنعملش fork). لازم يتشافوا في المعاينة.

---

## 9. نبرة الكلام (Copy)

- **خطاب أنثوي** في العربي: «تسوقي»، «اختاري»، «سلتك».
- **قصير وواثق.** مافيش علامات تعجب، ولا كلام زي «أفضل منتج في العالم».
  - استثناء: النص المنقول بالحرف من unix.sa بيحتفظ بعلامات الترقيم بتاعته (D88).
- **الـ CTAs:** فعل + مفعول: «تسوقي الجديد»، «أضيفي للسلة»، «اكتشفي المجموعة».
- **الأخطاء:** بتشرح الحل: «المقاس ده خلص. نبلغك لما يرجع؟».
- **لوحة التاجر:** نصوص إعدادات لوحة التاجر (labels و descriptions في `twilight.json`) بالعربي الفصيح البسيط وبخطاب المؤنث.
- **الحقول النصية الفاضية (6.4، D115):** الحقل النصي الفاضي (`null` أو `''` أو مسافات) بيعرض نص unix.sa الافتراضي من الترجمة. سلة بتحفظ الحقل اللي ماتلمسش كـ `''`، فمسح الحقل مايقدرش يخفيه. العناصر الاختيارية بتستخبى بمفتاح (switch)، وعمرها ما تستخبى بنص فاضي. **استثناءات:** عنوان شريط العرض (من غير عنوان مافيش شريط)، وأسماء كروت التصنيفات ٤–٦ (مالهاش نص افتراضي).

---

## 10. الربط مع سلة (Salla Mapping)

| النظام | سلة |
|---|---|
| `--c-action` | عائلة `--color-primary` بتاعة سلة **بتتسحب من التوكنز بتاعتنا في الكود**، مش من اللوحة: `--color-primary` ← `--c-action`، و `--color-primary-dark` ← `--c-action-hover`، و `--color-primary-light` ← `--c-surface-muted` (سلة بتستخدمه خلفية فاتحة عليها نص غامق، أو لون border)، و `--color-primary-reverse` ← `--c-on-action` (D116؛ وبيترجعوا لقيم Cream/Sand جوه سكاشنها، §1.4). ده متقفل في `unix-tokens.scss` بـ `:root:root` عشان يغلب الـ `:root` اللي سلة بتحطه inline في `master.twig` من `theme.color.primary`. ميزة `color` اتشالت من `twilight.json → features`، فلون اللوحة مالوش أي تأثير (قرار المالك 2026-11-01: ثيم خاص بمتجر واحد، والأولوية إنه يطابق unix.sa بالظبط؛ مرونة التاجر تيجي بعدين) |
| Fonts | ميزة `fonts` في `twilight.json`، والخطوط بتاعتنا بتغلب (`--font-main`) |
| Components | `src/views/components/**` وتتسجل في `twilight.json → components` |
| Web components | `salla-*` بتتستايل من خلال CSS variables و `.s-*` classes. ماتعملش fork ليها |
| Settings | أي حاجة التاجر يعدّلها (نصوص، وصور، ولينكات) بتبقى `fields` في الكومبوننت. ممنوع الـ hard-code |
| Notifications | `salla.notify` بيعرض SweetAlert2 (toast أو modal، ستايل `05-utilities/swal.scss`)، وبيتحمّل مع أول إشعار (ROADMAP 6.2). لو واجهة الإشعارات ماتحمّلتش، الأخطاء والتأكيدات بترجع لـ dialog المتصفح، وإشعارات النجاح ممكن تتشال. |

---

## 11. قواعد اتخاذ القرار

1. **مش موجود في النظام؟** ضيفه هنا بـ PR الأول، وبعدين اكتب الكود.
2. **فيه تعارض بين SPEC.md (شوبيفاي) و DESIGN-SYSTEM.md؟** الـ Design System هو اللي بيكسب، والفرق يتكتب في §12.
   **استثناء (قرار المالك D6، 2026-11-01):** في السلوك اللي العميل بيشوفه، الأولوية للتطابق مع unix.sa. يعني نحدّث الـ Design System هنا الأول عشان يطابق SPEC، وبعدين نكتب الكود.
3. **فيه تعارض بين الفخامة والتحويل (conversion)؟** التحويل بيكسب في صفحة المنتج والسلة، والفخامة بتكسب في الهوم والتصنيفات.

## 12. فروقات عن ثيم شوبيفاي (مقصودة)

| شوبيفاي | هنا | السبب |
|---|---|---|
| النص الثانوي `#8a8079` | `#736a63` | التباين كان 3.4 وفاشل AA |
| مافيش scrim على الهيرو | scrim إجباري | الأبيض على sand تباينه 1.7 |
| `html {font-size:10px}` | 16px أساس | الأحجام تبقى طبيعية وتحترم إعدادات المتصفح |
| حواف الأزرار 30px | 999px pill | شكل pill ثابت في أي ارتفاع |
| نجوم على الكارت (Judge.me) | مش على الكارت | الهدوء، والنجوم في صفحة المنتج بس |
| شريط الإعلانات (Swiper) مابيقفش غير مع الـ hover | بيقف كمان مع الـ focus ولما التاب يبقى مخفي، وتبديل فوري من غير سلايد مع reduced-motion، و vanilla JS بدل Swiper | Accessibility (WCAG 2.2.2) وحجم الـ JS. الشكل والتوقيت زي الأصل بالظبط: سلايد عمودي، 4 ثواني لكل رسالة، و 0.8 ثانية للانتقال، و loop |
| مربعات التواصل في شريط الثقة: حواف 14px وظل hairline، و hover بألوان البراندات | حواف `--r-md` (16px) وبوردر 1px من `--c-border`، و hover بـ `--c-surface-muted` | مافيش أرقام برا النظام، ومافيش ظلال (§4)، ولون accent واحد (P2) |
| نتايج البحث: صور 3:4 | صور 4:5 | نفس نسبة كارت وصفحة المنتج (§6) |
| ترتيب ناحية النهاية في الهيدر: AR/EN، والبحث، والحساب، والسلة | البحث، والحساب، و AR/EN، والسلة (§8.7). على الموبايل الحساب و AR/EN بيتنقلوا لفوتر الدرج | البحث والسلة أهم حاجتين، والموبايل مايستحملش 5 أيقونات جنب لوجو 120px |
| الهيدر فوق الهيرو: أيقونات ولوجو بلون ink `#373542` | أيقونات cream، ولوجو فاتح اختياري (`unix_header_logo_inverse`)، والهيدر بيرجع solid مع الـ hover والفوكس والسكرول | §8.1: الهيرو عليه scrim غامق تحت، والـ cream أوضح عليه |

## 13. إضافات المرحلة 2 (الهوم بيدج)
بلوك منفصل عشان الدمج يبقى سهل. لما المرحلة تتقفل، التوكنز تتنقل لجداول §1.2 و §4.1 و §5، والفروقات لجدول §12.

> **ملاحظة (6.1):** توكنز المراحل 2–5 بتفضل في §13.1 (وفي بلوكاتها في `unix-tokens.scss`) لحد تجميعها في مهمة من مهام المرحلة 6 (6.x)، عشان مانحرّكش ملف التوكنز وفيه شغل أداء (6.2) شغّال عليه بالتوازي. التوكنز العامة اللي كانت ناقصة من §1.2 (`--c-success` و `--c-scrim` و `--c-backdrop`) و §3.3 (`--content-max` و `--gutter` و `--page-margin`) و §2.1 (`--f-body` و `--f-heading`) اتكتبت هناك.

### 13.1 Tokens
| Token | القيمة | الاستخدام |
|---|---|---|
| `--c-surface-sand` | sand-300 `#d8c5b8` | **التوكن العام** لخلفيات scheme «Sand» في الأصل: «حركة. رياضة. استرخاء.»، وخلفية «جديد من يونكس» لحد ما الصورة تحمّل (2.4، 2.5) |
| `--c-hero-bg` | `var(--c-surface-sand)` *(alias)* | خلفية الهيرو لحد ما الميديا تحمّل، أو لو مافيش ميديا (scheme «Sand» في الأصل) (2.1). النص عليها `--c-text` (ink-900 / sand-300 ≈ 7.2، AAA) |
| `--c-text-brand` | ink-700 `#373542` | النص فوق `--c-surface-sand` (الأصل بيفرض `#373542` في «حركة. رياضة. استرخاء.»)، تباين 7.2 AAA (§1.3) (2.5) |
| `--c-overlay` | ink-900 | طبقة التعتيم فوق الصور، بـ `opacity` من حقل التاجر زي الأصل، بس بلون ink-900 بدل الأسود (2.4، 2.5). في «جديد من يونكس» طبقة `--c-overlay` بنفس الـ opacity من غير scrims (D122) |
| `--card-w-sm` / `--card-w-md` | 164px / 264px | عرض كارت المنتج في كاروسيل «جديد من يونكس»: موبايل، ومن lg (الأصل 163 / 265px، اتقرّبوا لشبكة 4px) (2.4) |
| `--collections-max` | 1036px | أقصى عرض لصف كروت التصنيفات (الأصل 103.6rem لـ 3 كروت) (2.5) |
| `--c-hero-scrim` | `linear-gradient(to top, rgb(36 30 26 / .55), rgb(36 30 26 / .3) 50%, transparent 85%)` | scrim الهيرو: نفس `--c-scrim` بس ممتد لحد 85% عشان يغطي النص على الموبايل (2.1) |
| `--hero-ratio` | `2 / 3` | نسبة الهيرو على الموبايل (`mobile_image_ratio` في الأصل) (2.1) |
| `--hero-ratio-wide` | `16 / 9` | نسبة الهيرو من 576px (`desktop_image_ratio` في الأصل) (2.1) |
| `--hero-min-h` / `--hero-max-h` | 560px / 920px | حدود ارتفاع الهيرو (§8.1) (2.1) |
| `--hero-cta-line` | .55 | طول خط الـ CTA الـ underline مع الـ hover (`scaleX(.55)` في الأصل) (2.1) |
| `--d-stagger` | 60ms | الفرق بين العناصر في نمط «Reveal» (§5). بيتصفّر مع reduced-motion (2.1) |
| `--d-hint` | 2s | دورة هزّة سهم السكرول (`media-banner-scroll-bob 2s` في الأصل). الحركة كلها بتتقفل مع reduced-motion (2.1) |
| `--ratio-card` | `4 / 5` | صورة اللايف ستايل في «منتجات مختارة»، وصورة المدونة وصور الـ mega menu (§6، §8.16) (2.3، 2.6) |
| `--ratio-product` | `2 / 3` | نسبة صورة **كارت المنتج** في كل مكان (الهوم والتصنيف والبحث والـ skeleton)، زي unix.sa (`padding-bottom: 150%`). قرار صاحب البراند في المعاينة (6.4)، كانت 4:5 |
| `--zoom-hover` | 1.04 | تكبير الصورة مع الـ hover (§5 «Image hover»). بيبقى 1 مع reduced-motion (2.3، 2.6؛ وبطاقات الفيديو 2.7) |
| `--overlay-card-max` | 376px | أقصى عرض للكارت الصغير اللي فوق صورة اللايف ستايل (§8.16). الأصل 37.5rem، اتقرّب لشبكة الـ 4px (2.6) |
| `--tile-ratio` | `3 / 4` | نسبة بطاقة الفيديو (`desktop/mobile_media_ratio: 3/4` في الأصل) (2.7)، وكارت التصنيف في «حركة. رياضة. استرخاء.» (§8.14، 6.1). `--ratio-card` بقى كمان لصور نتايج البحث وصور الـ mega menu، و `--banner-ratio` / `--banner-ratio-wide` لصندوق «جديد من يونكس» (6.1، بدل أرقام مكتوبة في الـ SCSS) |
| `--c-tile-overlay` | `color-mix(in srgb, var(--unix-ink-900) 20%, transparent)` | الطبقة الخفيفة فوق الفيديو (`overlay_opacity: 0.2` في الأصل) (2.7) |
| `--faq-max` | 908px | أقصى عرض لعمود الأسئلة من lg (`max-width: 90.8rem` في الأصل) (2.9) |
| `--o-teaser` | .3 | السؤال الرابع الباهت وهي مقفولة (`item--opacity` في الأصل) (2.9) |
| `--c-teaser-fade` | `linear-gradient(to bottom, color-mix(in srgb, var(--c-bg) 30%, transparent) 20%, var(--c-bg))` | التدرّج فوق السؤال الباهت (نفس تدرّج الأصل) (2.9) |
| **Phase 3 · 3.1** | | *جاليري صفحة المنتج (§8.20)، بلوك منفصل لحد ما المرحلة 3 تتقفل* |
| `--ratio-pdp` | `2 / 3` | نسبة صور صفحة المنتج والـ thumbnails (§6)، زي الأصل (3.1؛ كانت 4:5 لحد 6.4، قرار صاحب البراند) |
| `--gallery-thumb-w` | 72px → 144px (من 1280px) | عرض عمود الـ thumbnails على الديسكتوب. الأصل 10rem → 14.7rem. كان 96px لما الجاليري كان نص الصفحة؛ من 6.4 الجاليري 62% زي الأصل (`--pdp-media-share`)، فرجع لحوالي 147px على 1366 |
| `--o-thumb` | .4 | opacity الـ thumbnail اللي مش نشط. الأصل .2 (3.1) |
| `--zoom-scale` | 2 | تكبير الصورة جوه دايلوج الزووم (3.1) |
| **Phase 3 · 3.2** | | **Product Info (§8.21)** |
| `--qty-w` | 112px | عرض خانة الكمية (الأصل `.quantity {width: 11.2rem}`) (3.2) |
| `--z-sticky-atc` | 30 | طبقة زرار الإضافة الثابت على الموبايل: تحت الهيدر (40) والدرج (60) (3.2) |
| `--z-plp-bar` | 30 | طبقة شريط الفلاتر والترتيب الـ sticky في التصنيف تحت 576: تحت الهيدر (40) والدرج (60) (§8.30) *(6.4، D132)* |
| **Phase 3 · 3.3** | | **Size Finder (§8.11)** |
| `--sf-dialog-w` | 560px | عرض دايلوج الـ Size Finder من md (§8.11) (3.3) |
| `--sf-progress-h` | 2px | ارتفاع شريط التقدّم (الأصل 2px) (3.3) |
| `--sf-ico` | 36px | دايرة أيقونة المسطرة في زرار الأداة (الأصل 3.4rem، اتقرّب لشبكة الـ 4px) (3.3) |
| `--sf-fig` | 44px | رسم شكل الجسم (الأصل 4.4rem) (3.3) |
| `--sf-think-w` | 120px | خط «نحسب مقاسك» (الأصل 12rem) (3.3) |
| `--d-sf-scan` | 1.1s | دورة خط «نحسب مقاسك» (الأصل 1.1s). بيتقفل مع reduced-motion (3.3) |
| **Phase 3 · 3.4** | | **Size Charts (§8.23)** |
| `--sg-dialog-w` | 900px | أقصى عرض لدايلوج جدول المقاسات (الأصل `max-width: 900px`) (3.4) |
| `--sg-dialog-max-h` | 90dvh | أقصى ارتفاع لنفس الدايلوج (الأصل `max-height: 90vh`) (3.4) |
| **Phase 3 · 3.7** | | **Cashback Note (§8.25)** |
| `--c-note-bg` | `color-mix(in srgb, var(--unix-ink-700) 5%, transparent)` | خلفية ملاحظة الكاش باك (الأصل `rgba(55,53,66,.05)`). النص عليها `--c-text` بس (`--c-text-muted` 4.3 ❌) (3.7) |
| **Phase 3 · 3.8** | | **التقييمات (§8.26)** |
| `--reviews-max` | 1200px | أقصى عرض لسكشن التقييمات (`max_width: 1200` بتاع Judge.me في الأصل) (3.8) |
| `--fw-regular` / `--fw-medium` / `--fw-semibold` / `--fw-bold` | 400 / 500 / 600 / 700 | أوزان الخط (§2.1). عنوان التقييمات والمتوسط `--fw-bold` (3.8). `--fw-semibold` بيرجع لـ 700 في العربي لأن مافيش وش 600، ومستخدم في الـ Size Finder (3.3) |
| **Phase 4 · 4.1** | | **Collection Banner (§8.29)** |
| `--c-surface-ink` | announce `#363441` | خلفية scheme «Ink» في الأصل (شريط الإعلانات وبانر التصنيف). نفس primitive `--c-announce` (4.1) |
| `--c-text-on-ink` | announce-text `#f3eeea` | النص فوق `--c-surface-ink`، تباين 10.6 AAA (4.1) |
| `--banner-ratio` / `--banner-ratio-wide` | `4 / 5` / `16 / 9` | صورة بانر التصنيف الاختيارية: تحت 576 / من 576 (§6) (4.1) |
| `--plp-banner-text-max` | 460px | أقصى عرض لنص البانر (الأصل `max-width: 46rem`) (4.1) |

### 13.2 فروقات مقصودة عن الأصل (تتنقل لـ §12)
| شوبيفاي | هنا | السبب |
|---|---|---|
| فيديو الهيرو autoplay من غير أي تحكم | زرار إيقاف/تشغيل 44px، ومابيتحمّلش مع reduced-motion أو Save-Data، وبيقف لما يخرج من الشاشة | WCAG 2.2.2 (حركة أطول من 5 ثواني لازم تتوقف)، والأداء |
| الفيديو بيبدأ يحمّل مع الصفحة (`preload="metadata"`) | بيتحمّل بعد `window.load`، والصورة poster لحد ما يشتغل | LCP أقل من 2.5 ثانية (DoD المرحلة 2) |
| نصوص الهيرو بـ opacity (الـ eyebrow .6 والنص .85) | لون `--c-text-inverse` كامل | التباين فوق صورة متغيرة مش مضمون مع الشفافية |
| ظهور النصوص بـ JS (`.is-inview`، إزاحة 2.4rem، فرق 90ms) | CSS بس عند التحميل، إزاحة `--s-4` وفرق `--d-stagger` (نمط Reveal في §5) | مافيش اعتماد على JS للمحتوى فوق الـ fold، وقيم من النظام |
| line-height عنوان الهيرو في العربي 1.28 | 1.2 (`--t-display`، §2.2) | المقياس الموحّد |
| الهيرو من غير ميديا: نص أبيض على sand | نص `--c-text` ومن غير scrim (§8.1 no-media) | الأبيض على sand تباينه 1.7 |
| الهيدر بيتسحب فوق الهيرو بـ JS (`header-overlay.js`) | السحب من السيرفر في CSS الهيرو، والألوان بـ `:has()` | CLS = 0 |
| شريط العرض (`.uo-home`): خلفية `#22323E`، و CTA مربع، ونصوص بـ opacity | خلفية `--c-action`، و CTA pill، ونصوص كاملة اللون (§8.12) | ألوان النظام بس (P4)، والأزرار pill (§12)، والتباين |
| «جديد من يونكس»: طبقة سودا 30% بس فوق الصورة، والعنوان ونص الكروت أبيض | طبقة `--c-overlay` بنفس الـ opacity من غير scrims (D122؛ الحقل من 30 لـ 60)، والنص cream (§8.13) | زي الأصل بالظبط؛ التباين AA مش مضمون على أي صورة (استثناء مسجّل في §1.3) |
| «حركة. رياضة. استرخاء.»: اسم التصنيف أبيض فوق طبقة سودا 10–20% بس | نفس الـ opacity بلون `--c-overlay`، وفوقها `--c-scrim` تحت الاسم، والاسم cream (§8.14) | 10–20% مابتضمنش تباين على صور فاتحة |
| «حركة. رياضة. استرخاء.»: Swiper للكروت، والأسهم بتظهر مع الـ hover بس | صف CSS بـ scroll-snap بنفس عدد الكروت في الشاشة (1.5 / 2.5 / 3)، وأسهم ظاهرة دايمًا من lg لما الكروت أكتر من 3 (§8.14) | من غير Swiper، والكيبورد بيوصل لكل كارت وللأسهم |
| كروت المنتجات في «المفضلة دائما» و«منتجات مختارة»: صورة 2:3 `contain`، والـ vendor ظاهر | صورة 4:5 (`--ratio-card`) بـ fit إعداد المتجر، ومن غير vendor | نسبة الكارت الموحدة (§6، §8.3). سلة مافيهاش vendor على الكارت |
| صورة اللايف ستايل في «منتجات مختارة» بنسبتها الطبيعية (`adapt`) | 4:5 ثابتة (`--ratio-card`) | مافيش CLS، وكل الشرايح نفس الارتفاع |
| تابات المنتجات: `div` بتتداس بالماوس بس | ARIA tabs كاملة بالكيبورد، والتابات اللي مش ظاهرة بتتحمّل وقت الحاجة | Accessibility (P6) والأداء |
| نقط pagination تحت كاروسيلات المنتجات | أسهم سلة + سوايب من غير نقط | أهدى (P2): الأسهم والسوايب كفاية |
| فيديوهات البطاقات autoplay من غير أي تحكم | زرار إيقاف/تشغيل 44px لكل بطاقة، ومافيش تشغيل تلقائي مع reduced-motion أو Save-Data (§8.18) | WCAG 2.2.2، والأداء |
| فيديوهات البطاقات بتتحمّل مع الصفحة | الـ src بيتحط لما البطاقة تقرب من الشاشة، والغلاف lazy | السكشن تحت الـ fold، و LCP |
| السحب على الموبايل بـ Swiper، والتبديل لعمودين عند 990px | CSS scroll-snap، وعمودين من md (768) | حجم الـ JS، و 990 مش breakpoint في §3.3؛ وبين 768 و 990 البطاقة الواحدة بعرض الشاشة كانت بتطول لأكتر من 1000px *(قرار مؤقت)* |
| حواف بطاقة الفيديو `.6rem` | `--r-md` (16px) | نفس حواف الصور والبنرات (§4) |
| تكبير الميديا `scale(1.05)` في 250ms من 1200px | `--zoom-hover` (1.04) في `--d-reveal`، على أجهزة الماوس، ومع فوكس الكيبورد على اللينك | نمط Image hover في §5 |
| فيديوهات البطاقات مرفوعة على شوبيفاي (الفيديو الأول لينكه `/collections/all`) | رابط الفيديو فاضي افتراضيًا (التاجر يرفع الفيديو ويحط رابطه، D14)، ورابط البطاقة فاضي افتراضيًا | مافيش اعتماد على CDN شوبيفاي، وسلة ماتقدرش تحدد «كل المنتجات» كقيمة افتراضية لحقل الرابط بشكل مضمون *(قرار مؤقت – محتاج مراجعة)* |
| إجابات الأسئلة rich text (bold ولينكات) من التاجر | إجابات التاجر نص عادي (textarea، الأسطر الجديدة بتظهر)؛ الإجابات الافتراضية من الترجمة بس هي اللي فيها bold ولينك | سلة مافيهاش حقل rich text جوه الـ collection بشكل مضمون، والنص العادي أأمن *(قرار مؤقت)* |
| parallax على بطاقة الفيديو الأولى | مافيش | الأصل بيطبّقه على الصورة بس مش الفيديو، فمالوش أثر ظاهر |
| الأسئلة: زرارين منفصلين «عرض المزيد» و «عرض أقل» | زرار واحد بـ `aria-expanded` بيغيّر النص والشكل (primary ↔ secondary)، والفوكس بيروح لأول سؤال ظهر (§8.10) | Accessibility: الزرار مايختفيش من تحت الفوكس |
| الأسئلة المخفية `display: none` | `hidden="until-found"`، والسؤال الباهت `inert` | البحث في الصفحة بيوصل للإجابات، والقارئ مايوقفش على عنصر مش شغال |
| فتح/قفل الإجابة بـ JS (height في 300ms) | `<details name>` أصلية، والحركة `grid-template-rows` في `--d-base` | §8.10، ومن غير JS، وبتتقفل مع reduced-motion |
| السؤال جوه `<h3>` في الزرار | `<span>` بخط العناوين جوه `<summary>` | الـ summary دوره button، والعنوان جواه بيضيع معناه عند قارئ الشاشة |
| الشحن المجاني في إجابة الأسئلة «600 ريال» | الرقم من إعداد `unix_free_shipping_threshold` (500، D1) | نفس الرقم في شريط الإعلانات، والـ 600 قديمة *(قرار مؤقت)* |
| المدونة «من عالم UNIX»: مقالات المدونة `news` بتتسحب أوتوماتيك | التاجرة بتختار المقالات بنفسها (`source: blog_articles`، لحد 12) (§8.17) | سلة مابتديش للكومبوننت «آخر مقالات» أوتوماتيك. لو مافيش مقالات مختارة السكشن مابيظهرش *(قرار مؤقت – محتاج مراجعة)* |
| المدونة: Swiper (`featured-blog.js`) | track أصلي بـ scroll-snap وأسهم vanilla JS صغيرة (`unix-blog.js`)، بنفس السلوك: السهم بيحرّك صفحة كاملة | المسافات من الـ tokens (`--gutter`) بدل أرقام px في config بتاع Swiper، وسحب وكيبورد أصليين، و JS أقل *(قرار مؤقت – محتاج مراجعة)* |
| المدونة: breakpoints الكاروسيل 576 / 750 / 1200 والمسافات 750 | **زي الأصل** (1 / 2 / 3 / 4 كروت عند <576 / 576 / 750 / 1200، و padding بيتغير عند 750): استثناء على مستوى الكومبوننت من breakpoints الجريد (§3.3: 576 / 768 / 1024) | قرار المالك (أقرب حاجة لـ unix.sa) *(قرار مؤقت – محتاج مراجعة)* |
| المدونة: padding `l/l` (40 / 80 / 112px) | `--section-sm` تحت 750، و `--section-md` من 750 (64 → 112، يعني 80 عند 1000 بس) (§3.2، §8.17) | مافيش token لـ 80px؛ ده أقرب ربط بالـ tokens الموجودة، وبيطابق 40 و 112 بالظبط *(قرار مؤقت – محتاج مراجعة)* |
| كروت المدونة من غير أي فاصل، ومن غير لمحة على الموبايل | خط `--line-w` `--c-border` فوق كل كارت (زي `article-card-small` في الأصل)، ولمحة `--s-7` من الكارت اللي بعده على الموبايل | الكروت نصية بس، فالخط بيرتبها editorial، واللمحة بتوضح إن فيه سحب لأن الأسهم مخفية على الموبايل *(قرار مؤقت – محتاج مراجعة)* |
| hover عنوان كارت المدونة: opacity .8 | `--o-muted` (.7) | مافيش token لـ .8، والفرق مش باين تقريبًا (تباين ink-900 على cream لسه أعلى من AA) *(قرار مؤقت – محتاج مراجعة)* |
| **Phase 3 · 3.1** جاليري المنتج: صور 2:3 | 4:5 (`--ratio-pdp`) | نسبة صفحة المنتج في §6، ونفس نسبة الكارت |
| thumbnails مش نشطة بـ opacity .2 | `--o-thumb` (.4) | .2 بتخلي الصور مش باينة تقريبًا على الكريمي |
| الـ thumbnails والأسهم `div` بتتداس بالماوس بس | `button` بـ `aria-label` و `aria-current`، والأسهم `disabled` في الأول والآخر | Accessibility (P6) |
| مودال الزووم: Swiper zoom (pinch/double-tap) | `<dialog>` native: scroll-snap للسوايب، وزرار تكبير 2× والسحب بالـ scroll، و Esc ورجوع الفوكس | Accessibility (P6)، ومن غير Swiper تاني في صفحة المنتج |
| عدسة التكبير بالـ hover بتاعة رائد (إعداد `imageZoom`) | اتشالت، والزووم بالدايلوج بس ودايمًا شغّال زي الأصل | الأصل مافيهوش عدسة، والزووم عنده شغّال على الموبايل والديسكتوب |
| **Phase 3 · 3.3** Size Finder: panel بيتفتح جوه الصفحة على الديسكتوب و bottom sheet على الموبايل | `<dialog>` modal عرضه `--sf-dialog-w` على الديسكتوب، وشاشة كاملة على الموبايل (§8.11) | §8.11 بيقول modal؛ والـ dialog بيدّي focus trap و Esc وخلفية من المتصفح |
| Size Finder: خلايا مربعة بلون `#22323E`، وألوان rgba خاصة بالأداة | `--r-sm`، والمختار `--c-action`، والألوان من النظام بس، وزرار الاختيار pill (`.unix-btn`) | P4 والأزرار pill (§12) |
| Size Finder: الاختيارات أزرار عادية | `role="radiogroup"` بأسهم الكيبورد، والوحدات في اسم المجموعة، وعنوان الدايلوج = السؤال الحالي | Accessibility (P6) |
| Size Finder: سكربت منفصل (`unix-size-finder.js`) بيتحمّل مع كل صفحة منتج | جزء من `product.js` (import ثابت)، والواجهة بتتبني وقت الفتح بس | ملف واحد أقل، ومن غير اعتماد على chunks من CDN سلة |
| Size Finder: علامة «مقترح» absolute تحت زرار المقاس بلون `#2F5D46` ثابت | absolute برضه، `--c-success`، و `--c-text-inverse` لما المقاس متختار؛ في وضع الأزرار (3.2) بتفضل `--c-success` لأن الخلفية `--c-surface` | التباين على الزرار المختار الغامق |
| Size Finder: الفئة من `product.type`، والكومفي من metafield جدول المقاسات، و `fit_delta` metafield | الفئة والكومفي من اسم المنتج (كلمات زي الأصل + العربي)، ويتغيّروا لكل منتج من `unix_size_finder_data.PRODUCTS` | سلة مافيهاش product type ولا metafields في الثيم *(قرار مؤقت – محتاج مراجعة)* |
| Size Finder: التوصية بتتكتب في الطلب كـ line-item property مخفية (`_rec_size`) للمعايرة | مش بتتكتب | سلة مابتقبلش properties مخفية على عنصر السلة من الثيم *(قرار مؤقت – محتاج مراجعة)* |
| **Phase 3 · 3.2** أكورديون «مميزات المنتج» و«تعليمات العناية» من metafields | «الوصف» بس (`product.description`)، وبعده الحقول المخصصة لو موجودة (`salla-metadata`) | سلة مافيهاش metafields في الثيم *(قرار مؤقت – محتاج مراجعة، D56)* |
| الأكورديون بـ JS (height في 300ms) | `<details name>` أصلية (§8.10) | من غير JS، وبيتقفل مع reduced-motion |
| زرار الإضافة الثابت: نفس الزرار بيتنقل `position: fixed` (والصف بياخد min-height) | شريط منفصل بيضغط زرار سلة الحقيقي، `inert` وهو مخفي، و safe-area | مافيش CLS، والكيبورد وقارئ الشاشة مابيوصلوش لحاجة مخفية |
| الكمية: أزرار − ثم + | ترتيب `salla-quantity-input` (+ ثم −) | ماينفعش نغيّر DOM بتاع كومبوننت سلة، وتغيير الترتيب بصريًا بس بيلخبط الكيبورد |
| **Phase 3 · 3.5** تمارا من سكربت الثيم (`snippets/tamara.liquid`، مفتاح عام مكتوب في الكود) و Tabby من تطبيق | `salla-installment` الأصلي بمفاتيح المتجر من سلة | قاعدة الـ salla-* components، ومافيش مفاتيح في الكود |
| ويدجت تمارا: `tamaraWidgetConfig.css` بيخلي المبلغ bold، و `badgePosition: right` | الخط بس بيتورّث (`--font-primary`)؛ المبلغ ومكان اللوجو بإعدادات تمارا الافتراضية | `salla-installment` هو اللي بيكتب `tamaraWidgetConfig`، ومانقدرش نوصل لجوه الـ shadow DOM من غير ما نحمّل السكربت بنفسنا *(قرار مؤقت – محتاج مراجعة، D59)* |
| صناديق تابي وغيره: أبيض بظل مع الـ hover (ستايل سلة) | `--c-surface` وبوردر رفيع ومن غير ظل | P2 الهدوء، و §4 (مافيش ظلال) |
| تابي: مسافات الصندوق من التطبيق | الإطار برا بس (`padding-inline: --s-4`)؛ المسافة العمودية جوه `margin: 15px 0 !important` اللي سلة بتحطها inline جوه الـ shadow root | مانقدرش نوصل لجوه الـ shadow DOM *(قرار مؤقت – محتاج مراجعة، D59)* |
| تمارا وتابي في مكانهم من غير مساحة محجوزة | نفس الكلام: الويدجتات بتترسم بعد التحميل | مافيش ارتفاع ثابت نقدر نحجزه (بيختلف حسب المزوّدين المفعّلين)؛ ممكن CLS فوق الخيارات، لازم يتقاس في المعاينة *(D59)* |
| **Phase 3 · 3.4** جداول المقاسات: صفحات شوبيفاي مربوطة بـ metafields (`size_chart`، `_top`، `_bottom`) | «دليل المقاسات» بتاع سلة للمنتج، والأزرار من أسماء الجداول (§8.23) | سلة مافيهاش metafields في الثيم، ودليل المقاسات هو المكان الطبيعي في لوحة سلة *(قرار مؤقت D60)* |
| مودال `div` بـ `display:flex`، والـ Esc مش شغّال، والفوكس مش بيرجع | `<dialog>` native: focus trap و Esc ورجوع الفوكس وقفل السكرول | Accessibility (P6) |
| حواف الكارت 12px، والخلفية أسود .5، و × نص 26px | `--r-lg`، و `--c-backdrop`، وزرار `--tap` بأيقونة | قيم النظام (§4، §5) *(قرار مؤقت D61)* |
| **Phase 3 · 3.6** موعد التوصيل: النصوص والمدن مكتوبة جوه الـ snippet | إعدادات متعددة اللغات، والفاضي = نص unix.sa (§8.24) | التاجر يغيّر المدد والمدن من غير كود *(قرار مؤقت D62)* |
| القوايم حوالي 38px، وحواف الصندوق 12px، وسهم القايمة gradient، والملاحظة opacity .6 | `--tap`، و `--r-md`، و chevron SVG، والملاحظة `--c-text-muted`. والقايمة بوردر على `--c-surface` من غير label ظاهر (`aria-label` + اختيار placeholder زي unix.sa) بدل حقل §8.5 (52px، `--c-field`، label فوقه) | هدف لمس 44px (P6)، وقيم النظام، والتباين، والصندوق مضغوط زي الأصل *(قرار مؤقت D63)* |
| **Phase 3 · 3.7** الكاش باك: لعميلة عندها رصيد «عندكِ X رصيد — طبّقيه عند إتمام الطلب» | مش متنقل: كل العميلات بيشوفوا «يرجع لكِ…» (والزائرة بلينك الدخول) | سلة مابتديش رصيد المحفظة للثيم *(قرار مؤقت D64)* |
| السطر التاني opacity .7، والنقطة `#8a7f6d`، وحواف 14px، و 10% مكتوبة في الكود | `--c-text`، و `--c-accent`، و `--r-md`، والنسبة والصلاحية إعدادات | التباين AA وقيم النظام *(قرار مؤقت D65)* |
| **Phase 3 · 3.8** تقييمات Judge.me (ملخص وترقيم صفحات وشكل Judge.me) | تقييمات سلة (`salla-comments`): ملخص سلة، و«تحميل المزيد» بدل الترقيم، بنفس ألوان الأصل (§8.26) | سلة مافيهاش Judge.me، ومش بنعمل fork للكومبوننت *(قرار مؤقت – محتاج مراجعة، D67)* |
| كارت التقييم أبيض `#fff`، و padding 18px | `--c-surface`، و `--s-4` (`--s-5` من md) | مافيش أبيض ولا 18px في النظام (P4) |
| حقول الفورم ببوردر `#ddd3c6` وحواف 12px | حقل §8.5: `--c-field` من غير بوردر و `--r-sm` | §8.5 |
| «مشتري موثّق» بلون taupe-500 كنص | `--c-accent-text` (taupe-700) | taupe-500 كنص تباينه 4.0 (§1.3) |
| أزرار Judge.me حوافها 30px | pill (`--r-pill`) | §12 |
| عنوان Judge.me والمتوسط وزنهم 600 | `--fw-bold` (700) | IBM Plex Sans Arabic محمّل 300/400/500/700 بس (مافيهوش 600)، و Somar وزن Bold واحد، فالـ 600 على الخطوط دي بيبقى `--fw-bold`. Open Sans (الإنجليزي) فيه 600 (§2.1) |
| **Phase 3 · 3.9** «أكملي الإطلالة» من metafield `custom.complements` لكل منتج | من إعداد JSON واحد `unix_complete_look_data` (رقم المنتج ← أرقام القطع) (§8.27) | سلة مافيهاش metafields في الثيم ولا حقل منتجات مكمّلة *(قرار مؤقت – محتاج مراجعة، D68)* |
| كروت «أكملي الإطلالة» 3:4 cover، و«قد يعجبك أيضًا» 2:3 contain مع الـ vendor | كارت §8.3: 4:5 (`--ratio-card`) بـ fit إعداد المتجر ومن غير vendor | نسبة الكارت الموحدة (D20) |
| زرار «أضيفي» بوردر شفاف 22% وحواف 30px و hover بتظليل خفيف | outline §8.2 (بوردر `--line-w-strong` `--c-action`، و fill بيطلع مع الـ hover) | P4، والأزرار pill (§12) |
| زرار «أضيفي» ارتفاعه 40px (`4rem`) في كل الأجهزة | 40px (`--btn-h-sm`) بالماوس، و 44px (`--tap`) على اللمس | مساحة اللمس 44px (P6) |
| «عرض الكل» `button--secondary` (hover: خلفية `#ddd3c6` ونص غامق) | `.unix-btn` primary: نفس الشكل وهو واقف، والـ hover `--c-action-hover` | §8.2 مافيهوش variant بالـ hover ده *(قرار مؤقت – محتاج مراجعة، D70)* |
| «قد يعجبك أيضًا»: محرّك توصيات شوبيفاي | المنتجات المشابهة بتاعة سلة (`related`) في جريد | ده المصدر الأصلي في سلة؛ مسار سلة للتوصيات بالذكاء الاصطناعي موجود في `salla-products-slider` بس (كاروسيل) *(قرار مؤقت – محتاج مراجعة، D69)* |
| **Phase 3 · 3.10** ألوان الموديل من تطبيق G: Combined Listings | إعداد نصي `unix_colour_links` ودواير hex أو صورة قماش (أو زرار نصي، 6.4: D133) بلينكات من السيرفر (§8.28) | Twig مايقدرش يجيب منتجات تانية، والتطبيق مش موجود في سلة *(قرار مؤقت – محتاج مراجعة، D72، D73)* |
| **Phase 3 · 3.11** الهوم: `h1` مخفي باسم المتجر في الهيدر + `h1` الهيرو | `h1` واحد: عنوان أول هيرو، وإلا اسم المتجر (مخفي) (§14) | صفحة واحدة = `h1` واحد *(قرار مؤقت – محتاج مراجعة، D75)* |
| `WebSite` في الهوم فيه `SearchAction` (sitelinks search box) | `WebSite` من غير `SearchAction` (§14) | جوجل لغت مربع البحث في نتايج البحث (2024)، وشكل رابط البحث في سلة مش متأكدين منه |
| **Phase 4 · 4.1** عنوان التصنيف فيه prefix مخفي «المجموعة: » | `h1` = اسم التصنيف بس (§8.29) | `h1` نضيف للـ SEO *(قرار مؤقت – محتاج مراجعة، D77)* |
| وصف المجموعة rich text من شوبيفاي | وصف التصنيف من سلة لو متاح للثيم (`category.description`) | سلة مش موثّق إنها بتدّي الوصف في Twig؛ لو مش موجود البانر بيظهر العنوان بس *(D77)* |
| **Phase 4 · 4.2** جريد 2 / 3 من 990 / 4 من 1185 | 2 / 3 من md / 4 من lg (§3.3، §8.30) | breakpoints النظام *(قرار مؤقت – محتاج مراجعة، D78)* |
| كروت الجريد 2:3 `contain` مع الـ vendor ونجوم Judge.me | كارت §8.3 الموحد (4:5 بـ fit إعداد المتجر، من غير vendor ولا نجوم) | D20/D26، و §12 |
| 12 منتج في الصفحة وأرقام صفحات (`pagination_type: pagination`) | «تحميل المزيد» بتاع `salla-products-list` بعدد سلة في الصفحة | سلة مافيهاش ترقيم صفحات للتصنيف، ومش هنعيد منطق الجلب *(قرار مؤقت – محتاج مراجعة، D79)* |
| الفلاتر بتتطبق بعد ما الزائرة تضغط (الفورم بيتبعت مع التغيير) | سلة بتطبّق أول ما تختاري، والدرج بيفضل مفتوح، و«عرض النتائج» بيقفله (§8.31) | سلوك `salla-filters`، ومن غير fork *(D80)* |
| عناوين الفلاتر `summary` | عنوان `h3` بتاع سلة + `role="button"` و `tabindex` و `aria-expanded` بالـ JS | الكيبورد يوصل للفلاتر من غير fork *(D81)* |
| عدد المنتجات مش ظاهر ومش بيتعلن | إعلان مخفي (`role="status"`) بعد كل فلترة أو ترتيب | Accessibility (P6) |

---

## 14. SEO (محركات البحث) — *المرحلة 3.11*
أولوية المالك: الثيم يكون صديق لمحركات البحث 100%. القاعدة: **مانكررش أي حاجة سلة بتطلّعها**، وأي حاجة مش متأكدين منها بتطلع من عندنا ورا إعداد (مفعّل افتراضيًا) لحد ما نشوف مصدر الصفحة الحقيقي.

### 14.1 مين مسؤول عن إيه
| العنصر | المسؤول | فين |
|---|---|---|
| `<title>`، و meta description، و canonical، و hreflang (ar/en)، و Open Graph و Twitter، و robots | **سلة** (مفترض، D74) | `{% hook head %}` في `layouts/master.twig`. الثيم مابيكتبش أي واحد منهم |
| `sitemap.xml` و `robots.txt` | **سلة** | المنصة |
| عناوين و SEO كل منتج وتصنيف (العنوان والوصف والرابط) | **التاجر في سلة** | لوحة التحكم، لكل منتج |
| `BreadcrumbList` | **سلة** لما مسار التنقل ظاهر (`salla-breadcrumb` بيكتبه بالـ JS)؛ **الثيم** لما التاجر يخفيه (من السيرفر، `unix_seo_jsonld_breadcrumb`) | `components/seo/unix-jsonld-breadcrumb.twig` (D76) |
| `ItemList` لمنتجات التصنيف | **سلة** (`salla-products-list` بالـ JS) | — |
| لينكات المنتجات في صفحة التصنيف (4.2) | **سلة** بالـ JS: `salla-products-list` بيجيب المنتجات من الـ API ويرسم كارت الثيم (`custom-salla-product-card`)، وكل كارت فيه `<a href>` حقيقي للمنتج (الصورة والاسم)، بس **بعد** تنفيذ الـ JS (Googlebot بينفّذه). مافيش منتجات في الـ HTML اللي جاي من السيرفر، لأن Twig صفحة التصنيف مافيهوش قايمة منتجات (D82) | `pages/product/index.twig` |
| canonical صفحات التصنيف المفلترة والمترتبة | **سلة** (`{% hook head %}`). الفلترة والترتيب والصفحات كلها بتتعمل بالـ JS على نفس الرابط: `salla-filters` بيكتب `?filters[...]` (وأول مرة `filters[category_id]`) بـ `pushState`، والترتيب `?sort=`، و«تحميل المزيد» مابيغيّرش الرابط. يعني مافيش روابط صفحات `?page=` جديدة؛ ولازم الـ canonical لأي رابط فيه `filters` أو `sort` يشاور على رابط التصنيف النضيف (D82) | المنصة |
| `Organization` و `WebPage` (كل الصفحات) | **سلة** (`{% hook head %}`، اتقاس على المعاينة 6.4، D129). الثيم مابقاش بيطلّع Organization (اتشال هو وإعداد `unix_seo_jsonld_site`) | المنصة |
| `Product` (صفحة المنتج: offers بالسعر والعملة والتوفر، و image، و sku، و seller، و MerchantReturnPolicy) | **سلة** (D129). الثيم مابقاش بيطلّع Product ولا `ProductGroup` الألوان (اتشالوا هم و `unix_seo_jsonld_product` و `unix_seo_brand_name`): الـ ProductGroup ماكانش يقدر يبقى كامل لوحده لأن Twig مايعرفش أسعار الألوان التانية | المنصة |
| `WebSite` (الهوم بس) بـ `SearchAction` على `/search?q=` | **الثيم** (سلة مابتطلّعش WebSite، D129). من غير مرجع لـ Organization | `components/seo/unix-jsonld-site.twig` |
| `FAQPage` | **الثيم** (2.9) | `components/home/unix-faq.twig` |
| `BlogPosting` لصفحة المقال (العنوان، والصورة، وتاريخ النشر والتعديل، والكاتب، والناشر = Organization بالاسم والرابط واللوجو مكتوبين، من غير `@id` من D129، والوسوم) | **الثيم** (`unix_seo_jsonld_article`، 5.4، D101). صفحة المدونة نفسها مالهاش JSON-LD (مافيش rich result ليها). المعاينة بترد 403 على `/blog`، فلازم نتأكد على الموقع الحقيقي إن سلة مابتطلّعش Article (D129) | `components/seo/unix-jsonld-article.twig` |

### 14.2 قواعد
- **`h1` واحد في كل صفحة:** المنتج = اسمه، والتصنيف = اسمه، والصفحات = عنوانها. الهوم = عنوان **أول** هيرو فيه عنوان (والهيروهات اللي بعده `h2`)؛ لو مافيش، اسم المتجر `sr-only` في آخر المحتوى. الهيدر مافيهوش أي عنوان (اللوجو `alt` باسم المتجر). عناوين السكاشن `h2`، وجوه الكروت `h3` أو أقل. *(قرار مؤقت D75)*
- **الـ JSON-LD من السيرفر بس** (جوه الـ HTML، مش بالـ JS)، ومكتوب بـ `|json_encode|raw` (بيعمل escape لـ `/`، فمافيش قيمة تقدر تقفل الـ `<script>`).
- **Product (لحد 6.4، اتلغى في D129: سلة هي المصدر؛ متساب هنا كمرجع للحقول اللي ناقصة عند سلة):** الاسم، والرابط (`@id`)، والوصف نص من غير HTML (5000 حرف بالكتير)، وكل الصور، و `sku`، و `gtin` لو الباركود 8 أو 12 أو 13 أو 14 رقم، و `brand` (ماركة المنتج في سلة، وإلا `unix_seo_brand_name` = «UNIX»، وإلا اسم المتجر)، و `category`، و `color` (3.10). `offers`: السعر المعروض بالظبط زي بلوك السعر في `single.twig` (`sale_price` وقت الخصم، وإلا «يبدأ من»، وإلا `price`)، والعملة (`product.currency`، SAR)، والتوفر (InStock / OutOfStock / PreOrder)، و NewCondition، والبائع (`@id` بتاع الـ Organization لما `unix_seo_jsonld_site` مفعّل، وإلا الاسم بس)، والسعر القديم كـ `StrikethroughPrice` وقت الخصم. وقت الخصم ولو فيه `discount_ends`: `priceValidUntil` بصيغة YYYY-MM-DD. `aggregateRating` بس لو فيه تقييمات. الأطقم منتج عادي بسعر الطقم.
- **ألوان الموديل (D72؛ الـ JSON-LD بتاعها اتشال في D129):** كل لون صفحة مستقلة بـ canonical بتاعها، والجزء ده كان بيطلع بس لو الموديل ليه لونين أو أكتر. `Product` بيحمل `inProductGroupWithID` = مفتاح المجموعة، و `isVariantOf` → `ProductGroup` بـ `productGroupID` = نفس المفتاح في `unix_colour_links`، و `variesBy` color، و `hasVariant` = `{ @type: Product, @id, url }` لكل لون (روابط مطلقة؛ الرابط اللي بيبدأ بـ `/` بياخد `store.url` قبله). اسم الـ ProductGroup = الجزء اللي قبل «|» في عنوان المنتج.
- **لينكات داخلية من السيرفر:** دواير الألوان (§8.28) `<a href>` حقيقية في الـ HTML.
- **المدونة والصفحات (5.4، 5.5):** `h1` المدونة = عنوان الصفحة (ظاهر دايمًا)، والمقال = عنوانه، والصفحة الثابتة = عنوانها. أي `h1` كتبه التاجر جوه المحتوى بيتحوّل `h2` من السيرفر. كروت المقالات وتصنيفات المدونة ووسوم المقال `<a href>` حقيقية من السيرفر. `BlogPosting`: `@id` = رابط المقال + `#article`، و `headline` (110 حرف بالكتير)، و `description` (المقتطف وإلا أول 300 حرف من المحتوى نص من غير HTML)، و `image` لو فيه صورة، و `datePublished` / `dateModified` بصيغة ISO 8601، و `author` = `Person` باسم الكاتب (وإلا الـ Organization)، و `publisher` = Organization بالاسم والرابط واللوجو (D129: مافيش `@id` يشاور عليه)، و `keywords` = الوسوم، و `inLanguage`.
- **صفحة التصنيف (4.2):** الـ `h1` اسم التصنيف من السيرفر (§8.29) ومابيتغيّرش مع الفلترة. كروت المنتجات `<a href>` حقيقية بس بتترسم بالـ JS (§14.1، D82)؛ الاكتشاف الأساسي للمنتجات من الـ sitemap بتاع سلة والمنيو و«المفضلة دائما» وغيرهم. قبل الإطلاق: View Source + URL Inspection لتصنيف، ورابط فيه `?filters[...]` و `?sort=` نتأكد إن الـ canonical بتاعه رابط التصنيف من غير parameters.
- **التحقق قبل الإطلاق (6.x):** مصدر الصفحة (View Source) للهوم ومنتج وتصنيف: مافيش `<title>` أو canonical أو OG مكررين، و Organization واحد و Product واحد (بتوع سلة، D129)، و Google Rich Results Test على منتج فيه ألوان ومنتج فيه تقييمات وطقم.
