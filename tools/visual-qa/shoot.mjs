// Mobile screenshots of a list of pages: node shoot.mjs <pages.json> <outDir>
// pages.json: [{ name, url, full?: boolean }]
import { chromium, devices } from 'playwright-core';
import fs from 'node:fs';

const [, , pagesFile, outDir] = process.argv;
const pages = JSON.parse(fs.readFileSync(pagesFile, 'utf8'));
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({
  ...devices['iPhone 14 Pro'],
  locale: 'ar-SA',
});
// Local preview: the "view as merchant" permission
await context.addCookies([
  { name: 'salla_view_as', value: '1789843788', domain: 'localhost', path: '/' },
]);

const report = [];
for (const p of pages) {
  const page = await context.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 300)));
  page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e).slice(0, 300)));
  const row = { name: p.name, url: p.url };
  try {
    const res = await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    row.status = res?.status();
    await page.waitForTimeout(p.wait ?? 6000);
    // Lazy sections: scroll through the page once, then back to the top.
    await page.evaluate(async () => {
      // Slow enough for every render-when-visible block to mount (twice: late blocks grow the page).
      for (let pass = 0; pass < 2; pass++) {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 300) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 450));
        }
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1500);
    row.height = await page.evaluate(() => document.documentElement.scrollHeight);
    row.overflowX = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1
    );
    row.title = await page.title();
    await page.screenshot({ path: `${outDir}/${p.name}-top.png` });
    // Viewport tiles (a full-page capture leaves reveal-on-scroll sections blank); stitched by stitch.py.
    const vh = await page.evaluate(() => window.innerHeight);
    let tile = 0;
    for (let y = 0; y < row.height; y += vh) {
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await page.waitForTimeout(900);
      row.lastY = await page.evaluate(() => window.scrollY);
      await page.screenshot({ path: `${outDir}/${p.name}-t${String(tile++).padStart(2, '0')}.png` });
    }
    row.tiles = tile; row.vh = vh;
  } catch (e) {
    row.error = String(e).slice(0, 300);
  }
  row.consoleErrors = [...new Set(errors)].slice(0, 12);
  report.push(row);
  await page.close();
}
fs.writeFileSync(`${outDir}/report.json`, JSON.stringify(report, null, 2));
console.log(report.map((r) => `${r.name} ${r.status ?? r.error} h=${r.height} overflowX=${r.overflowX} errors=${r.consoleErrors.length}`).join('\n'));
await browser.close();
