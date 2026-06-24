# Story 2.3: Participant Profile Management

Status: ready-for-dev

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

- [ ] Task 1 — Profile view/edit (AC: #1, #4)
  - [ ] Verify `ProfilePage` renders name/email/phone/notes with visible labels for `activeUser`
  - [ ] Confirm inline validation near fields
- [ ] Task 2 — Validation (AC: #2)
  - [ ] Verify `validateProfile` blocks missing name/email/phone + invalid email
  - [ ] Verify `updateProfile` blocks email collision with another account
- [ ] Task 3 — Save flow (AC: #1)
  - [ ] Local: `handleProfileSave` → `updateProfile` (also syncs denormalized participant fields on registrations)
  - [ ] Production: `updateSupabaseProfile` updates `profiles` row
- [ ] Task 4 — Visibility boundary (AC: #3)
  - [ ] Confirm profile page only renders for signed-in user's own data
  - [ ] Production: RLS on `profiles` enforces self-read (verify migration)

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

### Debug Log References

### Completion Notes List

### File List
