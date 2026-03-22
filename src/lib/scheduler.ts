import { prisma } from './prisma';
import { sendSMS, sendVoiceCall } from './notifications';
import { sendAppointmentEmail } from './email';
import { differenceInHours, differenceInMinutes, setHours, setMinutes, isWithinInterval } from 'date-fns';

const REMINDER_INTERVALS = [
  { hours: 168, name: '7 days' },
  { hours: 24, name: '24 hours' },
  { hours: 2, name: '2 hours' },
];

interface QueuedReminder {
  id: string;
  appointmentId: string;
  channel: 'sms' | 'voice' | 'email';
  patientPhone: string;
  patientEmail: string;
  patientName: string;
  patientSmsOptIn: boolean;
  patientVoiceOptIn: boolean;
  patientEmailOptIn: boolean;
  quietHoursStart?: string | null;
  quietHoursEnd?: string | null;
  appointmentTitle: string;
  appointmentType: string;
  appointmentStart: Date;
}

let isProcessing = false;

export async function scheduleReminders(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { patient: true },
  });

  if (!appointment || !appointment.patient) return;

  const patient = appointment.patient;

  for (const interval of REMINDER_INTERVALS) {
    const scheduledFor = new Date(appointment.startTime);
    scheduledFor.setHours(scheduledFor.getHours() - interval.hours);

    if (scheduledFor <= new Date()) continue;

    const channels = ['sms', 'voice', 'email'];
    for (const channel of channels) {
      const shouldCreate = checkChannelOptIn(channel, patient);
      if (!shouldCreate) continue;

      await prisma.reminder.create({
        data: {
          appointmentId,
          channel,
          scheduledFor,
          status: 'pending',
        },
      });
    }
  }
}

function checkChannelOptIn(channel: string, patient: { smsOptIn: boolean; voiceOptIn: boolean; emailOptIn: boolean }): boolean {
  switch (channel) {
    case 'sms': return patient.smsOptIn;
    case 'voice': return patient.voiceOptIn;
    case 'email': return patient.emailOptIn;
    default: return false;
  }
}

export async function processReminderQueue() {
  if (isProcessing) return;
  isProcessing = true;

  try {
    const now = new Date();
    const pendingReminders = await prisma.reminder.findMany({
      where: {
        status: 'pending',
        scheduledFor: { lte: now },
      },
      include: {
        appointment: {
          include: { patient: true },
        },
      },
    });

    for (const reminder of pendingReminders) {
      const appointment = reminder.appointment;
      const patient = appointment?.patient;

      if (!appointment || !patient) {
        await prisma.reminder.update({
          where: { id: reminder.id },
          data: { status: 'failed', error: 'Appointment or patient not found' },
        });
        continue;
      }

      if (isInQuietHours(now, patient.quietHoursStart, patient.quietHoursEnd)) {
        continue;
      }

      const message = generateReminderMessage(patient.name, appointment.title, appointment.startTime, appointment.type);
      let success = false;
      let error: string | undefined;

      try {
        switch (reminder.channel) {
          case 'sms':
            const smsResult = await sendSMS({ to: patient.phone, message });
            success = smsResult.success;
            error = smsResult.error;
            break;
          case 'voice':
            const voiceResult = await sendVoiceCall({
              to: patient.phone,
              message: `Hello ${patient.name}. ${message}`,
            });
            success = voiceResult.success;
            error = voiceResult.error;
            break;
          case 'email':
            const emailResult = await sendAppointmentEmail(appointment.id);
            success = emailResult.success;
            error = emailResult.error;
            break;
        }
      } catch (e: any) {
        success = false;
        error = e.message;
      }

      await prisma.reminder.update({
        where: { id: reminder.id },
        data: {
          status: success ? 'sent' : 'failed',
          sentAt: success ? new Date() : null,
          error,
        },
      });
    }
  } finally {
    isProcessing = false;
  }
}

function generateReminderMessage(patientName: string, title: string, startTime: Date, type: string): string {
  const hoursUntil = differenceInHours(startTime, new Date());
  let timePhrase: string;

  if (hoursUntil >= 24) {
    const days = Math.floor(hoursUntil / 24);
    timePhrase = `in ${days} day${days > 1 ? 's' : ''}`;
  } else if (hoursUntil >= 2) {
    timePhrase = `in ${hoursUntil} hours`;
  } else {
    const minutes = differenceInMinutes(startTime, new Date());
    timePhrase = `in ${minutes} minutes`;
  }

  return `Hello ${patientName}, this is a reminder from Hope Oncology. Your ${type} appointment "${title}" is scheduled ${timePhrase}. Please arrive 15 minutes early. Call (555) 234-5678 with questions.`;
}

function isInQuietHours(now: Date, start?: string | null, end?: string | null): boolean {
  if (!start || !end) return false;

  const [startHour, startMin] = start.split(':').map(Number);
  const [endHour, endMin] = end.split(':').map(Number);

  const quietStart = setMinutes(setHours(now, startHour), startMin);
  const quietEnd = setMinutes(setHours(now, endHour), endMin);

  if (quietStart <= quietEnd) {
    return isWithinInterval(now, { start: quietStart, end: quietEnd });
  } else {
    return isWithinInterval(now, { start: quietStart, end: setHours(quietEnd, 24) }) ||
           isWithinInterval(now, { start: setHours(quietEnd, 0), end: quietEnd });
  }
}

let schedulerInterval: NodeJS.Timeout | null = null;

export function startReminderScheduler() {
  if (schedulerInterval) return;

  schedulerInterval = setInterval(() => {
    processReminderQueue().catch(console.error);
  }, 60000);

  console.log('[Scheduler] Reminder processor started - checking every 60 seconds');
}

export function stopReminderScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log('[Scheduler] Reminder processor stopped');
  }
}
