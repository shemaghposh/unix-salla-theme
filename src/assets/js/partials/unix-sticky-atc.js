/**
 * UNIX mobile sticky add-to-cart (ROADMAP 3.2 · DS §8.21 · unix.sa assets/main-product.js).
 *
 * Below 576px a fixed bar shows while the real buy row is off-screen and the footer isn't
 * on screen (unix.sa: two IntersectionObservers, .product-form__submit-wrapper.fixed).
 * The bar holds no cart logic: its button clicks the real <salla-add-product-button>'s
 * inner button, and mirrors that button's loading state. Hidden = inert, so it is out of
 * the tab order and the accessibility tree; if focus is inside when it hides, focus moves
 * to the real button.
 */
const MOBILE_QUERY = '(max-width: 575.98px)'; // DS §3.3: below sm (unix.sa max-width: 575px)

export default function initStickyAtc() {
  const bar = document.querySelector('[data-unix-sticky-atc]');
  const row = document.querySelector('[data-unix-atc-row]');
  const real = document.querySelector('[data-unix-atc]');
  const btn = bar?.querySelector('[data-unix-sticky-atc-btn]');
  if (!bar || !row || !real || !btn || !('IntersectionObserver' in window)) return;

  const mq = window.matchMedia(MOBILE_QUERY);
  const footer = document.querySelector('.store-footer');
  let rowVisible = true;
  let footerVisible = false;

  const realButton = () => real.querySelector('button');

  const update = () => {
    const show = mq.matches && !rowVisible && !footerVisible;
    if (show === bar.classList.contains('is-visible')) return;

    if (!show && bar.contains(document.activeElement)) {
      (realButton() || real).focus({ preventScroll: true });
    }
    bar.classList.toggle('is-visible', show);
    bar.inert = !show;
  };

  new IntersectionObserver(([entry]) => {
    rowVisible = entry.isIntersecting;
    update();
  }).observe(row);

  if (footer) {
    new IntersectionObserver(([entry]) => {
      footerVisible = entry.isIntersecting;
      update();
    }).observe(footer);
  }

  mq.addEventListener?.('change', update);

  btn.addEventListener('click', () => {
    const target = realButton();
    if (!target || target.disabled) {
      // e.g. the selected variant ran out: bring the real button (and its message) into view
      row.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      return;
    }
    target.click();
  });

  // Mirror the real button's loading state (salla-button[loading] / .s-button-loading)
  const syncBusy = () => {
    const busy = !!real.querySelector('salla-button[loading], .s-button-loading');
    btn.setAttribute('aria-busy', String(busy));
    btn.classList.toggle('is-loading', busy);
  };
  new MutationObserver(syncBusy).observe(real, {
    subtree: true,
    attributes: true,
    attributeFilter: ['loading', 'class', 'disabled'],
  });
}
