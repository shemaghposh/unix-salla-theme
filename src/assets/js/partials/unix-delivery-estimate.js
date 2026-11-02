/* ============================================================
   UNIX — Delivery estimate «متى يصلك طلبك؟» (ROADMAP 3.6 · DS §8.22)

   Same logic as unix.sa snippets/unix-shipping-estimate.liquid:
   - country '' → hide result; 'sa' → show the city select; 'intl' → international window
   - city tier '1' | '2' | '3' → that tier's window, with the local note
   Copy (prefix, windows, notes) is server-rendered into data-ship-text.
   ============================================================ */

const booted = new WeakSet();

function span(cls, text) {
  const node = document.createElement('span');
  node.className = cls;
  node.textContent = text;
  return node;
}

function initOne(root) {
  const country = root.querySelector('[data-ship-country]');
  const city = root.querySelector('[data-ship-city]');
  const cityWrap = root.querySelector('[data-ship-city-wrap]');
  const result = root.querySelector('[data-ship-result]');
  if (!country || !city || !result) return;

  let text = {};
  try { text = JSON.parse(root.dataset.shipText || '{}'); } catch (e) { text = {}; }
  const days = text.days || {};
  const notes = text.notes || {};

  const show = (key) => {
    if (!days[key]) { result.replaceChildren(); return; }
    result.replaceChildren(
      document.createTextNode(`${text.prefix || ''} `),
      span('unix-ship__days', days[key]),
      span('unix-ship__note', key === 'intl' ? notes.intl : notes.local),
    );
  };
  const hide = () => result.replaceChildren();

  country.addEventListener('change', () => {
    const v = country.value;
    city.value = '';
    cityWrap.hidden = v !== 'sa';
    if (v === 'intl') show('intl'); else hide();
  });

  city.addEventListener('change', () => {
    if (city.value) show(city.value); else hide();
  });
}

/** Boot every [data-unix-ship] box (called once from product.js; reusable elsewhere). */
export default function initDeliveryEstimate() {
  document.querySelectorAll('[data-unix-ship]').forEach((root) => {
    if (booted.has(root)) return;
    booted.add(root);
    initOne(root);
  });
}
