# Story 3.4: Participant Registration Status List

Status: ready-for-dev

## Story

As a participant,
I want to see my event registration statuses,
so that I know whether I am pending, approved, declined, or not attending.

## Acceptance Criteria

1. Given a participant has registrations, when they open their dashboard, registrations page, or authenticated Events status list, then their Registrations are grouped or sorted by Approval Status and Event date.
2. Each row shows event title, date/time, location, Approval Status, RSVP Status, and row action menu.
3. Status badges include text labels and do not rely on color alone.
4. The participant cannot see other Participants' Registrations.

## Tasks / Subtasks

- [ ] Task 1 — Dashboard list (AC: #1, #2)
  - [ ] Verify `PortalPage` (`/portal`) lists `activeUser`'s registrations with event title/date/location
  - [ ] Confirm Approval Status + RSVP Status badges + row action menu per row
- [ ] Task 2 — Text status badges (AC: #3)
  - [ ] Confirm `statusLabel` renders text (not color only) for pending/approved/declined/attending/not attending
- [ ] Task 3 — Privacy boundary (AC: #4)
  - [ ] Local: list filters registrations by `activeUser.id`
  - [ ] Production: `loadProductionState` relies on RLS to scope registrations to the requesting user (verify migration 0001 RLS)

## Dev Notes

### Implementation Context

Build specs are `done`. `PortalPage` rendered at `/portal` via `visiblePage()` (`ChurchEventsApp.tsx:326`). Production scoping: `loadProductionState` (`lib/supabase.ts:125`) selects registrations only when `activeUserId` present, trusting RLS.

### Architecture Compliance

- [Source: architecture.md#API Boundaries] — participant sees own registrations only.
- [Source: ux UX-DR7] — rows/tables where status matters.
- [Source: ux UX-DR15] — text-bearing status badges.
- [Source: architecture.md#Pattern Examples] — query key pattern `['registrations', 'mine']` (TanStack Query not yet adopted; local state in use).
- Known gap (`deferred-work.md` §5.8/G1): `state.users` only contains active user; admin sees others' registrations (denormalized) but no user records — joining on `users` would fail silently.

### Testing Standards

- Add render test asserting only own registrations shown + text badges.

### Project Structure Notes

- Target: `routes/portal/registrations.tsx` + `features/registrations`. Current: inline `PortalPage`.

### References

- [Source: epics.md#Story 3.4]
- [Source: apps/web/src/lib/supabase.ts#loadProductionState]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md#G1]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
