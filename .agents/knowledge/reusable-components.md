# Reusable Components

Use the Knowledge Update Protocol before editing this file.

## Entry Format
- Date:
- Source:
- Decision or note:
- Evidence:
- Affected areas:
- Confidence:
- Reviewer:

## Entries

- Date: 2026-08-18
- Source: Public hero typography and responsive QA
- Decision or note: Import `src/styles/public-system.css` once from `src/main.jsx`; keep all visitor-route H1 caps and shared `PageHero` spacing there instead of adding page-local typography overrides.
- Evidence: The central `.public-main h1` contract covers shared heroes plus project detail, Moodle, editorial, legal, auth, home, and error pages; light/dark checks across 1440, 1280, 1024, 768, 430, 390, 360, and 844-by-390 viewports retained the 42 px, 700 weight, 1.2 line-height, and no-overflow limits.
- Affected areas: All public routes, `PublicPageHeader.jsx`, future visitor-facing page intros
- Confidence: High
- Reviewer: Frontend, responsive, visual, and accessibility review required before changing the global H1 contract

- Date: 2026-08-18
- Source: Public UI and billing implementation
- Decision or note: Reuse `PublicPageHeader.jsx` for public page/section hierarchy and the `components/billing` workspace for invoice editing, preview, settings, uploads, payments, and accessible drawers.
- Evidence: The shared public primitives now serve Projects, About, Services, Pricing, Contact, Blog, and existing `SectionTitle` consumers; billing components produce matching on-screen and PDF invoice data without exposing storage credentials.
- Affected areas: Public routes, Admin Billing, Client Billing, future invoice maintenance
- Confidence: High
- Reviewer: Responsive, accessibility, PDF render, and role-isolation review required for future variants

- Date: 2026-07-25
- Source: Blog library implementation
- Decision or note: Reuse `src/components/blog/BlogCard.jsx` for published guide cards with preview images, category, reading time, rank, CTA, and photo attribution.
- Evidence: One component renders popular and standard variants and preserves semantic article/link structure.
- Affected areas: Blog index, home-page editorial previews, future topic collections
- Confidence: High
- Reviewer: Frontend review required when adding variants

- Date: 2026-07-25
- Source: Blog discovery implementation
- Decision or note: Reuse the category-filter, search, live-result, and incremental loading pattern from `src/pages/Blog.jsx` for large public content collections.
- Evidence: The pattern keeps initial DOM and image load bounded, exposes pressed state, resets pagination when filters change, and handles empty results.
- Affected areas: Blog, project libraries, public resource collections
- Confidence: High
- Reviewer: Accessibility and performance review required

- Date: 2026-07-25
- Source: Editorial catalog generator
- Decision or note: Use `scripts/generate-blog-catalog.mjs` only for deliberate roadmap refreshes, then review and commit the generated snapshot.
- Evidence: The script validates 1,000 unique slugs and human-photo IDs and writes both the draft catalog and the published-cover snapshot.
- Affected areas: Editorial planning, cover sourcing, agent handoff
- Confidence: High
- Reviewer: Content owner approval required before regeneration
