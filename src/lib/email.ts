import sgMail from '@sendgrid/mail';
import { prisma } from './prisma';
import { format } from 'date-fns';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
    console.log('[Email Mock] Would send to:', to);
    console.log('[Email Mock] Subject:', subject);
    return { success: true };
  }

  try {
    await sgMail.send({
      to,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject,
      html,
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export function generateAppointmentEmailHtml(
  patientName: string,
  appointment: {
    title: string;
    type: string;
    startTime: Date;
    endTime: Date;
    notes?: string | null;
  }
): string {
  const formattedDate = format(appointment.startTime, 'EEEE, MMMM do, yyyy');
  const formattedStartTime = format(appointment.startTime, 'h:mm a');
  const formattedEndTime = format(appointment.endTime, 'h:mm a');
  const formattedType = appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1);

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'DM Sans', Arial, sans-serif; line-height: 1.6; color: #1A2B3C; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0D7377 0%, #14919B 100%); color: white; padding: 30px; border-radius: 16px 16px 0 0; }
    .header h1 { margin: 0; font-family: 'Source Serif 4', serif; }
    .content { background: white; padding: 30px; border-radius: 0 0 16px 16px; border: 1px solid #e5e7eb; }
    .appointment-card { background: #FAFBFC; padding: 20px; border-radius: 12px; margin: 20px 0; }
    .appointment-card h3 { color: #0D7377; margin-top: 0; }
    .label { color: #5A6B7C; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .value { font-size: 18px; font-weight: 600; margin: 5px 0 15px; }
    .notes { background: #fffbeb; padding: 15px; border-radius: 8px; margin-top: 20px; }
    .notes h4 { color: #92400e; margin-top: 0; }
    .cta { text-align: center; margin-top: 30px; }
    .cta a { background: #0D7377; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; }
    .footer { text-align: center; margin-top: 30px; color: #5A6B7C; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Appointment Reminder</h1>
    </div>
    <div class="content">
      <p>Dear ${patientName},</p>
      <p>This is a friendly reminder about your upcoming appointment at Hope Oncology.</p>
      
      <div class="appointment-card">
        <h3>${appointment.title}</h3>
        <p class="label">Date</p>
        <p class="value">${formattedDate}</p>
        
        <p class="label">Time</p>
        <p class="value">${formattedStartTime} - ${formattedEndTime}</p>
        
        <p class="label">Type</p>
        <p class="value">${formattedType}</p>
      </div>
      
      ${appointment.notes ? `
      <div class="notes">
        <h4>Additional Notes</h4>
        <p>${appointment.notes}</p>
      </div>
      ` : ''}
      
      <div class="cta">
        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/portal">View in Patient Portal</a>
      </div>
      
      <p style="margin-top: 30px;">Please arrive 15 minutes early and bring any relevant medical documents.</p>
      <p>If you need to reschedule or have any questions, please call us at <strong>(555) 234-5678</strong>.</p>
      
      <div class="footer">
        <p>Hope Oncology<br/>
        Your Partner in Cancer Care</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export async function sendAppointmentEmail(appointmentId: string): Promise<{ success: boolean; error?: string }> {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { patient: true },
  });

  if (!appointment || !appointment.patient) {
    return { success: false, error: 'Appointment or patient not found' };
  }

  if (!appointment.patient.emailOptIn) {
    return { success: false, error: 'Patient has opted out of email notifications' };
  }

  const html = generateAppointmentEmailHtml(appointment.patient.name, {
    title: appointment.title,
    type: appointment.type,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    notes: appointment.notes,
  });

  return sendEmail({
    to: appointment.patient.email,
    subject: `Appointment Reminder: ${appointment.title}`,
    html,
  });
}

export async function sendWelcomeEmail(patient: { name: string; email: string }): Promise<{ success: boolean; error?: string }> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'DM Sans', Arial, sans-serif; line-height: 1.6; color: #1A2B3C; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0D7377 0%, #14919B 100%); color: white; padding: 30px; border-radius: 16px 16px 0 0; }
    .header h1 { margin: 0; font-family: 'Source Serif 4', serif; }
    .content { background: white; padding: 30px; border-radius: 0 0 16px 16px; border: 1px solid #e5e7eb; }
    .cta { text-align: center; margin-top: 30px; }
    .cta a { background: #0D7377; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Hope Oncology</h1>
    </div>
    <div class="content">
      <p>Dear ${patient.name},</p>
      <p>Thank you for choosing Hope Oncology for your cancer care. We are honored to be part of your healing journey.</p>
      <p>Through our patient portal, you can:</p>
      <ul>
        <li>View and manage your appointments</li>
        <li>Update your contact preferences for reminders</li>
        <li>Access your appointment details and preparation instructions</li>
      </ul>
      <div class="cta">
        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/portal">Access Patient Portal</a>
      </div>
      <p>If you have any questions, please don't hesitate to reach out to us at <strong>(555) 234-5678</strong>.</p>
      <p>Warm regards,<br/><strong>Dr. Sarah Mitchell and the Hope Oncology Team</strong></p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to: patient.email,
    subject: 'Welcome to Hope Oncology',
    html,
  });
}
