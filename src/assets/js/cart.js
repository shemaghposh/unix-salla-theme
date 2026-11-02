import BasePage from './base-page';
import {validateProductOptions} from './partials/validate-product-options';
import initCashbackNote from './partials/unix-cashback-note'; // ROADMAP 3.7 (DS §8.25)
import initFreeShipping from './partials/unix-free-shipping'; // ROADMAP 4.3/4.4 (DS §8.34)
import initProductsTabs from './partials/unix-products-tabs'; // ROADMAP 4.4: «اختيارات تناسبك» reuses the 2.3 section
class Cart extends BasePage {
    onReady() {
        // keep update the dom base in the events
        salla.event.cart.onUpdated(data => this.updateCartPageInfo(data));

        // ROADMAP 4.4: an add from «اختيارات تناسبك» (or an offer) creates a line this page never
        // rendered; Salla's page is server-rendered, so reload to show it.
        salla.cart.event.onItemAdded(response => {
            const items = response?.data?.cart?.items;
            const missing = !Array.isArray(items) || items.some(item => !document.querySelector('#item-' + item.id));
            if (missing) window.location.reload();
        });

        app.watchElements({
            cartGifting: '#cart-gifting',
            sallaGifting:'#salla-gifting'
        });

        this.initSubmitCart();
        this.initRemoveItem();
        validateProductOptions();
        // ROADMAP 3.7: cashback amount follows the subtotal; guest link opens Salla's login
        initCashbackNote();
        // ROADMAP 4.4: the drawer's free-shipping bar replaces Raed's #free-shipping card (D88)
        initFreeShipping();
        initProductsTabs();
    }

    /**
     * ROADMAP 4.4: the line's remove icon (replaces Raed's red salla-button). Salla does the work.
     */
    initRemoveItem() {
        document.addEventListener('click', event => {
            const button = event.target.closest('[data-unix-cart-remove]');
            if (!button || button.disabled) return;
            const id = button.dataset.unixCartRemove;
            button.disabled = true;
            salla.cart.deleteItem(id)
                .then(() => {
                    const form = document.querySelector('#item-' + id);
                    // focus: the next line's remove button, else the previous one, else the page content
                    const lines = Array.from(document.querySelectorAll('[data-unix-cart-remove]'));
                    const index = lines.indexOf(button);
                    const target = lines[index + 1] || lines[index - 1] || document.getElementById('main-content');
                    form?.remove();
                    if (target && target.id === 'main-content' && !target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
                    target?.focus({ preventScroll: true });
                })
                .catch(() => { button.disabled = false; });
        });
    }

    initSubmitCart() {
        let submitBtn = document.querySelector('#cart-submit');
        
        if (!submitBtn) {
            return;
        }
        
        app.onClick(submitBtn, event => {
            let cartForms = document.querySelectorAll('form[id^="item-"]');
            let isValid = true;
            cartForms.forEach(form => {
                isValid = isValid && form.reportValidity();
                if (!isValid) {
                    event.preventDefault();
                    salla.notify.error(salla.lang.get('common.messages.required_fields'));
                    return;
                }
            });
    
            if (isValid) {
                /** @type HTMLSallaButtonElement */
                let btn = event.currentTarget;

                // Keep loading state (also disables the button) until the page redirects.
                const keepLoading = new MutationObserver(() => {
                    if (!btn.hasAttribute('loading')) {
                        btn.setAttribute('loading', '');
                    }
                });
                // Release it if we won't redirect (guest gets a login modal, or submit fails),
                // so the spinner never gets stuck.
                const stopLoading = () => {
                    keepLoading.disconnect();
                    btn.stop();
                };
                salla.event.once('login::open', stopLoading);
                salla.event.once('cart::submit.failed', stopLoading);

                btn.load();
                keepLoading.observe(btn, { attributes: true, attributeFilter: ['loading'] });
                salla.cart.submit();
            }
        });
    }

    updateCartOptions(options) {
      if (!options || !options.length) return;

      const arrayTwoId = options.map((item) => (item.id));

      document.querySelectorAll('.cart-options form')?.forEach((form) => {
        if (!arrayTwoId.includes(form.id.value)) {
          form.remove();
        }
      })
    }
    
    /**
     * @param {import("@salla.sa/twilight/types/api/cart").CartSummary} cartData
     */
    updateCartPageInfo(cartData) {
        //if item deleted & there is no more items, just reload the page
        if (!cartData.count) {
            // clear cart options from the dom before page reload
            document.querySelector('.cart-options')?.remove();
            return window.location.reload();
        }
        // toggle physical gifting depned on giftable flag
        app.toggleElementClassIf(app.cartGifting, 'active', 'hidden', () => cartData?.gift?.enabled);
        // Use toggleAttribute to handle the `physical-products` attribute
        app.sallaGifting?.toggleAttribute('physical-products', cartData?.gift?.type === 'physical');
        app.sallaGifting?.toggleAttribute('digital-products', cartData?.gift?.type === 'digital');

        // update the dom for cart options
        this.updateCartOptions(cartData?.options);
        // update each item data
        cartData.items?.forEach(item => this.updateItemInfo(item));

        // Summary totals (subtotal, discount, shipping, tax, options) are owned by
        // <salla-cart-summary-card>; the free-shipping bar by unix-free-shipping.js (ROADMAP 4.4).
    }

    /**
     * @param {import("@salla.sa/twilight/types/api/cart").CartItem} item
     */
    updateItemInfo(item) {
        // lets get the elements for this item
        let cartItem = document.querySelector('#item-' + item.id);
        if (!cartItem) {
            salla.log(`Can't get the cart item dom for ${item.id}!`);
            return;
        }
        let totalElement = cartItem.querySelector('.item-total'),
            priceElement = cartItem.querySelector('.item-price'),
            regularPriceElement = cartItem.querySelector('.item-regular-price'),
            itemOriginalPrice = cartItem.querySelector('.item-original-price'),
            weightRow = cartItem.querySelector('.item-weight-row'),
            weightElement = cartItem.querySelector('.item-weight'),
            offerElement = cartItem.querySelector('.offer-name'),
            oldOffers = cartItem.querySelector('.old-offers'),
            freeRibbon = cartItem.querySelector('.free-ribbon'),
            offerIconElement = cartItem.querySelector('.offer-icon'),
            hasSpecialPrice = item.offer || item.special_price > 0,
            hasSalePrice = item.is_on_sale,
            newOffersActive = item.detailed_offers?.length > 0 ;
        let item_total = item.detailed_offers?.length > 0 ? item.total_special_price : item.total;
        let total = salla.money(item_total);
        if (total !== totalElement.innerHTML) {
            totalElement.innerHTML = total;
            // app.anime(totalElement, { scale: [.88, 1] });
        }

        app.toggleElementClassIf([offerElement, oldOffers], 'offer-applied', 'hidden', () => hasSpecialPrice && !newOffersActive)
            .toggleElementClassIf([regularPriceElement, offerIconElement], 'offer-applied', 'hidden', () => hasSpecialPrice)
            .toggleElementClassIf([itemOriginalPrice], 'offer-applied', 'hidden', () => hasSalePrice)
            // ROADMAP 4.4: system price states (unix-cart-page.scss) instead of Raed's red/gray utilities
            .toggleElementClassIf(priceElement, 'is-sale', 'is-regular', () => hasSpecialPrice)
            // Keep this condition in sync with cart.twig — the ribbon marks an item made
            // free by an offer, not any item that happens to cost 0 (e.g. request-a-quote
            // products). Dropping `has_discount` here regressed #789 once already.
            .toggleElementClassIf(freeRibbon, 'active', 'hidden', () => item.price == 0 && item.has_discount);

        priceElement.innerHTML = salla.money(item.price);

        if (weightElement) {
            weightElement.innerHTML = item.weight_label || '';
        }
        app.toggleElementClassIf(weightRow, 'has-weight', 'hidden', () => !!item.weight_label);

        // Update original price when item is on sale
        if (hasSalePrice) {
            itemOriginalPrice.innerHTML = salla.money(item.original_price);
        }

        if (!hasSpecialPrice){return;}
        if (!newOffersActive) {offerElement.innerHTML = item.offer.names;}
        regularPriceElement.innerHTML = salla.money(item.product_price);
    }
}

Cart.initiateWhenReady(['cart']);
