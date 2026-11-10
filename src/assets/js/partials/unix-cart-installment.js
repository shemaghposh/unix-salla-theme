/**
 * UNIX cart installments (ROADMAP 4.6 · DS §8.22 · D139) for pages/cart.twig.
 * ECOMMERCE-UX C5 / T4: Tabby's docs place the promo on the cart page too and ask for it to be
 * re-initialised when the amount changes. Salla's <salla-installment> only listens to
 * product::price.updated (a PDP event), so on cart::updated this swaps in a fresh element with
 * the new cart total; the component itself loads Tabby / Tamara with the store's keys.
 * Not in the cart drawer: the drawer is on the product page too, where a second instance would
 * duplicate Tabby's #tabbyPromo id and follow the product's price events.
 * No cart or payment logic here.
 */
const toAmount = value => Number(value && typeof value === 'object' ? value.amount : value);

const DEBOUNCE_MS = 300; // quantity taps fire several cart::updated; swap once, for the last total

export default function initCartInstallment(root = document.querySelector('[data-unix-cart-installment]')) {
  if (!root || !window.salla?.event?.cart) return;
  let current = toAmount(root.dataset.total);
  let pending = null;
  let timer = 0;

  const swap = () => {
    timer = 0;
    if (!Number.isFinite(pending) || pending <= 0 || pending === current) return;
    current = pending;
    const old = root.querySelector('salla-installment');
    const fresh = document.createElement('salla-installment');
    fresh.className = old?.className || 'unix-pdp-installment';
    fresh.setAttribute('price', String(current));
    if (old) old.replaceWith(fresh);
    else root.appendChild(fresh);
  };

  salla.event.cart.onUpdated(cart => {
    pending = toAmount(cart?.total);
    clearTimeout(timer);
    timer = setTimeout(swap, DEBOUNCE_MS);
  });
}
