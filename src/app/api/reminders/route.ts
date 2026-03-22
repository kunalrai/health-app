import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAppointmentReminders } from '@/lib/notifications';
import { sendAppointmentEmail } from '@/lib/email';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get('appointmentId');
    const pending = searchParams.get('pending');

    const where: any = {};
    
    if (appointmentId) {
      where.appointmentId = appointmentId;
    }

    if (pending === 'true') {
      where.status = 'pending';
      where.scheduledFor = { lte: new Date() };
    }

    const reminders = await prisma.reminder.findMany({
      where,
      include: {
        appointment: {
          include: { patient: true },
        },
      },
      orderBy: { scheduledFor: 'asc' },
    });

    return NextResponse.json({ reminders });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
