/**
 * UNIX account shell (ROADMAP 5.1 · DS §8.37)
 * Loaded by layouts/customer.twig only. Salla's inline account menu (`salla-user-menu inline`) has no
 * "current page" state, so this marks the matching link with aria-current="page" (styled in
 * unix-account.scss). Navigation, logout and badges stay Salla's. On the orders list it also names
 * Salla's whole-row links (see labelOrderRows).
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

/**
 * Orders list (ROADMAP 5.2 · DS §8.38): salla-orders puts an empty <a href> over every cell, so each
 * row is several unnamed tab stops. Keep the first one per row, named «الطلب رقم …» from the row's
 * reference id, and take the rest out of the tab order and the accessibility tree.
 */
function labelOrderRows(list, template) {
  list.querySelectorAll('.s-orders-table-tbody-tr').forEach((row) => {
    const links = [...row.querySelectorAll('a[href]')];
    if (!links.length) return;

    const refEl = row.querySelector('.s-orders-reference-id');
    const copyEl = row.querySelector('[data-content]');
    const number = ((refEl && refEl.textContent) || (copyEl && copyEl.dataset.content) || '').trim();

    links.forEach((link, index) => {
      if (index === 0) {
        if (number && template) {
          const label = template.replace('__NUMBER__', number);
          if (link.getAttribute('aria-label') !== label) link.setAttribute('aria-label', label);
        }
        if (link.hasAttribute('tabindex')) link.removeAttribute('tabindex');
        if (link.hasAttribute('aria-hidden')) link.removeAttribute('aria-hidden');
        return;
      }
      if (link.getAttribute('tabindex') !== '-1') link.setAttribute('tabindex', '-1');
      if (link.getAttribute('aria-hidden') !== 'true') link.setAttribute('aria-hidden', 'true');
    });
  });
}

function initOrdersList() {
  const wrapper = document.querySelector('.unix-orders');
  const list = wrapper && wrapper.querySelector('salla-orders');
  if (!list) return;

  const template = wrapper.dataset.i18nOrder || '';
  // Rows are appended after load, on "load more" and when a filter changes. Attribute changes made
  // here are not observed (childList only), so this cannot loop.
  new MutationObserver(() => labelOrderRows(list, template)).observe(list, { childList: true, subtree: true });
  labelOrderRows(list, template);
}

function init() {
  initAccountNav();
  initOrdersList();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
