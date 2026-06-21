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

const publicNavItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Service Times & Location', to: '/service-times-location' },
  { label: 'Events', to: '/events' },
  { label: 'Contact', to: '/contact' },
];

export function ChurchEventsApp() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [dialog, setDialog] = useState<DialogMode>({ type: 'none' });
  const [notice, setNotice] = useState('');
  const pathname = useRouterState({ select: (routerState) => routerState.location.pathname });
  const activeUser = state.users.find((user) => user.id === state.activeUserId) ?? null;
  const publishedEvents = useMemo(
    () => state.events.filter((event) => event.status === 'published').sort((first, second) => first.startsAt.localeCompare(second.startsAt)),
    [state.events],
  );

  useEffect(() => saveState(state), [state]);

  function commit(nextState: AppState, nextNotice?: string) {
    setState(nextState);
    if (nextNotice) setNotice(nextNotice);
  }

  function signOut() {
    commit({ ...state, activeUserId: null }, 'Signed out.');
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
    if (pathname === '/portal') return <PortalPage state={state} activeUser={activeUser} setState={commit} />;
    if (pathname === '/profile') return <ProfilePage state={state} activeUser={activeUser} setState={commit} />;
    if (pathname === '/admin') return <AdminPage state={state} activeUser={activeUser} setState={commit} setDialog={setDialog} onCsv={handleCsv} />;
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
              <button className="button secondary" onClick={signOut}>Sign out</button>
            </>
          ) : (
            <>
              <button className="button secondary" onClick={() => setDialog({ type: 'signin' })}>Sign in</button>
              <button className="button secondary" onClick={() => commit({ ...state, activeUserId: 'admin-ana' }, 'Signed in as Ana Admin.')}>Admin demo</button>
              <button className="button primary" onClick={() => setDialog({ type: 'signup' })}><UserPlus size={16} /> Sign up</button>
            </>
          )}
        </div>
      </header>

      {notice ? <div className="notice" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss notice">×</button></div> : null}

      <main>{visiblePage()}</main>

      <footer className="site-footer">
        <span>Ottawa Church · Sunday service 10:00 AM</span>
        <span>Cloudflare Pages + Supabase/Resend free-tier ready.</span>
        <button className="link-button" onClick={() => { resetState(); setState(initialState); setNotice('Demo data reset.'); }}>Reset demo data</button>
      </footer>

      <DialogLayer
        dialog={dialog}
        setDialog={setDialog}
        state={state}
        activeUser={activeUser}
        setState={commit}
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

function PortalPage({ state, activeUser, setState }: { state: AppState; activeUser: User | null; setState: (state: AppState, notice?: string) => void }) {
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
                const event = state.events.find((item) => item.id === registration.eventId)!;
                const actions = registration.approvalStatus === 'approved'
                  ? [
                    { label: 'Mark attending', action: () => setState(updateRsvp(state, registration.id, 'attending'), 'RSVP saved as attending.') },
                    { label: 'Mark not attending', action: () => window.confirm('Mark this approved registration as not attending?') && setState(updateRsvp(state, registration.id, 'not_attending'), 'You marked this event as not attending.') },
                  ]
                  : [{ label: 'RSVP available after approval', action: () => setState(state, 'RSVP opens after Admin approval.') }];
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

function ProfilePage({ state, activeUser, setState }: { state: AppState; activeUser: User | null; setState: (state: AppState, notice?: string) => void }) {
  if (!activeUser) return <GateCard title="Sign in required" description="Sign in to manage your participant profile." />;
  return (
    <section className="content-section narrow">
      <SectionHeader title="Profile" description="Keep contact information accurate for event coordination." />
      <ProfileForm state={state} activeUser={activeUser} setState={setState} />
    </section>
  );
}

function AdminPage({ state, activeUser, setState, setDialog, onCsv }: {
  state: AppState;
  activeUser: User | null;
  setState: (state: AppState, notice?: string) => void;
  setDialog: (dialog: DialogMode) => void;
  onCsv: (event: ChurchEvent) => void;
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
                { label: event.status === 'published' ? 'Archive event' : 'Publish event', action: () => setState(updateEventStatus(state, event.id, event.status === 'published' ? 'archived' : 'published'), event.status === 'published' ? 'Event archived.' : 'Event published.') },
                { label: 'Delete event', action: () => window.confirm(`Delete ${event.title}? This also removes its registrations.`) && setState(deleteEvent(state, event.id), 'Event deleted.') },
                { label: 'Export roster CSV', action: () => onCsv(event) },
                { label: 'Printable roster', action: () => setDialog({ type: 'print', event }) },
                { label: 'Send reminder', action: () => {
                  if (!window.confirm(`Send reminder to approved participants for ${event.title}?`)) return;
                  const result = sendEventReminder(state, event.id);
                  setState(result.state, result.log.message);
                } },
              ]} /></td>
            </tr>;
          })}</tbody>
        </table>
      </div>
      <OperationalLogs state={state} />
    </section>
  );
}

function DialogLayer({ dialog, setDialog, state, activeUser, setState, onCalendar }: {
  dialog: DialogMode;
  setDialog: (dialog: DialogMode) => void;
  state: AppState;
  activeUser: User | null;
  setState: (state: AppState, notice?: string) => void;
  onCalendar: (event: ChurchEvent) => void;
}) {
  if (dialog.type === 'none') return null;
  const close = () => setDialog({ type: 'none' });
  return <div className="dialog-backdrop" role="presentation" onMouseDown={close}>
    <div className="dialog" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
      <button className="dialog-close" onClick={close} aria-label="Close dialog"><X size={18} /></button>
      {dialog.type === 'signin' ? <SignInForm state={state} event={dialog.event} setState={setState} setDialog={setDialog} /> : null}
      {dialog.type === 'signup' ? <SignupForm state={state} event={dialog.event} setState={setState} setDialog={setDialog} /> : null}
      {dialog.type === 'details' ? <EventDetails event={dialog.event} activeUser={activeUser} registrations={state.registrations} onCalendar={onCalendar} setDialog={setDialog} /> : null}
      {dialog.type === 'register' ? <RegistrationForm event={dialog.event} activeUser={activeUser} state={state} setState={setState} close={close} /> : null}
      {dialog.type === 'create-event' ? <EventForm mode="create" state={state} setState={setState} close={close} /> : null}
      {dialog.type === 'edit-event' ? <EventForm mode="edit" event={dialog.event} state={state} setState={setState} close={close} /> : null}
      {dialog.type === 'review' ? <ReviewRegistrations event={dialog.event} state={state} activeUser={activeUser} setState={setState} /> : null}
      {dialog.type === 'print' ? <PrintableRoster event={dialog.event} registrations={state.registrations} /> : null}
    </div>
  </div>;
}

function SignInForm({ state, event, setState, setDialog }: { state: AppState; event?: ChurchEvent; setState: (state: AppState, notice?: string) => void; setDialog: (dialog: DialogMode) => void }) {
  const [email, setEmail] = useState('joao@example.com');
  const [password, setPassword] = useState('welcome123');
  const [error, setError] = useState('');
  function submit(submitEvent: FormEvent) {
    submitEvent.preventDefault();
    const result = authenticateUser(state, email, password);
    if (!result.user) {
      setError(result.error);
      return;
    }
    setState({ ...state, activeUserId: result.user.id }, `Signed in as ${result.user.name}.`);
    setDialog(event ? { type: 'register', event } : { type: 'none' });
  }
  return <form className="dialog-content form-stack" onSubmit={submit}><span className="eyebrow">Sign in</span><h2>Access your account</h2><p>Demo accounts: `joao@example.com / welcome123` or use Admin demo from the header.</p>{error ? <div className="error-summary">{error}</div> : null}<label>Email<input type="email" value={email} onChange={(changeEvent) => setEmail(changeEvent.target.value)} required /></label><label>Password<input type="password" value={password} onChange={(changeEvent) => setPassword(changeEvent.target.value)} required /></label><button className="button primary">Sign in</button></form>;
}

function SignupForm({ state, event, setState, setDialog }: { state: AppState; event?: ChurchEvent; setState: (state: AppState, notice?: string) => void; setDialog: (dialog: DialogMode) => void }) {
  const [name, setName] = useState('Maria Santos');
  const [email, setEmail] = useState('maria@example.com');
  const [phone, setPhone] = useState('613-555-0199');
  const [password, setPassword] = useState('welcome123');
  const [errors, setErrors] = useState<string[]>([]);
  function submit(submitEvent: FormEvent) {
    submitEvent.preventDefault();
    const result = createAccount(state, { name, email, phone, password });
    setErrors(result.errors);
    if (!result.errors.length) {
      setState(result.state, 'Account created. You can now register for events.');
      setDialog(event ? { type: 'register', event } : { type: 'none' });
    }
  }
  return <form className="dialog-content form-stack" onSubmit={submit}><span className="eyebrow">Website sign up</span><h2>Create your account</h2><p>This creates your website account only. Event registration happens separately after sign in.</p>{errors.length ? <ErrorList errors={errors} /> : null}<label>Name<input value={name} onChange={(changeEvent) => setName(changeEvent.target.value)} required /></label><label>Email<input type="email" value={email} onChange={(changeEvent) => setEmail(changeEvent.target.value)} required /></label><label>Phone<input value={phone} onChange={(changeEvent) => setPhone(changeEvent.target.value)} required /></label><label>Password<input type="password" value={password} onChange={(changeEvent) => setPassword(changeEvent.target.value)} minLength={6} required /></label><button className="button primary">Create account</button></form>;
}

function ProfileForm({ state, activeUser, setState }: { state: AppState; activeUser: User; setState: (state: AppState, notice?: string) => void }) {
  const [name, setName] = useState(activeUser.name);
  const [email, setEmail] = useState(activeUser.email);
  const [phone, setPhone] = useState(activeUser.phone);
  const [notes, setNotes] = useState(activeUser.notes ?? '');
  const [errors, setErrors] = useState<string[]>([]);
  function submit(event: FormEvent) {
    event.preventDefault();
    const result = updateProfile(state, activeUser.id, { name, email, phone, notes });
    setErrors(result.errors);
    if (!result.errors.length) setState(result.state, 'Profile updated.');
  }
  return <form className="table-card form-card form-stack" onSubmit={submit}>{errors.length ? <ErrorList errors={errors} /> : null}<label>Name<input value={name} onChange={(event) => setName(event.target.value)} required /></label><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Phone<input value={phone} onChange={(event) => setPhone(event.target.value)} required /></label><label>Notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Optional coordination notes" /></label><button className="button primary">Save profile</button></form>;
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

function RegistrationForm({ event, activeUser, state, setState, close }: { event: ChurchEvent; activeUser: User | null; state: AppState; setState: (state: AppState, notice?: string) => void; close: () => void }) {
  const [accompanyingCount, setAccompanyingCount] = useState(0);
  const [ageCounts, setAgeCounts] = useState<Record<AgeRangeKey, number>>(emptyAgeCounts());
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  if (!activeUser) return <GateCard title="Sign in required" description="Create an account or sign in before registering for an event." />;
  function submit(formEvent: FormEvent) {
    formEvent.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const result = registerForEvent(state, { eventId: event.id, user: activeUser!, accompanyingCount, ageCounts, notes });
    setErrors(result.errors);
    if (!result.errors.length) {
      setState(result.state, 'Your registration is pending approval. View it in your participant dashboard.');
      close();
    }
    setSubmitting(false);
  }
  return <form className="dialog-content form-stack" onSubmit={submit}><span className="eyebrow">Event registration</span><h2>{event.title}</h2><p>{formatDateTime(event.startsAt)} · {event.location}</p><p>Include yourself in the age ranges. Example: if you are coming with 2 children, accompanying people = 2 and age ranges total = 3.</p>{errors.length ? <ErrorList errors={errors} /> : null}<label>Accompanying people<input type="number" min="0" value={accompanyingCount} onChange={(changeEvent) => setAccompanyingCount(Number(changeEvent.target.value))} /></label><fieldset><legend>Age ranges</legend>{ageRanges.map((range) => <label className="age-row" key={range}><span>{range}</span><input type="number" min="0" value={ageCounts[range]} onChange={(changeEvent) => setAgeCounts({ ...ageCounts, [range]: Number(changeEvent.target.value) })} /></label>)}</fieldset><label>Notes<textarea value={notes} onChange={(changeEvent) => setNotes(changeEvent.target.value)} placeholder="Allergies, transportation, or planning notes" /></label><button className="button primary" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit registration'}</button></form>;
}

function EventForm({ mode, event, state, setState, close }: { mode: 'create' | 'edit'; event?: ChurchEvent; state: AppState; setState: (state: AppState, notice?: string) => void; close: () => void }) {
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
  function update<K extends keyof EventInput>(key: K, value: EventInput[K]) {
    setForm({ ...form, [key]: value });
  }
  function submit(submitEvent: FormEvent) {
    submitEvent.preventDefault();
    const result = saveEvent(state, form);
    setErrors(result.errors);
    if (!result.errors.length) {
      setState(result.state, mode === 'create' ? 'Event created.' : 'Event updated.');
      close();
    }
  }
  return <form className="dialog-content form-stack" onSubmit={submit}><span className="eyebrow">{mode === 'create' ? 'Create event' : 'Edit event'}</span><h2>{mode === 'create' ? 'Create event' : `Edit ${event?.title}`}</h2>{errors.length ? <ErrorList errors={errors} /> : null}<div className="form-grid"><label>Title<input value={form.title} onChange={(event) => update('title', event.target.value)} required /></label><label>Publication status<select value={form.status} onChange={(event) => update('status', event.target.value as EventStatus)} required><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label><label>Starts at<input value={form.startsAt} onChange={(event) => update('startsAt', event.target.value)} required /></label><label>Ends at<input value={form.endsAt} onChange={(event) => update('endsAt', event.target.value)} required /></label><label>Location<input value={form.location} onChange={(event) => update('location', event.target.value)} required /></label><label>Maps link<input value={form.mapsUrl} onChange={(event) => update('mapsUrl', event.target.value)} /></label><label>Capacity<input type="number" min="1" value={form.capacity} onChange={(event) => update('capacity', Number(event.target.value))} required /></label><label>Cost<input value={form.cost} onChange={(event) => update('cost', event.target.value)} /></label><label>Age group<input value={form.ageGroup} onChange={(event) => update('ageGroup', event.target.value)} /></label><label>Registration<select value={form.registrationOpen ? 'open' : 'closed'} onChange={(event) => update('registrationOpen', event.target.value === 'open')}><option value="open">Open</option><option value="closed">Closed</option></select></label></div><label>Summary<textarea value={form.summary} onChange={(event) => update('summary', event.target.value)} /></label><label>Description<textarea value={form.description} onChange={(event) => update('description', event.target.value)} /></label><label>Required items<textarea value={form.requiredItems} onChange={(event) => update('requiredItems', event.target.value)} /></label><label>Transportation note<textarea value={form.transportation} onChange={(event) => update('transportation', event.target.value)} /></label><label>Waiver / consent note<textarea value={form.waiver} onChange={(event) => update('waiver', event.target.value)} /></label><label>Volunteer needs<textarea value={form.volunteerNeeds} onChange={(event) => update('volunteerNeeds', event.target.value)} /></label><button className="button primary">Save event</button></form>;
}

function ReviewRegistrations({ event, state, activeUser, setState }: { event: ChurchEvent; state: AppState; activeUser: User | null; setState: (state: AppState, notice?: string) => void }) {
  const [approvalFilter, setApprovalFilter] = useState<ApprovalStatus | 'all'>('pending');
  const [rsvpFilter, setRsvpFilter] = useState<RsvpStatus | 'all'>('all');
  if (!activeUser?.isAdmin) return <GateCard title="Admin access required" description="You do not have access to this page." />;
  const rows = state.registrations.filter((registration) => {
    const matchesEvent = registration.eventId === event.id;
    const matchesApproval = approvalFilter === 'all' || registration.approvalStatus === approvalFilter;
    const matchesRsvp = rsvpFilter === 'all' || registration.rsvpStatus === rsvpFilter;
    return matchesEvent && matchesApproval && matchesRsvp;
  });
  return <div className="dialog-content"><span className="eyebrow">Approval queue</span><h2>{event.title}</h2><p>{formatDateTime(event.startsAt)} · {event.location}</p><div className="filters"><label>Approval status<select value={approvalFilter} onChange={(event) => setApprovalFilter(event.target.value as ApprovalStatus | 'all')}><option value="all">All approval statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="declined">Declined</option></select></label><label>RSVP status<select value={rsvpFilter} onChange={(event) => setRsvpFilter(event.target.value as RsvpStatus | 'all')}><option value="all">All RSVP statuses</option><option value="unknown">Unknown</option><option value="attending">Attending</option><option value="not_attending">Not attending</option></select></label></div>{!rows.length ? <div className="empty-state">No pending registrations.</div> : <div className="table-card"><table><thead><tr><th>Participant</th><th>Counts</th><th>Status</th><th>Notes</th><th>Actions</th></tr></thead><tbody>{rows.map((registration) => <tr key={registration.id}><td data-label="Participant"><strong>{registration.participantName}</strong><small>{registration.email} · {registration.phone}</small></td><td data-label="Counts">{1 + registration.accompanyingCount} people<small>{ageRanges.map((range) => `${range}: ${registration.ageCounts[range]}`).join(' · ')}</small></td><td data-label="Status"><StatusBadge status={registration.approvalStatus} /> <StatusBadge status={registration.rsvpStatus} /></td><td data-label="Notes">{registration.notes || 'No notes.'}</td><td data-label="Actions"><RowMenu items={[
    { label: 'Approve', action: () => setState(updateApproval(state, registration.id, 'approved', activeUser.name), `Approved ${registration.participantName}.`) },
    { label: 'Decline', action: () => window.confirm(`Decline ${registration.participantName}?`) && setState(updateApproval(state, registration.id, 'declined', activeUser.name), `Declined ${registration.participantName}.`) },
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

function RowMenu({ items }: { items: Array<{ label: string; action: () => void | false }> }) {
  const [open, setOpen] = useState(false);
  return <div className="row-menu"><button className="icon-button" onClick={() => setOpen(!open)} aria-label="Open row actions"><MoreHorizontal size={18} /></button>{open ? <div className="menu-panel">{items.map((item) => <button key={item.label} onClick={() => { item.action(); setOpen(false); }}>{item.label}</button>)}</div> : null}</div>;
}
