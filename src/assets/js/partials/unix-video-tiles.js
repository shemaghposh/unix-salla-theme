/**
 * UNIX video tiles (ROADMAP 2.7 · DS §8.12).
 * Like unix.sa's banner-grid.js, each video plays only while its tile is visible (also when it is
 * swiped out of the mobile scroller) and pauses otherwise. Added here:
 * - Lazy: the MP4 src is set only when the tile nears the viewport (the section is below the fold).
 * - No autoplay with prefers-reduced-motion or Save-Data; the poster stays and the play button
 *   starts the video on request.
 * - Pause/play toggle per tile (WCAG 2.2.2). A tile the visitor paused stays paused.
 */
const NEAR = '200px 0px'; // start fetching the MP4 shortly before the tile scrolls in
const VISIBLE = 0.25;     // share of the tile on screen that counts as "visible" for play/pause

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const saveData = () => Boolean(navigator.connection && navigator.connection.saveData);

function initTile(tile) {
  const video = tile.querySelector('[data-unix-video-tile-video]');
  if (!video || !video.dataset.src) return;

  const toggle = tile.querySelector('[data-unix-video-tile-toggle]');
  // "paused by choice": reduced motion / Save-Data start paused, like a visitor's own pause.
  let userPaused = prefersReducedMotion() || saveData();

  const setToggle = paused => {
    if (!toggle) return;
    toggle.setAttribute('aria-pressed', paused ? 'true' : 'false');
    toggle.setAttribute('aria-label', paused ? toggle.dataset.labelPlay : toggle.dataset.labelPause);
  };

  const load = () => {
    if (video.getAttribute('src')) return;
    video.muted = true; // property, not just the attribute, so iOS allows inline playback
    video.src = video.dataset.src;
  };

  const play = () => {
    load();
    const attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(() => setToggle(true)); // autoplay blocked: keep the poster, offer play
    }
  };

  video.addEventListener('playing', () => {
    tile.classList.add('is-playing');
    setToggle(false);
  });
  video.addEventListener('pause', () => setToggle(true));

  if (toggle) {
    toggle.hidden = false;
    setToggle(true);
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

  if (!('IntersectionObserver' in window)) {
    if (!userPaused) play();
    return;
  }

  // Preload the source a little before the tile scrolls in, but only when it may autoplay.
  const nearObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    nearObserver.disconnect();
    if (!userPaused) load();
  }, { rootMargin: NEAR });
  nearObserver.observe(tile);

  // Play while visible, pause off screen (unix.sa behaviour).
  new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) {
      if (!video.paused) video.pause();
    } else if (!userPaused && video.paused) {
      play();
    }
  }, { threshold: VISIBLE }).observe(tile);
}

export default function initVideoTiles(root = document) {
  root.querySelectorAll('[data-unix-video-tiles]').forEach(section => {
    if (section.dataset.unixVideoTilesReady) return;
    section.dataset.unixVideoTilesReady = '1';
    section.querySelectorAll('[data-unix-video-tile]').forEach(initTile);
  });
}
