/* ============================================================
   UNIX — Size finder v2, model (ROADMAP 3.3)

   Faithful port of unix.sa `assets/unix-size-finder.js` (CONFIG +
   HELPERS + MODEL sections). Same inputs, same steps, same rounding,
   same thresholds. Pure functions only: no DOM, no Salla. The UI lives
   in `unix-size-finder.js` and is lazy-loaded on first open.

   Every table in DEFAULTS is unix.sa's data. The merchant can override
   any top-level key through the theme setting `unix_size_finder_data`
   (JSON textarea, twilight.json). Overrides are shallow-merged per key,
   so a merchant can replace e.g. only `BRANDS` or only `BODY`.
   (قرار مؤقت – محتاج مراجعة)

   Numbers marked START in the original are starting assumptions to be
   calibrated against UNIX's own keep/exchange data.
   ============================================================ */

export const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
export const STORE_KEY = 'unix_fit_v2';
export const QUIZ_VERSION = '2';

export const DEFAULTS = {
  // UK women's body chart for UNIX's labels (XS=UK6 ... XL=UK14), cm.
  BODY: {
    bust:      [80, 84, 88, 92, 97],
    underbust: [66, 70, 74, 78, 83],
    waist:     [62, 66, 70, 74, 79],
    hip:       [86, 90, 94, 98, 103],
  },
  // Comfy body targets (S..XL, no XS), derived from the Comfy 2026 chart.
  COMFY: {
    bust:      [null, 84, 88, 92, 96],
    waist:     [null, 66, 70, 74, 78],
    hip:       [null, 91, 95, 99, 103],
    underbust: [null, 70, 74, 78, 83],
  },
  // START: what a size in another brand implies on UNIX's ladder.
  BRANDS: {
    lululemon: { label: 'Lululemon', sizes: ['2', '4', '6', '8', '10', '12'], idx: [0, 1, 2, 3, 4, 5] },
    nike:      { label: 'Nike',      sizes: SIZES, offset: 0.2 },
    adidas:    { label: 'Adidas',    sizes: SIZES, offset: 0.2 },
    gymshark:  { label: 'Gymshark',  sizes: SIZES, offset: 0 },
    alo:       { label: 'Alo',       sizes: SIZES, offset: 0.3 },
    zara:      { label: 'Zara',      sizes: SIZES, offset: 0.3 },
    hm:        { label: 'H&M',       sizes: SIZES, offset: 0.2 },
  },
  // START: blend weights for each signal (re-normalised over what she gave).
  W: { brand: 0.45, usual: 0.35, body: 0.20 },
  // START: BMI -> position on the ladder.
  BMI_PTS: [[17, -0.6], [19, 0], [21, 1], [23, 2], [25.5, 3], [28.5, 4], [32, 5]],
  HEIGHT_C: [152, 157.5, 162.5, 167.5, 172.5, 178],
  WEIGHT_C: [47, 52.5, 57.5, 62.5, 67.5, 72.5, 77.5, 82.5, 88],
  BRA_BAND: { 32: 70, 34: 75, 36: 80, 38: 85, 40: 90 },
  BRA_CUP: { A: 12, B: 14, C: 16, D: 18, DD: 21 },
  // START: body-shape adjustments, cm.
  SHAPE: [
    { hip: 3 },   // hips wider than bust
    {},           // balanced
    { bust: 3 },  // bust wider than hips
    { waist: 4 }, // fuller tummy
  ],
  // Which measurements decide each category, and how much.
  CATS: {
    bra:       { w: { underbust: 0.6, bust: 0.4 }, pref: 'bra',      between: 'down-if-firm', min: 0 },
    topFitted: { w: { bust: 0.6, waist: 0.4 },     pref: 'fitted',   between: 'up',           min: 0 },
    leggings:  { w: { hip: 0.5, waist: 0.4 },      pref: 'compress', between: 'up',           min: 0, length: true },
    hoodie:    { w: { bust: 0.7, waist: 0.3 },     pref: 'relaxed',  between: 'up',           min: 0 },
    wide:      { w: { waist: 0.5, hip: 0.5 },      pref: 'waist',    between: 'up',           min: 0, length: true },
    comfyTop:  { w: { bust: 0.75, hip: 0.25 },     pref: 'comfy',    between: 'comfy',        min: 1, table: 'comfy' },
    comfyBot:  { w: { hip: 0.6, waist: 0.4 },      pref: 'comfy',    between: 'comfy',        min: 1, table: 'comfy', length: true },
  },
  // START: how far each fit preference moves the target, in size steps.
  PREF_SHIFT: { firm: -0.4, regular: 0, easy: 0.4 },
  COMFY_SHIFT: [-0.3, 0, 0.4],
  // Fit-note shift used when a product has no learned delta (snippet logic).
  FIT_NOTE_DELTA: 0.33,
};

/** Merge merchant JSON (string or object) over DEFAULTS, key by key. */
export function buildConfig(override) {
  let o = override;
  if (typeof o === 'string') {
    try { o = o.trim() ? JSON.parse(o) : null; } catch (e) { o = null; }
  }
  const cfg = {};
  Object.keys(DEFAULTS).forEach((k) => {
    cfg[k] = (o && o[k] != null && typeof o[k] === typeof DEFAULTS[k]) ? o[k] : DEFAULTS[k];
  });
  return cfg;
}

/* --------------------------------------------------------- HELPERS */

// value on a 5-step chart at fractional index x
export function interp(arr, x) {
  if (x <= 0) return arr[0] + (arr[1] - arr[0]) * x;
  if (x >= arr.length - 1) { const n = arr.length - 1; return arr[n] + (arr[n] - arr[n - 1]) * (x - n); }
  const i = Math.floor(x), f = x - i;
  return arr[i] + (arr[i + 1] - arr[i]) * f;
}
function sd(xs) {
  if (xs.length < 2) return 0;
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) * (b - m), 0) / xs.length);
}
function stepOfT(arr) {
  const v = arr.filter((x) => x != null);
  return (v[v.length - 1] - v[0]) / (v.length - 1);
}

/* ----------------------------------------------------------- MODEL */

export function createModel(cfg = DEFAULTS) {
  const { BODY, COMFY, BRANDS, W, BMI_PTS, HEIGHT_C, WEIGHT_C, BRA_BAND, BRA_CUP, SHAPE, CATS, PREF_SHIFT, COMFY_SHIFT } = cfg;

  function bodyFromIdx(x) {
    return { bust: interp(BODY.bust, x), underbust: interp(BODY.underbust, x), waist: interp(BODY.waist, x), hip: interp(BODY.hip, x) };
  }
  function bmiToIdx(b) {
    if (b <= BMI_PTS[0][0]) return BMI_PTS[0][1];
    for (let i = 1; i < BMI_PTS.length; i++) {
      if (b <= BMI_PTS[i][0]) {
        const a = BMI_PTS[i - 1], c = BMI_PTS[i];
        return a[1] + (c[1] - a[1]) * (b - a[0]) / (c[0] - a[0]);
      }
    }
    return BMI_PTS[BMI_PTS.length - 1][1];
  }

  // Returns { body:{bust,underbust,waist,hip}, signals:[{kind,idx,...}] }
  function estimateBody(p) {
    const signals = [];
    if (p.brand && BRANDS[p.brand] && p.brandSize != null) {
      const B = BRANDS[p.brand];
      const idx = B.idx ? B.idx[p.brandSize] : p.brandSize + (B.offset || 0);
      signals.push({ kind: 'brand', idx, w: W.brand, label: B.label, size: B.sizes[p.brandSize] });
    }
    if (p.usual != null) signals.push({ kind: 'usual', idx: p.usual, w: W.usual });
    if (p.height != null && p.weight != null) {
      const hM = HEIGHT_C[p.height] / 100, bmi = WEIGHT_C[p.weight] / (hM * hM);
      signals.push({ kind: 'body', idx: bmiToIdx(bmi), w: W.body });
    }
    if (!signals.length) signals.push({ kind: 'prior', idx: 2, w: 1 }); // nothing given: start at M

    const wsum = signals.reduce((a, s) => a + s.w, 0);
    const body = { bust: 0, underbust: 0, waist: 0, hip: 0 };
    signals.forEach((s) => {
      const b = bodyFromIdx(s.idx), k = s.w / wsum;
      Object.keys(body).forEach((m) => { body[m] += b[m] * k; });
    });

    const sh = p.shape != null ? SHAPE[p.shape] : null;
    if (sh) Object.keys(sh).forEach((m) => { body[m] += sh[m]; });

    // Bra size is blended 70/30 rather than taken raw.
    if (p.braBand && BRA_BAND[p.braBand]) {
      const ub = BRA_BAND[p.braBand];
      body.underbust = 0.7 * ub + 0.3 * body.underbust;
      if (p.braCup && BRA_CUP[p.braCup]) body.bust = 0.7 * (ub + BRA_CUP[p.braCup]) + 0.3 * body.bust;
      signals.push({ kind: 'bra', idx: null, label: p.braBand + (p.braCup || '') });
    }
    return { body, signals };
  }

  function targetsFor(cat) { return CATS[cat].table === 'comfy' ? COMFY : BODY; }

  function rankSizes(est, cat, prefIdx, delta) {
    const C = CATS[cat], TB = targetsFor(cat);
    const prefs = C.table === 'comfy' ? COMFY_SHIFT : [PREF_SHIFT.firm, PREF_SHIFT.regular, PREF_SHIFT.easy];
    const shift = prefs[prefIdx == null ? 1 : prefIdx] + (delta || 0);
    const out = [];
    for (let s = C.min; s < SIZES.length; s++) {
      let score = 0;
      Object.keys(C.w).forEach((k) => {
        const step = stepOfT(TB[k]);
        const eff = est.body[k] + shift * step; // easy fit -> treat body as larger
        score += C.w[k] * Math.abs(eff - TB[k][s]) / step;
      });
      out.push({ size: s, score });
    }
    out.sort((a, b) => a.score - b.score);
    return out;
  }

  function recommend(p, cat, prefIdx, delta) {
    const est = estimateBody(p);
    const rank = rankSizes(est, cat, prefIdx, delta);
    const best = rank[0], second = rank[1] || rank[0];
    const gap = second.score - best.score;
    const between = gap < 0.35 && Math.abs(second.size - best.size) === 1;

    const idxs = est.signals.filter((s) => s.idx != null && s.kind !== 'prior').map((s) => s.idx);
    const spread = sd(idxs);

    // When her answers disagree, give the closest size and say so.
    let choice = best.size;
    if (between && spread <= 1.1) {
      const rule = CATS[cat].between, lo = Math.min(best.size, second.size), hi = Math.max(best.size, second.size);
      if (rule === 'comfy') choice = (prefIdx === 2) ? hi : lo;
      else choice = (rule === 'down-if-firm' && prefIdx === 0) ? lo : hi;
    }

    let conf = 'mid';
    if (est.signals[0].kind === 'prior') conf = 'low';
    else if (spread > 1.1) conf = 'low';
    else if (!between && idxs.length >= 2 && spread <= 0.6) conf = 'high';
    else if (!between && idxs.length === 1 && est.signals[0].kind !== 'body') conf = 'mid';
    if (between && conf === 'high') conf = 'mid';

    return { size: choice, best: best.size, second: second.size, between, conf, est, cat };
  }

  // Category for one picker: read the picker's own label first (sets have
  // one picker per piece), then fall back to the product's category.
  function catFor(label, fallback, comfy) {
    const t = label || '';
    if (/صدري|bra/i.test(t)) return 'bra';
    if (/ليقنز|legging/i.test(t)) return 'leggings';
    if (/بنطلون|شورت|pant|short|bottom/i.test(t)) return comfy ? 'comfyBot' : 'wide';
    if (/هودي|hood/i.test(t)) return comfy ? 'comfyTop' : 'hoodie';
    if (/قميص|توب|تيشيرت|top|shirt|tee/i.test(t)) return comfy ? 'comfyTop' : 'topFitted';
    if (comfy) return (fallback === 'wide' || fallback === 'leggings' || fallback === 'comfyBot') ? 'comfyBot' : 'comfyTop';
    return fallback;
  }

  return { cfg, CATS, BRANDS, SIZES, estimateBody, rankSizes, recommend, catFor };
}

/**
 * Product category from the product type / name (snippet logic, Liquid
 * `product.type`). Salla has no product type, so the caller passes the
 * product name + category names. (قرار مؤقت – محتاج مراجعة)
 */
export function baseCatFromText(text) {
  const t = (text || '').toLowerCase();
  if (/legging|ليقنز|ليجنز/.test(t)) return 'leggings';
  if (/\bbra\b|صدري/.test(t)) return 'bra';
  if (/hood|هودي/.test(t)) return 'hoodie';
  if (/pant|short|jogger|بنطلون|شورت|جوقر|جوجر/.test(t)) return 'wide';
  return 'topFitted';
}

/** Profile persistence (same key as unix.sa so returning shoppers carry over). */
export function loadProfile() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || null; } catch (e) { return null; }
}
export function saveProfile(p) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch (e) { /* storage blocked */ }
}
export function hasProfile(p) {
  return !!p && (p.usual != null || p.brandSize != null || (p.height != null && p.weight != null));
}
