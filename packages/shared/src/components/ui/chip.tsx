import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  Pressable,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import {
  Colors,
  BorderRadius,
  Spacing,
  FontFamily,
  FontSize,
} from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { triggerImpact } from '../../utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ChipVariant = 'filled' | 'soft';
type ChipSize = 'sm' | 'md' | 'lg';

interface ChipProps {
  children: React.ReactNode;
  variant?: ChipVariant;
  size?: ChipSize;
  bgColor?: string;
  textColor?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

/**
 * Duolingo-style Chip component
 * - Soft backgrounds for badges
 * - Bold text
 * - Rounded-full corners
 */
export function Chip({
  children,
  variant = 'soft',
  size = 'md',
  bgColor,
  textColor,
  leftIcon,
  rightIcon,
  onPress,
  style,
}: ChipProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    if (onPress) {
      triggerImpact(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const getDefaultColors = () => {
    if (variant === 'filled') {
      return {
        bg: bgColor || colors.primary,
        text: textColor || colors.textOnPrimary,
      };
    }
    // soft variant
    return {
      bg: bgColor || colors.primaryLight,
      text: textColor || colors.primary,
    };
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          height: 28,
          paddingHorizontal: Spacing.sm,
          fontSize: FontSize.xs,
        };
      case 'md':
        return {
          height: 32,
          paddingHorizontal: Spacing.md,
          fontSize: FontSize.sm,
        };
      case 'lg':
        return {
          height: 40,
          paddingHorizontal: Spacing.base,
          fontSize: FontSize.base,
        };
    }
  };

  const colorStyles = getDefaultColors();
  const sizeStyles = getSizeStyles();

  const content = (
    <>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      <Text
        style={[
          styles.text,
          {
            fontSize: sizeStyles.fontSize,
            color: colorStyles.text,
          },
        ]}
      >
        {children}
      </Text>
      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </>
  );

  const containerStyle = [
    styles.base,
    {
      height: sizeStyles.height,
      paddingHorizontal: sizeStyles.paddingHorizontal,
      backgroundColor: colorStyles.bg,
    },
    style,
  ];

  if (onPress) {
    return (
      <AnimatedPressable
        style={[containerStyle, animatedStyle]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
      >
        {content}
      </AnimatedPressable>
    );
  }

  return (
    <View style={containerStyle}>
      {content}
    </View>
  );
}

// Specialized Streak Chip with fire icon and orange
interface StreakChipProps {
  days: number;
  size?: ChipSize;
}

export function StreakChip({ days, size = 'md' }: StreakChipProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Chip
      variant="soft"
      size={size}
      bgColor={colorScheme === 'dark' ? '#3D2800' : '#FFF3E0'}
      textColor={colors.streak}
      leftIcon={<Text style={styles.streakIcon}>🔥</Text>}
    >
      {days}
    </Chip>
  );
}

// Section pill for ORD, LÄS, XYZ, etc.
interface SectionPillProps {
  section: string;
  bgColor: string;
  textColor: string;
}

export function SectionPill({ section, bgColor, textColor }: SectionPillProps) {
  return (
    <View style={[styles.sectionPill, { backgroundColor: bgColor }]}>
      <Text style={[styles.sectionPillText, { color: textColor }]}>
        {section}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.full,
  },
  text: {
    fontFamily: FontFamily.bold,
  },
  leftIcon: {
    marginRight: Spacing.xs,
  },
  rightIcon: {
    marginLeft: Spacing.xs,
  },
  streakIcon: {
    fontSize: FontSize.sm,
  },
  sectionPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  sectionPillText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
  },
});
