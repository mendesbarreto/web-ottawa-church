---
name: Ottawa Church Portal
status: final
sources:
  - _bmad-output/planning-artifacts/prds/prd-web-ottawa-church-2026-06-16/prd.md
  - _bmad-output/planning-artifacts/prds/prd-web-ottawa-church-2026-06-16/addendum.md
updated: 2026-06-16
---

# Ottawa Church Portal — Experience Spine

Approved interaction mock: `mockups/event-registration-admin-approved.html`. Spines win on conflict with mockups.

## Foundation

Responsive web. Public pages must work well on mobile and desktop; Admin workflows are optimized for desktop/laptop but remain usable on mobile for simple review tasks. `DESIGN.md` is the visual identity reference. This spine owns information architecture, behavior, states, interactions, accessibility, and flows.

The UI system follows shadcn/ui patterns: Card, Button, Badge, Dialog, Input, Select, Table, and Form primitives. Components should be implemented with lightweight, accessible primitives that map cleanly to `DESIGN.md` shadcn-inspired tokens.

## Information Architecture

| Surface | Reached From | Purpose |
|---|---|---|
| Home | Public URL | Introduce the church and route visitors to Events, service details, and contact information. |
| About | Header navigation | Explain church identity, leadership/ministry basics, and newcomer context. |
| Service Times & Location | Header navigation / Home CTA | Provide when and where to attend. |
| Events list | Header navigation / Home CTA | Show upcoming published Events. |
| Event detail | Events list / shared link | Show full Event details and registration action. |
| Event details modal | Event row Details / Event title | Show Event date, linked Location, capacity, cost, required items, transportation, waiver/consent, volunteer needs, and signed-in-only attendance context. |
| Auth | Header Sign up / Sign in | Create Account or sign in to the website. |
| Website sign-up modal | Header Sign up | Create Account independent from any specific Event. |
| Event registration modal | Event row Register after auth | Submit Registration with accompanying people and Age Range counts. Requires signed-in Account. |
| Upcoming Events status list | User menu after sign-in / Events | Show upcoming Events with Registration and RSVP Status inline. |
| Participant dashboard | User menu after sign-in | Optional deeper view for personal Registrations; the Events list carries the primary status cues in MVP. |
| Registration detail | Participant dashboard | Show one Registration and update RSVP Status. |
| Admin dashboard | Admin sign-in / Admin nav | Summarize pending work and upcoming Events. |
| Admin events | Admin nav | Create, edit, publish, archive, and manage Events. |
| Create Event modal | Admin event management | Create an Event with public details, registration constraints, planning notes, and publication status. |
| Admin event detail | Admin events | Review Registrations, approve/decline, view totals, export Rosters, send reminders. |
| Admin approval queue | Admin event detail | Review individual pending Registrations and approve/decline without losing Event context. |
| Printable roster | Admin event detail | Print-friendly Event roster. |

Public navigation: Home, About, Service Times & Location, Events, Contact, Sign in. On mobile, navigation collapses into a menu button.

Authenticated participant navigation: Dashboard, Events, Profile, Sign out.

Admin navigation: Dashboard, Events, Registrations/Pending, Exports, Sign out. For MVP, admin navigation remains simple and event-centered.

## Voice and Tone

Microcopy should be direct, calm, and plain. Brand voice lives in `DESIGN.md`.

| Do | Don't |
|---|---|
| “Your registration is pending approval.” | “Almost there! Our amazing team is reviewing this!” |
| “Approved. You’re registered for this event.” | “Success!!! You’re in!” |
| “You marked this event as not attending.” | “You signed off.” |
| “Age ranges help the team plan food, space, and supervision.” | “Tell us everyone’s ages.” |
| “We couldn’t send the email. The registration was still saved.” | “Something went wrong.” |

Admin copy should use counts and verbs: “12 pending”, “Approve registration”, “Export roster”.

## Component Patterns

Behavioral specs only. Visual treatment lives in `DESIGN.md.Components`.

| Component | Use | Behavioral Rules |
|---|---|---|
| Header navigation | Public site | Current page is indicated. Sign in is always reachable. Mobile menu closes after navigation. |
| Event card | Events list / Home | Entire card opens Event detail. Primary action is “View event” or “Register” depending on context. |
| Event detail summary | Event detail | Date/time, location, registration state, and calendar action appear before long description. |
| Event details modal | Events list | Location is a link to maps. Signed-in participants may see “People going”; public visitors must not see participant names. |
| Website sign-up modal | Header Sign up | Captures Account fields only: name, email, phone, password. Does not capture Event-specific registration details. |
| Event registration modal | Event row Register | Requires signed-in Account. Captures Event-specific accompanying people, Age Range counts, and notes. Validate inline before submit. |
| Age Range count input | Registration form | Numeric stepper or number input. Sum must equal `1 + accompanying people count`. Explain this rule in helper text. |
| Status badge | Portal/admin | Always includes text label: Pending, Approved, Declined, Attending, Not attending. |
| Admin approval row | Admin event detail | Shows Participant, group size, Age Range counts, notes, status, and approve/decline actions. |
| Row action menu | Event and Admin tables | Three-dot menu contains row actions such as Details, Register, Add to calendar, View status, Update RSVP, Review, Roster, Send reminder, Approve, and Decline. Avoid multiple inline action buttons per row. |
| Admin event management row | Admin events | Shows Event status, pending count, approved count, Age Range signal, and row action menu for Review, Roster, or Send reminder. |
| Create Event modal | Admin events | Captures title, date/time, Location, maps link, description, capacity, cost, required items, transportation note, waiver/consent note, volunteer needs, and publication status. |
| Confirmation dialog | Admin approval / decline | Used for decline and reminder send. Approve can be one click if undo/logging exists; otherwise confirm. |
| Roster export action | Admin event detail | CSV export is a button. Printable roster opens a print-optimized view. |
| Calendar action | Event detail | Downloads/opens `.ics`; label: “Add to calendar”. |

## State Patterns

| State | Surface | Treatment |
|---|---|---|
| Public loading | Public pages | Prefer fast server-rendered content. Use skeletons only where data is genuinely pending. |
| No upcoming Events | Events list | “No upcoming events are published right now.” Optional link to contact page. |
| Event registration closed | Event detail | Show details and clear closed state. Hide registration form. |
| Unauthenticated registration attempt | Event detail | Route to Auth, then return to the Event after sign-in. |
| Registration submitted | Registration form | Confirmation panel: “Your registration is pending approval.” Link to dashboard. |
| Registration approved | Participant dashboard | Approved badge, Event details, RSVP Status control, calendar action. |
| Registration declined | Participant dashboard | Declined badge and any Admin-provided note if supported later. No calendar CTA by default. |
| RSVP unknown | Registration detail | Prompt: “Will you attend?” with Attending / Not attending choices. |
| Admin no pending registrations | Admin event detail | “No pending registrations.” Show approved totals and roster actions. |
| Email send failure | Admin action | Show non-blocking error: registration/status change remains saved; email failure is logged. |
| Permission denied | Admin routes | Route to participant dashboard or show “You do not have access to this page.” |

## Interaction Primitives

- Tap/click to act. No hover-only functionality.
- Forms submit with explicit primary buttons.
- Inline validation appears near the field and repeats in a summary if submission fails.
- Date/time and location appear consistently on every Event surface.
- Admin list filters are simple controls: Approval Status, RSVP Status, search, and Event date.
- Destructive actions require confirmation.
- RSVP Status changes require a clear selected state and save confirmation.
- Calendar download is a single action; no provider-specific calendar picker in MVP.
- Banned in MVP: carousels, heavy hero animations, infinite scroll, drag-and-drop, nested modal stacks.

## Accessibility Floor

Behavioral accessibility. Visual contrast is governed by `DESIGN.md`.

- WCAG 2.2 AA target for public pages and core forms.
- All interactive controls must be keyboard reachable.
- Focus order follows visual reading order.
- Form fields have visible labels; placeholder text is not the label.
- Error messages identify the field and the action needed to fix it.
- Status badges include text, not color alone.
- Touch targets are at least 44px high/wide where practical.
- Reduced motion users should not receive non-essential animations.
- Tables must have accessible headers; stacked mobile roster cards must preserve label/value meaning.

## Responsive & Platform

| Breakpoint | Behavior |
|---|---|
| `< 640px` | Single-column public pages, mobile menu, stacked Event cards, full-width form controls, admin rows become cards. |
| `640–1023px` | Single or two-column public sections depending on content; forms may group related fields in two columns. |
| `≥ 1024px` | Public pages use readable max widths; Admin surfaces may use tables and side-by-side summary panels. |

Mobile is primary for participants discovering and registering. Desktop is primary for Admin planning and exports.

## Product-Specific UX Concerns

### Registration Count Clarity

The Age Range count rule can confuse users because “accompanying people” excludes the registering Participant while Age Range counts include the registering Participant. The form must explain this explicitly:

> “Include yourself in the age ranges. Example: if you are coming with 2 children, accompanying people = 2 and age ranges total = 3.”

If usability testing shows this remains confusing, the model should change to collect total group size directly.

### Sensitive Family and Child Data

The UI should avoid asking for children’s names, exact ages, or unnecessary personal details. Age Range counts are enough for MVP planning.

### Performance

Public pages should avoid decorative interactions that delay content. Event discovery and registration entry points must feel immediate on mobile.

## Key Flows

### Flow 1 — Maria registers her family for a BBQ

1. Maria opens the public Events list from her phone.
2. She opens Details from the BBQ Event row.
3. Event details modal shows date/time, linked location, description, required items, and registration CTA.
4. If Maria does not have an Account, she uses the header Sign up action first.
5. Once signed in, she taps Register on the Event row.
6. An Event registration modal opens for that specific Event.
7. She enters accompanying people count, fills Age Range counts, and adds optional notes.
8. She submits.
8. **Climax:** the confirmation panel says “Your registration is pending approval,” with a link to her dashboard.
9. Resolution: Maria can check the dashboard later for approval status.

Failure: Age Range counts do not match total represented people → inline error explains the required total and gives an example.

### Flow 2 — Ana approves camping registrations

1. Ana signs in and opens Admin dashboard on desktop.
2. Pending registrations are summarized by Event.
3. She opens the camping Event detail.
4. She filters by Pending and reviews each Registration row.
5. She approves valid Registrations and declines any invalid or duplicate Registrations.
6. Totals update for approved count, RSVP Status, accompanying people, and Age Range counts.
7. **Climax:** the planning summary reflects the approved group count; Ana exports the CSV Roster.
8. Resolution: Ana can print the Roster or send reminders later.

Failure: approval succeeds but email fails → status remains approved, and a non-blocking email failure message is logged.

### Flow 3 — João changes his RSVP Status

1. João signs in from his phone.
2. Participant dashboard shows his upcoming Registrations.
3. He opens the Event he can no longer attend.
4. He changes RSVP Status to Not attending.
5. The system asks for confirmation because this affects planning.
6. **Climax:** the page shows “You marked this event as not attending.”
7. Resolution: Admin planning totals reflect the updated RSVP Status.

Failure: network request fails → the selected state reverts and the UI says the status was not saved.

### Flow 4 — Carla adds an Event to her calendar

1. Carla opens an approved Event from the dashboard.
2. Event detail shows an “Add to calendar” action near date/time.
3. She selects it.
4. The browser downloads or opens the `.ics` file.
5. **Climax:** her calendar app receives the Event title, date/time, location, description, and URL.
6. Resolution: Carla can rely on her personal calendar for reminders.

Failure: `.ics` cannot be opened automatically → provide download fallback.
