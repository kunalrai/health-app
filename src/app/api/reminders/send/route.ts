import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAppointmentReminders } from '@/lib/notifications';
import { sendAppointmentEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { appointmentId, channel } = body;

    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { patient: true },
    });

    if (!appointment || !appointment.patient) {
      return NextResponse.json(
        { error: 'Appointment or patient not found' },
        { status: 404 }
      );
    }

    const results: { channel: string; success: boolean; error?: string }[] = [];

    if (!channel || channel === 'sms' || channel === 'all') {
      if (appointment.patient.smsOptIn && appointment.patient.phone) {
        const { sendSMS, generateAppointmentReminderMessage } = await import('@/lib/notifications');
        const message = generateAppointmentReminderMessage(
          appointment.patient.name,
          appointment.title,
          appointment.startTime,
          appointment.type
        );
        const result = await sendSMS({ to: appointment.patient.phone, message });
        results.push({ channel: 'sms', ...result });
      }
    }

    if (!channel || channel === 'voice' || channel === 'all') {
      if (appointment.patient.voiceOptIn && appointment.patient.phone) {
        const { sendVoiceCall, generateAppointmentReminderMessage } = await import('@/lib/notifications');
        const message = generateAppointmentReminderMessage(
          appointment.patient.name,
          appointment.title,
          appointment.startTime,
          appointment.type
        );
        const result = await sendVoiceCall({
          to: appointment.patient.phone,
          message: `Hello ${appointment.patient.name}. ${message}`,
        });
        results.push({ channel: 'voice', ...result });
      }
    }

    if (!channel || channel === 'email' || channel === 'all') {
      if (appointment.patient.emailOptIn) {
        const result = await sendAppointmentEmail(appointmentId);
        results.push({ channel: 'email', ...result });
      }
    }

    const hasSuccess = results.some((r) => r.success);
    return NextResponse.json({
      success: hasSuccess,
      results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
