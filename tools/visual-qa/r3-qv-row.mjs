// Fix round 3 · item 1: the quick-view sheet's buy row at a desktop width (does it reserve 3 rows?).
// node r3-qv-row.mjs [width=1280] [card=0]
import { open, u, OUT_ROOT } from './b66-lib.mjs';
const width = +(process.argv[2] || 1280); const card = +(process.argv[3] || 0);
const s = await open({ mode: 'desktop', out: `${OUT_ROOT}/r3-qv-row` });
const { page, log, go, shot, done } = s;
await page.setViewportSize({ width, height: 800 });
await go(u('ar', '/ملابس-رياضية/c310620479'), 7000);
const bag = page.locator('button.unix-card__options-link').nth(card);
log('bags', await page.locator('button.unix-card__options-link').count());
await bag.evaluate((e) => e.scrollIntoView({ block: 'center' })); await page.waitForTimeout(600);
await bag.evaluate((e) => e.click());
const measure = () => page.evaluate(() => {
  const row = document.querySelector('.unix-qv .unix-pdp-buy');
  if (!row) return { row: false };
  const cs = getComputedStyle(row);
  const kids = [...row.querySelectorAll('salla-quantity-input, salla-add-product-button, .s-add-product-button-main, salla-mini-checkout-widget, .unix-pdp-buy__fallback, salla-quick-buy')]
    .map((e) => { const r = e.getBoundingClientRect(); return `${e.localName || e.className}:${Math.round(r.top)}+${Math.round(r.height)}`; });
  const r = row.getBoundingClientRect();
  const last = [...row.querySelectorAll('*')].reduce((m, e) => { const b = e.getBoundingClientRect(); return b.height ? Math.max(m, b.bottom) : m; }, r.top);
  return { cls: row.className, h: Math.round(r.height), minH: cs.minBlockSize, contentBottom: Math.round(last - r.top), sheetW: Math.round(document.querySelector('.unix-qv')?.getBoundingClientRect().width || 0), kids };
});
for (const t of [1500, 4000, 8000]) { await page.waitForTimeout(t === 1500 ? 1500 : t - (t === 4000 ? 1500 : 4000)); log(`+${t}ms`, JSON.stringify(await measure())); }
await shot(`sheet-${width}`);
log('natural', JSON.stringify(await page.evaluate(() => { const row = document.querySelector('.unix-qv .unix-pdp-buy'); if (!row) return null; const was = row.getBoundingClientRect().height; row.style.minBlockSize = '0px'; const h = row.getBoundingClientRect().height; const top = row.getBoundingClientRect().top; const parts = [...row.querySelectorAll('*')].filter((e) => { const b = e.getBoundingClientRect(); return b.height > 20 && e.children.length < 4; }).slice(0, 14).map((e) => { const b = e.getBoundingClientRect(); return `${e.localName}.${String(e.className).slice(0,30)}:${Math.round(b.top - top)}+${Math.round(b.height)}`; }); const odd = [row, ...row.querySelectorAll('*')].map((e) => { const c = getComputedStyle(e); const b = e.getBoundingClientRect(); return [e, c, b]; }).filter(([e, c, b]) => (c.marginBlockStart !== '0px' || c.marginBlockEnd !== '0px' || c.paddingBlockStart !== '0px' || c.paddingBlockEnd !== '0px' || (b.height > 100))).slice(0, 12).map(([e, c, b]) => `${e.localName}.${String(e.className).slice(0,40)} d=${c.display} m=${c.marginBlockStart}/${c.marginBlockEnd} p=${c.paddingBlockStart}/${c.paddingBlockEnd} top=${Math.round(b.top - top)} h=${Math.round(b.height)}`); const btnH = getComputedStyle(row).getPropertyValue('--btn-h'); row.style.minBlockSize = ''; return { reserved: Math.round(was), natural: Math.round(h), btnH, parts, odd }; })));
await done();
