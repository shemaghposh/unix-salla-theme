# UNIX Salla Theme: project rules

This is a custom **Salla Twilight** theme for UNIX (unix.sa), a Saudi activewear store. It is a refined, quiet-luxury rebuild of the client's Shopify theme. The site is Arabic (RTL) first, with English second.

## Read first, every session
1. `docs/ROADMAP.md`: the current phase, task status, Definition of Done and open client decisions.
2. `docs/DESIGN-SYSTEM.md`: binding values and component specs. It wins all conflicts.
3. `docs/SPEC.md`: the Shopify reference for content, section order and feature logic.

## What we compare against (the baseline)
The goal is to **match the client's live unix.sa (Shopify) first**. Merchant flexibility comes after. Every parity check, review and "done" claim is measured against these, in this order:
1. **`reference/shopify-theme/`**: a verbatim, read-only export of the live unix.sa theme (`unix-20-offer-removed`, Shopify theme 157938581671, exported 2026-11-01, based on Strive). It is the ground truth for content, section order and behaviour. Entry points: `templates/*.json` (index, product, collection, cart, blog, article, page.*), `sections/header-group.json`, `sections/footer-group.json`, `config/settings_data.json`, `assets/*.css|js`. Never edit, build or deploy from here. See `reference/README.md`.
2. **`docs/SPEC.md`**: the written blueprint of that theme (tokens, colour schemes, sections, feature logic). Use it for *what*, not for *how it looks*.
3. **Live https://unix.sa** (AR) and **https://unix.sa/en**: the visual check when the export is unclear.
4. **`docs/DESIGN-SYSTEM.md`**: how the Salla version looks. It wins conflicts. **§12 lists the intended differences from unix.sa**; keep them and don't "fix" them back.
5. Every deliberate difference gets a D-number in `docs/ROADMAP.md`. ⏳ means provisional (built, waiting for client review); ✅ means confirmed.

Where the Salla build is checked: the demo store **UNIX Demo**, theme **705562203** in the Salla Partners portal, linked to branch `main` (`salla theme preview`; checklist in `docs/PREVIEW.md`). Publishing steps are in `docs/PUBLISH.md` and `docs/LAUNCH.md`.

## Agents
- **`unix-theme-architect`** builds. Use it for any change to views, styles, JS or `twilight.json`, in every phase.
- **`unix-design-reviewer`** is the gate. Run it after every change and before closing a phase. A FAIL verdict blocks merge.

Specialist reviewers. All are read-only, and they don't replace the design gate:
- **`unix-code-reviewer`**: bugs, XSS, `salla.*` events and Twig runtime errors. Run it with the design reviewer after JS, Twig logic or `twilight.json` changes.
- **`unix-a11y-auditor`**: WCAG 2.2 AA, AR and EN (6.3).
- **`unix-perf-auditor`**: build sizes and the 6.2 budgets.
- **`unix-seo-specialist`**: headings, JSON-LD and D129.
- **`unix-shopper-walkthrough`**: a persona-based look at conversion on a page or flow.
- **`unix-launch-gatekeeper`**: the final skeptical gate before 6.6 (publish request) and 6.7 (live store). It defaults to NEEDS WORK.

## Hard rules
- Use semantic tokens only (`--c-*`, `--t-*`, `--s-*`, `--r-*`, `--e-*`, `--d-*`, `--ease-*`). Primitives (`--unix-*`) live only in `src/assets/styles/01-settings/unix-tokens.scss`.
- A value that isn't in the design system gets added to `DESIGN-SYSTEM.md` first.
- Use logical CSS properties only. The theme is RTL-first.
- Merchant content comes from component `fields` or settings. Never hard-code it.
- Use the built-in `salla-*` web components. Don't re-implement cart, auth or product logic.
- A `salla-*` component may be replaced only for presentation, only when its data comes from the same `salla.*` API, and with a D-number recording the reason.
- Every UI string goes through `trans()`, with keys in both `src/locales/ar.json` and `en.json`. The Arabic copy uses the feminine voice.
- Make one roadmap task per commit, with the task number in the message (e.g. `feat(2.1): …`), and update ROADMAP.md in the same commit.
- The base is Theme Raed (MIT). Keep `NOTICE.md`.

## Commands
- `pnpm install`
- `pnpm prod`: production build. It must pass before a phase closes.
- `salla login`
- `salla theme preview`: preview on the demo store.
