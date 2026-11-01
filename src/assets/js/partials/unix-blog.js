/**
 * UNIX blog carousel arrows (ROADMAP 2.8 · SPEC §4.12 · DS §8.17, §13.2).
 * The track in views/components/home/unix-blog.twig is a native scroll-snap list, so touch,
 * trackpad and keyboard scrolling work with no JS. This adds the prev/next arrows, like
 * unix.sa's featured-blog: one page (the visible cards) per click, shown only when the
 * cards overflow, and disabled at either end. Smooth scrolling comes from CSS and is
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

    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const overflows = max > 1;
      nav.hidden = !overflows;
      const progress = Math.abs(track.scrollLeft);
      prev.disabled = !overflows || progress <= 1;
      next.disabled = !overflows || progress >= max - 1;
      // a disabled button drops keyboard focus to <body>; hand it to the other arrow instead
      if (document.activeElement === next && next.disabled && !prev.disabled) prev.focus();
      if (document.activeElement === prev && prev.disabled && !next.disabled) next.focus();
    };

    const go = direction => {
      const delta = pageSize() * direction * (isRtl() ? -1 : 1);
      track.scrollBy({ left: delta });
    };

    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));

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
