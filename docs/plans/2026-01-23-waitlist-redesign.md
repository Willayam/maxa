# Waitlist Landing Page Redesign - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the Maxa web app as a conversion-focused waitlist landing page with Duolingo-style aesthetics and full dark/light mode support.

**Architecture:** Next.js 15 app with Tailwind CSS, `next-themes` for dark mode, Framer Motion for animations, and Convex for waitlist email storage. Components follow the shared design system from `theme.ts`.

**Tech Stack:** Next.js 15, Tailwind CSS, next-themes, Framer Motion, Lucide React icons, Convex

---

## Task 1: Install Dependencies

**Files:**
- Modify: `apps/web/package.json`

**Step 1: Install required packages**

Run from monorepo root:
```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/columbus && bun add next-themes framer-motion lucide-react --filter=@maxa/web
```

Expected: Packages added to `apps/web/package.json`

**Step 2: Verify installation**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/columbus/apps/web && cat package.json | grep -E "next-themes|framer-motion|lucide-react"
```

Expected: All three packages listed in dependencies

**Step 3: Commit**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/columbus && git add apps/web/package.json bun.lockb && git commit -m "chore(web): add next-themes, framer-motion, lucide-react"
```

---

## Task 2: Update Tailwind Config with Dark Mode & Section Colors

**Files:**
- Modify: `apps/web/tailwind.config.ts`

**Step 1: Update tailwind.config.ts**

Replace entire file with:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/shared/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode semantic colors (defaults)
        background: 'var(--color-background)',
        'background-secondary': 'var(--color-background-secondary)',
        'card-background': 'var(--color-card-background)',
        foreground: 'var(--color-foreground)',
        'foreground-muted': 'var(--color-foreground-muted)',
        border: 'var(--color-border)',

        // Primary (yellow)
        primary: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
          light: 'var(--color-primary-light)',
        },

        // Semantic colors
        success: '#58CC02',
        warning: '#F59E0B',
        error: '#FF2B8F',
        streak: '#FF7A00',

        // Section colors (HP test sections)
        section: {
          ord: '#5B9BD5',
          las: '#4A7FC1',
          mek: '#7B68C1',
          elf: '#9B68C1',
          xyz: '#5BC1A0',
          kva: '#5BC1C1',
          nog: '#5BC15B',
          dtk: '#7BC15B',
        },
      },
      fontFamily: {
        sans: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        'button-3d': '0 4px 0 var(--color-primary-dark)',
        'button-3d-pressed': '0 2px 0 var(--color-primary-dark)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.06)',
        'card-dark': '0 2px 12px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 20px var(--color-primary)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 200, 0, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 200, 0, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

**Step 2: Verify config is valid**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/columbus/apps/web && bun run typecheck
```

Expected: No TypeScript errors

**Step 3: Commit**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/columbus && git add apps/web/tailwind.config.ts && git commit -m "feat(web): add dark mode, section colors, and animations to tailwind"
```

---

## Task 3: Update Global CSS with Dark Mode Variables

**Files:**
- Modify: `apps/web/src/app/globals.css`

**Step 1: Update globals.css**

Replace entire file with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Light mode colors */
    --color-background: #F8F9FA;
    --color-background-secondary: #FFFFFF;
    --color-card-background: #FFFFFF;
    --color-foreground: #2C3E50;
    --color-foreground-muted: #6C7A89;
    --color-border: #E0E6EB;

    --color-primary: #FFC800;
    --color-primary-dark: #E5A400;
    --color-primary-light: #FFF8E1;
  }

  .dark {
    /* Dark mode colors (matching app theme.ts) */
    --color-background: #0F0D1A;
    --color-background-secondary: #1A1625;
    --color-card-background: #1E1A2D;
    --color-foreground: #FFFFFF;
    --color-foreground-muted: #A8A3B8;
    --color-border: #3A3550;

    --color-primary: #FFD60A;
    --color-primary-dark: #E5B800;
    --color-primary-light: #3D3520;
  }

  body {
    @apply bg-background text-foreground antialiased;
    font-family: var(--font-nunito), system-ui, sans-serif;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
}

@layer components {
  /* 3D Button base styles */
  .btn-3d {
    @apply relative font-bold rounded-2xl transition-all duration-150;
    @apply border-b-[4px] border-primary-dark;
    @apply hover:translate-y-[2px] hover:border-b-[2px];
    @apply active:translate-y-[4px] active:border-b-0;
  }
}
```

**Step 2: Commit**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/columbus && git add apps/web/src/app/globals.css && git commit -m "feat(web): add dark mode CSS variables and 3D button styles"
```

---

## Task 4: Create Theme Provider and Toggle

**Files:**
- Create: `apps/web/src/components/theme-provider.tsx`
- Create: `apps/web/src/components/ui/theme-toggle.tsx`

**Step 1: Create theme-provider.tsx**

```typescript
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ReactNode } from 'react';

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
```

**Step 2: Create theme-toggle.tsx**

```typescript
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="w-10 h-10 rounded-xl bg-card-background border-2 border-border flex items-center justify-center">
        <span className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-10 h-10 rounded-xl bg-card-background border-2 border-border flex items-center justify-center hover:border-primary transition-colors"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-primary" />
      ) : (
        <Moon className="w-5 h-5 text-foreground-muted" />
      )}
    </button>
  );
}
```

**Step 3: Commit**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/columbus && git add apps/web/src/components/theme-provider.tsx apps/web/src/components/ui/theme-toggle.tsx && git commit -m "feat(web): add theme provider and toggle component"
```

---

## Task 5: Create Button Component

**Files:**
- Create: `apps/web/src/components/ui/button.tsx`

**Step 1: Create button.tsx**

```typescript
import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'relative font-bold rounded-2xl transition-all duration-150 uppercase tracking-wide',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',

          // Variant styles
          variant === 'primary' && [
            'bg-primary text-foreground',
            'border-b-[4px] border-primary-dark',
            'hover:translate-y-[2px] hover:border-b-[2px]',
            'active:translate-y-[4px] active:border-b-0',
          ],
          variant === 'secondary' && [
            'bg-card-background text-foreground border-2 border-border',
            'hover:border-primary hover:text-primary',
          ],
          variant === 'ghost' && [
            'bg-transparent text-foreground-muted',
            'hover:text-foreground hover:bg-card-background',
          ],

          // Size styles
          size === 'sm' && 'px-4 py-2 text-sm',
          size === 'md' && 'px-6 py-3 text-base',
          size === 'lg' && 'px-8 py-4 text-lg',

          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

**Step 2: Create utils.ts for cn helper**

Create: `apps/web/src/lib/utils.ts`

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Step 3: Install clsx and tailwind-merge**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/columbus && bun add clsx tailwind-merge --filter=@maxa/web
```

**Step 4: Commit**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/columbus && git add apps/web/src/components/ui/button.tsx apps/web/src/lib/utils.ts apps/web/package.json bun.lockb && git commit -m "feat(web): add 3D Button component with variants"
```

---

## Task 6: Create Input Component

**Files:**
- Create: `apps/web/src/components/ui/input.tsx`

**Step 1: Create input.tsx**

```typescript
import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full h-14 px-5 rounded-2xl',
          'bg-card-background border-2 border-border',
          'text-foreground placeholder:text-foreground-muted',
          'font-medium text-base',
          'transition-all duration-200',
          'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
          error && 'border-error focus:border-error focus:ring-error/20',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
```

**Step 2: Commit**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/columbus && git add apps/web/src/components/ui/input.tsx && git commit -m "feat(web): add Input component"
```

---

## Task 7: Create Card Component

**Files:**
- Create: `apps/web/src/components/ui/card.tsx`

**Step 1: Create card.tsx**

```typescript
import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  accentColor?: 'ord' | 'las' | 'mek' | 'elf' | 'xyz' | 'kva' | 'nog' | 'dtk';
}

const accentColorMap = {
  ord: 'border-l-section-ord',
  las: 'border-l-section-las',
  mek: 'border-l-section-mek',
  elf: 'border-l-section-elf',
  xyz: 'border-l-section-xyz',
  kva: 'border-l-section-kva',
  nog: 'border-l-section-nog',
  dtk: 'border-l-section-dtk',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, accentColor, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-card-background rounded-3xl border-2 border-border p-6',
          'transition-all duration-200',
          hover && [
            'hover:-translate-y-1 hover:shadow-lg',
            'dark:hover:shadow-card-dark',
          ],
          accentColor && ['border-l-4', accentColorMap[accentColor]],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
```

**Step 2: Commit**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/columbus && git add apps/web/src/components/ui/card.tsx && git commit -m "feat(web): add Card component with section color accents"
```

---

## Task 8: Create FeatureCard Component

**Files:**
- Create: `apps/web/src/components/feature-card.tsx`

**Step 1: Create feature-card.tsx**

```typescript
'use client';

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';

export interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  accentColor: 'ord' | 'las' | 'mek' | 'elf' | 'xyz' | 'kva' | 'nog' | 'dtk';
  delay?: number;
}

const iconBgMap = {
  ord: 'bg-section-ord/10 text-section-ord',
  las: 'bg-section-las/10 text-section-las',
  mek: 'bg-section-mek/10 text-section-mek',
  elf: 'bg-section-elf/10 text-section-elf',
  xyz: 'bg-section-xyz/10 text-section-xyz',
  kva: 'bg-section-kva/10 text-section-kva',
  nog: 'bg-section-nog/10 text-section-nog',
  dtk: 'bg-section-dtk/10 text-section-dtk',
};

export function FeatureCard({
  icon,
  title,
  description,
  accentColor,
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Card hover accentColor={accentColor} className="h-full">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
            iconBgMap[accentColor]
          )}
        >
          {icon}
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-foreground-muted">{description}</p>
      </Card>
    </motion.div>
  );
}
```

**Step 2: Commit**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/columbus && git add apps/web/src/components/feature-card.tsx && git commit -m "feat(web): add FeatureCard component with animations"
```

---

## Task 9: Create PhoneMockup Component

**Files:**
- Create: `apps/web/src/components/phone-mockup.tsx`

**Step 1: Create phone-mockup.tsx**

```typescript
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface PhoneMockupProps {
  src: string;
  alt: string;
  className?: string;
  animate?: boolean;
}

export function PhoneMockup({
  src,
  alt,
  className,
  animate = true,
}: PhoneMockupProps) {
  const Wrapper = animate ? motion.div : 'div';
  const wrapperProps = animate
    ? {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
      }
    : {};

  return (
    <Wrapper
      className={cn('relative', className)}
      {...(wrapperProps as Record<string, unknown>)}
    >
      {/* Phone frame */}
      <div className="relative mx-auto w-[280px] h-[580px] bg-foreground rounded-[3rem] p-2 shadow-2xl">
        {/* Screen bezel */}
        <div className="relative w-full h-full bg-background rounded-[2.5rem] overflow-hidden">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-foreground rounded-b-2xl z-10" />

          {/* Screenshot */}
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover object-top"
            sizes="280px"
          />
        </div>
      </div>

      {/* Floating effect shadow */}
      {animate && (
        <motion.div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-4 bg-foreground/10 dark:bg-white/5 rounded-full blur-xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </Wrapper>
  );
}
```

**Step 2: Commit**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/columbus && git add apps/web/src/components/phone-mockup.tsx && git commit -m "feat(web): add PhoneMockup component"
```

---

## Task 10: Create WaitlistForm Component

**Files:**
- Create: `apps/web/src/components/waitlist-form.tsx`

**Step 1: Create waitlist-form.tsx**

Note: This uses local state for now. Convex integration will be added in Task 12.

```typescript
'use client';

import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export interface WaitlistFormProps {
  className?: string;
}

export function WaitlistForm({ className }: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Ange en giltig e-postadress');
      return;
    }

    setStatus('loading');

    // TODO: Replace with Convex mutation
    // Simulate API call for now
    await new Promise(resolve => setTimeout(resolve, 1000));

    setStatus('success');
    setEmail('');
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
            <CheckCircle className="w-6 h-6" />
            <span className="font-semibold">Du är på listan! Vi hör av oss snart.</span>
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

**Step 2: Commit**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/columbus && git add apps/web/src/components/waitlist-form.tsx && git commit -m "feat(web): add WaitlistForm component"
```

---

## Task 11: Create New Header Component

**Files:**
- Modify: `apps/web/src/components/site/site-header.tsx`

**Step 1: Update site-header.tsx**

Replace entire file:

```typescript
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../ui/theme-toggle';

export function SiteHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black text-primary">Maxa</span>
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
```

**Step 2: Commit**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/columbus && git add apps/web/src/components/site/site-header.tsx && git commit -m "feat(web): update header with theme toggle"
```

---

## Task 12: Set Up Convex Waitlist Schema

**Files:**
- Create: `convex/schema.ts` (if not exists)
- Create: `convex/waitlist.ts`

**Step 1: Check if Convex is set up in the monorepo**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/columbus && ls -la convex/ 2>/dev/null || echo "Convex not set up"
```

If Convex directory doesn't exist, create it:

```bash
mkdir -p /Users/williamlarsten/conductor/workspaces/maxa/columbus/convex
```

**Step 2: Create convex/schema.ts**

```typescript
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  waitlist: defineTable({
    email: v.string(),
    createdAt: v.number(),
    source: v.optional(v.string()),
  }).index('by_email', ['email']),
});
```

**Step 3: Create convex/waitlist.ts**

```typescript
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
```

**Step 4: Commit**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/columbus && git add convex/ && git commit -m "feat(convex): add waitlist schema and mutations"
```

---

## Task 13: Create Landing Page

**Files:**
- Create: `apps/web/src/app/page.tsx`
- Delete or modify: `apps/web/src/app/[[...slug]]/page.tsx`

**Step 1: Create placeholder app screenshots directory**

```bash
mkdir -p /Users/williamlarsten/conductor/workspaces/maxa/columbus/apps/web/public/screenshots
```

Note: Add actual app screenshots later. For now, we'll use placeholder paths.

**Step 2: Create new page.tsx**

Create: `apps/web/src/app/page.tsx`

```typescript
'use client';

import { motion } from 'framer-motion';
import {
  BookOpen,
  Target,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { SiteHeader } from '@/components/site/site-header';
import { WaitlistForm } from '@/components/waitlist-form';
import { FeatureCard } from '@/components/feature-card';
import { PhoneMockup } from '@/components/phone-mockup';

const features = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Träna alla HP-delar',
    description: 'ORD, LÄS, MEK, ELF, XYZ, KVA, NOG och DTK - allt på ett ställe.',
    accentColor: 'ord' as const,
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Dagliga mål & streaks',
    description: 'Bygg studievanor som varar med dagliga utmaningar och streaks.',
    accentColor: 'xyz' as const,
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Följ din utveckling',
    description: 'Se dina framsteg i realtid och fokusera på dina svaga områden.',
    accentColor: 'mek' as const,
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'Max - din AI-coach',
    description: 'Få personlig hjälp och förklaringar från din AI-studiekompis.',
    accentColor: 'kva' as const,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight mb-6">
                Maxa ditt{' '}
                <span className="text-primary">HP-resultat</span>
              </h1>
              <p className="text-xl text-foreground-muted mb-8 max-w-lg">
                Plugga smart för Högskoleprovet med gamifierad träning och din personliga AI-coach Max.
              </p>
              <WaitlistForm className="max-w-md" />
              <p className="mt-4 text-sm text-foreground-muted">
                Bli en av de första att testa Maxa. Appen lanseras snart!
              </p>
            </motion.div>

            {/* Right: Phone mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <PhoneMockup
                src="/screenshots/dashboard.png"
                alt="Maxa app dashboard"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-background-secondary">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              Allt du behöver för att lyckas
            </h2>
            <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
              Maxa kombinerar beprövade studietekniker med modern AI för att hjälpa dig nå dina mål.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex justify-center gap-4"
            >
              <PhoneMockup
                src="/screenshots/practice.png"
                alt="Maxa träningsläge"
                className="-rotate-6"
              />
              <PhoneMockup
                src="/screenshots/progress.png"
                alt="Maxa framsteg"
                className="rotate-6 mt-12"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                Designad för att du ska lyckas
              </h2>
              <p className="text-lg text-foreground-muted mb-6">
                Maxa gör pluggandet roligt med dagliga utmaningar, streaks och en AI-coach som hjälper dig när du kör fast.
              </p>
              <ul className="space-y-3">
                {[
                  'Anpassad till Högskoleprovets format',
                  'Spaced repetition för bättre inlärning',
                  'Detaljerad statistik över dina framsteg',
                  'Fungerar offline - plugga var som helst',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-background-secondary">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              Redo att maxa ditt HP?
            </h2>
            <p className="text-lg text-foreground-muted mb-8">
              Gå med i väntelistan och bli en av de första att testa Maxa.
            </p>
            <WaitlistForm className="max-w-md mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-2xl font-black text-primary">Maxa</div>
          <p className="text-sm text-foreground-muted">
            &copy; {new Date().getFullYear()} Maxa. Alla rättigheter förbehållna.
          </p>
        </div>
      </footer>
    </div>
  );
}
```

**Step 3: Remove or rename the old dynamic route**

```bash
mv /Users/williamlarsten/conductor/workspaces/maxa/columbus/apps/web/src/app/[[...slug]] /Users/williamlarsten/conductor/workspaces/maxa/columbus/apps/web/src/app/_old-content-pages
```

**Step 4: Commit**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/columbus && git add apps/web/src/app/ apps/web/public/ && git commit -m "feat(web): add waitlist landing page"
```

---

## Task 14: Update Root Layout with Theme Provider

**Files:**
- Modify: `apps/web/src/app/layout.tsx`

**Step 1: Update layout.tsx**

Replace entire file:

```typescript
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: 'Maxa - Högskoleprovet Prep',
  description: 'Plugga smart för Högskoleprovet med Maxa. Gamifierad träning och AI-coach.',
  keywords: ['högskoleprovet', 'HP', 'plugga', 'träning', 'AI', 'studier'],
  openGraph: {
    title: 'Maxa - Högskoleprovet Prep',
    description: 'Plugga smart för Högskoleprovet med Maxa',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" className={nunito.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

**Step 2: Commit**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/columbus && git add apps/web/src/app/layout.tsx && git commit -m "feat(web): add ThemeProvider to root layout"
```

---

## Task 15: Add TypeScript Path Alias

**Files:**
- Modify: `apps/web/tsconfig.json`

**Step 1: Verify tsconfig has path alias**

Check if `@/*` path alias exists:

```bash
cat /Users/williamlarsten/conductor/workspaces/maxa/columbus/apps/web/tsconfig.json | grep -A 5 "paths"
```

If not present, add to `compilerOptions`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Step 2: Verify build**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/columbus/apps/web && bun run typecheck
```

Expected: No TypeScript errors

**Step 3: Commit (if changed)**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/columbus && git add apps/web/tsconfig.json && git commit -m "chore(web): ensure path alias configured" || echo "No changes to commit"
```

---

## Task 16: Add Placeholder Screenshots

**Files:**
- Create: `apps/web/public/screenshots/dashboard.png`
- Create: `apps/web/public/screenshots/practice.png`
- Create: `apps/web/public/screenshots/progress.png`

**Step 1: Create placeholder images**

For now, create simple placeholder files. Replace with real screenshots later.

```bash
mkdir -p /Users/williamlarsten/conductor/workspaces/maxa/columbus/apps/web/public/screenshots
```

Note: You'll need to add actual screenshots from the mobile app. These can be:
- Screenshots from iOS Simulator
- Screenshots from Android Emulator
- Figma exports

For now, the page will show broken images until screenshots are added.

**Step 2: Add .gitkeep to preserve directory**

```bash
touch /Users/williamlarsten/conductor/workspaces/maxa/columbus/apps/web/public/screenshots/.gitkeep
```

**Step 3: Commit**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/columbus && git add apps/web/public/screenshots/.gitkeep && git commit -m "chore(web): add screenshots directory placeholder"
```

---

## Task 17: Test the Application

**Step 1: Start dev server**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/columbus && bun run dev --filter=@maxa/web
```

**Step 2: Verify in browser**

Open http://localhost:3000 and check:
- [ ] Page loads without errors
- [ ] Header displays with theme toggle
- [ ] Theme toggle switches between light/dark mode
- [ ] Waitlist form accepts email input
- [ ] Feature cards display with animations
- [ ] Responsive layout works on mobile viewport

**Step 3: Fix any issues found**

Address any runtime errors or visual issues.

---

## Task 18: Final Commit and Summary

**Step 1: Verify all changes**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/columbus && git status
```

**Step 2: Add any uncommitted files**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/columbus && git add -A && git status
```

**Step 3: Create summary commit if needed**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/columbus && git commit -m "feat(web): complete waitlist landing page redesign" --allow-empty
```

---

## Summary

This plan creates a complete waitlist landing page with:

1. **Theme System**: Dark/light mode with CSS variables matching the mobile app
2. **UI Components**: Button, Input, Card with Duolingo-style 3D effects
3. **Landing Page Components**: FeatureCard, PhoneMockup, WaitlistForm
4. **Animations**: Framer Motion for smooth page transitions
5. **Convex Integration**: Waitlist schema ready for email capture

**Files Created:**
- `apps/web/src/components/theme-provider.tsx`
- `apps/web/src/components/ui/theme-toggle.tsx`
- `apps/web/src/components/ui/button.tsx`
- `apps/web/src/components/ui/input.tsx`
- `apps/web/src/components/ui/card.tsx`
- `apps/web/src/components/feature-card.tsx`
- `apps/web/src/components/phone-mockup.tsx`
- `apps/web/src/components/waitlist-form.tsx`
- `apps/web/src/lib/utils.ts`
- `apps/web/src/app/page.tsx`
- `convex/schema.ts`
- `convex/waitlist.ts`

**Files Modified:**
- `apps/web/tailwind.config.ts`
- `apps/web/src/app/globals.css`
- `apps/web/src/app/layout.tsx`
- `apps/web/src/components/site/site-header.tsx`

**Next Steps After Implementation:**
1. Add real app screenshots to `/screenshots/`
2. Set up Convex deployment and connect WaitlistForm
3. Add Resend integration for confirmation emails
4. Set up analytics (PostHog) for conversion tracking
