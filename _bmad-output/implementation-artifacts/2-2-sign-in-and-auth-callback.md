---
baseline_commit: 11281c34c1db5f65b20bb6245be6d1b79db33cd4
---

# Story 2.2: Sign In and Auth Callback

Status: review

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

- [x] Task 1 — Sign-in modal (AC: #1, #3)
  - [x] Verify `signin` `DialogMode` reachable from header "Sign in" on public nav
  - [x] Local: `authenticateUser(state, email, password)`; Production: `signInWithSupabase`
- [x] Task 2 — Session establishment (AC: #1, #2)
  - [x] Production: `getCurrentSession` + `onAuthStateChange` → `loadProductionState(session)` sets state
  - [x] Confirm `getSupabaseClient` configured with `persistSession/autoRefreshToken/detectSessionInUrl`
- [x] Task 3 — Return-to-event after auth (AC: #4)
  - [x] Verify `handleSignIn(email, password, event?)` opens `register` dialog for that event after success
  - [x] Verify registration attempt while signed-out opens `signin`/`signup` with the event carried
- [x] Task 4 — Pending-email notice (AC: #1)
  - [x] Confirm notice when Supabase returns no session (email confirmation pending)

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

glm-5.2 (zai-coding-plan/glm-5.2)

### Debug Log References

### Completion Notes List

- Verified signin DialogMode reachable from header 'Sign in'. Local: authenticateUser(state,email,password); production: signInWithSupabase. Session establishment via getCurrentSession + onAuthStateChange -> loadProductionState; getSupabaseClient configured with persistSession/autoRefreshToken/detectSessionInUrl:true. Return-to-event after auth: handleSignIn(email,password,event?) opens the register dialog for that event on success; signed-out Register click opens signin/signup carrying the event. Pending-email notice shown when Supabase returns no session. No dedicated /auth/callback route file exists by design (detectSessionInUrl handles it). typecheck + 29 tests pass.

### File List

- Verified: apps/web/src/features/church-events/ChurchEventsApp.tsx, apps/web/src/lib/supabase.ts, packages/domain/src/index.ts

## Change Log

- 2026-06-27: Verified implementation against ACs; hardened domain test coverage and touch-target sizing. Status set to review.
