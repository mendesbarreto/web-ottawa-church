# Story 4.3: Edit, Publish, Archive, and Delete Events

Status: ready-for-dev

## Story

As an Admin,
I want to manage event lifecycle,
so that public event listings stay accurate.

## Acceptance Criteria

1. Given an event exists, when an Admin edits, publishes, archives, or deletes it, then the change is saved through an authorized server action.
2. Published events can appear on the public event list.
3. Archived events are hidden from default public views but remain available for Admin history.
4. Destructive actions require confirmation.

## Tasks / Subtasks

- [ ] Task 1 — Edit (AC: #1)
  - [ ] Verify `edit-event` `DialogMode` → `handleEventSave(input, 'edit')` updates existing id
  - [ ] Production: `saveSupabaseEvent` update on `input.id`
- [ ] Task 2 — Publish/Archive (AC: #1, #2, #3)
  - [ ] Verify `handleEventStatus` sets `published`/`archived` via `updateEventStatus`
  - [ ] Confirm `publishedEvents` filter only shows `published`; archived excluded from public but retained
- [ ] Task 3 — Delete with confirmation (AC: #1, #4)
  - [ ] Verify `handleDeleteEvent` uses `window.confirm`; removes event + its registrations (`deleteEvent`)
  - [ ] Production: `deleteSupabaseEvent`

## Dev Notes

### Implementation Context

Build specs are `done`. `handleEventStatus` (`ChurchEventsApp.tsx:269`), `handleDeleteEvent` (`:277`, with confirm). Domain: `updateEventStatus` (`index.ts:344`), `deleteEvent` (`:348`) cascades registrations. Production: `updateSupabaseEventStatus`, `deleteSupabaseEvent`.

### Architecture Compliance

- [Source: architecture.md#Process Patterns] — admin destructive actions require confirmation (delete confirmed).
- [Source: architecture.md#Communication Patterns] — explicit domain actions; delete is authorized server-side.
- Note: archive/publish are not "destructive" — no confirm required; delete is destructive — confirm present.

### Testing Standards

- Bun test asserts publish→archive→delete transitions (`index.test.ts:98`).

### Project Structure Notes

- Inline in SPA; domain isolated.

### References

- [Source: epics.md#Story 4.3]
- [Source: packages/domain/src/index.ts#deleteEvent]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
