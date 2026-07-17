import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { publishedBlogPosts } from "../src/data/blogPosts.js";
import { legalPages } from "../src/data/legalPages.js";
import { publishedProjects } from "../src/data/projects.js";
import {
  blogPostSeo,
  legalSeo,
  projectSeo,
  seoPages,
} from "../src/data/seoPages.js";
import { site } from "../src/data/site.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(rootDir, "dist");
const defaultImage = "/logo.svg";

const entries = [
  ...Object.values(seoPages),
  ...publishedProjects.map(projectSeo),
  ...publishedBlogPosts.map(blogPostSeo),
  ...Object.entries(legalPages).map(([page, content]) => legalSeo(page, content)),
];

function absolute(value = "/") {
  return value.startsWith("http") ? value : `${site.url}${value}`;
}

function escapeAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function replaceOrInsert(html, pattern, tag) {
  return pattern.test(html)
    ? html.replace(pattern, tag)
    : html.replace("</head>", `    ${tag}\n  </head>`);
}

function renderHead(baseHtml, entry, manifest) {
  const canonical = absolute(entry.canonical || entry.path);
  const image = absolute(entry.image || defaultImage);
  const robots = entry.robots || "index, follow";
  const type = entry.type || "website";
  let html = baseHtml;

  html = replaceOrInsert(
    html,
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeAttribute(entry.title)}</title>`,
  );
  html = replaceOrInsert(
    html,
    /<meta[^>]+name=["']description["'][^>]*>/i,
    `<meta name="description" content="${escapeAttribute(entry.description)}" />`,
  );
  html = replaceOrInsert(
    html,
    /<meta[^>]+name=["']robots["'][^>]*>/i,
    `<meta name="robots" content="${escapeAttribute(robots)}" />`,
  );
  html = replaceOrInsert(
    html,
    /<link[^>]+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${escapeAttribute(canonical)}" />`,
  );

  const socialTags = [
    [/<meta[^>]+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${escapeAttribute(entry.title)}" />`],
    [/<meta[^>]+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${escapeAttribute(entry.description)}" />`],
    [/<meta[^>]+property=["']og:type["'][^>]*>/i, `<meta property="og:type" content="${escapeAttribute(type)}" />`],
    [/<meta[^>]+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${escapeAttribute(canonical)}" />`],
    [/<meta[^>]+property=["']og:image["'][^>]*>/i, `<meta property="og:image" content="${escapeAttribute(image)}" />`],
    [/<meta[^>]+name=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${escapeAttribute(entry.title)}" />`],
    [/<meta[^>]+name=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${escapeAttribute(entry.description)}" />`],
    [/<meta[^>]+name=["']twitter:image["'][^>]*>/i, `<meta name="twitter:image" content="${escapeAttribute(image)}" />`],
  ];

  for (const [pattern, tag] of socialTags) {
    html = replaceOrInsert(html, pattern, tag);
  }

  const additions = [];
  const routeManifest = manifest[entry.component];
  if (routeManifest) {
    const mainChunk = manifest["index.html"]?.file;
    const routeChunks = [entry.component, ...(routeManifest.imports || [])]
      .map((key) => manifest[key]?.file)
      .filter((file) => file && file !== mainChunk);
    for (const file of new Set(routeChunks)) {
      additions.push(`<link rel="modulepreload" href="/${file}" />`);
    }
  }
  if (entry.jsonLd) {
    const json = JSON.stringify(entry.jsonLd).replaceAll("<", "\\u003c");
    additions.push(`<script type="application/ld+json" data-static-page-jsonld>${json}</script>`);
  }
  if (additions.length > 0) {
    html = html.replace("</head>", `    ${additions.join("\n    ")}\n  </head>`);
  }

  return html;
}

async function generateSitemap() {
  const routes = entries.filter((entry) => !entry.robots?.startsWith("noindex"));
  const urls = routes
    .map((entry) => `  <url><loc>${escapeXml(absolute(entry.path))}</loc></url>`)
    .join("\n");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  await writeFile(path.join(rootDir, "public", "sitemap.xml"), sitemap);
  console.log(`Generated sitemap with ${routes.length} indexable routes.`);
}

async function generateStaticHeads() {
  const [baseHtml, manifestText] = await Promise.all([
    readFile(path.join(distDir, "index.html"), "utf8"),
    readFile(path.join(distDir, ".vite", "manifest.json"), "utf8"),
  ]);
  const manifest = JSON.parse(manifestText);

  for (const entry of entries) {
    const html = renderHead(baseHtml, entry, manifest);
    const outputPath = entry.path === "/"
      ? path.join(distDir, "index.html")
      : path.join(distDir, `${entry.path.replace(/^\//, "")}.html`);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, html);
  }

  console.log(`Generated static metadata for ${entries.length} routes.`);
}

const command = process.argv[2];
if (command === "--sitemap") {
  await generateSitemap();
} else if (command === "--heads") {
  await generateStaticHeads();
} else {
  throw new Error("Use --sitemap before Vite or --heads after Vite.");
}
