import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const create = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert('conversations', {
      sessionId: args.sessionId,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getBySession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('conversations')
      .withIndex('by_session', (q) => q.eq('sessionId', args.sessionId))
      .first();
  },
});

export const updatePatientInfo = mutation({
  args: {
    id: v.id('conversations'),
    patientId: v.optional(v.id('patients')),
    patientName: v.optional(v.string()),
    patientPhone: v.optional(v.string()),
    patientEmail: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...updates }) => {
    await ctx.db.patch(id, { ...updates, updatedAt: Date.now() });
  },
});

export const complete = mutation({
  args: { id: v.id('conversations'), summary: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: 'completed',
      summary: args.summary,
      updatedAt: Date.now(),
    });
  },
});

export const addMessage = mutation({
  args: {
    conversationId: v.id('conversations'),
    role: v.string(),
    content: v.string(),
    metadata: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.conversationId, { updatedAt: Date.now() });
    return await ctx.db.insert('messages', {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getMessages = query({
  args: { conversationId: v.id('conversations') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('messages')
      .withIndex('by_conversation', (q) =>
        q.eq('conversationId', args.conversationId)
      )
      .order('asc')
      .collect();
  },
});

export const listRecent = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('conversations').order('desc').take(50);
  },
});
