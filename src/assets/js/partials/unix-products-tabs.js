/**
 * UNIX products tabs (ROADMAP 2.3 · DS §8.15) for views/components/home/unix-products-tabs.twig.
 * - ARIA tabs pattern with manual activation: arrows/Home/End move focus (arrows follow the
 *   reading direction, so in RTL ArrowLeft is "next"); Enter/Space or click activates.
 * - Panels after the first keep their salla-products-slider inside a <template>; it is mounted
 *   on first activation, so each tab costs one products request only when it is opened.
 * - Heading-row prev/next buttons drive the active panel's Swiper (like unix.sa's section nav).
 * - Once a slider has loaded (componentOnReady resolves after its products fetch), the panel gets
 *   data-loaded and the skeleton hides, also when the source came back empty.
 * - The bottom button follows the active tab (label + link), like unix.sa.
 */
const KEYS = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
const SWIPER_WAIT_MS = 300;
const SWIPER_WAIT_TRIES = 20;

function watchLoaded(panel) {
  const slider = panel.querySelector('salla-products-slider');
  if (!slider || panel.hasAttribute('data-loaded')) return;
  const done = () => panel.setAttribute('data-loaded', '');
  if (typeof slider.componentOnReady === 'function') {
    slider.componentOnReady().then(done, done);
  } else {
    customElements.whenDefined('salla-products-slider').then(() => slider.componentOnReady?.().then(done, done));
  }
}

function mountPanel(panel) {
  const tpl = panel.querySelector('template[data-unix-ptabs-tpl]');
  if (tpl) {
    panel.appendChild(tpl.content.cloneNode(true));
    tpl.remove();
  }
  watchLoaded(panel);
}

function updateCta(cta, tab) {
  if (!cta || !tab) return;
  const { ctaLabel, ctaUrl } = tab.dataset;
  if (ctaLabel) cta.textContent = ctaLabel;
  if (ctaUrl) {
    cta.setAttribute('href', ctaUrl);
    cta.removeAttribute('aria-disabled');
  } else {
    cta.removeAttribute('href');
    cta.setAttribute('aria-disabled', 'true');
  }
}

function setupNav(section) {
  const prev = section.querySelector('[data-unix-ptabs-prev]');
  const next = section.querySelector('[data-unix-ptabs-next]');
  if (!prev || !next) return () => {};
  let timer = null;

  const activeSwiper = () => {
    const panel = section.querySelector('.unix-ptabs__panel:not([hidden])');
    return panel?.querySelector('.swiper')?.swiper || null;
  };

  const sync = () => {
    const swiper = activeSwiper();
    const locked = !swiper || swiper.isLocked;
    prev.disabled = locked || swiper.isBeginning;
    next.disabled = locked || swiper.isEnd;
  };

  // Swiper appears after the slider fetches; bind its events once it exists.
  const bind = (tries = 0) => {
    clearTimeout(timer);
    const swiper = activeSwiper();
    if (swiper) {
      if (!swiper.unixPtabsBound) {
        swiper.on('slideChange reachBeginning reachEnd resize lock unlock', sync);
        swiper.unixPtabsBound = true;
      }
      sync();
      return;
    }
    sync();
    if (tries < SWIPER_WAIT_TRIES) timer = setTimeout(() => bind(tries + 1), SWIPER_WAIT_MS);
  };

  prev.addEventListener('click', () => { activeSwiper()?.slidePrev(); sync(); });
  next.addEventListener('click', () => { activeSwiper()?.slideNext(); sync(); });
  bind();
  return bind;
}

function setup(section) {
  if (section.dataset.unixPtabsReady) return;
  section.dataset.unixPtabsReady = '1';

  const firstPanel = section.querySelector('.unix-ptabs__panel:not([hidden])');
  if (firstPanel) watchLoaded(firstPanel);
  const rebindNav = setupNav(section);

  const tabs = Array.from(section.querySelectorAll('[role="tab"]'));
  if (tabs.length < 2) return;
  const cta = section.querySelector('[data-unix-ptabs-cta]');

  const activate = tab => {
    tabs.forEach(t => {
      const selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      panel.hidden = !selected;
      if (selected) mountPanel(panel);
    });
    updateCta(cta, tab);
    rebindNav();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));

    tab.addEventListener('keydown', event => {
      if (!KEYS.includes(event.key)) return;
      const rtl = getComputedStyle(section).direction === 'rtl';
      const next = rtl ? 'ArrowLeft' : 'ArrowRight';
      const last = tabs.length - 1;
      let target;
      if (event.key === 'Home') target = 0;
      else if (event.key === 'End') target = last;
      else if (event.key === next) target = index === last ? 0 : index + 1;
      else target = index === 0 ? last : index - 1;

      event.preventDefault();
      tabs[target].focus();
      // keep the focused pill visible inside the horizontally scrolling tablist
      tabs[target].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
  });
}

export default function initProductsTabs(root = document) {
  root.querySelectorAll('[data-unix-ptabs]').forEach(setup);
}
