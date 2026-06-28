---
baseline_commit: 11281c34c1db5f65b20bb6245be6d1b79db33cd4
---

# Story 2.3: Participant Profile Management

Status: review

## Story

As a participant,
I want to maintain my basic profile,
so that event organizers have the coordination information they need.

## Acceptance Criteria

1. Given a participant is signed in, when they open Profile, then they can view and update name, email, phone, and optional notes.
2. Validation prevents missing required profile fields.
3. Profile data is only visible to the participant and Admins where needed for event coordination.
4. The profile page uses visible labels and inline validation.

## Tasks / Subtasks

- [x] Task 1 — Profile view/edit (AC: #1, #4)
  - [x] Verify `ProfilePage` renders name/email/phone/notes with visible labels for `activeUser`
  - [x] Confirm inline validation near fields
- [x] Task 2 — Validation (AC: #2)
  - [x] Verify `validateProfile` blocks missing name/email/phone + invalid email
  - [x] Verify `updateProfile` blocks email collision with another account
- [x] Task 3 — Save flow (AC: #1)
  - [x] Local: `handleProfileSave` → `updateProfile` (also syncs denormalized participant fields on registrations)
  - [x] Production: `updateSupabaseProfile` updates `profiles` row
- [x] Task 4 — Visibility boundary (AC: #3)
  - [x] Confirm profile page only renders for signed-in user's own data
  - [x] Production: RLS on `profiles` enforces self-read (verify migration)

## Dev Notes

### Implementation Context

Build specs are `done`. `handleProfileSave` (`ChurchEventsApp.tsx:219`). Domain: `updateProfile` (`packages/domain/src/index.ts:277`) updates `users` and propagates name/email/phone onto that user's `registrations`. Production: `updateSupabaseProfile` (`lib/supabase.ts:189`). RLS lives in `0001_church_events.sql`.

### Architecture Compliance

- [Source: architecture.md#Authentication & Security] — RLS mandatory for participant-owned rows.
- [Source: ux UX-DR25] — visible labels + inline validation.
- Known seam (`deferred-work.md` G6): duplicate-email error on profile update is not user-friendly (depends on B1 error messaging).

### Testing Standards

- Bun test 'account and profile' covers create/authenticate/update (`index.test.ts:49`).
- Verify RLS profile-read policy in migration 0001.

### Project Structure Notes

- Target: `routes/portal/profile.tsx` + `features/auth`. Current: `ProfilePage` inline in SPA, surfaced at `/profile` via `visiblePage()`.

### References

- [Source: epics.md#Story 2.3]
- [Source: packages/domain/src/index.ts#updateProfile]
- [Source: supabase/migrations/0001_church_events.sql]

## Dev Agent Record

### Agent Model Used

glm-5.2 (zai-coding-plan/glm-5.2)

### Debug Log References

### Completion Notes List

- Verified ProfilePage renders name/email/phone/notes with visible labels for activeUser, gated behind sign-in (GateCard otherwise). validateProfile blocks missing name/email/phone + invalid email; updateProfile blocks email collision. handleProfileSave -> updateProfile (syncs denormalized participant fields on that user's registrations); production updateSupabaseProfile updates profiles row. Visibility boundary: production RLS on profiles enforces self-read/update (migration 0001 policies 'profiles own read/update'). typecheck + 29 tests pass.

### File List

- Verified: apps/web/src/features/church-events/ChurchEventsApp.tsx, apps/web/src/lib/supabase.ts, packages/domain/src/index.ts, supabase/migrations/0001_church_events.sql; Test additions: packages/domain/src/index.test.ts

## Change Log

- 2026-06-27: Verified implementation against ACs; hardened domain test coverage and touch-target sizing. Status set to review.
