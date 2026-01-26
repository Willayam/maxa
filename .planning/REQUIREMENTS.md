# Requirements: Maxa Mobile UI Flow

**Defined:** 2026-01-26
**Core Value:** Users can experience the full app flow — from onboarding through quiz practice — with an instant, native-feeling experience.

## v1 Requirements

Requirements for user testing release. Each maps to roadmap phases.

### Foundation

- [ ] **FOUND-01**: App uses MMKV for local storage (replaces AsyncStorage)
- [ ] **FOUND-02**: Quiz state managed by Zustand with persist middleware
- [ ] **FOUND-03**: Quiz state survives app restart mid-session
- [ ] **FOUND-04**: State reads are synchronous (no loading flash on app open)

### Design Audit

- [ ] **AUDIT-01**: Idag tab reviewed and improved to consistent quality bar
- [ ] **AUDIT-02**: Trana tab reviewed and improved to consistent quality bar
- [ ] **AUDIT-03**: Jag tab reviewed and improved to consistent quality bar
- [ ] **AUDIT-04**: Component library unified (buttons, cards, inputs match across app)
- [ ] **AUDIT-05**: Design tokens used consistently (no hardcoded colors)

### Onboarding Flow

- [ ] **ONBD-01**: Welcome screen with name input and persona picker (gymnasieelev/omtagare/foralder)
- [ ] **ONBD-02**: Dream screen with program search and city picker
- [ ] **ONBD-03**: Score screen with target HP slider showing required score
- [ ] **ONBD-04**: Date screen with exam date picker and countdown display
- [ ] **ONBD-05**: Time screen with daily commitment options (10/15/25 min)
- [ ] **ONBD-06**: Plan screen showing path summary with baseline CTA
- [ ] **ONBD-07**: Baseline test with 10 mixed questions (timed)
- [ ] **ONBD-08**: Results screen showing current level vs goal, weakest section
- [ ] **ONBD-09**: Account creation screen after baseline (Apple/Google/Email UI)

### Quiz Flow

- [ ] **QUIZ-01**: Question card displays question text and answer options
- [ ] **QUIZ-02**: User can select an answer option
- [ ] **QUIZ-03**: Correct answer shows green success state with celebration
- [ ] **QUIZ-04**: Wrong answer shows red error state with correct answer revealed
- [ ] **QUIZ-05**: Progress bar shows current position in quiz session
- [ ] **QUIZ-06**: Session summary shows score, accuracy %, and XP earned
- [ ] **QUIZ-07**: Review errors screen shows wrong answers with explanations
- [ ] **QUIZ-08**: Exit confirmation modal prevents accidental progress loss

### Polish & Animations

- [ ] **ANIM-01**: Answer options scale to 0.95 on press, spring bounce back
- [ ] **ANIM-02**: Correct answer triggers checkmark scale-in animation
- [ ] **ANIM-03**: Wrong answer triggers shake animation (3 cycles, 50ms each)
- [ ] **ANIM-04**: Progress bar pulses on correct answer
- [ ] **ANIM-05**: Haptic feedback on answer selection (light impact)
- [ ] **ANIM-06**: Haptic feedback on correct answer (success pattern)
- [ ] **ANIM-07**: Haptic feedback on wrong answer (error pattern)
- [ ] **ANIM-08**: Button press effects across all interactive elements
- [ ] **ANIM-09**: Card transitions use transform/opacity only (no layout animations)

### Gamification

- [ ] **GAME-01**: Streak counter tracks consecutive days practiced
- [ ] **GAME-02**: Streak display shows current streak with flame icon
- [ ] **GAME-03**: Daily goal shows questions completed vs target
- [ ] **GAME-04**: XP earned per correct answer
- [ ] **GAME-05**: XP total displayed on profile/Jag tab
- [ ] **GAME-06**: Streak milestone animations at 3, 7, 30 days

### Main App Tabs

- [ ] **TABS-01**: Idag shows countdown to HP exam
- [ ] **TABS-02**: Idag shows goal score and target program
- [ ] **TABS-03**: Idag shows daily mission progress and start practice button
- [ ] **TABS-04**: Idag shows streak chip with current streak
- [ ] **TABS-05**: Trana shows mode selector (svagaste forst, delprov, simulera)
- [ ] **TABS-06**: Trana allows starting practice in selected mode
- [ ] **TABS-07**: Jag shows progress card with HP score vs goal
- [ ] **TABS-08**: Jag shows weakness tiles (rod/gul/gron by section)
- [ ] **TABS-09**: Jag shows Max coach box with personality message

### Max Coach (Static)

- [ ] **MAX-01**: Max displays personality-based messages (Hype/Lugn/Strikt)
- [ ] **MAX-02**: Coach style selectable in Jag tab settings
- [ ] **MAX-03**: Max messages trigger on quiz completion
- [ ] **MAX-04**: Max messages trigger on streak milestones

### Mock Data

- [ ] **MOCK-01**: 10 mock HP questions available (mix of verbal + quantitative)
- [ ] **MOCK-02**: Questions include ORD, LAS, XYZ, KVA types
- [ ] **MOCK-03**: Each question has correct answer and explanation
- [ ] **MOCK-04**: Mock scoring calculates accuracy and XP

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Sync & Backend

- **SYNC-01**: Progress syncs to Convex when online
- **SYNC-02**: Multi-device sync maintains consistent state
- **SYNC-03**: Offline changes queue and sync when connected

### AI Coach

- **AI-01**: Max responds with Gemini-generated messages
- **AI-02**: Responses adapt to user's recent performance
- **AI-03**: Rate limiting (10 free, unlimited premium)

### Payments

- **PAY-01**: RevenueCat integration for subscriptions
- **PAY-02**: Paywall UI for premium features
- **PAY-03**: Restore purchases functionality

### Notifications

- **NOTF-01**: Streak reminder push notification
- **NOTF-02**: Daily practice reminder

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Real question extraction | Separate workstream, mock data sufficient for testing |
| Web app changes | Mobile-first for this milestone |
| Leaderboards | Requires backend, adds anxiety if poorly implemented |
| Achievements system | Complexity, defer until streaks prove retention value |
| Adaptive difficulty | Research recommended but deferred to v2 |
| Character animations (Rive/Lottie) | High complexity, static Max messages sufficient |
| Home screen widget | Platform-specific, high complexity |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Complete |
| FOUND-03 | Phase 1 | Complete |
| FOUND-04 | Phase 1 | Complete |
| AUDIT-01 | Phase 3 | Pending |
| AUDIT-02 | Phase 3 | Pending |
| AUDIT-03 | Phase 3 | Pending |
| AUDIT-04 | Phase 3 | Pending |
| AUDIT-05 | Phase 3 | Pending |
| ONBD-01 | Phase 4 | Pending |
| ONBD-02 | Phase 4 | Pending |
| ONBD-03 | Phase 4 | Pending |
| ONBD-04 | Phase 4 | Pending |
| ONBD-05 | Phase 4 | Pending |
| ONBD-06 | Phase 4 | Pending |
| ONBD-07 | Phase 4 | Pending |
| ONBD-08 | Phase 4 | Pending |
| ONBD-09 | Phase 4 | Pending |
| QUIZ-01 | Phase 2 | Pending |
| QUIZ-02 | Phase 2 | Pending |
| QUIZ-03 | Phase 2 | Pending |
| QUIZ-04 | Phase 2 | Pending |
| QUIZ-05 | Phase 2 | Pending |
| QUIZ-06 | Phase 2 | Pending |
| QUIZ-07 | Phase 2 | Pending |
| QUIZ-08 | Phase 2 | Pending |
| ANIM-01 | Phase 2 | Pending |
| ANIM-02 | Phase 2 | Pending |
| ANIM-03 | Phase 2 | Pending |
| ANIM-04 | Phase 2 | Pending |
| ANIM-05 | Phase 2 | Pending |
| ANIM-06 | Phase 2 | Pending |
| ANIM-07 | Phase 2 | Pending |
| ANIM-08 | Phase 2 | Pending |
| ANIM-09 | Phase 2 | Pending |
| GAME-01 | Phase 3 | Pending |
| GAME-02 | Phase 3 | Pending |
| GAME-03 | Phase 3 | Pending |
| GAME-04 | Phase 3 | Pending |
| GAME-05 | Phase 3 | Pending |
| GAME-06 | Phase 3 | Pending |
| TABS-01 | Phase 3 | Pending |
| TABS-02 | Phase 3 | Pending |
| TABS-03 | Phase 3 | Pending |
| TABS-04 | Phase 3 | Pending |
| TABS-05 | Phase 3 | Pending |
| TABS-06 | Phase 3 | Pending |
| TABS-07 | Phase 3 | Pending |
| TABS-08 | Phase 3 | Pending |
| TABS-09 | Phase 3 | Pending |
| MAX-01 | Phase 3 | Pending |
| MAX-02 | Phase 3 | Pending |
| MAX-03 | Phase 3 | Pending |
| MAX-04 | Phase 3 | Pending |
| MOCK-01 | Phase 1 | Complete |
| MOCK-02 | Phase 1 | Complete |
| MOCK-03 | Phase 1 | Complete |
| MOCK-04 | Phase 1 | Complete |

**Coverage:**
- v1 requirements: 52 total
- Mapped to phases: 52
- Unmapped: 0

---
*Requirements defined: 2026-01-26*
*Last updated: 2026-01-26 after Phase 1 completion*
