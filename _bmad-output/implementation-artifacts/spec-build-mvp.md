---
title: 'Build Church Events MVP'
type: 'feature'
created: '2026-06-21'
status: 'done'
baseline_commit: 'b6607ae3a27b26ad2a76ee34caf9804bf29a7a7f'
context:
  - _bmad-output/planning-artifacts/prds/prd-web-ottawa-church-2026-06-16/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/epics.md
  - _bmad-output/planning-artifacts/ux-designs/ux-web-ottawa-church-2026-06-16/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-web-ottawa-church-2026-06-16/EXPERIENCE.md
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The repository has complete product, UX, architecture, and story artifacts, but no working application. The user wants an end-to-end MVP rather than more planning checkpoints.

**Approach:** Build a Bun/Turbo monorepo guided by `/Users/mendes/Git/clariti/project-surf`: a TanStack Start React web app under `apps/web` plus domain code under `packages/domain`. Use Tailwind v4/shadcn-style primitives and local persistence for the first working product, while keeping Supabase/Resend-ready boundaries for Cloudflare Pages + Supabase/Resend free-tier deployment later.

## Boundaries & Constraints

**Always:** Follow the `project-surf` technology shape where appropriate: Bun package manager, Turbo workspace, TanStack Start, TanStack Router/Query, Tailwind v4, shadcn-style UI primitives, strict TypeScript, and feature/domain organization. Keep free-tier constraints: no WorkOS, AWS/Pulumi, Temporal, paid queues, or paid infrastructure in the MVP. Implement all core flows from the epics: public pages, events list/details, signup/signin state, event registration with accompanying + age counts, approval states, RSVP, admin create/manage/review/approve/decline, `.ics`, CSV, and printable roster.

**Ask First:** None for this run; the user explicitly requested autonomous drive-to-working-product execution.

**Never:** Do not use Next.js. Do not introduce GraphQL, microservices, payments, waitlists, complex roles, live check-in/out, heavy animations, carousels, infinite scroll, drag-and-drop, or nested modal stacks.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Visitor discovers event | Public user opens Events | Published upcoming events show title, date, location, status, details/register/calendar actions | Empty state shown if no events |
| Signup and register | Visitor signs up then registers | User becomes signed in and submits pending event registration | Inline validation blocks bad/missing fields |
| Age count mismatch | Accompanying count + age counts do not total participant group | Submission blocked with explicit helper/error | Keep modal open and preserve entered values |
| Admin approves | Admin opens pending queue and approves | Status changes to approved, totals update, participant status changes | Unauthorized state blocks admin-only actions |
| RSVP update | Participant marks not attending | RSVP status updates and totals reflect it | Failed/invalid update shows error and keeps previous state |
| Export event | User selects calendar or admin selects CSV/print | Valid `.ics`, CSV download, and print view are produced | Export actions remain disabled if event data is unavailable |

</frozen-after-approval>

## Code Map

- `package.json`, `turbo.json`, `tsconfig.base.json` -- Bun/Turbo workspace root.
- `apps/web/package.json`, `apps/web/vite.config.ts`, `apps/web/src/*` -- TanStack Start web app for public, portal, and admin surfaces.
- `packages/domain/package.json`, `packages/domain/src/index.ts` -- domain types, seed data, validation, totals, exports, local persistence helpers.
- `apps/web/src/routes/*` -- TanStack routes.
- `apps/web/src/features/*` -- feature components and orchestration.
- `apps/web/src/styles.css` -- shadcn-style tokens, Tailwind v4 compatible app styles.
- `packages/domain/src/index.test.ts` -- domain/flow smoke coverage.

## Tasks & Acceptance

**Execution:**
- [x] `package.json`, `turbo.json`, `tsconfig.base.json` -- create Bun/Turbo monorepo root -- mirrors the reference project shape without paid infrastructure.
- [x] `apps/web/*` -- create TanStack Start web app -- browser can load public, portal, and admin surfaces.
- [x] `packages/domain/*` -- implement event/registration/user domain, validation, totals, `.ics`, CSV, storage -- supports core flows without backend.
- [x] `apps/web/src/features/*` and `apps/web/src/routes/*` -- implement public pages, auth state, registration/details/create-event/admin modals, row menus, statuses, RSVP, approvals, exports -- covers MVP user journeys.
- [x] `apps/web/src/styles.css` -- implement approved visual system, responsive tables/cards, accessible controls/modals -- matches UX direction.
- [x] `packages/domain/src/index.test.ts` -- add focused tests for validation, approval/totals, calendar, CSV -- protect core behavior.

**Acceptance Criteria:**
- Given a clean checkout, when `bun install` and `bun run build` run, then the app builds successfully.
- Given the app is open, when a visitor browses public pages and events, then public church/event information is visible without sign in.
- Given a signed-in participant registers with valid group counts, when they submit, then a pending registration appears in participant and admin views.
- Given an Admin approves/declines, when participant status is viewed, then the new status is visible and totals update.
- Given a participant updates RSVP, when admin totals are viewed, then RSVP totals reflect the change.
- Given calendar/CSV/print actions are used, when exports are generated, then files/views contain the expected event or roster data.

## Verification

**Commands:**
- `bun install` -- expected: dependencies install.
- `bun run typecheck` -- expected: workspace TypeScript checks pass.
- `bun run build` -- expected: Turbo builds the web app and packages.
- `bun test` -- expected: domain tests pass.

## Suggested Review Order

**Application Shell**

- Entry point wires public, participant, profile, and admin surfaces.
  [`ChurchEventsApp.tsx:56`](../../apps/web/src/features/church-events/ChurchEventsApp.tsx#L56)

- Route table exposes public, portal, profile, and admin paths.
  [`router.tsx:14`](../../apps/web/src/router.tsx#L14)

**Public Events**

- Public event list hides drafts/archives and keeps actions row-scoped.
  [`ChurchEventsApp.tsx:185`](../../apps/web/src/features/church-events/ChurchEventsApp.tsx#L185)

- Event details modal shows location, planning fields, approval note, and calendar.
  [`ChurchEventsApp.tsx:418`](../../apps/web/src/features/church-events/ChurchEventsApp.tsx#L418)

**Account And Participant**

- Sign-in flow supports return-to-event registration.
  [`ChurchEventsApp.tsx:368`](../../apps/web/src/features/church-events/ChurchEventsApp.tsx#L368)

- Account creation stays separate from event registration.
  [`ChurchEventsApp.tsx:385`](../../apps/web/src/features/church-events/ChurchEventsApp.tsx#L385)

- Profile management updates participant records and related registrations.
  [`index.ts:277`](../../packages/domain/src/index.ts#L277)

- Participant dashboard scopes status and RSVP actions to the active user.
  [`ChurchEventsApp.tsx:223`](../../apps/web/src/features/church-events/ChurchEventsApp.tsx#L223)

**Admin Operations**

- Admin dashboard centralizes event filters, totals, lifecycle, exports, and reminders.
  [`ChurchEventsApp.tsx:275`](../../apps/web/src/features/church-events/ChurchEventsApp.tsx#L275)

- Event form captures full planning details for create and edit.
  [`ChurchEventsApp.tsx:458`](../../apps/web/src/features/church-events/ChurchEventsApp.tsx#L458)

- Registration review supports approval filters, RSVP filters, approve, and decline.
  [`ChurchEventsApp.tsx:493`](../../apps/web/src/features/church-events/ChurchEventsApp.tsx#L493)

**Domain Rules**

- Registration enforces published/open events, duplicate prevention, counts, and email logs.
  [`index.ts:360`](../../packages/domain/src/index.ts#L360)

- Approval records deciding admin, timestamp, and notification side effects.
  [`index.ts:398`](../../packages/domain/src/index.ts#L398)

- Event reminders log duplicate-safe, free-tier-friendly send attempts.
  [`index.ts:482`](../../packages/domain/src/index.ts#L482)

**Validation And Support**

- Supabase migration defines production tables, age rows, and RLS policies.
  [`0001_church_events.sql:1`](../../supabase/migrations/0001_church_events.sql#L1)

- Local storage normalizes older demo state into the expanded app shape.
  [`storage.ts:5`](../../apps/web/src/lib/storage.ts#L5)

- Tests cover account/profile, event lifecycle, reminders, exports, and environment validation.
  [`index.test.ts:49`](../../packages/domain/src/index.test.ts#L49)
