# Architecture

**Analysis Date:** 2026-01-26

## Pattern Overview

**Overall:** Monorepo turborepo with shared backend (Convex) and dual frontend (Next.js web + Expo mobile) using shared component library.

**Key Characteristics:**
- Monorepo structure with workspace organization (apps, packages, convex)
- Shared Convex backend serving both web and mobile
- Shared React component library (`@maxa/shared`) for consistent UI across platforms
- Each platform has its own app-specific code and styling approach
- Static file serving for web (PDFs in public), Convex storage for future dynamic content
- Analytics via PostHog on both platforms with graceful degradation

## Layers

**Backend (Convex):**
- Purpose: Real-time database, file storage, authentication
- Location: `convex/` at repo root
- Contains: Schema definitions, queries, mutations, file management
- Depends on: Convex SDK
- Used by: Both web and mobile apps via `convex/react` client

**Web Frontend (Next.js):**
- Purpose: Marketing landing page, test browsing, PDF downloads
- Location: `apps/web/`
- Contains: App Router pages, React components, server/client logic separation
- Depends on: Convex client, shared components, PostHog, Next.js theming
- Used by: End users via HTTP/browser

**Mobile Frontend (Expo/React Native):**
- Purpose: Quiz practice, progress tracking, learning experience
- Location: `apps/mobile/`
- Contains: Expo router screens, React Native components, platform-specific code
- Depends on: Convex client (when connected), shared components, PostHog
- Used by: End users via native app (iOS/Android)

**Shared Components Library:**
- Purpose: Consistent UI/UX across platforms
- Location: `packages/shared/src/`
- Contains: UI components (Button, Card, Text, etc.), design tokens, hooks, utilities
- Depends on: React, React Native (for cross-platform components)
- Used by: Both web and mobile apps

## Data Flow

**Test Listing & Download (Web):**

1. User navigates to `/gamla-prov`
2. `apps/web/src/app/gamla-prov/page.tsx` loads static test data from `apps/web/src/data/tests.ts`
3. Page renders list of tests with links to detail pages
4. User clicks test → navigates to `/gamla-prov/[slug]`
5. `apps/web/src/app/gamla-prov/[slug]/page.tsx` fetches test files from static data
6. Files are organized by type (provpass, facit, normering, kallhanvisning)
7. User downloads PDF via direct link to `/public/pdfs/{slug}/{filename}`

**Waitlist Signup (Web):**

1. User fills `<WaitlistForm>` component
2. Form submits email to Convex `waitlist.insert` mutation
3. Convex stores in `waitlist` table with email, createdAt, source
4. Form shows success/error feedback

**Daily Dashboard (Mobile):**

1. App loads root layout (`apps/mobile/app/_layout.tsx`)
2. PostHogProvider initialized for analytics (auto screen tracking)
3. Navigation Stack renders Tab layout (`apps/mobile/app/(tabs)/_layout.tsx`)
4. User navigates to "Idag" tab (index screen)
5. `apps/mobile/app/(tabs)/index.tsx` renders dashboard with:
   - Greeting + streak (mock data currently)
   - Daily goal progress bar
   - Practice start button
   - Stats cards (days until exam, goal score)
   - Weekly progress section
   - AI coach teaser card
6. All data currently mock (future: load from Convex)

**State Management:**
- Web: Client-side React state, server components for initial rendering
- Mobile: Local React state via hooks, eventual Convex queries for user data
- Convex: Source of truth for persisted data (tests, files, waitlist, user progress)

## Key Abstractions

**Test Entity:**
- Purpose: Represents a Högskoleprovet test administration
- Examples: `convex/schema.ts` (Convex), `apps/web/src/data/tests.ts` (web types)
- Pattern: Defined once in Convex schema, mirrored in TypeScript interfaces on clients
- Properties: year, season (vår/höst), date, slug, sourceUrl

**TestFile Entity:**
- Purpose: Represents a downloadable PDF associated with a test
- Examples: `convex/schema.ts`, `apps/web/src/data/tests.ts`
- Pattern: Linked to test via `testId`, typed by `fileType` (provpass, facit, etc.)
- Storage: Currently in `/public/pdfs/`, future: Convex file storage

**Design Tokens:**
- Purpose: Centralize theme values across platforms
- Examples: `packages/shared/src/constants/theme.ts`, `apps/mobile/constants/theme.ts`, `apps/web/src/app/globals.css`
- Pattern: CSS variables (web), JS constants (mobile) for colors, spacing, borders, shadows
- Semantic tokens (primary, secondary, error) instead of hardcoded hex values

**Component Hierarchy (Shared):**
- Presentational: `Button`, `Card`, `Text`, `ProgressBar`, `Chip`
- Hooks: `useColorScheme` (detects light/dark mode)
- Utilities: `haptics` (haptic feedback for mobile)

## Entry Points

**Web:**
- Location: `apps/web/src/app/layout.tsx` (root layout)
- Triggers: Next.js page load
- Responsibilities: Set up providers (PostHog, Convex, theme), render layout, load fonts

**Web - Home Page:**
- Location: `apps/web/src/app/page.tsx`
- Triggers: User visits `/`
- Responsibilities: Render marketing landing page with hero, features, CTAs, waitlist signup

**Web - Tests Browse:**
- Location: `apps/web/src/app/gamla-prov/page.tsx`
- Triggers: User visits `/gamla-prov`
- Responsibilities: List all tests from static data, link to detail pages

**Web - Test Detail:**
- Location: `apps/web/src/app/gamla-prov/[slug]/page.tsx`
- Triggers: User visits `/gamla-prov/[slug]`
- Responsibilities: Fetch test files, group by type, render download cards

**Mobile:**
- Location: `apps/mobile/app/_layout.tsx` (root layout)
- Triggers: App launch
- Responsibilities: Set up providers (PostHog, theme), load Nunito font, render navigation

**Mobile - Tab Navigation:**
- Location: `apps/mobile/app/(tabs)/_layout.tsx`
- Triggers: Root layout renders
- Responsibilities: Set up bottom tab navigation with 3 screens (Idag, Träna, Jag)

**Mobile - Idag (Dashboard):**
- Location: `apps/mobile/app/(tabs)/index.tsx`
- Triggers: User taps "Idag" tab
- Responsibilities: Show daily progress, goals, AI coach message, streak counter

## Error Handling

**Strategy:** Graceful degradation; optional features degrade if dependencies missing

**Patterns:**
- Convex client initialized only if `NEXT_PUBLIC_CONVEX_URL` set; falls back to render without provider
- PostHog disabled if API key missing; analytics gracefully skipped with console warning
- Static data as fallback for tests (no real-time dependency)
- Error boundaries on routes (`apps/web/src/app/error.tsx`, `apps/web/src/app/not-found.tsx`)

## Cross-Cutting Concerns

**Logging:**
- Web: `console.warn()` for development info (missing env vars)
- Mobile: Similar console logging, no structured logging yet

**Validation:**
- Web: Form validation in `<WaitlistForm>` (client-side required)
- Convex: Admin secret validation on mutations (server-side)
- Types: Full TypeScript coverage with strict mode enabled

**Authentication:**
- Web: Admin secret for mutation access (TODO: proper auth)
- Mobile: Not yet implemented (no user auth)
- Convex: Validates `adminSecret` on create/upload mutations

**Analytics:**
- Web: PostHog pageview tracking on route changes (manual via `usePathname`, `useSearchParams`)
- Mobile: PostHog auto-screen tracking via Expo Router integration
- Both: Respect Do Not Track browser setting, GDPR-compliant EU data residency

---

*Architecture analysis: 2026-01-26*
