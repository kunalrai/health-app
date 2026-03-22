import { NextResponse } from 'next/server';
import { syncCalendarEventsToDatabase, isCalendarConnected } from '@/lib/calendar';

export async function POST() {
  try {
    const connected = await isCalendarConnected();
    
    if (!connected) {
      return NextResponse.json(
        { error: 'Calendar not connected' },
        { status: 401 }
      );
    }

    const result = await syncCalendarEventsToDatabase();
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
