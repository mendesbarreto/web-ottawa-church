---
title: Church Website, Admin, and Participant Portal PRD
status: final
created: 2026-06-16
updated: 2026-06-16
---

# PRD: Church Website, Admin, and Participant Portal

## 0. Document Purpose

This PRD defines the MVP requirements for a public church website with an admin area and participant portal. It is intended for product planning, UX design, architecture, and story creation. Functional requirements are grouped by feature and numbered globally. Technical implementation details are kept in `addendum.md` unless they affect user-visible requirements or non-functional requirements.

## 1. Vision

The product is a fast public church website plus a lightweight admin and participant portal. It helps current members, newcomers, and community visitors discover the church, view upcoming events, register for events, and manage whether they will participate.

The MVP focuses on event coordination. Events may include BBQs, camping, harvest/strawberry activities, and other church/community gatherings. Participants can create accounts, register themselves, add accompanying people, provide age-range counts, and later update participation status. Admins can review registrations, approve or decline them, communicate updates, and export practical planning lists.

The product should stay simple enough for one developer to build and operate as a personal project using free-tier-friendly services where practical. It should not become a full church-management system in v1.

## 2. Target Users

### 2.1 Jobs To Be Done

- Current members need one reliable place to find events, register, and manage their participation.
- Newcomers need a low-friction way to learn about the church and join community activities.
- Community visitors need public event details without already being inside church communication channels.
- Admin team members need to approve registrations and understand expected attendance without manually maintaining spreadsheets.
- Event organizers need reliable counts by registration status, group size, and age range for planning food, space, transportation, and supervision.

### 2.2 Non-Users for MVP

- Multi-church administrators managing several churches.
- Donors using the platform for giving or tithes.
- Ministry leaders needing a full church-management platform.
- Event staff needing live check-in/check-out at the door. [ASSUMPTION: “sign in/off” means RSVP-style participation status before the event.]

### 2.3 Key User Journeys

- **UJ-1. Maria discovers a BBQ and registers her family.**
  - **Persona + context:** Maria is a newcomer who heard about the church from a friend and wants to attend a BBQ with her family.
  - **Entry state:** unauthenticated visitor on the public website.
  - **Path:** Maria opens the event page, reviews date/location/details, creates an account, enters her own registration, adds accompanying people count, enters age-range counts, and submits.
  - **Climax:** the system confirms the registration was submitted and shows a pending approval state.
  - **Resolution:** Maria can return to the portal to see whether the registration is pending, approved, or declined.

- **UJ-2. An admin approves registrations before a camping trip.**
  - **Persona + context:** Ana is on the admin team and needs accurate attendance numbers before a church camping event.
  - **Entry state:** authenticated admin on the admin area.
  - **Path:** Ana opens the event, filters pending registrations, reviews participant details and group counts, approves valid registrations, and declines any inappropriate or duplicate registrations.
  - **Climax:** the approved totals update for participant count and age ranges.
  - **Resolution:** Ana exports a roster and uses the counts for planning.

- **UJ-3. João changes his participation status after plans change.**
  - **Persona + context:** João is a current member who registered for an event but later learns he cannot attend.
  - **Entry state:** authenticated participant in the portal.
  - **Path:** João opens his registrations, selects the event, changes his participation status to not attending, and confirms.
  - **Climax:** the system updates his RSVP/sign-off state.
  - **Resolution:** admin/event planning counts reflect João’s updated status.

- **UJ-4. A participant adds an event to their calendar.**
  - **Persona + context:** Carla is approved for a harvest event and wants it on her phone calendar.
  - **Entry state:** authenticated participant viewing an approved event or public event detail.
  - **Path:** Carla selects add to calendar/download calendar file.
  - **Climax:** her calendar app receives the event title, time, location, and description.
  - **Resolution:** Carla has the event details in her personal calendar.

## 3. Glossary

- **Account** — A user identity created by a person who wants to register for events or manage participation.
- **Admin** — A trusted user on the admin team who can manage Events and approve or decline Registrations.
- **Age Range** — A configured planning bucket for participant counts, initially `0–3`, `4–12`, `13–17`, and `18+`. [ASSUMPTION: these ranges are acceptable for MVP.]
- **Approval Status** — The Registration review state: `pending`, `approved`, or `declined`.
- **Event** — A church activity listed on the website, such as BBQ, camping, harvest/strawberry activity, or similar gathering.
- **Participant** — A person with an Account who registers for an Event.
- **Registration** — A Participant’s submitted intent to attend an Event, including accompanying count, Age Range counts, and Approval Status.
- **RSVP Status** — A Participant’s current participation state for an Event: `unknown`, `attending`, or `not attending`.
- **Roster** — An admin-facing list/export of approved and pending participants for an Event.

## 4. Features

### 4.1 Public Church Website and Event Discovery

**Description:** The public website presents basic church information and upcoming Events. It must be fast, easy to navigate, and accessible to current members, newcomers, and community visitors. Realizes UJ-1 and UJ-4.

**Functional Requirements:**

#### FR-1: Public church information

Visitors can view public church information including service times, location, contact information, about content, and basic ministry information. [ASSUMPTION: these are the required public pages for MVP.]

**Consequences:**
- Public church information is accessible without an Account.
- Content can be updated by an Admin.

#### FR-2: Public event listing

Visitors can view a list of published Events with title, date/time, summary, location, and registration availability.

**Consequences:**
- Draft or archived Events are not visible on the public event listing.
- Events can be sorted by upcoming date.

#### FR-3: Public event detail

Visitors can view Event details including capacity, price/payment note, location, age group, required items, waiver/consent note, transportation note, and volunteer needs when those fields are provided.

**Consequences:**
- Empty optional fields are not shown as blank placeholders.
- Event detail pages clearly indicate whether registration requires approval.

### 4.2 Account and Participant Profile

**Description:** Anyone can create an Account to register for Events. Profile data remains minimal for MVP. Realizes UJ-1 and UJ-3.

**Functional Requirements:**

#### FR-4: Open account creation

Visitors can create an Account without an invitation.

**Consequences:**
- Account creation does not require Admin approval.
- Registration approval remains separate from Account creation.

#### FR-5: Basic participant profile

Participants can maintain basic profile information needed for event coordination: name, email, phone, and optional notes. [ASSUMPTION: reusable family profiles are out of MVP unless explicitly added later.]

**Consequences:**
- Profile data is visible to Admins only where needed for Event coordination.
- Participants can update their own profile information.

### 4.3 Event Registration

**Description:** Participants can register for Events by submitting their own attendance request plus accompanying people and Age Range counts. Realizes UJ-1.

**Functional Requirements:**

#### FR-6: Submit event registration

Authenticated Participants can submit a Registration for a published Event.

**Consequences:**
- A submitted Registration starts with Approval Status `pending`.
- A Participant cannot create duplicate active Registrations for the same Event.

#### FR-7: Capture accompanying people count

Participants can enter the number of people accompanying them for an Event.

**Consequences:**
- The system validates the count is zero or greater.
- The count is available to Admins in Event planning views.

#### FR-8: Capture age-range counts

Participants can enter Age Range counts for their registration group.

**Consequences:**
- The system validates that Age Range counts are zero or greater.
- The system validates that the sum of Age Range counts equals `1 + accompanying people count`. [ASSUMPTION: the registering Participant is included in Age Range counts.]
- Admins can view aggregate counts by Age Range.

#### FR-9: Support event-specific registration notes

Participants can provide optional notes or answer event-specific prompts when configured by an Admin.

**Consequences:**
- Notes are visible to Admins reviewing the Registration.
- Notes are not public.

### 4.4 Admin Event Management and Approval

**Description:** Admins can create Events, review Registrations, approve or decline them, and view planning totals. Realizes UJ-2.

**Functional Requirements:**

#### FR-10: Manage events

Admins can create, edit, publish, archive, and delete Events.

**Consequences:**
- Draft Events are not public.
- Archived Events are hidden from default public views but remain available for Admin history.

#### FR-11: Configure event details

Admins can configure Event fields for capacity, price/payment note, location, age group, required items, waiver/consent note, transportation note, volunteer needs, and registration availability.

**Consequences:**
- Optional fields can be left empty.
- Required Event fields include title, date/time, location, and publication status.

#### FR-12: Review pending registrations

Admins can view pending Registrations for an Event with Participant details, accompanying count, Age Range counts, and submitted notes.

**Consequences:**
- Admins can filter Registrations by Approval Status.
- Admins can see totals for pending, approved, and declined Registrations.

#### FR-13: Approve or decline registrations

Admins can approve or decline a Registration.

**Consequences:**
- Approval Status changes are timestamped.
- Approval Status changes record the Admin who made the decision.
- The Participant can see the updated Approval Status in the portal.

#### FR-14: View planning totals

Admins can view aggregate Event totals by Approval Status, RSVP Status, accompanying count, and Age Range.

**Consequences:**
- Totals update after approval changes and RSVP Status changes.
- Totals distinguish pending from approved participants.

### 4.5 Participant Portal and RSVP Status

**Description:** Participants can view their Registrations and update whether they will participate. Realizes UJ-3.

**Functional Requirements:**

#### FR-15: View personal registrations

Participants can view their Registrations grouped by Approval Status and Event date.

**Consequences:**
- Participants can see pending, approved, and declined Registrations.
- Participants cannot view other Participants’ Registrations.

#### FR-16: Update RSVP status

Participants can change RSVP Status for their own Registration.

**Consequences:**
- RSVP Status changes are visible to Admins.
- A Participant cannot update RSVP Status for another Participant’s Registration.
- RSVP Status does not override Approval Status.

### 4.6 Notifications, Calendar, and Exports

**Description:** The system supports practical communication and planning outputs without deep third-party integrations. Realizes UJ-2 and UJ-4.

**Functional Requirements:**

#### FR-17: Send registration status emails

The system sends email notifications for registration submission, approval, and decline. [ASSUMPTION: email is the primary notification channel.]

**Consequences:**
- Email failures are logged for Admin review or debugging.
- The system does not send marketing/newsletter emails in MVP.

#### FR-18: Send event reminders

Admins can send reminder emails for an Event.

**Consequences:**
- Reminder sending respects provider limits and should avoid accidental duplicate sends.
- Admins can use exported rosters as fallback if email sending is unavailable.

#### FR-19: Export calendar file

Participants and visitors can download or open an Event calendar file using the `.ics` format.

**Consequences:**
- Calendar export includes Event title, date/time, location, description, and event URL.
- Two-way calendar synchronization is not supported in MVP.

#### FR-20: Export and print rosters

Admins can export Event rosters as CSV and view a printable roster.

**Consequences:**
- Roster exports include Participant details, Approval Status, RSVP Status, accompanying count, and Age Range counts.
- Roster exports are Admin-only.

## 5. Cross-Cutting Non-Functional Requirements

- **NFR-1 Performance:** Public pages should pass Core Web Vitals on mobile: Largest Contentful Paint at or below 2.5 seconds, Interaction to Next Paint at or below 200 milliseconds, and Cumulative Layout Shift at or below 0.1.
- **NFR-2 Public/admin separation:** Public pages should not load unnecessary admin or portal functionality.
- **NFR-3 Security:** Users can only access their own Participant data unless they are an Admin.
- **NFR-4 Authorization:** Admin-only actions require explicit server-side authorization checks.
- **NFR-5 Privacy:** The system should collect age-range counts rather than unnecessary individual child details.
- **NFR-6 Cost:** The MVP should use free-tier-friendly services where practical and avoid infrastructure requiring ongoing paid operations.
- **NFR-7 Accessibility:** Public pages and core forms should be usable with keyboard navigation and readable by assistive technologies.
- **NFR-8 Maintainability:** The system should be simple enough for one developer to build and operate.

## 6. Non-Goals

- Multi-church SaaS support.
- Donations, tithes, or payment processing.
- Full church-management features such as member directories, small groups, pastoral care records, or background checks.
- Waitlists for full Events.
- Advanced roles and permission hierarchy beyond a basic Admin team.
- Two-way Google Calendar or Apple Calendar synchronization.
- Live check-in/check-out at the door. [ASSUMPTION: deferred unless clarified as required.]
- Public third-party API.
- GraphQL, microservices, queues, or realtime infrastructure for MVP.

## 7. MVP Scope

### 7.1 In Scope

- Public church pages.
- Public Event listing and Event details.
- Open Account creation.
- Basic Participant profile.
- Event Registration with accompanying count and Age Range counts.
- Admin Event management.
- Admin Registration approval/decline.
- Participant portal showing Registration status.
- RSVP/sign-off status.
- Email notifications and reminders.
- `.ics` calendar export.
- CSV export and printable Rosters.
- Performance-conscious public pages.

### 7.2 Out of Scope for MVP

- Multilingual support. [ASSUMPTION: English only for MVP.]
- Reusable family profiles.
- Payments.
- Waitlists.
- Live check-in/check-out.
- Multi-church tenancy.
- Complex role management.
- Deep calendar integrations.

## 8. Success Metrics

**Primary**

- **SM-1:** Event registration completion — a new Participant can create an Account and submit a Registration in under 5 minutes during usability testing. Validates FR-4, FR-6, FR-7, FR-8.
- **SM-2:** Admin approval workflow — an Admin can review and approve or decline pending Registrations without editing a spreadsheet. Validates FR-12, FR-13, FR-14.
- **SM-3:** Planning accuracy — Admins can view approved totals by group size and Age Range for an Event. Validates FR-8, FR-14, FR-20.
- **SM-4:** Public performance — public church and Event pages pass Core Web Vitals on mobile. Validates NFR-1, NFR-2.

**Secondary**

- **SM-5:** Participant self-service — Participants can update RSVP Status without contacting an Admin. Validates FR-15, FR-16.
- **SM-6:** Calendar interoperability — exported `.ics` files import into common calendar apps. Validates FR-19.
- **SM-7:** Communication reliability — registration status emails are sent or logged for failure. Validates FR-17.

**Counter-metrics**

- **SM-C1:** Do not optimize total features shipped if it increases maintenance burden for one developer. Counterbalances MVP expansion.
- **SM-C2:** Do not collect more personal or child-related data than needed for planning. Counterbalances planning-data completeness.
- **SM-C3:** Do not pursue “most performant” by breaking portal/admin usability or accessibility. Counterbalances SM-4.

## 9. Open Questions

1. What is the church name and visual identity?
2. Should MVP support English only, Portuguese only, or multiple languages?
3. Should Participants manage reusable family profiles, or enter accompanying details per Event only? Deferred until after MVP registration usability is tested.
4. Does “sign in/off” mean RSVP before the Event only, or live check-in/check-out during the Event too? MVP proceeds with RSVP-only unless corrected before UX.
5. Do any Events require payment, consent forms, or explicit child-safety workflows? MVP treats these as informational notes only unless a specific Event requires more.
6. What exact Age Ranges should the church use?
7. Who receives admin notifications when a new Registration is submitted?

## 10. Assumptions Index

- [ASSUMPTION] The first release serves one church, not a multi-church SaaS platform.
- [ASSUMPTION] Required public pages are service times, location, contact, about, and basic ministries.
- [ASSUMPTION] Initial Age Ranges are `0–3`, `4–12`, `13–17`, and `18+`.
- [ASSUMPTION] “Sign in/off” means RSVP-style participation status before the Event, not live check-in/check-out.
- [ASSUMPTION] `.ics` export is sufficient for calendar support in MVP.
- [ASSUMPTION] English is the MVP language.
- [ASSUMPTION] Participant profile data is minimal: name, email, phone, and optional notes.
- [ASSUMPTION] Event approval applies to each Registration, not Account creation.
- [ASSUMPTION] Email is the primary notification channel.
- [ASSUMPTION] The registering Participant is included in Age Range counts.
