# Product Knowledge

## Public Website
Home, Projects, Services, Pricing, Contact, Login, and Start Project flows.

## Roles
Visitor, Applicant, Client, Admin, and Developer where supported by product policy.

## Production Infrastructure
React/Vite frontend, Node/Express API, Google Sheets, Google Drive, JWT authentication, Resend email, and Vercel hosting for both applications.

Google Sheets and Google Drive are server-side backend providers. The frontend must use the central MSPixelPulse API client and never receive Google OAuth secrets, refresh tokens, password hashes, client secrets, or private Drive credentials.

MongoDB, Supabase, and Render are not production runtime providers and must not be reintroduced through frontend environment variables or direct client integrations.

## Core Portal Contract

Every visible Admin, Client, or Developer action must map to a real persistent API operation or be intentionally unavailable by product policy.

Admin UI must support normal-user editing, allowed role/status changes, activation/suspension, password actions, project assignments, project CRUD, requirements, invoices/files, rooms/messages, support, leads, tasks, and site content while respecting protected-super-admin safeguards.

Client UI must support promised self-service and assigned-project workflows, including profile persistence, avatar upload/replace/delete, requirements/files, billing visibility, messages, attachments, and support.

Developer UI must support promised assigned-project workflows, including permitted project operations, messaging, attachments, evidence/deliverables, and related actions.

Successful mutations must remain correct after navigation, refresh, logout/login, and a fresh browser session. Do not show stale detail data beside a 401/403 error.

## Verified Role CRUD Baseline — 2026-08-15

A disposable production E2E run completed with 35 passed checks, 0 failures, and complete cleanup. The frontend can rely on the following backend account baseline:

- disposable Admin, Developer, and Client creation
- Admin user list/detail reads
- identity updates for normal users
- password updates and fresh login
- `/api/auth/me` identity for all three roles
- profile persistence for all three roles
- Developer/Client denial from Admin APIs
- Admin access to Admin APIs
- Developer role change/restoration
- Client suspension/reactivation persistence
- permanent deletion with post-delete verification

When changing account/profile/admin UI, preserve this behavior and verify the relevant UI against it.

## Authentication And Error Contract

- The backend centralizes auth through `requireAuth`; `/api/auth/me` uses that path.
- Password changes invalidate previous JWTs through `authVersion`; frontend must handle required re-authentication cleanly.
- Frontend role checks are presentation helpers only; backend authorization is authoritative.
- 401: authentication/session failure.
- 403: authenticated but not authorized.
- 404: resource absent/hidden.
- 409: conflicting state/data.
- 429: throttled request; avoid retry storms.
- 5xx: server/provider failure; show a useful retry-safe state rather than blaming user credentials.

## Performance Contract

Google Sheets is the durable backend data store and can show latency under bursty traffic. Frontend agents must minimize avoidable API pressure:

- avoid duplicate mount requests
- avoid aggressive polling
- consolidate list/detail reads where practical
- refresh authoritative API state after mutations
- keep local state synchronized without treating it as durable storage
- use bounded, user-safe retries only when an operation is idempotent or the API contract makes retry safe

## File Security

Private Drive files are rendered/downloaded only through backend-authorized URLs or authenticated proxy requests. Never create raw public Drive links or make folders public to solve frontend access problems.

Small uploads may use the API multipart flow within platform limits. Larger uploads may use backend-authorized resumable Drive sessions. Invoice files use the dedicated backend relay endpoints so the browser communicates only with the MSPixelPulse API and never receives a Google upload URL. The frontend must send the required user/project/purpose metadata and complete the flow exactly as defined by the API.

## Testing Rule

A green lint/build is not enough for portal work. For changes affecting roles, auth, persistence, files, or CRUD, verify the corresponding Admin/Developer/Client flow against the deployed API and confirm state after refresh/logout/login.

The real protected production Admin must never be mutated as a test subject. Use disposable test accounts and clean them up.

## Workflows
Visitor browses work, reviews services/pricing, starts a project, applicant submits requirements, admin reviews and approves, client accesses portal, client uploads files, admin/client/developer communicate according to access rules, project progress is managed, billing and support records persist, and testimonials may be reviewed and published.

Detailed production rules live in `.agents/PRODUCTION-ARCHITECTURE.md` and are required reading for relevant work.
