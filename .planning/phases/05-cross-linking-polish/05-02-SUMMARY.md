---
phase: 05-cross-linking-polish
plan: 02
subsystem: ui
tags: [related-content, internal-linking, seo, algorithm]

# Dependency graph
requires:
  - phase: 01-seo-foundation
    provides: Test detail pages structure and data model
provides:
  - Related tests algorithm with season and year proximity scoring
  - Reusable RelatedTests component for cross-linking
  - Internal linking structure for SEO
affects: [04-strategy-content]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Relevance scoring algorithm for content recommendations"
    - "Reusable navigation components pattern"

key-files:
  created:
    - apps/web/src/lib/related-content.ts
    - apps/web/src/components/navigation/related-tests.tsx
  modified:
    - apps/web/src/app/hogskoleprovet/[slug]/page.tsx

key-decisions:
  - "Same-season tests prioritized (+10 points) over year proximity"
  - "Year proximity scored at -2 points per year difference"
  - "Recency bonus up to +5 points for newer tests"
  - "Default limit of 4 related tests per page"

patterns-established:
  - "Algorithm in lib/, component in components/navigation/ for separation of concerns"
  - "Props-based components for reusability (currentTest, limit)"

# Metrics
duration: 5min
completed: 2026-01-27
---

# Phase 5 Plan 02: Related Tests Summary

**Smart related content algorithm prioritizing same-season tests with year proximity scoring, extracted to reusable component**

## Performance

- **Duration:** 5 min
- **Started:** 2026-01-27T08:57:43Z
- **Completed:** 2026-01-27T09:02:17Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Related tests algorithm with relevance-based scoring (same season > year proximity > recency)
- Reusable RelatedTests component for internal linking
- Replaced inline implementation on test detail pages with smart component
- 4 related tests per page with descriptive anchor text for SEO

## Task Commits

Each task was committed atomically:

1. **Task 1: Create related content algorithm** - `d60b9cb` (feat)
2. **Task 2: Create RelatedTests component and integrate** - `91ae3bd` (feat)

Note: Page integration was included in commit `3bb98e7` from parallel plan 05-01 due to concurrent editing of the same file.

## Files Created/Modified
- `apps/web/src/lib/related-content.ts` - Related tests algorithm with relevance scoring
- `apps/web/src/components/navigation/related-tests.tsx` - Reusable related tests component
- `apps/web/src/app/hogskoleprovet/[slug]/page.tsx` - Integration of RelatedTests component

## Decisions Made

**Algorithm design:**
- Same-season tests receive +10 bonus (höst tests prioritized for höst pages)
- Year proximity scored at -2 per year difference (adjacent years rank higher)
- Recency bonus up to +5 points (newer tests get slight boost)
- Default limit of 4 related tests balances discoverability with page length

**Component design:**
- Extracted to reusable component (not inline JSX) for future use in Phase 4 strategy pages
- Props-based API (currentTest, limit) enables flexibility
- Returns null if no related tests (graceful degradation)

**Code organization:**
- Algorithm in `lib/` directory (pure business logic)
- Component in `components/navigation/` (UI presentation)
- Clear separation of concerns for testability and reuse

## Deviations from Plan

None - plan executed exactly as written.

Note: Integration with page.tsx was completed by parallel plan 05-01 (commit 3bb98e7) which also added breadcrumbs. Both changes coexist without conflict.

## Issues Encountered

**Parallel plan coordination:**
- Plan 05-01 and 05-02 both modified `[slug]/page.tsx` simultaneously
- Plan 05-01's commit (3bb98e7) included both breadcrumbs AND RelatedTests integration
- File edits made during 05-02 execution were already captured in 05-01's commit
- Result: All changes correctly committed, no conflicts

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**For Phase 4 (Strategy Content):**
- RelatedTests component ready for reuse on strategy pages
- Algorithm can be extended for other content types if needed
- Pattern established for related content recommendations

**SEO benefits:**
- Internal linking structure improves crawlability
- Related tests increase pageviews and session duration
- Semantic anchor text (season + year) provides context for search engines

**Verified functionality:**
- Algorithm correctly prioritizes same-season tests (3/4 höst tests for hösten-2025)
- Links navigate correctly between test pages
- Current test never appears in its own related tests
- Section renders with proper styling and hover effects

---
*Phase: 05-cross-linking-polish*
*Completed: 2026-01-27*
