# Roadmap: Maxa Mobile UI Flow

## Overview

This roadmap delivers a complete, polished mobile UI experience for Maxa in 4 phases. We start with the foundation (MMKV + Zustand + mock data), build the core quiz flow with animations, then polish the main app tabs with gamification, and finish with onboarding that showcases the complete experience. Each phase delivers testable user value.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3, 4): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Foundation** - Local-first storage, state management, and mock quiz data
- [ ] **Phase 2: Core Quiz Flow** - Question display, answer handling, feedback animations
- [ ] **Phase 3: Main App Experience** - Polished tabs, gamification, Max coach integration
- [ ] **Phase 4: Onboarding** - 9-screen onboarding flow with baseline test

## Phase Details

### Phase 1: Foundation
**Goal**: App has instant, synchronous state management with mock quiz data ready for the quiz flow
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, MOCK-01, MOCK-02, MOCK-03, MOCK-04
**Success Criteria** (what must be TRUE):
  1. App opens instantly with no loading flash (state reads are synchronous)
  2. Quiz session survives app restart mid-session (kill app, reopen, state preserved)
  3. 10 mock HP questions are available with correct answers and explanations
  4. Mock scoring calculates accuracy and XP correctly
**Plans**: TBD

Plans:
- [ ] 01-01: MMKV + Zustand setup with persist middleware
- [ ] 01-02: Mock quiz data creation (10 questions, 4 types)

### Phase 2: Core Quiz Flow
**Goal**: Users can complete a quiz session with satisfying visual and haptic feedback on every interaction
**Depends on**: Phase 1
**Requirements**: QUIZ-01, QUIZ-02, QUIZ-03, QUIZ-04, QUIZ-05, QUIZ-06, QUIZ-07, QUIZ-08, ANIM-01, ANIM-02, ANIM-03, ANIM-04, ANIM-05, ANIM-06, ANIM-07, ANIM-08, ANIM-09
**Success Criteria** (what must be TRUE):
  1. User can tap an answer option and see immediate visual feedback (green/red within 100ms)
  2. Correct answers trigger checkmark animation + success haptic
  3. Wrong answers trigger shake animation + error haptic
  4. Session summary shows score, accuracy %, and XP earned
  5. User can review incorrect answers with explanations after session
**Plans**: TBD

Plans:
- [ ] 02-01: Question card and answer selection UI
- [ ] 02-02: Answer feedback states and animations
- [ ] 02-03: Session summary and error review screens

### Phase 3: Main App Experience
**Goal**: All three tabs are polished, consistent, and include gamification that motivates daily practice
**Depends on**: Phase 2
**Requirements**: AUDIT-01, AUDIT-02, AUDIT-03, AUDIT-04, AUDIT-05, TABS-01, TABS-02, TABS-03, TABS-04, TABS-05, TABS-06, TABS-07, TABS-08, TABS-09, GAME-01, GAME-02, GAME-03, GAME-04, GAME-05, GAME-06, MAX-01, MAX-02, MAX-03, MAX-04
**Success Criteria** (what must be TRUE):
  1. Idag tab shows countdown to HP exam, goal score, daily mission progress, and streak chip
  2. Trana tab allows selecting practice mode and starting a quiz session
  3. Jag tab shows progress card, weakness tiles (color-coded), and Max coach message
  4. Streak counter tracks consecutive days and shows milestone animations
  5. Max displays personality-based messages that change based on coach style setting
**Plans**: TBD

Plans:
- [ ] 03-01: Design audit and component unification
- [ ] 03-02: Idag and Trana tab polish
- [ ] 03-03: Jag tab, gamification, and Max coach

### Phase 4: Onboarding
**Goal**: New users complete a guided onboarding that sets their goal, runs a baseline test, and creates an account
**Depends on**: Phase 3
**Requirements**: ONBD-01, ONBD-02, ONBD-03, ONBD-04, ONBD-05, ONBD-06, ONBD-07, ONBD-08, ONBD-09
**Success Criteria** (what must be TRUE):
  1. User can enter name and select persona (gymnasieelev/omtagare/foralder)
  2. User can set dream program, target score, exam date, and daily time commitment
  3. User completes 10-question baseline test (timed)
  4. Results screen shows current level vs goal with weakest section highlighted
  5. User can create account after baseline (Apple/Google/Email UI - no backend)
**Plans**: TBD

Plans:
- [ ] 04-01: Onboarding screens 1-5 (Welcome through Time)
- [ ] 04-02: Plan, baseline test, results, and account creation

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/2 | Not started | - |
| 2. Core Quiz Flow | 0/3 | Not started | - |
| 3. Main App Experience | 0/3 | Not started | - |
| 4. Onboarding | 0/2 | Not started | - |

---
*Roadmap created: 2026-01-26*
*Depth: quick (4 phases, 10 plans)*
*Coverage: 52/52 requirements mapped*
