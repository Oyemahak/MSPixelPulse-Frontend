# Learned Decisions

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

- Date: 2026-08-22
- Source: User production-upgrade specification, UI/UX Pro Max review, and receipt render QA
- Decision or note: Use one shared calm-productivity portal layer, persistent role-aware notification records, and a dedicated idempotent Invoice to Payment to Receipt workflow. Receipt snapshots and stable identifiers are retained; void is an audited status rather than deletion.
- Evidence: `portal-productivity.css`, shared notification components/routes, dedicated payment/receipt API calls, and ten Letter/A4 receipt render fixtures with long-content coverage.
- Affected areas: All portal roles, typography, navigation, notifications, billing, receipts, email organization, responsive and theme QA
- Confidence: High
- Reviewer: Production browser, API, Gmail, and deployment verification required for each release

- Date: 2026-08-19
- Source: User production mobile and invoice workflow specification; existing portal and billing architecture
- Decision or note: Keep one shared responsive portal layer and the existing billing components, with a fast essential invoice form plus progressively disclosed advanced fields. Presence renders exactly one truthful state per person.
- Evidence: `portal-mobile.css` contains role-shared overflow, table, toolbar, requirements, profile, and modal rules; browser QA found no body overflow across 147 Admin/Client/Developer route-width checks and seven invoice-drawer widths; invoice calculation tests cover full, advance, remaining, custom, other, and due presets.
- Affected areas: All portal roles, requirements, tables, billing, profile/settings, direct messages, project rooms, presence, generated invoice preview/PDF
- Confidence: High
- Reviewer: Production browser and deployed API verification required before release completion

- Date: 2026-07-25
- Source: User request, repository SEO standards, and Google Search official guidance
- Decision or note: Keep the 1,000-topic catalog as non-indexable editorial briefs and publish useful articles in reviewed batches.
- Evidence: `content/blog-drafts.json` marks all briefs as drafts and non-indexable; only `publishedBlogPosts` is consumed by sitemap and static metadata generation.
- Affected areas: Blog data, SEO generator, agent documentation, release workflow
- Confidence: High
- Reviewer: Human editorial approval required for each future batch

- Date: 2026-07-25
- Source: UI/UX Pro Max editorial-grid design system and existing MSPixelPulse UI standards
- Decision or note: The blog uses a content-first editorial grid, fixed top 10, accessible category buttons, search, and progressive View More rather than rendering every article at once.
- Evidence: `Blog.jsx`, `BlogCard.jsx`, and scoped blog styles implement the pattern with keyboard labels, live results, lazy images, and reduced-motion support.
- Affected areas: `/blog`, article discovery, responsive UX, performance
- Confidence: High
- Reviewer: Visual and accessibility QA required

- Date: 2026-07-25
- Source: User cover-image requirement and Unsplash source metadata
- Decision or note: Every published post and every draft brief has a unique human-photo cover source; external covers keep photographer and source attribution.
- Evidence: Catalog validation reports 1,000 unique draft image IDs and published data reports one unique cover URL per post.
- Affected areas: Blog cards, article hero images, draft catalog, content workflow
- Confidence: High
- Reviewer: Image-fit review required before each future publication
