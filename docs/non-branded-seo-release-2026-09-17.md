# Non-branded SEO release — 2026-09-17

## Objective

Strengthen the existing MSPixelPulse production site for non-branded Toronto, GTA, Ontario, and Canadian website-service searches without creating doorway pages, replacing working URLs, weakening the interface, or touching portal/API functionality.

## Page ownership

| Primary intent | Canonical page |
| --- | --- |
| web design and development Toronto | `/` |
| web development Toronto | `/services/web-development` |
| website design Toronto | `/services/website-design` |
| WordPress developer Toronto | `/services/wordpress-development` |
| React developer Toronto | `/services/react-development` |
| small business web design Toronto | `/services/small-business-websites` |
| website redesign Toronto | `/services/website-redesign` |
| ecommerce website development Toronto | `/services/ecommerce-development` |
| Moodle developer Toronto | `/services/moodle-lms-development` |
| education website development Ontario | `/services/school-websites` |
| website maintenance Toronto | `/services/website-maintenance` |
| website SEO Toronto | `/services/website-seo` |
| web design Brampton | `/web-design-brampton` |

## Release decisions

- Retain the existing `/services/:slug` route architecture because it already gives each genuine commercial intent a substantive canonical page.
- Do not create near-duplicate root-level keyword routes.
- Retain the existing editorial catalogue. Search Console currently shows that many newer articles are discovered but not yet crawled; no article is removed, merged, or noindexed without query, link, and content-performance evidence.
- Lead titles and H1s with the non-branded service intent while keeping MSPixelPulse as the entity at the end of titles or in supporting copy.
- Use the existing Organization schema rather than inventing a storefront address or unsupported LocalBusiness details.
- Submit IndexNow only after a verified production release. Local and preview builds must not notify search engines about the canonical production domain.

## Priority manual Google reinspection batch

1. `/`
2. `/services/web-development`
3. `/services/website-design`
4. `/services/wordpress-development`
5. `/services/react-development`
6. `/services/small-business-websites`
7. `/services/website-redesign`
8. `/services/ecommerce-development`
9. `/services/moodle-lms-development`
10. `/services/website-maintenance`

The ten URLs above are the first manual inspection batch after production verification. Sitemap discovery remains the scalable route for the complete 131-URL public catalogue. A Search Console `Indexing requested` confirmation means priority crawl-queue acceptance, not confirmed indexing.
