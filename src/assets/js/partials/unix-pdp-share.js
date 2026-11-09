/**
 * UNIX PDP share (ROADMAP 6.6 · D135 · DS §8.21).
 * Salla's <salla-social-share> (WhatsApp, X/Twitter, copy link via AddToAny) with our trigger in its
 * documented `widget` slot. This file only:
 * - opens/closes it through the component's public open()/close() methods, after the element is
 *   defined (an early tap waits for the upgrade instead of doing nothing);
 * - keeps aria-expanded / aria-controls on the trigger in sync with the list's `opened` class
 *   (outside clicks are handled by the component, so a MutationObserver reads the state);
 * - closes on Escape (focus back to the trigger) and when focus leaves the block;
 * - replaces Salla's English "Share Via <platform>" names with our feminine trans() labels, passed
 *   from the Twig as data-label-<platform> (salla.lang has no theme keys, LESSONS 2);
 * - falls back when AddToAny is missing (blocked by an ad blocker, or not loaded yet), because its
 *   links then have no href: the native share sheet, else copy the link, else hide the block.
 * No cart, auth or share logic of its own.
 */
const LIST_ID = 'unix-pdp-share-list';

export default function initPdpShare(root = document.querySelector('[data-unix-pdp-share]')) {
  if (!root) return;
  const host = root.querySelector('salla-social-share');
  const btn = root.querySelector('[data-unix-pdp-share-btn]');
  if (!host || !btn) return;

  const shareUrl = host.getAttribute('url') || window.location.href;
  const shareTitle = host.getAttribute('url-name') || document.title;

  const list = () => host.querySelector('.s-social-share-list');
  const isOpen = () => Boolean(list()?.classList.contains('opened'));
  // AddToAny defines window.a2a; it stays undefined when the script is blocked or still loading.
  const hasA2a = () => Boolean(window.a2a);
  const canFallback = () => typeof navigator.share === 'function' || Boolean(navigator.clipboard?.writeText);

  const sync = () => {
    const ul = list();
    if (ul && !ul.id) ul.id = LIST_ID;
    if (ul && btn.getAttribute('aria-controls') !== ul.id) btn.setAttribute('aria-controls', ul.id);
    const open = isOpen();
    if (btn.getAttribute('aria-expanded') !== String(open)) btn.setAttribute('aria-expanded', String(open));
    host.querySelectorAll('.s-social-share-list a[class*="a2a_button_"]').forEach(link => {
      const platform = (link.className.match(/a2a_button_([a-z_]+)/) || [])[1];
      const label = platform && root.dataset[`label${platform.charAt(0).toUpperCase()}${platform.slice(1)}`];
      if (label && link.getAttribute('aria-label') !== label) link.setAttribute('aria-label', label);
    });
  };

  const hideBlock = () => { root.hidden = true; };

  const fallbackShare = async () => {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ url: shareUrl, title: shareTitle });
      } catch { /* dismissed by the shopper: nothing to do */ }
      return;
    }
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        const msg = root.dataset.labelCopied;
        if (msg && window.salla?.notify?.success) salla.notify.success(msg);
        return;
      } catch { /* clipboard denied: fall through */ }
    }
    hideBlock();
  };

  const toggle = () => {
    if (isOpen()) {
      host.close().then(sync, sync);
      return;
    }
    if (!hasA2a()) {
      fallbackShare();
      return;
    }
    host.open().then(sync, sync);
  };

  btn.addEventListener('click', () => {
    if (typeof host.open === 'function') {
      toggle();
      return;
    }
    customElements.whenDefined('salla-social-share')
      .then(() => (typeof host.componentOnReady === 'function' ? host.componentOnReady() : host))
      .then(toggle, () => {});
  });

  root.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !isOpen()) return;
    event.stopPropagation();
    host.close().then(sync, sync);
    btn.focus();
  });

  root.addEventListener('focusout', event => {
    if (!isOpen() || (event.relatedTarget && root.contains(event.relatedTarget))) return;
    host.close().then(sync, sync);
  });

  // No AddToAny and nothing to fall back to: the block can't work, so don't show it.
  if (!canFallback()) {
    window.addEventListener('load', () => { if (!window.a2a) hideBlock(); }, { once: true });
  }

  new MutationObserver(sync).observe(host, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['class', 'aria-label'],
  });
  sync();
}
