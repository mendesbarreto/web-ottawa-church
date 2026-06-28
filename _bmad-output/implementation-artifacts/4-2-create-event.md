---
baseline_commit: 11281c34c1db5f65b20bb6245be6d1b79db33cd4
---

# Story 4.2: Create Event

Status: review

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

- [x] Task 1 — Create modal (AC: #1)
  - [x] Verify `create-event` `DialogMode` captures all `ChurchEvent` fields
- [x] Task 2 — Validation (AC: #2)
  - [x] Verify `validateEvent` requires title, startsAt/endsAt (end > start), location, status, capacity ≥1
- [x] Task 3 — Save flow (AC: #1, #4)
  - [x] Local: `saveEvent` inserts with generated id; `mapsUrl` defaulted from location
  - [x] Production: `saveSupabaseEvent` insert; draft status hides from public list
- [x] Task 4 — Optional fields (AC: #3)
  - [x] Confirm public details hides blank optional fields (Story 1.4 coupling)

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

glm-5.2 (zai-coding-plan/glm-5.2)

### Debug Log References

### Completion Notes List

- Verified create-event DialogMode (EventForm mode='create') captures all ChurchEvent fields. validateEvent requires title, startsAt/endsAt (end > start), location, status, capacity>=1. Local saveEvent inserts with generated id and defaults mapsUrl from location; production saveSupabaseEvent inserts via church_events (RLS admin insert). Draft status hides from public list (publishedEvents filter). Optional empty fields hidden in public details (conditional rendering). Added validateEvent error coverage tests. typecheck + 29 tests pass.

### File List

- Verified: apps/web/src/features/church-events/ChurchEventsApp.tsx, apps/web/src/lib/supabase.ts, packages/domain/src/index.ts; Test additions: packages/domain/src/index.test.ts

## Change Log

- 2026-06-27: Verified implementation against ACs; hardened domain test coverage and touch-target sizing. Status set to review.
