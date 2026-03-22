import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const schedule = mutation({
  args: {
    patientId: v.id('patients'),
    appointmentId: v.optional(v.id('appointments')),
    adviceId: v.optional(v.id('patientAdvice')),
    type: v.string(),
    channel: v.string(),
    scheduledAt: v.number(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('reminders', {
      ...args,
      status: 'pending',
      createdAt: Date.now(),
    });
  },
});

export const listPending = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    return await ctx.db
      .query('reminders')
      .withIndex('by_scheduled', (q) => q.lte('scheduledAt', now))
      .filter((q) => q.eq(q.field('status'), 'pending'))
      .collect();
  },
});

export const listByPatient = query({
  args: { patientId: v.id('patients') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('reminders')
      .withIndex('by_patient', (q) => q.eq('patientId', args.patientId))
      .order('desc')
      .collect();
  },
});

export const markSent = mutation({
  args: { id: v.id('reminders') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: 'sent', sentAt: Date.now() });
  },
});

export const markFailed = mutation({
  args: { id: v.id('reminders'), errorMessage: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: 'failed',
      errorMessage: args.errorMessage,
    });
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('reminders').order('desc').take(100);
  },
});
