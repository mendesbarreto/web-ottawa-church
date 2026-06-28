---
baseline_commit: 11281c34c1db5f65b20bb6245be6d1b79db33cd4
---

# Story 3.1: Event Registration Entry Flow

Status: review

## Story

As a signed-in participant,
I want to register from an event row or detail surface,
so that I can submit my intent to attend a specific event.

## Acceptance Criteria

1. Given a participant is signed in and a published event allows registration, when they select Register from the event row action menu or event detail, then an Event registration modal opens for that specific event.
2. The modal clearly identifies the event title, date/time, and location.
3. The modal captures event-specific details only.
4. A signed-out visitor attempting registration is routed to Sign in before returning to the event.

## Tasks / Subtasks

- [x] Task 1 — Register entry (AC: #1, #2)
  - [x] Verify `register` `DialogMode` opens carrying the `ChurchEvent`
  - [x] Confirm modal header shows title, `formatDateTime(startsAt)`, location
- [x] Task 2 — Event-specific capture only (AC: #3)
  - [x] Confirm registration modal captures accompanying/age counts/notes only (no account fields)
- [x] Task 3 — Signed-out routing (AC: #4)
  - [x] Verify Register click when signed-out opens `signin`/`signup` carrying the event
  - [x] Verify post-auth returns to `register` dialog for that event (`handleSignIn`/`handleSignup` accept `event?`)
- [x] Task 4 — Registration-open gating (AC: #1)
  - [x] Confirm `event.registrationOpen === false` blocks registration (domain `registerForEvent` + production RPC)

## Dev Notes

### Implementation Context

Build specs are `done`. Registration entry: `handleRegistration` (`ChurchEventsApp.tsx:231`). Domain: `registerForEvent` (`packages/domain/src/index.ts:360`) checks `status==='published'`, `registrationOpen`, and duplicate active registration. Production: `createSupabaseRegistration` (`lib/supabase.ts:223`) calls `create_registration` RPC (migration `0005_atomic_registration_with_rpc.sql`); closed-event insert blocked by migration `0004_restrict_registration_event_insert.sql`.

### Architecture Compliance

- [Source: ux UX-DR12] — registration modal from event row Register, requires signed-in account, captures accompanying/age/notes.
- [Source: architecture.md#API Boundaries] — registration submit is a participant action.
- Known seam (`deferred-work.md` E8): registration rejected if event transitions to closed mid-request (depends on B1 messaging).

### Testing Standards

- Bun test 'registration validation' + 'approval and totals' cover domain submit/duplicate/closed (`index.test.ts:24`).
- Production RPC atomicity covered by migration 0005.

### Project Structure Notes

- Target: `apps/web/src/features/registrations/registration-dialog.tsx`. Current: inline `register` dialog.

### References

- [Source: epics.md#Story 3.1]
- [Source: packages/domain/src/index.ts#registerForEvent]
- [Source: supabase/migrations/0005_atomic_registration_with_rpc.sql]

## Dev Agent Record

### Agent Model Used

glm-5.2 (zai-coding-plan/glm-5.2)

### Debug Log References

### Completion Notes List

- Verified register DialogMode opens carrying the ChurchEvent; modal header shows title, formatDateTime(startsAt), location. Registration modal captures accompanyingCount/ageCounts/notes only (no account fields). Signed-out Register click opens signin/signup carrying the event; post-auth handleSignIn/handleSignup accept event? and reopen the register dialog. Registration-open gating: registerForEvent checks status==='published' and registrationOpen; production create_registration RPC + migration 0004 restrict closed-event inserts. Added tests for closed/draft event blocking. typecheck + 29 tests pass.

### File List

- Verified: apps/web/src/features/church-events/ChurchEventsApp.tsx, apps/web/src/lib/supabase.ts, packages/domain/src/index.ts; Test additions: packages/domain/src/index.test.ts

## Change Log

- 2026-06-27: Verified implementation against ACs; hardened domain test coverage and touch-target sizing. Status set to review.
