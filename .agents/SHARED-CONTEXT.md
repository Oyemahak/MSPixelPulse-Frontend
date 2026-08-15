# Shared Context

MSPixelPulse is a Toronto, Ontario web agency project focused on professional, responsive, business-focused websites and persistent client/project workflows.

Current production site: https://mspixelpulse.com
Current backend: https://api.mspixelpulse.com

Repository focus: React/Vite frontend, public website, Admin/Client/Developer portals, Vercel deployment, secure backend API integration, and reliable persistent CRUD.

## Current Production Source Of Truth

- Google Sheets is the structured application database behind the API.
- Google Drive is the managed private file store behind the API.
- Vercel hosts both frontend and backend.
- Resend handles configured transactional email.
- MongoDB, Supabase, and Render are not production runtime providers.
- The browser must never receive Google OAuth secrets, refresh tokens, password hashes, or private Drive credentials.

All agents must read `.agents/PRODUCTION-ARCHITECTURE.md` before changing portal CRUD, authentication, authorization, files, persistence, API integration, role behavior, or deployment.

Agents must protect production behavior, inspect existing files first, preserve responsive/light/dark UI behavior, avoid secrets, verify role boundaries and persistence after refresh/logout/login, and communicate truthfully.
