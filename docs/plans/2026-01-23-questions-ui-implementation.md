# Questions UI Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Duolingo-style quiz experience where users answer HP multiple-choice questions with immediate feedback.

**Architecture:** File-based routing with Expo Router. Quiz screen receives section code as param, loads mock questions, tracks session state locally. Uses existing UI components (Button, Card, Text, ProgressBar, Chip) extended with new quiz-specific components.

**Tech Stack:** React Native, Expo Router, react-native-reanimated, expo-haptics, TypeScript

---

## Task 1: Create Quiz Configuration Constants

**Files:**
- Create: `apps/mobile/constants/quiz-config.ts`

**Step 1: Create the quiz config file**

```typescript
// apps/mobile/constants/quiz-config.ts

/**
 * Quiz configuration constants
 * - Target times per section (based on real HP timing)
 * - Scoring thresholds for performance feedback
 */

// Target time per question in seconds (based on real HP: ~22-24 questions in 50-55 min)
export const TARGET_TIME_PER_QUESTION: Record<string, number> = {
  // Verbal sections - slightly faster
  ORD: 120, // 2 min
  LÄS: 150, // 2.5 min (reading comprehension takes longer)
  MEK: 120, // 2 min
  ELF: 150, // 2.5 min (English reading)
  // Quantitative sections - need more calculation time
  XYZ: 150, // 2.5 min
  KVA: 120, // 2 min
  NOG: 150, // 2.5 min
  DTK: 150, // 2.5 min (diagrams/tables)
};

// Default if section not found
export const DEFAULT_TARGET_TIME = 120;

// Questions per session
export const QUESTIONS_PER_SESSION = 10;

// Scoring thresholds for summary screen
export const SCORE_THRESHOLDS = {
  excellent: 90, // 90-100%: "Fantastiskt!"
  good: 70,      // 70-89%: "Bra jobbat!"
  okay: 50,      // 50-69%: "Fortsätt öva!"
  // Below 50%: "Nästa gång!"
};

// Pace status thresholds (percentage over target)
export const PACE_THRESHOLDS = {
  onPace: 0,      // avg <= target: "I fas"
  slightlySlow: 20, // 1-20% over: "Lite långsam"
  // >20% over: "Öva tempo"
};

// Summary screen copy
export const SUMMARY_TITLES = {
  excellent: { title: 'Fantastiskt!', icon: '🌟' },
  good: { title: 'Bra jobbat!', icon: '🎯' },
  okay: { title: 'Fortsätt öva!', icon: '💪' },
  poor: { title: 'Nästa gång!', icon: '📚' },
};

export const PACE_STATUS = {
  onPace: { label: 'I fas', icon: '✅' },
  slightlySlow: { label: 'Lite långsam', icon: '⚠️' },
  tooSlow: { label: 'Öva tempo', icon: '🔴' },
};
```

**Step 2: Commit**

```bash
git add apps/mobile/constants/quiz-config.ts
git commit -m "feat(quiz): add quiz configuration constants"
```

---

## Task 2: Create Mock Questions Data

**Files:**
- Create: `apps/mobile/constants/mock-questions.ts`

**Step 1: Create the mock questions file with type definitions**

```typescript
// apps/mobile/constants/mock-questions.ts

/**
 * Mock questions data for quiz UI development
 * These will be replaced with real data from Convex later
 */

export type SectionCode = 'ORD' | 'LÄS' | 'MEK' | 'ELF' | 'XYZ' | 'KVA' | 'NOG' | 'DTK';
export type OptionLabel = 'A' | 'B' | 'C' | 'D';

export interface QuestionOption {
  label: OptionLabel;
  text: string;
}

export interface Question {
  id: string;
  section: SectionCode;
  number: number;
  text: string;
  image?: string; // optional image URI
  options: QuestionOption[];
  correctAnswer: OptionLabel;
  explanation: string;
}

export interface QuizSession {
  section: SectionCode;
  questions: Question[];
  currentIndex: number;
  answers: AnswerRecord[];
  startTime: number;
}

export interface AnswerRecord {
  questionId: string;
  selected: OptionLabel | null;
  correct: boolean;
  timeSpent: number; // seconds
}

// Mock questions for XYZ (Matematisk problemlösning)
export const MOCK_QUESTIONS_XYZ: Question[] = [
  {
    id: 'xyz-001',
    section: 'XYZ',
    number: 1,
    text: 'Vad är 45 % av 2/9?',
    options: [
      { label: 'A', text: '1/9' },
      { label: 'B', text: '1/10' },
      { label: 'C', text: '1/11' },
      { label: 'D', text: '1/12' },
    ],
    correctAnswer: 'B',
    explanation: '45% = 0.45 = 9/20. Så 9/20 × 2/9 = 18/180 = 1/10.',
  },
  {
    id: 'xyz-002',
    section: 'XYZ',
    number: 2,
    text: 'En rektangel har omkretsen 28 cm. Om längden är 3 cm längre än bredden, vad är arean?',
    options: [
      { label: 'A', text: '40 cm²' },
      { label: 'B', text: '45 cm²' },
      { label: 'C', text: '46 cm²' },
      { label: 'D', text: '48 cm²' },
    ],
    correctAnswer: 'C',
    explanation: 'Låt bredden = b, längden = b+3. Omkrets: 2(b + b+3) = 28 → 4b + 6 = 28 → b = 5.5. Area = 5.5 × 8.5 = 46.75 ≈ 46 cm².',
  },
  {
    id: 'xyz-003',
    section: 'XYZ',
    number: 3,
    text: 'Om x² - 5x + 6 = 0, vad är summan av lösningarna?',
    options: [
      { label: 'A', text: '2' },
      { label: 'B', text: '3' },
      { label: 'C', text: '5' },
      { label: 'D', text: '6' },
    ],
    correctAnswer: 'C',
    explanation: 'Enligt Vietas formler är summan av rötterna = -(-5)/1 = 5. (Rötterna är 2 och 3.)',
  },
  {
    id: 'xyz-004',
    section: 'XYZ',
    number: 4,
    text: 'En butik sänker priset med 20%. Hur mycket måste priset höjas för att återgå till ursprungspriset?',
    options: [
      { label: 'A', text: '20%' },
      { label: 'B', text: '25%' },
      { label: 'C', text: '30%' },
      { label: 'D', text: '40%' },
    ],
    correctAnswer: 'B',
    explanation: 'Om ursprungspriset är 100 kr blir det nya priset 80 kr. För att gå från 80 till 100 behövs 20/80 = 25% höjning.',
  },
  {
    id: 'xyz-005',
    section: 'XYZ',
    number: 5,
    text: 'Hur många treställiga tal finns det där alla siffror är olika och summan av siffrorna är 10?',
    options: [
      { label: 'A', text: '24' },
      { label: 'B', text: '30' },
      { label: 'C', text: '36' },
      { label: 'D', text: '42' },
    ],
    correctAnswer: 'C',
    explanation: 'Kombinationer som summerar till 10 med olika siffror: (1,2,7), (1,3,6), (1,4,5), (2,3,5), (2,4,4)... Efter att räkna permutationer får vi 36.',
  },
  {
    id: 'xyz-006',
    section: 'XYZ',
    number: 6,
    text: 'En klocka visar rätt tid kl 12:00. Om den går 2 minuter för fort per timme, vad visar den när den riktiga tiden är 18:00?',
    options: [
      { label: 'A', text: '18:10' },
      { label: 'B', text: '18:12' },
      { label: 'C', text: '18:14' },
      { label: 'D', text: '18:16' },
    ],
    correctAnswer: 'B',
    explanation: '6 timmar × 2 minuter = 12 minuter för fort. Klockan visar 18:12.',
  },
  {
    id: 'xyz-007',
    section: 'XYZ',
    number: 7,
    text: 'Om 3ˣ = 27 och 2ʸ = 16, vad är x + y?',
    options: [
      { label: 'A', text: '5' },
      { label: 'B', text: '6' },
      { label: 'C', text: '7' },
      { label: 'D', text: '8' },
    ],
    correctAnswer: 'C',
    explanation: '3ˣ = 27 = 3³ → x = 3. 2ʸ = 16 = 2⁴ → y = 4. x + y = 7.',
  },
  {
    id: 'xyz-008',
    section: 'XYZ',
    number: 8,
    text: 'En triangel har sidorna 5 cm, 12 cm och 13 cm. Vad är triangelns area?',
    options: [
      { label: 'A', text: '24 cm²' },
      { label: 'B', text: '30 cm²' },
      { label: 'C', text: '32.5 cm²' },
      { label: 'D', text: '36 cm²' },
    ],
    correctAnswer: 'B',
    explanation: '5² + 12² = 25 + 144 = 169 = 13². Det är en rätvinklig triangel! Area = (5 × 12)/2 = 30 cm².',
  },
  {
    id: 'xyz-009',
    section: 'XYZ',
    number: 9,
    text: 'Vilket är det minsta positiva heltal som är delbart med både 12 och 18?',
    options: [
      { label: 'A', text: '24' },
      { label: 'B', text: '30' },
      { label: 'C', text: '36' },
      { label: 'D', text: '72' },
    ],
    correctAnswer: 'C',
    explanation: 'MGM(12, 18) = 36. 12 = 2² × 3, 18 = 2 × 3². MGM = 2² × 3² = 36.',
  },
  {
    id: 'xyz-010',
    section: 'XYZ',
    number: 10,
    text: 'Om f(x) = 2x + 3, vad är f(f(2))?',
    options: [
      { label: 'A', text: '13' },
      { label: 'B', text: '15' },
      { label: 'C', text: '17' },
      { label: 'D', text: '19' },
    ],
    correctAnswer: 'C',
    explanation: 'f(2) = 2(2) + 3 = 7. f(f(2)) = f(7) = 2(7) + 3 = 17.',
  },
];

// Mock questions for ORD (Ordförståelse)
export const MOCK_QUESTIONS_ORD: Question[] = [
  {
    id: 'ord-001',
    section: 'ORD',
    number: 1,
    text: 'PRAGMATISK betyder ungefär:',
    options: [
      { label: 'A', text: 'teoretisk' },
      { label: 'B', text: 'praktisk' },
      { label: 'C', text: 'pessimistisk' },
      { label: 'D', text: 'idealistisk' },
    ],
    correctAnswer: 'B',
    explanation: 'Pragmatisk betyder praktiskt inriktad, fokuserad på vad som fungerar snarare än teorier.',
  },
  {
    id: 'ord-002',
    section: 'ORD',
    number: 2,
    text: 'LATENT betyder ungefär:',
    options: [
      { label: 'A', text: 'uppenbar' },
      { label: 'B', text: 'dold' },
      { label: 'C', text: 'sen' },
      { label: 'D', text: 'aktiv' },
    ],
    correctAnswer: 'B',
    explanation: 'Latent betyder dold, vilande, inte synlig men närvarande under ytan.',
  },
  {
    id: 'ord-003',
    section: 'ORD',
    number: 3,
    text: 'AMBIVALENT betyder ungefär:',
    options: [
      { label: 'A', text: 'bestämd' },
      { label: 'B', text: 'likgiltig' },
      { label: 'C', text: 'kluven' },
      { label: 'D', text: 'entusiastisk' },
    ],
    correctAnswer: 'C',
    explanation: 'Ambivalent betyder att ha motstridiga känslor, vara kluven mellan två hållningar.',
  },
  {
    id: 'ord-004',
    section: 'ORD',
    number: 4,
    text: 'REDUNDANT betyder ungefär:',
    options: [
      { label: 'A', text: 'nödvändig' },
      { label: 'B', text: 'överflödig' },
      { label: 'C', text: 'betydelsefull' },
      { label: 'D', text: 'komplicerad' },
    ],
    correctAnswer: 'B',
    explanation: 'Redundant betyder överflödig, onödig upprepning eller mer än vad som behövs.',
  },
  {
    id: 'ord-005',
    section: 'ORD',
    number: 5,
    text: 'SUBTIL betyder ungefär:',
    options: [
      { label: 'A', text: 'tydlig' },
      { label: 'B', text: 'grov' },
      { label: 'C', text: 'fin' },
      { label: 'D', text: 'snabb' },
    ],
    correctAnswer: 'C',
    explanation: 'Subtil betyder fin, diskret, inte påträngande eller svår att uppfatta.',
  },
  {
    id: 'ord-006',
    section: 'ORD',
    number: 6,
    text: 'DOGMATISK betyder ungefär:',
    options: [
      { label: 'A', text: 'flexibel' },
      { label: 'B', text: 'tvivelaktig' },
      { label: 'C', text: 'oeftergivlig' },
      { label: 'D', text: 'opartisk' },
    ],
    correctAnswer: 'C',
    explanation: 'Dogmatisk betyder att strikt hålla fast vid vissa principer utan att acceptera ifrågasättande.',
  },
  {
    id: 'ord-007',
    section: 'ORD',
    number: 7,
    text: 'EMPATISK betyder ungefär:',
    options: [
      { label: 'A', text: 'känslokall' },
      { label: 'B', text: 'inlevelseförmögen' },
      { label: 'C', text: 'energisk' },
      { label: 'D', text: 'impulsiv' },
    ],
    correctAnswer: 'B',
    explanation: 'Empatisk betyder att ha förmåga att sätta sig in i andras känslor och upplevelser.',
  },
  {
    id: 'ord-008',
    section: 'ORD',
    number: 8,
    text: 'KONTRADIKTORISK betyder ungefär:',
    options: [
      { label: 'A', text: 'motsägelsefull' },
      { label: 'B', text: 'sammanhängande' },
      { label: 'C', text: 'överensstämmande' },
      { label: 'D', text: 'avtalsmässig' },
    ],
    correctAnswer: 'A',
    explanation: 'Kontradiktorisk betyder motsägelsefull, innehåller eller uttrycker motsägelser.',
  },
  {
    id: 'ord-009',
    section: 'ORD',
    number: 9,
    text: 'PREVALENT betyder ungefär:',
    options: [
      { label: 'A', text: 'sällsynt' },
      { label: 'B', text: 'förhärskande' },
      { label: 'C', text: 'förebyggande' },
      { label: 'D', text: 'preliminär' },
    ],
    correctAnswer: 'B',
    explanation: 'Prevalent betyder förhärskande, dominerande, utbredd eller vanligt förekommande.',
  },
  {
    id: 'ord-010',
    section: 'ORD',
    number: 10,
    text: 'ESOTERISK betyder ungefär:',
    options: [
      { label: 'A', text: 'allmänt känd' },
      { label: 'B', text: 'för de invigda' },
      { label: 'C', text: 'utländsk' },
      { label: 'D', text: 'estetisk' },
    ],
    correctAnswer: 'B',
    explanation: 'Esoterisk betyder avsedd för eller förstådd av endast en liten grupp med specialkunskap.',
  },
];

// Map section code to questions
export const MOCK_QUESTIONS: Record<SectionCode, Question[]> = {
  XYZ: MOCK_QUESTIONS_XYZ,
  ORD: MOCK_QUESTIONS_ORD,
  // For other sections, use XYZ questions as placeholder
  LÄS: MOCK_QUESTIONS_ORD,
  MEK: MOCK_QUESTIONS_ORD,
  ELF: MOCK_QUESTIONS_ORD,
  KVA: MOCK_QUESTIONS_XYZ,
  NOG: MOCK_QUESTIONS_XYZ,
  DTK: MOCK_QUESTIONS_XYZ,
};

// Helper to get questions for a section
export function getQuestionsForSection(section: SectionCode, count: number = 10): Question[] {
  const questions = MOCK_QUESTIONS[section] || MOCK_QUESTIONS.XYZ;
  return questions.slice(0, count).map((q, index) => ({
    ...q,
    number: index + 1,
  }));
}
```

**Step 2: Commit**

```bash
git add apps/mobile/constants/mock-questions.ts
git commit -m "feat(quiz): add mock questions data and types"
```

---

## Task 3: Create OptionButton Component

**Files:**
- Create: `apps/mobile/components/quiz/OptionButton.tsx`

**Step 1: Create the OptionButton component**

```typescript
// apps/mobile/components/quiz/OptionButton.tsx

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Text } from '@/components/ui/text';
import {
  Colors,
  BorderRadius,
  Spacing,
  FontFamily,
  FontSize,
  Primitives,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { triggerImpact } from '@/utils/haptics';
import type { OptionLabel } from '@/constants/mock-questions';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type OptionState = 'default' | 'selected' | 'correct' | 'incorrect';

interface OptionButtonProps {
  label: OptionLabel;
  text: string;
  state: OptionState;
  onPress: () => void;
  disabled?: boolean;
}

export function OptionButton({
  label,
  text,
  state,
  onPress,
  disabled = false,
}: OptionButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const scale = useSharedValue(1);
  const shakeX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: shakeX.value },
    ],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    if (!disabled) {
      triggerImpact(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  // Shake animation for incorrect answer
  React.useEffect(() => {
    if (state === 'incorrect') {
      shakeX.value = withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [state, shakeX]);

  const getStateStyles = () => {
    switch (state) {
      case 'selected':
        return {
          borderColor: colors.primary,
          backgroundColor: Primitives.yellow[50],
        };
      case 'correct':
        return {
          borderColor: Primitives.success[400],
          backgroundColor: Primitives.success[50],
        };
      case 'incorrect':
        return {
          borderColor: Primitives.error[400],
          backgroundColor: Primitives.error[50],
        };
      default:
        return {
          borderColor: colors.cardBorder,
          backgroundColor: colors.cardBackground,
        };
    }
  };

  const getLabelColor = () => {
    switch (state) {
      case 'selected':
        return colors.primary;
      case 'correct':
        return Primitives.success[400];
      case 'incorrect':
        return Primitives.error[400];
      default:
        return colors.textSecondary;
    }
  };

  const getIcon = () => {
    if (state === 'correct') return '✓';
    if (state === 'incorrect') return '✗';
    return null;
  };

  const stateStyles = getStateStyles();
  const icon = getIcon();

  return (
    <AnimatedPressable
      style={[styles.container, stateStyles, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
    >
      <View style={[styles.labelContainer, { borderColor: stateStyles.borderColor }]}>
        <Text
          style={[styles.label, { color: getLabelColor() }]}
        >
          {label}
        </Text>
      </View>
      <Text variant="body" style={styles.text} numberOfLines={3}>
        {text}
      </Text>
      {icon && (
        <View style={styles.iconContainer}>
          <Text style={[styles.icon, { color: getLabelColor() }]}>{icon}</Text>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderWidth: 2,
    borderRadius: BorderRadius['2xl'],
    marginBottom: Spacing.md,
  },
  labelContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  label: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
  },
  text: {
    flex: 1,
  },
  iconContainer: {
    marginLeft: Spacing.sm,
  },
  icon: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
  },
});
```

**Step 2: Commit**

```bash
git add apps/mobile/components/quiz/OptionButton.tsx
git commit -m "feat(quiz): add OptionButton component with states"
```

---

## Task 4: Create QuizHeader Component

**Files:**
- Create: `apps/mobile/components/quiz/QuizHeader.tsx`

**Step 1: Create the QuizHeader component**

```typescript
// apps/mobile/components/quiz/QuizHeader.tsx

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Text } from '@/components/ui/text';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SectionPill } from '@/components/ui/chip';
import {
  Colors,
  Spacing,
  SectionColors,
  FontSize,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { triggerImpact } from '@/utils/haptics';
import type { SectionCode } from '@/constants/mock-questions';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface QuizHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  section: SectionCode;
  onClose: () => void;
}

export function QuizHeader({
  currentQuestion,
  totalQuestions,
  section,
  onClose,
}: QuizHeaderProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const sectionColor = SectionColors[section];

  const closeScale = useSharedValue(1);

  const closeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: closeScale.value }],
  }));

  const handleClosePressIn = () => {
    closeScale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  };

  const handleClosePressOut = () => {
    closeScale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handleClosePress = () => {
    triggerImpact(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <View style={styles.container}>
      {/* Close button */}
      <AnimatedPressable
        style={[styles.closeButton, closeAnimatedStyle]}
        onPressIn={handleClosePressIn}
        onPressOut={handleClosePressOut}
        onPress={handleClosePress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={[styles.closeIcon, { color: colors.textSecondary }]}>✕</Text>
      </AnimatedPressable>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <ProgressBar
          progress={progress}
          size="sm"
          color={sectionColor?.accent || colors.primary}
        />
      </View>

      {/* Section pill */}
      <SectionPill
        section={section}
        bgColor={sectionColor?.light || colors.primaryLight}
        textColor={sectionColor?.text || colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: FontSize.xl,
    fontWeight: '300',
  },
  progressContainer: {
    flex: 1,
  },
});
```

**Step 2: Commit**

```bash
git add apps/mobile/components/quiz/QuizHeader.tsx
git commit -m "feat(quiz): add QuizHeader component"
```

---

## Task 5: Create ExplanationCard Component

**Files:**
- Create: `apps/mobile/components/quiz/ExplanationCard.tsx`

**Step 1: Create the ExplanationCard component**

```typescript
// apps/mobile/components/quiz/ExplanationCard.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInUp, SlideInDown } from 'react-native-reanimated';

import { Text } from '@/components/ui/text';
import {
  Colors,
  BorderRadius,
  Spacing,
  Primitives,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { OptionLabel } from '@/constants/mock-questions';

interface ExplanationCardProps {
  isCorrect: boolean;
  correctAnswer: OptionLabel;
  explanation: string;
}

export function ExplanationCard({
  isCorrect,
  correctAnswer,
  explanation,
}: ExplanationCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const headerColor = isCorrect ? Primitives.success[400] : Primitives.error[400];
  const headerBgColor = isCorrect ? Primitives.success[50] : Primitives.error[50];
  const headerText = isCorrect ? 'Rätt!' : 'Inte riktigt';
  const headerIcon = isCorrect ? '✓' : '✗';

  return (
    <Animated.View
      entering={SlideInDown.duration(300).springify().damping(15)}
      style={[styles.container, { backgroundColor: colors.cardBackground }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: headerBgColor }]}>
        <Text style={[styles.headerIcon, { color: headerColor }]}>{headerIcon}</Text>
        <Text style={[styles.headerText, { color: headerColor }]}>{headerText}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {!isCorrect && (
          <View style={styles.correctAnswerRow}>
            <Text variant="bodySm" color="secondary">Rätt svar: </Text>
            <Text variant="bodySm" weight="bold" color="success">{correctAnswer}</Text>
          </View>
        )}
        <Text variant="body" style={styles.explanation}>
          {explanation}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius['2xl'],
    borderWidth: 2,
    borderColor: Primitives.neutral[200],
    overflow: 'hidden',
    marginTop: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  headerIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: Spacing.lg,
  },
  correctAnswerRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  explanation: {
    lineHeight: 24,
  },
});
```

**Step 2: Commit**

```bash
git add apps/mobile/components/quiz/ExplanationCard.tsx
git commit -m "feat(quiz): add ExplanationCard component"
```

---

## Task 6: Create ExitModal Component

**Files:**
- Create: `apps/mobile/components/quiz/ExitModal.tsx`

**Step 1: Create the ExitModal component**

```typescript
// apps/mobile/components/quiz/ExitModal.tsx

import React from 'react';
import { View, StyleSheet, Modal, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import {
  Colors,
  BorderRadius,
  Spacing,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ExitModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ExitModal({ visible, onCancel, onConfirm }: ExitModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={onCancel} />
        <Animated.View
          entering={SlideInDown.duration(300).springify().damping(15)}
          exiting={SlideOutDown.duration(200)}
          style={[styles.modal, { backgroundColor: colors.cardBackground }]}
        >
          <Text variant="h3" style={styles.title}>
            Vill du avsluta?
          </Text>
          <Text variant="body" color="secondary" style={styles.message}>
            Din progress sparas inte om du avslutar nu.
          </Text>
          <View style={styles.buttons}>
            <View style={styles.buttonWrapper}>
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onPress={onCancel}
              >
                Fortsätt öva
              </Button>
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                variant="ghost"
                size="lg"
                fullWidth
                onPress={onConfirm}
              >
                Avsluta
              </Button>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    width: '85%',
    maxWidth: 340,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.xl,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  message: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  buttons: {
    width: '100%',
    gap: Spacing.md,
  },
  buttonWrapper: {
    width: '100%',
  },
});
```

**Step 2: Commit**

```bash
git add apps/mobile/components/quiz/ExitModal.tsx
git commit -m "feat(quiz): add ExitModal component"
```

---

## Task 7: Create Quiz Components Index

**Files:**
- Create: `apps/mobile/components/quiz/index.ts`

**Step 1: Create the index file**

```typescript
// apps/mobile/components/quiz/index.ts

export { OptionButton, type OptionState } from './OptionButton';
export { QuizHeader } from './QuizHeader';
export { ExplanationCard } from './ExplanationCard';
export { ExitModal } from './ExitModal';
```

**Step 2: Commit**

```bash
git add apps/mobile/components/quiz/index.ts
git commit -m "feat(quiz): add quiz components index"
```

---

## Task 8: Create Quiz Screen Layout

**Files:**
- Create: `apps/mobile/app/quiz/_layout.tsx`

**Step 1: Create the quiz layout**

```typescript
// apps/mobile/app/quiz/_layout.tsx

import { Stack } from 'expo-router';

export default function QuizLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: false, // Prevent swipe back during quiz
      }}
    />
  );
}
```

**Step 2: Commit**

```bash
git add apps/mobile/app/quiz/_layout.tsx
git commit -m "feat(quiz): add quiz stack layout"
```

---

## Task 9: Create Main Quiz Screen

**Files:**
- Create: `apps/mobile/app/quiz/index.tsx`

**Step 1: Create the quiz screen**

```typescript
// apps/mobile/app/quiz/index.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import {
  QuizHeader,
  OptionButton,
  ExplanationCard,
  ExitModal,
  type OptionState,
} from '@/components/quiz';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { triggerImpact } from '@/utils/haptics';
import {
  getQuestionsForSection,
  type Question,
  type OptionLabel,
  type SectionCode,
  type AnswerRecord,
} from '@/constants/mock-questions';
import { QUESTIONS_PER_SESSION } from '@/constants/quiz-config';

type QuizPhase = 'answering' | 'feedback';

export default function QuizScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const params = useLocalSearchParams<{ section: SectionCode }>();

  const section = params.section || 'XYZ';

  // Quiz state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<OptionLabel | null>(null);
  const [phase, setPhase] = useState<QuizPhase>('answering');
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [sessionStartTime] = useState(Date.now());
  const [showExitModal, setShowExitModal] = useState(false);

  // Load questions on mount
  useEffect(() => {
    const loadedQuestions = getQuestionsForSection(section, QUESTIONS_PER_SESSION);
    setQuestions(loadedQuestions);
  }, [section]);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSelectOption = useCallback((label: OptionLabel) => {
    if (phase === 'answering') {
      setSelectedOption(label);
    }
  }, [phase]);

  const handleCheck = useCallback(() => {
    if (!selectedOption || !currentQuestion) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);

    // Record answer
    const answerRecord: AnswerRecord = {
      questionId: currentQuestion.id,
      selected: selectedOption,
      correct: isCorrect,
      timeSpent,
    };
    setAnswers(prev => [...prev, answerRecord]);

    // Haptic feedback
    if (isCorrect) {
      triggerImpact(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      triggerImpact(Haptics.ImpactFeedbackStyle.Heavy);
    }

    setPhase('feedback');
  }, [selectedOption, currentQuestion, questionStartTime]);

  const handleContinue = useCallback(() => {
    if (isLastQuestion) {
      // Navigate to summary
      const totalTime = Math.round((Date.now() - sessionStartTime) / 1000);
      router.replace({
        pathname: '/quiz/summary',
        params: {
          section,
          answers: JSON.stringify(answers),
          totalTime: String(totalTime),
        },
      });
    } else {
      // Move to next question
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setPhase('answering');
      setQuestionStartTime(Date.now());
    }
  }, [isLastQuestion, router, section, answers, sessionStartTime]);

  const handleClose = useCallback(() => {
    setShowExitModal(true);
  }, []);

  const handleExitConfirm = useCallback(() => {
    setShowExitModal(false);
    router.back();
  }, [router]);

  const handleExitCancel = useCallback(() => {
    setShowExitModal(false);
  }, []);

  const getOptionState = useCallback((label: OptionLabel): OptionState => {
    if (phase === 'answering') {
      return label === selectedOption ? 'selected' : 'default';
    }
    // Feedback phase
    if (label === currentQuestion?.correctAnswer) {
      return 'correct';
    }
    if (label === selectedOption) {
      return 'incorrect';
    }
    return 'default';
  }, [phase, selectedOption, currentQuestion?.correctAnswer]);

  if (!currentQuestion) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loading}>
          <Text variant="body">Laddar frågor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isCorrect = selectedOption === currentQuestion.correctAnswer;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <QuizHeader
        currentQuestion={currentIndex + 1}
        totalQuestions={questions.length}
        section={section}
        onClose={handleClose}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Question */}
        <Animated.View
          key={currentQuestion.id}
          entering={FadeInDown.duration(400)}
          style={styles.questionSection}
        >
          {/* Question number */}
          <Text variant="h2" style={styles.questionNumber}>
            {currentQuestion.number}.
          </Text>

          {/* Question text */}
          <Text variant="bodyLg" style={styles.questionText}>
            {currentQuestion.text}
          </Text>
        </Animated.View>

        {/* Options */}
        <View style={styles.optionsSection}>
          {currentQuestion.options.map((option, index) => (
            <Animated.View
              key={option.label}
              entering={FadeInDown.duration(400).delay(100 + index * 50)}
            >
              <OptionButton
                label={option.label}
                text={option.text}
                state={getOptionState(option.label)}
                onPress={() => handleSelectOption(option.label)}
                disabled={phase === 'feedback'}
              />
            </Animated.View>
          ))}
        </View>

        {/* Explanation Card (shown after checking) */}
        {phase === 'feedback' && (
          <ExplanationCard
            isCorrect={isCorrect}
            correctAnswer={currentQuestion.correctAnswer}
            explanation={currentQuestion.explanation}
          />
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background }]}>
        <Button
          fullWidth
          size="xl"
          disabled={phase === 'answering' && !selectedOption}
          onPress={phase === 'answering' ? handleCheck : handleContinue}
        >
          {phase === 'answering' ? 'Kontrollera' : 'Fortsätt'}
        </Button>
      </View>

      {/* Exit Modal */}
      <ExitModal
        visible={showExitModal}
        onCancel={handleExitCancel}
        onConfirm={handleExitConfirm}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing['4xl'],
  },
  questionSection: {
    marginBottom: Spacing.xl,
  },
  questionNumber: {
    marginBottom: Spacing.md,
  },
  questionText: {
    lineHeight: 28,
  },
  optionsSection: {
    marginTop: Spacing.md,
  },
  bottomBar: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
});
```

**Step 2: Commit**

```bash
git add apps/mobile/app/quiz/index.tsx
git commit -m "feat(quiz): add main quiz screen"
```

---

## Task 10: Create Summary Screen

**Files:**
- Create: `apps/mobile/app/quiz/summary.tsx`

**Step 1: Create the summary screen**

```typescript
// apps/mobile/app/quiz/summary.tsx

import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Colors, Spacing, BorderRadius, Primitives } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { SectionCode, AnswerRecord } from '@/constants/mock-questions';
import {
  TARGET_TIME_PER_QUESTION,
  DEFAULT_TARGET_TIME,
  SCORE_THRESHOLDS,
  PACE_THRESHOLDS,
  SUMMARY_TITLES,
  PACE_STATUS,
} from '@/constants/quiz-config';

export default function SummaryScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const params = useLocalSearchParams<{
    section: SectionCode;
    answers: string;
    totalTime: string;
  }>();

  const section = params.section || 'XYZ';
  const answers: AnswerRecord[] = useMemo(() => {
    try {
      return JSON.parse(params.answers || '[]');
    } catch {
      return [];
    }
  }, [params.answers]);
  const totalTime = parseInt(params.totalTime || '0', 10);

  // Calculate stats
  const correctCount = answers.filter(a => a.correct).length;
  const totalCount = answers.length;
  const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const wrongCount = totalCount - correctCount;

  // Time stats
  const avgTimePerQuestion = totalCount > 0 ? Math.round(totalTime / totalCount) : 0;
  const targetTime = TARGET_TIME_PER_QUESTION[section] || DEFAULT_TARGET_TIME;
  const pacePercentOver = targetTime > 0 ? ((avgTimePerQuestion - targetTime) / targetTime) * 100 : 0;

  // Determine title and icon based on score
  const getSummaryTitleData = () => {
    if (percentage >= SCORE_THRESHOLDS.excellent) return SUMMARY_TITLES.excellent;
    if (percentage >= SCORE_THRESHOLDS.good) return SUMMARY_TITLES.good;
    if (percentage >= SCORE_THRESHOLDS.okay) return SUMMARY_TITLES.okay;
    return SUMMARY_TITLES.poor;
  };

  // Determine pace status
  const getPaceStatus = () => {
    if (pacePercentOver <= PACE_THRESHOLDS.onPace) return PACE_STATUS.onPace;
    if (pacePercentOver <= PACE_THRESHOLDS.slightlySlow) return PACE_STATUS.slightlySlow;
    return PACE_STATUS.tooSlow;
  };

  const titleData = getSummaryTitleData();
  const paceStatus = getPaceStatus();

  // Format time as M:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDone = () => {
    router.dismissAll();
  };

  const handleReview = () => {
    // For now, just go back - review screen can be added later
    router.dismissAll();
  };

  const getPaceColor = () => {
    if (pacePercentOver <= PACE_THRESHOLDS.onPace) return Primitives.success[400];
    if (pacePercentOver <= PACE_THRESHOLDS.slightlySlow) return Primitives.warning[500];
    return Primitives.error[400];
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(100)}
          style={styles.titleSection}
        >
          <Text style={styles.emoji}>{titleData.icon}</Text>
          <Text variant="hero" style={styles.title}>{titleData.title}</Text>
        </Animated.View>

        {/* Score Card */}
        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
          <Card style={styles.scoreCard}>
            <Text style={[styles.scoreValue, { color: colors.text }]}>
              {correctCount} / {totalCount}
            </Text>
            <Text variant="h3" color="secondary">rätt</Text>
            <View style={[styles.percentageBadge, { backgroundColor: colors.primaryLight }]}>
              <Text variant="h4" color="primary">{percentage}%</Text>
            </View>
          </Card>
        </Animated.View>

        {/* Stats Card */}
        <Animated.View entering={FadeInDown.duration(500).delay(300)}>
          <Card style={styles.statsCard}>
            <View style={styles.statRow}>
              <Text variant="body" color="secondary">⏱  Total tid</Text>
              <Text variant="body" weight="bold">{formatTime(totalTime)}</Text>
            </View>
            <View style={styles.statRow}>
              <Text variant="body" color="secondary">📊  Sektion</Text>
              <Text variant="body" weight="bold">{section}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.divider }]} />
            <View style={styles.statRow}>
              <Text variant="body" color="secondary">⚡  Snitt/fråga</Text>
              <Text variant="body" weight="bold">{avgTimePerQuestion} sek</Text>
            </View>
            <View style={styles.paceRow}>
              <Text variant="bodySm" color="secondary">
                Mål: {targetTime} sek
              </Text>
              <Text style={[styles.paceStatus, { color: getPaceColor() }]}>
                {paceStatus.icon} {paceStatus.label}
              </Text>
            </View>
          </Card>
        </Animated.View>

        {/* Buttons */}
        <Animated.View
          entering={FadeInUp.duration(500).delay(400)}
          style={styles.buttonsSection}
        >
          {wrongCount > 0 && (
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onPress={handleReview}
              style={styles.reviewButton}
            >
              Granska fel ({wrongCount})
            </Button>
          )}
          <Button
            size="xl"
            fullWidth
            onPress={handleDone}
          >
            Klar
          </Button>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing['4xl'],
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  emoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  title: {
    textAlign: 'center',
  },
  scoreCard: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
    marginBottom: Spacing.lg,
  },
  scoreValue: {
    fontSize: 56,
    fontWeight: 'bold',
    lineHeight: 64,
  },
  percentageBadge: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  statsCard: {
    marginBottom: Spacing.xl,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  paceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  paceStatus: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonsSection: {
    marginTop: Spacing.lg,
  },
  reviewButton: {
    marginBottom: Spacing.md,
  },
});
```

**Step 2: Commit**

```bash
git add apps/mobile/app/quiz/summary.tsx
git commit -m "feat(quiz): add summary screen with stats"
```

---

## Task 11: Update Trana Screen to Navigate to Quiz

**Files:**
- Modify: `apps/mobile/app/(tabs)/trana.tsx`

**Step 1: Update the SectionTile onPress to navigate**

Find the `handleSectionPress` function and update it:

```typescript
// In trana.tsx, update the import to include useRouter
import { useRouter } from 'expo-router';

// Inside TranaScreen component, add:
const router = useRouter();

// Update handleSectionPress:
const handleSectionPress = (sectionCode: string) => {
  triggerImpact(Haptics.ImpactFeedbackStyle.Light);
  router.push({
    pathname: '/quiz',
    params: { section: sectionCode },
  });
};

// Update handleStartTraining for smart mode:
const handleStartTraining = () => {
  triggerImpact(Haptics.ImpactFeedbackStyle.Medium);
  if (selectedMode === 'smart') {
    // For smart mode, pick a weak section (NOG for now as mock)
    router.push({
      pathname: '/quiz',
      params: { section: 'NOG' },
    });
  } else if (selectedMode === 'section') {
    // Section mode requires selecting a section first
    console.log('Please select a section');
  } else {
    // Simulate mode - not implemented yet
    console.log('Simulate mode coming soon');
  }
};
```

**Step 2: Commit**

```bash
git add apps/mobile/app/\(tabs\)/trana.tsx
git commit -m "feat(quiz): connect trana screen to quiz navigation"
```

---

## Task 12: Test the Implementation

**Step 1: Start the dev server**

```bash
cd /Users/williamlarsten/conductor/workspaces/maxa/miami && bun start
```

**Step 2: Test on simulator**

- Open iOS simulator or Android emulator
- Navigate to Träna tab
- Select "Välj delprov" mode
- Tap on a section tile (e.g., XYZ)
- Verify quiz loads with questions
- Select an option and tap "Kontrollera"
- Verify feedback shows correctly
- Complete 10 questions
- Verify summary screen shows correct stats

**Step 3: Verify all components**

- [ ] QuizHeader shows X, progress bar, section pill
- [ ] OptionButton states work (default, selected, correct, incorrect)
- [ ] ExplanationCard appears on wrong answers
- [ ] ExitModal appears when tapping X
- [ ] Summary screen shows score, time, pace comparison
- [ ] Navigation back to trana works

---

## Summary

This implementation plan creates:

1. **Constants**: Quiz config (times, thresholds) and mock questions
2. **Components**: OptionButton, QuizHeader, ExplanationCard, ExitModal
3. **Screens**: Quiz screen (answering flow) and Summary screen (results)
4. **Navigation**: Quiz stack layout and connection from Trana screen

All components follow the existing design system:
- Duolingo-inspired styling (2px borders, yellow accent, Nunito font)
- Haptic feedback on interactions
- Spring animations with react-native-reanimated
- Dark mode support via theme colors
