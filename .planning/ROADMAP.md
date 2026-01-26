# Roadmap: Maxa Mobile UI Flow

## Overview

This roadmap completes and polishes the existing Maxa mobile app for user testing. The codebase already has substantial foundation:
- **Existing:** 3 tabs with mock data, quiz screens with components, UI library, Reanimated, haptics
- **Adding:** MMKV + Zustand for state, missing quiz features, gamification, onboarding

Each phase **extends** existing code — we're improving and completing, not rebuilding.

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
**Plans:** 2 plans (Wave 1 - parallel)

**Existing code:**
- Mock data inline in screens (MOCK_USER in index.tsx)
- React state for quiz flow

**What we're adding:**
- MMKV for synchronous local storage
- Zustand stores (quizStore, progressStore) with persist
- Structured mock questions with HP question types

**Success Criteria** (what must be TRUE):
  1. App opens instantly with no loading flash (state reads are synchronous)
  2. Quiz session survives app restart mid-session (kill app, reopen, state preserved)
  3. 10 mock HP questions are available with correct answers and explanations
  4. Mock scoring calculates accuracy and XP correctly

Plans:
- [ ] 01-01-PLAN.md — MMKV + Zustand setup with persist middleware
- [ ] 01-02-PLAN.md — Mock quiz data creation (10 questions, 4 types)

### Phase 2: Core Quiz Flow
**Goal**: Users can complete a quiz session with satisfying visual and haptic feedback on every interaction
**Depends on**: Phase 1
**Requirements**: QUIZ-01, QUIZ-02, QUIZ-03, QUIZ-04, QUIZ-05, QUIZ-06, QUIZ-07, QUIZ-08, ANIM-01, ANIM-02, ANIM-03, ANIM-04, ANIM-05, ANIM-06, ANIM-07, ANIM-08, ANIM-09

**Existing code:**
- quiz/index.tsx, quiz/summary.tsx screens
- OptionButton, QuizHeader, FeedbackFooter, ExitModal components
- Reanimated animations, expo-haptics integration

**What we're adding/improving:**
- Connect quiz to Zustand state (from Phase 1)
- Complete animation set (celebrate, shake, progress pulse)
- Error review screen with explanations
- Polish existing components to consistent quality

**Success Criteria** (what must be TRUE):
  1. User can tap an answer option and see immediate visual feedback (green/red within 100ms)
  2. Correct answers trigger checkmark animation + success haptic
  3. Wrong answers trigger shake animation + error haptic
  4. Session summary shows score, accuracy %, and XP earned
  5. User can review incorrect answers with explanations after session

Plans:
- [ ] 02-01: Connect quiz to Zustand state, improve question UI
- [ ] 02-02: Complete answer feedback animations (celebrate, shake, pulse)
- [ ] 02-03: Session summary improvements and error review screen

### Phase 3: Main App Experience
**Goal**: All three tabs are polished, consistent, and include gamification that motivates daily practice
**Depends on**: Phase 2
**Requirements**: AUDIT-01, AUDIT-02, AUDIT-03, AUDIT-04, AUDIT-05, TABS-01, TABS-02, TABS-03, TABS-04, TABS-05, TABS-06, TABS-07, TABS-08, TABS-09, GAME-01, GAME-02, GAME-03, GAME-04, GAME-05, GAME-06, MAX-01, MAX-02, MAX-03, MAX-04

**Existing code:**
- Idag tab with mock data (countdown, goal, streak, daily progress)
- Träna tab (basic)
- Jag tab (basic)
- UI components (Card, Button, ProgressBar, Chip, StatBadge)
- Design tokens and theme system

**What we're adding/improving:**
- Design audit: review each tab, identify inconsistencies, improve
- Connect tabs to Zustand progressStore (real streak, XP tracking)
- Add gamification UI (streak milestones, daily goal progress)
- Add Max coach box with personality-based messages
- Unify component styling across all tabs

**Success Criteria** (what must be TRUE):
  1. Idag tab shows countdown to HP exam, goal score, daily mission progress, and streak chip
  2. Trana tab allows selecting practice mode and starting a quiz session
  3. Jag tab shows progress card, weakness tiles (color-coded), and Max coach message
  4. Streak counter tracks consecutive days and shows milestone animations
  5. Max displays personality-based messages that change based on coach style setting

Plans:
- [ ] 03-01: Design audit and component unification
- [ ] 03-02: Idag and Träna tab polish with real state
- [ ] 03-03: Jag tab, gamification system, and Max coach

### Phase 4: Onboarding
**Goal**: New users complete a guided onboarding that sets their goal, runs a baseline test, and creates an account
**Depends on**: Phase 3
**Requirements**: ONBD-01, ONBD-02, ONBD-03, ONBD-04, ONBD-05, ONBD-06, ONBD-07, ONBD-08, ONBD-09

**Existing code:**
- Quiz flow (reuse for baseline test)
- UI components (Button, Card, ProgressBar, etc.)
- Design tokens and animations

**What we're building (new screens):**
- Welcome screen (name, persona picker)
- Dream screen (program search, city picker)
- Score screen (HP target slider)
- Date screen (exam date picker, countdown)
- Time screen (daily commitment: 10/15/25 min)
- Plan screen (summary, baseline CTA)
- Results screen (level vs goal, weakest section)
- Account creation screen (Apple/Google/Email UI)

**Success Criteria** (what must be TRUE):
  1. User can enter name and select persona (gymnasieelev/omtagare/foralder)
  2. User can set dream program, target score, exam date, and daily time commitment
  3. User completes 10-question baseline test (timed)
  4. Results screen shows current level vs goal with weakest section highlighted
  5. User can create account after baseline (Apple/Google/Email UI - no backend)

Plans:
- [ ] 04-01: Onboarding screens 1-5 (Welcome through Time)
- [ ] 04-02: Plan, baseline test, results, and account creation

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/2 | Planned | - |
| 2. Core Quiz Flow | 0/3 | Not started | - |
| 3. Main App Experience | 0/3 | Not started | - |
| 4. Onboarding | 0/2 | Not started | - |

---
*Roadmap created: 2026-01-26*
*Phase 1 planned: 2026-01-26*
*Depth: quick (4 phases, 10 plans)*
*Coverage: 52/52 requirements mapped*
