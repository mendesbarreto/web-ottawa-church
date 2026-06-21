---
stepsCompleted: [1, 2, 3, 4]
workflowType: 'epics-and-stories'
status: 'complete'
completedAt: '2026-06-21'
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-web-ottawa-church-2026-06-16/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-designs/ux-web-ottawa-church-2026-06-16/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-web-ottawa-church-2026-06-16/EXPERIENCE.md
---

# web-ottawa-church - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for web-ottawa-church, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Visitors can view public church information including service times, location, contact information, about content, and basic ministry information.

FR2: Visitors can view a list of published Events with title, date/time, summary, location, and registration availability; draft or archived Events are not visible publicly and Events can be sorted by upcoming date.

FR3: Visitors can view Event details including capacity, price/payment note, location, age group, required items, waiver/consent note, transportation note, and volunteer needs when provided; empty optional fields are hidden and approval requirements are clear.

FR4: Visitors can create an Account without an invitation; Account creation does not require Admin approval and remains separate from Event Registration approval.

FR5: Participants can maintain basic profile information needed for event coordination: name, email, phone, and optional notes; Admins can view profile data only where needed for Event coordination.

FR6: Authenticated Participants can submit a Registration for a published Event; submitted Registrations start as `pending` and duplicate active Registrations for the same Event are not allowed.

FR7: Participants can enter the number of people accompanying them for an Event; the value must be zero or greater and available in Admin planning views.

FR8: Participants can enter Age Range counts for their registration group; counts must be zero or greater and the sum must equal `1 + accompanying people count`; Admins can view aggregate counts by Age Range.

FR9: Participants can provide optional notes or answer event-specific prompts when configured by an Admin; notes are visible to Admins and not public.

FR10: Admins can create, edit, publish, archive, and delete Events; drafts are not public and archived Events are hidden from default public views while remaining available for Admin history.

FR11: Admins can configure Event fields for capacity, price/payment note, location, age group, required items, waiver/consent note, transportation note, volunteer needs, and registration availability; title, date/time, location, and publication status are required.

FR12: Admins can view pending Registrations for an Event with Participant details, accompanying count, Age Range counts, and submitted notes; Admins can filter by Approval Status and see totals for pending, approved, and declined Registrations.

FR13: Admins can approve or decline a Registration; changes are timestamped, record the deciding Admin, and are visible to the Participant in the portal.

FR14: Admins can view aggregate Event totals by Approval Status, RSVP Status, accompanying count, and Age Range; totals update after approval and RSVP changes and distinguish pending from approved participants.

FR15: Participants can view their Registrations grouped by Approval Status and Event date; Participants can see pending, approved, and declined Registrations but cannot view other Participants' Registrations.

FR16: Participants can change RSVP Status for their own Registration; changes are visible to Admins, cannot be made for another Participant, and do not override Approval Status.

FR17: The system sends email notifications for registration submission, approval, and decline; email failures are logged and marketing/newsletter emails are not in MVP.

FR18: Admins can send reminder emails for an Event; reminders respect provider limits, avoid accidental duplicate sends, and roster exports remain a fallback.

FR19: Participants and visitors can download or open an Event calendar file using `.ics`; the file includes title, date/time, location, description, and event URL, with no two-way calendar sync.

FR20: Admins can export Event rosters as CSV and view a printable roster; roster exports include Participant details, Approval Status, RSVP Status, accompanying count, and Age Range counts and are Admin-only.

### NonFunctional Requirements

NFR1: Public pages should pass Core Web Vitals on mobile: LCP at or below 2.5 seconds, INP at or below 200 milliseconds, and CLS at or below 0.1.

NFR2: Public pages should not load unnecessary admin or portal functionality.

NFR3: Users can only access their own Participant data unless they are an Admin.

NFR4: Admin-only actions require explicit server-side authorization checks.

NFR5: The system should collect age-range counts rather than unnecessary individual child details.

NFR6: The MVP should use free-tier-friendly services where practical and avoid infrastructure requiring ongoing paid operations.

NFR7: Public pages and core forms should be usable with keyboard navigation and readable by assistive technologies.

NFR8: The system should be simple enough for one developer to build and operate.

### Additional Requirements

- Initialize the project using the Project Surf-inspired Bun/Turbo monorepo shape with `apps/web` for TanStack Start UI and `packages/domain` for shared church event domain logic.
- Use Bun, Turbo, TypeScript, TanStack Start, TanStack Router, TanStack Query when server state is introduced, Tailwind v4, and shadcn-style UI.
- Keep persistence Supabase Postgres/Auth/RLS-compatible for free-tier production, while allowing local storage adapters for the first working product.
- Preserve the data model for future `profiles`, `admin_users`, `events`, `registrations`, `registration_age_counts`, `notification_log`, `audit_log`, and RLS policies; implement local equivalents first if needed for a working product.
- Use local/demo auth for the first working product and preserve a Supabase Auth replacement path; use an `admin_users` allowlist concept for Admin access.
- Enforce authorization through both server-side checks and Supabase RLS; never expose the service-role key to browser code.
- Use TanStack Start server functions/routes for app-owned mutations and exports.
- Implement explicit server actions for event create/edit/archive/delete, registration submission, approval/decline, RSVP updates, reminders, CSV export, and `.ics` export.
- Use Resend for transactional registration and reminder emails; log email failures without rolling back successful domain actions.
- Generate deterministic `.ics` calendar files and CSV roster exports.
- Use environment validation when production adapters are introduced, covering Supabase public keys, service-role key, Resend API key, site URL, and runtime mode.
- Keep public, portal, and admin concerns separated so public routes do not import admin/portal-only modules.
- Organize implementation with Project Surf-style boundaries: `apps/web/src/features`, `apps/web/src/components/ui`, `apps/web/src/routes`, and `packages/domain`.
- Use database `snake_case`, app-facing TypeScript `camelCase`, kebab-case route paths, PascalCase React components, kebab-case component files, and verb-first server actions.
- Use Bun test for validation, domain logic, `.ics`, CSV, and service behavior; add Playwright later for core E2E flows.
- Do not introduce Next.js, GraphQL, microservices, realtime infrastructure, payments, waitlists, complex role hierarchy, or live check-in/check-out in MVP.

### UX Design Requirements

UX-DR1: Implement the approved shadcn-style visual identity using white/raised surfaces, muted slate neutrals, violet primary actions, semantic status colors, restrained borders, and soft card/dialog/menu shadows.

UX-DR2: Implement design tokens for colors, typography, spacing, and radii from `DESIGN.md`, with public pages using display/headline scale and portal/admin screens using compact app-style typography.

UX-DR3: Use conventional shadcn-compatible Card, Button, Badge, Dialog, Input, Select, Table, and Form primitives instead of experimental custom layouts.

UX-DR4: Implement responsive public navigation with Home, About, Service Times & Location, Events, Contact, and Sign in; mobile navigation must collapse and close after navigation.

UX-DR5: Implement authenticated participant navigation with Dashboard, Events, Profile, and Sign out.

UX-DR6: Implement Admin navigation centered on Dashboard, Events, Registrations/Pending, Exports, and Sign out.

UX-DR7: Implement Events list and status-heavy participant views using rows/tables where status and actions matter, rather than loose card grids.

UX-DR8: Implement Event detail surfaces with date/time, location, registration state, and calendar action before long description.

UX-DR9: Implement an Event details modal from Event row Details/Event title that shows date, linked Location, capacity, cost, required items, transportation, waiver/consent, volunteer needs, and signed-in-only attendance context.

UX-DR10: Ensure public visitors never see participant names or private participant details in Event details or attendance context.

UX-DR11: Implement a Website sign-up modal from header Sign up that captures Account fields only: name, email, phone, and password.

UX-DR12: Implement an Event registration modal from Event row Register that requires a signed-in Account and captures accompanying people, Age Range counts, and notes.

UX-DR13: Implement Age Range count inputs as numeric controls with inline validation requiring the total to equal `1 + accompanying people count`.

UX-DR14: Display helper copy explaining: “Include yourself in the age ranges. Example: if you are coming with 2 children, accompanying people = 2 and age ranges total = 3.”

UX-DR15: Implement text-bearing status badges for Pending, Approved, Declined, Attending, and Not attending; status may not rely on color alone.

UX-DR16: Implement row action menus using a three-dot menu for Details, Register, Add to calendar, View status, Update RSVP, Review, Roster, Send reminder, Approve, and Decline as applicable.

UX-DR17: Implement Admin event management rows showing Event status, pending count, approved count, Age Range signal, and row action menu.

UX-DR18: Implement Create Event modal fields for title, date/time, Location, maps link, description, capacity, cost, required items, transportation note, waiver/consent note, volunteer needs, and publication status.

UX-DR19: Implement confirmation dialogs for destructive or planning-sensitive actions, including decline, reminder send, and RSVP status changes; approval can be one click only if undo/logging exists.

UX-DR20: Implement roster export as CSV and printable roster as a print-optimized view.

UX-DR21: Implement a single “Add to calendar” action that downloads/opens `.ics`, with a fallback if the browser cannot open it automatically.

UX-DR22: Implement defined empty/loading/error states: no upcoming Events, registration closed, unauthenticated registration attempt, registration submitted, approved, declined, RSVP unknown, no pending registrations, email send failure, and permission denied.

UX-DR23: Use direct, calm microcopy such as “Your registration is pending approval,” “Approved. You’re registered for this event,” and “You marked this event as not attending.”

UX-DR24: Ensure all interactions are tap/click accessible with no hover-only functionality, explicit form submit buttons, and visible selected/saved states.

UX-DR25: Implement inline validation near fields and repeat errors in a summary when submission fails.

UX-DR26: Keep date/time and location visible consistently on every Event surface.

UX-DR27: Implement Admin list filters for Approval Status, RSVP Status, search, and Event date using simple controls.

UX-DR28: Meet the accessibility floor: WCAG 2.2 AA target, keyboard reachable controls, visible labels, focus order matching visual order, meaningful error messages, 44px practical touch targets, reduced-motion respect, accessible table headers, and label/value meaning in stacked mobile cards.

UX-DR29: Implement responsive behavior at `< 640px`, `640–1023px`, and `≥ 1024px`, with mobile-first participant flows and desktop-optimized Admin tables.

UX-DR30: Avoid banned MVP patterns: carousels, heavy hero animations, infinite scroll, drag-and-drop, and nested modal stacks.

UX-DR31: Avoid collecting children’s names, exact ages, or unnecessary personal details; Age Range counts are enough for MVP planning.

### FR Coverage Map

FR1: Epic 1 - Public church information

FR2: Epic 1 - Published event listing

FR3: Epic 1 - Event details

FR4: Epic 2 - Open account creation

FR5: Epic 2 - Participant profile

FR6: Epic 3 - Registration submission

FR7: Epic 3 - Accompanying count

FR8: Epic 3 - Age-range counts

FR9: Epic 3 - Event-specific notes

FR10: Epic 4 - Event management

FR11: Epic 4 - Event detail configuration

FR12: Epic 4 - Pending registration review

FR13: Epic 4 - Approval and decline

FR14: Epic 4 - Planning totals

FR15: Epic 3 - Personal registration view

FR16: Epic 3 - RSVP update

FR17: Epic 5 - Registration status emails

FR18: Epic 5 - Reminder emails

FR19: Epic 1 - Calendar export

FR20: Epic 5 - CSV and print rosters

## Epic List

### Epic 1: Public Website Foundation and Event Discovery

Visitors can learn about the church, browse upcoming published events, view event details, and add events to their calendar from a fast, accessible public site.

**FRs covered:** FR1, FR2, FR3, FR19

### Epic 2: Account Access and Participant Profile

Visitors can create an account, sign in, and maintain the minimal profile needed for event coordination.

**FRs covered:** FR4, FR5

### Epic 3: Participant Event Registration and RSVP

Signed-in participants can register for events, provide accompanying people and age-range counts, see their registration status, and update RSVP status.

**FRs covered:** FR6, FR7, FR8, FR9, FR15, FR16

### Epic 4: Admin Event Management and Approval

Admins can manage events, review registrations, approve/decline participants, and view planning totals for event coordination.

**FRs covered:** FR10, FR11, FR12, FR13, FR14

### Epic 5: Communication, Rosters, and Operational Exports

Admins and participants get practical operational outputs: registration emails, reminders, CSV rosters, printable rosters, and reliable export behavior.

**FRs covered:** FR17, FR18, FR20

## Epic 1: Public Website Foundation and Event Discovery

Visitors can learn about the church, browse upcoming published events, view event details, and add events to their calendar from a fast, accessible public site.

### Story 1.1: Initialize TanStack Start Public App Foundation

As a visitor,
I want a fast public website shell with clear navigation,
So that I can quickly find church information and events.

**Acceptance Criteria:**

**Given** the repository is ready for implementation
**When** the developer initializes the app
**Then** the project is created using the approved Project Surf-inspired Bun/Turbo monorepo shape with `apps/web`, `packages/domain`, TanStack Start, Tailwind v4, and shadcn-style primitives
**And** required base configuration files are present for Bun workspaces, Turbo, TypeScript, Vite/TanStack Start, Tailwind v4, and shadcn-style UI
**And** a visitor can open the home page and see a responsive public layout with header, footer, and navigation
**And** navigation includes Home, About, Service Times & Location, Events, Contact, and Sign in
**And** the app uses the approved shadcn-style visual tokens and primitives
**And** public routes do not import admin or portal-only modules.

### Story 1.2: Public Church Information Pages

As a visitor,
I want church information pages,
So that I can understand service times, location, contact details, and basic church context.

**Acceptance Criteria:**

**Given** public church content exists
**When** a visitor opens About, Service Times & Location, or Contact
**Then** the page shows relevant church information without requiring sign in
**And** empty optional content is not shown as broken placeholders
**And** pages are keyboard navigable and readable by assistive technologies.

### Story 1.3: Published Upcoming Events List

As a visitor,
I want to browse upcoming published events,
So that I can decide which church/community events I may want to attend.

**Acceptance Criteria:**

**Given** published, draft, and archived events exist
**When** a visitor opens the Events page
**Then** only published upcoming events are shown
**And** each event row shows title, date/time, summary, location, registration availability, status/action menu, and calendar action where available
**And** draft and archived events are hidden from the public list
**And** the empty state says no upcoming events are published when none exist.

### Story 1.4: Public Event Details

As a visitor,
I want to view complete event details,
So that I know whether the event is relevant and what I need to prepare.

**Acceptance Criteria:**

**Given** a published event has optional details
**When** a visitor opens the event detail page or details modal
**Then** they see date/time, linked location, capacity, price/payment note, age group, required items, waiver/consent note, transportation note, volunteer needs, and registration approval note when provided
**And** empty optional fields are hidden
**And** public visitors do not see participant names or private participant details
**And** date/time and location appear before long descriptions.

### Story 1.5: Public Calendar Export

As a visitor or participant,
I want to add an event to my calendar,
So that I can keep the event details in my personal calendar app.

**Acceptance Criteria:**

**Given** a published event has title, date/time, location, description, and URL
**When** a visitor selects Add to calendar
**Then** the system downloads or opens a valid `.ics` file
**And** the file includes event title, date/time, location, description, and event URL
**And** no two-way calendar synchronization is required
**And** if automatic opening fails, the user still receives a download fallback.

### Story 1.6: Public Performance and Accessibility Baseline

As a mobile visitor,
I want public pages to load quickly and work accessibly,
So that I can discover church information and events without friction.

**Acceptance Criteria:**

**Given** the public home, church info, events list, and event detail pages exist
**When** they are tested on mobile
**Then** public pages target LCP ≤ 2.5s, INP ≤ 200ms, and CLS ≤ 0.1
**And** touch targets are at least 44px where practical
**And** status and actions do not rely on color alone
**And** no carousels, heavy hero animations, infinite scroll, drag-and-drop, or nested modal stacks are used.

## Epic 2: Account Access and Participant Profile

Visitors can create an account, sign in, and maintain the minimal profile needed for event coordination.

### Story 2.1: Account Sign Up

As a visitor,
I want to create an account without an invitation,
So that I can register for church events.

**Acceptance Criteria:**

**Given** a visitor is on the public site
**When** they open Sign up
**Then** a website sign-up modal opens
**And** the modal captures name, email, phone, and password only
**And** it does not capture event-specific registration details
**And** successful account creation signs in or routes the user into an authenticated state
**And** account creation does not require Admin approval.

### Story 2.2: Sign In and Auth Callback

As a participant,
I want to sign in securely,
So that I can access my profile, registrations, and event actions.

**Acceptance Criteria:**

**Given** a participant has an account
**When** they sign in
**Then** the system authenticates through Supabase Auth
**And** the auth callback establishes the session correctly
**And** Sign in remains reachable from public navigation
**And** unauthenticated event registration attempts route to Sign in and return to the event after authentication.

### Story 2.3: Participant Profile Management

As a participant,
I want to maintain my basic profile,
So that event organizers have the coordination information they need.

**Acceptance Criteria:**

**Given** a participant is signed in
**When** they open Profile
**Then** they can view and update name, email, phone, and optional notes
**And** validation prevents missing required profile fields
**And** profile data is only visible to the participant and Admins where needed for event coordination
**And** the profile page uses visible labels and inline validation.

### Story 2.4: Authenticated Navigation and Access States

As a signed-in participant,
I want navigation that reflects my account state,
So that I can reach my dashboard, events, profile, and sign out actions.

**Acceptance Criteria:**

**Given** a visitor is signed out
**When** they view public navigation
**Then** they see Sign in and Sign up actions
**And** they do not see participant-only navigation
**Given** a participant is signed in
**When** they view authenticated navigation
**Then** they see Dashboard, Events, Profile, and Sign out
**And** mobile navigation remains keyboard and touch accessible.

## Epic 3: Participant Event Registration and RSVP

Signed-in participants can register for events, provide accompanying people and age-range counts, see their registration status, and update RSVP status.

### Story 3.1: Event Registration Entry Flow

As a signed-in participant,
I want to register from an event row or detail surface,
So that I can submit my intent to attend a specific event.

**Acceptance Criteria:**

**Given** a participant is signed in and a published event allows registration
**When** they select Register from the event row action menu or event detail
**Then** an Event registration modal opens for that specific event
**And** the modal clearly identifies the event title, date/time, and location
**And** the modal captures event-specific details only
**And** a signed-out visitor attempting registration is routed to Sign in before returning to the event.

### Story 3.2: Registration Group Counts and Notes

As a participant,
I want to provide accompanying people, age-range counts, and notes,
So that organizers have the planning information they need.

**Acceptance Criteria:**

**Given** the registration modal is open
**When** the participant enters accompanying count, Age Range counts, and optional notes
**Then** counts must be zero or greater
**And** Age Range counts must total `1 + accompanying people count`
**And** helper text explains that the participant must include themselves in the age ranges
**And** validation errors appear inline near the relevant fields and in a submission summary when needed
**And** notes are saved for Admin review but never shown publicly.

### Story 3.3: Submit Registration and Pending State

As a participant,
I want to submit my registration,
So that the Admin team can review and approve my participation.

**Acceptance Criteria:**

**Given** a participant has completed a valid registration form
**When** they submit the form
**Then** a Registration is created with Approval Status `pending`
**And** duplicate active Registrations for the same participant and event are prevented
**And** the confirmation message says “Your registration is pending approval.”
**And** the confirmation includes a route to the participant dashboard or status view
**And** submit controls prevent duplicate submissions while pending.

### Story 3.4: Participant Registration Status List

As a participant,
I want to see my event registration statuses,
So that I know whether I am pending, approved, declined, or not attending.

**Acceptance Criteria:**

**Given** a participant has registrations
**When** they open their dashboard, registrations page, or authenticated Events status list
**Then** their Registrations are grouped or sorted by Approval Status and Event date
**And** each row shows event title, date/time, location, Approval Status, RSVP Status, and row action menu
**And** status badges include text labels and do not rely on color alone
**And** the participant cannot see other Participants' Registrations.

### Story 3.5: RSVP Status Update

As an approved participant,
I want to update whether I will attend,
So that organizers have accurate planning totals.

**Acceptance Criteria:**

**Given** a participant has a Registration they own
**When** they change RSVP Status to Attending or Not attending
**Then** the system saves the new status only for their Registration
**And** RSVP Status does not override Approval Status
**And** planning-sensitive changes require clear confirmation
**And** the UI confirms “You marked this event as not attending.” when applicable
**And** failed saves revert the selected state and show a useful error.

### Story 3.6: Participant Registration Privacy and Security

As a participant,
I want my registration details protected,
So that only I and authorized Admins can access them.

**Acceptance Criteria:**

**Given** registration data exists
**When** a participant requests registration data
**Then** they can access only their own Registrations
**And** server-side authorization and Supabase RLS enforce ownership
**And** exact child names, exact ages, and unnecessary child details are not collected
**And** public event details never expose private participant data.

## Epic 4: Admin Event Management and Approval

Admins can manage events, review registrations, approve/decline participants, and view planning totals for event coordination.

### Story 4.1: Admin Access and Event-Centered Navigation

As an Admin,
I want secure Admin access and event-centered navigation,
So that I can manage church event operations.

**Acceptance Criteria:**

**Given** a signed-in user is in the `admin_users` allowlist
**When** they open Admin
**Then** they can access Admin dashboard, Events, Registrations/Pending, and Exports navigation
**And** non-admin users are denied access with “You do not have access to this page.”
**And** every Admin route and mutation performs server-side authorization
**And** Admin navigation remains usable on mobile for simple review tasks.

### Story 4.2: Create Event

As an Admin,
I want to create an event with all planning details,
So that participants can discover and register for it.

**Acceptance Criteria:**

**Given** an Admin is on Admin events
**When** they open Create Event
**Then** a modal captures title, date/time, Location, maps link, description, capacity, cost, required items, transportation note, waiver/consent note, volunteer needs, registration availability, and publication status
**And** title, date/time, location, and publication status are required
**And** optional empty fields are not shown as public placeholders
**And** created draft events are not visible publicly.

### Story 4.3: Edit, Publish, Archive, and Delete Events

As an Admin,
I want to manage event lifecycle,
So that public event listings stay accurate.

**Acceptance Criteria:**

**Given** an event exists
**When** an Admin edits, publishes, archives, or deletes it
**Then** the change is saved through an authorized server action
**And** published events can appear on the public event list
**And** archived events are hidden from default public views but remain available for Admin history
**And** destructive actions require confirmation.

### Story 4.4: Admin Event Management Rows

As an Admin,
I want event rows with planning signals,
So that I can quickly identify events needing attention.

**Acceptance Criteria:**

**Given** events and registrations exist
**When** an Admin opens Admin events
**Then** each event row shows Event status, pending count, approved count, Age Range signal, and row action menu
**And** row actions include Review, Roster, Send reminder, and other applicable actions
**And** Admin tables become labeled stacked cards on small screens
**And** filters include Approval Status, RSVP Status, search, and Event date where applicable.

### Story 4.5: Review Pending Registrations

As an Admin,
I want to review pending registrations for an event,
So that I can decide who should be approved.

**Acceptance Criteria:**

**Given** pending Registrations exist for an event
**When** an Admin opens the event detail or approval queue
**Then** each row shows Participant details, accompanying count, Age Range counts, submitted notes, Approval Status, and actions
**And** the Admin can filter by Approval Status
**And** the Admin does not lose event context while reviewing registrations
**And** the no-pending state says “No pending registrations.”

### Story 4.6: Approve and Decline Registrations

As an Admin,
I want to approve or decline registrations,
So that the participant list reflects accepted attendance.

**Acceptance Criteria:**

**Given** an Admin reviews a pending Registration
**When** they approve or decline it
**Then** Approval Status updates with timestamp and deciding Admin
**And** the participant can see the updated status in their portal
**And** decline requires confirmation
**And** approval can be one click only if audit logging exists
**And** authorization prevents non-admin approval or decline.

### Story 4.7: Admin Planning Totals

As an Admin,
I want aggregate planning totals,
So that I can plan food, space, transportation, and supervision.

**Acceptance Criteria:**

**Given** registrations exist for an event
**When** an Admin views event planning totals
**Then** totals show Approval Status, RSVP Status, accompanying count, and Age Range aggregates
**And** totals update after approval changes and RSVP changes
**And** totals distinguish pending from approved participants
**And** Age Range counts are stored and queried as relational rows, not JSON blobs.

## Epic 5: Communication, Rosters, and Operational Exports

Admins and participants get practical operational outputs: registration emails, reminders, CSV rosters, printable rosters, and reliable export behavior.

### Story 5.1: Registration Status Email Notifications

As a participant,
I want registration status emails,
So that I know when my registration is submitted, approved, or declined.

**Acceptance Criteria:**

**Given** a registration is submitted, approved, or declined
**When** the status-changing action succeeds
**Then** the system attempts to send the appropriate transactional email through Resend
**And** the email contains event title, date/time, location, and current status
**And** email failures are logged for Admin/debugging review
**And** email failure does not roll back the saved registration/status change
**And** marketing/newsletter emails are not sent in MVP.

### Story 5.2: Admin Event Reminder Emails

As an Admin,
I want to send reminder emails for an event,
So that approved participants receive practical event details before attending.

**Acceptance Criteria:**

**Given** an Admin is viewing an event with approved participants
**When** they choose Send reminder
**Then** the system asks for confirmation before sending
**And** reminders respect provider limits and avoid accidental duplicate sends
**And** email send failures are logged without changing registration data
**And** exported rosters remain available as fallback if email sending is unavailable.

### Story 5.3: CSV Roster Export

As an Admin,
I want to export an event roster as CSV,
So that I can use participant and planning data outside the system.

**Acceptance Criteria:**

**Given** an Admin is viewing an event
**When** they export CSV
**Then** the generated roster includes Participant details, Approval Status, RSVP Status, accompanying count, and Age Range counts
**And** the export is Admin-only
**And** the CSV generation is deterministic and testable
**And** unauthorized users cannot access roster export data.

### Story 5.4: Printable Roster View

As an Admin,
I want a printable event roster,
So that I can use a clean paper copy during planning or event operations.

**Acceptance Criteria:**

**Given** an Admin is viewing an event
**When** they open the printable roster
**Then** the page uses print-optimized formatting
**And** it includes participant, approval, RSVP, accompanying, and Age Range planning data
**And** it avoids unnecessary navigation and decorative UI in print layout
**And** access remains Admin-only.

### Story 5.5: Operational Logging and Export Tests

As an operator,
I want emails and exports to be logged and tested,
So that communication and planning outputs are reliable.

**Acceptance Criteria:**

**Given** notification and export features exist
**When** emails, `.ics`, CSV, and printable roster behavior are tested
**Then** Bun tests cover deterministic `.ics` generation, CSV generation, registration status email side effects, reminder side effects, and failure logging
**And** logged failures include enough context for debugging without exposing secrets
**And** service-role keys and provider API keys are never exposed to browser code
**And** environment validation blocks missing required server keys.
