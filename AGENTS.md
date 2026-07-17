# AGENTS.md

This is the required entry point for Codex and future AI coding agents working in MSPixelPulse Frontend.

## First Steps
1. Read [.agents/README.md](.agents/README.md).
2. Read [.agents/SHARED-CONTEXT.md](.agents/SHARED-CONTEXT.md).
3. For UI work, read [.agents/UI-CONSISTENCY-STANDARDS.md](.agents/UI-CONSISTENCY-STANDARDS.md).
4. Identify relevant specialist agents from [.agents/AGENT-ROSTER.md](.agents/AGENT-ROSTER.md).
5. Follow the orchestrator process and relevant workflow.
6. Protect production functionality and preserve working behavior.

## Non-Negotiable Rules
- Never expose secrets, tokens, cookies, connection strings, or private client data.
- Never fabricate business claims, testimonials, awards, rankings, statistics, or guaranteed outcomes.
- Never run destructive actions without explicit approval, backup, and rollback notes.
- Do not deploy automatically unless the user explicitly requests deployment.
- Do not mark work complete without evidence from relevant checks.
- Inspect existing architecture before changing code.
- Login, Register, NotFound, and other public-facing routes must use the approved shared public shell. Do not duplicate the global header, footer, theme control, copyright, or main landmark without a documented exception.
- UI work must pass light and dark theme review plus the responsive evidence matrix in `.agents/UI-CONSISTENCY-STANDARDS.md`.
- Prefer scoped, maintainable changes over broad rewrites.
- Run relevant tests and document any gaps.
- Complete handoff documentation for future agents.

## Repository Focus
React/Vite frontend, public website, role-based portals, Vercel deployment, and frontend API integration.

## Completion Evidence
Final responses should include files changed, checks run, risks, unresolved items, and next steps.
