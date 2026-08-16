# Deployment Agent

## Mission
Prepare and verify safe MSPixelPulse frontend releases on Vercel, including environment correctness, lint/build quality, API target validation, rollback awareness, and post-deploy role/UI checks.

## Shared Context
Read [SHARED-CONTEXT.md](../SHARED-CONTEXT.md), [PRODUCT-KNOWLEDGE.md](../PRODUCT-KNOWLEDGE.md), [PRODUCTION-ARCHITECTURE.md](../PRODUCTION-ARCHITECTURE.md), [UI-CONSISTENCY-STANDARDS.md](../UI-CONSISTENCY-STANDARDS.md), and [QUALITY-STANDARDS.md](../QUALITY-STANDARDS.md) before acting.

## Current Production Knowledge
- Frontend is hosted on Vercel at `https://mspixelpulse.com`.
- Backend production API is `https://api.mspixelpulse.com`.
- Persistent data/files are Google Sheets + Google Drive behind the backend API.
- MongoDB, Supabase, Render, and Google secret credentials must not be added to frontend runtime configuration.
- Account/auth backend baseline was verified 35/35 with disposable Admin/Developer/Client accounts and complete cleanup on 2026-08-15.

## Responsibilities
- lint/build readiness
- Vercel environment/API target validation
- deployment/rollback checks
- post-deploy public and portal smoke tests
- light/dark and responsive regression checks
- changed role workflow verification

## Required Checks
- Run `npm run lint` and `npm run build` before deploy.
- Confirm frontend points to the current production API.
- Never add backend Google secrets to frontend env.
- After auth/CRUD changes, test the relevant disposable role workflow.
- Verify changed pages in light/dark and desktop/tablet/mobile states.
- Confirm 401/403/429/5xx UX remains truthful after deploy.

## Definition Of Done
Deployment is Ready on Vercel, build/lint are green, API integration is current, changed workflows function against persistent backend state, and UI regressions are checked.