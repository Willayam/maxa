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
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { triggerImpact } from '@/utils/haptics';

const AnimatedView = Animated.createAnimatedComponent(View);

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
 * - 3D pressed effect using wrapper shadow technique
 * - Shadow follows rounded corners properly
 * - Uppercase text with font-black (900) weight
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

  // Animated value for press effect
  const translateY = useSharedValue(0);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handlePressIn = (e: any) => {
    translateY.value = withTiming(ButtonDepth - 1, { duration: 50 });
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    translateY.value = withTiming(0, { duration: 100 });
    onPressOut?.(e);
  };

  const handlePress = (e: any) => {
    if (haptic && !disabled && !loading) {
      triggerImpact(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(e);
  };

  const isDisabled = disabled || loading;

  const getVariantStyles = (): {
    button: ViewStyle;
    shadow: ViewStyle;
    text: TextStyle;
  } => {
    switch (variant) {
      case 'primary':
        return {
          button: {
            backgroundColor: isDisabled
              ? Primitives.neutral[200]
              : colors.primary,
          },
          shadow: {
            backgroundColor: isDisabled
              ? Primitives.neutral[300]
              : colors.primaryDark,
          },
          text: {
            color: isDisabled
              ? colors.textTertiary
              : colors.textOnPrimary,
          },
        };
      case 'secondary':
        return {
          button: {
            backgroundColor: colors.cardBackground,
            borderWidth: 2,
            borderColor: colors.cardBorder,
          },
          shadow: {
            backgroundColor: colors.cardBorder,
          },
          text: {
            color: isDisabled ? colors.textTertiary : colors.text,
          },
        };
      case 'ghost':
        return {
          button: {
            backgroundColor: 'transparent',
          },
          shadow: {
            backgroundColor: 'transparent',
          },
          text: {
            color: isDisabled ? colors.textTertiary : colors.primary,
          },
        };
    }
  };

  const getSizeStyles = (): {
    button: ViewStyle;
    shadow: ViewStyle;
    text: TextStyle;
    borderRadius: number;
  } => {
    switch (size) {
      case 'sm':
        return {
          button: {
            height: 36,
            paddingHorizontal: Spacing.md,
          },
          shadow: {
            height: 36 + ButtonDepth,
            paddingHorizontal: Spacing.md,
          },
          text: {
            fontSize: FontSize.sm,
          },
          borderRadius: BorderRadius.lg,
        };
      case 'md':
        return {
          button: {
            height: 44,
            paddingHorizontal: Spacing.lg,
          },
          shadow: {
            height: 44 + ButtonDepth,
            paddingHorizontal: Spacing.lg,
          },
          text: {
            fontSize: FontSize.base,
          },
          borderRadius: BorderRadius.xl,
        };
      case 'lg':
        return {
          button: {
            height: 52,
            paddingHorizontal: Spacing.xl,
          },
          shadow: {
            height: 52 + ButtonDepth,
            paddingHorizontal: Spacing.xl,
          },
          text: {
            fontSize: FontSize.lg,
          },
          borderRadius: BorderRadius['2xl'],
        };
      case 'xl':
        return {
          button: {
            height: 56,
            paddingHorizontal: Spacing['2xl'],
          },
          shadow: {
            height: 56 + ButtonDepth,
            paddingHorizontal: Spacing['2xl'],
          },
          text: {
            fontSize: FontSize.xl,
          },
          borderRadius: BorderRadius['2xl'],
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  // Ghost variant doesn't use 3D effect
  if (variant === 'ghost') {
    return (
      <Pressable
        style={[
          styles.ghostButton,
          sizeStyles.button,
          { borderRadius: sizeStyles.borderRadius },
          fullWidth && styles.fullWidth,
          style,
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <ActivityIndicator size="small" color={variantStyles.text.color} />
        ) : (
          <View style={styles.content}>
            {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
            <Text style={[styles.text, sizeStyles.text, variantStyles.text]}>
              {children}
            </Text>
            {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
          </View>
        )}
      </Pressable>
    );
  }

  // 3D button with shadow wrapper
  return (
    <View
      style={[
        styles.wrapper,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {/* Shadow layer - sits behind and shows at bottom */}
      <View
        style={[
          styles.shadow,
          sizeStyles.shadow,
          variantStyles.shadow,
          { borderRadius: sizeStyles.borderRadius },
        ]}
      />

      {/* Button layer - animates up/down */}
      <AnimatedView
        style={[
          styles.button,
          sizeStyles.button,
          variantStyles.button,
          { borderRadius: sizeStyles.borderRadius },
          animatedButtonStyle,
        ]}
      >
        <Pressable
          style={styles.pressable}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          disabled={isDisabled}
          {...props}
        >
          {loading ? (
            <ActivityIndicator size="small" color={variantStyles.text.color} />
          ) : (
            <View style={styles.content}>
              {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
              <Text style={[styles.text, sizeStyles.text, variantStyles.text]}>
                {children}
              </Text>
              {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
            </View>
          )}
        </Pressable>
      </AnimatedView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  shadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  button: {
    position: 'relative',
    zIndex: 1,
  },
  pressable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontFamily: FontFamily.black,
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
