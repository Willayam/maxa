# Email Waitlist Double Opt-in Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement GDPR-compliant double opt-in email waitlist using Convex + Resend.

**Architecture:** User submits email → Convex creates pending entry with token → Convex action sends confirmation email via Resend → User clicks link → `/bekrafta` page confirms and marks entry as confirmed.

**Tech Stack:** Convex (mutations, actions, scheduler), Resend API (email), Next.js (confirmation page)

---

## Task 1: Update Convex Schema for Double Opt-in

**Files:**
- Modify: `convex/schema.ts:35-39`

**Step 1: Update waitlist table schema**

Replace lines 35-39 with:

```typescript
  // Waitlist signups with double opt-in
  waitlist: defineTable({
    email: v.string(),
    createdAt: v.number(),
    source: v.optional(v.string()),
    status: v.union(v.literal("pending"), v.literal("confirmed")),
    confirmationToken: v.string(),
    confirmationSentAt: v.optional(v.number()),
    confirmedAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_token", ["confirmationToken"]),
```

**Step 2: Verify schema compiles**

Run: `cd /Users/williamlarsten/conductor/workspaces/maxa/baghdad-v1 && bunx convex dev --once`
Expected: Schema should compile without errors

**Step 3: Commit**

```bash
git add convex/schema.ts
git commit -m "feat(waitlist): add double opt-in fields to schema"
```

---

## Task 2: Create Email Template Helper

**Files:**
- Create: `convex/emails/confirmationEmail.ts`

**Step 1: Create emails directory and template file**

```typescript
export function getConfirmationEmailHtml(confirmUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8F9FA;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 480px; width: 100%; border-collapse: collapse;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <span style="font-size: 32px; font-weight: 900; color: #FFC800;">Maxa</span>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background-color: #FFFFFF; border-radius: 24px; border: 2px solid #E0E6EB; padding: 40px 32px;">

              <h1 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 900; color: #2C3E50; text-align: center;">
                Bekräfta din e-post
              </h1>

              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #6C7A89; text-align: center;">
                Tack för att du vill vara med på Maxas väntelista! Klicka på knappen nedan för att bekräfta din e-postadress.
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <a href="${confirmUrl}"
                       style="display: inline-block;
                              padding: 16px 40px;
                              background-color: #FFC800;
                              color: #2C3E50;
                              font-size: 16px;
                              font-weight: 800;
                              text-decoration: none;
                              text-transform: uppercase;
                              letter-spacing: 0.5px;
                              border-radius: 16px;
                              border-bottom: 4px solid #E5A400;">
                      Bekräfta e-post
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0 0; font-size: 14px; color: #6C7A89; text-align: center;">
                Fungerar inte knappen? Kopiera och klistra in den här länken:
              </p>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #A8A3B8; text-align: center; word-break: break-all;">
                ${confirmUrl}
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 24px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #6C7A89;">
                Du får det här mejlet för att du registrerade dig på maxahp.se
              </p>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #A8A3B8;">
                © ${new Date().getFullYear()} Maxa. Alla rättigheter förbehållna.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}
```

**Step 2: Commit**

```bash
git add convex/emails/confirmationEmail.ts
git commit -m "feat(waitlist): add confirmation email template"
```

---

## Task 3: Refactor Waitlist Backend with Double Opt-in

**Files:**
- Modify: `convex/waitlist.ts`

**Step 1: Replace entire file with new implementation**

```typescript
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
```

**Step 2: Verify Convex compiles**

Run: `cd /Users/williamlarsten/conductor/workspaces/maxa/baghdad-v1 && bunx convex dev --once`
Expected: Should compile without errors

**Step 3: Commit**

```bash
git add convex/waitlist.ts
git commit -m "feat(waitlist): implement double opt-in with Resend email"
```

---

## Task 4: Update WaitlistForm to Use Convex Mutation

**Files:**
- Modify: `apps/web/src/components/waitlist-form.tsx`

**Step 1: Replace entire file with Convex-connected version**

```typescript
'use client';

import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Loader2 } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Button } from './ui/button';
import { Input } from './ui/input';

export interface WaitlistFormProps {
  className?: string;
  source?: string;
}

export function WaitlistForm({ className, source }: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const joinWaitlist = useMutation(api.waitlist.join);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Ange en giltig e-postadress');
      return;
    }

    setStatus('loading');

    try {
      await joinWaitlist({ email, source });
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
      setErrorMessage('Något gick fel. Försök igen.');
    }
  };

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 text-success"
          >
            <Mail className="w-6 h-6" />
            <span className="font-semibold">
              Kolla din inkorg! Vi har skickat en bekräftelselänk.
            </span>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Din e-postadress"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                error={status === 'error'}
                disabled={status === 'loading'}
              />
              {status === 'error' && (
                <p className="mt-2 text-sm text-error">{errorMessage}</p>
              )}
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={status === 'loading'}
              className="whitespace-nowrap"
            >
              {status === 'loading' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Få tidig tillgång'
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
```

**Step 2: Verify TypeScript compiles**

Run: `cd /Users/williamlarsten/conductor/workspaces/maxa/baghdad-v1/apps/web && bun run lint`
Expected: No errors

**Step 3: Commit**

```bash
git add apps/web/src/components/waitlist-form.tsx
git commit -m "feat(waitlist): connect form to Convex mutation"
```

---

## Task 5: Create Confirmation Page

**Files:**
- Create: `apps/web/src/app/bekrafta/page.tsx`

**Step 1: Create the bekrafta directory and page**

```typescript
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { SiteHeader } from '@/components/site/site-header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function ConfirmContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const confirmEmail = useMutation(api.waitlist.confirmEmail);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    confirmEmail({ token })
      .then((result) => {
        if (result.success) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      })
      .catch(() => {
        setStatus('error');
      });
  }, [token, confirmEmail]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full text-center"
    >
      {status === 'loading' && (
        <div className="space-y-4">
          <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin" />
          <p className="text-xl font-semibold text-foreground">
            Bekräftar din e-post...
          </p>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-6">
          <div className="w-20 h-20 mx-auto bg-success/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <h1 className="text-3xl font-black text-foreground">
            Du är på listan!
          </h1>
          <p className="text-lg text-foreground-muted">
            Tack för att du bekräftade din e-post. Vi hör av oss så fort Maxa är redo att lanseras!
          </p>
          <Link href="/">
            <Button size="lg">Tillbaka till startsidan</Button>
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-6">
          <div className="w-20 h-20 mx-auto bg-error/20 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-error" />
          </div>
          <h1 className="text-3xl font-black text-foreground">
            Något gick fel
          </h1>
          <p className="text-lg text-foreground-muted">
            Länken verkar vara ogiltig eller har redan använts. Prova att registrera dig igen.
          </p>
          <Link href="/">
            <Button size="lg">Tillbaka till startsidan</Button>
          </Link>
        </div>
      )}
    </motion.div>
  );
}

export default function ConfirmPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="flex items-center justify-center min-h-[80vh] px-6 pt-16">
        <Suspense
          fallback={
            <div className="text-center">
              <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin" />
            </div>
          }
        >
          <ConfirmContent />
        </Suspense>
      </main>
    </div>
  );
}
```

**Step 2: Verify page builds**

Run: `cd /Users/williamlarsten/conductor/workspaces/maxa/baghdad-v1/apps/web && bun run build`
Expected: Build should succeed

**Step 3: Commit**

```bash
git add apps/web/src/app/bekrafta/page.tsx
git commit -m "feat(waitlist): add email confirmation page"
```

---

## Task 6: Add Source Tracking to Homepage Forms

**Files:**
- Modify: `apps/web/src/app/page.tsx`

**Step 1: Update WaitlistForm calls with source prop**

Find line 64 (hero section form):
```typescript
<WaitlistForm className="max-w-md" />
```
Replace with:
```typescript
<WaitlistForm className="max-w-md" source="hero" />
```

Find line 180 (footer CTA form):
```typescript
<WaitlistForm className="max-w-md mx-auto" />
```
Replace with:
```typescript
<WaitlistForm className="max-w-md mx-auto" source="footer-cta" />
```

**Step 2: Commit**

```bash
git add apps/web/src/app/page.tsx
git commit -m "feat(waitlist): add source tracking to forms"
```

---

## Task 7: Set Environment Variables

**Step 1: Add Resend API key to Convex**

Run: `cd /Users/williamlarsten/conductor/workspaces/maxa/baghdad-v1 && bunx convex env set RESEND_API_KEY <your-key>`

Note: Get API key from https://resend.com/api-keys

**Step 2: Add app URL to Convex**

Run: `bunx convex env set NEXT_PUBLIC_APP_URL https://maxahp.se`

For local testing, use: `bunx convex env set NEXT_PUBLIC_APP_URL http://localhost:3000`

---

## Task 8: End-to-End Verification

**Step 1: Start dev servers**

Terminal 1: `cd /Users/williamlarsten/conductor/workspaces/maxa/baghdad-v1 && bunx convex dev`
Terminal 2: `cd /Users/williamlarsten/conductor/workspaces/maxa/baghdad-v1 && bun dev:web`

**Step 2: Test signup flow**

1. Open http://localhost:3000
2. Enter email in hero section form
3. Verify "Kolla din inkorg!" success message appears
4. Check Convex dashboard for new waitlist entry with status "pending"
5. Check Resend dashboard for sent email (or inbox if using real email)

**Step 3: Test confirmation flow**

1. Click confirmation link from email (or manually navigate to `/bekrafta?token=<token>`)
2. Verify success page appears with "Du är på listan!"
3. Check Convex dashboard - entry should now have status "confirmed"

**Step 4: Test duplicate handling**

1. Submit same email again
2. Verify same success message appears (no error, privacy preserved)
3. Verify no new entry created in database

---

## Summary

| Task | Files | Description |
|------|-------|-------------|
| 1 | `convex/schema.ts` | Add double opt-in fields |
| 2 | `convex/emails/confirmationEmail.ts` | Email template |
| 3 | `convex/waitlist.ts` | Backend logic |
| 4 | `apps/web/src/components/waitlist-form.tsx` | Connect to Convex |
| 5 | `apps/web/src/app/bekrafta/page.tsx` | Confirmation page |
| 6 | `apps/web/src/app/page.tsx` | Source tracking |
| 7 | Convex env vars | RESEND_API_KEY, NEXT_PUBLIC_APP_URL |
| 8 | Manual testing | E2E verification |
