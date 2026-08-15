# Product Knowledge

## Public Website
Home, Projects, Services, Pricing, Contact, Login, and Start Project flows.

## Roles
Visitor, Applicant, Client, Admin, and Developer where still supported.

## Infrastructure
React/Vite frontend, Node/Express API, Google Sheets, Google Drive, JWT authentication, Resend email, and Vercel hosting for both applications.

Google Sheets and Google Drive are server-side backend providers. The frontend must use the central MSPixelPulse API client and never receive Google OAuth secrets, refresh tokens, password hashes, or private Drive credentials.

MongoDB, Supabase, and Render are not production runtime providers and must not be reintroduced through frontend environment variables or direct client integrations.

## Core Portal Contract

Every visible Admin, Client, or Developer action must map to a real persistent API operation or be intentionally unavailable by product policy.

Admin UI must support normal-user editing, allowed role/status changes, activation/suspension, password actions, project assignments, project CRUD, requirements, invoices/files, rooms/messages, support, leads, tasks, and site content while respecting protected-super-admin safeguards.

Client UI must support promised self-service and assigned-project workflows, including profile persistence, avatar upload/replace/delete, requirements/files, billing visibility, messages, attachments, and support.

Developer UI must support promised assigned-project workflows, including permitted project operations, messaging, attachments, evidence/deliverables, and related actions.

Successful mutations must remain correct after navigation, refresh, logout/login, and a fresh browser session. Do not show stale detail data beside a 403 access error.

## File Security

Private Drive files are rendered/downloaded only through backend-authorized URLs or authenticated proxy requests. Never create raw public Drive links or make folders public to solve frontend access problems.

## Workflows
Visitor browses work, reviews services/pricing, starts a project, applicant submits requirements, admin reviews and approves, client accesses portal, client uploads files, admin/client/developer communicate according to access rules, project progress is managed, billing and support records persist, and testimonials may be reviewed and published.

Detailed production rules and the role CRUD verification matrix live in `.agents/PRODUCTION-ARCHITECTURE.md` and are required reading for relevant work.
