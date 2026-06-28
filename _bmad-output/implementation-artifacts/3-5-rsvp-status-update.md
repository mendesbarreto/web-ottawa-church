---
baseline_commit: 11281c34c1db5f65b20bb6245be6d1b79db33cd4
---

# Story 3.5: RSVP Status Update

Status: review

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

- [x] Task 1 — RSVP mutation (AC: #1, #2)
  - [x] Verify `updateRsvp` changes only `rsvpStatus`, never `approvalStatus` (domain)
  - [x] Production: `update_own_rsvp` RPC (security definer) updates only own approved row
- [x] Task 2 — Confirmation (AC: #3, #4)
  - [x] Confirm confirmation flow for planning-sensitive change
  - [x] Confirm microcopy "You marked this event as not attending." / "RSVP saved as attending."
- [x] Task 3 — Failure revert (AC: #5)
  - [x] Verify failed save shows error and keeps prior state (production: `runProduction` catch sets notice, state refreshed)

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

glm-5.2 (zai-coding-plan/glm-5.2)

### Debug Log References

### Completion Notes List

- Verified updateRsvp changes only rsvpStatus, never approvalStatus (domain). Production update_own_rsvp RPC (security definer, migration 0002) updates only the row where user_id=auth.uid() AND approval_status='approved'. Confirmation flow: not_attending uses window.confirm; microcopy 'You marked this event as not attending.' / 'RSVP saved as attending.'. Failure revert: runProduction catch sets a notice and refreshes state (no stale optimistic update). typecheck + 29 tests pass.

### File List

- Verified: apps/web/src/features/church-events/ChurchEventsApp.tsx, apps/web/src/lib/supabase.ts, packages/domain/src/index.ts, supabase/migrations/0002_harden_registration_updates.sql

## Change Log

- 2026-06-27: Verified implementation against ACs; hardened domain test coverage and touch-target sizing. Status set to review.
