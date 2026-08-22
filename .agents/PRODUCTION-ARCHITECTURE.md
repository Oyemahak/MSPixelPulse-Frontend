# MSPixelPulse Production Architecture

This file is a required source of truth for every coding agent working on MSPixelPulse.

## Production Runtime

- Public site: `https://mspixelpulse.com`
- Backend API: `https://api.mspixelpulse.com`
- Frontend hosting: Vercel
- Backend hosting: Vercel
- Structured application data: Google Sheets
- File/object storage: Google Drive
- Authentication: MSPixelPulse JWT/session logic backed by the `Users` Sheet
- Email delivery: Resend

MongoDB, Supabase, and Render are not production runtime providers. Do not add new production dependencies on them.

## Frontend Boundary

The browser must use the MSPixelPulse backend API for all persistent portal data and file authorization. The frontend must never receive Google OAuth client secrets, refresh tokens, service credentials, password hashes, or private Drive credentials.

Google Sheets and Google Drive are server-side providers. Frontend components must not call those APIs directly.

## Google Sheets Is The Application Database

The production spreadsheet is the durable structured-data store. Core tabs include Users, Projects, ProjectMembers, Requirements, Messages, Rooms, Threads, Invoices, Receipts, PortalNotifications, Sequences, Files, Leads, Tasks, Notifications, BlogComments, BlogReactions, BlogShares, BlogSubscribers, SiteContent, and SupportTickets.

Successful UI mutations must persist through the API and survive navigation, refresh, logout/login, a new browser session, and a new Vercel function instance. Local React state is never the durable source of truth.

## Google Drive Is The File Store

Managed private files are stored in Google Drive under server-controlled client/project folders. The frontend consumes backend-generated file URLs or authenticated proxy endpoints; it does not construct raw Drive URLs.

Expected managed hierarchy:

- MSPixelPulse production root
  - Client files
    - one managed folder per client/user
      - Profile
      - Documents
      - Requirements where applicable
  - Project files
    - one managed folder per project
      - Requirements
      - Invoices
      - Deliverables
      - Message Attachments
      - Uploads

## File Read Authorization

Private files must remain private.

The frontend may render/download a file only through a backend-authorized path, normally either:

1. a short-lived MSPixelPulse signed file-access URL scoped to exactly one Drive file; or
2. an authenticated backend file proxy that confirms the current user's role/ownership/project access.

Do not make Drive folders public to fix a browser access problem. A 401/403 must be fixed at the application authorization layer.

## Upload Authorization

Uploads must use backend authorization. Small files may use backend multipart upload. Larger files may use an authorized resumable Drive session returned by the backend. Invoice uploads are stricter: the frontend sends bounded chunks only to the MSPixelPulse API, which relays them to Google Drive; Google upload session URLs and privileged storage details are never exposed to browser code.

The frontend must send the actual purpose/project/user context expected by the API and must complete the upload flow exactly as specified by the backend.

## Authentication / Session Contract

The backend now centralizes session validation through `requireAuth`, including `/api/auth/me`.

Frontend requirements:

- treat backend JWT/account state as authoritative
- after a password change, expect previous JWTs to be invalid because `authVersion` changes
- do not keep a stale session alive locally after backend rejection
- do not infer authorization only from role labels stored in client state
- never convert a backend 5xx/provider failure into an "invalid credentials" message
- after login, profile/account UI should reflect the authoritative `/api/auth/me` user

## CRUD Contract

Every action exposed in the UI must actually work against persistent production data.

### Admin

Admin UI must support every legitimate administrative operation exposed by the product, including normal-user editing, allowed role/status updates, activation/suspension, password reset/set, project assignment, project CRUD, billing/invoice CRUD, requirements/files, project rooms/messages, support, leads, tasks, and content management.

Protected super-admin safeguards remain mandatory for destructive operations.

### Client

Client UI must support every promised operation on the client's own account and assigned projects, including profile persistence, avatar upload/replace/delete, requirements/files, billing visibility, project-room messages, message attachments, and support flows.

### Developer

Developer UI must support every promised operation on assigned projects, including permitted project updates, project rooms/messages, attachments, evidence/deliverables, and other role-authorized workflows.

Disabled controls must reflect a real product restriction. Do not leave controls disabled because an API route is accidentally returning 403.

## Verified Production Role Baseline — 2026-08-15

A disposable production E2E run completed with 35 checks passed, 0 failed, and complete cleanup. Verified backend behavior relevant to the frontend:

- protected real Admin used only to bootstrap/clean disposable Admin
- disposable Admin creation/login
- disposable Developer and Client creation
- Admin list/detail reads
- Developer/Client identity updates
- password changes and fresh login/session
- Admin/Developer/Client `/api/auth/me` identity verification
- profile persistence for all three roles
- Developer/Client denial from Admin APIs
- disposable Admin access to Admin APIs
- Developer role change/restoration
- Client suspension/reactivation persistence
- permanent deletion and absence verification for all disposable accounts

Account/profile/admin UI changes must preserve this baseline.

## UI Error Contract

- 401: session/authentication problem; handle through auth/session UX.
- 403: authenticated but not authorized; do not silently present stale detail data beside an access error.
- 404: resource no longer exists or is intentionally hidden.
- 409: conflict such as duplicate data or invalid state transition.
- 429: rate-limited request; avoid immediate repeated retries.
- 502/503/504: server/provider/infrastructure problem; show a useful retry-safe message.

After a successful mutation, refresh the authoritative API state or update the query/cache deterministically so the UI matches production data.

## Performance / Quota Requirement

Google Sheets can be latency- and quota-sensitive under bursty API traffic. The frontend must not create unnecessary pressure:

- avoid duplicate API calls caused by repeated mounts/effects
- avoid aggressive polling
- avoid requesting the same list separately for each child row when a parent response can be reused
- refresh only the authoritative data affected by a mutation
- prevent retry storms on 429/5xx
- preserve responsive perceived performance with loading/skeleton/error states without hiding real backend latency

## Required Role Verification

Before declaring portal work complete, test relevant workflows end-to-end for Admin, Client, and Developer.

Verify as applicable:

- login/logout/session refresh
- list/detail reads
- create/update/delete
- refresh persistence
- logout/login persistence
- authorization boundaries
- profile changes
- password actions
- avatar upload/replace/delete
- project CRUD and assignments
- requirements/files
- generated invoice PDF creation, existing invoice upload, read/download, metadata/status/payment updates, delete/re-upload, and client isolation
- persisted login/heartbeat/logout presence with explicit offline precedence and truthful last-activity display
- rooms/messages persistence
- message attachments
- support/task/content flows

For file workflows verify upload, render/download, refresh persistence, authorization failure for the wrong user, replacement, and deletion.

For invoice generation verify both Letter and A4 sizing, multi-page line items, totals/discount/optional-tax math, payment balances, client-safe fields, and the final rendered PDF. Tax defaults must remain off unless the business owner deliberately configures them.

The real protected production Admin must never be used as a mutation test subject. Use disposable accounts and fully clean them up.

## Responsive/UI Requirement

Portal functionality must remain usable on desktop, tablet, and mobile in both light and dark themes. Fixing backend behavior must not regress established layout or shared styling.

The central portal productivity layer is `src/portals/css/portal-productivity.css`. Maintain a system-font type scale with body weight 400, labels/actions 500, headings no heavier than 600, mobile form text at least 16px where needed to prevent zoom, visible focus, 44px coarse-pointer targets, reduced motion, and no horizontal body overflow at 360, 390, 430, 768, 1024, 1280, and 1440px.

## Notification And Receipt Boundaries

- Frontend notification polling must be bounded and visibility-aware; do not add per-row requests or multiple independent pollers.
- Notification action URLs are role-specific deep links and may never route a user into another role's portal.
- Payment creation requires an idempotency key and the dedicated payment API. Retrying a timed-out request must reuse the same key.
- Receipt PDFs remain private Drive files accessed through the backend-authorized read/download path.
- Receipt numbers, payment IDs, and original snapshots are immutable. Void is a retained status with an audit reason, not deletion.

## Deployment Rules

- Run frontend lint and build before deploy.
- Verify the production frontend points to the current backend API.
- Test changed workflows against the deployed API after deployment.
- Do not add Supabase, MongoDB, Render, or Google secrets to frontend environment variables.
- After auth/CRUD changes, verify the relevant disposable-role workflow rather than relying only on a green build.

## Agent Behavior

Every agent must inspect this file before changing portal CRUD, authentication, authorization, files, persistence, API integration, role behavior, or deployment.

A green build is not sufficient evidence that CRUD works. Agents must verify the changed workflow with the appropriate role and persistent backend state.
