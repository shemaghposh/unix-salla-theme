/**
 * UNIX featured products (ROADMAP 2.6 · DS §8.16) for views/components/home/unix-featured-products.twig.
 * Fills cards that Twig could only render by product id (data-unix-fprod-pending): one
 * salla.product.api.fetch per page for all pending ids, then name, price, thumbnail, link and,
 * when the merchant left the lifestyle image empty, the product image as the lifestyle image.
 * Nothing here touches cart or product logic.
 */
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
  item.removeAttribute('data-unix-fprod-pending');
}

export default function initFeaturedProducts(root = document) {
  const pending = Array.from(root.querySelectorAll('[data-unix-fprod-pending]'));
  if (!pending.length || !window.salla?.product?.api?.fetch) return;

  const ids = [...new Set(pending.map(item => item.dataset.unixFprod).filter(Boolean))];
  if (!ids.length) return;

  salla.product.api.fetch({ source: 'selected', source_value: ids, limit: ids.length })
    .then(response => {
      const byId = new Map((response?.data || []).map(product => [String(product.id), product]));
      pending.forEach(item => {
        const product = byId.get(String(item.dataset.unixFprod));
        if (product) fill(item, product);
        else item.closest('.unix-fprods__slide')?.setAttribute('hidden', ''); // deleted / hidden product
      });
    })
    .catch(error => salla.logger?.warn('unix-featured-products: could not load products', error));
}
