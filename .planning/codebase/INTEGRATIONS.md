# External Integrations

**Analysis Date:** 2026-01-26

## APIs & External Services

**Email Service:**
- **Resend** - Transactional email delivery
  - Used for: Waitlist confirmation emails (double opt-in flow)
  - SDK/Client: Fetch API (custom integration, no SDK)
  - Implementation: `convex/waitlist.ts` → `sendConfirmationEmail` internal action
  - Auth: `RESEND_API_KEY` environment variable (backend only)
  - API Endpoint: `https://api.resend.com/emails` (POST)
  - From address: `Maxa <hej@maxahp.se>`

**Analytics & Product Insights:**
- **PostHog** - Product analytics and user telemetry
  - Used for: Event tracking, pageview tracking, app lifecycle events
  - SDK/Client: `posthog-js` (web), `posthog-react-native` (mobile)
  - Auth: `NEXT_PUBLIC_POSTHOG_KEY` (web), `EXPO_PUBLIC_POSTHOG_KEY` (mobile)
  - Host: `NEXT_PUBLIC_POSTHOG_HOST` / `EXPO_PUBLIC_POSTHOG_HOST`
  - Default: EU server (https://eu.i.posthog.com) for GDPR compliance
  - Features:
    - Web: Manual pageview tracking via `posthog.capture('$pageview')` in `apps/web/src/providers/posthog-provider.tsx`
    - Mobile: Auto-captures screen views, app lifecycle, deep links via `posthog.screen()` in `apps/mobile/providers/posthog-provider.tsx`
    - Privacy: Respects DNT (Do Not Track) header on web
    - Session recording disabled by default
    - Optional: Can be disabled if API key not set

## Data Storage

**Databases:**
- **Convex** (primary backend)
  - Type: Real-time document database (CRDT-based)
  - Client: `convex/react` (web), Convex SDK (backend)
  - Connection: `NEXT_PUBLIC_CONVEX_URL` environment variable
  - Location: Root `convex/` directory (shared by web and mobile)
  - Schema file: `convex/schema.ts`

**Tables:**
- `tests` - Historical Högskoleprovet test metadata
  - Fields: year, season, date, slug, sourceUrl
  - Indexes: by_slug, by_year_season

- `testFiles` - Individual PDF files linked to tests
  - Fields: testId, storageId, fileType, section, passNumber, originalFilename, sizeBytes
  - File types: provpass, facit, kallhanvisning, normering
  - Sections: verbal, kvantitativ
  - Index: by_test

- `waitlist` - Email waitlist signups with double opt-in
  - Fields: email, createdAt, source, status, confirmationToken, confirmationSentAt, confirmedAt
  - Status: pending, confirmed
  - Indexes: by_email, by_token

**File Storage:**
- **Convex File Storage** (built-in to Convex)
  - Used for: PDF storage for historical HP tests
  - Integration: `convex/files.ts` queries/mutations
  - Storage IDs: Referenced in `testFiles.storageId`
  - Upload flow: `generateUploadUrl()` → client upload → `createFile()` mutation
  - Download flow: `getUrl()` query returns signed URL

**Caching:**
- Not detected

## Authentication & Identity

**Auth Provider:**
- None detected - No user authentication system
- Waitlist uses email-based double opt-in (not identity provider)

**Current Approach:**
- Waitlist stored in Convex without user authentication
- Email confirmation via token (stateless, token-based verification)
- Double opt-in flow: `join()` → email sent → `confirmEmail()` on link click

## Monitoring & Observability

**Error Tracking:**
- Not detected - No dedicated error tracking service (Sentry, Rollbar, etc.)

**Logs:**
- Console logging in development
- Backend: `convex/waitlist.ts` logs errors to console if RESEND_API_KEY missing or email send fails
- Frontend: PostHog provider logs missing API key to console if not configured

## CI/CD & Deployment

**Hosting:**
- Assumed: Vercel (Next.js standard), Expo managed service (mobile)
- Convex: Hosted backend (convex.dev)

**CI Pipeline:**
- Not detected - No GitHub Actions, CI config files found

## Environment Configuration

**Required env vars (Production):**
- `NEXT_PUBLIC_CONVEX_URL` - Convex backend URL (web only, SSR/client)
- `NEXT_PUBLIC_APP_URL` - App domain for confirmation links (defaults to https://maxahp.se)
- `RESEND_API_KEY` - Email service (backend/Convex only, required for waitlist emails)

**Optional env vars (Production):**
- `NEXT_PUBLIC_POSTHOG_KEY` - Analytics (web, optional)
- `NEXT_PUBLIC_POSTHOG_HOST` - Analytics host (defaults to EU)
- `EXPO_PUBLIC_POSTHOG_KEY` - Analytics (mobile, optional)
- `EXPO_PUBLIC_POSTHOG_HOST` - Analytics host (defaults to EU)

**Secrets location:**
- Development: `.env.local` in `apps/web/` and `apps/mobile/`
- Template: `.env.example` at repo root documents all required/optional vars

## Webhooks & Callbacks

**Incoming:**
- Not detected - No webhook endpoints

**Outgoing:**
- Resend email callbacks: Implicit via email confirmation flow
  - Flow: Email sent → User clicks link → GET `/bekrafta?token=...` → `confirmEmail()` mutation
  - Implementation: `apps/web/src/app/bekrafta/` (confirmation page)

## Third-Party Content & APIs

**Content Sources:**
- Historical Högskoleprovet PDFs sourced from studera.nu
  - Reference: `convex/schema.ts` → `tests.sourceUrl` stores original source
  - Download script: `scripts/download_hogskoleprovet_tests.py` scrapes studera.nu
  - Upload script: `scripts/upload-to-convex.ts` uploads PDFs to Convex storage

**Google Fonts:**
- Nunito font family via Google Fonts CDN
  - URL: `https://fonts.googleapis.com` with preconnect optimization
  - Weights: 400, 500, 600, 700, 800, 900

## Integration Flow Diagrams

**Waitlist (Double Opt-In Flow):**
```
Frontend (web)
  ↓
[POST] /api/waitlist/join (Convex mutation)
  ├→ Check if email exists
  ├→ Generate confirmationToken
  ├→ Insert into waitlist (status: pending)
  ├→ Schedule internal action
  ↓
[Convex] sendConfirmationEmail (internal action)
  ├→ Generate confirmation URL with token
  ├→ Send via Resend API
  ├→ Mark confirmationSentAt on success
  ↓
User receives email
  ↓
User clicks confirmation link
  ↓
Frontend: GET /bekrafta?token=...
  ↓
[Convex] confirmEmail mutation (public)
  ├→ Lookup token in waitlist
  ├→ Update status: pending → confirmed
  ├→ Set confirmedAt timestamp
  ↓
PostHog: Capture event (if enabled)
```

**Historical Tests Download Flow:**
```
Frontend (web)
  ↓
Route: /hogskoleprovet/[slug]
  ↓
[Convex] getBySlug query
  ↓
[Convex] getByTest query (fetch files)
  ↓
[Convex] getUrl query (per file)
  ↓
Generate signed Convex URLs
  ↓
Frontend: Render download links
  ↓
User click → Browser fetches from Convex signed URL
```

**Analytics Flow:**
```
Frontend (web/mobile)
  ↓
User navigates / performs action
  ↓
PostHog SDK captures event
  ↓
PostHog API (EU endpoint)
  ├→ Record in PostHog project
  ├→ Respect DNT header (web only)
  ↓
Dashboard accessible in PostHog UI
```

## Data Privacy & Compliance

**GDPR Considerations:**
- Email storage: Encrypted in Convex
- Confirmation tokens: Cryptographic UUIDs, single-use
- Privacy-first analytics: PostHog defaults to EU server
- DNT respected: PostHog web SDK respects browser DNT setting
- Data retention: Not specified (check Convex/PostHog policies)

---

*Integration audit: 2026-01-26*
