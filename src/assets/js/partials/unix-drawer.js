/**
 * UNIX drawer (DS §8.9): used by the mobile menu (ROADMAP 1.3) and reusable for the cart drawer (4.3).
 * - Slides in from the inline-start side (styles in unix-menu.scss).
 * - Focus is trapped inside while open; Esc and the backdrop close it.
 * - Focus returns to the element that opened it.
 * - While any drawer is open the page (.app-inner) is inert and the body scroll is locked
 *   (counted, so stacked drawers release it only when the last one closes).
 * Markup: <div data-unix-drawer id="..." hidden> … [data-drawer-close] … </div>,
 * opened by any <a href="#id"> or [aria-controls="id"] trigger.
 */
const FOCUSABLE = [
  'a[href]', 'area[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])', 'textarea:not([disabled])', 'summary', '[tabindex]:not([tabindex="-1"])',
].join(',');

const OPEN_BODY_CLASS = 'unix-drawer-open';

/*
 * Open drawers, newest last (menu, filters, cart can stack). The body scroll lock and the
 * inert page stay on until the last one closes; only the top drawer handles Esc and Tab.
 * Drawers live under <body> and so do Salla's modals (login, search, offers, scopes:
 * layouts/master.twig, after .app-inner), so making .app-inner inert leaves them usable.
 * The localization modal sits in the header, but its triggers close the drawer first.
 */
// Shared on window: this module is bundled twice (app.js: menu + cart; product.js: filters).
const openStack = window.unixOpenDrawers || (window.unixOpenDrawers = []);

function syncPageState() {
  const anyOpen = openStack.length > 0;
  document.body.classList.toggle(OPEN_BODY_CLASS, anyOpen);
  const page = document.querySelector('.app-inner');
  if (page) page.inert = anyOpen;
}

function cssDuration(name) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const value = parseFloat(raw) || 0;
  return raw.endsWith('ms') ? value : value * 1000;
}

export class Drawer {
  constructor(el) {
    this.el = el;
    this.id = el.id;
    this.panel = el.querySelector('.unix-drawer__panel') || el;
    this.isOpen = false;
    this.returnFocusTo = null;
    this.closeTimer = null;
    this.onKeydown = this.onKeydown.bind(this);

    // Fixed positioning must not be trapped by a transformed ancestor (e.g. the sticky header bar).
    if (el.parentElement !== document.body) document.body.appendChild(el);

    el.addEventListener('click', event => {
      if (event.target.closest('[data-drawer-close]')) this.close();
    });
    el.addEventListener('drawer:request-close', () => this.close());

    document.addEventListener('click', event => {
      const trigger = event.target.closest(`a[href="#${this.id}"], [aria-controls="${this.id}"]`);
      if (!trigger || el.contains(trigger)) return;
      // A real link trigger (e.g. the header cart) keeps the browser's own new-tab/window clicks
      if (trigger.matches('a[href]:not([href^="#"])') && (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
      event.preventDefault();
      this.isOpen ? this.close() : this.open(trigger);
    });
  }

  triggers() {
    return document.querySelectorAll(`a[href="#${this.id}"], [aria-controls="${this.id}"]`);
  }

  focusables() {
    return Array.from(this.panel.querySelectorAll(FOCUSABLE))
      .filter(node => node.getClientRects().length > 0 && !node.closest('[hidden]'));
  }

  open(trigger = document.activeElement) {
    if (this.isOpen) return;
    clearTimeout(this.closeTimer);
    this.isOpen = true;
    this.returnFocusTo = trigger;

    this.el.hidden = false;
    // Next frame so the transition runs from the closed position.
    requestAnimationFrame(() => requestAnimationFrame(() => this.el.classList.add('is-open')));

    openStack.push(this);
    syncPageState();
    this.triggers().forEach(node => node.setAttribute('aria-expanded', 'true'));
    document.addEventListener('keydown', this.onKeydown);

    const first = this.focusables()[0] || this.panel;
    first.focus({ preventScroll: true });
    this.el.dispatchEvent(new CustomEvent('drawer:open', { bubbles: true }));
  }

  /**
   * @param {{focusTarget?: HTMLElement, returnFocus?: boolean}} [options] focusTarget replaces the
   *   trigger as the element that gets focus back (used when the trigger is no longer visible);
   *   returnFocus: false leaves focus alone (another dialog, e.g. Salla's login, is taking over).
   */
  close({ focusTarget, returnFocus = true } = {}) {
    if (!this.isOpen) return;
    this.isOpen = false;

    this.el.classList.remove('is-open');
    const index = openStack.indexOf(this);
    if (index > -1) openStack.splice(index, 1);
    syncPageState();
    this.triggers().forEach(node => node.setAttribute('aria-expanded', 'false'));
    document.removeEventListener('keydown', this.onKeydown);

    this.closeTimer = setTimeout(() => { this.el.hidden = true; }, cssDuration('--d-slow'));

    const target = focusTarget || this.returnFocusTo;
    if (returnFocus && target && document.contains(target)) target.focus({ preventScroll: true });
    this.el.dispatchEvent(new CustomEvent('drawer:close', { bubbles: true }));
  }

  onKeydown(event) {
    if (openStack[openStack.length - 1] !== this) return; // only the top drawer reacts
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }
    if (event.key !== 'Tab') return;

    const nodes = this.focusables();
    if (!nodes.length) {
      event.preventDefault();
      return;
    }
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || !this.panel.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !this.panel.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  }
}

/**
 * Mobile menu drawer. Closes itself when the viewport reaches the desktop layout (lg = 1024px),
 * where the inline mega menu takes over.
 */
export default function initMenuDrawer() {
  const el = document.getElementById('mobile-menu');
  if (!el || !el.hasAttribute('data-unix-drawer')) return null;

  const drawer = new Drawer(el);
  const desktop = window.matchMedia('(min-width: 1024px)');
  // The hamburger is hidden from lg up, so focus goes to the first inline menu link, or the page.
  const onChange = event => {
    if (!event.matches || !drawer.isOpen) return;
    const inlineLink = document.querySelector('.unix-nav__link');
    const main = document.getElementById('main-content');
    if (!inlineLink && main && !main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
    drawer.close({ focusTarget: inlineLink || main || document.body });
  };
  if (desktop.addEventListener) desktop.addEventListener('change', onChange);
  else desktop.addListener(onChange);

  return drawer;
}
