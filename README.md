# Ottawa Church Events

Church website, participant portal, and admin event workflow for a free-tier-first personal project.

## Stack

- Runtime/package manager: Bun workspace
- Monorepo orchestration: Turborepo
- Web app: React, TanStack Router, Vite, Tailwind CSS/shadcn-style components
- Domain package: framework-independent TypeScript event, registration, RSVP, CSV, and calendar logic
- Deployment target: Cloudflare Pages for the web app
- Future services: Supabase free tier for auth/database and Resend free tier for email

## Local Development

```bash
bun install
bun --filter @ottawa-church/web dev
```

Open `http://127.0.0.1:3000/`.

## Validation

```bash
bun run typecheck
bun test
bun run build
```

## Cloudflare Pages

Use these settings when connecting the repository to Cloudflare Pages:

- Framework preset: None / Vite
- Build command: `bun run build`
- Build output directory: `apps/web/dist`
- Root directory: repository root

`apps/web/public/_redirects` keeps direct links working for the single-page app.

## Supabase Free Tier

Apply `supabase/migrations/0001_church_events.sql` to create the production-ready tables and RLS policies for profiles, events, registrations, age-count rows, admin users, notification logs, and reminder logs.

## CI Deployment

GitHub Actions validates and deploys on pushes to `master`.

Required GitHub secrets for web deployment:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Optional GitHub variable:

- `CLOUDFLARE_PROJECT_NAME` defaults to `web-ottawa-church`

Optional GitHub secrets for applying Supabase migrations:

- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PROJECT_ID`
- `SUPABASE_DB_PASSWORD`
