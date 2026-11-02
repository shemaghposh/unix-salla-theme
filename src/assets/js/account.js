/**
 * UNIX account shell (ROADMAP 5.1 · DS §8.37)
 * Loaded by layouts/customer.twig only. Salla's inline account menu (`salla-user-menu inline`) has no
 * "current page" state, so this marks the matching link with aria-current="page" (styled in
 * unix-account.scss). Navigation, logout and badges stay Salla's; nothing else is touched.
 */

const pathOf = (href) => {
  try {
    return new URL(href, window.location.href).pathname.replace(/\/+$/, '');
  } catch (e) {
    return '';
  }
};

function markCurrent(menu) {
  const here = pathOf(window.location.href);

  menu.querySelectorAll('a.s-user-menu-dropdown-item-link[href]').forEach((link) => {
    const path = pathOf(link.getAttribute('href'));
    // exact page, or a child of it (e.g. a single order under the orders list)
    const isCurrent = !!path && (here === path || here.startsWith(`${path}/`));

    if (isCurrent && link.getAttribute('aria-current') !== 'page') {
      link.setAttribute('aria-current', 'page');
    } else if (!isCurrent && link.hasAttribute('aria-current')) {
      link.removeAttribute('aria-current');
    }
  });
}

function initAccountNav() {
  const menu = document.querySelector('.unix-account__nav salla-user-menu');
  if (!menu) return;

  // The component renders after Salla is ready and re-renders on language/profile updates.
  new MutationObserver(() => markCurrent(menu)).observe(menu, { childList: true, subtree: true });
  markCurrent(menu);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccountNav);
} else {
  initAccountNav();
}
