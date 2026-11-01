/* ============================================================
   UNIX — Size finder v2, UI (ROADMAP 3.3 · DS §8.11)

   Port of the PAGE INTEGRATION + UI parts of unix.sa
   assets/unix-size-finder.js, inside a native <dialog>. Loaded as a
   separate chunk by unix-size-finder-loader.js on first open (or on
   idle when a saved profile exists, to show her size on the trigger).

   Salla integration: the size option(s) come from the twig include
   (`data-sf-options`: id, name, details[id,name,out]). A recommendation
   selects the matching value on the EXISTING control rendered by
   <salla-product-options> (radio or select, name="options[<id>]") and
   dispatches a native `change` — no option logic of our own.
   ============================================================ */

import {
  SIZES, buildConfig, createModel, productProfile, loadProfile, saveProfile, hasProfile,
} from './unix-size-finder-model';

const KEY = 'blocks.unix.size_finder.';
const instances = new WeakMap();

const t = (key, params) => {
  const value = window.salla?.lang?.get(KEY + key, params);
  return typeof value === 'string' ? value : key;
};

function cssMs(name, fallback) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!raw) return fallback;
  const v = parseFloat(raw) || 0;
  return raw.endsWith('ms') ? v : v * 1000;
}

function h(tag, cls, text) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (text != null) el.textContent = text;
  return el;
}

const arDigits = n => String(n).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const uniq = list => list.filter((v, i) => list.indexOf(v) === i);

/** Size label of an option value ("M", "m ", "XL - 2XL" → first exact token). */
function sizeOf(name) {
  const m = String(name || '').trim().toUpperCase().match(/^(XS|S|M|L|XL)(?![A-Z0-9])/);
  return m ? m[1] : null;
}

// Abstract torso outlines: shoulder, waist and hip widths per shape (unix.sa).
function shapeSvg(i) {
  const f = [[15, 10, 21], [17, 11, 17], [21, 11, 15], [17, 16, 18]][i];
  const cx = 22, y0 = 5, y1 = 22, y2 = 38, y3 = 44;
  const side = s => `M${cx + s * f[0] / 2} ${y0}`
    + ` C${cx + s * f[0] / 2} ${y0 + 8} ${cx + s * f[1] / 2} ${y1 - 6} ${cx + s * f[1] / 2} ${y1}`
    + ` C${cx + s * f[1] / 2} ${y1 + 6} ${cx + s * f[2] / 2} ${y2 - 7} ${cx + s * f[2] / 2} ${y2}`
    + ` L${cx + s * f[2] / 2 - s * 1.5} ${y3}`;
  const neck = `M${cx - 3} 1 L${cx - 3} ${y0} L${cx - f[0] / 2} ${y0} M${cx + 3} 1 L${cx + 3} ${y0} L${cx + f[0] / 2} ${y0}`;
  return '<svg class="unix-sf__fig" viewBox="0 0 44 46" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + `<path d="${neck}"/><path d="${side(-1)}"/><path d="${side(1)}"/></svg>`;
}

class SizeFinder {
  constructor(root) {
    this.root = root;
    this.dialog = root._sfDialog || root.querySelector('[data-sf-dialog]');
    this.trigger = root.querySelector('[data-sf-open]');
    this.isEn = (document.documentElement.lang || '').toLowerCase().startsWith('en');

    let raw = '';
    try { raw = JSON.parse(root.querySelector('[data-sf-config]')?.textContent || '""'); } catch (e) { raw = ''; }
    this.cfg = buildConfig(raw);
    this.model = createModel(this.cfg);
    const p = productProfile(this.cfg, root.dataset.productId, root.dataset.productName);
    this.baseCat = p.cat;
    this.comfy = p.comfy;
    this.delta = p.delta;

    try { this.options = JSON.parse(root.dataset.sfOptions || '[]'); } catch (e) { this.options = []; }

    this.profile = loadProfile() || {};
    this.profile.prefs = this.profile.prefs || {};
    this.step = 'height';
    this.uid = this.dialog.id;

    this.head = this.dialog.querySelector('[data-sf-step]');
    this.bar = this.dialog.querySelector('[data-sf-bar]');
    this.body = this.dialog.querySelector('[data-sf-body]');

    // Close button, backdrop and focus return are wired by the loader (they work before this chunk loads).
    this.dialog.addEventListener('close', () => this.renderEntry());

    // If she taps a size herself, stop auto-selecting on her behalf.
    document.addEventListener('change', (e) => {
      if (e.isTrusted && this.isSizeControl(e.target)) root.dataset.touched = '1';
    }, true);

    this.renderEntry();
  }

  /* ---------- Salla option controls ---------- */

  isSizeControl(el) {
    const name = el && el.name;
    return !!name && this.options.some(o => name === `options[${o.id}]`);
  }

  /** { 'M': { detail, control }, … } for one size option. */
  sizeMap(opt) {
    const map = {};
    const form = this.root.closest('form') || document;
    (opt.details || []).forEach((d) => {
      const label = sizeOf(d.name);
      if (!label || map[label]) return;
      const name = `options[${opt.id}]`;
      const radio = document.querySelector(`input[name="${name}"][value="${d.id}"]`);
      const select = radio ? null : (form.querySelector(`select[name="${name}"]`) || document.querySelector(`select[name="${name}"]`));
      const optionEl = select ? Array.from(select.options).find(o => o.value === String(d.id)) : null;
      map[label] = { detail: d, radio, select, optionEl };
    });
    return map;
  }

  isAvailable(entry) {
    if (!entry || entry.detail.out) return false;
    if (entry.radio) return !entry.radio.disabled && !entry.radio.classList.contains('disabled');
    if (entry.optionEl) return !entry.optionEl.disabled;
    return true;
  }

  selectIn(opt, label) {
    const e = this.sizeMap(opt)[label];
    if (!e) return false;
    if (e.radio) {
      if (!e.radio.checked) { e.radio.checked = true; e.radio.dispatchEvent(new Event('change', { bubbles: true })); }
      return true;
    }
    if (e.select) {
      if (e.select.value !== String(e.detail.id)) {
        e.select.value = String(e.detail.id);
        e.select.dispatchEvent(new Event('change', { bubbles: true }));
      }
      return true;
    }
    return false;
  }

  markSuggested(opt, label) {
    document.querySelectorAll(`.unix-sf-mark[data-sf-opt="${opt.id}"]`).forEach(n => n.remove());
    const e = this.sizeMap(opt)[label];
    if (!e || !e.radio || !e.radio.id) return;
    const lab = document.querySelector(`label[for="${CSS.escape(e.radio.id)}"]`);
    if (!lab) return;
    const m = h('span', 'unix-sf-mark', t('mark'));
    m.dataset.sfOpt = opt.id;
    lab.appendChild(m);
  }

  /* ---------- model glue (unix.sa) ---------- */

  pieces() {
    return this.options.map(o => ({ opt: o, label: o.name, cat: this.model.catFor(o.name, this.baseCat, this.comfy) }));
  }

  primaryCat() { const p = this.pieces(); return p.length ? p[0].cat : this.baseCat; }

  needsBra() { return this.pieces().some(p => p.cat === 'bra' || p.cat === 'topFitted'); }

  currentResults() {
    const { CATS } = this.model;
    return this.pieces().map((pc) => {
      const prefKey = CATS[pc.cat].pref;
      const r = this.model.recommend(this.profile, pc.cat, this.profile.prefs[prefKey], this.delta);
      const map = this.sizeMap(pc.opt);
      let shown = r.size, swapped = false, soldOut = false;
      if (map[SIZES[shown]] && !this.isAvailable(map[SIZES[shown]])) {
        // Only ever offer the next size up or down. Size up one step by
        // default; size down only if she asked for a close fit.
        const wantsClose = this.profile.prefs[prefKey] === 0;
        const up = SIZES[shown + 1], dn = SIZES[shown - 1];
        if (!wantsClose && up && this.isAvailable(map[up])) { shown += 1; swapped = true; }
        else if (wantsClose && dn && this.isAvailable(map[dn])) { shown -= 1; swapped = true; }
        else soldOut = true;
      }
      return { piece: pc, r, shown, swapped, soldOut };
    });
  }

  /* ---------- entry row ---------- */

  renderEntry() {
    const t1 = this.root.querySelector('[data-sf-t1]');
    const t2 = this.root.querySelector('[data-sf-t2]');
    this.trigger.setAttribute('aria-expanded', 'false');
    if (!hasProfile(this.profile)) {
      t1.textContent = t('open_new');
      t2.textContent = t('open_new_sub');
      return;
    }
    const res = this.currentResults();
    const sizes = uniq(res.map(r => SIZES[r.shown] + (r.soldOut ? ` (${t('gone_short')})` : '')));
    t1.textContent = t('open_known', { sizes: sizes.join(' / ') });
    t2.textContent = t('edit');
    res.forEach((r) => { if (!r.soldOut) this.markSuggested(r.piece.opt, SIZES[r.shown]); });
  }

  /** Pre-select her saved size once the page has settled, unless she picked one by hand. */
  autoSelect() {
    if (!hasProfile(this.profile)) return;
    const run = () => {
      if (this.root.dataset.touched) return;
      this.currentResults().forEach((r) => { if (!r.soldOut) this.selectIn(r.piece.opt, SIZES[r.shown]); });
      this.renderEntry();
    };
    const later = () => setTimeout(run, 400);
    const ready = window.customElements ? customElements.whenDefined('salla-product-options') : Promise.resolve();
    ready.then(() => {
      if (document.readyState === 'complete') later();
      else window.addEventListener('load', later, { once: true });
    });
  }

  /* ---------- dialog ---------- */

  open() {
    if (!this.dialog.open) this.dialog.showModal();
    this.trigger.setAttribute('aria-expanded', 'true');
    if (hasProfile(this.profile)) this.result(); else { this.step = 'height'; this.render(); }
  }

  close() { if (this.dialog.open) this.dialog.close(); }

  buildSteps() {
    const s = ['height', 'usual', 'brand'];
    if (this.profile.brand) s.push('brandSize');
    s.push('shape');
    if (this.needsBra()) s.push('bra');
    s.push('weight', 'pref');
    return s;
  }

  setHead(i, n) {
    this.head.textContent = n ? t('step', { current: this.isEn ? i : arDigits(i), total: this.isEn ? n : arDigits(n) }) : '';
    this.bar.textContent = '';
    for (let k = 0; k < n; k++) { const seg = h('i'); if (k < i) seg.className = 'is-on'; this.bar.appendChild(seg); }
  }

  title(text, srOnly) {
    const el = h('h2', 'unix-sf__q' + (srOnly ? ' sr-only' : ''), text);
    el.id = `${this.uid}-title`;
    el.tabIndex = -1;
    return el;
  }

  /** Radiogroup of option buttons with roving tabindex and arrow keys (RTL aware). */
  chips(list, cols, current, onPick, extraCls, labelledBy, describedBy) {
    const g = h('div', 'unix-sf__chips');
    g.dataset.cols = cols;
    g.setAttribute('role', 'radiogroup');
    if (labelledBy) g.setAttribute('aria-labelledby', labelledBy);
    if (describedBy) g.setAttribute('aria-describedby', describedBy);
    const buttons = list.map((label, i) => {
      const c = h('button', 'unix-sf__chip' + (extraCls ? ` ${extraCls}` : ''));
      c.type = 'button';
      c.setAttribute('role', 'radio');
      c.setAttribute('aria-checked', String(current === i));
      if (typeof label === 'string') { c.textContent = label; } else { c.innerHTML = label.html; c.appendChild(h('span', '', label.text)); }
      c.tabIndex = (current === i || (current == null || current < 0 ? i === 0 : false)) ? 0 : -1;
      c.addEventListener('click', () => onPick(i));
      g.appendChild(c);
      return c;
    });
    g.addEventListener('keydown', (e) => {
      const i = buttons.indexOf(document.activeElement);
      if (i < 0) return;
      const rtl = getComputedStyle(g).direction === 'rtl';
      const next = { ArrowDown: 1, ArrowUp: -1, ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[e.key];
      let j = null;
      if (next) j = (i + next + buttons.length) % buttons.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = buttons.length - 1;
      if (j == null) return;
      e.preventDefault();
      buttons.forEach((b, k) => { b.tabIndex = k === j ? 0 : -1; });
      buttons[j].focus();
    });
    return g;
  }

  wideChip(label, isOn, onPick, prominent) {
    const c = h('button', 'unix-sf__chip unix-sf__chip--wide' + (prominent ? ' is-prominent' : ''), label);
    c.type = 'button';
    c.setAttribute('aria-pressed', String(!!isOn));
    c.addEventListener('click', onPick);
    return c;
  }

  next() {
    const steps = this.buildSteps();
    const i = steps.indexOf(this.step);
    if (i < steps.length - 1) { this.step = steps[i + 1]; this.render(); } else { this.finish(); }
  }

  prev() {
    const steps = this.buildSteps();
    const i = steps.indexOf(this.step);
    if (i > 0) { this.step = steps[i - 1]; this.render(); }
  }

  render(focusSel) {
    const P = this.profile, { BRANDS, CATS } = this.model;
    const steps = this.buildSteps();
    this.setHead(steps.indexOf(this.step) + 1, steps.length);
    const body = this.body;
    body.textContent = '';
    body.classList.remove('unix-sf__body');
    void body.offsetWidth; // restart the step animation
    body.classList.add('unix-sf__body');
    const titleId = `${this.uid}-title`, hintId = `${this.uid}-hint`;
    const Q = (q, hint) => {
      body.appendChild(this.title(q));
      if (hint) { const p = h('p', 'unix-sf__hint', hint); p.id = hintId; body.appendChild(p); }
    };
    const pick = fn => i => { fn(i); this.next(); };

    if (this.step === 'height') {
      Q(t('q_height'), t('unit_cm'));
      body.appendChild(this.chips([0, 1, 2, 3, 4, 5].map(i => t(`height_${i}`)), 2, P.height, pick((i) => { P.height = i; }), '', titleId, hintId));
    }
    if (this.step === 'usual') {
      Q(t('q_usual'));
      body.appendChild(this.chips(SIZES, 5, P.usual, pick((i) => { P.usual = i; }), 'is-size', titleId));
      body.appendChild(this.wideChip(t('dunno'), P.usual === null && P._usualAnswered, () => { P.usual = null; P._usualAnswered = true; this.next(); }));
    }
    if (this.step === 'brand') {
      Q(t('q_brand'), t('q_brand_hint'));
      const keys = Object.keys(BRANDS);
      body.appendChild(this.chips(keys.map(k => BRANDS[k].label), 3, keys.indexOf(P.brand), pick((i) => { P.brand = keys[i]; P.brandSize = null; }), '', titleId, hintId));
      body.appendChild(this.wideChip(t('skip'), false, () => { P.brand = null; P.brandSize = null; this.next(); }));
    }
    if (this.step === 'brandSize') {
      const B = BRANDS[P.brand];
      Q(t('q_brand_size', { brand: B.label }));
      body.appendChild(this.chips(B.sizes, B.sizes.length > 5 ? 3 : 5, P.brandSize, pick((i) => { P.brandSize = i; }), 'is-size', titleId));
    }
    if (this.step === 'shape') {
      Q(t('q_shape'));
      const labels = [0, 1, 2, 3].map(i => ({ html: shapeSvg(i), text: t(`shape_${i}`) }));
      const g = this.chips(labels, 2, P.shape, pick((i) => { P.shape = i; }), 'unix-sf__chip--shape', titleId);
      g.classList.add('unix-sf__shapes');
      body.appendChild(g);
      body.appendChild(this.wideChip(t('skip'), false, () => { P.shape = null; this.next(); }));
    }
    if (this.step === 'bra') {
      Q(t('q_bra'));
      const bandId = `${this.uid}-band`, cupId = `${this.uid}-cup`;
      const band = h('p', 'unix-sf__sub', t('q_bra_band')); band.id = bandId; body.appendChild(band);
      const bands = ['32', '34', '36', '38', '40'];
      body.appendChild(this.chips(bands, 5, bands.indexOf(String(P.braBand)), (i) => { P.braBand = +bands[i]; this.render(`#${cupId}-group [role="radio"]`); }, 'is-size', `${titleId} ${bandId}`));
      const cup = h('p', 'unix-sf__sub', t('q_bra_cup')); cup.id = cupId; body.appendChild(cup);
      const cups = ['A', 'B', 'C', 'D', 'DD+'], cupKeys = ['A', 'B', 'C', 'D', 'DD'];
      const cupGroup = this.chips(cups, 5, cupKeys.indexOf(P.braCup), (i) => {
        P.braCup = cupKeys[i];
        if (P.braBand) this.next(); else this.render(`#${cupId}-group [role="radio"]`);
      }, 'is-size', `${titleId} ${cupId}`);
      cupGroup.id = `${cupId}-group`;
      body.appendChild(cupGroup);
      body.appendChild(this.wideChip(t('bra_dunno'), false, () => { P.braBand = null; P.braCup = null; this.next(); }));
    }
    if (this.step === 'weight') {
      Q(t('q_weight'), t('q_weight_hint'));
      const unit = h('span', 'sr-only', ` (${t('unit_kg')})`);
      body.querySelector(`#${CSS.escape(titleId)}`).appendChild(unit);
      body.appendChild(this.chips([0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => t(`weight_${i}`)), 3, P.weight, pick((i) => { P.weight = i; }), '', titleId, hintId));
      body.appendChild(this.wideChip(t('no_weight'), P.weight === null && P._weightAnswered, () => { P.weight = null; P._weightAnswered = true; this.next(); }, true));
    }
    if (this.step === 'pref') {
      const key = CATS[this.primaryCat()].pref;
      Q(t(`pref_${key}_q`));
      body.appendChild(this.chips([0, 1, 2].map(i => t(`pref_${key}_${i}`)), 1, P.prefs[key], (i) => {
        // one answer applies to every piece on the page
        this.pieces().forEach((pc) => { P.prefs[CATS[pc.cat].pref] = i; });
        P.prefs[key] = i;
        this.next();
      }, 'is-row', titleId));
    }
    if (this.step === 'height') {
      // unit in the accessible name of the height group too
      body.querySelector(`#${CSS.escape(titleId)}`).appendChild(h('span', 'sr-only', ` (${t('unit_cm')})`));
    }

    if (steps.indexOf(this.step) > 0) {
      const b = h('button', 'unix-sf__back', t('back'));
      b.type = 'button';
      b.addEventListener('click', () => this.prev());
      body.appendChild(b);
    }

    const target = (focusSel && body.querySelector(`${focusSel}[tabindex="0"]`))
      || body.querySelector('[role="radio"][tabindex="0"]')
      || body.querySelector('h2');
    target?.focus({ preventScroll: true });
  }

  finish() {
    saveProfile(this.profile);
    this.setHead(0, 0);
    this.body.textContent = '';
    this.body.appendChild(this.title(t('think'), true));
    const box = h('div', 'unix-sf__think');
    box.setAttribute('role', 'status');
    box.appendChild(h('p', '', t('think')));
    const line = h('span', 'unix-sf__line'); line.setAttribute('aria-hidden', 'true');
    box.appendChild(line);
    this.body.appendChild(box);
    this.body.querySelector('h2').focus({ preventScroll: true });
    setTimeout(() => { if (this.dialog.open) this.result(); }, cssMs('--d-reveal', 800));
  }

  prefLabelFor(cat) {
    const key = this.model.CATS[cat].pref, i = this.profile.prefs[key];
    return i == null ? null : t(`pref_${key}_${i}`);
  }

  explain(r) {
    const parts = [];
    r.est.signals.forEach((x) => {
      if (x.kind === 'brand') parts.push(t('why_brand', { size: x.size, brand: x.label, ours: SIZES[Math.max(0, Math.min(4, Math.round(x.idx)))] }));
      if (x.kind === 'usual') parts.push(t('why_usual', { size: SIZES[x.idx] }));
      if (x.kind === 'bra') parts.push(t('why_bra', { size: x.label }));
      if (x.kind === 'body') parts.push(t('why_body'));
    });
    const p = this.prefLabelFor(r.cat);
    if (p) parts.push(t('why_pref', { pref: p }));
    return parts.join(t('list_sep'));
  }

  result() {
    const { CATS } = this.model;
    const res = this.currentResults();
    this.setHead(0, 0);
    const body = this.body;
    body.textContent = '';
    body.appendChild(this.title(t('your_size'), true));

    const box = h('div', 'unix-sf__result');
    box.setAttribute('aria-live', 'polite');
    const tiles = h('div', 'unix-sf__tiles');
    res.forEach((it) => {
      const tile = h('div', 'unix-sf__tile');
      tile.appendChild(h('span', 'unix-sf__tlabel', res.length > 1 ? it.piece.label : t('your_size')));
      tile.appendChild(h('bdi', 'unix-sf__size', SIZES[it.shown]));
      tile.appendChild(h('span', `unix-sf__conf is-${it.soldOut ? 'gone' : it.r.conf}`, it.soldOut ? t('gone_short') : t(`conf_${it.r.conf}`)));
      tiles.appendChild(tile);
    });
    box.appendChild(tiles);

    if (res[0]) {
      const lines = [];
      const why = this.explain(res[0].r);
      if (why) lines.push(`${why}.`);
      res.forEach((it) => {
        if (it.soldOut) lines.push(t('gone', { size: SIZES[it.r.size] }));
        else if (it.swapped) lines.push(t('soldout', { size: SIZES[it.r.size], alt: SIZES[it.shown] }));
        else if (it.r.between) {
          const lo = SIZES[Math.min(it.r.best, it.r.second)], hi = SIZES[Math.max(it.r.best, it.r.second)];
          const isComfy = CATS[it.r.cat].table === 'comfy';
          const reason = SIZES[it.r.size] === lo ? (isComfy ? t('between_why_comfy') : t('between_why_down')) : t('between_why_up');
          lines.push(`${t('between', { low: lo, high: hi, pick: SIZES[it.r.size] })} ${reason}.`);
        }
        if (CATS[it.r.cat].length && this.profile.height != null) {
          if (this.profile.height === 0) lines.push(t('length_short'));
          if (this.profile.height === 5) lines.push(t('length_tall'));
        }
        if (it.r.conf === 'low' && !it.r.between) lines.push(t('low_note'));
      });
      uniq(lines).forEach(l => box.appendChild(h('p', 'unix-sf__why', l)));
    }

    const avail = res.filter(it => !it.soldOut);
    if (avail.length) {
      const cta = h('button', 'unix-btn unix-btn--block unix-sf__cta', t('pick', { size: uniq(avail.map(it => SIZES[it.shown])).join(' / ') }));
      cta.type = 'button';
      cta.addEventListener('click', () => {
        if (cta.dataset.done) return;
        cta.dataset.done = '1';
        avail.forEach(it => this.selectIn(it.piece.opt, SIZES[it.shown]));
        cta.textContent = t('picked');
        setTimeout(() => this.close(), cssMs('--d-reveal', 800));
      });
      box.appendChild(cta);
    }

    const redo = h('button', 'unix-sf__back', t('redo'));
    redo.type = 'button';
    redo.addEventListener('click', () => { this.step = 'height'; this.render(); });
    box.appendChild(redo);
    box.appendChild(h('p', 'unix-sf__note', t('note')));
    body.appendChild(box);

    avail.forEach((it) => { this.markSuggested(it.piece.opt, SIZES[it.shown]); this.selectIn(it.piece.opt, SIZES[it.shown]); });
    body.querySelector('h2').focus({ preventScroll: true });
  }
}

/** One controller per [data-unix-sf] root. */
export default function sizeFinder(root) {
  if (!instances.has(root)) instances.set(root, new SizeFinder(root));
  return instances.get(root);
}
