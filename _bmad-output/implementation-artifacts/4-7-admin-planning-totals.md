# Story 4.7: Admin Planning Totals

Status: ready-for-dev

## Story

As an Admin,
I want aggregate planning totals,
so that I can plan food, space, transportation, and supervision.

## Acceptance Criteria

1. Given registrations exist for an event, when an Admin views event planning totals, then totals show Approval Status, RSVP Status, accompanying count, and Age Range aggregates.
2. Totals update after approval changes and RSVP changes.
3. Totals distinguish pending from approved participants.
4. Age Range counts are stored and queried as relational rows, not JSON blobs.

## Tasks / Subtasks

- [ ] Task 1 — Aggregate totals (AC: #1, #2, #3)
  - [ ] Verify `eventTotals(eventId, registrations)` returns pending/approved/declined/attending/notAttending/people/ages
  - [ ] Confirm people = sum(1 + accompanying) excluding declined; ages per range
  - [ ] Confirm totals recompute after approval/RSVP changes (derived from current registrations)
- [ ] Task 2 — Relational age counts (AC: #4)
  - [ ] Domain: `ageCountRows(registration)` produces `{registrationId, ageRange, count}` rows
  - [ ] Production: `registration_age_counts` table (relational), joined in `loadProductionState`

## Dev Notes

### Implementation Context

Build specs are `done`. `eventTotals` (`packages/domain/src/index.ts:426`) — single pass over event registrations. `ageCountRows` (`:451`) relational projection. Production: age counts loaded from `registration_age_counts` via `.in('registration_id', registrationIds)` (`lib/supabase.ts:131`).

### Architecture Compliance

- [Source: architecture.md#Data Boundaries] — age-range counts stored as rows, not JSON blobs. `registration_age_counts` table enforced.
- [Source: architecture.md#Anti-Patterns] — JSON age-count blobs when relational rows are needed (forbidden).
- Known scale seam (`deferred-work.md` E10): `.in('registration_id', registrationIds)` URL overflow at ~200+ registrations; add chunking in `loadProductionState`.
- Known drift seam (`deferred-work.md` E11): `age_range` enum drift would silently break `validateRegistration` sum (loops only known keys); add runtime guard in `mapRegistration`.

### Testing Standards

- Bun test 'approval and totals' asserts approved=1, attending=1, people=2 (`index.test.ts:74`).

### Project Structure Notes

- Totals logic correctly in `packages/domain`; age rows in DB.

### References

- [Source: epics.md#Story 4.7]
- [Source: packages/domain/src/index.ts#eventTotals]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md#E10, E11]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
