/* UNIX — National Day gift-with-purchase: keep the cart in step with the
   four automatic Buy-X-Get-Y discounts and draw the progress bar.

   What Shopify does on its own: prices the gift at zero IF it is in the
   cart and the spend threshold is met. What it does not do: put the gift
   there. This script closes that gap.

   Rules:
   - spend is the cart subtotal excluding gift lines
   - one tier only, the highest reached; lower gifts are removed
   - gift lines carry the private property _unix_nd_gift so a bottle the
     shopper bought on purpose is never touched
   - every cart mutation is idempotent and guarded against loops
   - if the theme exposes cart-drawer.renderContents (Dawn lineage) it is
     used to redraw the drawer; otherwise the bar redraws itself only

   Failure mode is silent: if /cart.js cannot be read or the container is
   missing, nothing is changed and the cart behaves as before. */

(function () {
  'use strict';

  var PROP = '_unix_nd_gift';
  var busy = false;
  var lastKey = '';

  function root() { return document.querySelector('[data-unix-nd]'); }

  function tiers() {
    var el = root();
    if (!el) return [];
    try { return JSON.parse(el.getAttribute('data-tiers')); } catch (e) { return []; }
  }

  function isAr() {
    var el = root();
    return el && el.getAttribute('data-lang') === 'true';
  }

  function decode(s) {
    var t = document.createElement('textarea'); t.innerHTML = s; return t.value;
  }

  function money(n) {
    var v = Math.max(0, Math.ceil(n));
    return isAr() ? (v + ' ر.س') : (v + ' SAR');
  }

  function getCart() {
    return fetch('/cart.js', { credentials: 'same-origin' }).then(function (r) { return r.json(); });
  }

  function isGiftLine(item) {
    return !!(item.properties && item.properties[PROP]);
  }

  function spendOf(cart) {
    return cart.items.reduce(function (sum, it) {
      return isGiftLine(it) ? sum : sum + it.original_line_price;
    }, 0) / 100;
  }

  function tierFor(spend, list) {
    var hit = null;
    list.forEach(function (t) { if (spend >= t.min) hit = t; });
    return hit;
  }

  function nextTier(spend, list) {
    for (var i = 0; i < list.length; i++) if (spend < list[i].min) return list[i];
    return null;
  }

  function redraw(cart) {
    var el = root();
    if (!el) return;
    var list = tiers();
    var spend = spendOf(cart);
    var cur = tierFor(spend, list);
    var nxt = nextTier(spend, list);
    var ar = isAr();

    var title = el.querySelector('[data-unix-nd-title]');
    var note  = el.querySelector('[data-unix-nd-note]');
    var fill  = el.querySelector('[data-unix-nd-fill]');

    var top = list[list.length - 1].min;
    var pct = Math.min(100, Math.round((spend / top) * 100));
    if (fill) fill.style.width = pct + '%';

    if (cur && !nxt) {
      el.classList.add('is-max');
      title.textContent = ar ? ('هديتك: ' + decode(cur.ar)) : ('Your gift: ' + decode(cur.en));
      note.textContent  = ar ? 'مضافة للسلة مجانًا بمناسبة اليوم الوطني' : 'Added to your cart free for National Day';
      return;
    }
    el.classList.remove('is-max');
    var gap = nxt ? nxt.min - spend : 0;
    if (cur) {
      title.textContent = ar ? ('هديتك: ' + decode(cur.ar)) : ('Your gift: ' + decode(cur.en));
      note.textContent  = ar
        ? ('أضيفي ' + money(gap) + ' لترتقي هديتك إلى ' + decode(nxt.ar))
        : ('Add ' + money(gap) + ' to upgrade to ' + decode(nxt.en));
    } else {
      title.textContent = ar ? 'هدية مع طلبك' : 'A gift with your order';
      note.textContent  = ar
        ? ('أضيفي ' + money(gap) + ' وتحصلين على ' + decode(nxt.ar) + ' هدية')
        : ('Add ' + money(gap) + ' and get ' + decode(nxt.en) + ' free');
    }
  }

  function tagLines(cart) {
    // mark gift rows so the CSS can label them and hide the quantity control
    var rows = document.querySelectorAll('.cart-item[data-variant-id]');
    var giftIds = {};
    cart.items.forEach(function (it) { if (isGiftLine(it)) giftIds[String(it.variant_id)] = true; });
    Array.prototype.forEach.call(rows, function (row) {
      if (giftIds[row.getAttribute('data-variant-id')]) row.setAttribute('data-unix-gift', '');
      else row.removeAttribute('data-unix-gift');
    });
  }

  function refreshDrawer(state) {
    var drawer = document.querySelector('cart-drawer');
    if (drawer && typeof drawer.renderContents === 'function' && state && state.sections) {
      try { drawer.renderContents(state); } catch (e) {}
    }
    if (window.publish && window.PUB_SUB_EVENTS) {
      try { window.publish(window.PUB_SUB_EVENTS.cartUpdate, { source: 'unix-nd-gift' }); } catch (e) {}
    }
  }

  function post(url, body) {
    return fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (r) { return r.json(); });
  }

  function reconcile(cart) {
    var list = tiers();
    if (!list.length) return Promise.resolve(cart);

    var spend = spendOf(cart);
    var want = tierFor(spend, list);
    var wantIds = want ? want.variants.map(String) : [];

    var giftLines = cart.items.filter(isGiftLine);
    var haveIds = giftLines.map(function (it) { return String(it.variant_id); });

    var key = spend + '|' + wantIds.join(',') + '|' + haveIds.sort().join(',');
    if (key === lastKey) return Promise.resolve(cart);
    lastKey = key;

    // remove gift lines that no longer belong (wrong tier, or duplicates)
    var updates = {};
    var seen = {};
    giftLines.forEach(function (it) {
      var id = String(it.variant_id);
      var keep = wantIds.indexOf(id) > -1 && !seen[id];
      if (keep) { seen[id] = true; if (it.quantity !== 1) updates[it.key] = 1; }
      else updates[it.key] = 0;
    });

    var toAdd = wantIds.filter(function (id) { return !seen[id]; });

    var chain = Promise.resolve();
    if (Object.keys(updates).length) {
      chain = chain.then(function () { return post('/cart/update.js', { updates: updates }); });
    }
    if (toAdd.length) {
      chain = chain.then(function () {
        var items = toAdd.map(function (id) {
          var p = {}; p[PROP] = '1';
          return { id: Number(id), quantity: 1, properties: p };
        });
        return post('/cart/add.js', { items: items, sections: 'cart-drawer,cart-icon-bubble' });
      }).then(function (state) { refreshDrawer(state); });
    } else if (Object.keys(updates).length) {
      chain = chain.then(function () {
        return fetch('/?sections=cart-drawer,cart-icon-bubble', { credentials: 'same-origin' })
          .then(function (r) { return r.json(); })
          .then(function (sections) { refreshDrawer({ sections: sections }); });
      });
    }
    return chain.then(getCart);
  }

  function run() {
    if (busy || !root()) return;
    busy = true;
    getCart()
      .then(reconcile)
      .then(function (cart) { redraw(cart); tagLines(cart); })
      .catch(function () {})
      .then(function () { busy = false; });
  }

  // initial + whenever the cart changes
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();

  if (window.subscribe && window.PUB_SUB_EVENTS) {
    try {
      window.subscribe(window.PUB_SUB_EVENTS.cartUpdate, function (e) {
        if (e && e.source === 'unix-nd-gift') return;
        setTimeout(run, 150);
      });
    } catch (err) {}
  }

  // the drawer is re-rendered from Liquid on most updates; re-attach then
  var mo = new MutationObserver(function () { setTimeout(run, 50); });
  var drawerEl = document.querySelector('cart-drawer');
  if (drawerEl) mo.observe(drawerEl, { childList: true, subtree: true });

  // catch add-to-cart from product pages that bypass pub/sub
  var origFetch = window.fetch;
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    var p = origFetch.apply(this, arguments);
    if (/\/cart\/(add|change|update|clear)/.test(url) && !(init && init.body && String(init.body).indexOf(PROP) > -1)) {
      p.then(function () { setTimeout(run, 200); });
    }
    return p;
  };
})();
