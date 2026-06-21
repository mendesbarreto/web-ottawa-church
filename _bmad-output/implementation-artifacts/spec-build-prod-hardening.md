---
title: 'Production-Harden Church Events (Supabase Boundaries + Deploy)'
type: 'feature'
created: '2026-06-21'
status: 'done'
baseline_commit: '236a3a6fea3c9e84e9bc2be9acff9b0a37b3a87d'
context:
  - _bmad-output/planning-artifacts/prds/prd-web-ottawa-church-2026-06-16/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/implementation-artifacts/spec-build-mvp.md
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The MVP ships with localStorage-backed demo auth/data and no real deploy path — fine for review, unsafe for actual church use.

**Approach:** When `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are present, route every auth/event/registration/profile/RSVP/reminder/admin action through Supabase; otherwise keep the demo/localStorage fallback for local dev. Harden the schema with RLS + a security-definer RSVP RPC + a signup trigger, and wire Cloudflare Pages + Supabase migration deploys through GitHub Actions on master.

## Boundaries & Constraints

**Always:** Detect Supabase config once at module load; gate every state-changing handler on `productionMode`; refresh remote state after each mutation; keep the demo path intact for `bun run dev` without secrets. Admin authority must come from the `admin_users` table, never from a client-side flag.

**Ask First:** Changes to migrations already applied to production Supabase; enabling email confirmations; rotating deploy secrets.

**Never:** No service-role keys in the client bundle. No client-side admin escalation. No paid infra (WorkOS, Pulumi, Temporal, paid queues). No bypass of RLS from the browser.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Demo fallback | Supabase envs missing at build time | App boots in localStorage mode with seed data | N/A |
| Production boot | Env vars set, returning visitor | Session restored, events/profile/registrations loaded from Supabase | Surface Supabase error in notice, stop loading spinner |
| Sign up | Valid email/password + profile metadata | Auth user created, trigger inserts `profiles` row, user is signed in | If trigger/profile upsert fails, error shown and auth rolled back perceptually |
| RSVP self-service | Approved participant calls RPC | `update_own_rsvp` updates only own approved row | RPC raises if not owner/approved — error shown, state preserved |
| Admin action by non-admin | Non-admin attempts approve/decline | RLS blocks update; loadProductionState shows prior state | Error surfaced in notice |
| Registration on closed event | Client attempts insert when `registration_open=false` | RLS insert policy rejects | Error shown, no partial age-count rows written |
| CI without deploy secrets | Push to master with missing Cloudflare/Supabase secrets | Validate/build still runs; deploy steps skip with a notice | Deploy job logs the missing secret |

</frozen-after-approval>

## Code Map

- `apps/web/src/lib/supabase.ts` -- Supabase adapter: client factory, state loader, all CRUD/auth helpers, row→domain mappers.
- `apps/web/src/features/church-events/ChurchEventsApp.tsx` -- UI host; gates every handler on `productionMode` and routes to Supabase helpers.
- `supabase/migrations/0002_harden_registration_updates.sql` -- Replaces loose RSVP update policy with admin-only update + `update_own_rsvp` RPC.
- `supabase/migrations/0003_create_profile_on_signup.sql` -- Trigger that creates/upserts `profiles` row after `auth.users` insert.
- `supabase/migrations/0004_restrict_registration_event_insert.sql` -- Insert policy requires own `user_id` and a published/open event.
- `.github/workflows/deploy.yml` -- Validate (typecheck/test/build) with Vite envs, then Cloudflare Pages + Supabase migration deploys gated on secrets.
- `apps/web/package.json` -- Adds `@supabase/supabase-js` dependency.
- `README.md` -- Documents env vars, local dev, and deploy prerequisites.

## Tasks & Acceptance

**Execution:**
- [x] `apps/web/package.json` -- add `@supabase/supabase-js` -- client-side Supabase access without server runtime.
- [x] `apps/web/src/lib/supabase.ts` -- implement adapter (client factory, session/auth, state loader, event/registration/profile/approval/RSVP/reminder writers, row mappers) -- single production boundary used by the UI.
- [x] `supabase/migrations/0002_harden_registration_updates.sql` -- admin-only update policy + `update_own_rsvp` RPC -- stop browser from writing arbitrary registration fields.
- [x] `supabase/migrations/0003_create_profile_on_signup.sql` -- signup trigger -- guarantee a `profiles` row exists for every auth user.
- [x] `supabase/migrations/0004_restrict_registration_event_insert.sql` -- insert policy -- block registrations against unpublished/closed events at the database.
- [x] `apps/web/src/features/church-events/ChurchEventsApp.tsx` -- add `productionMode`, `runProduction`/`refreshProduction`, and gate each handler (sign in, sign up, sign out, profile, registration, RSVP, event CRUD, status, delete, reminder, approval) on it -- one entry point for both run modes.
- [x] `.github/workflows/deploy.yml` -- pass `VITE_SUPABASE_URL`/`VITE_SUPABASE_PUBLISHABLE_KEY` at build; add Cloudflare Pages + Supabase migration jobs gated on secrets -- repeatable prod deploys from master.
- [x] `README.md` -- document env vars, local dev, and deploy prerequisites -- operators can reproduce the deploy.

**Acceptance Criteria:**
- Given Supabase envs are unset, when the app boots, then it runs in localStorage/demo mode with seed data.
- Given Supabase envs are set and a returning visitor loads the app, when `getCurrentSession` resolves, then events/profile/registrations load from Supabase and the participant is signed in.
- Given a signed-up visitor, when `signUp` completes, then a `profiles` row exists for the new auth user (via trigger) and the session is active.
- Given a non-admin participant, when they attempt approve/decline, then RLS blocks the update and the UI surfaces the error.
- Given an approved participant, when they call `update_own_rsvp`, then only their own approved registration's `rsvp_status` changes.
- Given a push to master, when secrets are present, then Cloudflare Pages deploys `apps/web/dist` and Supabase applies migrations; when secrets are missing, both deploy jobs skip cleanly.
- Given a clean checkout, when `bun install && bun run typecheck && bun test && bun run build` run, then all four succeed.

## Verification

**Commands:**
- `bun install` -- expected: dependencies install from `bun.lock`.
- `bun run typecheck` -- expected: workspace TypeScript passes.
- `bun test` -- expected: domain tests pass (6 tests).
- `bun run build` -- expected: web app builds with Vite envs at build time.

**Manual checks:**
- Run `bun run dev` without env vars → app boots in demo mode with seed data.
- Run with `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY` set → app boots against Supabase, sign-up creates a profile, registrations write through.

## Suggested Review Order

**Production Boundary**

- Single env-detection flag drives every handler's demo-vs-prod branch.
  [`ChurchEventsApp.tsx:79`](../../apps/web/src/features/church-events/ChurchEventsApp.tsx#L79)

- Env detection, client factory, and the empty production state seeded before first load.
  [`supabase.ts:65`](../../apps/web/src/lib/supabase.ts#L65)

**State Hydration**

- Boot effect reconciles session, loads production state, and subscribes to auth changes.
  [`ChurchEventsApp.tsx:95`](../../apps/web/src/features/church-events/ChurchEventsApp.tsx#L95)

- Loader pulls events, profiles, admin flag, registrations, and age counts in dependency order.
  [`supabase.ts:106`](../../apps/web/src/lib/supabase.ts#L106)

- Admin authority resolved from `admin_users` row, never from client claims.
  [`supabase.ts:117`](../../apps/web/src/lib/supabase.ts#L117)

**Auth & Profile**

- Sign-in / sign-up routed through Supabase, with dialog and notice wired to session outcome.
  [`ChurchEventsApp.tsx:151`](../../apps/web/src/features/church-events/ChurchEventsApp.tsx#L151)

- Sign-up upserts a profile and tolerates email-confirmation-only sessions.
  [`supabase.ts:157`](../../apps/web/src/lib/supabase.ts#L157)

- Trigger guarantees a `profiles` row for every new auth user (idempotent upsert).
  [`0003_create_profile_on_signup.sql:1`](../../supabase/migrations/0003_create_profile_on_signup.sql#L1)

**Registration & RSVP**

- Registration handler delegates to Supabase only after client-side validation and duplicate check.
  [`ChurchEventsApp.tsx:209`](../../apps/web/src/features/church-events/ChurchEventsApp.tsx#L209)

- Insert policy blocks registrations against unpublished/closed events at the database.
  [`0004_restrict_registration_event_insert.sql:3`](../../supabase/migrations/0004_restrict_registration_event_insert.sql#L3)

- RSVP routed through the `update_own_rsvp` RPC instead of a direct table update.
  [`ChurchEventsApp.tsx:226`](../../apps/web/src/features/church-events/ChurchEventsApp.tsx#L226)

- Security-definer RPC updates only the caller's own approved row.
  [`supabase.ts:259`](../../apps/web/src/lib/supabase.ts#L259)

- Admin-only update policy plus the RPC replace the previous loose RSVP rule.
  [`0002_harden_registration_updates.sql:3`](../../supabase/migrations/0002_harden_registration_updates.sql#L3)

**Admin Operations**

- Event create/update/status/delete and approval handlers all route through `runProduction`.
  [`ChurchEventsApp.tsx:239`](../../apps/web/src/features/church-events/ChurchEventsApp.tsx#L239)

- Generic `runProduction` wrapper: mutate, refresh from server, surface errors uniformly.
  [`ChurchEventsApp.tsx:131`](../../apps/web/src/features/church-events/ChurchEventsApp.tsx#L131)

**Deploy Pipeline**

- Validate job passes public Vite envs to the build so the bundle is prod-shaped.
  [`deploy.yml:28`](../../.github/workflows/deploy.yml#L28)

- Cloudflare Pages and Supabase migration jobs run only on master and skip cleanly when secrets are absent.
  [`deploy.yml:43`](../../.github/workflows/deploy.yml#L43)
