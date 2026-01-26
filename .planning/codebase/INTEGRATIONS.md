# External Integrations

**Analysis Date:** 2026-01-26

## APIs & External Services

**PostHog Analytics:**
- Service: PostHog (https://posthog.com)
- What it's used for: Product analytics, user tracking, pageview tracking, screen tracking
- SDK/Client:
  - Web: `posthog-js` 1.335.2 (`apps/web/src/providers/posthog-provider.tsx`)
  - Mobile: `posthog-react-native` 4.24.0 (`apps/mobile/providers/posthog-provider.tsx`)
- Auth: Environment variables `NEXT_PUBLIC_POSTHOG_KEY` (web) / `EXPO_PUBLIC_POSTHOG_KEY` (mobile)
- Configuration:
  - Region: EU host `https://eu.i.posthog.com` (default for GDPR compliance) or US `https://us.i.posthog.com`
  - Web: Manual pageview tracking on route changes, respects Do Not Track setting, session recording disabled
  - Mobile: Auto screen tracking on navigation, auto app lifecycle events, deep link tracking, session recording disabled
  - Feature: Graceful degradation - analytics disabled if API key not set

**Google Fonts API:**
- Service: Google Fonts (https://fonts.googleapis.com)
- What it's used for: Nunito font family loading
- Integration: CDN link in `apps/web/src/app/layout.tsx`
  - Link: `https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap`
- Also via `@expo-google-fonts/nunito` 0.4.2 for mobile app

## Data Storage

**Primary Database:**
- Provider: Convex (https://www.convex.dev)
- Type: Real-time serverless database with WebSocket sync
- Connection:
  - URL: `NEXT_PUBLIC_CONVEX_URL` (configured via environment)
  - Client: `convex/react` (web) and Convex client (mobile via shared logic)
- Schema location: `convex/schema.ts`
  - `tests` table: Test administrations with year, season, date, slug, sourceUrl
  - `testFiles` table: Individual PDF files linked to tests with file metadata
  - `waitlist` table: Email signups from landing page
- Queries/Mutations: `convex/tests.ts`, `convex/files.ts`, `convex/waitlist.ts`

**File Storage:**
- Provider: Convex file storage (built-in)
- What it stores: PDF files for Högskoleprovet tests (test papers, answer keys, explanations)
- How it works:
  - Upload URL generation: `convex/files.ts::generateUploadUrl()`
  - File storage after upload: `convex/files.ts::createFile()`
  - Download URLs: `convex/files.ts::getUrl()`
- Access: Only via authenticated Convex queries/mutations

**Caching:**
- Strategy: Real-time via Convex WebSocket - no external caching service
- React Query/SWR: Not explicitly used; Convex React hooks handle caching

## Authentication & Identity

**Auth Provider:** Custom auth (no centralized auth service)
- Implementation: Secret-based authentication for admin operations
  - Admin secret passed to Convex mutations for test/file uploads
  - Mutations check `process.env.ADMIN_SECRET` server-side
  - Files: `convex/tests.ts`, `convex/files.ts`
- User-facing features (waitlist signup) have no authentication required
- Future auth: System designed to work with Auth0/Clerk if needed (Convex supports both)

## Monitoring & Observability

**Error Tracking:**
- Service: Not explicitly configured
- Default behavior: Browser console errors, server-side error handling in Convex mutations

**Logs:**
- Approach:
  - Client-side: Browser DevTools console
  - Server-side (Convex): Convex dashboard logs
  - PostHog also captures events with limited error tracking

**Performance Monitoring:**
- PostHog provides basic user interaction metrics
- No dedicated APM (Application Performance Monitoring) service

## CI/CD & Deployment

**Hosting Platforms:**

Web App (`apps/web/`):
- Platform: Next.js compatible (Vercel, Netlify, self-hosted Node.js)
- Framework support: Next.js 15.1.0 with App Router
- Environment: Node.js runtime

Mobile App (`apps/mobile/`):
- Platform: Expo Go for development, EAS Build for production
- Distribution: App Store (iOS) and Google Play (Android) via EAS or local build
- Expo Tunnel: For live preview during development

Backend (`convex/`):
- Platform: Convex cloud (https://www.convex.dev)
- Deployment: `bunx convex deploy` command
- Environment: Serverless (Convex handles all infrastructure)
- Database: Managed by Convex

**CI Pipeline:**
- Service: Not detected (no GitHub Actions, GitLab CI, etc. in repo)
- Local development: Turbo for monorepo task orchestration
- Scripts available:
  - `bun dev` - Start all dev servers
  - `bun build` - Build all packages
  - `bun lint` - Lint all packages
  - `bun typecheck` - Type-check all packages

**Deployment Flow:**
```
Web: Local build → Next.js build output → Deploy to Vercel/Netlify/Node.js host
Mobile: Source → Expo/EAS Build → iOS app + Android app → App Stores
Backend: TypeScript → bunx convex deploy → Convex cloud
```

## Environment Configuration

**Required Environment Variables:**

Critical:
- `NEXT_PUBLIC_CONVEX_URL` - Convex backend URL (blocks web app without it, but gracefully fails with warning)
- `CONVEX_URL` - Convex backend URL for deployment scripts (required for uploads)
- `ADMIN_SECRET` - Secret token for administrative mutations (test/file creation)

Optional:
- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog analytics key (analytics disabled if not set)
- `NEXT_PUBLIC_POSTHOG_HOST` - PostHog EU/US host selection (defaults to EU)
- `EXPO_PUBLIC_POSTHOG_KEY` - Mobile PostHog analytics key (analytics disabled if not set)
- `EXPO_PUBLIC_POSTHOG_HOST` - Mobile PostHog host (defaults to EU)
- `NODE_ENV` - Runtime environment (development/production) - auto-set by frameworks

**Secrets Location:**
- Local development: `.env.local` files (not committed)
- Template: `.env.example` documents required variables
- Deployment:
  - Vercel/Netlify: Environment variables in dashboard
  - Convex: Environment variables in Convex dashboard
  - Mobile: Build-time environment injection via EAS secrets

## Webhooks & Callbacks

**Incoming Webhooks:**
- Not detected - no webhook endpoints in codebase

**Outgoing Webhooks:**
- Not detected - Convex backend does not trigger external webhooks

**Notification Channels:**
- PostHog: One-way event tracking (no callbacks)
- Convex: Real-time subscriptions via WebSocket (client-side listening)

## Third-Party Dependencies

**Open Source Libraries Used:**
- Framer Motion - Animation library (React only)
- Lucide React - Icon library (web)
- React Markdown - Markdown parser
- Gray Matter - Front matter extraction (for future CMS integration)
- NativeWind tooling ecosystem (removed from mobile, now StyleSheet-based)

**Content APIs (Future):**
- StuDera.nu - Source of Högskoleprovet PDFs (scraped via `scripts/download_hogskoleprovet_tests.py`)
- Currently manual download, not automated API integration

---

*Integration audit: 2026-01-26*
