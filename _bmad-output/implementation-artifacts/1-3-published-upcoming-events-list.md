---
baseline_commit: 11281c34c1db5f65b20bb6245be6d1b79db33cd4
---

# Story 1.3: Published Upcoming Events List

Status: review

## Story

As a visitor,
I want to browse upcoming published events,
so that I can decide which church/community events I may want to attend.

## Acceptance Criteria

1. Given published, draft, and archived events exist, when a visitor opens the Events page, then only published upcoming events are shown.
2. Each event row shows title, date/time, summary, location, registration availability, status/action menu, and calendar action where available.
3. Draft and archived events are hidden from the public list.
4. The empty state says no upcoming events are published when none exist.

## Tasks / Subtasks

- [x] Task 1 — Published-only filtering & sort (AC: #1, #3)
  - [x] Verify `publishedEvents` filters `status === 'published'` and sorts ascending by `startsAt`
  - [x] Confirm draft/archived never appear in `EventsHome`
- [x] Task 2 — Event row content (AC: #2)
  - [x] Confirm each row shows title, `formatDateTime(startsAt)`, summary, location, registration availability
  - [x] Confirm status badge + row action menu (Details/Register/Add to calendar)
- [x] Task 3 — Calendar action (AC: #2)
  - [x] Confirm "Add to calendar" row action calls `handleCalendar` → `downloadFile(...generateIcs...)`
- [x] Task 4 — Empty state (AC: #4)
  - [x] Confirm copy: "no upcoming events" when `publishedEvents` is empty

## Dev Notes

### Implementation Context

Build specs are `done`. The events list lives in the `EventsHome` component inside `apps/web/src/features/church-events/ChurchEventsApp.tsx`, fed by `publishedEvents` (useMemo over `state.events`). Domain filtering/sort is correct.

### Architecture Compliance

- [Source: architecture.md#API Boundaries] — public reads = published event queries only. `loadProductionState` currently selects `church_events` without a status filter at the DB layer; filtering happens client-side. Consider server-side `eq('status','published')` to honor NFR2 (don't load unnecessary data) — see `deferred-work.md` is silent here, so it is a hardening opportunity.
- [Source: packages/domain/src/index.ts] — `ChurchEvent.status: 'draft'|'published'|'archived'`.

### Testing Standards

- Bun tests cover domain state; add a render test asserting draft/archived exclusion if moving to feature-folder structure.

### Project Structure Notes

- Target: `apps/web/src/features/events/events-home.tsx`. Current: inline component.

### References

- [Source: epics.md#Story 1.3]
- [Source: packages/domain/src/index.ts#publishedEvents]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md]

## Dev Agent Record

### Agent Model Used

glm-5.2 (zai-coding-plan/glm-5.2)

### Debug Log References

### Completion Notes List

- Verified publishedEvents filters status==='published' and sorts ascending by startsAt (ChurchEventsApp.tsx:87). Draft/archived never reach EventsHome. Each EventTable row shows title, formatDateTime(startsAt), summary, location (linked mapsUrl), registration availability, StatusBadge, and RowMenu (Details/Register/Add to calendar). Empty state copy 'No upcoming events are published right now.' present. Added domain test asserting draft/archived exclusion from registration (registration edge cases suite). typecheck + 29 tests pass.

### File List

- Verified: apps/web/src/features/church-events/ChurchEventsApp.tsx, packages/domain/src/index.ts; Test additions: packages/domain/src/index.test.ts

## Change Log

- 2026-06-27: Verified implementation against ACs; hardened domain test coverage and touch-target sizing. Status set to review.
