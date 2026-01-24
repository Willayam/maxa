import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const join = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existing = await ctx.db
      .query('waitlist')
      .withIndex('by_email', (q) => q.eq('email', args.email.toLowerCase()))
      .first();

    if (existing) {
      return { success: true, alreadyExists: true };
    }

    await ctx.db.insert('waitlist', {
      email: args.email.toLowerCase(),
      createdAt: Date.now(),
      source: args.source,
    });

    return { success: true, alreadyExists: false };
  },
});

export const getCount = query({
  handler: async (ctx) => {
    const entries = await ctx.db.query('waitlist').collect();
    return entries.length;
  },
});
