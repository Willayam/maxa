# Phase 1: Foundation - Context

**Gathered:** 2026-01-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Local-first storage (MMKV), state management (Zustand with persist), and mock quiz data. App opens instantly with no loading flash. Quiz state survives app restart.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion

User indicated they want to move fast — Claude has flexibility on all implementation details for this infrastructure phase:

- **Mock question content:** 10 questions covering HP question types (ORD, LÄS, XYZ, KVA, NOG, DTK, ELF). Mix of difficulties. Include explanations for learning value.
- **Quiz state structure:** Track current session (question index, answers, score) and historical progress (sessions completed, accuracy trends, XP earned).
- **Default user state:** Fresh user starts with 0 XP, 0 streak, no completed sessions. Reasonable defaults for goal score (1.0) and daily time (15 min).
- **Data persistence:** Session state persists through app kill (resume mid-quiz). Progress history persists indefinitely. No reset on new session — cumulative tracking.

### Technical Approach (inferred from roadmap)

- MMKV for synchronous storage (no async loading flash)
- Zustand stores with MMKV persist middleware
- Two stores: `quizStore` (session state), `progressStore` (XP, streak, history)
- Mock data as TypeScript constants (not fetched)

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. User wants to move fast.

From roadmap success criteria:
- App opens instantly with no loading flash
- Quiz session survives app restart mid-session
- 10 mock HP questions with correct answers and explanations
- Mock scoring calculates accuracy and XP correctly

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-01-26*
