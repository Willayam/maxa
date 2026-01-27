# Technology Stack: Quiz UI for Maxa

**Project:** Maxa - Duolingo-style Hogskoleprovet prep
**Researched:** 2026-01-26
**Mode:** Brownfield (adding to existing Expo 54 app)

## Executive Summary

For a polished, instant-feeling quiz UI in React Native/Expo, the 2025 stack centers on three pillars:

1. **Reanimated 4 + Gesture Handler** - Already installed, keep using. CSS-like animations for state transitions, worklets for gesture-driven interactions.
2. **Zustand + MMKV** - Lightweight state management with synchronous persistence. Instant loads, no loading states.
3. **expo-haptics** - Already installed, provides adequate haptic feedback for quiz interactions.

The existing dependencies are well-chosen. Primary additions needed: `react-native-mmkv` for local-first storage, `zustand` for quiz state management.

---

## Recommended Stack

### Already Installed (Keep)

| Technology | Installed Version | Purpose | Status |
|------------|-------------------|---------|--------|
| react-native-reanimated | 4.1.1 | 60fps animations | **HIGH confidence** - Current stable |
| react-native-gesture-handler | 2.28.0 | Touch interactions | **HIGH confidence** - Current stable |
| expo-haptics | 15.0.8 | Haptic feedback | **HIGH confidence** - Bundled with Expo 54 |
| react-native-worklets | 0.5.1 | UI thread JS execution | **HIGH confidence** - Required by Reanimated 4 |

### New Dependencies to Add

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| zustand | 5.0.10 | Quiz state management | **HIGH** - [Latest stable](https://github.com/pmndrs/zustand/releases) |
| react-native-mmkv | 4.1.1 | Local-first storage | **MEDIUM** - Requires patch for RN 0.81 |
| react-native-nitro-modules | (peer dep) | Required by MMKV 4.x | **HIGH** |

---

## Detailed Recommendations

### 1. Animations: Reanimated 4.1.1 (Already Installed)

**Recommendation:** Keep current setup. You have the optimal version.

**Why Reanimated 4:**
- [CSS-like declarative animations](https://medium.com/@subham11/reanimated-4-css-for-react-native-756e6d036383) for state transitions (correct/incorrect feedback)
- Worklets for gesture-driven animations (swipe, drag)
- New Architecture support (required for Expo 54+)
- [60fps animations](https://docs.swmansion.com/react-native-reanimated/docs/guides/performance/) on UI thread

**Quiz-specific patterns:**
```typescript
// State-driven transitions (CSS-like in v4)
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: withSpring(isCorrect ? 1.1 : 1) }],
  backgroundColor: withTiming(isCorrect ? '#4ade80' : '#f87171'),
}));

// Gesture-driven (worklets)
const gesture = Gesture.Pan()
  .onUpdate((e) => {
    translateX.value = e.translationX;
  })
  .onEnd(() => {
    translateX.value = withSpring(0);
  });
```

**Performance best practices ([from docs](https://docs.swmansion.com/react-native-reanimated/docs/guides/performance/)):**
- Animate transform/opacity over layout properties (top/left/width/height)
- Max ~100 animated components on low-end Android, ~500 on iOS
- For Expo 54 with New Architecture: upgrade to Reanimated 4.2.0+ and enable `USE_COMMIT_HOOK_ONLY_FOR_REACT_COMMITS` flag if seeing regressions

**Sources:**
- [Expo Reanimated docs](https://docs.expo.dev/versions/latest/sdk/reanimated/)
- [Reanimated Performance Guide](https://docs.swmansion.com/react-native-reanimated/docs/guides/performance/)
- [Reanimated 4 CSS-like animations](https://medium.com/@subham11/reanimated-4-css-for-react-native-756e6d036383)

---

### 2. Local Storage: react-native-mmkv 4.1.1

**Recommendation:** Add MMKV for synchronous, local-first quiz data.

**Why MMKV over alternatives:**

| Storage | Read Speed | Write Speed | Sync/Async | Notes |
|---------|------------|-------------|------------|-------|
| MMKV | ~30x faster | ~30x faster | **Sync** | Best for local-first |
| AsyncStorage | Baseline | Baseline | Async | Legacy, avoid |
| expo-secure-store | ~700x slower | ~700x slower | Async | For secrets only |
| SQLite | Moderate | Moderate | Async | Overkill for KV data |

**Key advantage:** [Synchronous API](https://github.com/mrousavy/react-native-mmkv) - no loading states, instant reads.

```typescript
// MMKV is synchronous - no await, no promises
const storage = new MMKV();
const quizProgress = storage.getString('quiz-progress'); // Instant
storage.set('quiz-progress', JSON.stringify(progress)); // Instant
```

**Expo 54 Compatibility Warning:**

There was a [known build issue](https://github.com/expo/expo/issues/38991) with MMKV on Expo SDK 54 / React Native 0.81.x. The issue is **resolved**:

- **Fix:** Update to MMKV 4.x (uses Nitro, includes C++20 fix)
- **Patch for 3.x:** [Change CMAKE_CXX_STANDARD from 17 to 20](https://github.com/mrousavy/react-native-mmkv/issues/849)
- **Note:** MMKV does NOT work in Expo Go - requires `npx expo prebuild`

**Installation:**
```bash
npx expo install react-native-mmkv react-native-nitro-modules
npx expo prebuild
```

**Sources:**
- [react-native-mmkv GitHub](https://github.com/mrousavy/react-native-mmkv)
- [MMKV vs AsyncStorage benchmark](https://reactnativeexpert.com/blog/mmkv-vs-asyncstorage-in-react-native/)
- [Expo SDK 54 issue (resolved)](https://github.com/expo/expo/issues/38991)
- [RN 0.81 fix](https://github.com/mrousavy/react-native-mmkv/issues/849)

---

### 3. State Management: Zustand 5.0.10

**Recommendation:** Use Zustand for quiz state. Lightweight, React Native friendly, pairs perfectly with MMKV.

**Why Zustand over alternatives:**

| Library | Bundle Size | Boilerplate | RN Support | Persistence |
|---------|-------------|-------------|------------|-------------|
| **Zustand** | ~1KB | Minimal | Excellent | Built-in middleware |
| Redux Toolkit | ~40KB | Moderate | Good | Separate package |
| Jotai | ~3KB | Minimal | Good | Separate atoms |
| Legend State | ~15KB | Minimal | Excellent | Built-in |
| Context API | 0KB | Varies | Native | Manual |

**Why Zustand wins for quiz apps:**
- [Most loved state management in State of React Native 2024](https://results.stateofreactnative.com/en-US/state-management/)
- No provider component needed (simpler component tree)
- [Built-in persist middleware](https://zustand.docs.pmnd.rs/integrations/persisting-store-data) works with any storage
- [v5.0.4 fixed React Native module resolution](https://github.com/pmndrs/zustand/releases)

**Quiz state pattern with MMKV persistence:**

```typescript
// store/quizStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'quiz-store' });

const mmkvStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};

interface QuizState {
  currentQuestion: number;
  answers: Record<number, string>;
  score: number;
  isComplete: boolean;

  answerQuestion: (questionId: number, answer: string, isCorrect: boolean) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      currentQuestion: 0,
      answers: {},
      score: 0,
      isComplete: false,

      answerQuestion: (questionId, answer, isCorrect) => set((state) => ({
        answers: { ...state.answers, [questionId]: answer },
        score: isCorrect ? state.score + 1 : state.score,
      })),

      nextQuestion: () => set((state) => ({
        currentQuestion: state.currentQuestion + 1,
      })),

      resetQuiz: () => set({
        currentQuestion: 0,
        answers: {},
        score: 0,
        isComplete: false,
      }),
    }),
    {
      name: 'quiz-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
```

**Hydration handling (important for instant UI):**
```typescript
// Avoid flash of default state
const hasHydrated = useQuizStore.persist.hasHydrated();
if (!hasHydrated) return <LoadingScreen />; // Or skeleton
```

**Sources:**
- [Zustand GitHub releases](https://github.com/pmndrs/zustand/releases)
- [Zustand persist docs](https://zustand.docs.pmnd.rs/integrations/persisting-store-data)
- [State of React Native 2024](https://results.stateofreactnative.com/en-US/state-management/)
- [Zustand + MMKV guide](https://dev.to/mehdifaraji/zustand-mmkv-storage-blazing-fast-persistence-for-zustand-in-react-native-3ef1)

---

### 4. Haptic Feedback: expo-haptics 15.0.8 (Already Installed)

**Recommendation:** Keep expo-haptics. Already installed, good enough for quiz UX.

**Available methods ([from Expo docs](https://docs.expo.dev/versions/latest/sdk/haptics/)):**

| Method | Use Case | Intensity |
|--------|----------|-----------|
| `selectionAsync()` | Option hover/selection | Light |
| `impactAsync(Light)` | Button tap | Light |
| `impactAsync(Medium)` | Answer submission | Medium |
| `impactAsync(Heavy)` | Error/wrong answer | Heavy |
| `notificationAsync(Success)` | Correct answer | Strong, positive |
| `notificationAsync(Error)` | Wrong answer | Strong, negative |

**Quiz-specific usage:**

```typescript
import * as Haptics from 'expo-haptics';

// Create a typed haptics helper
export const QuizHaptics = {
  optionSelect: () => Haptics.selectionAsync(),
  submit: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  correct: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  incorrect: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  streak: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
};

// In component
const handleAnswer = async (isCorrect: boolean) => {
  if (isCorrect) {
    QuizHaptics.correct();
  } else {
    QuizHaptics.incorrect();
  }
};
```

**Platform limitations (iOS):**
- Disabled in Low Power Mode
- Disabled if user turned off Taptic Engine
- Disabled during camera/dictation use

**Alternative considered:** [react-native-haptics](https://github.com/mhpdev-com/react-native-haptics) claims ~2x faster performance, but expo-haptics is already installed and adequate for quiz feedback frequency.

**Sources:**
- [Expo Haptics docs](https://docs.expo.dev/versions/latest/sdk/haptics/)
- [Haptic feedback best practices](https://medium.com/timeless/implementing-haptic-feedback-in-react-native-writing-a-usehaptic-hook-6b8612675599)

---

## What NOT to Use

| Technology | Why Avoid |
|------------|-----------|
| AsyncStorage | Legacy, 30x slower than MMKV, async API means loading states |
| Redux Toolkit | Overkill for quiz state, too much boilerplate |
| Legend State | Good but larger bundle, less ecosystem adoption than Zustand |
| react-native-animated (core) | Reanimated 4 is superior in every way |
| Lottie | Heavy for simple UI feedback; use Reanimated + SVG instead |
| expo-secure-store | 700x slower than MMKV; only for auth tokens, not quiz data |

---

## Installation Summary

```bash
# Add new dependencies
npx expo install react-native-mmkv react-native-nitro-modules zustand

# Rebuild native code (MMKV requires native modules)
npx expo prebuild

# Clear cache and restart
npm start -- --reset-cache
```

**Note:** After adding MMKV, you cannot use Expo Go. Use development builds via `npx expo run:ios` or `npx expo run:android`.

---

## Confidence Assessment

| Technology | Confidence | Notes |
|------------|------------|-------|
| Reanimated 4.1.1 | **HIGH** | Already installed, well-documented, verified with Expo 54 |
| Gesture Handler 2.28.0 | **HIGH** | Already installed, stable |
| expo-haptics 15.0.8 | **HIGH** | Already installed, bundled with Expo |
| Zustand 5.0.10 | **HIGH** | Latest stable, excellent RN support, widely adopted |
| MMKV 4.1.1 | **MEDIUM** | Requires prebuild, had Expo 54 issues (now fixed), need to verify patch |

---

## Open Questions for Validation

1. **MMKV build on your setup:** After installing MMKV 4.1.1, verify Android and iOS builds succeed. If issues arise, check [issue #849](https://github.com/mrousavy/react-native-mmkv/issues/849) for patches.

2. **Hydration timing:** Test if Zustand's persist hydration is fast enough to avoid visible loading states. MMKV's sync nature should make this instant, but verify.

3. **Haptic timing with animations:** Ensure haptic feedback fires at the right moment in animation sequences (e.g., haptic on correct answer should sync with visual feedback).

---

## Version Matrix

| Package | Recommended | Min Required | Max Tested |
|---------|-------------|--------------|------------|
| expo | 54.x | 54.0.0 | 54.0.31 |
| react-native | 0.81.x | 0.81.0 | 0.81.5 |
| react | 19.x | 19.0.0 | 19.1.0 |
| react-native-reanimated | 4.1.x | 4.0.0 | 4.1.1 |
| react-native-gesture-handler | 2.28.x | 2.20.0 | 2.28.0 |
| expo-haptics | 15.0.x | 15.0.0 | 15.0.8 |
| zustand | 5.0.x | 5.0.0 | 5.0.10 |
| react-native-mmkv | 4.1.x | 4.0.0 | 4.1.1 |

---

## Architecture Pattern: Local-First Quiz

The recommended stack enables this data flow:

```
User Action (tap answer)
    |
    v
Haptic Feedback (instant, no await)
    |
    v
Zustand State Update (sync)
    |
    v
MMKV Persistence (sync, via persist middleware)
    |
    v
Reanimated Animation (UI thread, 60fps)
    |
    v
Visual Feedback (transform/opacity/color)
```

**Key insight:** Everything is synchronous or UI-thread-based. No network calls, no async storage, no loading states. The quiz feels instant because it IS instant.

---

## Sources Summary

### Official Documentation
- [Expo Reanimated](https://docs.expo.dev/versions/latest/sdk/reanimated/)
- [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)
- [Expo Local-First Guide](https://docs.expo.dev/guides/local-first/)
- [Reanimated Performance](https://docs.swmansion.com/react-native-reanimated/docs/guides/performance/)
- [Zustand Persist Middleware](https://zustand.docs.pmnd.rs/integrations/persisting-store-data)

### GitHub
- [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)
- [Zustand Releases](https://github.com/pmndrs/zustand/releases)
- [MMKV Expo 54 Issue (resolved)](https://github.com/expo/expo/issues/38991)
- [MMKV RN 0.81 Fix](https://github.com/mrousavy/react-native-mmkv/issues/849)

### Community Research
- [State of React Native 2024](https://results.stateofreactnative.com/en-US/state-management/)
- [MMKV vs AsyncStorage Benchmark](https://reactnativeexpert.com/blog/mmkv-vs-asyncstorage-in-react-native/)
- [Zustand + MMKV Setup Guide](https://dev.to/mehdifaraji/zustand-mmkv-storage-blazing-fast-persistence-for-zustand-in-react-native-3ef1)
