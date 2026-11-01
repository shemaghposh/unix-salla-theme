import 'lite-youtube-embed';
import BasePage from './base-page';
// fslightbox stays for video slides only; images zoom in the UNIX gallery dialog (DS §8.20)
import Fslightbox from 'fslightbox';
window.fslightbox = Fslightbox;
import initGallery from './partials/unix-gallery';

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

      app.onClick('#btn-show-more', e => app.all('#more-content', div => {
        e.target.classList.add('is-expanded');
        div.style = `max-height:${div.scrollHeight}px`;
      }) || e.target.remove());
    }
}

Product.initiateWhenReady(['product.single']);
