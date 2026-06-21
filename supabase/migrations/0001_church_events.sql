create extension if not exists pgcrypto;

create type public.event_status as enum ('draft', 'published', 'archived');
create type public.approval_status as enum ('pending', 'approved', 'declined');
create type public.rsvp_status as enum ('unknown', 'attending', 'not_attending');
create type public.age_range as enum ('0-3', '4-12', '13-17', '18+');
create type public.log_status as enum ('sent', 'failed', 'skipped');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  phone text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.church_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  status public.event_status not null default 'draft',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  summary text not null default '',
  description text not null default '',
  location text not null,
  maps_url text not null default '',
  capacity integer not null check (capacity > 0),
  cost text not null default '',
  age_group text not null default '',
  required_items text not null default '',
  waiver text not null default '',
  transportation text not null default '',
  volunteer_needs text not null default '',
  registration_open boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.church_events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  participant_name text not null,
  email text not null,
  phone text not null,
  accompanying_count integer not null check (accompanying_count >= 0),
  notes text not null default '',
  approval_status public.approval_status not null default 'pending',
  rsvp_status public.rsvp_status not null default 'unknown',
  decided_by uuid references auth.users(id),
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create table public.registration_age_counts (
  registration_id uuid not null references public.registrations(id) on delete cascade,
  age_range public.age_range not null,
  count integer not null check (count >= 0),
  primary key (registration_id, age_range)
);

create table public.notification_logs (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  status public.log_status not null,
  recipient_email text not null,
  event_id uuid references public.church_events(id) on delete set null,
  registration_id uuid references public.registrations(id) on delete set null,
  message text not null,
  created_at timestamptz not null default now()
);

create table public.reminder_logs (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.church_events(id) on delete cascade,
  status public.log_status not null,
  recipient_count integer not null check (recipient_count >= 0),
  message text not null,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

alter table public.profiles enable row level security;
alter table public.admin_users enable row level security;
alter table public.church_events enable row level security;
alter table public.registrations enable row level security;
alter table public.registration_age_counts enable row level security;
alter table public.notification_logs enable row level security;
alter table public.reminder_logs enable row level security;

create policy "profiles own read" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles own update" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles own insert" on public.profiles for insert with check (id = auth.uid());

create policy "admin users admin read" on public.admin_users for select using (public.is_admin());

create policy "published events public read" on public.church_events for select using (status = 'published' or public.is_admin());
create policy "admin events insert" on public.church_events for insert with check (public.is_admin());
create policy "admin events update" on public.church_events for update using (public.is_admin()) with check (public.is_admin());
create policy "admin events delete" on public.church_events for delete using (public.is_admin());

create policy "registrations own or admin read" on public.registrations for select using (user_id = auth.uid() or public.is_admin());
create policy "registrations own insert" on public.registrations for insert with check (user_id = auth.uid());
create policy "registrations own rsvp update" on public.registrations for update using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());

create policy "age counts own or admin read" on public.registration_age_counts for select using (
  exists (
    select 1 from public.registrations
    where registrations.id = registration_age_counts.registration_id
    and (registrations.user_id = auth.uid() or public.is_admin())
  )
);
create policy "age counts own insert" on public.registration_age_counts for insert with check (
  exists (
    select 1 from public.registrations
    where registrations.id = registration_age_counts.registration_id
    and registrations.user_id = auth.uid()
  )
);
create policy "age counts admin update" on public.registration_age_counts for update using (public.is_admin()) with check (public.is_admin());

create policy "notification logs admin read" on public.notification_logs for select using (public.is_admin());
create policy "notification logs admin insert" on public.notification_logs for insert with check (public.is_admin());
create policy "reminder logs admin read" on public.reminder_logs for select using (public.is_admin());
create policy "reminder logs admin insert" on public.reminder_logs for insert with check (public.is_admin());
