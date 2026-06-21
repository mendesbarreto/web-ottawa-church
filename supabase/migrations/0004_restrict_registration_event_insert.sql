drop policy if exists "registrations own insert" on public.registrations;

create policy "registrations own open event insert"
on public.registrations
for insert
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.church_events
    where church_events.id = registrations.event_id
      and church_events.status = 'published'
      and church_events.registration_open = true
  )
);
