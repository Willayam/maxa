# Phase 3: Main App Experience - Research

**Researched:** 2026-01-26
**Domain:** Mobile gamification, tab consistency, engagement UX patterns
**Confidence:** HIGH

## Summary

This research investigated implementation approaches for polishing all three tabs with consistent design, integrating gamification (streaks, XP, daily goals), and adding an AI coach with personality-based messaging. The focus is on proven engagement patterns from Duolingo and fitness apps that drive daily return visits for users aged 16-25.

**Key findings:**
- Duolingo's streak system increases commitment by 60% when users reach 7+ days, with streak freeze features reducing churn by 21%
- Bite-sized 5-10 minute sessions maximize engagement without overdoing session length
- React Native Reanimated + Lottie/Fiesta provide celebration animations; Zustand + MMKV offer ~30x faster persistence than AsyncStorage
- Growth mindset messaging works best when focused on process (effort, strategies) rather than outcomes, especially after setbacks
- Gamification pitfalls include losing sight of learning objectives, undermining intrinsic motivation with excessive rewards, and demotivating users with always-visible leaderboards

**Primary recommendation:** Implement streaks with freeze mechanics, progressive XP curves with early quick wins, bite-sized practice sessions (10-15 questions), and contextual Max coach messages that focus on growth mindset rather than pure hype.

## Standard Stack

The established libraries/tools for mobile gamification in React Native:

### Core Animation & Celebration
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-native-reanimated | 4.x | UI thread animations, micro-interactions | Industry standard, 120fps+, worklet support |
| @shopify/react-native-skia | Latest | Canvas-based celebration animations | High-performance 2D graphics, used by Shopify |
| react-native-fiesta | Latest | Pre-built celebration animations (confetti, etc.) | Built on Skia, ready-to-use celebrations |
| lottie-react-native | Latest | Complex animated assets from LottieFiles | Designer-friendly, widely used for gamification |

### State Management & Persistence
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| zustand | 4.x | Lightweight state management | Already in codebase, ~30x faster with MMKV |
| react-native-mmkv | Latest | Synchronous key-value storage | ~30x faster than AsyncStorage, encryption support |
| zustand-mmkv-storage | Latest | Zustand persist adapter for MMKV | Handles lazy loading, caching, hydration |

### Haptic Feedback
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| expo-haptics | Latest | Platform-native haptic patterns | Already in codebase, Expo-integrated |
| react-native-turbo-haptics | (Alternative) | Worklet-compatible haptics with 9 patterns | For worklet integration if needed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-native-haptic-patterns | Latest | Custom haptic patterns with recording | Only if default patterns insufficient |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Reanimated + Skia | Rive | Rive offers interactive animations but heavier, Skia more performant for celebrations |
| MMKV | AsyncStorage | AsyncStorage is simpler but 30x slower, not suitable for frequent writes |
| Lottie | Custom Canvas | Custom provides flexibility but requires more development time |

**Installation:**
```bash
# Already installed (from Phase 1)
# - react-native-reanimated
# - expo-haptics
# - zustand
# - react-native-mmkv

# New for Phase 3
bun add @shopify/react-native-skia react-native-fiesta lottie-react-native zustand-mmkv-storage
```

## Architecture Patterns

### Recommended State Structure

Gamification state should be separated into logical stores:

```typescript
// stores/gamificationStore.ts
interface GamificationState {
  // Streak tracking
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string; // ISO date
  streakFreezes: number; // 0-2

  // XP and levels
  totalXP: number;
  level: number;
  xpToNextLevel: number;

  // Daily goals
  dailyGoal: number; // questions per day
  dailyProgress: number; // questions completed today
  lastGoalCompletionDate: string;

  // Actions
  incrementStreak: () => void;
  awardXP: (amount: number) => void;
  completeQuestion: (correct: boolean) => void;
  purchaseStreakFreeze: () => void;
  useStreakFreeze: () => void;
}

// stores/coachStore.ts
interface CoachState {
  personality: 'Hype' | 'Lugn' | 'Strikt';
  lastMessageDate: string;
  messageHistory: CoachMessage[];

  // Get contextual message based on event
  getMessage: (context: MessageContext) => string;
}

type MessageContext =
  | { type: 'quiz_complete'; correct: number; total: number; streakActive: boolean }
  | { type: 'streak_milestone'; days: number }
  | { type: 'tab_visit'; tab: 'Idag' | 'Träna' | 'Jag' }
  | { type: 'daily_goal_complete' };
```

### Pattern 1: Streak Tracking with Freeze Mechanics

**What:** Track consecutive days of activity with "streak freeze" safety net that protects streaks when users miss a day

**When to use:** Core gamification feature for daily engagement

**Implementation approach:**
- Check streak on app open: compare `lastActivityDate` with today
- If gap = 1 day AND user has freezes → consume freeze, maintain streak
- If gap = 1 day AND no freezes → reset streak to 0
- If gap > 1 day → reset streak regardless
- Award streak freezes at milestones (7 days, 30 days)
- Max 2 freezes held at once

**Why freezes matter:** Duolingo data shows streak freezes reduced churn by 21% and increased DAU by +0.38%. Users need flexibility without making streaks meaningless.

**Example:**
```typescript
// Source: Duolingo gamification research + Trophy.so streak guides
function checkStreak(state: GamificationState): void {
  const today = new Date().toISOString().split('T')[0];
  const lastDate = state.lastActivityDate;
  const daysSinceActivity = dateDiff(lastDate, today);

  if (daysSinceActivity === 0) {
    // Already logged in today
    return;
  }

  if (daysSinceActivity === 1) {
    // Normal streak continuation
    state.incrementStreak();
    state.lastActivityDate = today;
  } else if (daysSinceActivity === 2 && state.streakFreezes > 0) {
    // Use freeze to save streak (missed yesterday)
    state.useStreakFreeze();
    state.lastActivityDate = today;
    // Trigger celebration: "Streak saved!"
  } else {
    // Streak broken
    state.currentStreak = 0;
    state.lastActivityDate = today;
    // Show empathetic message: "Starting fresh today!"
  }
}
```

### Pattern 2: Progressive XP Curves

**What:** Non-linear XP requirements that provide quick early wins, then gradually increase to make later levels feel meaningful

**When to use:** Level/progression systems that need to maintain long-term engagement

**Recommended curve:** Polynomial (level^1.5 to level^2) for balance between quick early progression and satisfying late-game milestones

**Formula options:**
- **Early game (Levels 1-10):** Linear or shallow polynomial (level * 100 or level^1.2 * 50)
- **Mid game (Levels 11-30):** Polynomial (level^1.5 * 50)
- **Late game (Levels 31+):** Steeper polynomial (level^2 * 30)

**XP awards per question:**
- Correct answer: 10 XP base
- First try: +5 XP bonus
- Streak active (3+ days): +3 XP bonus
- Double XP events: 2x multiplier

**Example:**
```typescript
// Source: XP curve design patterns + mobile game progression research
function calculateXPForLevel(level: number): number {
  if (level <= 10) {
    // Quick early progression: 100, 200, 300...
    return level * 100;
  } else if (level <= 30) {
    // Gradual increase
    return Math.floor(Math.pow(level, 1.5) * 50);
  } else {
    // Significant milestones
    return Math.floor(Math.pow(level, 2) * 30);
  }
}

function awardQuestionXP(correct: boolean, firstTry: boolean, streakActive: boolean): number {
  if (!correct) return 0;

  let xp = 10; // Base
  if (firstTry) xp += 5;
  if (streakActive) xp += 3;

  return xp;
}
```

### Pattern 3: Celebration Animations with Haptics

**What:** Visual + tactile feedback for achievements that creates dopamine hits without disrupting flow

**When to use:** Streak milestones (3, 7, 30 days), level ups, daily goal completion

**Stagger pattern (Duolingo-style):**
1. Haptic impact (Medium) → immediate tactile feedback
2. Scale animation (1.0 → 1.2 → 1.0) → 300ms bounce
3. Confetti/Lottie animation → 1-2 seconds
4. Toast message → appears with spring animation

**Example:**
```typescript
// Source: React Native Reanimated best practices + Duolingo UX patterns
import { withSpring, withSequence, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

function celebrateStreakMilestone(days: number) {
  // 1. Haptic first (instant feedback)
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

  // 2. Scale animation
  streakScale.value = withSequence(
    withSpring(1.2, { damping: 10 }),
    withSpring(1.0, { damping: 15 })
  );

  // 3. Confetti (react-native-fiesta or Lottie)
  setShowConfetti(true);
  setTimeout(() => setShowConfetti(false), 2000);

  // 4. Toast message
  showToast(`${days} dagar i rad! 🔥`);
}
```

### Pattern 4: Contextual Max Coach Messages

**What:** AI coach provides growth mindset messages at key moments, with tone adapted to user's chosen personality

**When to use:** Quiz completion, streak milestones, tab visits, daily goal completion

**Message triggers:**
- **Quiz complete:** Process-focused feedback ("Du löste 8/10 på första försöket!")
- **Streak milestone:** Encouragement without pressure ("3 dagar i rad - du bygger en vana!")
- **Setback (broke streak):** Reframe as learning ("Ny dag, ny chans att träna!")
- **Daily goal hit:** Celebrate effort ("Dagens mål klarat! 🎯")

**Personality tones:**
| Personality | Voice | Example |
|-------------|-------|---------|
| Hype | Energetic, emoji-heavy, exclamation points | "GRYM JOBBAT! 🔥 7 dagar i rad - du är oslagbar!" |
| Lugn | Calm, supportive, reassuring | "Bra jobbat idag. Sju dagar i rad visar på konsistens." |
| Strikt | Direct, fact-based, goal-oriented | "7 dagars streak. Fortsätt så här för 1.8+ resultat." |

**Example:**
```typescript
// Source: Growth mindset research + Max coach personality guidelines
function getCoachMessage(context: MessageContext, personality: Personality): string {
  if (context.type === 'quiz_complete') {
    const { correct, total, streakActive } = context;
    const percent = Math.round((correct / total) * 100);

    if (personality === 'Hype') {
      if (percent >= 80) return `🎉 ${correct}/${total} rätt! Du är på gång!`;
      if (percent >= 50) return `Bra jobbat! ${correct}/${total} - fortsätt så! 💪`;
      return `${correct}/${total} idag. Varje försök gör dig starkare! 🌱`;
    }

    if (personality === 'Lugn') {
      if (percent >= 80) return `Riktigt bra. ${correct} av ${total} rätt visar på god förståelse.`;
      if (percent >= 50) return `${correct}/${total} rätt. Bra att du tränar regelbundet.`;
      return `${correct}/${total} idag. Fokusera på vad du lärt dig.`;
    }

    if (personality === 'Strikt') {
      if (percent >= 80) return `${correct}/${total}. Fortsätt i denna takt för att nå 1.8+.`;
      if (percent >= 50) return `${correct}/${total}. Öka träningen inom svaga områden.`;
      return `${correct}/${total}. Analysera misstagen och öva mer.`;
    }
  }

  // ... other contexts
}
```

### Pattern 5: Daily Goal Progress with Session Design

**What:** Visual progress toward daily question goal with bite-sized session structure

**Recommended session length:** 10-15 questions (5-10 minutes)
- Research shows 5-10 minute sessions maximize engagement
- Users complete sessions and feel accomplished
- Can do multiple sessions per day to hit daily goal

**Daily goal tiers:**
- Beginner: 10-15 questions/day
- Standard: 20-25 questions/day
- Ambitious: 30-40 questions/day

**Visual treatment:**
- Progress bar with XP-style fill animation
- Questions remaining vs. questions completed
- "One more session to reach your goal!" nudge when close

**Example:**
```typescript
// Session structure for practice flow
interface PracticeSession {
  questions: Question[];
  targetCount: 10 | 15 | 20; // Session size
  timeEstimate: string; // "~5 min", "~10 min"
}

function createSession(mode: PracticeMode, count: number): PracticeSession {
  // Select questions based on mode
  const questions = selectQuestions(mode, count);
  const timeEstimate = Math.ceil(count * 0.5); // 30 sec per question avg

  return {
    questions,
    targetCount: count,
    timeEstimate: `~${timeEstimate} min`
  };
}
```

### Anti-Patterns to Avoid

- **Visible global leaderboards:** Demotivates users who rank low; use friend-only leaderboards or omit entirely
- **Punishment for mistakes:** Focus on growth mindset, not penalties
- **Streaks without freezes:** Too rigid, leads to burnout and churn
- **Excessive XP notifications:** Creates notification fatigue; batch and throttle
- **Hand-rolled date arithmetic:** Time zones and DST are complex; use date-fns or day.js
- **Gamification overwhelming learning:** Points shouldn't distract from actual learning goals

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Celebration animations | Custom canvas confetti from scratch | react-native-fiesta or Lottie | Pre-built, performant, Skia-based, designer-friendly |
| Streak date logic | Manual Date() comparisons | date-fns or day.js | Time zones, DST, edge cases already solved |
| Haptic patterns | Platform-specific native code | expo-haptics or react-native-turbo-haptics | Cross-platform API, worklet support |
| XP curve formulas | Ad-hoc level calculations | Established polynomial/exponential curves | Game design patterns prevent imbalance |
| State persistence | Custom AsyncStorage wrapper | zustand-mmkv-storage | Lazy loading, hydration detection, 30x faster |
| Animation timing | setTimeout chains | Reanimated withSequence/withTiming | UI thread execution, no dropped frames |
| Growth mindset messages | Generic motivational quotes | Research-backed process-focused language | Proven effective for 16-25 age group |

**Key insight:** Gamification systems have hidden complexity in state consistency (what if user changes time zones? what if they cheat the clock?), animation timing (coordinator stagger), and psychological balance (too many rewards undermine intrinsic motivation). Use battle-tested libraries and patterns.

## Common Pitfalls

### Pitfall 1: Streaks Overwhelming Learning Goals

**What goes wrong:** Users focus on maintaining streaks rather than actual learning, leading to minimal-effort completion just to "check the box"

**Why it happens:** The overjustification effect—external rewards (streaks) crowd out intrinsic motivation (learning). Duolingo users reported doing less actual learning after streak freezes made streaks easier to maintain.

**How to avoid:**
- Require minimum quality threshold for streak (e.g., must complete 10 questions, not just open app)
- Focus Max coach messages on learning progress, not just streak length
- Track learning metrics alongside streaks (correct answers, improvement rate)

**Warning signs:**
- Users completing exactly the minimum daily goal every day
- High streak days but low quiz performance
- Users rush through questions without reading

### Pitfall 2: Leaderboards Demotivating Lower-Ranked Users

**What goes wrong:** Always-visible leaderboards where users see themselves ranked 43rd out of 50 become demotivating rather than motivating

**Why it happens:** Social comparison theory—people compare themselves to others and feel discouraged when consistently outperformed

**How to avoid:**
- Use friend-only leaderboards (opt-in social comparison)
- Show personal progress over time instead of global rank
- Use "leagues" or tier systems (Bronze, Silver, Gold) where users compete within similar skill levels
- Omit leaderboards entirely if not core to experience

**Warning signs:**
- Users who check leaderboard once then never return
- Engagement drops after losing position on leaderboard
- High churn among bottom-ranked users

### Pitfall 3: Date/Time Logic Breaking Streaks Incorrectly

**What goes wrong:** Streak breaks unfairly due to time zone changes, daylight saving time, or edge cases (activity at 11:58pm doesn't count toward next day)

**Why it happens:** Manual date arithmetic doesn't handle time zones, DST transitions, or "day boundaries" consistently

**How to avoid:**
- Store dates in ISO format (`YYYY-MM-DD`) without time component
- Use date-fns or day.js for all date comparisons
- Define "day" as user's local calendar day (midnight to midnight in their timezone)
- Test across timezone changes and DST boundaries

**Example edge cases:**
```typescript
// BAD: Direct Date comparison
const lastActivity = new Date('2026-01-25T23:58:00Z');
const now = new Date('2026-01-26T00:02:00Z');
// Only 4 minutes apart but different dates!

// GOOD: Compare calendar days in user's timezone
import { isSameDay, differenceInDays, startOfDay } from 'date-fns';

const lastActivityDay = startOfDay(new Date(user.lastActivityDate));
const todayDay = startOfDay(new Date());
const daysDiff = differenceInDays(todayDay, lastActivityDay);
```

**Warning signs:**
- User reports "I used the app yesterday but my streak broke"
- Streak inconsistencies after travel or DST change
- Activity logged in one timezone doesn't count in another

### Pitfall 4: Animation Jank from Main Thread Blocking

**What goes wrong:** Celebration animations stutter or drop frames, ruining the "feel good" moment

**Why it happens:** Complex animations or state updates on JS thread block rendering

**How to avoid:**
- Use Reanimated worklets for all animations (runs on UI thread)
- Batch state updates after animations complete
- Use `runOnUI` for haptics if integrating with animations
- Profile with React DevTools and monitor frame rates

**Warning signs:**
- Animations feel "choppy" or delayed
- FPS drops below 60 during celebrations
- Haptics fire late or out of sync with visual feedback

### Pitfall 5: NativeWind Style Inconsistencies Across Tabs

**What goes wrong:** Design tokens used inconsistently (hardcoded colors in some components, token-based in others), leading to visual drift

**Why it happens:** Team members use different approaches; refactors leave legacy code; conditional styles not declared for both states

**How to avoid:**
- Audit all components for hardcoded colors (search for `#`, `rgb`, `hsl`)
- Always declare both light AND dark mode styles (React Native doesn't auto-inherit)
- Create component library with enforced token usage
- Use TypeScript to restrict color props to token names only

**Warning signs:**
- Components look different across tabs
- Dark mode has "white flashes" or unstyled elements
- Colors don't match Figma design system

### Pitfall 6: MMKV Persistence Race Conditions

**What goes wrong:** State reads stale data on app launch before MMKV hydration completes, leading to incorrect streak status or lost progress

**Why it happens:** Zustand persist middleware hydrates asynchronously; components render before hydration completes

**How to avoid:**
- Use zustand-mmkv-storage which handles hydration detection
- Check `hasHydrated` before rendering gamification UI
- Show loading state during hydration
- Never trust initial state values for critical logic (streaks, XP)

**Example:**
```typescript
// Source: zustand-mmkv-storage docs + React Native best practices
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvStorage } from './mmkv-storage';

interface State {
  currentStreak: number;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

const useStore = create<State>()(
  persist(
    (set) => ({
      currentStreak: 0,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'gamification-storage',
      storage: mmkvStorage,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// In component
function StreakDisplay() {
  const hasHydrated = useStore((s) => s._hasHydrated);
  const streak = useStore((s) => s.currentStreak);

  if (!hasHydrated) {
    return <LoadingSpinner />;
  }

  return <Text>{streak} days</Text>;
}
```

**Warning signs:**
- Streak shows 0 on launch then jumps to correct value
- State resets randomly on app restart
- Race condition errors in logs

## Code Examples

Verified patterns from research and official sources:

### Stagger Animation Pattern (Duolingo-style)

```typescript
// Source: React Native Reanimated docs + Duolingo UX research
import { useSharedValue, withSpring, withSequence, withDelay } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

function QuizCompleteScreen({ correct, total }: Props) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // 1. Haptic (instant)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // 2. Results fade in (0ms delay)
    opacity.value = withTiming(1, { duration: 300 });

    // 3. XP badge scales in (200ms delay)
    scale.value = withDelay(
      200,
      withSequence(
        withSpring(1.2, { damping: 8 }),
        withSpring(1.0, { damping: 12 })
      )
    );

    // 4. Confetti (400ms delay)
    setTimeout(() => setShowConfetti(true), 400);
  }, []);

  // ...render
}
```

### Growth Mindset Message Generation

```typescript
// Source: Growth mindset research (Cornell, Forrester 2024-2026)
type MessageContext =
  | { type: 'success'; score: number }
  | { type: 'struggle'; score: number }
  | { type: 'streak_milestone'; days: number }
  | { type: 'streak_broken' };

function generateGrowthMessage(
  context: MessageContext,
  personality: 'Hype' | 'Lugn' | 'Strikt'
): string {
  // Focus on PROCESS not OUTCOME
  // Reframe challenges as learning opportunities
  // Provide specific, improvement-focused feedback

  if (context.type === 'struggle' && context.score < 50) {
    // Reframe struggle as growth opportunity
    if (personality === 'Hype') {
      return "Tuffa frågor! Men varje misstag lär dig nåt nytt 🌱";
    }
    if (personality === 'Lugn') {
      return "Utmanande frågor. Granska svaren och prova igen.";
    }
    if (personality === 'Strikt') {
      return "Identifiera felen. Träna dessa områden mer intensivt.";
    }
  }

  if (context.type === 'streak_broken') {
    // Avoid guilt, focus on fresh start
    if (personality === 'Hype') {
      return "Ny dag, ny chans! Låt oss starta en ännu längre streak 💪";
    }
    if (personality === 'Lugn') {
      return "Det händer. Det viktiga är att du fortsätter träna.";
    }
    if (personality === 'Strikt') {
      return "Streak bruten. Börja om med bättre konsistens.";
    }
  }

  // ... more contexts
}
```

### Polynomial XP Curve Implementation

```typescript
// Source: Game design progression patterns + mobile app leveling systems
function calculateLevelFromXP(totalXP: number): number {
  let level = 1;
  let xpForNextLevel = xpRequiredForLevel(level);
  let accumulatedXP = 0;

  while (accumulatedXP + xpForNextLevel <= totalXP) {
    accumulatedXP += xpForNextLevel;
    level++;
    xpForNextLevel = xpRequiredForLevel(level);
  }

  return level;
}

function xpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;

  if (level <= 10) {
    // Linear early game: quick progression
    return level * 100;
  } else if (level <= 30) {
    // Polynomial mid game: gradual increase
    return Math.floor(Math.pow(level, 1.5) * 50);
  } else {
    // Steeper late game: meaningful milestones
    return Math.floor(Math.pow(level, 2) * 30);
  }
}

function xpToNextLevel(currentXP: number): number {
  const currentLevel = calculateLevelFromXP(currentXP);
  const xpForCurrentLevel = xpRequiredForLevel(currentLevel);
  const xpForNextLevel = xpRequiredForLevel(currentLevel + 1);

  return xpForNextLevel - (currentXP - getTotalXPForLevel(currentLevel));
}

function getTotalXPForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i <= level; i++) {
    total += xpRequiredForLevel(i);
  }
  return total;
}
```

### Zustand + MMKV Setup with Hydration

```typescript
// Source: zustand-mmkv-storage official docs + React Native best practices
import { MMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import { persist, StateStorage } from 'zustand/middleware';

// Create MMKV instance
const mmkv = new MMKV();

// Create Zustand-compatible storage adapter
const mmkvStorage: StateStorage = {
  getItem: (name) => {
    const value = mmkv.getString(name);
    return value ?? null;
  },
  setItem: (name, value) => {
    mmkv.set(name, value);
  },
  removeItem: (name) => {
    mmkv.delete(name);
  },
};

// Create store with persistence
interface GamificationState {
  currentStreak: number;
  totalXP: number;
  _hasHydrated: boolean;

  incrementStreak: () => void;
  awardXP: (amount: number) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set) => ({
      currentStreak: 0,
      totalXP: 0,
      _hasHydrated: false,

      incrementStreak: () => set((state) => ({
        currentStreak: state.currentStreak + 1
      })),

      awardXP: (amount) => set((state) => ({
        totalXP: state.totalXP + amount
      })),

      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'gamification-storage',
      storage: mmkvStorage,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Global leaderboards | Friend-only or tiered leagues | 2024-2025 | Reduces demotivation from social comparison |
| Rigid daily streaks | Streaks with freeze mechanics | 2023-2024 (Duolingo) | 21% churn reduction, +0.38% DAU |
| Outcome-focused praise ("You're smart!") | Process-focused feedback ("Great strategy!") | Ongoing (growth mindset research) | Increases resilience and persistence |
| 30+ minute learning sessions | 5-10 minute bite-sized sessions | 2024+ mobile learning trend | Higher completion rates, better retention |
| AsyncStorage | MMKV for React Native | 2022+ | 30x faster persistence, enables real-time updates |
| Points/badges everywhere | Selective, meaningful gamification | 2025+ backlash | Prevents overjustification effect |

**Deprecated/outdated:**
- **React Native Animated API**: Replaced by Reanimated for UI thread animations
- **Global streak leaderboards**: Research shows they demotivate most users
- **"You're talented!" messaging**: Growth mindset research favors process praise
- **Manual AsyncStorage wrappers**: MMKV provides native performance
- **Hand-rolled confetti animations**: Libraries like Fiesta and Lottie provide better UX

## Open Questions

Things that couldn't be fully resolved:

1. **Max Coach Avatar Style**
   - What we know: User decided on avatar/mascot image, character icon style
   - What's unclear: Specific visual design (3D render? Flat illustration? Animated?)
   - Recommendation: Wait for user to provide design direction or mockups; use placeholder emoji (🤖) initially

2. **Optimal Daily Goal Tiers**
   - What we know: Research suggests 5-10 minute sessions work best (10-15 questions)
   - What's unclear: User's baseline (complete beginners vs. experienced HP takers)
   - Recommendation: Start with 3 tiers (10/20/30 questions) and adjust based on completion data

3. **Smart Practice Algorithm Complexity**
   - What we know: IRT and Bayesian Knowledge Tracing exist but are complex
   - What's unclear: Whether to implement full adaptive engine or simple "weakest areas first"
   - Recommendation: Phase 3 uses simple weakest-first logic; defer full adaptive to later phase

4. **Message Frequency Throttling**
   - What we know: Users need contextual messages without notification fatigue
   - What's unclear: Exact throttle (max 1 message per hour? per session? per day?)
   - Recommendation: Max 1 Max message per practice session + 1 on milestone events

5. **Streak Freeze Acquisition**
   - What we know: Duolingo awards freezes at milestones and allows purchases
   - What's unclear: User's monetization strategy (in-app purchases?)
   - Recommendation: Award 1 freeze at 7-day milestone, 1 at 30-day; defer purchase mechanic

## Sources

### Primary (HIGH confidence)

**Gamification Research:**
- [Duolingo's Gamification Secrets: How Streaks & XP Boost Engagement by 60%](https://www.orizon.co/blog/duolingos-gamification-secrets)
- [Duolingo gamification explained | StriveCloud](https://www.strivecloud.io/blog/gamification-examples-boost-user-retention-duolingo)
- [The Duolingo Streak Uses Habit Research to Keep You Motivated](https://blog.duolingo.com/how-duolingo-streak-builds-habit/)
- [How We Built the Streak Feature to Boost User Retention](https://www.wewardapp.com/blog/how-we-built-the-streak-feature-to-boost-user-retention-and-create-healthy-habits)
- [Designing Streaks for Long-Term User Growth - Trophy](https://trophy.so/blog/designing-streaks-for-long-term-user-growth)

**Growth Mindset Research:**
- [What makes goal-setting apps motivate – or backfire? | Cornell Chronicle](https://news.cornell.edu/stories/2025/12/what-makes-goal-setting-apps-motivate-or-backfire)
- [Growth Mindset Messages from Instructors Improve Academic Performance](https://www.lifescied.org/doi/10.1187/cbe.23-07-0131)
- [Increasing Student Motivation and Engagement for 2026](https://research.com/education/motivating-and-engaging-students)

**React Native Technical:**
- [React Native Reanimated Official Docs](https://docs.swmansion.com/react-native-reanimated/)
- [react-native-mmkv GitHub](https://github.com/mrousavy/react-native-mmkv)
- [zustand-mmkv-storage: Blazing Fast Persistence](https://dev.to/mehdifaraji/zustand-mmkv-storage-blazing-fast-persistence-for-zustand-in-react-native-3ef1)
- [How to Use Zustand with MMKV for Efficient State Management](https://medium.com/@md.alishanali/how-to-use-zustand-with-mmkv-for-efficient-state-management-in-react-native-06376d3b243c)

**Celebration Animations:**
- [GitHub - mateoguzmana/react-native-fiesta](https://github.com/mateoguzmana/react-native-fiesta)
- [React Native Fiesta Documentation](https://mateoguzmana.github.io/react-native-fiesta/)
- [Haptics in React Native: Creating a useHaptic() Hook](https://medium.com/timeless/implementing-haptic-feedback-in-react-native-writing-a-usehaptic-hook-6b8612675599)

### Secondary (MEDIUM confidence)

**Mobile Design Patterns:**
- [12 Mobile App Design Patterns That Boost Retention](https://procreator.design/blog/mobile-app-design-patterns-boost-retention/)
- [Streaks and Milestones for Gamification in Mobile Apps](https://www.plotline.so/blog/streaks-for-gamification-in-mobile-apps)
- [Session Length | KPI example | Geckoboard](https://www.geckoboard.com/best-practice/kpi-examples/session-length/)
- [Best Practices for React Native Navigation and Tab Bars](https://codezup.com/mastering-navigation-and-tab-bars-in-react-native/)

**XP & Leveling Systems:**
- [The Ultimate Guide to XP Curves & Leveling Systems](https://flavor365.com/the-ultimate-guide-to-xp-curves-leveling-systems/)
- [Example Level Curve Formulas for Game Progression](https://www.designthegame.com/learning/courses/course/fundamentals-level-curve-design/example-level-curve-formulas-game-progression)

**AI Coach/Mascot:**
- [Max: AI Learning Coach App](https://apps.apple.com/us/app/max-ai-learning-coach/id6737233778)
- [Virtual Mascots: How AI Is Redefining Brand Mascots](https://dreamfarmagency.com/blog/virtual-mascots/)

### Tertiary (LOW confidence - for validation)

**Gamification Pitfalls:**
- [Why Gamification Fails: New Findings for 2026](https://medium.com/design-bootcamp/why-gamification-fails-new-findings-for-2026-fff0d186722f)
- [Seven Common Gamification Mistakes and How to Avoid Them](https://www.litmos.com/blog/articles/gamification-mistakes)
- [The Dark Side of Gamification](https://www.growthengineering.co.uk/dark-side-of-gamification/)

**NativeWind:**
- [NativeWind v5 Overview](https://www.nativewind.dev/v5)
- [Getting started with NativeWind - LogRocket](https://blog.logrocket.com/getting-started-nativewind-tailwind-react-native/)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - React Native Reanimated, MMKV, Zustand are industry standard with extensive documentation
- Architecture patterns: HIGH - Streak mechanics backed by Duolingo research; XP curves validated by game design patterns
- Pitfalls: MEDIUM-HIGH - Gamification backfire research is recent (2025-2026) but some is conceptual rather than data-driven
- Code examples: MEDIUM - Patterns verified with official docs but specific implementations may need testing
- Max coach personality: MEDIUM - Growth mindset research is strong, but specific tone examples not user-tested

**Research date:** 2026-01-26
**Valid until:** ~30 days (gamification patterns stable; React Native libraries update frequently)
