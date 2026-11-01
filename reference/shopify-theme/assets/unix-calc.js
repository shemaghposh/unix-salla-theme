/* UNIX — Offers & pricing calculator (internal).
   Decrypts costs/assumptions with the password (PBKDF2-SHA256 + AES-GCM),
   joins them with the live store prices printed by Liquid, and recalculates
   every figure from the offer fields. Read-only: it changes nothing in the store. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var products = JSON.parse($('uc-products').textContent || '[]');
  var blobUrl = JSON.parse($('uc-blob-url').textContent), blob = null;
  var getBlob = function () { return blob ? Promise.resolve(blob) : fetch(blobUrl).then(function (r) { if (!r.ok) throw new Error('blob ' + r.status); return r.json(); }).then(function (b) { blob = b; return b; }); };
  var b64 = function (s) { return Uint8Array.from(atob(s), function (c) { return c.charCodeAt(0); }); };
  var nf2 = new Intl.NumberFormat('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var nf0 = new Intl.NumberFormat('en', { maximumFractionDigits: 0 });
  var sar = function (x) { return nf2.format(x) + ' ر.س'; };
  var pct = function (x) { return (Math.round(x * 10) / 10) + '%'; };

  async function decrypt(pw) {
    await getBlob();
    var base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']);
    var key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: b64(blob.salt), iterations: blob.iter, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    var buf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(blob.iv) }, key, b64(blob.ct));
    return JSON.parse(new TextDecoder().decode(buf));
  }

  async function tryOpen(pw, silent) {
    try {
      var data = await decrypt(pw);
      try { sessionStorage.setItem('uc_pw', pw); } catch (e) {}
      $('uc-lock').hidden = true; $('uc-app').hidden = false; start(data);
    } catch (e) { if (!silent) $('uc-err').hidden = false; }
  }
  $('uc-open').addEventListener('click', function () { tryOpen($('uc-pw').value); });
  $('uc-pw').addEventListener('keydown', function (e) { if (e.key === 'Enter') tryOpen($('uc-pw').value); });
  try { var saved = sessionStorage.getItem('uc_pw'); if (saved) tryOpen(saved, true); } catch (e) {}

  function start(data) {
    var A = data.assumptions, costs = data.costs;
    var fee = A.payment_fee + A.cashback + A.ads;
    var byH = {}; costs.forEach(function (c) { byH[c.handle] = c; });
    var rows = products.filter(function (p) { return byH[p.handle]; }).map(function (p) {
      var c = byH[p.handle], tc = c.unit_cost + A.overhead_per_piece * c.pieces;
      return { handle: p.handle, title: p.title, price: Number(p.price), line: c.line, family: c.family, tc: tc,
        be: Math.max(0, (1 - tc / (p.price * (1 - fee))) * 100), ms: Math.max(0, (1 - tc / (p.price * (1 - fee - A.target_margin))) * 100) };
    });
    var missing = products.filter(function (p) { return !byH[p.handle] && p.handle !== 'unix-gift-card'; });
    var st = { d: 20, scope: 'all', minq: 1, gift: '', giftmin: 600, ship: A.free_ship_threshold, q: '', sortK: 'net', dir: -1 };
    var basket = [];
    var econ = function (r, d) { var paid = r.price * (1 - d / 100), net = paid * (1 - fee) - r.tc; return { paid: paid, net: net, margin: paid > 0 ? net / paid * 100 : 0 }; };
    var inScope = function (r) { return st.scope === 'all' || (st.scope.indexOf('line:') === 0 ? r.line === st.scope.slice(5) : r.family === st.scope.slice(4)); };
    var opt = function (t, v) { var o = document.createElement('option'); o.textContent = t; o.value = v; return o; };
    var lines = [], fams = []; rows.forEach(function (r) { if (lines.indexOf(r.line) < 0) lines.push(r.line); if (fams.indexOf(r.family) < 0) fams.push(r.family); });
    var gifts = []; costs.forEach(function (c) { if (c.giftable && !gifts.some(function (g) { return g.family === c.family; })) gifts.push(c); });

    $('uc-app').innerHTML = [
      '<div><h1>حاسبة العروض والأسعار</h1><p class="take" id="tk"></p></div>',
      '<section class="card"><h2>العرض اللي عايزة تجربيه</h2><p class="note">غيّري أي خانة، وكل الأرقام تحت بتتحسب على طول من أسعار المتجر الحالية وتكلفة كل منتج.</p><div class="ctl">',
      '<label>نسبة الخصم ٪<input id="in-d" type="number" min="0" max="90" step="1"></label>',
      '<label>على أنهي منتجات<select id="in-scope"></select></label>',
      '<label>أقل عدد قطع عشان الخصم يتطبق<input id="in-minq" type="number" min="1" max="10" step="1"></label>',
      '<label>الهدية<select id="in-gift"></select></label>',
      '<label>الهدية لطلب فوق (ر.س)<input id="in-giftmin" type="number" min="0" step="50"></label>',
      '<label>الشحن مجاني فوق (ر.س)<input id="in-ship" type="number" min="0" step="50"></label>',
      '</div></section>',
      '<section class="grid">',
      '<div class="card kpi"><div class="lbl">متوسط الهامش بعد الخصم</div><div class="val" id="k-avg"></div><div class="sub">صافي، بعد التكلفة والمصاريف والإعلانات</div></div>',
      '<div class="card kpi"><div class="lbl">متوسط الربح في القطعة</div><div class="val" id="k-net"></div><div class="sub">ريال لكل قطعة مباعة</div></div>',
      '<div class="card kpi"><div class="lbl">أقل هامش</div><div class="val" id="k-min"></div><div class="sub" id="k-minname"></div></div>',
      '<div class="card kpi"><div class="lbl">منتجات بتخسر</div><div class="val" id="k-lose"></div><div class="sub" id="k-count"></div></div>',
      '</section>',
      '<section class="grid2"><div class="card"><h2>الهدية</h2><p class="note">تكلفتها على كل طلب بيوصل للحد.</p>',
      '<div class="rowline"><span>تكلفة الشراء</span><b id="g-cash">—</b></div><div class="rowline"><span>مع نصيب المصاريف</span><b id="g-full">—</b></div>',
      '<div class="rowline"><span>أقل طلب يغطي الهدية من ربحه</span><b id="g-cover">—</b></div><p class="note" id="g-note"></p></div>',
      '<div class="card"><h2>الافتراضات</h2><p class="note">ثابتة لكل الحسابات. قوليلي لو عايزة تغيّري أي رقم.</p><div id="assump"></div></div></section>',
      '<section class="card"><h2>سلة تجريبية</h2><p class="note">ضيفي منتجات، وشوفي ربح الطلب كله بعد الخصم والهدية والشحن.</p>',
      '<div class="bk"><select id="bk-prod"></select><input id="bk-qty" type="number" min="1" value="1" style="width:7rem"><button id="bk-add" type="button">أضيفي</button><button id="bk-clear" type="button" class="ghost">فضّي السلة</button></div>',
      '<div class="items" id="bk-items"></div><div id="bk-tot"></div></section>',
      '<section class="card"><h2>كل منتج بالعرض ده</h2><p class="note">نقطة الخسارة = الخصم اللي بعده المنتج بيخسر. الخصم الآمن = أعلى خصم والهامش فوق ' + pct(A.target_margin * 100) + '.</p>',
      '<input id="q" type="search" placeholder="دوّري على منتج" style="width:100%;margin-bottom:1rem"><div class="tbl"><table><thead><tr>',
      '<th data-k="title">المنتج</th><th data-k="price">السعر</th><th data-k="paid">بعد الخصم</th><th data-k="tc">التكلفة الكلية</th><th data-k="net">صافي الربح</th><th data-k="margin">الهامش</th><th data-k="be">نقطة الخسارة</th><th data-k="ms">الخصم الآمن</th>',
      '</tr></thead><tbody id="tb"></tbody></table></div><p class="note" id="miss"></p></section>'
    ].join('');

    var sc = $('in-scope'); sc.appendChild(opt('كل المنتجات', 'all'));
    lines.forEach(function (l) { sc.appendChild(opt('خط: ' + l, 'line:' + l)); });
    fams.forEach(function (f) { sc.appendChild(opt('مجموعة: ' + f, 'fam:' + f)); });
    var gs = $('in-gift'); gs.appendChild(opt('بدون هدية', '')); gifts.forEach(function (g) { gs.appendChild(opt(g.family, g.handle)); });
    var bp = $('bk-prod'); bp.appendChild(opt('اختاري منتج', ''));
    rows.forEach(function (r) { bp.appendChild(opt(r.title + ' · ' + nf0.format(r.price), r.handle)); });
    $('in-d').value = st.d; $('in-minq').value = st.minq; $('in-giftmin').value = st.giftmin; $('in-ship').value = st.ship;
    var num = function (id, k) { $(id).addEventListener('input', function () { var v = Number($(id).value); if (!isNaN(v)) { st[k] = v; draw(); } }); };
    num('in-d', 'd'); num('in-minq', 'minq'); num('in-giftmin', 'giftmin'); num('in-ship', 'ship');
    sc.addEventListener('change', function () { st.scope = sc.value; draw(); });
    gs.addEventListener('change', function () { st.gift = gs.value; draw(); });
    $('q').addEventListener('input', function () { st.q = $('q').value.trim(); drawTable(); });
    document.querySelectorAll('.uc th').forEach(function (th) { th.addEventListener('click', function () { var k = th.dataset.k; if (st.sortK === k) st.dir = -st.dir; else { st.sortK = k; st.dir = k === 'title' ? 1 : -1; } drawTable(); }); });
    $('bk-add').addEventListener('click', function () { var h = bp.value, q = Math.max(1, Number($('bk-qty').value) || 1); if (!h) return; var ex = basket.filter(function (x) { return x.h === h; })[0]; if (ex) ex.q += q; else basket.push({ h: h, q: q }); drawBasket(); });
    $('bk-clear').addEventListener('click', function () { basket = []; drawBasket(); });

    var as = $('assump');
    [['نصيب المصاريف لكل قطعة', sar(A.overhead_per_piece)], ['رسوم الدفع', pct(A.payment_fee * 100)], ['الكاش باك', pct(A.cashback * 100)], ['الإعلانات من كل بيعة', pct(A.ads * 100)], ['تكلفة الشحن لما يبقى مجاني', sar(A.ship_cost)], ['الهامش الآمن المستهدف', pct(A.target_margin * 100)]]
      .forEach(function (x) { var d = document.createElement('div'); d.className = 'rowline'; var s = document.createElement('span'); s.textContent = x[0]; var b = document.createElement('b'); b.textContent = x[1]; d.append(s, b); as.appendChild(d); });
    if (missing.length) $('miss').textContent = 'منتجات من غير تكلفة مسجلة (مش داخلة في الحساب): ' + missing.map(function (p) { return p.title; }).join('، ');

    var cls = function (m, net) { return net < 0 ? 'bad' : m < A.target_margin * 100 ? 'warn' : 'ok'; };
    var summary = function () {
      var rs = rows.filter(inScope); if (!rs.length) return null;
      var e = rs.map(function (r) { return { r: r, e: econ(r, st.d) }; });
      var min = e.reduce(function (a, b) { return b.e.margin < a.e.margin ? b : a; });
      return { n: rs.length, avg: e.reduce(function (s, x) { return s + x.e.margin; }, 0) / rs.length, net: e.reduce(function (s, x) { return s + x.e.net; }, 0) / rs.length,
        min: min.e.margin, minName: min.r.title, lose: e.filter(function (x) { return x.e.net < 0; }).length };
    };

    function drawTable() {
      var list = rows.filter(function (r) { return inScope(r) && (!st.q || r.title.indexOf(st.q) >= 0); }).map(function (r) { var e = econ(r, st.d); return Object.assign({}, r, e); });
      list.sort(function (a, b) { return (a[st.sortK] > b[st.sortK] ? 1 : a[st.sortK] < b[st.sortK] ? -1 : 0) * st.dir; });
      var tb = $('tb'); tb.textContent = '';
      list.forEach(function (r) {
        var tr = document.createElement('tr');
        [r.title, nf2.format(r.price), nf2.format(r.paid), nf2.format(r.tc), nf2.format(r.net), pct(r.margin), pct(r.be), pct(r.ms)].forEach(function (v, i) {
          var td = document.createElement('td'); td.textContent = v;
          if (i === 4 || i === 5) td.className = cls(r.margin, r.net);
          if (i === 7 && st.d > r.ms) td.className = 'warn';
          tr.appendChild(td);
        });
        tb.appendChild(tr);
      });
    }

    function drawBasket() {
      var list = $('bk-items'), tot = $('bk-tot'); list.textContent = ''; tot.textContent = '';
      basket.forEach(function (b, i) {
        var r = rows.filter(function (x) { return x.handle === b.h; })[0]; var d = document.createElement('div'); d.className = 'item';
        var t = document.createElement('span'); t.textContent = (r ? r.title : b.h) + ' × ' + b.q;
        var x = document.createElement('button'); x.type = 'button'; x.className = 'ghost'; x.textContent = 'شيل'; x.addEventListener('click', function () { basket.splice(i, 1); drawBasket(); });
        d.append(t, x); list.appendChild(d);
      });
      if (!basket.length) return;
      var qtyIn = basket.reduce(function (s, b) { var r = rows.filter(function (x) { return x.handle === b.h; })[0]; return s + (r && inScope(r) ? b.q : 0); }, 0);
      var applies = qtyIn >= st.minq, full = 0, paid = 0, net = 0;
      basket.forEach(function (b) { var r = rows.filter(function (x) { return x.handle === b.h; })[0]; if (!r) return; var e = econ(r, applies && inScope(r) ? st.d : 0); full += r.price * b.q; paid += e.paid * b.q; net += e.net * b.q; });
      var gift = 0, gname = '';
      if (st.gift && paid >= st.giftmin) { var g = byH[st.gift]; gift = g.unit_cost + A.overhead_per_piece * g.pieces; gname = g.family; }
      var ship = paid >= st.ship ? A.ship_cost : 0, fin = net - gift - ship;
      var line = function (k, v, c) { var d = document.createElement('div'); d.className = 'rowline'; var s = document.createElement('span'); s.textContent = k; var b = document.createElement('b'); b.textContent = v; if (c) b.className = c; d.append(s, b); tot.appendChild(d); };
      line('قيمة المنتجات قبل الخصم', sar(full));
      line(applies ? 'العميلة بتدفع (بعد خصم ' + st.d + '٪)' : 'العميلة بتدفع (الخصم مش متطبق: أقل من ' + st.minq + ' قطع)', sar(paid));
      line('ربح المنتجات بعد كل التكاليف', sar(net), net < 0 ? 'bad' : '');
      line(gift ? 'الهدية: ' + gname : 'الهدية', gift ? '− ' + sar(gift) : 'لا');
      line('الشحن على المتجر', ship ? '− ' + sar(ship) : 'العميلة بتدفعه');
      line('صافي ربح الطلب', sar(fin) + ' · ' + (paid ? pct(fin / paid * 100) : '—'), paid ? cls(fin / paid * 100, fin) : '');
    }

    function draw() {
      var s = summary(), scopeName = st.scope === 'all' ? 'كل المنتجات' : st.scope.split(':')[1];
      if (s) {
        $('k-avg').textContent = pct(s.avg); $('k-avg').className = 'val ' + cls(s.avg, s.avg);
        $('k-net').textContent = sar(s.net);
        $('k-min').textContent = pct(s.min); $('k-min').className = 'val ' + cls(s.min, s.min); $('k-minname').textContent = s.minName;
        $('k-lose').textContent = nf0.format(s.lose); $('k-lose').className = 'val ' + (s.lose ? 'bad' : 'ok'); $('k-count').textContent = 'من ' + s.n + ' منتج';
        $('tk').textContent = 'بخصم ' + st.d + '٪ على ' + scopeName + ': متوسط الهامش ' + pct(s.avg) + (s.lose ? '، و' + s.lose + ' منتج بيخسر.' : '، ومفيش منتج بيخسر.');
      }
      if (st.gift) {
        var g = byH[st.gift], full = g.unit_cost + A.overhead_per_piece * g.pieces;
        $('g-cash').textContent = sar(g.unit_cost); $('g-full').textContent = sar(full);
        if (s && s.avg > 0) { var need = full / (s.avg / 100); $('g-cover').textContent = sar(need);
          $('g-note').textContent = st.giftmin < need ? 'حد الهدية (' + nf0.format(st.giftmin) + ') أقل من اللي يغطيها: الطلب اللي على الحد بالظبط هيخسر في الهدية.' : 'حد الهدية (' + nf0.format(st.giftmin) + ') كفاية يغطي تكلفتها من ربح الطلب.';
        } else { $('g-cover').textContent = '—'; $('g-note').textContent = 'الهامش بالخصم ده مش كفاية يغطي أي هدية.'; }
      } else { $('g-cash').textContent = '—'; $('g-full').textContent = '—'; $('g-cover').textContent = '—'; $('g-note').textContent = 'اختاري هدية من فوق.'; }
      drawTable(); drawBasket();
    }
    draw();
  }
})();
