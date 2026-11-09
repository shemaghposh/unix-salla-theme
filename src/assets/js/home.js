import BasePage from "./base-page";
// ROADMAP 6.2: fslightbox is not imported here any more. No home block renders [data-fslightbox]
// (only the product gallery's video slides do, and product.js loads it on demand).
import initHeroes from "./partials/unix-hero";
import initProductsTabs from "./partials/unix-products-tabs";
import initFeaturedProducts from "./partials/unix-featured-products";
import initVideoTiles from "./partials/unix-video-tiles";
import initFaqs from "./partials/unix-faq";
import initCollectionOverlays from "./partials/unix-collection-overlay";
import initCollectionsGrids from "./partials/unix-collections-grid";
import initUnixBlog from "./partials/unix-blog";

class Home extends BasePage {
    onReady() {
        initHeroes();
        initVideoTiles();
        initFaqs();
        initCollectionOverlays();
        initCollectionsGrids();
        this.initFeaturedTabs();
        initProductsTabs();
        initFeaturedProducts();
        initUnixBlog(); // views/components/home/unix-blog.twig (ROADMAP 2.8)
    }

    /**
     * used in views/components/home/featured-products-style*.twig
     */
    initFeaturedTabs() {
        app.all('.tab-trigger', el => {
            el.addEventListener('click', ({ currentTarget: btn }) => {
                let id = btn.dataset.componentId;
                // btn.setAttribute('fill', 'solid');
                app.toggleClassIf(`#${id} .tabs-wrapper>div`, 'is-active opacity-0 translate-y-3', 'inactive', tab => tab.id == btn.dataset.target)
                    .toggleClassIf(`#${id} .tab-trigger`, 'is-active', 'inactive', tabBtn => tabBtn == btn);

                // fadeIn active tabe
                setTimeout(() => app.toggleClassIf(`#${id} .tabs-wrapper>div`, 'opacity-100 translate-y-0', 'opacity-0 translate-y-3', tab => tab.id == btn.dataset.target), 100);
            })
        });
        document.querySelectorAll('.s-block-tabs').forEach(block => block.classList.add('tabs-initialized'));
    }
}

Home.initiateWhenReady(['index']);
