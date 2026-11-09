/**
 * UNIX header behaviour (ROADMAP 1.2 · DS §8.7).
 * - Sticky: once the bar has scrolled out of view it becomes fixed; it hides while scrolling
 *   down and slides back in on scroll up, with --e-1 and a solid --c-bg (see unix-header.scss).
 * - Transparent overlay over the home hero (only when a [data-header-overlay] hero exists).
 * - Search trigger for the <salla-search> modal.
 * - AR/EN pill: swaps the language segment of the current URL so the visitor stays on the same page.
 */
const SCROLL_DELTA = 6; // px of scroll needed before the direction counts (filters trackpad jitter)

function initSticky(header) {
  const nav = header.querySelector('#mainnav');
  const bar = nav && nav.querySelector('.unix-header__bar');
  if (!bar) return;

  let lastY = window.scrollY;
  let ticking = false;

  const isBusy = () => header.matches(':focus-within') || document.body.classList.contains('unix-drawer-open');

  const update = () => {
    ticking = false;
    const y = window.scrollY;
    const top = nav.getBoundingClientRect().top + y;
    const stuckFrom = top + bar.offsetHeight;
    const wasStuck = header.classList.contains('is-stuck');

    if (y <= top) {
      header.classList.remove('is-stuck', 'is-hidden');
    } else if (!wasStuck && y > stuckFrom) {
      // Enter the fixed state already hidden, without animating from the old position.
      header.classList.add('is-settling', 'is-stuck', 'is-hidden');
      requestAnimationFrame(() => requestAnimationFrame(() => header.classList.remove('is-settling')));
    } else if (wasStuck) {
      if (y > lastY + SCROLL_DELTA && !isBusy()) header.classList.add('is-hidden');
      else if (y < lastY - SCROLL_DELTA) header.classList.remove('is-hidden');
    }

    if (Math.abs(y - lastY) > SCROLL_DELTA || y <= top) lastY = y;
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });

  // Keyboard users tabbing into a hidden bar get it back.
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
  update();
}

function initOverlay(header) {
  if (!header.hasAttribute('data-overlay-capable')) return;
  if (!document.querySelector('[data-header-overlay]')) return;
  header.classList.add('is-overlay');
}

function initSearch(header) {
  header.querySelectorAll('[data-unix-search-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.querySelector('salla-search:not([inline])');
      if (modal && typeof modal.open === 'function') {
        modal.open();
        return;
      }
      salla.event.dispatch('search::open');
    });
  });
}

/**
 * Build the URL of the current page in `target` language.
 * Salla serves the default language without a path segment and every other language under
 * /{code}/ right after the store base path (e.g. /dev-xxxx/en/... on the demo store).
 * Returns null when the target is already active.
 */
export function languageUrl(target) {
  const current = (salla.config.get('user.language_code') || document.documentElement.lang || '').toLowerCase();
  if (!target || target === current) return null;

  const url = new URL(window.location.href);
  const storeUrl = salla.config.get('store.url') || window.location.origin;
  const baseDepth = new URL(storeUrl, window.location.origin).pathname
    .split('/').filter(Boolean)
    .filter(segment => segment !== current).length;

  const segments = url.pathname.split('/').filter(Boolean);
  const currentIndex = segments.indexOf(current, baseDepth);

  if (currentIndex === baseDepth) {
    // Current language has its own segment, so the target is the default language: drop it.
    segments.splice(currentIndex, 1);
  } else {
    // Current language is the default: insert the target segment after the base path.
    segments.splice(baseDepth, 0, target);
  }

  url.pathname = '/' + segments.join('/');
  return url.toString();
}

function openLocalizationModal() {
  const modal = document.querySelector('salla-localization-modal');
  if (modal && typeof modal.open === 'function') modal.open();
}

/**
 * Run `open` after closing the drawer the trigger sits in, so the drawer's focus restore
 * doesn't pull focus back out of the modal that `open` shows.
 */
function afterDrawer(trigger, open) {
  const drawer = trigger.closest('[data-unix-drawer]');
  if (!drawer) {
    open();
    return;
  }
  drawer.dispatchEvent(new CustomEvent('drawer:request-close'));
  requestAnimationFrame(() => requestAnimationFrame(open));
}

function initModalTriggers() {
  document.addEventListener('click', event => {
    const login = event.target.closest('[data-unix-login-open]');
    if (login) {
      afterDrawer(login, () => salla.event.dispatch('login::open'));
      return;
    }
    const localization = event.target.closest('[data-unix-localization-open]');
    if (localization) afterDrawer(localization, openLocalizationModal);
  });
}

function initLanguageToggle() {
  document.querySelectorAll('[data-unix-lang] [data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.getAttribute('aria-pressed') === 'true') return;
      try {
        const next = languageUrl(btn.dataset.lang);
        if (next) {
          window.location.assign(next);
          return;
        }
      } catch (error) {
        salla.logger && salla.logger.warn('unix-header::language url', error);
      }
      afterDrawer(btn, openLocalizationModal);
    });
  });
}

/**
 * 6.4: the cart count bubble is hidden while the cart is empty, like unix.sa (.cart-count-bubble:empty).
 * Twig prints the first value (data-count = cart.items_count); this keeps it in step with the cart.
 */
function initCartCount(header) {
  const hosts = header.querySelectorAll('salla-cart-summary[data-count]');
  if (!hosts.length) return;
  // 6.3: the visible summary text is hidden, so the inner link gets its accessible name from
  // data-cart-label (Twig trans, '__COUNT__' placeholder). Salla renders the <a> after hydration.
  const name = host => {
    const link = host.querySelector('a.s-cart-summary-wrapper, a, button');
    const template = host.dataset.cartLabel;
    if (!link || !template) return;
    link.setAttribute('aria-label', template.replace('__COUNT__', window.salla?.helpers?.number?.(host.dataset.count) ?? host.dataset.count));
  };
  hosts.forEach(host => {
    if (window.customElements?.whenDefined) {
      customElements.whenDefined('salla-cart-summary')
        .then(() => host.componentOnReady?.())
        .then(() => name(host), () => name(host));
    }
  });
  if (!window.salla?.cart?.event) return;
  const set = count => {
    const value = String(Number(count) || 0);
    hosts.forEach(host => { host.setAttribute('data-count', value); name(host); });
  };
  // Seed once: a cached page may carry a stale Twig count; Salla's own summary reads the same storage key.
  const stored = salla.storage?.get?.('cart.summary.count');
  set(stored ?? hosts[0].dataset.count);
  salla.cart.event.onUpdated?.(summary => {
    if (summary?.count != null) set(summary.count);
  });
}

export default function initHeader({ sticky = true } = {}) {
  const header = document.querySelector('[data-unix-header]');
  if (!header) return;
  initOverlay(header);
  initSearch(header);
  initLanguageToggle();
  initModalTriggers();
  initCartCount(header);
  if (sticky) initSticky(header);
}
