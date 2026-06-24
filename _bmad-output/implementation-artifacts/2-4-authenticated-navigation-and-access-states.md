# Story 2.4: Authenticated Navigation and Access States

Status: ready-for-dev

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

- [ ] Task 1 — Signed-out nav (AC: #1, #2)
  - [ ] Verify header shows Sign in + Sign up, no Dashboard/Profile/Admin links when `activeUser` null
- [ ] Task 2 — Signed-in nav (AC: #3)
  - [ ] Verify Dashboard (`/portal`), Profile (`/profile`), Sign out, user chip render when `activeUser` present
  - [ ] Verify Admin link only when `activeUser.isAdmin`
- [ ] Task 3 — Sign out (AC: #3)
  - [ ] Local: clears `activeUserId`; Production: `signOutOfSupabase`
- [ ] Task 4 — Mobile/keyboard (AC: #4)
  - [ ] Confirm nav reachable by keyboard, 44px targets, collapses on mobile

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

### Debug Log References

### Completion Notes List

### File List
