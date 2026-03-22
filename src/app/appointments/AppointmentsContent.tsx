'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar, Clock, User, ChevronRight, Plus, CheckCircle2,
  XCircle, AlertCircle, Bot,
} from 'lucide-react';

const TYPE_LABELS: Record<string, string> = {
  consultation:   'Initial Consultation',
  'follow-up':    'Follow-up',
  'test-review':  'Test Review',
  'second-opinion': 'Second Opinion',
};

const STATUS_STYLES: Record<string, string> = {
  scheduled: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

export default function AppointmentsContent() {
  const appointments = useQuery(api.appointments.listAll, {});
  const patients     = useQuery(api.patients.list, {});
  const updateStatus = useMutation(api.appointments.updateStatus);
  const cancel       = useMutation(api.appointments.cancel);

  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('upcoming');

  const now = Date.now();

  const filtered = (appointments ?? []).filter(a => {
    if (filter === 'upcoming')  return a.scheduledAt > now && a.status !== 'cancelled';
    if (filter === 'completed') return a.status === 'completed';
    if (filter === 'cancelled') return a.status === 'cancelled';
    return true;
  });

  function getPatient(patientId: string) {
    return patients?.find(p => p._id === patientId);
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-text-primary">Appointments</h1>
            <p className="text-text-secondary text-sm mt-1">All patient appointments managed by Kira</p>
          </div>
          <Link
            href="/admin/kira"
            className="btn btn-primary text-sm"
          >
            <Bot className="w-4 h-4" /> Kira Admin
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total',     value: appointments?.length ?? 0,                                               color: 'text-text-primary' },
            { label: 'Upcoming',  value: appointments?.filter(a => a.scheduledAt > now && a.status !== 'cancelled').length ?? 0, color: 'text-amber-600' },
            { label: 'Completed', value: appointments?.filter(a => a.status === 'completed').length ?? 0,         color: 'text-blue-600' },
            { label: 'Cancelled', value: appointments?.filter(a => a.status === 'cancelled').length ?? 0,         color: 'text-red-500' },
          ].map(s => (
            <div key={s.label} className="card-modern p-4 text-center">
              <p className={`font-serif text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-text-secondary mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
          {(['upcoming', 'all', 'completed', 'cancelled'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                filter === f ? 'bg-white text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Appointment list */}
        {!appointments ? (
          <div className="card-modern p-12 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="card-modern p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-text-secondary text-sm">No {filter} appointments.</p>
            <p className="text-text-secondary text-xs mt-1">Patients can book via the Kira chat widget.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered
              .slice()
              .sort((a, b) => a.scheduledAt - b.scheduledAt)
              .map(appt => {
                const patient = getPatient(appt.patientId);
                const date = new Date(appt.scheduledAt);
                const isPast = appt.scheduledAt < now;

                return (
                  <div key={appt._id} className="card-modern p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Date block */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl gradient-bg flex flex-col items-center justify-center text-white shadow-[0_4px_12px_rgba(13,115,119,0.2)]">
                      <span className="text-xs font-medium opacity-80">
                        {date.toLocaleDateString('en-IN', { month: 'short' })}
                      </span>
                      <span className="text-2xl font-bold font-serif leading-none">
                        {date.getDate()}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLES[appt.status] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                          {appt.status}
                        </span>
                        <span className="text-xs text-primary font-medium">
                          {TYPE_LABELS[appt.type] ?? appt.type}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary">
                        {patient && (
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-primary" />
                            {patient.name}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          {' · '}{appt.durationMinutes} min
                        </span>
                      </div>

                      {appt.notes && (
                        <p className="text-xs text-text-secondary mt-1 line-clamp-1 italic">{appt.notes}</p>
                      )}
                    </div>

                    {/* Actions */}
                    {!isPast && appt.status !== 'cancelled' && appt.status !== 'completed' && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => updateStatus({ id: appt._id, status: 'confirmed' })}
                          disabled={appt.status === 'confirmed'}
                          className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 disabled:opacity-40 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Confirm
                        </button>
                        <button
                          onClick={() => cancel({ id: appt._id })}
                          className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Cancel
                        </button>
                      </div>
                    )}

                    {appt.status === 'completed' && (
                      <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    )}
                    {appt.status === 'cancelled' && (
                      <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
          </div>
        )}

        {/* Empty CTA */}
        <div className="mt-8 p-5 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-4">
          <Bot className="w-8 h-8 text-primary flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-text-primary">Appointments are booked by Kira</p>
            <p className="text-xs text-text-secondary mt-0.5">
              Patients chat with Kira on any page to book, reschedule, or check their appointments.
            </p>
          </div>
          <Link href="/admin/kira" className="ml-auto btn btn-ghost text-xs py-2 px-4 flex-shrink-0">
            Configure Kira <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
