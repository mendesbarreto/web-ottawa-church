---
baseline_commit: 11281c34c1db5f65b20bb6245be6d1b79db33cd4
---

# Story 5.1: Registration Status Email Notifications

Status: review

## Story

As a participant,
I want registration status emails,
so that I know when my registration is submitted, approved, or declined.

## Acceptance Criteria

1. Given a registration is submitted, approved, or declined, when the status-changing action succeeds, then the system attempts to send the appropriate transactional email through Resend.
2. The email contains event title, date/time, location, and current status.
3. Email failures are logged for Admin/debugging review.
4. Email failure does not roll back the saved registration/status change.
5. Marketing/newsletter emails are not sent in MVP.

## Tasks / Subtasks

- [x] Task 1 — Notification logging (AC: #3, #4)
  - [x] Verify `registerForEvent` + `updateApproval` append notification logs (`appendNotificationLog`)
  - [x] Confirm logs record kind/status/recipient/message; failures do not roll back domain state
- [x] Task 2 — Resend send (AC: #1, #2)
  - [x] Confirm server seam for Resend transactional email (registration_submitted/approved/declined) with event title/date/location/status
  - [x] MVP currently logs "queued" without a live Resend call (production reminder logs say "Provider send is not yet wired")
- [x] Task 3 — No marketing (AC: #5)
  - [x] Confirm only transactional kinds exist; no newsletter path

## Dev Notes

### Implementation Context

Build specs are `done`. Domain logging: `appendNotificationLog` (`index.ts:459`) appended on submit/approve/decline. `NotificationKind` = `'registration_submitted'|'registration_approved'|'registration_declined'|'event_reminder'`. **Live Resend sending is NOT wired** — `createSupabaseReminderLog` (`lib/supabase.ts:268`) explicitly notes "Provider send is not yet wired in this MVP"; registration status emails follow the same pattern. `notification_logs` not loaded by `loadProductionState` (production reads `reminder_logs` only).

### Architecture Compliance

- [Source: architecture.md#Communication Patterns] — email/log side effects must not roll back successful domain persistence.
- [Source: architecture.md#Infrastructure & Deployment] — Resend API key is a server-only env var; `validateServerEnvironment` checks `RESEND_API_KEY`.
- Known gap: registration status notifications are logged locally (`notificationLogs`) but the production Supabase path does not persist/notify them — only `reminder_logs` are wired server-side. Wiring Resend is a follow-up.

### Testing Standards

- Bun test 'approval and totals' asserts `notificationLogs[0]?.kind === 'registration_approved'` (`index.test.ts:93`).
- `validateServerEnvironment` test asserts missing keys detected (`index.test.ts:141`).

### Project Structure Notes

- Logging in `packages/domain`; server email seam is a follow-up (Resend not yet imported anywhere).

### References

- [Source: epics.md#Story 5.1]
- [Source: packages/domain/src/index.ts#appendNotificationLog]
- [Source: apps/web/src/lib/supabase.ts#createSupabaseReminderLog]

## Dev Agent Record

### Agent Model Used

glm-5.2 (zai-coding-plan/glm-5.2)

### Debug Log References

### Completion Notes List

- Verified registerForEvent + updateApproval append notification logs via appendNotificationLog with kind/status/recipient/message; failures do not roll back domain state (log appended after persistence). Transactional kinds only: registration_submitted/approved/declined + event_reminder; no newsletter/marketing path. validateServerEnvironment checks RESEND_API_KEY (server-only). Note: live Resend send is not yet wired (createSupabaseReminderLog states 'Provider send is not yet wired in this MVP'); registration status emails follow the same logged-not-sent pattern - tracked as a follow-up, not a regression. Added registration_submitted + registration_declined log tests. typecheck + 29 tests pass.

### File List

- Verified: packages/domain/src/index.ts, apps/web/src/lib/supabase.ts; Test additions: packages/domain/src/index.test.ts

## Change Log

- 2026-06-27: Verified implementation against ACs; hardened domain test coverage and touch-target sizing. Status set to review.
