# Story 4.1: Admin Access and Event-Centered Navigation

Status: ready-for-dev

## Story

As an Admin,
I want secure Admin access and event-centered navigation,
so that I can manage church event operations.

## Acceptance Criteria

1. Given a signed-in user is in the `admin_users` allowlist, when they open Admin, then they can access Admin dashboard, Events, Registrations/Pending, and Exports navigation.
2. Non-admin users are denied access with "You do not have access to this page."
3. Every Admin route and mutation performs server-side authorization.
4. Admin navigation remains usable on mobile for simple review tasks.

## Tasks / Subtasks

- [ ] Task 1 — Admin allowlist (AC: #1, #2)
  - [ ] Verify admin detection: production `loadProductionState` reads `admin_users` table → `isAdmin`; local `User.isAdmin` flag
  - [ ] Verify non-admin denied with "You do not have access to this page."
- [ ] Task 2 — Admin surface (AC: #1)
  - [ ] Verify `AdminPage` (`/admin`) shows admin dashboard with events/registrations/exports navigation
- [ ] Task 3 — Server-side authorization (AC: #3)
  - [ ] Verify every admin mutation (create/edit/archive/delete event, approve/decline, reminder, CSV) gates on admin + RLS
  - [ ] Production: `set_registration_decision` RPC + `church_events` write RLS enforce admin
- [ ] Task 4 — Mobile usability (AC: #4)
  - [ ] Confirm admin tables become labeled stacked cards on small screens

## Dev Notes

### Implementation Context

Build specs are `done`. Admin link shown only when `activeUser?.isAdmin` (`ChurchEventsApp.tsx:356`). Production admin detection: `loadProductionState` (`lib/supabase.ts:119`) queries `admin_users`. `canAdmin(user)` (`index.ts:356`). `handleApproval` guards `if (!activeUser?.isAdmin) return` (client) — RLS is the real guard.

### Architecture Compliance

- [Source: architecture.md#Authentication & Security] — admin access via `admin_users` allowlist enforced by RLS, never client-side flag.
- [Source: architecture.md#Anti-Patterns] — admin checks only in React (forbidden).
- [Source: ux UX-DR6] — Admin nav: Dashboard, Events, Registrations/Pending, Exports, Sign out.
- Known seam (`deferred-work.md` D5): silent no-op when admin session expired in `handleApproval` (`if (!activeUser?.isAdmin) return` gives no notice); RLS is the real guard.

### Testing Standards

- Verify `admin_users` RLS write policies on `church_events`, `registrations` in migration 0001.

### Project Structure Notes

- Target: `routes/admin/index.tsx`, `features/admin`. Current: inline `AdminPage`.

### References

- [Source: epics.md#Story 4.1]
- [Source: apps/web/src/lib/supabase.ts#loadProductionState]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md#D5]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
