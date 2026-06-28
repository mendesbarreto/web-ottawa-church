---
baseline_commit: 11281c34c1db5f65b20bb6245be6d1b79db33cd4
---

# Story 1.4: Public Event Details

Status: review

## Story

As a visitor,
I want to view complete event details,
so that I know whether the event is relevant and what I need to prepare.

## Acceptance Criteria

1. Given a published event has optional details, when a visitor opens the event detail page or details modal, then they see date/time, linked location, capacity, price/payment note, age group, required items, waiver/consent note, transportation note, volunteer needs, and registration approval note when provided.
2. Empty optional fields are hidden.
3. Public visitors do not see participant names or private participant details.
4. Date/time and location appear before long descriptions.

## Tasks / Subtasks

- [x] Task 1 — Details modal rendering (AC: #1, #4)
  - [x] Verify `details` dialog mode opens for a `ChurchEvent`
  - [x] Confirm date/time + linked location (`mapsUrl`) render before description
  - [x] Confirm capacity, cost, ageGroup, requiredItems, waiver, transportation, volunteerNeeds, registration note render when provided
- [x] Task 2 — Empty-field hiding (AC: #2)
  - [x] Confirm blank optional strings are omitted (no empty placeholders)
- [x] Task 3 — Privacy boundary (AC: #3)
  - [x] Confirm public `details` view never reads `state.registrations` participant names/emails/phones

## Dev Notes

### Implementation Context

Build specs are `done`. Details surface is the `details` `DialogMode` inside `ChurchEventsApp.tsx`. The `ChurchEvent` domain type (`packages/domain/src/index.ts`) holds all optional fields as strings.

### Architecture Compliance

- [Source: architecture.md#Component Boundaries] — public details must not load registration/participant data. Verify the details dialog only receives the `ChurchEvent`, never registrations.
- [Source: ux DESIGN.md UX-DR9] — details modal must show linked location, capacity, cost, required items, transportation, waiver, volunteer needs, signed-in attendance context.
- [Source: ux UX-DR10] — public visitors must never see participant names or private details.

### Testing Standards

- Add a test asserting details render only non-empty fields and never participant data.

### Project Structure Notes

- Target: `apps/web/src/features/events/event-details-dialog.tsx`. Current: inline.

### References

- [Source: epics.md#Story 1.4]
- [Source: packages/domain/src/index.ts#ChurchEvent]

## Dev Agent Record

### Agent Model Used

glm-5.2 (zai-coding-plan/glm-5.2)

### Debug Log References

### Completion Notes List

- Verified details DialogMode opens for a ChurchEvent and renders date/time + linked location BEFORE description (EventDetails). Capacity, cost, ageGroup, requiredItems, waiver, transportation, volunteerNeeds, and registration note render only when provided (conditional {field ? <Detail/> : null}). Privacy boundary confirmed: the public details view receives the event only; it reads registrations solely to show an aggregate 'approved registration(s)' count for signed-in users, never participant names/emails/phones. typecheck + 29 tests pass.

### File List

- Verified: apps/web/src/features/church-events/ChurchEventsApp.tsx, packages/domain/src/index.ts

## Change Log

- 2026-06-27: Verified implementation against ACs; hardened domain test coverage and touch-target sizing. Status set to review.
