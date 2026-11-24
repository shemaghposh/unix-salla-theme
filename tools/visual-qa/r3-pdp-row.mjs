// Fix round 3 · item 1: the product page still reserves its buy row (2 rows, 3 from lg).
import { open, u, P, OUT_ROOT } from './b66-lib.mjs';
const width = +(process.argv[2] || 1280);
const s = await open({ mode: width < 768 ? 'phone' : 'desktop', out: `${OUT_ROOT}/r3-qv-row` });
const { page, log, go, done, center, shot } = s;
if (width >= 768) await page.setViewportSize({ width, height: 900 });
await go(u('ar', P.leggings), 2500);
const m = () => page.evaluate(() => { const r = document.querySelector('.unix-pdp-buy'); const c = getComputedStyle(r); return { cls: r.className, h: Math.round(r.getBoundingClientRect().height), minH: c.minBlockSize, adding: r.getAttribute('data-unix-adding') }; });
log('first', JSON.stringify(await m()));
await center('.unix-pdp-buy'); await page.waitForTimeout(6000);
log('settled', JSON.stringify(await m()));
await shot(`pdp-row-${width}`);
await done();
