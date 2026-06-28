---
baseline_commit: 11281c34c1db5f65b20bb6245be6d1b79db33cd4
---

# Story 4.3: Edit, Publish, Archive, and Delete Events

Status: review

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

- [x] Task 1 — Edit (AC: #1)
  - [x] Verify `edit-event` `DialogMode` → `handleEventSave(input, 'edit')` updates existing id
  - [x] Production: `saveSupabaseEvent` update on `input.id`
- [x] Task 2 — Publish/Archive (AC: #1, #2, #3)
  - [x] Verify `handleEventStatus` sets `published`/`archived` via `updateEventStatus`
  - [x] Confirm `publishedEvents` filter only shows `published`; archived excluded from public but retained
- [x] Task 3 — Delete with confirmation (AC: #1, #4)
  - [x] Verify `handleDeleteEvent` uses `window.confirm`; removes event + its registrations (`deleteEvent`)
  - [x] Production: `deleteSupabaseEvent`

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

glm-5.2 (zai-coding-plan/glm-5.2)

### Debug Log References

### Completion Notes List

- Verified edit-event DialogMode -> handleEventSave(input,'edit') updates the existing id; production saveSupabaseEvent update on input.id. handleEventStatus sets published/archived via updateEventStatus; publishedEvents filter excludes archived from public but retains them for admin. handleDeleteEvent uses window.confirm and removes the event + cascades its registrations (deleteEvent); production deleteSupabaseEvent (RLS admin delete). Existing test covers publish->archive->delete transitions. typecheck + 29 tests pass.

### File List

- Verified: apps/web/src/features/church-events/ChurchEventsApp.tsx, apps/web/src/lib/supabase.ts, packages/domain/src/index.ts

## Change Log

- 2026-06-27: Verified implementation against ACs; hardened domain test coverage and touch-target sizing. Status set to review.
