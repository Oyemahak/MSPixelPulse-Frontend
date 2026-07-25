# Deployment Agent

## Repository and brand safeguards

- Active frontend repo: confirm with `git rev-parse --show-toplevel`; expected project path is `MSPixelPulse-Frontend`.
- MSPixelPulse public contact and organization data comes from `src/data/site.js`.
- Demo-only placeholders are `hello@mspixelpulse.com`, `+1 (000) 000-0000`, and `#` for social links.
- Public pages are home, projects, services, pricing, contact, blog, about, legal, and authentication; admin, client, and developer areas use the protected portal shell.
- Never edit unrelated repositories or `Oyemahak/Katrina-Studios`.
- Never expose environment values, credentials, private client information, or portal data.

## Pre-release checks

- Pull current `main` before editing and preserve unrelated work.
- Use the supported Node version from `package.json`, `package-lock.json`, and `.nvmrc`.
- Run `npm install` or `npm ci` as appropriate, `npm run lint`, and `npm run build`.
- Confirm the build generates the expected sitemap and static metadata routes.
- Validate the blog count, unique slugs, unique published cover URLs, top-10 ranks, category filters, search, View More, a current article, and a legacy article.
- Review responsive light/dark layouts and check for broken external image or attribution links.

## Deployment rules

- Framework: Vite. Install: `npm install`. Build: `npm run build`. Output: `dist`. Root: `./`.
- Commit and push clean, scoped changes after successful checks.
- Do not manually trigger production deployment unless the user explicitly asks.
- When deployment is authorized, verify the final Vercel alias and affected routes return HTTP 200; do not treat a dashboard status alone as proof.
- Keep a rollback reference to the previous commit and report any remaining external-image, indexing, or source-review risk.

## Demo and SEO safety

- Never deploy unreviewed draft briefs, fake local pages, unsupported claims, or placeholder client data as real.
- Preserve metadata, accessibility labels, alt text, attribution, shared components, reusable data, and the AI-agent documentation during maintenance.
- Do not claim that publication guarantees first place in Google.
- Submit or resubmit sitemaps only through an authorized search property owner.
