import 'lite-youtube-embed';
import BasePage from './base-page';
// fslightbox stays for video slides only; images zoom in the UNIX gallery dialog (DS §8.20)
import Fslightbox from 'fslightbox';
window.fslightbox = Fslightbox;
import initGallery from './partials/unix-gallery';
import initSizeFinder from './partials/unix-size-finder'; // ROADMAP 3.3 (DS §8.11)
import initStickyAtc from './partials/unix-sticky-atc'; // ROADMAP 3.2 (DS §8.21)
import initSizeCharts from './partials/unix-size-charts'; // ROADMAP 3.4 (DS §8.23)
import initDeliveryEstimate from './partials/unix-delivery-estimate'; // ROADMAP 3.6 (DS §8.24)
import initPdpRelated from './partials/unix-pdp-related'; // ROADMAP 3.9 (DS §8.27)

class Product extends BasePage {
    onReady() {
        app.watchElements({
            totalPrice: '.total-price',
            productWeight: '.product-weight',
            beforePrice: '.before-price',
            startingPriceTitle: '.starting-price-title',
            productSku: '.product-sku',
            productBarcode: '.product-barcode',
        });

        this.initProductOptionValidations();
        // ROADMAP 3.1: thumbnails, arrows, zoom dialog and the Salla app's native gallery
        initGallery();
        // ROADMAP 3.2: mobile sticky add-to-cart that drives the real Salla button
        initStickyAtc();
        // ROADMAP 3.4: size chart buttons + dialog (Salla size guides)
        initSizeCharts();
        // ROADMAP 3.6: «متى يصلك طلبك؟» country / city selects
        initDeliveryEstimate();
        // ROADMAP 3.9: «أكملي الإطلالة» + «قد يعجبك أيضًا» below the main section
        initPdpRelated();
    }

    initProductOptionValidations() {
      document.querySelector('.product-form')?.addEventListener('change', function(){
        // reportValidity() natively focuses/scrolls to the first empty required option mid-edit; read validity instead
        const isComplete = Array.from(this.elements).every(el => !el.willValidate || el.validity.valid);
        isComplete && salla.product.getPrice(new FormData(this));
      });
    }

    /**
     * Identifier rows (SKU / barcode) follow the selected variant. An empty value hides the whole
     * row instead of leaving a labelled empty one, and a value shows it again - the parent product
     * may have none while a variant does. `undefined` means the endpoint didn't send the field at
     * all, so the row keeps whatever it is already showing.
     *
     * textContent, not innerHTML: identifiers are merchant-supplied and render as plain text
     * exactly as recorded, so there is nothing to parse as markup.
     */
    updateIdentifier(elements, wrapperSelector, value) {
        if (value === undefined) return;

        elements?.forEach((el) => {el.textContent = value || ''});
        document.querySelectorAll(wrapperSelector).forEach((el) => el.classList.toggle('hidden', !value));
    }

    registerEvents() {
      salla.event.on('product::price.updated.failed',()=>{
        app.element('.price-wrapper').classList.add('hidden');
        const outOfStock = app.element('.out-of-stock');
        outOfStock.classList.remove('hidden');
        outOfStock.classList.remove('scale-pulse');
        void outOfStock.offsetWidth; // trigger reflow
        outOfStock.classList.add('scale-pulse');
      })
      salla.product.event.onPriceUpdated((res) => {

        app.element('.out-of-stock').classList.add('hidden')
        app.element('.price-wrapper').classList.remove('hidden')

        let data = res.data,
            is_on_sale = data.has_sale_price && data.regular_price > data.price;

        app.startingPriceTitle?.classList.add('hidden');

        app.productWeight.forEach((el) => {el.innerHTML = data.weight || ''});
        app.totalPrice.forEach((el) => {el.innerHTML = salla.money(data.price)});
        app.beforePrice.forEach((el) => {el.innerHTML = salla.money(data.regular_price)});
        this.updateIdentifier(app.productSku, '.product-sku-wrapper', data.sku);
        this.updateIdentifier(app.productBarcode, '.product-barcode-wrapper', data.barcode);

        app.toggleClassIf('.price_is_on_sale','showed','hidden', ()=> is_on_sale)
        app.toggleClassIf('.starting-or-normal-price','hidden','showed', ()=> is_on_sale)

        document.querySelectorAll('.total-price, .product-weight').forEach(el => {
          el.classList.remove('scale-pulse');
          void el.offsetWidth; // trigger reflow
          el.classList.add('scale-pulse');
        });
      });
      // 3.2: the description lives in a native <details> accordion now, so Raed's read-more is gone
    }
}

Product.initiateWhenReady(['product.single']);

// ROADMAP 3.3 Size Finder: boot at page start so a manual size pick is seen before any auto-select.
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSizeFinder);
else initSizeFinder();
