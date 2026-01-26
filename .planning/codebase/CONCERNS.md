# Codebase Concerns

**Analysis Date:** 2026-01-26

## SEO & Discoverability Gaps

### Missing robots.txt and sitemap.xml

**Issue:** No `robots.txt` or `sitemap.xml` files are present in the web app's public directory.

**Files:**
- Public directory: `apps/web/public/` (empty except for PDFs and screenshots)
- Next.js config: `apps/web/next.config.js`

**Impact:**
- Search engines may not efficiently crawl the site
- New pages (especially dynamic `/hogskoleprov/[slug]` pages) won't be discovered as quickly
- No explicit control over crawler access to sensitive areas
- Missing opportunity to prioritize high-value pages

**Fix approach:**
1. Create `apps/web/public/robots.txt` with explicit rules for search engine crawlers
2. Implement `apps/web/app/sitemap.ts` using Next.js 15 dynamic sitemap generation
3. Generate sitemap entries for both `/hogskoleprov` listing and all dynamic test pages
4. Add `sitemap` metadata to root `layout.tsx`
5. Consider adding `robots` metadata export with canonical URLs

### No JSON-LD Structured Data

**Issue:** Pages lack JSON-LD structured data for SEO context.

**Files affected:**
- `apps/web/src/app/page.tsx` (homepage) - no schema markup
- `apps/web/src/app/hogskoleprovet/page.tsx` (test listing) - no BreadcrumbList or CollectionPage schema
- `apps/web/src/app/hogskoleprovet/[slug]/page.tsx` (individual test pages) - no Article or ScholarlyArticle schema

**Impact:**
- Search results won't display rich snippets (breadcrumbs, structured data callouts)
- Knowledge panels won't appear in SERP
- Schema.org metadata missing for test dates, file types, and download URLs
- Educational content not properly categorized for search

**Fix approach:**
1. Create utility `apps/web/src/lib/schema.ts` with TypeScript schema builders
2. Add breadcrumb schema to listing page showing: Home > Gamla Högskoleprov > [Year]
3. Add CollectionPage schema to `/hogskoleprov` with hasPart entries for each test
4. Add Article/ScholarlyArticle schema to `/hogskoleprovet/[slug]` with:
   - datePublished (test date)
   - FileObject entries with URL, fileFormat, fileSize for each PDF
   - mainEntity reference to the test
5. Inject via `<script type="application/ld+json">` in layout or page components

### No Canonical URLs or Meta Tags

**Issue:** Missing canonical URL meta tags that could harm SEO with duplicate content.

**Files:** `apps/web/src/app/layout.tsx` and page-level metadata exports

**Impact:**
- Query parameter variations could create duplicate content issues
- Tests accessible via `/gamla-prov/:slug` (old URL) and `/hogskoleprovet/:slug` (new URL)
- While redirects exist in `next.config.js`, canonical tags weren't added
- Potential for search engines to treat as separate content

**Fix approach:**
1. Add canonical URL generation in root layout
2. Export `canonical` in Metadata objects for key pages
3. Ensure redirect chain is permanent (already done) but verify search console shows new URLs

### Missing OpenGraph Image Tags

**Issue:** Social sharing cards lack images.

**Files affected:**
- `apps/web/src/app/layout.tsx` - root metadata lacks openGraph.images
- `apps/web/src/app/page.tsx` - homepage lacks visual preview
- `apps/web/src/app/hogskoleprovet/page.tsx` - no og:image
- `apps/web/src/app/hogskoleprovet/[slug]/page.tsx` - generates metadata without images

**Impact:**
- Sharing links on social media shows no preview image, reducing CTR
- App preview mockups won't appear in Slack, Twitter, Facebook shares
- Lower engagement from social referral traffic

**Fix approach:**
1. Create static OG images in `apps/web/public/og/` for:
   - Homepage with Maxa branding
   - Gamla högskoleprov listing page
   - Individual test pages (dynamic generation possible but static preferred initially)
2. Reference in root `metadata.openGraph.images` array
3. Add images to dynamic metadata in `generateMetadata()` for test pages
4. Use `next/og` for dynamic OG image generation if budget allows

## Front-End Performance Issues

### No Images for Phone Mockups - Relying on Client-Side SVG

**Issue:** App preview mockups render UI with hardcoded React components instead of optimized images.

**Files:**
- `apps/web/src/components/app-preview-mockup.tsx` (lines 12-58) - renders entire UI tree with DashboardPreview, PracticePreview, ProgressPreview components
- Used on homepage at lines 78 and 123-132 in `apps/web/src/app/page.tsx`

**Impact:**
- Large JavaScript payload sent to client (205 lines of component code + dependencies)
- Browser renders complex component tree with Framer Motion animations
- Multiple images via separate imports in `phone-mockup.tsx` (uses Next.js Image component)
- Framer Motion animations trigger repaints on slower devices
- LCP (Largest Contentful Paint) could be slower due to JS execution

**Fix approach:**
1. Replace with pre-rendered PNG/WebP images of app mockups
2. Store in `apps/web/public/images/mockups/`
3. Use `next/image` with static imports and proper sizes attribute
4. Keep animations subtle (CSS-only transform, not content changes)
5. Consider WebP with PNG fallback for compatibility
6. Measure LCP before/after with Lighthouse

### Framer Motion Animations on Homepage

**Issue:** Multiple Framer Motion animations trigger on page load and scroll.

**Files:**
- `apps/web/src/app/page.tsx` (lines 53-180) - multiple motion divs with animate/whileInView
- `apps/web/src/components/feature-card.tsx` - likely animated
- `apps/web/src/components/app-preview-mockup.tsx` (lines 49-54) - floating shadow animation

**Impact:**
- Unnecessary JavaScript bundle size (framer-motion is ~40KB gzipped)
- Layout shift as elements animate in
- Battery drain on mobile devices
- CLS (Cumulative Layout Shift) possible if animations aren't GPU-accelerated

**Fix approach:**
1. Remove animations from critical rendering path (hero section animations delay LCP)
2. Keep only subtle CSS animations (transform, opacity only - GPU accelerated)
3. Remove whileInView animations from below-fold content
4. Consider prefers-reduced-motion media query to disable for accessibility
5. Lazy load animation library only on scroll with dynamic import

### Missing Image Optimization on PDF Screenshots

**Issue:** Screenshots in `apps/web/public/screenshots/` aren't referenced in code, and no image optimization strategy.

**Files:**
- `apps/web/public/screenshots/` directory exists but unused
- No Image component usage found in components

**Impact:**
- If used, images would lack responsive sizing
- No format optimization (could be large PNG files)
- No lazy loading strategy

**Fix approach:**
1. Audit which screenshots are actually used
2. If used, replace with next/image with proper sizes
3. Convert to WebP format with PNG fallback
4. Add to media queries for responsive mockups

## Accessibility Concerns

### Insufficient ARIA Labels and Semantic HTML

**Issue:** Key interactive elements lack accessibility attributes.

**Files affected:**
- `apps/web/src/app/page.tsx` (lines 49-180) - CTA buttons, feature cards lack ARIA
- `apps/web/src/components/feature-card.tsx` - likely missing role attributes
- `apps/web/src/app/hogskoleprovet/[slug]/page.tsx` (line 142) - "→" arrow lacks semantic meaning

**Impact:**
- Screen reader users can't understand purpose of interactive elements
- Navigation difficult for keyboard-only users
- Fails WCAG 2.1 AA compliance

**Fix approach:**
1. Add aria-label to all icon-only buttons (e.g., close buttons, navigation arrows)
2. Use semantic HTML: `<button>` instead of `<div role="button">`
3. Ensure all form controls have associated labels
4. Add aria-describedby to complex sections
5. Test with screen reader (NVDA, JAWS, VoiceOver)

### Missing Alt Text for Decorative Icons

**Issue:** Icons and emojis used throughout site lack alt text context.

**Files:**
- `apps/web/src/components/app-preview-mockup.tsx` (line 70, 94, etc.) - emoji icons "🔥" used without fallback
- `apps/web/src/app/hogskoleprovet/[slug]/page.tsx` (line 209) - "📄" emoji for file indicator

**Impact:**
- Screen readers announce emojis as single characters or incorrect meanings
- Decorative elements not properly marked as such
- Visual hierarchy lost for assistive tech users

**Fix approach:**
1. Replace emojis with proper icon components from lucide-react (already imported)
2. Add aria-hidden="true" to purely decorative elements
3. Provide aria-label for meaningful icons: `<FileIcon aria-label="PDF document"`

### Color Contrast Issues in Typography

**Issue:** Text on backgrounds may not meet WCAG AA contrast requirements.

**Files:**
- `apps/web/src/app/layout.tsx` (line 10) - uses CSS custom properties for colors
- Tailwind classes like `text-foreground-muted` may not have sufficient contrast

**Impact:**
- Users with low vision cannot read text
- Fails WCAG 2.1 AA and AAA standards
- Legal liability

**Fix approach:**
1. Audit all color combinations with WebAIM contrast checker
2. Ensure foreground-muted has at least 4.5:1 ratio for normal text (3:1 for large text)
3. Update `apps/web/src/app/globals.css` color definitions
4. Add contrast ratio test to CI/CD pipeline

## Testing & Quality Gaps

### No Automated Test Suite

**Issue:** Zero test coverage across the codebase.

**Files:** No `.test.ts`, `.spec.ts`, `.test.tsx`, or `.spec.tsx` files in `/apps/web/src/` or `/apps/mobile/app/`

**Impact:**
- Regressions introduced silently
- Component changes break functionality without detection
- No confidence in refactors
- Convex backend mutations (waitlist, file uploads) untested

**Fix approach:**
1. Set up Jest or Vitest for unit testing
2. Add test configuration file: `jest.config.ts` in repo root
3. Create test suite for:
   - Waitlist signup/confirmation flow (`convex/waitlist.ts`)
   - Test listing and filtering (`apps/web/src/app/hogskoleprovet/page.tsx`)
   - File download URLs (`apps/web/src/app/hogskoleprovet/[slug]/page.tsx`)
4. Aim for 80%+ coverage on business logic
5. Add pre-commit hook to run tests

### No End-to-End Tests

**Issue:** User flows like "sign up for waitlist → receive email → confirm" untested.

**Files:** No Cypress, Playwright, or similar setup

**Impact:**
- Email confirmation flow could break without detection
- PDF download links might 404
- SEO redirects could be broken

**Fix approach:**
1. Set up Playwright for E2E testing
2. Create test scenarios:
   - Homepage loads with all sections
   - Test listing page displays all tests
   - PDF download links return 200 (not 404)
   - Redirects from `/gamla-prov/:slug` to `/hogskoleprov/:slug` work
   - Waitlist flow: sign up → email sent → confirm → success

### No Linting or Type Checking Configuration

**Issue:** While TypeScript is configured, no strict checking or linting enforcement.

**Files:**
- `eslint.config.js` (line 237) - basic ESLint config exists
- `apps/web/package.json` (line 10) - typecheck script exists but may not run in CI

**Impact:**
- Unused variables may slip through
- Type safety not enforced
- Code style inconsistent

**Fix approach:**
1. Enable strict TypeScript in `apps/web/tsconfig.json`
2. Ensure ESLint runs with stricter rules (no-unused-vars, no-explicit-any)
3. Add type-check to pre-commit hooks
4. Add to CI/CD pipeline

## Mobile App Concerns

### No Mobile-Specific SEO

**Issue:** Mobile app not linked from web app, no deep linking strategy.

**Files:**
- `apps/web/src/app/page.tsx` - no "Download on App Store" or "Get on Google Play" buttons
- No deep linking to mobile app features from web

**Impact:**
- Mobile app invisible in web search results
- Users on desktop can't easily navigate to mobile version
- Opportunity to increase app installs lost

**Fix approach:**
1. Add app store badges to homepage (top right or footer)
2. Implement App Links (Android) and Universal Links (iOS)
3. Create landing pages optimized for app store keywords
4. Add schema.org SoftwareApplication markup

### Analytics Not Tracking Key Metrics

**Issue:** PostHog integrated but may not track critical user flows.

**Files:**
- `apps/web/src/providers/posthog-provider.tsx` (67 lines) - basic setup
- `apps/mobile/providers/posthog-provider.tsx` - mobile setup

**Impact:**
- Can't measure waitlist conversion rate
- Don't know which test pages get most traffic
- Mobile app retention metrics missing

**Fix approach:**
1. Track waitlist funnel: hero_cta_click → form_viewed → form_submitted → email_confirmed
2. Track test page views with test year/season as event properties
3. Add attribution to understand traffic sources
4. Create dashboards for key metrics

## Data & Backend Concerns

### Waitlist Email Sending Not Idempotent

**Issue:** Email scheduling uses Convex scheduler with `runAfter(0, ...)` without deduplication.

**Files:** `convex/waitlist.ts` (line 39)

**Impact:**
- If scheduler triggers twice, user receives duplicate confirmation emails
- No deduplication on token or email basis

**Fix approach:**
1. Add email sending deduplication check before scheduling
2. Ensure `sendConfirmationEmail` action is idempotent
3. Add tracking timestamp to prevent replay
4. Consider Convex's built-in deduplication features for actions

### Large PDF Files Not Optimized

**Issue:** Test PDFs stored with large file sizes (up to 12.3 MB for single pass).

**Files:** `apps/web/src/data/tests.ts` (lines 38-200+)

**Example:** `varen-2025-pp3-kvant` is 12.3 MB

**Impact:**
- Slow downloads on mobile/slow connections
- Bandwidth costs high
- User experience poor for students with limited data plans

**Fix approach:**
1. Audit PDFs: are they optimized (compressed images)?
2. Consider splitting large files into smaller chunks
3. Implement resumable downloads or HTTP range requests
4. Add compression on-the-fly during download
5. Cache PDFs aggressively (set Cache-Control headers)

### Convex Schema Mismatch Risk

**Issue:** Static test data in `apps/web/src/data/tests.ts` duplicates Convex schema in `convex/schema.ts`.

**Files:**
- Web: `apps/web/src/data/tests.ts` (Test interface)
- Backend: `convex/schema.ts` (tests and testFiles tables)

**Impact:**
- If schema changes, web-side types don't automatically update
- Potential for future misalignment when migrations happen
- Code duplication

**Fix approach:**
1. Generate TypeScript types from Convex schema using `convex/_generated/`
2. Remove duplicate interface definitions
3. Use generated types across all packages

## Deployment & Environment Concerns

### Environment Variable Documentation Missing

**Issue:** `.env.example` is sparse and doesn't document all required vars.

**Files:** `.env.example` (480 bytes)

**Impact:**
- New developers don't know what env vars are required
- Deployment failures from missing config
- Security risk if credentials accidentally committed

**Fix approach:**
1. Expand `.env.example` with all required variables:
   - NEXT_PUBLIC_CONVEX_URL
   - CONVEX_DEPLOYMENT
   - RESEND_API_KEY
   - NEXT_PUBLIC_POSTHOG_KEY
   - NEXT_PUBLIC_APP_URL
2. Add comments explaining each variable
3. Create deployment checklist in docs

### No Error Boundary or Error Tracking

**Issue:** No error boundary component and errors not sent to Sentry or similar.

**Files:** `apps/web/src/app/layout.tsx` - no error.tsx or error boundary

**Impact:**
- Unhandled errors crash app silently
- No production error visibility
- Users see blank screen with no guidance

**Fix approach:**
1. Create `apps/web/src/app/error.tsx` error boundary component
2. Add Sentry or PostHog error tracking
3. Display user-friendly error message instead of blank screen
4. Log stack traces to monitoring service

## Technical Debt Summary

### 1. Old Content Pages Directory

**Issue:** `apps/web/src/app/_old-content-pages/page.tsx` (59 lines) still exists.

**Impact:** Dead code, confusion about active pages

**Fix:** Delete if truly old; if active, move to proper location

### 2. Use of CSS-in-JS Strings in Components

**Issue:** Hardcoded hex colors in `apps/web/src/components/app-preview-mockup.tsx` (line 85-87).

**Example:** `bg-[#58CC02]`, `bg-[#1CB0F6]` instead of semantic tokens

**Fix:** Use Tailwind semantic classes from `globals.css` color tokens

### 3. Large Data File in Source Code

**Issue:** `apps/web/src/data/tests.ts` (457 lines) contains all test metadata.

**Impact:** Bloats bundle if not tree-shaken; makes updates tedious

**Fix:** Consider moving to JSON file or loading from Convex at build time

## Opportunities (Lower Priority)

- **Performance:** Convert homepage animations to static images
- **SEO:** Add FAQ schema for common HP questions
- **Mobile:** Add progressive web app (PWA) manifest
- **Analytics:** Track time-on-page for test PDFs (proxy for engagement)
- **Content:** Add user testimonials with structured data (Review/AggregateRating schema)

---

*Concerns audit: 2026-01-26*
