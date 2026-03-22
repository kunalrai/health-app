import { NextResponse } from 'next/server';
import { fetchCalendarEvents, isCalendarConnected } from '@/lib/calendar';

export async function GET(request: Request) {
  try {
    const connected = await isCalendarConnected();
    
    if (!connected) {
      return NextResponse.json(
        { error: 'Calendar not connected' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const timeMin = searchParams.get('timeMin');
    const timeMax = searchParams.get('timeMax');

    const events = await fetchCalendarEvents(
      timeMin ? new Date(timeMin) : undefined,
      timeMax ? new Date(timeMax) : undefined
    );

    return NextResponse.json({ events });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
