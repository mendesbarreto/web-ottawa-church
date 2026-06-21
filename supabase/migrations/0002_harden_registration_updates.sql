drop policy if exists "registrations own rsvp update" on public.registrations;

create policy "registrations admin update"
on public.registrations
for update
using (public.is_admin())
with check (public.is_admin());

create or replace function public.update_own_rsvp(
  target_registration_id uuid,
  next_status public.rsvp_status
)
returns public.registrations
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_registration public.registrations;
begin
  update public.registrations
  set rsvp_status = next_status,
      updated_at = now()
  where id = target_registration_id
    and user_id = auth.uid()
    and approval_status = 'approved'
  returning * into updated_registration;

  if updated_registration.id is null then
    raise exception 'Registration not found, not approved, or not owned by current user.';
  end if;

  return updated_registration;
end;
$$;

grant execute on function public.update_own_rsvp(uuid, public.rsvp_status) to authenticated;
