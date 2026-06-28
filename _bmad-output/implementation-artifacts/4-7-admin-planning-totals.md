---
baseline_commit: 11281c34c1db5f65b20bb6245be6d1b79db33cd4
---

# Story 4.7: Admin Planning Totals

Status: review

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

- [x] Task 1 — Aggregate totals (AC: #1, #2, #3)
  - [x] Verify `eventTotals(eventId, registrations)` returns pending/approved/declined/attending/notAttending/people/ages
  - [x] Confirm people = sum(1 + accompanying) excluding declined; ages per range
  - [x] Confirm totals recompute after approval/RSVP changes (derived from current registrations)
- [x] Task 2 — Relational age counts (AC: #4)
  - [x] Domain: `ageCountRows(registration)` produces `{registrationId, ageRange, count}` rows
  - [x] Production: `registration_age_counts` table (relational), joined in `loadProductionState`

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

glm-5.2 (zai-coding-plan/glm-5.2)

### Debug Log References

### Completion Notes List

- Verified eventTotals(eventId, registrations) returns pending/approved/declined/attending/notAttending/people/ages. people = sum(1 + accompanying) excluding declined; ages aggregated per range; totals recompute from current registrations after approval/RSVP changes. Relational age counts: domain ageCountRows produces {registrationId,ageRange,count} rows; production stores via registration_age_counts table (migration 0001) loaded via .in('registration_id', ids). Added planning-totals completeness tests (excludes declined, sums ages). typecheck + 29 tests pass.

### File List

- Verified: packages/domain/src/index.ts, apps/web/src/lib/supabase.ts, supabase/migrations/0001_church_events.sql; Test additions: packages/domain/src/index.test.ts

## Change Log

- 2026-06-27: Verified implementation against ACs; hardened domain test coverage and touch-target sizing. Status set to review.
