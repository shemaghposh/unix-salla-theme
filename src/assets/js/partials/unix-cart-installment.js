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

export default function initCartInstallment(root = document.querySelector('[data-unix-cart-installment]')) {
  if (!root || !window.salla?.event?.cart) return;
  let current = toAmount(root.dataset.total);

  salla.event.cart.onUpdated(cart => {
    const total = toAmount(cart?.total);
    if (!Number.isFinite(total) || total <= 0 || total === current) return;
    current = total;
    const old = root.querySelector('salla-installment');
    const fresh = document.createElement('salla-installment');
    fresh.className = old?.className || 'unix-pdp-installment';
    fresh.setAttribute('price', String(total));
    if (old) old.replaceWith(fresh);
    else root.appendChild(fresh);
  });
}
