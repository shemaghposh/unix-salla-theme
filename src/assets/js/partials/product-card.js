import BasePage from '../base-page';
import arLocale from '../../../locales/ar.json';
import enLocale from '../../../locales/en.json';
class ProductCard extends HTMLElement {
  constructor(){
    super()
  }
  
  connectedCallback(){
    // Parse product data
    this.product = this.product || JSON.parse(this.getAttribute('product')); 

    if (window.app?.status === 'ready') {
      this.onReady();
    } else {
      document.addEventListener('theme::ready', () => this.onReady() )
    }
  }

  onReady(){
      this.fitImageHeight = salla.config.get('store.settings.product.fit_type');
      this.placeholder = salla.url.asset(salla.config.get('theme.settings.placeholder'));
      this.getProps()

      salla.lang.onLoaded(() => {
        // Language
        this.remained = salla.lang.get('pages.products.remained');
        this.donationAmount = salla.lang.get('pages.products.donation_amount');
        this.startingPrice = salla.lang.get('pages.products.starting_price');
        this.addToCart = salla.lang.get('pages.cart.add_to_cart');
        this.outOfStock = salla.lang.get('pages.products.out_of_stock');

        // re-render to update translations
        this.render();
      })
      
      this.render()
  }

  initCircleBar() {
    let qty = this.product.quantity,
      total = this.product.quantity > 100 ? this.product.quantity * 2 : 100,
      roundPercent = (qty / total) * 100,
      bar = this.querySelector('.s-product-card-content-pie-svg-bar'),
      strokeDashOffsetValue = 100 - roundPercent;
    bar.style.strokeDashoffset = strokeDashOffsetValue;
  }

  formatDate(date) {
    let d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  } 

  getProductBadge() {
    // 6.4 (DS §8.3 / §8.4): like unix.sa's card (`badge--soldout` comes first), a sold-out product in a
    // UNIX row shows one cream «نفدت الكمية» chip and no other badge; the photo stays in colour.
    // Text from the bundled theme locale (salla.lang has no theme keys in the browser, see getWishlistLabel).
    if (this.product?.is_out_of_stock && this.closest('.unix-products')) {
      const isEn = (document.documentElement.lang || 'ar').toLowerCase().startsWith('en');
      // Static member chains so webpack keeps only these two strings (same as getWishlistLabel).
      const label = isEn ? enLocale.blocks.unix.card.sold_out : arLocale.blocks.unix.card.sold_out;
      return `<div class="s-product-card-promotion-title s-product-card-sold-out">${this.escapeHTML(label)}</div>`
    }

    if (this.product?.preorder?.label) {
      return `<div class="s-product-card-promotion-title">${this.escapeHTML(this.product.preorder.label)}</div>`
    }

    if (this.product.promotion_title) {
      return `<div class="s-product-card-promotion-title">${this.escapeHTML(this.product.promotion_title)}</div>`
    }
    if (this.showQuantity && this.product?.quantity) {
      return `<div
        class="s-product-card-quantity">${this.remained} ${salla.helpers.number(this.product?.quantity)}</div>`
    }
    if (this.showQuantity && this.product?.is_out_of_stock) {
      return `<div class="s-product-card-out-badge">${this.outOfStock}</div>`
    }
    return '';
  }

  /**
   * 6.4 (DS §8.3, amends D20): unix.sa's vendor line above the title (show_vendor: true → «Unix»).
   * Salla's brand when the product has one, else the store name. Only on the theme's own card rows
   * (`.unix-products`, same gate as the secondary image), never on minimal / full-image / horizontal cards.
   */
  getVendor() {
    if (this.minimal || this.fullImage || this.horizontal || !this.closest('.unix-products')) return '';
    const vendor = this.product?.brand?.name || salla.config.get('store.name') || '';
    return vendor ? `<p class="s-product-card-vendor">${this.escapeHTML(vendor)}</p>` : '';
  }

  getPriceFormat(price) {
    if (!price || price == 0) {
      return salla.config.get('store.settings.product.show_price_as_dash')?'-':'';
    }

    return salla.money(price);
  }

  getProductPrice() {
    let price = '';
    if (this.product.is_on_sale) {
      price = `<div class="s-product-card-sale-price">
                <h4>${this.getPriceFormat(this.product.sale_price)}</h4>
                <span>${this.getPriceFormat(this.product?.regular_price)}</span>
              </div>`;
    }
    else if (this.product.starting_price) {
      price = `<div class="s-product-card-starting-price">
                  <p>${this.startingPrice}</p>
                  <h4> ${this.getPriceFormat(this.product?.starting_price)} </h4>
              </div>`
    }
    else{
      price = `<h4 class="s-product-card-price">${this.getPriceFormat(this.product?.price)}</h4>`
    }

    return price;
  }

  getAddButtonLabel() {
    if(this.product.has_preorder_campaign) {
        return salla.lang.get('pages.products.pre_order_now');
    }

    if (this.product.status === 'sale' && this.product.type === 'booking') {
      return salla.lang.get('pages.cart.book_now');
    }

    if (this.product.status === 'sale') {
      // ROADMAP 6.4: Salla's own «أضف إلى السلة» is masculine; the card uses the theme's feminine label
      // (same string as the product page button), bundled because salla.lang lacks theme keys.
      const isEn = (document.documentElement.lang || 'ar').toLowerCase().startsWith('en');
      return isEn ? enLocale.blocks.unix.pdp_info.add_to_cart : arLocale.blocks.unix.pdp_info.add_to_cart;
    }

    if (this.product.type !== 'donating') {
      return salla.lang.get('pages.products.out_of_stock');
    }

    // donating
    return salla.lang.get('pages.products.donation_exceed');
  }

  /**
   * Quick-add label. A UNIX section can ask for its own short label for products on plain sale
   * through `data-unix-add-label` on an ancestor («أضيفي» in «أكملي الإطلالة», ROADMAP 3.9 · DS §8.27).
   * Pre-order, booking, donation and out-of-stock keep Salla's own wording.
   */
  getCardAddLabel() {
    const unixLabel = this.closest('[data-unix-add-label]')?.dataset.unixAddLabel;
    const plainSale = this.product.status === 'sale'
      && !this.product.is_out_of_stock
      && !this.product.has_preorder_campaign
      && !['booking', 'donating'].includes(this.product.type);
    if (unixLabel && plainSale) {
      return this.escapeHTML(unixLabel);
    }
    return this.product.add_to_cart_label ? this.product.add_to_cart_label : this.getAddButtonLabel();
  }

  /**
   * Second product image for the hover crossfade (DS §8.3). Rendered only inside UNIX product
   * rows (`.unix-products`, which request includes='["images"]'); every other listing renders
   * exactly as before. Decorative: the first image carries the alt. CSS keeps it display:none
   * outside `.unix-products` and on devices without hover (unix-product-card.scss).
   */
  getSecondaryImage() {
    if (!this.closest('.unix-products') || this.fullImage || this.minimal || this.horizontal) {
      return '';
    }
    const main = this.product?.image?.url;
    const second = (this.product?.images || []).find(img => img?.url && img.url !== main);
    if (!second) {
      return '';
    }
    return `<img class="s-product-card-image-secondary s-product-card-image-cover" src="${this.escapeHTML(second.url)}" alt="" aria-hidden="true" loading="lazy" />`;
  }

  /**
   * Wishlist heart name (ROADMAP 6.3 · DS §8.3): one fixed, localized label per card that names
   * the product; the saved state lives in aria-pressed only (never in the label).
   */
  getWishlistLabel() {
    const name = this.product?.name || '';
    const key = 'blocks.unix.card.wishlist';
    let label = salla.lang.get(key, { name });
    // ROADMAP 6.4: salla.lang in the browser lacks the theme's keys; fall back to the bundled locale.
    if (typeof label !== 'string' || label === key) {
      const isEn = (document.documentElement.lang || 'ar').toLowerCase().startsWith('en');
      // Static member chains so webpack keeps only these two strings, not the whole locale files.
      label = (isEn ? enLocale.blocks.unix.card.wishlist : arLocale.blocks.unix.card.wishlist).split(':name').join(name);
    }
    return this.escapeHTML(label);
  }

  /**
   * Heart icon (DS §6, §8.3): inline SVG, stroke 1.5, currentColor. The saved state fills it from
   * CSS (`[aria-pressed="true"]`, unix-product-card.scss), so no re-render is needed on toggle.
   */
  getHeartIcon() {
    return `<svg class="unix-heart" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M12 20.25s-7.5-4.6-7.5-10.1A4.15 4.15 0 0 1 8.65 6c1.4 0 2.6.7 3.35 1.8A4.05 4.05 0 0 1 15.35 6a4.15 4.15 0 0 1 4.15 4.15c0 5.5-7.5 10.1-7.5 10.1Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
  }

  getProps(){

    /**
     *  Horizontal card.
     */
    this.horizontal = this.hasAttribute('horizontal');
  
    /**
     *  Support shadow on hover.
     */
    this.shadowOnHover = this.hasAttribute('shadowOnHover');
  
    /**
     *  Hide add to cart button.
     */
    this.hideAddBtn = this.hasAttribute('hideAddBtn');
  
    /**
     *  Full image card.
     */
    this.fullImage = this.hasAttribute('fullImage');
  
    /**
     *  Minimal card.
     */
    this.minimal = this.hasAttribute('minimal');
  
    /**
     *  Special card.
     */
    this.isSpecial = this.hasAttribute('isSpecial');
  
    /**
     *  Show quantity.
     */
    this.showQuantity = this.hasAttribute('showQuantity');
  }

  escapeHTML(str = '') {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  }

  render(){
    this.classList.add('s-product-card-entry'); 
    this.setAttribute('id', this.product.id);
    !this.horizontal && !this.fullImage && !this.minimal? this.classList.add('s-product-card-vertical') : '';
    this.horizontal && !this.fullImage && !this.minimal? this.classList.add('s-product-card-horizontal') : '';
    this.fitImageHeight && !this.isSpecial && !this.fullImage && !this.minimal? this.classList.add('s-product-card-fit-height') : '';
    this.isSpecial? this.classList.add('s-product-card-special') : '';
    this.fullImage? this.classList.add('s-product-card-full-image') : '';
    this.minimal? this.classList.add('s-product-card-minimal') : '';
    this.product?.donation?  this.classList.add('s-product-card-donation') : '';
    this.shadowOnHover?  this.classList.add('s-product-card-shadow') : '';
    this.product?.is_out_of_stock?  this.classList.add('s-product-card-out-of-stock') : '';
    this.isInWishlist = !salla.config.isGuest() && salla.storage.get('salla::wishlist', []).includes(Number(this.product.id));
    this.effectiveStatus = (this.product.is_out_of_stock && window.notify_when_available_in_card && !['donating', 'financial_support'].includes(this.product?.type))
      ? 'out-and-notify'
      : this.product.status;
      this.innerHTML = `
        <div class="${!this.fullImage ? 's-product-card-image' : 's-product-card-image-full'}">
          <a href="${this.escapeHTML(this.product?.url)}" tabindex="-1" aria-hidden="true">
           <img 
              class="s-product-card-image-${salla.url.is_placeholder(this.product?.image?.url)
                ? 'contain'
                : this.fitImageHeight
                ? this.fitImageHeight
                : 'cover'}"
              src="${this.escapeHTML(this.product?.image?.url || this.product?.thumbnail || this.placeholder || '')}"
              alt="${this.escapeHTML(this.product?.image?.alt || this.product.name)}"
              loading="lazy"
            />
            ${this.getSecondaryImage()}
            ${!this.fullImage && !this.minimal ? this.getProductBadge() : ''}
          </a>
          ${this.fullImage ? `<a href="${this.escapeHTML(this.product?.url)}" tabindex="-1" aria-hidden="true" class="s-product-card-overlay"></a>`:''}
          ${!this.horizontal && !this.fullImage ?
            `<salla-button
              shape="icon"
              fill="outline"
              color="light"
              name="product-name-${this.product.id}"
              aria-label="${this.getWishlistLabel()}"
              aria-pressed="${this.isInWishlist}"
              class="s-product-card-wishlist-btn animated ${this.isInWishlist ? 's-product-card-wishlist-added pulse-anime' : 'not-added un-favorited'}"
              data-id="${this.product.id}">
              ${this.getHeartIcon()}
            </salla-button>` : ``
          }
        </div>
        <div class="s-product-card-content">
          ${this.isSpecial && this.product?.quantity ?
            `<div class="s-product-card-content-pie">
              <span>
                <b>${salla.helpers.number(this.product?.quantity)}</b>
                ${this.remained}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -1 36 34" class="s-product-card-content-pie-svg">
                <circle cx="16" cy="16" r="15.9155" class="s-product-card-content-pie-svg-base" />
                <circle cx="16" cy="16" r="15.9155" class="s-product-card-content-pie-svg-bar" />
              </svg>
            </div>`
            : ``}

          <div class="s-product-card-content-main ${this.isSpecial ? 's-product-card-content-extra-padding' : ''}">
            ${this.getVendor()}
            <h3 class="s-product-card-content-title">
              <a href="${this.escapeHTML(this.product?.url)}">${this.escapeHTML(this.product?.name)}</a>
            </h3>

            ${this.product?.subtitle && !this.minimal ?
              `<p class="s-product-card-content-subtitle opacity-80">${this.escapeHTML(this.product?.subtitle)}</p>`
              : ``}
          </div>
          ${this.product?.donation && !this.minimal && !this.fullImage ?
          `<salla-progress-bar donation=${JSON.stringify(this.product?.donation)}></salla-progress-bar>
          <div class="s-product-card-donation-input">
            ${this.product?.donation?.can_donate && this.product?.donation?.custom_amount_enabled  ?
              `<label for="donation-amount-${this.product.id}">${this.donationAmount} <span>*</span></label>
              <input
                type="text"
                onInput="${e => {
                  salla.helpers.inputDigitsOnly(e.target);
                  this.addBtn.donatingAmount = (e.target).value;
                }}"
                id="donation-amount-${this.product.id}"
                name="donating_amount"
                class="s-form-control"
                placeholder="${this.donationAmount}" />`
              : ``}
          </div>`
            : ''}
          <div class="s-product-card-content-sub ${this.isSpecial ? 's-product-card-content-extra-padding' : ''}">
            ${this.product?.donation?.can_donate ? '' : this.getProductPrice()}
            ${this.product?.rating?.stars ?
              `<div class="s-product-card-rating">
                <i class="sicon-star2 before:text-orange-300"></i>
                <span>${this.product.rating.stars}</span>
              </div>`
               : ``}
          </div>
          ${this.product?.is_free_shipping ? `<salla-free-shipping-tag product-id="${this.product.id}" from-product-card show-free-shipping></salla-free-shipping-tag>` : ''}

          ${this.isSpecial && this.product.discount_ends
            ? `<salla-count-down date="${this.formatDate(this.product.discount_ends)}" end-of-day=${true} boxed=${true}
              labeled=${true} />`
            : ``}


          ${!this.hideAddBtn ?
            `<div class="s-product-card-content-footer gap-2">
              <salla-add-product-button fill="outline" width="wide"
                product-id="${this.product.id}"
                product-status="${this.effectiveStatus}"
                product-type="${this.product.type}">
                ${this.product.status == 'sale' ?
                    `<i class="text-base sicon-${ this.product.type == 'booking' ? 'calendar-time' : 'shopping-bag'}"></i>` : ``
                  }
                <span>${this.getCardAddLabel()}</span>
              </salla-add-product-button>

              ${this.horizontal || this.fullImage ?
                `<salla-button 
                  shape="icon" 
                  fill="outline" 
                  color="light" 
                  id="card-wishlist-btn-${this.product.id}-horizontal"
                  aria-label="${this.getWishlistLabel()}"
                  aria-pressed="${this.isInWishlist}"
                  class="s-product-card-wishlist-btn animated ${this.isInWishlist ? 's-product-card-wishlist-added pulse-anime' : 'not-added un-favorited'}"
                  data-id="${this.product.id}">
                  ${this.getHeartIcon()}
                </salla-button>`
                : ``}
            </div>`
            : ``}
        </div>
      `

      this.querySelectorAll('[name="donating_amount"]').forEach((element)=>{
        element.addEventListener('input', (e) => {
          e.target
            .closest(".s-product-card-content")
            .querySelector("salla-add-product-button")
            .setAttribute("donating-amount", e.target.value); 
        });
      })

      if (this.product?.quantity && this.isSpecial) {
        this.initCircleBar();
      }

      // Optimistic & per-card wishlist toggle (ROADMAP 6.3 · DS §8.3).
      // Only the salla-button host listens (salla-button copies the host's class onto its inner
      // <button>), and the toggle is called once from here instead of an inline onclick, which
      // salla-button also copied onto the inner button. The state (classes + aria-pressed on the host
      // and the inner <button>) is set at once and reverted if Salla rejects (e.g. guest → login).
      this.querySelectorAll('salla-button.s-product-card-wishlist-btn').forEach((btn) => {
        const setState = (added) => {
          app.toggleElementClassIf(btn, 's-product-card-wishlist-added', 'not-added', () => added);
          app.toggleElementClassIf(btn, 'pulse-anime', 'un-favorited', () => added);
          btn.setAttribute('aria-pressed', String(added));
          btn.querySelector('button')?.setAttribute('aria-pressed', String(added));
        };
        btn.addEventListener('click', () => {
          if (btn.dataset.unixBusy) {
            return;
          }
          const willBeAdded = !btn.classList.contains('s-product-card-wishlist-added');
          btn.dataset.unixBusy = '1';
          setState(willBeAdded);
          Promise.resolve()
            .then(() => salla.wishlist.toggle(this.product.id))
            .catch(() => setState(!willBeAdded))
            .finally(() => { delete btn.dataset.unixBusy; });
        });
      });
    }
}

customElements.define('custom-salla-product-card', ProductCard);
