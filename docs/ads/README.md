# UNIX Ads Studio

The UNIX in-house ads platform: strategy → creative → production → brand gate → launch → measurement.
It is separate from the theme roadmap. Ad work never edits theme code; tracking fixes that need theme code go to `unix-theme-architect`.

## The team (`.claude/agents/`)

| Step | Agent | Writes | Role |
|---|---|---|---|
| 1. Plan | `unix-paid-social-strategist` | `docs/ads/campaigns/` | Platform mix (Snapchat, TikTok, Instagram/Meta, Google), funnel, audiences, budget split, KPIs |
| 2. Concept | `unix-ad-creative-strategist` | `docs/ads/briefs/` | Angles, hooks, Arabic/English copy, creative briefs, test matrix |
| 3. Produce | `unix-video-producer` | `docs/ads/briefs/` (scripts, prompts) + media in `~/unix-ads/` | Script, shot list, Higgsfield generation, ffmpeg edit, export per placement |
| 4. Gate | `unix-brand-guardian` | nothing (read-only) | PASS / FAIL on every creative before it goes live |
| 5. Measure | `unix-tracking-specialist` | `docs/ads/tracking/` | Pixels, Conversions APIs, GA4, UTMs, event QA on Salla |
| 6. Review | `unix-ads-auditor` | `docs/ads/audits/` | Account and performance audits from real data (Windsor.ai), waste, next actions |

Typical flow for a new campaign: 1 → 2 → 3 → 4 (FAIL loops back to 2 or 3) → owner approves → launch → 6 after 7 and 30 days. Run 5 once before the first riyal of ad spend, and again after any theme or Salla app change.

## Hard rules for every ads agent
1. **Money and publishing need the owner's yes.** Agents never launch, pause or change a live campaign or budget (Windsor `execute_action`), never publish to TikTok or any channel, and never spend Higgsfield credits above the budget the caller gave. They prepare, quote and hand back. The main session asks the owner.
2. **Real data only.** Performance numbers come from Windsor.ai, platform exports or the owner. No invented benchmarks, CTRs or ROAS. If a number is a public benchmark, cite the source and date.
3. **Real products only.** Product shots start from the real catalog photos (`~/Downloads/unix-images/{handle}/`, 1000×1500, alt text in `images-upload.csv`) or a real shoot. AI may add motion, scene or model, but never change the product's cut, colour, fabric, print or logo. No claims the product can't back up (no "squat-proof" unless the owner confirms it).
4. **Arabic first.** Arabic copy is written first in the feminine voice (DESIGN-SYSTEM §9), short and confident, no exclamation marks, no superlatives. English is a second version, not the source.
5. **Saudi market fit.** Modest styling suited to KSA, culturally appropriate settings, Saudi/Gulf faces where people appear. Check current Saudi advertising rules (General Authority for Media Regulation, influencer licensing, e-commerce law) and platform policies on the web before a launch, and cite them; don't rely on memory.
6. **Media files stay out of git.** Renders and source clips live in `~/unix-ads/{campaign}/` (raw/, gen/, edit/, final/). Only text (plans, briefs, scripts, prompts, reports) is committed under `docs/ads/`.

## Brand essentials (from `docs/DESIGN-SYSTEM.md`)
- **Brand:** UNIX (unix.sa), Saudi women's activewear and loungewear. Store is moving from Shopify to Salla.
- **Direction:** Quiet Luxury, editorial activewear. Calm, confident, generous space. The photo is the hero (P1). One accent colour, no loud red, no badge clutter (P2).
- **Photo style (§6):** natural light, beige/sand backgrounds, no heavy filters, consistent catalog background. The owner rejected dark text scrims on photos (D122): keep text off the busy part of the frame instead.
- **Colours:** ink `#241e1a`, navy `#1c313d` (primary button), cream `#f2eccd` (button label), sand `#d8c5b8`, cream bg `#f5f1ea`, taupe accent `#8b7355` / `#6f5c44`.
- **Type:** Arabic headings Somar Bold, Arabic body IBM Plex Sans Arabic; English Open Sans.
- **Motion (§5):** soft and purposeful. In ads that means smooth camera moves and clean cuts, not glitch transitions or shaking zooms.
- **CTA pattern:** verb + object: «تسوّقي الجديد»، «اكتشفي المجموعة».
- **Shopper persona:** Noura, 27, Riyadh, trains 3–4×/week, shops on iPhone in Arabic, often from an Instagram or TikTok ad. Fears wrong size, see-through fabric, slow delivery, full upfront payment (looks for Tamara/Tabby), unofficial-looking stores.

## Placement specs (verify current specs on the platform's help pages before export)
| Placement | Ratio | Notes |
|---|---|---|
| TikTok, Reels, Snapchat, Stories | 9:16, 1080×1920 | Keep text and logo inside the safe zone (away from top bar and bottom caption/CTA area) |
| Feed (Instagram/Facebook) | 4:5, 1080×1350 | |
| Square / marketplaces | 1:1, 1080×1080 | |
| YouTube / web hero | 16:9, 1920×1080 | |

## Tools available
- **Higgsfield** (MCP + `higgsfield-*` skills): image/video generation, Marketing Studio ads and UGC, reframe, upscale, audio, dubbing, Virality Predictor.
- **ffmpeg 9** at `/opt/homebrew/bin/ffmpeg`: cut, concat, reframe, music, loudness, export. The standard build has **no `drawtext`/`subtitles` filters**, so Arabic text goes in as pre-rendered PNG overlays (or install `ffmpeg-full`).
- **Windsor.ai** (MCP): read ad and analytics data. Write actions only after the owner confirms.
- **Canva**: needs authorising in claude.ai connector settings before use.
