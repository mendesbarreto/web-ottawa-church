---
baseline_commit: 11281c34c1db5f65b20bb6245be6d1b79db33cd4
---

# Story 3.2: Registration Group Counts and Notes

Status: review

## Story

As a participant,
I want to provide accompanying people, age-range counts, and notes,
so that organizers have the planning information they need.

## Acceptance Criteria

1. Given the registration modal is open, when the participant enters accompanying count, Age Range counts, and optional notes, then counts must be zero or greater.
2. Age Range counts must total `1 + accompanying people count`.
3. Helper text explains that the participant must include themselves in the age ranges.
4. Validation errors appear inline near the relevant fields and in a submission summary when needed.
5. Notes are saved for Admin review but never shown publicly.

## Tasks / Subtasks

- [x] Task 1 — Count inputs (AC: #1, #2)
  - [x] Verify `validateRegistration` rejects negative/non-integer accompanying + each age range
  - [x] Verify total rule: `ageTotal === 1 + accompanyingCount`
- [x] Task 2 — Helper copy (AC: #3)
  - [x] Confirm UX-DR14 helper text present: include yourself in age ranges
- [x] Task 3 — Inline + summary validation (AC: #4)
  - [x] Confirm errors render inline near fields and as summary on submit failure
- [x] Task 4 — Notes privacy (AC: #5)
  - [x] Confirm `notes` stored on registration, visible to admin review, never on public event details

## Dev Notes

### Implementation Context

Build specs are `done`. Validation: `validateRegistration` (`packages/domain/src/index.ts:216`) — checks integer ≥0 per count and the sum rule with message `Age ranges must total ${expectedTotal}. Include yourself in the age ranges.` Age ranges: `'0-3' | '4-12' | '13-17' | '18+'` (`ageRanges` array). `emptyAgeCounts()` defaults to one `18+`.

### Architecture Compliance

- [Source: architecture.md#Cross-Cutting Concerns] — registration validation must keep accompanying count + age-range totals consistent (client AND server).
- [Source: architecture.md#Data Boundaries] — age-range counts stored as rows, not JSON blobs. Domain `ageCountRows()` (`index.ts:451`) produces relational rows; production stores via `registration_age_counts` table.
- [Source: ux UX-DR13, UX-DR14] — numeric age inputs + helper copy.
- [Source: ux UX-DR31] — do NOT collect child names/exact ages; counts only.

### Testing Standards

- Bun test 'registration validation' asserts the total-3 message for a mismatched group (`index.test.ts:24`).

### Project Structure Notes

- Validation lives correctly in `packages/domain`. UI inline in SPA.

### References

- [Source: epics.md#Story 3.2]
- [Source: packages/domain/src/index.ts#validateRegistration]
- [Source: ux UX-DR13, UX-DR14, UX-DR31]

## Dev Agent Record

### Agent Model Used

glm-5.2 (zai-coding-plan/glm-5.2)

### Debug Log References

### Completion Notes List

- Verified validateRegistration rejects negative/non-integer accompanying and each age range, and enforces ageTotal === 1 + accompanyingCount with helper message 'Include yourself in the age ranges.' RegistrationForm shows UX-DR14 helper copy. Errors render inline via ErrorList (summary on submit failure). Notes stored on registration, visible in admin ReviewRegistrations, never on public EventDetails. typecheck + 29 tests pass.

### File List

- Verified: apps/web/src/features/church-events/ChurchEventsApp.tsx, packages/domain/src/index.ts

## Change Log

- 2026-06-27: Verified implementation against ACs; hardened domain test coverage and touch-target sizing. Status set to review.
