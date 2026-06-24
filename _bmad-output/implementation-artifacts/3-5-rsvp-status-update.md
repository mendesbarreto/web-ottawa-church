# Story 3.5: RSVP Status Update

Status: ready-for-dev

## Story

As an approved participant,
I want to update whether I will attend,
so that organizers have accurate planning totals.

## Acceptance Criteria

1. Given a participant has a Registration they own, when they change RSVP Status to Attending or Not attending, then the system saves the new status only for their Registration.
2. RSVP Status does not override Approval Status.
3. Planning-sensitive changes require clear confirmation.
4. The UI confirms "You marked this event as not attending." when applicable.
5. Failed saves revert the selected state and show a useful error.

## Tasks / Subtasks

- [ ] Task 1 — RSVP mutation (AC: #1, #2)
  - [ ] Verify `updateRsvp` changes only `rsvpStatus`, never `approvalStatus` (domain)
  - [ ] Production: `update_own_rsvp` RPC (security definer) updates only own approved row
- [ ] Task 2 — Confirmation (AC: #3, #4)
  - [ ] Confirm confirmation flow for planning-sensitive change
  - [ ] Confirm microcopy "You marked this event as not attending." / "RSVP saved as attending."
- [ ] Task 3 — Failure revert (AC: #5)
  - [ ] Verify failed save shows error and keeps prior state (production: `runProduction` catch sets notice, state refreshed)

## Dev Notes

### Implementation Context

Build specs are `done`. `handleRsvp` (`ChurchEventsApp.tsx:248`). Domain: `updateRsvp` (`index.ts:419`) — only mutates `rsvpStatus`. Production: `updateSupabaseRsvp` (`lib/supabase.ts:259`) calls `update_own_rsvp` RPC (migration `0002_harden_registration_updates.sql`).

### Architecture Compliance

- [Source: architecture.md#Authentication & Security] — RLS/security-definer for participant-owned rows; the RPC enforces ownership + approved status.
- [Source: ux UX-DR19] — confirmation for planning-sensitive RSVP changes.
- [Source: ux UX-DR23] — microcopy.
- Known seams (`deferred-work.md`): Blind#15 — `update_own_rsvp` allows RSVP on past events (no temporal guard); E9 — RPC error shape generic (depends on B1).

### Testing Standards

- Bun test 'approval and totals' asserts RSVP update + attending count (`index.test.ts:74`).
- Production RPC ownership enforced server-side.

### Project Structure Notes

- Inline in SPA; domain isolated correctly.

### References

- [Source: epics.md#Story 3.5]
- [Source: supabase/migrations/0002_harden_registration_updates.sql]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md#Blind15]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
