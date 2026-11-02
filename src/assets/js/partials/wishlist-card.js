/**
 * Wishlist row card (ROADMAP 5.3 · DS §8.40 · D3, D98)
 * Rendered by Salla's `salla-products-list source="wishlist"` on pages/customer/wishlist.twig
 * (product-card-component="custom-wishlist-card"). Wishlist and cart logic stay Salla's:
 * `salla-add-product-button` adds to the cart, `salla.wishlist.remove()` removes the item, and
 * js/wishlist.js (Raed) animates the row out by its `#wishlist-product-{id}` id.
 * UI strings come from the page wrapper's data-* attributes (blocks.unix.account.*).
 */

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);

// 1.5px-stroke trash icon (DS §6), same as the cart lines
const TRASH_ICON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>';

class WishlistCard extends HTMLElement {

  connectedCallback() {
    if (!this.product) {
      return salla.logger.warn('custom-wishlist-card:: product does not exist!');
    }
    salla.onReady(() => this.render());
  }

  i18n(key, fallback = '') {
    const host = this.closest('[data-unix-wishlist]');
    return (host && host.dataset[key]) || fallback;
  }

  render() {
    const product = this.product;
    const name = escapeHtml(product.name);
    const url = escapeHtml(product.url);
    const imageUrl = product.image && product.image.url ? escapeHtml(product.image.url) : '';
    const removeLabel = escapeHtml(this.i18n('i18nRemove', '__NAME__').replace('__NAME__', product.name || ''));

    this.setAttribute('id', `wishlist-product-${product.id}`);
    this.classList.add('unix-wish');

    const price = product.is_on_sale
      ? `<span class="unix-wish__price is-sale"><span class="sr-only">${escapeHtml(this.i18n('i18nSale'))}</span>${salla.money(product.sale_price)}</span>
         <s class="unix-wish__old"><span class="sr-only">${escapeHtml(this.i18n('i18nRegular'))}</span>${salla.money(product.regular_price)}</s>`
      : `<span class="unix-wish__price">${salla.money(product.price)}</span>`;

    this.innerHTML = `
      <a href="${url}" class="unix-wish__media" tabindex="-1" aria-hidden="true">
        ${imageUrl ? `<img src="${imageUrl}" alt="" width="120" height="160" loading="lazy">` : ''}
      </a>
      <div class="unix-wish__info">
        <h2 class="unix-wish__name"><a href="${url}">${name}</a></h2>
        <p class="unix-wish__prices">${price}</p>
      </div>
      <div class="unix-wish__actions">
        <salla-add-product-button class="unix-wish__add" fill="outline" loader-position="center"
          product-id="${escapeHtml(product.id)}" product-status="${escapeHtml(product.status)}" product-type="${escapeHtml(product.type)}">
        </salla-add-product-button>
        <button type="button" class="unix-wish__remove" aria-label="${removeLabel}">${TRASH_ICON}</button>
      </div>
    `;

    const removeButton = this.querySelector('.unix-wish__remove');
    removeButton.addEventListener('click', () => {
      // aria-disabled (not `disabled`) keeps the button focusable while the request runs
      if (removeButton.getAttribute('aria-disabled') === 'true') return;
      removeButton.setAttribute('aria-disabled', 'true');
      removeButton.setAttribute('aria-busy', 'true');
      Promise.resolve(salla.wishlist.remove(product.id))
        .then(() => this.moveFocusAway())
        .catch(() => {
          removeButton.removeAttribute('aria-disabled');
          removeButton.removeAttribute('aria-busy');
          removeButton.focus();
        });
    });
  }

  // Nearest row that is not already fading out (js/wishlist.js adds .fade-out-collapse)
  findNeighbour() {
    const live = '.unix-wish:not(.fade-out-collapse)';
    for (const step of ['nextElementSibling', 'previousElementSibling']) {
      let el = this[step];
      while (el && !el.matches(live)) el = el[step];
      if (el) return el;
    }
    // Rows wrapped by salla-products-list (e.g. share-selection mode) are not siblings
    const rows = [...document.querySelectorAll(`#wishlist ${live}`)].filter((row) => row !== this);
    return rows[0] || null;
  }

  // The row fades out and is removed (js/wishlist.js): keep keyboard focus on the list (DS §8.40)
  moveFocusAway() {
    const neighbour = this.findNeighbour();
    const target = neighbour
      ? neighbour.querySelector('.unix-wish__remove')
      : document.querySelector('.unix-account__title');

    if (!target) return;
    if (!neighbour) target.setAttribute('tabindex', '-1');
    target.focus();
  }
}

customElements.define('custom-wishlist-card', WishlistCard);
