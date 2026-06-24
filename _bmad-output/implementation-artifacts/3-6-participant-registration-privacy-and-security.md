# Story 3.6: Participant Registration Privacy and Security

Status: ready-for-dev

## Story

As a participant,
I want my registration details protected,
so that only I and authorized Admins can access them.

## Acceptance Criteria

1. Given registration data exists, when a participant requests registration data, then they can access only their own Registrations.
2. Server-side authorization and Supabase RLS enforce ownership.
3. Exact child names, exact ages, and unnecessary child details are not collected.
4. Public event details never expose private participant data.

## Tasks / Subtasks

- [ ] Task 1 — Ownership scoping (AC: #1, #2)
  - [ ] Verify local list filters by `activeUser.id`
  - [ ] Verify RLS policies on `registrations` + `registration_age_counts` in migration 0001 enforce self/admin read
- [ ] Task 2 — Minimal data collection (AC: #3)
  - [ ] Confirm registration collects only accompanying count + age-range counts + notes (no child names/exact ages)
- [ ] Task 3 — Public privacy (AC: #4)
  - [ ] Confirm public event details path never reads registrations/participant names

## Dev Notes

### Implementation Context

Build specs are `done`. Privacy-by-minimization is enforced by the domain types: `Registration.ageCounts: Record<AgeRangeKey, number>` with keys `'0-3' | '4-12' | '13-17' | '18+'`. RLS in `0001_church_events.sql`; RSVP hardened by security-definer RPC in `0002`.

### Architecture Compliance

- [Source: architecture.md#Authentication & Security] — RLS mandatory; no service-role key in browser.
- [Source: architecture.md#Cross-Cutting Concerns] — privacy-by-minimization for child/family data.
- [Source: ux UX-DR10, UX-DR31] — public never sees participant data; no child names/exact ages.
- [Source: architecture.md#Anti-Patterns] — admin checks only in React components (forbidden); enforced server-side.

### Testing Standards

- Audit migration 0001 RLS policies cover `registrations` select/update and `registration_age_counts` select.
- Bun tests assert minimal registration shape.

### Project Structure Notes

- Boundaries enforced at DB (RLS) + domain types + production RPCs.

### References

- [Source: epics.md#Story 3.6]
- [Source: supabase/migrations/0001_church_events.sql]
- [Source: ux UX-DR31]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
