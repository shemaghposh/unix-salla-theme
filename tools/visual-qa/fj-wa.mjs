// D160 floating WhatsApp: node fj-wa.mjs [phone|desktop]. Reads the link; never opens WhatsApp.
import { open, URLS, BASE } from './fj-lib.mjs';
const mode = process.argv[2] || 'phone';
const { page, shot, log, go, done } = await open({ mode, out: `shots/fj/wa-${mode}` });
const info = () =>
  page.evaluate(() => {
    const a = document.querySelector('a.unix-wa-fab');
    if (!a) return { fab: false };
    const r = a.getBoundingClientRect();
    const text = new URL(a.href).searchParams.get('text');
    return { fab: true, rect: `x${r.left | 0} y${r.top | 0} ${r.width | 0}x${r.height | 0}`, vw: innerWidth, vh: innerHeight, text, sticky: document.body.classList.contains('unix-sticky-atc-on') };
  });
log('home', await go(`${BASE}/`, 5000));
await page.waitForTimeout(6000);
log('home', JSON.stringify(await info()));
await shot('home');
log('pdp', await go(URLS.top, 5000));
await page.waitForTimeout(6000);
log('pdp top', JSON.stringify(await info()));
await shot('pdp-top');
if (mode === 'phone') {
  await page.mouse.wheel(0, 1400);
  await page.waitForTimeout(2500);
  log('pdp scrolled', JSON.stringify(await info()));
  await shot('pdp-sticky');
  await page.locator('header [aria-label*="سلة"], header a[href$="/cart"], header .unix-header__cart').first().click().catch((e) => log('cart icon', String(e).slice(0, 80)));
  await page.waitForTimeout(2500);
  log('drawer open', JSON.stringify(await info()));
  await shot('drawer-open');
}
await done();
