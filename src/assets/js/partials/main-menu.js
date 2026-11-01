/**
 * UNIX main menu (ROADMAP 1.3 · DS §8.7, §8.9). Based on Theme Raed's <custom-main-menu>.
 *
 * Data: salla.api.component.getMenus() (the store's header menu, with Salla's mega-menu fields:
 * children, image from the "menu-images" feature, and products).
 *
 * Renders:
 * - Desktop (≥ lg): an inline list. A root item with children opens a full-width mega panel:
 *   a links column (children and their children) plus up to two large images taken from the
 *   children that have a menu image. Without images, Raed's selected-products strip is kept.
 *   Items that don't fit move into a "More" dropdown (setting enable_more_menu).
 * - Mobile (< lg): an accordion (<details>) inside the #mobile-menu drawer (unix-drawer.js).
 */
const DESKTOP_QUERY = '(min-width: 1024px)';
const MAX_MEGA_IMAGES = 2; // DS §8.7: "column of links and two large images"

// Menu titles and URLs come from the merchant: escape them in text and attributes.
const escapeAttr = value => String(value ?? '')
  .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeHtml = escapeAttr;

class NavigationMenu extends HTMLElement {
  connectedCallback() {
    // Skeleton shown until the menu data arrives.
    this.innerHTML = `
      <div class="main-menu-skel" aria-hidden="true">
        <span class="header-skel-item"></span>
        <span class="header-skel-item"></span>
        <span class="header-skel-item"></span>
        <span class="header-skel-item"></span>
      </div>`;

    salla.onReady()
      .then(() => salla.lang.onLoaded())
      .then(() => {
        this.menus = [];
        this.displayAllText = this.dataset.displayAll || salla.lang.get('blocks.home.display_all');
        this.moreText = this.dataset.more || salla.lang.get('common.titles.more');
        this.overflowMenus = [];

        return salla.api.component.getMenus()
          .then(({ data }) => {
            this.menus = data || [];
            this.render();
            this.renderMobile();
            this.bindDesktop();
            this.initializeResponsiveMenu();
          })
          .catch(error => salla.logger.error('salla-menu::Error fetching menus', error));
      });
  }

  hasChildren(menu) {
    return menu?.children?.length > 0;
  }

  hasProducts(menu) {
    return menu?.products?.length > 0;
  }

  // ── Desktop ───────────────────────────────────

  getMegaImages(menu) {
    return menu.children.filter(child => child.image).slice(0, MAX_MEGA_IMAGES);
  }

  getMegaLinks(menu) {
    return menu.children.map(child => `
      <li class="unix-mega__group">
        <a class="unix-mega__heading" href="${escapeAttr(child.url)}" ${child.link_attrs || ''}>${escapeHtml(child.title)}</a>
        ${this.hasChildren(child) ? `
          <ul class="unix-mega__sublist">
            ${child.children.map(grandChild => `
              <li><a class="unix-mega__link" href="${escapeAttr(grandChild.url)}" ${grandChild.link_attrs || ''}>${escapeHtml(grandChild.title)}</a></li>
            `).join('')}
          </ul>` : ''}
      </li>`).join('');
  }

  getMegaPanel(menu) {
    const images = this.getMegaImages(menu);
    const media = images.length
      ? `<div class="unix-mega__media">
          ${images.map(child => `
            <a class="unix-mega__tile" href="${escapeAttr(child.url)}" tabindex="-1">
              <span class="unix-mega__frame">
                <img class="unix-mega__img" src="${escapeAttr(child.image)}" alt="" width="400" height="500" loading="lazy">
              </span>
              <span class="unix-mega__caption">${escapeHtml(child.title)}</span>
            </a>`).join('')}
        </div>`
      : (this.hasProducts(menu)
        ? `<div class="unix-mega__products">
            <salla-products-list source="selected" source-value="[${menu.products}]"></salla-products-list>
          </div>`
        : '');

    return `
      <div class="sub-menu unix-mega${media ? ' has-media' : ''}">
        <div class="unix-container unix-mega__inner">
          <div class="unix-mega__nav">
            <a class="unix-mega__all" href="${escapeAttr(menu.url)}">${escapeHtml(this.displayAllText)}</a>
            <ul class="unix-mega__links">${this.getMegaLinks(menu)}</ul>
          </div>
          ${media}
        </div>
      </div>`;
  }

  getDesktopMenu(menu, index) {
    const children = this.hasChildren(menu);
    return `
      <li class="root-level unix-nav__item${children ? ' has-children' : ''}" ${menu.attrs || ''} data-menu-item data-index="${index}">
        <a class="unix-nav__link" href="${escapeAttr(menu.url)}" ${menu.link_attrs || ''}${children ? ' aria-expanded="false"' : ''}>
          <span>${escapeHtml(menu.title)}</span>
        </a>
        ${children ? this.getMegaPanel(menu) : ''}
      </li>`;
  }

  createMoreDropdown() {
    if (this.overflowMenus.length === 0) return '';
    return `
      <li class="root-level unix-nav__item unix-nav__more has-children" id="more-menu-dropdown">
        <button type="button" class="unix-nav__link" aria-expanded="false">
          <span>${escapeHtml(this.moreText)}</span>
        </button>
        <div class="sub-menu unix-dropdown">
          <ul>
            ${this.overflowMenus.map(menu => `
              <li><a class="unix-dropdown__link" href="${escapeAttr(menu.url)}" ${menu.link_attrs || ''}>${escapeHtml(menu.title)}</a></li>
            `).join('')}
          </ul>
        </div>
      </li>`;
  }

  render() {
    this.innerHTML = `
      <nav class="unix-nav"${this.dataset.label ? ` aria-label="${escapeAttr(this.dataset.label)}"` : ''}>
        <ul class="main-menu unix-nav__list">
          ${this.menus.map((menu, index) => this.getDesktopMenu(menu, index)).join('')}
        </ul>
      </nav>`;
  }

  /**
   * Hover opens a panel through CSS; this adds keyboard, touch and ARIA on top:
   * - aria-expanded mirrors the open state,
   * - Esc closes the open panel and returns focus to its root link,
   * - on touch-only screens the first tap on a root link opens its panel instead of navigating.
   */
  bindDesktop() {
    const list = this.querySelector('.unix-nav__list');
    if (!list) return;
    const touchOnly = window.matchMedia('(hover: none)');

    const setOpen = (item, open) => {
      item.classList.toggle('is-open', open);
      item.querySelector(':scope > .unix-nav__link')?.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    const closeAll = except => list.querySelectorAll(':scope > .has-children.is-open')
      .forEach(item => item !== except && setOpen(item, false));

    list.addEventListener('mouseover', event => {
      const item = event.target.closest('.unix-nav__list > .has-children');
      if (!item) return;
      item.classList.remove('is-dismissed');
      item.querySelector(':scope > .unix-nav__link')?.setAttribute('aria-expanded', 'true');
    });

    list.addEventListener('mouseout', event => {
      const item = event.target.closest('.unix-nav__list > .has-children');
      if (!item || item.contains(event.relatedTarget)) return;
      if (!item.classList.contains('is-open') && !item.matches(':focus-within')) {
        item.querySelector(':scope > .unix-nav__link')?.setAttribute('aria-expanded', 'false');
      }
    });

    list.addEventListener('focusin', event => {
      const item = event.target.closest('.unix-nav__list > .has-children');
      closeAll(item);
      if (item && !item.classList.contains('is-dismissed')) {
        item.querySelector(':scope > .unix-nav__link')?.setAttribute('aria-expanded', 'true');
      }
    });

    list.addEventListener('focusout', event => {
      const item = event.target.closest('.unix-nav__list > .has-children');
      if (!item || item.contains(event.relatedTarget)) return;
      item.classList.remove('is-dismissed');
      setOpen(item, false);
    });

    list.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      const item = event.target.closest('.unix-nav__list > .has-children');
      if (!item) return;
      setOpen(item, false);
      item.classList.add('is-dismissed');
      item.querySelector(':scope > .unix-nav__link')?.focus();
    });

    list.addEventListener('click', event => {
      const link = event.target.closest('.unix-nav__list > .has-children > .unix-nav__link');
      if (!link) return;
      const item = link.parentElement;
      // "More" is a button: always toggles. Root links toggle only on touch-only screens.
      if (link.tagName === 'BUTTON' || (touchOnly.matches && !item.classList.contains('is-open'))) {
        event.preventDefault();
        item.classList.remove('is-dismissed');
        const open = !item.classList.contains('is-open');
        closeAll(item);
        setOpen(item, open);
      }
    });

    document.addEventListener('click', event => {
      if (!this.contains(event.target)) closeAll();
    });
  }

  initializeResponsiveMenu() {
    if (!window.enable_more_menu) return;

    const desktop = window.matchMedia(DESKTOP_QUERY);
    const run = () => desktop.matches && this.checkMenuOverflow();
    run();
    window.addEventListener('resize', this.debounce(run, 250));
  }

  /**
   * Hide the root items that don't fit the start column, from the end, and list them under "More".
   */
  checkMenuOverflow() {
    const nav = this.querySelector('.unix-nav');
    const list = this.querySelector('.unix-nav__list');
    if (!nav || !list) return;

    list.querySelector('#more-menu-dropdown')?.remove();
    const items = Array.from(list.querySelectorAll(':scope > [data-menu-item]'));
    items.forEach(item => { item.hidden = false; });
    this.overflowMenus = [];

    const overflowing = () => list.scrollWidth > nav.clientWidth + 1;
    if (!overflowing()) return;

    // Reserve the "More" slot first, then drop items from the end until everything fits.
    this.overflowMenus = [{ title: this.moreText, url: '#' }];
    list.insertAdjacentHTML('beforeend', this.createMoreDropdown());
    this.overflowMenus = [];

    for (let i = items.length - 1; i >= 0 && overflowing(); i--) {
      items[i].hidden = true;
      this.overflowMenus.unshift(this.menus[Number(items[i].dataset.index)]);
    }

    list.querySelector('#more-menu-dropdown')?.remove();
    list.insertAdjacentHTML('beforeend', this.createMoreDropdown());
  }

  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // ── Mobile accordion (inside the drawer) ──────

  getMobileMenu(menu, depth = 0) {
    if (!this.hasChildren(menu)) {
      return `
        <li class="unix-mmenu__item">
          <a class="unix-mmenu__link" href="${escapeAttr(menu.url)}" ${menu.link_attrs || ''}>${escapeHtml(menu.title)}</a>
        </li>`;
    }

    return `
      <li class="unix-mmenu__item">
        <details class="unix-mmenu__group" data-depth="${depth}">
          <summary class="unix-mmenu__summary">
            <span>${escapeHtml(menu.title)}</span>
            <span class="unix-mmenu__icon" aria-hidden="true"></span>
          </summary>
          <ul class="unix-mmenu__panel">
            <li class="unix-mmenu__item">
              <a class="unix-mmenu__link unix-mmenu__link--all" href="${escapeAttr(menu.url)}">${escapeHtml(this.displayAllText)}</a>
            </li>
            ${menu.children.map(child => this.getMobileMenu(child, depth + 1)).join('')}
          </ul>
        </details>
      </li>`;
  }

  renderMobile() {
    const target = document.querySelector('#mobile-menu [data-drawer-menu]');
    if (!target) return;
    target.innerHTML = this.menus.map(menu => this.getMobileMenu(menu)).join('');
  }
}

customElements.define('custom-main-menu', NavigationMenu);
