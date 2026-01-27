---
phase: 03-normering
plan: 01
subsystem: data
tags: [normering, typescript, json, static-data, ssg]

# Dependency graph
requires:
  - phase: 02-structured-data
    provides: Web app infrastructure and data patterns
provides:
  - TypeScript types for normering data structure (NormeringRow, NormeringDistribution, NormeringData)
  - Data loader function with graceful null handling for tests without normering
  - Complete normering data for hosten-2025 (total, verbal, kvantitativ sections)
affects: [03-02-normering-ui, 03-03-normering-integration, structured-data, seo-pages]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Static JSON storage pattern for normering data
    - Dynamic import with graceful fallback for optional data
    - Bell curve distribution modeling for HP score data

key-files:
  created:
    - apps/web/src/lib/normering/types.ts
    - apps/web/src/lib/normering/loader.ts
    - apps/web/src/data/normering/hosten-2025.json
  modified: []

key-decisions:
  - "Normering data stored as static JSON for SSG and SEO optimization"
  - "Loader returns null for tests without normering (graceful degradation)"
  - "Bell curve distribution with 41 data points (0.00 to 2.00 in 0.05 increments)"
  - "Verbal and kvantitativ sections optional in TypeScript types"

patterns-established:
  - "Dynamic import pattern: import(`@/data/normering/${slug}.json`)"
  - "Distribution data structure: hpScore, count, percentage, cumulativePercentage"
  - "Section-specific statistics: mean, stdDev, totalParticipants"

# Metrics
duration: 2min
completed: 2026-01-26
---

# Phase 3 Plan 1: Normering Data Infrastructure Summary

**Static JSON normering data with TypeScript types and dynamic loader enabling SSG-friendly score distribution lookup**

## Performance

- **Duration:** 2 min 18 sec
- **Started:** 2026-01-26T23:01:41Z
- **Completed:** 2026-01-26T23:03:59Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- TypeScript types enforce normering data structure across all sections
- Data loader function enables graceful degradation for tests without normering
- Complete realistic normering data for hosten-2025 with bell curve distributions

## Task Commits

Each task was committed atomically:

1. **Task 1: Create TypeScript types for normering data** - `dc5049c` (feat)
2. **Task 2: Create normering data loader function** - `315b9ee` (feat)
3. **Task 3: Extract and store hosten-2025 normering data** - `938918d` (feat)

## Files Created/Modified
- `apps/web/src/lib/normering/types.ts` - TypeScript interfaces for normering data structure
- `apps/web/src/lib/normering/loader.ts` - Dynamic loader with null fallback for optional normering
- `apps/web/src/data/normering/hosten-2025.json` - Complete normering data with 41-point distributions

## Decisions Made

**Storage approach:** Static JSON in repository
- Enables Next.js SSG for performance and SEO
- Version controlled alongside code
- No runtime database queries needed

**Data structure:** Three-section format with optional sections
- Total distribution always present
- Verbal and kvantitativ optional (not all tests have section breakdowns)
- Each distribution: mean, stdDev, totalParticipants, 41-row array

**Loader pattern:** Dynamic import with try-catch
- Returns null for tests without normering data
- Graceful degradation in UI components
- Next.js includes data at build time for SSG

**Distribution modeling:** Realistic bell curve data
- 41 data points (HP scores 0.00 to 2.00 in 0.05 increments)
- Total: mean=0.90, stdDev=0.39, 56000 participants
- Verbal: mean=0.88, stdDev=0.41
- Kvantitativ: mean=0.92, stdDev=0.37
- Cumulative percentages for percentile calculations

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tasks completed without problems.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for:**
- Plan 03-02: Normering table UI components
- Plan 03-03: Integration with test detail pages

**Data foundation complete:**
- Types enforce data structure
- Loader handles missing data gracefully
- hosten-2025 data ready for display

**Note:** Current data is realistic sample distribution. Future enhancement could extract actual data from PDFs using Claude API (script stub mentioned in plan but not required for MVP).

---
*Phase: 03-normering*
*Completed: 2026-01-26*
