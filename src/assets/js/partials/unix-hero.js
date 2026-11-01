/**
 * UNIX hero (ROADMAP 2.1 · DS §8.1, §13.2).
 * - Background video: picks the desktop/mobile MP4 (≥750px = desktop, like unix.sa's media switch)
 *   and only starts loading after window `load`, so it never competes with the LCP image. The
 *   image stays underneath as the poster until the video fires `playing`.
 *   Skipped entirely with prefers-reduced-motion or Save-Data.
 * - Pause/play toggle (WCAG 2.2.2), shown once the video plays. The video also pauses while the
 *   hero is off screen and resumes when it returns, unless the visitor paused it.
 * - Scroll indicator: hides after the first scroll, scrolls to the next section on click.
 * Text reveal is CSS only (unix-hero.scss); nothing here gates content.
 */
const WIDE = '(min-width: 750px)'; // unix.sa switches desktop/mobile media at 750px (DS §8.1)
const SCROLL_HIDE_AFTER = 60; // px, same threshold as unix.sa's media-banner.js

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const saveData = () => Boolean(navigator.connection && navigator.connection.saveData);

const afterLoad = fn => {
  if (document.readyState === 'complete') fn();
  else window.addEventListener('load', fn, { once: true });
};

function initVideo(hero) {
  const video = hero.querySelector('[data-unix-hero-video]');
  if (!video || prefersReducedMotion() || saveData()) return;

  const toggle = hero.querySelector('[data-unix-hero-toggle]');
  let userPaused = false;

  // Fixed label ("pause video") + aria-pressed=true while paused; only the icon swaps.
  const setToggle = paused => {
    if (toggle) toggle.setAttribute('aria-pressed', paused ? 'true' : 'false');
  };

  const play = () => {
    const attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') attempt.catch(() => { /* autoplay blocked: keep the image */ });
  };

  video.addEventListener('playing', () => {
    hero.classList.add('is-video-playing');
    if (toggle) toggle.hidden = false;
    setToggle(false);
  });
  video.addEventListener('pause', () => setToggle(true));

  if (toggle) {
    toggle.addEventListener('click', () => {
      if (video.paused) {
        userPaused = false;
        play();
      } else {
        userPaused = true;
        video.pause();
      }
    });
  }

  afterLoad(() => {
    const src = window.matchMedia(WIDE).matches ? video.dataset.srcDesktop : video.dataset.srcMobile;
    if (!src) return;
    video.muted = true; // property, not just the attribute, so iOS allows inline autoplay
    video.src = src;
    play();

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) {
          if (!video.paused) video.pause();
        } else if (!userPaused && video.paused) {
          play();
        }
      }).observe(hero);
    }
  });
}

function initScrollIndicator(hero) {
  const button = hero.querySelector('[data-unix-hero-scroll]');
  if (!button) return;
  button.hidden = false;

  const onScroll = () => {
    if (window.scrollY <= SCROLL_HIDE_AFTER) return;
    button.classList.add('is-hidden');
    window.removeEventListener('scroll', onScroll);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  button.addEventListener('click', () => {
    const behavior = prefersReducedMotion() ? 'auto' : 'smooth';
    const next = hero.nextElementSibling;
    if (next) next.scrollIntoView({ behavior, block: 'start' });
    else window.scrollBy({ top: hero.offsetHeight, behavior });
  });
}

export default function initHeroes(root = document) {
  root.querySelectorAll('[data-unix-hero]').forEach(hero => {
    if (hero.dataset.unixHeroReady) return;
    hero.dataset.unixHeroReady = '1';
    initVideo(hero);
    initScrollIndicator(hero);
  });
}
