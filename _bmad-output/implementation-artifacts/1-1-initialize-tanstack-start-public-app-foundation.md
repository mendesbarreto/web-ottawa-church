# Story 1.1: Initialize TanStack Start Public App Foundation

Status: ready-for-dev

## Story

As a visitor,
I want a fast public website shell with clear navigation,
so that I can quickly find church information and events.

## Acceptance Criteria

1. The project is created using the approved Project Surf-inspired Bun/Turbo monorepo shape with `apps/web`, `packages/domain`, TanStack Start, Tailwind v4, and shadcn-style primitives.
2. Required base configuration files are present for Bun workspaces, Turbo, TypeScript, Vite/TanStack Start, Tailwind v4, and shadcn-style UI.
3. A visitor can open the home page and see a responsive public layout with header, footer, and navigation.
4. Navigation includes Home, About, Service Times & Location, Events, Contact, and Sign in.
5. The app uses the approved shadcn-style visual tokens and primitives.
6. Public routes do not import admin or portal-only modules.

## Tasks / Subtasks

- [ ] Task 1 — Workspace foundation (AC: #1, #2)
  - [ ] Verify root `package.json` Bun workspace + `turbo.json` task graph (build/dev/typecheck)
  - [ ] Verify `tsconfig.base.json` strict shared TS config + `tsconfig.json` solution-style
  - [ ] Verify `apps/web/package.json` (TanStack Start, Vite, Tailwind v4) and `packages/domain/package.json`
- [ ] Task 2 — App shell & entry (AC: #3)
  - [ ] Confirm `apps/web/src/main.tsx`, `router.tsx`, `routeTree.gen.ts` present
  - [ ] Confirm `__root.tsx` root layout + `index.tsx` render `ChurchEventsApp`
  - [ ] Confirm `styles.css` ships Tailwind v4 + design tokens
- [ ] Task 3 — Header/footer/navigation (AC: #3, #4)
  - [ ] Confirm `site-header` with brand + `main-nav` rendering Home, About, Service Times & Location, Events, Contact
  - [ ] Confirm auth actions (Sign in / Sign up) in header
  - [ ] Confirm `app-footer` present
- [ ] Task 4 — Visual tokens & primitives (AC: #5)
  - [ ] Confirm shadcn-style color/spacing/typography tokens in `styles.css`
  - [ ] Confirm button/badge/card/dialog primitives available
- [ ] Task 5 — Public/admin boundary (AC: #6)
  - [ ] Confirm public surface (`EventsHome`, `AboutPage`, `ServicePage`, `ContactPage`) does not import admin-only modules
  - [ ] Confirm `packages/domain` holds shared logic with no UI

## Dev Notes

### Implementation Context

The MVP and prod-hardening build specs (`spec-build-mvp.md`, `spec-build-prod-hardening.md`) are both `done`. This story's foundation already exists; tasks are verification/hardening against the planned structure.

**Existing implementation reality (important):** The app is a **single-page shell** that renders all surfaces via a `visiblePage()` pathname switch inside `apps/web/src/features/church-events/ChurchEventsApp.tsx`, not the multi-route file tree the architecture describes. `publicNavItems` links to `/about`, `/service-times-location`, `/events`, `/contact` but those route files do **not** exist as separate TanStack route files — they are conditionally rendered. The architecture's planned route tree (`routes/about.tsx`, `routes/events/index.tsx`, etc.) is a target, not the current shape.

### Architecture Compliance

- [Source: _bmad-output/planning-artifacts/architecture.md#Selected Starter: Project Surf-Inspired Bun/Turbo Monorepo] — Bun workspace, Turbo, TanStack Start, Tailwind v4, shadcn-style UI.
- [Source: architecture.md#Project Organization] — `apps/web/src/features/{feature}`, `apps/web/src/components/ui`, `packages/domain/src`. Real `components/ui` is currently empty (primitives live as raw Tailwind classes in `styles.css`).
- Anti-pattern: public routes importing admin components. `ChurchEventsApp` currently co-locates public + admin + portal surfaces in one component — track this as a known divergence from the architecture.

### Testing Standards

- Bun test for domain logic (`packages/domain/src/index.test.ts`).
- No Playwright E2E yet; `tests/e2e` folder deferred.

### Project Structure Notes

- Real structure: `apps/web/src/{main.tsx,router.tsx,styles.css,routes/{__root.tsx,index.tsx},features/church-events/ChurchEventsApp.tsx,lib/{download.ts,storage.ts,supabase.ts}}`.
- Planned-but-missing: `routes/about.tsx`, `routes/events/*`, `routes/auth/*`, `routes/portal/*`, `routes/admin/*`, `components/ui/*` primitives.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.1]
- [Source: _bmad-output/planning-artifacts/architecture.md#Complete Project Directory Structure]
- [Source: _bmad-output/implementation-artifacts/spec-build-mvp.md]

## Dev Agent Record

### Agent Model Used

(to be filled by dev agent)

### Debug Log References

### Completion Notes List

### File List
