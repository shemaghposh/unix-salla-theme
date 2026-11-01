/**
 * Announcement bar rotator (ROADMAP 1.1 · DS §8.6).
 * Dwell = --d-announce, slide = --d-reveal (both from unix-tokens.scss).
 * Pauses on hover, on focus inside the bar, and while the tab is hidden.
 * Reduced motion: the CSS drops the transition, so slides swap instantly.
 */
const toMs = value => {
  const n = parseFloat(value);
  if (Number.isNaN(n)) return 0;
  return value.trim().endsWith('ms') ? n : n * 1000;
};

export default function initAnnouncementBar(root = document.querySelector('[data-unix-announce]')) {
  if (!root) return;
  const items = [...root.querySelectorAll('.unix-announce__item')];
  const dwell = toMs(getComputedStyle(root).getPropertyValue('--d-announce'));
  if (items.length < 2 || !dwell) return;

  let index = Math.max(0, items.findIndex(item => item.classList.contains('is-active')));
  let timer = null;
  let hovered = false;
  let focused = false;

  const show = next => {
    if (next === index || next < 0) return;
    items.forEach(item => item.classList.remove('is-leaving'));
    void items[next].offsetWidth; // commit the reset so the slide enters from the inline-end
    items[index].classList.replace('is-active', 'is-leaving');
    items[next].classList.add('is-active');
    index = next;
  };

  const stop = () => {
    clearTimeout(timer);
    timer = null;
  };

  const schedule = () => {
    stop();
    if (hovered || focused || document.hidden) return;
    timer = setTimeout(() => {
      show((index + 1) % items.length);
      schedule();
    }, dwell);
  };

  root.addEventListener('mouseenter', () => { hovered = true; stop(); });
  root.addEventListener('mouseleave', () => { hovered = false; schedule(); });
  root.addEventListener('focusin', event => {
    focused = true;
    stop();
    // a link inside a waiting slide got keyboard focus: bring that slide in
    show(items.indexOf(event.target.closest('.unix-announce__item')));
  });
  root.addEventListener('focusout', event => {
    if (root.contains(event.relatedTarget)) return;
    focused = false;
    schedule();
  });
  document.addEventListener('visibilitychange', schedule);

  schedule();
}
