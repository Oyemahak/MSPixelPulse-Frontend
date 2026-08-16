# Knowledge Update Protocol

1. Inspect repository files first.
2. Read `.agents/SHARED-CONTEXT.md`, `.agents/PRODUCT-KNOWLEDGE.md`, and `.agents/PRODUCTION-ARCHITECTURE.md` before any work affecting portal behavior, auth, data, files, performance, API integration, or deployment.
3. Treat those three files as inherited current knowledge for every specialist agent in `.agents/agents/`.
4. For UI work also read `.agents/UI-CONSISTENCY-STANDARDS.md`.
5. Use approved documentation and verified sources; do not treat assumptions as facts.
6. Record durable new decisions/risks/rejected patterns/reusable patterns in the repository knowledge files when present.
7. Include date, source, decision, evidence, affected areas, confidence, and reviewer for durable knowledge updates.
8. Do not silently overwrite previous decisions; supersede them explicitly with evidence.
9. Do not store secrets, credentials, password hashes, OAuth refresh tokens, or private client data.
10. Require human review for major architectural or business decisions.
11. Current production provider truth is Google Sheets + Google Drive behind the API, Vercel hosting, and Resend email.
12. MongoDB, Supabase, and Render are historical/non-production runtime references; never revive them from stale agent instructions or frontend env configuration.
13. Preserve the verified 2026-08-15 disposable role CRUD baseline: 35 passed, 0 failed, full cleanup.
14. Frontend auth/session UX must honor centralized backend `requireAuth`, `authVersion` invalidation, and authoritative API state.
15. Avoid duplicate API reads, polling, and retry storms that amplify Google Sheets latency/quota pressure.
16. Private Drive files must use backend-authorized access; never add direct Google credentials or public-folder workarounds.
17. Update shared knowledge first when a new fact affects multiple agents; update a specialist agent file when its mission/responsibilities materially change.