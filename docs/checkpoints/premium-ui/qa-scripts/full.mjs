import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { chromium } = require("/Users/mahak/.npm/_npx/e41f203b7505f1fb/node_modules/playwright");
const [base, path, theme, out, width = "1440"] = process.argv.slice(2);
const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: +width, height: 900 }, deviceScaleFactor: 0.5 });
await c.addInitScript((t) => { localStorage.setItem("mspixelpulse-theme", t); localStorage.setItem("mspixelpulse-analytics-consent", "denied"); }, theme);
const p = await c.newPage(); await p.goto(base + path, { waitUntil: "networkidle" });
const h = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < h; y += 600) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(120); }
await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(500);
await p.screenshot({ path: out, fullPage: true }); await b.close();
