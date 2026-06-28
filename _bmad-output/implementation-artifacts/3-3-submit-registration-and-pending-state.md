---
baseline_commit: 11281c34c1db5f65b20bb6245be6d1b79db33cd4
---

# Story 3.3: Submit Registration and Pending State

Status: review

## Story

As a participant,
I want to submit my registration,
so that the Admin team can review and approve my participation.

## Acceptance Criteria

1. Given a participant has completed a valid registration form, when they submit the form, then a Registration is created with Approval Status `pending`.
2. Duplicate active Registrations for the same participant and event are prevented.
3. The confirmation message says "Your registration is pending approval."
4. The confirmation includes a route to the participant dashboard or status view.
5. Submit controls prevent duplicate submissions while pending.

## Tasks / Subtasks

- [x] Task 1 — Pending creation (AC: #1)
  - [x] Verify `registerForEvent` creates registration with `approvalStatus: 'pending'`, `rsvpStatus: 'unknown'`
  - [x] Verify notification log appended (`registration_submitted`)
- [x] Task 2 — Duplicate prevention (AC: #2)
  - [x] Verify duplicate check: same eventId + userId + approvalStatus !== 'declined' blocked (domain + UI pre-check)
- [x] Task 3 — Confirmation (AC: #3, #4)
  - [x] Verify notice: "Your registration is pending approval. View it in your participant dashboard."
  - [x] Confirm dashboard route (`/portal`) reachable
- [x] Task 4 — Duplicate-submit guard (AC: #5)
  - [x] Confirm submit button disabled/pending during in-flight (production `runProduction` loading state)

## Dev Notes

### Implementation Context

Build specs are `done`. `handleRegistration` (`ChurchEventsApp.tsx:231`) runs client validation + duplicate pre-check, then production RPC or local `registerForEvent`. Domain duplicate guard (`index.ts:366`). Production RPC `create_registration` (migration 0005) is atomic and also enforces uniqueness server-side.

### Architecture Compliance

- [Source: architecture.md#Communication Patterns] — email/log side effects must not roll back successful domain persistence. `appendNotificationLog` runs after registration insert.
- [Source: ux UX-DR23] — microcopy "Your registration is pending approval."
- Known seam (`deferred-work.md` D2): operation succeeds but `refreshProduction` fails leaves stale UI + error notice.

### Testing Standards

- Bun test asserts pending status on valid submit + duplicate error (`index.test.ts:34`).

### Project Structure Notes

- Submit flow inline in SPA dialog. Domain logic correctly isolated.

### References

- [Source: epics.md#Story 3.3]
- [Source: packages/domain/src/index.ts#registerForEvent]
- [Source: supabase/migrations/0005_atomic_registration_with_rpc.sql]

## Dev Agent Record

### Agent Model Used

glm-5.2 (zai-coding-plan/glm-5.2)

### Debug Log References

### Completion Notes List

- Verified registerForEvent creates registration with approvalStatus:'pending', rsvpStatus:'unknown' and appends a registration_submitted notification log. Duplicate prevention: same eventId+userId with approvalStatus!=='declined' blocked (domain + UI pre-check + production unique constraint). Confirmation notice 'Your registration is pending approval. View it in your participant dashboard.'; /portal reachable. Duplicate-submit guard: submit button disabled during in-flight via submitting state + runProduction loading. Added tests for duplicate blocking and notification log. typecheck + 29 tests pass.

### File List

- Verified: apps/web/src/features/church-events/ChurchEventsApp.tsx, packages/domain/src/index.ts; Test additions: packages/domain/src/index.test.ts

## Change Log

- 2026-06-27: Verified implementation against ACs; hardened domain test coverage and touch-target sizing. Status set to review.
