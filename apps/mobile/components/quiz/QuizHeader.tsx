import React from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Colors, Spacing, SectionColors, FontFamily, FontSize } from '@/constants/theme';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SectionPill } from '@/components/ui/chip';
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

/**
 * Quiz header with close button, progress bar, and section pill
 * Appears at top of quiz screen during question answering
 */
export function QuizHeader({
  currentQuestion,
  totalQuestions,
  section,
  onClose,
}: QuizHeaderProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const sectionColors = SectionColors[section];

  const closeButtonScale = useSharedValue(1);

  const animatedCloseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: closeButtonScale.value }],
  }));

  const handleClosePressIn = () => {
    closeButtonScale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  };

  const handleClosePressOut = () => {
    closeButtonScale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handleClosePress = () => {
    triggerImpact(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  // Calculate progress percentage
  const progress = totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0;

  return (
    <View style={styles.container}>
      {/* Close button */}
      <AnimatedPressable
        style={[styles.closeButton, animatedCloseStyle]}
        onPressIn={handleClosePressIn}
        onPressOut={handleClosePressOut}
        onPress={handleClosePress}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityRole="button"
        accessibilityLabel="Close quiz"
      >
        <Text style={[styles.closeText, { color: colors.textSecondary }]}>✕</Text>
      </AnimatedPressable>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <ProgressBar
          progress={progress}
          size="sm"
          color={sectionColors.accent}
        />
      </View>

      {/* Section pill */}
      <SectionPill
        section={section}
        bgColor={sectionColors.light}
        textColor={sectionColors.text}
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
  closeText: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.medium,
  },
  progressContainer: {
    flex: 1,
  },
});
