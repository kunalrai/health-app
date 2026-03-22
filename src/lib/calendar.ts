import { google } from 'googleapis';
import { prisma } from './prisma';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events'
];

export function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });
}

export async function getTokensFromCode(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export async function saveTokens(tokens: any) {
  await prisma.calendarToken.deleteMany();
  await prisma.calendarToken.create({
    data: {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
    },
  });
}

export async function getCalendarClient() {
  const token = await prisma.calendarToken.findFirst();
  
  if (!token) {
    throw new Error('No calendar token found');
  }

  oauth2Client.setCredentials({
    access_token: token.accessToken,
    refresh_token: token.refreshToken,
    expiry_date: token.expiryDate?.getTime(),
  });

  oauth2Client.on('tokens', async (tokens) => {
    if (tokens.access_token) {
      await prisma.calendarToken.update({
        where: { id: token.id },
        data: {
          accessToken: tokens.access_token,
          expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        },
      });
    }
  });

  return google.calendar({ version: 'v3', auth: oauth2Client });
}

export async function isCalendarConnected() {
  try {
    const token = await prisma.calendarToken.findFirst();
    return !!token;
  } catch {
    return false;
  }
}

export async function disconnectCalendar() {
  await prisma.calendarToken.deleteMany();
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: Date;
  end: Date;
  attendees?: { email: string; displayName?: string }[];
}

export async function fetchCalendarEvents(
  timeMin?: Date,
  timeMax?: Date
): Promise<CalendarEvent[]> {
  const calendar = await getCalendarClient();
  
  const now = timeMin || new Date();
  const end = timeMax || addDays(now, 30);

  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: now.toISOString(),
    timeMax: end.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
    q: 'patient OR appointment OR treatment',
  });

  return (response.data.items || []).map((event) => ({
    id: event.id || '',
    summary: event.summary || 'Untitled Appointment',
    description: event.description || undefined,
    start: new Date(event.start?.dateTime || event.start?.date || now),
    end: new Date(event.end?.dateTime || event.end?.date || end),
    attendees: event.attendees?.map((a) => ({
      email: a.email || '',
      displayName: a.displayName || undefined,
    })),
  }));
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export async function syncCalendarEventsToDatabase() {
  const events = await fetchCalendarEvents();
  const syncedCount = { created: 0, updated: 0 };

  for (const event of events) {
    const existing = await prisma.appointment.findUnique({
      where: { googleEventId: event.id },
    });

    const appointmentData = {
      googleEventId: event.id,
      title: event.summary,
      type: determineAppointmentType(event.summary, event.description),
      startTime: event.start,
      endTime: event.end,
      notes: event.description || null,
    };

    if (!existing) {
      const email = event.attendees?.[0]?.email;
      let patient = email ? await prisma.patient.findUnique({ where: { email } }) : null;

      if (!patient && email) {
        patient = await prisma.patient.create({
          data: {
            name: event.attendees?.[0]?.displayName || email.split('@')[0],
            email,
            phone: '',
          },
        });
      }

      if (patient) {
        await prisma.appointment.create({
          data: {
            ...appointmentData,
            patientId: patient.id,
          },
        });
        syncedCount.created++;
      }
    } else {
      await prisma.appointment.update({
        where: { id: existing.id },
        data: appointmentData,
      });
      syncedCount.updated++;
    }
  }

  return syncedCount;
}

function determineAppointmentType(
  summary: string,
  description?: string
): string {
  const text = `${summary} ${description || ''}`.toLowerCase();
  
  if (text.includes('chemo') || text.includes('chemotherapy')) return 'chemotherapy';
  if (text.includes('radiation') || text.includes('radio')) return 'radiation';
  if (text.includes('immuno') || text.includes('immunotherapy')) return 'immunotherapy';
  if (text.includes('consult') || text.includes('new patient')) return 'consultation';
  if (text.includes('follow') || text.includes('check')) return 'followup';
  
  return 'consultation';
}
