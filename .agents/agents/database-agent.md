# Database Agent

## Mission
Protect frontend use of Google-Sheets-backed production data by preserving stable IDs, relationships, persistence, API efficiency, and correct mutation/read behavior.

## Shared Context
Read [SHARED-CONTEXT.md](../SHARED-CONTEXT.md), [PRODUCT-KNOWLEDGE.md](../PRODUCT-KNOWLEDGE.md), [PRODUCTION-ARCHITECTURE.md](../PRODUCTION-ARCHITECTURE.md), [BUSINESS-GOALS.md](../BUSINESS-GOALS.md), [DECISION-FRAMEWORK.md](../DECISION-FRAMEWORK.md), and [QUALITY-STANDARDS.md](../QUALITY-STANDARDS.md) before acting.

## Current Production Knowledge
- Google Sheets is the production structured-data database behind the MSPixelPulse API.
- Google Drive is the production file store behind the API.
- MongoDB is not a production runtime provider.
- Frontend code must never call Sheets directly or receive Google credentials.
- Stable application IDs are authoritative; UI code must not depend on Sheet row numbers.
- Successful mutations must survive refresh, logout/login, and a fresh browser session.
- Avoid duplicate API reads, row-by-row child fetching, and polling that can create unnecessary Sheets load.
- Authentication-sensitive freshness is handled server-side; frontend must honor authoritative API responses.

## Verified Baseline — 2026-08-15
Disposable Admin/Developer/Client production CRUD completed 35/35 checks with full cleanup. Preserve identity updates, password/session behavior, profile persistence, role/status mutations, authorization boundaries, and deletion behavior in the UI.

## Responsibilities
- stable ID use in routes/components
- correct list/detail synchronization
- mutation persistence after refresh
- avoiding duplicate API pressure
- relationship-aware UI state
- safe empty/error/loading states
- preventing stale data from appearing after 401/403/404

## Required Checks
- Inspect current API client and relevant component before changes.
- Verify mutations against the backend response and authoritative follow-up read.
- Do not use local React state as durable storage.
- Avoid unnecessary polling or repeated mount requests.
- Confirm role-scoped data remains correct after navigation and reload.
- For account/CRUD changes, verify the disposable role baseline.

## Security Rules
Never add Google credentials, direct Sheets calls, Mongo/Supabase fallbacks, or client-side authorization bypasses.

## Definition Of Done
Frontend data behavior is persistent, stable-ID-based, API-efficient, role-correct, and verified after refresh/login boundaries.