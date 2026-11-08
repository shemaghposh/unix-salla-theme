/**
 * Shared heading-row arrows + thin progress line for UNIX carousels (6.4, DS §8.15 / §8.16).
 * unix.sa draws both on its Swiper sections: ← → in the heading row (swiper-button-prev/next) and a
 * custom pagination of touching segments, one per snap point, the current one dark.
 * - getSwiper(): returns the Swiper to drive (it may appear later, after salla-slider fetches/initialises).
 * - prev / next: buttons; disabled at the ends and while everything fits (Swiper locked).
 * - progress: element that receives one <span> per snap point (.is-active on the current); hidden when
 *   there is a single page. Decorative (aria-hidden in the markup): arrows and swipe are the controls.
 * Returns bind(), to call again when the driven Swiper changes (e.g. another tab).
 */
const WAIT_MS = 300;
const WAIT_TRIES = 20;
const EVENTS = 'slideChange snapIndexChange reachBeginning reachEnd resize snapGridLengthChange lock unlock';

export default function bindCarouselNav({ getSwiper, prev, next, progress }) {
  let timer = null;

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

  const bind = (tries = 0) => {
    clearTimeout(timer);
    const swiper = getSwiper();
    if (swiper) {
      if (!swiper.unixNavBound) {
        swiper.on(EVENTS, sync);
        swiper.unixNavBound = true;
      }
      sync();
      return;
    }
    sync();
    if (tries < WAIT_TRIES) timer = setTimeout(() => bind(tries + 1), WAIT_MS);
  };

  prev?.addEventListener('click', () => { getSwiper()?.slidePrev(); sync(); });
  next?.addEventListener('click', () => { getSwiper()?.slideNext(); sync(); });
  bind();
  return bind;
}
