# Phase 1: Foundation - Research

**Researched:** 2026-01-26
**Domain:** Local-first state management (MMKV + Zustand) for React Native/Expo
**Confidence:** HIGH

## Summary

This phase adds synchronous local storage and persistent state management to the Maxa mobile app. The standard approach combines `react-native-mmkv` for blazing-fast synchronous storage with Zustand for lightweight state management. This combination is the established best practice in the React Native ecosystem for apps that need instant state reads without loading flash.

The existing codebase already has the new architecture enabled (`newArchEnabled: true`), uses Expo SDK 54 with React Native 0.81, and has mock questions structured with proper types. The quiz flow is implemented but uses local React state that doesn't persist across app restarts.

**Primary recommendation:** Use react-native-mmkv v4.x with Zustand v5.x persist middleware. Create two separate stores: `quizStore` (active session) and `progressStore` (cumulative stats). MMKV's synchronous nature eliminates loading flash entirely.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-native-mmkv | ^4.1.1 | Synchronous key-value storage | 30x faster than AsyncStorage, synchronous reads prevent loading flash, Nitro Module for new arch |
| zustand | ^5.0.10 | Lightweight state management | Hook-based, no providers needed, <2KB, perfect TypeScript support |
| react-native-nitro-modules | latest | MMKV v4 dependency | Required peer dependency for MMKV Nitro Module |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| zustand/middleware | (bundled) | Persist middleware | Always - provides `persist` and `createJSONStorage` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-native-mmkv | @react-native-async-storage/async-storage | AsyncStorage is async, causes loading flash, 30x slower |
| zustand | Redux Toolkit | Redux has more boilerplate, providers required, overkill for this app size |
| zustand | Jotai/Recoil | Atomic model better for deeply nested state, unnecessary complexity here |

**Installation:**
```bash
npx expo install react-native-mmkv react-native-nitro-modules
npx expo prebuild
bun add zustand
```

Note: Requires development build (CNG workflow). MMKV contains native code not in Expo Go.

## Architecture Patterns

### Recommended Project Structure
```
apps/mobile/
├── stores/
│   ├── index.ts              # Re-exports all stores
│   ├── storage.ts            # MMKV instance + Zustand adapter
│   ├── quizStore.ts          # Active quiz session state
│   └── progressStore.ts      # Cumulative progress/XP state
├── constants/
│   └── mock-questions.ts     # Existing - expand with more types
└── types/
    └── quiz.ts               # Shared quiz types (may reuse existing)
```

### Pattern 1: MMKV Storage Adapter for Zustand
**What:** Create a StateStorage-compatible adapter wrapping MMKV
**When to use:** Always - this bridges MMKV to Zustand's persist middleware
**Example:**
```typescript
// Source: https://github.com/mrousavy/react-native-mmkv/blob/main/docs/WRAPPER_ZUSTAND_PERSIST_MIDDLEWARE.md
import { StateStorage } from 'zustand/middleware'
import { createMMKV } from 'react-native-mmkv'

const storage = createMMKV({ id: 'maxa-storage' })

export const zustandStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => storage.getString(name) ?? null,
  removeItem: (name) => storage.remove(name),
}
```

### Pattern 2: Typed Zustand Store with Persist
**What:** Create stores with TypeScript interfaces and persist middleware
**When to use:** For any state that needs to survive app restart
**Example:**
```typescript
// Source: https://zustand.docs.pmnd.rs/middlewares/persist
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { zustandStorage } from './storage'

interface QuizState {
  currentQuestionIndex: number
  answers: AnswerRecord[]
  sessionStartTime: number | null
  // actions
  startSession: (questions: Question[]) => void
  submitAnswer: (answer: AnswerRecord) => void
  nextQuestion: () => void
  endSession: () => void
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      currentQuestionIndex: 0,
      answers: [],
      sessionStartTime: null,
      // ... actions
    }),
    {
      name: 'quiz-session',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
)
```

### Pattern 3: Separate Stores for Different Concerns
**What:** Multiple focused stores instead of one monolithic store
**When to use:** When state has different lifecycles (session vs. cumulative)
**Example:**
```typescript
// quizStore - cleared after each session completes
// progressStore - accumulates forever (XP, streak, history)
```

### Anti-Patterns to Avoid
- **Storing large data in MMKV:** MMKV uses memory-mapped files; large data consumes memory. Keep quiz state small.
- **Single monolithic store:** Don't mix session state (ephemeral) with progress state (cumulative). Different lifecycles.
- **Async patterns with MMKV:** Don't wrap MMKV calls in Promises. It's synchronous by design.
- **Reading state inside set():** Use `get()` to read current state, not closure variables.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| State persistence | Custom file-based storage | Zustand persist + MMKV | Handles serialization, hydration, version migration |
| Storage encryption | DIY encryption | MMKV's built-in `encryptionKey` option | Tested, performant, handles key management |
| State selectors | Manual memoization | Zustand's built-in selector pattern | Automatic re-render optimization |
| Hydration tracking | Manual flags | `onRehydrateStorage` callback | Zustand handles the lifecycle |

**Key insight:** MMKV + Zustand persist is battle-tested in production by thousands of apps. Custom solutions will have edge cases around app lifecycle, memory pressure, and concurrent access that these libraries already handle.

## Common Pitfalls

### Pitfall 1: Trying to Use MMKV in Expo Go
**What goes wrong:** Runtime error - MMKV has native code not bundled in Expo Go
**Why it happens:** MMKV is a native module requiring custom dev client
**How to avoid:** Always use `npx expo prebuild` and run dev builds, not Expo Go
**Warning signs:** Error "Cannot find native module 'MMKV'" or similar

### Pitfall 2: Forgetting createJSONStorage Wrapper
**What goes wrong:** Store fails to persist or corrupts data
**Why it happens:** MMKV stores strings; Zustand state is objects
**How to avoid:** Always wrap storage adapter in `createJSONStorage()`
**Warning signs:** `[object Object]` stored instead of JSON, or parse errors on read

### Pitfall 3: Not Handling MMKV v4 Nitro Module Setup
**What goes wrong:** Build fails with C++ errors on Android
**Why it happens:** MMKV v4 uses Nitro Modules requiring new architecture
**How to avoid:** Ensure `newArchEnabled: true` in app.json (already set), install `react-native-nitro-modules`
**Warning signs:** CMake errors about C++ standards, "NitroModules not found"

### Pitfall 4: Storing Functions or Non-Serializable Data
**What goes wrong:** State doesn't persist or throws on hydration
**Why it happens:** JSON.stringify can't handle functions, circular refs, Date objects
**How to avoid:** Store only serializable primitives, arrays, plain objects. Use `partialize` to exclude functions.
**Warning signs:** Console warnings about serialization, missing state after restart

### Pitfall 5: Race Condition on Session Resume
**What goes wrong:** Quiz shows question 0 briefly before jumping to saved position
**Why it happens:** Component renders before hydration completes (if using async storage)
**How to avoid:** MMKV is synchronous so this shouldn't happen. If it does, check that adapter is correct.
**Warning signs:** Flash of initial state on app open

## Code Examples

Verified patterns from official sources:

### MMKV Instance Creation (V4 API)
```typescript
// Source: https://github.com/mrousavy/react-native-mmkv
import { createMMKV } from 'react-native-mmkv'

// Default instance
export const storage = createMMKV()

// Named instance with encryption
export const secureStorage = createMMKV({
  id: 'secure-vault',
  encryptionKey: 'your-key-here', // optional
})
```

### Complete Store with Persist
```typescript
// Source: https://zustand.docs.pmnd.rs/integrations/persisting-store-data
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface ProgressState {
  totalXP: number
  sessionsCompleted: number
  currentStreak: number
  lastSessionDate: string | null
  // actions
  addXP: (amount: number) => void
  completeSession: () => void
  updateStreak: () => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      totalXP: 0,
      sessionsCompleted: 0,
      currentStreak: 0,
      lastSessionDate: null,

      addXP: (amount) => set((state) => ({ totalXP: state.totalXP + amount })),

      completeSession: () => set((state) => ({
        sessionsCompleted: state.sessionsCompleted + 1,
      })),

      updateStreak: () => {
        const today = new Date().toISOString().split('T')[0]
        const lastDate = get().lastSessionDate
        // Streak logic here
        set({ lastSessionDate: today })
      },
    }),
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
)
```

### Using Store in Components
```typescript
// Source: https://github.com/pmndrs/zustand
import { useQuizStore } from '@/stores/quizStore'

function QuizScreen() {
  // Select only what you need - prevents unnecessary re-renders
  const currentIndex = useQuizStore((state) => state.currentQuestionIndex)
  const submitAnswer = useQuizStore((state) => state.submitAnswer)

  // Use in component
  return <Text>Question {currentIndex + 1}</Text>
}
```

### XP Calculation Pattern
```typescript
// XP earned per correct answer
const BASE_XP = 10
const STREAK_BONUS = 2 // per correct in a row within session
const SPEED_BONUS_THRESHOLD = 0.7 // if under 70% of target time

function calculateXP(
  isCorrect: boolean,
  timeSpent: number,
  targetTime: number,
  correctStreak: number
): number {
  if (!isCorrect) return 0

  let xp = BASE_XP
  xp += correctStreak * STREAK_BONUS

  if (timeSpent < targetTime * SPEED_BONUS_THRESHOLD) {
    xp += 5 // speed bonus
  }

  return xp
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| AsyncStorage | MMKV | 2022+ | Synchronous reads, 30x faster, no loading flash |
| Redux + Redux Persist | Zustand + persist middleware | 2023+ | 90% less boilerplate, no providers |
| MMKV v3 (TurboModule) | MMKV v4 (Nitro Module) | 2025 | Better perf, simplified setup, pure C++ |
| Class-based stores | Hook-based stores | 2020+ | Better React integration, simpler API |

**Deprecated/outdated:**
- `@react-native-community/async-storage`: Still works but async nature causes UX issues
- `react-native-mmkv` v3: Works but v4 is recommended for new projects on RN 0.75+
- Redux for small/medium apps: Overkill; Zustand is the modern choice

## HP Question Types Reference

Based on Hogskoleprovet structure for mock data creation:

### Quantitative (80 questions total)
| Code | Swedish | English | Count | Description |
|------|---------|---------|-------|-------------|
| XYZ | Matematisk problemlosning | Math Problem-Solving | 24 | Arithmetic, algebra, geometry, statistics |
| KVA | Kvantitativa jamforelser | Quantitative Comparisons | 20 | Compare two quantities |
| NOG | Nodvandig information | Data Sufficiency | 12 | Determine if info is sufficient |
| DTK | Diagram, tabeller, kartor | Diagrams/Tables/Maps | 24 | Interpret visual data |

### Verbal (80 questions total)
| Code | Swedish | English | Count | Description |
|------|---------|---------|-------|-------------|
| ORD | Ordforstaelse | Vocabulary | 20 | Word meanings |
| LAS | Lasforstaelse | Swedish Reading | 20 | Text comprehension |
| MEK | Meningskomplettering | Sentence Completion | 20 | Fill in blanks |
| ELF | Engelsk lasforstaelse | English Reading | 20 | English text comprehension |

For mock data: Create 10 questions covering at least 4 types (ORD, LAS, XYZ, KVA per CONTEXT.md).

## Open Questions

Things that couldn't be fully resolved:

1. **Jest testing with MMKV v4**
   - What we know: Some users report issues with "Failed to get NitroModules" in tests
   - What's unclear: Exact mock setup for v4 Nitro Module
   - Recommendation: May need to mock MMKV in tests or use integration tests. Low priority for Phase 1.

2. **Android build with SDK 54**
   - What we know: Issue #38991 was closed, fix is in MMKV v4
   - What's unclear: Whether any additional config needed
   - Recommendation: Use latest MMKV v4.1.1, monitor build output

## Sources

### Primary (HIGH confidence)
- [react-native-mmkv GitHub](https://github.com/mrousavy/react-native-mmkv) - V4 API, Zustand integration docs
- [Zustand GitHub](https://github.com/pmndrs/zustand) - v5.0.10, persist middleware docs
- [Zustand persist docs](https://zustand.docs.pmnd.rs/middlewares/persist) - Official middleware documentation

### Secondary (MEDIUM confidence)
- [MMKV + Zustand integration guide](https://github.com/mrousavy/react-native-mmkv/blob/main/docs/WRAPPER_ZUSTAND_PERSIST_MIDDLEWARE.md) - Official wrapper docs
- [Expo SDK 54 changelog](https://expo.dev/changelog/sdk-54) - RN 0.81, new arch status
- [MMKV issue #849](https://github.com/mrousavy/react-native-mmkv/issues/849) - SDK 54 build fix confirmed in v4

### Tertiary (LOW confidence)
- [Medium: Zustand + MMKV setup](https://medium.com/@nithinpatelmlm/expo-react-native-easy-offline-first-setup-in-expo-using-mmkv-and-zustand-react-native-mmkv-and-68f662c6bc3f) - Community guide, patterns verified with official docs
- [Dev.to: zustand-mmkv-storage](https://dev.to/mehdifaraji/zustand-mmkv-storage-blazing-fast-persistence-for-zustand-in-react-native-3ef1) - Alternative adapter package

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Well-documented, widely used, verified with official sources
- Architecture: HIGH - Patterns from official docs, matches existing codebase structure
- Pitfalls: HIGH - Documented issues with known fixes
- HP question types: HIGH - Verified with official studera.nu and Wikipedia sources

**Research date:** 2026-01-26
**Valid until:** 2026-02-26 (30 days - stable libraries, patterns unlikely to change)
