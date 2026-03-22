import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const create = mutation({
  args: {
    patientId: v.id('patients'),
    type: v.string(),
    scheduledAt: v.number(),
    durationMinutes: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('appointments', {
      ...args,
      status: 'scheduled',
      remindersSent: [],
      createdAt: Date.now(),
    });
  },
});

export const listByPatient = query({
  args: { patientId: v.id('patients') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('appointments')
      .withIndex('by_patient', (q) => q.eq('patientId', args.patientId))
      .order('desc')
      .collect();
  },
});

export const listUpcoming = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    return await ctx.db
      .query('appointments')
      .withIndex('by_scheduled', (q) => q.gt('scheduledAt', now))
      .filter((q) => q.neq(q.field('status'), 'cancelled'))
      .order('asc')
      .take(50);
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('appointments').order('desc').take(100);
  },
});

export const get = query({
  args: { id: v.id('appointments') },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const updateStatus = mutation({
  args: {
    id: v.id('appointments'),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const markReminderSent = mutation({
  args: {
    id: v.id('appointments'),
    channel: v.string(),
  },
  handler: async (ctx, args) => {
    const appt = await ctx.db.get(args.id);
    if (!appt) return;
    const sent = [...appt.remindersSent];
    if (!sent.includes(args.channel)) sent.push(args.channel);
    await ctx.db.patch(args.id, { remindersSent: sent });
  },
});

export const cancel = mutation({
  args: { id: v.id('appointments') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: 'cancelled' });
  },
});
