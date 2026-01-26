# Project Research Summary

**Project:** Maxa Quiz UI
**Domain:** EdTech mobile quiz app (React Native/Expo)
**Researched:** 2026-01-26
**Confidence:** HIGH

## Executive Summary

This research covers building a polished, Duolingo-style quiz UI for Maxa, a Swedish Hogskoleprovet prep app built on Expo 54 with React Native 0.81. The key insight across all research dimensions is that **local-first architecture is essential** for the instant, responsive feel that defines great quiz apps. Users expect zero loading states during quiz interactions.

The recommended approach centers on three pillars: (1) **MMKV + Zustand** for synchronous state management that survives app restarts, (2) **Reanimated 4** for GPU-accelerated animations using only `transform` and `opacity` properties, and (3) **delayed registration** allowing users to experience value before account creation. The existing codebase already has Reanimated 4.1.1, Gesture Handler 2.28.0, and expo-haptics installed, so primary additions are `react-native-mmkv` and `zustand`.

The main risks are: (1) MMKV requiring `npx expo prebuild` which exits Expo Go workflow, (2) performance degradation from animating layout-affecting properties instead of transforms, and (3) overwhelming users with gamification features before core quiz flow is polished. Mitigate by testing on low-end Android devices early and adding gamification incrementally (streaks first, then XP, then achievements).

## Key Findings

### Recommended Stack

The existing Expo 54 setup is well-chosen. Primary additions needed are `react-native-mmkv` 4.1.1 for local-first storage and `zustand` 5.0.10 for quiz state management.

**Core technologies:**
- **Reanimated 4.1.1** (already installed): 60fps animations on UI thread with CSS-like declarative API
- **MMKV 4.1.1** (to add): Synchronous storage 30x faster than AsyncStorage, instant reads/writes
- **Zustand 5.0.10** (to add): Lightweight state management with built-in persistence middleware
- **expo-haptics 15.0.8** (already installed): Haptic feedback for answer feedback (success/error patterns)

**Version note:** MMKV 4.x requires `react-native-nitro-modules` as peer dependency and `npx expo prebuild` (no Expo Go).

### Expected Features

**Must have (table stakes):**
- Immediate answer feedback (green/red states within 100ms)
- Progress indicator (horizontal bar showing session progress)
- Clear correct/incorrect visual states
- Exit confirmation modal (prevent accidental progress loss)
- Loading states with skeletons (never blank screens)

**Should have (differentiators):**
- Answer selection animation (scale to 0.95 on press, spring bounce back)
- Correct answer celebration (checkmark scale-in + progress bar pulse)
- Wrong answer shake (3 cycles, 50ms each, 6px amplitude)
- Stats summary screen (accuracy %, time, XP earned)
- Streak counter animation (pop-in at 3, 5, 10 correct in a row)

**Defer (v2+):**
- Character reactions (requires Rive/Lottie integration)
- Home screen streak widget (platform-specific, high complexity)
- Advanced achievements system (needs backend support)
- Leaderboards (can increase anxiety if poorly implemented)

### Architecture Approach

A local-first architecture using Zustand + MMKV persist middleware provides instant quiz interactions without network dependency. Quiz state follows a finite state machine pattern with phases: `idle -> answering -> feedback -> summary`. All quiz content is bundled with the app and cached in MMKV for sub-millisecond reads. Progress syncs to Convex in batches when online (session complete or app background).

**Major components:**
1. **quizStore** (Zustand) — Session state machine, current question, selected answer
2. **progressStore** (Zustand) — Streaks, daily goals, section performance stats
3. **MMKV storage adapter** — Synchronous persistence layer for all stores
4. **Sync manager** — Background sync to Convex on app lifecycle events

### Critical Pitfalls

1. **Reading shared values on JS thread** — Use `useAnimatedReaction` for cross-thread communication, never access `sharedValue.value` in React components
2. **Animating layout properties** — Only animate `transform` and `opacity`, never `width`/`height`/`top`/`left` (causes layout thrashing)
3. **Forcing early registration** — Allow 3-5 questions before any signup prompt; 74% abandon apps that require upfront registration
4. **AsyncStorage for quiz state** — Use MMKV instead; AsyncStorage is 30x slower and async
5. **Too many animated components** — Limit to ~100 simultaneous animations on Android; stagger list animations

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Local-First Foundation
**Rationale:** Everything else depends on instant state management. MMKV + Zustand setup validates the local-first architecture before building UI.
**Delivers:** Zustand stores (quizStore, progressStore), MMKV adapter, session persistence
**Addresses:** Quiz session state that survives app restart, instant reads/writes
**Avoids:** AsyncStorage performance pitfall, loading states during quiz

### Phase 2: Core Quiz Flow
**Rationale:** Quiz interactions are the product's core value. Must feel instant before adding polish.
**Delivers:** Question display, answer selection, correct/incorrect states, progress bar, session summary
**Uses:** quizStore state machine, Reanimated for feedback animations
**Implements:** Finite state machine transitions (answering -> feedback -> next question)
**Avoids:** Layout property animations (use transforms only)

### Phase 3: Feedback Polish
**Rationale:** Micro-interactions create the "polished" feel that drives engagement. Builds on working quiz flow.
**Delivers:** Answer animations (scale/spring), correct celebration, wrong shake, haptic feedback
**Uses:** Reanimated 4 CSS-like animations, expo-haptics
**Avoids:** Too many animated components, hardcoded colors

### Phase 4: Progress and Streaks
**Rationale:** Gamification drives retention but requires working progress tracking infrastructure.
**Delivers:** Streak system, daily goals, XP tracking, profile screen with stats
**Implements:** progressStore with streak calculation, section weakness tracking
**Avoids:** Gamification overload (start with streaks only)

### Phase 5: Onboarding Flow
**Rationale:** Onboarding shapes first impression but must showcase polished quiz experience. Build after core flow is solid.
**Delivers:** 8-screen onboarding, goal selection, coach introduction, baseline test, delayed registration
**Avoids:** Early registration requirement, information overload (max 3 screens before first question)

### Phase 6: Sync Layer
**Rationale:** Cloud sync enables multi-device and social features but is not required for core value. Build last.
**Delivers:** Background sync to Convex, pending answer queue, conflict resolution
**Implements:** SyncManager component, NetInfo connectivity detection
**Avoids:** Per-action sync (batch on session complete)

### Phase Ordering Rationale

- **Foundation first:** MMKV + Zustand setup is a prerequisite for all quiz functionality. Testing this in isolation ensures the local-first approach works before building UI.
- **Core before polish:** Working quiz flow validates architecture before investing in animations. Easier to tune animations when quiz logic is stable.
- **Gamification after core:** Streaks and XP only meaningful when quiz flow is solid. Prevents premature optimization of reward systems.
- **Onboarding near end:** Onboarding showcases the quiz experience, so quiz must be polished first. Changes to quiz flow would require onboarding updates.
- **Sync last:** Cloud features are enhancement, not core. Local-first works offline; sync adds multi-device and social features.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1 (Foundation):** Validate MMKV 4.x builds successfully with Expo 54 prebuild. Check for C++20 issues on Android.
- **Phase 5 (Onboarding):** May need user research to validate flow. Duolingo patterns well-documented but Swedish test prep may have unique needs.

Phases with standard patterns (skip research-phase):
- **Phase 2 (Quiz Flow):** Well-established quiz UI patterns, existing codebase has good foundation.
- **Phase 3 (Feedback Polish):** Reanimated animation patterns thoroughly documented.
- **Phase 4 (Progress/Streaks):** Straightforward Zustand state management, no novel patterns.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Official Expo docs, verified versions, existing codebase already has core dependencies |
| Features | HIGH | Multiple sources confirm Duolingo patterns, industry consensus on quiz UX |
| Architecture | HIGH | Official MMKV + Zustand documentation, local-first patterns well-established |
| Pitfalls | HIGH | Official Reanimated performance docs, community consensus on animation best practices |

**Overall confidence:** HIGH

### Gaps to Address

- **MMKV Expo 54 build:** Verify Android/iOS builds succeed with MMKV 4.1.1 during Phase 1. Have C++20 patch ready if needed.
- **Zustand hydration timing:** Confirm MMKV's sync nature makes hydration instant (no flash of default state).
- **Low-end Android testing:** Need physical budget Android device to validate animation performance. Not captured in automated tests.
- **Adaptive difficulty:** Research mentions this as important but deferred. Consider for v2 roadmap.

## Sources

### Primary (HIGH confidence)
- [Expo Reanimated docs](https://docs.expo.dev/versions/latest/sdk/reanimated/)
- [Reanimated Performance Guide](https://docs.swmansion.com/react-native-reanimated/docs/guides/performance/)
- [react-native-mmkv GitHub](https://github.com/mrousavy/react-native-mmkv)
- [Zustand Persist Middleware](https://zustand.docs.pmnd.rs/integrations/persisting-store-data)
- [Expo SDK 54 Changelog](https://expo.dev/changelog/sdk-54)
- [Expo Local-First Guide](https://docs.expo.dev/guides/local-first/)

### Secondary (MEDIUM confidence)
- [State of React Native 2024](https://results.stateofreactnative.com/en-US/state-management/) — Zustand most-loved state management
- [UserGuiding Duolingo Onboarding Analysis](https://userguiding.com/blog/duolingo-onboarding-ux) — Onboarding patterns
- [Nielsen Norman Group Animation Duration](https://www.nngroup.com/articles/animation-duration/) — Animation timing reference
- [MMKV vs AsyncStorage Benchmark](https://reactnativeexpert.com/blog/mmkv-vs-asyncstorage-in-react-native/) — 30x performance difference

### Tertiary (LOW confidence)
- [Duolingo Gamification Secrets](https://www.orizon.co/blog/duolingos-gamification-secrets) — Gamification patterns (some inference)
- [EdTech Startup Mistakes](https://digitaldefynd.com/IQ/edtech-startup-mistakes/) — Anti-patterns

---
*Research completed: 2026-01-26*
*Ready for roadmap: yes*
