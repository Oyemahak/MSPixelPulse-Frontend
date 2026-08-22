# MSPixelPulse Portal Design System

**Project:** MSPixelPulse Portal  
**Updated:** 2026-08-22  
**Direction:** calm productivity software, MSPixelPulse branded, Google Workspace-inspired ergonomics without copying Google branding

## Source of truth

The shared implementation lives in `src/portals/css/portal-productivity.css`, loaded by `PortalShell`. Page-specific CSS must not override these typography, spacing, focus, theme, or responsive contracts without a documented exception.

## Typography

- Font stack: `Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.
- Body/forms: 15-16px, weight 400, line height 1.5-1.6.
- Navigation, labels, buttons and table headers: weight 500; buttons may use 600 only for strong primary emphasis.
- Card and section titles: weight 600.
- Page titles: 22-28px responsive, weight 600, line height at least 1.25.
- Monetary/KPI values: weight 600 maximum.
- Metadata: 12-13px only. Do not use body text below 14px.
- `font-black`, `font-extrabold`, routine 700-900 weights, oversized application headings, and compressed line height are forbidden.

## Layout and spacing

- Rhythm: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40px.
- Content max width: 1480px; sidebar: 248px; topbar: 72px desktop and 64px mobile.
- Page padding: 16-32px responsive; card padding: 16-24px; standard control height: 42px.
- Touch targets: at least 44x44px on coarse pointers with at least 8px between adjacent actions.
- Cards use one subtle border, 12-14px radius, and minimal shadow. Avoid unnecessary nested cards.
- Tables use readable 14px data, 13px medium headers, subtle separators, comfortable rows, and intentional mobile stacking or controlled scrolling.

## Color and theme

- Preserve the existing MSPixelPulse light/dark theme tokens.
- Primary ink/navy: `#0f172a`; action blue: `#2563eb`/theme equivalent; success green only for confirmed states; destructive red only for destructive states.
- Light surfaces: near-white with slate borders. Dark surfaces: neutral navy/charcoal with visible borders.
- Text contrast must meet WCAG AA. Unread, selected, status, and error states must not depend on color alone.

## Interaction

- Use the existing React, React Router and icon systems; no new animation or state library.
- Transitions: 150-220ms for hover/focus/panels. No decorative choreography in portals.
- All icon-only controls require accessible names. Preserve visible focus rings, Escape dismissal, focus return, reduced motion, and route-deep-link behavior.
- Notifications use a compact list, persistent unread state, explicit read labels, and a latest-items bell panel. Opening the bell never marks everything read.
- Forms use visible labels, inline errors, progressive disclosure, 40-44px controls, and single-column layouts on narrow screens.

## Responsive verification

Review light and dark themes at 1440, 1280, 1024, 768, 430, 390 and 360px widths. Confirm no page-level overflow, usable navigation/drawers, readable long email/project/invoice/receipt values, keyboard-safe focus, and intentional table/card behavior.

## Rejected generated recommendation

UI/UX Pro Max also returned an “Exaggerated Minimalism” marketing pattern with 900-weight oversized type. It is explicitly rejected for this authenticated productivity application because it conflicts with the production specification and readability goals. The accessibility, touch, focus, responsive, restrained-motion, and system-typography recommendations remain adopted.
