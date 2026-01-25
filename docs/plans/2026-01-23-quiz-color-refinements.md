# Quiz UI Color Theme Refinements

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refine quiz UI colors and components to match Duolingo's polished, dynamic aesthetic.

**Architecture:** Update theme primitives for warmer error red, modify SectionPill to support inverted colors, enhance ProgressBar with 3D highlight effect, redesign ExitModal buttons with clear visual hierarchy, and update ExplanationCard border to match semantic state.

**Tech Stack:** React Native, Reanimated, Expo

---

## Summary of Changes

| Component | Current Issue | Solution |
|-----------|--------------|----------|
| Error color | Too pink (#FF2B8F) | Warmer coral (#FF4B4B) |
| Section pills | Light bg, dark text | Inverted: dark bg, light text |
| Progress bar | Flat, single color | 3D effect with highlight/shadow |
| Exit modal buttons | Bland, no hierarchy | Yellow primary, red destructive |
| Explanation card | Generic border | Border matches semantic color |
| Feedback panel | Inline card | Full-bleed colored footer (Duolingo-style) |
| Feedback header | Emoji (✓/✗) | Proper Ionicons icons |

---

### Task 1: Update Error Color Primitives

**Files:**
- Modify: `apps/mobile/constants/theme.ts:80-87`

**Step 1: Update error color palette**

Change the error primitives from pink to warm coral:

```typescript
// Error - Warm Coral/Tomato (Duolingo-inspired)
error: {
  50: '#FFF5F5',
  100: '#FFE5E5',
  400: '#FF4B4B', // ← Warm coral (was #FF2B8F pink)
  500: '#FF4B4B',
  600: '#E53E3E',
},
```

**Step 2: Update dark mode error colors**

In the `Colors.dark` section (~line 271):

```typescript
error: '#FF6B6B', // Softer coral for dark mode (was #FF6B9D)
errorLight: '#3D2020', // Dark coral tint (was #3D1A2E)
```

**Step 3: Verify visually**

Run the app and check the incorrect answer state in quiz.

**Step 4: Commit**

```bash
git add apps/mobile/constants/theme.ts
git commit -m "style: update error colors from pink to warm coral"
```

---

### Task 2: Update SectionPill to Support Inverted Style

**Files:**
- Modify: `apps/mobile/components/ui/chip.tsx:197-212`

**Step 1: Add inverted prop to SectionPill**

Update the interface and component:

```typescript
// Section pill for ORD, LÄS, XYZ, etc.
interface SectionPillProps {
  section: string;
  bgColor: string;
  textColor: string;
  inverted?: boolean; // NEW: swap bg/text colors
}

export function SectionPill({ section, bgColor, textColor, inverted = false }: SectionPillProps) {
  // When inverted, use textColor as background and white as text
  const finalBgColor = inverted ? textColor : bgColor;
  const finalTextColor = inverted ? '#FFFFFF' : textColor;

  return (
    <View style={[styles.sectionPill, { backgroundColor: finalBgColor }]}>
      <Text style={[styles.sectionPillText, { color: finalTextColor }]}>
        {section}
      </Text>
    </View>
  );
}
```

**Step 2: Commit**

```bash
git add apps/mobile/components/ui/chip.tsx
git commit -m "feat(chip): add inverted prop to SectionPill"
```

---

### Task 3: Use Inverted SectionPill in QuizHeader

**Files:**
- Modify: `apps/mobile/components/quiz/QuizHeader.tsx:87-91`

**Step 1: Enable inverted mode on SectionPill**

```typescript
{/* Section pill - inverted style */}
<SectionPill
  section={section}
  bgColor={sectionColors.light}
  textColor={sectionColors.text}
  inverted={true}
/>
```

**Step 2: Verify visually**

The "NOG" pill should now have green background with white text.

**Step 3: Commit**

```bash
git add apps/mobile/components/quiz/QuizHeader.tsx
git commit -m "style(quiz): use inverted section pill in header"
```

---

### Task 4: Add 3D Effect to ProgressBar

**Files:**
- Modify: `apps/mobile/components/ui/progress-bar.tsx`

**Step 1: Update ProgressBar with highlight and shadow layers**

Replace the current implementation with a 3D-style progress bar:

```typescript
import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import {
  Colors,
  BorderRadius,
  Primitives,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ProgressBarSize = 'sm' | 'md' | 'lg';

interface ProgressBarProps {
  progress: number; // 0-100
  size?: ProgressBarSize;
  color?: string;
  trackColor?: string;
  showAnimation?: boolean;
  style?: ViewStyle;
}

/**
 * Duolingo-style Progress Bar with 3D effect
 * - Gray track with inner shadow
 * - Yellow fill with highlight/shadow for depth
 */
export function ProgressBar({
  progress,
  size = 'md',
  color,
  trackColor,
  showAnimation = true,
  style,
}: ProgressBarProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    const clampedProgress = Math.min(100, Math.max(0, progress));
    if (showAnimation) {
      animatedProgress.value = withSpring(clampedProgress, {
        damping: 20,
        stiffness: 100,
      });
    } else {
      animatedProgress.value = clampedProgress;
    }
  }, [progress, showAnimation, animatedProgress]);

  const getHeight = (): number => {
    switch (size) {
      case 'sm':
        return 10;
      case 'md':
        return 14;
      case 'lg':
        return 18;
    }
  };

  // Use brand yellow as default fill
  const fillColor = color || Primitives.yellow[500]; // #FFC800
  const fillColorDark = color ? color : Primitives.yellow[600]; // #E5A400 - shadow
  const fillColorLight = color ? color : Primitives.yellow[400]; // #FFD54F - highlight

  const bgTrackColor = trackColor || colors.progressTrack;

  const animatedFillStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedProgress.value}%`,
    };
  });

  const height = getHeight();
  const highlightHeight = Math.max(2, height * 0.25); // Top highlight
  const shadowHeight = Math.max(2, height * 0.2); // Bottom shadow

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: bgTrackColor,
        },
        style,
      ]}
    >
      {/* Track inner shadow for depth */}
      <View style={[styles.trackInnerShadow, { height: 2 }]} />

      {/* Fill with 3D layers */}
      <Animated.View
        style={[
          styles.fill,
          {
            height,
            backgroundColor: fillColor,
          },
          animatedFillStyle,
        ]}
      >
        {/* Top highlight */}
        <View
          style={[
            styles.fillHighlight,
            {
              height: highlightHeight,
              backgroundColor: fillColorLight,
            }
          ]}
        />
        {/* Bottom shadow */}
        <View
          style={[
            styles.fillShadow,
            {
              height: shadowHeight,
              backgroundColor: fillColorDark,
            }
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    position: 'relative',
  },
  trackInnerShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderTopLeftRadius: BorderRadius.full,
    borderTopRightRadius: BorderRadius.full,
  },
  fill: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    position: 'relative',
  },
  fillHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: BorderRadius.full,
    borderTopRightRadius: BorderRadius.full,
    opacity: 0.6,
  },
  fillShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: BorderRadius.full,
    borderBottomRightRadius: BorderRadius.full,
  },
});
```

**Step 2: Verify visually**

The progress bar should now have a dynamic 3D look with:
- Lighter highlight at top
- Darker shadow at bottom
- Main brand yellow in the middle

**Step 3: Commit**

```bash
git add apps/mobile/components/ui/progress-bar.tsx
git commit -m "style(progress-bar): add 3D highlight/shadow effect"
```

---

### Task 5: Update ExplanationCard Border to Match Semantic Color

**Files:**
- Modify: `apps/mobile/components/quiz/ExplanationCard.tsx:28-38`

**Step 1: Update container border to use semantic color**

Change the border color logic:

```typescript
// Determine border color based on correct/incorrect state
const borderColor = isCorrect
  ? Primitives.success[500]
  : Primitives.error[500];

return (
  <Animated.View
    entering={SlideInDown.duration(300).springify().damping(20).stiffness(100)}
    style={[
      styles.container,
      {
        borderColor: borderColor, // Use semantic color instead of cardBorder
        backgroundColor: colors.cardBackground,
      },
    ]}
  >
```

**Step 2: Verify visually**

- Correct answer card should have green border
- Incorrect answer card should have coral/red border

**Step 3: Commit**

```bash
git add apps/mobile/components/quiz/ExplanationCard.tsx
git commit -m "style(explanation-card): border matches semantic state color"
```

---

### Task 6: Redesign ExitModal Buttons

**Files:**
- Modify: `apps/mobile/components/quiz/ExitModal.tsx`

**Step 1: Import Primitives and update button styling**

The exit modal needs:
- Primary "Fortsätt öva" button in brand yellow (keep practicing - positive action)
- Destructive "Avsluta" button in red (quit - destructive action)

Update the component:

```typescript
import React from 'react';
import { Modal, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Colors, BorderRadius, Spacing, Primitives } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ExitModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ExitModal({ visible, onCancel, onConfirm }: ExitModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { width } = useWindowDimensions();

  // Modal card: 85% width, max 340px
  const modalWidth = Math.min(width * 0.85, 340);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <AnimatedPressable
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={[styles.backdrop, { backgroundColor: colors.overlay }]}
          onPress={onCancel}
        />

        {/* Modal Card */}
        <Animated.View
          entering={SlideInDown.springify().damping(20).stiffness(200)}
          exiting={SlideOutDown.springify().damping(20).stiffness(200)}
          style={[
            styles.modalCard,
            {
              width: modalWidth,
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          {/* Title */}
          <Text variant="h3" align="center" style={styles.title}>
            Vill du avsluta?
          </Text>

          {/* Message */}
          <Text variant="body" color="secondary" align="center" style={styles.message}>
            Din progress sparas inte om du avslutar nu.
          </Text>

          {/* Buttons */}
          <View style={styles.buttons}>
            {/* Primary action: Continue practicing (brand yellow) */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={onCancel}
            >
              Fortsätt öva
            </Button>

            {/* Destructive action: Quit (red/coral text) */}
            <Pressable
              style={styles.destructiveButton}
              onPress={onConfirm}
            >
              <Text
                variant="body"
                weight="bold"
                style={{ color: Primitives.error[500] }}
              >
                Avsluta
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.xl,
    borderWidth: 2,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  message: {
    marginBottom: Spacing.xl,
  },
  buttons: {
    gap: Spacing.md,
  },
  destructiveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
  },
});
```

**Step 2: Verify visually**

- "Fortsätt öva" should be the prominent yellow button
- "Avsluta" should be coral/red text below it

**Step 3: Commit**

```bash
git add apps/mobile/components/quiz/ExitModal.tsx
git commit -m "style(exit-modal): redesign with yellow primary and red destructive"
```

---

### Task 7: Create Duolingo-Style Feedback Footer

**Files:**
- Create: `apps/mobile/components/quiz/FeedbackFooter.tsx`
- Modify: `apps/mobile/app/quiz/index.tsx`

**Step 1: Create the FeedbackFooter component**

This replaces the inline ExplanationCard with a full-bleed colored footer like Duolingo:

```typescript
// apps/mobile/components/quiz/FeedbackFooter.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Spacing, Primitives, FontFamily, FontSize } from '@/constants/theme';
import type { OptionLabel } from '@/constants/mock-questions';

interface FeedbackFooterProps {
  isCorrect: boolean;
  correctAnswer: OptionLabel;
  explanation: string;
  onContinue: () => void;
  isLastQuestion: boolean;
}

/**
 * Duolingo-style full-bleed feedback footer
 * - Green background for correct, coral for incorrect
 * - Icon + bold label header
 * - Explanation text
 * - Continue button matching the semantic color
 */
export function FeedbackFooter({
  isCorrect,
  correctAnswer,
  explanation,
  onContinue,
  isLastQuestion,
}: FeedbackFooterProps) {
  const insets = useSafeAreaInsets();

  const backgroundColor = isCorrect
    ? Primitives.success[100]
    : Primitives.error[100];

  const accentColor = isCorrect
    ? Primitives.success[500]
    : Primitives.error[500];

  const buttonColor = isCorrect
    ? Primitives.success[500]
    : Primitives.error[500];

  const buttonBorderColor = isCorrect
    ? Primitives.success[600]
    : Primitives.error[600];

  return (
    <Animated.View
      entering={SlideInDown.duration(300).springify().damping(20).stiffness(100)}
      style={[
        styles.container,
        {
          backgroundColor,
          paddingBottom: Math.max(insets.bottom, Spacing.base),
        },
      ]}
    >
      {/* Header with icon */}
      <View style={styles.header}>
        <Ionicons
          name={isCorrect ? 'checkmark-circle' : 'close-circle'}
          size={28}
          color={accentColor}
        />
        <Text style={[styles.headerText, { color: accentColor }]}>
          {isCorrect ? 'Rätt!' : 'Inte riktigt'}
        </Text>
      </View>

      {/* Show correct answer if incorrect */}
      {!isCorrect && (
        <Text style={[styles.correctAnswer, { color: accentColor }]}>
          Rätt svar: {correctAnswer}
        </Text>
      )}

      {/* Explanation */}
      <Text style={[styles.explanation, { color: accentColor }]}>
        {explanation}
      </Text>

      {/* Continue button */}
      <View style={styles.buttonContainer}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={onContinue}
          style={{
            backgroundColor: buttonColor,
            borderBottomColor: buttonBorderColor,
          }}
        >
          {isLastQuestion ? 'Se resultat' : 'Fortsätt'}
        </Button>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  headerText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
  },
  correctAnswer: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.base,
    marginBottom: Spacing.xs,
  },
  explanation: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * 1.5,
    marginBottom: Spacing.lg,
    opacity: 0.9,
  },
  buttonContainer: {
    marginTop: Spacing.sm,
  },
});
```

**Step 2: Export from components/quiz/index.ts**

Add to the exports:

```typescript
export { FeedbackFooter } from './FeedbackFooter';
```

**Step 3: Commit**

```bash
git add apps/mobile/components/quiz/FeedbackFooter.tsx apps/mobile/components/quiz/index.ts
git commit -m "feat(quiz): add Duolingo-style FeedbackFooter component"
```

---

### Task 8: Integrate FeedbackFooter into Quiz Screen

**Files:**
- Modify: `apps/mobile/app/quiz/index.tsx`

**Step 1: Update imports**

Add FeedbackFooter to imports:

```typescript
import {
  QuizHeader,
  OptionButton,
  ExplanationCard,
  ExitModal,
  FeedbackFooter,
  type OptionState,
} from '@/components/quiz';
```

**Step 2: Replace bottom bar with FeedbackFooter in feedback phase**

Update the bottom section of the component. Replace the entire bottom bar section:

```typescript
{/* Bottom section */}
{phase === 'feedback' && selectedOption ? (
  <FeedbackFooter
    isCorrect={selectedOption === currentQuestion.correctAnswer}
    correctAnswer={currentQuestion.correctAnswer}
    explanation={currentQuestion.explanation}
    onContinue={handleContinue}
    isLastQuestion={isLastQuestion}
  />
) : (
  <View
    style={[
      styles.bottomBar,
      {
        backgroundColor: colors.background,
        borderTopColor: colors.border,
      },
    ]}
  >
    <Button
      variant="primary"
      size="lg"
      fullWidth
      onPress={handleCheckAnswer}
      disabled={!selectedOption}
    >
      Kontrollera
    </Button>
  </View>
)}
```

**Step 3: Remove the inline ExplanationCard from ScrollView**

Delete this section from the ScrollView content:

```typescript
{/* Explanation card (feedback phase) */}
{phase === 'feedback' && selectedOption && (
  <View style={styles.explanationContainer}>
    <ExplanationCard
      isCorrect={selectedOption === currentQuestion.correctAnswer}
      correctAnswer={currentQuestion.correctAnswer}
      explanation={currentQuestion.explanation}
    />
  </View>
)}
```

**Step 4: Remove explanationContainer style**

Remove from styles:

```typescript
explanationContainer: {
  marginTop: Spacing.xl,
},
```

**Step 5: Commit**

```bash
git add apps/mobile/app/quiz/index.tsx
git commit -m "feat(quiz): integrate FeedbackFooter replacing inline ExplanationCard"
```

---

### Task 9: Final Visual QA

**Step 1: Test all states**

Run the app and verify:

1. **Quiz question screen:**
   - Progress bar has 3D highlight/shadow
   - Section pill (NOG) is inverted (green bg, white text)

2. **Wrong answer state:**
   - Error color is warm coral (not pink)
   - Full-bleed coral footer appears at bottom
   - Icon + "Inte riktigt" header
   - Continue button is coral colored

3. **Correct answer state:**
   - Full-bleed green footer
   - Icon + "Rätt!" header
   - Continue button is green

4. **Exit modal:**
   - Yellow "Fortsätt öva" button
   - Red "Avsluta" text link

**Step 2: Test both light and dark modes**

Toggle between light/dark to ensure colors work in both.

**Step 3: Final commit**

```bash
git add -A
git commit -m "style(quiz): complete color theme refinements"
```

---

## Design Notes

### Color Rationale

| Color | Old Value | New Value | Reason |
|-------|-----------|-----------|--------|
| Error | #FF2B8F (pink) | #FF4B4B (coral) | Duolingo uses warm coral, easier on eyes |
| Progress fill | Single color | 3 layers | Adds depth, matches Duolingo polish |
| Section pill | Light bg | Dark bg (inverted) | Higher contrast, more badge-like |

### Duolingo Reference Patterns

1. **Progress bar depth:** Uses subtle gradient effect - lighter at top, darker at bottom
2. **Feedback panels:** Full-width colored backgrounds at bottom of screen
3. **Error state:** Warm coral/tomato, not harsh red or pink
4. **Button hierarchy:** Clear primary (colorful) vs secondary (text-only)
