/* ============================================================
   UNIX — Free-shipping bar (ROADMAP 4.3 · DS §8.34)

   Fills every [data-unix-fs] block (cart drawer header, cart page
   summary) from a Salla cart summary. Salla's own free_shipping_bar
   wins when the store has a free-shipping rule; otherwise the theme
   threshold (unix_free_shipping_threshold, 500, D1) is compared with
   sub_total (D88). No cart logic here: read-only display.
   ============================================================ */

let bound = false;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/** @returns {{remaining:number, percent:number, done:boolean}|null} */
function compute(root, summary) {
  const bar = summary?.free_shipping_bar;
  if (bar && Number(bar.minimum_amount) > 0) {
    const percent = Math.min(100, Math.max(0, Number(bar.percent) || 0));
    return { remaining: Math.max(0, Number(bar.remaining) || 0), percent, done: !!bar.has_free_shipping || percent >= 100 };
  }
  const threshold = Number(root.dataset.threshold) || 0;
  if (threshold <= 0) return null;
  const subtotal = Math.max(0, Number(summary?.sub_total) || 0);
  const remaining = Math.max(0, threshold - subtotal);
  return { remaining, percent: Math.min(100, (subtotal / threshold) * 100), done: remaining <= 0 };
}

/**
 * @param {object} summary Salla cart summary ({count, sub_total, free_shipping_bar, …})
 */
export function updateFreeShipping(summary) {
  document.querySelectorAll('[data-unix-fs]').forEach((root) => {
    const count = Number(summary?.count ?? summary?.items?.length ?? 0);
    const state = count > 0 ? compute(root, summary) : null;
    root.hidden = !state;
    if (!state) return;

    const msg = root.querySelector('[data-fs-msg]');
    const fill = root.querySelector('[data-fs-fill]');
    root.classList.toggle('is-done', state.done);
    if (fill) fill.style.setProperty('--fs-progress', String(state.percent / 100));
    if (!msg) return;

    const amount = window.salla?.money ? window.salla.money(state.remaining) : escapeHtml(state.remaining);
    const html = state.done
      ? escapeHtml(root.dataset.msgDone || '')
      : escapeHtml(root.dataset.msgRemaining || '').replace('__AMOUNT__', `<strong>${amount}</strong>`);
    if (msg.innerHTML !== html) msg.innerHTML = html;
  });
}

/** Wire once per page: live cart updates (the cart page's first paint comes from Twig). */
export default function initFreeShipping() {
  if (bound) return;
  bound = true;

  window.salla?.cart?.event?.onUpdated?.((summary) => updateFreeShipping(summary));
}
