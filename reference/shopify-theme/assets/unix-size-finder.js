/* ============================================================
   UNIX — Size finder v2

   What changed from v1, and why (see the fit research, Oct 2026):

   1. Height + weight alone classify women's size correctly only about
      half the time (51.7% in a 677-woman study; 89.7% once bust, waist
      and hip are known). So weight is no longer the base signal. The
      engine now estimates body measurements in centimetres from several
      signals and blends them:
        - a reference brand + the size she wears there   (strongest)
        - her usual size                                  (strong)
        - height + weight, only if she chooses to share   (weak)
        - bra band and cup, for tops                      (overrides bust)
        - a body-shape answer                             (adjusts spread)
   2. Weight is optional and asked last, with "prefer not to say" given
      equal weight on screen. Saudi studies record real reluctance to
      disclose body measurements.
   3. Each size is scored per measurement that matters for the category
      (hip and waist for leggings, underbust and bust for bras, and so on)
      rather than one global number.
   4. Products with two size pickers (sets) get a separate answer for
      the top and the bottom.
   5. The answer explains itself, says when she is between sizes and
      which way to go for this category, and reports how confident it is.
   6. The profile is remembered, so every other product shows her size
      straight away, and each recommendation is written to the order as a
      hidden line-item property so returns can calibrate the model.

   All numbers marked START are starting assumptions to be calibrated
   against UNIX's own keep/exchange data. They are grouped in CONFIG.
   ============================================================ */

(function () {
  'use strict';

  /* ---------------------------------------------------------- CONFIG */

  var SIZES = ['XS', 'S', 'M', 'L', 'XL'];
  var STORE_KEY = 'unix_fit_v2';
  var QUIZ_VERSION = '2';

  // UK women's body chart for UNIX's labels (XS=UK6 ... XL=UK14), cm.
  // UNIX states these UK equivalents on every size chart, so the label
  // is anchored to the matching body measurements.
  var BODY = {
    bust:      [80, 84, 88, 92, 97],
    underbust: [66, 70, 74, 78, 83],
    waist:     [62, 66, 70, 74, 79],
    hip:       [86, 90, 94, 98, 103]
  };

  // Comfy body targets, derived from the Comfy 2026 size chart (garment,
  // half measurements x2). Comfy sizes are S..XL (index 1..4, no XS) on the
  // same UK labels as sport, but the cut leaves room at the hip:
  //   garment bust 86/90/94/98  -> body bust ~2 cm less (slim-fit ease)
  //   garment hips 96/100/104/108 -> body hips ~5 cm less (relaxed hip)
  //   garment waist 64..76 is elastic -> body waist up to ~2 cm more
  // So a pear-shaped body does NOT need to size up in Comfy.
  var COMFY = {
    bust:  [null, 84, 88, 92, 96],
    waist: [null, 66, 70, 74, 78],
    hip:   [null, 91, 95, 99, 103],
    underbust: [null, 70, 74, 78, 83]
  };

  // START: what a size in another brand implies on UNIX's ladder.
  // Positive offset = that brand runs small, so her body is a bit larger.
  var BRANDS = {
    lululemon: { label: 'Lululemon', sizes: ['2', '4', '6', '8', '10', '12'], idx: [0, 1, 2, 3, 4, 5] },
    nike:      { label: 'Nike',      sizes: SIZES, offset: 0.2 },
    adidas:    { label: 'Adidas',    sizes: SIZES, offset: 0.2 },
    gymshark:  { label: 'Gymshark',  sizes: SIZES, offset: 0 },
    alo:       { label: 'Alo',       sizes: SIZES, offset: 0.3 },
    zara:      { label: 'Zara',      sizes: SIZES, offset: 0.3 },
    hm:        { label: 'H&M',       sizes: SIZES, offset: 0.2 }
  };

  // START: blend weights for each signal (re-normalised over what she gave).
  var W = { brand: 0.45, usual: 0.35, body: 0.20 };

  // START: BMI -> position on the ladder. Anchored on Saudi survey means
  // (BMI ~25 with hips ~99 cm, i.e. around UK12).
  var BMI_PTS = [[17, -0.6], [19, 0], [21, 1], [23, 2], [25.5, 3], [28.5, 4], [32, 5]];

  var HEIGHT_C = [152, 157.5, 162.5, 167.5, 172.5, 178];
  var WEIGHT_C = [47, 52.5, 57.5, 62.5, 67.5, 72.5, 77.5, 82.5, 88];

  var BRA_BAND = { 32: 70, 34: 75, 36: 80, 38: 85, 40: 90 };
  var BRA_CUP  = { A: 12, B: 14, C: 16, D: 18, DD: 21 };

  // START: body-shape adjustments, cm.
  var SHAPE = [
    { hip: 3 },              // hips wider than bust
    {},                      // balanced
    { bust: 3 },             // bust wider than hips
    { waist: 4 }             // fuller tummy
  ];

  // Which measurements decide each category, and how much.
  var CATS = {
    bra:       { w: { underbust: 0.6, bust: 0.4 },  pref: 'bra',      between: 'down-if-firm', min: 0 },
    topFitted: { w: { bust: 0.6, waist: 0.4 },      pref: 'fitted',   between: 'up',           min: 0 },
    leggings:  { w: { hip: 0.5, waist: 0.4 },       pref: 'compress', between: 'up',           min: 0, length: true },
    hoodie:    { w: { bust: 0.7, waist: 0.3 },      pref: 'relaxed',  between: 'up',           min: 0 },
    wide:      { w: { waist: 0.5, hip: 0.5 },       pref: 'waist',    between: 'up',           min: 0, length: true },
    comfyTop:  { w: { bust: 0.75, hip: 0.25 },      pref: 'comfy',    between: 'comfy',        min: 1, table: 'comfy' },
    comfyBot:  { w: { hip: 0.6, waist: 0.4 },       pref: 'comfy',    between: 'comfy',        min: 1, table: 'comfy', length: true }
  };

  // START: how far each fit preference moves the target, in size steps.
  var PREF_SHIFT = { firm: -0.4, regular: 0, easy: 0.4 };
  // Comfy: "neat" leans a little smaller, "loose and flowing" a size-ish up.
  var COMFY_SHIFT = [-0.3, 0, 0.4];

  /* ------------------------------------------------------------ COPY */

  var T = {
    ar: {
      openNew: 'اعرفي مقاسك', openNewSub: 'أسئلة سريعة، أقل من ٢٠ ثانية',
      openKnown: function (s) { return 'مقاسك في هذه القطعة'; }, edit: 'تعديل',
      step: function (i, n) { return i + ' / ' + n; },
      back: 'رجوع', skip: 'تخطّي', close: 'إغلاق', think: 'نحسب مقاسك',
      qHeight: 'كم طولك؟', unitCm: 'سم',
      hHeight: ['أقل من ١٥٥', '١٥٥ إلى ١٦٠', '١٦٠ إلى ١٦٥', '١٦٥ إلى ١٧٠', '١٧٠ إلى ١٧٥', 'أكثر من ١٧٥'],
      qUsual: 'إيش المقاس اللي تلبسينه عادةً في الملابس الرياضية؟', dunno: 'ما أدري',
      qBrand: 'في أي ماركة تعرفين مقاسك بالضبط؟', qBrandHint: 'اختياري، بس يخلي التوصية أدق بكثير',
      qBrandSize: function (b) { return 'ومقاسك في ' + b + '؟'; },
      qShape: 'أي وصف أقرب لك؟',
      shapes: ['الورك أعرض من الصدر', 'متناسقة', 'الصدر أعرض من الورك', 'منطقة البطن أوضح شوي'],
      qBra: 'مقاس الصدرية اللي تلبسينه؟', qBraBand: 'المحيط', qBraCup: 'الكوب', braDunno: 'ما أعرف',
      qWeight: 'الوزن التقريبي', qWeightHint: 'اختياري. يساعدنا نكون أدق، وما يظهر لأحد.',
      hWeight: ['أقل من ٥٠', '٥٠ إلى ٥٥', '٥٥ إلى ٦٠', '٦٠ إلى ٦٥', '٦٥ إلى ٧٠', '٧٠ إلى ٧٥', '٧٥ إلى ٨٠', '٨٠ إلى ٨٥', 'أكثر من ٨٥'],
      noWeight: 'أفضّل ما أذكر',
      pref: {
        bra:      { q: 'مستوى الضمّ اللي تحبينه؟',       o: ['ضمّ قوي', 'متوسط', 'خفيف ومريح'] },
        fitted:   { q: 'كيف تحبين التوب على الجسم؟',     o: ['ملاصق', 'مضبوط', 'أوسع شوي'] },
        compress: { q: 'كيف تحبين الليقنز؟',             o: ['ضاغط ومشدود', 'مريح ومضبوط', 'أوسع شوي'] },
        relaxed:  { q: 'كيف تحبين القصّة؟',              o: ['على المقاس', 'مريحة', 'واسعة'] },
        waist:    { q: 'عند الخصر تحبينه…',              o: ['مشدود', 'مريح', 'واسع شوي'] },
        comfy:    { q: 'كيف تحبين لبس البيت؟',           o: ['على المقاس', 'مريح', 'واسع ومنسدل'] }
      },
      yourSize: 'مقاسك', top: 'العلوي', bottom: 'السفلي',
      conf: { high: 'ثقة عالية', mid: 'ثقة متوسطة', low: 'بين مقاسين' },
      pick: function (s) { return 'اختاري ' + s; }, picked: 'تم اختيار المقاس',
      redo: 'تعديل الإجابات',
      why: {
        brand: function (b, s, u) { return 'مقاسك ' + s + ' في ' + b + ' يقابل ' + u + ' عندنا'; },
        usual: function (s) { return 'مقاسك المعتاد ' + s; },
        bra:   function (b) { return 'مقاس صدريتك ' + b; },
        body:  'طولك ووزنك',
        pref:  function (p) { return 'وتفضيلك "' + p + '"'; }
      },
      between: function (a, b, c) { return 'أنتِ بين ' + a + ' و' + b + '. في هذه القطعة ننصح بـ ' + c + '.'; },
      betweenWhyUp: 'لراحة أكثر وتغطية أفضل عند الحركة',
      betweenWhyDown: 'لأنك تحبين الضمّ القوي',
      betweenWhyComfy: 'لأن قصّة الكومفي مريحة وواسعة أصلاً',
      lengthShort: 'طولك أقصر من الطول القياسي، فالحافة بتتجمّع شوي عند الكاحل.',
      lengthTall: 'مع طولك، ممكن يطلع أقصر شوي عند الكاحل.',
      soldout: function (a, b) { return 'مقاسك ' + a + ' خلصان حالياً، فاخترنا لك ' + b + ' كأقرب مقاس مريح.'; },
      gone: function (a) { return 'مقاسك ' + a + ' خلصان حالياً في هذا اللون، جرّبي لون ثاني أو تابعينا لما يرجع.'; },
      goneShort: 'خلصان',
      lowNote: 'إجاباتك تعطي إشارات مختلفة، فاخترنا الأقرب. لو تعرفين مقاسك في ماركة ثانية، أضيفيه لدقة أعلى.',
      note: 'مقاسك صار محفوظ عندنا، وبتلقينه جاهز في كل قطعة تفتحينها.',
      mark: 'مقترح'
    },
    en: {
      openNew: 'Find my size', openNewSub: 'A few quick questions, under 20 seconds',
      openKnown: function () { return 'Your size in this piece'; }, edit: 'Edit',
      step: function (i, n) { return i + ' / ' + n; },
      back: 'Back', skip: 'Skip', close: 'Close', think: 'Finding your size',
      qHeight: 'How tall are you?', unitCm: 'cm',
      hHeight: ['Under 155', '155 to 160', '160 to 165', '165 to 170', '170 to 175', 'Over 175'],
      qUsual: 'What size do you usually wear in activewear?', dunno: 'Not sure',
      qBrand: 'Which brand do you know your size in?', qBrandHint: 'Optional, but makes this much more accurate',
      qBrandSize: function (b) { return 'Your size in ' + b + '?'; },
      qShape: 'Which is closest to you?',
      shapes: ['Hips wider than bust', 'Balanced', 'Bust wider than hips', 'Fuller around the tummy'],
      qBra: 'Your bra size?', qBraBand: 'Band', qBraCup: 'Cup', braDunno: 'Not sure',
      qWeight: 'Approximate weight', qWeightHint: 'Optional. It helps us be precise and is never shown.',
      hWeight: ['Under 50', '50 to 55', '55 to 60', '60 to 65', '65 to 70', '70 to 75', '75 to 80', '80 to 85', 'Over 85'],
      noWeight: 'Prefer not to say',
      pref: {
        bra:      { q: 'How much support do you like?', o: ['Firm hold', 'Medium', 'Light and easy'] },
        fitted:   { q: 'How do you like tops to sit?',  o: ['Close', 'True to size', 'A little looser'] },
        compress: { q: 'How do you like leggings?',     o: ['Firm compression', 'Comfortable', 'A little looser'] },
        relaxed:  { q: 'How do you like the cut?',      o: ['Fitted', 'Comfortable', 'Roomy'] },
        waist:    { q: 'At the waist you prefer…',      o: ['Snug', 'Comfortable', 'Loose'] },
        comfy:    { q: 'How do you like loungewear?',   o: ['Neat', 'Comfortable', 'Loose and flowing'] }
      },
      yourSize: 'Your size', top: 'Top', bottom: 'Bottom',
      conf: { high: 'High confidence', mid: 'Medium confidence', low: 'Between sizes' },
      pick: function (s) { return 'Select ' + s; }, picked: 'Size selected',
      redo: 'Change answers',
      why: {
        brand: function (b, s, u) { return 'your ' + s + ' in ' + b + ' matches our ' + u; },
        usual: function (s) { return 'your usual ' + s; },
        bra:   function (b) { return 'your ' + b + ' bra'; },
        body:  'your height and weight',
        pref:  function (p) { return 'and your "' + p + '" preference'; }
      },
      between: function (a, b, c) { return 'You are between ' + a + ' and ' + b + '. In this piece we suggest ' + c + '.'; },
      betweenWhyUp: 'for more ease and coverage in movement',
      betweenWhyDown: 'because you like a firm hold',
      betweenWhyComfy: 'because the Comfy cut is already relaxed',
      lengthShort: 'You are shorter than the standard length, so the hem will gather a little at the ankle.',
      lengthTall: 'At your height it may sit slightly above the ankle.',
      soldout: function (a, b) { return 'Your size ' + a + ' is sold out, so we picked ' + b + ' as the closest comfortable fit.'; },
      gone: function (a) { return 'Your size ' + a + ' is sold out in this colour. Try another colour or check back soon.'; },
      goneShort: 'sold out',
      lowNote: 'Your answers point in different directions, so we chose the closest. Add a brand you know for more accuracy.',
      note: 'Your size is saved, so it is ready on every piece you open.',
      mark: 'Suggested'
    }
  };

  /* --------------------------------------------------------- HELPERS */

  function interp(arr, x) {             // value on a 5-step chart at fractional index x
    if (x <= 0) return arr[0] + (arr[1] - arr[0]) * x;
    if (x >= arr.length - 1) { var n = arr.length - 1; return arr[n] + (arr[n] - arr[n - 1]) * (x - n); }
    var i = Math.floor(x), f = x - i;
    return arr[i] + (arr[i + 1] - arr[i]) * f;
  }
  function stepOf(arr) { return (arr[arr.length - 1] - arr[0]) / (arr.length - 1); }
  function bodyFromIdx(x) {
    return { bust: interp(BODY.bust, x), underbust: interp(BODY.underbust, x), waist: interp(BODY.waist, x), hip: interp(BODY.hip, x) };
  }
  function bmiToIdx(b) {
    if (b <= BMI_PTS[0][0]) return BMI_PTS[0][1];
    for (var i = 1; i < BMI_PTS.length; i++) {
      if (b <= BMI_PTS[i][0]) {
        var a = BMI_PTS[i - 1], c = BMI_PTS[i];
        return a[1] + (c[1] - a[1]) * (b - a[0]) / (c[0] - a[0]);
      }
    }
    return BMI_PTS[BMI_PTS.length - 1][1];
  }
  function sd(xs) {
    if (xs.length < 2) return 0;
    var m = xs.reduce(function (a, b) { return a + b; }, 0) / xs.length;
    return Math.sqrt(xs.reduce(function (a, b) { return a + (b - m) * (b - m); }, 0) / xs.length);
  }
  function ar(n) { return String(n).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); }

  /* ----------------------------------------------------------- MODEL */

  // Returns { body:{bust,underbust,waist,hip}, signals:[{kind,idx,...}] }
  function estimateBody(p) {
    var signals = [];
    if (p.brand && BRANDS[p.brand] && p.brandSize != null) {
      var B = BRANDS[p.brand];
      var idx = B.idx ? B.idx[p.brandSize] : p.brandSize + (B.offset || 0);
      signals.push({ kind: 'brand', idx: idx, w: W.brand, label: B.label, size: B.sizes[p.brandSize] });
    }
    if (p.usual != null) signals.push({ kind: 'usual', idx: p.usual, w: W.usual });
    if (p.height != null && p.weight != null) {
      var hM = HEIGHT_C[p.height] / 100, bmi = WEIGHT_C[p.weight] / (hM * hM);
      signals.push({ kind: 'body', idx: bmiToIdx(bmi), w: W.body });
    }
    if (!signals.length) signals.push({ kind: 'prior', idx: 2, w: 1 });   // nothing given: start at M

    var wsum = signals.reduce(function (a, s) { return a + s.w; }, 0);
    var body = { bust: 0, underbust: 0, waist: 0, hip: 0 };
    signals.forEach(function (s) {
      var b = bodyFromIdx(s.idx), k = s.w / wsum;
      for (var m in body) body[m] += b[m] * k;
    });

    var sh = SHAPE[p.shape];
    if (sh) for (var m2 in sh) body[m2] += sh[m2];

    // Bra size is the best evidence for the chest, but band sizing varies
    // between brands too, so it is blended (70/30) rather than taken raw.
    if (p.braBand && BRA_BAND[p.braBand]) {
      var ub = BRA_BAND[p.braBand];
      body.underbust = 0.7 * ub + 0.3 * body.underbust;
      if (p.braCup && BRA_CUP[p.braCup]) body.bust = 0.7 * (ub + BRA_CUP[p.braCup]) + 0.3 * body.bust;
      signals.push({ kind: 'bra', idx: null, label: p.braBand + (p.braCup || '') });
    }
    return { body: body, signals: signals };
  }

  // Score every size for a category; returns ranked list.
  function targetsFor(cat) { return CATS[cat].table === 'comfy' ? COMFY : BODY; }
  function stepOfT(arr) { var v = arr.filter(function (x) { return x != null; }); return (v[v.length - 1] - v[0]) / (v.length - 1); }

  function rankSizes(est, cat, prefIdx, delta) {
    var C = CATS[cat], TB = targetsFor(cat);
    var prefs = C.table === 'comfy' ? COMFY_SHIFT : [PREF_SHIFT.firm, PREF_SHIFT.regular, PREF_SHIFT.easy];
    var shift = prefs[prefIdx == null ? 1 : prefIdx] + (delta || 0);
    var out = [];
    for (var s = C.min; s < SIZES.length; s++) {
      var score = 0;
      for (var k in C.w) {
        var step = stepOfT(TB[k]);
        var eff = est.body[k] + shift * step;         // easy fit -> treat body as larger
        score += C.w[k] * Math.abs(eff - TB[k][s]) / step;
      }
      out.push({ size: s, score: score });
    }
    out.sort(function (a, b) { return a.score - b.score; });
    return out;
  }

  function recommend(p, cat, prefIdx, delta) {
    var est = estimateBody(p);
    var rank = rankSizes(est, cat, prefIdx, delta);
    var best = rank[0], second = rank[1] || rank[0];
    var gap = second.score - best.score;
    var between = gap < 0.35 && Math.abs(second.size - best.size) === 1;

    var idxs = est.signals.filter(function (s) { return s.idx != null && s.kind !== 'prior'; }).map(function (s) { return s.idx; });
    var spread = sd(idxs);

    // When her answers disagree, do not stack a "size up" rule on top of
    // the uncertainty: give the closest size and say so.
    var choice = best.size;
    if (between && spread <= 1.1) {
      var rule = CATS[cat].between, lo = Math.min(best.size, second.size), hi = Math.max(best.size, second.size);
      if (rule === 'comfy') choice = (prefIdx === 2) ? hi : lo;
      else choice = (rule === 'down-if-firm' && prefIdx === 0) ? lo : hi;
    }

    var conf = 'mid';
    if (est.signals[0].kind === 'prior') conf = 'low';
    else if (spread > 1.1) conf = 'low';
    else if (!between && idxs.length >= 2 && spread <= 0.6) conf = 'high';
    else if (!between && idxs.length === 1 && est.signals[0].kind !== 'body') conf = 'mid';
    if (between && conf === 'high') conf = 'mid';

    return { size: choice, best: best.size, second: second.size, between: between, conf: conf, est: est, cat: cat };
  }

  /* ------------------------------------------------- PAGE INTEGRATION */

  function sizeFieldsets() {
    var out = [];
    var sets = document.querySelectorAll('fieldset.product-form__controls');
    for (var i = 0; i < sets.length; i++) {
      var lg = sets[i].querySelector('legend');
      var txt = lg ? lg.textContent : '';
      if (/مقاس|size/i.test(txt)) out.push({ el: sets[i], label: txt.trim() });
    }
    return out;
  }
  function radiosIn(fs) {
    var map = {}, inputs = fs.querySelectorAll('input[type="radio"]');
    for (var i = 0; i < inputs.length; i++) {
      var v = (inputs[i].value || '').trim().toUpperCase();
      if (SIZES.indexOf(v) > -1) map[v] = inputs[i];
    }
    return map;
  }
  function afterLoad(fn) {
    if (document.readyState === 'complete') setTimeout(fn, 400);
    else window.addEventListener('load', function () { setTimeout(fn, 400); }, { once: true });
  }
  function isAvailable(input) { return !input.disabled && !input.classList.contains('disabled'); }
  function nearestAvailable(map, idx, preferDown) {
    for (var d = 1; d < SIZES.length; d++) {
      var a = SIZES[preferDown ? idx - d : idx + d], b = SIZES[preferDown ? idx + d : idx - d];
      if (a && map[a] && isAvailable(map[a])) return SIZES.indexOf(a);
      if (b && map[b] && isAvailable(map[b])) return SIZES.indexOf(b);
    }
    return idx;
  }
  function selectIn(fs, sizeLabel) {
    var r = radiosIn(fs)[sizeLabel];
    if (r && !r.checked) { r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); }
    return !!r;
  }
  function markSuggested(fs, sizeLabel, word) {
    var old = fs.querySelectorAll('.unix-sf-mark'); for (var i = 0; i < old.length; i++) old[i].remove();
    var r = radiosIn(fs)[sizeLabel]; if (!r) return;
    var lab = fs.querySelector('label[for="' + r.id + '"]'); if (!lab) return;
    var m = document.createElement('span'); m.className = 'unix-sf-mark'; m.textContent = word;
    lab.appendChild(m);
  }
  // Hidden line-item properties: never shown to the shopper, kept on the order.
  function logToForm(formId, rec) {
    var form = formId ? document.getElementById(formId) : document.querySelector('form[action*="/cart/add"]');
    if (!form) return;
    var props = { _rec_size: rec, _quiz_v: QUIZ_VERSION };
    for (var k in props) {
      var name = 'properties[' + k + ']';
      var el = form.querySelector('input[name="' + name + '"]');
      if (!el) { el = document.createElement('input'); el.type = 'hidden'; el.name = name; form.appendChild(el); }
      el.value = props[k];
    }
  }

  // Category for one picker: read the picker's own label first (sets have
  // one picker per piece), then fall back to the product's category.
  function catFor(label, fallback, comfy) {
    var t = label || '';
    if (/صدري|bra/i.test(t)) return 'bra';
    if (/ليقنز|legging/i.test(t)) return 'leggings';
    if (/بنطلون|شورت|pant|short|bottom/i.test(t)) return comfy ? 'comfyBot' : 'wide';
    if (/هودي|hood/i.test(t)) return comfy ? 'comfyTop' : 'hoodie';
    if (/قميص|توب|تيشيرت|top|shirt|tee/i.test(t)) return comfy ? 'comfyTop' : 'topFitted';
    // Single pieces label their picker just "اختاري مقاسك", so fall back to
    // the product's own category, keeping it on the Comfy chart when needed.
    if (comfy) return (fallback === 'wide' || fallback === 'leggings' || fallback === 'comfyBot') ? 'comfyBot' : 'comfyTop';
    return fallback;
  }

  /* --------------------------------------------------------- STORAGE */

  function load() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || null; } catch (e) { return null; } }
  function save(p) { try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch (e) {} }

  /* -------------------------------------------------------------- UI */

  function h(tag, cls, text) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text != null) el.textContent = text;
    return el;
  }

  function init(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = '1';

    var L = T[root.dataset.lang === 'en' ? 'en' : 'ar'];
    var comfy = root.dataset.chart === 'comfy';
    var baseCat = root.dataset.cat || 'topFitted';
    var delta = parseFloat(root.dataset.delta || '0') || 0;     // learned per-product shift, in steps
    var formId = root.dataset.form || '';
    var open = root.querySelector('[data-sf-open]');
    var panel = root.querySelector('[data-sf-panel]');
    var scrim = null;

    // The pieces on this product page, each with its own category.
    function pieces() {
      var fss = sizeFieldsets();
      if (!fss.length) return [];
      return fss.map(function (f) { return { fs: f.el, label: f.label, cat: catFor(f.label, baseCat, comfy) }; });
    }
    function primaryCat() { var p = pieces(); return p.length ? p[0].cat : baseCat; }
    function needsBra() { return pieces().some(function (p) { return p.cat === 'bra' || p.cat === 'topFitted'; }); }

    // If she taps a size herself, stop auto-selecting on her behalf.
    document.addEventListener('change', function (e) {
      if (e.isTrusted && e.target && e.target.closest && e.target.closest('fieldset.product-form__controls')) root.dataset.touched = '1';
    }, true);

    var profile = load() || {};
    profile.prefs = profile.prefs || {};

    /* ---------- entry row ---------- */
    function renderEntry() {
      open.innerHTML = '';
      var ico = h('span', 'unix-sf__ico'); ico.setAttribute('aria-hidden', 'true');
      ico.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="2.5" y="8" width="19" height="8" rx="1"/><path d="M6 8v3M9.5 8v2M13 8v3M16.5 8v2M20 8v3"/></svg>';
      var txt = h('span', 'unix-sf__txt');
      var known = hasProfile();
      if (known) {
        var res = currentResults();
        var sizes = res.map(function (r) { return SIZES[r.shown] + (r.soldOut ? ' (' + L.goneShort + ')' : ''); });
        var uniq = sizes.filter(function (v, i) { return sizes.indexOf(v) === i; });
        txt.appendChild(h('span', 'unix-sf__t1', L.openKnown() + ': ' + uniq.join(' / ')));
        txt.appendChild(h('span', 'unix-sf__t2', L.edit));
        res.forEach(function (r) { if (!r.soldOut) markSuggested(r.fs, SIZES[r.shown], L.mark); });
        // Pre-select only after the page (and the colour-swatch app, which
        // listens to the same change event) has finished loading, and only
        // if she has not picked a size by hand in the meantime.
        afterLoad(function () {
          if (root.dataset.touched) return;
          res.forEach(function (r) { if (!r.soldOut) selectIn(r.fs, SIZES[r.shown]); });
        });
      } else {
        txt.appendChild(h('span', 'unix-sf__t1', L.openNew));
        txt.appendChild(h('span', 'unix-sf__t2', L.openNewSub));
      }
      open.appendChild(ico); open.appendChild(txt);
      open.appendChild(h('span', 'unix-sf__chev'));
    }

    function hasProfile() {
      return profile.usual != null || profile.brandSize != null || (profile.height != null && profile.weight != null);
    }

    function currentResults() {
      return pieces().map(function (pc) {
        var prefKey = CATS[pc.cat].pref;
        var r = recommend(profile, pc.cat, profile.prefs[prefKey], delta);
        var map = radiosIn(pc.fs), shown = r.size, swapped = false, soldOut = false;
        if (map[SIZES[shown]] && !isAvailable(map[SIZES[shown]])) {
          // Only ever offer the next size up or down: an S customer must
          // never be pointed at an XL just because it is in stock.
          // Size up one step by default (a little roomy still gets worn);
          // size down only if she asked for a close fit.
          var wantsClose = profile.prefs[prefKey] === 0;
          var up = SIZES[shown + 1], dn = SIZES[shown - 1];
          if (!wantsClose && up && map[up] && isAvailable(map[up])) { shown = shown + 1; swapped = true; }
          else if (wantsClose && dn && map[dn] && isAvailable(map[dn])) { shown = shown - 1; swapped = true; }
          else soldOut = true;
        }
        return { piece: pc, fs: pc.fs, r: r, shown: shown, swapped: swapped, soldOut: soldOut };
      });
    }

    /* ---------- the sheet ---------- */
    function isPhone() { return window.matchMedia && window.matchMedia('(max-width: 749px)').matches; }
    function show() {
      panel.hidden = false; root.classList.add('is-open'); open.setAttribute('aria-expanded', 'true');
      if (isPhone()) {
        scrim = h('div', 'unix-sf__scrim'); scrim.addEventListener('click', collapse);
        document.body.appendChild(scrim); document.documentElement.classList.add('unix-sf-lock');
      }
    }
    function collapse() {
      panel.hidden = true; root.classList.remove('is-open'); open.setAttribute('aria-expanded', 'false');
      if (scrim) { scrim.remove(); scrim = null; }
      document.documentElement.classList.remove('unix-sf-lock');
      renderEntry();
    }

    /* ---------- steps ---------- */
    var steps, step;
    function buildSteps() {
      var s = ['height', 'usual', 'brand'];
      if (profile.brand) s.push('brandSize');
      s.push('shape');
      if (needsBra()) s.push('bra');
      s.push('weight', 'pref');
      return s;
    }

    function head() {
      var hd = h('div', 'unix-sf__head');
      var n = steps.length, i = steps.indexOf(step) + 1;
      hd.appendChild(h('span', 'unix-sf__step', root.dataset.lang === 'en' ? L.step(i, n) : L.step(ar(i), ar(n))));
      var x = h('button', 'unix-sf__close'); x.type = 'button'; x.setAttribute('aria-label', L.close);
      x.addEventListener('click', collapse); hd.appendChild(x);
      var bar = h('div', 'unix-sf__bar');
      for (var k = 0; k < n; k++) { var seg = h('i'); if (k < i) seg.className = 'is-on'; bar.appendChild(seg); }
      var f = document.createDocumentFragment(); f.appendChild(hd); f.appendChild(bar); return f;
    }

    function chips(list, cols, current, onPick, extraCls) {
      var g = h('div', 'unix-sf__chips'); g.setAttribute('data-cols', cols);
      list.forEach(function (label, i) {
        var c = h('button', 'unix-sf__chip' + (extraCls ? ' ' + extraCls : ''), label); c.type = 'button';
        if (current === i) c.classList.add('is-on');
        c.addEventListener('click', function () { onPick(i); });
        g.appendChild(c);
      });
      return g;
    }
    function wideChip(label, isOn, onPick, prominent) {
      var c = h('button', 'unix-sf__chip unix-sf__chip--wide' + (prominent ? ' is-prominent' : ''), label); c.type = 'button';
      if (isOn) c.classList.add('is-on');
      c.addEventListener('click', onPick); return c;
    }

    function next() {
      steps = buildSteps();
      var i = steps.indexOf(step);
      if (i < steps.length - 1) { step = steps[i + 1]; render(); } else { finish(); }
    }
    function prev() {
      steps = buildSteps();
      var i = steps.indexOf(step);
      if (i > 0) { step = steps[i - 1]; render(); }
    }

    function render() {
      steps = buildSteps();
      panel.innerHTML = '';
      panel.appendChild(head());
      var body = h('div', 'unix-sf__body');
      var Q = function (q, hint) { body.appendChild(h('p', 'unix-sf__q', q)); if (hint) body.appendChild(h('p', 'unix-sf__hint', hint)); };

      if (step === 'height') {
        Q(L.qHeight, L.unitCm);
        body.appendChild(chips(L.hHeight, 2, profile.height, function (i) { profile.height = i; next(); }));
      }
      if (step === 'usual') {
        Q(L.qUsual);
        body.appendChild(chips(SIZES, 5, profile.usual, function (i) { profile.usual = i; next(); }, 'is-size'));
        body.appendChild(wideChip(L.dunno, profile.usual === null && profile._usualAnswered, function () { profile.usual = null; profile._usualAnswered = true; next(); }));
      }
      if (step === 'brand') {
        Q(L.qBrand, L.qBrandHint);
        var keys = Object.keys(BRANDS), labels = keys.map(function (k) { return BRANDS[k].label; });
        body.appendChild(chips(labels, 3, keys.indexOf(profile.brand), function (i) { profile.brand = keys[i]; profile.brandSize = null; next(); }));
        body.appendChild(wideChip(L.skip, false, function () { profile.brand = null; profile.brandSize = null; next(); }));
      }
      if (step === 'brandSize') {
        var B = BRANDS[profile.brand];
        Q(L.qBrandSize(B.label));
        body.appendChild(chips(B.sizes, B.sizes.length > 5 ? 3 : 5, profile.brandSize, function (i) { profile.brandSize = i; next(); }, 'is-size'));
      }
      if (step === 'shape') {
        Q(L.qShape);
        var g = h('div', 'unix-sf__chips unix-sf__shapes'); g.setAttribute('data-cols', 2);
        L.shapes.forEach(function (label, i) {
          var c = h('button', 'unix-sf__chip unix-sf__chip--shape'); c.type = 'button';
          c.innerHTML = shapeSvg(i); c.appendChild(h('span', '', label));
          if (profile.shape === i) c.classList.add('is-on');
          c.addEventListener('click', function () { profile.shape = i; next(); });
          g.appendChild(c);
        });
        body.appendChild(g);
        body.appendChild(wideChip(L.skip, false, function () { profile.shape = null; next(); }));
      }
      if (step === 'bra') {
        Q(L.qBra);
        body.appendChild(h('p', 'unix-sf__sub', L.qBraBand));
        var bands = ['32', '34', '36', '38', '40'];
        body.appendChild(chips(bands, 5, bands.indexOf(String(profile.braBand)), function (i) { profile.braBand = +bands[i]; render(); }, 'is-size'));
        body.appendChild(h('p', 'unix-sf__sub', L.qBraCup));
        var cups = ['A', 'B', 'C', 'D', 'DD+'], cupKeys = ['A', 'B', 'C', 'D', 'DD'];
        body.appendChild(chips(cups, 5, cupKeys.indexOf(profile.braCup), function (i) { profile.braCup = cupKeys[i]; if (profile.braBand) next(); else render(); }, 'is-size'));
        body.appendChild(wideChip(L.braDunno, false, function () { profile.braBand = null; profile.braCup = null; next(); }));
      }
      if (step === 'weight') {
        Q(L.qWeight, L.qWeightHint);
        body.appendChild(chips(L.hWeight, 3, profile.weight, function (i) { profile.weight = i; next(); }));
        body.appendChild(wideChip(L.noWeight, profile.weight === null && profile._weightAnswered, function () { profile.weight = null; profile._weightAnswered = true; next(); }, true));
      }
      if (step === 'pref') {
        var key = CATS[primaryCat()].pref, P = L.pref[key];
        Q(P.q);
        body.appendChild(chips(P.o, 1, profile.prefs[key], function (i) {
          // one answer applies to every piece on the page
          pieces().forEach(function (pc) { profile.prefs[CATS[pc.cat].pref] = i; });
          profile.prefs[key] = i; next();
        }, 'is-row'));
      }

      if (steps.indexOf(step) > 0) {
        var b = h('button', 'unix-sf__back', L.back); b.type = 'button';
        b.addEventListener('click', prev); body.appendChild(b);
      }
      panel.appendChild(body);
    }

    function finish() {
      save(profile);
      panel.innerHTML = '';
      var t = h('div', 'unix-sf__think'); t.appendChild(h('p', '', L.think)); t.appendChild(h('span', 'unix-sf__line'));
      panel.appendChild(t);
      setTimeout(result, 800);
    }

    function prefLabelFor(cat) {
      var key = CATS[cat].pref, i = profile.prefs[key];
      return i == null ? null : L.pref[key].o[i];
    }

    function explain(r) {
      var parts = [], s = r.est.signals;
      s.forEach(function (x) {
        if (x.kind === 'brand') parts.push(L.why.brand(x.label, x.size, SIZES[Math.max(0, Math.min(4, Math.round(x.idx)))]));
        if (x.kind === 'usual') parts.push(L.why.usual(SIZES[x.idx]));
        if (x.kind === 'bra') parts.push(L.why.bra(x.label));
        if (x.kind === 'body') parts.push(L.why.body);
      });
      var p = prefLabelFor(r.cat); if (p) parts.push(L.why.pref(p));
      return parts.join(root.dataset.lang === 'en' ? ', ' : '، ');
    }

    function result() {
      var res = currentResults();
      panel.innerHTML = '';
      var hd = h('div', 'unix-sf__head'); hd.appendChild(h('span', 'unix-sf__step', ''));
      var x = h('button', 'unix-sf__close'); x.type = 'button'; x.setAttribute('aria-label', L.close);
      x.addEventListener('click', collapse); hd.appendChild(x); panel.appendChild(hd);

      var box = h('div', 'unix-sf__result'); box.setAttribute('aria-live', 'polite');
      var tiles = h('div', 'unix-sf__tiles');
      res.forEach(function (it, n) {
        var tile = h('div', 'unix-sf__tile');
        if (res.length > 1) tile.appendChild(h('span', 'unix-sf__tlabel', it.piece.label));
        else tile.appendChild(h('span', 'unix-sf__tlabel', L.yourSize));
        var big = h('bdi', 'unix-sf__size', SIZES[it.shown]); tile.appendChild(big);
        tile.appendChild(h('span', 'unix-sf__conf is-' + (it.soldOut ? 'gone' : it.r.conf), it.soldOut ? L.goneShort : L.conf[it.r.conf]));
        tiles.appendChild(tile);
      });
      box.appendChild(tiles);

      var first = res[0];
      if (first) {
        var lines = [];
        lines.push(explain(first.r) + '.');
        res.forEach(function (it) {
          if (it.soldOut) lines.push(L.gone(SIZES[it.r.size]));
          else if (it.swapped) lines.push(L.soldout(SIZES[it.r.size], SIZES[it.shown]));
          else if (it.r.between) {
            var lo = SIZES[Math.min(it.r.best, it.r.second)], hi = SIZES[Math.max(it.r.best, it.r.second)];
            var isComfy = CATS[it.r.cat].table === 'comfy';
            var why = SIZES[it.r.size] === lo ? (isComfy ? L.betweenWhyComfy : L.betweenWhyDown) : L.betweenWhyUp;
            lines.push(L.between(lo, hi, SIZES[it.r.size]) + ' ' + why + '.');
          }
          if (CATS[it.r.cat].length && profile.height != null) {
            if (profile.height === 0) lines.push(L.lengthShort);
            if (profile.height === 5) lines.push(L.lengthTall);
          }
          if (it.r.conf === 'low' && !it.r.between) lines.push(L.lowNote);
        });
        var uniq = lines.filter(function (v, i) { return lines.indexOf(v) === i; });
        uniq.forEach(function (l) { box.appendChild(h('p', 'unix-sf__why', l)); });
      }

      var avail = res.filter(function (it) { return !it.soldOut; });
      if (avail.length) {
        var cta = h('button', 'unix-sf__cta', L.pick(avail.map(function (it) { return SIZES[it.shown]; }).filter(function (v, i, a) { return a.indexOf(v) === i; }).join(' / ')));
        cta.type = 'button';
        cta.addEventListener('click', function () {
          avail.forEach(function (it) { selectIn(it.fs, SIZES[it.shown]); });
          cta.textContent = L.picked; cta.classList.add('is-done');
          setTimeout(collapse, 650);
        });
        box.appendChild(cta);
      }

      var redo = h('button', 'unix-sf__back', L.redo); redo.type = 'button';
      redo.addEventListener('click', function () { step = 'height'; render(); });
      box.appendChild(redo);
      box.appendChild(h('p', 'unix-sf__note', L.note));
      panel.appendChild(box);

      avail.forEach(function (it) { markSuggested(it.fs, SIZES[it.shown], L.mark); selectIn(it.fs, SIZES[it.shown]); });
      logToForm(formId, res.map(function (it) { return SIZES[it.shown] + ':' + it.r.conf; }).join(','));
    }

    open.addEventListener('click', function () {
      if (!panel.hidden) { collapse(); return; }
      show();
      if (hasProfile()) { result(); } else { step = 'height'; render(); }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) collapse(); });

    renderEntry();
  }

  // Abstract torso outlines: shoulder, waist and hip widths per shape.
  function shapeSvg(i) {
    var f = [[15, 10, 21], [17, 11, 17], [21, 11, 15], [17, 16, 18]][i];
    var cx = 22, y0 = 5, y1 = 22, y2 = 38, y3 = 44;
    function side(s) {
      return 'M' + (cx + s * f[0] / 2) + ' ' + y0 +
             ' C' + (cx + s * f[0] / 2) + ' ' + (y0 + 8) + ' ' + (cx + s * f[1] / 2) + ' ' + (y1 - 6) + ' ' + (cx + s * f[1] / 2) + ' ' + y1 +
             ' C' + (cx + s * f[1] / 2) + ' ' + (y1 + 6) + ' ' + (cx + s * f[2] / 2) + ' ' + (y2 - 7) + ' ' + (cx + s * f[2] / 2) + ' ' + y2 +
             ' L' + (cx + s * f[2] / 2 - s * 1.5) + ' ' + y3;
    }
    var neck = 'M' + (cx - 3) + ' 1 L' + (cx - 3) + ' ' + y0 + ' L' + (cx - f[0] / 2) + ' ' + y0 +
               ' M' + (cx + 3) + ' 1 L' + (cx + 3) + ' ' + y0 + ' L' + (cx + f[0] / 2) + ' ' + y0;
    return '<svg class="unix-sf__fig" viewBox="0 0 44 46" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
           '<path d="' + neck + '"/><path d="' + side(-1) + '"/><path d="' + side(1) + '"/></svg>';
  }

  // Exposed for testing and for the calibration sheet.
  window.UnixFit = { recommend: recommend, estimateBody: estimateBody, SIZES: SIZES, CATS: CATS };

  function scan() {
    var roots = document.querySelectorAll('[data-unix-sf]');
    for (var i = 0; i < roots.length; i++) init(roots[i]);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan); else scan();
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
})();
