'use client';

import { useState, useEffect } from 'react';
import { Calendar, Users, Bell, Settings, RefreshCw, Link2, Unlink, CheckCircle, XCircle, Clock, AlertTriangle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  title: string;
  type: string;
  startTime: string;
  endTime: string;
  patient?: { name: string; email: string; phone: string };
  reminders: { id: string; channel: string; status: string; scheduledFor: string }[];
}

interface Reminder {
  id: string;
  channel: string;
  status: string;
  scheduledFor: string;
  appointment: Appointment;
}

export default function AdminPage() {
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [authUrl, setAuthUrl] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'appointments' | 'reminders' | 'settings'>('appointments');

  useEffect(() => {
    checkCalendarStatus();
    fetchAppointments();
    fetchPendingReminders();

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'calendar_connected') {
      checkCalendarStatus();
    }
  }, []);

  const checkCalendarStatus = async () => {
    try {
      const res = await fetch('/api/calendar/auth');
      const data = await res.json();
      setCalendarConnected(data.connected);
      if (data.authUrl) setAuthUrl(data.authUrl);
    } catch (error) {
      console.error('Failed to check calendar status:', error);
    }
  };

  const connectCalendar = () => {
    if (authUrl) {
      window.location.href = authUrl;
    }
  };

  const disconnectCalendar = async () => {
    if (confirm('Are you sure you want to disconnect the Google Calendar?')) {
      try {
        await fetch('/api/calendar/auth', { method: 'DELETE' });
        setCalendarConnected(false);
      } catch (error) {
        console.error('Failed to disconnect calendar:', error);
      }
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingReminders = async () => {
    try {
      const res = await fetch('/api/reminders?pending=true');
      const data = await res.json();
      setReminders(data.reminders || []);
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
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

  const deleteAppointment = async (id: string) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      try {
        await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
        fetchAppointments();
      } catch (error) {
        console.error('Failed to delete appointment:', error);
      }
    }
  };

  return (
    <>
      <section className="pt-32 pb-8 bg-gradient-to-br from-primary-50 via-background to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold text-text-primary mb-2">
            Admin Dashboard
          </h1>
          <p className="text-text-secondary">
            Manage appointments, reminders, and system settings.
          </p>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('appointments')}
                className={`px-4 py-2 rounded-button font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'appointments'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Appointments
              </button>
              <button
                onClick={() => setActiveTab('reminders')}
                className={`px-4 py-2 rounded-button font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'reminders'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                }`}
              >
                <Bell className="w-4 h-4" />
                Reminders
                {reminders.length > 0 && (
                  <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full">
                    {reminders.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 rounded-button font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'settings'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                }`}
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={syncCalendar}
                disabled={!calendarConnected || syncing}
                className="inline-flex items-center gap-2 bg-gray-100 text-text-primary px-4 py-2 rounded-button font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                Sync Calendar
              </button>
            </div>
          </div>

          {activeTab === 'appointments' && (
            <div>
              <div className="bg-background rounded-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                          Patient
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                          Appointment
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                          Date & Time
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                          Reminders
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-text-primary">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center">
                            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                          </td>
                        </tr>
                      ) : appointments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-text-secondary">
                            No appointments found.
                          </td>
                        </tr>
                      ) : (
                        appointments.map((apt) => (
                          <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-text-primary">{apt.patient?.name}</p>
                                <p className="text-sm text-text-secondary">{apt.patient?.email}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-medium text-text-primary">{apt.title}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-mono text-sm text-text-primary">
                                {format(new Date(apt.startTime), 'MMM d, yyyy')}
                              </p>
                              <p className="font-mono text-sm text-text-secondary">
                                {format(new Date(apt.startTime), 'h:mm a')}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                                {apt.type}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-1">
                                {apt.reminders.map((r) => (
                                  <span
                                    key={r.id}
                                    className={`w-2 h-2 rounded-full ${
                                      r.status === 'sent'
                                        ? 'bg-success'
                                        : r.status === 'pending'
                                        ? 'bg-warning animate-pulse-dot'
                                        : 'bg-accent'
                                    }`}
                                    title={`${r.channel}: ${r.status}`}
                                  />
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => sendReminder(apt.id)}
                                  className="p-2 text-primary hover:bg-primary/10 rounded-button transition-colors"
                                  title="Send Reminder"
                                >
                                  <Bell className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteAppointment(apt.id)}
                                  className="p-2 text-accent hover:bg-accent/10 rounded-button transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reminders' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-background rounded-card p-6">
                <h3 className="font-serif text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-warning" />
                  Pending Reminders
                </h3>
                {reminders.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
                    <p className="text-text-secondary">All reminders are up to date!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        className="bg-white rounded-card p-4 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-text-primary">
                            {reminder.appointment.title}
                          </p>
                          <p className="text-sm text-text-secondary">
                            {reminder.appointment.patient?.name} - {reminder.channel.toUpperCase()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-sm text-text-primary">
                            {format(new Date(reminder.scheduledFor), 'MMM d, h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-background rounded-card p-6">
                <h3 className="font-serif text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Reminder Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-card">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-success" />
                      </div>
                      <span className="text-text-secondary">Sent</span>
                    </div>
                    <span className="font-bold text-text-primary">
                      {appointments.reduce((sum, apt) => sum + apt.reminders.filter((r) => r.status === 'sent').length, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-card">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-warning" />
                      </div>
                      <span className="text-text-secondary">Pending</span>
                    </div>
                    <span className="font-bold text-text-primary">{reminders.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-card">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <XCircle className="w-5 h-5 text-accent" />
                      </div>
                      <span className="text-text-secondary">Failed</span>
                    </div>
                    <span className="font-bold text-text-primary">
                      {appointments.reduce((sum, apt) => sum + apt.reminders.filter((r) => r.status === 'failed').length, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-background rounded-card p-6">
                <h3 className="font-serif text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Google Calendar Integration
                </h3>
                <p className="text-text-secondary mb-4">
                  Connect your Google Calendar to automatically sync appointments.
                </p>
                {calendarConnected ? (
                  <div className="bg-success/10 rounded-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                        <Link2 className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <p className="font-medium text-success">Connected</p>
                        <p className="text-sm text-text-secondary">Your calendar is linked</p>
                      </div>
                    </div>
                    <button
                      onClick={disconnectCalendar}
                      className="text-accent hover:underline text-sm font-medium"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={connectCalendar}
                    className="w-full bg-primary text-white py-3 rounded-button font-semibold hover:bg-primary-600 transition-colors"
                  >
                    Connect Google Calendar
                  </button>
                )}
              </div>

              <div className="bg-background rounded-card p-6">
                <h3 className="font-serif text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Reminder Configuration
                </h3>
                <p className="text-text-secondary mb-4">
                  Configure when reminders are sent before appointments.
                </p>
                <div className="space-y-3">
                  {[
                    { name: '7 days before', hours: 168 },
                    { name: '24 hours before', hours: 24 },
                    { name: '2 hours before', hours: 2 },
                  ].map((interval) => (
                    <div
                      key={interval.hours}
                      className="flex items-center justify-between p-3 bg-white rounded-card"
                    >
                      <span className="text-text-primary">{interval.name}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-background rounded-card p-6">
                <h3 className="font-serif text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  API Configuration
                </h3>
                <p className="text-text-secondary mb-4">
                  Configure third-party services for notifications.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Twilio Account SID
                    </label>
                    <input
                      type="password"
                      placeholder="Configure in .env file"
                      disabled
                      className="w-full px-4 py-2 rounded-button border border-gray-200 bg-gray-50 text-text-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      SendGrid API Key
                    </label>
                    <input
                      type="password"
                      placeholder="Configure in .env file"
                      disabled
                      className="w-full px-4 py-2 rounded-button border border-gray-200 bg-gray-50 text-text-secondary"
                    />
                  </div>
                  <p className="text-sm text-text-secondary">
                    API keys should be configured in the <code className="bg-gray-200 px-1 rounded">.env</code> file.
                  </p>
                </div>
              </div>

              <div className="bg-warning/10 rounded-card p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">Setup Required</h3>
                    <p className="text-sm text-text-secondary mb-4">
                      To enable full functionality, configure the following environment variables:
                    </p>
                    <ul className="text-sm text-text-secondary space-y-1">
                      <li>• <code className="bg-gray-200 px-1 rounded">GOOGLE_CLIENT_ID</code></li>
                      <li>• <code className="bg-gray-200 px-1 rounded">GOOGLE_CLIENT_SECRET</code></li>
                      <li>• <code className="bg-gray-200 px-1 rounded">TWILIO_ACCOUNT_SID</code></li>
                      <li>• <code className="bg-gray-200 px-1 rounded">TWILIO_AUTH_TOKEN</code></li>
                      <li>• <code className="bg-gray-200 px-1 rounded">SENDGRID_API_KEY</code></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
