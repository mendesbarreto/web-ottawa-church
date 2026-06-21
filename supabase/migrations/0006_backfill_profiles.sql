insert into public.profiles (id, email, name, phone, notes)
select
  u.id,
  coalesce(u.email, ''),
  coalesce(u.raw_user_meta_data ->> 'name', ''),
  coalesce(u.raw_user_meta_data ->> 'phone', ''),
  coalesce(u.raw_user_meta_data ->> 'notes', '')
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict do nothing;
