# MSPixelPulse Frontend

Official MSPixelPulse frontend for the agency website and role-based client, admin, and developer portals.

Production site:

```text
https://mspixelpulse.com
```

`https://www.mspixelpulse.com` and the legacy Vercel production hostname redirect permanently to the equivalent path on the apex domain.

Projects: https://mspixelpulse.com/projects

## Business Demo Integration

The public Projects page reuses the API portfolio with the existing curated
records in `src/data/projects.js`. `src/lib/publicPortfolio.js` merges those
records and retains locally prepared entries when the API does not yet contain
them. This is the existing public portfolio architecture; it does not create a
second CMS or write production project data.

The approved eleven-demo inventory is maintained separately in the agency's
operations handoff as `2026-10-10-vercel-pro-handoff/WEBSITE_REGISTRY.json`.
The older twelve-business audit is historical and includes excluded client work. The corresponding public records retain stable
GitHub repository and Vercel project identifiers, existing/verified live URLs,
planned category subdomains, and publication state. See
[the integration handoff](docs/business-demo-integration.md) for maintenance and QA.

Category domains follow `<category>.mspixelpulse.com`: dental, homecare,
wedding, restaurant, flower, realestate, autism, petgrooming, salon,
homeservices, and wellness. These are planned names. A live action may use a
category hostname only after the deployment, DNS, HTTPS, and business identity
have been verified. Until then, keep the verified original production URL.
Unity & Hope is excluded from this release; preserve its existing portfolio
record and client domain without remapping. Projects with no verified URL,
including LUMINA, show an accurate preview-pending state and no Live Site action.

Before any release, run lint, tests, build, SEO validation, and responsive/theme
QA; confirm the connected repository, exact commit, owning project, and hosting
eligibility. A push can trigger Vercel automatically, so prepare local changes
without pushing until the final execution is authorized. The existing team was
verified as Pro on 2026-10-10; recheck actual project ownership before release. Do not change billing,
client domains, or provider settings as part of metadata maintenance. After an
authorized eligible deployment, verify the actual production URL and preserve
a rollback deployment. Private demo management remains an internal workflow
and is not a customer-facing demo destination.

## Architecture

- Vercel hosts the React frontend.
- Vercel hosts the Express API.
- Google Sheets is the production data source.
- Google Drive is the production file-storage provider.
- Authentication is custom JWT auth through the backend.

Production API base:

```text
https://api.mspixelpulse.com/api
```

## Stack

- React
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- Lucide React

## Folder Structure

- `src/App.jsx` - route map and protected role routing
- `src/context/AuthContext.jsx` - session state and login/logout helpers
- `src/lib/api.js` - centralized backend API client
- `src/pages/` - public pages and auth views
- `src/portals/` - admin, client, and developer portal screens
- `src/components/` - layout, UI, auth, and shared components
- `api/` - Vercel serverless handlers for contact/feedback

## Installation

```bash
npm install
cp .env.example .env
npm run dev
```

Local dev server:

```text
http://localhost:5173
```

## Environment Variables

Development example:

```text
VITE_API_BASE=http://localhost:4000/api
VITE_SITE_URL=https://mspixelpulse.com
VITE_SUPPORT_EMAIL=info@mspixelpulse.com
```

Production Vercel variable:

```text
VITE_API_BASE=https://api.mspixelpulse.com/api
VITE_SITE_URL=https://mspixelpulse.com
VITE_SUPPORT_EMAIL=info@mspixelpulse.com
```

The Vercel contact function also uses these existing server-side variables:

```text
RESEND_API_KEY
FORMS_TO_EMAIL
FORMS_FROM_EMAIL
```

The free-demo form reuses the same contact function and does not require a new
environment variable. Preserve the configured values when updating the site.

Never add backend-only secrets to Vercel frontend variables:

- `JWT_SECRET`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`

## Development

```bash
npm run dev
```

The app uses `VITE_API_BASE` when provided. In development only, it falls back to `http://localhost:4000/api` for compatibility with older local backend setups.

## Production Build

```bash
npm run build
```

Production builds require `VITE_API_BASE`. This prevents accidental same-origin `/api` calls when the API is hosted as a separate Vercel project.

## Vercel Deployment

Vercel project:

```text
mspixelpulse-frontend
```

Build settings:

```text
Framework: Vite
Install Command: npm install
Build Command: npm run build
Output Directory: dist
Root Directory: ./
```

## Authentication and Roles

Login posts to:

```text
POST /api/auth/login
```

The backend validates Google Sheets users, checks bcrypt password hashes, issues JWTs, and returns a user role. The frontend redirects:

- `admin` -> `/admin`
- `developer` -> `/dev`
- `client` -> `/client`

Demo account emails can be configured through backend seed environment variables. Do not document or expose demo passwords in the frontend.

Production builds do not expose demo password autofill.

## Major Pages

- Public: Home, About, Projects, Services, Pricing, Blog, Contact, Privacy, Terms, Cookies, Accessibility, Security
- Auth: Login, Register
- Admin: Dashboard, users, approvals, projects, direct messages, billing, requirements
- Client: Dashboard, projects, discussions, support, billing, account
- Developer: Dashboard, projects, requirements, discussions, direct messages, team, account

## Troubleshooting

- Login network error: verify `VITE_API_BASE` and the Vercel API `/health` endpoint.
- CORS error: confirm backend `CORS_ORIGIN` includes the deployed Vercel origin.
- Invalid credentials: verify the Google Sheets user exists and status is `active`.
- Upload failures: check backend Google OAuth and Drive environment variables.

## Security Notes

- Do not commit `.env`.
- Do not ship Google OAuth secrets or refresh tokens to the frontend.
- Do not expose real production passwords in UI or docs.
- Debug tooling is development-only on the frontend.
