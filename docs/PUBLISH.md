# بيانات نشر الثيم (ROADMAP 6.5 و 6.6)

كل اللي بوابة الشركاء بتطلبه في صفحة الثيم 705562203، جاهز للنسخ. الثيم **خاص** لمتجر UNIX بس، فالنص ده بيقراه فريق مراجعة سلة، مش زباين.

## 1) الأساسيات
| الخانة في البوابة | القيمة |
|---|---|
| اسم الثيم (عربي) | يونكس |
| اسم الثيم (إنجليزي) | UNIX |
| الفئة | أزياء |
| نوع التثبيت | ثيم خاص (متجر UNIX بس) |
| الفرع | `main` |
| الأيقونة | لوجو UNIX مربع، PNG خلفية شفافة أو بيضا، 512×512 (من صاحب البراند) |

## 2) تفاصيل الثيم (خانة «تفاصيل الثيم»)

### عربي
ثيم مخصص لعلامة UNIX للملابس الرياضية النسائية في السعودية، بتصميم هادئ وراقٍ يضع المنتج والصورة في المقدمة. مبني على Twilight وثيم رائد، ويدعم العربية أولًا والإنجليزية.

**الصفحة الرئيسية:** واجهة بصورة أو فيديو، شريط عرض، فيديوهين جنب بعض، منتجات بتبويبات، منتجات مختارة مع صور، تصنيفات، مقالات المدونة، وأسئلة شائعة. كل المحتوى من لوحة التاجر.

**صفحة المنتج:** معرض صور بالسحب، روابط ألوان الموديل (كل لون منتج مستقل لصالح محركات البحث)، جداول المقاسات، مكتشف المقاس، تمارا وتابي، موعد التوصيل المتوقع، الكاش باك، التقييمات، «أكملي الإطلالة»، وزر إضافة ثابت على الجوال.

**التصنيفات والسلة:** فلاتر وترتيب، بانر للتصنيف، درج سلة جانبي، وشريط الشحن المجاني.

**محركات البحث:** بيانات منظمة Product و ProductGroup و Organization و BreadcrumbList و BlogPosting و FAQPage من السيرفر، وعنوان h1 واحد لكل صفحة.

**الأداء وسهولة الوصول:** JavaScript خفيف، ومكتبات تتحمّل وقت الحاجة بس، وخصائص CSS منطقية لدعم RTL كامل، ورابط تخطي، وتباين AA.

### English
A custom theme for UNIX, a Saudi women's activewear brand: quiet, refined, product-first. Built on Twilight and Theme Raed, Arabic-first with full English support.

**Home:** image or video hero, offer strip, side-by-side videos, tabbed products, featured products with images, collections, blog posts and FAQ, all editable from the merchant dashboard.

**Product page:** swipe gallery, colour links (each colour is its own product for SEO), size charts, size finder, Tamara and Tabby, delivery estimate, cashback, reviews, "Complete the look" and a sticky add-to-cart on mobile.

**Category and cart:** filters and sorting, category banner, side cart drawer and free-shipping progress.

**SEO:** server-rendered Product, ProductGroup, Organization, BreadcrumbList, BlogPosting and FAQPage structured data, one h1 per page.

**Performance and accessibility:** lightweight JavaScript, libraries loaded on demand, logical CSS for full RTL, skip link and AA contrast.

## 3) صور العرض (Screenshots)
- المقاس: **1366×768**، PNG أو JPG.
- 3 بالقليل، بالترتيب: الهوم (أول شاشة بالهيرو)، صفحة منتج (الليقنز فانيليا)، التصنيف (ملابس رياضية).
- اختياري: درج السلة مفتوح، وصفحة المنتج على الجوال.
- تتاخد من المعاينة بعد ما الثيم يظهر صح (مستني «سجلات البناء» تنجح، docs/PREVIEW.md).

## 4) قبل «أكمل طلب النشر»
- [ ] «سجلات البناء» فيها build ناجح لآخر commit على `main`.
- [ ] `docs/PREVIEW.md` اتراجعت كلها من غير مشاكل مفتوحة.
- [ ] الأيقونة والصور مرفوعة، والتفاصيل عربي وإنجليزي متحفوظة.
- [ ] «ثيم خاص» متعلّم، ورابط متجر UNIX الحقيقي متضاف في قائمة المتاجر المخصصة.
- [ ] بعد الموافقة: رابط التثبيت (`s.salla.sa/marketplace/themes/direct/705562203`) يتفتح من لوحة متجر UNIX، و`docs/LAUNCH.md` §2.
