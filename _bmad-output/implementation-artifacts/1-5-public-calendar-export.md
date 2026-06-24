# Story 1.5: Public Calendar Export

Status: ready-for-dev

## Story

As a visitor or participant,
I want to add an event to my calendar,
so that I can keep the event details in my personal calendar app.

## Acceptance Criteria

1. Given a published event has title, date/time, location, description, and URL, when a visitor selects Add to calendar, then the system downloads or opens a valid `.ics` file.
2. The file includes event title, date/time, location, description, and event URL.
3. No two-way calendar synchronization is required.
4. If automatic opening fails, the user still receives a download fallback.

## Tasks / Subtasks

- [ ] Task 1 — `.ics` generation (AC: #1, #2)
  - [ ] Verify `generateIcs(event, siteUrl)` produces valid VCALENDAR/VEVENT (DTSTART/DTEND, SUMMARY, LOCATION, DESCRIPTION with URL)
  - [ ] Verify line endings are CRLF (`\r\n`) and escaping handles `\\;,` and newlines
- [ ] Task 2 — Download path (AC: #1, #4)
  - [ ] Verify `handleCalendar` → `downloadFile(`${event.id}.ics`, generateIcs(event, window.location.origin), 'text/calendar;charset=utf-8')`
  - [ ] Confirm `download.ts` Blob + object URL fallback works when open fails
- [ ] Task 3 — No sync requirement (AC: #3)
  - [ ] Confirm no calendar write-back / OAuth — pure file download
- [ ] Task 4 — Tests (AC: #1, #2)
  - [ ] Confirm `packages/domain/src/index.test.ts` 'exports' suite asserts `BEGIN:VCALENDAR` + `SUMMARY:...`

## Dev Notes

### Implementation Context

Build specs are `done`. Implemented and tested: `generateIcs` in `packages/domain/src/index.ts:523`, `handleCalendar` in `ChurchEventsApp.tsx:307`, `downloadFile` in `apps/web/src/lib/download.ts`.

### Architecture Compliance

- [Source: architecture.md#Communication Patterns] — deterministic generators for `.ics`. `generateIcs` is pure/deterministic.
- [Source: architecture.md#API Boundaries] — `.ics` is public for published events. Calendar action appears on public event rows.
- Deferred: DTSTAMP uses `new Date().toISOString()` so output is not byte-stable across runs; acceptable per spec (only the structure must be deterministic/testable, not the timestamp).

### Testing Standards

- Bun test exists (`index.test.ts` 'exports'). Verify it covers title/location/description/URL presence.

### Project Structure Notes

- Generator lives correctly in `packages/domain`; download helper in `apps/web/src/lib/download.ts`. Aligned with architecture.

### References

- [Source: epics.md#Story 1.5]
- [Source: packages/domain/src/index.ts#generateIcs]
- [Source: ux UX-DR21]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
