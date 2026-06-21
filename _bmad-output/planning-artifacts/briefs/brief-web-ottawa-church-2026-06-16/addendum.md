# Addendum: Product Notes and Parked Detail

## Captured Inputs

- Audience: current members, newcomers, and community visitors.
- Account creation: anyone can create an account.
- Approval owner: admin team.
- Roles: advanced roles are not needed for the first version.
- Registration model: people register themselves and the number of accompanying people.
- Group planning data: age-range counts are needed, for example `0–3`, `4–12`, `13–17`, and `18+`.
- Event detail fields: capacity, price/payment note, location, age group, required items, waiver/consent note, transportation note, and volunteer needs are useful first-version fields.
- Waitlists: not needed.
- Admin/communication: notifications, reminders, export lists, attendance reports, and printable rosters are desired.
- Calendar support: users should be able to import events into their calendar.
- Project type: personal project.
- Constraint: use free-tier solutions as much as practical.

## Suggested Event Age Ranges

Initial configurable ranges:

- `0–3`: infants and toddlers
- `4–12`: children
- `13–17`: youth
- `18+`: adults

This is simple enough for event planning while avoiding collection of unnecessary personal detail.

## Technical Constraint for Later Architecture

The product brief intentionally avoids selecting vendors. The downstream architecture should evaluate free-tier-friendly options for hosting, database, authentication, email, file storage, and deployment. The decision should consider monthly free limits, lock-in, ease of development, and whether the platform can be maintained by one person.

## Open Questions for Next Pass

- What is the church name and visual identity?
- Should the website support English only, Portuguese only, or multiple languages?
- Should users manage reusable family profiles, or enter accompanying counts per event only?
- Should “sign in/off” remain an RSVP status, or should it also become live event check-in/check-out?
- Do any events require payment, consent forms, or explicit child safety workflows?
