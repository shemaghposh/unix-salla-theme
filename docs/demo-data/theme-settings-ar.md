# إعدادات الثيم في سلة («تخصيص الثيم»)

المكان: لوحة سلة ← **المتجر الإلكتروني / التصميم ← الثيمات ← ثيم يونكس ← تخصيص**. فيه جزأين:
- **إعدادات الثيم** (عامة لكل الصفحات): القسم ١ تحت.
- **الصفحة الرئيسية** (عناصر بتتضاف وتترتب): القسم ٢ تحت.

قواعد:
- الحقل اللي مكتوب قدامه «سيبيه فاضي» معناه إن الثيم عنده نص unix.sa الافتراضي بالعربي والإنجليزي. **ماتكتبيش فيه حاجة.**
- الحقول المتعددة اللغات ليها خانة عربي وخانة إنجليزي. لو مكتوب «EN» تحت، اكتبيه في خانة الإنجليزي.
- اختيار التصنيف أو المنتج بيبقى من قائمة سلة (بحث بالاسم). التصنيفات والمنتجات لازم تكون اتعملت الأول.
- بعد كل قسم: **حفظ**.

---

## ١) إعدادات الثيم العامة (بالـ id بتاع `twilight.json`)

### شريط الإعلانات
| الإعداد (id) | القيمة |
|---|---|
| إظهار شريط الإعلانات (`unix_announcement_enabled`) | مفعّل |
| الرسالة الأولى (`unix_announcement_1_text`) | وصلت مجموعتنا الجديدة: Sailor وHalo Back وSoft Angle · EN: Our new collection is here: Sailor, Halo Back and Soft Angle |
| رابط الرسالة الأولى (`unix_announcement_1_link`) | تصنيف ← «وصل حديثًا» |
| الرسالة الثانية (`unix_announcement_2_text`) | **سيبيه فاضي** (الثيم بيكتب «شحن مجاني داخل السعودية للطلبات فوق 500 ر.س» من الحد اللي تحت) |
| رابط الرسالة الثانية (`unix_announcement_2_link`) | فاضي |
| حد الشحن المجاني (`unix_free_shipping_threshold`) | 500 |

### أعلى الصفحة
| الإعداد | القيمة |
|---|---|
| تثبيت الهيدر (`header_is_sticky`) | مفعّل |
| هيدر شفاف فوق صورة الرئيسية (`unix_header_transparent_home`) | مفعّل |
| لوجو فاتح للهيدر الشفاف (`unix_header_logo_inverse`) | فاضي (مافيش ملف لوجو فاتح في unix.sa؛ لو صاحبة المتجر عندها نسخة بيضا PNG/SVG ترفعها) |
| قائمة «المزيد» (`enable_more_menu`) | مفعّل |
| زر AR / EN (`unix_header_show_lang`) | مفعّل |
| زر البحث (`unix_header_show_search`) | مفعّل |
| زر الحساب (`unix_header_show_account`) | مفعّل |
| الخط قبل السلة (`unix_header_show_divider`) | مفعّل |
| زر العملة (`unix_header_show_currency`) | **معطّل** (unix.sa مافيهوش عملة) |
| شعار وأيقونات فاتحة فوق الهيرو (`unix_header_overlay_light`) | معطّل (زي unix.sa). فعّليه بس لو فيديو الهيرو غامق والأيقونات مش باينة |

### الفوتر وشريط الثقة (من فوتر unix.sa)
| الإعداد | القيمة |
|---|---|
| عنوان النشرة البريدية (`unix_footer_newsletter_title`) | لا يفوتكِ جديدنا · EN: Don't miss what's new |
| عنوان القائمة الأولى (`unix_footer_menu1_title`) | سياسات · EN: Policies (اللينكات نفسها من **قائمة الفوتر** في لوحة سلة: سياسة الخصوصية، سياسة الاسترداد، سياسة الشحن، شروط الخدمة) |
| عنوان القائمة الثانية (`unix_footer_menu2_title`) | القائمة · EN: Menu |
| روابط القائمة الثانية (`unix_footer_menu2_links`) | سطر لكل لينك «النص \| الرابط»، زي «القائمة» في فوتر unix.sa. العربي:<br>`طلب الإرجاع أو الاستبدال \| /<رابط صفحة الإرجاع>`<br>`بطاقة هدية \| /<رابط منتج بطاقة الهدية>`<br>`تواصلي معنا \| /contact`<br>`من نحن \| /<رابط صفحة من نحن>`<br>`المدونات \| /blog`<br>`الأسئلة الشائعة \| /<رابط صفحة الأسئلة>`<br>الإنجليزي: نفس الروابط بالنصوص Return or exchange · Gift card · Contact us · About us · Blog · FAQ. **الروابط اللي بين `< >` تتبدّل** بروابط صفحات المتجر الحقيقية (مسار يبدأ بـ `/`، أو رابط https كامل). |
| رقم الهاتف (`unix_contact_phone`) | +966573616566 (مكتوب افتراضيًا، اتأكدي بس) |
| رقم واتساب (`unix_contact_whatsapp`) | 966573616566 |
| إنستجرام (`unix_social_instagram`) | https://www.instagram.com/unix_theclub |
| تيك توك (`unix_social_tiktok`) | https://www.tiktok.com/@unix_theclub |
| رقم السجل التجاري (`unix_cr_number`) | 1009084709 |
| شعار المركز السعودي للأعمال (`unix_cr_badge`) | فاضي (مش موجود كملف في unix.sa) |
| رقم العلامة التجارية (`unix_tm_number`) | TM-01-00-14674-25 |

وفي **إعدادات المتجر نفسه** (مش الثيم): البريد `info@unix.sa`، وروابط السوشيال نفسها.

### صفحة المنتج
| الإعداد | القيمة |
|---|---|
| مسار التنقل (`product_show_breadcrumbs`، `product_index_show_breadcrumbs`) | مفعّل |
| إشعار الإضافة للسلة (`enable_add_product_toast`) | مفعّل |
| زر «أعلميني عند التوفر» في الكارت (`notify_when_available_in_card`) | مفعّل (عشان المنتج النافد) |
| تثبيت زر الإضافة على الجوال (`sticky_add_to_cart`) | مفعّل |
| طريقة عرض الصور (`slider_background_size`) | Contain |
| ألوان الموديل (`unix_colour_links_enabled`) | مفعّل |
| روابط ألوان الموديلات (`unix_colour_links`) | **البلوك اللي تحت** (بعد ما المنتجات يبقى ليها روابط) |
| أداة «اعرفي مقاسك» (`unix_size_finder_enabled`) | مفعّل |
| بيانات أداة المقاس (`unix_size_finder_data`) | **سيبيه فاضي** (بيستخدم جداول unix.sa) |
| أزرار دليل المقاسات (`unix_size_charts_enabled`) | مفعّل |
| «متى يصلك طلبك؟» (`unix_delivery_enabled`) | مفعّل، وكل حقول `unix_delivery_*` **فاضية** (نصوص unix.sa) |
| عنوان التقييمات (`unix_reviews_title`) | فاضي |
| «أكملي الإطلالة» (`unix_complete_look_enabled`) | مفعّل |
| عنوان «أكملي الإطلالة» (`unix_complete_look_title`) | فاضي |
| قطع «أكملي الإطلالة» (`unix_complete_look_data`) | **الـ JSON اللي تحت** بعد استبدال الأرقام |
| «قد يعجبكِ أيضًا» (`unix_recommendations_enabled`) | مفعّل، والعنوان والزر والرابط فاضيين |

### التصنيفات والسيو والصفحات
| الإعداد | القيمة |
|---|---|
| `unix_collection_show_description` / `unix_collection_show_image` / `unix_collection_highlight_filter` | سيبيهم على الافتراضي |
| `unix_seo_*` | سيبيهم على الافتراضي |
| `unix_page_comments` | الافتراضي |

### السلة
| الإعداد | القيمة |
|---|---|
| ملاحظة الكاش باك (`unix_cashback_enabled`) | مفعّل |
| نسبة الكاش باك (`unix_cashback_percent`) | 10 |
| مدة صلاحية الرصيد (`unix_cashback_validity`) | فاضي («صالح ٦ أشهر») |
| السلة الجانبية (`unix_cart_drawer_enabled`) | مفعّل |
| شريط الشحن المجاني (`unix_cart_free_shipping`) | مفعّل |
| عنوان/نص السلة الفارغة | فاضيين |
| «اختيارات تناسبك» (`unix_cart_picks_enabled`) | مفعّل |
| منتجات «اختيارات تناسبك» (`unix_cart_picks_products`) | طقم Sculpting فانيليا، توب Sculpting تشوكلت، قميص Comfy أزرق سماوي، زجاجة مياه اليومية |
| نص/رابط زر «اختيارات تناسبك» | فاضيين |
| `unix_account_orders_empty_*` | فاضيين |

---

## ٢) الصفحة الرئيسية (العناصر بالترتيب ده بالظبط)

احذفي أو أخفي أي عناصر رائد الافتراضية اللي في الرئيسية (**إخفاء/حذف من الصفحة الرئيسية بس، مش حذف بيانات من المتجر**)، وضيفي عناصر يونكس بالترتيب:

1. يونكس: الواجهة الرئيسية (Hero) — `home.unix-hero`
2. يونكس: شريط العرض — `home.unix-offer-strip`
3. يونكس · منتجات بتبويبات (المفضلة دائما) — `home.unix-products-tabs`
4. يونكس · تصنيف فوق صورة (جديد من يونكس) — `home.unix-collection-overlay`
5. يونكس · بطاقات التصنيفات (حركة. رياضة. استرخاء.) — `home.unix-collections-grid`
6. يونكس · منتجات مختارة مع صور — `home.unix-featured-products`
7. يونكس: فيديوهين جنب بعض — `home.unix-video-tiles`
8. يونكس · من عالم UNIX (المدونة) — `home.unix-blog`
9. يونكس: الأسئلة الشائعة — `home.unix-faq`

### 1) Hero (`home.unix-hero`)
| الحقل (id) | القيمة |
|---|---|
| عنوان صغير (`eyebrow`) | فاضي (UNIX NEW COLLECTION) |
| العنوان الرئيسي (`title`) | فاضي (تحركي بثقة.) |
| نص قصير (`text`) | فاضي (ملابس رياضية وبيجامات صُممت لكل لحظة في يومك) |
| نص الزر (`cta_label`) | فاضي (اكتشفي المجموعة) |
| رابط الزر (`cta_link`) | **تصنيف ← وصل حديثًا** (من غيره الزرار مايظهرش) |
| زر بإطار (`cta_ghost`) | مقفول |
| صورة الشاشات الكبيرة (`image_desktop`) | نزّلي وارفعي: https://cdn.shopify.com/s/files/1/0710/2791/6967/files/i-1.jpg?v=1782044761 |
| صورة الجوال (`image_mobile`) | نزّلي وارفعي: https://cdn.shopify.com/s/files/1/0710/2791/6967/files/hf_20260712_211438_a282bcf3-f526-4e4f-85ee-94a465bb9f3b.webp?v=1783960220 |
| وصف الصورة (`image_alt`) | عارضة ترتدي ملابس يونكس الرياضية · EN: Model wearing UNIX activewear |
| فيديو الشاشات الكبيرة (`video_desktop`) | https://cdn.shopify.com/videos/c/vp/327651061bef4077a04810b439dd3a7b/327651061bef4077a04810b439dd3a7b.HD-720p-4.5Mbps-90128668.mp4 |
| فيديو الجوال (`video_mobile`) | https://cdn.shopify.com/videos/c/vp/385f274da99448e7a5e48f9c061fbd4a/385f274da99448e7a5e48f9c061fbd4a.HD-720p-1.6Mbps-90263161.mp4 |
| ملء الشاشة (`full_height`) | مقفول |
| هيدر شفاف (`header_overlay`) | مفعّل |
| سهم للأسفل (`show_scroll_indicator`) | مفعّل |

> روابط الفيديو دي ملفات unix.sa على شوبيفاي (`Unix.mp4` و `Unix (1).mp4`). بتشتغل كرابط مباشر للمعاينة. فيديو الشاشات الكبيرة **عمودي** (606×1080) مش 16:9، وحجمه في 720p حوالي 8MB (أكبر من الـ 6MB المقترحة)؛ لو بطيء استخدمي نسخة 480p: https://cdn.shopify.com/videos/c/vp/327651061bef4077a04810b439dd3a7b/327651061bef4077a04810b439dd3a7b.SD-480p-1.5Mbps-90128668.mp4

### 2) شريط العرض (`home.unix-offer-strip`)
| الحقل | القيمة |
|---|---|
| إظهار الشريط (`enabled`) | مفعّل |
| كل النصوص والرابط | **فاضية** |

> عرض «قطعتين أو أكثر بخصم 20%» اتوقف في unix.sa يوم 31 أكتوبر 2026، فالشريط مش ظاهر هناك. من غير عنوان مش هيظهر هنا كمان (ده المطلوب). لو عايزة تعايني شكله بس: العنوان «قطعتين أو أكثر بخصم 20%»، والرابط تصنيف «ملابس رياضية»، وامسحيه بعد المعاينة.

### 3) المفضلة دائما (`home.unix-products-tabs`)
| الحقل | القيمة |
|---|---|
| العنوان (`title`) | المفضلة دائما · EN: Always favourites |
| إظهار الزر (`show_button`) | مفعّل |
| نص الزر الاحتياطي (`button_label`) | تصفحي الجميع · EN: Browse all |
| رابط الزر الاحتياطي (`button_url`) | تصنيف ← كل المنتجات |

التبويبات (`tabs`)، 5 بالترتيب:

| # | اسم التبويب (`tabs.label`) | التصنيف (`tabs.category`) | منتجات مختارة (`tabs.products`) | العدد (`tabs.limit`) | نص الزر | رابط الزر |
|---|---|---|---|---|---|---|
| 1 | وصل حديثًا · EN: New in | وصل حديثًا | — | 8 | تسوّقي الجديد · EN: Shop new in | فاضي (رابط التصنيف) |
| 2 | الأكثر مبيعا · EN: Best sellers | **فاضي** | طقم Sculpting فانيليا، ليقنز Sculpting فانيلا، توب Sculpting تشوكلت، قميص Comfy أزرق سماوي، طقم بنطلون Comfy أزرق سماوي، ليقنز Sculpting تشوكلت | 6 | فاضي | فاضي |
| 3 | توبات كومفي · EN: Comfy tops | توبات كومفي | — | 4 | فاضي | فاضي |
| 4 | اطقم كومفي · EN: Comfy sets | أطقم كومفي | — | 4 | فاضي | فاضي |
| 5 | ليقينز رياضية · EN: Leggings | ليقينز رياضية | — | 4 | فاضي | فاضي |

> في unix.sa تبويب «الأكثر مبيعا» فيه منتجات مش ضمن المعاينة (comfy-boyfriend-shirt-sky-blue, soft-pyjama-set, waist-tone-pants-off-white, core-control-bra-top-black, curve-enhance-set-toffee)، فاخترنا بدالهم من الـ 12.

### 4) جديد من يونكس (`home.unix-collection-overlay`)
| الحقل | القيمة |
|---|---|
| العنوان الصغير (`subtitle`) | فاضي (NEW COLLECTION) |
| العنوان (`title`) | فاضي (جديد من يونكس) |
| التصنيف (`category`) | وصل حديثًا |
| عدد المنتجات (`limit`) | 8 |
| صورة الخلفية للشاشات الكبيرة (`image`) | فاضي (بياخد صورة تصنيف «وصل حديثًا»، اللي اترفعت مع التصنيف) |
| صورة الجوال (`image_mobile`) | فاضي |
| درجة التعتيم (`overlay`) | 30 |

> صورة التصنيف في unix.sa: https://cdn.shopify.com/s/files/1/0710/2791/6967/collections/website-interface-01.webp?v=1785343360 (1200×1500 طولية). لو سلة طلبت صورة للتصنيف، دي هي.

### 5) حركة. رياضة. استرخاء. (`home.unix-collections-grid`)
| الحقل | القيمة |
|---|---|
| العنوان (`title`) | فاضي (حركة. رياضة. استرخاء.) |
| الوصف (`text`) | مجموعة صُممت بعناية لتكون جميلة و عملية في الوقت ذاته، لتأخذك من تمارينك الصباحية إلى استرخائك المسائي |
| نص الزر (`button_label`) | فاضي (تسوقي الآن) |
| رابط الزر (`button_url`) | تصنيف ← كل المنتجات (في unix.sa بيفتح صفحة كل التصنيفات؛ سلة مافيهاش صفحة زيها في القائمة) |

البطاقات (`cards`)، 3:

| # | اسم التصنيف (`cards.title`) | الصورة (`cards.image`) — نزّلي وارفعي | الرابط (`cards.url`) | التعتيم |
|---|---|---|---|---|
| 1 | فاضي (أطقم رياضية) | https://cdn.shopify.com/s/files/1/0710/2791/6967/files/Product2_d8c6124a-3892-4c7e-9f31-f030e8e8e509.webp?v=1774830146 | تصنيف ← أطقم رياضية | 10 |
| 2 | فاضي (أطقم كومفي) | https://cdn.shopify.com/s/files/1/0710/2791/6967/files/Comfy_Collection.webp?v=1782945894 | تصنيف ← أطقم كومفي | 20 |
| 3 | فاضي (إكسسوارات) | https://cdn.shopify.com/s/files/1/0710/2791/6967/files/Accessories_Collection.webp?v=1782946082 | تصنيف ← إكسسوارات | 20 |

### 6) منتجات مختارة مع صور (`home.unix-featured-products`)
| الحقل | القيمة |
|---|---|
| العنوان (`title`) | اختاري قطعتك المفضلة لوقت الاسترخاء · EN: Pick your favourite piece to unwind |

العناصر (`items`)، 4:

| # | المنتج (`items.product`) | صورة لايف ستايل (`items.image`) — نزّلي وارفعي |
|---|---|---|
| 1 | طقم بنطلون Comfy \| أزرق سماوي | https://cdn.shopify.com/s/files/1/0710/2791/6967/files/Unix22384-2.webp?v=1770810280 |
| 2 | طقم Sculpting \| فانيليا | https://cdn.shopify.com/s/files/1/0710/2791/6967/files/sculpting-set-vanilla-04.jpg?v=1787600643 |
| 3 | قميص Comfy \| أزرق سماوي | https://cdn.shopify.com/s/files/1/0710/2791/6967/files/comfy-lounge-shirt-sky-blue-1764369749517.webp?v=1764369753 |
| 4 | بنطلون Comfy \| أزرق سماوي | https://cdn.shopify.com/s/files/1/0710/2791/6967/files/Unix22402.webp?v=1770810280 |

> في unix.sa المنتجات هنا هي pearla-lounge-set-pants-pearl و curve-enhance-set-whip-pink و waist-tone-hoodie-off-white و bamboo-3-pieces-set-cold-blue بصورهم (website-interface-02/04/03 و IMG_8005). مش ضمن المعاينة، فحطينا منتجات المعاينة بصور لايف ستايل من جاليريهم.

### 7) فيديوهين جنب بعض (`home.unix-video-tiles`)
| # | رابط الفيديو (`tiles.video`) | صورة الغلاف (`tiles.poster`) — نزّلي وارفعي | نص (`tiles.caption`) | الرابط (`tiles.link`) | اسم الرابط |
|---|---|---|---|---|---|
| 1 | https://cdn.shopify.com/videos/c/vp/364de4a30bf946f291ccdfbda7fe05c9/364de4a30bf946f291ccdfbda7fe05c9.HD-720p-1.6Mbps-90511977.mp4 | https://cdn.shopify.com/s/files/1/0710/2791/6967/files/preview_images/364de4a30bf946f291ccdfbda7fe05c9.thumbnail.0000000000.jpg?v=1785591407 | فاضي | تصنيف ← كل المنتجات | فاضي |
| 2 | https://cdn.shopify.com/videos/c/vp/0e0b1cadcf524ede8d80b2f7d4a14231/0e0b1cadcf524ede8d80b2f7d4a14231.HD-720p-1.6Mbps-90512069.mp4 | https://cdn.shopify.com/s/files/1/0710/2791/6967/files/preview_images/0e0b1cadcf524ede8d80b2f7d4a14231.thumbnail.0000000000.jpg?v=1785591519 | فاضي | فاضي | فاضي |

اسم القسم لقارئ الشاشة (`label`): فاضي.
> الفيديوهين 9:16 تقريبًا (400×720)، مش 3:4؛ الثيم بيقصّهم. حجم كل واحد حوالي 1.5–2.5MB.

### 8) من عالم UNIX (`home.unix-blog`)
| الحقل | القيمة |
|---|---|
| العنوان (`title`) | فاضي (من عالم UNIX) |
| المقالات (`articles`) | المقالتين اللي اتعملوا: «دليل يونكس — أفضل ليقنز للحركة اليومية»، بعده «كيف تعتنين بالليقنز ليبقى كأنه جديد؟» |
| عدد المقالات (`post_limit`) | 7 |
| عدد المقالات للجوال (`post_limit_mobile`) | 3 |
| صورة المقالة (`show_image`) | مقفول (زي unix.sa) |
| زر «تصفّحي المقالات» (`show_button`) | مفعّل، والنص والرابط فاضيين |

### 9) الأسئلة الشائعة (`home.unix-faq`)
| الحقل | القيمة |
|---|---|
| العنوان / النص | فاضيين («إجابات لكل تفصيلة» / «جمعنا لكِ أكثر الأسئلة تكرارًا، لتتسوّقي بثقة وراحة») |
| الأسئلة (`items`) | **فاضية**: الثيم بيعرض أسئلة unix.sa السبعة بالعربي والإنجليزي |
| «عرض المزيد» (`show_more`) | مفعّل |
| بيانات FAQPage (`schema`) | مفعّل |

> ملحوظة: إجابة سؤال الشحن المجاني في unix.sa بتقول «فوق 600 ر.س»، والشريط وقاعدة الشحن بيقولوا 500. الاختلاف ده موجود في unix.sa نفسه؛ بلّغي صاحبة المتجر بس ماتغيّريش حاجة.

---

## ٣) روابط ألوان الموديلات (`unix_colour_links`)

بعد إنشاء المنتجات: استبدلي كل `URL_PLACEHOLDER__<handle>` بالرابط الكامل للمنتج ده من سلة (بيبدأ بـ `https://` وينتهي بـ `p` + رقم المنتج). سطر لكل منتج، والفاصل `|`.

الشكل: `اسم الموديل | رابط المنتج | اسم اللون | #hex | رابط صورة القماش`. الخانة الخامسة اختيارية (6.4، D133): لو حطيتي رابط صورة قماش بيبدأ بـ `https://` بتظهر الصورة جوه الدايرة فوق لون الـ hex (زي unix.sa)، ولو صورة من غير hex سيبي خانة الـ hex فاضية (`… | فانيلا | | https://…`) أو حطي الصورة مكان الـ hex في سطر بأربع خانات (`… | فانيلا | https://…`). السطور اللي تحت بأربع خانات شغالة زي ما هي (دايرة بلون الـ hex).

**خانة العربي:**
```text
sculpting-leggings | URL_PLACEHOLDER__sculpting-leggings-vanilla | فانيلا | #cab8ac
sculpting-leggings | URL_PLACEHOLDER__sculpting-leggings-chocolate | بني شوكولاتة | #361a16
sculpting-bra-top | URL_PLACEHOLDER__sculpting-bra-top-vanilla | فانيلا | #cab8ac
sculpting-bra-top | URL_PLACEHOLDER__sculpting-bra-top-chocolate | بني شوكولاتة | #361a16
sculpting-set | URL_PLACEHOLDER__sculpting-set-vanilla | فانيلا | #cab8ac
sculpting-set | URL_PLACEHOLDER__sculpting-set-chocolate | بني شوكولاتة | #361a16
comfy-lounge-shirt | URL_PLACEHOLDER__comfy-lounge-shirt-sky-blue | أزرق سماوي | #aab3d1
comfy-lounge-shirt | URL_PLACEHOLDER__comfy-lounge-shirt-whip-pink | وردي كريمي | #FFC0CB
comfy-lounge-pants | URL_PLACEHOLDER__comfy-lounge-pants-sky-blue | أزرق سماوي | #aab3d1
comfy-lounge-pants | URL_PLACEHOLDER__comfy-lounge-pants-whip-pink | وردي كريمي | #FFC0CB
```

**خانة الإنجليزي** (نفس الروابط؛ لو سلة بتدي رابط إنجليزي مختلف بـ `/en/` استخدميه):
```text
sculpting-leggings | URL_PLACEHOLDER__sculpting-leggings-vanilla | Vanilla | #cab8ac
sculpting-leggings | URL_PLACEHOLDER__sculpting-leggings-chocolate | Chocolate | #361a16
sculpting-bra-top | URL_PLACEHOLDER__sculpting-bra-top-vanilla | Vanilla | #cab8ac
sculpting-bra-top | URL_PLACEHOLDER__sculpting-bra-top-chocolate | Chocolate | #361a16
sculpting-set | URL_PLACEHOLDER__sculpting-set-vanilla | Vanilla | #cab8ac
sculpting-set | URL_PLACEHOLDER__sculpting-set-chocolate | Chocolate | #361a16
comfy-lounge-shirt | URL_PLACEHOLDER__comfy-lounge-shirt-sky-blue | Sky Blue | #aab3d1
comfy-lounge-shirt | URL_PLACEHOLDER__comfy-lounge-shirt-whip-pink | Whip Pink | #FFC0CB
comfy-lounge-pants | URL_PLACEHOLDER__comfy-lounge-pants-sky-blue | Sky Blue | #aab3d1
comfy-lounge-pants | URL_PLACEHOLDER__comfy-lounge-pants-whip-pink | Whip Pink | #FFC0CB
```

مصدر الألوان: الـ hex كلها من metaobjects الألوان في شوبيفاي (`shopify--color-pattern`)، مش تقريبية. استثناء: «وردي كريمي» `#FFC0CB` شكله لون «pink» عام مش مقاس من القماش؛ لو بان غريب جنب الصورة بلّغي صاحبة المتجر.

مثال سطر بعد الاستبدال:
`sculpting-leggings | https://demo-store.salla.sa/sculpting-leggings-vanilla/p123456789 | فانيلا | #cab8ac`

---

## ٤) قطع «أكملي الإطلالة» (`unix_complete_look_data`)

استبدلي كل `ID_<handle>` برقم المنتج ده في سلة (الرقم بعد `p` في آخر رابطه). **الأرقام جوه القوسين `[ ]` من غير علامات تنصيص، ورقم المنتج اللي قبل `:` بين علامتي تنصيص.**

```json
{
  "ID_sculpting-leggings-vanilla": [ID_sculpting-bra-top-vanilla, ID_sculpting-set-vanilla],
  "ID_sculpting-leggings-chocolate": [ID_sculpting-bra-top-chocolate, ID_sculpting-set-chocolate],
  "ID_sculpting-bra-top-vanilla": [ID_sculpting-leggings-vanilla, ID_sculpting-set-vanilla],
  "ID_sculpting-bra-top-chocolate": [ID_sculpting-leggings-chocolate, ID_sculpting-set-chocolate],
  "ID_sculpting-set-vanilla": [ID_sculpting-bra-top-vanilla, ID_sculpting-leggings-vanilla],
  "ID_sculpting-set-chocolate": [ID_sculpting-bra-top-chocolate, ID_sculpting-leggings-chocolate],
  "ID_comfy-lounge-shirt-sky-blue": [ID_comfy-lounge-pants-sky-blue, ID_comfy-pants-lounge-set-sky-blue],
  "ID_comfy-lounge-shirt-whip-pink": [ID_comfy-lounge-pants-whip-pink],
  "ID_comfy-lounge-pants-sky-blue": [ID_comfy-lounge-shirt-sky-blue, ID_comfy-pants-lounge-set-sky-blue],
  "ID_comfy-lounge-pants-whip-pink": [ID_comfy-lounge-shirt-whip-pink],
  "ID_comfy-pants-lounge-set-sky-blue": [ID_comfy-lounge-shirt-sky-blue, ID_comfy-lounge-pants-sky-blue]
}
```

مثال بعد الاستبدال: `{"123456789": [987654321, 555555555]}`.
المصدر: `custom.complements` في unix.sa لكل منتج. الزجاجة مالهاش قطع مكمّلة (فالقسم مش هيظهر عندها، وده صح).
