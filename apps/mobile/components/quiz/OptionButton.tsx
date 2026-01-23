import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/ui/text';
import {
  Colors,
  Spacing,
  BorderRadius,
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

  // Animated values
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

  // Shake animation when incorrect
  useEffect(() => {
    if (state === 'incorrect') {
      // Trigger shake animation
      translateX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
      // Haptic feedback for wrong answer
      triggerImpact(Haptics.ImpactFeedbackStyle.Heavy);
    }
  }, [state, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: translateX.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
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

  // Get styles based on state
  const getStateStyles = () => {
    switch (state) {
      case 'selected':
        return {
          borderColor: colors.primary,
          backgroundColor:
            colorScheme === 'dark'
              ? colors.primaryLight
              : Primitives.yellow[100],
          labelBackground: colors.primary,
          labelTextColor: colors.textOnPrimary,
        };
      case 'correct':
        return {
          borderColor: Primitives.success[500],
          backgroundColor:
            colorScheme === 'dark'
              ? colors.successLight
              : Primitives.success[100],
          labelBackground: Primitives.success[500],
          labelTextColor: Primitives.white,
        };
      case 'incorrect':
        return {
          borderColor: Primitives.error[500],
          backgroundColor:
            colorScheme === 'dark'
              ? colors.errorLight
              : Primitives.error[100],
          labelBackground: Primitives.error[500],
          labelTextColor: Primitives.white,
        };
      default:
        return {
          borderColor: colors.cardBorder,
          backgroundColor: colors.cardBackground,
          labelBackground: colors.backgroundTertiary,
          labelTextColor: colors.text,
        };
    }
  };

  const stateStyles = getStateStyles();

  // Render icon for correct/incorrect states
  const renderIcon = () => {
    if (state === 'correct') {
      return (
        <View style={styles.iconContainer}>
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={Primitives.success[500]}
          />
        </View>
      );
    }
    if (state === 'incorrect') {
      return (
        <View style={styles.iconContainer}>
          <Ionicons
            name="close-circle"
            size={24}
            color={Primitives.error[500]}
          />
        </View>
      );
    }
    return null;
  };

  return (
    <AnimatedPressable
      style={[
        styles.container,
        {
          borderColor: stateStyles.borderColor,
          backgroundColor: stateStyles.backgroundColor,
        },
        animatedStyle,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
    >
      {/* Label badge */}
      <View
        style={[
          styles.labelBadge,
          { backgroundColor: stateStyles.labelBackground },
        ]}
      >
        <Text
          style={[
            styles.labelText,
            { color: stateStyles.labelTextColor },
          ]}
        >
          {label}
        </Text>
      </View>

      {/* Option text */}
      <Text
        style={[
          styles.optionText,
          { color: colors.text },
        ]}
        numberOfLines={3}
      >
        {text}
      </Text>

      {/* Icon for correct/incorrect */}
      {renderIcon()}
    </AnimatedPressable>
  );
}

const LABEL_SIZE = 32;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: BorderRadius['2xl'],
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    minHeight: 56,
  },
  labelBadge: {
    width: LABEL_SIZE,
    height: LABEL_SIZE,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  labelText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
  },
  optionText: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * 1.4,
  },
  iconContainer: {
    marginLeft: Spacing.sm,
  },
});
