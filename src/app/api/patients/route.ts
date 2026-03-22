import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/email';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const email = searchParams.get('email');

    if (!id && !email) {
      return NextResponse.json(
        { error: 'Patient ID or email is required' },
        { status: 400 }
      );
    }

    const where: any = id ? { id } : { email: email! };
    
    const patient = await prisma.patient.findUnique({
      where,
      include: {
        appointments: {
          include: { reminders: true },
          orderBy: { startTime: 'desc' },
        },
      },
    });

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ patient });
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
    const { name, email, phone, smsOptIn, voiceOptIn, emailOptIn } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const existingPatient = await prisma.patient.findUnique({
      where: { email },
    });

    if (existingPatient) {
      return NextResponse.json(
        { error: 'Patient with this email already exists' },
        { status: 409 }
      );
    }

    const patient = await prisma.patient.create({
      data: {
        name,
        email,
        phone: phone || '',
        smsOptIn: smsOptIn !== false,
        voiceOptIn: voiceOptIn !== false,
        emailOptIn: emailOptIn !== false,
      },
    });

    try {
      await sendWelcomeEmail(patient);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    return NextResponse.json({ patient });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, phone, smsOptIn, voiceOptIn, emailOptIn, quietHoursStart, quietHoursEnd } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.update({
      where: { id },
      data: {
        name,
        phone,
        smsOptIn,
        voiceOptIn,
        emailOptIn,
        quietHoursStart,
        quietHoursEnd,
      },
    });

    return NextResponse.json({ patient });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
