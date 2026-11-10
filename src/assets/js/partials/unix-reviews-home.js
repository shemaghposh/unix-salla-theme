/**
 * UNIX home reviews «آراء العميلات» (ROADMAP 2.11 · DS §8.53 · D141) for
 * views/components/home/unix-reviews.twig.
 * Same data as Salla's <salla-reviews>: salla.api.request('reviews', { params }, 'get'), with the
 * same params. Only the presentation is ours (no <h1>, no auto-play slider). The section stays
 * hidden until at least one review with text comes back; on an error it stays hidden.
 * Shopper text is set with textContent only (LESSONS 22, 33). No cart or review logic here.
 */
const STAR_MAX = 5;

function card(review, { hideName, ratingLabel }) {
  const li = document.createElement('li');
  li.className = 'unix-reviews-home__item';

  const stars = Math.max(0, Math.min(STAR_MAX, Math.round(Number(review.stars) || 0)));
  if (stars) {
    const rating = document.createElement('salla-rating-stars');
    rating.setAttribute('size', 'small');
    rating.setAttribute('value', String(stars));
    rating.setAttribute('aria-hidden', 'true');
    rating.className = 'unix-reviews-home__stars';
    const label = document.createElement('span');
    label.className = 'sr-only';
    label.textContent = ratingLabel.replace('__STARS__', String(stars));
    li.append(rating, label);
  }

  const text = document.createElement('p');
  text.className = 'unix-reviews-home__text';
  // the API sends the comment as stored; read it as text (DOMParser documents are inert: no scripts, no image loads)
  text.textContent = new DOMParser().parseFromString(String(review.content ?? ''), 'text/html').body.textContent.trim();
  li.append(text);

  const name = String(review.name ?? '').trim();
  if (!hideName && name) {
    const by = document.createElement('p');
    by.className = 'unix-reviews-home__name';
    by.textContent = name;
    li.append(by);
  }
  return text.textContent ? li : null;
}

function load(section) {
  const list = section.querySelector('[data-unix-reviews-list]');
  if (!list || !window.salla?.api?.request) return;
  const hideName = section.hasAttribute('data-hide-name');
  const params = {
    limit: Number(section.dataset.limit) || 6,
    sort: section.dataset.sort || 'top_rating',
    type: section.dataset.type || 'all',
    hide_customer_info: hideName ? 1 : 0,
  };
  const ratingLabel = section.dataset.labelRating || '__STARS__ / 5';

  salla.onReady()
    .then(() => salla.api.request('reviews', { params }, 'get'))
    .then(response => {
      const cards = (response?.data || [])
        .map(review => card(review, { hideName, ratingLabel }))
        .filter(Boolean);
      if (!cards.length) return;
      list.replaceChildren(...cards);
      section.hidden = false;
    })
    .catch(error => salla.logger?.warn('unix-reviews-home: could not load reviews', error));
}

export default function initReviewsHome() {
  document.querySelectorAll('[data-unix-reviews-home]').forEach(load);
}
