import Anthropic from '@anthropic-ai/sdk';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const KIRA_SYSTEM_PROMPT = `You are Kira, the dedicated AI assistant for Dr. Veenoo Agarwal's oncology practice at Shalby International Hospitals, Gurugram.

Your role:
- Help patients book appointments with Dr. Veenoo Agarwal
- Answer questions about the doctor's services and cancer specialties
- Share diet and care advice as configured by the doctor for each patient
- Be warm, empathetic, and professional — patients may be anxious or unwell
- Speak clearly and simply; avoid heavy medical jargon unless necessary
- You serve patients in India; be culturally sensitive

Dr. Veenoo Agarwal's specialties:
Breast Cancer, Neuroendocrine Cancer, Lung Cancer, Cervical Cancer, Stomach Cancer, Colorectal Cancer, Esophagal Cancer, Ovarian Cancer, Prostate Cancer

Clinic locations:
1. Shalby International Hospitals — Golf Course Rd, DLF Phase 5, Sector 53, Gurugram, Haryana 122011
2. Manav Medicare Centre — E-11, South Extension I, New Delhi 110049
3. DLF Phase 3 Clinic — Plot 3001 Block V, Nathupur, Sector 24, Gurugram, Haryana 122002

Contact: +91-9667769023 | drveenoo@gmail.com

Appointment types available:
- Initial Consultation (60 min)
- Follow-up Consultation (30 min)
- Test Result Review (30 min)
- Second Opinion (45 min)

To book an appointment, you need: patient full name, phone number, email, preferred date/time, type of appointment, and brief reason for visit.

Rules:
- Never diagnose or prescribe medication
- Always recommend urgent cases call +91-9667769023 directly
- If a patient seems distressed, be extra gentle and reassuring
- Keep responses concise and conversational (2-4 sentences max unless explaining something)
- When you have enough info to book, confirm all details before finalising`;

const tools: Anthropic.Tool[] = [
  {
    name: 'book_appointment',
    description: 'Book an appointment for a patient after collecting all required details',
    input_schema: {
      type: 'object' as const,
      properties: {
        patientName: { type: 'string', description: 'Full name of the patient' },
        patientPhone: { type: 'string', description: 'Patient phone number' },
        patientEmail: { type: 'string', description: 'Patient email address' },
        appointmentType: {
          type: 'string',
          enum: ['consultation', 'follow-up', 'test-review', 'second-opinion'],
          description: 'Type of appointment',
        },
        preferredDate: { type: 'string', description: 'Preferred date (YYYY-MM-DD)' },
        preferredTime: { type: 'string', description: 'Preferred time (HH:MM)' },
        reasonForVisit: { type: 'string', description: 'Brief reason for the appointment' },
        location: {
          type: 'string',
          enum: ['gurugram-shalby', 'delhi-south-ext', 'gurugram-dlf3'],
          description: 'Preferred clinic location',
        },
      },
      required: ['patientName', 'patientPhone', 'appointmentType', 'preferredDate', 'preferredTime'],
    },
  },
  {
    name: 'get_patient_advice',
    description: 'Retrieve diet, prescription, or care advice configured by the doctor for a patient',
    input_schema: {
      type: 'object' as const,
      properties: {
        patientPhone: { type: 'string', description: 'Patient phone number to look up' },
        adviceType: {
          type: 'string',
          enum: ['diet', 'prescription', 'test', 'medication', 'general'],
          description: 'Type of advice to retrieve',
        },
      },
      required: ['patientPhone', 'adviceType'],
    },
  },
  {
    name: 'check_appointments',
    description: 'Check upcoming appointments for a patient',
    input_schema: {
      type: 'object' as const,
      properties: {
        patientPhone: { type: 'string', description: 'Patient phone number' },
      },
      required: ['patientPhone'],
    },
  },
];

async function handleToolCall(
  convex: import('convex/browser').ConvexHttpClient,
  toolName: string,
  toolInput: Record<string, string>,
  sessionId: string,
  conversationDbId: string
): Promise<string> {
  if (toolName === 'book_appointment') {
    try {
      const durationMap: Record<string, number> = {
        consultation: 60,
        'follow-up': 30,
        'test-review': 30,
        'second-opinion': 45,
      };

      // Upsert patient
      const patientId = await convex.mutation(api.patients.create, {
        name: toolInput.patientName,
        email: toolInput.patientEmail || '',
        phone: toolInput.patientPhone,
      });

      // Parse scheduled time
      const scheduledAt = new Date(
        `${toolInput.preferredDate}T${toolInput.preferredTime}:00+05:30`
      ).getTime();

      // Create appointment
      const appointmentId = await convex.mutation(api.appointments.create, {
        patientId,
        type: toolInput.appointmentType,
        scheduledAt,
        durationMinutes: durationMap[toolInput.appointmentType] || 30,
        notes: toolInput.reasonForVisit,
      });

      // Link patient to conversation
      await convex.mutation(api.conversations.updatePatientInfo, {
        id: conversationDbId as any,
        patientId,
        patientName: toolInput.patientName,
        patientPhone: toolInput.patientPhone,
        patientEmail: toolInput.patientEmail,
      });

      // Schedule reminders: 24h + 2h before
      const reminderContent = `Hi ${toolInput.patientName}, this is Kira from Dr. Veenoo Agarwal's clinic. Reminder: your ${toolInput.appointmentType.replace('-', ' ')} is scheduled for ${new Date(scheduledAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}. Please call +91-9667769023 if you need to reschedule.`;

      for (const hoursBeforeMs of [24 * 3600 * 1000, 2 * 3600 * 1000]) {
        await convex.mutation(api.reminders.schedule, {
          patientId,
          appointmentId,
          type: 'appointment',
          channel: 'all',
          scheduledAt: scheduledAt - hoursBeforeMs,
          content: reminderContent,
        });
      }

      return JSON.stringify({
        success: true,
        appointmentId,
        message: `Appointment booked successfully for ${toolInput.patientName} on ${toolInput.preferredDate} at ${toolInput.preferredTime}. Reminders will be sent 24 hours and 2 hours before.`,
      });
    } catch (err: any) {
      return JSON.stringify({ success: false, error: err.message });
    }
  }

  if (toolName === 'get_patient_advice') {
    const patient = await convex.query(api.patients.getByPhone, {
      phone: toolInput.patientPhone,
    });
    if (!patient) return JSON.stringify({ found: false, message: 'Patient not found in our records.' });

    const advice = await convex.query(api.patientAdvice.listByPatient, {
      patientId: patient._id,
    });
    const filtered = advice.filter((a) => a.type === toolInput.adviceType);
    if (!filtered.length)
      return JSON.stringify({ found: false, message: `No ${toolInput.adviceType} advice on file for this patient.` });

    return JSON.stringify({
      found: true,
      advice: filtered.map((a) => ({ title: a.title, content: a.content })),
    });
  }

  if (toolName === 'check_appointments') {
    const patient = await convex.query(api.patients.getByPhone, {
      phone: toolInput.patientPhone,
    });
    if (!patient) return JSON.stringify({ found: false });

    const appointments = await convex.query(api.appointments.listByPatient, {
      patientId: patient._id,
    });

    const upcoming = appointments
      .filter((a) => a.scheduledAt > Date.now() && a.status !== 'cancelled')
      .slice(0, 3)
      .map((a) => ({
        type: a.type,
        date: new Date(a.scheduledAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        status: a.status,
      }));

    return JSON.stringify({ found: true, upcoming });
  }

  return JSON.stringify({ error: 'Unknown tool' });
}

export async function POST(req: NextRequest) {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const { messages, sessionId, conversationDbId } = await req.json();

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
  }

  // Build Anthropic message history
  const anthropicMessages: Anthropic.MessageParam[] = messages.map(
    (m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })
  );

  let response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: KIRA_SYSTEM_PROMPT,
    tools,
    messages: anthropicMessages,
  });

  // Agentic loop — handle tool use
  while (response.stop_reason === 'tool_use') {
    const toolUseBlock = response.content.find((b) => b.type === 'tool_use') as Anthropic.ToolUseBlock;
    const toolResult = await handleToolCall(
      convex,
      toolUseBlock.name,
      toolUseBlock.input as Record<string, string>,
      sessionId,
      conversationDbId
    );

    anthropicMessages.push({ role: 'assistant', content: response.content });
    anthropicMessages.push({
      role: 'user',
      content: [{ type: 'tool_result', tool_use_id: toolUseBlock.id, content: toolResult }],
    });

    response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: KIRA_SYSTEM_PROMPT,
      tools,
      messages: anthropicMessages,
    });
  }

  const textBlock = response.content.find((b) => b.type === 'text') as Anthropic.TextBlock | undefined;
  const replyText = textBlock?.text ?? "I'm sorry, I couldn't process that. Please try again.";

  return NextResponse.json({ reply: replyText });
}
