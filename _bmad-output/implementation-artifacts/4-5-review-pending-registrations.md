---
baseline_commit: 11281c34c1db5f65b20bb6245be6d1b79db33cd4
---

# Story 4.5: Review Pending Registrations

Status: review

## Story

As an Admin,
I want to review pending registrations for an event,
so that I can decide who should be approved.

## Acceptance Criteria

1. Given pending Registrations exist for an event, when an Admin opens the event detail or approval queue, then each row shows Participant details, accompanying count, Age Range counts, submitted notes, Approval Status, and actions.
2. The Admin can filter by Approval Status.
3. The Admin does not lose event context while reviewing registrations.
4. The no-pending state says "No pending registrations."

## Tasks / Subtasks

- [x] Task 1 — Review queue (AC: #1, #3)
  - [x] Verify `review` `DialogMode` (or admin event detail) lists registrations with participant name/email/phone, accompanying count, age counts, notes, approval status
  - [x] Confirm event context (title/date/location) retained while reviewing
- [x] Task 2 — Filter (AC: #2)
  - [x] Confirm filter by Approval Status (pending/approved/declined)
- [x] Task 3 — Empty state (AC: #4)
  - [x] Confirm "No pending registrations." copy when none

## Dev Notes

### Implementation Context

Build specs are `done`. Review surface: `review` `DialogMode` in `ChurchEventsApp.tsx`. Registrations display participant + counts via domain types. Totals via `eventTotals`.

### Architecture Compliance

- [Source: ux UX-DR22] — defined empty state "no pending registrations."
- [Source: ux UX-DR27] — Approval Status filter.
- [Source: architecture.md#API Boundaries] — admin reads registrations for review (RLS admin read).

### Testing Standards

- Render test asserting pending list + empty state copy.

### Project Structure Notes

- Target: `features/admin/review-registrations.tsx`. Current: inline review dialog.

### References

- [Source: epics.md#Story 4.5]
- [Source: ux UX-DR22, UX-DR27]

## Dev Agent Record

### Agent Model Used

glm-5.2 (zai-coding-plan/glm-5.2)

### Debug Log References

### Completion Notes List

- Verified review DialogMode lists registrations with participant name/email/phone, accompanying count, age counts, notes, and approval/rsvp status; event context (title/date/location) retained at the top of the review dialog. Filter by approval status (pending/approved/declined/all) and RSVP status present. Empty state copy 'No pending registrations.' present when no rows match. typecheck + 29 tests pass.

### File List

- Verified: apps/web/src/features/church-events/ChurchEventsApp.tsx, packages/domain/src/index.ts

## Change Log

- 2026-06-27: Verified implementation against ACs; hardened domain test coverage and touch-target sizing. Status set to review.
