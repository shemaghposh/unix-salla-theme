/**
 * «جديد من يونكس» arrows (ROADMAP 2.4 · DS §8.13).
 * Our arrows sit in the heading row (unix.sa grid "info info buttons") and drive
 * the Swiper inside salla-products-slider through salla-slider's public
 * `sliderInstance()` method. They stay `hidden` until the slider exists and while
 * everything fits (Swiper `isLocked`), and are disabled at the ends.
 * Without JS they stay hidden; touch scrolling still works.
 */
function bindOverlay(section) {
  const prev = section.querySelector('[data-unix-arrow="prev"]');
  const next = section.querySelector('[data-unix-arrow="next"]');
  if (!prev || !next) return;

  let swiper = null;
  const sync = () => {
    if (!swiper) return;
    prev.hidden = next.hidden = !!swiper.isLocked;
    prev.disabled = !!swiper.isBeginning;
    next.disabled = !!swiper.isEnd;
  };

  const attach = async slider => {
    if (swiper || !slider || typeof slider.sliderInstance !== 'function') return;
    const instance = await slider.sliderInstance();
    if (!instance || swiper) return;
    swiper = instance;
    ['slideChange', 'reachBeginning', 'reachEnd', 'resize', 'lock', 'unlock'].forEach(name => swiper.on(name, sync));
    sync();
  };

  prev.addEventListener('click', () => swiper?.slidePrev());
  next.addEventListener('click', () => swiper?.slideNext());

  // salla-products-slider fetches products first, so its salla-slider (and Swiper)
  // appears later. salla-slider emits a bubbling `afterInit` event.
  section.addEventListener('afterInit', event => attach(event.target.closest('salla-slider')));

  // Fallback in case afterInit fired before we listened.
  const tryExisting = () => {
    attach(section.querySelector('salla-slider'));
    return !!section.querySelector('salla-slider');
  };
  if (!tryExisting()) {
    const observer = new MutationObserver(() => { if (tryExisting()) observer.disconnect(); });
    observer.observe(section, { childList: true, subtree: true });
  }
}

export default function initCollectionOverlays(root = document) {
  root.querySelectorAll('.unix-collection-overlay').forEach(bindOverlay);
}
