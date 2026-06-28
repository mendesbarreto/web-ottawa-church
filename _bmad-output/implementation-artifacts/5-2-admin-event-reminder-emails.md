---
baseline_commit: 11281c34c1db5f65b20bb6245be6d1b79db33cd4
---

# Story 5.2: Admin Event Reminder Emails

Status: review

## Story

As an Admin,
I want to send reminder emails for an event,
so that approved participants receive practical event details before attending.

## Acceptance Criteria

1. Given an Admin is viewing an event with approved participants, when they choose Send reminder, then the system asks for confirmation before sending.
2. Reminders respect provider limits and avoid accidental duplicate sends.
3. Email send failures are logged without changing registration data.
4. Exported rosters remain available as fallback if email sending is unavailable.

## Tasks / Subtasks

- [x] Task 1 — Reminder with confirmation (AC: #1)
  - [x] Verify `handleReminder` uses `window.confirm("Send reminder to approved participants...")`
- [x] Task 2 — Duplicate-send guard (AC: #2)
  - [x] Domain: `sendEventReminder` skips if a reminder was logged within 1 hour for the event
  - [x] Confirm skip log status `'skipped'`
- [x] Task 3 — Logging (AC: #3)
  - [x] Local: `reminderLogs` updated; Production: `createSupabaseReminderLog` inserts `reminder_logs`
  - [x] Confirm failures logged, registration data untouched
- [x] Task 4 — Roster fallback (AC: #4)
  - [x] Confirm CSV roster export remains available (Story 5.3) regardless of email availability

## Dev Notes

### Implementation Context

Build specs are `done`. `handleReminder` (`ChurchEventsApp.tsx:286`). Domain: `sendEventReminder` (`index.ts:482`) — 1-hour de-dupe + approved-only recipient count. Production: `createSupabaseReminderLog` (`lib/supabase.ts:268`) inserts `reminder_logs` with status `queued`/`skipped`. **Live Resend send not wired** (log message states it). `reminder_logs` table + `0007_add_queued_log_status.sql` (adds `queued` status).

### Architecture Compliance

- [Source: ux UX-DR19] — reminder send requires confirmation.
- [Source: architecture.md#Communication Patterns] — reminder side effects logged, non-blocking.
- Known seam (`deferred-work.md` D3): `recipient_count` from stale client snapshot (computed from `state.registrations` before insert); drift if admins act concurrently.

### Testing Standards

- Bun test 'event management and reminders' asserts reminder log status `'sent'` (`index.test.ts:124`).

### Project Structure Notes

- Logging in domain; production `reminder_logs` table wired. Resend send is a follow-up.

### References

- [Source: epics.md#Story 5.2]
- [Source: packages/domain/src/index.ts#sendEventReminder]
- [Source: supabase/migrations/0007_add_queued_log_status.sql]

## Dev Agent Record

### Agent Model Used

glm-5.2 (zai-coding-plan/glm-5.2)

### Debug Log References

### Completion Notes List

- Verified handleReminder uses window.confirm('Send reminder to approved participants...'). Duplicate-send guard: sendEventReminder skips if a reminder was logged for the event within 1 hour, with status 'skipped'. Logging: local reminderLogs updated; production createSupabaseReminderLog inserts reminder_logs (status queued/skipped per migration 0007). Failures logged, registration data untouched. CSV roster export remains available as a fallback (Story 5.3). Added reminder de-dupe/skip tests (1-hour window, no-approved skip). typecheck + 29 tests pass.

### File List

- Verified: apps/web/src/features/church-events/ChurchEventsApp.tsx, apps/web/src/lib/supabase.ts, packages/domain/src/index.ts, supabase/migrations/0007_add_queued_log_status.sql; Test additions: packages/domain/src/index.test.ts

## Change Log

- 2026-06-27: Verified implementation against ACs; hardened domain test coverage and touch-target sizing. Status set to review.
