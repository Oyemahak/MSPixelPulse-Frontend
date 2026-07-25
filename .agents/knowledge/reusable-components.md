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
