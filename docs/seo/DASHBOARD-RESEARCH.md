# UNIX SEO command center: research (2026-11-09)

Scope: data sources, dashboard options, KPIs and a phased setup for unix.sa (AR first, /en/ second), moving from Shopify to Salla on the same domain. Baseline: about 22 organic visits a month, 73% branded, 7 ranking keywords.
This is kept separate from the theme code. Related repo docs: `docs/seo/PLAYBOOK.md`, `docs/migration/PLAN.md`, `docs/migration/shopify-urls.csv`.
Every claim has a URL. **UNVERIFIED** means the primary source did not state it. Prices are list prices taken from vendor pages on 2026-11-09 and can change.

---

## 1. Data sources

### 1.1 Google Search Console (GSC): the core source, free

**What it gives:** clicks, impressions, CTR and average position by query, page, country, device, search appearance, date and hour.
- **Retention:** 16 months ("Search Console keeps data for the last 16 months"). https://support.google.com/analytics/answer/10737381
  - Consequence: the Shopify-era history is lost unless we save it. **Export it before it rolls off.**
- **Delay:** usually 2 to 3 days. https://support.google.com/webmasters/answer/96568
  - Fresh data can be pulled with `dataState: "all"` or `"hourly_all"`. https://developers.google.com/webmaster-tools/v1/searchanalytics/query
- **UI limits:** tables and exports stop at 1,000 rows. https://support.google.com/webmasters/answer/96568 , https://developers.google.com/search/blog/2022/10/performance-data-deep-dive
- **Anonymized queries:** they are left out of the table and API rows, but still count in chart totals. https://developers.google.com/search/blog/2022/10/performance-data-deep-dive
  - This matters for UNIX. At about 22 visits a month, most long-tail queries will be hidden.
- **AI Overviews and AI Mode:** clicks and impressions from these are folded into the "Web" search type. They are not reported separately. https://developers.google.com/search/docs/appearance/ai-features
- **Built-in branded filter:** launched 2025-11-20 and expanded on 2026-03-11.
  - It needs a top-level (Domain) property and "a sufficient volume of queries and impressions". https://developers.google.com/search/blog/2025/11/search-console-branded-filter
  - It "isn't available for sites with a low number of impressions". https://support.google.com/webmasters/answer/17011259
  - **UNIX will probably not qualify yet**, so use our own regex (section 3.1).

**Search Console API (`searchanalytics.query`)** https://developers.google.com/webmaster-tools/v1/searchanalytics/query
- **Dimensions:** `country`, `device`, `page`, `query`, `searchAppearance`, `date`, `hour`.
- **Filter operators:** `equals`, `notEquals`, `contains`, `notContains`, `includingRegex`, `excludingRegex` (RE2 syntax). Expressions can be up to 4,096 characters. Filter groups support only `and`.
- **Search types:** `web`, `discover`, `googleNews`, `news`, `image`, `video`.
- **Rows:** `rowLimit` runs from 1 to 25,000 (default 1,000). Use `startRow` to page through results. "Does not guarantee all rows."
- **Daily cap:** 50,000 rows per site, per day, per search type. The Looker Studio connector has the same limit. https://developers.google.com/search/blog/2022/10/performance-data-deep-dive
- **Quotas:** https://developers.google.com/webmaster-tools/limits
  - 1,200 QPM per site and 1,200 QPM per user.
  - 30,000,000 QPD and 40,000 QPM per project.
  - Short-term load quota per 10-minute window and long-term load quota per day.
  - URL Inspection API: 2,000 QPD and 600 QPM per site.
- **Cost:** the limits page gives no API price. GSC itself is "a free service". https://docs.cloud.google.com/looker/docs/studio/connect-to-search-console
- **Note:** the `searchAppearance` FAQ value is being removed from the API in August 2026. https://developers.google.com/webmaster-tools/v1/searchanalytics/query

**Bulk data export to BigQuery** https://support.google.com/webmasters/answer/12917675
- **What it is:** a daily export of all performance data except anonymized queries. https://support.google.com/webmasters/answer/12918484
- **Needs:** a Google Cloud project with billing and the BigQuery API enabled.
  - Grant `search-console-data-export@system.gserviceaccount.com` the BigQuery Job User and BigQuery Data Editor roles.
  - Then set it up in GSC under Settings > Bulk data export.
- **No backfill:** it starts from setup. Older data has to come from the API or UI.
  - So turn it on early, during the Shopify phase.
- **Cost:** there is a free usage tier, and usage above it is billed. The page gives no figures.
  - Set a partition expiration, otherwise the data accumulates forever.
- **Verdict for UNIX:** optional. At this traffic level the API's 50k rows a day is far more than enough. BigQuery only adds value as a permanent archive past 16 months.

**Properties and permissions**
- **Domain property:** can only be verified by DNS (TXT or CNAME). https://support.google.com/webmasters/answer/9008080
  - This is the right choice for UNIX because it covers http/https, www, and /en/ through a host change. The branded filter also needs it.
- **Roles:** Owners (verified or delegated) can add users. Full users can view all data and submit sitemaps. Restricted users get read-only access to most data. https://support.google.com/webmasters/answer/7687615
- **Salla's "Google Site Verification" app:** verifies ownership through a Google sign-in and then lets you submit a sitemap. https://help.salla.sa/en/article/verify-site-ownership-through-google-site-verification/u6ds3ygtyhegdjzkfhe9m754
  - The article doesn't say which property type it creates (**UNVERIFIED**; likely URL-prefix).
  - DNS verification of a Domain property stays valid through the platform switch as long as the TXT record stays.
- **Page indexing report:** shows "Not found (404)" (only 404s seen in the past month), "Page with redirect" and "Crawled – currently not indexed". https://support.google.com/webmasters/answer/7440203
  - Example lists are capped at 1,000 rows. "Validate fix" takes up to about 2 weeks.

### 1.2 GA4: behaviour, conversions, revenue

- **Organic Search channel rule:** the source is on Google's search-site list, or the medium is exactly `organic`.
  - GA4 also has a separate **AI Assistant** channel (medium `ai-assistant`), filled when the referrer is on Google's list of AI assistants. This is a free proxy for AI-visibility traffic.
  - https://support.google.com/analytics/answer/9756891
- **Data API quotas (standard property):** https://developers.google.com/analytics/devguides/reporting/data/v1/quotas
  - 200,000 core tokens per property per day.
  - 40,000 per hour.
  - 10 concurrent requests.
  - The page does not state a price.
- **Linking GSC into GA4:** https://support.google.com/analytics/answer/10737381
  - Needs GA Editor plus verified GSC owner.
  - Adds the "Google Organic Search Queries" and "Google Organic Search Traffic" reports. They are unpublished by default and you publish them from the Library.
  - One web stream can link to one GSC property.
  - Links cannot be edited, only deleted and recreated.
- **BigQuery export:** you can export to the free BigQuery sandbox. Exports beyond the sandbox limits are charged. Standard properties are capped at 1M events a day. Streaming costs $0.05 per GB. https://support.google.com/analytics/answer/9358801
- **Ecommerce events:** GA4 needs a `purchase` event carrying `transaction_id`, `value`, `currency` and `items`. Reports take about 24 hours to show it. https://developers.google.com/analytics/devguides/collection/ga4/set-up-ecommerce
- **GA4 on Salla:**
  - Install Salla's **Google Analytics** app, then pick the `G-` measurement ID of the data stream. It can take up to 48 hours to start collecting. https://help.salla.sa/en/article/connect-google-analytics/u6l7x3qvtvkykkvcwqtr1jol
  - The article doesn't mention `purchase`, `add_to_cart` or any ecommerce events. It is marked "old" and points to a newer version I could not reach.
  - **Whether Salla's GA app sends GA4 ecommerce/purchase events natively is UNVERIFIED.** Test it on the demo store with GA4 DebugView and a test order before relying on revenue figures.
  - There is also a **Google Tag Manager** app: paste the container snippet, extract the ID and click "Activate connection". It says to keep one container per store. https://help.salla.sa/en/article/connect-google-tag-manager/o26202al1ruesf4mzawzij5q
    - The article does not list any dataLayer events. **UNVERIFIED** which ecommerce events Salla pushes to GTM.
  - Salla also documents a "Stape Server GTM" integration. https://help.salla.sa/en/article/connect-stape-server-gtm/cb3hr1n7k64kftti65sxy32w
- **GA4 also feeds Salla's own reports:** Salla's Visit report (visits, cities, top pages, "search terms" that led to the store) states "Detailed visit reports rely on Google Analytics". https://help.salla.sa/en/article/visit-report/gv7wv3klt891jd16j930iqpm
  - So connecting GA4 is needed for Salla's own analytics too.

### 1.3 Salla: built-in reports and Merchant API

- **Store Reports:** sales by product, category, discount code, city and more; top products; abandoned carts. https://help.salla.sa/en/article/store-reports/lpwuqxp7z7fifo5s4g2pl2oh
  - Traffic sources are not mentioned.
- **Conversion rate report:** breaks down orders and sales by visit source ("direct visits or social media"; the example names search engines). https://help.salla.sa/en/article/conversion-rate-reports/ndt3banqnk8z60luzrod1nu6
  - The full list of source categories and an export option are **not documented**.
- **Merchant API:** https://docs.salla.dev/421117m0.md
  - Needs a verified Salla Partners account, an app with OAuth 2.0 and scopes. Tokens last 14 days and can be refreshed within a month.
  - Rate limits exist, but the overview gives no numbers (**UNVERIFIED**).
  - Orders list `per_page` is capped at 60 (from a docs.salla.dev search snippet, **UNVERIFIED** on the page itself).
- **Order Details carries attribution:** scope `orders.read`. https://docs.salla.dev/api-5394147
  - `source` (e.g. `store`).
  - `source_details`: `type`, `value`, `device`, `user-agent`, `ip`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`.
  - Organic Google visits carry no UTM tags. **Whether `source_details.type` records "search engine / google" for organic orders is UNVERIFIED.** Confirm on real orders.
  - Until then, organic revenue should come from GA4, cross-checked against Salla order totals.
- **No dedicated analytics or report endpoints:** only an Exports group. https://docs.salla.dev/421117m0.md
- **Agent use:** a weekly pull of orders (`source_details`) gives a "Salla truth" revenue line to reconcile with GA4.
  - It needs a private Salla app. This is owner-side work in Partners.

### 1.4 Shopify (baseline capture, before the switch)

- **Sessions by referrer:** this report (Analytics > Reports > Acquisition) groups sessions by referring medium or traffic type, including organic, and can be exported. https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/acquisition-reports
- **Caveat:** sessions count only consenting visitors.
  - Bot filtering became the default in late September 2026, which breaks year-over-year comparisons. https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/analytics-fields
  - Source of these two points: search-result summary of help.shopify.com, **page not opened**.
- **Shopify connector already attached:** this workspace has a Shopify MCP connector (`run-analytics-query`, `list-orders`). An agent could pull the Shopify baseline (sessions, orders, revenue by referrer) once the owner authorises it.

### 1.5 Ahrefs and Semrush (paid, optional)

| | Ahrefs | Semrush |
|---|---|---|
| Plans with API/MCP | Lite, Standard, Advanced; Starter not stated. https://ahrefs.com/pricing | MCP: Semrush One Starter and Pro+, SEO Classic Pro and Guru (50,000 MCP units each, refreshed at renewal). https://semrush.com/kb/1618-mcp |
| Monthly price | Starter $29, Lite $129, Standard $249, Advanced $449 (annual billing saves up to 17%). https://ahrefs.com/pricing | SEO $139, Starter $199, Pro+ $299 (monthly list prices). https://www.semrush.com/prices/ |
| API units | Lite 200k a month (100 rows per request), Standard 800k, Advanced 2M. At least 50 units per call. https://help.ahrefs.com/en/articles/13913559-getting-started-with-ahrefs-mcp | 50k MCP units on the eligible plans. Extra packs of 2M to 20M units at prices not stated. https://semrush.com/kb/1618-mcp |
| Rank tracking | Tracked keywords: Lite 750, Standard 2,000, Advanced 5,000. https://ahrefs.com/pricing | Position tracking: 500 (SEO and Starter), 1,500 (Pro+). https://www.semrush.com/prices/ |
| AI visibility | Brand Radar AI add-on "from $199/mo". https://ahrefs.com/pricing | Included as prompts: Starter 50 a day, Pro+ 100 a day. https://www.semrush.com/prices/ |
| Claude | Official Claude connector listed. https://help.ahrefs.com/en/articles/13913559-getting-started-with-ahrefs-mcp | Claude and Claude Code listed as compatible. https://semrush.com/kb/1618-mcp |

- **Free option:** Ahrefs Webmaster Tools works on verified sites, with an unlimited number of sites. https://ahrefs.com/webmaster-tools
  - Site Audit: 5,000 crawl credits per project per month.
  - Site Explorer: up to 1,000 keywords and backlinks shown.
  - Web Analytics: up to 1M events.
  - There is no Rank Tracker on the free tier.
  - This is the cheapest third-party "keywords we rank for" plus technical audit view.
- **Cheaper paid rank tracking:** SE Ranking. https://seranking.com/subscription.html
  - Core costs $129 a month and tracks 2k keywords daily.
  - It includes 25k API credits plus MCP, and AI visibility with 25 prompts a day across 5 engines.
  - A standalone AI visibility plan starts at $71 a month.
- **Free rank proxy:** GSC average position per query and page is free. It is good enough while the keyword set stays under about 50 terms.

### 1.6 AI visibility (ChatGPT, Gemini, AI Overviews)

- **What Google gives:** Google reports AI Overviews and AI Mode traffic inside "Web". There is no separate filter. https://developers.google.com/search/docs/appearance/ai-features
- **What GA4 gives:** the AI Assistant channel shows *referral visits* from AI assistants. https://support.google.com/analytics/answer/9756891
  - It does not show mentions.
- **Otterly.ai:** https://otterly.ai/pricing
  - Lite costs $29 a month for 15 prompts and covers ChatGPT, Google AI Overviews, Perplexity and Copilot.
  - Gemini and Google AI Mode are $9 a month each on Lite.
  - Unlimited countries and languages.
  - This is the cheapest paid option that fits a 15-prompt Arabic set.
- **Ahrefs Brand Radar:** from $199 a month on top of a paid plan. https://ahrefs.com/pricing
  - Third-party blogs quote $699 a month for all platforms (**UNVERIFIED** on Ahrefs' own page).
- **Semrush AI visibility:** bundled into the Starter and Pro+ prompt quotas. https://www.semrush.com/prices/
- **DIY method (free, recommended first):**
  - **Prompt set:** fix 20 to 30 prompts (about 2/3 Arabic, 1/3 English). Group them as:
    - Brand: "ما هي UNIX للملابس الرياضية؟"
    - Category: "أفضل ليقنز رياضي نسائي في السعودية"
    - Comparison: "UNIX vs [competitor]"
    - Purchase intent: "وين أشتري ملابس رياضية نسائية محتشمة في الرياض"
  - **Engines:** run each prompt monthly in ChatGPT, Gemini, Google (AI Overview and AI Mode) and Perplexity. Use a logged-out or clean session and a KSA location where possible.
  - **Logging:** record in a sheet or CSV:
    - date, engine, prompt
    - mentioned (Y/N), position in the list, linked to unix.sa (Y/N)
    - competitors named, sentiment, cited source URLs
  - **Metrics:** mention rate per engine, share of voice against the top 3 competitors, citation rate, and which sources the engines cite (a target list for PR and content).
  - **Caveat:** AI answers vary between runs (this is the reason the vendors use repeated sampling; general observation, no source).
    - Run each prompt twice and log both runs, or treat month-over-month changes below about 20 percentage points as noise.
  - A Claude agent with web search can run the Gemini, Perplexity and ChatGPT part only where those UIs are reachable. Expect the owner to do this by hand at first (about 1 hour a month).

---

## 2. Dashboard options

| Option | Cost | Setup | Pros | Cons |
|---|---|---|---|---|
| **(a) Looker Studio + native GSC and GA4 connectors** | The no-cost version is free. Pro is a separate paid tier and Google's docs don't state the price. https://docs.cloud.google.com/looker/docs/studio/pro-subscription-overview | About 2 to 4 hours | Google-native and maintained by Google. Needs only "at least view permission" on GSC. https://docs.cloud.google.com/looker/docs/studio/connect-to-search-console | One GSC table per data source (Site or URL impression), so you need two data sources. https://docs.cloud.google.com/looker/docs/studio/connect-to-search-console Same 50k-row cap. No Salla, rank-tracker or AI data without Sheets. Slow with many regex fields. |
| **(b) Custom page fed by APIs** (e.g. a weekly agent job writes JSON or CSV and a static page charts it, outside the theme repo) | Free APIs plus hosting | About 2 to 4 days | Fully tailored: brand split, AR/EN, page groups, Salla orders, AI log in one view. Keeps history past 16 months. | You maintain the OAuth tokens, service accounts and code. A token or quota failure fails silently unless monitored. |
| **(c) Claude with MCP servers** | Free (open source) plus the Claude plan | About 1 to 2 hours per server | Official **Google Analytics MCP** (`googleanalytics/google-analytics-mcp`): read-only by default; tools `run_report`, `run_realtime_report`, `run_conversions_report`, `get_account_summaries`; works with Claude Code via `claude mcp add`. https://github.com/googleanalytics/google-analytics-mcp No official GSC MCP found; community options include `ahonn/mcp-server-gsc` (MIT, one `search_analytics` tool, service-account auth). https://github.com/ahonn/mcp-server-gsc Ahrefs and Semrush have official MCPs (§1.5). | An analyst, not a dashboard: no charts that persist on their own. Community GSC servers need a security read before you give them credentials. The GA MCP is configured in this workspace but **failed to connect** in this session (`analytics-mcp`: connection closed), so it needs a fix. |
| **(d) Supermetrics** | Starter €49 a month (€39 billed yearly) for 2 data sources; Growth €199 (€159). 14-day trial. https://supermetrics.com/pricing/looker-studio | About 1 hour | Polished connectors. A Supermetrics MCP connector is already attached here. | Pays for what Google's free connectors already do for GSC and GA4. Only worth it if paid social or ads data joins later. |

**Recommendation:** use **(a) plus (c)** now, and grow into **(b)** later.
- **(a), Looker Studio:** the always-on visual dashboard for the owner.
- **(c), MCP:** the Claude "SEO manager". It reads GSC and GA4 through MCP and the Shopify or Salla APIs, and writes the weekly or monthly action list into `docs/seo/reports/`.
- **(b), custom page:** only build it once the 16-month history or AI log outgrows Sheets.
- **Skip (d)** for now.

---

## 3. KPIs and views for the migration and early growth

### 3.1 Segments

- **Branded vs non-branded** (GSC regex, RE2):
  - Pattern: `(?i)(unix|يونكس|يونيكس|يونكسس)` (`(?i)` makes it case-insensitive; https://github.com/google/re2/wiki/Syntax).
  - Use `includingRegex` / `excludingRegex` on `query`. https://developers.google.com/webmaster-tools/v1/searchanalytics/query
  - **Watch out:** "unix" also matches queries about the operating system (e.g. "unix commands").
    - Exclude them with an `excludingRegex` such as `(?i)(linux|command|shell|terminal|bash|time|timestamp)`, or restrict to `country = sau`.
    - Review the top branded queries once a month and adjust the regex.
  - KPI: **non-branded clicks** (the growth number); the branded share should fall from 73% over time.
- **Language:**
  - `page` matches `/en/` → EN.
  - Otherwise → AR, minus non-page URLs.
  - Pair this with `country = sau` against the rest.
- **Page-type groups** (regex on `page`): the Salla URL patterns are still to be confirmed after the switch.
  - Shopify today: `/collections/` = category, `/products/` = product, `/blogs/` = blog, `/pages/` = static, `/` = home.
  - Salla: map these from `docs/migration/shopify-urls.csv` to the new patterns once the 301 map is final.
- **Device:** mobile vs desktop (an API dimension).

### 3.2 KPI list (weekly unless marked monthly)

1. **Organic clicks and impressions**, total plus non-branded, AR vs EN. Source: GSC.
2. **CTR and average position**:
   - Per query for the tracked set of about 30 terms from `docs/seo/keywords-ksa-2026-11.md`.
   - Per page group.
3. **Keyword movement:** count of queries in positions 1–3, 4–10 and 11–20; winners and losers week over week.
   - Opportunity list: high impressions, position 4–15, low CTR.
4. **Pages improving or declining:** click delta by page over 28 days compared with the prior 28 days.
5. **Organic sessions, conversion rate, purchases and revenue** (GA4 Organic Search channel, plus the AI Assistant channel separately).
   - Reconcile with Salla order totals.
6. **Content performance (monthly):** blog and guide landing pages, with organic entrances, engagement and assisted purchases.
7. **AI visibility (monthly):** mention rate, share of voice, AI Assistant sessions.
8. **Technical health:**
   - **Indexed vs not indexed** and the reasons (Page indexing report).
   - **404s and redirects:** a "Not found (404)" spike after migration signals broken redirects. https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
     - Agent job: request every old Shopify URL in `docs/migration/shopify-urls.csv` weekly and assert a single 301 hop to the mapped target with a 200 response.
     - Use the URL Inspection API (2,000 a day per site) on the top 50 pages. https://developers.google.com/webmaster-tools/limits
   - **Sitemaps:** indexed counts should move from the old sitemap to the new one, and warnings on the old sitemap are expected. https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
   - **Core Web Vitals:** the CrUX API is free and does not offer paid quota. https://developer.chrome.com/docs/crux/api
     - 150 queries a minute per project.
     - Origin or URL level, 28-day rolling.
     - Metrics: LCP, INP, CLS, FCP, TTFB.
     - A low-traffic site may have **no CrUX data**. The threshold is not stated on the API page (**UNVERIFIED**).
     - Fall back to Lighthouse lab runs (already part of the theme's 6.2 budgets).

### 3.3 Migration-specific expectations

- **No Change of Address:** the tool is only for moving to a different domain or subdomain. A same-domain platform switch with path changes doesn't use it. https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- **Expect fluctuation:** rankings can move for weeks ("a few weeks or more").
- **Redirects:** keep them for at least 1 year. Same source.
- **Small baseline:** with about 22 visits a month, any week-over-week change is noise. Judge the migration on 28-day windows and on index or 404 health, not on clicks.

---

## 4. Recommended setup for UNIX

### Phase 0: now, on Shopify (before migration)

**Owner must do:**
1. **Domain property:** confirm or create a GSC **Domain property** for `unix.sa` via a DNS TXT record at the registrar. https://support.google.com/webmasters/answer/9008080
   - Keep the record forever, because it survives the platform switch.
2. **Grant access:** add the agent's Google account or service account as a **Full user** on GSC (only owners can add users). https://support.google.com/webmasters/answer/7687615
   - Add the same identity as a **Viewer** on GA4.
3. **GA4:** confirm the existing property and measurement ID used on Shopify. Note it in the plan so Salla reuses the **same** property and the history stays continuous.
4. **Link GSC to GA4:** needs GA Editor plus verified GSC owner. https://support.google.com/analytics/answer/10737381
5. **Google Cloud project (free):**
   - Enable the Search Console API, Google Analytics Data API and Admin API, and the CrUX API.
   - Optional: enable billing and turn on GSC bulk export now, because it has no backfill.
6. **Authorise the existing connectors:** the Shopify connector (for the baseline pull) and fix the failing `analytics-mcp` server.

**Agent can do:**
7. **GSC baseline:** pull 16 months by date, query, page, country and device into CSV under `docs/seo/baseline/`. This is the permanent pre-migration snapshot.
8. **Shopify baseline:** sessions by referrer, orders and revenue for 12 months.
9. **Index baseline:** a Page indexing snapshot and CrUX origin data (if any).
10. **AI visibility:** write the fixed prompt set and run baseline month 0.
11. **Looker Studio:** build the report (GSC Site and URL tables, GA4) with the brand, language and page-group calculated fields.
12. **SEO manager agent:** define it with a weekly brief, a monthly deep-dive and a thresholds file.
    - Run it on a schedule (the `schedule` skill / cloud routine), separate from the theme repo or in a `seo-ops/` folder that never ships.

### Phase 1: at the switch (days 0 to 14)

**Owner:**
- Install Salla's Google Analytics app with the **same** GA4 property. https://help.salla.sa/en/article/connect-google-analytics/u6l7x3qvtvkykkvcwqtr1jol
  - Optionally add GTM: one container per store. https://help.salla.sa/en/article/connect-google-tag-manager/o26202al1ruesf4mzawzij5q
- Place one real test order and confirm `purchase` appears in GA4 DebugView with `value` and `currency`. https://developers.google.com/analytics/devguides/collection/ga4/set-up-ecommerce
  - If it does not appear, ecommerce tracking needs GTM work (**open item**).
- Submit the Salla sitemap in GSC.
- Create a private Salla app with `orders.read` (Partners portal) if Salla order attribution is wanted. https://docs.salla.dev/421117m0.md

**Agent:**
- Run the 301 checker daily on all old URLs.
- Track the daily 404 and "Page with redirect" counts.
- Inspect the top 50 URLs via the URL Inspection API.
- Compare against the baseline using `dataState: "all"` to get fresh data.
- Raise an alert for any old URL that returns 404 or a redirect chain.

### Phase 2: after (week 3 onward)

- **Weekly** (agent, Monday): a one-page brief. It covers non-branded clicks, top movers, new 404s, index changes and three actions.
- **Monthly:**
  - Full report: the KPI table from §3.2 and opportunities (position 4–15, high impressions, low CTR).
  - Content gaps against `keywords-ksa-2026-11.md`.
  - The AI visibility run.
  - An action list written to `docs/seo/reports/YYYY-MM.md`.
- **Quarterly:** decide whether paid tooling has earned its place.
  - Otterly Lite ($29) for automated AI tracking.
  - SE Ranking Core ($129) or Ahrefs Lite ($129) once there are more than about 50 non-branded keywords worth tracking daily.
  - Free first: GSC + GA4 + Looker Studio + Ahrefs Webmaster Tools + the DIY AI log.

### Cost summary

- **Months 0–3:** $0. GSC, GA4, Looker Studio (no-cost), CrUX, Ahrefs Webmaster Tools and the DIY AI log are all free. GCP and BigQuery stay inside the free usage tier (the tier size is not stated).
- **Optional later:** Otterly Lite $29 a month; Ahrefs or SE Ranking at $129 a month.

### Open items and unverified points

1. Whether Salla's GA app sends GA4 ecommerce and `purchase` events.
2. Which dataLayer events Salla's GTM app pushes.
3. What `source_details.type` values Salla records for organic search orders.
4. Salla Merchant API rate limits.
5. The property type created by Salla's Site Verification app.
6. The CrUX eligibility threshold.
7. The Looker Studio Pro price.
8. The full Ahrefs Brand Radar price.
