# MSPixelPulse Frontend

Official MSPixelPulse frontend for the agency website and role-based client, admin, and developer portals.

## Architecture

- Vercel hosts the React frontend.
- Render hosts the Express backend.
- MongoDB Atlas is the primary database for users, authentication data, and business data.
- Supabase is file storage only.
- Authentication is custom JWT auth through the backend.

Production API base:

```text
https://capstone-backend-o3o2.onrender.com/api
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
VITE_API_BASE=http://localhost:5000/api
VITE_SUPABASE_URL=https://PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=replace-with-public-anon-key
VITE_SUPABASE_BUCKET=uploads
VITE_SUPPORT_EMAIL=replace-with-support-email-if-verified
```

Production Vercel variable:

```text
VITE_API_BASE=https://capstone-backend-o3o2.onrender.com/api
```

Never add backend-only secrets to Vercel frontend variables:

- `MONGO_URI`
- `JWT_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SMTP_PASS`

## Development

```bash
npm run dev
```

The app uses `VITE_API_BASE` when provided. In development only, it falls back to `http://localhost:4000/api` for compatibility with older local backend setups.

## Production Build

```bash
npm run build
```

Production builds require `VITE_API_BASE`. This prevents accidental same-origin `/api` calls when the backend is hosted separately on Render.

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

The backend validates MongoDB users, checks bcrypt passwords, issues JWTs, and returns a user role. The frontend redirects:

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

- Login network error: verify `VITE_API_BASE` and Render `/health`.
- CORS error: confirm backend `CORS_ORIGIN` includes the deployed Vercel origin.
- Invalid credentials: verify the MongoDB user exists and status is `active`.
- Upload failures: check backend Supabase storage variables and `SUPABASE_BUCKET=uploads`.
- Render cold start: wait and retry after health endpoints respond.

## Security Notes

- Do not commit `.env`.
- Do not ship Supabase service role keys to the frontend.
- Do not expose real production passwords in UI or docs.
- Debug tooling is development-only on the frontend.
