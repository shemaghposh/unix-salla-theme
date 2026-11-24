// Fix round 3 · item 2: a double tap on the phone sticky bar adds once and shows busy.
// Shopper actions only; the guest cart is emptied at the end. node r3-sticky.mjs [mode=sallaBtn|early]
// early: taps while Salla's add button has not mounted (the row never came near the screen).
import { open, u, P, OUT_ROOT, emptyCart } from './b66-lib.mjs';
const mode = process.argv[2] || 'sallaBtn';
const s = await open({ out: `${OUT_ROOT}/r3-sticky` });
const { page, log, go, shot, done } = s;
const adds = [];
page.on('request', (r) => { if (r.method() === 'POST' && /\/cart\/.*(item|add)|cart\/add|items/.test(r.url())) adds.push(r.url().replace(/^https?:\/\/[^/]+/, '').slice(0, 90)); });
await go(u('ar', P.leggings), mode === 'early' ? 4000 : 2500);
if (mode !== 'early') {
  await page.evaluate(() => document.querySelector('.unix-pdp-buy').scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(6000);
}
// Her size: the first enabled option box (Salla's), or the server list while it has not drawn
const picked = await page.evaluate(() => {
  const input = [...document.querySelectorAll('salla-product-options input[type=radio]')].find((i) => !i.disabled);
  if (!input) return 'no size input';
  (input.closest('label') || document.querySelector(`label[for="${input.id}"]`) || input).click();
  return input.name + '=' + input.value + ' checked=' + input.checked;
});
log('size', picked);
await page.waitForTimeout(1500);
await page.evaluate(() => window.scrollTo(0, document.querySelector('.unix-pdp-buy').getBoundingClientRect().bottom + scrollY + 700));
await page.waitForTimeout(1200);
const state = () => page.evaluate(() => {
  const bar = document.querySelector('.unix-sticky-atc'); const btn = bar?.querySelector('button');
  const row = document.querySelector('.unix-pdp-buy');
  return { visible: bar?.classList.contains('is-visible'), busy: btn?.getAttribute('aria-busy'), loading: btn?.classList.contains('is-loading'), adding: row?.getAttribute('data-unix-adding'), sallaBtn: !!row?.querySelector('salla-add-product-button salla-button button') };
});
log('before', JSON.stringify(await state()));
await page.evaluate(() => { const b = document.querySelector('.unix-sticky-atc button'); b.click(); b.click(); });
await page.waitForTimeout(150);
log('+150ms', JSON.stringify(await state()));
await shot(`sticky-busy-${mode}`);
await page.waitForTimeout(5000);
log('+5s', JSON.stringify(await state()));
log('add requests', adds.length, JSON.stringify(adds));
log('cart', await emptyCart(page));
await done();
