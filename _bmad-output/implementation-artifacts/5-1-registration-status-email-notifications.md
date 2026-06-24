# Story 5.1: Registration Status Email Notifications

Status: ready-for-dev

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

- [ ] Task 1 — Notification logging (AC: #3, #4)
  - [ ] Verify `registerForEvent` + `updateApproval` append notification logs (`appendNotificationLog`)
  - [ ] Confirm logs record kind/status/recipient/message; failures do not roll back domain state
- [ ] Task 2 — Resend send (AC: #1, #2)
  - [ ] Confirm server seam for Resend transactional email (registration_submitted/approved/declined) with event title/date/location/status
  - [ ] MVP currently logs "queued" without a live Resend call (production reminder logs say "Provider send is not yet wired")
- [ ] Task 3 — No marketing (AC: #5)
  - [ ] Confirm only transactional kinds exist; no newsletter path

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

### Debug Log References

### Completion Notes List

### File List
