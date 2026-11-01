/**
 * UNIX products tabs (ROADMAP 2.3 · DS §8.15) for views/components/home/unix-products-tabs.twig.
 * - ARIA tabs pattern with manual activation: arrows/Home/End move focus (arrows follow the
 *   reading direction, so in RTL ArrowLeft is "next"); Enter/Space or click activates.
 * - Panels after the first keep their salla-products-slider inside a <template>; it is mounted
 *   on first activation, so each tab costs one products request only when it is opened.
 * - The bottom button follows the active tab (label + link), like unix.sa.
 */
const KEYS = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];

function mountPanel(panel) {
  const tpl = panel.querySelector('template[data-unix-ptabs-tpl]');
  if (!tpl) return;
  panel.appendChild(tpl.content.cloneNode(true));
  tpl.remove();
}

function updateCta(cta, tab) {
  if (!cta) return;
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

function setup(section) {
  if (section.dataset.unixPtabsReady) return;
  section.dataset.unixPtabsReady = '1';

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
