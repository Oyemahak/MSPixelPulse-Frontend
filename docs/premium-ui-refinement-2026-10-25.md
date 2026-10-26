# Premium UI refinement: handoff (2026-10-25)

## Objective

Refine the existing public website (no rebuild): stable floating glass header, a richer light theme, consistent project cards, platform-coloured footer socials, a shared public button system, and smooth navigation, without changing portal behaviour, data or integrations.

## Root cause: the header changed width between pages

Production measured 1216 px on every route except `/projects` (1200 px), so the header edges jumped 8 px per side.

- `b21d08e` (Wellness V4 sync) added a route-scoped rule in `public-actions.css` that capped `.container-edge` and `.public-header-shell` at 1200 px whenever `App.jsx` set `data-wellness-project-sync` (`/projects`, `/projects/ms-pixelpulse-wellness-studio`, `/admin/projects`). It also narrowed the `/projects` content to 1136 px.
- About eight stacked "final lock" blocks in `index.css` sized the header with `calc(100vw - Xrem)`. `100vw` includes the scrollbar, so the header did not line up with the content grid where classic scrollbars exist.

**Fix:** removed the public half of that rule; the Admin `portal-frame` and `portal-topbar` 1200 px frame is kept. Header and content now share one frame: `.public-site-header { padding-inline: var(--site-gutter) }`, and the shell has `width: 100%; max-width: var(--site-frame)` (76 rem). This is identical on every route and does not depend on the scrollbar.

## Ownership

`src/styles/premium-refinement.css` loads last and owns the public frame, header, button system, light-theme depth, project cards and filters, footer socials and motion. Every component rule is scoped to `.public-site-header`, `.public-main` or `.app-footer`; portals are not affected. Change these areas there instead of adding another "final lock" block to `index.css`.

## Changes

| Area | Summary |
|---|---|
| Header | Liquid glass with blur, saturation, inner highlight and blue glow (dark), with opaque fallbacks for missing blur support and `prefers-reduced-transparency`. Removed the opaque veil that hid the glass. `is-scrolled` state adds frost and depth with no geometry change. Blue active pill with identical item geometry in every state. 44 px theme switch. Pill CTAs. |
| Safari glass | `vite.config.js` gained `build.cssTarget` with real browsers. With only `es2020`, the minifier stripped `-webkit-backdrop-filter`: 6 kept before, 82 now. |
| Light theme | Blue-tinted canvas with ambient glows, tinted section bands on Home, a deep-navy free-demo band, glass cards with a restrained hover, and a tinted footer. |
| Buttons | Primary gradient, secondary glass (`btn-card`, `btn-glass`, `liquid-glass-button`), outline, ghost, icon, disabled, and compact/lg sizes, for public pages only. |
| Projects | "Case Study" and "Visit Site" labels; accessible names start with the visible label (WCAG 2.5.3) and name the project and site type; equal-width actions on one baseline; 16:10 thumbnails with a subtle zoom; refined filter toolbar. Destinations and analytics attributes are unchanged. |
| Footer | LinkedIn `#0A66C2`, GitHub `#24292F`, globe `#2563EB → #1D4ED8`, white icons, hover lift and focus ring, rebalanced columns. |
| Motion | Route fade only after in-app navigation (never on first load); portals keep a stable key and never remount. Smooth scrolling on public pages with `scroll-padding-top`; the old per-section `scroll-margin-top` values are neutralised so anchors are not offset twice. Hash links work after lazy routes load. Back-to-top button (hidden while the cookie banner is open). View Transitions theme crossfade. CSS scroll-driven reveals. All motion respects `prefers-reduced-motion`. |
| Accessibility | AA contrast for light-theme accent text, the demo chip, and the dark blog accent fills; label-in-name fixes on Home, Contact and Blog. |

## QA evidence

- `npx eslint .` passes; `npm test` 33/33; `npm run build` passes; `npm run seo:validate` passes (135 routes, 0 broken links).
- Header geometry: identical across 14 routes at 12 widths (320–1920) in both themes. The hamburger shows only below 1280 px. No page-level horizontal overflow. No JS errors.
- Interaction flows: 25/25. Keyboard order, focus ring, scrolled state, header stable during navigation, route fade, top-of-page reset, active pill, Live/Demo/search/industry filters and counts, 20 case-study links, 18 external links (new tab, `noopener`), equal card heights and action baseline, back-to-top, blog hash and Pricing builder offsets, theme switch and persistence, signed-out portal redirects, login shell, reduced motion.
- axe-core WCAG 2.2 AA on 10 routes × 2 themes × 2 widths: 36/40 clean. The remaining finding is the Services catalogue card link (see follow-ups).
- Lighthouse accessibility is 100 on Home, Projects, Contact and Pricing for both mobile and desktop (production Home was 96). Performance is on par with `main` when both are served from the same local server.
- Portal regression: Admin, Developer and Client routes rendered with every API request intercepted (no real data). 0 computed-style differences against production in both themes.

## Follow-ups

- Services catalogue cards: the whole card is one link with an `aria-label`, which triggers `label-content-name-mismatch`. This exists in production today. The proper fix is a stretched-link card (link on the title, CTA outside the name).
- Legacy gold eyebrow colours (`--gold-deep` / `--gold-bright`) remain on Pricing and Auth eyebrows. They pass contrast but are off-palette.
- `index.css` (~10k lines) still contains superseded header and button "final lock" blocks. A careful removal pass would reduce cascade risk.
- Role-based CRUD with real accounts was not re-run; this change does not touch API, auth or CRUD code.

## Rollback

Revert the merge commit on `main`; Vercel redeploys the previous build. No data, environment variables or backend changes are involved.
