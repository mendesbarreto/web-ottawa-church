# Story 5.2: Admin Event Reminder Emails

Status: ready-for-dev

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

- [ ] Task 1 — Reminder with confirmation (AC: #1)
  - [ ] Verify `handleReminder` uses `window.confirm("Send reminder to approved participants...")`
- [ ] Task 2 — Duplicate-send guard (AC: #2)
  - [ ] Domain: `sendEventReminder` skips if a reminder was logged within 1 hour for the event
  - [ ] Confirm skip log status `'skipped'`
- [ ] Task 3 — Logging (AC: #3)
  - [ ] Local: `reminderLogs` updated; Production: `createSupabaseReminderLog` inserts `reminder_logs`
  - [ ] Confirm failures logged, registration data untouched
- [ ] Task 4 — Roster fallback (AC: #4)
  - [ ] Confirm CSV roster export remains available (Story 5.3) regardless of email availability

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

### Debug Log References

### Completion Notes List

### File List
