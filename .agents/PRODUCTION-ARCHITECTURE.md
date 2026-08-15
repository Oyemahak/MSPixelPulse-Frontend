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

The production spreadsheet is the durable structured-data store. Core tabs include Users, Projects, ProjectMembers, Requirements, Messages, Rooms, Threads, Invoices, Files, Leads, Tasks, Notifications, BlogComments, BlogReactions, BlogShares, BlogSubscribers, SiteContent, and SupportTickets.

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

Uploads must use backend authorization. Small files may use backend multipart upload. Larger files may use an authorized resumable Drive session returned by the backend.

The frontend must send the actual purpose/project/user context expected by the API and must complete the upload flow exactly as specified by the backend.

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

## UI Error Contract

- 401: session/authentication problem; handle through auth/session UX.
- 403: authenticated but not authorized; do not silently present stale detail data beside an access error.
- 404: resource no longer exists or is intentionally hidden.
- 409: conflict such as duplicate data or invalid state transition.
- 5xx: server/provider problem; show a useful retry-safe message.

After a successful mutation, refresh the authoritative API state or update the query/cache deterministically so the UI matches production data.

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
- invoice upload/read/status/delete/re-upload
- rooms/messages persistence
- message attachments
- support/task/content flows

For file workflows verify upload, render/download, refresh persistence, authorization failure for the wrong user, replacement, and deletion.

## Responsive/UI Requirement

Portal functionality must remain usable on desktop, tablet, and mobile in both light and dark themes. Fixing backend behavior must not regress established layout or shared styling.

## Deployment Rules

- Run frontend lint and build before deploy.
- Verify the production frontend points to the current backend API.
- Test changed workflows against the deployed API after deployment.
- Do not add Supabase, MongoDB, Render, or Google secrets to frontend environment variables.

## Agent Behavior

Every agent must inspect this file before changing portal CRUD, authentication, authorization, files, persistence, API integration, role behavior, or deployment.

A green build is not sufficient evidence that CRUD works. Agents must verify the changed workflow with the appropriate role and persistent backend state.
