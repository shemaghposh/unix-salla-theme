import BasePage from './base-page';

class Loyalty extends BasePage {
    onReady() {
        let count = app.element(".count-anime")?.dataset?.count || 0;
        const showFinalState = () => {
            document.querySelectorAll('.count-anime').forEach(el => { el.innerText = el.dataset.count || count; });
        };

        // UNIX 5.7 (DS §8.45): no star spin or count-up under reduced motion; show the final state
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            showFinalState();
            return;
        }

        // ROADMAP 6.2: animejs is no longer in app.js on every page; only this page loads it, on demand.
        // If the chunk fails, the points still show (final state, no animation).
        import(/* webpackChunkName: "animejs" */ 'animejs')
            .then(({ default: anime }) => this.animate(anime, count))
            .catch(showFinalState);
    }

    animate(anime, count) {
        (new anime.timeline()).add({
            targets: '.loyality-item',
            opacity: [0, 1],
            translateX: [20, 0],
            delay: function (el, i) {
                return i * 100;
            },
        }).add({
            targets: '.star-anime',
            opacity: [0, 1],
            rotate: [50, 0],
            duration: 4000,
            delay: function (el, i) {
                return i * 100;
            },
        }, '-=1000').add({
            targets: `.count-anime`,
            innerText: [0, count],
            duration: 2000,
            easing: "linear",
            round: true,
            delay: function (el, i) {
                return i * 150;
            },
        }, '-=3700').add({
            targets: '.btn-anime',
            opacity: [0, 1],
            duration: 2000,
            translateX: [20, 0],
            delay: function (el, i) {
                return i * 100;
            },
        }, '-=3200')
    }
}

Loyalty.initiateWhenReady(['loyalty']);
