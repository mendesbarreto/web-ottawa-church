# Story 3.1: Event Registration Entry Flow

Status: ready-for-dev

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

- [ ] Task 1 — Register entry (AC: #1, #2)
  - [ ] Verify `register` `DialogMode` opens carrying the `ChurchEvent`
  - [ ] Confirm modal header shows title, `formatDateTime(startsAt)`, location
- [ ] Task 2 — Event-specific capture only (AC: #3)
  - [ ] Confirm registration modal captures accompanying/age counts/notes only (no account fields)
- [ ] Task 3 — Signed-out routing (AC: #4)
  - [ ] Verify Register click when signed-out opens `signin`/`signup` carrying the event
  - [ ] Verify post-auth returns to `register` dialog for that event (`handleSignIn`/`handleSignup` accept `event?`)
- [ ] Task 4 — Registration-open gating (AC: #1)
  - [ ] Confirm `event.registrationOpen === false` blocks registration (domain `registerForEvent` + production RPC)

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

### Debug Log References

### Completion Notes List

### File List
