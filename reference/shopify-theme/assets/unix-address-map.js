/* ============================================================
   UNIX — Saudi Address Finder: state machine for the cart drawer

   The stylesheet defines three states on the widget root:

     una-collapsed  header row only (default when nothing is saved)
     (none)         map open
     una-done       address saved, map folded, result card shown

   This script is the only thing that moves between them. It never
   touches the app's own inline display toggles; it sets a class on the
   root and lets the CSS do the rest, so the two cannot fight.

   Signals it listens for:
     - tap on the header          → open (or fold, if already open)
     - tap on the app's cancel     → fold
     - tap on the app's edit link  → open again
     - the app revealing its result block (display:none → block)
                                   → done, and scroll the card into view
     - the map container being shown → scroll the map into view

   The widget arrives asynchronously and is re-rendered by the drawer, so
   everything is discovered with a MutationObserver and every node is
   wired at most once.
   ============================================================ */

(function () {
  'use strict';

  var SCROLLERS = [
    '.cart-drawer__bottom',
    'cart-drawer .drawer__inner',
    '#CartDrawer .drawer__inner'
  ];

  function visible(el) {
    return !!el && getComputedStyle(el).display !== 'none';
  }

  function scrollerFor(el) {
    for (var i = 0; i < SCROLLERS.length; i++) {
      var box = el.closest(SCROLLERS[i]);
      if (box && box.scrollHeight > box.clientHeight + 4) return box;
    }
    return null;
  }

  function reveal(el, offset) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var box = scrollerFor(el);
        if (box) {
          var top = el.offsetTop - box.offsetTop - (offset || 12);
          box.scrollTo({ top: top < 0 ? 0 : top, behavior: 'smooth' });
        } else if (el.scrollIntoView) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });
  }

  function setState(root, state) {
    root.classList.remove('una-collapsed', 'una-done');
    if (state) root.classList.add(state);
  }

  var wired = new WeakSet();

  function wire(root) {
    if (wired.has(root)) return;
    wired.add(root);

    var header  = root.querySelector('[data-na="open-map-btn"]');
    var mapBox  = root.querySelector('[data-na="map-container"]');
    var result  = root.querySelector('[data-na="address-result"]');
    var cancel  = root.querySelector('[data-na="cancel-map-btn"]');
    var edit    = root.querySelector('[data-na="edit-address-btn"]');

    // initial state: done if the app already has an address, else collapsed
    setState(root, visible(result) ? 'una-done' : 'una-collapsed');

    if (header) {
      header.addEventListener('click', function () {
        // the app's own handler opens the map; we only decide the fold
        if (root.classList.contains('una-collapsed')) {
          setState(root, null);
          if (mapBox) reveal(mapBox, 8);
        } else if (!root.classList.contains('una-done')) {
          setState(root, 'una-collapsed');
        }
      });
    }

    if (cancel) {
      cancel.addEventListener('click', function () {
        setState(root, visible(result) ? 'una-done' : 'una-collapsed');
      });
    }

    if (edit) {
      edit.addEventListener('click', function () {
        setState(root, null);
        if (mapBox) reveal(mapBox, 8);
      });
    }

    if (result) {
      var wasShown = visible(result);
      new MutationObserver(function () {
        var shown = visible(result);
        if (shown && !wasShown) {
          setState(root, 'una-done');
          reveal(result, 8);
        }
        wasShown = shown;
      }).observe(result, { attributes: true, attributeFilter: ['style', 'class'] });
    }

    if (mapBox) {
      var wasOpen = visible(mapBox);
      new MutationObserver(function () {
        var open = visible(mapBox);
        if (open && !wasOpen && !root.classList.contains('una-collapsed')) {
          reveal(mapBox, 8);
        }
        wasOpen = open;
      }).observe(mapBox, { attributes: true, attributeFilter: ['style', 'class'] });
    }
  }

  function scan() {
    var roots = document.querySelectorAll('[data-na="root"]');
    for (var i = 0; i < roots.length; i++) wire(roots[i]);
  }

  new MutationObserver(scan).observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scan);
  } else {
    scan();
  }
})();

/* ============================================================
   UNIX — make the national address OPTIONAL

   The Saudi Address Finder app gates checkout: until an address is saved
   it cancels the checkout click and the cart form's submit. The app has
   no setting to turn that off, so this script steps in first.

   How: listeners on `window` in the capture phase run before the app's
   own capture listener on `document` and before the form's listeners.
   When no address has been saved, we stop the event from reaching the
   app and let the browser carry on to checkout as normal.

   When an address HAS been saved we do nothing, so the app still
   pre-fills the shipping address at checkout exactly as before.

   We also relabel the widget so the customer knows it's optional, in
   the page's own language.
   ============================================================ */
(function () {
  'use strict';

  function rootFor(node) {
    var scope = node.closest('cart-drawer, .cart-drawer, #CartDrawer, .cart__footer, form, body') || document;
    return scope.querySelector('[data-na="root"]') || document.querySelector('[data-na="root"]');
  }

  function addressSaved(root) {
    if (!root) return true;                     // no widget, nothing to bypass
    var result = root.querySelector('[data-na="address-result"]');
    return !!result && getComputedStyle(result).display !== 'none';
  }

  function isCheckoutButton(el) {
    var btn = el && el.closest && el.closest('[name="checkout"], #checkout');
    return btn || null;
  }

  function clearError(root) {
    var err = root && root.querySelector('[data-na="address-error"]');
    if (err) { err.textContent = ''; err.style.display = 'none'; }
  }

  // Click on a checkout button: if no address, keep the app from cancelling it.
  window.addEventListener('click', function (e) {
    var btn = isCheckoutButton(e.target);
    if (!btn) return;
    var root = rootFor(btn);
    if (addressSaved(root)) return;            // let the app pre-fill as usual
    e.stopImmediatePropagation();               // the app never sees this click
    clearError(root);
  }, true);

  // Submit of the cart form (the native path most themes use).
  window.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form || !form.querySelector) return;
    var btn = (e.submitter && isCheckoutButton(e.submitter)) ||
              form.querySelector('[name="checkout"]') ||
              document.querySelector('[name="checkout"][form="' + form.id + '"]');
    if (!btn) return;
    var root = rootFor(btn);
    if (addressSaved(root)) return;
    e.stopImmediatePropagation();
    clearError(root);
  }, true);

  // Say "optional" on the widget's header row, in the page language.
  var IS_EN = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var LABEL = IS_EN ? 'Set your delivery location (optional)' : 'حددي موقع التوصيل (اختياري)';
  function relabel() {
    var labels = document.querySelectorAll('[data-na="open-map-label"]');
    for (var i = 0; i < labels.length; i++) {
      if (labels[i].textContent.trim() !== LABEL) labels[i].textContent = LABEL;
    }
  }
  new MutationObserver(relabel).observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', relabel); else relabel();
})();
