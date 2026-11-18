// D159 Apple Pay for the cart: node fj-applepay.mjs [fake|real]
// fake: pretends the browser has Apple Pay (window.ApplePaySession) to check the button and its
// cart state. Never taps it: nothing is paid or sent to checkout.
import { open, URLS, BTN, BASE } from './fj-lib.mjs';
const fake = (process.argv[2] || 'fake') === 'fake';
const out = `shots/fj/applepay-${fake ? 'fake' : 'real'}`;
const { page, shot, log, go, scrollThrough, center, done } = await open({ mode: 'phone', out });
if (fake) {
  await page.addInitScript(() => {
    window.ApplePaySession = function () {};
    window.ApplePaySession.canMakePayments = () => true;
    window.ApplePaySession.supportsVersion = () => true;
  });
}
log('status', await go(URLS.top, 5000));
await scrollThrough(1800, 200);
await page.waitForSelector(BTN, { state: 'attached', timeout: 90000 });
await page.waitForTimeout(2500);
const m = page.locator('.unix-pdp-options label, form.product-form label', { hasText: /^\s*M\s*$/ }).first();
await m.evaluate((e) => e.scrollIntoView({ block: 'center' }));
await m.click();
await page.waitForTimeout(1200);
await center(BTN);
await page.locator(BTN).click();
await page.waitForTimeout(10000);
const probe = (root) =>
  page.evaluate((root) => {
    const el = document.querySelector(`${root} salla-quick-buy`);
    if (!el) return { button: false };
    const b = el.querySelector('apple-pay-button') || el.shadowRoot?.querySelector('apple-pay-button');
    const r = (b || el).getBoundingClientRect();
    return {
      button: true,
      pageId: window.salla?.config?.get?.('page.id'),
      productId: el.productId ?? null,
      cartId: el.getAttribute('cart-id'),
      amount: el.amount,
      checkoutType: typeof el.resolveCheckoutType === 'function' ? el.resolveCheckoutType() : '?',
      applePayActive: el.isApplePayActive,
      box: `${r.width | 0}x${r.height | 0}`,
    };
  }, root);
log('drawer on PDP', JSON.stringify(await probe('.unix-cd')));
await page.evaluate(() => document.querySelector('.unix-cd__footer')?.scrollIntoView({ block: 'end' }));
await shot('drawer-footer');
log('go cart', await go(`${BASE}/cart`, 5000));
await page.waitForTimeout(9000);
log('cart page', JSON.stringify(await probe('.unix-cart')));
const w = page.locator('.unix-cart salla-quick-buy, .unix-cart__summary').first();
if (await w.count()) await w.evaluate((e) => e.scrollIntoView({ block: 'center' }));
await page.waitForTimeout(800);
await shot('cart-page');
await done();
