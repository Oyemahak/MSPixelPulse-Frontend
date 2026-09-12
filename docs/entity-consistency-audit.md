# MSPixelPulse entity consistency audit

Updated: 2026-09-12

## Canonical public entity

| Field | Approved value | Implementation source |
| --- | --- | --- |
| Name | MSPixelPulse | `src/data/site.js`, page copy, metadata, manifests, structured data, LLM files |
| Canonical website | `https://mspixelpulse.com` | canonical tags, sitemaps, robots, structured data, public organization JSON |
| Stable organization ID | `https://mspixelpulse.com/#organization` | Organization and related page schema |
| Description | Website design and development agency serving Brampton, Toronto, the GTA, and Canada with WordPress, React, e-commerce, SEO foundations, redesigns, and support. | `src/data/site.js` and aligned public metadata |
| Public email | `info@mspixelpulse.com` | site data, contact paths, public organization JSON |
| Public phone | `+1 (365) 883-0338` | site data, contact paths, public organization JSON |
| Location | Toronto, Ontario, Canada | page copy, Organization schema, public organization JSON |
| Service areas | Brampton, Toronto, Mississauga, the GTA, Ontario, and remote clients across Canada | service pages, location hub, FAQ, Organization schema |
| Founder | Mahak Patel | About-page Person schema linked to the organization |
| GitHub profile | `https://github.com/MSPixelPulseAgency` | site data and Organization `sameAs` |
| LinkedIn profile | `https://www.linkedin.com/in/mahak-patel-167640150/` | site data and Organization `sameAs` |
| Portfolio | `https://mahakpatel.com` | site data and Organization `sameAs` |

## Consistency findings and decisions

- The apex HTTPS domain is the only canonical website identity. `www.mspixelpulse.com` and known Vercel aliases are redirect hosts, not separate entities.
- The production contact email and phone already present on the website remain the public source of truth. Demo placeholder contact details from agency templates were not substituted into the production site.
- The agency is described as serving Brampton, Toronto, the GTA, Ontario, and remote clients across Canada. Toronto remains the published location; `/web-design-brampton` explicitly describes a service area and does not claim a Brampton storefront or address.
- No founding date, employee count, award, certification, rating, review total, client total, or unsupported performance statistic is asserted.
- Published projects retain their existing evidence labels. Live, demo, concept, and technical work must not be blended into a single claim of completed client work.
- The existing Moodle service URL, `/services/moodle-lms-development`, remains canonical to preserve the established route and avoid creating a reversed-slug duplicate.
- `Organization`, `WebSite`, `Person`, service, article, project, FAQ, and breadcrumb entities reuse the canonical organization ID rather than creating disconnected MSPixelPulse identities.
- The public JSON endpoint is deliberately read-only and contains public business facts only. It does not expose portal data, private configuration, provider credentials, or internal APIs.

## Source-to-surface audit

| Surface | Consistency control |
| --- | --- |
| Visible homepage/about/footer copy | Uses MSPixelPulse, Toronto/Canada scope, approved contact paths, and factual service wording |
| Page titles and descriptions | Use the same agency name, service terminology, and canonical domain |
| Open Graph and X/Twitter cards | Reuse canonical titles, descriptions, URLs, images, and image alt text |
| JSON-LD | Reuses `#organization`, `#website`, and canonical page URLs |
| `site.webmanifest` | Uses the same name and agency description |
| `robots.txt` and XML sitemaps | Point only to the apex canonical domain |
| `llms.txt` and `llms-full.txt` | Describe the same entity, service list, proof caveats, contact details, and canonical pages |
| `/api/public/organization` | Returns the approved public identity, service catalogue, project URLs, profiles, and contact details |

## Future change control

Update `src/data/site.js` first when a verified public identity fact changes, then regenerate build artifacts and audit all surfaces above. A physical address, review score, certification, award, partner claim, new social profile, or service area must not be added until the business owner verifies it for public use.
