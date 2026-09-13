# Decision Record

## Date

2026-09-12

## Decision

Keep release-reviewed prices and builder rules in one frontend configuration and calculate only transparent planning estimates. Reuse the existing durable backend contact endpoint for the quote handoff; do not create a second lead system or change protected portal workflows.

## Context

The production pricing page needed clearer redesign, Moodle, maintenance, and website starting prices plus a multi-step builder. Builder selections must survive a refresh, reach the existing inquiry flow, remain readable in the notification email, and avoid presenting custom work as a guaranteed total.

## Options considered

1. Hard-code prices in each pricing card and again in the builder.
2. Add a new backend estimator and lead endpoint.
3. Use a central frontend pricing configuration, validated URL identifiers, session-scoped notes, and the existing persisted lead endpoint.

## Evidence

The backend `POST /api/contact` route accepts the existing structured message, persists a Lead for the admin portal, and sends the existing notifications. The consent-aware analytics helper supports explicit events, and the estimator itself remains frontend-only. The portfolio API can remain authoritative for published text while curated local screenshots and verified live destinations remain authoritative for release-critical media and links.

## Consequences

- Fixed, starting, hourly, and custom pricing modes share one calculation path.
- Custom development and hourly maintenance never display a misleading precise project total.
- Structural selections are encoded as validated identifiers in the contact URL; optional notes remain in session storage and are restored only for the matching structural selection.
- The persisted admin lead and notification emails receive the same readable pricing breakdown without changing the backend contract.
- Persisted pricing content can still edit safe card copy, while prices, active keys, and required boundaries stay release-managed in the central configuration.
- Published portfolio content continues to refresh from the API, while stale remote image hosts and destinations cannot replace tested local captures and live links.

## Reversibility

The feature is isolated to pricing data, a builder component and helper, the public contact handoff, and portfolio normalization. It can be removed without changing authentication, billing, database schemas, or API contracts.

## Reviewer

Production build, automated tests, responsive browser QA, lead-path verification, metadata inspection, and live Vercel verification are required before release completion.
