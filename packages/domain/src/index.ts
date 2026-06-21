export type ApprovalStatus = 'not_registered' | 'pending' | 'approved' | 'declined';
export type RsvpStatus = 'unknown' | 'attending' | 'not_attending';
export type EventStatus = 'draft' | 'published' | 'archived';
export type AgeRangeKey = '0-3' | '4-12' | '13-17' | '18+';
export type NotificationKind = 'registration_submitted' | 'registration_approved' | 'registration_declined' | 'event_reminder';
export type LogStatus = 'sent' | 'failed' | 'skipped';

export type ChurchEvent = {
  id: string;
  title: string;
  status: EventStatus;
  startsAt: string;
  endsAt: string;
  summary: string;
  description: string;
  location: string;
  mapsUrl: string;
  capacity: number;
  cost: string;
  ageGroup: string;
  requiredItems: string;
  waiver: string;
  transportation: string;
  volunteerNeeds: string;
  registrationOpen: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  notes?: string;
  isAdmin: boolean;
};

export type Registration = {
  id: string;
  eventId: string;
  userId: string;
  participantName: string;
  email: string;
  phone: string;
  accompanyingCount: number;
  ageCounts: Record<AgeRangeKey, number>;
  notes: string;
  approvalStatus: Exclude<ApprovalStatus, 'not_registered'>;
  rsvpStatus: RsvpStatus;
  decidedBy?: string;
  decidedAt?: string;
  createdAt: string;
};

export type AppState = {
  events: ChurchEvent[];
  users: User[];
  registrations: Registration[];
  notificationLogs: NotificationLog[];
  reminderLogs: ReminderLog[];
  activeUserId: string | null;
};

export type NotificationLog = {
  id: string;
  kind: NotificationKind;
  status: LogStatus;
  recipientEmail: string;
  eventId?: string;
  registrationId?: string;
  message: string;
  createdAt: string;
};

export type ReminderLog = {
  id: string;
  eventId: string;
  status: LogStatus;
  recipientCount: number;
  message: string;
  createdAt: string;
};

export type RegistrationInput = {
  eventId: string;
  user: User;
  accompanyingCount: number;
  ageCounts: Record<AgeRangeKey, number>;
  notes: string;
};

export type EventTotals = {
  pending: number;
  approved: number;
  declined: number;
  attending: number;
  notAttending: number;
  people: number;
  ages: Record<AgeRangeKey, number>;
};

export type EventInput = Omit<ChurchEvent, 'id'> & { id?: string };

export type ProfileInput = Pick<User, 'name' | 'email' | 'phone' | 'notes'>;

export const ageRanges: AgeRangeKey[] = ['0-3', '4-12', '13-17', '18+'];

export const initialEvents: ChurchEvent[] = [
  {
    id: 'harvest-strawberries',
    title: 'Harvest Strawberries Morning',
    status: 'published',
    startsAt: '2026-07-11T09:30:00-04:00',
    endsAt: '2026-07-11T13:00:00-04:00',
    summary: 'A family-friendly morning serving together at the community farm.',
    description: 'Join the church community for a practical morning harvesting strawberries, sharing lunch, and welcoming newcomers.',
    location: 'Ottawa Community Farm, 45 Greenbank Rd, Ottawa',
    mapsUrl: 'https://maps.google.com/?q=Ottawa+Community+Farm',
    capacity: 60,
    cost: 'Free. Bring a packed lunch if needed.',
    ageGroup: 'All ages welcome',
    requiredItems: 'Water bottle, hat, sunscreen, closed-toe shoes.',
    waiver: 'Parent or guardian supervision required for children.',
    transportation: 'Carpool coordination available after approval.',
    volunteerNeeds: 'Drivers, lunch setup, and cleanup helpers.',
    registrationOpen: true,
  },
  {
    id: 'summer-bbq',
    title: 'Summer Community BBQ',
    status: 'published',
    startsAt: '2026-07-25T16:00:00-04:00',
    endsAt: '2026-07-25T19:30:00-04:00',
    summary: 'Food, games, and conversation for members, friends, and visitors.',
    description: 'A relaxed BBQ for the church family and guests. Invite a friend and bring a lawn chair.',
    location: 'Church Backyard, 120 Riverside Dr, Ottawa',
    mapsUrl: 'https://maps.google.com/?q=120+Riverside+Dr+Ottawa',
    capacity: 120,
    cost: 'Suggested donation optional.',
    ageGroup: 'All ages',
    requiredItems: 'Lawn chair, picnic blanket.',
    waiver: '',
    transportation: 'Limited parking; transit recommended.',
    volunteerNeeds: 'Grill team, kids games, welcome table.',
    registrationOpen: true,
  },
  {
    id: 'fall-camping',
    title: 'Fall Camping Weekend',
    status: 'published',
    startsAt: '2026-09-11T17:00:00-04:00',
    endsAt: '2026-09-13T11:00:00-04:00',
    summary: 'A weekend of worship, meals, and outdoor activities.',
    description: 'Families and individuals are welcome. Approval helps organizers plan sites, meals, and supervision.',
    location: 'Rideau River Provincial Park',
    mapsUrl: 'https://maps.google.com/?q=Rideau+River+Provincial+Park',
    capacity: 45,
    cost: 'Estimated $35/person. Payment handled offline.',
    ageGroup: 'Families and adults',
    requiredItems: 'Tent, sleeping bag, warm clothing, flashlight.',
    waiver: 'Consent required for minors attending without parents.',
    transportation: 'Carpool signup available after approval.',
    volunteerNeeds: 'Meal prep, worship setup, activity leads.',
    registrationOpen: true,
  },
];

export const initialUsers: User[] = [
  { id: 'admin-ana', name: 'Ana Admin', email: 'admin@ottawachurch.test', phone: '613-555-0101', password: 'admin123', isAdmin: true },
  { id: 'joao', name: 'João Silva', email: 'joao@example.com', phone: '613-555-0111', password: 'welcome123', isAdmin: false },
];

export const initialRegistrations: Registration[] = [
  {
    id: 'reg-joao-bbq',
    eventId: 'summer-bbq',
    userId: 'joao',
    participantName: 'João Silva',
    email: 'joao@example.com',
    phone: '613-555-0111',
    accompanyingCount: 2,
    ageCounts: { '0-3': 0, '4-12': 2, '13-17': 0, '18+': 1 },
    notes: 'Can help with cleanup.',
    approvalStatus: 'approved',
    rsvpStatus: 'attending',
    decidedBy: 'Ana Admin',
    decidedAt: '2026-06-20T12:00:00-04:00',
    createdAt: '2026-06-18T10:30:00-04:00',
  },
];

export const initialState: AppState = {
  events: initialEvents,
  users: initialUsers,
  registrations: initialRegistrations,
  notificationLogs: [],
  reminderLogs: [],
  activeUserId: null,
};

export function emptyAgeCounts(): Record<AgeRangeKey, number> {
  return { '0-3': 0, '4-12': 0, '13-17': 0, '18+': 1 };
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-CA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function statusLabel(status: ApprovalStatus | RsvpStatus | EventStatus) {
  return status.replaceAll('_', ' ').replace(/^\w/, (char) => char.toUpperCase());
}

export function validateRegistration(input: Pick<RegistrationInput, 'accompanyingCount' | 'ageCounts'>) {
  const errors: string[] = [];
  if (!Number.isInteger(input.accompanyingCount) || input.accompanyingCount < 0) {
    errors.push('Accompanying people must be zero or greater.');
  }
  for (const range of ageRanges) {
    const value = input.ageCounts[range];
    if (!Number.isInteger(value) || value < 0) errors.push(`Age range ${range} must be zero or greater.`);
  }
  const ageTotal = ageRanges.reduce((sum, range) => sum + input.ageCounts[range], 0);
  const expectedTotal = 1 + input.accompanyingCount;
  if (ageTotal !== expectedTotal) {
    errors.push(`Age ranges must total ${expectedTotal}. Include yourself in the age ranges.`);
  }
  return errors;
}

export function normalizeState(state: Partial<AppState> | null | undefined): AppState {
  return {
    events: state?.events ?? initialEvents,
    users: state?.users ?? initialUsers,
    registrations: state?.registrations ?? initialRegistrations,
    notificationLogs: state?.notificationLogs ?? [],
    reminderLogs: state?.reminderLogs ?? [],
    activeUserId: state?.activeUserId ?? null,
  };
}

export function createAccount(state: AppState, input: ProfileInput & { password: string }, now = new Date().toISOString()) {
  const errors = validateProfile(input);
  if (!input.password || input.password.length < 6) errors.push('Password must be at least 6 characters.');
  if (state.users.some((user) => user.email.toLowerCase() === input.email.toLowerCase())) {
    errors.push('An account already exists for this email.');
  }
  if (errors.length) return { state, errors };
  const user: User = {
    id: `user-${now.replace(/\W/g, '')}`,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    password: input.password,
    notes: input.notes?.trim(),
    isAdmin: false,
  };
  return { state: { ...state, users: [...state.users, user], activeUserId: user.id }, errors, user };
}

export function authenticateUser(state: AppState, email: string, password: string) {
  const user = state.users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
  if (!user || user.password !== password) return { user: null, error: 'Email or password is incorrect.' };
  return { user, error: '' };
}

export function validateProfile(input: ProfileInput) {
  const errors: string[] = [];
  if (!input.name.trim()) errors.push('Name is required.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) errors.push('Valid email is required.');
  if (!input.phone.trim()) errors.push('Phone is required.');
  return errors;
}

export function updateProfile(state: AppState, userId: string, input: ProfileInput) {
  const errors = validateProfile(input);
  const emailOwner = state.users.find((user) => user.email.toLowerCase() === input.email.trim().toLowerCase() && user.id !== userId);
  if (emailOwner) errors.push('Another account already uses this email.');
  if (errors.length) return { state, errors };
  return {
    state: {
      ...state,
      users: state.users.map((user) => user.id === userId ? {
        ...user,
        name: input.name.trim(),
        email: input.email.trim(),
        phone: input.phone.trim(),
        notes: input.notes?.trim(),
      } : user),
      registrations: state.registrations.map((registration) => registration.userId === userId ? {
        ...registration,
        participantName: input.name.trim(),
        email: input.email.trim(),
        phone: input.phone.trim(),
      } : registration),
    },
    errors,
  };
}

export function validateEvent(input: EventInput) {
  const errors: string[] = [];
  if (!input.title.trim()) errors.push('Event title is required.');
  if (!input.startsAt) errors.push('Start date and time are required.');
  if (!input.endsAt) errors.push('End date and time are required.');
  if (input.startsAt && input.endsAt && new Date(input.endsAt) <= new Date(input.startsAt)) errors.push('End date must be after start date.');
  if (!input.location.trim()) errors.push('Location is required.');
  if (!input.status) errors.push('Publication status is required.');
  if (!Number.isInteger(input.capacity) || input.capacity < 1) errors.push('Capacity must be at least 1.');
  return errors;
}

export function saveEvent(state: AppState, input: EventInput, now = new Date().toISOString()) {
  const errors = validateEvent(input);
  if (errors.length) return { state, errors };
  const event: ChurchEvent = {
    ...input,
    id: input.id ?? `event-${now.replace(/\W/g, '')}`,
    title: input.title.trim(),
    summary: input.summary.trim(),
    description: input.description.trim(),
    location: input.location.trim(),
    mapsUrl: input.mapsUrl.trim() || `https://maps.google.com/?q=${encodeURIComponent(input.location.trim())}`,
    cost: input.cost.trim(),
    ageGroup: input.ageGroup.trim(),
    requiredItems: input.requiredItems.trim(),
    waiver: input.waiver.trim(),
    transportation: input.transportation.trim(),
    volunteerNeeds: input.volunteerNeeds.trim(),
  };
  const exists = state.events.some((item) => item.id === event.id);
  return {
    state: {
      ...state,
      events: exists ? state.events.map((item) => item.id === event.id ? event : item) : [...state.events, event],
    },
    errors,
    event,
  };
}

export function updateEventStatus(state: AppState, eventId: string, status: EventStatus) {
  return { ...state, events: state.events.map((event) => event.id === eventId ? { ...event, status } : event) };
}

export function deleteEvent(state: AppState, eventId: string) {
  return {
    ...state,
    events: state.events.filter((event) => event.id !== eventId),
    registrations: state.registrations.filter((registration) => registration.eventId !== eventId),
  };
}

export function canAdmin(user: User | null | undefined) {
  return Boolean(user?.isAdmin);
}

export function registerForEvent(state: AppState, input: RegistrationInput, now = new Date().toISOString()) {
  const errors = validateRegistration(input);
  const event = state.events.find((item) => item.id === input.eventId);
  if (!event || event.status !== 'published') errors.push('Registration is only available for published events.');
  if (event && !event.registrationOpen) errors.push('Registration is closed for this event.');
  if (errors.length) return { state, errors };
  const duplicate = state.registrations.some((registration) => registration.eventId === input.eventId && registration.userId === input.user.id && registration.approvalStatus !== 'declined');
  if (duplicate) return { state, errors: ['You already have an active registration for this event.'] };
  const registration: Registration = {
    id: `reg-${input.eventId}-${input.user.id}-${now.replace(/\W/g, '')}`,
    eventId: input.eventId,
    userId: input.user.id,
    participantName: input.user.name,
    email: input.user.email,
    phone: input.user.phone,
    accompanyingCount: input.accompanyingCount,
    ageCounts: input.ageCounts,
    notes: input.notes,
    approvalStatus: 'pending',
    rsvpStatus: 'unknown',
    createdAt: now,
  };
  return {
    state: appendNotificationLog(
      { ...state, registrations: [...state.registrations, registration] },
      'registration_submitted',
      'sent',
      input.user.email,
      'Registration submitted email queued.',
      input.eventId,
      registration.id,
      now,
    ),
    errors: [],
    registration,
  };
}

export function updateApproval(state: AppState, registrationId: string, approvalStatus: 'approved' | 'declined', adminName: string, now = new Date().toISOString()) {
  const registration = state.registrations.find((item) => item.id === registrationId);
  const updated = {
    ...state,
    registrations: state.registrations.map((item) => item.id === registrationId
      ? { ...item, approvalStatus, decidedBy: adminName, decidedAt: now }
      : item),
  };
  if (!registration) return updated;
  return appendNotificationLog(
    updated,
    approvalStatus === 'approved' ? 'registration_approved' : 'registration_declined',
    'sent',
    registration.email,
    `Registration ${approvalStatus} email queued.`,
    registration.eventId,
    registration.id,
    now,
  );
}

export function updateRsvp(state: AppState, registrationId: string, rsvpStatus: RsvpStatus) {
  return {
    ...state,
    registrations: state.registrations.map((registration) => registration.id === registrationId ? { ...registration, rsvpStatus } : registration),
  };
}

export function eventTotals(eventId: string, registrations: Registration[]): EventTotals {
  const eventRegistrations = registrations.filter((registration) => registration.eventId === eventId);
  const totals: EventTotals = {
    pending: 0,
    approved: 0,
    declined: 0,
    attending: 0,
    notAttending: 0,
    people: 0,
    ages: { '0-3': 0, '4-12': 0, '13-17': 0, '18+': 0 },
  };
  for (const registration of eventRegistrations) {
    if (registration.approvalStatus === 'pending') totals.pending += 1;
    if (registration.approvalStatus === 'approved') totals.approved += 1;
    if (registration.approvalStatus === 'declined') totals.declined += 1;
    if (registration.rsvpStatus === 'attending') totals.attending += 1;
    if (registration.rsvpStatus === 'not_attending') totals.notAttending += 1;
    if (registration.approvalStatus !== 'declined') {
      totals.people += 1 + registration.accompanyingCount;
      for (const range of ageRanges) totals.ages[range] += registration.ageCounts[range];
    }
  }
  return totals;
}

export function ageCountRows(registration: Registration) {
  return ageRanges.map((range) => ({
    registrationId: registration.id,
    ageRange: range,
    count: registration.ageCounts[range],
  }));
}

export function appendNotificationLog(
  state: AppState,
  kind: NotificationKind,
  status: LogStatus,
  recipientEmail: string,
  message: string,
  eventId?: string,
  registrationId?: string,
  now = new Date().toISOString(),
) {
  const log: NotificationLog = {
    id: `log-${kind}-${now.replace(/\W/g, '')}-${state.notificationLogs.length + 1}`,
    kind,
    status,
    recipientEmail,
    eventId,
    registrationId,
    message,
    createdAt: now,
  };
  return { ...state, notificationLogs: [log, ...state.notificationLogs] };
}

export function sendEventReminder(state: AppState, eventId: string, now = new Date().toISOString()) {
  const approved = state.registrations.filter((registration) => registration.eventId === eventId && registration.approvalStatus === 'approved');
  const recentReminder = state.reminderLogs.find((log) => log.eventId === eventId && Date.parse(now) - Date.parse(log.createdAt) < 60 * 60 * 1000);
  if (recentReminder) {
    const skipped: ReminderLog = {
      id: `reminder-${eventId}-${now.replace(/\W/g, '')}`,
      eventId,
      status: 'skipped',
      recipientCount: 0,
      message: 'Reminder skipped to avoid duplicate sends within one hour.',
      createdAt: now,
    };
    return { state: { ...state, reminderLogs: [skipped, ...state.reminderLogs] }, log: skipped };
  }
  const log: ReminderLog = {
    id: `reminder-${eventId}-${now.replace(/\W/g, '')}`,
    eventId,
    status: approved.length ? 'sent' : 'skipped',
    recipientCount: approved.length,
    message: approved.length ? `Reminder email queued for ${approved.length} approved registration(s).` : 'No approved registrations to remind.',
    createdAt: now,
  };
  return { state: { ...state, reminderLogs: [log, ...state.reminderLogs] }, log };
}

export function validateServerEnvironment(env: Record<string, string | undefined>) {
  const missing = ['SUPABASE_SERVICE_ROLE_KEY', 'RESEND_API_KEY'].filter((key) => !env[key]);
  return {
    ok: missing.length === 0,
    missing,
  };
}

function escapeText(value: string) {
  return value.replace(/[\\;,]/g, '\\$&').replace(/\n/g, '\\n');
}

function icsDate(value: string) {
  return new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function generateIcs(event: ChurchEvent, siteUrl = 'http://localhost:3000') {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ottawa Church//Events//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@ottawa-church`,
    `DTSTAMP:${icsDate(new Date().toISOString())}`,
    `DTSTART:${icsDate(event.startsAt)}`,
    `DTEND:${icsDate(event.endsAt)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `LOCATION:${escapeText(event.location)}`,
    `DESCRIPTION:${escapeText(`${event.description} ${siteUrl}/events/${event.id}`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

function csvCell(value: string | number) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function generateRosterCsv(event: ChurchEvent, registrations: Registration[]) {
  const rows = registrations
    .filter((registration) => registration.eventId === event.id)
    .map((registration) => [
      registration.participantName,
      registration.email,
      registration.phone,
      registration.approvalStatus,
      registration.rsvpStatus,
      registration.accompanyingCount,
      registration.ageCounts['0-3'],
      registration.ageCounts['4-12'],
      registration.ageCounts['13-17'],
      registration.ageCounts['18+'],
      registration.notes,
    ]);
  const header = ['Participant', 'Email', 'Phone', 'Approval Status', 'RSVP Status', 'Accompanying', 'Age 0-3', 'Age 4-12', 'Age 13-17', 'Age 18+', 'Notes'];
  return [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n');
}
