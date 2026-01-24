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
