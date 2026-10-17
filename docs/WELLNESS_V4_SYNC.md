# Wellness V4 portfolio sync

Only the existing Wellness project is refreshed: slug ms-pixelpulse-wellness-studio, CMS identity 6a53dfbc3e365df4b2e03542. The source of truth is the existing authenticated MSPixelPulse project API backed by Google Sheets. Do not create another project or write provider data directly from the browser.

The CMS update includes live V4 screenshot cover/desktop/mobile assets, description, categories, technologies, features, overview, SEO and canonical demo URL. Identity, assignments, status, publication, feature order and project history remain intact. A private before snapshot and field-limited update/readback are retained outside Git; credentials are never committed.

Wellness normalization now respects current CMS content and media. A successful API response that omits Wellness does not resurrect it from the local fallback. Local release data is used on API failure. Other project normalization remains unchanged. The detail page displays the CMS desktop/mobile previews. Project list, Wellness detail and Admin projects have scoped 1200px header/content limits; other routes are unaffected.

Facts: 36 treatments, 50 licensed ambient videos, searchable/filterable services, seven-step demo requests, sample reviews, feedback previews and wellness tips. Email delivery and private feedback storage are NOT CONFIGURED. No real appointments, live email delivery or genuine customer testimonials are claimed. The actual Wellness source release is ef9231945968b765a2fd840ef53335cd981d555d. Screenshots were captured from that production release on 2026-10-17; cover is 1200x750 WebP, desktop 1440x1000 and mobile 390x1000.

Verification: lint, 25 tests and production build. Twenty-four local browser cases cover list/detail, light/dark, 375/390/430/768/1024/1440px; no overflow or frame above 1200px. Combined search/industry/type filters identify one Wellness project. API-backed role persistence and deployed asset/route checks are recorded in the release report after publication. No backend code, authentication, credentials, DNS or billing changes are required.
