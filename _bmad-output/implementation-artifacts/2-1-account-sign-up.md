---
baseline_commit: 11281c34c1db5f65b20bb6245be6d1b79db33cd4
---

# Story 2.1: Account Sign Up

Status: review

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

- [x] Task 1 — Sign-up modal (AC: #1, #2, #3)
  - [x] Verify `signup` `DialogMode` captures name, email, phone, password only
  - [x] Confirm no event registration fields (accompanying/age counts) in this modal
- [x] Task 2 — Validation (AC: #2)
  - [x] Verify `validateProfile` (name/email/phone) + password ≥6 chars
  - [x] Confirm duplicate-email blocked (`createAccount` checks `users`)
- [x] Task 3 — Authenticated state after signup (AC: #4)
  - [x] Local: `createAccount` sets `activeUserId` → signed in
  - [x] Production: `createSupabaseAccount` → if session returned, signed in; else notice to confirm email
- [x] Task 4 — No admin approval (AC: #5)
  - [x] Confirm new `User.isAdmin` is always `false`; no approval queue for accounts

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

glm-5.2 (zai-coding-plan/glm-5.2)

### Debug Log References

### Completion Notes List

- Verified signup DialogMode captures name, email, phone, password only - no event registration fields. validateProfile (name/email/phone) + password>=6 enforced in handleSignup and createAccount; duplicate-email blocked. Local createAccount sets activeUserId (signed in); production createSupabaseAccount returns session->signed in, else a notice to confirm email. New User.isAdmin is always false (createAccount hard-codes isAdmin:false); no approval queue. Added tests: duplicate email + short password guard, non-admin account creation. typecheck + 29 tests pass.

### File List

- Verified: apps/web/src/features/church-events/ChurchEventsApp.tsx, apps/web/src/lib/supabase.ts, packages/domain/src/index.ts; Test additions: packages/domain/src/index.test.ts

## Change Log

- 2026-06-27: Verified implementation against ACs; hardened domain test coverage and touch-target sizing. Status set to review.
