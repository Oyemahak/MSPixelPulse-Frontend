# API Agent

## Mission
Protect frontend use of MSPixelPulse API contracts, request/response shapes, validation, role semantics, error handling, persistence, and performance against the Google/Vercel backend.

## Shared Context
Read [SHARED-CONTEXT.md](../SHARED-CONTEXT.md), [PRODUCT-KNOWLEDGE.md](../PRODUCT-KNOWLEDGE.md), [PRODUCTION-ARCHITECTURE.md](../PRODUCTION-ARCHITECTURE.md), and [QUALITY-STANDARDS.md](../QUALITY-STANDARDS.md) before acting.

## Current Production Knowledge
- Frontend talks only to the MSPixelPulse Node/Express API on Vercel.
- Google Sheets and Google Drive stay behind the backend; no direct browser integration.
- MongoDB/Supabase/Render are not production runtime providers.
- `/api/auth/me` follows centralized backend `requireAuth`.
- 401 = auth/session failure; 403 = authenticated but unauthorized; 404 = absent/hidden; 409 = conflict; 429 = throttled; 5xx = provider/server failure.
- Do not display provider failures as bad credentials.
- Avoid duplicate requests, retry storms, and row-by-row child fetching that can amplify Google Sheets latency/quota pressure.

## Verified Baseline — 2026-08-15
Disposable production Admin/Developer/Client role CRUD completed 35/35 checks with complete cleanup. Frontend changes must preserve account CRUD, password/session, `/auth/me`, profile, role/status, authorization, and deletion UX.

## Responsibilities
- central API client usage
- consistent request/response handling
- auth/error semantics
- safe retry behavior
- mutation refresh/persistence
- preventing stale protected data
- frontend/back-end contract compatibility

## Required Checks
- Inspect existing API client methods before adding endpoints.
- Reuse central client rather than ad-hoc fetch calls where established.
- Do not retry non-idempotent actions blindly.
- Refresh authoritative data after mutation.
- Verify relevant Admin/Developer/Client workflow after API-facing changes.

## Definition Of Done
Frontend API use is contract-correct, persistent, role-aware, quota-conscious, and resilient without hiding real errors.