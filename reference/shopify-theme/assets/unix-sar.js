/* UNIX — show the currency as "SAR" on the English storefront.

   The store's money format is "{{amount}} ر.س", which Shopify uses for
   every language, so English pages showed Arabic next to every price.
   On non-Arabic pages this swaps the symbol for "SAR" in the text the
   theme prints, including prices that arrive later (cart drawer, quick
   view, variant changes). Arabic pages are left exactly as they are. */
(function () {
  'use strict';
  if ((document.documentElement.lang || '').toLowerCase().indexOf('ar') === 0) return;
  var SYM = 'ر.س', RE = /ر\.س/g;
  function fixNode(n) {
    if (n.nodeValue && n.nodeValue.indexOf(SYM) > -1) n.nodeValue = n.nodeValue.replace(RE, 'SAR');
  }
  function fixTree(root) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) fixNode(n);
  }
  function start() {
    fixTree(document.body);
    new MutationObserver(function (records) {
      records.forEach(function (r) {
        if (r.type === 'characterData') { fixNode(r.target); return; }
        r.addedNodes.forEach(function (x) {
          if (x.nodeType === 3) fixNode(x); else if (x.nodeType === 1) fixTree(x);
        });
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
