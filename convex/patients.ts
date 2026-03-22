import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    dateOfBirth: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('patients')
      .withIndex('by_phone', (q) => q.eq('phone', args.phone))
      .first();
    if (existing) return existing._id;

    return await ctx.db.insert('patients', {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getByPhone = query({
  args: { phone: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('patients')
      .withIndex('by_phone', (q) => q.eq('phone', args.phone))
      .first();
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('patients')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();
  },
});

export const get = query({
  args: { id: v.id('patients') },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('patients').order('desc').take(100);
  },
});

export const update = mutation({
  args: {
    id: v.id('patients'),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...updates }) => {
    await ctx.db.patch(id, updates);
  },
});
