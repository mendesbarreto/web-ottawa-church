# PRD Addendum: Technical and Parked Detail

## Source Artifacts

- Product brief: `_bmad-output/planning-artifacts/briefs/brief-web-ottawa-church-2026-06-16/brief.md`
- Product brief addendum: `_bmad-output/planning-artifacts/briefs/brief-web-ottawa-church-2026-06-16/addendum.md`
- Technical research: `_bmad-output/planning-artifacts/research/technical-free-tier-church-portal-research-2026-06-16.md`

## Technical Direction Captured from Research

- Build a TanStack Start modular monolith.
- Use TanStack Router for routing.
- Use TanStack Query for server/client state and mutation invalidation.
- Use TanStack Form with Zod for forms and validation.
- Use Supabase Postgres/Auth/RLS for database, identity, and data authorization.
- Use Resend for transactional emails.
- Use generated `.ics` files for calendar interoperability.
- Use CSV generation for admin exports.
- Prefer Cloudflare or Netlify hosting first; keep Vercel as a fallback if runtime support is better.

## Technical Non-Goals

- Next.js is not the selected framework.
- GraphQL is not needed for MVP.
- Microservices are not justified for MVP.
- Realtime/WebSocket functionality is not required for MVP.
- Background queues should be deferred unless reminders or reports create operational pressure.

## Performance Notes

The phrase “most performant” should become measurable budgets during architecture. Suggested starting points:

- Public pages pass Core Web Vitals on mobile.
- Public routes avoid loading portal/admin bundles.
- Event pages should be static or edge-cached where practical.
- Images should be optimized and lazy-loaded when below the fold.
- Admin and portal pages may be more dynamic than public pages.

## Suggested Initial Data Model

- `profiles`
- `admin_users`
- `events`
- `event_age_ranges`
- `registrations`
- `registration_age_counts`
- `notification_log`
- `audit_log`

## Parked Decisions

- Reusable family profiles are deferred until the user confirms they are needed.
- Live check-in/check-out is deferred until the user clarifies “sign in/off.”
- Payments and consent forms are deferred until specific event requirements are known.
