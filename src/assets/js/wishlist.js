import BasePage from './base-page';

class Wishlist extends BasePage {

    onReady() {
        // init wishlist icons in product cards
        salla.storage.get('salla::wishlist', []).forEach(id => this.toggleFavoriteIcon(id));
    }

    registerEvents() {

        salla.wishlist.event.onAdded((event, id) => this.toggleFavoriteIcon(id));

        salla.wishlist.event.onRemoved((response, id) => {

            this.toggleFavoriteIcon(id, false);

            // just an animation when the item removed from wishlist page
            let item = document.querySelector('#wishlist-product-' + id);

            if(!item){
                return;
            }

            item.style.height = item.offsetHeight + 'px';
            void item.offsetWidth; // trigger reflow
            item.classList.add('fade-out-collapse');

            item.addEventListener('transitionend', function handler(e) {
                if (e.propertyName === 'opacity') {
                    item.removeEventListener('transitionend', handler);
                    item.remove();
                    // ROADMAP 5.3: the list wrapper always has children (hooks, salla-products-list),
                    // so check for rows that are still there instead
                    if (!document.querySelector('#wishlist .unix-wish:not(.fade-out-collapse)')) {
                        window.location.reload();
                    }
                }
            });
        });
    }

    toggleFavoriteIcon(id, isAdded = true) {
        document.querySelectorAll('.btn--wishlist[data-id="' + id + '"]')
            .forEach(btn => {
                app.toggleElementClassIf(btn, 'is-added', 'not-added', () => isAdded);
                // app.toggleElementClassIf(btn, 'pulse', 'un-favorited', () => isAdded);
            });
        // ROADMAP 6.3 · DS §8.3: product-card hearts follow the real wishlist state
        document.querySelectorAll('.s-product-card-wishlist-btn[data-id="' + id + '"]')
            .forEach(btn => {
                app.toggleElementClassIf(btn, 's-product-card-wishlist-added', 'not-added', () => isAdded);
                btn.setAttribute('aria-pressed', String(isAdded));
            });
    }
}

Wishlist.initiateWhenReady();
