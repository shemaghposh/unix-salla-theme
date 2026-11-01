/**
 * «حركة. رياضة. استرخاء.» arrows (ROADMAP 2.5 · DS §8.14).
 * Rendered only when there are more than 3 cards (unix.sa) and shown from lg.
 * They scroll the CSS scroll-snap row by one card and are disabled at the ends.
 * Without JS they stay `hidden`; the row still scrolls by touch and keyboard.
 */
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function bindGrid(section) {
  const list = section.querySelector('.unix-collections-grid__list');
  const prev = section.querySelector('[data-unix-arrow="prev"]');
  const next = section.querySelector('[data-unix-arrow="next"]');
  if (!list || !prev || !next) return;

  const isRtl = () => getComputedStyle(list).direction === 'rtl';

  // RTL scrollLeft runs 0 → negative in current engines; use its magnitude.
  const sync = () => {
    const pos = Math.abs(list.scrollLeft);
    const max = list.scrollWidth - list.clientWidth;
    prev.hidden = next.hidden = max <= 1;
    prev.disabled = pos <= 1;
    next.disabled = pos >= max - 1;
  };

  const step = direction => {
    const item = list.querySelector('.unix-collections-grid__item');
    if (!item) return;
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    const delta = (item.getBoundingClientRect().width + gap) * direction * (isRtl() ? -1 : 1);
    list.scrollBy({ left: delta, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  list.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

export default function initCollectionsGrids(root = document) {
  root.querySelectorAll('.unix-collections-grid').forEach(bindGrid);
}
