// Fix round 3 · item 9: what the footer menu column holds once drawn (rows vs the menu.footer() items).
import { open, u, OUT_ROOT } from './b66-lib.mjs';
const s = await open({ mode: 'desktop', out: `${OUT_ROOT}/r3-footer` });
const { page, log, go, done } = s;
await page.setViewportSize({ width: 1920, height: 1200 });
await go(u('ar', '/no-such-page-r3'), 8000);
log(JSON.stringify(await page.evaluate(async () => {
  const col = document.querySelector('[data-testid="store-footer-menu1"]');
  const rows = [...col.querySelectorAll('salla-menu :is(a, button)')].map((e) => `${e.localName}.${e.className}: ${e.textContent.trim().slice(0, 30)} h=${Math.round(e.getBoundingClientRect().height)}`);
  const content = col.querySelector('.unix-footer__content');
  const items = await window.salla?.api?.request?.('menus/footer').then((r) => (r?.data || []).length).catch((e) => 'err ' + e);
  return { rows, contentH: Math.round(content.getBoundingClientRect().height), tap: getComputedStyle(content).getPropertyValue('--tap'), apiItems: items, cookie: !!col.querySelector('[class*=cookie]') };
})));
log('menu requests from the browser:', JSON.stringify(s.reqs.filter((r) => /menus?\b|menu\//.test(r.u)).map((r) => r.u.slice(0, 120))));
log('server html reserve:', await page.evaluate(async () => { const html = await (await fetch(location.href)).text(); const m = html.match(/unix-footer__content" style="[^"]*"/); return m ? m[0] : 'none'; }));
await done();
