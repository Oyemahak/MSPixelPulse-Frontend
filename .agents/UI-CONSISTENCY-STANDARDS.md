# UI Consistency Standards

These rules apply to every public page, authentication route, error state, and role-based portal.

## Shell Ownership

- Public routes, including Login, Register, and NotFound, use the shared `AppHeader`, `AppFooter`, theme provider, skip link, and main landmark owned by `src/App.jsx`.
- Public page components must not render a second header, footer, theme switch, copyright block, or `main` landmark without a documented architecture exception.
- Admin, developer, and client routes use `PortalShell`. Portal pages must not copy the public shell or create role-specific shell variants.
- A valid 404 fallback is required and must look like the current public website in both themes.

## Theme Parity

- Every UI change must be reviewed in light and dark themes. A one-theme fix is incomplete.
- Components inherit shared theme tokens. Avoid hardcoded page-level text or background colors when a token exists.
- Dark surfaces remain neutral black/charcoal. Light surfaces use the approved refractive glass language while keeping text and icons readable.
- Theme selection must persist through navigation and reload without duplicate theme controls on a page.

## Liquid Glass Recipe

- Structural glass combines a translucent fill, visible subtle border, inner top highlight, restrained shadow, and both `backdrop-filter` and `-webkit-backdrop-filter`.
- Nested utility controls use lighter glass and smaller shadows than structural cards.
- Inputs retain a visible neutral border and must not disappear into the surrounding glass.
- Always provide an opaque readable fallback when backdrop blur is unavailable or reduced transparency is requested.
- Glass is a hierarchy tool, not decoration for every nested element.

## Buttons And Icon Controls

- Button copy names the action and destination: prefer `Open secure portal`, `Browse website projects`, or `Message Alex` over `Submit`, `Website`, `Open`, or `Toggle`.
- Use icon plus text when the action may be unfamiliar. Icon-only controls are reserved for familiar compact actions.
- Every icon-only button or link needs a contextual `aria-label`; `title` may provide a pointer tooltip but is not the accessible name.
- Decorative icons use `aria-hidden="true"`. Toggles expose `aria-pressed`, disclosure buttons expose `aria-expanded`, and non-submit buttons declare `type="button"`.
- Interactive targets are at least 44 by 44 CSS pixels on coarse pointers. Disabled controls must look and behave disabled.

## Responsive And Visual Evidence

- Review at 1440x900, 1280x800, 1024x768, 768x1024, 430x932, 390x844, and 360x800, plus one mobile landscape size when the layout is complex.
- Verify no page-level horizontal overflow, usable forms and drawers, readable headings, non-overlapping sticky elements, and safe keyboard focus.
- Minimum public shell routes are `/`, `/login`, `/register`, and an invalid URL. Minimum portal coverage is one representative admin, developer, and client route.
- Record route, theme, viewport, and interaction state in the QA handoff rather than reporting only that the page looks good.
