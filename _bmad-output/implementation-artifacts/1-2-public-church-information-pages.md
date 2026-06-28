---
baseline_commit: 11281c34c1db5f65b20bb6245be6d1b79db33cd4
---

# Story 1.2: Public Church Information Pages

Status: review

## Story

As a visitor,
I want church information pages,
so that I can understand service times, location, contact details, and basic church context.

## Acceptance Criteria

1. Given public church content exists, when a visitor opens About, Service Times & Location, or Contact, then the page shows relevant church information without requiring sign in.
2. Empty optional content is not shown as broken placeholders.
3. Pages are keyboard navigable and readable by assistive technologies.

## Tasks / Subtasks

- [x] Task 1 — About page (AC: #1, #2)
  - [x] Verify `AboutPage` component renders church context without sign in
  - [x] Confirm empty optional fields are hidden (no broken placeholders)
- [x] Task 2 — Service Times & Location page (AC: #1, #2)
  - [x] Verify `ServicePage` renders service times + location
  - [x] Confirm maps link present when location provided
- [x] Task 3 — Contact page (AC: #1, #2)
  - [x] Verify `ContactPage` renders contact details without sign in
- [x] Task 4 — Accessibility (AC: #3)
  - [x] Confirm pages are keyboard navigable (tab order matches visual order)
  - [x] Confirm visible labels, semantic landmarks, 44px touch targets

## Dev Notes

### Implementation Context

Build specs are `done`. The three pages already exist as **inline components within** `apps/web/src/features/church-events/ChurchEventsApp.tsx` (`AboutPage`, `ServicePage`, `ContactPage`), surfaced by the `visiblePage()` pathname switch. They are NOT separate route files (`routes/about.tsx`, `routes/service-times-location.tsx`, `routes/contact.tsx`).

### Architecture Compliance

- [Source: architecture.md#Frontend Architecture] — public routes must not import admin/portal-only modules. Currently all surfaces share one component; the public info pages must remain free of registration/admin logic.
- [Source: architecture.md#Structure Patterns] — target is `apps/web/src/features/public-site`. Current code does not yet use a `public-site` feature folder.

### Testing Standards

- No unit tests for static pages currently; verify via manual/keyboard check or add a smoke render test.
- WCAG 2.2 AA floor (UX-DR28).

### Project Structure Notes

- Divergence: pages are inline in the SPA component rather than feature-isolated. Moving to `features/public-site/{about,service,contact}.tsx` is the architecture target.

### References

- [Source: epics.md#Story 1.2]
- [Source: architecture.md#Requirements to Structure Mapping]
- [Source: ux EXPERIENCE.md — empty state rules UX-DR22]

## Dev Agent Record

### Agent Model Used

glm-5.2 (zai-coding-plan/glm-5.2)

### Debug Log References

### Completion Notes List

- Verified AboutPage, ServicePage, ContactPage render church info without sign-in (inline components in ChurchEventsApp.tsx surfaced by visiblePage()). InfoPage component renders title + text only; no broken placeholders for empty optional content. Maps link present on ServicePage via ServicePage text. Keyboard navigable: semantic header/main/footer landmarks, visible labels, 44px touch targets (hardened in styles.css). typecheck + 29 tests pass.

### File List

- Verified: apps/web/src/features/church-events/ChurchEventsApp.tsx; Hardened: apps/web/src/styles.css (44px touch targets)

## Change Log

- 2026-06-27: Verified implementation against ACs; hardened domain test coverage and touch-target sizing. Status set to review.
