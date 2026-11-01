/**
 * UNIX blog carousel arrows (ROADMAP 2.8 · SPEC §4.12 · DS §8.17, §13.2).
 * The track in views/components/home/unix-blog.twig is a native scroll-snap list, so touch,
 * trackpad and keyboard scrolling work with no JS. This adds the prev/next arrows, like
 * unix.sa's featured-blog: one page (the visible cards) per click, visible only when the
 * cards overflow (the column is reserved from the start), and aria-disabled at either end. Smooth scrolling comes from CSS and is
 * off under prefers-reduced-motion. RTL: scrollLeft runs from 0 to negative values.
 */
export default function initUnixBlog(root = document) {
  root.querySelectorAll('[data-unix-blog]').forEach(section => {
    const track = section.querySelector('[data-unix-blog-track]');
    const nav = section.querySelector('[data-unix-blog-nav]');
    const prev = section.querySelector('[data-unix-blog-prev]');
    const next = section.querySelector('[data-unix-blog-next]');
    if (!track || !nav || !prev || !next || section.dataset.unixBlogReady) return;
    section.dataset.unixBlogReady = 'true';

    const isRtl = () => getComputedStyle(track).direction === 'rtl';
    const visibleItems = () => Array.from(track.children).filter(item => item.offsetParent !== null);

    // One page = as many whole cards as fit in the track.
    const pageSize = () => {
      const items = visibleItems();
      if (items.length < 2) return track.clientWidth;
      const step = Math.abs(items[1].offsetLeft - items[0].offsetLeft) || items[0].offsetWidth;
      const perPage = Math.max(1, Math.floor((track.clientWidth + 1) / step));
      return perPage * step;
    };

    // aria-disabled (not [disabled]) keeps a focused arrow focused at either end;
    // the click handler ignores it instead.
    const setDisabled = (button, off) => button.setAttribute('aria-disabled', off ? 'true' : 'false');
    const isDisabled = button => button.getAttribute('aria-disabled') === 'true';

    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const overflows = max > 1;
      // The nav column is reserved by CSS; it only becomes visible once an overflow is measured.
      nav.dataset.overflow = overflows ? 'true' : 'false';
      const progress = Math.abs(track.scrollLeft);
      setDisabled(prev, !overflows || progress <= 1);
      setDisabled(next, !overflows || progress >= max - 1);
    };

    const go = (button, direction) => {
      if (isDisabled(button)) return;
      const delta = pageSize() * direction * (isRtl() ? -1 : 1);
      track.scrollBy({ left: delta });
    };

    prev.addEventListener('click', () => go(prev, -1));
    next.addEventListener('click', () => go(next, 1));

    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    track.addEventListener('scroll', schedule, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(track);
    else window.addEventListener('resize', schedule);

    update();
  });
}
