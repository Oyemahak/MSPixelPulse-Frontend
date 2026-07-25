# MSPixelPulse Editorial Catalog

`blog-drafts.json` contains 1,000 non-indexable editorial briefs across 20 website, search, design, content, accessibility, performance, platform, and growth categories.

## Publishing rule

A brief is not a publishable article. Before moving one into `src/data/blogGrowthPosts.js`:

1. Add original MSPixelPulse experience, a real example, or useful first-party analysis.
2. Verify time-sensitive statements against primary and official sources.
3. Replace the generated outline with a complete, satisfying reader journey.
4. Review the title, description, headings, links, structured data, image, attribution, and internal links.
5. Complete accessibility, responsive, content-quality, and search-policy review.
6. Confirm the article has a distinct purpose and is not a near-duplicate city or industry doorway page.
7. Add an honest AI-assistance disclosure when automation materially contributed.

Only articles exported through `publishedBlogPosts` are included in the generated sitemap and static route metadata.

## Cover images

Every brief has a unique Unsplash image ID, source link, photographer name, photographer profile, 1200 by 675 URL, preview URL, and descriptive alt-text draft. Keep attribution attached and confirm that the image still fits the final article before publishing.

## Regenerating the catalog

Run `node scripts/generate-blog-catalog.mjs` only when intentionally refreshing the entire editorial roadmap and its cover snapshot. Review the resulting diff because current search results may change image ordering.
