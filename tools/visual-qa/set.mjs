import { chromium, devices } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ ...devices['iPhone 14 Pro'], locale: 'ar-SA' });
await context.addCookies([{ name: 'salla_view_as', value: '1789843788', domain: 'localhost', path: '/' }]);
const page = await context.newPage();
const uni = (t) => t.replace(/\\u[0-9a-f]{4}/g, (m) => String.fromCharCode(parseInt(m.slice(2), 16)));
page.on('request', (r) => /\/cart\//.test(r.url()) && !['GET', 'OPTIONS'].includes(r.method()) && console.log('  REQ', r.url().slice(-45), (r.postData() || '').replace(/------WebKitFormBoundary\w+|Content-Disposition: form-data; /g, '').replace(/\s+/g, ' ').slice(0, 420)));
page.on('response', async (r) => { if (/\/cart\//.test(r.url()) && r.request().method() === 'POST') { const t = uni(await r.text().catch(() => '')); console.log('  RES', r.status(), r.status() >= 400 ? t.slice(-260) : ''); } });
const shot = (n) => page.screenshot({ path: `shots/flow/${n}.png` });
const BTN = '.unix-pdp-buy salla-add-product-button salla-button button';
const panel = async () => (await page.locator('.unix-cd').first().innerText().catch(() => '(no drawer)')).replace(/\n+/g, ' | ').slice(0, 600);
await page.goto('http://localhost:5173/yonks/sculpting-set-vanilla/p358089757', { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.waitForTimeout(5000);
for (let y = 0; y < 1800; y += 200) { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(350); }
await page.waitForSelector(BTN, { state: 'attached', timeout: 60000 }); await page.waitForTimeout(2500);
console.log('set rows:', await page.evaluate(() => [...document.querySelectorAll('.unix-set__row, .unix-set__piece, [class*="unix-set__"]')].slice(0, 40).map(e => e.className.split(' ')[0]).filter((v, i, a) => a.indexOf(v) === i).join(',')));
console.log('set text:', (await page.locator('.unix-set').first().innerText().catch(() => '-')).replace(/\n+/g, ' | ').slice(0, 300));
await page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), BTN); await page.waitForTimeout(500);
await shot('s1-set-before');
await page.locator(BTN).click(); await page.waitForTimeout(3000);
console.log('1 add without sizes -> drawer:', (await page.locator('.unix-cd.is-open').count()) ? 'OPENED (bad)' : 'not opened (good)');
console.log('  message:', await page.evaluate(() => [...document.querySelectorAll('.unix-set [role=alert], .unix-set__error, .unix-set [class*=error], .unix-set [class*=hint]')].map(e => e.innerText.trim()).filter(Boolean).join(' / ')));
await page.locator('.unix-set').first().evaluate((e) => e.scrollIntoView({ block: 'center' })); await page.waitForTimeout(500);
await shot('s2-set-no-size');
const groups = page.locator('.unix-set__piece');
const n = await groups.count(); console.log('radiogroups:', n);
for (let i = 0; i < n; i++) { await groups.nth(i).locator('.unix-set__size:not(.is-out)').nth(i + 1).click(); await page.waitForTimeout(400); }
await shot('s3-set-sizes');
await page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), BTN); await page.waitForTimeout(400);
await page.locator(BTN).click(); await page.waitForTimeout(8000);
await shot('s4-set-drawer');
console.log('2 drawer:', await panel());
const inc = page.locator('.unix-cd [aria-label^="زيادة"]').first();
if (await inc.count()) { await inc.click({ timeout: 8000 }).catch((e) => console.log('inc err', String(e).slice(0, 200))); await page.waitForTimeout(7000); console.log('3 after +:', await panel()); await shot('s5-set-qty'); }
await page.goto('http://localhost:5173/yonks/cart', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(8000);
console.log('5 cart page:', (await page.locator('main').first().innerText()).replace(/\n+/g, ' | ').slice(0, 700));
await page.screenshot({ path: 'shots/flow/s7-cart-page-set.png', fullPage: true });
await browser.close();
