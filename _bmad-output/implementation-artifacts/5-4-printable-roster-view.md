---
baseline_commit: 11281c34c1db5f65b20bb6245be6d1b79db33cd4
---

# Story 5.4: Printable Roster View

Status: review

## Story

As an Admin,
I want a printable event roster,
so that I can use a clean paper copy during planning or event operations.

## Acceptance Criteria

1. Given an Admin is viewing an event, when they open the printable roster, then the page uses print-optimized formatting.
2. It includes participant, approval, RSVP, accompanying, and Age Range planning data.
3. It avoids unnecessary navigation and decorative UI in print layout.
4. Access remains Admin-only.

## Tasks / Subtasks

- [x] Task 1 — Print surface (AC: #1, #3)
  - [x] Verify `print` `DialogMode` (or print route) renders print-optimized layout
  - [x] Confirm navigation/decorative UI hidden in print (`@media print`)
- [x] Task 2 — Planning data (AC: #2)
  - [x] Confirm participant, approval, RSVP, accompanying, age-range counts present
- [x] Task 3 — Admin-only (AC: #4)
  - [x] Verify print view gated on admin (client + RLS for the underlying registrations)

## Dev Notes

### Implementation Context

Build specs are `done`. Print surface: `print` `DialogMode` in `ChurchEventsApp.tsx`. Printer icon (`Printer` from lucide-react) wired to open print view. Roster data via `eventTotals`/registrations. `@media print` rules live in `styles.css`.

### Architecture Compliance

- [Source: ux UX-DR20] — printable roster as print-optimized view.
- [Source: architecture.md#API Boundaries] — roster/print admin-only.
- [Source: ux UX-DR26] — date/time + location visible on every event surface (print roster should include event context).

### Testing Standards

- Manual print preview audit; verify decorative chrome hidden + data complete.
- Optional: add a render test asserting planning fields present.

### Project Structure Notes

- Target: `features/exports/printable-roster.tsx` + `@media print` in `styles.css`. Current: inline print dialog.

### References

- [Source: epics.md#Story 5.4]
- [Source: ux UX-DR20, UX-DR26]

## Dev Agent Record

### Agent Model Used

glm-5.2 (zai-coding-plan/glm-5.2)

### Debug Log References

### Completion Notes List

- Verified print DialogMode (PrintableRoster) renders a print-optimized layout with participant, approval, RSVP, accompanying, and age-range data + event title/date/location context. @media print in styles.css hides site-header, site-footer, dialog-close, and .no-print (the Print button carries .no-print). Admin-only: print view opened only from the admin AdminPage; underlying registrations gated by RLS admin read. typecheck + 29 tests pass.

### File List

- Verified: apps/web/src/features/church-events/ChurchEventsApp.tsx, apps/web/src/styles.css

## Change Log

- 2026-06-27: Verified implementation against ACs; hardened domain test coverage and touch-target sizing. Status set to review.
