/* ============================================================
   UNIX — Size charts (ROADMAP 3.4 · DS §8.23 · SPEC §8.2)

   Port of unix.sa block size_guide_custom: underlined text buttons
   that open the chart in a modal. Data = Salla's own product size
   guides (D60), read with salla.product.getSizeGuides(id) — the same
   call <salla-product-size-guide> makes — so there is no option or
   product logic of our own here, only presentation.

   Native <dialog> + showModal(): focus stays inside, Esc closes
   (browser `cancel`), backdrop click closes (as unix.sa), focus
   returns to the button that opened it, page scroll locked in CSS.
   ============================================================ */

const TOP = /أعلى|اعلى|علوي|top|upper/i;
const BOTTOM = /أسفل|اسفل|سفلي|bottom|lower/i;
const instances = new WeakMap();

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

class SizeCharts {
  constructor(root) {
    this.root = root;
    this.productId = root.dataset.productId;
    this.buttons = root.querySelector('[data-sg-buttons]');
    this.dialog = root.querySelector('[data-sg-dialog]');
    this.title = this.dialog.querySelector('[data-sg-title]');
    this.content = this.dialog.querySelector('[data-sg-content]');
    this.statusEl = this.dialog.querySelector('[data-sg-status]');
    this.guides = null;     // [{ label, name, html }] once loaded
    this.request = null;
    this.trigger = null;

    // Keep the dialog out of the product form (and any transformed ancestor).
    document.body.appendChild(this.dialog);

    this.buttons.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-sg-open]');
      if (btn) this.open(btn);
    });
    this.dialog.querySelector('[data-sg-close]')?.addEventListener('click', () => this.close());
    this.dialog.addEventListener('click', (e) => {
      if (e.target !== this.dialog) return;
      const r = this.dialog.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) this.close();
    });
    this.dialog.addEventListener('close', () => {
      // the buttons may have been rebuilt while open (guide names arrived): fall back to the first
      const target = this.trigger && document.contains(this.trigger)
        ? this.trigger : this.buttons.querySelector('[data-sg-open]');
      target?.focus({ preventScroll: true });
    });
  }

  label(key, name) {
    const text = this.root.dataset[`label${key}`] || '';
    return name != null ? text.replace('__NAME__', name) : text;
  }

  /** Fetch once; resolves to the labelled guide list, or null on failure. */
  load() {
    if (this.request) return this.request;
    const sdk = window.salla;
    if (!sdk?.product?.getSizeGuides) return Promise.resolve(null);
    const call = () => sdk.product.getSizeGuides(this.productId);
    const run = sdk.api?.withoutNotifier ? sdk.api.withoutNotifier(call) : call();
    this.request = Promise.resolve(run)
      .then((res) => {
        this.guides = this.labelled(Array.isArray(res?.data) ? res.data : []);
        this.renderButtons();
        return this.guides;
      })
      .catch(() => {
        this.request = null; // allow a retry on the next click
        return null;
      });
    return this.request;
  }

  /** Name → button label, ordered general, top, bottom (unix.sa order). */
  labelled(list) {
    const rank = { single: 0, other: 0, top: 1, bottom: 2 };
    const guides = list
      .filter(g => g && (g.description || g.name))
      .map((g, i) => {
        const name = String(g.name || '').trim();
        const kind = TOP.test(name) ? 'top' : (BOTTOM.test(name) ? 'bottom' : 'other');
        return { name, html: g.description || '', kind, i };
      });
    const others = guides.filter(g => g.kind === 'other').length;
    guides.forEach((g) => {
      if (guides.length === 1 || (g.kind === 'other' && others === 1)) g.kind = 'single';
      g.label = g.kind === 'top' ? this.label('Top')
        : g.kind === 'bottom' ? this.label('Bottom')
        : g.kind === 'single' ? this.label('Single')
        : this.label('Named', g.name);
    });
    return guides.sort((a, b) => (rank[a.kind] - rank[b.kind]) || (a.i - b.i));
  }

  /** One server-rendered button stays for 0–1 guides; several get one button each. */
  renderButtons() {
    if (!this.guides || this.guides.length < 2) return;
    const hadFocus = this.buttons.contains(document.activeElement);
    const template = this.buttons.querySelector('[data-sg-open]');
    const fresh = this.guides.map((g, index) => {
      const btn = template.cloneNode(false);
      btn.textContent = g.label;
      btn.dataset.sgIndex = String(index);
      return btn;
    });
    this.buttons.replaceChildren(...fresh);
    if (hadFocus) fresh[0].focus({ preventScroll: true });
  }

  open(btn) {
    this.trigger = btn;
    const index = btn.dataset.sgIndex != null ? Number(btn.dataset.sgIndex) : null;
    this.title.textContent = btn.textContent.trim();
    if (!this.dialog.open) this.dialog.showModal();

    if (this.guides) { this.render(index); return; }
    this.status(this.label('Loading'));
    this.load().then((guides) => {
      if (!this.dialog.open) return;
      if (guides && guides.length) this.render(index);
      else this.status(this.label('Error'));
    });
  }

  close() { if (this.dialog.open) this.dialog.close(); }

  /** The one persistent role="status" node (in the twig) only changes its text, so it is announced. */
  status(text) {
    if (text) this.content.replaceChildren();
    if (this.statusEl) this.statusEl.textContent = text || '';
  }

  /** One guide by index, or every guide (each under its own heading) when none was chosen. */
  render(index) {
    const guides = this.guides || [];
    const one = index != null ? guides[index] : (guides.length === 1 ? guides[0] : null);
    const blocks = (one ? [one] : guides).map((g) => {
      const section = el('section', 'unix-sg__chart');
      if (!one && g.name) section.appendChild(el('h3', 'unix-sg__name', g.name));
      // a wide table scrolls inside this box: focusable + named so keyboard users can scroll it
      const body = el('div', 'unix-sg__rte');
      body.tabIndex = 0;
      body.setAttribute('role', 'region');
      body.setAttribute('aria-label', g.label || g.name || this.title.textContent);
      body.innerHTML = g.html; // merchant HTML from Salla's size guide (same as <salla-product-size-guide>)
      section.appendChild(body);
      return section;
    });
    this.status('');
    this.content.replaceChildren(...blocks);
    this.content.scrollTop = 0;
    this.dialog.scrollTop = 0;
  }
}

/** Boot every [data-unix-sg] root (called once from product.js). */
export default function initSizeCharts() {
  const roots = document.querySelectorAll('[data-unix-sg]');
  if (!roots.length) return;
  const booted = [];
  roots.forEach((root) => {
    if (instances.has(root)) return;
    const dialog = root.querySelector('[data-sg-dialog]');
    if (!dialog || typeof dialog.showModal !== 'function') { root.hidden = true; return; } // no <dialog> support
    const charts = new SizeCharts(root);
    instances.set(root, charts);
    booted.push(charts);
  });
  if (!booted.length) return;

  // Pre-load the guide names after the page (LCP) so a set shows its top/bottom buttons.
  const preload = () => {
    const idle = window.requestIdleCallback || (cb => setTimeout(cb, 200));
    idle(() => {
      const start = () => booted.forEach(c => c.load());
      if (window.salla?.onReady) window.salla.onReady(start); else start();
    });
  };
  if (document.readyState === 'complete') preload();
  else window.addEventListener('load', preload, { once: true });
}
