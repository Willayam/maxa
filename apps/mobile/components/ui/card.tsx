import React from "react";
import {
  View,
  ViewProps,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Pressable,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { Colors, BorderRadius, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { triggerImpact } from "@/utils/haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type CardVariant = "default" | "ghost";
type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Duolingo-style Card component
 * - White background with 2px gray border
 * - rounded-2xl (20px) border radius
 * - No shadows
 */
export function Card({
  children,
  variant = "default",
  padding = "md",
  onPress,
  disabled = false,
  style,
  ...props
}: CardProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress && !disabled) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    if (onPress && !disabled) {
      triggerImpact(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case "default":
        return {
          backgroundColor: colors.cardBackground,
          borderWidth: 2,
          borderColor: colors.cardBorder,
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
        };
    }
  };

  const getPaddingValue = (): number => {
    switch (padding) {
      case "none":
        return 0;
      case "sm":
        return Spacing.md; // 12
      case "md":
        return Spacing.lg; // 20
      case "lg":
        return Spacing.xl; // 24
    }
  };

  const variantStyles = getVariantStyles();
  const paddingValue = getPaddingValue();

  if (onPress) {
    return (
      <AnimatedPressable
        style={[
          styles.base,
          variantStyles,
          { padding: paddingValue },
          disabled && styles.disabled,
          style,
          animatedStyle,
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        {...props}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return (
    <View
      style={[
        styles.base,
        variantStyles,
        { padding: paddingValue },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius["2xl"], // 20px - Duolingo rounded-2xl
    overflow: "hidden",
  },
  disabled: {
    opacity: 0.6,
  },
});
