---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments: []
workflowType: 'research'
lastStep: 6
research_type: 'technical'
research_topic: 'Free-tier-friendly architecture for a church website with admin and participant portal'
research_goals: 'Identify a practical, low-cost technology stack and architecture for a personal-project MVP that supports public church pages, event registration, admin approval, participant RSVP status, email notifications, roster exports, and calendar import.'
user_name: 'Douglas'
date: '2026-06-16'
web_research_enabled: true
source_verification: true
---

# Research Report: technical

**Date:** 2026-06-16
**Author:** Douglas
**Research Type:** technical

---

## Research Overview

This research evaluates a free-tier-friendly technical architecture for a church website with public content, admin workflows, participant portal features, event registration, approval, RSVP/sign-off status, email notifications, roster exports, and calendar import. The research was conducted using current public vendor documentation, official framework docs, security guidance, and web performance references, with user preference for TanStack treated as a hard architectural constraint.

The resulting recommendation is a TanStack-first modular monolith: TanStack Start, TanStack Router, TanStack Query, TanStack Form, Supabase Postgres/Auth/RLS, Resend, and generated `.ics`/CSV exports. The report rejects microservices, GraphQL, realtime, queues, and two-way calendar sync for the MVP because they add operational complexity without solving the first-version problem.

The full synthesis at the end of this report consolidates the technology stack, integration patterns, architecture, implementation roadmap, performance strategy, security model, risks, and next implementation steps.

---

<!-- Content will be appended sequentially through research workflow steps -->

## Technical Research Scope Confirmation

**Research Topic:** Free-tier-friendly architecture for a church website with admin and participant portal

**Research Goals:** Identify a practical, low-cost technology stack and architecture for a personal-project MVP that supports public church pages, event registration, admin approval, participant RSVP status, email notifications, roster exports, and calendar import.

**Technical Research Scope:**

- Architecture Analysis - design patterns, frameworks, system architecture
- Implementation Approaches - development methodologies, coding patterns
- Technology Stack - languages, frameworks, tools, platforms
- Integration Patterns - APIs, protocols, interoperability
- Performance Considerations - scalability, optimization, patterns

**Research Methodology:**

- Current web data with rigorous source verification
- Multi-source validation for critical technical claims
- Confidence level framework for uncertain information
- Comprehensive technical coverage with architecture-specific insights

**Scope Confirmed:** 2026-06-16

## Technology Stack Analysis

### Web Search Analysis

Research focused on official vendor documentation and current ecosystem signals:

- TanStack, Supabase, Neon, Resend, Firebase, Cloudflare, Vercel, and Netlify official documentation were prioritized for pricing and capability claims.
- Stack Overflow Developer Survey 2025 was used as a broad ecosystem signal for language and database adoption.
- Third-party commentary was treated as secondary and not used for primary pricing claims.

Confidence is high for official pricing/free-tier facts as of 2026-06-16, but free-tier limits change often. Pricing should be rechecked before implementation and again before public launch.

### Programming Languages

**Recommended language:** TypeScript.

TypeScript is the pragmatic choice for this project because the product is a web application with public pages, authenticated portal flows, admin workflows, and form-heavy event registration. A single TypeScript codebase can cover the frontend, server actions/API handlers, validation schemas, calendar generation, and email templates.

The Stack Overflow Developer Survey 2025 reports JavaScript, HTML/CSS, and SQL among the most-used technologies, which aligns with a TypeScript + SQL web stack for a small full-stack application. Source: https://survey.stackoverflow.co/2025

**Assessment:**

- **Primary language:** TypeScript
- **Secondary language:** SQL
- **Avoid for MVP:** separate backend language unless required by a later constraint
- **Confidence:** High

### Development Frameworks and Libraries

**Recommended framework:** TanStack Start with TanStack Router and TanStack Query.

TanStack Start is the preferred framework for this project because the user has explicitly rejected Next.js and wants the TanStack ecosystem. TanStack Start is a full-stack React framework for router-first apps. Its docs describe support for full-document SSR, streaming, server functions, server routes, and build output for the runtime selected by the project. Source: https://tanstack.com/start/latest

TanStack Router is a strong fit for this product because the portal and admin area will have stateful routes: event filters, registration status, admin views, and report parameters. Its docs emphasize type-safe navigation, route loaders, search-param state, validation, prefetching, nested routes, and layout routes. Source: https://tanstack.com/router/v1/docs/overview

TanStack Query is appropriate for portal/admin server-state management: event lists, registration status, admin approval queues, roster data, and mutation invalidation after approvals or RSVP changes. Its docs position it as async/server-state management with fetching, caching, refetching, mutating, and observing server state. Source: https://tanstack.com/query/latest

**Recommended supporting libraries:**

- **Validation:** Zod for form and server-side input validation.
- **Forms:** TanStack Form or React Hook Form, depending on project preference and maturity needs.
- **Dates:** date-fns or native `Intl` APIs for formatting.
- **Calendar export:** generate `.ics` files from event data rather than implementing calendar-provider-specific APIs.
- **CSV export:** generate CSV from admin queries for rosters and reports.

**Assessment:**

- **Major framework:** TanStack Start
- **Routing:** TanStack Router
- **Server state:** TanStack Query
- **UI approach:** simple component system; avoid heavy design-system work before PRD/UX
- **Best deployment fit:** Cloudflare, Netlify, Railway, or Vercel depending on TanStack Start adapter/runtime choice
- **Confidence:** Medium-high because TanStack Start is currently marked RC in official docs

### Database and Storage Technologies

**Recommended database:** PostgreSQL through Supabase for the MVP.

The product needs relational data: users, profiles, events, registrations, accompanying counts, age ranges, approval status, RSVP status, notifications, and audit timestamps. SQL is a better fit than document-only storage because the admin workflows need filtering, reporting, exports, and aggregate counts.

Supabase is the leading recommendation because it combines Postgres, Auth, APIs, storage, and dashboard tooling in one free-tier-friendly platform. Supabase describes its Free plan as suitable for passion projects and simple websites. Source: https://supabase.com/pricing

Supabase Auth provides user authentication and authorization APIs, including email/password, magic link, OTP, social login, and SSO options. Source: https://supabase.com/docs/guides/auth

Neon is a strong alternative if the project wants serverless Postgres without Supabase’s bundled auth/storage layer. Neon’s Free plan currently offers $0/month usage with project, compute, and storage allowances, including 0.5 GB storage per project on the public pricing page. Source: https://neon.com/pricing

Firebase is viable but less aligned with relational reporting. Firebase offers a no-cost Spark plan with no payment method required, but Firestore’s document model is less natural for event registration reporting than Postgres. Source: https://firebase.google.com/pricing

**Assessment:**

- **Best MVP fit:** Supabase Postgres + Supabase Auth
- **Best pure database alternative:** Neon Postgres
- **Less suitable for this data model:** Firebase/Firestore
- **Storage need:** minimal for MVP unless event images or downloadable files are added
- **Confidence:** High

### Authentication

**Recommended auth:** Supabase Auth.

The project requirement is simple: anyone can create an account, and the admin team approves event registrations. Supabase Auth keeps account creation, sign-in, password reset, magic-link/OTP options, and user identity management close to the database.

This avoids stitching together a separate auth vendor, database, and backend in the first version. Admin identity can start as a simple database-backed admin flag or allowlist tied to authenticated users. Advanced roles should stay out of scope until the PRD requires them.

**Assessment:**

- **Account model:** open signup
- **Admin model:** small allowlisted admin set
- **Registration approval:** per-event registration approval, not account approval
- **Confidence:** High

### Email and Notifications

**Recommended transactional email provider:** Resend.

The product needs account/auth emails, registration submitted notices, approval/decline notifications, reminder emails, and possibly admin alerts. Resend’s Free plan currently lists 3,000 emails/month, and its account quota docs specify 100 emails/day and 3,000 emails/month for free accounts. Sources: https://resend.com/pricing and https://resend.com/docs/knowledge-base/account-quotas-and-limits

For the MVP, keep all emails transactional and event-specific. Do not build newsletter/marketing-email features into the first release.

**Assessment:**

- **Best MVP fit:** Resend for transactional app emails
- **Risk:** free daily quota can be hit if reminders are sent in bulk
- **Mitigation:** batch reminders carefully and expose manual export fallback
- **Confidence:** High

### Cloud Infrastructure and Deployment

**Recommended deployment:** TanStack Start deployed to a runtime with strong CDN/edge characteristics.

TanStack Start’s hosting guide says it is designed to work with any hosting provider and recommends official hosting partners Cloudflare, Netlify, and Railway. Source: https://tanstack.com/start/latest/docs/framework/react/guide/hosting

Cloudflare’s docs describe TanStack Start as a full-stack framework for server-side rendering, streaming, server functions, and bundling. Source: https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/

Netlify also documents first-class TanStack Start support. Source: https://docs.netlify.com/build/frameworks/framework-setup-guides/tanstack-start/

Cloudflare Pages is attractive for performance-oriented static/public pages because its Pages plan lists unlimited static requests and unlimited bandwidth on the Free tier, with 500 builds/month. Source: https://pages.cloudflare.com/

Vercel remains a possible TanStack Start host, but it is no longer the primary recommendation now that the stack preference is TanStack-first. Source: https://vercel.com/docs/frameworks/full-stack/tanstack-start

**Assessment:**

- **Best MVP fit:** TanStack Start + Cloudflare/Netlify + Supabase
- **Alternative:** TanStack Start + Vercel + Supabase
- **Avoid initially:** custom VPS, Kubernetes, multi-service cloud architecture
- **Confidence:** Medium-high

### Development Tools and Platforms

**Recommended development workflow:**

- **Package/runtime:** Bun or Node.js. Use whichever the repository already standardizes on.
- **Version control:** GitHub.
- **Deployment:** GitHub-connected Cloudflare Pages, Netlify, Railway, or Vercel project depending on the selected TanStack Start adapter.
- **Database migrations:** Supabase migrations or a TypeScript ORM migration tool.
- **ORM/query layer:** Drizzle ORM or direct Supabase client queries. Drizzle is preferable if strong schema/migration discipline is desired.
- **Testing:** unit tests for business rules; integration tests for registration/approval flows; Playwright later for core browser flows.

The MVP should avoid a complex backend service split. Keep one deployable web app and one managed database/auth backend.

**Assessment:**

- **Best developer experience:** monorepo-style single TanStack Start application
- **Lowest operational overhead:** managed database/auth/email providers
- **Confidence:** Medium-high

### Technology Adoption Trends

The ecosystem trend supports a full-stack TypeScript approach for small web products: JavaScript/TypeScript remains broadly adopted, SQL remains common, and managed platforms reduce the operational burden for solo developers. Source: https://survey.stackoverflow.co/2025/technology

For this project, the trend matters less than maintainability. The best stack is not the most fashionable stack; it is the one that lets one developer build and operate the app without managing infrastructure.

### Performance Positioning

The requirement “most performant out there” should be translated into objective budgets. Google’s Core Web Vitals define good user experience thresholds as Largest Contentful Paint within 2.5 seconds, Interaction to Next Paint at 200 milliseconds or less, and Cumulative Layout Shift at 0.1 or less. Source: https://web.dev/articles/vitals

For this church website, the practical target should be stricter than the baseline on public pages:

- **Public church/event pages:** static or edge-cached where possible, minimal JavaScript, optimized images, and Core Web Vitals passing on mobile.
- **Portal/admin pages:** fast enough for operational work, but allowed to load more client JavaScript because they are authenticated application surfaces.
- **Performance budget:** keep initial public-page JavaScript under a small explicit budget to be defined during architecture; avoid shipping admin/portal code to public pages.
- **Measurement:** use Lighthouse during development and real-user/Core Web Vitals data after launch.

TanStack Start can support a performant implementation, but it does not guarantee one. Performance will come from route-level rendering strategy, caching, asset discipline, database query efficiency, and keeping the public site separate from heavy authenticated application bundles.

### Technology Stack Recommendation

**Primary recommendation, revised after user stack correction:**

- **Frontend/full-stack framework:** TanStack Start with TypeScript
- **Routing:** TanStack Router
- **Server/client state:** TanStack Query
- **Hosting:** Cloudflare or Netlify first; Vercel acceptable if adapter/runtime fit is better
- **Database:** Supabase Postgres
- **Auth:** Supabase Auth
- **Email:** Resend
- **Calendar:** generated `.ics` files
- **Exports:** CSV generated from admin views
- **File storage:** defer; use Supabase Storage only when event images/files are required

**Why this stack fits:**

- It keeps the MVP inside a small number of managed services.
- It supports relational event/reporting needs.
- It avoids paid infrastructure until usage or production requirements justify it.
- It gives a direct path from prototype to real church launch without a full rewrite.
- It aligns with the requested TanStack ecosystem and avoids Next.js.

**Main risks:**

- Free-tier limits may change or be exceeded.
- TanStack Start is marked RC in the official docs, so the project should expect some framework/API churn.
- “Most performant” cannot be guaranteed by framework choice alone; it requires performance budgets, static/edge caching, image optimization, minimal client JavaScript, and measurement.
- Email reminders can exhaust daily free email quotas.
- Supabase Free is suitable for an MVP, but production data and backups may justify a paid plan later.

## Integration Patterns Analysis

### Web Search Analysis

Research focused on integration points the church portal actually needs: application mutations, database authorization, email delivery, calendar export, CSV/report generation, and basic API security. Official documentation was prioritized for framework and vendor behavior.

The main finding is that this product does not need microservices, GraphQL, webhooks, queues, or an API gateway in the MVP. A monolithic TanStack Start application integrated with Supabase and Resend is sufficient. The architecture should be intentionally boring: server functions/routes, relational database rules, transactional email calls, and generated files for calendar/CSV interoperability.

### API Design Patterns

**Recommended API pattern:** TanStack Start server functions for internal app mutations, server routes for downloadable/exportable resources.

TanStack Start is designed as a full-stack framework for router-first apps and includes server functions and server routes in addition to SSR and streaming. Source: https://tanstack.com/start/latest

TanStack Router’s type-safe route tree, loaders, prefetching, search-param state, and validation are a good fit for public event pages, user portal state, and admin filtering/reporting screens. Source: https://tanstack.com/router/v1/docs/overview

**Recommended route/action split:**

- **Server functions:** create registration, update RSVP, approve/decline registration, create/update event, send manual reminder.
- **Server routes:** `GET /events/[id]/calendar.ics`, `GET /admin/events/[id]/roster.csv`, optional `GET /api/health`.
- **Avoid for MVP:** public REST API, GraphQL API, gRPC, API gateway.

**Confidence:** High.

### Communication Protocols

**Recommended protocol:** HTTPS-only browser-to-app and app-to-vendor communication.

Resend’s API is REST-based and enforces HTTPS for requests. Source: https://resend.com/docs/api-reference/introduction

For Supabase, the application can use the Supabase JavaScript client and/or server-side database calls from trusted server contexts. Supabase’s JavaScript API supports standard insert, update, select, and upsert operations needed for event and registration workflows. Sources: https://supabase.com/docs/reference/javascript/insert, https://supabase.com/docs/reference/javascript/update, https://supabase.com/docs/reference/javascript/select, https://supabase.com/docs/reference/javascript/upsert

**Protocol choices:**

- **Browser to app:** HTTPS forms and authenticated pages.
- **App to Supabase:** Supabase client/server SDK over HTTPS.
- **App to Resend:** REST over HTTPS.
- **Calendar export:** HTTP download of `text/calendar`.
- **Roster export:** HTTP download of `text/csv`.

**Avoid for MVP:**

- WebSockets/realtime attendance updates.
- Message queues.
- Service-to-service RPC.
- Event streaming.

**Confidence:** High.

### Data Formats and Standards

**Recommended data formats:** JSON for app/database communication, `.ics` for calendar export, CSV for admin exports.

iCalendar is the correct interoperability standard for downloadable calendar events. RFC 5545 defines iCalendar as a data format for representing and exchanging calendaring and scheduling information such as events, to-dos, journal entries, and free/busy information independent of any particular calendar service. Source: https://datatracker.ietf.org/doc/html/rfc5545

**Product-specific data formats:**

- **JSON:** form payloads, server action inputs, Supabase records.
- **iCalendar / `.ics`:** event calendar downloads.
- **CSV:** rosters, attendance reports, participant exports.
- **HTML email:** transactional notification body.

**Calendar implementation recommendation:**

- Generate one `.ics` file per event from canonical event data.
- Include title, description, location, start/end time, and event URL.
- Do not implement Google Calendar API in the MVP.
- Do not maintain two-way calendar synchronization.

**Confidence:** High.

### System Interoperability Approaches

**Recommended approach:** point-to-point integrations controlled by the web app.

The system should treat TanStack Start as the orchestration layer:

1. User submits registration.
2. Server action validates the request.
3. Server action writes registration and age-range counts to Supabase.
4. Server action triggers a transactional email through Resend.
5. Admin reviews registration in the admin area.
6. Admin approval updates Supabase and sends approval/decline email.
7. User downloads/imports calendar file from a route handler.

Supabase Row Level Security should provide defense in depth for data access. Supabase documents RLS as a Postgres primitive that can be combined with Supabase Auth for end-to-end user security from the browser to the database. Source: https://supabase.com/docs/guides/database/postgres/row-level-security

**Interoperability recommendation:**

- Keep the app as the only integration orchestrator.
- Keep vendor calls server-side where secrets are required.
- Use RLS policies so user-visible data remains constrained even if client-side Supabase access is used.
- Avoid syncing event data into external systems until there is a proven need.

**Confidence:** High.

### Microservices Integration Patterns

**Recommendation:** do not use microservices for the MVP.

This product has modest workflow complexity and one primary domain: church events. Splitting services would increase deployment, observability, authentication, and error-handling complexity without solving a real first-version problem.

Patterns such as API Gateway, service discovery, circuit breakers, and distributed sagas are not justified for the MVP. If the project later grows into multi-church SaaS, those decisions can be revisited after the domain boundaries are clearer.

**MVP replacement for microservices:**

- One TanStack Start app.
- One Postgres database.
- One auth provider.
- One transactional email provider.
- Clear internal modules for events, registrations, users, admin, notifications, and exports.

**Confidence:** High.

### Event-Driven Integration

**Recommendation:** use synchronous flows first; introduce background jobs only if operational pain appears.

Registration and approval workflows are low-volume and can be handled synchronously at first. Email sending can occur during the server action after the database write. If reminder batches become slow or exceed provider quotas, background jobs can be introduced later.

Supabase Edge Functions are server-side TypeScript functions that can integrate a Supabase project with third parties and can be used for webhook-style or isolated server-side work. Source: https://supabase.com/docs/guides/functions

**MVP approach:**

- Send individual transactional emails from server actions.
- Generate rosters and `.ics` files on demand.
- Avoid queues and pub/sub.

**Later upgrade path:**

- Add scheduled reminder jobs.
- Add an email queue table if delivery reliability needs auditing.
- Use Supabase Edge Functions or a scheduled job provider for reminders if the selected TanStack Start host/runtime makes scheduled work awkward.

**Confidence:** Medium-high.

### Integration Security Patterns

**Recommended security model:** server-side authorization checks plus database RLS.

OWASP API Security Top 10 2023 highlights Broken Object Level Authorization as a major API risk: APIs that expose object identifiers create a wide attack surface unless every function checks object-level access. Source: https://owasp.org/API-Security/editions/2023/en/0x11-t10/

TanStack Start server functions and server routes should still be treated as externally reachable application boundaries. Application code must perform explicit authentication and authorization checks for every sensitive mutation or export.

**Security requirements for this product:**

- Validate every registration/action input server-side.
- Check that the current user owns the registration before editing RSVP status.
- Check admin status before event management, approval, reports, and exports.
- Use RLS policies for participant-owned data and admin-only access.
- Store Resend API keys and Supabase service-role keys only in server environment variables.
- Never expose service-role keys to the browser.
- Log approval decisions with timestamps and admin user IDs.

**Confidence:** High.

### Integration Patterns Recommendation

**Recommended MVP integration architecture:**

- Use **TanStack Start server functions** for authenticated mutations.
- Use **TanStack Start server routes** for `.ics`, CSV, and other downloadable resources.
- Use **Supabase Auth** for identity.
- Use **Supabase Postgres + RLS** for secure relational data access.
- Use **Resend REST API** for transactional email.
- Use **RFC 5545 iCalendar** files for calendar interoperability.
- Use **CSV exports** for admin interoperability with spreadsheets.

**Do not build yet:**

- GraphQL API.
- Public API for third-party consumers.
- Microservices.
- WebSocket realtime features.
- Message broker/event bus.
- Two-way calendar sync.
- Deep Google Calendar integration.

This gives the project enough integration capability for the church MVP while preserving the ability to add background jobs, richer calendar integrations, or public APIs later.

## Architectural Patterns and Design

### Web Search Analysis

Research focused on architecture choices that directly affect this product: monolith vs microservices, TanStack Start’s full-stack model, CDN/edge caching, Supabase/Postgres performance, and security-by-design. Official docs and established architecture references were prioritized.

The strongest architectural conclusion is that this should be a **modular monolith**, not microservices. The product has one coherent domain, one developer, and a free-tier constraint. Splitting services would harm velocity, increase deployment complexity, and make performance harder to reason about. Martin Fowler’s “Monolith First” guidance supports starting with a monolith unless the team has strong reasons and maturity to split services. Source: https://martinfowler.com/bliki/MonolithFirst.html

### System Architecture Patterns

**Recommended pattern:** performance-oriented modular monolith.

The application should be one TanStack Start codebase organized into clear internal modules:

- `public-site`: church pages, landing content, public event listing, public event details.
- `auth`: signup, login, session handling, profile bootstrap.
- `portal`: participant registrations, RSVP/sign-off status, user event history.
- `admin`: event management, registration approval, rosters, exports, reminders.
- `events`: event domain logic and shared event queries.
- `registrations`: registration aggregate, accompanying people count, age-range counts.
- `notifications`: transactional email templates and send logic.
- `exports`: `.ics` and CSV generation.

TanStack Start is appropriate as the application shell because it supports full-document SSR, streaming, server functions, server routes, and deployment to the runtime selected by the project. Source: https://tanstack.com/start/latest

**Boundary rule:** modules are separated by folder structure and domain APIs, not by network services. This preserves maintainability while avoiding distributed-system overhead.

**Confidence:** High.

### Design Principles and Best Practices

**Recommended principle:** isolate public performance paths from authenticated application paths.

The public website must be treated differently from the portal/admin app. The public site needs maximum cacheability, minimal JavaScript, optimized images, and route-level rendering decisions. The portal/admin surfaces can use richer interactivity because they are behind authentication and used for task completion.

Design principles:

- Keep domain logic out of UI components.
- Validate all inputs at server boundaries.
- Use typed route/search params for admin filters and event browsing.
- Keep calendar and CSV export as pure functions over canonical event/registration data.
- Avoid premature abstractions for multi-church tenancy, role hierarchies, or payment workflows.
- Prefer explicit status fields over inferred workflow state.

TanStack Router supports typed navigation, nested routes, route loaders, search-param validation, and prefetching, which fit event browsing and admin filtering patterns. Source: https://tanstack.com/router/v1/docs/overview

**Confidence:** High.

### Scalability and Performance Patterns

**Recommended pattern:** cache public pages aggressively; optimize database access for admin/portal flows.

Cloudflare documents that static content such as images, CSS, and JavaScript is cacheable by default, while dynamic HTML is not cached by default but can be cached with Cache Rules. Source: https://developers.cloudflare.com/cache/get-started/

Cloudflare also supports static assets with Workers, where uploaded HTML, CSS, images, and other files can be cached and served to browsers. Source: https://developers.cloudflare.com/workers/static-assets/

Performance architecture:

- Public content pages should be static, pre-rendered, or edge-cached when data freshness allows.
- Public event detail pages should avoid shipping portal/admin JavaScript.
- Event listing pages should use lightweight data loading and cache headers where safe.
- Portal/admin views should use TanStack Query caching, invalidation after mutations, and pagination for rosters.
- Images should be compressed, sized, lazy-loaded below the fold, and not block LCP.
- Admin reports should avoid loading all historical data by default.
- Expensive aggregate counts should be indexed or materialized later if real usage demands it.

Supabase’s query optimization guide states that indexing is key to improving Postgres query performance and that aligning indexes with common query patterns can substantially speed data retrieval. Source: https://supabase.com/docs/guides/database/query-optimization

Initial database indexes should support:

- event visibility and date filtering;
- registrations by `event_id`;
- registrations by `user_id`;
- approval status filtering;
- RSVP status filtering;
- admin report queries by event/date.

**Confidence:** High.

### Integration and Communication Patterns

**Recommended pattern:** synchronous request/response for the MVP, with deferred background processing only if needed.

The MVP should keep integration paths simple:

- Server function handles form mutation.
- Server validates auth and authorization.
- Server writes to Supabase.
- Server optionally sends a Resend email.
- UI invalidates/refetches relevant TanStack Query data.

TanStack Query is suited to this because it manages fetching, caching, refetching, mutating, and observing server state across TypeScript applications. Source: https://tanstack.com/query/latest

Use server routes for interoperability:

- `.ics` route returns `text/calendar`.
- roster route returns `text/csv`.
- optional admin export route returns filtered CSV.

Avoid background queues until one of these becomes true:

- reminders exceed Resend daily free quota;
- email sending slows down approval flows;
- attendance reports become expensive;
- scheduled reminders become a hard requirement.

**Confidence:** High.

### Security Architecture Patterns

**Recommended pattern:** secure-by-design with explicit trust boundaries.

OWASP’s Secure-by-Design Framework emphasizes embedding security into architecture before code is written, using design-phase controls, trust boundaries, and review checklists. Source: https://owasp.org/www-project-secure-by-design-framework/

Trust boundaries:

- Public anonymous users can read public church and public event data only.
- Authenticated participants can read/update only their own profile and registrations.
- Admins can manage events, registrations, reports, and reminders.
- Server-only code can access privileged Supabase service credentials.
- Browser code must never receive privileged service keys.

Security design:

- Use Supabase Auth for identity.
- Use Supabase RLS as defense in depth for user-owned rows.
- Use server-side admin checks for privileged operations.
- Log approval/decline decisions with admin ID and timestamp.
- Rate-limit or throttle registration submissions if abuse appears.
- Keep personally identifying information minimal.
- Treat children/age-range data carefully; collect counts, not unnecessary child details.

OWASP’s API Security Top 10 identifies Broken Object Level Authorization as a major risk when endpoints accept object IDs without proper authorization checks. Source: https://owasp.org/API-Security/editions/2023/en/0x11-t10/

**Confidence:** High.

### Data Architecture Patterns

**Recommended pattern:** normalized relational schema with explicit workflow state.

Core tables:

- `profiles`: user-facing profile fields tied to auth user ID.
- `admin_users`: small allowlist of admin user IDs.
- `events`: event title, description, date/time, location, visibility, capacity, details, calendar metadata.
- `event_age_ranges`: configurable age buckets per event or global defaults.
- `registrations`: event ID, user ID, approval status, RSVP status, total accompanying count, notes.
- `registration_age_counts`: registration ID, age range ID, count.
- `notification_log`: email type, recipient, related entity, send status, provider ID, timestamps.
- `audit_log`: admin actions such as approval, decline, event edits, reminder sends.

Workflow fields should be explicit:

- approval status: `pending`, `approved`, `declined`;
- RSVP status: `unknown`, `attending`, `not_attending`;
- event visibility: `draft`, `published`, `archived`;
- event capacity strategy: no waitlist in first version.

Supabase supports creating tables through SQL or dashboard tooling, and Postgres gives the project relational integrity, foreign keys, indexes, and reporting-friendly queries. Source: https://supabase.com/docs/guides/database/tables

**Confidence:** High.

### Deployment and Operations Architecture

**Recommended pattern:** one app deployment plus managed backend services.

Deployment shape:

- TanStack Start app deployed to Cloudflare or Netlify first, with Vercel as a fallback if runtime support is better during implementation.
- Supabase project for Postgres, Auth, and optional Storage.
- Resend for transactional email.
- GitHub repository as source of truth.
- Environment variables for Supabase URL, public anon key, service-role key, and Resend API key.

Operations model:

- Preview deployments for pull requests if supported by selected host.
- Database migrations checked into the repo.
- Manual seed data for early event examples.
- Simple admin dashboard for operational visibility.
- Basic error logging before adding paid observability.
- Re-check free-tier limits before any real public launch.

Cloudflare, Netlify, and Vercel all document TanStack Start support, which keeps hosting choice flexible while the framework/runtime ecosystem matures. Sources: https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/, https://docs.netlify.com/build/frameworks/framework-setup-guides/tanstack-start/, https://vercel.com/docs/frameworks/full-stack/tanstack-start

**Confidence:** Medium-high.

### Architectural Recommendation

Build the MVP as a **TanStack Start modular monolith**:

- public pages optimized for cacheability and Core Web Vitals;
- authenticated portal/admin routes isolated from public bundles where practical;
- Supabase Postgres/Auth as the managed backend;
- RLS plus server-side authorization checks;
- Resend transactional email;
- `.ics` and CSV generated by server routes;
- no microservices, queues, GraphQL, or two-way calendar sync in the MVP.

This architecture fits the user’s TanStack preference, keeps operational cost low, and gives the best chance of high public-page performance without over-engineering the system.

## Implementation Approaches and Technology Adoption

### Web Search Analysis

Implementation research focused on practical setup for the selected TanStack-first architecture: TanStack Start project structure, TanStack Router routing model, TanStack Query mutations/cache invalidation, TanStack Form validation, Supabase local development/migrations, Supabase SSR/auth setup, Drizzle/Supabase options, and testing workflow.

The implementation recommendation is to build vertically by user workflow instead of horizontally by technology. That means implementing a thin end-to-end slice—public event page → signup/login → registration → admin approval → participant status—before expanding fields, reports, reminders, and polish.

### Technology Adoption Strategies

**Recommended adoption strategy:** start with TanStack Start from day one; do not migrate from a generic Vite SPA later.

TanStack Start is already the chosen architecture because the app needs public pages, authenticated portal/admin flows, server functions/routes, SSR/static/streaming options, and high public-page performance. Its docs describe it as a full-stack React framework powered by TanStack Router with full-document SSR, streaming, server functions, client/server builds, and flexible deployment targets. Source: https://tanstack.com/start/v0/docs/framework/react/overview

Adoption sequence:

1. Create a minimal TanStack Start app.
2. Add Supabase project and local `.env` configuration.
3. Add the initial database schema and migrations.
4. Add public routes and layout.
5. Add auth and profile bootstrap.
6. Add event registration flow.
7. Add admin approval flow.
8. Add exports, email notifications, and performance hardening.

Do not start with every feature or a full design system. The project should prove its core workflow before expanding.

### Development Workflows and Tooling

**Recommended project shape:**

```text
src/
  routes/
    __root.tsx
    index.tsx
    events/
      index.tsx
      $eventId.tsx
      $eventId.calendar.ts
    portal/
      index.tsx
      registrations.tsx
    admin/
      index.tsx
      events.tsx
      events.$eventId.tsx
      events.$eventId.roster.ts
  features/
    auth/
    events/
    registrations/
    admin/
    notifications/
    exports/
  lib/
    supabase/
    db/
    validation/
    dates/
  styles/
```

TanStack Router recommends file-based routing for most projects, while still allowing code-based routing if preferred. Source: https://tanstack.com/router/v1/docs/routing/file-based-routing

**Recommended tooling:**

- **Runtime/package manager:** Bun if the project already uses it; otherwise Node + pnpm is conventional.
- **Framework:** TanStack Start.
- **Routing:** file-based TanStack Router.
- **Server state:** TanStack Query.
- **Forms:** TanStack Form + Zod for event/registration/admin forms.
- **Database:** Supabase Postgres.
- **Migrations:** Supabase CLI SQL migrations initially; consider Drizzle if stronger TypeScript schema ownership is desired.
- **Email:** Resend.
- **Testing:** Vitest for domain logic and utilities; Playwright later for browser-critical flows.

TanStack Query mutations are designed for create/update/delete operations and server side effects, which matches registration submission, RSVP changes, and admin approval. Source: https://tanstack.com/query/latest/docs/framework/react/guides/mutations

TanStack Form provides TypeScript-first, headless form handling and supports validation control at field and form level. Sources: https://tanstack.com/form/latest/docs/overview and https://tanstack.com/form/latest/docs/framework/react/guides/validation

### Testing and Quality Assurance

**Recommended testing strategy:** test business rules first, then critical browser flows.

Unit/integration test targets:

- registration capacity rules;
- age-range count validation;
- approval status transitions;
- RSVP status transitions;
- `.ics` generation;
- CSV generation;
- email payload creation;
- admin authorization helpers.

Vitest is a good fit for the TypeScript/Vite ecosystem. Its docs highlight ESM, TypeScript, JSX support, Vite-powered configuration reuse, Jest-compatible APIs, watch mode, and coverage support. Source: https://vitest.dev/

E2E test targets after MVP UI stabilizes:

- visitor views event;
- user signs up/logs in;
- user registers with accompanying people and age counts;
- admin approves registration;
- user sees approved status;
- user downloads calendar file;
- admin exports roster.

Do not overbuild tests before the route and schema shape stabilizes. Start with domain tests and add E2E coverage once the MVP flow is working.

### Deployment and Operations Practices

**Recommended deployment sequence:**

1. Local development with Supabase CLI.
2. Preview deployment on selected host.
3. Remote Supabase free project.
4. Resend free account/domain setup.
5. Production-like environment variables.
6. Smoke test public pages, auth, registration, admin approval, email, and exports.

Supabase local development supports a local stack through the CLI, schema migrations, and version-controlled migration files. Source: https://supabase.com/docs/guides/local-development/overview

Supabase database migrations are SQL statements for tracking database schema changes over time. Source: https://supabase.com/docs/guides/deployment/database-migrations

Supabase SSR auth requires configuring the client to store sessions in cookies instead of local storage. Source: https://supabase.com/docs/guides/auth/server-side

Implementation detail:

- Use a browser Supabase client only for safe user-scoped reads if RLS is correct.
- Use server-side Supabase clients for mutations and admin operations.
- Store service-role credentials only server-side.
- Keep migration files committed.
- Add seed scripts for sample events and admin user setup.

### Team Organization and Skills

**Team assumption:** one developer building a personal project.

Required skills:

- TypeScript and React fundamentals.
- TanStack Router route loaders/search params.
- TanStack Query cache/mutation patterns.
- Supabase Auth, RLS, and Postgres basics.
- SQL schema/index design.
- Basic web performance measurement.
- Basic transactional email setup.

Skill risks:

- TanStack Start is less common than Next.js, so examples and community answers may be thinner.
- Supabase RLS is powerful but easy to misconfigure; policies need deliberate testing.
- High performance requires discipline in route rendering, caching, images, and JavaScript budgets.

### Cost Optimization and Resource Management

**Cost strategy:** remain free-tier-first but avoid architecture that depends on free tiers being permanent.

Cost controls:

- Keep event images small and optimized.
- Avoid storing unnecessary uploaded files.
- Avoid bulk reminder email blasts that exceed Resend’s daily free quota.
- Cache public pages/assets aggressively.
- Keep database rows lean and indexed around actual query patterns.
- Export reports on demand instead of precomputing everything.
- Re-check Supabase, Resend, Cloudflare/Netlify/Vercel limits before public launch.

If the project becomes a real church production system, a small paid budget may be justified for backups, reliability, email volume, and support. Staying free at all costs can become a reliability risk.

### Risk Assessment and Mitigation

| Risk | Impact | Mitigation |
|---|---:|---|
| TanStack Start RC/API churn | Medium | Pin versions; keep framework usage conventional; avoid undocumented internals. |
| RLS misconfiguration | High | Test user-owned data access; keep admin operations server-side; review policies. |
| Free-tier email quota | Medium | Send transactional emails only; batch reminders carefully; provide manual CSV fallback. |
| Poor public-page performance | High | Static/edge-cache public pages; strict image and JS budgets; measure Core Web Vitals. |
| Schema drift | Medium | Use committed migrations; avoid manual production-only changes. |
| Overbuilt roles/permissions | Medium | Start with admin allowlist; defer role hierarchy. |
| Sensitive child data collection | High | Store age-range counts only unless consent/legal requirements are explicitly defined. |

## Technical Research Recommendations

### Implementation Roadmap

**Phase 1: Foundation**

- Create TanStack Start project.
- Configure linting/formatting/testing.
- Configure Supabase project and local environment.
- Add initial schema migrations.
- Add public shell/layout and event listing.

**Phase 2: Core Workflow**

- Add auth/signup/login.
- Add profile bootstrap.
- Add event detail page.
- Add event registration with accompanying count and age-range counts.
- Add admin event list and registration approval.

**Phase 3: Communication and Exports**

- Add Resend transactional email.
- Add approval/decline email notifications.
- Add `.ics` event export.
- Add CSV roster export.
- Add printable admin roster view.

**Phase 4: Performance and Hardening**

- Define public-page JS/image budgets.
- Add route-level caching strategy.
- Add indexes for event/registration/admin queries.
- Add basic monitoring/logging.
- Add E2E tests for core flows.

### Technology Stack Recommendations

- **Application:** TanStack Start + TypeScript.
- **Routing:** TanStack Router file-based routes.
- **Server state:** TanStack Query.
- **Forms:** TanStack Form + Zod.
- **Database/Auth:** Supabase Postgres/Auth.
- **Database access:** Supabase client first; Drizzle optional if schema complexity increases.
- **Email:** Resend.
- **Testing:** Vitest first; Playwright for E2E later.
- **Hosting:** Cloudflare or Netlify first, Vercel fallback.

### Skill Development Requirements

Before implementation, the developer should be comfortable with:

- TanStack Router route loaders and search params;
- TanStack Query mutation invalidation;
- Supabase Auth with SSR/cookies;
- Postgres foreign keys, indexes, and RLS policies;
- `.ics` file generation basics;
- Core Web Vitals and Lighthouse interpretation.

### Success Metrics and KPIs

Technical success metrics:

- Public pages pass Core Web Vitals on mobile.
- Public event page loads without admin/portal bundles.
- Registration submission completes reliably.
- Admin approval updates participant status and sends email.
- Calendar file imports successfully into common calendar apps.
- Roster CSV opens correctly in spreadsheet tools.
- No user can access another user’s registration data.
- Free-tier usage remains below provider limits during MVP testing.


---

# TanStack-First Church Portal Architecture: Comprehensive Technical Research

## Executive Summary

This research concludes that the strongest technical direction for the church website, admin area, and participant portal is a **TanStack Start modular monolith** backed by managed free-tier-friendly services. The product needs public church pages, event listings, event registration, admin approval, RSVP/sign-off status, email notifications, roster exports, and calendar import. It does not need microservices, GraphQL, queues, realtime infrastructure, or deep calendar-provider integrations in the MVP.

The recommended stack is **TanStack Start + TypeScript**, **TanStack Router**, **TanStack Query**, **TanStack Form + Zod**, **Supabase Postgres/Auth/RLS**, **Resend**, and server-generated `.ics` and CSV files. Hosting should start with **Cloudflare or Netlify**, with Vercel retained as a fallback if runtime support or deployment ergonomics prove better during implementation.

The performance strategy is not “TanStack makes it fast.” The strategy is to separate public-page performance from authenticated application complexity: cache or statically serve public pages where possible, keep public bundles small, optimize images, avoid shipping portal/admin JavaScript to anonymous visitors, and measure against Core Web Vitals.

**Key Technical Findings:**

- A modular monolith is the correct MVP architecture for one developer, one church, and a free-tier constraint.
- TanStack Start aligns with the user’s framework preference and supports full-stack React patterns, server functions, server routes, SSR, and flexible deployment targets.
- Supabase is the best backend fit because event registrations, approvals, age-range counts, RSVP status, exports, and reports are relational workflows.
- Resend is appropriate for transactional emails but free-tier quotas require careful reminder batching.
- `.ics` files and CSV exports satisfy calendar and admin interoperability without building fragile third-party integrations.
- Security must rely on server-side authorization plus Supabase Row Level Security; object-level authorization is a major risk for registration and admin workflows.

**Technical Recommendations:**

- Build one TanStack Start app with internal modules for public site, auth, portal, admin, events, registrations, notifications, and exports.
- Use Supabase Auth and Postgres from the start; define migrations and RLS policies early.
- Build the first vertical slice before polishing: public event page → signup/login → registration → admin approval → approved status → calendar/CSV output.
- Treat public pages as a separate performance surface from portal/admin routes.
- Define and test Core Web Vitals budgets during architecture and implementation.

## Table of Contents

1. Technical Research Introduction and Methodology
2. Technical Landscape and Architecture Analysis
3. Implementation Approaches and Best Practices
4. Technology Stack Evolution and Current Trends
5. Integration and Interoperability Patterns
6. Performance and Scalability Analysis
7. Security and Compliance Considerations
8. Strategic Technical Recommendations
9. Implementation Roadmap and Risk Assessment
10. Future Technical Outlook and Innovation Opportunities
11. Technical Research Methodology and Source Verification
12. Technical Appendices and Reference Materials

## 1. Technical Research Introduction and Methodology

### Technical Research Significance

The product is operationally simple on the surface but technically sensitive in the details. A church event platform handles public discovery, authenticated accounts, registration decisions, participant counts, child age-range planning data, admin-only exports, and user-facing status updates. Poor architecture would create predictable problems: slow public pages, spreadsheet drift, unclear approval state, weak authorization, or a maintenance burden too large for a personal project.

The most important technical decision is to avoid overengineering. The project needs enough structure to be secure and maintainable, but not enough infrastructure to become expensive or slow to build. That points to a managed-backend modular monolith.

### Technical Research Methodology

- **Technical scope:** full-stack framework, routing, data fetching, database/auth, email, calendar export, CSV export, hosting, performance, security, implementation workflow.
- **Source strategy:** official vendor/framework docs first; established security/performance references second; third-party commentary avoided for primary claims.
- **Verification period:** current as of 2026-06-16.
- **Confidence model:** high for stable official docs and standards; medium-high for TanStack Start because the docs describe it as still moving toward maturity.

## 2. Technical Landscape and Architecture Analysis

### Current Architecture Pattern

The recommended architecture is a **performance-oriented modular monolith**. The application is one deployable TanStack Start app, internally organized by feature/domain boundaries.

Recommended internal modules:

- `public-site`: church pages, home, about, service times, event listing, event details.
- `auth`: signup, login, session handling, profile bootstrap.
- `portal`: participant dashboard, registrations, RSVP/sign-off status.
- `admin`: event management, approval queues, reports, rosters, reminders.
- `events`: event domain logic and shared event queries.
- `registrations`: registration, accompanying people, age-range counts, status transitions.
- `notifications`: email templates and send logic.
- `exports`: `.ics` and CSV generation.

The application should not be split into services. The domain is cohesive, the expected scale is modest, and the user is building a personal project. Martin Fowler’s “Monolith First” guidance supports this: a monolith is the safer starting point unless the team has enough evidence and maturity to split services.

### Architecture Tradeoffs

| Option | Fit | Rationale |
|---|---:|---|
| TanStack Start modular monolith | Strong | Best balance of performance, control, maintainability, and user preference. |
| Next.js | Rejected | Technically viable, but conflicts with explicit user preference. |
| Vite SPA + separate backend | Medium | Simple frontend, but loses integrated SSR/server routes and adds backend decisions. |
| Firebase-only | Medium-low | Free-tier-friendly, but relational reports and approval workflows fit Postgres better. |
| Microservices | Poor | Adds complexity without MVP need. |
| GraphQL | Poor | No current API-consumer need; REST/server functions are enough. |

## 3. Implementation Approaches and Best Practices

### Implementation Methodology

Build vertically. The first useful slice should prove the real product loop:

1. Public visitor sees an event.
2. Visitor creates an account or logs in.
3. User registers with accompanying people and age-range counts.
4. Admin sees pending registration.
5. Admin approves or declines.
6. User sees updated status.
7. User downloads/imports calendar file.
8. Admin exports roster.

This approach validates routing, auth, database schema, RLS, mutations, admin authorization, email, and exports before expanding secondary features.

### Development Tooling

Recommended implementation baseline:

- TanStack Start with TypeScript.
- TanStack Router file-based routes.
- TanStack Query for server-state fetching, caching, mutations, and invalidation.
- TanStack Form + Zod for form validation.
- Supabase CLI and SQL migrations.
- Supabase Auth with SSR/cookie-aware session handling.
- Supabase RLS policies from the start.
- Resend for transactional email.
- Vitest for business logic and export generation.
- Playwright later for E2E browser flows.

## 4. Technology Stack Evolution and Current Trends

The research supports a full-stack TypeScript architecture. TanStack is a strong fit because it provides composable, type-safe tools rather than a single opaque framework. The TanStack ecosystem also aligns with the user’s desire for control and performance.

Selected stack:

| Layer | Recommendation |
|---|---|
| App framework | TanStack Start |
| Language | TypeScript |
| Routing | TanStack Router |
| Server/client state | TanStack Query |
| Forms | TanStack Form + Zod |
| Database | Supabase Postgres |
| Auth | Supabase Auth |
| Authorization | Server checks + Supabase RLS |
| Email | Resend |
| Calendar | Generated `.ics` files |
| Admin exports | CSV |
| Hosting | Cloudflare or Netlify first; Vercel fallback |
| Tests | Vitest, later Playwright |

## 5. Integration and Interoperability Patterns

The MVP should use direct, simple integrations:

- Browser ↔ TanStack Start over HTTPS.
- TanStack Start ↔ Supabase over HTTPS.
- TanStack Start ↔ Resend over HTTPS.
- Calendar interoperability via RFC 5545 `.ics` files.
- Admin interoperability via CSV exports.

The system should avoid public APIs, GraphQL, event buses, service meshes, webhook-heavy flows, and two-way calendar sync until real usage proves the need.

## 6. Performance and Scalability Analysis

### Performance Strategy

“Most performant” must be treated as a measurable engineering target. The performance strategy is:

- Keep public pages static, pre-rendered, or edge-cached where practical.
- Keep public JavaScript minimal.
- Do not ship admin/portal code to anonymous public pages.
- Optimize images aggressively.
- Use route-level loading and caching decisions.
- Use TanStack Query for portal/admin caching and mutation invalidation.
- Add database indexes for common event/admin/registration queries.

Core Web Vitals targets should be used as the minimum baseline:

- LCP: good threshold at or below 2.5 seconds.
- INP: good threshold at or below 200 milliseconds.
- CLS: good threshold at or below 0.1.

For this project, public pages should aim to exceed those thresholds on mobile where feasible.

### Scalability Strategy

The expected first-version scale does not justify distributed architecture. Scale should be handled through:

- CDN/edge caching for public assets and pages.
- Postgres indexes for event and registration queries.
- Pagination for admin rosters and reports.
- Minimal file storage.
- Email batching discipline.
- A later background job mechanism only if reminders or reports become operationally heavy.

## 7. Security and Compliance Considerations

Security is not optional because the product stores user registrations and potentially family/group information. The MVP should minimize data collection and enforce authorization at every sensitive boundary.

Security requirements:

- Supabase Auth for identity.
- Server-side checks for all mutations and exports.
- Supabase RLS for user-owned data access.
- Admin allowlist for privileged actions.
- Service-role keys stored server-side only.
- Approval/decline audit logs.
- Minimal child-related data: age-range counts rather than names/details unless explicitly required.
- No public access to participant lists or registration details.

OWASP identifies object-level authorization as a major API risk. Any route/function that accepts `eventId`, `registrationId`, or `userId` must verify that the caller has permission to access or modify that object.

## 8. Strategic Technical Recommendations

### Architecture Recommendation

Use a **TanStack Start modular monolith**.

This gives the project:

- high-performance public route options;
- type-safe routing and route state;
- integrated server functions/routes;
- manageable deployment;
- one codebase for public, portal, and admin surfaces;
- clean upgrade path if the product later grows.

### Backend Recommendation

Use **Supabase Postgres/Auth/RLS**.

This gives the project:

- relational reporting and exports;
- managed authentication;
- row-level authorization;
- SQL migrations;
- free-tier-friendly start;
- fewer vendors than combining separate auth/database providers.

### Performance Recommendation

Set explicit performance budgets during architecture:

- public route JavaScript budget;
- image size budget;
- LCP element rules;
- caching rules for public event pages;
- route-level bundle separation for admin/portal.

## 9. Implementation Roadmap and Risk Assessment

### Roadmap

**Phase 1: Foundation**

- Create TanStack Start project.
- Configure TypeScript, formatting, linting, and Vitest.
- Configure Supabase project and local development.
- Add migrations for profiles, events, registrations, age ranges, admin users, notification log, and audit log.
- Build public shell and event listing.

**Phase 2: Core Workflow**

- Add signup/login.
- Add profile bootstrap.
- Add event detail page.
- Add registration form with accompanying count and age-range counts.
- Add admin approval queue.
- Add participant status view.

**Phase 3: Communication and Exports**

- Add Resend transactional emails.
- Add approval/decline notifications.
- Add `.ics` export.
- Add CSV roster export.
- Add printable roster view.

**Phase 4: Performance and Hardening**

- Add indexes.
- Add route caching strategy.
- Add Lighthouse/Core Web Vitals checks.
- Add E2E tests for core flows.
- Review RLS policies.
- Re-check free-tier limits before launch.

### Risk Assessment

| Risk | Severity | Mitigation |
|---|---:|---|
| TanStack Start API churn | Medium | Pin versions; keep patterns conventional. |
| RLS misconfiguration | High | Test policy behavior; keep admin actions server-side. |
| Poor public performance | High | Separate public/admin bundles; cache public pages; enforce budgets. |
| Free-tier quota limits | Medium | Monitor usage; avoid bulk email; keep files small. |
| Overbuilt permissions | Medium | Start with admin allowlist. |
| Sensitive child/family data | High | Store counts, not unnecessary details. |

## 10. Future Technical Outlook and Innovation Opportunities

Near-term evolution should focus on reliability, performance, and usability rather than new infrastructure.

Potential future additions:

- recurring events;
- volunteer role assignments;
- richer reminder scheduling;
- multilingual public pages;
- reusable family profiles;
- check-in/check-out if the user later confirms this is needed;
- background jobs for reminders/reports;
- stronger observability if public usage grows.

Avoid multi-church tenancy, payment flows, and complex role hierarchies until the church use case proves those requirements.

## 11. Technical Research Methodology and Source Verification

Primary source categories:

- TanStack official documentation for framework, routing, query, form, and hosting claims.
- Supabase official documentation for Auth, RLS, local development, database migrations, tables, and query optimization.
- Resend official documentation for transactional email and quota claims.
- Cloudflare, Netlify, and Vercel official documentation for hosting support.
- RFC 5545 for iCalendar interoperability.
- OWASP API Security and Secure by Design resources for authorization and secure architecture guidance.
- web.dev / Google resources for Core Web Vitals performance targets.
- Martin Fowler architecture guidance for monolith-first reasoning.

Research limitations:

- Free-tier limits and vendor terms can change; re-check before implementation and launch.
- TanStack Start is newer than Next.js and may have fewer community examples.
- Performance outcomes require implementation measurement, not just architectural intent.

## 12. Technical Appendices and Reference Materials

### Key References

- TanStack Start: https://tanstack.com/start/latest
- TanStack Router: https://tanstack.com/router/v1/docs/overview
- TanStack Query: https://tanstack.com/query/latest
- TanStack Form: https://tanstack.com/form/latest/docs/overview
- Supabase Pricing: https://supabase.com/pricing
- Supabase Auth: https://supabase.com/docs/guides/auth
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Migrations: https://supabase.com/docs/guides/deployment/database-migrations
- Resend Pricing: https://resend.com/pricing
- Resend API: https://resend.com/docs/api-reference/introduction
- Cloudflare TanStack Start: https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/
- Netlify TanStack Start: https://docs.netlify.com/build/frameworks/framework-setup-guides/tanstack-start/
- RFC 5545 iCalendar: https://datatracker.ietf.org/doc/html/rfc5545
- Core Web Vitals: https://web.dev/articles/vitals
- OWASP API Security Top 10: https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/
- Martin Fowler, Monolith First: https://martinfowler.com/bliki/MonolithFirst.html

## Technical Research Conclusion

The correct technical path is a TanStack-first, performance-conscious, free-tier-friendly modular monolith. The system should be simple enough for one developer to build and operate, but disciplined enough to protect user data, support admin workflows, and keep public pages fast.

The next best BMad step is to create the PRD using this research and the existing product brief. The PRD should convert these recommendations into explicit requirements, user stories, data requirements, performance budgets, and acceptance criteria.

**Technical Research Completion Date:** 2026-06-16  
**Research Period:** current comprehensive technical analysis  
**Source Verification:** All material technical claims cited with current sources  
**Technical Confidence Level:** High for architecture direction; medium-high for TanStack Start maturity and hosting specifics
