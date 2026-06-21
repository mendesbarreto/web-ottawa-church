---
title: Church Website, Admin, and Member Portal Product Brief
status: draft
created: 2026-06-16
updated: 2026-06-16
---

# Product Brief: Church Website, Admin, and Member Portal

## Executive Summary

This product is a public church website with a lightweight admin system and participant portal. It helps current members, newcomers, and community visitors discover the church, learn about upcoming events, register interest, and manage participation without relying on scattered messages, paper lists, or manual follow-up.

The first version focuses on church information and event coordination. Events may include BBQs, camping trips, harvest/strawberry activities, and other community gatherings. People can create accounts, register for events, specify how many people will accompany them, provide age-range counts for the group, and add approved events to their calendar.

The project is a personal project and should prioritize free-tier-friendly tools, low operating cost, simple maintenance, and clear core workflows over advanced role management or complex church-management features. [ASSUMPTION] The first release serves one church, not a multi-church SaaS platform.

## The Problem

Church events are often coordinated through informal channels: announcements, chat messages, spreadsheets, paper lists, or one-off forms. That creates predictable friction:

- Visitors and newcomers may not know what is happening or how to participate.
- Admins need to manually approve registrations and track who is coming.
- Event organizers lack reliable counts for adults, children, and guests.
- Participants have no single place to see whether they are pending, approved, or no longer attending.
- Calendar details are easy to miss unless someone manually copies them.

The cost is not just administrative time. Poor coordination can affect food planning, transportation, safety expectations, child supervision, and the welcoming experience for people who are new to the church.

## The Solution

Build a simple web platform with three connected surfaces:

- **Public website:** church information, contact/location details, and upcoming event listings.
- **Participant portal:** account creation, event registration, registration status, attendance intent, family/guest counts, and calendar export.
- **Admin area:** event management, registration review, approvals, participant lists, notifications, and reporting/export support.

The core experience should be straightforward: a person sees an event, creates an account, registers themselves and accompanying people, enters age-range counts, waits for approval when required, and later confirms whether they will attend. Admins review registrations, approve or decline them, and use the resulting counts to plan the event.

## Who This Serves

- **Current members:** need a reliable place to find events, register, and manage participation.
- **Newcomers:** need a welcoming, low-friction way to learn about the church and join community activities.
- **Community visitors:** need event details without already being connected to church communication channels.
- **Admin team:** needs approval control, clean participant lists, and basic planning data.
- **Event organizers:** need practical counts by attendance, group size, and age range.

## First-Version Scope

### In Scope

- Public pages for church information. [ASSUMPTION] Includes service times, location, contact, about, and basic ministries.
- Public event listing and event detail pages.
- Account creation open to anyone.
- Event registration for the account holder plus accompanying people.
- Age-range counts for accompanying people, such as `0–3`, `4–12`, `13–17`, and `18+`. [ASSUMPTION] Exact ranges can be configured later.
- Event fields for capacity, price/payment note, location, age group, required items, waiver/consent note, transportation note, and volunteer needs.
- Admin approval for event registrations.
- Participant portal showing pending, approved, and declined registrations.
- Participant ability to sign on/off an event. [ASSUMPTION] This means RSVP-style participation status before the event, not live check-in/check-out at the door.
- Calendar support through downloadable `.ics` files for Apple Calendar, Google Calendar, Outlook, and similar tools.
- Admin notifications, reminder emails, exportable participant lists, attendance reports, and printable rosters.
- Free-tier-friendly infrastructure choices wherever practical.

### Out of Scope for First Version

- Advanced role and permission system beyond a basic admin team.
- Waitlists for full events.
- Multi-church support.
- Donations, tithes, or payment processing.
- Full church-management system features such as small groups, pastoral care records, member directories, or background checks.
- Deep two-way Google Calendar synchronization. [ASSUMPTION] `.ics` export is sufficient for the first version.
- Live event check-in/check-out unless explicitly added later.

## Registration and Approval Model

Anyone can create an account. For events, participants submit a registration with:

- primary participant information;
- number of accompanying people;
- age-range counts for the group;
- optional notes or event-specific answers;
- participation status once the person knows whether they will attend.

The admin team approves or declines event registrations. Roles do not need to be complex in the first version; the system only needs a reliable way to identify admins.

## Success Criteria

The first version is successful if:

- current members, newcomers, and visitors can discover upcoming events without private context;
- users can register for an event in a few minutes;
- admins can approve or decline registrations without editing spreadsheets manually;
- organizers can view reliable totals by registration status, group size, and age range;
- participants can change their participation status without messaging an admin directly;
- event calendar details can be imported into common calendar apps;
- operating cost remains near zero during early usage by using free-tier-friendly services.

## Open Assumptions

- [ASSUMPTION] Church name, branding, and language support are not defined yet.
- [ASSUMPTION] The first release supports English only unless multilingual support is requested.
- [ASSUMPTION] Participant profile management is minimal: name, email, phone, and basic family/group information.
- [ASSUMPTION] Event approval applies to each event registration, not to account creation.
- [ASSUMPTION] Email is the primary notification channel.

## Vision

If the first version works, the platform can become the church’s central digital hub for public information and community participation. Over time it could support richer event workflows, family profiles, volunteer coordination, multilingual content, recurring events, richer ministry pages, and deeper reporting. The near-term goal is narrower: make church events visible, registration controlled, and attendance planning reliable without creating a high-maintenance system.
