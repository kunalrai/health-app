import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';
import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { Resend } from 'resend';

// Called by a cron job or manual trigger — processes all pending reminders
export async function POST(req: NextRequest) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
  if (!convexUrl) throw new Error('NEXT_PUBLIC_CONVEX_URL is not set');
  const convex = new ConvexHttpClient(convexUrl);
  const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
  const resend = new Resend(process.env.RESEND_API_KEY!);
  // Guard with a secret key
  const auth = req.headers.get('x-kira-secret');
  if (auth !== process.env.KIRA_REMIND_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pending = await convex.query(api.reminders.listPending, {});
  const results = { sent: 0, failed: 0, errors: [] as string[] };

  for (const reminder of pending) {
    const patient = await convex.query(api.patients.get, { id: reminder.patientId });
    if (!patient) {
      await convex.mutation(api.reminders.markFailed, {
        id: reminder._id,
        errorMessage: 'Patient not found',
      });
      results.failed++;
      continue;
    }

    const channels =
      reminder.channel === 'all' ? ['sms', 'email', 'call'] : [reminder.channel];

    let allOk = true;

    for (const channel of channels) {
      try {
        if (channel === 'sms' && patient.phone) {
          await twilioClient.messages.create({
            body: reminder.content,
            from: process.env.TWILIO_PHONE_NUMBER!,
            to: patient.phone,
          });
        }

        if (channel === 'email' && patient.email) {
          await resend.emails.send({
            from: 'Kira — Dr. Veenoo\'s Clinic <kira@drveenoo.com>',
            to: patient.email,
            subject: `Reminder from Dr. Veenoo Agarwal's Clinic`,
            html: buildEmailHtml(patient.name, reminder.content),
          });
        }

        if (channel === 'call' && patient.phone) {
          await twilioClient.calls.create({
            twiml: `<Response><Say voice="alice">${reminder.content}</Say><Pause length="1"/><Say voice="alice">To reschedule, please call plus 91 9667769023. Thank you and take care.</Say></Response>`,
            from: process.env.TWILIO_PHONE_NUMBER!,
            to: patient.phone,
          });
        }
      } catch (err: any) {
        allOk = false;
        results.errors.push(`${channel} to ${patient.phone}: ${err.message}`);
      }
    }

    if (allOk) {
      await convex.mutation(api.reminders.markSent, { id: reminder._id });
      results.sent++;
    } else {
      await convex.mutation(api.reminders.markFailed, {
        id: reminder._id,
        errorMessage: results.errors.at(-1) ?? 'Unknown error',
      });
      results.failed++;
    }
  }

  return NextResponse.json({ processed: pending.length, ...results });
}

function buildEmailHtml(name: string, content: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:sans-serif;background:#f9fafb;margin:0;padding:24px;">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#0D7377,#14B8A6);padding:28px 32px;">
      <p style="color:white;font-size:20px;font-weight:700;margin:0;">Kira — Dr. Veenoo Agarwal's Clinic</p>
      <p style="color:rgba(255,255,255,0.85);font-size:13px;margin:4px 0 0;">Your Personal Health Assistant</p>
    </div>
    <div style="padding:28px 32px;">
      <p style="color:#1a1a2e;font-size:15px;margin:0 0 12px;">Dear <strong>${name}</strong>,</p>
      <p style="color:#4a5568;font-size:14px;line-height:1.6;margin:0 0 20px;">${content}</p>
      <div style="background:#f0fdfa;border-left:3px solid #0D7377;border-radius:6px;padding:14px 16px;margin-bottom:20px;">
        <p style="color:#0D7377;font-size:13px;font-weight:600;margin:0 0 4px;">Need to reschedule?</p>
        <p style="color:#4a5568;font-size:13px;margin:0;">Call us at <a href="tel:+919667769023" style="color:#0D7377;font-weight:600;">+91-9667769023</a> or reply to this email.</p>
      </div>
      <p style="color:#9ca3af;font-size:12px;margin:0;">This message was sent by Kira, the AI assistant for Dr. Veenoo Agarwal's oncology practice.</p>
    </div>
  </div>
</body>
</html>`;
}
