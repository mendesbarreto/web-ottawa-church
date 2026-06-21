---
name: Ottawa Church Portal
status: final
description: shadcn-style visual identity for a fast, welcoming church website with admin and participant event workflows.
sources:
  - _bmad-output/planning-artifacts/prds/prd-web-ottawa-church-2026-06-16/prd.md
  - _bmad-output/planning-artifacts/prds/prd-web-ottawa-church-2026-06-16/addendum.md
updated: 2026-06-16
colors:
  surface-base: '#FFFFFF'
  surface-raised: '#FFFFFF'
  surface-muted: '#F1F5F9'
  surface-container: '#F8FAFC'
  ink-primary: '#020817'
  ink-secondary: '#334155'
  ink-muted: '#64748B'
  border-subtle: '#E2E8F0'
  primary: '#7C3AED'
  primary-foreground: '#FFFFFF'
  primary-soft: '#F5F3FF'
  on-primary-soft: '#5B21B6'
  secondary: '#F1F5F9'
  secondary-soft: '#F8FAFC'
  accent: '#7C3AED'
  accent-foreground: '#FFFFFF'
  tertiary: '#9333EA'
  tertiary-soft: '#FAF5FF'
  success: '#006D3D'
  warning: '#7D5800'
  danger: '#B3261E'
  info: '#005AC1'
typography:
  display:
    fontFamily: 'Roboto'
    fontSize: 44px
    fontWeight: '600'
    lineHeight: '1.12'
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: 'Roboto'
    fontSize: 34px
    fontWeight: '600'
    lineHeight: '1.14'
    letterSpacing: -0.01em
  headline:
    fontFamily: 'Roboto'
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  title:
    fontFamily: 'Roboto'
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1.3'
  body:
    fontFamily: 'Roboto'
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label:
    fontFamily: 'Roboto'
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
  caption:
    fontFamily: 'Roboto'
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 20px
  '6': 24px
  '8': 32px
  '10': 40px
  '12': 48px
  page-mobile: 20px
  page-desktop: 64px
  section-gap: 72px
components:
  button-primary:
    background: '{colors.primary}'
    foreground: '{colors.primary-foreground}'
    radius: '{rounded.md}'
  button-secondary:
    background: '{colors.surface-raised}'
    foreground: '{colors.ink-primary}'
    border: '{colors.border-subtle}'
    radius: '{rounded.md}'
  event-card:
    background: '{colors.surface-raised}'
    border: '{colors.border-subtle}'
    radius: '{rounded.lg}'
  status-badge-approved:
    background: '#E6F4EA'
    foreground: '{colors.success}'
    radius: '{rounded.full}'
  status-badge-pending:
    background: '#FFF4D6'
    foreground: '{colors.warning}'
    radius: '{rounded.full}'
  status-badge-declined:
    background: '#FDE2E2'
    foreground: '{colors.danger}'
    radius: '{rounded.full}'
---

# Ottawa Church Portal — Design Spine

Approved visual mock: `mockups/event-registration-admin-approved.html`. Spines win on conflict with mockups.

## Brand & Style

The visual identity follows shadcn/ui conventions: simple white surfaces, restrained borders, compact cards, predictable buttons, badges, dialogs, forms, and tables. Public pages should feel welcoming, but the event and admin surfaces should read as a reliable web app rather than an experimental landing page.

The approved working palette uses a shadcn-style neutral base with violet as the brand/action color. This keeps layout and component hierarchy conventional while avoiding the green palette the user rejected. Replace these tokens only when the church’s actual brand colors are known.

The public site should carry more editorial warmth. The portal and admin area should carry more utility. Both share the same tokens so the product feels cohesive.

## Colors

- **White Surface (`{colors.surface-base}`)** is the default page canvas, matching shadcn-style app surfaces.
- **Raised Surface (`{colors.surface-raised}`)** is used for cards, forms, admin panels, and modal surfaces.
- **Primary Violet (`{colors.primary}`)** is the main action color: register, save, approve, and confirm.
- **Muted Slate (`{colors.surface-muted}` / `{colors.ink-muted}`)** carries secondary UI, table headers, descriptions, and filters.
- **Status colors** are semantic and functional only: approved/success, pending/warning, declined/danger, informational blue.

Avoid saturated decorative gradients, excessive seasonal colors, and color-only status communication.

## Typography

Typography uses a shadcn-compatible sans-serif posture. In implementation, use the project default stack or a common shadcn pairing such as Inter/Geist. Public pages rely on scale, spacing, and content hierarchy for warmth rather than a separate serif display face.

- `display` and `display-mobile` are reserved for homepage and major public-page hero headings.
- `headline` and `title` are used for section headings, Event titles, and admin panel headings.
- `body`, `label`, and `caption` are used across forms, cards, tables, helper text, and metadata.

No all-caps navigation as a default. Labels may use sentence case for readability.

## Layout & Spacing

Responsive web is the design target. Public pages use generous section spacing and narrow readable text widths. Portal and admin pages prioritize scannability, compact cards, and table/list density without becoming cramped.

- Mobile page margin: `{spacing.page-mobile}`.
- Desktop page margin: `{spacing.page-desktop}`.
- Major public section gap: `{spacing.section-gap}`.
- Forms use vertical stacks on mobile and may use two-column grouping on desktop where it improves comprehension.
- Admin tables become stacked cards on small screens.

## Elevation & Depth

Depth is restrained. Cards use border and tonal separation first. Shadows should be soft and rare, reserved for menus, dialogs, and raised surfaces that visually float above content.

## Shapes

Corners are soft but not playful. Use `{rounded.md}` for buttons and inputs, `{rounded.lg}` for cards, and `{rounded.full}` only for status badges and compact pills.

## Components

- **Primary button** — `{colors.primary}` fill, `{colors.primary-foreground}` text, `{rounded.md}` radius. Used for registration, save, approve, and confirm actions.
- **Secondary button** — raised white surface with subtle border. Used for cancel, back, export, and less-destructive secondary actions.
- **Event table row** — contains Event title, date/time, location, status badge, and action. This is preferred over a loose card grid for the status-heavy participant view.
- **Status badge** — uses semantic status colors and text. Badge text must include the state, not rely on color alone.
- **Registration form group** — fieldset-style grouping for participant details, accompanying people, Age Range counts, and notes.
- **Admin roster table** — compact desktop table; stacked row cards on mobile.
- **Empty state** — one plain sentence, one action when useful. Avoid cheerleading.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Use conventional shadcn-style Cards, Buttons, Badges, Dialogs, Forms, and Tables | Create custom experimental layouts where a standard component works |
| Use status colors semantically | Use color as decoration or the only status cue |
| Keep forms grouped by task | Put all registration fields into one undifferentiated block |
| Preserve fast public-page performance | Add heavy hero animations or decorative scripts |
| Keep Admin screens practical and dense enough | Turn admin workflows into oversized marketing-style cards |
