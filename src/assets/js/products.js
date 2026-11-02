import BasePage from './base-page';
import initPlp from './partials/unix-plp';

/**
 * Product listing pages (category, offers, search, tag, latest): pages/product/index.twig.
 * ROADMAP 4.2 · DS §8.30, §8.31. The grid, filters and paging are Salla's own components;
 * this file keeps Raed's sort logic and wires the UNIX filters drawer (partials/unix-plp.js),
 * which replaced the mmenu-light off-canvas.
 * ROADMAP 4.1: the h1 (#page-main-title) is the category name from the server (DS §8.29, §14);
 * it is no longer replaced by Salla's "name - N products" title after a fetch.
 */
class Products extends BasePage {
    onReady() {
        let productsList = app.element('salla-products-list'),
            urlParams = new URLSearchParams(window.location.search);

        // Set Sort
        if (urlParams.has('sort') && app.element('#product-filter')) {
            app.element('#product-filter').value = urlParams.get('sort');
        }

        // Sort Products
        app.on('change', '#product-filter', async event => {
            window.history.replaceState(null, null, salla.helpers.addParamToUrl('sort', event.currentTarget.value));
            productsList.sortBy = event.currentTarget.value;
            await productsList.reload();
            productsList.setAttribute('filters', `{"sort": "${event.currentTarget.value}"}`)
        });

        initPlp();
    }
}

Products.initiateWhenReady([
    'product.index',
    'product.index.latest',
    'product.index.offers', 'product.index.search',
    'product.index.tag',
]);
