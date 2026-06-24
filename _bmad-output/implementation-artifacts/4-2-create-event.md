# Story 4.2: Create Event

Status: ready-for-dev

## Story

As an Admin,
I want to create an event with all planning details,
so that participants can discover and register for it.

## Acceptance Criteria

1. Given an Admin is on Admin events, when they open Create Event, then a modal captures title, date/time, Location, maps link, description, capacity, cost, required items, transportation note, waiver/consent note, volunteer needs, registration availability, and publication status.
2. Title, date/time, location, and publication status are required.
3. Optional empty fields are not shown as public placeholders.
4. Created draft events are not visible publicly.

## Tasks / Subtasks

- [ ] Task 1 — Create modal (AC: #1)
  - [ ] Verify `create-event` `DialogMode` captures all `ChurchEvent` fields
- [ ] Task 2 — Validation (AC: #2)
  - [ ] Verify `validateEvent` requires title, startsAt/endsAt (end > start), location, status, capacity ≥1
- [ ] Task 3 — Save flow (AC: #1, #4)
  - [ ] Local: `saveEvent` inserts with generated id; `mapsUrl` defaulted from location
  - [ ] Production: `saveSupabaseEvent` insert; draft status hides from public list
- [ ] Task 4 — Optional fields (AC: #3)
  - [ ] Confirm public details hides blank optional fields (Story 1.4 coupling)

## Dev Notes

### Implementation Context

Build specs are `done`. `handleEventSave(input, 'create')` (`ChurchEventsApp.tsx:259`). Domain: `saveEvent` (`index.ts:315`) + `validateEvent` (`:303`). Production: `saveSupabaseEvent` (`lib/supabase.ts:201`). `EventInput` = `Omit<ChurchEvent,'id'> & {id?}`.

### Architecture Compliance

- [Source: ux UX-DR18] — Create Event modal fields (title, date/time, location, maps link, description, capacity, cost, required items, transportation, waiver, volunteer needs, publication status).
- [Source: architecture.md#Naming Patterns] — `church_events` snake_case columns; `eventToPayload` maps camelCase→snake_case.
- [Source: architecture.md#API Boundaries] — event create is an admin action; RLS enforces admin writes.

### Testing Standards

- Bun test 'event management and reminders' asserts create + draft status (`index.test.ts:98`).

### Project Structure Notes

- Target: `features/admin/create-event-dialog.tsx`. Current: inline.

### References

- [Source: epics.md#Story 4.2]
- [Source: packages/domain/src/index.ts#saveEvent]
- [Source: ux UX-DR18]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
