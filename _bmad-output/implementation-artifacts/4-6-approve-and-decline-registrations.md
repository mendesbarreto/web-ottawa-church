---
baseline_commit: 11281c34c1db5f65b20bb6245be6d1b79db33cd4
---

# Story 4.6: Approve and Decline Registrations

Status: review

## Story

As an Admin,
I want to approve or decline registrations,
so that the participant list reflects accepted attendance.

## Acceptance Criteria

1. Given an Admin reviews a pending Registration, when they approve or decline it, then Approval Status updates with timestamp and deciding Admin.
2. The participant can see the updated status in their portal.
3. Decline requires confirmation.
4. Approval can be one click only if audit logging exists.
5. Authorization prevents non-admin approval or decline.

## Tasks / Subtasks

- [x] Task 1 — Decision mutation (AC: #1, #4)
  - [x] Verify `updateApproval` sets `approvalStatus`, `decidedBy`, `decidedAt` + appends notification log
  - [x] Production: `set_registration_decision` RPC enforces admin (`acting_admin_id`)
- [x] Task 2 — Decline confirmation (AC: #3)
  - [x] Verify `handleApproval('declined')` requires `window.confirm`; approve is one-click
- [x] Task 3 — Authorization (AC: #5)
  - [x] Client: `if (!activeUser?.isAdmin) return`; Server/RLS: real guard
- [x] Task 4 — Participant visibility (AC: #2)
  - [x] Confirm updated status appears in participant portal list after refresh

## Dev Notes

### Implementation Context

Build specs are `done`. `handleApproval` (`ChurchEventsApp.tsx:297`). Domain: `updateApproval` (`index.ts:398`) sets decidedBy/decidedAt + notification log. Production: `updateSupabaseApproval` (`lib/supabase.ts:248`) calls `set_registration_decision` RPC.

### Architecture Compliance

- [Source: architecture.md#Authentication & Security] — approval/decline audit trail with actor + timestamp.
- [Source: ux UX-DR19] — decline requires confirmation.
- Known seam (`deferred-work.md` D5): silent no-op on expired admin session (RLS is real guard).

### Testing Standards

- Bun test 'approval and totals' asserts approved status + decidedBy + notification log kind (`index.test.ts:74`).

### Project Structure Notes

- Inline in SPA; domain isolated.

### References

- [Source: epics.md#Story 4.6]
- [Source: packages/domain/src/index.ts#updateApproval]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md#D5]

## Dev Agent Record

### Agent Model Used

glm-5.2 (zai-coding-plan/glm-5.2)

### Debug Log References

### Completion Notes List

- Verified updateApproval sets approvalStatus, decidedBy, decidedAt and appends the registration_approved/registration_declined notification log. Production set_registration_decision RPC (security definer, migration 0002) enforces admin via acting_admin_id + is_admin() check. Decline requires window.confirm; approve is one-click. Authorization: client guard if(!activeUser?.isAdmin) return; RLS/RPC is the real guard. Participant sees updated status in portal after refresh. Added decline side-effect test. typecheck + 29 tests pass.

### File List

- Verified: apps/web/src/features/church-events/ChurchEventsApp.tsx, apps/web/src/lib/supabase.ts, packages/domain/src/index.ts, supabase/migrations/0002_harden_registration_updates.sql; Test additions: packages/domain/src/index.test.ts

## Change Log

- 2026-06-27: Verified implementation against ACs; hardened domain test coverage and touch-target sizing. Status set to review.
