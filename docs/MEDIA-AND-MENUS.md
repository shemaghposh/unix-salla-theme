# UNIX: Media & Menus (from Shopify, 2026-11-01)

The original files hosted on Shopify's CDN. On Salla, these get uploaded from the theme's dashboard: each component's image and video fields, and the store's menus.
**The links work as long as the Shopify store is open.** Download the files before you close it.

---

## 1. Brand

| What | Size | Link |
|---|---|---|
| Logo (header and footer) | 512×176 PNG | https://cdn.shopify.com/s/files/1/0710/2791/6967/files/rArOZG772n6jswJQnKO8gU6afFM.png?v=1755087123 |
| Favicon | 32×32 PNG | https://cdn.shopify.com/s/files/1/0710/2791/6967/files/Favicon_b253d7fe-2eef-41e2-9d38-ae9fa1a8a510.png?v=1768915918 |

> In Shopify the logo is shown at a width of 130px on desktop and 70px on mobile.

---

## 2. Homepage (in `templates/index.json` order; see SPEC §4)

### 2.1 Hero (SPEC §4.1 → ROADMAP 2.1)
The hero has a video, with an image as the fallback/poster.

| What | Size | Link |
|---|---|---|
| Desktop video `Unix.mp4` | 606×1080 (portrait) | 1080p: https://cdn.shopify.com/videos/c/vp/327651061bef4077a04810b439dd3a7b/327651061bef4077a04810b439dd3a7b.HD-1080p-7.2Mbps-90128668.mp4 · 720p: https://cdn.shopify.com/videos/c/vp/327651061bef4077a04810b439dd3a7b/327651061bef4077a04810b439dd3a7b.HD-720p-4.5Mbps-90128668.mp4 |
| Mobile video `Unix (1).mp4` | 606×1080 | 1080p: https://cdn.shopify.com/videos/c/vp/385f274da99448e7a5e48f9c061fbd4a/385f274da99448e7a5e48f9c061fbd4a.HD-1080p-2.5Mbps-90263161.mp4 · 720p: https://cdn.shopify.com/videos/c/vp/385f274da99448e7a5e48f9c061fbd4a/385f274da99448e7a5e48f9c061fbd4a.HD-720p-1.6Mbps-90263161.mp4 |
| Desktop image `i-1.jpg` | 1376×1000 | https://cdn.shopify.com/s/files/1/0710/2791/6967/files/i-1.jpg?v=1782044761 |
| Mobile image | 1532×2442 | https://cdn.shopify.com/s/files/1/0710/2791/6967/files/hf_20260712_211438_a282bcf3-f526-4e4f-85ee-94a465bb9f3b.webp?v=1783960220 |

⚠️ **The desktop video is portrait (9:16) even though the hero is wide.** In Shopify it gets cropped with cover. For Salla we'd better get a **landscape 16:9 video** for desktop (decision D5).

### 2.2 «حركة. رياضة. استرخاء.» collection images (SPEC §4.5)
| Collection | Size | Link |
|---|---|---|
| Sport | 1000×1500 | https://cdn.shopify.com/s/files/1/0710/2791/6967/files/Product2_d8c6124a-3892-4c7e-9f31-f030e8e8e509.webp?v=1774830146 |
| Comfy | 1000×1397 | https://cdn.shopify.com/s/files/1/0710/2791/6967/files/Comfy_Collection.webp?v=1782945894 |
| Accessories | 953×1291 | https://cdn.shopify.com/s/files/1/0710/2791/6967/files/Accessories_Collection.webp?v=1782946082 |

### 2.3 «جديد من يونكس» (SPEC §4.4)
| What | Size | Link |
|---|---|---|
| Unix_New | 972×1415 | https://cdn.shopify.com/s/files/1/0710/2791/6967/files/Unix_New.webp?v=1782773667 |

### 2.4 Featured products / lifestyle slides (SPEC §4.7)
| What | Size | Link |
|---|---|---|
| website-interface-02 | 1002×1500 | https://cdn.shopify.com/s/files/1/0710/2791/6967/files/website-interface-02.webp?v=1785341500 |
| IMG_8005 (also used as the mega-menu promo image) | 1000×1339 | https://cdn.shopify.com/s/files/1/0710/2791/6967/files/IMG_8005.webp?v=1781781806 |
| website-interface-04 | 1000×1500 | https://cdn.shopify.com/s/files/1/0710/2791/6967/files/website-interface-04.webp?v=1785341501 |
| website-interface-03 | 999×1500 | https://cdn.shopify.com/s/files/1/0710/2791/6967/files/website-interface-03.webp?v=1785341500 |

### 2.5 Two video tiles (SPEC §4.8)
| What | Size | Link |
|---|---|---|
| Video 1 (16.35.30) | 400×720 | 720p: https://cdn.shopify.com/videos/c/vp/364de4a30bf946f291ccdfbda7fe05c9/364de4a30bf946f291ccdfbda7fe05c9.HD-720p-1.6Mbps-90511977.mp4 |
| Video 2 (16.37.58) | 404×720 | 720p: https://cdn.shopify.com/videos/c/vp/0e0b1cadcf524ede8d80b2f7d4a14231/0e0b1cadcf524ede8d80b2f7d4a14231.HD-720p-1.6Mbps-90512069.mp4 |

⚠️ These videos were exported from WhatsApp, so the quality is low (720p at most). If the originals are around, use them.

---

## 3. Menus

### 3.1 Main menu (`main-menu`, «القائمة»)
| # | Item | Shopify link | Type | On Salla |
|---|---|---|---|---|
| 1 | الرئيسية | `/` | Home | Home |
| 2 | وصل حديثًا | `/collections/new-collection` | Collection | Category «وصل حديثًا» |
| 3 | ملابس رياضية | `/collections/sport` | Collection | Parent category ↓ |
| 3.1 | توبات رياضية | `/collections/tops` | | Sub-category |
| 3.2 | ليقنز رياضية | `/collections/legging` | | Sub-category |
| 3.3 | أطقم رياضية | `/collections/set` | | Sub-category |
| 4 | بيجامات كومفي | `/collections/home-wear` | Collection | Parent category ↓ |
| 4.1 | توبات كومفي | `/collections/comfy-top` | | Sub-category |
| 4.2 | بناطيل كومفي | `/collections/comfy-bottom` | | Sub-category |
| 4.3 | أطقم كومفي | `/collections/comfy-set` | | Sub-category |
| 5 | إكسسوارات | `/collections/accessories` | Collection | Category |
| 6 | كل المنتجات | `/collections/all-products` | Collection | Products page |
| 7 | من نحن | `/pages/about` | Page | Page ⚠️ the content is the theme's demo text, rewrite it |
| 8 | المدونات | `/blogs/leggings-blog` | Blog | Salla blog |
| 9 | بطاقة هدية | `/products/unix-gift-card` | Product | Product or Salla's gift card feature |

> In Shopify, «الرئيسية», «من نحن», «المدونات» and «بطاقة هدية» are hidden from the desktop row and appear only in the mobile menu (SPEC §2).

### 3.2 Mobile menu (`menu-mobile`)
The main menu flattened to a single level, plus «تواصل معنا». On Salla it's the same menu, shown as an accordion on mobile (ROADMAP 1.3).

### 3.3 Footer: «روابط سريعة» (`footer-menu`)
| Item | Shopify link | On Salla |
|---|---|---|
| طلب الإرجاع أو الاستبدال | `/apps/yanet-return` (an app) | ⚠️ Salla's returns page, or a returns app (decision) |
| بطاقة هدية | `/products/unix-gift-card` | Product |
| تواصل معنا | `/pages/contact` | Contact page ⚠️ the content is demo text (a New York address) |
| من نحن | `/pages/about` | Page |
| المدونات | `/blogs/leggings-blog` | Blog |
| الأسئلة الشائعة | `/pages/faq` | Page |

### 3.4 Footer: «السياسات» (`footer`)
| Item | On Salla |
|---|---|
| سياسة الخصوصية | Salla's privacy policy page |
| سياسة الاسترداد | Salla's return policy page |
| سياسة الشحن | Page |
| شروط الخدمة | Salla's terms page |
| خيارات خصوصيتك | ❌ Shopify-specific (data-sharing opt-out). Drop it |

---

## 4. Collection handles → categories to create on Salla
`new-collection`, `sport` (› `tops`, `legging`, `set`), `home-wear` (› `comfy-top`, `comfy-bottom`, `comfy-set`), `accessories`, `all-products`, `best-sellers` (used as a link in the cart, article and 404 pages).
