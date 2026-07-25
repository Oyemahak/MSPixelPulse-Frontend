# Known Risks

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
- Source: Google spam policies and current editorial architecture
- Decision or note: Publishing all 1,000 generated briefs without original expertise and review could create scaled-content and trust risk.
- Evidence: The catalog is deliberately excluded from `publishedBlogPosts`, sitemap generation, and static route metadata.
- Affected areas: SEO, content quality, brand trust, future batch publishing
- Confidence: High
- Reviewer: Human approval required before changing any draft status

- Date: 2026-07-25
- Source: Unsplash-hosted cover implementation
- Decision or note: Remote cover images depend on an external CDN and can change availability or performance characteristics.
- Evidence: Published covers use stable Unsplash image URLs with attribution; card previews are lazy-loaded and sized separately from article covers.
- Affected areas: Blog visual quality, Core Web Vitals, external dependency
- Confidence: Medium
- Reviewer: Recheck representative images and performance during releases

- Date: 2026-07-25
- Source: AI-assisted published batch disclosure
- Decision or note: AI-assisted articles need ongoing human fact, tone, source, and first-hand-experience review to strengthen trust and originality.
- Evidence: New posts expose an editorial disclosure and link to official sources, but automation cannot supply real business experience by itself.
- Affected areas: Current new articles and all future editorial batches
- Confidence: High
- Reviewer: MSPixelPulse content owner
