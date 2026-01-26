---
phase: 01-seo-foundation
plan: 02
subsystem: seo
tags: [nextjs, metadata, canonical-urls, opengraph, metadatabase]

# Dependency graph
requires:
  - phase: existing-codebase
    provides: Next.js app with hogskoleprovet pages
provides:
  - metadataBase configured for absolute URL resolution
  - Canonical URLs on all hogskoleprovet pages
  - OpenGraph URLs on all hogskoleprovet pages
affects: [02-structured-data, future-seo-pages]

# Tech tracking
tech-stack:
  added: []
  patterns: [next-metadata-api, canonical-urls, metadatabase-pattern]

key-files:
  created: []
  modified:
    - apps/web/src/app/layout.tsx
    - apps/web/src/app/hogskoleprovet/page.tsx
    - apps/web/src/app/hogskoleprovet/[slug]/page.tsx

key-decisions:
  - "Set metadataBase to https://maxa.se (no trailing slash)"
  - "Use relative URLs for canonicals (resolved via metadataBase)"
  - "Add both canonical and og:url for consistency"

patterns-established:
  - "metadataBase in root layout enables relative URL resolution"
  - "alternates.canonical for canonical URLs"
  - "openGraph.url for OpenGraph URLs"

# Metrics
duration: 4min
completed: 2026-01-26
---

# Phase 01 Plan 02: Canonical URLs Summary

**metadataBase and canonical URLs configured across all hogskoleprovet pages for proper SEO URL resolution**

## Performance

- **Duration:** 4 min
- **Started:** 2026-01-26T20:40:34Z
- **Completed:** 2026-01-26T20:44:20Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- metadataBase set to https://maxa.se in root layout
- Canonical URL added to /hogskoleprovet list page
- Dynamic canonical URLs added to all /hogskoleprovet/[slug] pages
- OpenGraph URLs now resolve to absolute URLs automatically

## Task Commits

Each task was committed atomically:

1. **Task 1: Add metadataBase to root layout** - `9801c19` (feat)
2. **Task 2: Add canonical URL to list page** - `080284c` (feat)
3. **Task 3: Add canonical URLs to test detail pages** - `bb45bfd` (feat)

## Files Created/Modified
- `apps/web/src/app/layout.tsx` - Added metadataBase: new URL('https://maxa.se')
- `apps/web/src/app/hogskoleprovet/page.tsx` - Added alternates.canonical and openGraph.url
- `apps/web/src/app/hogskoleprovet/[slug]/page.tsx` - Added dynamic canonical URLs using slug parameter

## Decisions Made
- **metadataBase without trailing slash**: Set to 'https://maxa.se' (not 'https://maxa.se/') per Next.js best practices for URL resolution
- **Relative URLs for canonicals**: Used '/hogskoleprovet' instead of absolute URLs to leverage metadataBase resolution
- **Both canonical and og:url**: Added both tags for maximum compatibility with search engines and social platforms

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - straightforward metadata additions, TypeScript compiled cleanly, no runtime issues.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Ready for structured data implementation (Plan 01-03). Canonical URLs are now in place, which is important for schema.org markup to reference the correct URLs.

All hogskoleprovet pages now have:
- ✅ Proper canonical URLs to prevent duplicate content issues
- ✅ Absolute OpenGraph URLs for social sharing
- ✅ metadataBase for consistent URL resolution

---
*Phase: 01-seo-foundation*
*Completed: 2026-01-26*
