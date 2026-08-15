# AGENTS.md

This is the required entry point for Codex and future AI coding agents working in MSPixelPulse Frontend.

## First Steps
1. Read [.agents/README.md](.agents/README.md).
2. Read [.agents/SHARED-CONTEXT.md](.agents/SHARED-CONTEXT.md).
3. Read [.agents/PRODUCTION-ARCHITECTURE.md](.agents/PRODUCTION-ARCHITECTURE.md) before any work touching portal CRUD, authentication, authorization, files, persistence, API integration, roles, or deployment.
4. For UI work, read [.agents/UI-CONSISTENCY-STANDARDS.md](.agents/UI-CONSISTENCY-STANDARDS.md).
5. Identify relevant specialist agents from [.agents/AGENT-ROSTER.md](.agents/AGENT-ROSTER.md).
6. Follow the orchestrator process and relevant workflow.
7. Protect production functionality and preserve working behavior.

## Non-Negotiable Rules
- Never expose secrets, tokens, cookies, connection strings, Google OAuth credentials, password hashes, or private client data.
- Never fabricate business claims, testimonials, awards, rankings, statistics, or guaranteed outcomes.
- Never run destructive actions without explicit approval, backup, and rollback notes.
- Do not deploy automatically unless the user explicitly requests deployment.
- Do not mark work complete without evidence from relevant checks.
- Inspect existing architecture before changing code.
- The browser must use the MSPixelPulse API for persistent data and file authorization; never call Google Sheets/Drive directly with secrets.
- Do not add Supabase, MongoDB, Render, or Google secret credentials to frontend runtime configuration.
- Every action exposed by Admin, Client, or Developer UI must work against persistent backend state or be intentionally unavailable by product policy.
- Do not leave a control disabled or show stale resource data merely because an authorization/API bug exists; fix the contract.
- Login, Register, NotFound, and other public-facing routes must use the approved shared public shell. Do not duplicate the global header, footer, theme control, copyright, or main landmark without a documented exception.
- UI work must pass light and dark theme review plus the responsive evidence matrix in `.agents/UI-CONSISTENCY-STANDARDS.md`.
- A green lint/build is not sufficient evidence for portal CRUD; run role-based workflow verification for changed features.
- Prefer scoped, maintainable changes over broad rewrites.
- Run relevant tests and document any gaps.
- Complete handoff documentation for future agents.

## Repository Focus
React/Vite frontend, public website, Admin/Client/Developer portals, persistent API-backed CRUD, secure file flows, Vercel deployment, and frontend API integration.

## Completion Evidence
Final responses should include files changed, checks run, role/workflow verification, risks, unresolved items, and next steps.
