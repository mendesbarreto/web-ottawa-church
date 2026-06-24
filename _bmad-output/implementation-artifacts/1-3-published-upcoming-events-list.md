# Story 1.3: Published Upcoming Events List

Status: ready-for-dev

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

- [ ] Task 1 — Published-only filtering & sort (AC: #1, #3)
  - [ ] Verify `publishedEvents` filters `status === 'published'` and sorts ascending by `startsAt`
  - [ ] Confirm draft/archived never appear in `EventsHome`
- [ ] Task 2 — Event row content (AC: #2)
  - [ ] Confirm each row shows title, `formatDateTime(startsAt)`, summary, location, registration availability
  - [ ] Confirm status badge + row action menu (Details/Register/Add to calendar)
- [ ] Task 3 — Calendar action (AC: #2)
  - [ ] Confirm "Add to calendar" row action calls `handleCalendar` → `downloadFile(...generateIcs...)`
- [ ] Task 4 — Empty state (AC: #4)
  - [ ] Confirm copy: "no upcoming events" when `publishedEvents` is empty

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

### Debug Log References

### Completion Notes List

### File List
