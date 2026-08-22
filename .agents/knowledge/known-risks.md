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

- Date: 2026-08-22
- Source: Gmail operational-notification organization design
- Decision or note: The exact operational mailbox was provisioned on 2026-08-22 with the parent plus ten category labels and ten subject filters that skip Inbox. Future automated reprovisioning still requires Gmail-scoped OAuth credentials; the existing Sheets/Drive token does not include Gmail scope.
- Evidence: Signed-in Gmail verification showed all managed labels and ten active `subject:([MSP:CATEGORY])` filters with Skip Inbox and the matching label; existing mail was not reprocessed.
- Affected areas: Operational email triage; in-app notification delivery is unaffected
- Confidence: High
- Reviewer: Recheck the exact mailbox after future category changes

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
