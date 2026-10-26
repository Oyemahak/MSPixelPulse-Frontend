import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { chromium } = require("/Users/mahak/.npm/_npx/e41f203b7505f1fb/node_modules/playwright");
const base = process.argv[2] || "https://mspixelpulse.com";
const b = await chromium.launch();
for (const theme of ["light", "dark"]) {
  const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await c.addInitScript((t) => localStorage.setItem("mspixelpulse-theme", t), theme);
  const p = await c.newPage();
  for (const [route, sels] of [["/projects", ["body", ".public-header-shell", ".public-header-shell nav a.active, .public-header-shell nav a[aria-current=page]", ".public-header-cta", ".project-filter-bar", ".project-type-switch button.is-active", ".project-filter-control select", ".project-search-field input", ".project-catalog-card", ".btn-card", ".project-live-site", ".app-footer", ".social-contact-link--linkedin", ".agency-footer-column h2", ".social-contact-links--list .social-contact-link", "h1", ".project-catalog-title", ".project-catalog-summary"]], ["/", ["section:nth-of-type(2)", ".btn-outline, .btn-secondary", ".home-service-card"]]]) {
    await p.goto(base + route, { waitUntil: "networkidle" }); await p.waitForTimeout(500);
    const out = await p.evaluate((sels) => sels.map(s => { const e = document.querySelector(s); if (!e) return `${s}: (none)`; const c = getComputedStyle(e); const r = e.getBoundingClientRect(); return `${s}: font=${c.fontFamily.split(",")[0]} ${c.fontSize}/${c.fontWeight} color=${c.color} bg=${c.backgroundColor} bgi=${c.backgroundImage.slice(0,90)} border=${c.borderTopWidth} ${c.borderTopColor} radius=${c.borderRadius} shadow=${c.boxShadow.slice(0,80)} bf=${c.backdropFilter} size=${Math.round(r.width)}x${Math.round(r.height)}`; }), sels);
    console.log(`\n## ${theme} ${route}\n` + out.join("\n"));
  }
  await c.close();
}
await b.close();
