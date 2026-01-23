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
