/**
 * UNIX footer (ROADMAP 1.4 · SPEC §3.1): the link columns are accordions on mobile and
 * plain open columns from lg up, where their summaries stop toggling.
 */
const DESKTOP_QUERY = '(min-width: 1024px)';

export default function initFooter() {
  const columns = Array.from(document.querySelectorAll('[data-footer-accordion]'));
  if (!columns.length) return;

  const desktop = window.matchMedia(DESKTOP_QUERY);
  const sync = () => columns.forEach(column => {
    column.open = desktop.matches;
    const summary = column.querySelector('summary');
    if (!summary) return;
    if (desktop.matches) summary.setAttribute('tabindex', '-1');
    else summary.removeAttribute('tabindex');
  });

  columns.forEach(column => {
    column.querySelector('summary')?.addEventListener('click', event => {
      if (desktop.matches) event.preventDefault();
    });
  });

  sync();
  if (desktop.addEventListener) desktop.addEventListener('change', sync);
  else desktop.addListener(sync);
}
