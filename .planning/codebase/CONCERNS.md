# Codebase Concerns

**Analysis Date:** 2026-01-26

## Security Concerns

**Exposed PostHog API Keys:**
- Issue: PostHog public API keys are stored in version control in `.env.local` files and visible in git history
- Files: `apps/web/.env.local`, `apps/mobile/.env.local`
- Current Key Exposed: `phc_QrISgvaGYofiT6gY9clRxAOl40OKl3IIflBopswE7Ps`
- Risk: PostHog keys are public keys intended for frontend use, but exposure in git creates an audit trail. New keys should be generated and old ones rotated.
- Recommendation: Remove `.env.local` files from git (add to `.gitignore`), use environment-based secrets only in production

**Weak Admin Secret Validation:**
- Issue: `ADMIN_SECRET` environment variable is checked with simple string equality and not strongly typed
- Files: `convex/tests.ts` (line 39), `convex/files.ts` (lines 27, 54)
- Risk: No rate limiting or brute-force protection on admin mutations. If `ADMIN_SECRET` is compromised, entire database can be modified
- Current mitigation: Secret stored in env vars only, not in code
- Recommendation: Implement Convex's built-in authentication system instead of custom secret validation; add audit logging for all mutations

**Missing CONVEX_URL validation:**
- Issue: Convex client doesn't validate that the URL is actually a valid Convex deployment
- Files: `apps/web/src/components/convex-provider.tsx` (line 11), `scripts/upload-to-convex.ts` (line 16)
- Risk: Could be pointed at arbitrary server if env var is compromised or misconfigured
- Recommendation: Add URL validation to ensure it points to expected Convex domain

## Tech Debt

**Incomplete Waitlist Integration:**
- Issue: Waitlist form is hardcoded with mock/placeholder implementation, not connected to Convex mutation
- Files: `apps/web/src/components/waitlist-form.tsx` (line 29-31)
- Impact: Waitlist signups are not persisted; form shows success but no data is saved
- Current state: Uses placeholder `setTimeout(1000)` instead of calling Convex mutation
- Fix approach: Replace placeholder with actual call to `waitlist.join` mutation from Convex

**Static Test Data Not Implemented:**
- Issue: Test listing page expects dynamic data but stores everything in static/hardcoded files
- Files: `apps/web/src/data/tests.ts` (empty array at line 38), `apps/web/src/app/gamla-prov/[slug]/page.tsx` (uses static data)
- Impact: Cannot display actual HP tests to users; page will show "no files available" message
- Current state: Example commented out, tests array is empty
- Mismatch: Convex schema has `tests` and `testFiles` tables, but web app doesn't use them
- Fix approach: Either populate `apps/web/src/data/tests.ts` with real test data OR refactor page to use Convex queries

**Web App Doesn't Use Convex for Tests:**
- Issue: Old static content model doesn't match Convex schema design
- Files: `apps/web/src/data/tests.ts`, Convex schema in `convex/schema.ts`
- Impact: Upload script (`scripts/upload-to-convex.ts`) stores tests in Convex, but web app never reads them
- Current architecture: Web uses static JSON, script stores in Convex, mobile could use Convex but doesn't
- Fix approach: Refactor web app to use Convex queries (`tests.list`, `tests.getBySlug`, `files.getByTest`) instead of static data

## Architecture Fragility

**Tight Coupling Between Upload Script and Convex Schema:**
- Issue: Script's filename parsing logic is hardcoded to recognize specific patterns
- Files: `scripts/upload-to-convex.ts` (lines 95-151)
- Why fragile: If PDF naming conventions change, script breaks silently with wrong metadata
- Current behavior: Unknown filename patterns default to "provpass" (line 150)
- Risk: Could silently mislabel files during batch uploads
- Safe modification: Add verbose logging for unparseable files; consider allowing metadata override via config file

**Duplicate Schema Definitions:**
- Issue: File type enums defined in multiple places (Convex schema, web types, test data types)
- Files:
  - `convex/schema.ts` (lines 20-25, 40-45)
  - `apps/web/src/data/tests.ts` (line 4)
  - `scripts/upload-to-convex.ts` (lines 97-98)
- Risk: If schema changes, all files must be updated in sync or types will break
- Fix approach: Create shared TypeScript definitions in `packages/shared/` and import everywhere

**Test File Grouping Logic is Duplicated:**
- Issue: File grouping logic exists in page component, likely reimplemented in mobile
- Files: `apps/web/src/app/gamla-prov/[slug]/page.tsx` (lines 185-201)
- Risk: Bug fixes in one location won't apply to other; inconsistent behavior
- Fix approach: Move `groupFiles` to shared utility in `packages/shared/`

## Performance Bottlenecks

**Inefficient Waitlist Count Query:**
- Issue: `waitlist.getCount` loads ALL entries into memory to count them
- Files: `convex/waitlist.ts` (lines 30-35)
- Current: `await ctx.db.query('waitlist').collect()` loads entire table
- Impact: Scales O(n) with waitlist size; page load will slow as waitlist grows
- Fix approach: Use Convex aggregation or add a counter table that increments on insert

**No Pagination on Tests List:**
- Issue: `tests.list` query loads all tests at once, could be problematic with 100+ tests
- Files: `convex/tests.ts` (lines 5-15)
- Impact: Large dataset will cause slow page loads and high memory usage
- Current state: Works fine now but will scale poorly
- Improvement path: Add pagination with limit/offset parameters

## Test Coverage Gaps

**No Error Handling in Upload Script:**
- Issue: Network errors during batch upload are logged but continue processing (line 257-259)
- Files: `scripts/upload-to-convex.ts` (lines 238-260)
- Risk: Partial uploads without clear indication of which files failed
- Safe improvement: Add summary of failed files at end; consider resume capability

**Missing Validation for Email Format:**
- Issue: Waitlist email validation is client-side only (line 21-24)
- Files: `apps/web/src/components/waitlist-form.tsx`
- Risk: Invalid emails could be accepted by backend mutation if frontend validation bypassed
- Fix approach: Add server-side validation in `waitlist.join` mutation

**No Tests for Filename Parsing:**
- Issue: Script parsing logic has no unit tests for edge cases
- Files: `scripts/upload-to-convex.ts` (lines 31-93, 95-151)
- Risk: Renaming conventions could break silently; manual testing required
- Improvement: Add test suite for `parseFilename` and `parseFolderName` functions

## Missing Critical Features

**No Backend Error Handling for Convex Failures:**
- Issue: Web app initializes ConvexProvider but silently fails if URL not set
- Files: `apps/web/src/components/convex-provider.tsx` (lines 13-15)
- Impact: Pages that need Convex will silently fail with confusing UI behavior
- Fix: Add explicit error state and user-facing error message

**No Retry Logic for Failed Uploads:**
- Issue: If a single PDF upload fails, script stops processing that folder
- Files: `scripts/upload-to-convex.ts` (lines 153-171)
- Risk: Network hiccups cause incomplete uploads
- Improvement: Add exponential backoff and retry logic

**No Cleanup on Upload Failure:**
- Issue: If metadata creation fails after file upload, orphaned storage entries remain
- Files: `scripts/upload-to-convex.ts` (lines 239-253)
- Risk: Wasted storage; database inconsistency
- Fix approach: Wrap file + metadata in transaction, or add cleanup on failure

## Dependencies at Risk

**React Native Version Mismatch:**
- Issue: Mobile app uses React 19 with React Native 0.81 which may not be fully compatible
- Files: `apps/mobile/package.json` (lines 38-40)
- Risk: Breaking changes between React major versions; potential runtime errors
- Status: Currently working but forward compatibility unknown
- Migration plan: Monitor React Native releases for 19.x support; pin transitive dependencies carefully

**PostHog Version Management:**
- Issue: Web and mobile use different PostHog versions with different APIs
- Files: `apps/web/package.json` (line 20: posthog-js 1.335.2), `apps/mobile/package.json` (line 37: posthog-react-native 4.24.0)
- Risk: Different behavior between platforms; different future breaking changes
- Mitigation: Document differences in behavior between web (respects DNT) and mobile (uses opt-in)

---

*Concerns audit: 2026-01-26*
