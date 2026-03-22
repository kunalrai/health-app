'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useState } from 'react';
import {
  User, Phone, Mail, Calendar, Clock, Bell, Bot,
  ChevronRight, Shield, CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

const STATUS_STYLES: Record<string, string> = {
  scheduled: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed:  'bg-green-50 text-green-700 border-green-200',
  completed:  'bg-blue-50 text-blue-700 border-blue-200',
  cancelled:  'bg-red-50 text-red-700 border-red-200',
};

const TYPE_LABELS: Record<string, string> = {
  consultation:     'Initial Consultation',
  'follow-up':      'Follow-up',
  'test-review':    'Test Review',
  'second-opinion': 'Second Opinion',
};

export default function PortalContent() {
  const patients    = useQuery(api.patients.list, {});
  const appointments = useQuery(api.appointments.listAll, {});
  const reminders   = useQuery(api.reminders.listAll, {});

  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);

  const patient = patients?.find(p => p.phone === phone.trim());
  const patientAppointments = appointments?.filter(a => a.patientId === patient?._id)
    .sort((a, b) => b.scheduledAt - a.scheduledAt) ?? [];
  const patientReminders = reminders?.filter(r => r.patientId === patient?._id)
    .sort((a, b) => b.scheduledAt - a.scheduledAt) ?? [];

  const now = Date.now();
  const upcoming = patientAppointments.filter(a => a.scheduledAt > now && a.status !== 'cancelled');

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <span className="badge badge-primary mb-4">
            <Shield className="w-3.5 h-3.5" /> Patient Portal
          </span>
          <h1 className="font-serif text-4xl font-bold text-text-primary mb-3">
            Your <span className="gradient-text">Health Portal</span>
          </h1>
          <p className="text-text-secondary">
            View your appointments, reminders, and care advice from Dr. Veenoo Agarwal.
          </p>
        </div>

        {/* Phone lookup */}
        {!searched || !patient ? (
          <div className="card-modern p-8 animate-fade-in-up">
            <h2 className="font-serif text-xl font-semibold text-text-primary mb-2">Find Your Records</h2>
            <p className="text-text-secondary text-sm mb-6">
              Enter the phone number you used when booking with Kira.
            </p>
            <div className="flex gap-3">
              <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-primary/50 bg-background">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && setSearched(true)}
                  placeholder="+91 98765 43210"
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder-gray-400 outline-none"
                />
              </div>
              <button onClick={() => setSearched(true)} className="btn btn-primary px-6">
                Find <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {searched && !patient && (
              <p className="mt-4 text-sm text-red-600 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                No records found for that number. Try booking an appointment with Kira first.
              </p>
            )}

            {/* Kira prompt */}
            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Not registered yet?</p>
                <p className="text-xs text-text-secondary">Chat with Kira (bottom-right) to book your first appointment.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in-up">
            {/* Patient card */}
            <div className="card-modern p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center text-white font-serif text-xl font-bold flex-shrink-0">
                  {patient.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h2 className="font-serif text-xl font-bold text-text-primary">{patient.name}</h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-text-secondary">
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-primary" />{patient.phone}</span>
                    {patient.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-primary" />{patient.email}</span>}
                  </div>
                </div>
                <button
                  onClick={() => { setPhone(''); setSearched(false); }}
                  className="text-xs text-text-secondary hover:text-primary transition-colors"
                >
                  Switch
                </button>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-100">
                <div className="text-center">
                  <p className="font-serif text-2xl font-bold gradient-text">{patientAppointments.length}</p>
                  <p className="text-xs text-text-secondary">Total Appts</p>
                </div>
                <div className="text-center">
                  <p className="font-serif text-2xl font-bold gradient-text">{upcoming.length}</p>
                  <p className="text-xs text-text-secondary">Upcoming</p>
                </div>
                <div className="text-center">
                  <p className="font-serif text-2xl font-bold gradient-text">
                    {patientReminders.filter(r => r.status === 'sent').length}
                  </p>
                  <p className="text-xs text-text-secondary">Reminders Sent</p>
                </div>
              </div>
            </div>

            {/* Appointments */}
            <div className="card-modern overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <h3 className="font-serif text-lg font-semibold text-text-primary">Appointments</h3>
              </div>
              {patientAppointments.length === 0 ? (
                <div className="p-8 text-center">
                  <Calendar className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-text-secondary text-sm">No appointments yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {patientAppointments.map(appt => {
                    const date = new Date(appt.scheduledAt);
                    return (
                      <div key={appt._id} className="px-6 py-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl gradient-bg flex flex-col items-center justify-center text-white flex-shrink-0">
                          <span className="text-[10px] opacity-80">{date.toLocaleDateString('en-IN', { month: 'short' })}</span>
                          <span className="text-lg font-bold font-serif leading-none">{date.getDate()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary">{TYPE_LABELS[appt.type] ?? appt.type}</p>
                          <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} · {appt.durationMinutes} min
                          </p>
                          {appt.notes && <p className="text-xs text-text-secondary mt-0.5 italic line-clamp-1">{appt.notes}</p>}
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLES[appt.status] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                          {appt.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reminders */}
            {patientReminders.length > 0 && (
              <div className="card-modern overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" />
                  <h3 className="font-serif text-lg font-semibold text-text-primary">Reminders</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {patientReminders.slice(0, 5).map(r => (
                    <div key={r._id} className="px-6 py-3 flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${r.status === 'sent' ? 'bg-green-500' : r.status === 'failed' ? 'bg-red-400' : 'bg-amber-400'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-text-primary capitalize">{r.type} reminder · {r.channel}</p>
                        <p className="text-[11px] text-text-secondary">
                          {new Date(r.scheduledAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {r.status === 'sent' && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Kira CTA */}
            <div className="relative overflow-hidden rounded-2xl p-6 gradient-bg text-white">
              <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Need to reschedule or have a question?</p>
                  <p className="text-white/75 text-xs mt-0.5">Chat with Kira anytime using the button at the bottom-right of the screen.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
