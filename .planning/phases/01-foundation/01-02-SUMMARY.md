---
phase: 01-foundation
plan: 02
subsystem: quiz-content
tags: [mock-data, quiz, HP-questions, XP-calculation, TypeScript]

# Dependency graph
requires:
  - phase: 01-foundation-01
    provides: Local state foundation (MMKV, Zustand setup)
provides:
  - Mock HP questions for 4 section types (ORD, LÄS, XYZ, KVA)
  - getMixedQuestions utility for quiz sessions
  - calculateSessionXP utility with streak bonus
affects: [quiz-ui, session-tracking, baseline-test]

# Tech tracking
tech-stack:
  added: []
  patterns: [mock-data-structure, XP-calculation-with-streaks]

key-files:
  created: []
  modified:
    - apps/mobile/constants/mock-questions.ts

key-decisions:
  - "10 total questions sufficient for demo (3 ORD, 2 LÄS, 3 XYZ, 2 KVA mix)"
  - "XP calculation: 10 base + 2 per consecutive correct answer (streak bonus)"
  - "Swedish text passages for LÄS questions (allemansrätten, photosynthesis, Viking history)"

patterns-established:
  - "Question structure: id, section, number, text, options, correctAnswer, explanation"
  - "Mixed question getter with proportional section distribution"
  - "XP calculation with streak tracking for gamification"

# Metrics
duration: 2min
completed: 2026-01-26
---

# Phase 1 Plan 2: Mock Questions Summary

**26 mock HP questions across 4 types with getMixedQuestions and calculateSessionXP utilities for quiz flow**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-26T10:18:52Z
- **Completed:** 2026-01-26T10:21:12Z
- **Tasks:** 3
- **Files modified:** 1

## Accomplishments
- Added 3 authentic LÄS (Swedish reading comprehension) questions with text passages
- Added 3 KVA (quantitative comparison) questions with standard comparison format
- Created getMixedQuestions utility returning representative HP mix (3 ORD, 2 LÄS, 3 XYZ, 2 KVA)
- Created calculateSessionXP utility with streak bonus (10 base + 2 per consecutive correct)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add LÄS (Swedish Reading) questions** - `c44854f` (feat)
2. **Task 2: Add KVA (Quantitative Comparison) questions** - `0425bb0` (feat)
3. **Task 3: Add mixed questions getter and XP calculation utilities** - `8c8728c` (feat)

## Files Created/Modified
- `apps/mobile/constants/mock-questions.ts` - Added MOCK_QUESTIONS_LAS (3 questions), MOCK_QUESTIONS_KVA (3 questions), getMixedQuestions(), calculateSessionXP()

## Decisions Made
- **Mixed question proportions:** 3 ORD, 2 LÄS, 3 XYZ, 2 KVA for 10-question sessions (representative HP mix)
- **XP streak bonus:** 2 XP per consecutive correct answer to incentivize consistency
- **LÄS topics:** Selected diverse Swedish topics (allemansrätten, science, history) for realistic practice

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Mock questions ready for quiz UI integration
- getMixedQuestions can be called to generate practice sessions
- calculateSessionXP ready for session completion screen
- Total 26 questions available (10 ORD, 10 XYZ, 3 LÄS, 3 KVA) for variety

**Ready for:** Quiz UI development, baseline test flow, practice sessions

---
*Phase: 01-foundation*
*Completed: 2026-01-26*
