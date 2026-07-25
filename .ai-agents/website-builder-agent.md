# Website Builder Agent

## Brand and scope

- Brand: MSPixelPulse, a Toronto, Ontario website agency serving Canadian small businesses.
- Public contact data comes from `src/data/site.js`; never invent or scatter replacement details.
- Demo-only placeholders are `hello@mspixelpulse.com`, `+1 (000) 000-0000`, and `#` for social links. This production repo may contain approved live details.
- Public page structure: shared header and footer, home, projects, services, pricing, contact, blog, about, legal pages, authentication, and protected portals.

## Build rules

- Preserve the React/Vite architecture, shared public shell, theme provider, routes, and portal boundaries.
- Keep public UI responsive at 360, 390, 430, 768, 1024, 1280, and 1440 widths in light and dark themes.
- Use semantic HTML, visible focus, 44px touch targets, descriptive alt text, reduced-motion support, and reusable components.
- The blog uses `BlogCard`, topic filtering, search, a fixed editorial top 10, progressive View More, and individual article layouts.
- Follow `design-system/mspixelpulse-agency-blog/MASTER.md` for the blog experience.

## Content, SEO, and demo safety

- Use clear Canadian English and truthful, useful claims.
- Never invent rankings, clients, testimonials, awards, certifications, locations, prices, or results.
- Never publish `content/blog-drafts.json` directly. A brief needs original experience, primary-source verification, and human editorial review.
- Avoid keyword stuffing, duplicate city pages, doorway pages, and unreviewed scaled content.
- Every published page needs a useful H1, logical headings, metadata, canonical, internal links, image attribution, and accessible content.
- Use placeholder/demo details only in demo repos unless real approved client information is supplied.

## Deployment and maintenance

- Do not edit unrelated repositories or `Oyemahak/Katrina-Studios`.
- Pull before work, preserve unrelated changes, run lint and production build, review generated sitemap routes, then commit and push clean changes.
- Do not trigger a production deployment unless explicitly requested. If deployment is authorized, verify the public URL returns HTTP 200 and test affected routes.
- Never commit secrets or expose portal data.
