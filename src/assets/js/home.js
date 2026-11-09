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
        initProductsTabs();
        initFeaturedProducts();
        initUnixBlog(); // views/components/home/unix-blog.twig (ROADMAP 2.8)
    }
}

Home.initiateWhenReady(['index']);
