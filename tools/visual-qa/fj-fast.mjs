// D159 fast checkout in the cart: node fj-fast.mjs [phone|desktop]
import { open, URLS, BTN, BASE } from './fj-lib.mjs';
const mode = process.argv[2] || 'phone';
const out = `shots/fj/fast-${mode}`;
const { page, shot, log, go, scrollThrough, center, done } = await open({ mode, out });
log('status', await go(URLS.top, 5000));
await scrollThrough(1800, 200);
await page.waitForSelector(BTN, { state: 'attached', timeout: 60000 });
await page.waitForTimeout(2500);
const m = page.locator('.unix-pdp-options label, form.product-form label', { hasText: /^\s*M\s*$/ }).first();
await m.evaluate((e) => e.scrollIntoView({ block: 'center' }));
await m.click();
await page.waitForTimeout(1200);
await center(BTN);
await page.locator(BTN).click();
await page.waitForTimeout(9000);
const probe = (root) =>
  page.evaluate((root) => {
    const w = document.querySelector(`${root} salla-mini-checkout-widget`);
    if (!w) return { widget: false, script: !!document.querySelector('script[src*="fast-checkout-widget"]') };
    const b = w.shadowRoot?.querySelector('.s-fast-checkout-button');
    const r = (b || w).getBoundingClientRect();
    return {
      widget: true,
      defined: !!customElements.get('salla-mini-checkout-widget'),
      cartId: w.getAttribute('cart-id'),
      button: !!b,
      text: w.innerText.trim(),
      box: `${r.width | 0}x${r.height | 0}`,
    };
  }, root);
log('drawer', JSON.stringify(await probe('.unix-cd')));
await page.evaluate(() => { const b = document.querySelector('.unix-cd__footer'); b?.scrollIntoView({ block: 'end' }); });
await shot('drawer-footer');
const inner = page.locator('.unix-cd salla-mini-checkout-widget');
if (await inner.count()) {
  await inner.click().catch((e) => log('click err', String(e).slice(0, 120)));
  await page.waitForTimeout(7000);
  await shot('drawer-fast-open');
  log('modal', await page.evaluate(() => {
    const w = document.querySelector('.unix-cd salla-mini-checkout-widget');
    const f = w?.shadowRoot?.querySelector('iframe');
    const r = f?.getBoundingClientRect();
    return f ? `iframe ${r.width | 0}x${r.height | 0} src=${(f.src || '').slice(0, 80)}` : 'no iframe';
  }));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1500);
}
log('go cart', await go(`${BASE}/cart`, 5000));
await page.waitForTimeout(8000);
log('cart page', JSON.stringify(await probe('.unix-cart')));
const w = page.locator('.unix-cart salla-mini-checkout-widget');
if (await w.count()) await w.evaluate((e) => e.scrollIntoView({ block: 'center' }));
await page.waitForTimeout(800);
await shot('cart-page-fast');
await done();
