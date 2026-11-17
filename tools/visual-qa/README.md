# Visual QA scripts

Phone-sized browser checks for the React theme (`~/unix`), used by the `unix-visual-tester` agent.
They drive the installed Chrome through `playwright-core` (headless, iPhone 14 Pro, `ar-SA`).

## Before running
- The local theme must answer on `http://localhost:5173/yonks` (`salla theme dev --no-open` in `~/unix`).
- Run from this folder, with the sandbox off. `node_modules/` is not in git: `npm install` once if it is missing.
- Output goes to `shots/` (not in git).

## Scripts
| Script | What it does |
|---|---|
| `node shoot.mjs pages-local.json shots/new` | Every page in the list, scrolled, one screenshot per screen, plus `report.json` (status, height, horizontal overflow, console errors). |
| `node shoot.mjs pages-unix-sa.json shots/old` | The same for live unix.sa. |
| `python3 stitch.py` / `pair.py` | Join the tiles of a page, and put unix.sa and the theme side by side. |
| `node flow.mjs` | Product with sizes: add without a size, add with M, loading state, cart drawer, «كمّلي الطقم», remove. Saves `state.json`. |
| `node qty.mjs` | Cart drawer quantity (needs `state.json` from `flow.mjs`). |
| `node set.mjs` | Set product: two size rows, add, drawer, quantity 2, cart page. |
| `node rest.mjs` | Menu drawer, search, English, landscape, 404. |

## Notes
- The cookie `salla_view_as=1789843788` on `localhost` passes the store's «ترقّب إطلاق» page.
- Deferred components load only when in view: scroll, wait, then act.
- A script that exits 0 proves nothing about how the page looks. Open the screenshots.
- Never pay, publish or log in from a script.
