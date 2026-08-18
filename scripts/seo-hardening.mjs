import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { publishedBlogPosts } from "../src/data/blogPosts.js";
import { publishedProjects } from "../src/data/projects.js";
import { seoPages, blogPostSeo, projectSeo } from "../src/data/seoPages.js";
import { site } from "../src/data/site.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(rootDir, "dist");
const publicDir = path.join(rootDir, "public");

const absolute = (value = "/") => (value.startsWith("http") ? value : `${site.url}${value}`);

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeXml(value = "") {
  return escapeHtml(value).replaceAll("&#39;", "&apos;");
}

function sectionMarkup(section) {
  const paragraphs = [section.body, ...(section.paragraphs || [])]
    .filter(Boolean)
    .map((text) => `<p>${escapeHtml(text)}</p>`)
    .join("");

  const bullets = section.bullets?.length
    ? `<ul>${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : "";

  const steps = section.steps?.length
    ? `<ol>${section.steps.map((step) => `<li><strong>${escapeHtml(step.title)}</strong><p>${escapeHtml(step.body)}</p></li>`).join("")}</ol>`
    : "";

  const links = section.links?.length
    ? `<p>${section.links.map((link) => `<a href="${escapeHtml(link.to)}">${escapeHtml(link.label)}</a>`).join(" · ")}</p>`
    : "";

  return `<section><h2>${escapeHtml(section.heading)}</h2>${paragraphs}${bullets}${steps}${links}</section>`;
}

function renderBlogPostSnapshot(post) {
  const related = publishedBlogPosts
    .filter((item) => item.slug !== post.slug && item.pillar === post.pillar)
    .sort((a, b) => (a.popularRank || 99) - (b.popularRank || 99))
    .slice(0, 4);

  return `
    <div data-static-seo-fallback="blog-post" class="seo-static-shell">
      <main>
        <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/blog">Blog</a> / <span>${escapeHtml(post.title)}</span></nav>
        <article>
          <header>
            <p>${escapeHtml(post.pillar || post.category || "Website guide")}</p>
            <h1>${escapeHtml(post.title)}</h1>
            <p>${escapeHtml(post.excerpt || post.metaDescription || "")}</p>
            <p>Published ${escapeHtml(post.publishedAt || "")} · ${escapeHtml(post.readingTime || "")}</p>
          </header>
          ${(post.sections || []).map(sectionMarkup).join("")}
          ${post.resources?.length ? `<aside><h2>Trusted resources</h2><ul>${post.resources.map((resource) => `<li><a href="${escapeHtml(resource.url)}" rel="noopener noreferrer">${escapeHtml(resource.label)}</a>${resource.note ? ` — ${escapeHtml(resource.note)}` : ""}</li>`).join("")}</ul></aside>` : ""}
          ${related.length ? `<aside><h2>Related reading</h2><ul>${related.map((item) => `<li><a href="/blog/${escapeHtml(item.slug)}">${escapeHtml(item.title)}</a></li>`).join("")}</ul></aside>` : ""}
          <p><a href="/services">Explore website services</a> · <a href="/projects">View website projects</a> · <a href="/contact">Contact MSPixelPulse</a></p>
        </article>
      </main>
    </div>`;
}

function renderBlogIndexSnapshot() {
  const groups = new Map();
  for (const post of publishedBlogPosts) {
    const key = post.pillar || post.category || "Guides";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(post);
  }

  const sections = [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([group, posts]) => `<section><h2>${escapeHtml(group)}</h2><ul>${posts
      .sort((a, b) => String(b.publishedAt || "").localeCompare(String(a.publishedAt || "")))
      .map((post) => `<li><a href="/blog/${escapeHtml(post.slug)}">${escapeHtml(post.title)}</a></li>`)
      .join("")}</ul></section>`)
    .join("");

  return `
    <div data-static-seo-fallback="blog-index" class="seo-static-shell">
      <main>
        <h1>${escapeHtml(seoPages.blog.title)}</h1>
        <p>${escapeHtml(seoPages.blog.description)}</p>
        ${sections}
      </main>
    </div>`;
}

function renderProjectsSnapshot() {
  return `
    <div data-static-seo-fallback="projects-index" class="seo-static-shell">
      <main>
        <h1>${escapeHtml(seoPages.projects.title)}</h1>
        <p>${escapeHtml(seoPages.projects.description)}</p>
        <ul>${publishedProjects.map((project) => `<li><a href="/projects/${escapeHtml(project.slug)}">${escapeHtml(project.title)}</a></li>`).join("")}</ul>
      </main>
    </div>`;
}

function renderProjectSnapshot(project) {
  return `
    <div data-static-seo-fallback="project" class="seo-static-shell">
      <main>
        <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/projects">Projects</a> / <span>${escapeHtml(project.title)}</span></nav>
        <article>
          <h1>${escapeHtml(project.title)}</h1>
          <p>${escapeHtml(project.shortDescription || project.summary || "")}</p>
          <p><a href="/services">Explore services</a> · <a href="/contact">Start a project</a></p>
        </article>
      </main>
    </div>`;
}

function fallbackStyle() {
  return `<style id="seo-static-fallback-style">.seo-static-shell{max-width:1180px;margin:0 auto;padding:7rem 1.25rem 3rem;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.65}.seo-static-shell main{max-width:900px}.seo-static-shell h1{font-size:clamp(2rem,5vw,3.6rem);line-height:1.08;margin:.5rem 0 1rem}.seo-static-shell h2{font-size:1.5rem;margin:2rem 0 .65rem}.seo-static-shell a{text-decoration:underline;text-underline-offset:3px}.seo-static-shell ul,.seo-static-shell ol{padding-left:1.25rem}.seo-static-shell nav{font-size:.9rem;opacity:.78;margin-bottom:1rem}</style>`;
}

async function injectSnapshot(routePath, markup) {
  const filePath = routePath === "/"
    ? path.join(distDir, "index.html")
    : path.join(distDir, `${routePath.replace(/^\//, "")}.html`);

  let html = await readFile(filePath, "utf8");
  if (!html.includes('id="seo-static-fallback-style"')) {
    html = html.replace("</head>", `    ${fallbackStyle()}\n  </head>`);
  }
  html = html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
  await writeFile(filePath, html);
}

function sitemapUrl(entry) {
  const lastmod = entry.lastModified ? `<lastmod>${escapeXml(entry.lastModified)}</lastmod>` : "";
  return `  <url><loc>${escapeXml(absolute(entry.path))}</loc>${lastmod}</url>`;
}

function buildUrlset(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map(sitemapUrl).join("\n")}\n</urlset>\n`;
}

function buildSitemapIndex(files) {
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${files.map((file) => `  <sitemap><loc>${escapeXml(absolute(`/${file}`))}</loc><lastmod>${today}</lastmod></sitemap>`).join("\n")}\n</sitemapindex>\n`;
}

async function writeSitemapFiles() {
  const pageEntries = Object.values(seoPages).filter((entry) => !entry.robots?.startsWith("noindex"));
  const projectEntries = publishedProjects.map(projectSeo);
  const blogEntries = publishedBlogPosts.map(blogPostSeo);

  const files = {
    "sitemap-pages.xml": buildUrlset(pageEntries),
    "sitemap-projects.xml": buildUrlset(projectEntries),
    "sitemap-blog.xml": buildUrlset(blogEntries),
  };
  files["sitemap.xml"] = buildSitemapIndex(Object.keys(files));

  await Promise.all([publicDir, distDir].flatMap((dir) =>
    Object.entries(files).map(async ([name, content]) => {
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, name), content);
    }),
  ));

  console.log(`SEO hardening: wrote sitemap index plus ${Object.keys(files).length - 1} focused sitemaps.`);
}

async function prerenderDiscoverableContent() {
  await injectSnapshot("/blog", renderBlogIndexSnapshot());
  await injectSnapshot("/projects", renderProjectsSnapshot());

  for (const post of publishedBlogPosts) {
    await injectSnapshot(`/blog/${post.slug}`, renderBlogPostSnapshot(post));
  }

  for (const project of publishedProjects) {
    await injectSnapshot(`/projects/${project.slug}`, renderProjectSnapshot(project));
  }

  console.log(`SEO hardening: prerendered crawlable content for ${publishedBlogPosts.length} blog posts and ${publishedProjects.length} projects.`);
}

await writeSitemapFiles();
await prerenderDiscoverableContent();
