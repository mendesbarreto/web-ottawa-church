# Story 5.5: Operational Logging and Export Tests

Status: ready-for-dev

## Story

As an operator,
I want emails and exports to be logged and tested,
so that communication and planning outputs are reliable.

## Acceptance Criteria

1. Given notification and export features exist, when emails, `.ics`, CSV, and printable roster behavior are tested, then Bun tests cover deterministic `.ics` generation, CSV generation, registration status email side effects, reminder side effects, and failure logging.
2. Logged failures include enough context for debugging without exposing secrets.
3. Service-role keys and provider API keys are never exposed to browser code.
4. Environment validation blocks missing required server keys.

## Tasks / Subtasks

- [ ] Task 1 — Deterministic export tests (AC: #1)
  - [ ] Verify Bun test 'exports' covers `generateIcs` (VCALENDAR structure, SUMMARY) + `generateRosterCsv` (header + rows)
- [ ] Task 2 — Side-effect + failure logging tests (AC: #1)
  - [ ] Verify tests cover registration submit/approve/decline notification logs + reminder de-dupe/skip
- [ ] Task 3 — Secret boundary (AC: #2, #3)
  - [ ] Confirm no service-role/Resend keys in client bundle (browser code only imports publishable Supabase key)
  - [ ] Confirm log messages carry debug context, not secrets
- [ ] Task 4 — Env validation (AC: #4)
  - [ ] Verify `validateServerEnvironment` blocks missing `SUPABASE_SERVICE_ROLE_KEY`/`RESEND_API_KEY`
  - [ ] Verify test asserts `.missing` array + `.ok` flag

## Dev Notes

### Implementation Context

Build specs are `done`. Tests in `packages/domain/src/index.test.ts` (5 describe blocks). `validateServerEnvironment` (`index.ts:507`) checks `SUPABASE_SERVICE_ROLE_KEY` + `RESEND_API_KEY`. Browser bundle (`apps/web/src`) only references `VITE_SUPABASE_URL`/`VITE_SUPABASE_PUBLISHABLE_KEY` (publishable) — service role stays server-side.

### Architecture Compliance

- [Source: architecture.md#Authentication & Security] — no service-role key in browser code.
- [Source: architecture.md#Testing Framework] — Bun test for `.ics`, CSV, service behavior.
- [Source: architecture.md#Infrastructure & Deployment] — env validation for required server keys.
- Known seam (`deferred-work.md` Blind#17): Supabase row responses are `as`-cast (no zod runtime validation) — consider zod schemas if drift becomes real.
- Known seam (`deferred-work.md` Blind#24): `SUPABASE_DB_PASSWORD` passed via CLI arg (visible in `ps`) — acceptable.

### Testing Standards

- All assertions exist in `index.test.ts`. This story is the **assurance gate** — verify coverage matches the AC list; add tests for any uncovered side effect.

### Project Structure Notes

- Tests correctly co-located in `packages/domain/src/index.test.ts`.

### References

- [Source: epics.md#Story 5.5]
- [Source: packages/domain/src/index.test.ts]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md#Blind17, Blind24]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
