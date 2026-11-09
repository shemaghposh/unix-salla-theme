/**
 * UNIX PDP share (ROADMAP 6.6 · D135 · DS §8.21).
 * Salla's <salla-social-share> (WhatsApp, X/Twitter, copy link via AddToAny) with our trigger in its
 * documented `widget` slot. This file only:
 * - opens/closes it through the component's public open()/close() methods;
 * - keeps aria-expanded on the trigger in sync with the list's `opened` class (outside clicks are
 *   handled by the component, so a MutationObserver reads the state instead of guessing it);
 * - closes on Escape and returns focus to the trigger;
 * - replaces Salla's English "Share Via <platform>" names with our feminine trans() labels, passed
 *   from the Twig as data-label-<platform> (salla.lang has no theme keys, LESSONS 2).
 * No cart, auth or share logic of its own.
 */
export default function initPdpShare(root = document.querySelector('[data-unix-pdp-share]')) {
  if (!root) return;
  const host = root.querySelector('salla-social-share');
  const btn = root.querySelector('[data-unix-pdp-share-btn]');
  if (!host || !btn) return;

  const isOpen = () => Boolean(host.querySelector('.s-social-share-list.opened'));

  const sync = () => {
    const open = isOpen();
    if (btn.getAttribute('aria-expanded') !== String(open)) btn.setAttribute('aria-expanded', String(open));
    host.querySelectorAll('.s-social-share-list a[class*="a2a_button_"]').forEach(link => {
      const platform = (link.className.match(/a2a_button_([a-z_]+)/) || [])[1];
      const label = platform && root.dataset[`label${platform.charAt(0).toUpperCase()}${platform.slice(1)}`];
      if (label && link.getAttribute('aria-label') !== label) link.setAttribute('aria-label', label);
    });
  };

  btn.addEventListener('click', () => {
    if (typeof host.open !== 'function') return; // component not upgraded yet
    (isOpen() ? host.close() : host.open()).then(sync, sync);
  });

  root.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !isOpen()) return;
    event.stopPropagation();
    host.close().then(sync, sync);
    btn.focus();
  });

  new MutationObserver(sync).observe(host, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['class', 'aria-label'],
  });
  sync();
}
