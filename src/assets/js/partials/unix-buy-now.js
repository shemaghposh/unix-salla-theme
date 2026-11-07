/**
 * UNIX buy-now label (ROADMAP 6.4 · D117 · DS §8.21).
 *
 * salla-add-product-button[quick-buy] reads its buy-now label from salla.lang
 * ('pages.products.buy_now', Salla's masculine «اشترِ الآن») and re-reads it whenever salla.lang
 * notifies its subscribers. The browser's salla.lang does not carry the theme's locale files, so the
 * feminine copy from src/locales (blocks.unix.pdp_info.buy_now) is added to salla.lang once the
 * translations are loaded, then the subscribers are told, so the button re-renders with it.
 * Nothing else about the button changes: Salla keeps the buy-now flow and Apple Pay.
 */
import arLocale from '../../../locales/ar.json';
import enLocale from '../../../locales/en.json';

const KEY = 'pages.products.buy_now';

const apply = (lang) => {
  try {
    lang.addBulk({
      [KEY]: {
        ar: arLocale.blocks.unix.pdp_info.buy_now,
        en: enLocale.blocks.unix.pdp_info.buy_now,
      },
    });
    // addBulk() does not notify; the component listens through salla.lang.subscribe(). The notifier
    // is internal to the SDK, so it is guarded: without it the label stays Salla's until the next
    // language event (still a working button).
    if (typeof lang._notifySubscribers === 'function') lang._notifySubscribers();
  } catch (error) {
    // never let the label break Salla's translations load
    window.salla?.log?.('unix-buy-now: label not applied', error);
  }
};

export default function initBuyNow() {
  const salla = window.salla;
  const lang = salla?.lang;
  if (!lang || typeof lang.addBulk !== 'function' || typeof lang.onLoaded !== 'function') return;
  if (!document.querySelector('salla-add-product-button[quick-buy]')) return;

  lang.onLoaded(() => apply(lang));
  // a later translations load (e.g. a language switch) replaces the messages: add the label again
  salla.event?.on?.('languages::translations.loaded', () => apply(lang));
}
