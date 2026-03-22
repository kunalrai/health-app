import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scheduleReminders } from '@/lib/scheduler';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const upcoming = searchParams.get('upcoming');

    const where: any = {};
    
    if (patientId) {
      where.patientId = patientId;
    }

    if (upcoming === 'true') {
      where.startTime = { gte: new Date() };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: true,
        reminders: true,
      },
      orderBy: { startTime: 'asc' },
    });

    return NextResponse.json({ appointments });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientId, title, type, startTime, endTime, notes, googleEventId } = body;

    if (!patientId || !title || !type || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        title,
        type,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        notes,
        googleEventId,
      },
      include: {
        patient: true,
      },
    });

    await scheduleReminders(appointment.id);

    return NextResponse.json({ appointment });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
