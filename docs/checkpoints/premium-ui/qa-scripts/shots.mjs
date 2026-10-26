import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { chromium } = require("/Users/mahak/.npm/_npx/e41f203b7505f1fb/node_modules/playwright");
const [base = "https://mspixelpulse.com", out = "before"] = process.argv.slice(2);
const dir = new URL(`./shots/${out}/`, import.meta.url).pathname;
const browser = await chromium.launch();
async function ctx(width, theme, height = 900) {
  const c = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  await c.addInitScript((t) => { try { localStorage.setItem("mspixelpulse-theme", t); localStorage.setItem("mspixelpulse-analytics-consent", "denied"); } catch {} }, theme);
  return c;
}
async function go(page, path) { await page.goto(base + path, { waitUntil: "networkidle" }).catch(() => {}); await page.waitForTimeout(900); await page.evaluate(() => document.querySelector(".cookie-banner, [data-cookie-banner]")?.remove()); }
for (const theme of ["light", "dark"]) {
  const c = await ctx(1440, theme); const p = await c.newPage();
  await go(p, "/");
  await p.screenshot({ path: `${dir}header-desktop-${theme}.png`, clip: { x: 0, y: 0, width: 1440, height: 110 } });
  await p.screenshot({ path: `${dir}home-${theme}.png` });
  await go(p, "/projects");
  await p.screenshot({ path: `${dir}projects-${theme}.png` });
  const grid = await p.$(".project-catalog-grid");
  if (grid) { await grid.scrollIntoViewIfNeeded(); await p.waitForTimeout(500); const b = await grid.boundingBox(); await p.screenshot({ path: `${dir}project-cards-${theme}.png`, fullPage: true, clip: { x: b.x, y: b.y + (await p.evaluate(() => scrollY)), width: b.width, height: Math.min(b.height, 1300) } }); }
  const f = await p.$("footer.app-footer"); if (f) { await f.scrollIntoViewIfNeeded(); await p.waitForTimeout(500); await f.screenshot({ path: `${dir}footer-desktop-${theme}.png` }); }
  await c.close();
  const m = await ctx(390, theme, 844); const mp = await m.newPage();
  await go(mp, "/projects");
  await mp.screenshot({ path: `${dir}mobile-header-${theme}.png` });
  await mp.click('button[aria-controls="public-mobile-navigation"]').catch(() => {}); await mp.waitForTimeout(500);
  await mp.screenshot({ path: `${dir}mobile-menu-${theme}.png` });
  await mp.keyboard.press("Escape"); await mp.waitForTimeout(300);
  const mf = await mp.$("footer.app-footer"); if (mf) { await mf.scrollIntoViewIfNeeded(); await mp.waitForTimeout(400); await mf.screenshot({ path: `${dir}footer-mobile-${theme}.png` }); }
  await m.close();
}
await browser.close();
console.log("done", dir);
