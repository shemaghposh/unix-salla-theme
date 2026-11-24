// Fix round 3 · item 9: does the «سياسات» footer column shift a short desktop page when Salla's
// menu draws after hydration? Empty cart and a 404, 1280 wide. node r3-footer.mjs [width=1280] [height=800]
import { open, u, OUT_ROOT } from './b66-lib.mjs';
const width = +(process.argv[2] || 1280); const height = +(process.argv[3] || 800);
const s = await open({ mode: 'desktop', out: `${OUT_ROOT}/r3-footer` });
const { page, log, go, shot, cls, done } = s;
await page.setViewportSize({ width, height });
for (const [name, path] of [['cart', '/cart'], ['404', '/no-such-page-r3'], ['cart-en', '/cart']]) {
  const lang = name.endsWith('-en') ? 'en' : 'ar';
  await page.addInitScript(() => {
    window.__menu = [];
    const t0 = performance.now();
    const tick = () => {
      const col = document.querySelector('[data-testid="store-footer-menu1"]');
      const foot = document.querySelector('.store-footer');
      if (col) {
        const h = Math.round(col.getBoundingClientRect().height);
        const top = Math.round(foot?.getBoundingClientRect().top ?? -1);
        const last = window.__menu[window.__menu.length - 1];
        if (!last || last.h !== h || last.top !== top) window.__menu.push({ t: Math.round(performance.now() - t0), h, top, items: col.querySelectorAll('li, a').length });
      }
      if (performance.now() - t0 < 9000) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  const status = await go(u(lang, path), 9000);
  const vh = await page.evaluate(() => ({ docH: document.documentElement.scrollHeight, vh: innerHeight, footTop: Math.round(document.querySelector('.store-footer')?.getBoundingClientRect().top ?? -1) }));
  const timeline = await page.evaluate(() => window.__menu);
  log(name, 'status', status, JSON.stringify(vh));
  log(' menu column timeline', JSON.stringify(timeline));
  log(' CLS', JSON.stringify(await cls()));
  await shot(`${name}-${width}`, { fullPage: true });
}
await done();
