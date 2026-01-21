# Maxa Architecture

## Overview

Maxa is a gamified Högskoleprovet prep app built with Expo (React Native). The app follows a "Duolingo-style" approach with streaks and an AI coach named Max.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Expo SDK 54 (React Native 0.81, New Architecture) |
| Routing | Expo Router 6 (file-based, typed routes) |
| Styling | NativeWind v4 (Tailwind CSS) |
| Backend | Convex (real-time DB, serverless functions) |
| Auth | Clerk (Google, Apple, Email/Password) |
| Payments | RevenueCat |
| AI | Vercel AI SDK → Google Gemini (hot-swappable) |
| Analytics | PostHog |
| Notifications | Expo Notifications |

## Package Manager

**bun** - All commands use bun:
- `bun install` - Install dependencies
- `bun start` - Start Expo dev server
- `bun run ios` / `bun run android` - Platform-specific
- `bunx convex dev` - Start Convex dev server

## Project Structure

```
maxa/
├── app/                          # Routes (Expo Router)
│   ├── _layout.tsx               # Root: providers wrapper
│   ├── (auth)/                   # Unauthenticated routes
│   │   ├── _layout.tsx
│   │   ├── welcome.tsx
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   ├── (onboarding)/             # Post-signup flow
│   │   ├── _layout.tsx
│   │   ├── dream.tsx
│   │   ├── education.tsx
│   │   ├── city.tsx
│   │   ├── meet-max.tsx
│   │   └── choose-max-style.tsx
│   ├── (app)/                    # Authenticated app
│   │   ├── _layout.tsx           # Tab bar
│   │   ├── (tabs)/
│   │   │   ├── index.tsx         # Dashboard
│   │   │   ├── practice.tsx      # Practice hub
│   │   │   ├── progress.tsx      # Stats
│   │   │   └── profile.tsx       # Profile
│   │   ├── lesson/[id].tsx
│   │   ├── quiz/[id].tsx
│   │   ├── review.tsx
│   │   ├── leaderboard.tsx
│   │   └── invite.tsx
│   └── (paywall)/
│       └── subscribe.tsx
├── components/
│   ├── ui/                       # Base components
│   ├── max/                      # AI coach components
│   ├── practice/                 # Quiz/lesson components
│   ├── dashboard/                # Home screen widgets
│   └── onboarding/               # Onboarding components
├── convex/
│   ├── schema.ts                 # Database schema
│   ├── users.ts
│   ├── questions.ts
│   ├── sessions.ts
│   ├── streaks.ts
│   ├── referrals.ts
│   └── actions/
│       └── max-chat.ts           # AI SDK integration
├── hooks/
│   ├── use-streak.ts
│   ├── use-progress.ts
│   ├── use-subscription.ts
│   └── use-max.ts
├── constants/
│   └── theme.ts
├── lib/
│   ├── convex.ts                 # Convex client setup
│   ├── clerk.ts                  # Clerk config
│   ├── ai.ts                     # Vercel AI SDK setup
│   └── posthog.ts                # Analytics
└── docs/
    ├── ARCHITECTURE.md
    └── ROADMAP.md
```

## Route Groups

| Group | Purpose | Auth Required |
|-------|---------|---------------|
| `(auth)` | Sign in/up flows | No |
| `(onboarding)` | New user setup | Yes (but incomplete profile) |
| `(app)` | Main application | Yes (complete profile) |
| `(paywall)` | Subscription screens | Yes |

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Expo)                         │
├─────────────────────────────────────────────────────────────┤
│  Clerk Auth  │  Convex Queries/Mutations  │  PostHog Events │
└──────┬───────┴──────────────┬─────────────┴────────┬────────┘
       │                      │                      │
       ▼                      ▼                      ▼
┌──────────────┐    ┌─────────────────┐    ┌──────────────┐
│    Clerk     │    │     Convex      │    │   PostHog    │
│   (Auth)     │◄──►│   (Backend)     │    │ (Analytics)  │
└──────────────┘    ├─────────────────┤    └──────────────┘
                    │ - Real-time DB  │
                    │ - Server funcs  │
                    │ - AI SDK calls  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Vercel AI SDK  │
                    │  (AI Gateway)   │
                    ├─────────────────┤
                    │ Google Gemini   │
                    │ (hot-swappable) │
                    └─────────────────┘
```

## AI Architecture

Using **Vercel AI SDK** as a gateway allows:
- Hot-swapping between AI providers (Gemini → OpenAI → Claude)
- Unified streaming API
- Built-in rate limiting and caching
- Easy A/B testing of models

```typescript
// lib/ai.ts
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const ai = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Easy to swap:
// import { createOpenAI } from '@ai-sdk/openai';
// export const ai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
```

## Convex Schema Overview

### Core Tables
- `users` - User profiles, stats, subscription status
- `sections` - HP test sections (ORD, LÄS, MEK, etc.)
- `questions` - Question bank
- `sessions` - Practice session records
- `answers` - Individual answer history

### Social Tables
- `friendships` - Friend connections
- `referrals` - Referral tracking

### Gamification Tables
- `dailyChallenges` - Daily challenge definitions
- `userChallenges` - User challenge progress

### Reference Data
- `educationRequirements` - HP score requirements by program

## Authentication Flow

```
Start → Welcome Screen
          │
          ├─► Sign In ─► Clerk Auth ─► Check onboarding
          │                               │
          └─► Sign Up ─► Clerk Auth ──────┤
                                          │
                    ┌─────────────────────┴─────────────────────┐
                    │                                           │
                    ▼                                           ▼
            Onboarding incomplete                    Onboarding complete
                    │                                           │
                    ▼                                           ▼
            (onboarding) flow                           (app) Dashboard
            Dream → Education → City
            → Meet Max → Choose Style
                    │
                    └─────────────────► (app) Dashboard
```

## Key Patterns

### 1. Real-time Subscriptions
```tsx
// Convex provides real-time updates automatically
const user = useQuery(api.users.current);
const streak = useQuery(api.streaks.get, { userId: user?._id });
```

### 2. Optimistic Updates
```tsx
const updateStreak = useMutation(api.streaks.increment);
// UI updates immediately, syncs in background
```

### 3. Server-side Validation
All gamification logic (streaks, progress) is validated server-side in Convex to prevent cheating.

### 4. AI Rate Limiting
Max AI coach calls are rate-limited per user tier:
- Free: 10/day
- Premium: Unlimited

## Platform Considerations

### Expo Go Limitations
- RevenueCat requires dev builds for testing
- Push notifications need physical device

### Cross-Platform
- All features work on iOS, Android, Web
- Platform-specific code uses `.ios.tsx`, `.android.tsx`, `.web.tsx` extensions

## Environment Variables

```env
# Convex
CONVEX_DEPLOYMENT=
EXPO_PUBLIC_CONVEX_URL=

# Clerk
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=

# PostHog
EXPO_PUBLIC_POSTHOG_API_KEY=

# AI (server-side only, in Convex)
GEMINI_API_KEY=
# OPENAI_API_KEY=  # Ready for hot-swap
```
