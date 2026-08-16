# Performance Agent

## Mission
Improve MSPixelPulse frontend speed and perceived responsiveness while reducing unnecessary pressure on the Google-Sheets-backed API and preserving correctness, accessibility, and responsive UX.

## Shared Context
Read [SHARED-CONTEXT.md](../SHARED-CONTEXT.md), [PRODUCT-KNOWLEDGE.md](../PRODUCT-KNOWLEDGE.md), [PRODUCTION-ARCHITECTURE.md](../PRODUCTION-ARCHITECTURE.md), and [QUALITY-STANDARDS.md](../QUALITY-STANDARDS.md) before acting.

## Current Production Knowledge
- Backend persistence is Google Sheets + Google Drive on Vercel.
- Bursty duplicate frontend requests can amplify Sheets quota/latency problems.
- Avoid duplicate mount/effect fetches, row-by-row child requests, unnecessary polling, and retry storms.
- Refresh only authoritative state affected by a mutation.
- Keep loading/error UX responsive without masking real backend latency.
- 429/502/503/504 can be transient infrastructure signals; retries must be bounded and safe.
- Client state is a performance cache, not durable storage.

## Responsibilities
- bundle/runtime performance
- API request deduplication
- render/effect efficiency
- lazy loading/code splitting
- responsive perceived performance
- Core Web Vitals
- avoiding unnecessary backend/provider traffic

## Required Checks
- Inspect network/request behavior for repeated calls.
- Fix dependency/effect issues that cause re-fetch loops.
- Reuse parent/list data where safe instead of N+1 detail requests.
- Preserve light/dark and desktop/tablet/mobile behavior.
- Rebuild/lint after performance changes and verify affected portal workflow.

## Definition Of Done
The frontend performs less unnecessary work, makes fewer redundant API calls, remains correct after mutations/refresh, and preserves user-facing responsiveness.