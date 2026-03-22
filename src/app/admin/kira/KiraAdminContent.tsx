'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useState } from 'react';
import {
  Bot, Users, CalendarDays, Bell, Utensils, Pill, FlaskConical,
  Plus, Check, X, MessageSquare, Clock, AlertCircle, Activity,
} from 'lucide-react';

type AdviceType = 'diet' | 'prescription' | 'test' | 'medication' | 'general';

const ADVICE_TYPES: { value: AdviceType; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'diet',         label: 'Diet Plan',      icon: <Utensils className="w-4 h-4" />,     color: 'text-green-600 bg-green-50' },
  { value: 'prescription', label: 'Prescription',   icon: <Pill className="w-4 h-4" />,         color: 'text-blue-600 bg-blue-50' },
  { value: 'test',         label: 'Test / Scan',    icon: <FlaskConical className="w-4 h-4" />, color: 'text-purple-600 bg-purple-50' },
  { value: 'medication',   label: 'Medication',     icon: <Activity className="w-4 h-4" />,     color: 'text-orange-600 bg-orange-50' },
  { value: 'general',      label: 'General Note',   icon: <MessageSquare className="w-4 h-4" />,color: 'text-gray-600 bg-gray-50' },
];

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string | number; sub?: string }) {
  return (
    <div className="card-modern p-5 flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl gradient-bg flex items-center justify-center text-white flex-shrink-0">{icon}</div>
      <div>
        <p className="text-2xl font-bold font-serif gradient-text">{value}</p>
        <p className="text-sm font-medium text-text-primary">{label}</p>
        {sub && <p className="text-xs text-text-secondary mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

type Tab = 'overview' | 'patients' | 'appointments' | 'reminders' | 'advice' | 'conversations';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview',      label: 'Overview',      icon: <Activity className="w-4 h-4" /> },
  { id: 'patients',      label: 'Patients',       icon: <Users className="w-4 h-4" /> },
  { id: 'appointments',  label: 'Appointments',   icon: <CalendarDays className="w-4 h-4" /> },
  { id: 'reminders',     label: 'Reminders',      icon: <Bell className="w-4 h-4" /> },
  { id: 'advice',        label: 'Patient Advice', icon: <Utensils className="w-4 h-4" /> },
  { id: 'conversations', label: 'Conversations',  icon: <MessageSquare className="w-4 h-4" /> },
];

export default function KiraAdminContent() {
  const patients      = useQuery(api.patients.list, {});
  const appointments  = useQuery(api.appointments.listAll, {});
  const reminders     = useQuery(api.reminders.listAll, {});
  const conversations = useQuery(api.conversations.listRecent, {});
  const createAdvice  = useMutation(api.patientAdvice.create);
  const removeAdvice  = useMutation(api.patientAdvice.remove);

  const [tab, setTab] = useState<Tab>('overview');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const [adviceForm, setAdviceForm] = useState({
    patientId: '',
    type: 'diet' as AdviceType,
    title: '',
    content: '',
    reminderTime: '09:00',
    reminderDays: '1,3',
  });

  const selectedPatientAdvice = useQuery(
    api.patientAdvice.listByPatient,
    selectedPatientId ? { patientId: selectedPatientId as any } : 'skip'
  );

  const now = Date.now();
  const upcoming = appointments?.filter(a => a.scheduledAt > now && a.status !== 'cancelled') ?? [];
  const pendingReminders = reminders?.filter(r => r.status === 'pending') ?? [];

  async function handleSaveAdvice(e: React.FormEvent) {
    e.preventDefault();
    if (!adviceForm.patientId || !adviceForm.title || !adviceForm.content) return;
    setSaving(true);
    try {
      await createAdvice({
        patientId: adviceForm.patientId as any,
        type: adviceForm.type,
        title: adviceForm.title,
        content: adviceForm.content,
        reminderTime: adviceForm.reminderTime,
        reminderDays: adviceForm.reminderDays.split(',').map(d => parseInt(d.trim())).filter(Boolean),
      });
      setSavedOk(true);
      setAdviceForm(f => ({ ...f, title: '', content: '' }));
      setTimeout(() => setSavedOk(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  const statusPill = (status: string) => {
    const map: Record<string, string> = {
      scheduled: 'bg-amber-50 text-amber-700',
      confirmed: 'bg-green-50 text-green-700',
      completed: 'bg-blue-50 text-blue-700',
      cancelled: 'bg-red-50 text-red-700',
      pending: 'bg-amber-50 text-amber-700',
      sent: 'bg-green-50 text-green-700',
      failed: 'bg-red-50 text-red-700',
      active: 'bg-green-50 text-green-700',
    };
    return (
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${map[status] ?? 'bg-gray-100 text-gray-500'}`}>
        {status}
      </span>
    );
  };

  return (
    <>
      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              tab === t.id ? 'bg-white text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ══ OVERVIEW ══ */}
      {tab === 'overview' && (
        <div className="space-y-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<Users className="w-5 h-5" />}        label="Total Patients"        value={patients?.length ?? '—'} />
            <StatCard icon={<CalendarDays className="w-5 h-5" />} label="Upcoming Appointments" value={upcoming.length} sub="not cancelled" />
            <StatCard icon={<Bell className="w-5 h-5" />}         label="Pending Reminders"     value={pendingReminders.length} />
            <StatCard icon={<MessageSquare className="w-5 h-5" />}label="Conversations"         value={conversations?.length ?? '—'} sub="all time" />
          </div>

          <div className="card-modern p-6">
            <h2 className="font-serif text-lg font-semibold text-text-primary mb-4">Next Appointments</h2>
            {upcoming.length === 0 ? (
              <p className="text-text-secondary text-sm">No upcoming appointments.</p>
            ) : (
              <div className="space-y-3">
                {upcoming.slice(0, 5).map(a => {
                  const patient = patients?.find(p => p._id === a.patientId);
                  return (
                    <div key={a._id} className="flex items-center gap-4 p-3 bg-background rounded-xl border border-gray-100">
                      <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center text-white flex-shrink-0">
                        <CalendarDays className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{patient?.name ?? 'Unknown'}</p>
                        <p className="text-xs text-text-secondary capitalize">{a.type.replace('-', ' ')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-primary">
                          {new Date(a.scheduledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {new Date(a.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {statusPill(a.status)}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="relative overflow-hidden rounded-2xl p-6 gradient-bg text-white">
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <Bot className="w-6 h-6" /><h3 className="font-serif text-lg font-semibold">Kira is Active</h3>
              </div>
              <p className="text-white/80 text-sm mb-4 max-w-lg">
                Kira handles patient enquiries, books appointments, and schedules multi-channel reminders automatically.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-medium">
                {['Appointment booking','SMS reminders','Email reminders','Voice call reminders','Diet advice','Prescription reminders'].map(f => (
                  <span key={f} className="bg-white/15 border border-white/25 rounded-full px-3 py-1 flex items-center gap-1">
                    <Check className="w-3 h-3" /> {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ PATIENTS ══ */}
      {tab === 'patients' && (
        <div className="card-modern overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-serif text-lg font-semibold text-text-primary">Registered Patients</h2>
          </div>
          {!patients?.length ? (
            <p className="p-6 text-text-secondary text-sm">No patients yet — Kira creates records when patients book via chat.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-background border-b border-gray-100">
                  <tr>{['Name','Phone','Email','Date of Birth','Registered'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {patients.map(p => (
                    <tr key={p._id} className="hover:bg-background/50">
                      <td className="px-5 py-3 font-medium text-text-primary">{p.name}</td>
                      <td className="px-5 py-3 text-text-secondary">{p.phone}</td>
                      <td className="px-5 py-3 text-text-secondary">{p.email || '—'}</td>
                      <td className="px-5 py-3 text-text-secondary">{p.dateOfBirth || '—'}</td>
                      <td className="px-5 py-3 text-text-secondary text-xs">{new Date(p.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ══ APPOINTMENTS ══ */}
      {tab === 'appointments' && (
        <div className="card-modern overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-serif text-lg font-semibold text-text-primary">All Appointments</h2>
          </div>
          {!appointments?.length ? (
            <p className="p-6 text-text-secondary text-sm">No appointments yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-background border-b border-gray-100">
                  <tr>{['Patient','Type','Scheduled At','Duration','Status','Reminders Sent'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {appointments.map(a => {
                    const patient = patients?.find(p => p._id === a.patientId);
                    return (
                      <tr key={a._id} className="hover:bg-background/50">
                        <td className="px-5 py-3 font-medium text-text-primary">{patient?.name ?? '—'}</td>
                        <td className="px-5 py-3 text-text-secondary capitalize">{a.type.replace('-', ' ')}</td>
                        <td className="px-5 py-3 text-text-secondary text-xs">
                          {new Date(a.scheduledAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                        </td>
                        <td className="px-5 py-3 text-text-secondary">{a.durationMinutes} min</td>
                        <td className="px-5 py-3">{statusPill(a.status)}</td>
                        <td className="px-5 py-3 text-xs text-text-secondary">{a.remindersSent.join(', ') || 'none'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ══ REMINDERS ══ */}
      {tab === 'reminders' && (
        <div className="card-modern overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-text-primary">Reminder Queue</h2>
          </div>
          {!reminders?.length ? (
            <p className="p-6 text-text-secondary text-sm">No reminders scheduled.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-background border-b border-gray-100">
                  <tr>{['Patient','Type','Channel','Scheduled','Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reminders.map(r => {
                    const patient = patients?.find(p => p._id === r.patientId);
                    return (
                      <tr key={r._id} className="hover:bg-background/50">
                        <td className="px-5 py-3 font-medium text-text-primary">{patient?.name ?? '—'}</td>
                        <td className="px-5 py-3 text-text-secondary capitalize">{r.type}</td>
                        <td className="px-5 py-3 text-text-secondary capitalize">{r.channel}</td>
                        <td className="px-5 py-3 text-xs text-text-secondary">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />
                            {new Date(r.scheduledAt).toLocaleString('en-IN', { timeZone:'Asia/Kolkata', day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                          </span>
                        </td>
                        <td className="px-5 py-3 flex items-center gap-1">
                          {statusPill(r.status)}
                          {r.errorMessage && <span title={r.errorMessage}><AlertCircle className="w-3.5 h-3.5 text-red-400" /></span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ══ PATIENT ADVICE ══ */}
      {tab === 'advice' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card-modern p-6">
            <h2 className="font-serif text-lg font-semibold text-text-primary mb-5">Add Patient Advice</h2>
            <form onSubmit={handleSaveAdvice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">Patient *</label>
                <select
                  value={adviceForm.patientId}
                  onChange={e => { setAdviceForm(f => ({ ...f, patientId: e.target.value })); setSelectedPatientId(e.target.value || null); }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 bg-background"
                  required
                >
                  <option value="">Select patient…</option>
                  {patients?.map(p => <option key={p._id} value={p._id}>{p.name} — {p.phone}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">Advice Type *</label>
                <div className="grid grid-cols-3 gap-2">
                  {ADVICE_TYPES.map(t => (
                    <button key={t.value} type="button" onClick={() => setAdviceForm(f => ({ ...f, type: t.value }))}
                      className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                        adviceForm.type === t.value ? 'border-primary bg-primary/8 text-primary' : 'border-gray-200 text-text-secondary hover:border-primary/30'
                      }`}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">Title *</label>
                <input value={adviceForm.title} onChange={e => setAdviceForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Post-chemotherapy diet plan"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50" required />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">Instructions *</label>
                <textarea value={adviceForm.content} onChange={e => setAdviceForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Write the advice Kira will share with the patient…"
                  rows={5} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 resize-none" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">Remind at</label>
                  <input type="time" value={adviceForm.reminderTime} onChange={e => setAdviceForm(f => ({ ...f, reminderTime: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">Days before appt.</label>
                  <input value={adviceForm.reminderDays} onChange={e => setAdviceForm(f => ({ ...f, reminderDays: e.target.value }))}
                    placeholder="1, 3, 7"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
                </div>
              </div>

              <button type="submit" disabled={saving} className="btn btn-primary w-full justify-center">
                {saving ? 'Saving…' : savedOk ? <><Check className="w-4 h-4" /> Saved!</> : <><Plus className="w-4 h-4" /> Add Advice</>}
              </button>
            </form>
          </div>

          <div className="card-modern p-6">
            <h2 className="font-serif text-lg font-semibold text-text-primary mb-5">
              {selectedPatientId ? `Advice for ${patients?.find(p => p._id === selectedPatientId)?.name ?? 'patient'}` : 'Select a patient'}
            </h2>
            {!selectedPatientId ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Utensils className="w-10 h-10 text-gray-200 mb-3" />
                <p className="text-text-secondary text-sm">Pick a patient from the form to view their advice.</p>
              </div>
            ) : !selectedPatientAdvice?.length ? (
              <p className="text-text-secondary text-sm">No advice added yet.</p>
            ) : (
              <div className="space-y-3">
                {selectedPatientAdvice.map(a => {
                  const t = ADVICE_TYPES.find(x => x.value === a.type);
                  return (
                    <div key={a._id} className="p-4 bg-background rounded-xl border border-gray-100">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${t?.color}`}>
                            {t?.icon} {t?.label}
                          </span>
                          <span className="text-sm font-medium text-text-primary">{a.title}</span>
                        </div>
                        <button onClick={() => removeAdvice({ id: a._id })}
                          className="w-6 h-6 rounded-full hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">{a.content}</p>
                      {a.reminderDays?.length ? (
                        <p className="text-[10px] text-primary mt-2 flex items-center gap-1">
                          <Bell className="w-3 h-3" /> Reminds {a.reminderDays.join(', ')} day(s) before at {a.reminderTime}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ CONVERSATIONS ══ */}
      {tab === 'conversations' && (
        <div className="card-modern overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-serif text-lg font-semibold text-text-primary">Kira Conversations</h2>
          </div>
          {!conversations?.length ? (
            <p className="p-6 text-text-secondary text-sm">No conversations yet.</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {conversations.map(c => (
                <div key={c._id} className="px-5 py-4 hover:bg-background/50">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white flex-shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-text-primary">{c.patientName ?? 'Anonymous'}</p>
                        {statusPill(c.status)}
                      </div>
                      <p className="text-xs text-text-secondary mt-0.5">{c.patientPhone ?? '—'} · {c.patientEmail ?? '—'}</p>
                      {c.summary && <p className="text-xs text-text-secondary mt-1 italic line-clamp-2">"{c.summary}"</p>}
                    </div>
                    <p className="text-xs text-text-secondary whitespace-nowrap">
                      {new Date(c.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
