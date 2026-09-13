import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { publishedBlogPosts } from "../src/data/blogPosts.js";
import { faqSeo, locationSeoEntries, serviceSeoEntries } from "../src/data/discoverabilitySeo.js";
import { faqGroups } from "../src/data/faqs.js";
import { locationPages } from "../src/data/locationPages.js";
import { pricingFaqs, pricingPlans } from "../src/data/plans.js";
import { publishedProjects } from "../src/data/projects.js";
import { servicePages, servicePath, servicePathForLabel } from "../src/data/servicePages.js";
import {
  blogPostSeo,
  projectSeo,
  seoPages,
} from "../src/data/seoPages.js";
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

function staticShell(kind, content) {
  return `<div data-static-seo-fallback="${escapeHtml(kind)}" class="seo-static-shell"><main>${content}</main></div>`;
}

function renderHomeSnapshot() {
  return staticShell("home", `
    <header><p>Website agency serving Brampton and the GTA</p><h1>MSPixelPulse builds clearer websites for local businesses.</h1><p>Custom website design, WordPress, React, e-commerce, UX/UI, SEO foundations, school website, and Moodle LMS solutions for businesses in Brampton, Toronto, the GTA, and across Canada.</p><p><a href="/contact">Start a project</a> · <a href="/projects">View website projects</a> · <a href="/web-design-brampton">Web design for Brampton businesses</a></p></header>
    <section><h2>Website services</h2><ul>${servicePages.map((service) => `<li><a href="${servicePath(service.slug)}">${escapeHtml(service.name)}</a> — ${escapeHtml(service.summary)}</li>`).join("")}</ul></section>
    <section><h2>How MSPixelPulse works</h2><p>Projects begin with the audience, service, content, required actions, and technical boundaries. The agreed solution is designed responsively, built with reusable components or templates, and checked before launch.</p></section>
    <p><a href="/about">About MSPixelPulse</a> · <a href="/faq">Website development FAQs</a> · <a href="/pricing">Website pricing</a></p>
  `);
}

function renderAboutSnapshot() {
  return staticShell("about", `
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <span>About MSPixelPulse</span></nav>
    <article><h1>A Toronto web studio built around clear, useful customer journeys.</h1><p>MSPixelPulse helps small businesses turn scattered service details into responsive websites that explain what they offer, build trust, and make the next step easy.</p>
    <section><h2>Founder and design lead</h2><p>Mahak Patel leads MSPixelPulse with a focus on honest project scoping, clean UX, accessible interfaces, and websites owners can understand after launch.</p></section>
    <section><h2>How the studio works</h2><ul><li>Clear website structure before decoration</li><li>Responsive layouts that work on real phones</li><li>Flexible technology choices for the project need</li><li>Accessible forms, navigation, contrast, and content</li><li>Straightforward communication during launch and maintenance</li></ul></section>
    <p><a href="/services">Explore services</a> · <a href="/projects">Review projects</a> · <a href="/contact">Contact MSPixelPulse</a></p></article>
  `);
}

function renderServicesSnapshot() {
  return staticShell("services", `
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <span>Services</span></nav>
    <header><h1>Web design and development that supports a real business.</h1><p>Web design for Brampton, Toronto, and Canadian businesses, including WordPress, React, e-commerce, SEO, UX/UI, redesigns, maintenance, school websites, Moodle LMS work, and custom interfaces.</p><p><a href="/web-design-brampton">Explore web design for Brampton businesses</a></p></header>
    <section><h2>Dedicated service pages</h2>${servicePages.map((service) => `<article><h3><a href="${servicePath(service.slug)}">${escapeHtml(service.name)}</a></h3><p>${escapeHtml(service.summary)}</p></article>`).join("")}</section>
    <p><a href="/projects">View related projects</a> · <a href="/faq">Read service FAQs</a> · <a href="/contact">Discuss a project</a></p>
  `);
}

function renderLocationSnapshot(location) {
  return staticShell("location", `
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <span>${escapeHtml(location.name)}</span></nav>
    <article><header><p>${escapeHtml(location.eyebrow)}</p><h1>${escapeHtml(location.title)}</h1><p>${escapeHtml(location.summary)}</p><p>${escapeHtml(location.intro)}</p></header>
    <aside><h2>Service-area transparency</h2><p>MSPixelPulse serves Brampton businesses remotely and across the GTA. This page describes a service area; it does not represent a Brampton storefront.</p></aside>
    <section><h2>What a Brampton business website needs to do well</h2><ul>${location.needs.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
    <section><h2>Website services for Brampton businesses</h2>${location.services.map((service) => `<article><h3><a href="${servicePath(service.slug)}">${escapeHtml(service.title)}</a></h3><p>${escapeHtml(service.body)}</p></article>`).join("")}</section>
    <section><h2>A practical website process</h2><ol>${location.process.map((step) => `<li><strong>${escapeHtml(step.title)}</strong><p>${escapeHtml(step.body)}</p></li>`).join("")}</ol></section>
    <section><h2>Brampton website questions</h2>${location.faq.map((item) => `<h3>${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p>`).join("")}</section>
    <p><a href="/services">Explore all services</a> · <a href="/projects">Review projects</a> · <a href="/contact?location=Brampton">Discuss a Brampton website</a></p></article>
  `);
}

function renderServiceSnapshot(service) {
  return staticShell("service", `
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/services">Services</a> / <span>${escapeHtml(service.name)}</span></nav>
    <article><header><h1>${escapeHtml(service.name)} for clear, dependable digital experiences.</h1><p>${escapeHtml(service.summary)}</p><p>${escapeHtml(service.intro)}</p></header>
    <section><h2>Who this service is for</h2><ul>${service.audience.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
    <section><h2>Problems this work can address</h2><ul>${service.problems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
    <section><h2>What an agreed project can include</h2><ul>${service.deliverables.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
    <section><h2>A practical project process</h2><ol>${service.process.map((step) => `<li><strong>${escapeHtml(step.title)}</strong><p>${escapeHtml(step.body)}</p></li>`).join("")}</ol></section>
    <section><h2>Frequently asked questions</h2>${service.faq.map((item) => `<h3>${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p>`).join("")}</section>
    <p><a href="/blog/${escapeHtml(service.guideSlug)}">Read the related guide</a> · <a href="/projects">View related projects</a> · <a href="/contact?service=${encodeURIComponent(service.name)}">Discuss ${escapeHtml(service.shortName.toLowerCase())}</a></p></article>
  `);
}

function renderPricingSnapshot() {
  const cad = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
  const priceLine = (plan) => [plan.pricePrefix, cad.format(plan.price), plan.priceSuffix].filter(Boolean).join(" ");
  return staticShell("pricing", `
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <span>Website pricing</span></nav>
    <header><h1>Website Pricing Made Simple</h1><p>Choose a starting package or build your own custom website plan. Every final scope is reviewed and confirmed in writing before work begins.</p><p><a href="#plan-builder">Build My Plan</a> · <a href="/contact">Talk to MSPixelPulse</a></p></header>
    <section><h2>Website plans and specialized services</h2>${pricingPlans.map((plan) => `<article><h3>${escapeHtml(plan.name)}</h3><p><strong>${escapeHtml(priceLine(plan))}</strong>. ${escapeHtml(plan.summary)}</p>${plan.bestFor ? `<p><strong>Best for:</strong> ${escapeHtml(plan.bestFor)}</p>` : ""}${plan.boundary ? `<p>${escapeHtml(plan.boundary)}</p>` : ""}</article>`).join("")}</section>
    <section id="plan-builder"><h2>Build a practical website plan</h2><p>The four-step pricing builder helps visitors choose a service, page count, real add-ons, and a transparent estimate before carrying the summary into the contact form.</p><ol><li>Choose a service type</li><li>Select a page count</li><li>Add optional project work</li><li>Review the estimate and request a written quote</li></ol><p><a href="/contact?inquiry=builder">Start a website quote request</a></p></section>
    <section><h2>What affects website pricing?</h2><p>Page count, content readiness, custom design, products, integrations, user roles, migration, accessibility requirements, and launch support can change the final scope.</p><p><a href="/services/website-redesign">Website redesign</a> · <a href="/services/wordpress-development">WordPress development</a> · <a href="/services/ecommerce-development">E-commerce development</a> · <a href="/services/moodle-lms-development">Moodle LMS development</a> · <a href="/services/website-maintenance">Website maintenance</a></p></section>
    <section><h2>Website pricing questions</h2>${pricingFaqs.map((item) => `<h3>${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p>`).join("")}</section>
    <section><h2>Your written quote confirms the complete scope</h2><p>All prices are in CAD and exclude applicable tax unless stated otherwise. Hosting, domains, paid tools, subscriptions, and third-party fees are separate unless specifically included. Maintenance is billed only for approved time.</p></section>
    <p><a href="/services">Compare services</a> · <a href="/projects">Review website projects</a> · <a href="/contact">Request a quote</a></p>
  `);
}

function renderContactSnapshot() {
  return staticShell("contact", `
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <span>Contact</span></nav>
    <header><h1>Tell us about your project</h1><p>Share the essentials and MSPixelPulse will recommend a clear next step. Optional details can be added now or discussed in the reply.</p></header>
    <section><h2>Useful details to share</h2><ul><li>What the business or organization does</li><li>The current website when available</li><li>The main customer, learner, or staff action the project should support</li><li>Known content, platform, timing, or integration needs</li></ul></section>
    <section><h2>Public contact information</h2><p>Email <a href="mailto:${escapeHtml(site.email)}">${escapeHtml(site.email)}</a> or use the website inquiry form.</p></section>
    <p><a href="/services">Explore services</a> · <a href="/pricing">Review pricing</a> · <a href="/faq">Read common questions</a></p>
  `);
}

function renderFaqSnapshot() {
  return staticShell("faq", `
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <span>Frequently asked questions</span></nav>
    <header><h1>Straight answers about websites, platforms, pricing, and support.</h1><p>Factual answers about what MSPixelPulse does, who the agency works with, and how website or learning-platform work is scoped.</p></header>
    ${faqGroups.map((group) => `<section><h2>${escapeHtml(group.category)}</h2>${group.items.map((item) => `<h3>${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p>`).join("")}</section>`).join("")}
    <p><a href="/services">Explore services</a> · <a href="/pricing">Review pricing</a> · <a href="/contact">Ask MSPixelPulse</a></p>
  `);
}

function renderBlogPostSnapshot(post) {
  const related = publishedBlogPosts.filter((item) => item.slug !== post.slug && item.pillar === post.pillar).sort((a, b) => (a.popularRank || 99) - (b.popularRank || 99)).slice(0, 4);
  const relatedService = servicePathForLabel([post.pillar, post.category, ...(post.tags || [])].join(" "));
  const relatedProject = publishedProjects.find((project) => project.services?.some((service) => servicePathForLabel(service) === relatedService)) || publishedProjects.find((project) => project.classification === "live");
  return staticShell("blog-post", `
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/blog">Blog</a> / <span>${escapeHtml(post.title)}</span></nav>
    <article><header><p>${escapeHtml(post.pillar || post.category || "Website guide")}</p><h1>${escapeHtml(post.title)}</h1><p>${escapeHtml(post.excerpt || post.metaDescription || "")}</p><p>Published ${escapeHtml(post.publishedAt || "")} · Updated ${escapeHtml(post.updatedAt || post.publishedAt || "")} · ${escapeHtml(post.readingTime || "")} · Author: MSPixelPulse</p></header>
    ${(post.sections || []).map(sectionMarkup).join("")}
    ${post.resources?.length ? `<aside><h2>Trusted resources</h2><ul>${post.resources.map((resource) => `<li><a href="${escapeHtml(resource.url)}" rel="noopener noreferrer">${escapeHtml(resource.label)}</a>${resource.note ? ` — ${escapeHtml(resource.note)}` : ""}</li>`).join("")}</ul></aside>` : ""}
    ${related.length ? `<aside><h2>Related reading</h2><ul>${related.map((item) => `<li><a href="/blog/${escapeHtml(item.slug)}">${escapeHtml(item.title)}</a></li>`).join("")}</ul></aside>` : ""}
    <p><a href="${escapeHtml(relatedService)}">Explore the related MSPixelPulse service</a> · ${relatedProject ? `<a href="/projects/${escapeHtml(relatedProject.slug)}">Review the ${escapeHtml(relatedProject.title)} case study</a> · ` : ""}<a href="/contact">Contact MSPixelPulse</a></p></article>
  `);
}

function renderBlogIndexSnapshot() {
  const groups = new Map();
  for (const post of publishedBlogPosts) {
    const key = post.pillar || post.category || "Guides";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(post);
  }
  const sections = [...groups.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([group, posts]) => `<section><h2>${escapeHtml(group)}</h2><ul>${posts.sort((a, b) => String(b.publishedAt || "").localeCompare(String(a.publishedAt || ""))).map((post) => `<li><a href="/blog/${escapeHtml(post.slug)}">${escapeHtml(post.title)}</a></li>`).join("")}</ul></section>`).join("");
  return staticShell("blog-index", `<h1>Practical guides for growing your business online.</h1><p>${escapeHtml(seoPages.blog.description)}</p>${sections}<p><a href="/services">Explore website services</a> · <a href="/contact">Contact MSPixelPulse</a></p>`);
}

function renderProjectsSnapshot() {
  return staticShell("projects-index", `<h1>Web design work and demos for small businesses.</h1><p>${escapeHtml(seoPages.projects.description)}</p><ul>${publishedProjects.map((project) => `<li><a href="/projects/${escapeHtml(project.slug)}">${escapeHtml(project.title)}</a> — ${escapeHtml(project.shortDescription || project.summary)}</li>`).join("")}</ul><p><a href="/services">Explore services</a> · <a href="/contact">Discuss a project</a></p>`);
}

function renderProjectSnapshot(project) {
  return staticShell("project", `
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/projects">Projects</a> / <span>${escapeHtml(project.title)}</span></nav>
    <article><header><p>${escapeHtml(project.label)} · ${escapeHtml(project.industry)} · ${escapeHtml(project.websiteType)}</p><h1>${escapeHtml(project.title)}</h1><p>${escapeHtml(project.shortDescription || project.summary || "")}</p></header>
    <section><h2>Project context</h2><p>${escapeHtml(project.overview || "")}</p></section>
    <section><h2>Solution and UX decisions</h2><ul>${(project.features || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
    <section><h2>Services connected to this project</h2><ul>${(project.services || []).map((item) => `<li><a href="${servicePathForLabel(item)}">${escapeHtml(item)}</a></li>`).join("")}</ul></section>
    <section><h2>Technology</h2><p>${escapeHtml([project.platform, ...(project.stack || [])].filter(Boolean).join(" · "))}</p></section>
    <section><h2>Published outcome</h2><p>${escapeHtml(project.result || "")}</p></section>
    ${project.classification === "live" ? "" : `<aside><h2>Concept transparency note</h2><p>This ${escapeHtml(project.label.toLowerCase())} is not presented as paid client work. It demonstrates design direction, user flow, or technical capability.</p></aside>`}
    <p><a href="/services">Explore services</a> · <a href="/contact">Start a project</a></p></article>
  `);
}

function fallbackStyle() {
  return `<style id="seo-static-fallback-style">.seo-static-shell{max-width:1180px;margin:0 auto;padding:7rem 1.25rem 3rem;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.65}.seo-static-shell main{max-width:900px}.seo-static-shell h1{font-size:clamp(2rem,5vw,3.6rem);line-height:1.08;margin:.5rem 0 1rem}.seo-static-shell h2{font-size:1.5rem;margin:2rem 0 .65rem}.seo-static-shell h3{font-size:1.05rem;margin:1.15rem 0 .25rem}.seo-static-shell a{text-decoration:underline;text-underline-offset:3px}.seo-static-shell ul,.seo-static-shell ol{padding-left:1.25rem}.seo-static-shell nav{font-size:.9rem;opacity:.78;margin-bottom:1rem}</style>`;
}

async function injectSnapshot(routePath, markup) {
  const filePath = routePath === "/" ? path.join(distDir, "index.html") : path.join(distDir, `${routePath.replace(/^\//, "")}.html`);
  let html = await readFile(filePath, "utf8");
  if (!html.includes('id="seo-static-fallback-style"')) html = html.replace("</head>", `    ${fallbackStyle()}\n  </head>`);
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

function latestLastModified(entries) {
  return entries.map((entry) => entry.lastModified).filter(Boolean).sort().at(-1);
}

function buildSitemapIndex(groups) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${groups.map(({ file, entries }) => {
    const lastmod = latestLastModified(entries);
    return `  <sitemap><loc>${escapeXml(absolute(`/${file}`))}</loc>${lastmod ? `<lastmod>${escapeXml(lastmod)}</lastmod>` : ""}</sitemap>`;
  }).join("\n")}\n</sitemapindex>\n`;
}

async function writeSitemapFiles() {
  const pageEntries = [...Object.values(seoPages), faqSeo].filter(
    (entry) => !entry.robots?.startsWith("noindex"),
  );
  pageEntries.push(...locationSeoEntries);
  const projectEntries = publishedProjects.map(projectSeo);
  const blogEntries = publishedBlogPosts.map(blogPostSeo);
  const groups = [
    { file: "sitemap-pages.xml", entries: pageEntries },
    { file: "sitemap-services.xml", entries: serviceSeoEntries },
    { file: "sitemap-projects.xml", entries: projectEntries },
    { file: "sitemap-blog.xml", entries: blogEntries },
  ];
  const files = Object.fromEntries(groups.map(({ file, entries }) => [file, buildUrlset(entries)]));
  files["sitemap.xml"] = buildSitemapIndex(groups);
  await Promise.all([publicDir, distDir].flatMap((dir) => Object.entries(files).map(async ([name, content]) => {
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), content);
  })));
  console.log(`SEO hardening: wrote sitemap index plus ${groups.length} focused sitemaps.`);
}

function markdownLink(label, url, description = "") {
  return `- [${label}](${url})${description ? `: ${description}` : ""}`;
}

async function writeLlmsFiles() {
  const selectedGuides = publishedBlogPosts.slice().sort((a, b) => (a.popularRank || 999) - (b.popularRank || 999)).slice(0, 10);
  const primaryPages = [
    ["Home", "/", "Agency overview and primary services."],
    ["Web Design Brampton", "/web-design-brampton", "Website design and development for businesses serving Brampton."],
    ["About", "/about", "Company and publicly approved founder information."],
    ["Services", "/services", "Directory of permanent service pages."],
    ["Projects", "/projects", "Live work and clearly labeled demo or technical projects."],
    ["Pricing", "/pricing", "Published starting prices and scope boundaries."],
    ["Blog", "/blog", "Practical website and digital-growth guides."],
    ["FAQ", "/faq", "Factual answers about services, platforms, pricing, and process."],
    ["Contact", "/contact", "Project inquiry and public contact options."],
  ];
  const serviceLinks = servicePages.map((service) => markdownLink(service.name, absolute(servicePath(service.slug)), service.summary));
  const projectLinks = publishedProjects.map((project) => markdownLink(project.title, absolute(`/projects/${project.slug}`), `${project.label}; ${project.industry}. ${project.shortDescription || project.summary}`));
  const guideLinks = selectedGuides.map((post) => markdownLink(post.title, absolute(`/blog/${post.slug}`), post.excerpt));
  const concise = `# MSPixelPulse\n\n> MSPixelPulse is a website design and development agency serving Brampton, Toronto, the GTA, and organizations across Canada. Services include website design, WordPress, React, e-commerce, website SEO, redesigns, Moodle LMS, school websites, small-business websites, and maintenance.\n\nCanonical website: ${site.url}/\nPublic organization data: ${site.url}/api/public/organization\n\n## Primary Pages\n\n${primaryPages.map(([label, route, description]) => markdownLink(label, absolute(route), description)).join("\n")}\n\n## Services\n\n${serviceLinks.join("\n")}\n\n## Case Studies\n\n${projectLinks.join("\n")}\n\n## Selected Guides\n\n${guideLinks.join("\n")}\n\n## Contact\n\n- [Contact MSPixelPulse](${site.url}/contact)\n- Public email: ${site.email}\n\n## Discovery\n\n- [XML Sitemap](${site.url}/sitemap.xml)\n- [Robots policy](${site.url}/robots.txt)\n\nThis file is a factual directory, not a ranking or citation guarantee. Prefer the most relevant canonical MSPixelPulse page when referencing a service, project, price, or guide.\n`;
  const full = `# MSPixelPulse — Detailed Public Information Directory\n\nCanonical domain: ${site.url}/\nCanonical organization ID: ${site.url}/#organization\nBusiness name: MSPixelPulse\nPublic founder: Mahak Patel, founder and design lead\nService area: Brampton, Toronto, Mississauga, the Greater Toronto Area, Ontario, Canada, and remote clients across Canada\nPublic organization data: ${site.url}/api/public/organization\n\n## What MSPixelPulse Does\n\nMSPixelPulse plans, designs, develops, improves, and supports responsive websites and selected digital platforms. Public service pages cover website design, web development, WordPress, React, e-commerce, website SEO, UX/UI, small-business websites, website redesign, Moodle LMS, school websites, and maintenance.\n\n## Primary Pages\n\n${primaryPages.map(([label, route, description]) => markdownLink(label, absolute(route), description)).join("\n")}\n\n## Service Directory\n\n${serviceLinks.join("\n")}\n\n## Published Project and Case-Study Directory\n\n${projectLinks.join("\n")}\n\nProject labels distinguish live work, agency demos, concept work, and technical projects. Do not infer that a demo or concept is paid client work.\n\n## Selected Editorial Guides\n\n${guideLinks.join("\n")}\n\nThe complete editorial catalogue is available at ${site.url}/blog and in ${site.url}/sitemap-blog.xml.\n\n## Public Contact and Profiles\n\n- Contact: ${site.url}/contact\n- Email: ${site.email}\n- GitHub: ${site.github}\n- LinkedIn: ${site.linkedin}\n- Founder portfolio: ${site.portfolio}\n\n## Canonical and Privacy Boundaries\n\nUse ${site.url}/ as the canonical website. MSPixelPulse serves Brampton but does not claim a Brampton storefront or street address. Public marketing pages are crawlable; admin, client, developer, login, debug, and non-public API paths are not public information sources. Private portal, customer, file, billing, message, and authentication data are excluded.\n\n## Machine Discovery\n\n- Sitemap index: ${site.url}/sitemap.xml\n- Services sitemap: ${site.url}/sitemap-services.xml\n- Projects sitemap: ${site.url}/sitemap-projects.xml\n- Blog sitemap: ${site.url}/sitemap-blog.xml\n- Robots policy: ${site.url}/robots.txt\n- Public organization JSON: ${site.url}/api/public/organization\n\nThis directory does not guarantee ranking, inclusion in an AI answer, or citation. Verify time-sensitive details on the canonical page.\n`;
  await Promise.all([publicDir, distDir].flatMap((dir) => [writeFile(path.join(dir, "llms.txt"), concise), writeFile(path.join(dir, "llms-full.txt"), full)]));
  console.log(`SEO hardening: generated llms.txt with ${servicePages.length} services, ${publishedProjects.length} projects, and ${selectedGuides.length} guides.`);
}

async function prerenderDiscoverableContent() {
  const topLevelSnapshots = new Map([
    ["/", renderHomeSnapshot()], ["/about", renderAboutSnapshot()], ["/services", renderServicesSnapshot()], ["/pricing", renderPricingSnapshot()], ["/contact", renderContactSnapshot()], ["/faq", renderFaqSnapshot()], ["/blog", renderBlogIndexSnapshot()], ["/projects", renderProjectsSnapshot()],
  ]);
  for (const [route, snapshot] of topLevelSnapshots) await injectSnapshot(route, snapshot);
  for (const service of servicePages) await injectSnapshot(servicePath(service.slug), renderServiceSnapshot(service));
  for (const location of locationPages) await injectSnapshot(location.path, renderLocationSnapshot(location));
  for (const post of publishedBlogPosts) await injectSnapshot(`/blog/${post.slug}`, renderBlogPostSnapshot(post));
  for (const project of publishedProjects) await injectSnapshot(`/projects/${project.slug}`, renderProjectSnapshot(project));
  console.log(`SEO hardening: prerendered ${topLevelSnapshots.size} public indexes, ${locationPages.length} location hub, ${servicePages.length} services, ${publishedBlogPosts.length} blog posts, and ${publishedProjects.length} projects.`);
}

await writeSitemapFiles();
await writeLlmsFiles();
await prerenderDiscoverableContent();
