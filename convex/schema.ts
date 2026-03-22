import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // ── Patients ────────────────────────────────────────────────────
  patients: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    dateOfBirth: v.optional(v.string()),
    medicalRecordNumber: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_email', ['email'])
    .index('by_phone', ['phone']),

  // ── Appointments ─────────────────────────────────────────────────
  appointments: defineTable({
    patientId: v.id('patients'),
    type: v.string(), // "consultation" | "follow-up" | "test-review" | "second-opinion"
    scheduledAt: v.number(), // unix ms
    durationMinutes: v.number(),
    status: v.string(), // "scheduled" | "confirmed" | "completed" | "cancelled"
    notes: v.optional(v.string()),
    remindersSent: v.array(v.string()), // ["sms", "email", "call"]
    createdAt: v.number(),
  })
    .index('by_patient', ['patientId'])
    .index('by_status', ['status'])
    .index('by_scheduled', ['scheduledAt']),

  // ── Patient Advice (doctor configures per patient) ───────────────
  patientAdvice: defineTable({
    patientId: v.id('patients'),
    type: v.string(), // "diet" | "prescription" | "test" | "medication" | "general"
    title: v.string(),
    content: v.string(),
    reminderDays: v.optional(v.array(v.number())), // days before appointment to remind
    reminderTime: v.optional(v.string()), // "09:00" HH:mm
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index('by_patient', ['patientId'])
    .index('by_type', ['type']),

  // ── Kira Chat Conversations ──────────────────────────────────────
  conversations: defineTable({
    sessionId: v.string(),
    patientId: v.optional(v.id('patients')),
    patientName: v.optional(v.string()),
    patientPhone: v.optional(v.string()),
    patientEmail: v.optional(v.string()),
    status: v.string(), // "active" | "completed" | "handed-off"
    summary: v.optional(v.string()), // AI-generated summary
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_session', ['sessionId'])
    .index('by_patient', ['patientId']),

  // ── Chat Messages ────────────────────────────────────────────────
  messages: defineTable({
    conversationId: v.id('conversations'),
    role: v.string(), // "user" | "assistant" | "system"
    content: v.string(),
    metadata: v.optional(v.string()), // JSON for tool calls, actions taken
    createdAt: v.number(),
  }).index('by_conversation', ['conversationId']),

  // ── Reminders ────────────────────────────────────────────────────
  reminders: defineTable({
    patientId: v.id('patients'),
    appointmentId: v.optional(v.id('appointments')),
    adviceId: v.optional(v.id('patientAdvice')),
    type: v.string(), // "appointment" | "test" | "diet" | "medication" | "prescription"
    channel: v.string(), // "sms" | "email" | "call" | "all"
    scheduledAt: v.number(),
    sentAt: v.optional(v.number()),
    status: v.string(), // "pending" | "sent" | "failed"
    content: v.string(), // message to send
    errorMessage: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_patient', ['patientId'])
    .index('by_status', ['status'])
    .index('by_scheduled', ['scheduledAt']),
});
