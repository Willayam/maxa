---
phase: 03-main-app-experience
plan: 01
subsystem: state-management
tags: [zustand, mmkv, gamification, streak, xp, coach, date-fns]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: MMKV storage adapter, Zustand persist pattern
provides:
  - Streak tracking with freeze protection
  - Daily goal management with midnight reset
  - XP leveling with polynomial progression curve
  - Max coach personality-based messaging
affects: [03-02, 03-03, profile-tab, onboarding]

# Tech tracking
tech-stack:
  added: [date-fns]
  patterns: [streak-freeze-mechanics, polynomial-xp-curve, personality-based-messaging]

key-files:
  created:
    - apps/mobile/stores/gamificationStore.ts
    - apps/mobile/stores/coachStore.ts
  modified:
    - apps/mobile/stores/index.ts
    - apps/mobile/package.json

key-decisions:
  - "Streak freeze auto-consume on 2-day gap (not manual)"
  - "Award freezes at 7/30-day milestones (max 2 held)"
  - "XP curve: linear 1-10, polynomial 11-30, steep 31+"
  - "Default daily goal: 20 questions"
  - "Coach messages use Swedish without special characters for simplicity"

patterns-established:
  - "Streak tracking: differenceInCalendarDays from date-fns for reliable day boundaries"
  - "Growth mindset messaging: process over outcome focus"
  - "Partial persistence: partialize for persisting subset of state"

# Metrics
duration: 2min
completed: 2026-01-26
---

# Phase 03 Plan 01: Gamification State Stores Summary

**Zustand stores for streak tracking (with freeze protection), daily goals, XP leveling, and Max coach personality-based messaging - all persisted via MMKV**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-26T15:00:56Z
- **Completed:** 2026-01-26T15:03:05Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments
- Streak tracking with freeze mechanics (auto-consume on 2-day gap, award at milestones)
- Daily goal tracking with midnight reset (default 20 questions)
- XP leveling with polynomial curve (quick early wins, steep late game)
- Max coach with 3 personalities (Hype/Lugn/Strikt) for all message contexts

## Task Commits

Each task was committed atomically:

1. **Task 1: Install date-fns** - `53ac62e` (chore)
2. **Task 2: Create gamificationStore** - `078f6e4` (feat)
3. **Task 3: Create coachStore and update index** - `bc86e6e` (feat)

## Files Created/Modified
- `apps/mobile/stores/gamificationStore.ts` - Streak, daily goals, XP leveling with MMKV persistence
- `apps/mobile/stores/coachStore.ts` - Personality-based Max coach messaging
- `apps/mobile/stores/index.ts` - Export new stores and types
- `apps/mobile/package.json` - Added date-fns dependency

## Decisions Made
- Used date-fns for all date arithmetic (handles time zones, DST correctly)
- Streak freeze auto-consume on 2-day gap rather than manual
- Award freezes at 7-day and 30-day milestones (max 2 held)
- XP curve: linear levels 1-10 (quick wins), polynomial 11-30, steep 31+
- Default daily goal: 20 questions/day
- Coach messages written without Swedish special characters for code simplicity

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tasks completed without issues.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- gamificationStore ready for integration into tab UIs
- coachStore ready for displaying contextual Max messages
- Both stores persist via MMKV, consistent with existing progressStore pattern
- Ready for 03-02 (Tab Polish) to connect these stores to UI components

---
*Phase: 03-main-app-experience*
*Completed: 2026-01-26*
