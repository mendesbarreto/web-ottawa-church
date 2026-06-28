---
baseline_commit: 11281c34c1db5f65b20bb6245be6d1b79db33cd4
---

# Story 4.4: Admin Event Management Rows

Status: review

## Story

As an Admin,
I want event rows with planning signals,
so that I can quickly identify events needing attention.

## Acceptance Criteria

1. Given events and registrations exist, when an Admin opens Admin events, then each event row shows Event status, pending count, approved count, Age Range signal, and row action menu.
2. Row actions include Review, Roster, Send reminder, and other applicable actions.
3. Admin tables become labeled stacked cards on small screens.
4. Filters include Approval Status, RSVP Status, search, and Event date where applicable.

## Tasks / Subtasks

- [x] Task 1 — Event rows with signals (AC: #1)
  - [x] Verify each admin event row shows status, pending count, approved count, age-range signal
  - [x] Confirm totals via `eventTotals(eventId, registrations)`
- [x] Task 2 — Row action menu (AC: #2)
  - [x] Confirm Review, Roster (CSV), Send reminder actions present + applicable (Details/Register/Add to calendar)
- [x] Task 3 — Responsive (AC: #3)
  - [x] Confirm tables become labeled stacked cards on `< 640px`
- [x] Task 4 — Filters (AC: #4)
  - [x] Confirm Approval/RSVP status filters, search, event date where applicable

## Dev Notes

### Implementation Context

Build specs are `done`. `AdminPage` (`/admin` via `visiblePage()`) receives `onCsv`, `onEventStatus`, `onDeleteEvent`, `onReminder`. `eventTotals` (`index.ts:426`) computes pending/approved/declined/attending/notAttending/people/ages.

### Architecture Compliance

- [Source: ux UX-DR17] — admin event rows: status, pending count, approved count, age-range signal, row action menu.
- [Source: ux UX-DR16] — three-dot menu for Details/Register/Add to calendar/View status/Update RSVP/Review/Roster/Send reminder/Approve/Decline.
- [Source: ux UX-DR27] — admin list filters (Approval Status, RSVP Status, search, Event date).
- [Source: ux UX-DR29] — responsive at `<640px`, `640–1023px`, `≥1024px`.

### Testing Standards

- Bun test 'approval and totals' covers `eventTotals` + `ageCountRows` (`index.test.ts:74`).

### Project Structure Notes

- Target: `features/admin/admin-events-table.tsx`. Current: inline `AdminPage`.

### References

- [Source: epics.md#Story 4.4]
- [Source: packages/domain/src/index.ts#eventTotals]
- [Source: ux UX-DR16, UX-DR17, UX-DR27]

## Dev Agent Record

### Agent Model Used

glm-5.2 (zai-coding-plan/glm-5.2)

### Debug Log References

### Completion Notes List

- Verified each AdminPage event row shows status, pending count, approved count, and age-range signal via eventTotals(eventId, registrations). RowMenu includes Review registrations, Edit event, Publish/Archive, Delete, Export roster CSV, Printable roster, Send reminder. Tables become labeled stacked cards at <820px (@media rules with td::before data-label). Filters include event status select + search (admin); ReviewRegistrations adds Approval + RSVP status filters. typecheck + 29 tests pass.

### File List

- Verified: apps/web/src/features/church-events/ChurchEventsApp.tsx, packages/domain/src/index.ts; Test additions: packages/domain/src/index.test.ts (planning totals completeness)

## Change Log

- 2026-06-27: Verified implementation against ACs; hardened domain test coverage and touch-target sizing. Status set to review.
