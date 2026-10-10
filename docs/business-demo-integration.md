# Business demo integration handoff

## Architecture and scope

The current public portfolio loads `portfolio.list()` through the shared API
client and merges it with `src/data/projects.js` in
`src/lib/publicPortfolio.js`. All twelve approved business records live in that
existing curated list. Missing entries are appended when API data arrives.
Existing unrelated portfolio records are retained. No backend schema, Sheets
data, auth, portal CRUD, contact form, pricing, or service behavior changes.

Approved business records use release-managed identity, framework, repository,
preview, and verified URL fields to protect against stale API records. Editorial
API descriptions and other ordinary project fields continue through the existing
normalizer. Category hostnames remain separate metadata and are never rendered
as working links while unverified.

LUMINA uses Next.js, React, TypeScript, Tailwind CSS, Motion, and Lucide. Its
preview is the actual completed local homepage capture copied byte-for-byte
from the dental project's `public/brand/project-preview.webp` (1200 × 750).
It remains a clearly labeled agency demo with `Preview pending`, an available
case study and GitHub link, and no live action. Do not replace it with an invented
design or link it to the failed original deployment.

## URL policy

Only promote a category hostname into `verifiedLiveUrl` after its actual
production response, HTTPS, assets, navigation, business identity, and required
client permission have been checked. Keep `existingLiveUrl` for continuity and
`plannedCategorySubdomain` for the proposed mapping. Keep Unity & Hope's primary
client domain. Do not use private management URLs or provider/admin URLs in
public project cards or customer emails.

The approved mappings are dental, homecare, healthcare, wedding, restaurant,
flower, realestate, autism, petgrooming, salon, homeservices, and wellness under
`mspixelpulse.com`. The original agency operations registry remains the domain
verification source. This public curated list is a release projection of that
inventory within the existing portfolio architecture.

## Release boundary and rollback

Connected repository: `Oyemahak/MSPixelPulse-Frontend`.
Connected project: `prj_jvg7z2302As6efcpSh2oXWgCiOBD`.
Baseline source: `ed1b9a3`.
Existing rollback production deployment: `dpl_DDiEdSTASPb6ws2vwUrru4pk4Dy6`.

The task is prepared in a separate local worktree. No push, production deploy,
provider configuration, plan purchase, DNS change, or production data write is
performed. A linked repository push may deploy automatically. Release only after
the owning hosting arrangement is commercially eligible and the production
workflow is authorized. Verify the exact source SHA and actual production URL
after release; retain the baseline deployment for rollback.

## Verification

Local checks completed on 2026-10-09:

- Lint passes; all 20 unit tests pass, including stale API destinations,
  corrected Unity repository identity, pending Lumina, and twelve-record coverage.
- Production build passes with the existing production API base.
- SEO validation passes for 132 unique canonical routes, 132 JSON-LD blocks,
  one H1 per route, zero duplicate titles/descriptions/H1s, zero broken internal
  links, and zero missing local images. The new route is
  `/projects/lumina-dental-studio`.
- 56 browser evidence records pass using an isolated local production preview.
  Projects was visually reviewed in light and dark at 1440, 1024, 768, 430,
  390, and 375 pixels. Search returns one Lumina entry and keyboard focus reaches
  its card actions. All project images load; there is no body overflow or planned
  category hostname presented as a live action. No uncaught runtime exceptions
  were recorded.
- Lumina detail was visually reviewed in both themes at 1440 and 390 pixels,
  with the actual preview and no live action. Home, Login, Register, and an
  invalid public route received desktop/mobile DOM shell checks in both themes.
- CanSTEM, Aimze, Dazzling Smile, Nexus website, and Nexus LMS records remain
  byte-for-byte unchanged against the starting source. GitHub card actions apply
  only to the approved twelve business entries. The five unrelated records retain
  their original card actions.

Browser emulation is not physical device testing. The local installed Node
runtime is 24.2; the repository specifies Node 22, so its exact production runtime
still needs release-time validation. Existing Browserslist/baseline mapping
staleness warnings were preserved without dependency upgrades. No role CRUD
workflow is changed, and no production account or customer data is used as a
test subject. Production publication and post-deployment checks remain blocked
by hosting eligibility.
