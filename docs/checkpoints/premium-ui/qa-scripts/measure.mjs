import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { chromium } = require("/Users/mahak/.npm/_npx/e41f203b7505f1fb/node_modules/playwright");
const base = process.argv[2] || "https://mspixelpulse.com";
const routes = ["/", "/projects", "/about", "/services", "/pricing", "/blog", "/contact", "/faq", "/login", "/nope-404"];
const browser = await chromium.launch();
for (const width of [1440, 1280, 1024, 390]) {
  for (const theme of ["dark", "light"]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    await ctx.addInitScript((t) => { try { localStorage.setItem("mspixelpulse-theme", t); } catch {} }, theme);
    const page = await ctx.newPage();
    const rows = [];
    for (const r of routes) {
      await page.goto(base + r, { waitUntil: "networkidle" }).catch(() => {});
      await page.waitForTimeout(400);
      const m = await page.evaluate(() => {
        const s = document.querySelector(".public-header-shell");
        if (!s) return null;
        const b = s.getBoundingClientRect();
        const nav = [...s.querySelectorAll("nav a")].map(a => Math.round(a.getBoundingClientRect().left));
        const cs = getComputedStyle(s);
        return { w: Math.round(b.width * 10) / 10, h: Math.round(b.height), l: Math.round(b.left), theme: document.documentElement.dataset.theme || "light", bf: cs.backdropFilter, bg: cs.backgroundImage.slice(0, 60), nav: nav.join(","), sw: window.innerWidth - document.documentElement.clientWidth, ovf: document.documentElement.scrollWidth > window.innerWidth };
      });
      rows.push({ r, ...m });
    }
    console.log(`\n### ${width}px ${theme}`);
    for (const x of rows) console.log(x.r.padEnd(10), "w", x.w, "h", x.h, "left", x.l, "theme", x.theme, "sbar", x.sw, "overflowX", x.ovf, "nav", x.nav);
    await ctx.close();
  }
}
await browser.close();
