# Maxa Architecture

## Overview

Maxa is a gamified Högskoleprovet prep app with a mobile app (Expo) and web app (Next.js). The project uses a Turborepo monorepo structure with shared Convex backend.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Monorepo | Turborepo with bun workspaces |
| Mobile | Expo SDK 54 (React Native 0.81, New Architecture) |
| Web | Next.js 15 (App Router) |
| Styling | NativeWind v4 (mobile), Tailwind CSS v4 (web) |
| Backend | Convex (real-time DB, serverless functions, file storage) |
| Auth | Clerk (planned) |
| Payments | RevenueCat (planned) |
| AI | Vercel AI SDK → Google Gemini (planned) |

## Package Manager

**bun** - All commands use bun:
- `bun install` - Install dependencies
- `bun dev` - Start all dev servers (turbo)
- `bun dev:mobile` - Start Expo dev server only
- `bun dev:web` - Start Next.js dev server only
- `bunx convex dev` - Start Convex dev server

## Project Structure

```
maxa/
├── apps/
│   ├── mobile/                   # Expo app (React Native)
│   │   ├── app/                  # Routes (Expo Router)
│   │   ├── components/           # Mobile components
│   │   └── constants/            # Theme tokens
│   └── web/                      # Next.js app
│       └── src/
│           ├── app/              # Routes (App Router)
│           │   ├── gamla-prov/   # Historical HP tests browser
│           │   └── layout.tsx
│           └── components/       # Web components
├── packages/
│   └── shared/                   # Shared code (planned)
├── convex/                       # Convex backend (shared)
│   ├── schema.ts                 # Database schema
│   ├── tests.ts                  # Test queries/mutations
│   └── files.ts                  # File storage queries/mutations
├── content/                      # Static content
│   └── hogskoleprovet-tests/     # HP test PDFs (local, not in git)
├── scripts/
│   ├── download_hogskoleprovet_tests.py  # Scrape HP PDFs from studera.nu
│   └── upload-to-convex.ts       # Upload PDFs to Convex storage
└── docs/
    ├── ARCHITECTURE.md
    └── ROADMAP.md
```

## Route Groups

### Mobile App (Expo Router)
| Group | Purpose | Auth Required |
|-------|---------|---------------|
| `(tabs)` | Main tab bar (Idag, Träna, Jag) | No (currently) |

### Web App (Next.js App Router)
| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/gamla-prov` | Browse historical HP tests |
| `/gamla-prov/[slug]` | Download PDFs for specific test |

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

## Convex Schema

### Current Tables

#### `tests`
Historical Högskoleprovet test administrations:
- `year: number` - 2013-2025
- `season: "vår" | "höst"`
- `date: string` - ISO date (e.g., "2024-10-20")
- `slug: string` - URL-friendly ID (e.g., "hosten-2024")
- `sourceUrl?: string` - studera.nu source page
- Indexes: `by_slug`, `by_year_season`

#### `testFiles`
PDF files linked to tests (stored in Convex file storage):
- `testId: Id<"tests">` - Parent test
- `storageId: Id<"_storage">` - Convex storage reference
- `fileType: "provpass" | "facit" | "kallhanvisning" | "normering"`
- `section?: "verbal" | "kvantitativ"` - For provpass/normering
- `passNumber?: number` - 1-5 for provpass
- `originalFilename: string`
- `sizeBytes: number`
- Index: `by_test`

### Planned Tables
- `users` - User profiles, stats, subscription status
- `questions` - Parsed question bank from PDFs
- `sessions` - Practice session records
- `answers` - Individual answer history

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
