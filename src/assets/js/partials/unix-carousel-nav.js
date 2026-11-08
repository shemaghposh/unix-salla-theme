/**
 * Shared heading-row arrows + thin progress line for UNIX carousels (6.4, DS §8.15 / §8.16).
 * unix.sa draws both on its Swiper sections: ← → in the heading row (swiper-button-prev/next) and a
 * custom pagination of touching segments, one per snap point, the current one dark.
 * - getSwiper(): returns the Swiper to drive (it may appear later, after salla-slider fetches/initialises).
 * - prev / next: buttons; disabled at the ends and while everything fits (Swiper locked).
 * - progress: element that receives one <span> per snap point (.is-active on the current); hidden when
 *   there is a single page. Decorative (aria-hidden in the markup): arrows and swipe are the controls.
 * - getSlider() (optional): the salla-slider / salla-products-slider element. When polling for the
 *   Swiper gives up, bind() is retried once on window `load` (if it hasn't fired yet) and once when
 *   the slider's componentOnReady() resolves (slow networks, late hydration).
 * Returns { rebind, destroy }: rebind() when the driven Swiper changes (e.g. another tab); destroy()
 * clears the timer and fallbacks, unbinds the Swiper events and the arrow clicks.
 */
const WAIT_MS = 300;
const WAIT_TRIES = 20;
const EVENTS = 'slideChange snapIndexChange reachBeginning reachEnd resize snapGridLengthChange lock unlock';

export default function bindCarouselNav({ getSwiper, prev, next, progress, getSlider }) {
  let timer = null;
  let destroyed = false;
  let loadArmed = false;
  const armedSliders = new WeakSet();
  const bound = new Set();

  const drawProgress = swiper => {
    if (!progress) return;
    const pages = swiper && !swiper.isLocked ? swiper.snapGrid.length : 0;
    if (pages < 2) {
      progress.hidden = true;
      return;
    }
    if (progress.childElementCount !== pages) {
      progress.replaceChildren(...Array.from({ length: pages }, () => document.createElement('span')));
    }
    const current = Math.min(swiper.snapIndex, pages - 1);
    Array.from(progress.children).forEach((bar, index) => bar.classList.toggle('is-active', index === current));
    progress.hidden = false;
  };

  const sync = () => {
    const swiper = getSwiper();
    const locked = !swiper || swiper.isLocked;
    if (prev) prev.disabled = locked || swiper.isBeginning;
    if (next) next.disabled = locked || swiper.isEnd;
    drawProgress(swiper);
  };

  // One last try (no new polling loop) after the page or the slider is really ready
  const retry = () => {
    if (!destroyed) bind(WAIT_TRIES);
  };

  // window load: one-shot for the whole nav. componentOnReady: once per slider, so each slow tab
  // (products tabs) gets its own retry when its slider is ready.
  const armFallback = () => {
    if (destroyed) return;
    if (!loadArmed && document.readyState !== 'complete') {
      loadArmed = true;
      window.addEventListener('load', retry, { once: true });
    }
    const slider = getSlider?.();
    if (!slider || armedSliders.has(slider) || typeof slider.componentOnReady !== 'function') return;
    armedSliders.add(slider);
    slider.componentOnReady().then(retry, () => {});
  };

  function bind(tries = 0) {
    if (destroyed) return;
    clearTimeout(timer);
    const swiper = getSwiper();
    if (swiper) {
      if (!swiper.unixNavBound) {
        swiper.on(EVENTS, sync);
        swiper.unixNavBound = true;
        bound.add(swiper);
      }
      sync();
      return;
    }
    sync();
    if (tries < WAIT_TRIES) timer = setTimeout(() => bind(tries + 1), WAIT_MS);
    else armFallback();
  }

  const onPrev = () => { getSwiper()?.slidePrev(); sync(); };
  const onNext = () => { getSwiper()?.slideNext(); sync(); };

  const destroy = () => {
    destroyed = true;
    clearTimeout(timer);
    window.removeEventListener('load', retry);
    bound.forEach(swiper => {
      swiper.off(EVENTS, sync);
      delete swiper.unixNavBound;
    });
    bound.clear();
    prev?.removeEventListener('click', onPrev);
    next?.removeEventListener('click', onNext);
  };

  prev?.addEventListener('click', onPrev);
  next?.addEventListener('click', onNext);
  bind();
  return { rebind: () => bind(), destroy };
}
