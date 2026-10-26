import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { chromium } = require("/Users/mahak/.npm/_npx/e41f203b7505f1fb/node_modules/playwright");
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: +process.argv[3] || 1280, height: 900 } })).newPage();
await p.goto(process.argv[2], { waitUntil: "networkidle" });
console.log(await p.evaluate(() => { const h = document.querySelector(".public-site-header"), s = document.querySelector(".public-header-shell"), c = document.querySelector(".public-main .container-edge"); const hc = getComputedStyle(h), sc = getComputedStyle(s); return JSON.stringify({ vw: innerWidth, docW: document.documentElement.clientWidth, header: [h.getBoundingClientRect().width, hc.paddingLeft, hc.paddingRight, hc.left, hc.right], shell: [s.getBoundingClientRect().width, sc.width, sc.maxWidth, sc.boxSizing], content: c && [c.getBoundingClientRect().left, c.getBoundingClientRect().width, getComputedStyle(c).paddingLeft, getComputedStyle(c).maxWidth] }); }));
await b.close();
