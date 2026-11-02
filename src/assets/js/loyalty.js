import BasePage from './base-page';

class Loyalty extends BasePage {
    onReady() {
        let count = app.element(".count-anime")?.dataset?.count || 0;

        // UNIX 5.7 (DS §8.45): no star spin or count-up under reduced motion; show the final state
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.querySelectorAll('.count-anime').forEach(el => { el.innerText = el.dataset.count || count; });
            return;
        }

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