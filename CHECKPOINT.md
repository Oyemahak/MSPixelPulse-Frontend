# CHECKPOINT — Premium UI/UX refinement (paused)

- **Paused:** 2026-10-25, at the owner's request ("SAVE CHECKPOINT & PAUSE")
- **Branch:** `feat/premium-glass-ui` (local only, never pushed). Marker branch `checkpoint/premium-ui-2026-10-25` points at the same commit.
- **Based on:** `origin/main` @ `28a468c` (Merge PR #11), which was production at the time.
- **Worktree:** `/Users/mahak/Documents/MSPixelPulse Web Solutions/MSPixelPulse-Frontend-premium-ui`
- **QA artifacts (not in git):** `/Users/mahak/Documents/MSPixelPulse Web Solutions/MSPixelPulse-Frontend-premium-ui-qa/`
  - `shots/before/`: production screenshots taken before any change (header, Projects, cards, footer, mobile, both themes)
  - `shots/local/`: this branch on localhost (partially reviewed)
  - `shots/ref-*.png`: Northstead Immigration reference
  - `build.log`: production build output for this commit
- **Status:** work in progress. Nothing merged, nothing deployed, no PR opened.

> Remove this file and `docs/checkpoints/premium-ui/` before opening the PR, or move them into the handoff docs.

---

## Repository state notes (read first)

1. **Unpushed commit on the main checkout:** `/Users/mahak/Documents/MSPixelPulse Web Solutions/MSPixelPulse-Frontend` is on `main` at `4e3ed25` ("fix: validate lead conversions and repair inquiry tracking routes"). That commit is **not on `origin/main`**, and local `main` is 26 commits behind. It was left untouched. Decide separately whether it should be rebased onto `origin/main` and PR'd. This work does **not** include it.
2. Other active worktrees (`-aurel-frame`, `-demo-ecosystem`, `demo-sync-frontend`, `restaurant-platform`, `wellness-v4-sync-frontend`) were not touched.
3. Production deploys automatically from GitHub `main` through the Vercel git integration (project `mspixelpulse-frontend`). Pushing this branch would create a Vercel **preview** deployment. That is why it has not been pushed.
4. Upstream tracking for this branch was removed on purpose, so a bare `git push` cannot target `main`.

---

## Root cause: header changed width between pages

Measured on production at 1440px: the header was **1216px on every route except `/projects`, where it was 1200px**. Its edges jumped 8px on each side when navigating there.

- Cause: commit `b21d08e` (Wellness V4 sync) added this rule in `src/styles/public-actions.css`:
  `.app-shell[data-wellness-project-sync="true"] .container-edge, … .public-header-shell { max-width: 1200px; }`
  `App.jsx` sets that attribute only on `/projects`, `/projects/ms-pixelpulse-wellness-studio` and `/admin/projects`. The same rule also shrank the `/projects` page container, so its content was 1136px wide instead of 1216px.
- Secondary cause: the header width came from `calc(100vw - Xrem)` across about 8 stacked "final lock" blocks in `index.css`. `100vw` includes the scrollbar, so on systems with classic scrollbars the header did not match the content grid.
- Fix: the public parts of that rule were removed (the Admin `portal-frame` and `portal-topbar` 1200px rules are kept). The header now uses a single frame token: `.public-site-header` gets `padding-inline: var(--site-gutter)`, and the shell gets `width: 100%; max-width: var(--site-frame)` (76rem). This matches `.container-edge` at every breakpoint and is independent of the scrollbar.
- Verified locally: identical width, height and left edge on `/ /projects /about /services /pricing /blog /contact /faq /login /404` at 1440, 1280, 1024 and 390px in both themes. At 1440px both the header and the content start at x=104.5 with a width of 1216.

---

## Completed (implemented, partially verified)

| Area | Change | Files |
|---|---|---|
| Header width | Root-cause fix above | `src/styles/public-actions.css`, `src/styles/premium-refinement.css` |
| Header glass | Translucent layered gradients, blur 18px + saturate 180%, inner highlights, blue ambient glow (dark); removed the opaque `::before` veil that hid the glass; opaque fallbacks for no-blur support and `prefers-reduced-transparency` | `premium-refinement.css` |
| Header scroll state | `is-scrolled` class (rAF-throttled passive listener) adds blur 26px and a deeper shadow; geometry unchanged | `AppHeader.jsx`, `src/hooks/useScrollThreshold.js` |
| Navigation | Semantic classes replace per-theme Tailwind ternaries. Every nav item has identical geometry in all states. Active item is a blue pill (border, tint, soft glow), replacing the old gold/beige pill. Theme switch is 44px with 36px options (44px on coarse pointers). Pill-shaped Portal login and Portal buttons. `aria-label="Main navigation"`. The duplicate centered mobile title is no longer a tab stop. | `AppHeader.jsx` |
| Mobile sheet | Aligned to the header frame (was double-padded); active link is a blue tint | `AppHeader.jsx` |
| Theme switching | View Transitions crossfade (280ms) with `flushSync`, so the snapshot shows the new palette; instant when unsupported, with reduced motion, or in a hidden tab | `src/lib/theme.js` |
| Route transitions | `<main>` is keyed by pathname on public routes, giving a 360ms fade/rise only after in-app navigation (not on first load, to protect LCP). Portals use a stable key, so they never remount. | `src/App.jsx` |
| Scrolling | Smooth scroll only on public pages (`html:has(.public-main)`) with reduced-motion respected; `scroll-padding-top` clears the header; hash links scroll to their target after lazy routes render; route changes jump to top instantly; `<main tabIndex=-1>` so the skip link and back-to-top can move focus | `App.jsx`, CSS |
| Back to top | Glass 44px button after 720px of scroll; hidden while the cookie banner is open | `src/components/layout/BackToTop.jsx` |
| Light theme | Blue-tinted canvas with ambient glows replaces the flat `#fff`; tinted full-bleed `section-band`s on Home (services, live work, process); deep-navy contrast band for the free-demo block; glass cards with a restrained hover lift; tinted footer | `premium-refinement.css`, `src/pages/Home.jsx` |
| Buttons | Shared system scoped to `.public-main` and `.app-footer` only (portals use `.btn` ~97 times and are untouched): primary gradient, secondary glass (`btn-card`, `btn-glass`, `liquid-glass-button`), outline, ghost, icon, disabled, and compact/lg sizes | `premium-refinement.css` |
| Project cards | Labels standardized to **Case Study** and **Visit Site**; descriptive aria-labels such as "View SAVORA case study" and "Visit SAVORA restaurant demo website (opens in a new tab)"; destinations and analytics attributes unchanged; equal-width two-column actions (`.has-two`), stacked below 360px; 16:10 thumbnails with a 1.04 hover zoom; "Case Study" label also used on Home, LocationPage and BlogPost cards | `src/pages/Projects.jsx`, `Home.jsx`, `LocationPage.jsx`, `BlogPost.jsx` |
| Card descriptions | Already 15–19 words from PR #11. No copy changed. | — |
| Filters | Glass toolbar, 44px controls, blue focus ring, gradient active segment | `premium-refinement.css` |
| Footer socials | LinkedIn `#0A66C2`, GitHub `#24292F` (lighter border in dark), globe `#2563EB → #1D4ED8`; white icons, hover lift and glow, focus ring; rebalanced columns, stronger headings, separated copyright row | `premium-refinement.css` |
| Scroll reveal | CSS scroll-driven animations (`animation-timeline: view()`), no JavaScript; unsupported browsers show content normally; off with reduced motion | `premium-refinement.css` |

## Test results for this commit

- `npx eslint .`: pass (0 problems)
- `npm test`: 33 / 33 pass
- `npm run build`: pass (143 routes metadata, 20 projects and 94 posts prerendered). Log saved in the QA folder as `build.log`.
- Header measurement script (`docs/checkpoints/premium-ui/qa-scripts/measure.mjs`): identical header on all 10 routes at 4 widths and 2 themes. No horizontal overflow on those routes.
- Visual review so far: the Projects page (light, 1440) and project cards (light) look correct: blue active pill, visible glass, equal-height cards, buttons on one baseline.
- **Not yet done:** full responsive matrix, dark-theme visual review, Lighthouse, keyboard and screen-reader pass, role-based portal regression, production verification.

---

## Known issues found before pausing (fix these first)

1. **Bug: the hamburger shows on desktop.** In `premium-refinement.css`, `html[data-theme] body .public-site-header .site-menu-button { display: inline-grid }` overrides Tailwind's `xl:hidden`. Fix by adding:
   ```css
   @media (min-width: 1280px) { html[data-theme] body .public-site-header .site-menu-button { display: none; } }
   ```
2. **The minifier strips `-webkit-backdrop-filter`.** The production CSS keeps only 6 of 92 prefixed declarations; the same happens on `main`. Safari 18 and later support the unprefixed property, but older Safari loses the glass. Investigate Vite's CSS minify targets (`build.cssTarget`) or the browserslist `defaults` query, then re-check `dist/assets/index-*.css`.
3. **Check:** faint text appears just below the filter bar in `shots/local/projects-light.png`. It is probably the "Refreshing published projects…" status caught mid-reveal. Confirm it is not a stray overlay.
4. **Check:** the free-demo navy band in light mode. Confirm the text inside `.demo-browser-preview` and the step icons stay readable.
5. **Check:** the mobile footer screenshot from production showed the skip link visible after pressing Escape (it is focus-related). Re-test with this branch.
6. `--surface` in the light `.public-main` scope changed from `#fff` to `rgba(255,255,255,.86)`. Scan forms and inputs that use `var(--surface)` for low contrast.

## Pending work (from the original brief)

- [ ] Fix issues 1–6 above
- [ ] Dark-theme review of every changed area
- [ ] Responsive matrix at 320, 375, 390, 393, 430, 600, 768, 1024, 1200, 1280, 1440 and 1920px for `/ /projects /about /services /pricing /blog /contact /login /404` in both themes: overflow, clipping, button wrapping, mobile menu, footer
- [ ] Typography pass (Phase 8): currently only nav, button and card text sizes; consider clamp() heading scale consistency
- [ ] Pricing, Services and About cards: hover and reveal are wired by class, but they still need a visual review
- [ ] Accessibility: keyboard order (header, theme switch, mobile focus trap, back-to-top), focus visibility in both themes, contrast of nav, buttons and footer, axe or Lighthouse a11y
- [ ] Lighthouse (performance, accessibility, best practices, SEO) on the preview, recording real numbers
- [ ] Regression: login and Portal entry (`reloadDocument` links), contact form submit path, filters and search counts, external project links, cookie preferences button, theme persistence across reload and login (`AccountThemeSync`), one Admin, Developer and Client route to confirm portals are unchanged
- [ ] After screenshots: run `shots.mjs <preview-url> after`
- [ ] Update `.agents/CHANGELOG.md` and handoff docs; remove `CHECKPOINT.md`
- [ ] Push, open PR, wait for approval, merge, verify production (only with explicit approval)

---

## Exact resume instructions

```bash
cd "/Users/mahak/Documents/MSPixelPulse Web Solutions/MSPixelPulse-Frontend-premium-ui"
git status                 # expect clean, on feat/premium-glass-ui
git log --oneline -2       # checkpoint commit on top of 28a468c
git fetch origin && git log --oneline HEAD..origin/main   # rebase if main moved

# node_modules is a symlink to the main checkout's node_modules
npx vite --port 5191 --strictPort      # dev server

# QA scripts: copy them out of the repo first (they write shots/ beside themselves)
mkdir -p /tmp/msp-qa && cp docs/checkpoints/premium-ui/qa-scripts/*.mjs /tmp/msp-qa/ && cd /tmp/msp-qa && mkdir -p shots/after shots/local
node measure.mjs http://localhost:5191          # header width per route/theme/width
node shots.mjs http://localhost:5191 local      # header/projects/cards/footer/mobile
node full.mjs http://localhost:5191 / light shots/local/home-full.png
node computed.mjs http://localhost:5191         # computed styles of key elements
```

The scripts load Playwright from `~/.npm/_npx/e41f203b7505f1fb/node_modules/playwright` (cached browsers are in `~/Library/Caches/ms-playwright`). If that cache is gone, use `npx -y playwright@1.61.1` instead.

Before release: `npx eslint . && npm test && npm run build`, then follow `.agents/DEPLOYMENT-STANDARDS.md`. Deploy only with explicit approval.
