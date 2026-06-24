# Story 5.3: CSV Roster Export

Status: ready-for-dev

## Story

As an Admin,
I want to export an event roster as CSV,
so that I can use participant and planning data outside the system.

## Acceptance Criteria

1. Given an Admin is viewing an event, when they export CSV, then the generated roster includes Participant details, Approval Status, RSVP Status, accompanying count, and Age Range counts.
2. The export is Admin-only.
3. The CSV generation is deterministic and testable.
4. Unauthorized users cannot access roster export data.

## Tasks / Subtasks

- [ ] Task 1 — CSV generation (AC: #1, #3)
  - [ ] Verify `generateRosterCsv(event, registrations)` deterministic header + rows
  - [ ] Confirm columns: Participant, Email, Phone, Approval Status, RSVP Status, Accompanying, Age 0-3/4-12/13-17/18+, Notes
  - [ ] Confirm `csvCell` quoting for `",` and newlines
- [ ] Task 2 — Admin-only (AC: #2, #4)
  - [ ] Verify `handleCsv` guards `if (!activeUser?.isAdmin)` → notice "You do not have access to roster exports."
  - [ ] Production: RLS scopes registrations to admin for full roster read

## Dev Notes

### Implementation Context

Build specs are `done`. `handleCsv` (`ChurchEventsApp.tsx:312`). Domain: `generateRosterCsv` (`index.ts:546`). Download: `downloadFile(`${event.id}-roster.csv`, ..., 'text/csv;charset=utf-8')`.

### Architecture Compliance

- [Source: architecture.md#API Boundaries] — CSV is admin-only.
- [Source: architecture.md#Communication Patterns] — deterministic generators for CSV.
- [Source: ux UX-DR20] — roster export as CSV.

### Testing Standards

- Bun test 'exports' asserts header + participant row (`João Silva`) (`index.test.ts:131`).

### Project Structure Notes

- Generator correctly in `packages/domain`; download in `lib/download.ts`. Aligned.

### References

- [Source: epics.md#Story 5.3]
- [Source: packages/domain/src/index.ts#generateRosterCsv]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
