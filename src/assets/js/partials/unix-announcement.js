/**
 * UNIX announcement bar (ROADMAP 1.1 · DS §8.6).
 * Cross-fades between messages every 5s. Rotation pauses while the bar is hovered,
 * while focus is inside it, and while the tab is hidden. The fade itself uses --d-base,
 * which unix-tokens.scss sets to 0ms under prefers-reduced-motion.
 */
const INTERVAL_MS = 5000; // DS §8.6: "every 5 seconds"

export default function initAnnouncement(root = document.querySelector('[data-unix-announcement]')) {
  if (!root) return;

  const items = Array.from(root.querySelectorAll('.unix-announcement__item'));
  if (items.length < 2) return;

  let index = items.findIndex(item => item.classList.contains('is-active'));
  if (index < 0) index = 0;

  let timer = null;
  let hovered = false;
  let focused = false;

  const show = next => {
    items.forEach((item, i) => {
      const active = i === next;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-hidden', active ? 'false' : 'true');
      item.querySelectorAll('a').forEach(link => {
        if (active) link.removeAttribute('tabindex');
        else link.setAttribute('tabindex', '-1');
      });
    });
    index = next;
  };

  const stop = () => {
    clearInterval(timer);
    timer = null;
  };

  const start = () => {
    stop();
    if (hovered || focused || document.hidden) return;
    timer = setInterval(() => show((index + 1) % items.length), INTERVAL_MS);
  };

  root.addEventListener('mouseenter', () => { hovered = true; stop(); });
  root.addEventListener('mouseleave', () => { hovered = false; start(); });
  root.addEventListener('focusin', () => { focused = true; stop(); });
  root.addEventListener('focusout', event => {
    if (root.contains(event.relatedTarget)) return;
    focused = false;
    start();
  });
  document.addEventListener('visibilitychange', start);

  start();
}
