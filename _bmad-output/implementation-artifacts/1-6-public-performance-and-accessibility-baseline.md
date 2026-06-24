# Story 1.6: Public Performance and Accessibility Baseline

Status: ready-for-dev

## Story

As a mobile visitor,
I want public pages to load quickly and work accessibly,
so that I can discover church information and events without friction.

## Acceptance Criteria

1. Given the public home, church info, events list, and event detail pages exist, when they are tested on mobile, then public pages target LCP ≤ 2.5s, INP ≤ 200ms, and CLS ≤ 0.1.
2. Touch targets are at least 44px where practical.
3. Status and actions do not rely on color alone.
4. No carousels, heavy hero animations, infinite scroll, drag-and-drop, or nested modal stacks are used.

## Tasks / Subtasks

- [ ] Task 1 — Core Web Vitals measurement (AC: #1)
  - [ ] Run Lighthouse/performance trace on home, info, events, details (mobile)
  - [ ] Capture LCP/INP/CLS; document baseline against targets
  - [ ] Address regressions over thresholds (image sizing, font load, layout shift)
- [ ] Task 2 — Touch targets & color-independence (AC: #2, #3)
  - [ ] Audit interactive elements for ≥44px practical hit area
  - [ ] Confirm status badges include text labels (`statusLabel`) not color only
- [ ] Task 3 — Banned-pattern audit (AC: #4)
  - [ ] Confirm no carousels, heavy hero animations, infinite scroll, drag-and-drop, nested modal stacks
  - [ ] Confirm `DialogMode` is single-modal (no nested stacks)
- [ ] Task 4 — Accessibility floor (AC: #1)
  - [ ] Keyboard navigation across public surfaces (tab order = visual order)
  - [ ] Visible labels, focus order, reduced-motion respect

## Dev Notes

### Implementation Context

Build specs are `done`. No banned patterns are used. `statusLabel` (`packages/domain/src/index.ts:212`) renders text-based status. This story is a **measurement/audit** story — there is no automated CWV gate in CI yet.

### Architecture Compliance

- [Source: architecture.md#Non-Functional Requirements Coverage] — performance addressed via public/admin separation, TanStack Start routing, bundle boundaries.
- [Source: ux UX-DR28] — WCAG 2.2 AA floor, 44px targets, keyboard reachable, reduced-motion.
- [Source: ux UX-DR30] — banned MVP patterns list (carousels, heavy hero animations, infinite scroll, drag-and-drop, nested modal stacks).
- [Source: ux UX-DR15] — text-bearing status badges.

### Testing Standards

- Lighthouse snapshot audit (use `chrome-devtools_lighthouse_audit` mobile snapshot). No Playwright perf harness yet.
- Gap (architecture.md#Nice-to-Have Gaps): performance budget checks not yet in CI.

### Project Structure Notes

- Public bundle currently includes the full `ChurchEventsApp` (admin + portal co-located). NFR2 (don't load admin in public bundle) is a real gap — see `deferred-work.md` A3 (mode detection frozen at build time) for related context. Code-splitting public vs admin is a hardening opportunity.

### References

- [Source: epics.md#Story 1.6]
- [Source: architecture.md#Nice-to-Have Gaps]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
