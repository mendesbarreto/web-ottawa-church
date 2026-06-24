# Story 2.1: Account Sign Up

Status: ready-for-dev

## Story

As a visitor,
I want to create an account without an invitation,
so that I can register for church events.

## Acceptance Criteria

1. Given a visitor is on the public site, when they open Sign up, then a website sign-up modal opens.
2. The modal captures name, email, phone, and password only.
3. It does not capture event-specific registration details.
4. Successful account creation signs in or routes the user into an authenticated state.
5. Account creation does not require Admin approval.

## Tasks / Subtasks

- [ ] Task 1 — Sign-up modal (AC: #1, #2, #3)
  - [ ] Verify `signup` `DialogMode` captures name, email, phone, password only
  - [ ] Confirm no event registration fields (accompanying/age counts) in this modal
- [ ] Task 2 — Validation (AC: #2)
  - [ ] Verify `validateProfile` (name/email/phone) + password ≥6 chars
  - [ ] Confirm duplicate-email blocked (`createAccount` checks `users`)
- [ ] Task 3 — Authenticated state after signup (AC: #4)
  - [ ] Local: `createAccount` sets `activeUserId` → signed in
  - [ ] Production: `createSupabaseAccount` → if session returned, signed in; else notice to confirm email
- [ ] Task 4 — No admin approval (AC: #5)
  - [ ] Confirm new `User.isAdmin` is always `false`; no approval queue for accounts

## Dev Notes

### Implementation Context

Build specs are `done`. Signup flow: `handleSignup` (`ChurchEventsApp.tsx:188`). Domain: `createAccount` (`packages/domain/src/index.ts:244`), `validateProfile` (`:269`). Production: `createSupabaseAccount` (`apps/web/src/lib/supabase.ts:171`) uses Supabase `auth.signUp` with `options.data` = name/phone/notes; migration `0003_create_profile_on_signup.sql` inserts the `profiles` row via trigger.

### Architecture Compliance

- [Source: architecture.md#Authentication & Security] — production uses Supabase Auth; demo/local only when env vars absent. Account creation separate from registration approval.
- [Source: ux UX-DR11] — sign-up modal captures account fields only (name, email, phone, password).
- [Source: ux UX-DR25] — inline validation near fields + summary on failure.

### Testing Standards

- Bun test 'account and profile' suite covers create/validate/duplicate email (`index.test.ts:49`).
- Production path: the trigger profile insert + signup error rollback is a known seam — see `deferred-work.md` G6 (duplicate-email error not user-friendly).

### Project Structure Notes

- Target: `apps/web/src/features/auth/`. Current: inline dialog in `ChurchEventsApp.tsx`.

### References

- [Source: epics.md#Story 2.1]
- [Source: packages/domain/src/index.ts#createAccount]
- [Source: supabase/migrations/0003_create_profile_on_signup.sql]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
