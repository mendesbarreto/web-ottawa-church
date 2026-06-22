# Deferred Work

Findings deferred from the prod-hardening spec review (`spec-build-prod-hardening.md`). Each entry is a real concern that is either speculative, scale-dependent, a pre-existing design choice, or low-impact enough to defer. Capture from the in-review pass on 2026-06-21.

## Speculative / scale-dependent

- **E10 — `.in('registration_id', registrationIds)` URL overflow at scale (~200+ registrations).** No pagination/chunking. Will fail at large N. Add chunking or pagination in `loadProductionState`. (`apps/web/src/lib/supabase.ts:129-131`)
- **E11 — schema drift on `age_range` enum.** Future migration adding a new enum value would silently break `validateRegistration` sum (loops only known keys). Add runtime guard in `mapRegistration`. (`apps/web/src/lib/supabase.ts:318-326`)
- **Blind#17 — type assertions skip runtime validation of Supabase responses.** Every row is `as`-cast. Consider zod schemas if drift becomes a real problem.
- **E7 — cached client bundle post-0002 silent no-op on direct registration updates.** Old bundles calling `supabase.from('registrations').update(...)` will get a silent 0-row update. Worth a breaking-change major version bump if the client bundle is ever redistributed.

## Design choices worth revisiting later

- **A3 — mode detection frozen at build time.** `productionMode` is a module constant from env vars; same artifact can land in preview environments in local-preview mode silently. Consider a runtime probe / footer audit.
- **Blind#15 — `update_own_rsvp` allows RSVP on past events.** No temporal guard. Add `and church_events.starts_at > now()` if business rule requires it.
- **§5.8 / G1 — `state.users` only contains the active user.** Admin sees others' registrations (denormalized into the row) but no user records. Future features joining on `users` will fail silently.
- **Blind#21 — module-level Supabase client singleton survives HMR.** Dev-only; may point to stale config during Vite HMR.
- **F4 — fork PR builds run without secrets.** No detection/warning when a fork PR builds in preview mode. Could mask production-only build failures.
- **F5 — tag pushes silently skip both deploy jobs.** `if: github.ref == 'refs/heads/master'` means `git push --tags` does not deploy. Add tag-based release flow if needed.

## Minor / defense-in-depth

- **Blind#24 — `SUPABASE_DB_PASSWORD` passed via CLI arg.** Standard practice but visible in `ps`. Acceptable for now.
- **C2 — `onAuthChange` callback has no `active` guard.** React 18 tolerates post-unmount state updates; only a concern under concurrent mode quirks.
- **D2 — operation succeeds but `refreshProduction` fails.** Server mutated, UI shows stale state + error notice. Idempotency keys would help; not critical.
- **D3 — reminder `recipient_count` from stale client snapshot.** Computed from `state.registrations` before insert. Drift if other admins act concurrently.
- **D4 — RowMenu closes before async action settles.** No loading feedback inside the menu after click. Minor UX.
- **D5 — silent no-op when admin session expired in `handleApproval`.** `if (!activeUser?.isAdmin) return;` gives no notice. RLS is the real guard.
- **E8 — registration rejected if event transitions to closed mid-request.** Real edge case; depends on B1 (errorMessage) for usable messaging.
- **E9 — RPC error shape generic in `update_own_rsvp`.** Depends on B1.
- **G5 — `handleSignup` does not enforce password length in production path.** Browser `minLength` is the only guard; Supabase config catches the rest but error surfaces as generic.
- **G6 — duplicate-email error on profile update not user-friendly.** Depends on B1.
- **§5.9 — stale `activeUser` in `handleApproval` across long sessions.** Defense-in-depth; RLS is the real protection.
