# Project Overview
A Progressive Web App (PWA) for registered members of an organization.
Members can view updates, events, benefits, and polls published by admins.
Admins manage all content via a dedicated admin panel.
Target users: organization members (read access) and admins (full content management).

## Tech Stack
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Database: Supabase (PostgreSQL — default)
- Styling: Tailwind CSS + shadcn/ui
- Auth: Supabase Auth (Google OAuth + Email/Password)

## Commands
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run lint` — Check for errors

## Environment Variables
- All secrets are stored in `.env.local` — never commit this file to git
- `.env.local` is already in `.gitignore` by default in Next.js
- Required variables:
  - `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase public key
  - `SUPABASE_SERVICE_ROLE_KEY` — Supabase admin key (server side only, never expose to client)

## Database
- Provider: Supabase (PostgreSQL)
- Schema source of truth: Supabase Dashboard → Table Editor
- After any schema change run: `npx supabase gen types typescript --project-id ptlrfsxzmxodmlqoooes > src/types/database.ts`
- Always read `src/types/database.ts` before writing any database query

## Tables (overview)
- users — managed automatically by Supabase Auth
- members — extended user profile (name, role, avatar)
- posts — updates published by admin
- events — organization events
- benefits — member benefits
- polls — polls created by admin
- poll_votes — member responses to polls

## Auth
- Provider: Supabase Auth
- Login methods: Google OAuth (primary) + Email/Password
- Roles: member (read-only) | admin (full content management)
- Do not build custom auth logic — always use Supabase Auth
- Admin role is assigned manually in Supabase Dashboard → Authentication → Users
- Protect all admin routes — only admin role can access /admin/*
- Protect all member routes — only authenticated users can access content

## Roles
- member — read-only access to content
- admin — full content management via admin panel

## Security Rules
- Never write secrets or API keys in code — use environment variables only
- Never expose Supabase service role key on the client side
- All admin routes (/admin/*) must be protected by admin role check
- All member content is only accessible to authenticated users
- Enable Row Level Security (RLS) on all Supabase tables
- Never expose stack traces in API responses
- Validate all user input before sending to database

## Integrations
- Supabase — database, auth, and storage
- Additional integrations will be added as the project grows — update this section accordingly

## Code Style
- File names: kebab-case
- Components: PascalCase
- Imports: absolute paths from src/
- Use TypeScript types for all props and functions — avoid `any`
- This is a PWA — design mobile-first and ensure offline-friendly behavior where possible

## Design
- Designs are created in Claude Design and exported as React components
- When receiving a design — adapt it to Next.js App Router structure
- Maintain exact colors, fonts and spacing from the original design
- Do not alter the design without explicit approval

## Environments
- dev: localhost:3000 (Next.js built-in dev server)
- prod: do not modify without explicit approval

## Preferences
- Ask clarifying questions before starting any large task
- Do not modify config files without explicit approval
- Do not make assumptions about design decisions — always ask
- When adding a new integration — update the Integrations section in CLAUDE.md
- When adding a new table — update the Tables section in CLAUDE.md
- After any schema change in Supabase — regenerate types before writing any DB query