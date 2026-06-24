# Story 5.4: Printable Roster View

Status: ready-for-dev

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

- [ ] Task 1 — Print surface (AC: #1, #3)
  - [ ] Verify `print` `DialogMode` (or print route) renders print-optimized layout
  - [ ] Confirm navigation/decorative UI hidden in print (`@media print`)
- [ ] Task 2 — Planning data (AC: #2)
  - [ ] Confirm participant, approval, RSVP, accompanying, age-range counts present
- [ ] Task 3 — Admin-only (AC: #4)
  - [ ] Verify print view gated on admin (client + RLS for the underlying registrations)

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

### Debug Log References

### Completion Notes List

### File List
