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
import initReviewsHome from "./partials/unix-reviews-home"; // ROADMAP 2.10 (D141)
import initShopLook from "./partials/unix-shop-look"; // ROADMAP 2.10 (D142)

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
        initReviewsHome(); // views/components/home/unix-reviews.twig (ROADMAP 2.10)
        initShopLook(); // views/components/home/unix-shop-look.twig (ROADMAP 2.10)
    }
}

Home.initiateWhenReady(['index']);
