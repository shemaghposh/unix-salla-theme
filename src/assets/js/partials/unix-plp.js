/**
 * UNIX collection page (ROADMAP 4.2 · DS §8.30, §8.31 · SPEC §6).
 *
 * - Filters drawer [data-unix-filters]: the 1.3 Drawer (focus trap, Esc, backdrop, focus return to the
 *   «الفلاتر» button). salla-filters lives inside it and applies every choice at once (Salla logic).
 * - Keyboard access for Salla's filter widgets without a fork: group titles (h3 with a click handler)
 *   and «show more» links (no href) get role="button", tabindex and Enter/Space; titles get aria-expanded.
 * - The filter whose label contains data-highlight (setting unix_collection_highlight_filter, «مقاس»)
 *   gets [data-unix-boxes] and shows as a box grid, like unix.sa's horizontal size filter.
 * - Selected-filter count on the button, hidden button when Salla reports no filters.
 * - Result count in a role="status" region after a filter / sort change; skeleton hand-off.
 */
import { Drawer } from './unix-drawer';

const ACTIVATE_KEYS = ['Enter', ' '];
let uid = 0;

function normalise(text) {
  return String(text || '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function matchesHighlight(label, target) {
  const a = normalise(label);
  return !!(a && target && (a === target || a.includes(target)));
}

function syncExpanded(title) {
  const content = title.closest('salla-filters-widget')?.querySelector('.s-filters-widget-content');
  if (content) title.setAttribute('aria-expanded', String(!content.classList.contains('s-filters-widget-closed')));
}

function enhanceWidgets(filters, highlight) {
  filters.querySelectorAll('salla-filters-widget').forEach(widget => {
    const title = widget.querySelector('.s-filters-widget-title');
    const content = widget.querySelector('.s-filters-widget-content');

    if (title && !title.hasAttribute('data-unix-a11y')) {
      title.setAttribute('data-unix-a11y', '');
      title.setAttribute('role', 'button');
      title.setAttribute('tabindex', '0');
      if (content) {
        content.id = content.id || `unix-filter-${++uid}`;
        title.setAttribute('aria-controls', content.id);
      }
    }
    title && syncExpanded(title);

    widget.querySelectorAll('.s-filters-widget-more:not([data-unix-a11y])').forEach(more => {
      more.setAttribute('data-unix-a11y', '');
      more.setAttribute('role', 'button');
      more.setAttribute('tabindex', '0');
    });

    const label = title?.querySelector('span')?.textContent;
    widget.toggleAttribute('data-unix-boxes', matchesHighlight(label, highlight));
  });
}

/** Number of shopper choices in salla-filters' data (the auto-added page category is not one). */
function countChoices(data) {
  const pageId = String(salla.config.get('page.id') ?? '');
  return Object.entries(data || {}).reduce((sum, [key, value]) => {
    if (key === 'variants' && value && typeof value === 'object') return sum + Object.keys(value).length;
    if (Array.isArray(value)) return sum + value.length;
    if (value && typeof value === 'object') return sum + 1; // price range
    if (key === 'category_id' && String(value) === pageId) return sum;
    return value == null || value === '' ? sum : sum + 1;
  }, 0);
}

function initFilters(drawerEl) {
  const filters = drawerEl.querySelector('salla-filters');
  const button = document.querySelector(`[aria-controls="${drawerEl.id}"]`);
  const counter = button?.querySelector('[data-unix-filter-count]');
  const highlight = normalise(drawerEl.dataset.highlight);
  const drawer = new Drawer(drawerEl);

  const updateCount = async data => {
    if (!counter) return;
    let filtersData = data;
    if (!filtersData && typeof filters?.getFilters === 'function') {
      filtersData = await filters.getFilters().catch(() => null);
    }
    const count = countChoices(filtersData);
    counter.hidden = !count;
    counter.textContent = count ? `(${count})` : ''; // Western digits in both languages (DS §7)
  };

  if (filters) {
    let frame = 0;
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => enhanceWidgets(filters, highlight));
    });
    observer.observe(filters, { childList: true, subtree: true });

    // Salla toggles the widget class in its own click handler; read the result afterwards
    filters.addEventListener('click', event => {
      const title = event.target.closest('.s-filters-widget-title');
      title && requestAnimationFrame(() => syncExpanded(title));
    });

    filters.addEventListener('keydown', event => {
      if (!ACTIVATE_KEYS.includes(event.key)) return;
      const control = event.target.closest('.s-filters-widget-title[role="button"], .s-filters-widget-more[role="button"]');
      if (!control || control !== event.target) return;
      event.preventDefault();
      control.click();
    });
  }

  drawerEl.querySelector('[data-unix-filters-reset]')?.addEventListener('click', () => {
    if (typeof filters?.resetFilters === 'function') filters.resetFilters();
  });

  salla.event.on('filters::fetched', () => {
    if (button) button.hidden = false;
    // salla-filters reconciles its data in the same tick; read it after
    setTimeout(() => updateCount(), 0);
  });
  salla.event.on('filters::hidden', () => {
    drawer.isOpen && drawer.close({ focusTarget: document.getElementById('product-filter') || document.body });
    if (button) button.hidden = true;
  });
  salla.event.on('salla-filters::changed', data => updateCount(data));
  salla.event.on('salla-filters::reset', () => updateCount({}));
}

function initResults(section) {
  const status = section.querySelector('[data-unix-plp-status]');
  const body = section.querySelector('.unix-plp__body');
  const list = section.querySelector('salla-products-list');
  const updatedText = section.dataset.updatedText || '';
  let firstLoad = true;

  const settle = () => body?.setAttribute('data-loaded', '');
  // componentOnReady rejects when the first request fails: nothing will come, drop the skeleton
  if (typeof list?.componentOnReady === 'function') list.componentOnReady().catch(settle);

  salla.event.on('salla-products-list::products.fetched', response => {
    if (!response || (response.cursor && response.cursor.current !== 1)) return; // «load more» pages
    settle();
    if (firstLoad) {
      firstLoad = false;
      return;
    }
    if (!status) return;

    const n = Array.isArray(response.data) ? response.data.length : 0;
    let count = String(salla.lang.choice('blocks.header.products_count', n) || n);
    if (response.cursor?.next) {
      count = count.replace(String(n), `${salla.lang.get('common.elements.more_than')} ${n}`);
    }
    // Clear first so the same text is announced again
    status.textContent = '';
    setTimeout(() => { status.textContent = `${updatedText} ${count}`.trim(); }, 100);
  });
}

export default function initPlp() {
  const section = document.querySelector('[data-unix-plp]');
  if (section) initResults(section);

  const drawerEl = document.getElementById('unix-filters');
  if (drawerEl) initFilters(drawerEl);
}
