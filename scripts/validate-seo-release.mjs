import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { servicePages, servicePath } from "../src/data/servicePages.js";
import { site } from "../src/data/site.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(rootDir, "dist");
const requiredRoutes = new Set([
  "/web-design-brampton",
  "/services/ecommerce-development",
  "/services/website-seo",
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function routeFile(route) {
  return route === "/"
    ? path.join(distDir, "index.html")
    : path.join(distDir, `${route.replace(/^\//, "")}.html`);
}

function elementContent(html, element) {
  return html.match(new RegExp(`<${element}[^>]*>([\\s\\S]*?)<\\/${element}>`, "i"))?.[1]?.trim() || "";
}

function metaContent(html, name) {
  return html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"))?.[1] || "";
}

function linkHref(html, rel) {
  return html.match(new RegExp(`<link[^>]+rel=["']${rel}["'][^>]+href=["']([^"']+)["'][^>]*>`, "i"))?.[1] || "";
}

const sitemapIndex = await readFile(path.join(distDir, "sitemap.xml"), "utf8");
const sitemapFiles = [...sitemapIndex.matchAll(/<loc>https:\/\/mspixelpulse\.com\/([^<]+\.xml)<\/loc>/g)].map((match) => match[1]);
assert(sitemapFiles.length === 4, `Expected 4 focused sitemaps, found ${sitemapFiles.length}.`);

const routes = [];
for (const sitemapFile of sitemapFiles) {
  const xml = await readFile(path.join(distDir, sitemapFile), "utf8");
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert(urls.length > 0, `${sitemapFile} contains no URLs.`);
  for (const url of urls) {
    assert(url.startsWith(`${site.url}/`), `Non-canonical sitemap URL: ${url}`);
    routes.push(new URL(url).pathname);
  }
}

assert(routes.length === 131, `Expected 131 indexable routes, found ${routes.length}.`);
assert(new Set(routes).size === routes.length, "Duplicate URLs were found across sitemap files.");
for (const route of requiredRoutes) assert(routes.includes(route), `Missing required route ${route}.`);
assert(!routes.some((route) => /^\/(?:admin|client|dev|login|register|debug|api)(?:\/|$)/.test(route)), "A private route entered a sitemap.");

const titles = new Map();
const descriptions = new Map();
const headings = new Map();
const brokenLinks = [];
const missingImages = [];
let schemaBlocks = 0;

for (const route of routes) {
  const filePath = routeFile(route);
  assert(await exists(filePath), `Missing generated HTML for ${route}.`);
  const html = await readFile(filePath, "utf8");
  const title = elementContent(html, "title");
  const description = metaContent(html, "description");
  const canonical = linkHref(html, "canonical");
  const robots = metaContent(html, "robots").toLowerCase();
  const h1 = elementContent(html, "h1");
  const h1Count = [...html.matchAll(/<h1(?:\s[^>]*)?>/gi)].length;

  assert(title, `Missing title on ${route}.`);
  assert(description, `Missing description on ${route}.`);
  assert(title.length >= 25 && title.length <= 72, `Title length outside the release range on ${route}: ${title.length}`);
  assert(description.length >= 70 && description.length <= 190, `Description length outside the release range on ${route}: ${description.length}`);
  assert(canonical === `${site.url}${route}`, `Canonical mismatch on ${route}: ${canonical}`);
  assert(!robots.includes("noindex"), `Indexable route is noindex: ${route}`);
  assert(h1, `Missing crawlable H1 on ${route}.`);
  assert(h1Count === 1, `Expected one crawlable H1 on ${route}, found ${h1Count}.`);
  assert(metaContent(html, "og:title") === title, `Open Graph title mismatch on ${route}.`);
  assert(metaContent(html, "og:description") === description, `Open Graph description mismatch on ${route}.`);
  assert(metaContent(html, "og:url") === canonical, `Open Graph URL mismatch on ${route}.`);
  assert(metaContent(html, "twitter:title") === title, `Twitter title mismatch on ${route}.`);
  assert(metaContent(html, "twitter:description") === description, `Twitter description mismatch on ${route}.`);

  if (titles.has(title)) throw new Error(`Duplicate title on ${route} and ${titles.get(title)}: ${title}`);
  if (descriptions.has(description)) throw new Error(`Duplicate description on ${route} and ${descriptions.get(description)}.`);
  if (headings.has(h1)) throw new Error(`Duplicate H1 on ${route} and ${headings.get(h1)}: ${h1}`);
  titles.set(title, route);
  descriptions.set(description, route);
  headings.set(h1, route);

  for (const match of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    JSON.parse(match[1]);
    schemaBlocks += 1;
  }

  for (const match of html.matchAll(/href=["'](\/[^"']*)["']/gi)) {
    const target = match[1].split(/[?#]/)[0];
    if (!target || target === "/" || target.startsWith("//")) continue;
    if (target.startsWith("/api/")) continue;
    const targetFile = path.extname(target)
      ? path.join(distDir, target.replace(/^\//, ""))
      : routeFile(target.replace(/\/$/, ""));
    if (!(await exists(targetFile))) brokenLinks.push(`${route} -> ${target}`);
  }

  for (const match of html.matchAll(/(?:src|href)=["'](\/[^"']+\.(?:avif|gif|jpe?g|png|svg|webp))(?:[?#][^"']*)?["']/gi)) {
    const target = match[1];
    if (!(await exists(path.join(distDir, target.replace(/^\//, ""))))) missingImages.push(`${route} -> ${target}`);
  }
}

assert(schemaBlocks >= routes.length, `Expected schema coverage across routes, found ${schemaBlocks} blocks.`);
assert(brokenLinks.length === 0, `Broken internal links:\n${brokenLinks.join("\n")}`);
assert(missingImages.length === 0, `Missing local images:\n${missingImages.join("\n")}`);

const serviceIntents = new Set();
for (const service of servicePages) {
  assert(service.primaryIntent, `Missing primary search intent for ${service.slug}.`);
  assert(service.headline, `Missing service H1 for ${service.slug}.`);
  assert(!serviceIntents.has(service.primaryIntent), `Duplicate service intent: ${service.primaryIntent}`);
  serviceIntents.add(service.primaryIntent);
  assert(routes.includes(servicePath(service.slug)), `Service route missing from sitemaps: ${service.slug}`);
}

assert(!elementContent(await readFile(routeFile("/"), "utf8"), "title").startsWith("MSPixelPulse"), "Homepage title must lead with non-branded intent.");

const robots = await readFile(path.join(distDir, "robots.txt"), "utf8");
assert(robots.includes(`Sitemap: ${site.url}/sitemap.xml`), "robots.txt does not point to the canonical sitemap.");
assert(robots.includes("Disallow: /admin"), "robots.txt does not protect admin routes.");
assert(robots.includes("OAI-SearchBot"), "robots.txt is missing the OAI-SearchBot policy.");
assert(robots.includes("PerplexityBot"), "robots.txt is missing the PerplexityBot policy.");

const llms = await readFile(path.join(distDir, "llms.txt"), "utf8");
for (const route of requiredRoutes) assert(llms.includes(`${site.url}${route}`), `llms.txt is missing ${route}.`);

const vercel = JSON.parse(await readFile(path.join(rootDir, "vercel.json"), "utf8"));
assert(vercel.cleanUrls === true, "Vercel cleanUrls must remain enabled.");
assert(vercel.trailingSlash === false, "Vercel trailingSlash must enforce non-trailing canonical paths.");

console.log(`SEO validation passed: ${routes.length} unique canonical routes, ${serviceIntents.size} unique service intents, ${schemaBlocks} JSON-LD blocks, one H1 per route, 0 duplicate titles/descriptions/H1s, 0 broken internal links, 0 missing local images.`);
