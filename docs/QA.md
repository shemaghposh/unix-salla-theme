# QA: template checks before preview

ROADMAP 6.8. Nothing in this theme has been rendered by Salla yet, so a Twig error in any page would first show up on the live store. This file covers the static checker and the runtime rules it can't enforce.

## 1. `pnpm twig:check`

```
pnpm install          # once: adds the twig (twig.js) devDependency
pnpm twig:check       # every template: OK <file> / ERR <file>:<line>: <message>, exit 1 on any ERR
pnpm twig:check --quiet   # only ERR / WARN lines and the summary
```

Script: `scripts/twig-check.mjs` (dev-only, not part of the theme build). It checks:

| # | Check | Fails on |
|---|---|---|
| 1 | Comments | a `{#` inside a `{# … #}` block, or a stray `#}` in text. Twig comments don't nest: the inner `#}` closes the outer comment and the rest runs as code (this is how `unix-cashback-note` and `unix-free-shipping` ended up including themselves forever, fixed in 3.7 / 4.3). |
| 2 | Syntax | anything twig.js can't tokenize or compile. Salla's tags `{% hook %}` and `{% component %}` are registered as no-op tags (their argument is still compiled), and Salla's filters/functions have stubs. |
| 3 | References | a literal `include` / `extends` / `embed` / `component` target that has no file (`components.cart.x` → `src/views/components/cart/x.twig`), or a template that includes itself. |
| 4 | `twilight.json` | a registered component `path` with no file, or a `components/home/unix-*.twig` that isn't registered. |
| 5 | Translations | a literal `trans('blocks.unix.…')` key missing from `src/locales/ar.json` or `en.json`. Keys built with `~` are skipped. |
| – | Settings (warning) | `theme.settings.get('unix_…')` with no setting of that id in `twilight.json` (`unix_runtime_*` flags are skipped). |

Run it after every change to `src/views/**`, `twilight.json` or the locales, and before closing a phase (with `pnpm prod`).

**Limits.** twig.js is a JavaScript port, not the PHP Twig 3 that Salla runs. A pass means the templates tokenize and compile; it does not prove they render. If twig.js rejects a construct PHP Twig 3 accepts, note it here and narrow the script rather than rewriting the template. Known so far: **arrow functions** (`|filter(x => …)`, `|map(…)`) — the script rewrites `params => body` to `(body)` inside `{{ }}` / `{% %}` before compiling, so the body and the rest of the expression are still checked. `matches`, `a ? b` without else and `{ (key): v }` compile in twig.js as they are.

## 2. Runtime rules (review by hand)

These pass any parser and still crash a page in PHP Twig 3:

1. **`|date` only on values known to be dates.** It throws on a string it can't parse. Proven safe: `article.created_at`, `order.created_at`, `item.availability_date`, `reservation.day` (Raed uses them). Anything else needs a guard: `x.timestamp is defined` (a date object) or `(x ~ '') matches '/^[0-9]{4}-[0-9]{2}-[0-9]{2}/'` (see `unix-jsonld-product.twig`, `unix-jsonld-article.twig`).
2. **Arithmetic only on numbers.** `'abc' - 1` is a PHP 8 TypeError. Settings used in maths must be `"type": "number"` in `twilight.json` (`unix_free_shipping_threshold`, `unix_cashback_percent`, overlay / limit fields), and Salla prices that are `Money` objects (`cart.items[].price`, `.total`) go through `|money` or `.getMoney().amount`, never `+ - * /`.
3. **`|merge` needs arrays on both sides.** It throws on `null`. Start every accumulator with `[]` or `{}` before the loop.
4. **Never `{#` inside a comment.** Write usage examples as plain text inside doc blocks.
5. **Includes with `only`** get no context: the included file may use filters/functions but not `theme`, `store`, `language` or `user` unless they are passed in `with { … }`.
6. **Loops:** a variable first set inside `{% for %}` is gone after the loop; set the accumulator before it.

## 3. Twig constructs the theme uses that aren't plain Twig 3

Assumption: Salla renders with PHP Twig 3 (Raed already uses arrow functions in `|map` / `|filter`, which need Twig ≥ 2.10 / 3), with `strict_variables` off (also an assumption: the theme, like Raed, reads attributes of optional objects and settings without an `is defined` guard).

| Construct | Status |
|---|---|
| `{% hook 'name' %}` / `{% hook name %}` | Salla tag, used by Raed |
| `{% component 'header.header' %}` / `{% component home %}` | Salla tag, used by Raed |
| `trans()`, `link()`, `is_page()`, `pluralize()` | Salla functions, used by Raed |
| `theme.settings.get(id, default)` / `.set()`, `theme.color.darker/lighter()` | Salla objects, documented in Raed's `master.twig` |
| `\|money`, `\|cdn` (with and without sizes, on URLs and theme paths), `\|asset`, `\|number`, `\|is_placeholder` | Salla filters, used by Raed |
| `\|date` (no format, `'c'`, `'Y-m-d'`) | Twig core, Salla may override; all three forms used by Raed |
| `item.price.getMoney()`, `order.print_url()`, `.count()` | Salla object methods, used by Raed |
| `\|map` / `\|filter` with arrow functions, `\|json_encode`, `\|raw`, `\|slice`, `\|join`, `\|first`, `\|default`, `\|replace`, `\|trim`, `\|length`, `same as`, `starts with`, `is iterable`, `??`, `in` | Twig core, used by Raed |
| `\|merge`, `\|split`, `\|striptags`, `\|lower`, `\|last`, `\|round`, `\|number_format`, `\|nl2br`, `\|e('html_attr')`, `trim(chars, side)`, `matches`, `?:`, `a ? b` (no else), `{ (key): v }`, `min()` / `max()`, `attribute()`, `{% set %}…{% endset %}`, `include … only` | Twig core (all available since Twig 1.x / 2.x), not used by Raed; **assumed** to work because Salla runs Twig 3 |
