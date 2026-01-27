# Architecture Patterns: Local-First Quiz App

**Domain:** Local-first mobile quiz application (Expo/React Native)
**Researched:** 2026-01-26
**Confidence:** HIGH (based on official Expo docs, Zustand docs, MMKV docs, and existing codebase analysis)

## Executive Summary

For a local-first quiz app that requires INSTANT performance with trivial data size (~10-50 questions), the recommended architecture is:

1. **Storage:** MMKV (30x faster than AsyncStorage) for immediate read/write
2. **State Management:** Zustand with MMKV persist middleware
3. **Quiz State:** Finite state machine pattern using Zustand
4. **Sync Strategy:** Write-local-first, sync-later to Convex when online

This architecture eliminates loading spinners entirely for quiz content while maintaining a clean path to backend sync for user progress, leaderboards, and authentication.

---

## Recommended Architecture

```
+------------------------------------------------------------------+
|                           UI Layer                                |
|  (React Native components, Expo Router screens)                   |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|                      State Layer (Zustand)                        |
|  +-------------------+  +-------------------+  +--------------+   |
|  |   quizStore       |  |   progressStore   |  |  settingsStore|  |
|  |   (session state) |  |   (streaks, daily)|  |  (preferences)|  |
|  +-------------------+  +-------------------+  +--------------+   |
+------------------------------------------------------------------+
                              |
              +---------------+---------------+
              |                               |
              v                               v
+---------------------------+    +---------------------------+
|    Local Storage (MMKV)   |    |   Remote Sync (Convex)    |
|    - Quiz content         |    |   - User auth             |
|    - Progress data        |    |   - Leaderboards          |
|    - Settings             |    |   - Cloud backup          |
|    - Offline answers      |    |   - Multi-device sync     |
+---------------------------+    +---------------------------+
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|----------------|-------------------|
| Quiz UI | Display questions, capture input | quizStore |
| quizStore | Session state machine, current question | MMKV (persist), progressStore |
| progressStore | Streaks, daily goals, weakness tracking | MMKV (persist), Convex (sync) |
| settingsStore | User preferences, coach style | MMKV (persist) |
| MMKV | Instant local persistence | All stores |
| Convex | Remote data, auth, social features | progressStore (when online) |

### Data Flow

**Quiz Session (No Network Required):**
```
User taps answer
    -> quizStore.submitAnswer()
    -> State machine: answering -> feedback
    -> MMKV persists answer record immediately
    -> UI updates reactively via Zustand subscription
    -> No spinners, no network wait
```

**Progress Sync (Background, When Online):**
```
Session completes
    -> progressStore.recordSession()
    -> MMKV stores locally (instant)
    -> Queue for Convex sync (async)
    -> When online: batch upload to Convex
    -> Conflict resolution: last-write-wins for simple data
```

---

## Storage Strategy: What Goes Where

### MMKV (Local, Instant)

| Data Type | Rationale |
|-----------|-----------|
| Quiz content (questions, answers) | Must be instant, small size, rarely changes |
| Quiz session state | Survives app restart, must be instant |
| Answer history (pending sync) | Local-first, sync when convenient |
| Streak data | Must work offline, sync later |
| Daily progress | Must work offline, sync later |
| User preferences (coach style, theme) | Tiny data, instant access needed |

### Convex (Remote, Async)

| Data Type | Rationale |
|-----------|-----------|
| User authentication | Requires server validation |
| Leaderboard data | Needs server aggregation |
| Cross-device progress | Requires central source of truth |
| Historical HP test PDFs | Large files, already in Convex |
| Subscription status | RevenueCat + server validation |

### Data Schema: Local Storage

```typescript
// types/storage.ts

// Quiz content - bundled with app, cached in MMKV
interface Question {
  id: string;
  section: SectionCode;
  number: number;
  text: string;
  image?: string;
  options: { label: OptionLabel; text: string }[];
  correctAnswer: OptionLabel;
  explanation: string;
}

// User progress - persisted locally, synced to Convex
interface UserProgress {
  userId?: string;              // null until authenticated
  lastSyncedAt?: number;        // timestamp of last Convex sync

  // Streaks
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;     // ISO date

  // Daily goals
  dailyQuestionsAnswered: number;
  dailyCorrect: number;
  dailyGoal: number;            // from settings

  // Section performance (weakness tracking)
  sectionStats: Record<SectionCode, {
    totalAnswered: number;
    totalCorrect: number;
    averageTimeSeconds: number;
  }>;
}

// Pending sync queue - answers to upload when online
interface PendingAnswer {
  questionId: string;
  sessionId: string;
  selected: OptionLabel | null;
  correct: boolean;
  timeSpentSeconds: number;
  answeredAt: number;           // timestamp
}

// Settings - local only, no sync needed
interface UserSettings {
  coachStyle: 'hype' | 'lugn' | 'strikt';
  dailyCommitment: 10 | 15 | 25; // minutes
  targetScore: number;           // 0.0 - 2.0
  examDate?: string;             // ISO date
  notificationsEnabled: boolean;
}
```

---

## State Management Pattern: Quiz State Machine

Use a finite state machine for predictable quiz flow. Zustand makes this clean.

### Quiz State Machine

```typescript
// stores/quizStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/lib/mmkv-storage';

// Finite states for quiz session
type QuizPhase =
  | 'idle'           // No active session
  | 'loading'        // Loading questions (only for remote fetch)
  | 'answering'      // User selecting answer
  | 'feedback'       // Showing correct/incorrect
  | 'summary';       // Session complete, showing results

// Valid transitions
const TRANSITIONS: Record<QuizPhase, QuizPhase[]> = {
  idle: ['loading', 'answering'],  // loading only if fetching remote
  loading: ['answering'],
  answering: ['feedback'],
  feedback: ['answering', 'summary'],  // next question or done
  summary: ['idle'],
};

interface QuizState {
  // Session metadata
  sessionId: string | null;
  section: SectionCode | null;
  startedAt: number | null;

  // Current state
  phase: QuizPhase;
  questions: Question[];
  currentIndex: number;
  selectedOption: OptionLabel | null;

  // Answers for this session
  answers: AnswerRecord[];

  // Question timing
  questionStartTime: number | null;
}

interface QuizActions {
  // Session lifecycle
  startSession: (section: SectionCode, questions: Question[]) => void;
  endSession: () => void;

  // Quiz flow
  selectOption: (option: OptionLabel) => void;
  submitAnswer: () => void;
  continueToNext: () => void;

  // State queries
  canTransitionTo: (phase: QuizPhase) => boolean;
}

export const useQuizStore = create<QuizState & QuizActions>()(
  persist(
    (set, get) => ({
      // Initial state
      sessionId: null,
      section: null,
      startedAt: null,
      phase: 'idle',
      questions: [],
      currentIndex: 0,
      selectedOption: null,
      answers: [],
      questionStartTime: null,

      // Start a new quiz session
      startSession: (section, questions) => {
        set({
          sessionId: `session-${Date.now()}`,
          section,
          startedAt: Date.now(),
          phase: 'answering',
          questions,
          currentIndex: 0,
          selectedOption: null,
          answers: [],
          questionStartTime: Date.now(),
        });
      },

      // End session and transition to summary
      endSession: () => {
        set({ phase: 'summary' });
      },

      // Select an answer option
      selectOption: (option) => {
        const { phase } = get();
        if (phase !== 'answering') return;
        set({ selectedOption: option });
      },

      // Submit the selected answer
      submitAnswer: () => {
        const { phase, selectedOption, questions, currentIndex, questionStartTime, answers } = get();
        if (phase !== 'answering' || !selectedOption) return;

        const question = questions[currentIndex];
        const isCorrect = selectedOption === question.correctAnswer;
        const timeSpent = questionStartTime
          ? Math.round((Date.now() - questionStartTime) / 1000)
          : 0;

        const answer: AnswerRecord = {
          questionId: question.id,
          selected: selectedOption,
          correct: isCorrect,
          timeSpent,
        };

        set({
          phase: 'feedback',
          answers: [...answers, answer],
        });
      },

      // Continue to next question or summary
      continueToNext: () => {
        const { phase, currentIndex, questions } = get();
        if (phase !== 'feedback') return;

        const isLastQuestion = currentIndex >= questions.length - 1;

        if (isLastQuestion) {
          set({ phase: 'summary' });
        } else {
          set({
            phase: 'answering',
            currentIndex: currentIndex + 1,
            selectedOption: null,
            questionStartTime: Date.now(),
          });
        }
      },

      // Check if transition is valid
      canTransitionTo: (targetPhase) => {
        const { phase } = get();
        return TRANSITIONS[phase]?.includes(targetPhase) ?? false;
      },
    }),
    {
      name: 'quiz-session',
      storage: createJSONStorage(() => mmkvStorage),
      // Only persist session data, not UI state
      partialize: (state) => ({
        sessionId: state.sessionId,
        section: state.section,
        startedAt: state.startedAt,
        phase: state.phase,
        questions: state.questions,
        currentIndex: state.currentIndex,
        answers: state.answers,
      }),
    }
  )
);
```

### MMKV Storage Adapter for Zustand

```typescript
// lib/mmkv-storage.ts
import { MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

// Create MMKV instance
const storage = new MMKV({
  id: 'maxa-storage',
  // encryptionKey: 'optional-encryption-key', // Add for sensitive data
});

// Zustand-compatible storage adapter
export const mmkvStorage: StateStorage = {
  setItem: (name, value) => {
    storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    storage.delete(name);
  },
};
```

### Progress Store (Persistence + Sync)

```typescript
// stores/progressStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/lib/mmkv-storage';

interface ProgressState {
  // Streaks
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;

  // Daily
  dailyQuestionsAnswered: number;
  dailyCorrect: number;

  // Section stats
  sectionStats: Record<SectionCode, SectionStat>;

  // Sync metadata
  pendingSync: PendingAnswer[];
  lastSyncedAt: number | null;
}

interface ProgressActions {
  recordAnswer: (answer: AnswerRecord, section: SectionCode) => void;
  recordSessionComplete: (answers: AnswerRecord[], section: SectionCode) => void;
  updateStreak: () => void;
  resetDaily: () => void;
  markSynced: (timestamp: number) => void;
  getPendingSync: () => PendingAnswer[];
  clearPendingSync: () => void;
}

export const useProgressStore = create<ProgressState & ProgressActions>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      dailyQuestionsAnswered: 0,
      dailyCorrect: 0,
      sectionStats: {},
      pendingSync: [],
      lastSyncedAt: null,

      recordAnswer: (answer, section) => {
        const { sectionStats, pendingSync } = get();
        const currentStat = sectionStats[section] ?? {
          totalAnswered: 0,
          totalCorrect: 0,
          averageTimeSeconds: 0,
        };

        // Update section stats
        const newTotalAnswered = currentStat.totalAnswered + 1;
        const newTotalCorrect = currentStat.totalCorrect + (answer.correct ? 1 : 0);
        const newAvgTime =
          (currentStat.averageTimeSeconds * currentStat.totalAnswered + answer.timeSpent) /
          newTotalAnswered;

        set({
          sectionStats: {
            ...sectionStats,
            [section]: {
              totalAnswered: newTotalAnswered,
              totalCorrect: newTotalCorrect,
              averageTimeSeconds: newAvgTime,
            },
          },
          dailyQuestionsAnswered: get().dailyQuestionsAnswered + 1,
          dailyCorrect: get().dailyCorrect + (answer.correct ? 1 : 0),
          pendingSync: [
            ...pendingSync,
            {
              ...answer,
              answeredAt: Date.now(),
              sessionId: 'current', // Will be set properly
            },
          ],
        });
      },

      recordSessionComplete: (answers, section) => {
        answers.forEach((answer) => get().recordAnswer(answer, section));
        get().updateStreak();
      },

      updateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastActivityDate, currentStreak, longestStreak } = get();

        if (lastActivityDate === today) return; // Already updated today

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const newStreak = lastActivityDate === yesterdayStr
          ? currentStreak + 1
          : 1;

        set({
          currentStreak: newStreak,
          longestStreak: Math.max(longestStreak, newStreak),
          lastActivityDate: today,
        });
      },

      resetDaily: () => {
        set({
          dailyQuestionsAnswered: 0,
          dailyCorrect: 0,
        });
      },

      markSynced: (timestamp) => {
        set({ lastSyncedAt: timestamp });
      },

      getPendingSync: () => get().pendingSync,

      clearPendingSync: () => {
        set({ pendingSync: [] });
      },
    }),
    {
      name: 'user-progress',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
```

---

## Suggested File/Folder Structure

```
apps/mobile/
├── app/                          # Expo Router routes
│   ├── _layout.tsx               # Root: providers wrapper
│   ├── (tabs)/                   # Main tab navigation
│   │   ├── index.tsx             # Idag (Today)
│   │   ├── trana.tsx             # Trana (Practice)
│   │   └── jag.tsx               # Jag (Profile)
│   ├── quiz/
│   │   ├── _layout.tsx           # Quiz stack layout
│   │   ├── index.tsx             # Quiz screen (state machine)
│   │   └── summary.tsx           # Session summary
│   └── (onboarding)/             # Future: onboarding flow
│
├── components/
│   ├── quiz/                     # Quiz-specific components
│   │   ├── QuestionCard.tsx
│   │   ├── OptionButton.tsx
│   │   ├── FeedbackFooter.tsx
│   │   └── QuizHeader.tsx
│   └── ui/                       # Shared UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       └── ProgressBar.tsx
│
├── stores/                       # Zustand stores (NEW)
│   ├── quizStore.ts              # Quiz session state machine
│   ├── progressStore.ts          # User progress & streaks
│   ├── settingsStore.ts          # User preferences
│   └── contentStore.ts           # Quiz content cache
│
├── lib/                          # Utilities (NEW)
│   ├── mmkv-storage.ts           # MMKV adapter for Zustand
│   └── sync.ts                   # Convex sync utilities
│
├── data/                         # Static content (NEW)
│   └── questions/                # Bundled question data
│       ├── index.ts              # Question loader
│       ├── xyz.json              # XYZ section questions
│       └── ord.json              # ORD section questions
│
├── hooks/
│   ├── useQuiz.ts                # Quiz session hook (wraps store)
│   ├── useProgress.ts            # Progress tracking hook
│   └── useSync.ts                # Sync status hook
│
├── constants/
│   ├── theme.ts                  # Design tokens (existing)
│   ├── quiz-config.ts            # Quiz settings (existing)
│   └── sections.ts               # HP section definitions
│
└── types/
    ├── quiz.ts                   # Quiz-related types
    ├── storage.ts                # Storage schema types
    └── sync.ts                   # Sync-related types
```

---

## Offline-to-Online Transition

### Strategy: Optimistic Local, Eventual Consistency

```typescript
// lib/sync.ts
import { useProgressStore } from '@/stores/progressStore';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import NetInfo from '@react-native-community/netinfo';

export function useSyncProgress() {
  const syncAnswers = useMutation(api.answers.batchSync);
  const { getPendingSync, clearPendingSync, markSynced } = useProgressStore();

  const sync = async () => {
    // Check connectivity
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) return { synced: false, reason: 'offline' };

    const pending = getPendingSync();
    if (pending.length === 0) return { synced: true, count: 0 };

    try {
      // Batch upload to Convex
      await syncAnswers({ answers: pending });

      // Clear local queue on success
      clearPendingSync();
      markSynced(Date.now());

      return { synced: true, count: pending.length };
    } catch (error) {
      // Keep pending for retry
      return { synced: false, reason: 'error', error };
    }
  };

  return { sync };
}

// Use in app lifecycle
export function SyncManager({ children }) {
  const { sync } = useSyncProgress();

  useEffect(() => {
    // Sync on app foreground
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        sync();
      }
    });

    // Sync on network reconnect
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        sync();
      }
    });

    return () => {
      subscription.remove();
      unsubscribe();
    };
  }, []);

  return children;
}
```

### Conflict Resolution

For this app's data model, **last-write-wins** is sufficient:
- Progress data (streaks, stats) only flows one direction: device -> server
- No collaborative editing scenarios
- User can only be on one device at a time for quiz sessions

If multi-device sync is added later, consider:
- CRDT libraries (Yjs, Automerge) for complex merge
- Server-authoritative timestamps for ordering

---

## Patterns to Follow

### Pattern 1: Instant Data Access

**What:** All quiz content is bundled with the app and cached in MMKV.
**When:** App startup, question loading.

```typescript
// hooks/useQuestions.ts
import { useContentStore } from '@/stores/contentStore';

export function useQuestions(section: SectionCode) {
  const getQuestions = useContentStore((s) => s.getQuestionsForSection);

  // This is synchronous - no loading state needed
  const questions = getQuestions(section, 10);

  return { questions, isLoading: false };
}

// In component - no loading spinner
function StartQuiz({ section }) {
  const { questions } = useQuestions(section);
  const startSession = useQuizStore((s) => s.startSession);

  const handleStart = () => {
    // Instant - data already in memory
    startSession(section, questions);
  };

  return <Button onPress={handleStart}>Starta</Button>;
}
```

### Pattern 2: State Machine Transitions

**What:** Quiz UI reacts to state machine phase changes.
**When:** Any user interaction during quiz.

```typescript
// components/quiz/QuizFlow.tsx
import { useQuizStore } from '@/stores/quizStore';

export function QuizFlow() {
  const phase = useQuizStore((s) => s.phase);
  const currentQuestion = useQuizStore((s) => s.questions[s.currentIndex]);

  // Render based on state machine phase
  switch (phase) {
    case 'idle':
      return <QuizStartScreen />;
    case 'answering':
      return <QuestionCard question={currentQuestion} />;
    case 'feedback':
      return <FeedbackScreen />;
    case 'summary':
      return <SummaryScreen />;
    default:
      return null;
  }
}
```

### Pattern 3: Persist Session Recovery

**What:** Quiz session survives app restart mid-quiz.
**When:** App backgrounded/killed during quiz.

```typescript
// app/quiz/_layout.tsx
import { useQuizStore } from '@/stores/quizStore';
import { useEffect, useState } from 'react';

export default function QuizLayout() {
  const [hydrated, setHydrated] = useState(false);
  const phase = useQuizStore((s) => s.phase);

  // Wait for Zustand to rehydrate from MMKV
  useEffect(() => {
    const unsubscribe = useQuizStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    // Check if already hydrated
    if (useQuizStore.persist.hasHydrated()) {
      setHydrated(true);
    }

    return unsubscribe;
  }, []);

  if (!hydrated) {
    // Brief splash while rehydrating (typically <50ms with MMKV)
    return null;
  }

  // Resume where user left off
  return <Slot />;
}
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Network-First for Quiz Content

**What:** Fetching questions from Convex on every quiz start.
**Why Bad:** Adds latency, requires loading states, breaks offline.
**Instead:** Bundle questions with app, cache in MMKV.

### Anti-Pattern 2: Global Loading States

**What:** Showing spinners while data loads.
**Why Bad:** Breaks "instant" requirement, poor UX.
**Instead:** Pre-load all quiz data into MMKV on app start.

### Anti-Pattern 3: Untyped Storage Keys

**What:** Using string literals for MMKV keys everywhere.
**Why Bad:** Typos cause bugs, no autocomplete.
**Instead:** Centralize key definitions with TypeScript.

```typescript
// constants/storage-keys.ts
export const STORAGE_KEYS = {
  QUIZ_SESSION: 'quiz-session',
  USER_PROGRESS: 'user-progress',
  USER_SETTINGS: 'user-settings',
  QUESTION_CACHE: 'question-cache',
} as const;
```

### Anti-Pattern 4: Syncing Every Action

**What:** Calling Convex mutation on every answer.
**Why Bad:** Unnecessary network traffic, battery drain.
**Instead:** Batch sync on session complete or app background.

---

## Performance Considerations

| Concern | Implementation | Rationale |
|---------|----------------|-----------|
| Initial load time | Questions bundled as JSON, loaded to MMKV on first run | MMKV reads are <1ms |
| Quiz navigation | Zustand selectors prevent unnecessary re-renders | Only subscribed components update |
| Answer recording | MMKV write is synchronous, no await | User sees instant feedback |
| Session recovery | MMKV persists mid-quiz state | 100% session recovery after crash |
| Memory usage | ~10-50 questions in memory (~50KB) | Negligible for modern devices |
| Battery | Batch sync instead of per-action | Fewer radio wakeups |

### Benchmarks (Expected)

| Operation | Expected Time | Technology |
|-----------|--------------|------------|
| Read question | <1ms | MMKV getString |
| Write answer | <1ms | MMKV set |
| Start session | <5ms | Zustand state update |
| Session recovery | <50ms | MMKV rehydration |
| Full sync | 200-500ms | Convex batch mutation |

---

## Build Order for Phases

### Phase 1: Foundation (MMKV + Zustand Setup)

1. Install dependencies: `react-native-mmkv`, `zustand`
2. Create `lib/mmkv-storage.ts` adapter
3. Create `stores/quizStore.ts` with state machine
4. Create `stores/progressStore.ts` for streaks/stats
5. Wire up existing quiz screen to use stores

**Validates:** Local-first architecture works, instant feel confirmed.

### Phase 2: Quiz Flow Completion

1. Refactor `app/quiz/index.tsx` to use quizStore
2. Implement full state machine transitions
3. Add session recovery on app restart
4. Connect progress tracking to progressStore

**Validates:** Complete quiz flow works offline.

### Phase 3: Progress & Streaks

1. Implement streak calculation logic
2. Add daily goal tracking
3. Create section weakness calculations
4. Build Jag (profile) screen with stats

**Validates:** Gamification works locally.

### Phase 4: Sync Layer

1. Add NetInfo for connectivity detection
2. Create sync queue in progressStore
3. Build Convex mutations for batch sync
4. Implement background sync on app lifecycle

**Validates:** Local data syncs to cloud when online.

---

## Sources

**Official Documentation (HIGH confidence):**
- [Expo Local-First Architecture Guide](https://docs.expo.dev/guides/local-first/)
- [Expo Store Data Guide](https://docs.expo.dev/develop/user-interface/store-data/)
- [MMKV Zustand Persist Middleware](https://github.com/mrousavy/react-native-mmkv/blob/main/docs/WRAPPER_ZUSTAND_PERSIST_MIDDLEWARE.md)

**Verified Sources (MEDIUM confidence):**
- [Zustand Persist Documentation](https://zustand.docs.pmnd.rs/integrations/persisting-store-data)
- [MMKV vs AsyncStorage Comparison](https://reactnativeexpert.com/blog/mmkv-vs-asyncstorage-in-react-native/)
- [Convex React Native Docs](https://docs.convex.dev/client/react-native)
- [Going Local-First with Automerge and Convex](https://stack.convex.dev/automerge-and-convex)

**Pattern References (MEDIUM confidence):**
- [useReducer as Finite State Machine](https://kyleshevlin.com/how-to-use-usereducer-as-a-finite-state-machine/)
- [Zustand in React Native](https://medium.com/@arsathcomeng/zustand-in-react-native-c53381796bf7)
- [zustand-mmkv-storage](https://github.com/1mehdifaraji/zustand-mmkv-storage)

---

## Confidence Assessment

| Area | Confidence | Rationale |
|------|------------|-----------|
| MMKV as storage | HIGH | Official docs, widespread adoption, clear benchmarks |
| Zustand + persist | HIGH | Official middleware, React Native compatibility documented |
| State machine pattern | HIGH | Well-established pattern, matches existing code structure |
| Convex sync strategy | MEDIUM | Convex supports React Native, but offline sync is emerging |
| Build order | HIGH | Based on existing codebase analysis and dependencies |

---

*Architecture research complete. This document informs implementation of local-first quiz functionality.*
