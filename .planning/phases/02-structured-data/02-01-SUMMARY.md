---
phase: 02-structured-data
plan: 01
subsystem: seo
tags: [json-ld, schema-dts, structured-data, google-rich-results, breadcrumbs]

# Dependency graph
requires:
  - phase: 01-seo-foundation
    provides: hogskoleprovet pages with metadata
provides:
  - JsonLd component for safe JSON-LD script rendering
  - generateArticleJsonLd for test detail pages
  - generateBreadcrumbJsonLd for navigation hierarchy
  - Article schema on detail pages
  - BreadcrumbList schema on all hogskoleprovet pages
affects: [03-normering, 04-strategy-content, 05-cross-linking]

# Tech tracking
tech-stack:
  added: [schema-dts]
  patterns: [json-ld-component-pattern, structured-data-generators]

key-files:
  created:
    - apps/web/src/lib/structured-data.tsx
  modified:
    - apps/web/src/app/hogskoleprovet/[slug]/page.tsx
    - apps/web/src/app/hogskoleprovet/page.tsx
    - apps/web/package.json

key-decisions:
  - "Used schema-dts for TypeScript types to ensure schema compliance"
  - "Renamed file to .tsx for JSX support in JsonLd component"
  - "Used WithContext<Thing> as base type for flexible JsonLd component"
  - "Article schema (not ScholarlyArticle) per Google rich results requirements"
  - "Native script tag (not next/script) to avoid hydration issues"

patterns-established:
  - "JSON-LD component pattern: dangerouslySetInnerHTML with XSS escaping"
  - "Generator functions return WithContext<T> types for type safety"
  - "Final breadcrumb item omits 'item' property per Google docs"

# Metrics
duration: 5min
completed: 2026-01-26
---

# Phase 2 Plan 1: Structured Data Summary

**JSON-LD structured data with Article and BreadcrumbList schemas using schema-dts for Google rich snippet eligibility**

## Performance

- **Duration:** 5 min
- **Started:** 2026-01-26T22:23:27Z
- **Completed:** 2026-01-26T22:28:33Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments
- Created reusable JsonLd component with proper XSS escaping
- Implemented Article schema generator with headline, datePublished, publisher
- Implemented BreadcrumbList schema generator with Swedish navigation labels
- Test detail pages now render both Article and BreadcrumbList JSON-LD
- Test list page renders BreadcrumbList JSON-LD (Hem > Gamla prov)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create structured-data helper library** - `c668529` (feat)
2. **Task 2: Add JSON-LD to test detail page** - `855188a` (feat)
3. **Task 3: Add JSON-LD to test list page** - `ab3c004` (feat)

## Files Created/Modified
- `apps/web/src/lib/structured-data.tsx` - JsonLd component and generator functions (110 lines)
- `apps/web/src/app/hogskoleprovet/[slug]/page.tsx` - Added Article + BreadcrumbList JSON-LD
- `apps/web/src/app/hogskoleprovet/page.tsx` - Added BreadcrumbList JSON-LD
- `apps/web/package.json` - Added schema-dts dev dependency

## Decisions Made
- **schema-dts over manual types:** Provides TypeScript types that match Google's schema.org definitions, ensuring schema compliance at compile time
- **File renamed to .tsx:** JSX syntax in JsonLd component requires .tsx extension for ESLint/TypeScript parsing
- **WithContext<Thing> base type:** More flexible than Record<string, unknown>, accepts all schema-dts types
- **Native script tag:** next/script causes hydration duplication issues with JSON-LD
- **Swedish breadcrumb labels:** "Varen"/"Hosten" without diacritics for consistent URL-safe display

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] File extension change required**
- **Found during:** Task 1 (structured-data library creation)
- **Issue:** ESLint could not parse JSX in .ts file, failing with "'>' expected" error
- **Fix:** Renamed structured-data.ts to structured-data.tsx
- **Files modified:** apps/web/src/lib/structured-data.tsx
- **Verification:** `bun run lint` passes
- **Committed in:** c668529 (Task 1 commit)

**2. [Rule 1 - Bug] Type incompatibility with schema-dts**
- **Found during:** Task 2 (detail page integration)
- **Issue:** Record<string, unknown> type in JsonLdProps not compatible with WithContext<Article> from schema-dts
- **Fix:** Changed JsonLdProps.data type to WithContext<Thing> which is the base type all schemas extend
- **Files modified:** apps/web/src/lib/structured-data.tsx
- **Verification:** `bun run build` passes without TypeScript errors
- **Committed in:** 855188a (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both fixes necessary for correct TypeScript compilation. No scope creep.

## Issues Encountered
None - plan executed smoothly after auto-fixes.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- JSON-LD foundation complete, ready for additional schema types (Organization, WebSite)
- All hogskoleprovet pages now eligible for Google rich results
- Verify with Google Rich Results Test: https://search.google.com/test/rich-results

---
*Phase: 02-structured-data*
*Completed: 2026-01-26*
