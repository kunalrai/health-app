'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, ChevronRight, RefreshCw, Filter } from 'lucide-react';
import AppointmentCard from '@/components/AppointmentCard';
import Modal from '@/components/Modal';
import { format, addDays, startOfWeek, eachDayOfInterval } from 'date-fns';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Appointment {
  id: string;
  title: string;
  type: string;
  startTime: string;
  endTime: string;
  patient?: Patient;
  reminders?: { channel: string; status: string }[];
  notes?: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments?upcoming=true');
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncCalendar = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/calendar/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchAppointments();
      }
    } catch (error) {
      console.error('Failed to sync calendar:', error);
    } finally {
      setSyncing(false);
    }
  };

  const sendReminder = async (appointmentId: string) => {
    try {
      const res = await fetch('/api/reminders/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, channel: 'all' }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Reminders sent successfully!');
        fetchAppointments();
      }
    } catch (error) {
      console.error('Failed to send reminders:', error);
    }
  };

  const weekDays = eachDayOfInterval({
    start: startOfWeek(selectedDate, { weekStartsOn: 0 }),
    end: addDays(startOfWeek(selectedDate, { weekStartsOn: 0 }), 6),
  });

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === 'all') return true;
    return apt.type === filter;
  });

  const appointmentTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'chemotherapy', label: 'Chemotherapy' },
    { value: 'radiation', label: 'Radiation' },
    { value: 'immunotherapy', label: 'Immunotherapy' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'followup', label: 'Follow-up' },
  ];

  return (
    <>
      <section className="pt-32 pb-12 bg-gradient-to-br from-primary-50 via-background to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl font-bold text-text-primary mb-2">
                Appointments
              </h1>
              <p className="text-text-secondary">
                View and manage your upcoming appointments
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={syncCalendar}
                disabled={syncing}
                className="inline-flex items-center gap-2 bg-white border border-gray-200 text-text-primary px-4 py-2 rounded-button font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                Sync Calendar
              </button>
              <button
                onClick={() => setShowBookingModal(true)}
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-button font-semibold hover:bg-primary-600 transition-colors"
              >
                Book Appointment
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-background rounded-card p-6 sticky top-24">
                <div className="mb-6">
                  <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter by Type
                  </h3>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full px-4 py-2 rounded-button border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    {appointmentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Quick View
                  </h3>
                  <div className="space-y-1">
                    {weekDays.map((day) => {
                      const dayAppointments = appointments.filter(
                        (apt) => format(new Date(apt.startTime), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
                      );
                      return (
                        <button
                          key={day.toISOString()}
                          onClick={() => setSelectedDate(day)}
                          className={`w-full text-left px-3 py-2 rounded-button transition-colors ${
                            format(selectedDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
                              ? 'bg-primary text-white'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{format(day, 'EEE')}</span>
                            <span className="font-mono text-sm">{format(day, 'd')}</span>
                          </div>
                          {dayAppointments.length > 0 && (
                            <div className="mt-1 text-xs opacity-80">
                              {dayAppointments.length} appointment{dayAppointments.length > 1 ? 's' : ''}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-text-primary mb-4">Legend</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="text-text-secondary">Pending Reminder</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-text-secondary">Reminder Sent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-text-secondary">Reminder Failed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : filteredAppointments.length === 0 ? (
                <div className="text-center py-16 bg-background rounded-card">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-semibold text-text-primary mb-2">
                    No Appointments Found
                  </h3>
                  <p className="text-text-secondary mb-6">
                    {filter !== 'all'
                      ? 'No appointments match your filter criteria.'
                      : 'You don\'t have any upcoming appointments scheduled.'}
                  </p>
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-button font-semibold"
                  >
                    Book Appointment
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onView={(id) => {
                        const apt = appointments.find((a) => a.id === id);
                        if (apt) setSelectedAppointment(apt);
                      }}
                      onSendReminder={sendReminder}
                      showPatient
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Modal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        title="Appointment Details"
      >
        {selectedAppointment && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-text-secondary">Appointment</p>
              <p className="font-semibold text-text-primary">{selectedAppointment.title}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-secondary">Date</p>
                <p className="font-medium text-text-primary">
                  {format(new Date(selectedAppointment.startTime), 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Time</p>
                <p className="font-mono font-medium text-text-primary">
                  {format(new Date(selectedAppointment.startTime), 'h:mm a')} -{' '}
                  {format(new Date(selectedAppointment.endTime), 'h:mm a')}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Type</p>
              <p className="font-medium text-primary capitalize">{selectedAppointment.type}</p>
            </div>
            {selectedAppointment.patient && (
              <div className="bg-background rounded-card p-4 space-y-3">
                <p className="text-sm text-text-secondary font-medium">Patient Information</p>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-text-secondary" />
                  <span>{selectedAppointment.patient.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-text-secondary" />
                  <span>{selectedAppointment.patient.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-text-secondary" />
                  <span>{selectedAppointment.patient.email}</span>
                </div>
              </div>
            )}
            {selectedAppointment.notes && (
              <div>
                <p className="text-sm text-text-secondary">Notes</p>
                <p className="text-text-primary">{selectedAppointment.notes}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-text-secondary mb-2">Reminders</p>
              <div className="flex gap-2">
                {selectedAppointment.reminders?.map((r) => (
                  <span
                    key={r.channel}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      r.status === 'sent'
                        ? 'bg-green-100 text-green-700'
                        : r.status === 'pending'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {r.channel.toUpperCase()} - {r.status}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Book New Appointment"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Patient Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-button border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="patient@email.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-button border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Time
              </label>
              <input
                type="time"
                className="w-full px-4 py-3 rounded-button border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Appointment Type
            </label>
            <select className="w-full px-4 py-3 rounded-button border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
              <option value="">Select type</option>
              <option value="consultation">Consultation</option>
              <option value="chemotherapy">Chemotherapy</option>
              <option value="radiation">Radiation Therapy</option>
              <option value="immunotherapy">Immunotherapy</option>
              <option value="followup">Follow-up</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Notes (optional)
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 rounded-button border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              placeholder="Additional notes..."
            />
          </div>
          <button
            type="button"
            onClick={() => {
              alert('Booking functionality would be implemented here');
              setShowBookingModal(false);
            }}
            className="w-full bg-primary text-white py-3 rounded-button font-semibold hover:bg-primary-600 transition-colors"
          >
            Book Appointment
          </button>
        </form>
      </Modal>
    </>
  );
}
