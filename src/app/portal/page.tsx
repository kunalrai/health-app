'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, Bell, Calendar, Clock, Shield, CheckCircle } from 'lucide-react';
import AppointmentCard from '@/components/AppointmentCard';
import Modal from '@/components/Modal';
import { format } from 'date-fns';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  smsOptIn: boolean;
  voiceOptIn: boolean;
  emailOptIn: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

interface Appointment {
  id: string;
  title: string;
  type: string;
  startTime: string;
  endTime: string;
  notes?: string;
  reminders?: { channel: string; status: string }[];
}

export default function PortalPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'appointments' | 'preferences'>('appointments');
  const [loginEmail, setLoginEmail] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/patients?email=${encodeURIComponent(loginEmail)}`);
      const data = await res.json();

      if (data.patient) {
        setPatient(data.patient);
        setAppointments(data.patient.appointments || []);
        setIsLoggedIn(true);
      } else {
        alert('Patient not found. Please check your email or register.');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<Patient>) => {
    if (!patient) return;

    try {
      const res = await fetch('/api/patients', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: patient.id, ...updates }),
      });
      const data = await res.json();
      if (data.patient) {
        setPatient(data.patient);
      }
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <section className="pt-32 pb-20 min-h-screen bg-gradient-to-br from-primary-50 via-background to-secondary-50 flex items-center">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="bg-white rounded-card shadow-card p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-bg flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h1 className="font-serif text-2xl font-bold text-text-primary mb-2">
                  Patient Portal
                </h1>
                <p className="text-text-secondary">
                  Enter your email to access your appointments and preferences.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-button border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="your@email.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-button font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-text-secondary">
                  New patient?{' '}
                  <a href="/contact" className="text-primary font-medium hover:underline">
                    Contact us
                  </a>{' '}
                  to get registered.
                </p>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="pt-32 pb-12 bg-gradient-to-br from-primary-50 via-background to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-4xl font-bold text-text-primary mb-2">
                Welcome, {patient?.name?.split(' ')[0]}
              </h1>
              <p className="text-text-secondary">
                Manage your appointments and notification preferences.
              </p>
            </div>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`px-4 py-2 rounded-button font-medium transition-colors ${
                    activeTab === 'appointments'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                  }`}
                >
                  <Calendar className="w-4 h-4 inline mr-2" />
                  My Appointments
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`px-4 py-2 rounded-button font-medium transition-colors ${
                    activeTab === 'preferences'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                  }`}
                >
                  <Bell className="w-4 h-4 inline mr-2" />
                  Notification Preferences
                </button>
              </div>

              {activeTab === 'appointments' && (
                <div>
                  {appointments.length === 0 ? (
                    <div className="text-center py-16 bg-background rounded-card">
                      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="font-serif text-xl font-semibold text-text-primary mb-2">
                        No Upcoming Appointments
                      </h3>
                      <p className="text-text-secondary mb-6">
                        You don&apos;t have any appointments scheduled.
                      </p>
                      <a
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-button font-semibold"
                      >
                        Contact Us to Schedule
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {appointments.map((appointment) => (
                        <AppointmentCard
                          key={appointment.id}
                          appointment={appointment}
                          onView={(id) => {
                            const apt = appointments.find((a) => a.id === id);
                            if (apt) setSelectedAppointment(apt);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="bg-background rounded-card p-6">
                  <h3 className="font-serif text-xl font-semibold text-text-primary mb-6">
                    Notification Preferences
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-text-primary mb-4">Reminder Channels</h4>
                      <p className="text-sm text-text-secondary mb-4">
                        Choose how you&apos;d like to receive appointment reminders.
                      </p>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 p-4 bg-white rounded-card cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={patient?.smsOptIn}
                            onChange={(e) => updatePreferences({ smsOptIn: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <div>
                            <p className="font-medium text-text-primary">SMS Text Messages</p>
                            <p className="text-sm text-text-secondary">Receive reminders via text</p>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-4 bg-white rounded-card cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={patient?.voiceOptIn}
                            onChange={(e) => updatePreferences({ voiceOptIn: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <div>
                            <p className="font-medium text-text-primary">Voice Calls</p>
                            <p className="text-sm text-text-secondary">Receive automated voice reminders</p>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-4 bg-white rounded-card cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={patient?.emailOptIn}
                            onChange={(e) => updatePreferences({ emailOptIn: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <div>
                            <p className="font-medium text-text-primary">Email</p>
                            <p className="text-sm text-text-secondary">Receive detailed email reminders</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="font-medium text-text-primary mb-4">Quiet Hours</h4>
                      <p className="text-sm text-text-secondary mb-4">
                        Set hours when you don&apos;t want to receive calls or texts.
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-text-secondary" />
                          <span className="text-sm text-text-secondary">From</span>
                          <input
                            type="time"
                            value={patient?.quietHoursStart || '22:00'}
                            onChange={(e) => updatePreferences({ quietHoursStart: e.target.value })}
                            className="px-3 py-2 rounded-button border border-gray-200 text-sm"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-text-secondary">To</span>
                          <input
                            type="time"
                            value={patient?.quietHoursEnd || '08:00'}
                            onChange={(e) => updatePreferences({ quietHoursEnd: e.target.value })}
                            className="px-3 py-2 rounded-button border border-gray-200 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-success/10 rounded-card p-4 flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-text-primary">Preferences Saved</p>
                        <p className="text-sm text-text-secondary">
                          Your notification preferences have been updated successfully.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-background rounded-card p-6 sticky top-24">
                <h3 className="font-serif text-lg font-semibold text-text-primary mb-4">
                  Your Profile
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{patient?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{patient?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{patient?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-text-primary mb-3">Active Reminders</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      {patient?.smsOptIn ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                      <span className={patient?.smsOptIn ? 'text-text-primary' : 'text-text-secondary'}>
                        SMS Reminders
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {patient?.voiceOptIn ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                      <span className={patient?.voiceOptIn ? 'text-text-primary' : 'text-text-secondary'}>
                        Voice Calls
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {patient?.emailOptIn ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                      <span className={patient?.emailOptIn ? 'text-text-primary' : 'text-text-secondary'}>
                        Email Notifications
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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
            <div>
              <p className="text-sm text-text-secondary">Date & Time</p>
              <p className="font-mono font-medium text-text-primary">
                {format(new Date(selectedAppointment.startTime), 'EEEE, MMMM d, yyyy')}
                <br />
                {format(new Date(selectedAppointment.startTime), 'h:mm a')} -{' '}
                {format(new Date(selectedAppointment.endTime), 'h:mm a')}
              </p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Type</p>
              <p className="font-medium text-primary capitalize">{selectedAppointment.type}</p>
            </div>
            {selectedAppointment.notes && (
              <div>
                <p className="text-sm text-text-secondary">Notes</p>
                <p className="text-text-primary">{selectedAppointment.notes}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-text-secondary mb-2">Reminders Sent</p>
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
    </>
  );
}
