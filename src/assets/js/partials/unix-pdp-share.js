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
 *   links then have no href: the native share sheet (only AbortError counts as a cancel), else copy
 *   the link, else an error message; the result is also announced in a role="status" span. The
 *   block is hidden only at load time when nothing could work. Salla's app webview always uses the
 *   component path: host.open() shows the list, and each platform link there emits Salla's
 *   `share-element` event for the app to handle; never this fallback.
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

  const status = root.querySelector('[data-unix-pdp-share-status]');
  // Polite live region inside the block (DS §8.21): screen readers hear the result even when the
  // salla.notify toast isn't announced. Cleared first so the same message is read again.
  const announce = msg => {
    if (!status || !msg) return;
    status.textContent = '';
    requestAnimationFrame(() => { status.textContent = msg; });
  };

  // Salla's app webview shares through the component: with our slotted trigger the path is
  // host.open(), and each platform link then emits `share-element` for the app to handle. Our
  // navigator.share / copy fallback must never run there.
  const isWebview = () => Boolean(window.salla?.mobile?.isSpaWebview?.());

  // Runs inside the click gesture (no await before navigator.share / clipboard), so iOS allows it.
  const fallbackShare = async () => {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ url: shareUrl, title: shareTitle });
        return;
      } catch (error) {
        if (error?.name === 'AbortError') return; // the shopper closed the share sheet
        // any other failure (NotAllowedError, TypeError…) falls through to copying the link
      }
    }
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        const msg = root.dataset.labelCopied;
        if (msg && window.salla?.notify?.success) salla.notify.success(msg);
        announce(msg);
        return;
      } catch { /* clipboard denied: fall through */ }
    }
    // Never hide the block under the shopper's focus after a tap: say it didn't work instead.
    const msg = root.dataset.labelError;
    if (msg && window.salla?.notify?.error) salla.notify.error(msg);
    announce(msg);
  };

  const whenReady = () => customElements.whenDefined('salla-social-share')
    .then(() => (typeof host.componentOnReady === 'function' ? host.componentOnReady() : host));

  btn.addEventListener('click', () => {
    if (isOpen()) {
      host.close().then(sync, sync);
      return;
    }
    if (!isWebview() && !hasA2a()) {
      fallbackShare().catch(() => {});
      return;
    }
    // Component path (AddToAny loaded, or the app webview): wait for the upgrade only here.
    whenReady().then(() => host.open()).then(sync, sync);
  });

  root.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !isOpen()) return;
    event.stopPropagation();
    host.close().then(sync, sync);
    btn.focus();
  });

  // Deferred re-check: Safari can report a null relatedTarget on mixed pointer/keyboard input.
  root.addEventListener('focusout', () => {
    if (!isOpen()) return;
    requestAnimationFrame(() => {
      if (isOpen() && !root.contains(document.activeElement)) host.close().then(sync, sync);
    });
  });

  // Load-time only: no AddToAny, no native share and no clipboard (and not the webview) means the
  // block can never work, so it isn't shown. Never done in response to a tap.
  const hideIfUnusable = () => {
    if (!isWebview() && !hasA2a() && !canFallback()) root.hidden = true;
  };
  if (!canFallback()) {
    if (document.readyState === 'complete') hideIfUnusable();
    else window.addEventListener('load', hideIfUnusable, { once: true });
  }

  new MutationObserver(sync).observe(host, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['class', 'aria-label'],
  });
  sync();
}
