import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import {
  Colors,
  BorderRadius,
  Spacing,
  FontFamily,
  FontSize,
  ButtonDepth,
  Primitives,
} from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { triggerImpact } from '../../utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  haptic?: boolean;
  style?: ViewStyle;
}

/**
 * Duolingo-style Button component
 * - 3D pressed effect with border-bottom
 * - Uppercase text with font-black (900) weight
 * - Yellow background for primary
 */
export function Button({
  children,
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  haptic = true,
  style,
  onPressIn,
  onPressOut,
  onPress,
  ...props
}: ButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Animated values for 3D press effect
  const translateY = useSharedValue(0);
  const borderBottomWidth = useSharedValue(ButtonDepth);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    borderBottomWidth: borderBottomWidth.value,
  }));

  const handlePressIn = (e: any) => {
    // Press down - remove border, translate down
    translateY.value = withTiming(ButtonDepth, { duration: 50 });
    borderBottomWidth.value = withTiming(0, { duration: 50 });
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    // Release - restore border, translate back
    translateY.value = withTiming(0, { duration: 100 });
    borderBottomWidth.value = withTiming(ButtonDepth, { duration: 100 });
    onPressOut?.(e);
  };

  const handlePress = (e: any) => {
    if (haptic && !disabled && !loading) {
      triggerImpact(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(e);
  };

  const isDisabled = disabled || loading;

  const getVariantStyles = (): { container: ViewStyle; text: TextStyle; borderColor: string } => {
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: isDisabled
              ? Primitives.neutral[200]
              : colors.primary,
          },
          text: {
            color: isDisabled
              ? colors.textTertiary
              : colors.textOnPrimary,
          },
          borderColor: isDisabled
            ? Primitives.neutral[300]
            : colors.primaryDark, // #E5A400
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: colors.cardBackground,
            borderWidth: 2,
            borderTopWidth: 2,
            borderLeftWidth: 2,
            borderRightWidth: 2,
          },
          text: {
            color: isDisabled ? colors.textTertiary : colors.text,
          },
          borderColor: colors.cardBorder,
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
          },
          text: {
            color: isDisabled ? colors.textTertiary : colors.primary,
          },
          borderColor: 'transparent',
        };
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            height: 36,
            paddingHorizontal: Spacing.md,
            borderRadius: BorderRadius.lg,
          },
          text: {
            fontSize: FontSize.sm,
          },
        };
      case 'md':
        return {
          container: {
            height: 44,
            paddingHorizontal: Spacing.lg,
            borderRadius: BorderRadius.xl,
          },
          text: {
            fontSize: FontSize.base,
          },
        };
      case 'lg':
        return {
          container: {
            height: 52,
            paddingHorizontal: Spacing.xl,
            borderRadius: BorderRadius['2xl'],
          },
          text: {
            fontSize: FontSize.lg,
          },
        };
      case 'xl':
        return {
          container: {
            height: 56,
            paddingHorizontal: Spacing['2xl'],
            borderRadius: BorderRadius['2xl'],
          },
          text: {
            fontSize: FontSize.xl,
          },
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  // Don't apply 3D effect to ghost variant
  const use3DEffect = variant !== 'ghost' && !isDisabled;

  return (
    <AnimatedPressable
      style={[
        styles.base,
        variantStyles.container,
        sizeStyles.container,
        fullWidth && styles.fullWidth,
        use3DEffect && {
          borderBottomColor: variantStyles.borderColor,
        },
        style,
        use3DEffect && animatedContainerStyle,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantStyles.text.color}
        />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text style={[styles.text, sizeStyles.text, variantStyles.text]}>
            {children}
          </Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: ButtonDepth, // 6px 3D effect
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: FontFamily.black, // 900 - Nunito Black for bold CTA
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  rightIcon: {
    marginLeft: Spacing.sm,
  },
});
