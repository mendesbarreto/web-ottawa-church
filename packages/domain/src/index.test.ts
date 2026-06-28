import { describe, expect, it } from 'bun:test';
import {
  ageCountRows,
  authenticateUser,
  createAccount,
  deleteEvent,
  emptyAgeCounts,
  eventTotals,
  generateIcs,
  generateRosterCsv,
  initialEvents,
  initialState,
  initialRegistrations,
  initialUsers,
  registerForEvent,
  saveEvent,
  sendEventReminder,
  statusLabel,
  updateApproval,
  updateEventStatus,
  updateProfile,
  updateRsvp,
  validateEvent,
  validateProfile,
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

describe('ics calendar structure', () => {
  it('includes title, date/time, location, description, and event URL', () => {
    const event = initialEvents[0]!;
    const ics = generateIcs(event, 'https://ottawa-church.pages.dev');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('END:VEVENT');
    expect(ics).toContain('SUMMARY:Harvest Strawberries Morning');
    expect(ics).toContain('LOCATION:Ottawa Community Farm\\, 45 Greenbank Rd\\, Ottawa');
    expect(ics).toContain('https://ottawa-church.pages.dev/events/harvest-strawberries');
    expect(ics).toContain('DTSTART:20260711T133000Z');
    expect(ics).toContain('DTEND:20260711T170000Z');
    expect(ics).toContain('UID:harvest-strawberries@ottawa-church');
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('PRODID:-//Ottawa Church//Events//EN');
  });

  it('uses CRLF line endings and escapes special characters', () => {
    const event = { ...initialEvents[0]!, title: 'A; B, C\\D' };
    const ics = generateIcs(event, 'https://x.test');
    expect(ics).toContain('\r\n');
    expect(ics).toContain('SUMMARY:A\\; B\\, C\\\\D');
  });
});

describe('csv roster export', () => {
  it('quotes cells containing commas, quotes, and newlines', () => {
    const csv = generateRosterCsv(initialEvents[0]!, [{
      ...initialRegistrations[0]!,
      eventId: 'harvest-strawberries',
      participantName: 'Smith, John',
      notes: 'line1\nline2',
    }]);
    expect(csv).toContain('"Smith, John"');
    expect(csv).toContain('"line1\nline2"');
  });

  it('escapes embedded double quotes by doubling them', () => {
    const csv = generateRosterCsv(initialEvents[0]!, [{
      ...initialRegistrations[0]!,
      eventId: 'harvest-strawberries',
      notes: 'She said "hi"',
    }]);
    expect(csv).toContain('"She said ""hi"""');
  });

  it('produces only a header row when no registrations exist', () => {
    const csv = generateRosterCsv(initialEvents[2]!, []);
    const lines = csv.split('\n');
    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain('Participant,Email,Phone');
  });

  it('emits age-range columns in the header', () => {
    const csv = generateRosterCsv(initialEvents[1]!, initialState.registrations);
    expect(csv).toContain('Age 0-3');
    expect(csv).toContain('Age 4-12');
    expect(csv).toContain('Age 13-17');
    expect(csv).toContain('Age 18+');
  });
});

describe('status labels', () => {
  it('renders text labels without relying on color', () => {
    expect(statusLabel('pending')).toBe('Pending');
    expect(statusLabel('approved')).toBe('Approved');
    expect(statusLabel('declined')).toBe('Declined');
    expect(statusLabel('attending')).toBe('Attending');
    expect(statusLabel('not_attending')).toBe('Not attending');
    expect(statusLabel('published')).toBe('Published');
  });
});

describe('registration edge cases', () => {
  it('blocks duplicate active registration for the same event and user', () => {
    const result = registerForEvent(initialState, {
      eventId: 'summer-bbq',
      user: initialUsers[1]!,
      accompanyingCount: 0,
      ageCounts: emptyAgeCounts(),
      notes: '',
    }, '2026-06-22T12:00:00Z');
    expect(result.errors).toContain('You already have an active registration for this event.');
  });

  it('blocks registration when the event is closed', () => {
    const closed = {
      ...initialState,
      events: initialState.events.map((event) =>
        event.id === 'summer-bbq' ? { ...event, registrationOpen: false } : event,
      ),
    };
    const result = registerForEvent(closed, {
      eventId: 'summer-bbq',
      user: initialUsers[1]!,
      accompanyingCount: 0,
      ageCounts: emptyAgeCounts(),
      notes: '',
    }, '2026-06-22T12:00:00Z');
    expect(result.errors.some((error) => error.includes('Registration is closed'))).toBe(true);
  });

  it('blocks registration for a draft or archived event', () => {
    const archived = updateEventStatus(initialState, 'summer-bbq', 'archived');
    const result = registerForEvent(archived, {
      eventId: 'summer-bbq',
      user: initialUsers[1]!,
      accompanyingCount: 0,
      ageCounts: emptyAgeCounts(),
      notes: '',
    }, '2026-06-22T12:00:00Z');
    expect(result.errors.some((error) => error.includes('only available for published events'))).toBe(true);
  });

  it('appends a registration_submitted notification log on success', () => {
    const result = registerForEvent(initialState, {
      eventId: 'harvest-strawberries',
      user: initialUsers[1]!,
      accompanyingCount: 1,
      ageCounts: { '0-3': 0, '4-12': 1, '13-17': 0, '18+': 1 },
      notes: '',
    }, '2026-06-22T12:00:00Z');
    expect(result.errors).toEqual([]);
    expect(result.state.notificationLogs[0]?.kind).toBe('registration_submitted');
    expect(result.state.notificationLogs[0]?.status).toBe('sent');
  });
});

describe('approval side effects', () => {
  it('logs a registration declined notification and records the deciding admin', () => {
    const registered = registerForEvent(initialState, {
      eventId: 'harvest-strawberries',
      user: initialUsers[1]!,
      accompanyingCount: 1,
      ageCounts: { '0-3': 0, '4-12': 1, '13-17': 0, '18+': 1 },
      notes: '',
    }, '2026-06-22T12:00:00Z').state;
    const registration = registered.registrations.find((item) => item.eventId === 'harvest-strawberries')!;
    const declined = updateApproval(registered, registration.id, 'declined', 'Ana Admin', '2026-06-22T13:00:00Z');
    const updated = declined.registrations.find((item) => item.id === registration.id)!;
    expect(updated.approvalStatus).toBe('declined');
    expect(updated.decidedBy).toBe('Ana Admin');
    expect(updated.decidedAt ?? '').toBe('2026-06-22T13:00:00Z');
    expect(declined.notificationLogs[0]?.kind).toBe('registration_declined');
  });
});

describe('event validation', () => {
  it('reports each missing required field and out-of-order dates', () => {
    const errors = validateEvent({
      title: '  ',
      status: 'draft',
      startsAt: '2026-10-10T10:00:00-04:00',
      endsAt: '2026-10-10T08:00:00-04:00',
      location: '',
      capacity: 0,
      mapsUrl: '',
      summary: '',
      description: '',
      cost: '',
      ageGroup: '',
      requiredItems: '',
      waiver: '',
      transportation: '',
      volunteerNeeds: '',
      registrationOpen: true,
    });
    expect(errors).toContain('Event title is required.');
    expect(errors).toContain('Location is required.');
    expect(errors).toContain('Capacity must be at least 1.');
    expect(errors).toContain('End date must be after start date.');
  });
});

describe('profile validation', () => {
  it('blocks missing name, invalid email, and missing phone', () => {
    const errors = validateProfile({ name: '', email: 'not-an-email', phone: '', notes: '' });
    expect(errors).toContain('Name is required.');
    expect(errors).toContain('Valid email is required.');
    expect(errors).toContain('Phone is required.');
  });

  it('blocks email collision with another account on update', () => {
    const result = updateProfile(initialState, 'joao', {
      name: 'João Silva',
      email: 'admin@ottawachurch.test',
      phone: '613-555-0111',
      notes: '',
    });
    expect(result.errors).toContain('Another account already uses this email.');
  });
});

describe('account creation guards', () => {
  it('blocks duplicate email and short passwords', () => {
    const result = createAccount(initialState, {
      name: 'João Again',
      email: 'joao@example.com',
      phone: '613-555-0200',
      password: '12345',
      notes: '',
    }, '2026-06-22T12:00:00Z');
    expect(result.errors).toContain('An account already exists for this email.');
    expect(result.errors).toContain('Password must be at least 6 characters.');
  });

  it('creates accounts as non-admin participants without approval', () => {
    const result = createAccount(initialState, {
      name: 'New Visitor',
      email: 'visitor@example.com',
      phone: '613-555-0300',
      password: 'welcome123',
      notes: '',
    }, '2026-06-22T12:00:00Z');
    expect(result.user?.isAdmin).toBe(false);
    expect(result.state.activeUserId).toBe(result.user?.id ?? null);
  });
});

describe('reminder de-dupe and skip', () => {
  it('sends a reminder to approved participants on first send', () => {
    const result = sendEventReminder(initialState, 'summer-bbq', '2026-06-22T12:00:00Z');
    expect(result.log.status).toBe('sent');
    expect(result.log.recipientCount).toBe(1);
    expect(result.log.message).toContain('1 approved registration');
  });

  it('skips a duplicate reminder sent within one hour', () => {
    const first = sendEventReminder(initialState, 'summer-bbq', '2026-06-22T12:00:00Z');
    const second = sendEventReminder(first.state, 'summer-bbq', '2026-06-22T12:30:00Z');
    expect(second.log.status).toBe('skipped');
    expect(second.log.message).toContain('duplicate');
  });

  it('sends again after the one-hour window expires', () => {
    const first = sendEventReminder(initialState, 'summer-bbq', '2026-06-22T12:00:00Z');
    const second = sendEventReminder(first.state, 'summer-bbq', '2026-06-22T13:30:00Z');
    expect(second.log.status).toBe('sent');
  });

  it('skips with a clear message when no approved registrations exist', () => {
    const result = sendEventReminder(initialState, 'fall-camping', '2026-06-22T12:00:00Z');
    expect(result.log.status).toBe('skipped');
    expect(result.log.recipientCount).toBe(0);
    expect(result.log.message).toContain('No approved registrations');
  });
});

describe('planning totals completeness', () => {
  it('counts people excluding declined and sums age ranges', () => {
    const registered = registerForEvent(initialState, {
      eventId: 'harvest-strawberries',
      user: initialUsers[1]!,
      accompanyingCount: 3,
      ageCounts: { '0-3': 1, '4-12': 1, '13-17': 1, '18+': 1 },
      notes: '',
    }, '2026-06-22T12:00:00Z').state;
    const totals = eventTotals('harvest-strawberries', registered.registrations);
    expect(totals.pending).toBe(1);
    expect(totals.approved).toBe(0);
    expect(totals.people).toBe(4);
    expect(totals.ages['0-3']).toBe(1);
    expect(totals.ages['4-12']).toBe(1);
    expect(totals.ages['13-17']).toBe(1);
    expect(totals.ages['18+']).toBe(1);
  });

  it('excludes declined registrations from the people count', () => {
    const registered = registerForEvent(initialState, {
      eventId: 'harvest-strawberries',
      user: initialUsers[1]!,
      accompanyingCount: 1,
      ageCounts: { '0-3': 0, '4-12': 1, '13-17': 0, '18+': 1 },
      notes: '',
    }, '2026-06-22T12:00:00Z').state;
    const registration = registered.registrations.find((item) => item.eventId === 'harvest-strawberries')!;
    const declined = updateApproval(registered, registration.id, 'declined', 'Ana Admin', '2026-06-22T13:00:00Z');
    const totals = eventTotals('harvest-strawberries', declined.registrations);
    expect(totals.declined).toBe(1);
    expect(totals.people).toBe(0);
  });
});
