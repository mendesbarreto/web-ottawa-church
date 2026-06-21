drop index if exists registrations_event_id_user_id_key;

create unique index registrations_one_active_per_event
on public.registrations
(event_id, user_id)
where approval_status in ('pending', 'approved');

create or replace function public.create_registration(
  target_event_id uuid,
  target_user_id uuid,
  target_participant_name text,
  target_email text,
  target_phone text,
  target_accompanying_count integer,
  target_notes text,
  target_age_counts jsonb
)
returns public.registrations
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_registration public.registrations;
  age_range_key text;
  age_count_value integer;
begin
  insert into public.registrations (
    event_id,
    user_id,
    participant_name,
    email,
    phone,
    accompanying_count,
    notes,
    approval_status,
    rsvp_status
  )
  values (
    target_event_id,
    target_user_id,
    target_participant_name,
    target_email,
    target_phone,
    target_accompanying_count,
    target_notes,
    'pending',
    'unknown'
  )
  returning * into inserted_registration;

  for age_range_key, age_count_value in
    select * from jsonb_each_text(target_age_counts)
  loop
    insert into public.registration_age_counts (registration_id, age_range, count)
    values (inserted_registration.id, age_range_key::public.age_range, age_count_value);
  end loop;

  return inserted_registration;
end;
$$;

grant execute on function public.create_registration(
  uuid, uuid, text, text, text, integer, text, jsonb
) to authenticated;
