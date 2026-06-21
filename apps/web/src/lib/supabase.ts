import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';
import {
  ageRanges,
  emptyAgeCounts,
  type AppState,
  type ChurchEvent,
  type EventInput,
  type EventStatus,
  type ProfileInput,
  type Registration,
  type RsvpStatus,
  type User,
} from '@ottawa-church/domain';

type EventRow = {
  id: string;
  title: string;
  status: EventStatus;
  starts_at: string;
  ends_at: string;
  summary: string;
  description: string;
  location: string;
  maps_url: string;
  capacity: number;
  cost: string;
  age_group: string;
  required_items: string;
  waiver: string;
  transportation: string;
  volunteer_needs: string;
  registration_open: boolean;
};

type ProfileRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string | null;
};

type RegistrationRow = {
  id: string;
  event_id: string;
  user_id: string;
  participant_name: string;
  email: string;
  phone: string;
  accompanying_count: number;
  notes: string;
  approval_status: 'pending' | 'approved' | 'declined';
  rsvp_status: RsvpStatus;
  decided_by: string | null;
  decided_at: string | null;
  created_at: string;
};

type AgeCountRow = {
  registration_id: string;
  age_range: keyof Registration['ageCounts'];
  count: number;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const emptyProductionState: AppState = {
  events: [],
  users: [],
  registrations: [],
  notificationLogs: [],
  reminderLogs: [],
  activeUserId: null,
};

let client: SupabaseClient | null = null;

export function getSupabaseClient() {
  if (!isSupabaseConfigured) return null;
  client ??= createClient(supabaseUrl!, supabasePublishableKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return client;
}

export async function getCurrentSession() {
  const supabase = requireSupabase();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export function onAuthChange(callback: (session: Session | null) => void) {
  const supabase = requireSupabase();
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
}

export async function loadProductionState(session: Session | null): Promise<AppState> {
  const supabase = requireSupabase();
  const activeUserId = session?.user.id ?? null;
  const { data: events, error: eventsError } = await supabase.from('church_events').select('*').order('starts_at');
  if (eventsError) throw eventsError;

  let activeUser: User | null = null;
  let isAdmin = false;
  if (activeUserId) {
    const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', activeUserId).maybeSingle();
    if (profileError) throw profileError;
    const { data: adminRow, error: adminError } = await supabase.from('admin_users').select('user_id').eq('user_id', activeUserId).maybeSingle();
    if (adminError) throw adminError;
    isAdmin = Boolean(adminRow);
    if (profile) activeUser = mapUser(profile as ProfileRow, isAdmin);
  }

  const { data: registrations, error: registrationsError } = activeUserId
    ? await supabase.from('registrations').select('*').order('created_at', { ascending: false })
    : { data: [], error: null };
  if (registrationsError) throw registrationsError;

  const registrationIds = (registrations ?? []).map((registration) => registration.id);
  const { data: ageCounts, error: ageCountsError } = registrationIds.length
    ? await supabase.from('registration_age_counts').select('*').in('registration_id', registrationIds)
    : { data: [], error: null };
  if (ageCountsError) throw ageCountsError;

  return {
    events: (events ?? []).map((event) => mapEvent(event as EventRow)),
    users: activeUser ? [activeUser] : [],
    registrations: (registrations ?? []).map((registration) => mapRegistration(registration as RegistrationRow, (ageCounts ?? []) as AgeCountRow[])),
    notificationLogs: [],
    reminderLogs: [],
    activeUserId,
  };
}

export async function signInWithSupabase(email: string, password: string) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}

export async function signOutOfSupabase() {
  const supabase = requireSupabase();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function createSupabaseAccount(input: ProfileInput & { password: string }) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        name: input.name,
        phone: input.phone,
        notes: input.notes ?? '',
      },
    },
  });
  if (error) throw error;
  if (!data.user) throw new Error('Account created, but Supabase did not return a user.');
  if (data.session) {
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: data.user.id,
      name: input.name,
      email: input.email,
      phone: input.phone,
      notes: input.notes ?? '',
    });
    if (profileError) throw profileError;
  }
  return data.session;
}

export async function updateSupabaseProfile(userId: string, input: ProfileInput) {
  const supabase = requireSupabase();
  const { error } = await supabase.from('profiles').update({
    name: input.name,
    email: input.email,
    phone: input.phone,
    notes: input.notes ?? '',
    updated_at: new Date().toISOString(),
  }).eq('id', userId);
  if (error) throw error;
}

export async function saveSupabaseEvent(input: EventInput) {
  const supabase = requireSupabase();
  const payload = eventToPayload(input);
  const query = input.id
    ? supabase.from('church_events').update(payload).eq('id', input.id)
    : supabase.from('church_events').insert(payload);
  const { error } = await query;
  if (error) throw error;
}

export async function updateSupabaseEventStatus(eventId: string, status: EventStatus) {
  const supabase = requireSupabase();
  const { error } = await supabase.from('church_events').update({ status, updated_at: new Date().toISOString() }).eq('id', eventId);
  if (error) throw error;
}

export async function deleteSupabaseEvent(eventId: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from('church_events').delete().eq('id', eventId);
  if (error) throw error;
}

export async function createSupabaseRegistration(input: {
  eventId: string;
  user: User;
  accompanyingCount: number;
  ageCounts: Registration['ageCounts'];
  notes: string;
}) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from('registrations').insert({
    event_id: input.eventId,
    user_id: input.user.id,
    participant_name: input.user.name,
    email: input.user.email,
    phone: input.user.phone,
    accompanying_count: input.accompanyingCount,
    notes: input.notes,
    approval_status: 'pending',
    rsvp_status: 'unknown',
  }).select('id').single();
  if (error) throw error;
  const rows = ageRanges.map((range) => ({
    registration_id: data.id,
    age_range: range,
    count: input.ageCounts[range],
  }));
  const { error: ageError } = await supabase.from('registration_age_counts').insert(rows);
  if (ageError) throw ageError;
}

export async function updateSupabaseApproval(registrationId: string, approvalStatus: 'approved' | 'declined', adminUserId: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from('registrations').update({
    approval_status: approvalStatus,
    decided_by: adminUserId,
    decided_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq('id', registrationId);
  if (error) throw error;
}

export async function updateSupabaseRsvp(registrationId: string, rsvpStatus: RsvpStatus) {
  const supabase = requireSupabase();
  const { error } = await supabase.rpc('update_own_rsvp', {
    target_registration_id: registrationId,
    next_status: rsvpStatus,
  });
  if (error) throw error;
}

export async function createSupabaseReminderLog(eventId: string, recipientCount: number) {
  const supabase = requireSupabase();
  const { error } = await supabase.from('reminder_logs').insert({
    event_id: eventId,
    status: recipientCount ? 'sent' : 'skipped',
    recipient_count: recipientCount,
    message: recipientCount ? `Reminder queued for ${recipientCount} approved registration(s).` : 'No approved registrations to remind.',
  });
  if (error) throw error;
}

function requireSupabase() {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase is not configured.');
  return supabase;
}

function mapEvent(row: EventRow): ChurchEvent {
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    summary: row.summary,
    description: row.description,
    location: row.location,
    mapsUrl: row.maps_url,
    capacity: row.capacity,
    cost: row.cost,
    ageGroup: row.age_group,
    requiredItems: row.required_items,
    waiver: row.waiver,
    transportation: row.transportation,
    volunteerNeeds: row.volunteer_needs,
    registrationOpen: row.registration_open,
  };
}

function mapUser(row: ProfileRow, isAdmin: boolean): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    notes: row.notes ?? '',
    isAdmin,
  };
}

function mapRegistration(row: RegistrationRow, allAgeCounts: AgeCountRow[]): Registration {
  const ageCounts = emptyAgeCounts();
  for (const ageCount of allAgeCounts.filter((item) => item.registration_id === row.id)) {
    ageCounts[ageCount.age_range] = ageCount.count;
  }
  return {
    id: row.id,
    eventId: row.event_id,
    userId: row.user_id,
    participantName: row.participant_name,
    email: row.email,
    phone: row.phone,
    accompanyingCount: row.accompanying_count,
    ageCounts,
    notes: row.notes,
    approvalStatus: row.approval_status,
    rsvpStatus: row.rsvp_status,
    decidedBy: row.decided_by ?? undefined,
    decidedAt: row.decided_at ?? undefined,
    createdAt: row.created_at,
  };
}

function eventToPayload(input: EventInput) {
  return {
    title: input.title,
    status: input.status,
    starts_at: input.startsAt,
    ends_at: input.endsAt,
    summary: input.summary,
    description: input.description,
    location: input.location,
    maps_url: input.mapsUrl,
    capacity: input.capacity,
    cost: input.cost,
    age_group: input.ageGroup,
    required_items: input.requiredItems,
    waiver: input.waiver,
    transportation: input.transportation,
    volunteer_needs: input.volunteerNeeds,
    registration_open: input.registrationOpen,
    updated_at: new Date().toISOString(),
  };
}
