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

create or replace function public.set_registration_decision(
  target_registration_id uuid,
  next_approval_status text,
  acting_admin_id uuid
)
returns public.registrations
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_registration public.registrations;
begin
  if not public.is_admin() then
    raise exception 'Only admins can approve or decline registrations.';
  end if;

  update public.registrations
  set approval_status = next_approval_status::public.approval_status,
      decided_by = acting_admin_id,
      decided_at = now(),
      updated_at = now()
  where id = target_registration_id
  returning * into updated_registration;

  if updated_registration.id is null then
    raise exception 'Registration not found.';
  end if;

  return updated_registration;
end;
$$;

grant execute on function public.set_registration_decision(uuid, text, uuid) to authenticated;
