import BasePage from './base-page';
// ROADMAP 6.2: no <lite-youtube> on the product page (videos are gallery slides), so that import is gone.
import initGallery from './partials/unix-gallery';
import initSizeFinder from './partials/unix-size-finder'; // ROADMAP 3.3 (DS §8.11)
import initStickyAtc from './partials/unix-sticky-atc'; // ROADMAP 3.2 (DS §8.21)
import initSizeCharts from './partials/unix-size-charts'; // ROADMAP 3.4 (DS §8.23)
import initDeliveryEstimate from './partials/unix-delivery-estimate'; // ROADMAP 3.6 (DS §8.24)
import initPdpRelated from './partials/unix-pdp-related'; // ROADMAP 3.9 (DS §8.27)
import initBuyNow from './partials/unix-buy-now'; // ROADMAP 6.4 (D117, DS §8.21)

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

        // 6.4: same rule as single.twig (unix_on_sale): a real, lower, non-zero price; never show a 0
        let data = res.data,
            amount = (v) => Number(v && typeof v === 'object' ? v.amount : v), // number or {amount, currency}
            price = amount(data.price),
            regularPrice = amount(data.regular_price),
            is_on_sale = Boolean(data.has_sale_price) && price > 0 && price < regularPrice;

        // «يبدأ من» goes only once a real variant price replaces the server's starting price
        price > 0 && app.startingPriceTitle?.classList.add('hidden');

        app.productWeight.forEach((el) => {el.innerHTML = data.weight || ''});
        // a missing / 0 price keeps the server-rendered amount instead of printing «0 ﷼»
        // (by design: a truly free variant also keeps the previous price on screen)
        price > 0 && app.totalPrice.forEach((el) => {el.innerHTML = salla.money(data.price)});
        regularPrice > 0 && app.beforePrice.forEach((el) => {el.innerHTML = salla.money(data.regular_price)});
        this.updateIdentifier(app.productSku, '.product-sku-wrapper', data.sku);
        this.updateIdentifier(app.productBarcode, '.product-barcode-wrapper', data.barcode);

        // exactly one row visible: the sale row only on sale, the normal row otherwise
        document.querySelectorAll('.price_is_on_sale').forEach((el) => el.classList.toggle('hidden', !is_on_sale));
        document.querySelectorAll('.starting-or-normal-price').forEach((el) => el.classList.toggle('hidden', is_on_sale));

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

/**
 * fslightbox stays for video slides only; images zoom in the UNIX gallery dialog (DS §8.20).
 * ROADMAP 6.2: it loads on demand, and only when the gallery has a video slide ([data-fslightbox]).
 * On import it scans the page for a[data-fslightbox] itself, exactly as the static import did.
 */
const loadVideoLightbox = () => {
  if (!document.querySelector('[data-fslightbox]')) return;
  import(/* webpackChunkName: "fslightbox" */ 'fslightbox')
    .then(({ default: Fslightbox }) => { window.fslightbox = Fslightbox; })
    .catch((error) => salla.log('fslightbox failed to load', error));
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadVideoLightbox);
else loadVideoLightbox();

// 6.4 (D117): feminine «اشتري الآن» on Salla's buy-now button, as soon as salla.lang has loaded
initBuyNow();

// ROADMAP 3.3 Size Finder: boot at page start so a manual size pick is seen before any auto-select.
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSizeFinder);
else initSizeFinder();
