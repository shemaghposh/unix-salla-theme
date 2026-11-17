import { chromium, devices } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ ...devices['iPhone 14 Pro'], locale: 'ar-SA' });
await context.addCookies([{ name: 'salla_view_as', value: '1789843788', domain: 'localhost', path: '/' }]);
const page = await context.newPage();
const errs = [];
page.on('pageerror', (e) => errs.push('PAGEERROR ' + String(e.message).slice(0, 200)));
page.on('response', (r) => r.status() >= 400 && /cart|product/.test(r.url()) && errs.push(r.status() + ' ' + r.url().slice(0, 140)));
const shot = (n) => page.screenshot({ path: `shots/flow/${n}.png` });
const log = (...a) => console.log(...a);
const BTN = '.unix-pdp-buy salla-add-product-button salla-button button';
const center = (sel) => page.evaluate((sel) => { const e = document.querySelector(sel); e?.scrollIntoView({ block: 'center' }); return !!e; }, sel);
const drawerOpen = () => page.evaluate(() => { const d = document.querySelector('#cart-drawer, .unix-cd'); return d ? d.className + ' | hidden=' + d.hasAttribute('hidden') + ' aria-hidden=' + d.getAttribute('aria-hidden') : 'no drawer el'; });

await page.goto('http://localhost:5173/yonks/sculpting-bra-top-vanilla/p1442810508', { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.waitForTimeout(5000);
for (let y = 0; y < 1600; y += 200) { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(350); }
await page.waitForSelector(BTN, { state: 'attached', timeout: 60000 });
await page.waitForTimeout(2500);
await center(BTN); await page.waitForTimeout(800);
await shot('1-pdp-before');
log('sizes:', await page.evaluate(() => [...document.querySelectorAll('salla-product-options label, .unix-pdp-buy ~ * label, form label')].map(l => l.innerText.trim()).filter(Boolean).slice(0, 12).join(',')));
// 1) add without a size
await page.locator(BTN).click({ timeout: 10000 }); await page.waitForTimeout(3000);
log('1 no-size drawer:', await drawerOpen());
log('1 validation text:', await page.evaluate(() => [...document.querySelectorAll('[role=alert], .s-product-options-option-error, .unix-pdp__error, .s-notify, [class*=error]')].map(e => e.innerText.trim()).filter(Boolean).slice(0, 4).join(' / ')));
await shot('2-add-without-size');
// 2) choose M, add
const m = page.locator('label', { hasText: /^\s*M\s*$/ }).first();
log('M labels:', await page.locator('label', { hasText: /^\s*M\s*$/ }).count());
await m.evaluate((e) => e.scrollIntoView({ block: 'center' })); await page.waitForTimeout(400);
await m.click({ timeout: 10000 }); await page.waitForTimeout(1500);
await shot('2b-size-chosen');
await center(BTN); await page.waitForTimeout(400);
await page.evaluate((sel) => { const b = document.querySelector(sel); window.__log = []; const rec = () => { const cs = getComputedStyle(b); const l = b.querySelector('.s-button-loader'); window.__log.push(`${Math.round(performance.now())} cls=${b.className.replace(/s-button-(element|btn|solid|wide|primary|loader-center|wrap)|hydrated/g,'').trim()} dis=${b.disabled} op=${cs.opacity} bg=${cs.backgroundColor} sallaLoader=${l ? getComputedStyle(l).display : 'no'} after=${getComputedStyle(b,'::after').content}/${getComputedStyle(b,'::after').animationName}`); }; new MutationObserver(rec).observe(b, { attributes: true, childList: true, subtree: true }); rec(); }, BTN);
await page.locator(BTN).click({ timeout: 10000 });
const states = [];
for (let i = 0; i < 6; i++) { await page.waitForTimeout(150); states.push(await page.evaluate((sel) => { const b = document.querySelector(sel); if (!b) return 'none'; const cs = getComputedStyle(b); const l = b.querySelector('.s-button-loader'); return `${Date.now() % 100000} load=${/loading|is-loading/.test(b.className) || b.disabled} op=${cs.opacity} bg=${cs.backgroundColor} sallaLoader=${l ? getComputedStyle(l).display : 'no'}`; }, BTN)); if (i === 1) await shot('3-loading'); }
log('2 loading states:\n ' + states.join('\n '));
await page.waitForTimeout(6000);
log('2b mutation log:\n ' + (await page.evaluate(() => window.__log)).join('\n '));
log('3 drawer after add:', await drawerOpen());
await shot('4-drawer');
const panel = async () => (await page.locator('#cart-drawer, .unix-cd').first().innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 900);
log('4 drawer text:', await panel());
log('5 pair block =', await page.locator('.unix-cd-pair').count(), '| name:', await page.locator('.unix-cd-pair__name').innerText().catch(() => '-'));
log('8 add button after:', await page.evaluate((sel) => { const b = document.querySelector(sel); return b ? b.className + ' disabled=' + b.disabled : 'none'; }, BTN));
// 3) pair
if (await page.locator('.unix-cd-pair').count()) {
  await page.locator('.unix-cd-pair').evaluate((e) => e.scrollIntoView({ block: 'center' })); await page.waitForTimeout(500);
  await shot('5-pair');
  log('5b add disabled before size:', await page.locator('.unix-cd-pair__add').getAttribute('aria-disabled'));
  log('5b hint:', await page.locator('.unix-cd-pair__hint').innerText().catch(() => '-'), '| lines:', await page.locator('#cart-drawer [class*=unix-cd-item], .unix-cd [class*=item]').count());
  const size = page.locator('.unix-cd-pair .unix-set__size:not(.is-out)').nth(2);
  await size.click(); await page.waitForTimeout(500);
  await shot('5c-pair-size');
  await page.locator('.unix-cd-pair__add').click(); await page.waitForTimeout(300); await shot('5d-pair-adding');
  await page.waitForTimeout(7000);
  await page.evaluate(() => document.querySelector('.unix-cd [class*=body], .unix-cd__body')?.scrollTo(0, 0));
  await shot('6-after-pair');
  log('6 after pair add: pair block =', await page.locator('.unix-cd-pair').count());
  log('7 drawer text:', await panel());
}
log('errors:', [...new Set(errs)].slice(0, 10).join(' ;; '));
// quantity + remove inside the drawer
log('9 drawer buttons:', await page.evaluate(() => [...document.querySelectorAll('.unix-cd button, .unix-cd a')].map(b => { const r = b.getBoundingClientRect(); return `${(b.getAttribute('aria-label') || b.innerText.trim()).slice(0,22)}:${r.width|0}x${r.height|0}`; }).join(' ; ')));
const inc = page.locator('.unix-cd [aria-label*="زيادة"], .unix-cd [aria-label*="زيدي"], .unix-cd .unix-cd-item__qty button').last();
if (await inc.count()) { await inc.click().catch((e) => log('inc click failed', String(e).slice(0,100))); await page.waitForTimeout(5000); await shot('7-qty-plus'); log('10 after +:', await panel()); }
const rm = page.locator('.unix-cd [aria-label*="حذف"], .unix-cd [aria-label*="إزالة"], .unix-cd [class*=remove]').last();
if (await rm.count()) { await rm.click().catch((e) => log('rm click failed', String(e).slice(0,100))); await page.waitForTimeout(6000); await shot('8-removed'); log('11 after remove:', await panel()); }
await context.storageState({ path: 'state.json' });
await browser.close();
