import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tmp = path.join("/tmp", "mspixelpulse-visual-assets");
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const cwebpPath = "/opt/homebrew/bin/cwebp";
const port = 9331;

const projects = [
  ["canstem-education", "https://canstemeducation.com/"],
  ["aimze-studio", "https://www.aimzestudio.com/"],
  ["bloom-by-maryam-flower-boutique", "https://ms-flower-boutique-demo.vercel.app"],
  ["stephy-pet-grooming-studio", "https://mspixelpulse-demo-pet-grooming-stud.vercel.app"],
  ["northstar-home-services", "https://mspixelpulse-demo-home-services.vercel.app"],
  ["ms-pixelpulse-realty-group", "https://mspixelpulse-demo-real-estate-agent.vercel.app"],
  ["ms-pixelpulse-wellness-studio", "https://mspixelpulse-demo-wellness-studio.vercel.app"],
  ["brightpath-autism-child-development", "https://mspixelpulse-demo-autism-child-deve.vercel.app"],
];

const fallbackProject = "dazzling-smile-dental";

const blogCovers = [
  ["small-business-website-cost-canada", "Website Cost", "pricing cards", "Canada planning", ["Estimate", "Scope", "Launch"]],
  ["wordpress-vs-react", "WordPress vs React", "platform decision", "content or custom", ["Edit", "Build", "Maintain"]],
  ["small-business-website-features", "10 Website Features", "checklist modules", "small business UX", ["Trust", "Contact", "Mobile"]],
  ["website-redesign-checklist", "Redesign Checklist", "before and after", "launch without surprises", ["Audit", "Redirect", "QA"]],
  ["website-trust-local-business", "Local Trust", "proof and contact", "professional website signals", ["Proof", "Security", "Clarity"]],
  ["industry-website-features", "Service Business Features", "booking and services", "salon dental local service", ["Book", "Services", "Contact"]],
  ["mobile-friendly-web-design", "Mobile Friendly Design", "responsive screens", "phone first experience", ["390px", "Tablet", "Desktop"]],
  ["website-maintenance-guide", "Website Maintenance", "updates dashboard", "backup security support", ["Update", "Backup", "Monitor"]],
];

async function ensureDirs() {
  await fs.rm(tmp, { recursive: true, force: true });
  await fs.mkdir(tmp, { recursive: true });
  await fs.mkdir(path.join(root, "public/projects/mockups"), { recursive: true });
  await fs.mkdir(path.join(root, "public/blog"), { recursive: true });
}

async function waitForChrome() {
  for (let i = 0; i < 80; i += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  throw new Error("Chrome did not start");
}

function launchChrome() {
  return spawn(chromePath, [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${path.join(tmp, "chrome-profile")}`,
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-dev-shm-usage",
    "--ignore-certificate-errors",
    "about:blank",
  ], { stdio: "ignore" });
}

async function withTab(fn) {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
  const page = await response.json();
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });
  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result || {});
    }
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    id += 1;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });

  try {
    await send("Page.enable");
    await send("Runtime.enable");
    await fn(send);
  } finally {
    ws.close();
    await fetch(`http://127.0.0.1:${port}/json/close/${page.id}`).catch(() => {});
  }
}

async function waitForReady(send) {
  for (let i = 0; i < 80; i += 1) {
    const result = await send("Runtime.evaluate", {
      expression: "document.readyState === 'complete' && document.body && document.body.scrollHeight > 100",
      returnByValue: true,
    });
    if (result.result?.value) return;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
}

async function capture(url, output, viewport, mobile = false) {
  await withTab(async (send) => {
    await send("Emulation.setDeviceMetricsOverride", {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile,
      screenWidth: viewport.width,
      screenHeight: viewport.height,
    });
    await send("Page.navigate", { url });
    await waitForReady(send);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    await send("Runtime.evaluate", { expression: "window.scrollTo(0, 0)" });
    const screenshot = await send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: false,
    });
    await fs.writeFile(output, Buffer.from(screenshot.data, "base64"));
  });
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

async function renderHtml(html, outputPng, viewport = { width: 1200, height: 750 }) {
  const htmlPath = path.join(tmp, `render-${Date.now()}-${Math.random().toString(16).slice(2)}.html`);
  await fs.writeFile(htmlPath, html);
  await capture(`file://${htmlPath}`, outputPng, viewport, false);
}

async function toWebp(inputPng, outputWebp, quality = 82) {
  await execFileAsync(cwebpPath, ["-quiet", "-q", String(quality), inputPng, "-o", outputWebp]);
}

async function projectMockup(slug, desktop, mobile, output) {
  const bg = slug.includes("canstem") ? "#f8fbff" : slug.includes("aimze") ? "#fff8fb" : slug.includes("brightpath") ? "#f7fcff" : "#f7f8ff";
  const html = `<!doctype html><html><head><meta charset="utf-8"/><style>
    *{box-sizing:border-box} body{margin:0;width:1200px;height:750px;display:grid;place-items:center;background:
    radial-gradient(circle at 84% 14%, rgba(98,71,255,.22), transparent 26%),
    radial-gradient(circle at 20% 84%, rgba(37,99,255,.18), transparent 30%),${bg};font-family:Inter,ui-sans-serif,system-ui,sans-serif;color:#111827}
    .scene{position:relative;width:1080px;height:650px;border-radius:34px;background:linear-gradient(135deg,rgba(255,255,255,.92),rgba(245,247,255,.82));border:1px solid rgba(99,102,241,.12);box-shadow:0 32px 90px rgba(15,23,42,.18);overflow:hidden;padding:52px}
    .grid{position:absolute;inset:0;background-image:linear-gradient(rgba(37,99,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,255,.06) 1px,transparent 1px);background-size:42px 42px;mask-image:linear-gradient(180deg,#000,transparent 86%);opacity:.55}
    .desktop{position:absolute;left:54px;top:76px;width:820px;height:512px;border-radius:24px;background:#101828;border:1px solid rgba(15,23,42,.18);box-shadow:0 26px 70px rgba(15,23,42,.28);overflow:hidden}
    .bar{height:38px;background:linear-gradient(180deg,#fff,#f2f5fb);display:flex;align-items:center;gap:8px;padding:0 16px;border-bottom:1px solid #dde3ef}
    .dot{width:10px;height:10px;border-radius:999px}.r{background:#ff6b6b}.y{background:#ffd166}.g{background:#3ddc97}.url{margin-left:10px;height:16px;width:250px;border-radius:999px;background:#e8edf6}
    .desktop img{width:100%;height:474px;object-fit:cover;object-position:top center;display:block}
    .phone{position:absolute;right:64px;bottom:46px;width:236px;height:482px;border-radius:42px;background:#0b1020;border:10px solid #0b1020;box-shadow:0 26px 70px rgba(15,23,42,.34),0 0 0 1px rgba(255,255,255,.12);overflow:hidden}
    .phone:before{content:"";position:absolute;z-index:2;top:10px;left:50%;width:76px;height:18px;transform:translateX(-50%);border-radius:999px;background:#0b1020}
    .phone img{width:100%;height:100%;object-fit:cover;object-position:top center;display:block;border-radius:31px}
    .chip{position:absolute;left:76px;bottom:38px;padding:10px 14px;border-radius:999px;background:rgba(255,255,255,.78);border:1px solid rgba(148,163,184,.28);font-size:13px;font-weight:800;color:#334155;box-shadow:0 12px 30px rgba(15,23,42,.1)}
  </style></head><body><div class="scene"><div class="grid"></div><div class="desktop"><div class="bar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><span class="url"></span></div><img src="file://${desktop}" alt=""></div><div class="phone"><img src="file://${mobile}" alt=""></div><div class="chip">Desktop + real mobile capture</div></div></body></html>`;
  const png = path.join(tmp, `${slug}-mockup.png`);
  await renderHtml(html, png);
  await toWebp(png, output);
}

async function fallbackMockup(output) {
  const html = `<!doctype html><html><head><meta charset="utf-8"/><style>
    *{box-sizing:border-box}body{margin:0;width:1200px;height:750px;display:grid;place-items:center;background:radial-gradient(circle at 84% 14%,rgba(98,71,255,.24),transparent 28%),#f7f8ff;font-family:Inter,ui-sans-serif,system-ui,sans-serif}
    .scene{position:relative;width:1080px;height:650px;border-radius:34px;background:#fff;border:1px solid #dbe4f0;box-shadow:0 32px 90px rgba(15,23,42,.16);overflow:hidden;padding:58px}
    .desktop{position:absolute;left:78px;top:104px;width:760px;height:440px;border-radius:24px;background:#111827;box-shadow:0 24px 70px rgba(15,23,42,.28);padding:42px}
    .hero{height:118px;border-radius:22px;background:linear-gradient(120deg,#5227ff,#2563ff)}.lines{margin-top:32px;display:grid;gap:16px}.line{height:22px;border-radius:999px;background:#dbe4f0}.line:nth-child(1){width:84%}.line:nth-child(2){width:64%}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:34px}.card{height:88px;border-radius:20px;background:#eef4ff}
    .phone{position:absolute;right:76px;bottom:58px;width:230px;height:468px;border-radius:42px;background:#0b1020;border:10px solid #0b1020;box-shadow:0 26px 70px rgba(15,23,42,.34);padding:28px 18px}.phone .hero{height:92px;border-radius:24px}.phone .line{height:16px}.phone .cards{grid-template-columns:1fr;gap:10px;margin-top:22px}.phone .card{height:58px}
    .note{position:absolute;left:78px;bottom:46px;font-size:13px;font-weight:800;color:#475569;background:#f8fafc;border:1px solid #dbe4f0;border-radius:999px;padding:10px 14px}
  </style></head><body><div class="scene"><div class="desktop"><div class="hero"></div><div class="lines"><div class="line"></div><div class="line"></div></div><div class="cards"><div class="card"></div><div class="card"></div><div class="card"></div></div></div><div class="phone"><div class="hero"></div><div class="lines"><div class="line"></div><div class="line"></div></div><div class="cards"><div class="card"></div><div class="card"></div></div></div><div class="note">Fallback preview while public link is unavailable</div></div></body></html>`;
  const png = path.join(tmp, `${fallbackProject}-mockup.png`);
  await renderHtml(html, png);
  await toWebp(png, output);
}

async function blogCover(slug, title, kicker, subtitle, chips) {
  const html = `<!doctype html><html><head><meta charset="utf-8"/><style>
    *{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#f8fbff;font-family:Inter,ui-sans-serif,system-ui,sans-serif;display:grid;place-items:center;color:#0f172a}
    .cover{position:relative;width:1120px;height:570px;overflow:hidden;border-radius:34px;background:radial-gradient(circle at 78% 14%,rgba(82,39,255,.2),transparent 30%),radial-gradient(circle at 16% 86%,rgba(37,99,255,.18),transparent 34%),linear-gradient(135deg,#fff,#f1f6ff);border:1px solid rgba(148,163,184,.22);box-shadow:0 30px 90px rgba(15,23,42,.14);padding:54px}
    .mark{font-size:13px;font-weight:900;letter-spacing:.24em;text-transform:uppercase;color:#2563ff}.title{margin-top:18px;width:470px;font-size:56px;line-height:.98;font-weight:950;letter-spacing:0}.sub{margin-top:22px;width:420px;font-size:20px;line-height:1.45;color:#475569;font-weight:650}
    .panel{position:absolute;right:62px;top:64px;width:440px;height:332px;border-radius:30px;background:rgba(255,255,255,.86);border:1px solid rgba(148,163,184,.28);box-shadow:0 24px 70px rgba(37,99,255,.12);padding:24px}
    .browser{height:34px;border-bottom:1px solid #dbe4f0;display:flex;gap:8px}.dot{width:10px;height:10px;border-radius:999px;background:#cbd5e1}.ui{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:20px}.tile{height:92px;border-radius:20px;background:#eef4ff;border:1px solid #dbeafe;padding:16px}.tile:nth-child(2){background:#111827}.tile:nth-child(3){background:#f2eafe}.tile:nth-child(4){background:#eafcf4}.line{height:10px;border-radius:999px;background:#94a3b8;margin-top:12px}.tile:nth-child(2) .line{background:#94a3b8}.icon{width:34px;height:34px;border-radius:12px;background:linear-gradient(135deg,#2563ff,#7c3aed)}
    .phone{position:absolute;right:326px;bottom:42px;width:142px;height:260px;border-radius:30px;background:#0b1020;border:7px solid #0b1020;box-shadow:0 22px 46px rgba(15,23,42,.22);padding:22px 12px}.screen{height:100%;border-radius:21px;background:linear-gradient(180deg,#f8fbff,#eaf0ff);padding:16px}.screen .mini{height:42px;border-radius:14px;background:#2563ff}.screen .mini-line{height:9px;border-radius:999px;background:#94a3b8;margin-top:12px}
    .chips{position:absolute;left:54px;bottom:50px;display:flex;gap:10px}.chip{border-radius:999px;background:#fff;border:1px solid #dbe4f0;color:#334155;font-size:13px;font-weight:850;padding:10px 14px}
  </style></head><body><div class="cover"><div class="mark">MSPixelPulse guide</div><div class="title">${esc(title)}</div><div class="sub">${esc(kicker)} · ${esc(subtitle)}</div><div class="panel"><div class="browser"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div><div class="ui"><div class="tile"><div class="icon"></div><div class="line"></div><div class="line" style="width:70%"></div></div><div class="tile"><div class="icon"></div><div class="line"></div><div class="line" style="width:70%"></div></div><div class="tile"><div class="icon"></div><div class="line"></div><div class="line" style="width:70%"></div></div><div class="tile"><div class="icon"></div><div class="line"></div><div class="line" style="width:70%"></div></div></div></div><div class="phone"><div class="screen"><div class="mini"></div><div class="mini-line"></div><div class="mini-line" style="width:76%"></div><div class="mini-line" style="width:58%"></div></div></div><div class="chips">${chips.map((chip) => `<span class="chip">${esc(chip)}</span>`).join("")}</div></div></body></html>`;
  const png = path.join(tmp, `${slug}.png`);
  await renderHtml(html, png, { width: 1200, height: 630 });
  await toWebp(png, path.join(root, "public/blog", `${slug}.webp`), 84);
}

await ensureDirs();
if (!existsSync(chromePath)) throw new Error(`Chrome not found at ${chromePath}`);
if (!existsSync(cwebpPath)) throw new Error(`cwebp not found at ${cwebpPath}`);

const chrome = launchChrome();
try {
  await waitForChrome();
  for (const [slug, url] of projects) {
    const desktop = path.join(tmp, `${slug}-desktop.png`);
    const mobile = path.join(tmp, `${slug}-mobile.png`);
    await capture(url, desktop, { width: 1440, height: 900 }, false);
    await capture(url, mobile, { width: 390, height: 844 }, true);
    await projectMockup(slug, desktop, mobile, path.join(root, "public/projects/mockups", `${slug}.webp`));
    console.log(`mockup ${slug}`);
  }
  await fallbackMockup(path.join(root, "public/projects/mockups", `${fallbackProject}.webp`));
  console.log(`mockup ${fallbackProject} fallback`);
  for (const cover of blogCovers) {
    await blogCover(...cover);
    console.log(`cover ${cover[0]}`);
  }
} finally {
  chrome.kill();
}
