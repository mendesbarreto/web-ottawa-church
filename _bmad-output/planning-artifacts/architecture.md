---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-web-ottawa-church-2026-06-16/prd.md
  - _bmad-output/planning-artifacts/prds/prd-web-ottawa-church-2026-06-16/addendum.md
  - _bmad-output/planning-artifacts/ux-designs/ux-web-ottawa-church-2026-06-16/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-web-ottawa-church-2026-06-16/EXPERIENCE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-web-ottawa-church-2026-06-16/reconcile-prd.md
  - _bmad-output/planning-artifacts/research/technical-free-tier-church-portal-research-2026-06-16.md
  - _bmad-output/planning-artifacts/briefs/brief-web-ottawa-church-2026-06-16/brief.md
workflowType: 'architecture'
project_name: 'web-ottawa-church'
user_name: 'Douglas'
date: '2026-06-17'
updatedAt: '2026-06-21'
lastStep: 8
status: 'complete'
completedAt: '2026-06-18'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Initialization

Architecture workflow initialized on 2026-06-17. Source documents have been discovered and listed in frontmatter. Full source analysis begins after user confirmation.

### Architecture Amendment: Project Surf Stack Alignment

On 2026-06-21, the implementation direction was amended to use `/Users/mendes/Git/clariti/project-surf` as the technology and framework guide while preserving free-tier constraints. This amendment supersedes earlier single-app TanStack CLI + pnpm + Netlify-first starter language where it conflicts. The selected implementation shape is now a Bun/Turbo monorepo with a TanStack Start React app, Tailwind v4/shadcn-style UI, domain packages, and free-tier-compatible persistence/integration boundaries. Paid/heavy Project Surf infrastructure such as WorkOS, AWS/Pulumi, Temporal, Kubernetes, and worker orchestration is explicitly excluded from the MVP.

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
The MVP has 20 functional requirements across public church content, public event discovery, account creation, participant profiles, event registration, admin event management, approval workflows, participant RSVP status, notifications, calendar export, and roster export. Architecturally, this requires three clear surfaces: public website, participant portal, and admin area, backed by shared event and registration domain logic.

**Non-Functional Requirements:**
The architecture is shaped by mobile Core Web Vitals, public/admin bundle separation, server-side authorization, Supabase RLS, privacy-by-minimization for child/family data, free-tier-friendly operations, WCAG 2.2 AA accessibility, and single-developer maintainability.

**Scale & Complexity:**

- Primary domain: full-stack web application
- Complexity level: medium
- Estimated architectural components: public site, auth, participant portal, admin, event domain, registration domain, notifications, exports, database/RLS

### Technical Constraints & Dependencies

The selected direction is a Project Surf-guided Bun/Turbo monorepo using TypeScript, TanStack Start, TanStack Router, TanStack Query, Tailwind v4, shadcn-style primitives, domain packages, and free-tier-friendly service boundaries. Persistence should remain Supabase/Postgres-compatible for free-tier deployment, with local adapters acceptable for the first working product. Resend-compatible email, generated `.ics` files, CSV exports, and a Cloudflare Pages deployment remain in scope. Next.js, GraphQL, microservices, realtime infrastructure, WorkOS, AWS/Pulumi, Temporal, waitlists, payments, and complex roles are explicitly out of MVP scope.

### Cross-Cutting Concerns Identified

- Authorization must be enforced both in server functions/routes and Supabase RLS.
- Public pages must avoid loading admin/portal code.
- Event registration validation must keep accompanying count and age-range totals consistent.
- Admin workflows need auditability for approval/decline actions.
- Email failures must not roll back saved registration state.
- Calendar and CSV exports need deterministic, testable generation.
- UX must preserve shadcn-style consistency across dialogs, tables, menus, forms, and status badges.

## Starter Template Evaluation

### Primary Technology Domain

Project Surf-guided full-stack TypeScript web application using a Bun/Turbo monorepo and TanStack Start.

### Starter Options Considered

1. **Project Surf monorepo pattern**
   - Best fit after user correction. Provides the desired technology posture: Bun workspace, Turbo tasks, TanStack Start web apps, Tailwind v4, shadcn-style primitives, feature folders, and shared packages.
   - Must be adapted for free-tier and personal-project scope by excluding paid/heavy infrastructure.

2. **Official TanStack CLI single-app starter**
   - Still useful as a reference for TanStack Start conventions, but no longer the primary project shape.
   - Rejected as the main starter because the user explicitly wants Project Surf as the technology/framework guide.

3. **Project Surf full infrastructure clone**
   - Rejected. WorkOS, AWS/Pulumi, Temporal, Kubernetes, separate workers, and enterprise auth are not appropriate for this free-tier church MVP.

4. **Vite SPA**
   - Rejected for MVP foundation because we need TanStack Start conventions, route structure, server-ready boundaries, auth/session boundaries, and clean public/admin/portal separation.

### Selected Starter: Project Surf-Inspired Bun/Turbo Monorepo

**Rationale for Selection:**
Use Project Surf's technology shape without its paid infrastructure: Bun package manager, Turbo workspace, TanStack Start app, Tailwind v4, shadcn-style primitives, strict TypeScript, shared domain package, and explicit app/package boundaries. This satisfies the user's framework preference while keeping the deployment and operations free-tier friendly.

**Initialization Shape:**

```text
web-ottawa-church/
├── package.json              # Bun workspace + Turbo scripts
├── turbo.json                # build/dev/typecheck task graph
├── tsconfig.base.json        # strict shared TS config
├── apps/
│   └── web/                  # TanStack Start React app for public, portal, admin
└── packages/
    └── domain/               # church event domain, validation, exports
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
TypeScript, Bun, React, TanStack Start, SSR-capable route structure, server-ready feature boundaries.

**Styling Solution:**
Tailwind v4 plus shadcn-style primitives compatible with the approved UX.

**Build Tooling:**
Bun workspace scripts and Turbo task orchestration, following Project Surf's root/app/package separation.

**Testing Framework:**
Bun test for domain logic and smoke behavior initially; Playwright can be added later for end-to-end flows.

**Code Organization:**
Use `apps/web` for public/portal/admin UI and `packages/domain` for event, registration, approval, RSVP, calendar, and roster logic. Add `packages/db` only when Supabase/Drizzle persistence is implemented.

**Development Experience:**
Bun install/dev/test, Turbo build/typecheck, TanStack Router/Query conventions, Tailwind v4, shadcn-style UI components, and strict TypeScript.

**Note:**
Project initialization using this monorepo shape should remain the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions:**

- App shape: Project Surf-inspired Bun/Turbo monorepo.
- Web framework: TanStack Start React app under `apps/web`.
- UI: Tailwind v4 plus shadcn-style primitives and the approved violet/neutral design tokens.
- Domain: shared TypeScript package under `packages/domain` for events, registrations, approvals, RSVP, `.ics`, and CSV logic.
- Data: start with local/free-tier-compatible adapters for the working MVP; keep the persistence boundary Supabase/Postgres-compatible for free-tier production.
- Auth/security: MVP may use local/demo auth state, but architecture must preserve a future Supabase Auth + server authorization + RLS path.
- API: TanStack Start server-ready functions/routes when persistence is introduced; no GraphQL/public API for MVP.
- Deployment: Cloudflare Pages deployment first; avoid paid Project Surf infrastructure.

**Important Decisions:**

- Runtime/package manager: Bun, matching Project Surf.
- Build orchestration: Turbo workspace tasks.
- Validation: shared TypeScript validation in `packages/domain`; Zod can be added where schema validation becomes necessary.
- Deterministic generated exports for `.ics` and CSV.
- Testing: Bun test for domain logic initially; Playwright later for core browser flows.

**Deferred Decisions:**

- Supabase production persistence, RLS SQL policies, Resend transactional sending, Playwright E2E, analytics, reusable family profiles, recurring events, background jobs, realtime updates, queues, payments, waitlists, complex roles, and live check-in/out remain post-first-working-product unless specifically pulled forward.

### Data Architecture

The first working product may use local browser persistence through a narrow domain adapter so the product can run with no paid services. The production-ready path remains Supabase Postgres/Auth/RLS because it satisfies the free-tier and privacy constraints better than enterprise services.

Model core domain concepts around `profiles`, `admin_users`, `events`, `registrations`, `registration_age_counts`, `notification_log`, and `audit_log`. When database persistence is introduced, prefer a `packages/db` package using Drizzle/Postgres patterns similar to Project Surf, backed by Supabase Postgres for free-tier hosting.

### Authentication & Security

Use demo/local auth for the first working product only. Preserve clear boundaries so Supabase Auth can replace the local adapter without changing feature UI contracts. Admin access remains a simple allowlist concept, not a complex role hierarchy.

Authorization layers for production path:

- Server-side checks for all admin mutations and exports.
- Supabase RLS for participant-owned and admin-only rows.
- No service-role key or provider secret in browser code.
- Approval/decline audit trail with actor and timestamp.

### API & Communication Patterns

Use TanStack Start route/server boundaries and domain package functions. In the local MVP, UI calls domain/storage adapters directly. In the production path, route/server functions call Supabase/Drizzle adapters and Resend-compatible email senders.

Use explicit domain actions for:

- event create/edit/archive/delete;
- registration submit;
- approval/decline;
- RSVP updates;
- reminders;
- CSV roster export;
- `.ics` calendar export.

Email failure must be logged and must not roll back successful domain persistence.

### Frontend Architecture

Use TanStack Router file-based routes in `apps/web/src/routes` with public, auth, portal, and admin surfaces. Public routes must not import admin-only components unless the bundle boundary remains safe.

Use:

- TanStack Start + TanStack Router for app/routing conventions.
- TanStack Query when server state is introduced.
- React local state for modal/form state in the first local MVP.
- Tailwind v4/shadcn-style components for buttons, dialogs, menus, tables, badges, inputs, and selects.
- `packages/domain` for shared domain logic and export generation.

### Infrastructure & Deployment

Use free-tier-compatible deployment first: one web app deployment for `apps/web`. Avoid Project Surf's AWS/Pulumi/Temporal/Kubernetes/WorkOS infrastructure for MVP.

Environment groups for production path:

- public Supabase URL and publishable key;
- server Supabase service role key;
- Resend API key;
- site URL;
- deployment/runtime mode.

Testing:

- Bun test for domain logic, `.ics`, CSV, and service behavior.
- Playwright later for registration/admin approval flows.

### Decision Impact Analysis

**Implementation Sequence:**

1. Create Bun/Turbo workspace root.
2. Create `apps/web` TanStack Start app shell.
3. Create `packages/domain` with event/registration/approval/RSVP/export logic.
4. Build public event listing/detail and church pages.
5. Add local signup/signin/profile state.
6. Add event registration flow with validation.
7. Add admin event management and approval workflows.
8. Add calendar, CSV, and print exports.
9. Add free-tier persistence/email adapters after the working local product is stable.
10. Add performance and security hardening.

**Cross-Component Dependencies:**

- Registration validation affects UI forms, domain package logic, future database constraints, and admin totals.
- Auth/authorization boundaries affect every portal/admin route and export.
- Public/admin route separation affects performance and bundle boundaries.
- Event schema affects details modal, registration form, calendar export, reminders, and roster export.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
Eight areas need consistency: database naming, route naming, server action shape, validation, errors, loading states, file placement, and export generation.

### Naming Patterns

**Database Naming Conventions:**

- Tables use plural `snake_case`: `profiles`, `events`, `registrations`, `registration_age_counts`.
- Columns use `snake_case`: `event_id`, `approval_status`, `created_at`.
- Foreign keys use `{table_singular}_id`: `event_id`, `registration_id`, `user_id`.
- Indexes use `idx_{table}_{columns}`: `idx_registrations_event_id`.

**API Naming Conventions:**

- TanStack route paths use kebab-case URL segments: `/admin/events`, `/portal/registrations`.
- Route params use `$id` in file routes and `id` in code.
- Query/search params use camelCase in app code and URL-safe names: `approvalStatus=pending`.

**Code Naming Conventions:**

- React components use PascalCase: `EventDetailsDialog`.
- Component files use kebab-case: `event-details-dialog.tsx`.
- Functions and variables use camelCase: `submitRegistration`, `eventId`.
- Zod schemas use `{Name}Schema`: `registrationFormSchema`.
- Server actions use verb-first names: `createEvent`, `approveRegistration`, `updateRsvpStatus`.

### Structure Patterns

**Project Organization:**

- Organize app code by domain, not technical type first.
- Keep route files thin; route files call domain modules.
- Co-locate component tests as `*.test.ts` or `*.test.tsx` near the domain/component.
- Keep shared UI primitives separate from domain components.

**File Structure Patterns:**

- Shared UI primitives live under `apps/web/src/components/ui`.
- Feature components live under `apps/web/src/features/{feature}`.
- Route files live under `apps/web/src/routes` and stay thin.
- Domain types, validation, totals, and exports live under `packages/domain/src`.
- Future database adapters live under `packages/db` when Supabase/Drizzle persistence is added.

### Format Patterns

**API Response Formats:**

- Server actions return typed domain results, not arbitrary response shapes.
- Expected validation failures use a consistent app error shape:
  `{ code: string; message: string; fieldErrors?: Record<string, string[]> }`.
- Unexpected server failures are logged and returned as safe generic messages.

**Data Exchange Formats:**

- Database records stay `snake_case`.
- UI/domain objects use camelCase.
- Date/time crossing boundaries uses ISO 8601 strings.
- Money/cost fields remain display text for MVP unless payments are added later.
- Age-range counts are stored as rows, not JSON blobs.

### Communication Patterns

**Event System Patterns:**

- No internal event bus for MVP.
- Domain side effects are explicit function calls from server actions.
- Email/log side effects must not roll back successful domain persistence unless the domain action itself fails.

**State Management Patterns:**

- TanStack Query owns server state.
- Local React state is only for dialog open state, form-local UI state, and temporary controls.
- Query keys use array format: `['events', eventId]`, `['admin', 'registrations', eventId]`.
- Mutations invalidate exact affected query groups.

### Process Patterns

**Error Handling Patterns:**

- Validation errors show inline near fields.
- Permission errors show “You do not have access to this page/action.”
- Email failures are non-blocking and logged.
- Admin destructive actions require confirmation.

**Loading State Patterns:**

- Public pages prefer server-rendered content over client skeletons.
- Portal/admin tables can use compact skeleton rows.
- Form submit buttons show pending state and prevent duplicate submits.

### Enforcement Guidelines

**All AI Agents MUST:**

- Keep public, portal, and admin concerns separated.
- Put authorization checks in server actions and RLS, not only UI.
- Validate registration age counts on client and server.
- Use shadcn-style primitives consistently.
- Keep route files thin and domain logic in feature modules.
- Write deterministic generators for `.ics` and CSV.

**Pattern Enforcement:**

- Tests verify validation, export generation, and critical domain transitions.
- Code review checks database naming, route naming, server-action shape, and authorization.
- Pattern changes must update this architecture document before implementation diverges.

### Pattern Examples

**Good Examples:**

- `registration_age_counts.registration_id`
- `apps/web/src/features/registrations/registration-dialog.tsx`
- `apps/web/src/features/events/event-details-dialog.tsx`
- `registrationFormSchema`
- `['registrations', 'mine']`

**Anti-Patterns:**

- Admin checks only in React components.
- Mixed `userId` and `user_id` in database columns.
- JSON age-count blobs when relational rows are needed for reporting.
- Public routes importing admin components.
- Email failure causing an approved registration to revert.

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
web-ottawa-church/
├── README.md
├── package.json
├── bun.lock
├── turbo.json
├── tsconfig.json
├── tsconfig.base.json
├── .env.example
├── apps/
│   └── web/
│       ├── package.json
│       ├── vite.config.ts
│       ├── tsconfig.json
│       └── src/
│           ├── routeTree.gen.ts
│           ├── router.tsx
│           ├── routes/
│           │   ├── __root.tsx
│           │   ├── index.tsx
│           │   ├── about.tsx
│           │   ├── service-times-location.tsx
│           │   ├── contact.tsx
│           │   ├── events/
│           │   │   ├── index.tsx
│           │   │   └── $eventId.tsx
│           │   ├── auth/
│           │   │   ├── sign-in.tsx
│           │   │   └── callback.tsx
│           │   ├── portal/
│           │   │   ├── index.tsx
│           │   │   ├── registrations.tsx
│           │   │   └── profile.tsx
│           │   └── admin/
│           │       ├── index.tsx
│           │       ├── events.tsx
│           │       └── events/
│           │           └── $eventId.tsx
│           ├── components/
│           │   ├── ui/
│           │   ├── app-header.tsx
│           │   └── app-footer.tsx
│           ├── features/
│           │   ├── auth/
│           │   ├── public-site/
│           │   ├── events/
│           │   ├── registrations/
│           │   ├── admin/
│           │   ├── notifications/
│           │   └── exports/
│           ├── lib/
│           │   ├── env.ts
│           │   ├── errors.ts
│           │   └── storage.ts
│           └── styles.css
├── packages/
│   └── domain/
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts
│           └── index.test.ts
├── tests/
│   └── e2e/
└── _bmad-output/
```

### Architectural Boundaries

**API Boundaries:**

- First working product: UI calls `packages/domain` and local storage adapters directly.
- Production path: TanStack Start server functions/routes call Supabase/Drizzle adapters and email senders.
- Public reads: published event and church content queries only.
- Participant actions: registration submit, RSVP update, profile update.
- Admin actions: event management, approval/decline, reminders, CSV/print exports.
- Export routes: `.ics` is public for published event details; CSV is admin-only.

**Component Boundaries:**

- `apps/web/src/components/ui` contains reusable shadcn-style primitives only.
- Feature components live under `apps/web/src/features/{feature}`.
- Shared domain behavior lives in `packages/domain`, not in route files.

**Service Boundaries:**

- Local MVP storage lives behind a small adapter in `apps/web/src/lib/storage.ts`.
- Production persistence should move behind `packages/db` and server functions without rewriting UI flows.
- Auth guards are centralized in the web app and later backed by Supabase Auth.

**Data Boundaries:**

- `packages/domain` owns domain types and validation.
- Database rows should use `snake_case` when persistence is added; app-facing objects use camelCase.
- RLS remains mandatory for production participant-owned and admin-only tables.
- Provider secrets are server-only.

### Requirements to Structure Mapping

**Public Church Website and Event Discovery:**
FR-1 to FR-3 live in `apps/web/src/routes`, `apps/web/src/features/public-site`, `apps/web/src/features/events`, and `packages/domain`.

**Account and Participant Profile:**
FR-4 to FR-5 live in `apps/web/src/features/auth`, `apps/web/src/routes/auth`, and `apps/web/src/routes/portal/profile.tsx`.

**Event Registration:**
FR-6 to FR-9 live in `apps/web/src/features/registrations`, `apps/web/src/features/events`, and `packages/domain`.

**Admin Event Management and Approval:**
FR-10 to FR-14 live in `apps/web/src/features/admin`, `apps/web/src/routes/admin`, and `packages/domain`.

**Participant Portal and RSVP:**
FR-15 to FR-16 live in `apps/web/src/routes/portal`, `apps/web/src/features/registrations`, and `packages/domain`.

**Notifications, Calendar, and Exports:**
FR-17 to FR-20 live in `apps/web/src/features/notifications`, `apps/web/src/features/exports`, and `packages/domain`.

### Integration Points

**Internal Communication:**
Routes call feature components/actions. Feature modules call `packages/domain` for validation, transitions, totals, calendar export, and roster export.

**External Integrations:**

- First working product: local browser storage and generated downloads.
- Production path: Supabase Auth/Postgres/RLS, Resend-compatible email, `.ics`, CSV, print.

**Data Flow:**
Public event data flows from the domain/storage adapter into route components. Authenticated mutations flow from forms through validation, domain actions, local/future persistence, optional notification logging, and UI invalidation/state refresh.

### File Organization Patterns

**Configuration Files:**
Root-level Bun/Turbo/TypeScript config; app-level Vite/TanStack config.

**Source Organization:**
Routes are thin. Feature UI lives in `apps/web/src/features`. Shared domain logic lives in `packages/domain`. Shared UI primitives live in `apps/web/src/components/ui`.

**Test Organization:**
Domain tests live next to `packages/domain/src/index.ts`. E2E tests live in `tests/e2e` when added.

**Asset Organization:**
Static public assets live under the web app. Uploaded/event-managed media is deferred; if needed later, use Supabase Storage with explicit policy design.

### Development Workflow Integration

**Development Server Structure:**
Bun runs Turbo workspace scripts. `apps/web` owns the TanStack Start dev server.

**Build Process Structure:**
Turbo builds packages before apps. Public routes should remain independent from admin-only imports where practical.

**Deployment Structure:**
Deploy `apps/web` to Cloudflare Pages first. Supabase and Resend are optional production adapters, not required for local MVP operation.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
The amended stack is coherent: Bun, Turbo, TanStack Start, TanStack Router, Tailwind v4, shadcn-style UI, shared domain packages, Supabase-compatible persistence boundaries, Resend-compatible email, `.ics`, CSV, and Bun tests fit a free-tier-friendly modular monorepo. No decision introduces Next.js, GraphQL, paid enterprise auth, AWS/Pulumi, Temporal, microservices, realtime, payment, or role hierarchy conflict.

**Pattern Consistency:**
The implementation patterns support the decisions: database naming is SQL/RLS-friendly, route naming matches TanStack file routing, server-action naming supports explicit domain flows, and data format rules cleanly separate database `snake_case` from TypeScript `camelCase`.

**Structure Alignment:**
The structure supports public, portal, and admin separation while keeping shared domain logic in `packages/domain`. UI primitives, feature components, local/future persistence boundaries, exports, and notification seams have clear homes.

### Requirements Coverage Validation ✅

**Feature Coverage:**
All MVP feature areas are mapped: public church pages, public event discovery, account signup/sign-in, participant profile, event registration, admin event management, approval queue, RSVP updates, emails, calendar export, CSV export, and printable rosters.

**Functional Requirements Coverage:**
FR-1 through FR-20 are architecturally supported through the route structure, feature modules, `packages/domain`, local/future persistence adapters, notification seams, and export modules.

**Non-Functional Requirements Coverage:**
Performance is addressed through public/admin separation, TanStack Start routing, and bundle boundaries. Security is addressed through admin allowlist boundaries now and a preserved Supabase Auth/RLS/server-check path for production. Privacy is addressed by storing age-range counts instead of unnecessary child details. Maintainability is addressed through a Bun/Turbo monorepo and domain-first structure.

### Implementation Readiness Validation ✅

**Decision Completeness:**
Critical decisions are documented with current package versions and rationale. Deferred decisions are explicit and do not block MVP implementation.

**Structure Completeness:**
The project tree is specific enough for implementation agents to start without inventing major structure. It defines Bun/Turbo root config, `apps/web`, routes, features, `packages/domain`, tests, and free-tier deployment boundaries.

**Pattern Completeness:**
Naming, structure, response/error formats, state management, loading states, side effects, and enforcement rules are defined with examples and anti-patterns.

### Gap Analysis Results

**Critical Gaps:**
None.

**Important Gaps:**

- The exact Supabase RLS policies are not written yet; they belong in the later production persistence adapter stories.
- The exact database column list is not fully enumerated; it should be defined during migration implementation.
- The exact public church content model is not final because church name/branding/content are still open product inputs.

**Nice-to-Have Gaps:**

- Add a lightweight `docs/architecture-decisions/` folder later if decisions grow.
- Add Playwright E2E once the first vertical slice is implemented.
- Add performance budget checks once real pages exist.

### Validation Issues Addressed

No blocking issues found. The remaining gaps are implementation-detail gaps, not architecture blockers.

### Architecture Completeness Checklist

**Requirements Analysis**

- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**Architectural Decisions**

- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**Implementation Patterns**

- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**Project Structure**

- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**

- Strong alignment with your TanStack preference and performance goal.
- Simple enough for a personal project while still serious about auth/RLS/security.
- Clear route and feature boundaries for public, participant, and admin surfaces.
- Explicit anti-patterns reduce AI-agent implementation drift.
- Export/email/calendar concerns are isolated and testable.

**Areas for Future Enhancement:**

- Reusable family profiles.
- Multilingual public pages.
- Event recurrence.
- Volunteer role assignment.
- Live check-in/check-out if later confirmed.
- Background jobs if reminders/reports become heavy.

### Implementation Handoff

**AI Agent Guidelines:**

- Follow all architectural decisions exactly as documented.
- Use implementation patterns consistently across all components.
- Respect project structure and public/admin/portal boundaries.
- Refer to this document for architectural questions.
- Do not introduce Next.js, GraphQL, microservices, realtime, payments, waitlists, or complex roles in MVP.

**First Implementation Priority:**
Initialize the TanStack Start project using the selected CLI command, then implement the first vertical slice: published event → signup/sign-in → registration submit → admin approval → participant status.
