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
 * Duolingo-style Progress Bar
 * - Gray track (#E0E6EB)
 * - Yellow fill (#FFC800)
 * - Fully rounded (rounded-full)
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
        return 8;
      case 'md':
        return 12;
      case 'lg':
        return 16; // h-4 in Duolingo
    }
  };

  // Use progressTrack and progressFill from theme
  const bgTrackColor = trackColor || colors.progressTrack;
  const fillColor = color || colors.progressFill;

  const animatedFillStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedProgress.value}%`,
    };
  });

  const height = getHeight();

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
      <Animated.View
        style={[
          styles.fill,
          {
            height,
            backgroundColor: fillColor,
          },
          animatedFillStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: BorderRadius.full, // rounded-full
    overflow: 'hidden',
  },
  fill: {
    borderRadius: BorderRadius.full, // rounded-full
  },
});
