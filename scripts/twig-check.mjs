#!/usr/bin/env node
/**
 * UNIX theme: static Twig check (ROADMAP 6.8 · docs/QA.md).
 *
 * Dev-only. Catches template errors before anything is rendered on Salla:
 *   1. Comments: a `{#` inside a `{# … #}` block (Twig comments don't nest, so the inner `#}` closes the
 *      outer one and the rest of the "comment" runs as code), and stray `#}` in text.
 *   2. Syntax: every .twig under src/views is compiled with twig.js. Salla's own tags (`hook`, `component`)
 *      are registered as no-op tags and Salla's filters/functions get stubs, so only real syntax errors fail.
 *   3. References: every literal include / extends / embed / component target must exist, and a template
 *      must not include itself.
 *   4. twilight.json: every registered component path has its .twig file, and every
 *      components/home/unix-*.twig is registered.
 *   5. Translations: every literal trans('blocks.unix.…') key exists in src/locales/ar.json AND en.json.
 *   (warning only) theme.settings.get('unix_…') ids that twilight.json doesn't define.
 *
 * Limits: twig.js is not PHP Twig 3. It proves the templates tokenize and compile; it can't see runtime
 * errors (|date on an unparseable string, arithmetic on non-numbers, null.method()). Those are in docs/QA.md.
 *
 * Usage: pnpm twig:check            (exit 1 on any ERR)
 *        pnpm twig:check --quiet    (only ERR / WARN lines and the summary)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Twig from 'twig';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VIEWS = path.join(ROOT, 'src', 'views');
const QUIET = process.argv.includes('--quiet');

/* ------------------------------------------------------------------ twig.js setup */

// Salla-only tags: {% hook 'name' %}, {% hook name %}, {% component 'header.header' %}, {% component home %}.
// The argument is still compiled as an expression, so a broken argument fails like it would in Twig.
const twigLog = [];
Twig.extend((T) => {
    for (const tag of ['hook', 'component']) {
        T.exports.extendTag({
            type: `salla_${tag}`,
            regex: new RegExp(`^${tag}\\s+([\\s\\S]+)$`),
            next: [],
            open: true,
            compile(token) {
                token.stack = T.expression.compile.call(this, {
                    type: T.expression.type.expression,
                    value: token.match[1].trim(),
                }).stack;
                delete token.match;
                return token;
            },
            parse(token, context, chain) {
                return { chain, output: '' };
            },
        });
    }
    // keep twig.js from printing its own copy of each error
    if (T.log) {
        T.log.error = (...args) => twigLog.push(args.join(' '));
    }
});

// Salla filters and functions (stubs; the check only compiles, but rendering experiments stay possible)
const identity = (value) => value;
for (const name of ['money', 'cdn', 'asset', 'number', 'is_placeholder', 'time_ago', 'snake_case', 'camel_case', 'kebab_case', 'studly_case']) {
    Twig.extendFilter(name, identity);
}
for (const name of ['trans', 'link', 'is_page', 'is_current_url', 'pluralize', 'old', 'asset', 'cdn']) {
    Twig.extendFunction(name, (...args) => args[0] ?? '');
}
Twig.cache(false);

/* ------------------------------------------------------------------ helpers */

function listTwig(dir) {
    return fs
        .readdirSync(dir, { recursive: true, withFileTypes: true })
        .filter((d) => d.isFile() && d.name.endsWith('.twig'))
        .map((d) => path.join(d.parentPath ?? d.path, d.name))
        .sort();
}

const rel = (file) => path.relative(ROOT, file);
const lineAt = (src, index) => src.slice(0, index).split('\n').length;

/**
 * Walks the source the way Twig's lexer does (text / {{ }} / {% %} / {# #}), returns the comment problems
 * and a copy of the source with comments blanked (newlines kept, so line numbers still match).
 */
function scanComments(src) {
    const problems = [];
    let out = '';
    let i = 0;
    while (i < src.length) {
        const next = src.slice(i).search(/\{[{%#]|#\}/);
        if (next === -1) {
            out += src.slice(i);
            break;
        }
        const at = i + next;
        out += src.slice(i, at);
        const pair = src.slice(at, at + 2);

        if (pair === '#}') {
            problems.push({ line: lineAt(src, at), message: 'stray "#}" in text: an earlier comment was probably closed early by a nested {# … #}' });
            out += pair;
            i = at + 2;
        } else if (pair === '{#') {
            const end = src.indexOf('#}', at + 2);
            const stop = end === -1 ? src.length : end + 2;
            const body = src.slice(at + 2, end === -1 ? src.length : end);
            const nested = body.indexOf('{#');
            if (nested !== -1) {
                problems.push({
                    line: lineAt(src, at + 2 + nested),
                    message: '"{#" inside a comment that starts on line ' + lineAt(src, at) + ': Twig comments don\'t nest, so its "#}" ends the outer comment and the rest runs as code',
                });
            }
            if (end === -1) {
                problems.push({ line: lineAt(src, at), message: 'unclosed comment' });
            }
            out += src.slice(at, stop).replace(/[^\n]/g, ' ');
            i = stop;
        } else {
            // {{ … }} or {% … %}: skip to the matching close, ignoring quoted strings
            const close = pair === '{{' ? '}}' : '%}';
            let j = at + 2;
            let quote = null;
            while (j < src.length) {
                const c = src[j];
                if (quote) {
                    if (c === '\\') j++;
                    else if (c === quote) quote = null;
                } else if (c === '"' || c === "'") {
                    quote = c;
                } else if (src.startsWith(close, j)) {
                    j += 2;
                    break;
                }
                j++;
            }
            out += src.slice(at, j);
            i = j;
        }
    }
    return { problems, code: out };
}

function lookup(obj, dotted) {
    return dotted.split('.').reduce((node, key) => (node && typeof node === 'object' ? node[key] : undefined), obj);
}

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/* ------------------------------------------------------------------ checks */

const files = listTwig(VIEWS);
const locales = {
    ar: readJson(path.join(ROOT, 'src', 'locales', 'ar.json')),
    en: readJson(path.join(ROOT, 'src', 'locales', 'en.json')),
};
const twilight = readJson(path.join(ROOT, 'twilight.json'));
const settingIds = new Set((twilight.settings || []).map((s) => s && s.id).filter(Boolean));

let errors = 0;
let warnings = 0;
const err = (file, line, message) => {
    errors++;
    console.log(`ERR ${rel(file)}${line ? ':' + line : ''}: ${message}`);
};
const warn = (file, line, message) => {
    warnings++;
    console.log(`WARN ${rel(file)}${line ? ':' + line : ''}: ${message}`);
};

const viewFile = (name) => path.join(VIEWS, ...name.split('.')) + '.twig';

for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    const before = errors;

    // 1. comments
    const { problems, code } = scanComments(src);
    for (const p of problems) err(file, p.line, p.message);

    // 2. syntax
    twigLog.length = 0;
    try {
        const tpl = Twig.twig({ data: src, rethrow: true, allowInlineIncludes: true });
        if (!tpl || !tpl.tokens) {
            err(file, 0, 'twig.js could not compile the template' + (twigLog.length ? ': ' + twigLog.join(' | ') : ''));
        }
    } catch (e) {
        err(file, 0, `syntax: ${e && e.message ? e.message : String(e)}`);
    }

    // 3. references (comments blanked, literal names only)
    const refRe = /\{%-?\s*(include|extends|embed|component|import|from)\s+(['"])([^'"]+)\2/g;
    for (const m of code.matchAll(refRe)) {
        const [, kind, , name] = m;
        const target = viewFile(kind === 'component' ? `components.${name}` : name);
        const line = lineAt(code, m.index);
        if (!fs.existsSync(target)) {
            err(file, line, `${kind} '${name}': ${rel(target)} does not exist`);
        } else if (kind === 'include' && path.resolve(target) === path.resolve(file)) {
            err(file, line, `includes itself ('${name}'): infinite recursion`);
        }
    }

    // 5. translations: literal blocks.unix.* keys only (a key built with ~ is skipped)
    const transRe = /\btrans\(\s*(['"])(blocks\.unix\.[A-Za-z0-9_.]+)\1\s*[,)]/g;
    for (const m of code.matchAll(transRe)) {
        const key = m[2];
        for (const [lang, data] of Object.entries(locales)) {
            if (typeof lookup(data, key) !== 'string') {
                err(file, lineAt(code, m.index), `trans key '${key}' missing in src/locales/${lang}.json`);
            }
        }
    }

    // (warning) settings the template reads but twilight.json doesn't define
    const setRe = /theme\.settings\.get\(\s*(['"])(unix_[A-Za-z0-9_]+)\1\s*[,)]/g;
    for (const m of code.matchAll(setRe)) {
        const id = m[2];
        if (!id.startsWith('unix_runtime_') && !settingIds.has(id)) {
            warn(file, lineAt(code, m.index), `theme.settings.get('${id}') has no setting with that id in twilight.json`);
        }
    }

    if (errors === before && !QUIET) console.log(`OK ${rel(file)}`);
}

// 4. twilight.json components ↔ files
const registered = new Set();
for (const c of twilight.components || []) {
    if (!c || !c.path) continue;
    registered.add(c.path);
    const target = viewFile(`components.${c.path}`);
    if (!fs.existsSync(target)) {
        err(path.join(ROOT, 'twilight.json'), 0, `component '${c.path}' has no file ${rel(target)}`);
    }
}
for (const file of files) {
    const r = path.relative(path.join(VIEWS, 'components', 'home'), file);
    if (!r.startsWith('..') && path.basename(r).startsWith('unix-')) {
        const name = 'home.' + r.replace(/\.twig$/, '').split(path.sep).join('.');
        if (!registered.has(name)) err(file, 0, `not registered in twilight.json → components (path '${name}')`);
    }
}

console.log(`\ntwig:check: ${files.length} templates, ${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
