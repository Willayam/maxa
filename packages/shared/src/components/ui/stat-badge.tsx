import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import {
  Colors,
  BorderRadius,
  Spacing,
  FontFamily,
  FontSize,
} from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';

type StatBadgeVariant = 'streak' | 'star' | 'time';

interface StatBadgeProps {
  variant: StatBadgeVariant;
  value: string | number;
  label?: string;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export function StatBadge({
  variant,
  value,
  label,
  animated = false,
  size = 'md',
  style,
}: StatBadgeProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (animated && variant === 'streak') {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1,
        true
      );
    }
  }, [animated, variant, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getIcon = (): string => {
    switch (variant) {
      case 'streak':
        return '🔥';
      case 'star':
        return '★';
      case 'time':
        return '⏱️';
    }
  };

  const getBackgroundColor = (): string => {
    switch (variant) {
      case 'streak':
        return colorScheme === 'dark' ? '#3D2800' : '#FFF3E0';
      case 'star':
        return colors.primaryLight;
      case 'time':
        return colors.backgroundTertiary;
    }
  };

  const getValueColor = (): string => {
    switch (variant) {
      case 'streak':
        return colors.streak;
      case 'star':
        return colors.star;
      case 'time':
        return colors.textSecondary;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingHorizontal: Spacing.sm,
            paddingVertical: Spacing.xs,
            borderRadius: BorderRadius.lg,
          },
          iconSize: 14,
          valueSize: FontSize.sm,
        };
      case 'md':
        return {
          container: {
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.sm,
            borderRadius: BorderRadius.xl,
          },
          iconSize: 16,
          valueSize: FontSize.base,
        };
      case 'lg':
        return {
          container: {
            paddingHorizontal: Spacing.base,
            paddingVertical: Spacing.md,
            borderRadius: BorderRadius['2xl'],
          },
          iconSize: 20,
          valueSize: FontSize.lg,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const bgColor = getBackgroundColor();
  const valueColor = getValueColor();
  const icon = getIcon();

  return (
    <Animated.View
      style={[
        styles.container,
        sizeStyles.container,
        { backgroundColor: bgColor },
        style,
        animatedStyle,
      ]}
    >
      <Text style={[styles.icon, { fontSize: sizeStyles.iconSize }]}>{icon}</Text>
      <Text
        style={[
          styles.value,
          { fontSize: sizeStyles.valueSize, color: valueColor },
        ]}
      >
        {value}
      </Text>
      {label && (
        <Text style={[styles.label, { color: colors.textTertiary }]}>{label}</Text>
      )}
    </Animated.View>
  );
}

// Compact stat display for headers
interface CompactStatProps {
  icon: string;
  value: string | number;
  color?: string;
  bgColor?: string;
}

export function CompactStat({ icon, value, color, bgColor }: CompactStatProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View
      style={[
        styles.compactContainer,
        { backgroundColor: bgColor || colors.backgroundTertiary },
      ]}
    >
      <Text style={styles.compactIcon}>{icon}</Text>
      <Text
        style={[
          styles.compactValue,
          { color: color || colors.text },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

// Daily goal badge with star
interface DailyGoalBadgeProps {
  label?: string;
  value: string;
  filled?: boolean;
}

export function DailyGoalBadge({
  label = 'DAGLIGT MÅL',
  value,
  filled = true,
}: DailyGoalBadgeProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View
      style={[
        styles.dailyGoalContainer,
        { backgroundColor: filled ? colors.primary : colors.primaryLight },
      ]}
    >
      <Text
        style={[
          styles.dailyGoalStar,
          { color: filled ? colors.textOnPrimary : colors.star },
        ]}
      >
        ★
      </Text>
      <View style={styles.dailyGoalText}>
        <Text
          style={[
            styles.dailyGoalLabel,
            { color: filled ? colors.textOnPrimary : colors.textTertiary },
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            styles.dailyGoalValue,
            { color: filled ? colors.textOnPrimary : colors.text },
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.xs,
  },
  icon: {
    lineHeight: 20,
  },
  value: {
    fontFamily: FontFamily.bold,
  },
  label: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    marginLeft: Spacing.xxs,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  compactIcon: {
    fontSize: 14,
  },
  compactValue: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
  },
  dailyGoalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius['2xl'],
    gap: Spacing.sm,
  },
  dailyGoalStar: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
  },
  dailyGoalText: {
    gap: 2,
  },
  dailyGoalLabel: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.semibold,
    letterSpacing: 0.5,
  },
  dailyGoalValue: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
  },
});
