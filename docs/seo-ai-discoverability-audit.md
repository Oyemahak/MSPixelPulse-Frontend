# MSPixelPulse SEO, GEO, and AI discoverability audit

Audit date: 2026-08-25  
Scope: public MSPixelPulse agency website and public machine-readable discovery surfaces  
Canonical domain: `https://mspixelpulse.com`

## Executive summary

The site already had a useful SEO foundation: route-level metadata, canonical tags, JSON-LD helpers, segmented XML sitemaps, `llms.txt`, canonical host rules, and index controls for portal routes. The largest discoverability gap was rendering: important public React routes had accurate head metadata but an empty initial `#root` in fetched HTML, while only project and blog detail routes received crawlable build-time fallback content.

This upgrade extends the existing system instead of replacing it. It adds dedicated service routes, a visible FAQ resource, more precise entity and page schemas, generated static HTML for important public routes, a public organization JSON endpoint, explicit crawler policy, generated LLM files, stronger internal linking, and evidence-based project and article semantics.

The code and generated artifacts have been validated locally. They are not described as live until the approved commit is pushed and the canonical production alias is checked.

## Baseline findings

### What was already working

- Public pages used distinct route-aware titles, descriptions, canonical tags, and social metadata.
- Project and blog detail pages had build-time crawlable body content.
- XML sitemap segmentation existed for pages, projects, and blog posts.
- `robots.txt` pointed to the canonical sitemap and kept private application routes out of general crawling.
- The apex domain was canonical; the `www` host redirected to it.
- Login and application routes returned noindex controls in live checks.
- Project data already distinguished live, demo, concept, and technical work.

### High-priority gaps

- Initial HTML for the homepage, about, services, pricing, contact, and existing service page contained an empty React mount element.
- A broad services page existed, but the major commercial services did not each have a dedicated canonical route and complete answer content.
- FAQ material was scattered and did not have one visible grouped resource.
- Existing Organization schema did not consistently anchor every page and entity to a stable organization ID.
- Service, case-study, blog, FAQ, and breadcrumb schema coverage was inconsistent across route types.
- `llms.txt` files and sitemap dates depended on manually maintained content rather than one generation path.
- An older Vercel alias, `capstone-frontend.vercel.app`, still served duplicate public content instead of redirecting to the canonical domain.

## Implemented architecture

### Crawlable route output

The production build now writes meaningful static HTML into each indexed route file after Vite builds the application. React still hydrates and runs the interactive site in the browser.

Generated fallback coverage:

- 8 primary index pages
- 10 dedicated service pages
- 14 published project/case-study pages
- 94 published editorial pages

Each generated route contains a useful H1 and page-specific body content. A build validator confirmed that all 126 sitemap URLs have generated HTML and a non-empty H1.

### Canonical service routes

- `/services/web-development`
- `/services/website-design`
- `/services/wordpress-development`
- `/services/react-development`
- `/services/ui-ux-design`
- `/services/small-business-websites`
- `/services/website-redesign`
- `/services/moodle-lms-development`
- `/services/school-websites`
- `/services/website-maintenance`

Each route includes a direct answer, audience, problems, deliverables, process, technologies, related work, related services, a relevant guide, visible FAQs, contact paths, and route-specific metadata/schema.

### FAQ and answer content

`/faq` groups visible questions about website development, WordPress, React, UX/UI, pricing, process, maintenance, Moodle, school websites, and small-business websites. Service-page FAQ schema is generated from the same question-and-answer data shown on that page. The main FAQ schema is generated from the same grouped visible answers.

### Entity and structured data

The structured-data system now uses stable IDs and canonical relationships:

- `Organization` at `https://mspixelpulse.com/#organization`
- `WebSite` at `https://mspixelpulse.com/#website`
- `Person` for the founder on the About page
- `WebPage`, `AboutPage`, `ContactPage`, and `CollectionPage` where appropriate
- `Service` plus visible `FAQPage` data on service routes
- `CreativeWork` for published project/case-study pages
- `BlogPosting` for editorial posts, with visible published/updated dates
- `BreadcrumbList` on deep public routes

No unsupported rating, award, certification, address, pricing, or client-volume claim was added.

### Crawler and machine-readable access

`robots.txt` explicitly addresses Googlebot, Bingbot, OAI-SearchBot, and PerplexityBot. Public pages and the public organization endpoint are crawlable; login, registration, admin, client, developer, debug, and private API paths remain blocked.

Separate training-oriented crawler groups are present for GPTBot, Google-Extended, and ClaudeBot. They can access public marketing content but not application or private API paths. This is an explicit site policy, not a promise that any external system will index, cite, or train on the content.

`llms.txt` and `llms-full.txt` are generated from the same service, project, editorial, page, and contact data used by the site. They include canonical links and describe project labels conservatively.

`GET /api/public/organization` provides a small read-only JSON representation of the public entity, services, case-study URLs, primary pages, public contact details, and profiles. It supports `GET`, `HEAD`, and CORS preflight; unsupported methods return 405.

### Sitemap and canonical controls

The sitemap index now references:

- `sitemap-pages.xml`
- `sitemap-services.xml`
- `sitemap-projects.xml`
- `sitemap-blog.xml`

All 126 URLs are unique, canonical, public, and represented by generated route HTML. No login, admin, client, developer, debug, or private API route is present. Meaningful content dates replace build-time-now timestamps where source dates are available.

The Vercel configuration adds exact redirects from the known legacy `capstone-frontend.vercel.app` host to the apex domain. This must be verified on the live alias after deployment because a local Vite preview cannot exercise Vercel host routing.

## Verification evidence

### Automated checks

- ESLint: passed
- Node test suite: passed, 3 of 3 tests
- Production Vite build: passed
- Static metadata generation: 134 route files
- Indexable route generation: 126 canonical URLs
- Sitemap validation: 126 total and 126 unique URLs
- Generated HTML validation: no missing route files, H1 elements, metadata, or valid JSON-LD
- Public organization handler simulation: 200 response, 10 services, 14 project URLs
- `git diff --check`: required before commit and recorded in the release handoff

The current shell uses Node 24 while `package.json` specifies Node 22.x. The build passes, and Vercel should continue using the declared Node 22 runtime. Browser compatibility data also reports that the installed reference datasets are old; update them in a separate dependency-maintenance change rather than mixing an unrelated lockfile change into this release.

### Browser checks

Representative public, service, project, blog, pricing, FAQ, contact, login, and invalid routes were checked at desktop, tablet, and mobile widths. The checks covered:

- correct visible H1, title, canonical URL, and robots state
- no horizontal overflow or broken images
- one header, main region, and footer on public routes
- mobile menu keyboard focus, Escape close, focus return, and scroll lock
- persisted light and dark themes across reloads
- visible FAQ expansion and matching answer content
- service preselection on the contact form
- noindex behaviour for login and invalid routes
- no browser console errors

Admin, developer, and client entry paths redirected to login without exposing private page content in the tested local build.

## Measurement plan

No additional analytics library is required for this release. If the production property already uses GA4, review Acquisition and Explorations for referrer/source values such as:

- `chatgpt.com`
- `perplexity.ai`
- `copilot.microsoft.com`
- `gemini.google.com`
- `bing.com`
- `google.com`

Track landing page, engaged sessions, contact actions, and qualified enquiries separately. A referral is evidence of a visit, not proof that an answer engine indexed or cited every page. Preserve the existing consent and privacy model when adding any new event or reporting configuration.

## Manual post-deployment actions

### Google Search Console

1. Confirm the verified property covers the apex HTTPS domain.
2. Submit `https://mspixelpulse.com/sitemap.xml`.
3. Use URL Inspection on the homepage, one service page, `/faq`, one project, and one blog post.
4. Request indexing after the production alias returns the new commit.
5. Monitor Page indexing, Enhancements, HTTPS, and Core Web Vitals for regressions.

### Bing Webmaster Tools

1. Submit the canonical sitemap index.
2. Review IndexNow submission status and URL inspection for the same representative routes.
3. Check crawl-control and blocked-URL reports for accidental public-route exclusions.

### Google Business Profile

Only update a verified profile owned by MSPixelPulse. Use the canonical website and the same public phone, email, and service-area wording. Do not invent a storefront address, hours, categories, credentials, or review claims; each requires business-owner confirmation.

### Live release review

After an approved production deployment, verify:

- the canonical alias and legacy-host redirects
- source HTML for the homepage and representative service/project/blog pages
- `robots.txt`, all four sitemap segments, both LLM files, and `/api/public/organization`
- Googlebot, Bingbot, OAI-SearchBot, and PerplexityBot responses for representative public pages
- noindex headers on private application and API routes
- mobile menu, themes, FAQ, contact preselection, and console state on the live domain

## Ongoing safeguards

- Keep one source of truth for entity, service, FAQ, project, and editorial data.
- Regenerate static heads, HTML, LLM files, and sitemaps in the build; do not hand-edit generated artifacts without updating the generator.
- Preserve public/private boundaries. Public discovery work must never expose portal data, credentials, provider tokens, or protected APIs.
- Retain honest project labels and avoid unsupported superlatives or outcome claims.
- Prefer improving authoritative canonical pages over creating thin, overlapping keyword or location pages.
