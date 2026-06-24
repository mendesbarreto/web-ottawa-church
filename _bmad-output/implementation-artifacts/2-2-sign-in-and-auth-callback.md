# Story 2.2: Sign In and Auth Callback

Status: ready-for-dev

## Story

As a participant,
I want to sign in securely,
so that I can access my profile, registrations, and event actions.

## Acceptance Criteria

1. Given a participant has an account, when they sign in, then the system authenticates through Supabase Auth.
2. The auth callback establishes the session correctly.
3. Sign in remains reachable from public navigation.
4. Unauthenticated event registration attempts route to Sign in and return to the event after authentication.

## Tasks / Subtasks

- [ ] Task 1 — Sign-in modal (AC: #1, #3)
  - [ ] Verify `signin` `DialogMode` reachable from header "Sign in" on public nav
  - [ ] Local: `authenticateUser(state, email, password)`; Production: `signInWithSupabase`
- [ ] Task 2 — Session establishment (AC: #1, #2)
  - [ ] Production: `getCurrentSession` + `onAuthStateChange` → `loadProductionState(session)` sets state
  - [ ] Confirm `getSupabaseClient` configured with `persistSession/autoRefreshToken/detectSessionInUrl`
- [ ] Task 3 — Return-to-event after auth (AC: #4)
  - [ ] Verify `handleSignIn(email, password, event?)` opens `register` dialog for that event after success
  - [ ] Verify registration attempt while signed-out opens `signin`/`signup` with the event carried
- [ ] Task 4 — Pending-email notice (AC: #1)
  - [ ] Confirm notice when Supabase returns no session (email confirmation pending)

## Dev Notes

### Implementation Context

Build specs are `done`. `handleSignIn` (`ChurchEventsApp.tsx:161`) branches production vs local. Production boot effect (`:96`) wires `onAuthChange`. There is **no dedicated `/auth/callback` route file** in the real codebase — Supabase's `detectSessionInUrl:true` handles the callback inline; the architecture's planned `routes/auth/callback.tsx` does not exist.

### Architecture Compliance

- [Source: architecture.md#Authentication & Security] — Supabase Auth in production; demo/local fallback when env vars absent.
- [Source: architecture.md#API Boundaries] — participant actions (registration submit) gated on auth.
- Known seam (`deferred-work.md` C2): `onAuthChange` callback has no `active` guard across unmount — React 18 tolerates it; defense-in-depth only.

### Testing Standards

- Bun test covers local `authenticateUser`. Production sign-in is exercised manually/integration (no Supabase test harness in CI).

### Project Structure Notes

- Target: `routes/auth/sign-in.tsx`, `routes/auth/callback.tsx`. Current: inline modal + Supabase URL detection. No route files exist.

### References

- [Source: epics.md#Story 2.2]
- [Source: apps/web/src/lib/supabase.ts#signInWithSupabase]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md#C2]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
