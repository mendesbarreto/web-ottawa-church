---
baseline_commit: 11281c34c1db5f65b20bb6245be6d1b79db33cd4
---

# Story 3.4: Participant Registration Status List

Status: review

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

- [x] Task 1 — Dashboard list (AC: #1, #2)
  - [x] Verify `PortalPage` (`/portal`) lists `activeUser`'s registrations with event title/date/location
  - [x] Confirm Approval Status + RSVP Status badges + row action menu per row
- [x] Task 2 — Text status badges (AC: #3)
  - [x] Confirm `statusLabel` renders text (not color only) for pending/approved/declined/attending/not attending
- [x] Task 3 — Privacy boundary (AC: #4)
  - [x] Local: list filters registrations by `activeUser.id`
  - [x] Production: `loadProductionState` relies on RLS to scope registrations to the requesting user (verify migration 0001 RLS)

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

glm-5.2 (zai-coding-plan/glm-5.2)

### Debug Log References

### Completion Notes List

- Verified PortalPage (/portal) lists activeUser's registrations filtered by userId, sorted by approval status then event date; each row shows event title/date/location, Approval + RSVP StatusBadges, group size, and RowMenu. statusLabel renders text (not color-only) - unit tested. Privacy boundary: local list filters by activeUser.id; production relies on RLS 'registrations own or admin read' (migration 0001) to scope registrations to the requesting user. typecheck + 29 tests pass.

### File List

- Verified: apps/web/src/features/church-events/ChurchEventsApp.tsx, apps/web/src/lib/supabase.ts, packages/domain/src/index.ts, supabase/migrations/0001_church_events.sql; Test additions: packages/domain/src/index.test.ts

## Change Log

- 2026-06-27: Verified implementation against ACs; hardened domain test coverage and touch-target sizing. Status set to review.
