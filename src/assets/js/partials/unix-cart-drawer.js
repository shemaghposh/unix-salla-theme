/* ============================================================
   UNIX — Cart drawer (ROADMAP 4.3 · DS §8.33, §8.9 · SPEC §7.1)

   Port of unix.sa cart-drawer.js on Salla:
   - Opens from the header cart (salla-cart-summary; its link stays the
     no-JS fallback) and after every add to cart (D85).
   - Focus trap / Esc / backdrop / focus return: Drawer (unix-drawer.js, 1.3).
   - Lines come from salla.cart.api.details(null, ['options']); quantity and
     removal go through salla.cart.updateItem / salla.cart.deleteItem; checkout
     is salla.cart.submit(). Nothing here computes prices or totals.
   - Keeps itself in step with salla.cart.event.onUpdated: refetches while
     open, marks itself stale while closed.
   ============================================================ */

import { Drawer } from './unix-drawer';
import initCashbackNote, { updateCashbackNote } from './unix-cashback-note';
import initFreeShipping, { updateFreeShipping } from './unix-free-shipping';

const REFRESH_DELAY = 120; // ms: coalesce Salla's burst of cart events into one details() call

function money(value) {
  return window.salla?.money ? window.salla.money(Number(value) || 0) : String(value);
}

function number(value) {
  return window.salla?.helpers?.number ? window.salla.helpers.number(value) : String(value);
}

/** Selected options as {name, value} (same rules as Raed's add-product-toast). */
function selectedOptions(options) {
  if (!Array.isArray(options)) return [];
  return options.reduce((list, option) => {
    if (!option || option.type === 'splitter') return list;
    if (option.details?.length) {
      const picked = option.type === 'multiple-options'
        ? option.details.filter((d) => d.is_selected)
        : [option.details.find((d) => d.is_selected)].filter(Boolean);
      if (picked.length) list.push({ name: option.name, value: picked.map((d) => d.name).join('، ') });
    } else if (option.value && !['image', 'file', 'map'].includes(option.type)) {
      list.push({ name: option.name, value: option.value });
    }
    return list;
  }, []);
}

class CartDrawer {
  constructor(el) {
    this.el = el;
    this.drawer = new Drawer(el);
    this.i18n = el.dataset;
    this.tpl = el.querySelector('template[data-cd-item-tpl]');
    this.list = el.querySelector('[data-cd-items]');
    this.parts = {
      count: el.querySelector('[data-cd-count]'),
      loading: el.querySelector('[data-cd-loading]'),
      loadingLabel: el.querySelector('[data-cd-loading-label]'),
      error: el.querySelector('[data-cd-error]'),
      empty: el.querySelector('[data-cd-empty]'),
      body: el.querySelector('[data-cd-body]'),
      footer: el.querySelector('[data-cd-footer]'),
      subtotal: el.querySelector('[data-cd-subtotal]'),
      live: el.querySelector('[data-cd-live]'),
      checkout: el.querySelector('[data-cd-checkout]'),
    };
    this.loaded = false;
    this.stale = true;
    this.timer = null;
    this.request = 0;
    this.announceNext = false;

    this.bindTriggers();
    this.bindItems();
    this.bindCheckout();
    this.bindSalla();

    el.addEventListener('drawer:open', () => {
      this.setExpanded(true);
      if (this.stale || !this.loaded) this.refresh();
    });
    el.addEventListener('drawer:close', () => this.setExpanded(false));
  }

  // ── Opening ──────────────────────────────────────
  cartTriggers() {
    return document.querySelectorAll('salla-cart-summary[data-unix-cart-open]');
  }

  setExpanded(open) {
    this.cartTriggers().forEach((host) => {
      const link = host.querySelector('a');
      if (link) link.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  bindTriggers() {
    // Salla renders the anchor asynchronously; tell assistive tech it opens a dialog once it exists.
    this.cartTriggers().forEach((host) => {
      const mark = () => {
        const link = host.querySelector('a');
        if (!link) return false;
        link.setAttribute('aria-haspopup', 'dialog');
        link.setAttribute('aria-controls', this.el.id); // Drawer then owns the click + aria-expanded
        link.setAttribute('aria-expanded', 'false');
        return true;
      };
      if (!mark() && host.componentOnReady) host.componentOnReady().then(mark);
    });

    document.addEventListener('click', (event) => {
      const host = event.target.closest('salla-cart-summary[data-unix-cart-open]');
      if (!host || event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button === 1) return; // new tab keeps the link
      event.preventDefault();
      this.drawer.open(host.querySelector('a') || host);
    });
  }

  // ── Salla events ─────────────────────────────────
  bindSalla() {
    const cart = window.salla?.cart?.event;
    if (!cart) return;

    // unix.sa: every add to cart opens the drawer (the drawer is the confirmation, D85)
    cart.onItemAdded?.(() => {
      this.stale = true;
      this.announceNext = true;
      if (this.drawer.isOpen) this.schedule();
      else this.drawer.open(document.activeElement);
    });

    cart.onUpdated?.((summary) => {
      if (summary?.count != null && this.parts.count) this.parts.count.textContent = number(summary.count);
      this.stale = true;
      if (this.drawer.isOpen) this.schedule();
    });

    // Salla's login modal sits under the drawer: hand the screen (and focus) over to it
    window.salla?.event?.on?.('login::open', () => this.drawer.close({ returnFocus: false }));
  }

  schedule() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.refresh(), REFRESH_DELAY);
  }

  // ── Data ─────────────────────────────────────────
  async refresh() {
    const ticket = ++this.request;
    this.stale = false;
    if (!this.loaded) this.setLoading(true);
    try {
      const response = await window.salla.cart.api.details(null, ['options']);
      if (ticket !== this.request) return; // a newer refresh is on its way
      this.render(response?.data?.cart || {});
      this.loaded = true;
      this.parts.error.hidden = true;
    } catch (error) {
      // A guest who never added anything has no cart yet: that is the empty state, not an error
      if (error?.name === 'CartNotCreated') {
        if (ticket === this.request) {
          this.render({});
          this.loaded = true;
          this.parts.error.hidden = true;
        }
        return;
      }
      if (ticket !== this.request) return;
      window.salla?.log?.('UNIX cart drawer: could not load the cart', error);
      this.stale = true;
      if (!this.loaded) this.parts.error.hidden = false;
    } finally {
      if (ticket === this.request) this.setLoading(false);
    }
  }

  setLoading(on) {
    this.parts.loading.hidden = !on;
    this.parts.loadingLabel.hidden = !on;
    this.el.querySelector('.unix-cd__panel').setAttribute('aria-busy', on ? 'true' : 'false');
  }

  // ── Rendering ────────────────────────────────────
  render(cart) {
    const items = Array.isArray(cart.items) ? cart.items : [];
    const count = Number(cart.count ?? items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0));
    const isEmpty = !items.length;

    this.parts.count.textContent = number(count);
    this.parts.empty.hidden = !isEmpty;
    this.parts.body.hidden = isEmpty;
    this.parts.footer.hidden = isEmpty;
    this.el.classList.toggle('is-empty', isEmpty);

    this.renderItems(items);
    this.parts.subtotal.innerHTML = money(cart.total);

    updateFreeShipping({ count, sub_total: cart.sub_total, free_shipping_bar: cart.free_shipping_bar });
    updateCashbackNote(cart.sub_total ?? 0);

    if (this.announceNext && this.loaded) {
      const text = (this.i18n.i18nLive || '')
        .replace('__COUNT__', number(count))
        .replace('__TOTAL__', this.parts.subtotal.textContent.trim());
      this.parts.live.textContent = text;
    }
    this.announceNext = false;
  }

  renderItems(items) {
    const existing = new Map();
    this.list.querySelectorAll('[data-cd-item]').forEach((node) => existing.set(node.dataset.id, node));

    items.forEach((item, index) => {
      const id = String(item.id);
      let node = existing.get(id);
      if (node) existing.delete(id);
      else node = this.createItem(item);
      this.fillItem(node, item);
      // only move nodes that are out of place, so a focused stepper keeps focus
      if (this.list.children[index] !== node) this.list.insertBefore(node, this.list.children[index] || null);
    });

    existing.forEach((node) => node.remove());
  }

  createItem(item) {
    const node = this.tpl.content.firstElementChild.cloneNode(true);
    node.dataset.id = String(item.id);
    const name = String(item.product_name || '');

    node.querySelectorAll('[data-cd-link]').forEach((link) => { if (item.url) link.href = item.url; });
    node.querySelector('[data-cd-name]').textContent = name;
    const img = node.querySelector('[data-cd-img]');
    if (item.product_image) img.src = item.product_image;
    else node.querySelector('.unix-cd-item__media').classList.add('is-blank');

    const remove = node.querySelector('[data-cd-remove]');
    remove.setAttribute('aria-label', (this.i18n.i18nRemove || '').replace('__NAME__', name));

    const qtySlot = node.querySelector('[data-cd-qty]');
    if (item.type === 'donating') {
      qtySlot.remove();
    } else if (item.is_hidden_quantity) {
      qtySlot.innerHTML = `<span class="unix-cd-item__qty-text">${number(item.quantity)}</span>`;
    } else {
      const qty = document.createElement('salla-quantity-input');
      qty.setAttribute('value', String(item.quantity));
      qty.setAttribute('cart-item-id', String(item.id));
      qty.setAttribute('name', 'quantity');
      qty.setAttribute('aria-label', (this.i18n.i18nQuantity || '').replace('__NAME__', name));
      if (item.max_quantity) qty.setAttribute('max', String(item.max_quantity));
      qtySlot.appendChild(qty);
    }
    node.dataset.qty = String(item.quantity);
    return node;
  }

  fillItem(node, item) {
    // options
    const opts = selectedOptions(item.options);
    const dl = node.querySelector('[data-cd-options]');
    dl.replaceChildren(...opts.map(({ name, value }) => {
      const row = document.createElement('div');
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = `${name}:`;
      dd.textContent = value;
      row.append(dt, dd);
      return row;
    }));
    dl.hidden = !opts.length;

    // offer name (Salla's offers on the line)
    const offer = node.querySelector('[data-cd-offer]');
    const offerName = item.offer?.names || '';
    offer.textContent = offerName;
    offer.hidden = !offerName;

    // line price incl. discounts (Salla's own totals)
    const price = node.querySelector('[data-cd-price]');
    if (item.is_available === false) {
      price.textContent = this.i18n.i18nSoldOut || '';
      price.classList.add('is-sold-out');
    } else {
      price.classList.remove('is-sold-out');
      const quantity = Number(item.quantity) || 1;
      const final = Number(item.detailed_offers?.length ? item.total_special_price : item.total) || 0;
      const unitBefore = Math.max(Number(item.original_price) || 0, Number(item.product_price) || 0);
      const before = unitBefore * quantity;
      if (before - final > 0.004) {
        price.innerHTML = `<span class="sr-only">${this.i18n.i18nSalePrice || ''}</span>`
          + `<span class="unix-cd-item__price-final">${money(final)}</span>`
          + `<span class="sr-only">${this.i18n.i18nRegularPrice || ''}</span>`
          + `<s class="unix-cd-item__price-old">${money(before)}</s>`;
      } else {
        price.innerHTML = `<span class="unix-cd-item__price-final">${money(final)}</span>`;
      }
    }

    // quantity coming back from Salla (another tab, an offer, a max cap): no change event,
    // and only when the visible value differs (no re-render under the shopper's fingers)
    node.dataset.qty = String(item.quantity);
    const qty = node.querySelector('salla-quantity-input');
    if (qty && qty.querySelector('input')?.value !== String(item.quantity)) {
      if (typeof qty.setValue === 'function') qty.setValue(item.quantity, false);
      else qty.setAttribute('value', String(item.quantity));
    }
    const qtyText = node.querySelector('.unix-cd-item__qty-text');
    if (qtyText) qtyText.textContent = number(item.quantity);

    node.removeAttribute('aria-busy');
  }

  // ── Line actions ─────────────────────────────────
  bindItems() {
    // salla-quantity-input fires a bubbling `change` with {quantity} after its own debounce
    this.list.addEventListener('change', (event) => {
      const node = event.target.closest('[data-cd-item]');
      if (!node || !event.target.closest('salla-quantity-input')) return;
      const quantity = Number(event.detail?.quantity ?? event.target.value);
      if (!quantity || String(quantity) === node.dataset.qty) return;
      node.dataset.qty = String(quantity);
      node.setAttribute('aria-busy', 'true');
      this.announceNext = true;
      this.request++; // drop any details() still in flight: it predates this change
      window.salla.cart.updateItem({ id: node.dataset.id, quantity })
        .catch(() => { this.stale = true; this.schedule(); }) // Salla shows the error; re-read the real quantity
        .finally(() => node.removeAttribute('aria-busy'));
    });

    this.list.addEventListener('click', (event) => {
      const button = event.target.closest('[data-cd-remove]');
      if (!button) return;
      const node = button.closest('[data-cd-item]');
      if (!node || node.getAttribute('aria-busy') === 'true') return;
      node.setAttribute('aria-busy', 'true');
      button.disabled = true;
      this.announceNext = true;
      this.request++; // drop any details() still in flight: it predates this removal
      window.salla.cart.deleteItem(node.dataset.id)
        .then(() => {
          // focus moves to the next line's remove button, else the previous one, else the close button
          const sibling = node.nextElementSibling || node.previousElementSibling;
          const target = sibling?.querySelector('[data-cd-remove]') || this.el.querySelector('.unix-drawer__close');
          node.remove();
          target?.focus({ preventScroll: true });
        })
        .catch(() => {
          node.removeAttribute('aria-busy');
          button.disabled = false;
        });
    });
  }

  bindCheckout() {
    const button = this.parts.checkout;
    if (!button) return;
    button.addEventListener('click', () => {
      if (button.classList.contains('is-loading')) return;
      button.classList.add('is-loading');
      button.setAttribute('aria-busy', 'true');
      // Salla redirects to checkout, or opens its login modal for a guest, or fails: release the button
      const release = () => {
        button.classList.remove('is-loading');
        button.removeAttribute('aria-busy');
      };
      window.salla?.event?.once?.('login::open', release);
      window.salla?.event?.once?.('cart::submit.failed', (error) => {
        release();
        // Required cart-level options etc. are validated by Salla's server (D89): surface its message
        const message = error?.response?.data?.error?.message || error?.message;
        if (message && typeof message === 'string') window.salla?.notify?.error?.(message);
      });
      window.salla.cart.submit();
    });
  }
}

/** One drawer per page (only rendered when unix_cart_drawer_enabled is on and this is not the cart page). */
export default function initCartDrawer() {
  const el = document.getElementById('cart-drawer');
  if (!el || !el.hasAttribute('data-unix-cart-drawer') || !window.salla?.cart) return null;
  initCashbackNote();
  initFreeShipping();
  return new CartDrawer(el);
}
