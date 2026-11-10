# Redirect map draft (Shopify → Salla), 2026-11-10

File: `docs/seo/redirect-map-draft.csv` (459 rows). It feeds PLAN phase 3. `salla_target_url` is **empty on purpose**: we don't know the real Salla URLs yet and must not guess them (PLAYBOOK §1.1, §13 item 4).

## Answer
Every old URL now has a decided destination type and a target. The 6 Shopify chains are flattened. Eight old redirects that end on a 404 today are fixed. No URL goes to the home page except `/ar` (the old Arabic home). The launch blocker hasn't changed: nobody has confirmed whether Salla's custom links (روابط مخصصة) return a **301, a 302, or a 200 alias**. A two-row pilot (below) answers it.

## What's in the CSV

| Column | Meaning |
|---|---|
| `old_path` | Path exactly as a browser sends it. Arabic is percent-encoded. Rows from `shopify-existing-redirects.csv` keep Shopify's lower-case hex, and the decoded Arabic is in `notes`. |
| `type` | product / collection / page / blog / article / policy / other |
| `status` | `active`, `draft` (DRAFT or UNPUBLISHED), `unlisted`, `archived`, or **`deleted`**: the old path no longer exists in Shopify and is a source of a Shopify 301 today |
| `proposed_target_type` | product, category, page, blog-post, blog-index, home, wishlist, contact, search, cart, none-404 |
| `salla_target_url` | **Empty.** Filled after import from real Salla data (see the next section). |
| `notes` | Why this target, chain history, EN handling |
| `target_ref` | The object to resolve, e.g. `product:core-control-set-black`, `category:legging`, `page:returns`, `blog-post:best-leggings-everyday`. One lookup per distinct ref (114 refs cover 459 rows). |
| `target_lang` | `ar` or `en`. Every `/en/` source goes to the **English** Salla URL of the same object. |

Rows by source: 292 from `shopify-urls.csv` (146 AR + 146 EN) · 103 from `shopify-existing-redirects.csv` · 46 derived `/en/` variants of root redirects · 10 `/policies/*` (AR + EN) · 8 home and system paths.

## Key decisions
1. **Draft and never-public products go to the closest category, never home** (42 rows). Examples: Flexy/Flow bras → tops, Flow leggings → legging, Flexy pants and Air Flexy jackets → sport, the robe → home-wear, the 2-piece Bamboo sets → comfy-set. Google: "Don't redirect many old URLs to one irrelevant single URL destination, such as the home page … might be treated as a soft 404" [G-MOVE]. If Flexy or Air Flexy launches later, point those rows at the product.
2. **`-old` duplicates go to their live twin product** (10 rows), because a true one-to-one equivalent exists. Google allows many-to-one when content was merged [G-MOVE].
3. **The archived empty product (`untitled-jun21_00-21-47`) returns 404.** Don't add a custom link for it. Google: content you don't move should "return an HTTP 404 or 410" [G-MOVE].
4. **Chains are flattened (6).** Two `/ar/` paths and four product paths pointed at `-new` handles that redirect again. Each now points at the final object [G-MOVE: "redirecting to the final destination directly"].
5. **Dead targets are fixed (8).** Four point to `core-control-set-black-new`, which is a 404 on live unix.sa (curl, 2026-11-10); they now go to `core-control-set-black`. Four are **new**: they point to `comfy-relax-robe`, which is DRAFT and also a 404 today (two Arabic robe paths, the robe size-chart page, and `/en/products/comfy-white-relax-robe`). They now go to home-wear.
6. **Changes from Shopify's current targets:**
   - The old brand-intro article goes to the About page instead of home.
   - `/ar/pages/wishlist` goes to the Salla wishlist instead of home.
   - Old «سياسة-الدفع» goes to the payment-policy page instead of the refund policy.
   - Old «الملكية-الفكرية» goes to the intellectual-property page instead of contact.
7. **Change from PLAN:** the calculator app page (`calc-*`) goes to the size-guide article (or the FAQ page if that isn't published), not home. The reason is the same as point 1.
8. **The two published leggings articles are the same topic in two blogs.** Publish one merged post on Salla, and both old URLs (plus the EN copies) 301 to it.
9. **`/en/` variants of root redirects are included (46).** Shopify applies root redirects to `/en/` too: `/en/products/pant-grey` returns a 301 to `/en/products/waist-tone-pants-grey` (curl, 2026-11-10).
10. **`/policies/*` is added.** refund, privacy, terms, shipping and contact-information all return 200 on live unix.sa, in AR and EN. `legal-notice` is a 404, so it's skipped.
11. **One inconsistency is kept as is:** the AR source `/products/comfy-whip-pink-lounge-shorts` goes to the shorts **set**, while the EN source goes to the **shorts**. The client may align them.

## How to fill `salla_target_url` after import
1. **Make matching deterministic at import time.** Salla's product SEO has a custom-URL field [SALLA-SEO]. If Salla lets us set the product slug, use the Shopify handle (`sculpting-leggings-vanilla`). Then `target_ref` maps to the slug directly. If it doesn't, keep the Shopify handle in a field we can export (SKU prefix or a note), so we never match by name alone.
2. **Pull the real URLs.**
   - Products: run the dashboard product export, or the Merchant API product list, and take each product's storefront URL and ID. Which column or field carries the storefront URL is **unverified**; check the first export.
   - Categories, pages and posts: copy them from the dashboard, or open each one and copy the address bar, in AR and EN.
3. **Build the lookup table.** Make one table of `target_ref,lang → real URL` (114 refs × 2 languages). Fill `salla_target_url` with a lookup, then check by hand any ref that didn't resolve.
4. **Rules for the target URL:**
   - Use the final 200 URL only, never a URL that redirects again.
   - Use the same host as production (`https://unix.sa/...`, or a path, if the template accepts paths).
   - The `ar` and `en` targets must be different URLs.
5. **Export `redirects-final.csv`** (`from,to`) from the filled sheet, leaving out `none-404` rows and any row whose `old_path` equals its target, such as `/`.

## Custom URLs (روابط مخصصة) import flow
What is documented:
- **Dashboard** [SALLA-LINKS]: المتجر وقنوات البيع ← روابط مخصصة ← المزيد ← استيراد الروابط المخصصة ← تحميل النموذج. Fill in the template, upload it, then press تحديث البيانات.
- **Template columns, as the help article describes them:**
  - the custom link (the path)
  - the type
  - the item number or link
  
  The exact headers come only from the downloaded template, and "column names and order must match the latest template" (API 422).
- **Path rules** [SALLA-LINKS]:
  - Arabic or English letters, digits, `/` and `-`, with no spaces.
  - The template column also lists `. / _ - : * %` as allowed.
  - Encoded URLs are supported.
  - Every `old_path` in our CSV fits those rules.
- **API** [SALLA-API-IMPORT] [SALLA-API-EXPORT]:
  - `POST /exports/custom-urls` returns the `.xlsx` template. Scope: `exports.read_write`.
  - `POST /custom-urls/import` takes a multipart `file`. Scope: `store-settings.read_write`. It replies 201 «جاري إستيراد البيانات», which means it runs asynchronously.
  - Neither page states a row limit, the redirect status code, or rules for arbitrary paths.
- ⚠️ **"A product-type link requires available stock"** [SALLA-LINKS]. That could break redirects to sold-out products. In the pilot, test one sold-out product. If it fails, check whether the "link/URL" type with a full target URL avoids the stock rule.

Order of work:
1. Download the template.
2. Run the pilot (below).
3. Upload the full sheet.
4. Run the curl test on every row.
5. Only then switch DNS (PLAN phase 5).

## curl test plan (each row: exactly one 301 hop to a 200)
**Pilot (2 to 4 rows, before anything else):**
- `/products/soft-shirt` → product
- one encoded Arabic path, e.g. `/ar/pages/%d8%a7%d8%aa%d8%b5%d8%a7%d9%84` → contact
- one `/en/` row
- one sold-out product

Test them on the store's Salla domain first if custom links work there. That is **unverified**, so ask Salla.

```sh
# 1. First response only: status code and Location
curl -sS -o /dev/null -w '%{http_code} %{redirect_url}\n' 'https://unix.sa/products/soft-shirt'
# PASS = 301 (or 308) and the Location equals salla_target_url
# 302/307 = see the open question below
# 200 = Salla served an ALIAS (duplicate URL), not a redirect: do not launch on it

# 2. Follow the chain: count hops, final status must be 200
curl -sS -o /dev/null -L --max-redirs 5 -w '%{num_redirects} %{http_code} %{url_effective}\n' 'https://unix.sa/products/soft-shirt'
# PASS = "1 200 <salla_target_url>"
```

**Full run:** loop over the filled CSV and print `old_path, first code, Location, hops, final code`. Fail any row that isn't `301 · 1 hop · 200 · Location == salla_target_url`. Also test:
- the same Arabic path with **upper-case** hex (`%D8%A7…`, which browsers send) and **lower-case** hex (Shopify's form)
- a trailing slash
- a query string (`?variant=123`), which should still redirect
- `/` and `/en`, which should return 200 (or a single 301)

Re-run the loop on DNS day and on days 1, 7 and 30 (PLAYBOOK §1.2).

## Open question: 301 or 302 (or a 200 alias)
- **Google:** a permanent redirect (301/308) makes the target canonical and shows it in results. A temporary one (302/307) "Show[s] the source page in search results", and the target "might still be indexed if other canonicalization signals are present". For a move, use permanent redirects [G-301].
- **If Salla's custom links return 302:**
  1. Ask Salla support, in writing, for a 301 option.
  2. Otherwise, evaluate a redirect layer in front of Salla. A Cloudflare bulk-redirect rule list is one example. Whether that works with Salla's custom-domain setup is **unverified**.
  
  Launching on 302s isn't fatal for a site with 22 organic visits a month (audit baseline). Old URLs may linger in results longer, and the 24 linking domains pass weaker signals. Fix it soon after launch.
- **If they return 200 (an alias that "opens the chosen page", which is how the help article words it):** that isn't a redirect. Two URLs would serve the same page, and the backlinks wouldn't consolidate. Don't rely on it for the move. Use the same escalation path as for a 302.

## Data needed / unverified
- **Unverified:** the Salla URL pattern (`/ar/` prefix? slug control? `p<id>`?); the custom-link status code; whether arbitrary old paths and encoded paths match; the stock rule; any row limit; whether links work before DNS.
- **Data needed:**
  - A **Search Console Pages + Links export** (PLAYBOOK R1.6) to catch indexed URLs this map lacks, such as old `/ar/products/*` variants, `?variant=` URLs, images and `/collections/x/products/y`.
  - The final Salla category tree (the new hoodies, sports-bra and t-shirt categories don't change any row here; old collections map to their nearest equivalent).
- **Client decisions:**
  - Publish the two unpublished articles? (PLAN says yes. If not, their rows go to blog-index.)
  - Keep the two unlisted products?
  - Recreate the `new-collection`, `activewear-collection` and `all-products` listings?

## Playbook updates proposed
- **§9.1 "Custom links" row:** add the path rules, the "product link needs stock" note, the API endpoints and scopes (`exports.read_write` for the template, `store-settings.read_write` for the import), and "may be an alias (200), not a redirect: test".
- **§1.1:** add "a 200 alias is not a redirect" next to R1.1.

## Sources
- [G-MOVE] https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes (fetched 2026-11-10)
- [G-301] https://developers.google.com/search/docs/crawling-indexing/301-redirects (fetched 2026-11-10)
- [SALLA-LINKS] https://help.salla.sa/article/%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9-%D9%88%D8%A5%D9%86%D8%B4%D8%A7%D8%A1-%D8%A7%D9%84%D8%B1%D9%88%D8%A7%D8%A8%D8%B7-%D8%A7%D9%84%D9%85%D8%AE%D8%B5%D8%B5%D8%A9-%D9%88%D8%A7%D8%B3%D8%AA%D9%8A%D8%B1%D8%A7%D8%AF%D9%87%D8%A7/nxylsaq54xtwx71wmm1ophea (fetched 2026-11-10)
- [SALLA-API-IMPORT] https://docs.salla.dev/custom-urls/import.md (fetched 2026-11-10)
- [SALLA-API-EXPORT] https://docs.salla.dev/exports/custom-urls.md (fetched 2026-11-10)
- [SALLA-SEO] see PLAYBOOK §14
- Live status checks: `curl` against https://unix.sa on 2026-11-10 (policies, `/en/` redirect behaviour, dead `-new` and robe targets)
