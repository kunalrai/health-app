import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const create = mutation({
  args: {
    patientId: v.id('patients'),
    type: v.string(),
    title: v.string(),
    content: v.string(),
    reminderDays: v.optional(v.array(v.number())),
    reminderTime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('patientAdvice', {
      ...args,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

export const listByPatient = query({
  args: { patientId: v.id('patients') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('patientAdvice')
      .withIndex('by_patient', (q) => q.eq('patientId', args.patientId))
      .filter((q) => q.eq(q.field('isActive'), true))
      .collect();
  },
});

export const listByType = query({
  args: { type: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('patientAdvice')
      .withIndex('by_type', (q) => q.eq('type', args.type))
      .filter((q) => q.eq(q.field('isActive'), true))
      .collect();
  },
});

export const update = mutation({
  args: {
    id: v.id('patientAdvice'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    reminderDays: v.optional(v.array(v.number())),
    reminderTime: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...updates }) => {
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id('patientAdvice') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isActive: false });
  },
});
