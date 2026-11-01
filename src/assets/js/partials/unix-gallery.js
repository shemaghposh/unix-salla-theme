/**
 * UNIX product gallery (ROADMAP 3.1 · DS §8.20) for views/components/product/unix-gallery.twig.
 *
 * - The main slider is Salla's `salla-slider` (Swiper). This file only drives what sits around it:
 *   the desktop thumbnail column (aria-current + keeps the active one in view), the prev/next
 *   arrows (disabled at the ends, no loop) and the zoom dialog. Swipe direction comes from Swiper
 *   reading `dir`, so RTL is native.
 * - Zoom: a native <dialog> opened with showModal() — focus stays inside, Esc closes (the browser's
 *   `cancel`), and on close focus returns to the zoom button of the slide being shown. Inside, a
 *   scroll-snap track gives native (RTL-correct) swiping; the zoom toggle / a click on the image
 *   doubles it (--zoom-scale) and panning is plain scrolling (touch / wheel), plus "follow the
 *   cursor" for a mouse.
 * - Inside the Salla mobile app, salla.mobile.openGallery takes over (as in Raed).
 * Nothing here touches cart, options or price logic.
 */
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollBehavior = instant => (instant || prefersReducedMotion() ? 'auto' : 'smooth');

/** Keep `thumb` visible inside its own scrolling column without scrolling the page. */
function revealThumb(thumb) {
  const item = thumb.parentElement;
  const list = item?.parentElement;
  if (!list || list.scrollHeight <= list.clientHeight) return;
  const top = item.offsetTop;
  const bottom = top + item.offsetHeight;
  if (top < list.scrollTop) {
    list.scrollTo({ top, behavior: scrollBehavior() });
  } else if (bottom > list.scrollTop + list.clientHeight) {
    list.scrollTo({ top: bottom - list.clientHeight, behavior: scrollBehavior() });
  }
}

function setupDialog(gallery, onClose) {
  const dialog = gallery.querySelector('[data-unix-gallery-dialog]');
  if (!dialog || typeof dialog.showModal !== 'function') return null;

  const track = dialog.querySelector('[data-unix-gallery-track]');
  const items = Array.from(track?.children || []);
  if (!items.length) return null;

  const counter = dialog.querySelector('[data-unix-gallery-counter]');
  const zoomToggle = dialog.querySelector('[data-unix-gallery-zoom-toggle]');
  const prev = dialog.querySelector('[data-unix-gallery-dialog-prev]');
  const next = dialog.querySelector('[data-unix-gallery-dialog-next]');
  const template = gallery.dataset.counter || '{i} / {n}';
  let current = 0;
  let opener = null;
  let frame = 0;

  const isZoomed = item => !!item?.classList.contains('is-zoomed');

  const setZoom = (item, on, fx = .5, fy = .5) => {
    if (!item || isZoomed(item) === on) return;
    const pan = item.querySelector('.unix-gallery-dialog__pan');
    item.classList.toggle('is-zoomed', on);
    if (on) {
      pan.tabIndex = 0; // arrow keys pan natively while zoomed
      pan.scrollLeft = fx * (pan.scrollWidth - pan.clientWidth);
      pan.scrollTop = fy * (pan.scrollHeight - pan.clientHeight);
    } else {
      pan.removeAttribute('tabindex');
    }
  };

  const update = () => {
    items.forEach((item, i) => i !== current && setZoom(item, false));
    const zoomed = isZoomed(items[current]);
    dialog.classList.toggle('is-zoomed', zoomed);
    zoomToggle?.setAttribute('aria-pressed', String(zoomed));
    if (counter) counter.textContent = template.replace('{i}', current + 1).replace('{n}', items.length);
    if (prev) prev.disabled = current <= 0;
    if (next) next.disabled = current >= items.length - 1;
  };

  const goTo = (index, instant = false) => {
    const target = Math.min(Math.max(index, 0), items.length - 1);
    items[target].scrollIntoView({ inline: 'start', block: 'nearest', behavior: scrollBehavior(instant) });
    current = target;
    update();
  };

  // Swipes / scroll-snap: the visible item is the current one (abs() covers RTL's negative scrollLeft)
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const index = Math.round(Math.abs(track.scrollLeft) / (track.clientWidth || 1));
      if (index !== current && items[index]) {
        current = index;
        update();
      }
    });
  }, { passive: true });

  // Click on the image: zoom in at that point / zoom back out
  track.addEventListener('click', event => {
    const img = event.target.closest('.unix-gallery-dialog__img');
    if (!img) return;
    const item = img.closest('.unix-gallery-dialog__item');
    const box = img.getBoundingClientRect();
    setZoom(item, !isZoomed(item), (event.clientX - box.left) / box.width, (event.clientY - box.top) / box.height);
    update();
  });

  // Mouse: while zoomed, the image follows the cursor (touch and wheel pan by native scrolling)
  track.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    const item = items[current];
    if (!isZoomed(item)) return;
    const pan = item.querySelector('.unix-gallery-dialog__pan');
    const box = pan.getBoundingClientRect();
    pan.scrollLeft = ((event.clientX - box.left) / box.width) * (pan.scrollWidth - pan.clientWidth);
    pan.scrollTop = ((event.clientY - box.top) / box.height) * (pan.scrollHeight - pan.clientHeight);
  });

  zoomToggle?.addEventListener('click', () => {
    setZoom(items[current], !isZoomed(items[current]));
    update();
  });
  prev?.addEventListener('click', () => goTo(current - 1));
  next?.addEventListener('click', () => goTo(current + 1));
  dialog.querySelector('[data-unix-gallery-close]')?.addEventListener('click', () => dialog.close());

  dialog.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || isZoomed(items[current])) return;
    if (event.target.closest('input, textarea')) return;
    const rtl = getComputedStyle(dialog).direction === 'rtl';
    const forward = (event.key === 'ArrowRight') !== rtl;
    event.preventDefault();
    goTo(current + (forward ? 1 : -1));
  });

  dialog.addEventListener('close', () => {
    items.forEach(item => setZoom(item, false));
    dialog.classList.remove('is-zoomed');
    onClose(Number(items[current].dataset.unixGallerySlide), opener);
    opener = null;
  });

  return {
    open(slideIndex, trigger) {
      opener = trigger;
      const index = items.findIndex(item => Number(item.dataset.unixGallerySlide) === slideIndex);
      dialog.showModal();
      goTo(index < 0 ? 0 : index, true);
    },
  };
}

function setupGallery(gallery) {
  const slider = gallery.querySelector('salla-slider');
  if (!slider || gallery.dataset.unixGalleryReady) return;
  gallery.dataset.unixGalleryReady = '1';

  let images = [];
  try {
    images = JSON.parse(slider.dataset.images || '[]');
  } catch (e) {
    images = [];
  }
  const thumbs = Array.from(gallery.querySelectorAll('[data-unix-gallery-thumb]'));
  const prev = gallery.querySelector('[data-unix-gallery-prev]');
  const next = gallery.querySelector('[data-unix-gallery-next]');
  const count = images.length;
  let swiper = null;

  const sync = index => {
    thumbs.forEach((thumb, i) => {
      if (i === index) {
        thumb.setAttribute('aria-current', 'true');
        revealThumb(thumb);
      } else {
        thumb.removeAttribute('aria-current');
      }
    });
    if (prev) prev.disabled = index <= 0;
    if (next) next.disabled = index >= count - 1;
  };

  const bind = instance => {
    if (swiper || !instance?.on) return;
    swiper = instance;
    swiper.on('slideChange', () => sync(swiper.activeIndex));
    sync(swiper.activeIndex);
  };

  slider.addEventListener('afterInit', event => bind(event.detail));
  customElements.whenDefined('salla-slider')
    .then(() => slider.componentOnReady?.())
    .then(() => requestAnimationFrame(() => requestAnimationFrame(() => bind(slider.querySelector('.swiper')?.swiper))));

  prev?.addEventListener('click', () => slider.slidePrev());
  next?.addEventListener('click', () => slider.slideNext());
  thumbs.forEach(thumb => thumb.addEventListener('click', () => slider.slideTo(Number(thumb.dataset.unixGalleryThumb))));

  const dialog = setupDialog(gallery, (slideIndex, opener) => {
    if (swiper && swiper.activeIndex !== slideIndex) slider.slideTo(slideIndex, 0);
    const target = gallery.querySelector(`[data-unix-gallery-zoom="${slideIndex}"]`) || opener;
    target?.focus({ preventScroll: true });
  });

  // Capture phase: the Salla app's native gallery wins over our dialog and over fslightbox (videos)
  gallery.addEventListener('click', event => {
    const trigger = event.target.closest('[data-unix-gallery-zoom], .unix-gallery__slide--video');
    if (!trigger || !gallery.querySelector('.unix-gallery__main')?.contains(trigger)) return;
    // Swiper sets allowClick=false for the click that ends a drag
    if (swiper && swiper.allowClick === false) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const slide = trigger.closest('[data-slid-index]');
    const index = Number(slide?.dataset.slidIndex || 0);
    if (salla.mobile?.openGallery?.(images, images[index])) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (trigger.matches('[data-unix-gallery-zoom]') && dialog) {
      event.preventDefault();
      dialog.open(index, trigger);
    }
  }, { capture: true });
}

export default function initGallery(root = document) {
  root.querySelectorAll('[data-unix-gallery]').forEach(setupGallery);
}
