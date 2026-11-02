/* ============================================================
   UNIX — Cashback note (ROADMAP 3.7 · DS §8.25 · SPEC §8.4)

   The note is server-rendered (components/cart/unix-cashback-note.twig).
   This keeps its amount in step with the cart (percent × sub_total,
   rounded to the halala like unix.sa) and opens Salla's own login
   modal from the guest link. Reused by the 4.3 cart drawer.
   ============================================================ */

let bound = false;

function update(subtotal) {
  const value = Number(subtotal);
  if (!Number.isFinite(value)) return;
  document.querySelectorAll('[data-unix-cbk]').forEach((root) => {
    const pct = Number(root.dataset.percent) || 0;
    const amount = Math.round(value * pct) / 100; // value × pct / 100, to 2 decimals
    root.hidden = !(amount > 0);
    const target = root.querySelector('[data-cbk-amount]');
    if (target && amount > 0 && window.salla?.money) target.innerHTML = window.salla.money(amount); // Salla-formatted price
  });
}

/** Wire once per page: cart updates + the guest «sign in» link. */
export default function initCashbackNote() {
  if (bound) return;
  bound = true;

  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-cbk-login]')) return;
    window.salla?.event?.dispatch('login::open');
  });

  window.salla?.event?.cart?.onUpdated?.((data) => {
    if (data && data.sub_total != null) update(data.sub_total);
  });
}
