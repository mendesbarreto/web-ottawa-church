# Story 3.2: Registration Group Counts and Notes

Status: ready-for-dev

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

- [ ] Task 1 — Count inputs (AC: #1, #2)
  - [ ] Verify `validateRegistration` rejects negative/non-integer accompanying + each age range
  - [ ] Verify total rule: `ageTotal === 1 + accompanyingCount`
- [ ] Task 2 — Helper copy (AC: #3)
  - [ ] Confirm UX-DR14 helper text present: include yourself in age ranges
- [ ] Task 3 — Inline + summary validation (AC: #4)
  - [ ] Confirm errors render inline near fields and as summary on submit failure
- [ ] Task 4 — Notes privacy (AC: #5)
  - [ ] Confirm `notes` stored on registration, visible to admin review, never on public event details

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

### Debug Log References

### Completion Notes List

### File List
