// Remaining mobile checks on the local theme: menu drawer, search, English, landscape, 404.
import { chromium, devices } from 'playwright-core';
import fs from 'node:fs';

const BASE = 'http://localhost:5173/yonks';
const OUT = 'shots/rest';
fs.mkdirSync(OUT, { recursive: true });
const log = (...a) => console.log(...a);

const browser = await chromium.launch({ channel: 'chrome', headless: true });

async function ctx(opts = {}) {
  const c = await browser.newContext({ ...devices['iPhone 14 Pro'], locale: 'ar-SA', ...opts });
  await c.addCookies([{ name: 'salla_view_as', value: '1789843788', domain: 'localhost', path: '/' }]);
  return c;
}
function watch(page, tag) {
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 200)));
  page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e).slice(0, 200)));
  return () => log(`[${tag}] console errors:`, JSON.stringify([...new Set(errors)].slice(0, 8)));
}
const small = (page) =>
  page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('a, button, [role=button], input, summary')) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
      if (r.height < 40 || r.width < 40)
        out.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 25)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
    }
    return out.slice(0, 25);
  });
const overflow = (page) => page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);

// 1 · menu drawer
{
  const c = await ctx();
  const page = await c.newPage();
  const done = watch(page, 'menu');
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(6000);
  await page.click('[data-testid="store-header-mobile-toggle"]');
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/menu-1-open.png` });
  log('[menu] drawer text:', (await page.locator('#mobile-menu').innerText().catch((e) => 'ERR ' + e)).replace(/\n+/g, ' | ').slice(0, 600));
  log('[menu] small targets:', JSON.stringify(await small(page), null, 1));
  // expand the first item with children
  const exp = page.locator('#mobile-menu [aria-expanded]').first();
  if (await exp.count()) {
    await exp.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/menu-2-expanded.png` });
  } else log('[menu] no expandable items');
  log('[menu] focus inside drawer:', await page.evaluate(() => !!document.activeElement?.closest('#mobile-menu')));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(700);
  log('[menu] after Esc aria-expanded:', await page.getAttribute('[data-testid="store-header-mobile-toggle"]', 'aria-expanded'));
  done();
  await c.close();
}

// 2 · search
{
  const c = await ctx();
  const page = await c.newPage();
  const done = watch(page, 'search');
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(6000);
  await page.click('[data-testid="store-header-search"]');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/search-1-open.png` });
  await page.keyboard.type('Sculpting', { delay: 60 });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: `${OUT}/search-2-results.png` });
  log('[search] small targets:', JSON.stringify(await small(page), null, 1));
  await page.keyboard.press('Enter');
  await page.waitForTimeout(6000);
  log('[search] url after Enter:', page.url());
  await page.screenshot({ path: `${OUT}/search-3-page.png` });
  log('[search] overflowX:', await overflow(page));
  done();
  await c.close();
}

// 3 · English
{
  const c = await ctx({ locale: 'en-US' });
  for (const [name, path] of [
    ['en-home', '/en'],
    ['en-pdp', '/en/sculpting-bra-top-vanilla/p1442810508'],
    ['en-cart', '/en/cart'],
  ]) {
    const page = await c.newPage();
    const done = watch(page, name);
    const res = await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(6000);
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 400));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);
    const info = await page.evaluate(() => {
      const arabic = /[؀-ۿ]/;
      const hits = [];
      const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = walk.nextNode())) {
        const t = n.textContent.trim();
        if (!t || !arabic.test(t)) continue;
        const el = n.parentElement;
        if (!el || el.closest('script,style,noscript')) continue;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        hits.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 30)}: ${t.slice(0, 50)}`);
      }
      const keys = [...document.body.innerText.matchAll(/\b(blocks|common|pages)\.[a-z_.]+/g)].map((m) => m[0]);
      return { dir: document.documentElement.dir, lang: document.documentElement.lang, arabic: [...new Set(hits)].slice(0, 40), keys: [...new Set(keys)] };
    });
    log(`[${name}] status=${res?.status()} dir=${info.dir} lang=${info.lang} overflowX=${await overflow(page)}`);
    log(`[${name}] arabic left (${info.arabic.length}):`, JSON.stringify(info.arabic, null, 1));
    log(`[${name}] raw keys:`, JSON.stringify(info.keys));
    await page.screenshot({ path: `${OUT}/${name}-top.png` });
    await page.screenshot({ path: `${OUT}/${name}-full.png`, fullPage: true });
    done();
    await page.close();
  }
  await c.close();
}

// 4 · landscape PDP
{
  const c = await ctx({ viewport: { width: 852, height: 393 } });
  const page = await c.newPage();
  const done = watch(page, 'landscape');
  await page.goto(BASE + '/sculpting-bra-top-vanilla/p1442810508', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(6000);
  await page.screenshot({ path: `${OUT}/land-1-top.png` });
  await page.evaluate(() => document.querySelector('.unix-pdp-buy')?.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${OUT}/land-2-buy.png` });
  log('[landscape] overflowX:', await overflow(page));
  done();
  await c.close();
}

// 5 · 404
{
  const c = await ctx();
  const page = await c.newPage();
  const done = watch(page, '404');
  const res = await page.goto(BASE + '/xyz', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(5000);
  log('[404] status:', res?.status(), 'text:', (await page.locator('main').innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 200));
  await page.screenshot({ path: `${OUT}/404.png` });
  done();
  await c.close();
}

await browser.close();
