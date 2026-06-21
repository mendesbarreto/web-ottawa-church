import { describe, expect, it } from 'bun:test';
import {
  eventTotals,
  ageCountRows,
  authenticateUser,
  createAccount,
  deleteEvent,
  generateIcs,
  generateRosterCsv,
  initialEvents,
  initialState,
  initialUsers,
  registerForEvent,
  saveEvent,
  sendEventReminder,
  updateApproval,
  updateEventStatus,
  updateProfile,
  updateRsvp,
  validateServerEnvironment,
  validateRegistration,
} from './index';

describe('registration validation', () => {
  it('rejects age totals that do not include participant plus accompanying people', () => {
    const errors = validateRegistration({
      accompanyingCount: 2,
      ageCounts: { '0-3': 0, '4-12': 1, '13-17': 0, '18+': 1 },
    });

    expect(errors.join(' ')).toContain('Age ranges must total 3');
  });

  it('creates pending registration when counts are valid', () => {
    const user = initialUsers[1]!;
    const result = registerForEvent(initialState, {
      eventId: 'harvest-strawberries',
      user,
      accompanyingCount: 1,
      ageCounts: { '0-3': 0, '4-12': 1, '13-17': 0, '18+': 1 },
      notes: 'First time visitor.',
    }, '2026-06-21T12:00:00Z');

    expect(result.errors).toEqual([]);
    expect(result.state.registrations.at(-1)?.approvalStatus).toBe('pending');
  });
});

describe('account and profile', () => {
  it('creates, authenticates, and updates a participant account', () => {
    const created = createAccount(initialState, {
      name: 'Maria Santos',
      email: 'maria@example.com',
      phone: '613-555-0199',
      password: 'welcome123',
      notes: 'Needs ride updates.',
    }, '2026-06-21T12:00:00Z');

    expect(created.errors).toEqual([]);
    expect(authenticateUser(created.state, 'maria@example.com', 'welcome123').user?.name).toBe('Maria Santos');

    const updated = updateProfile(created.state, created.user!.id, {
      name: 'Maria S.',
      email: 'maria@example.com',
      phone: '613-555-0200',
      notes: 'Updated note.',
    });

    expect(updated.errors).toEqual([]);
    expect(updated.state.users.find((user) => user.id === created.user!.id)?.phone).toBe('613-555-0200');
  });
});

describe('approval and totals', () => {
  it('updates approval and RSVP totals', () => {
    const user = initialUsers[1]!;
    const registered = registerForEvent(initialState, {
      eventId: 'harvest-strawberries',
      user,
      accompanyingCount: 1,
      ageCounts: { '0-3': 0, '4-12': 1, '13-17': 0, '18+': 1 },
      notes: '',
    }, '2026-06-21T12:00:00Z').state;
    const registration = registered.registrations.find((item) => item.eventId === 'harvest-strawberries')!;
    const approved = updateApproval(registered, registration.id, 'approved', 'Ana Admin', '2026-06-21T13:00:00Z');
    const attending = updateRsvp(approved, registration.id, 'attending');

    expect(eventTotals('harvest-strawberries', attending.registrations)).toMatchObject({
      approved: 1,
      attending: 1,
      people: 2,
    });
    expect(approved.notificationLogs[0]?.kind).toBe('registration_approved');
    expect(ageCountRows(registration)).toContainEqual({ registrationId: registration.id, ageRange: '18+', count: 1 });
  });
});

describe('event management and reminders', () => {
  it('creates, publishes, archives, deletes, and logs reminders', () => {
    const saved = saveEvent(initialState, {
      title: 'Prayer Breakfast',
      status: 'draft',
      startsAt: '2026-10-10T08:00:00-04:00',
      endsAt: '2026-10-10T10:00:00-04:00',
      summary: 'Breakfast and prayer.',
      description: 'A simple morning gathering.',
      location: 'Ottawa Church',
      mapsUrl: '',
      capacity: 40,
      cost: 'Free',
      ageGroup: 'All ages',
      requiredItems: '',
      waiver: '',
      transportation: '',
      volunteerNeeds: '',
      registrationOpen: true,
    }, '2026-06-21T12:00:00Z');

    expect(saved.errors).toEqual([]);
    const published = updateEventStatus(saved.state, saved.event!.id, 'published');
    expect(published.events.find((event) => event.id === saved.event!.id)?.status).toBe('published');
    const archived = updateEventStatus(published, saved.event!.id, 'archived');
    expect(archived.events.find((event) => event.id === saved.event!.id)?.status).toBe('archived');
    const reminder = sendEventReminder(initialState, 'summer-bbq', '2026-06-21T12:00:00Z');
    expect(reminder.log.status).toBe('sent');
    const deleted = deleteEvent(archived, saved.event!.id);
    expect(deleted.events.some((event) => event.id === saved.event!.id)).toBe(false);
  });
});

describe('exports', () => {
  it('generates calendar and roster outputs', () => {
    const event = initialEvents[0]!;
    const ics = generateIcs(event, 'https://ottawa-church.pages.dev');
    const csv = generateRosterCsv(initialEvents[1]!, initialState.registrations);

    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('SUMMARY:Harvest Strawberries Morning');
    expect(csv).toContain('Participant,Email,Phone');
    expect(csv).toContain('João Silva');
    expect(validateServerEnvironment({ SUPABASE_SERVICE_ROLE_KEY: 'server', RESEND_API_KEY: 'resend' }).ok).toBe(true);
    expect(validateServerEnvironment({}).missing).toEqual(['SUPABASE_SERVICE_ROLE_KEY', 'RESEND_API_KEY']);
  });
});
