# Architecture

**Analysis Date:** 2026-01-26

## Pattern Overview

**Overall:** Next.js App Router with static generation (SSG) for content pages, client-side interactivity via Convex real-time database, and shared Expo mobile app pointing to same backend.

**Key Characteristics:**
- Static site generation (SSG) for all public test listing pages using `generateStaticParams()`
- Client-side rendering (CSR) for form submissions and interactive features
- Convex as shared backend: real-time database + file storage for both web and mobile apps
- Monorepo structure (Turborepo) with shared UI components via `@maxa/shared` package
- SEO-optimized with dynamic metadata generation and semantic HTML
- Theme-aware CSS with CSS custom properties supporting light/dark mode

## Layers

**Presentation Layer (Next.js Pages & Components):**
- Purpose: Render server-side HTML for SEO, handle client-side interactivity with React components
- Location: `apps/web/src/app/` (pages), `apps/web/src/components/` (reusable UI)
- Contains: Page components (`.tsx`), layout files, server/client components
- Depends on: Convex client, theme context, PostHog analytics
- Used by: Browser clients visiting maxa.app

**Data Access Layer (Convex):**
- Purpose: Real-time database, file storage, business logic (queries/mutations)
- Location: `convex/` at repository root
- Contains: Schema definition, queries (`tests.ts`, `files.ts`), mutations (`waitlist.ts`)
- Depends on: Convex cloud infrastructure
- Used by: Web app (Next.js) and mobile app (Expo) via React hooks

**Static Content Layer:**
- Purpose: Pre-generated static test data and PDF files
- Location: `apps/web/src/data/tests.ts` (metadata), `apps/web/public/pdfs/` (files)
- Contains: Type definitions for tests/files, static test list, PDF URLs
- Depends on: None (pure data)
- Used by: Test listing and detail pages for SSG

**Shared Component Library:**
- Purpose: Code reuse across web and mobile apps
- Location: `packages/shared/src/`
- Contains: UI components, hooks (theme, animation), constants, utilities
- Depends on: React, React Native Web, NativeWind (mobile only)
- Used by: Both `apps/web/` and `apps/mobile/`

## Data Flow

**Test List & Detail Pages (SSG):**

1. Build time: `generateStaticParams()` in `[slug]/page.tsx` iterates `tests` array from `apps/web/src/data/tests.ts`
2. Next.js generates static HTML for each test slug (e.g., `/hogskoleprovet/hosten-2024`)
3. Static pages contain links to PDFs in `apps/web/public/pdfs/{slug}/`
4. No Convex dependency for test pages—purely static generation

**Waitlist Signup (Interactive):**

1. User submits email via `WaitlistForm` component (client-side)
2. Form validates locally, then calls Convex mutation `api.waitlist.createSignup()`
3. Convex creates record in `waitlist` table with `pending` status and confirmation token
4. Email sent via Resend (configured in `convex/emails/`)
5. User clicks confirmation link → navigates to `/bekrafta?token=XXX`
6. `/bekrafta` page (client-side) calls `api.waitlist.confirmEmail()` mutation
7. Token validated, status updated to `confirmed`

**Analytics Flow:**

1. PostHog provider initialized in `apps/web/src/providers/posthog-provider.tsx` (client-side)
2. On route change: `PageViewTracker` component captures `$pageview` event with URL
3. Mobile app uses Expo Router's automatic screen tracking (no manual pageview needed)

**State Management:**

- **Static pages:** No state (pure SSG HTML)
- **Interactive pages:** React hooks (`useState`, `useEffect`) for local UI state
- **Server state:** Convex queries/mutations for persistent data
- **Theme state:** Context provider in `ThemeProvider` using `next-themes` (respects OS preference)

## Key Abstractions

**Test Data Structure:**

- `Test` interface defines metadata (year, season, date, slug)
- `TestFile` interface describes individual PDFs (type, section, filename, size)
- Static `tests` array in `apps/web/src/data/tests.ts` is source of truth for listing
- Helper functions: `getTestBySlug()`, `getPdfUrl()` normalize access

**Page Components as Data Containers:**

- `hogskoleprovet/page.tsx`: Lists all tests, groups by year, client-side rendering
- `hogskoleprovet/[slug]/page.tsx`: Displays single test with file download links, SSG with dynamic metadata
- `page.tsx` (home): Landing page with hero, features, animated mockups, client-side

**Providers Pattern:**

- `ConvexClientProvider`: Lazily initializes Convex client only on client-side (avoids SSR issues)
- `PostHogProvider`: Wraps app with analytics, disables gracefully if no API key
- `ThemeProvider`: Uses `next-themes` for light/dark mode with system preference
- All three composed in `layout.tsx` with `Suspense` boundary

**File Organization:**

- `site/` components: Reusable layout parts (header, footer) used across pages
- `ui/` components: Headless UI building blocks (button, input, card)
- Page-specific components inline or in parent directory (e.g., `WaitlistForm`)

## Entry Points

**Web App Root:**
- Location: `apps/web/src/app/layout.tsx`
- Triggers: User visits maxa.app or any subpath
- Responsibilities: Set up providers (Convex, PostHog, theme), define root metadata, load Nunito font

**Home Page:**
- Location: `apps/web/src/app/page.tsx`
- Triggers: User navigates to `/`
- Responsibilities: Display hero section with waitlist form, feature cards, app mockups
- Rendering: Client-side (`'use client'`) for animations and interactivity

**Test Listing Page:**
- Location: `apps/web/src/app/hogskoleprovet/page.tsx`
- Triggers: User navigates to `/hogskoleprovet`
- Responsibilities: Fetch all tests from static data, group by year, render as cards with links
- Rendering: Static generation (no `'use client'`)

**Test Detail Page:**
- Location: `apps/web/src/app/hogskoleprovet/[slug]/page.tsx`
- Triggers: User navigates to `/hogskoleprovet/{slug}` (e.g., `/hogskoleprovet/hosten-2024`)
- Responsibilities: Load test data by slug, group files by type, render download links, show related tests
- Rendering: Static generation with `generateStaticParams()` and `generateMetadata()`

**Email Confirmation Page:**
- Location: `apps/web/src/app/bekrafta/page.tsx`
- Triggers: User clicks confirmation link from waitlist email
- Responsibilities: Extract token from URL, call Convex to validate, show success/error
- Rendering: Client-side with Suspense wrapper for SSR safety

## Error Handling

**Strategy:** Try-catch for async operations, graceful fallback for missing data, user-facing error messages.

**Patterns:**

- **Page not found:** `notFound()` in `[slug]/page.tsx` returns 404 if slug doesn't match any test
- **Convex mutations:** Wrapped in `.catch()` to set error state without crashing (see `bekrafta/page.tsx`)
- **Optional API key:** Features degrade gracefully if `NEXT_PUBLIC_CONVEX_URL` or `NEXT_PUBLIC_POSTHOG_KEY` not set
- **Email confirmation:** Invalid token shows error message with option to re-register, no exception thrown

## Cross-Cutting Concerns

**Logging:**

- Development warnings logged to console (e.g., missing Convex URL)
- PostHog event tracking captures `$pageview` with full URL for analytics
- No structured error logging—relies on browser console and Convex logs

**Validation:**

- Form validation in `WaitlistForm`: email format checked client-side via HTML `type="email"`
- Test slug validation in page component: matches against `tests` array at build time
- Convex mutations validate inputs server-side (email format, token format)

**Authentication:**

- No user authentication implemented yet
- Waitlist uses token-based email confirmation (see `confirmationToken` in schema)
- Future: Mobile app may add sign-up/login before training features enabled

**SEO:**

- Root metadata defined in `layout.tsx` (title, description, OpenGraph)
- Page-level metadata in test pages via `generateMetadata()` function
- Title includes year/season for test detail pages (e.g., "Högskoleprovet hösten 2024 - PDF, Facit & Normering")
- Keywords target search terms: "gamla högskoleprov", "högskoleprov PDF", "HP facit"
- Proper heading hierarchy (`<h1>` for page title, `<h2>` for sections)
