/**
 * UNIX product page, below the main section (ROADMAP 3.9 · DS §8.22 · SPEC §5.3, §8.12).
 *
 * «أكملي الإطلالة» [data-unix-ctl]
 *   Twig renders the section only when the theme setting unix_complete_look_data (JSON,
 *   {"productId": [id, id, ...]}, D68) names this product. Here the ids are read and a
 *   salla-products-list (source "selected", limit data-limit) is mounted into [data-unix-pdp-slot].
 *   Bad JSON, no usable ids, or no product returned → the section hides.
 *
 * «قد يعجبك أيضًا» [data-unix-recs]
 *   salla-products-list source "related" is rendered by Twig. The section hides when the store
 *   turned related products off, or when Salla returns none (D69).
 *
 * Cards are the theme's custom-salla-product-card; cart logic stays in salla-add-product-button.
 */
const CARD = 'custom-salla-product-card, salla-product-card';
const VISIBLE_CARD = 'custom-salla-product-card:not([hidden]), salla-product-card:not([hidden])';

/**
 * Marks the section loaded once a visible card exists, or hides it when the list settles empty
 * (Salla's placeholder, every card hidden as out of stock, or a failed request).
 */
function watchList(section, list) {
  const settle = () => {
    if (list.querySelector(VISIBLE_CARD)) {
      section.setAttribute('data-loaded', '');
      return true;
    }
    if (list.querySelector('.s-products-list-placeholder') || list.querySelector(CARD)) {
      section.hidden = true;
      return true;
    }
    return false;
  };

  if (settle()) return;

  const observer = new MutationObserver(() => settle() && observer.disconnect());
  observer.observe(list, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });

  // componentOnReady rejects when the first request fails: nothing will come, so hide
  list.componentOnReady?.().catch(() => {
    observer.disconnect();
    section.hidden = true;
  });
}

function completeLookIds(section) {
  const own = String(section.dataset.productId || '');
  let map = section.querySelector('[data-unix-ctl-config]')?.textContent || '';

  try {
    map = JSON.parse(map); // Twig json_encode'd the setting string
    if (typeof map === 'string') map = map.trim() ? JSON.parse(map) : {};
  } catch (error) {
    salla.logger?.warn('unix-pdp-related: unix_complete_look_data is not valid JSON', error);
    return [];
  }

  const entry = map && typeof map === 'object' && !Array.isArray(map) ? map[own] : null;
  const values = Array.isArray(entry) ? entry : (entry == null ? [] : [entry]);
  const ids = values
    .map(value => String(value).trim())
    .filter(value => /^\d+$/.test(value) && value !== own);

  return [...new Set(ids)].map(Number);
}

function initCompleteLook(section) {
  const slot = section.querySelector('[data-unix-pdp-slot]');
  const ids = completeLookIds(section);
  if (!slot || !ids.length) {
    section.hidden = true;
    return;
  }

  const list = document.createElement('salla-products-list');
  list.className = 'unix-pdp-list';
  list.setAttribute('source', 'selected');
  list.setAttribute('source-value', JSON.stringify(ids));
  list.setAttribute('limit', String(Math.min(ids.length, Number(section.dataset.limit) || 2)));
  // Second image for the card hover crossfade. With `limit` set the list never starts infinite
  // scroll, so the autoload + includes manual-load path in salla-products-list does not apply.
  list.setAttribute('includes', '["images"]');
  slot.append(list);
  watchList(section, list);
}

function initRecommendations(section) {
  const list = section.querySelector('salla-products-list');
  if (!list || salla.config.get('store.settings.product.related_products_enabled') === false) {
    section.hidden = true;
    return;
  }
  watchList(section, list);
}

export default function initPdpRelated(root = document) {
  root.querySelectorAll('[data-unix-ctl]').forEach(initCompleteLook);
  root.querySelectorAll('[data-unix-recs]').forEach(initRecommendations);
}
