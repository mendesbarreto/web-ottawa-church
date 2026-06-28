---
baseline_commit: 11281c34c1db5f65b20bb6245be6d1b79db33cd4
---

# Story 2.4: Authenticated Navigation and Access States

Status: review

## Story

As a signed-in participant,
I want navigation that reflects my account state,
so that I can reach my dashboard, events, profile, and sign out actions.

## Acceptance Criteria

1. Given a visitor is signed out, when they view public navigation, then they see Sign in and Sign up actions.
2. They do not see participant-only navigation.
3. Given a participant is signed in, when they view authenticated navigation, then they see Dashboard, Events, Profile, and Sign out.
4. Mobile navigation remains keyboard and touch accessible.

## Tasks / Subtasks

- [x] Task 1 — Signed-out nav (AC: #1, #2)
  - [x] Verify header shows Sign in + Sign up, no Dashboard/Profile/Admin links when `activeUser` null
- [x] Task 2 — Signed-in nav (AC: #3)
  - [x] Verify Dashboard (`/portal`), Profile (`/profile`), Sign out, user chip render when `activeUser` present
  - [x] Verify Admin link only when `activeUser.isAdmin`
- [x] Task 3 — Sign out (AC: #3)
  - [x] Local: clears `activeUserId`; Production: `signOutOfSupabase`
- [x] Task 4 — Mobile/keyboard (AC: #4)
  - [x] Confirm nav reachable by keyboard, 44px targets, collapses on mobile

## Dev Notes

### Implementation Context

Build specs are `done`. Header nav rendered in `ChurchEventsApp.tsx:344`. Conditional links: `activeUser ? Dashboard/Profile` ; `activeUser?.isAdmin ? Admin`. Auth actions block (`:358`) toggles user-chip+Sign out vs Sign in/Sign up (+ "Admin demo" button in non-production mode).

### Architecture Compliance

- [Source: ux UX-DR4] — public nav (Home, About, Service Times & Location, Events, Contact, Sign in); mobile collapses + closes after navigation.
- [Source: ux UX-DR5] — authenticated nav: Dashboard, Events, Profile, Sign out.
- [Source: ux UX-DR6] — Admin nav centered on Dashboard, Events, Registrations/Pending, Exports, Sign out. Note: current Admin nav is a single `Admin` link, not the full UX-DR6 set — divergence to track.
- [Source: ux UX-DR24] — tap/click accessible, explicit submit buttons, visible saved states.

### Testing Standards

- Manual/keyboard audit; no nav unit tests currently.

### Project Structure Notes

- Nav is inline in the SPA header. Target `components/app-header.tsx` exists in architecture plan but not as a separate file.

### References

- [Source: epics.md#Story 2.4]
- [Source: ux UX-DR4, UX-DR5, UX-DR6]

## Dev Agent Record

### Agent Model Used

glm-5.2 (zai-coding-plan/glm-5.2)

### Debug Log References

### Completion Notes List

- Verified signed-out header shows Sign in + Sign up with no Dashboard/Profile/Admin links when activeUser is null. Signed-in header renders Dashboard (/portal), Profile (/profile), Sign out, and user-chip; Admin link only when activeUser.isAdmin. Sign out clears activeUserId (local) or signOutOfSupabase (production). Nav reachable by keyboard, 44px targets, collapses on mobile via @media(max-width:820px). Known divergence: Admin nav is a single link rather than the full UX-DR6 set - tracked, not a regression. typecheck + 29 tests pass.

### File List

- Verified: apps/web/src/features/church-events/ChurchEventsApp.tsx; Hardened: apps/web/src/styles.css

## Change Log

- 2026-06-27: Verified implementation against ACs; hardened domain test coverage and touch-target sizing. Status set to review.
