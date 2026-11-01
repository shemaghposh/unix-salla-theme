# UNIX Salla Theme: project rules

This is a custom **Salla Twilight** theme for UNIX (unix.sa), a Saudi activewear store. It is a refined, quiet-luxury rebuild of the client's Shopify theme. The site is Arabic (RTL) first, with English second.

## Read first, every session
1. `docs/ROADMAP.md`: the current phase, task status, Definition of Done and open client decisions.
2. `docs/DESIGN-SYSTEM.md`: binding values and component specs. It wins all conflicts.
3. `docs/SPEC.md`: the Shopify reference for content, section order and feature logic.

## Agents
- **`unix-theme-architect`** builds. Use it for any change to views, styles, JS or `twilight.json`, in every phase.
- **`unix-design-reviewer`** is the gate. Run it after every change and before closing a phase. A FAIL verdict blocks merge.

## Hard rules
- Use semantic tokens only (`--c-*`, `--t-*`, `--s-*`, `--r-*`, `--e-*`, `--d-*`, `--ease-*`). Primitives (`--unix-*`) live only in `src/assets/styles/01-settings/unix-tokens.scss`.
- A value that isn't in the design system gets added to `DESIGN-SYSTEM.md` first.
- Use logical CSS properties only. The theme is RTL-first.
- Merchant content comes from component `fields` or settings. Never hard-code it.
- Use the built-in `salla-*` web components. Don't re-implement cart, auth or product logic.
- Every UI string goes through `trans()`, with keys in both `src/locales/ar.json` and `en.json`. The Arabic copy uses the feminine voice.
- Make one roadmap task per commit, with the task number in the message (e.g. `feat(2.1): …`), and update ROADMAP.md in the same commit.
- The base is Theme Raed (MIT). Keep `NOTICE.md`.

## Commands
- `pnpm install`
- `pnpm prod`: production build. It must pass before a phase closes.
- `salla login`
- `salla theme preview`: preview on the demo store.
