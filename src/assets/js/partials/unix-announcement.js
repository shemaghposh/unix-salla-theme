/**
 * UNIX announcement bar (ROADMAP 1.1 · DS §8.6).
 * Matches unix.sa (Swiper vertical, 4s delay, 0.8s speed, loop) in vanilla JS + CSS:
 * the next message enters from below while the current one exits upward.
 * Dwell = --d-announce, slide = --d-announce-slide (unix-tokens.scss; the slide is 0ms under
 * prefers-reduced-motion, so messages swap instantly). A visible pause/play button
 * ([data-unix-announcement-toggle], fixed name + aria-pressed) stops rotation until it is pressed
 * again, for as long as the page is open (WCAG 2.2.2, A11Y R18.1). It also pauses while the bar is
 * hovered, while focus is inside it and while the tab is hidden (DS §8.6, §12).
 */
const toMs = value => {
  const n = parseFloat(value);
  if (Number.isNaN(n)) return 0;
  return value.trim().endsWith('ms') ? n : n * 1000;
};

export default function initAnnouncement(root = document.querySelector('[data-unix-announcement]')) {
  if (!root) return;

  const items = [...root.querySelectorAll('.unix-announcement__item')];
  const styles = getComputedStyle(root);
  const dwell = toMs(styles.getPropertyValue('--d-announce'));
  // 0 under prefers-reduced-motion (unix-tokens.scss), so the cycle is just the dwell there
  const slide = toMs(styles.getPropertyValue('--d-announce-slide'));
  if (items.length < 2 || !dwell) return;

  let index = Math.max(0, items.findIndex(item => item.classList.contains('is-active')));
  let timer = null;
  let hovered = false;
  let focused = false;
  let paused = false; // set by the toggle button only; survives hover/focus/visibility changes

  const show = next => {
    if (next === index || next < 0) return;
    items.forEach(item => item.classList.remove('is-leaving'));
    void items[next].offsetHeight; // commit the reset so the message enters from below
    items[index].classList.replace('is-active', 'is-leaving');
    items[next].classList.add('is-active');
    index = next;
  };

  const stop = () => {
    clearTimeout(timer);
    timer = null;
  };

  // Swiper semantics: a message stays fully still for `dwell` AFTER its slide-in ends, so the
  // first rotation waits `dwell` and every later one `dwell + slide`. Resuming after a pause
  // (hover, focus, hidden tab) waits a full `dwell` again, like Swiper's autoplay resume.
  const schedule = (afterSlide = false) => {
    stop();
    if (paused || hovered || focused || document.hidden) return;
    timer = setTimeout(() => {
      show((index + 1) % items.length);
      schedule(true);
    }, afterSlide ? dwell + slide : dwell);
  };

  root.addEventListener('mouseenter', () => { hovered = true; stop(); });
  root.addEventListener('mouseleave', () => { hovered = false; schedule(); });
  root.addEventListener('focusin', event => {
    // Focus on the pause/play button itself isn't a pause: pressing play must resume at once.
    if (event.target.closest('[data-unix-announcement-toggle]')) return;
    focused = true;
    stop();
    // a link inside a waiting message got keyboard focus: bring that message in
    const item = event.target.closest('.unix-announcement__item');
    if (item) show(items.indexOf(item));
  });
  root.addEventListener('focusout', event => {
    // moving from a link to the toggle still leaves the messages: resume (unless paused)
    const next = event.relatedTarget;
    if (next && root.contains(next) && !next.closest('[data-unix-announcement-toggle]')) return;
    focused = false;
    schedule();
  });
  document.addEventListener('visibilitychange', () => schedule());

  const toggle = root.querySelector('[data-unix-announcement-toggle]');
  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      paused = !paused;
      toggle.setAttribute('aria-pressed', String(paused));
      // pressing play is an explicit "go": don't let the pointer resting on the bar hold it
      if (!paused) hovered = false;
      schedule(); // stops when paused; resumes after a full dwell otherwise
    });
  }

  schedule();
}
