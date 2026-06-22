import { Link, useRouterState } from '@tanstack/react-router';
import {
  ageRanges,
  authenticateUser,
  createAccount,
  deleteEvent,
  emptyAgeCounts,
  eventTotals,
  formatDateTime,
  generateIcs,
  generateRosterCsv,
  initialState,
  registerForEvent,
  saveEvent,
  sendEventReminder,
  statusLabel,
  updateApproval,
  updateEventStatus,
  updateProfile,
  updateRsvp,
  validateProfile,
  validateRegistration,
  type AgeRangeKey,
  type AppState,
  type ApprovalStatus,
  type ChurchEvent,
  type EventInput,
  type EventStatus,
  type Registration,
  type RsvpStatus,
  type User,
} from '@ottawa-church/domain';
import { CalendarPlus, CircleUserRound, MapPin, MoreHorizontal, Plus, Printer, ShieldCheck, UserPlus, X } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { downloadFile } from '#/lib/download';
import { loadState, resetState, saveState } from '#/lib/storage';
import {
  createSupabaseAccount,
  createSupabaseRegistration,
  createSupabaseReminderLog,
  deleteSupabaseEvent,
  emptyProductionState,
  getCurrentSession,
  isSupabaseConfigured,
  loadProductionState,
  onAuthChange,
  saveSupabaseEvent,
  signInWithSupabase,
  signOutOfSupabase,
  updateSupabaseApproval,
  updateSupabaseEventStatus,
  updateSupabaseProfile,
  updateSupabaseRsvp,
  type ProductionSession,
} from '#/lib/supabase';

type DialogMode =
  | { type: 'none' }
  | { type: 'signin'; event?: ChurchEvent }
  | { type: 'signup'; event?: ChurchEvent }
  | { type: 'details'; event: ChurchEvent }
  | { type: 'register'; event: ChurchEvent }
  | { type: 'create-event' }
  | { type: 'edit-event'; event: ChurchEvent }
  | { type: 'review'; event: ChurchEvent }
  | { type: 'print'; event: ChurchEvent };

type RowAction = () => void | false | Promise<void>;

const publicNavItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Service Times & Location', to: '/service-times-location' },
  { label: 'Events', to: '/events' },
  { label: 'Contact', to: '/contact' },
];

export function ChurchEventsApp() {
  const productionMode = isSupabaseConfigured;
  const [state, setState] = useState<AppState>(() => productionMode ? emptyProductionState : loadState());
  const [dialog, setDialog] = useState<DialogMode>({ type: 'none' });
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(productionMode);
  const pathname = useRouterState({ select: (routerState) => routerState.location.pathname });
  const activeUser = state.users.find((user) => user.id === state.activeUserId) ?? null;
  const publishedEvents = useMemo(
    () => state.events.filter((event) => event.status === 'published').sort((first, second) => first.startsAt.localeCompare(second.startsAt)),
    [state.events],
  );

  useEffect(() => {
    if (!productionMode) saveState(state);
  }, [productionMode, state]);

  useEffect(() => {
    if (!productionMode) return undefined;
    let active = true;
    let pendingRefresh: Promise<void> | null = null;
    async function boot() {
      try {
        const session = await getCurrentSession();
        if (active) {
          pendingRefresh = refreshFromSession(session)
            .finally(() => { pendingRefresh = null; });
          await pendingRefresh;
        }
      } catch (error) {
        if (active) setNotice(errorMessage(error));
      } finally {
        if (active) setLoading(false);
      }
    }
    function refreshFromSession(session: ProductionSession | null) {
      return loadProductionState(session)
        .then((nextState) => { if (active) setState(nextState); })
        .catch((error) => { if (active) setNotice(errorMessage(error)); });
    }
    void boot();
    return onAuthChange((session) => {
      if (!active) return;
      if (pendingRefresh) return;
      setLoading(true);
      pendingRefresh = refreshFromSession(session)
        .finally(() => { pendingRefresh = null; setLoading(false); });
    });
  }, [productionMode]);

  function commit(nextState: AppState, nextNotice?: string) {
    setState(nextState);
    if (nextNotice) setNotice(nextNotice);
  }

  async function refreshProduction(nextNotice?: string) {
    const session = await getCurrentSession();
    const nextState = await loadProductionState(session);
    setState(nextState);
    if (nextNotice) setNotice(nextNotice);
  }

  async function runProduction(operation: () => Promise<void>, success: string) {
    try {
      setLoading(true);
      await operation();
      await refreshProduction(success);
    } catch (error) {
      setNotice(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    if (productionMode) {
      await runProduction(signOutOfSupabase, 'Signed out.');
      return;
    }
    commit({ ...state, activeUserId: null }, 'Signed out.');
  }

  async function handleSignIn(email: string, password: string, event?: ChurchEvent) {
    if (productionMode) {
      try {
        setLoading(true);
        const session = await signInWithSupabase(email, password);
        if (!session) {
          setNotice('Sign-in pending. Check your email to confirm your account, then try again.');
          return;
        }
        const nextState = await loadProductionState(session);
        setState(nextState);
        setNotice('Signed in.');
        setDialog(event ? { type: 'register', event } : { type: 'none' });
      } catch (error) {
        setNotice(errorMessage(error));
        throw error;
      } finally {
        setLoading(false);
      }
      return;
    }
    const result = authenticateUser(state, email, password);
    if (!result.user) throw new Error(result.error);
    commit({ ...state, activeUserId: result.user.id }, `Signed in as ${result.user.name}.`);
    setDialog(event ? { type: 'register', event } : { type: 'none' });
  }

  async function handleSignup(input: { name: string; email: string; phone: string; password: string }, event?: ChurchEvent) {
    const validationErrors = validateProfile(input);
    if (input.password.length < 6) validationErrors.push('Password must be at least 6 characters.');
    if (validationErrors.length) throw new Error(validationErrors.join('\n'));
    if (productionMode) {
      try {
        setLoading(true);
        const session = await createSupabaseAccount(input);
        if (session) {
          const nextState = await loadProductionState(session);
          setState(nextState);
          setNotice('Account created. You can now register for events.');
          setDialog(event ? { type: 'register', event } : { type: 'none' });
        } else {
          setNotice('Account created. Check your email to confirm sign in, then return to register.');
          setDialog({ type: 'none' });
        }
      } catch (error) {
        setNotice(errorMessage(error));
        throw error;
      } finally {
        setLoading(false);
      }
      return;
    }
    const result = createAccount(state, input);
    if (result.errors.length) throw new Error(result.errors.join('\n'));
    commit(result.state, 'Account created. You can now register for events.');
    setDialog(event ? { type: 'register', event } : { type: 'none' });
  }

  async function handleProfileSave(user: User, input: { name: string; email: string; phone: string; notes: string }) {
    const errors = validateProfile(input);
    if (errors.length) throw new Error(errors.join('\n'));
    if (productionMode) {
      await runProduction(() => updateSupabaseProfile(user.id, input), 'Profile updated.');
      return;
    }
    const result = updateProfile(state, user.id, input);
    if (result.errors.length) throw new Error(result.errors.join('\n'));
    commit(result.state, 'Profile updated.');
  }

  async function handleRegistration(event: ChurchEvent, activeParticipant: User, input: { accompanyingCount: number; ageCounts: Record<AgeRangeKey, number>; notes: string }) {
    const errors = validateRegistration(input);
    const duplicate = state.registrations.some((registration) => registration.eventId === event.id && registration.userId === activeParticipant.id && registration.approvalStatus !== 'declined');
    if (duplicate) errors.push('You already have an active registration for this event.');
    if (errors.length) throw new Error(errors.join('\n'));
    if (productionMode) {
      await runProduction(
        () => createSupabaseRegistration({ eventId: event.id, user: activeParticipant, ...input }),
        'Your registration is pending approval. View it in your participant dashboard.',
      );
      return;
    }
    const result = registerForEvent(state, { eventId: event.id, user: activeParticipant, ...input });
    if (result.errors.length) throw new Error(result.errors.join('\n'));
    commit(result.state, 'Your registration is pending approval. View it in your participant dashboard.');
  }

  async function handleRsvp(registration: Registration, rsvpStatus: RsvpStatus) {
    if (productionMode) {
      await runProduction(
        () => updateSupabaseRsvp(registration.id, rsvpStatus),
        rsvpStatus === 'not_attending' ? 'You marked this event as not attending.' : 'RSVP saved as attending.',
      );
      return;
    }
    commit(updateRsvp(state, registration.id, rsvpStatus), rsvpStatus === 'not_attending' ? 'You marked this event as not attending.' : 'RSVP saved as attending.');
  }

  async function handleEventSave(input: EventInput, mode: 'create' | 'edit') {
    if (productionMode) {
      await runProduction(() => saveSupabaseEvent(input), mode === 'create' ? 'Event created.' : 'Event updated.');
      return;
    }
    const result = saveEvent(state, input);
    if (result.errors.length) throw new Error(result.errors.join('\n'));
    commit(result.state, mode === 'create' ? 'Event created.' : 'Event updated.');
  }

  async function handleEventStatus(event: ChurchEvent, status: EventStatus) {
    if (productionMode) {
      await runProduction(() => updateSupabaseEventStatus(event.id, status), status === 'archived' ? 'Event archived.' : 'Event published.');
      return;
    }
    commit(updateEventStatus(state, event.id, status), status === 'archived' ? 'Event archived.' : 'Event published.');
  }

  async function handleDeleteEvent(event: ChurchEvent) {
    if (!window.confirm(`Delete ${event.title}? This also removes its registrations.`)) return;
    if (productionMode) {
      await runProduction(() => deleteSupabaseEvent(event.id), 'Event deleted.');
      return;
    }
    commit(deleteEvent(state, event.id), 'Event deleted.');
  }

  async function handleReminder(event: ChurchEvent) {
    if (!window.confirm(`Send reminder to approved participants for ${event.title}?`)) return;
    const approvedCount = state.registrations.filter((registration) => registration.eventId === event.id && registration.approvalStatus === 'approved').length;
    if (productionMode) {
      await runProduction(() => createSupabaseReminderLog(event.id, approvedCount), approvedCount ? `Reminder queued for ${approvedCount} approved registration(s).` : 'No approved registrations to remind.');
      return;
    }
    const result = sendEventReminder(state, event.id);
    commit(result.state, result.log.message);
  }

  async function handleApproval(registration: Registration, approvalStatus: 'approved' | 'declined') {
    if (!activeUser?.isAdmin) return;
    if (approvalStatus === 'declined' && !window.confirm(`Decline ${registration.participantName}?`)) return;
    if (productionMode) {
      await runProduction(() => updateSupabaseApproval(registration.id, approvalStatus, activeUser.id), `${statusLabel(approvalStatus)} ${registration.participantName}.`);
      return;
    }
    commit(updateApproval(state, registration.id, approvalStatus, activeUser.name), `${statusLabel(approvalStatus)} ${registration.participantName}.`);
  }

  function handleCalendar(event: ChurchEvent) {
    downloadFile(`${event.id}.ics`, generateIcs(event, window.location.origin), 'text/calendar;charset=utf-8');
    setNotice('Calendar file downloaded.');
  }

  function handleCsv(event: ChurchEvent) {
    if (!activeUser?.isAdmin) {
      setNotice('You do not have access to roster exports.');
      return;
    }
    downloadFile(`${event.id}-roster.csv`, generateRosterCsv(event, state.registrations), 'text/csv;charset=utf-8');
    setNotice('CSV roster exported.');
  }

  function visiblePage() {
    if (pathname === '/about') return <AboutPage />;
    if (pathname === '/service-times-location') return <ServicePage />;
    if (pathname === '/contact') return <ContactPage />;
    if (loading) return <GateCard title="Loading" description="Loading church events and account state." />;
    if (pathname === '/portal') return <PortalPage state={state} activeUser={activeUser} onRsvp={handleRsvp} onInfo={setNotice} />;
    if (pathname === '/profile') return <ProfilePage activeUser={activeUser} onSave={handleProfileSave} />;
    if (pathname === '/admin') {
      return <AdminPage
        state={state}
        activeUser={activeUser}
        setDialog={setDialog}
        onCsv={handleCsv}
        onEventStatus={handleEventStatus}
        onDeleteEvent={handleDeleteEvent}
        onReminder={handleReminder}
      />;
    }
    return <EventsHome publishedEvents={publishedEvents} activeUser={activeUser} state={state} setDialog={setDialog} onCalendar={handleCalendar} />;
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link to="/" className="brand" aria-label="Ottawa Church home">
          <span className="brand-mark">OC</span>
          <span>
            <strong>Ottawa Church</strong>
            <small>Events & community</small>
          </span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          {publicNavItems.map((item) => <Link key={item.to} to={item.to} activeProps={{ className: 'active' }}>{item.label}</Link>)}
          {activeUser ? <Link to="/portal">Dashboard</Link> : null}
          {activeUser ? <Link to="/profile">Profile</Link> : null}
          {activeUser?.isAdmin ? <Link to="/admin">Admin</Link> : null}
        </nav>
        <div className="auth-actions">
          {activeUser ? (
            <>
              <span className="user-chip"><CircleUserRound size={16} /> {activeUser.name}</span>
              <button className="button secondary" onClick={() => void signOut()}>Sign out</button>
            </>
          ) : (
            <>
              <button className="button secondary" onClick={() => setDialog({ type: 'signin' })}>Sign in</button>
              {!productionMode ? <button className="button secondary" onClick={() => commit({ ...state, activeUserId: 'admin-ana' }, 'Signed in as Ana Admin.')}>Admin demo</button> : null}
              <button className="button primary" onClick={() => setDialog({ type: 'signup' })}><UserPlus size={16} /> Sign up</button>
            </>
          )}
        </div>
      </header>

      {notice ? <div className="notice" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss notice">×</button></div> : null}

      <main>{visiblePage()}</main>

      <footer className="site-footer">
        <span>Ottawa Church · Sunday service 10:00 AM</span>
        <span>{productionMode ? 'Production mode: Supabase-backed data.' : 'Local preview mode.'}</span>
        {!productionMode ? <button className="link-button" onClick={() => { resetState(); setState(initialState); setNotice('Preview data reset.'); }}>Reset preview data</button> : null}
      </footer>

      <DialogLayer
        dialog={dialog}
        setDialog={setDialog}
        state={state}
        activeUser={activeUser}
        productionMode={productionMode}
        onSignIn={handleSignIn}
        onSignup={handleSignup}
        onRegister={handleRegistration}
        onEventSave={handleEventSave}
        onApproval={handleApproval}
        onCalendar={handleCalendar}
      />
    </div>
  );
}

function EventsHome({ publishedEvents, activeUser, state, setDialog, onCalendar }: {
  publishedEvents: ChurchEvent[];
  activeUser: User | null;
  state: AppState;
  setDialog: (dialog: DialogMode) => void;
  onCalendar: (event: ChurchEvent) => void;
}) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Upcoming community events</span>
          <h1>Register for church events with clarity and care.</h1>
          <p>Find BBQs, harvest days, camping weekends, and community gatherings. Register your group, include age-range counts, and keep your status up to date.</p>
        </div>
        <div className="hero-card">
          <strong>{publishedEvents.length}</strong>
          <span>published events</span>
          <small>Admin approval keeps planning accurate.</small>
        </div>
      </section>
      <section className="content-section" id="events">
        <SectionHeader title="Upcoming events" description="Register from each event row. Details, approval state, and calendar export stay with the event itself." />
        <EventTable events={publishedEvents} registrations={state.registrations} activeUser={activeUser} setDialog={setDialog} onCalendar={onCalendar} />
      </section>
    </>
  );
}

function EventTable({ events, registrations, activeUser, setDialog, onCalendar }: {
  events: ChurchEvent[];
  registrations: Registration[];
  activeUser: User | null;
  setDialog: (dialog: DialogMode) => void;
  onCalendar: (event: ChurchEvent) => void;
}) {
  if (!events.length) return <div className="empty-state">No upcoming events are published right now.</div>;
  return (
    <div className="table-card">
      <table>
        <thead>
          <tr><th>Event</th><th>Date</th><th>Location</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {events.map((event) => {
            const registration = activeUser ? registrations.find((item) => item.eventId === event.id && item.userId === activeUser.id) : undefined;
            const canRegister = event.registrationOpen && !registration;
            return (
              <tr key={event.id}>
                <td data-label="Event"><strong>{event.title}</strong><small>{event.summary}</small></td>
                <td data-label="Date">{formatDateTime(event.startsAt)}</td>
                <td data-label="Location"><a href={event.mapsUrl} target="_blank" rel="noreferrer"><MapPin size={14} /> {event.location}</a></td>
                <td data-label="Status"><StatusBadge status={registration?.approvalStatus ?? (event.registrationOpen ? 'not_registered' : 'archived')} /></td>
                <td data-label="Actions"><RowMenu items={[
                  { label: 'Details', action: () => setDialog({ type: 'details', event }) },
                  { label: registration ? 'View status' : 'Register', action: () => activeUser ? (canRegister ? setDialog({ type: 'register', event }) : setDialog({ type: 'details', event })) : setDialog({ type: 'signin', event }) },
                  { label: 'Add to calendar', action: () => onCalendar(event) },
                ]} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PortalPage({ state, activeUser, onRsvp, onInfo }: { state: AppState; activeUser: User | null; onRsvp: (registration: Registration, rsvpStatus: RsvpStatus) => Promise<void>; onInfo: (message: string) => void }) {
  if (!activeUser) return <GateCard title="Sign in required" description="Use Sign in or Sign up to see your registrations." />;
  const mine = state.registrations
    .filter((registration) => registration.userId === activeUser.id)
    .sort((first, second) => {
      const firstEvent = state.events.find((event) => event.id === first.eventId);
      const secondEvent = state.events.find((event) => event.id === second.eventId);
      return `${first.approvalStatus}-${firstEvent?.startsAt}`.localeCompare(`${second.approvalStatus}-${secondEvent?.startsAt}`);
    });
  return (
    <section className="content-section">
      <SectionHeader title="Participant dashboard" description="Track approval status and update whether you will attend after approval." />
      {!mine.length ? <div className="empty-state">You do not have registrations yet.</div> : (
        <div className="table-card">
          <table>
            <thead><tr><th>Event</th><th>Location</th><th>Approval</th><th>RSVP</th><th>Group</th><th>Actions</th></tr></thead>
            <tbody>
              {mine.map((registration) => {
                const event = state.events.find((item) => item.id === registration.eventId);
                if (!event) return null;
                const actions: Array<{ label: string; action: RowAction }> = registration.approvalStatus === 'approved'
                  ? [
                    { label: 'Mark attending', action: () => onRsvp(registration, 'attending') },
                    { label: 'Mark not attending', action: () => {
                      if (!window.confirm('Mark this approved registration as not attending?')) return false;
                      return onRsvp(registration, 'not_attending');
                    } },
                  ]
                  : [{ label: 'RSVP opens after approval', action: () => onInfo('RSVP opens after an admin approves your registration.') }];
                return <tr key={registration.id}>
                  <td data-label="Event"><strong>{event.title}</strong><small>{formatDateTime(event.startsAt)}</small></td>
                  <td data-label="Location">{event.location}</td>
                  <td data-label="Approval"><StatusBadge status={registration.approvalStatus} /></td>
                  <td data-label="RSVP"><StatusBadge status={registration.rsvpStatus} /></td>
                  <td data-label="Group">{1 + registration.accompanyingCount} people</td>
                  <td data-label="Actions"><RowMenu items={actions} /></td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function ProfilePage({ activeUser, onSave }: { activeUser: User | null; onSave: (user: User, input: { name: string; email: string; phone: string; notes: string }) => Promise<void> }) {
  if (!activeUser) return <GateCard title="Sign in required" description="Sign in to manage your participant profile." />;
  return (
    <section className="content-section narrow">
      <SectionHeader title="Profile" description="Keep contact information accurate for event coordination." />
      <ProfileForm activeUser={activeUser} onSave={onSave} />
    </section>
  );
}

function AdminPage({ state, activeUser, setDialog, onCsv, onEventStatus, onDeleteEvent, onReminder }: {
  state: AppState;
  activeUser: User | null;
  setDialog: (dialog: DialogMode) => void;
  onCsv: (event: ChurchEvent) => void;
  onEventStatus: (event: ChurchEvent, status: EventStatus) => Promise<void>;
  onDeleteEvent: (event: ChurchEvent) => Promise<void>;
  onReminder: (event: ChurchEvent) => Promise<void>;
}) {
  const [search, setSearch] = useState('');
  const [eventStatus, setEventStatus] = useState<EventStatus | 'all'>('all');
  if (!activeUser?.isAdmin) return <GateCard title="Admin access required" description="You do not have access to this page." />;
  const filteredEvents = state.events.filter((event) => {
    const matchesStatus = eventStatus === 'all' || event.status === eventStatus;
    const matchesSearch = `${event.title} ${event.location}`.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  const pendingCount = state.registrations.filter((registration) => registration.approvalStatus === 'pending').length;
  return (
    <section className="content-section">
      <div className="section-heading with-action">
        <div><h2>Admin events</h2><p>Manage events, approvals, planning totals, reminders, and rosters.</p></div>
        <button className="button primary" onClick={() => setDialog({ type: 'create-event' })}><Plus size={16} /> Create event</button>
      </div>
      <div className="stats-grid">
        <Metric label="Pending approvals" value={pendingCount} />
        <Metric label="Approved registrations" value={state.registrations.filter((registration) => registration.approvalStatus === 'approved').length} />
        <Metric label="Published events" value={state.events.filter((event) => event.status === 'published').length} />
      </div>
      <div className="filters" aria-label="Admin event filters">
        <label>Search<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search event or location" /></label>
        <label>Event status<select value={eventStatus} onChange={(event) => setEventStatus(event.target.value as EventStatus | 'all')}>
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select></label>
      </div>
      <div className="table-card">
        <table>
          <thead><tr><th>Event</th><th>Status</th><th>Planning totals</th><th>Age signal</th><th>Actions</th></tr></thead>
          <tbody>{filteredEvents.map((event) => {
            const totals = eventTotals(event.id, state.registrations);
            return <tr key={event.id}>
              <td data-label="Event"><strong>{event.title}</strong><small>{formatDateTime(event.startsAt)} · {event.location}</small></td>
              <td data-label="Status"><StatusBadge status={event.status} /></td>
              <td data-label="Planning totals">{totals.pending} pending · {totals.approved} approved · {totals.declined} declined · {totals.attending} attending · {totals.people} people</td>
              <td data-label="Age signal">{ageRanges.map((range) => `${range}: ${totals.ages[range]}`).join(' · ')}</td>
              <td data-label="Actions"><RowMenu items={[
                { label: 'Review registrations', action: () => setDialog({ type: 'review', event }) },
                { label: 'Edit event', action: () => setDialog({ type: 'edit-event', event }) },
                { label: event.status === 'published' ? 'Archive event' : 'Publish event', action: () => onEventStatus(event, event.status === 'published' ? 'archived' : 'published') },
                { label: 'Delete event', action: () => onDeleteEvent(event) },
                { label: 'Export roster CSV', action: () => onCsv(event) },
                { label: 'Printable roster', action: () => setDialog({ type: 'print', event }) },
                { label: 'Send reminder', action: () => onReminder(event) },
              ]} /></td>
            </tr>;
          })}</tbody>
        </table>
      </div>
      <OperationalLogs state={state} />
    </section>
  );
}

function DialogLayer({ dialog, setDialog, state, activeUser, productionMode, onSignIn, onSignup, onRegister, onEventSave, onApproval, onCalendar }: {
  dialog: DialogMode;
  setDialog: (dialog: DialogMode) => void;
  state: AppState;
  activeUser: User | null;
  productionMode: boolean;
  onSignIn: (email: string, password: string, event?: ChurchEvent) => Promise<void>;
  onSignup: (input: { name: string; email: string; phone: string; password: string }, event?: ChurchEvent) => Promise<void>;
  onRegister: (event: ChurchEvent, activeParticipant: User, input: { accompanyingCount: number; ageCounts: Record<AgeRangeKey, number>; notes: string }) => Promise<void>;
  onEventSave: (input: EventInput, mode: 'create' | 'edit') => Promise<void>;
  onApproval: (registration: Registration, approvalStatus: 'approved' | 'declined') => Promise<void>;
  onCalendar: (event: ChurchEvent) => void;
}) {
  if (dialog.type === 'none') return null;
  const close = () => setDialog({ type: 'none' });
  return <div className="dialog-backdrop" role="presentation" onMouseDown={close}>
    <div className="dialog" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
      <button className="dialog-close" onClick={close} aria-label="Close dialog"><X size={18} /></button>
      {dialog.type === 'signin' ? <SignInForm event={dialog.event} productionMode={productionMode} onSignIn={onSignIn} /> : null}
      {dialog.type === 'signup' ? <SignupForm event={dialog.event} productionMode={productionMode} onSignup={onSignup} /> : null}
      {dialog.type === 'details' ? <EventDetails event={dialog.event} activeUser={activeUser} registrations={state.registrations} onCalendar={onCalendar} setDialog={setDialog} /> : null}
      {dialog.type === 'register' ? <RegistrationForm event={dialog.event} activeUser={activeUser} onRegister={onRegister} close={close} /> : null}
      {dialog.type === 'create-event' ? <EventForm mode="create" onSave={onEventSave} close={close} /> : null}
      {dialog.type === 'edit-event' ? <EventForm mode="edit" event={dialog.event} onSave={onEventSave} close={close} /> : null}
      {dialog.type === 'review' ? <ReviewRegistrations event={dialog.event} state={state} activeUser={activeUser} onApproval={onApproval} /> : null}
      {dialog.type === 'print' ? <PrintableRoster event={dialog.event} registrations={state.registrations} /> : null}
    </div>
  </div>;
}

function SignInForm({ event, productionMode, onSignIn }: { event?: ChurchEvent; productionMode: boolean; onSignIn: (email: string, password: string, event?: ChurchEvent) => Promise<void> }) {
  const [email, setEmail] = useState(productionMode ? '' : 'joao@example.com');
  const [password, setPassword] = useState(productionMode ? '' : 'welcome123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  async function submit(submitEvent: FormEvent) {
    submitEvent.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await onSignIn(email, password, event);
    } catch (caughtError) {
      setError(errorMessage(caughtError));
    } finally {
      setSubmitting(false);
    }
  }
  return <form className="dialog-content form-stack" onSubmit={submit}><span className="eyebrow">Sign in</span><h2>Access your account</h2>{!productionMode ? <p>Local preview account: `joao@example.com / welcome123`.</p> : null}{error ? <div className="error-summary">{error}</div> : null}<label>Email<input type="email" value={email} onChange={(changeEvent) => setEmail(changeEvent.target.value)} required /></label><label>Password<input type="password" value={password} onChange={(changeEvent) => setPassword(changeEvent.target.value)} required /></label><button className="button primary" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'}</button></form>;
}

function SignupForm({ event, productionMode, onSignup }: { event?: ChurchEvent; productionMode: boolean; onSignup: (input: { name: string; email: string; phone: string; password: string }, event?: ChurchEvent) => Promise<void> }) {
  const [name, setName] = useState(productionMode ? '' : 'Maria Santos');
  const [email, setEmail] = useState(productionMode ? '' : 'maria@example.com');
  const [phone, setPhone] = useState(productionMode ? '' : '613-555-0199');
  const [password, setPassword] = useState(productionMode ? '' : 'welcome123');
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  async function submit(submitEvent: FormEvent) {
    submitEvent.preventDefault();
    setSubmitting(true);
    setErrors([]);
    try {
      await onSignup({ name, email, phone, password }, event);
    } catch (caughtError) {
      setErrors(errorMessage(caughtError).split('\n'));
    } finally {
      setSubmitting(false);
    }
  }
  return <form className="dialog-content form-stack" onSubmit={submit}><span className="eyebrow">Website sign up</span><h2>Create your account</h2><p>This creates your website account only. Event registration happens separately after sign in.</p>{errors.length ? <ErrorList errors={errors} /> : null}<label>Name<input value={name} onChange={(changeEvent) => setName(changeEvent.target.value)} required /></label><label>Email<input type="email" value={email} onChange={(changeEvent) => setEmail(changeEvent.target.value)} required /></label><label>Phone<input value={phone} onChange={(changeEvent) => setPhone(changeEvent.target.value)} required /></label><label>Password<input type="password" value={password} onChange={(changeEvent) => setPassword(changeEvent.target.value)} minLength={6} required /></label><button className="button primary" disabled={submitting}>{submitting ? 'Creating…' : 'Create account'}</button></form>;
}

function ProfileForm({ activeUser, onSave }: { activeUser: User; onSave: (user: User, input: { name: string; email: string; phone: string; notes: string }) => Promise<void> }) {
  const [name, setName] = useState(activeUser.name);
  const [email, setEmail] = useState(activeUser.email);
  const [phone, setPhone] = useState(activeUser.phone);
  const [notes, setNotes] = useState(activeUser.notes ?? '');
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setErrors([]);
    try {
      await onSave(activeUser, { name, email, phone, notes });
    } catch (caughtError) {
      setErrors(errorMessage(caughtError).split('\n'));
    } finally {
      setSubmitting(false);
    }
  }
  return <form className="table-card form-card form-stack" onSubmit={submit}>{errors.length ? <ErrorList errors={errors} /> : null}<label>Name<input value={name} onChange={(event) => setName(event.target.value)} required /></label><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Phone<input value={phone} onChange={(event) => setPhone(event.target.value)} required /></label><label>Notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Optional coordination notes" /></label><button className="button primary" disabled={submitting}>{submitting ? 'Saving…' : 'Save profile'}</button></form>;
}

function EventDetails({ event, activeUser, registrations, onCalendar, setDialog }: { event: ChurchEvent; activeUser: User | null; registrations: Registration[]; onCalendar: (event: ChurchEvent) => void; setDialog: (dialog: DialogMode) => void }) {
  const approved = registrations.filter((registration) => registration.eventId === event.id && registration.approvalStatus === 'approved');
  return <div className="dialog-content"><span className="eyebrow">Event details</span><h2>{event.title}</h2><div className="detail-grid">
    <Detail label="Date" value={`${formatDateTime(event.startsAt)} – ${formatDateTime(event.endsAt)}`} />
    <Detail label="Location" value={<a href={event.mapsUrl} target="_blank" rel="noreferrer">{event.location}</a>} />
  </div><p>{event.description}</p><div className="detail-grid">
    <Detail label="Capacity" value={`${event.capacity} people`} />
    {event.cost ? <Detail label="Cost" value={event.cost} /> : null}
    {event.ageGroup ? <Detail label="Age group" value={event.ageGroup} /> : null}
    {event.requiredItems ? <Detail label="Required items" value={event.requiredItems} /> : null}
    {event.transportation ? <Detail label="Transportation" value={event.transportation} /> : null}
    {event.waiver ? <Detail label="Waiver / consent" value={event.waiver} /> : null}
    {event.volunteerNeeds ? <Detail label="Volunteer needs" value={event.volunteerNeeds} /> : null}
    <Detail label="Approval" value={event.registrationOpen ? 'Registration requires Admin approval.' : 'Registration is closed.'} />
    {activeUser ? <Detail label="People going" value={`${approved.length} approved registration(s)`} /> : null}
  </div><div className="button-row"><button className="button secondary" onClick={() => onCalendar(event)}><CalendarPlus size={16} /> Add to calendar</button>{event.registrationOpen ? <button className="button primary" onClick={() => setDialog(activeUser ? { type: 'register', event } : { type: 'signin', event })}>Register</button> : null}</div></div>;
}

function RegistrationForm({ event, activeUser, onRegister, close }: { event: ChurchEvent; activeUser: User | null; onRegister: (event: ChurchEvent, activeParticipant: User, input: { accompanyingCount: number; ageCounts: Record<AgeRangeKey, number>; notes: string }) => Promise<void>; close: () => void }) {
  const [accompanyingCount, setAccompanyingCount] = useState(0);
  const [ageCounts, setAgeCounts] = useState<Record<AgeRangeKey, number>>(emptyAgeCounts());
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  if (!activeUser) return <GateCard title="Sign in required" description="Create an account or sign in before registering for an event." />;
  async function submit(formEvent: FormEvent) {
    formEvent.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setErrors([]);
    try {
      await onRegister(event, activeUser!, { accompanyingCount, ageCounts, notes });
      close();
    } catch (caughtError) {
      setErrors(errorMessage(caughtError).split('\n'));
    } finally {
      setSubmitting(false);
    }
  }
  return <form className="dialog-content form-stack" onSubmit={submit}><span className="eyebrow">Event registration</span><h2>{event.title}</h2><p>{formatDateTime(event.startsAt)} · {event.location}</p><p>Include yourself in the age ranges. Example: if you are coming with 2 children, accompanying people = 2 and age ranges total = 3.</p>{errors.length ? <ErrorList errors={errors} /> : null}<label>Accompanying people<input type="number" min="0" value={accompanyingCount} onChange={(changeEvent) => setAccompanyingCount(Number(changeEvent.target.value))} /></label><fieldset><legend>Age ranges</legend>{ageRanges.map((range) => <label className="age-row" key={range}><span>{range}</span><input type="number" min="0" value={ageCounts[range]} onChange={(changeEvent) => setAgeCounts({ ...ageCounts, [range]: Number(changeEvent.target.value) })} /></label>)}</fieldset><label>Notes<textarea value={notes} onChange={(changeEvent) => setNotes(changeEvent.target.value)} placeholder="Allergies, transportation, or planning notes" /></label><button className="button primary" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit registration'}</button></form>;
}

function EventForm({ mode, event, onSave, close }: { mode: 'create' | 'edit'; event?: ChurchEvent; onSave: (input: EventInput, mode: 'create' | 'edit') => Promise<void>; close: () => void }) {
  const [form, setForm] = useState<EventInput>(() => event ?? {
    title: 'New Community Event',
    status: 'draft',
    startsAt: '2026-10-03T10:00:00-04:00',
    endsAt: '2026-10-03T13:00:00-04:00',
    summary: 'Short summary for the event row.',
    description: 'Describe who this event is for, what will happen, and what participants should expect.',
    location: 'Ottawa Church',
    mapsUrl: 'https://maps.google.com/?q=Ottawa+Church',
    capacity: 50,
    cost: 'Free',
    ageGroup: 'All ages',
    requiredItems: '',
    waiver: '',
    transportation: '',
    volunteerNeeds: '',
    registrationOpen: true,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  function update<K extends keyof EventInput>(key: K, value: EventInput[K]) {
    setForm({ ...form, [key]: value });
  }
  async function submit(submitEvent: FormEvent) {
    submitEvent.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setErrors([]);
    try {
      await onSave(form, mode);
      close();
    } catch (caughtError) {
      setErrors(errorMessage(caughtError).split('\n'));
    } finally {
      setSubmitting(false);
    }
  }
  return <form className="dialog-content form-stack" onSubmit={submit}><span className="eyebrow">{mode === 'create' ? 'Create event' : 'Edit event'}</span><h2>{mode === 'create' ? 'Create event' : `Edit ${event?.title}`}</h2>{errors.length ? <ErrorList errors={errors} /> : null}<div className="form-grid"><label>Title<input value={form.title} onChange={(event) => update('title', event.target.value)} required /></label><label>Publication status<select value={form.status} onChange={(event) => update('status', event.target.value as EventStatus)} required><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label><label>Starts at<input value={form.startsAt} onChange={(event) => update('startsAt', event.target.value)} required /></label><label>Ends at<input value={form.endsAt} onChange={(event) => update('endsAt', event.target.value)} required /></label><label>Location<input value={form.location} onChange={(event) => update('location', event.target.value)} required /></label><label>Maps link<input value={form.mapsUrl} onChange={(event) => update('mapsUrl', event.target.value)} /></label><label>Capacity<input type="number" min="1" value={form.capacity} onChange={(event) => update('capacity', Number(event.target.value))} required /></label><label>Cost<input value={form.cost} onChange={(event) => update('cost', event.target.value)} /></label><label>Age group<input value={form.ageGroup} onChange={(event) => update('ageGroup', event.target.value)} /></label><label>Registration<select value={form.registrationOpen ? 'open' : 'closed'} onChange={(event) => update('registrationOpen', event.target.value === 'open')}><option value="open">Open</option><option value="closed">Closed</option></select></label></div><label>Summary<textarea value={form.summary} onChange={(event) => update('summary', event.target.value)} /></label><label>Description<textarea value={form.description} onChange={(event) => update('description', event.target.value)} /></label><label>Required items<textarea value={form.requiredItems} onChange={(event) => update('requiredItems', event.target.value)} /></label><label>Transportation note<textarea value={form.transportation} onChange={(event) => update('transportation', event.target.value)} /></label><label>Waiver / consent note<textarea value={form.waiver} onChange={(event) => update('waiver', event.target.value)} /></label><label>Volunteer needs<textarea value={form.volunteerNeeds} onChange={(event) => update('volunteerNeeds', event.target.value)} /></label><button className="button primary" disabled={submitting}>{submitting ? 'Saving…' : 'Save event'}</button></form>;
}

function ReviewRegistrations({ event, state, activeUser, onApproval }: { event: ChurchEvent; state: AppState; activeUser: User | null; onApproval: (registration: Registration, approvalStatus: 'approved' | 'declined') => Promise<void> }) {
  const [approvalFilter, setApprovalFilter] = useState<ApprovalStatus | 'all'>('pending');
  const [rsvpFilter, setRsvpFilter] = useState<RsvpStatus | 'all'>('all');
  const [pending, setPending] = useState(false);
  if (!activeUser?.isAdmin) return <GateCard title="Admin access required" description="You do not have access to this page." />;
  const rows = state.registrations.filter((registration) => {
    const matchesEvent = registration.eventId === event.id;
    const matchesApproval = approvalFilter === 'all' || registration.approvalStatus === approvalFilter;
    const matchesRsvp = rsvpFilter === 'all' || registration.rsvpStatus === rsvpFilter;
    return matchesEvent && matchesApproval && matchesRsvp;
  });
  async function runApproval(registration: Registration, nextStatus: 'approved' | 'declined') {
    if (pending) return;
    setPending(true);
    try {
      await onApproval(registration, nextStatus);
    } finally {
      setPending(false);
    }
  }
  return <div className="dialog-content"><span className="eyebrow">Approval queue</span><h2>{event.title}</h2><p>{formatDateTime(event.startsAt)} · {event.location}</p><div className="filters"><label>Approval status<select value={approvalFilter} onChange={(event) => setApprovalFilter(event.target.value as ApprovalStatus | 'all')} disabled={pending}><option value="all">All approval statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="declined">Declined</option></select></label><label>RSVP status<select value={rsvpFilter} onChange={(event) => setRsvpFilter(event.target.value as RsvpStatus | 'all')} disabled={pending}><option value="all">All RSVP statuses</option><option value="unknown">Unknown</option><option value="attending">Attending</option><option value="not_attending">Not attending</option></select></label></div>{!rows.length ? <div className="empty-state">No pending registrations.</div> : <div className="table-card"><table><thead><tr><th>Participant</th><th>Counts</th><th>Status</th><th>Notes</th><th>Actions</th></tr></thead><tbody>{rows.map((registration) => <tr key={registration.id}><td data-label="Participant"><strong>{registration.participantName}</strong><small>{registration.email} · {registration.phone}</small></td><td data-label="Counts">{1 + registration.accompanyingCount} people<small>{ageRanges.map((range) => `${range}: ${registration.ageCounts[range]}`).join(' · ')}</small></td><td data-label="Status"><StatusBadge status={registration.approvalStatus} /> <StatusBadge status={registration.rsvpStatus} /></td><td data-label="Notes">{registration.notes || 'No notes.'}</td><td data-label="Actions"><RowMenu items={[
    { label: pending ? 'Working…' : 'Approve', action: () => runApproval(registration, 'approved') },
    { label: pending ? 'Working…' : 'Decline', action: () => runApproval(registration, 'declined') },
  ]} /></td></tr>)}</tbody></table></div>}</div>;
}

function PrintableRoster({ event, registrations }: { event: ChurchEvent; registrations: Registration[] }) {
  const rows = registrations.filter((registration) => registration.eventId === event.id);
  return <div className="dialog-content print-roster"><h2>{event.title} roster</h2><p>{formatDateTime(event.startsAt)} · {event.location}</p><table><thead><tr><th>Participant</th><th>Contact</th><th>Approval</th><th>RSVP</th><th>Group</th><th>Age ranges</th></tr></thead><tbody>{rows.map((registration) => <tr key={registration.id}><td>{registration.participantName}</td><td>{registration.email}<br />{registration.phone}</td><td>{statusLabel(registration.approvalStatus)}</td><td>{statusLabel(registration.rsvpStatus)}</td><td>{1 + registration.accompanyingCount}</td><td>{ageRanges.map((range) => `${range}: ${registration.ageCounts[range]}`).join(' · ')}</td></tr>)}</tbody></table><button className="button secondary no-print" onClick={() => window.print()}><Printer size={16} /> Print</button></div>;
}

function OperationalLogs({ state }: { state: AppState }) {
  const logs = [...state.notificationLogs, ...state.reminderLogs].slice(0, 6);
  return <section className="logs-panel"><h3>Operational logs</h3><p>Email/reminder attempts are logged without exposing provider secrets.</p>{!logs.length ? <div className="empty-state compact">No notification attempts yet.</div> : <ul>{logs.map((log) => <li key={log.id}><StatusBadge status={log.status} /><span>{log.message}</span><small>{formatDateTime(log.createdAt)}</small></li>)}</ul>}</section>;
}

function AboutPage() { return <InfoPage title="About Ottawa Church" text="We are a local church community focused on worship, Scripture, hospitality, and practical service in Ottawa." />; }
function ServicePage() { return <InfoPage title="Service Times & Location" text="Sunday service is at 10:00 AM. Join us at 120 Riverside Dr, Ottawa. Parking and transit access are available." />; }
function ContactPage() { return <InfoPage title="Contact" text="Questions about events? Email events@ottawachurch.test or speak with the welcome team on Sunday." />; }
function InfoPage({ title, text }: { title: string; text: string }) { return <section className="content-section narrow"><span className="eyebrow">Church information</span><h1>{title}</h1><p>{text}</p></section>; }
function SectionHeader({ title, description }: { title: string; description: string }) { return <div className="section-heading"><h2>{title}</h2><p>{description}</p></div>; }
function Metric({ label, value }: { label: string; value: number }) { return <div className="metric"><strong>{value}</strong><span>{label}</span></div>; }
function GateCard({ title, description }: { title: string; description: string }) { return <section className="content-section narrow"><div className="empty-state"><ShieldCheck size={28} /><h2>{title}</h2><p>{description}</p></div></section>; }
function Detail({ label, value }: { label: string; value: ReactNode }) { return <div className="detail"><span>{label}</span><strong>{value}</strong></div>; }
function ErrorList({ errors }: { errors: string[] }) { return <div className="error-summary">{errors.map((error) => <div key={error}>{error}</div>)}</div>; }
function StatusBadge({ status }: { status: string }) { return <span className={`badge ${status}`}>{statusLabel(status as ApprovalStatus | RsvpStatus | EventStatus)}</span>; }

function RowMenu({ items }: { items: Array<{ label: string; action: RowAction }> }) {
  const [open, setOpen] = useState(false);
  async function runAction(item: { label: string; action: RowAction }) {
    try {
      const result = await item.action();
      if (result === false) return;
      setOpen(false);
    } catch (error) {
      setOpen(false);
      throw error;
    }
  }
  return <div className="row-menu"><button className="icon-button" onClick={() => setOpen(!open)} aria-label="Open row actions"><MoreHorizontal size={18} /></button>{open ? <div className="menu-panel">{items.map((item) => <button key={item.label} disabled={item.action instanceof Promise} onClick={() => { void runAction(item).catch(() => { /* error already surfaced by caller via setNotice */ }); }}>{item.label}</button>)}</div> : null}</div>;
}

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === 'string' && message.trim()) return message;
  }
  if (typeof error === 'string' && error.trim()) return error;
  return 'Something went wrong.';
}
