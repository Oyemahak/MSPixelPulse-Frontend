# Business demo integration handoff

## Architecture and scope

The current public portfolio loads `portfolio.list()` through the shared API
client and merges it with `src/data/projects.js` in
`src/lib/publicPortfolio.js`. All eleven approved business demos live in that
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
client domain. Unity & Hope is excluded: its existing production portfolio
object is retained verbatim, with no new registry projection, repository
correction, category mapping, or GitHub card action. Do not use private
management URLs or provider/admin URLs in
public project cards or customer emails.

The approved mappings are dental, homecare, wedding, restaurant,
flower, realestate, autism, petgrooming, salon, homeservices, and wellness under
`mspixelpulse.com`. The final eleven-demo registry in the 2026-10-10 Vercel Pro handoff is the
release source; earlier twelve-business registries are historical. This public curated list is a release projection of that
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

Local automated checks rerun on 2026-10-10 after the eleven-demo scope correction.
The unchanged demo layouts retain prior browser evidence from 2026-10-09; fresh
final-readiness browser evidence is recorded separately in the operations handoff:

- Lint passes; all 20 unit tests pass, including stale API destinations,
  unchanged Unity portfolio behavior, pending Lumina, and eleven-record coverage.
- Production build passes with the existing production API base.
- SEO validation passes for 132 unique canonical routes, 132 JSON-LD blocks,
  one H1 per route, zero duplicate titles/descriptions/H1s, zero broken internal
  links, and zero missing local images. The new route is
  `/projects/lumina-dental-studio`.
- The prior twelve-business candidate had 56 passing browser evidence records using an isolated local production preview.
  Projects was visually reviewed in light and dark at 1440, 1024, 768, 430,
  390, and 375 pixels. Search returns one Lumina entry and keyboard focus reaches
  its card actions. All project images load; there is no body overflow or planned
  category hostname presented as a live action. No uncaught runtime exceptions
  were recorded.
- Lumina detail was visually reviewed in both themes at 1440 and 390 pixels,
  with the actual preview and no live action. Home, Login, Register, and an
  invalid public route received desktop/mobile DOM shell checks in both themes.
- Unity & Hope, CanSTEM, Aimze, Dazzling Smile, Nexus website, and Nexus LMS records remain
  byte-for-byte unchanged against the starting source. GitHub card actions apply
  only to the approved eleven demo entries. The six excluded or unrelated records retain
  their original card actions.

Browser emulation is not physical device testing. The corrected eleven-demo
candidate was checked using exact Node 22.14.0, matching the deployment Node 22
family. Existing Browserslist/baseline mapping
staleness warnings were preserved without dependency upgrades. No role CRUD
workflow is changed, and no production account or customer data is used as a
test subject. The existing team is now verified Pro. Production publication and
post-deployment checks remain reserved for the explicitly authorized Claude
execution; recheck provider ownership and exact release SHA before publishing.
