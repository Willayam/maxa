import { mutation, query, internalMutation, internalAction } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';
import { getConfirmationEmailHtml } from './emails/confirmationEmail';

// Public mutation - called from frontend
export const join = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();

    // Check if email already exists
    const existing = await ctx.db
      .query('waitlist')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first();

    // Privacy: Return same response whether new or existing
    if (existing) {
      return { success: true };
    }

    // Generate confirmation token
    const confirmationToken = crypto.randomUUID();

    // Insert with pending status
    const id = await ctx.db.insert('waitlist', {
      email,
      createdAt: Date.now(),
      source: args.source,
      status: 'pending',
      confirmationToken,
    });

    // Schedule the email sending action
    await ctx.scheduler.runAfter(0, internal.waitlist.sendConfirmationEmail, {
      waitlistId: id,
      email,
      token: confirmationToken,
    });

    return { success: true };
  },
});

// Internal mutation to update email sent timestamp
export const markEmailSent = internalMutation({
  args: {
    waitlistId: v.id('waitlist'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.waitlistId, {
      confirmationSentAt: Date.now(),
    });
  },
});

// Internal action to send confirmation email via Resend
export const sendConfirmationEmail = internalAction({
  args: {
    waitlistId: v.id('waitlist'),
    email: v.string(),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://maxahp.se';
    const confirmUrl = `${baseUrl}/bekrafta?token=${args.token}`;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Maxa <hej@maxahp.se>',
        to: [args.email],
        subject: 'Bekräfta din plats på Maxas väntelista',
        html: getConfirmationEmailHtml(confirmUrl),
      }),
    });

    if (response.ok) {
      await ctx.runMutation(internal.waitlist.markEmailSent, {
        waitlistId: args.waitlistId,
      });
    } else {
      console.error('Failed to send email:', await response.text());
    }
  },
});

// Mutation to confirm email (called from confirmation page)
export const confirmEmail = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const entry = await ctx.db
      .query('waitlist')
      .withIndex('by_token', (q) => q.eq('confirmationToken', args.token))
      .first();

    if (!entry) {
      return { success: false, error: 'invalid_token' };
    }

    if (entry.status === 'confirmed') {
      return { success: true, alreadyConfirmed: true };
    }

    await ctx.db.patch(entry._id, {
      status: 'confirmed',
      confirmedAt: Date.now(),
    });

    return { success: true, alreadyConfirmed: false };
  },
});

// Query to count only confirmed signups
export const getCount = query({
  handler: async (ctx) => {
    const entries = await ctx.db
      .query('waitlist')
      .filter((q) => q.eq(q.field('status'), 'confirmed'))
      .collect();
    return entries.length;
  },
});
