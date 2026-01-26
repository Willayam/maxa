---
phase: 01-seo-foundation
plan: 01
subsystem: seo
tags: [nextjs, sitemap, robots, seo, metadata]

# Dependency graph
requires:
  - phase: none
    provides: Initial project structure
provides:
  - Dynamic sitemap.xml with all 26 historical test pages
  - Robots.txt allowing search engine crawling
  - SEO discovery infrastructure for test pages
affects: [02-structured-data, canonical-urls]

# Tech tracking
tech-stack:
  added: []
  patterns: [Next.js 15 metadata routes (sitemap.ts, robots.ts)]

key-files:
  created:
    - apps/web/src/app/sitemap.ts
    - apps/web/src/app/robots.ts
  modified: []

key-decisions:
  - "Use test.date for sitemap lastModified instead of build date for accuracy"
  - "Set priorities: homepage=1, list=0.9, test pages=0.8"

patterns-established:
  - "Sitemap sources from same @/data/tests array as generateStaticParams for consistency"

# Metrics
duration: 8min
completed: 2026-01-26
---

# Phase 01 Plan 01: SEO Discovery Infrastructure Summary

**Dynamic sitemap.xml with 28 URLs (homepage, list page, 26 test pages) and robots.txt enabling search engine discovery**

## Performance

- **Duration:** 8 min
- **Started:** 2026-01-26T20:40:33Z
- **Completed:** 2026-01-26T20:48:33Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Created sitemap.xml dynamically generating 28 URLs from tests data source
- Configured robots.txt allowing all crawlers, blocking internal routes
- Established SEO foundation for 26 historical Högskoleprovet test pages
- Verified sitemap uses test.date for accurate lastModified timestamps

## Task Commits

Each task was committed atomically:

1. **Task 1: Create sitemap.ts** - `eca4b45` (feat)
2. **Task 2: Create robots.ts** - `636600c` (feat)

## Files Created/Modified
- `apps/web/src/app/sitemap.ts` - Dynamic sitemap generation using tests array
- `apps/web/src/app/robots.ts` - Robots.txt with crawler permissions and sitemap reference

## Decisions Made
- **Test date for lastModified:** Using `new Date(test.date)` ensures lastModified reflects actual test date (e.g., 2025-10-19) rather than build timestamp. This accurately signals content age to search engines.
- **Priority hierarchy:** Homepage (1.0) > List page (0.9) > Test pages (0.8) to guide crawler importance ranking.
- **Data source consistency:** Import tests from `@/data/tests` - same source as `generateStaticParams` in `[slug]/page.tsx` to prevent sitemap/page drift.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - both files created successfully, build passed, and verification confirmed correct output.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for phase 01-02 (Canonical URLs and Enhanced Metadata):**
- Sitemap infrastructure in place
- All 26 test pages discoverable by search engines
- Base URL (https://maxa.se) established for canonical URL implementation

**No blockers.**

---
*Phase: 01-seo-foundation*
*Completed: 2026-01-26*
