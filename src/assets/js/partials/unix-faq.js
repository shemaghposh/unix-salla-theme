/**
 * UNIX FAQ «عرض المزيد / عرض أقل» (ROADMAP 2.9 · DS §8.10).
 * Same states as unix.sa's collapsible-content.js: collapsed = 4th question is a faded, inert
 * teaser and the rest sit in a hidden="until-found" group; expanded = all questions.
 * One toggle button (aria-expanded) instead of the original two; primary when collapsed,
 * secondary when expanded (unix.sa show_more / show_less styles).
 * Opening one answer closes the others natively (<details name>), so no JS is needed for that.
 */
function initFaq(faq) {
  const button = faq.querySelector('[data-unix-faq-more]');
  if (!button) return;
  const extra = faq.querySelector('[data-unix-faq-extra]');
  const teaser = faq.querySelector('[data-unix-faq-teaser]');

  const setExpanded = (expanded, { moveFocus = false } = {}) => {
    button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    button.textContent = expanded ? button.dataset.labelLess : button.dataset.labelMore;
    button.classList.toggle('unix-btn--secondary', expanded);

    if (teaser) {
      teaser.inert = !expanded;
      teaser.classList.toggle('is-teaser', !expanded);
      if (!expanded) teaser.open = false;
    }
    if (extra) {
      if (expanded) {
        extra.removeAttribute('hidden');
      } else {
        extra.querySelectorAll('details[open]').forEach(item => { item.open = false; });
        extra.setAttribute('hidden', 'until-found');
      }
    }

    // Move focus to the first question that just became available.
    if (expanded && moveFocus) {
      const first = teaser || (extra && extra.querySelector('details'));
      const summary = first && first.querySelector('summary');
      if (summary) summary.focus();
    }
  };

  button.addEventListener('click', () => {
    setExpanded(button.getAttribute('aria-expanded') !== 'true', { moveFocus: true });
  });

  // Find-in-page revealed a hidden question: the browser drops `hidden`, keep the state in sync.
  if (extra) extra.addEventListener('beforematch', () => setExpanded(true));
}

export default function initFaqs(root = document) {
  root.querySelectorAll('[data-unix-faq]').forEach(faq => {
    if (faq.dataset.unixFaqReady) return;
    faq.dataset.unixFaqReady = '1';
    initFaq(faq);
  });
}
