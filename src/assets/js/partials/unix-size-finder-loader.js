/**
 * UNIX Size Finder loader (ROADMAP 3.3 · DS §8.11).
 * Tiny, ships in product.js. The finder itself (model + UI) is a separate chunk,
 * imported on the first click of the trigger, or on idle when a saved profile
 * exists (so the trigger shows her size and the size is pre-selected, like unix.sa).
 *
 * Opens the native <dialog> straight away with its server-rendered "loading" state,
 * so the click is answered even on a slow connection. Esc / backdrop / close button
 * work before the chunk arrives; focus always returns to the trigger.
 */
const STORE_KEY = 'unix_fit_v2'; // same as unix.sa (see unix-size-finder-model.js)

let chunk;
const loadFinder = () => {
  chunk = chunk || import(/* webpackChunkName: "unix-size-finder" */ './unix-size-finder');
  return chunk;
};

function savedProfile() {
  try {
    const p = JSON.parse(localStorage.getItem(STORE_KEY));
    return !!p && (p.usual != null || p.brandSize != null || (p.height != null && p.weight != null));
  } catch (e) {
    return false;
  }
}

function boot(root) {
  if (root.dataset.sfBoot) return;
  root.dataset.sfBoot = '1';

  const trigger = root.querySelector('[data-sf-open]');
  const dialog = root.querySelector('[data-sf-dialog]');
  if (!trigger || !dialog || typeof dialog.showModal !== 'function') {
    if (root) root.hidden = true; // no <dialog> support: hide rather than half-work
    return;
  }

  // Out of the product <form> (no nested-form side effects) and away from transformed ancestors.
  root._sfDialog = dialog;
  document.body.appendChild(dialog);

  dialog.addEventListener('close', () => {
    trigger.setAttribute('aria-expanded', 'false');
    if (document.contains(trigger)) trigger.focus({ preventScroll: true });
  });
  // Backdrop click (outside the dialog box) closes it.
  dialog.addEventListener('click', (e) => {
    if (e.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) dialog.close();
  });
  dialog.querySelector('[data-sf-close]')?.addEventListener('click', () => dialog.close());

  trigger.addEventListener('click', () => {
    if (!dialog.open) dialog.showModal();
    trigger.setAttribute('aria-expanded', 'true');
    loadFinder()
      .then(mod => mod.default(root).open())
      .catch(() => {
        const status = dialog.querySelector('.unix-sf__think p');
        if (status) status.textContent = window.salla?.lang?.get('blocks.unix.size_finder.load_error') || '';
        chunk = null; // allow a retry
      });
  });

  if (savedProfile()) {
    const idle = window.requestIdleCallback || (fn => setTimeout(fn, 1500));
    idle(() => loadFinder().then(mod => mod.default(root).autoSelect()).catch(() => {}));
  }
}

export default function initSizeFinder() {
  document.querySelectorAll('[data-unix-sf]').forEach(boot);
}
