/**
 * UNIX featured products (ROADMAP 2.6 · DS §8.16) for views/components/home/unix-featured-products.twig.
 * Per section, fills the cards Twig could only render by product id (data-unix-fprod-pending) with
 * one salla.product.api.fetch: name, price, thumbnail, link and, when the merchant left the
 * lifestyle image empty, the product image as the lifestyle image.
 * - data-unix-fprods-latest: nothing picked yet → the pending slides take the latest products.
 * - A product the API no longer returns (deleted/hidden) loses its slide and the slider updates;
 *   with no slide left, or if the request fails, the whole section hides.
 * - 6.4 batch 3 (D120): heading-row ← → and the progress line drive the section's Swiper (unix-carousel-nav.js).
 * Nothing here touches cart or product logic.
 */
import bindCarouselNav from './unix-carousel-nav';

const navs = new WeakMap();

// The section hides itself (no slide left / request failed): stop driving its Swiper too
function hideSection(section) {
  section.hidden = true;
  navs.get(section)?.destroy();
  navs.delete(section);
}

function priceHTML(product) {
  const money = value => (value ? salla.money(value) : '');
  if (product.is_on_sale) {
    return `<span class="unix-fprods__price-sale">${money(product.sale_price)}</span>`
      + ` <s class="unix-fprods__price-old">${money(product.regular_price)}</s>`;
  }
  return money(product.price || product.starting_price);
}

function fill(item, product) {
  const card = item.querySelector('.unix-fprods__card');
  const name = item.querySelector('[data-unix-fprod-name]');
  const price = item.querySelector('[data-unix-fprod-price]');
  const thumb = item.querySelector('.unix-fprods__thumb img');
  const media = item.querySelector('.unix-fprods__img');
  const imageUrl = product.image?.url || product.thumbnail || '';

  if (name) name.textContent = product.name || '';
  if (price) price.innerHTML = priceHTML(product);
  if (thumb && imageUrl) {
    thumb.src = imageUrl;
    thumb.hidden = false;
  }
  if (media) {
    media.alt = product.name || '';
    if (item.hasAttribute('data-unix-fprod-use-thumb') && imageUrl) {
      media.src = imageUrl;
      media.hidden = false;
    }
  }
  if (card && product.url) {
    card.href = product.url;
    card.removeAttribute('aria-busy');
    card.removeAttribute('tabindex');
  }
  item.dataset.unixFprod = product.id;
  item.removeAttribute('data-unix-fprod-pending');
}

function removeSlides(section, items) {
  items.forEach(item => item.closest('.unix-fprods__slide')?.remove());
  if (!section.querySelector('.unix-fprods__slide')) {
    hideSection(section);
    return;
  }
  section.querySelector('.swiper')?.swiper?.update();
}

function hydrateSection(section) {
  const pending = Array.from(section.querySelectorAll('[data-unix-fprod-pending]'));
  if (!pending.length) return;
  if (!window.salla?.product?.api?.fetch) {
    hideSection(section);
    return;
  }

  const latest = Number(section.dataset.unixFprodsLatest || 0);
  const ids = [...new Set(pending.map(item => item.dataset.unixFprod).filter(Boolean))];
  const query = latest
    ? { source: 'latest', limit: latest }
    : { source: 'selected', source_value: ids, limit: ids.length };

  if (!latest && !ids.length) {
    removeSlides(section, pending);
    return;
  }

  salla.product.api.fetch(query)
    .then(response => {
      const products = response?.data || [];
      const gone = [];

      if (latest) {
        pending.forEach((item, index) => (products[index] ? fill(item, products[index]) : gone.push(item)));
      } else {
        const byId = new Map(products.map(product => [String(product.id), product]));
        pending.forEach(item => {
          const product = byId.get(String(item.dataset.unixFprod));
          if (product) fill(item, product);
          else gone.push(item);
        });
      }

      if (gone.length) removeSlides(section, gone);
    })
    .catch(error => {
      hideSection(section);
      salla.logger?.warn('unix-featured-products: could not load products', error);
    });
}

function setupNav(section) {
  if (section.dataset.unixFprodsNav) return;
  section.dataset.unixFprodsNav = '1';
  navs.set(section, bindCarouselNav({
    getSwiper: () => section.querySelector('.swiper')?.swiper || null,
    getSlider: () => section.querySelector('salla-slider'),
    prev: section.querySelector('[data-unix-fprods-prev]'),
    next: section.querySelector('[data-unix-fprods-next]'),
    progress: section.querySelector('[data-unix-fprods-progress]'),
  }));
}

export default function initFeaturedProducts(root = document) {
  root.querySelectorAll('[data-unix-fprods]').forEach(section => {
    setupNav(section);
    hydrateSection(section);
  });
}
