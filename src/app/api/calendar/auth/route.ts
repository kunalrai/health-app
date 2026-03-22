import { NextResponse } from 'next/server';
import { getAuthUrl, isCalendarConnected, disconnectCalendar } from '@/lib/calendar';

export async function GET() {
  try {
    const connected = await isCalendarConnected();
    
    if (connected) {
      return NextResponse.json({ connected: true });
    }

    const authUrl = getAuthUrl();
    return NextResponse.json({ connected: false, authUrl });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await disconnectCalendar();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
