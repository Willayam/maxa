import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';

import { Text } from '@/components/ui/text';
import { Colors, BorderRadius, Spacing, Primitives } from '@/constants/theme';
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

  const headerBackgroundColor = isCorrect
    ? Primitives.success[500]
    : Primitives.error[500];

  return (
    <Animated.View
      entering={SlideInDown.duration(300).springify().damping(15)}
      style={[
        styles.container,
        {
          borderColor: colors.cardBorder,
          backgroundColor: colors.cardBackground,
        },
      ]}
    >
      {/* Header section */}
      <View
        style={[
          styles.header,
          { backgroundColor: headerBackgroundColor },
        ]}
      >
        <Text
          variant="h4"
          style={styles.headerText}
        >
          {isCorrect ? '✓ Rätt!' : '✗ Inte riktigt'}
        </Text>
      </View>

      {/* Content section */}
      <View style={styles.content}>
        {/* Show correct answer if incorrect */}
        {!isCorrect && (
          <Text
            variant="body"
            weight="bold"
            style={[styles.correctAnswerText, { color: colors.text }]}
          >
            Rätt svar: {correctAnswer}
          </Text>
        )}

        {/* Explanation text */}
        <Text
          variant="body"
          style={{ color: colors.text }}
        >
          {explanation}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
  },
  header: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  headerText: {
    color: Primitives.white,
  },
  content: {
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  correctAnswerText: {
    marginBottom: Spacing.xs,
  },
});
