// Fix round 3 · item 9: the phone footer accordions are unchanged (closed, open on tap).
import { open, u, OUT_ROOT } from './b66-lib.mjs';
const s = await open({ out: `${OUT_ROOT}/r3-footer` });
const { page, log, go, shot, done } = s;
await go(u('ar', '/no-such-page-r3'), 7000);
const h = () => page.evaluate(() => Math.round(document.querySelector('[data-testid="store-footer-menu1"]').getBoundingClientRect().height));
log('closed', await h());
await page.locator('[data-testid="store-footer-menu1"] summary').click();
await page.waitForTimeout(800);
log('open', await h());
await page.locator('[data-testid="store-footer-menu1"]').scrollIntoViewIfNeeded();
await shot('phone-footer-open');
await page.locator('[data-testid="store-footer-menu1"] summary').click();
await page.waitForTimeout(800);
log('closed again', await h());
await done();
