import twilio from 'twilio';
import { prisma } from './prisma';
import { format } from 'date-fns';

const client = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

interface SendSMSOptions {
  to: string;
  message: string;
}

export async function sendSMS({ to, message }: SendSMSOptions): Promise<{ success: boolean; error?: string }> {
  if (!client || !process.env.TWILIO_PHONE_NUMBER) {
    console.log('[SMS Mock] Would send to:', to);
    console.log('[SMS Mock] Message:', message);
    return { success: true };
  }

  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

interface SendVoiceCallOptions {
  to: string;
  message: string;
}

export async function sendVoiceCall({ to, message }: SendVoiceCallOptions): Promise<{ success: boolean; error?: string }> {
  if (!client || !process.env.TWILIO_PHONE_NUMBER) {
    console.log('[Voice Mock] Would call:', to);
    console.log('[Voice Mock] Message:', message);
    return { success: true };
  }

  try {
    await client.calls.create({
      twiml: `<Response><Say voice="alice">${message}</Say></Response>`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export function generateAppointmentReminderMessage(
  patientName: string,
  appointmentTitle: string,
  appointmentDate: Date,
  appointmentType: string
): string {
  const formattedDate = format(appointmentDate, 'EEEE, MMMM do');
  const formattedTime = format(appointmentDate, 'h:mm a');
  
  return `Hello ${patientName}, this is a reminder from Hope Oncology. Your ${appointmentType} appointment "${appointmentTitle}" is scheduled for ${formattedDate} at ${formattedTime}. Please arrive 15 minutes early. If you need to reschedule, please call us at (555) 234-5678. We look forward to seeing you.`;
}

export async function sendAppointmentReminders(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { patient: true, reminders: true },
  });

  if (!appointment || !appointment.patient) {
    return { error: 'Appointment or patient not found' };
  }

  const { patient } = appointment;
  const reminderMessage = generateAppointmentReminderMessage(
    patient.name,
    appointment.title,
    appointment.startTime,
    appointment.type
  );

  const results: { channel: string; success: boolean; error?: string }[] = [];

  if (patient.smsOptIn && patient.phone) {
    const result = await sendSMS({
      to: patient.phone,
      message: reminderMessage,
    });
    results.push({ channel: 'sms', ...result });
  }

  if (patient.voiceOptIn && patient.phone) {
    const voiceMessage = `Hello ${patient.name}. ${reminderMessage.replace('(555) 234-5678', '5 5 5 2 3 4 5 6 7 8')}`;
    const result = await sendVoiceCall({
      to: patient.phone,
      message: voiceMessage,
    });
    results.push({ channel: 'voice', ...result });
  }

  return results;
}

export async function updateReminderStatus(
  reminderId: string,
  status: 'sent' | 'failed',
  error?: string
) {
  await prisma.reminder.update({
    where: { id: reminderId },
    data: {
      status,
      sentAt: status === 'sent' ? new Date() : null,
      error,
    },
  });
}
