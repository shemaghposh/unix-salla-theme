/**
 * UNIX shop the look «تسوّقي الإطلالة» (ROADMAP 2.10 · DS §8.54 · D142) for
 * views/components/home/unix-shop-look.twig.
 * - Hotspots are disclosure buttons: pressing one shows its card (aria-expanded / hidden) and hides
 *   the others; pressing the open one again closes it. Escape or the card's × closes it and returns
 *   focus to the hotspot; one document listener closes an open card on a click outside its section's
 *   hotspots and cards.
 * - Cards Twig could only render by product id (data-unix-look-pending) are filled with one
 *   salla.product.api.fetch per section, the same call as the featured products (2.6). A product the
 *   API doesn't return (deleted / hidden) loses its hotspot and card; on a failed call too.
 * API strings go in with textContent; only salla.money() output uses innerHTML (LESSONS 22).
 * Add to cart is Salla's own salla-add-product-button; no cart logic here.
 */
function setOpen(section, spot, open) {
  section.querySelectorAll('[data-unix-look-spot]').forEach(btn => {
    const isThis = btn === spot && open;
    btn.setAttribute('aria-expanded', String(isThis));
    const card = document.getElementById(btn.getAttribute('aria-controls'));
    if (card) card.hidden = !isThis;
  });
}

function priceHTML(product) {
  const money = value => (Number(value) > 0 ? salla.money(value) : '');
  if (product.is_on_sale && Number(product.sale_price) > 0) {
    return `<span class="unix-look__price-sale">${money(product.sale_price)}</span>`
      + ` <s class="unix-look__price-old">${money(product.regular_price)}</s>`;
  }
  return money(product.price || product.starting_price);
}

function fill(card, product) {
  const link = card.querySelector('[data-unix-look-name]');
  const price = card.querySelector('[data-unix-look-price]');
  const thumb = card.querySelector('.unix-look__thumb img');
  const add = card.querySelector('salla-add-product-button');
  const thumbUrl = product.thumbnail || product.image?.url || '';
  if (link) {
    link.textContent = product.name || '';
    if (product.url) link.href = product.url;
    link.removeAttribute('aria-busy');
    link.removeAttribute('tabindex');
  }
  if (price) price.innerHTML = priceHTML(product);
  if (thumb && thumbUrl) {
    thumb.src = thumbUrl;
    thumb.hidden = false;
  }
  if (add) {
    // a fresh element: Salla's button reads its slot and status once. The feminine label only for a
    // plain product on sale (as in Twig); otherwise no slot, so Salla shows its own state label.
    const fresh = document.createElement('salla-add-product-button');
    ['class', 'fill', 'width', 'product-id'].forEach(name => {
      if (add.hasAttribute(name)) fresh.setAttribute(name, add.getAttribute(name));
    });
    if (product.status) fresh.setAttribute('product-status', product.status);
    if (product.type) fresh.setAttribute('product-type', product.type);
    const plain = product.status === 'sale' && !['booking', 'donating'].includes(product.type);
    const label = card.closest('[data-unix-look]')?.dataset.labelAdd;
    if (plain && label) fresh.textContent = label;
    add.replaceWith(fresh);
  }
  const spot = card.closest('[data-unix-look]')
    ?.querySelector(`[aria-controls="${card.id}"] [data-unix-look-spot-name]`);
  if (spot && product.name) spot.textContent = `${spot.dataset.unixLookSpotName || ''}: ${product.name}`;
  card.removeAttribute('data-unix-look-pending');
}

function removeSpot(section, card) {
  const spot = section.querySelector(`[aria-controls="${card.id}"]`);
  const wasOpen = spot?.getAttribute('aria-expanded') === 'true';
  spot?.remove();
  card.remove();
  const next = section.querySelector('[data-unix-look-spot]');
  if (!next) section.querySelector('.unix-look__cards')?.remove();
  else if (wasOpen) setOpen(section, next, true);
}

function hydrate(section) {
  const pending = Array.from(section.querySelectorAll('[data-unix-look-pending]'));
  if (!pending.length) return;
  const ids = [...new Set(pending.map(card => card.dataset.unixLookCard).filter(Boolean))];
  if (!ids.length || !window.salla?.product?.api?.fetch) {
    pending.forEach(card => removeSpot(section, card));
    return;
  }
  salla.product.api.fetch({ source: 'selected', source_value: ids, limit: ids.length })
    .then(response => {
      const byId = new Map((response?.data || []).map(product => [String(product.id), product]));
      pending.forEach(card => {
        const product = byId.get(String(card.dataset.unixLookCard));
        if (product) fill(card, product);
        else removeSpot(section, card);
      });
    })
    .catch(error => {
      pending.forEach(card => removeSpot(section, card));
      salla.logger?.warn('unix-shop-look: could not load products', error);
    });
}

function closeOpen(section, { focus = false } = {}) {
  const open = section.querySelector('[data-unix-look-spot][aria-expanded="true"]');
  if (!open) return;
  setOpen(section, open, false);
  if (focus) open.focus();
}

let outsideBound = false;
function bindOutsideClick() {
  if (outsideBound) return;
  outsideBound = true;
  document.addEventListener('click', event => {
    document.querySelectorAll('[data-unix-look]').forEach(section => {
      if (event.target.closest?.('[data-unix-look-spot], .unix-look__card') && section.contains(event.target)) return;
      closeOpen(section);
    });
  });
}

function setup(section) {
  section.addEventListener('click', event => {
    if (event.target.closest('[data-unix-look-close]')) {
      closeOpen(section, { focus: true });
      return;
    }
    const spot = event.target.closest('[data-unix-look-spot]');
    if (!spot || !section.contains(spot)) return;
    setOpen(section, spot, spot.getAttribute('aria-expanded') !== 'true');
  });
  section.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const open = section.querySelector('[data-unix-look-spot][aria-expanded="true"]');
    if (!open) return;
    const card = document.getElementById(open.getAttribute('aria-controls'));
    if (event.target === open || card?.contains(event.target)) {
      setOpen(section, open, false);
      open.focus();
    }
  });
  hydrate(section);
}

export default function initShopLook() {
  const sections = document.querySelectorAll('[data-unix-look]');
  sections.forEach(setup);
  if (sections.length) bindOutsideClick();
}
