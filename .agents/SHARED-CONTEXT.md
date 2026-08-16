# Shared Context

MSPixelPulse is a Toronto, Ontario web agency project focused on professional, responsive, business-focused websites and persistent client/project workflows.

Current production site: https://mspixelpulse.com
Current backend: https://api.mspixelpulse.com

Repository focus: React/Vite frontend, public website, Admin/Client/Developer portals, Vercel deployment, secure backend API integration, and reliable persistent CRUD.

## Current Production Source Of Truth

- Google Sheets is the structured application database behind the API.
- Google Drive is the managed private file store behind the API.
- Vercel hosts both frontend and backend.
- Resend handles configured transactional email.
- MongoDB, Supabase, and Render are not production runtime providers and must not be reintroduced through frontend code or environment variables.
- The browser must never receive Google OAuth secrets, refresh tokens, password hashes, client secrets, or private Drive credentials.
- Private file access must go through backend-authorized proxy/signed flows.

## Verified Production Behavior — 2026-08-15

A disposable production role-CRUD E2E run completed with 35 checks passed, 0 failed, and complete cleanup. Verified behavior includes:

- disposable Admin/Developer/Client creation
- Admin list/detail reads
- normal-user identity updates
- password changes and fresh re-login
- `/api/auth/me` identity verification for Admin, Developer, and Client
- profile persistence for all three roles
- Developer/Client denial from Admin APIs
- disposable Admin access to Admin APIs
- Developer role change/restoration
- Client suspension/reactivation persistence
- permanent deletion and post-delete verification

Frontend agents should treat this as the current minimum account/role regression baseline.

## Frontend Auth Rules

- `/api/auth/me` is served through the centralized backend `requireAuth` path.
- Password changes invalidate older JWTs through `authVersion`; frontend must accept that a fresh login/session token is required.
- Do not implement local authorization shortcuts. Role/account/project access is authoritative on the backend.
- A 401 means authentication/session failure; 403 means an authenticated user lacks permission; 5xx indicates backend/provider availability problems.
- Do not show stale user/project data beside an access error.

## Performance Rules

Google Sheets is durable backend storage and can be quota/latency sensitive under bursts. Frontend work should:

- avoid duplicate API requests on mount
- avoid unnecessary polling
- reuse already-fetched list/detail state where safe
- refresh authoritative state after successful mutations
- avoid retry storms
- treat transient 429/502/503/504 as temporary infrastructure signals only where retry is safe

All agents must read `.agents/PRODUCTION-ARCHITECTURE.md` and `.agents/PRODUCT-KNOWLEDGE.md` before changing portal CRUD, authentication, authorization, files, persistence, API integration, role behavior, or deployment.

Agents must protect production behavior, inspect existing files first, preserve responsive/light/dark UI behavior, avoid secrets, verify role boundaries and persistence after refresh/logout/login, and communicate truthfully.