# MSPixelPulse Frontend

Official MSPixelPulse frontend for the agency website and role-based client, admin, and developer portals.

Production site:

```text
https://mspixelpulse.com
```

`https://www.mspixelpulse.com` and the legacy Vercel production hostname redirect permanently to the equivalent path on the apex domain.

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
capstone-frontend
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
