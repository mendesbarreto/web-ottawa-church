---
baseline_commit: 11281c34c1db5f65b20bb6245be6d1b79db33cd4
---

# Story 1.5: Public Calendar Export

Status: review

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

- [x] Task 1 — `.ics` generation (AC: #1, #2)
  - [x] Verify `generateIcs(event, siteUrl)` produces valid VCALENDAR/VEVENT (DTSTART/DTEND, SUMMARY, LOCATION, DESCRIPTION with URL)
  - [x] Verify line endings are CRLF (`\r\n`) and escaping handles `\\;,` and newlines
- [x] Task 2 — Download path (AC: #1, #4)
  - [x] Verify `handleCalendar` → `downloadFile(`${event.id}.ics`, generateIcs(event, window.location.origin), 'text/calendar;charset=utf-8')`
  - [x] Confirm `download.ts` Blob + object URL fallback works when open fails
- [x] Task 3 — No sync requirement (AC: #3)
  - [x] Confirm no calendar write-back / OAuth — pure file download
- [x] Task 4 — Tests (AC: #1, #2)
  - [x] Confirm `packages/domain/src/index.test.ts` 'exports' suite asserts `BEGIN:VCALENDAR` + `SUMMARY:...`

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

glm-5.2 (zai-coding-plan/glm-5.2)

### Debug Log References

### Completion Notes List

- Verified generateIcs(event, siteUrl) produces valid VCALENDAR/VEVENT with DTSTART/DTEND, SUMMARY, LOCATION, DESCRIPTION embedding the event URL, UID, VERSION, PRODID. Line endings are CRLF (join('
')); escapeText escapes \;, and newlines. handleCalendar -> downloadFile(`${event.id}.ics`, generateIcs(...), 'text/calendar;charset=utf-8'); download.ts uses Blob + object URL (download fallback). No calendar write-back/OAuth. Strengthened the 'ics calendar structure' test suite asserting title/date/location/URL/CRLF/escaping. typecheck + 29 tests pass.

### File List

- Verified: packages/domain/src/index.ts, apps/web/src/lib/download.ts, apps/web/src/features/church-events/ChurchEventsApp.tsx; Test additions: packages/domain/src/index.test.ts

## Change Log

- 2026-06-27: Verified implementation against ACs; hardened domain test coverage and touch-target sizing. Status set to review.
