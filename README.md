# Ottawa Church Events

Church website, participant portal, and admin event workflow for a free-tier-first personal project.

## Stack

- Runtime/package manager: Bun workspace
- Monorepo orchestration: Turborepo
- Web app: React, TanStack Router, Vite, Tailwind CSS/shadcn-style components
- Domain package: framework-independent TypeScript event, registration, RSVP, CSV, and calendar logic
- Deployment target: Cloudflare Pages for the web app
- Production services: Supabase free tier for auth/database; Resend-compatible email remains a later adapter

## Local Development

```bash
bun install
bun --filter @ottawa-church/web dev
```

Open `http://127.0.0.1:3000/`.

The app runs in local preview mode when Supabase Vite variables are absent. Local preview mode uses browser storage and exposes preview-only shortcuts such as the admin demo button.

To run production mode locally:

```bash
export VITE_SUPABASE_URL="https://<project-id>.supabase.co"
export VITE_SUPABASE_PUBLISHABLE_KEY="<supabase-anon-or-publishable-key>"
bun --filter @ottawa-church/web dev
```

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

Apply all migrations in `supabase/migrations` to create the production tables, RLS policies, profile signup trigger, and participant RSVP RPC.

To grant the first admin account after signing up. Verify the row was inserted (the inner `select` returns no rows if the email does not match an existing auth user, in which case no admin is granted):

```sql
insert into public.admin_users (user_id)
select id from auth.users where email = 'admin@example.com'
on conflict do nothing;

select user_id from public.admin_users where user_id = (
  select id from auth.users where email = 'admin@example.com'
);
```

## CI Deployment

GitHub Actions validates and deploys on pushes to `master`.

Required GitHub secrets for web deployment:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Optional GitHub variable:

- `CLOUDFLARE_PROJECT_NAME` defaults to `web-ottawa-church`

Required GitHub secrets for applying Supabase migrations:

- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PROJECT_REF`
- `SUPABASE_DB_PASSWORD`
