import React, { useEffect } from 'react';
import { StyleSheet, Modal } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Colors, Spacing, BorderRadius, FontFamily, FontSize } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface StreakMilestoneProps {
  visible: boolean;
  days: number;
  onDismiss: () => void;
}

export function StreakMilestone({ visible, days, onDismiss }: StreakMilestoneProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const fireScale = useSharedValue(0);
  const badgeScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Staggered animation sequence
      // 1. Haptic first
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // 2. Backdrop fade in
      opacity.value = withTiming(1, { duration: 200 });

      // 3. Card scales in with spring
      scale.value = withDelay(
        100,
        withSpring(1, { damping: 12, stiffness: 200 })
      );

      // 4. Fire emoji bounces
      fireScale.value = withDelay(
        300,
        withSequence(
          withSpring(1.3, { damping: 8 }),
          withSpring(1, { damping: 12 })
        )
      );

      // 5. Badge scales in
      badgeScale.value = withDelay(
        500,
        withSpring(1, { damping: 15 })
      );
    } else {
      // Reset
      scale.value = 0;
      opacity.value = 0;
      fireScale.value = 0;
      badgeScale.value = 0;
    }
  }, [visible, scale, opacity, fireScale, badgeScale]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const fireStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fireScale.value }],
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  // Get milestone message
  const getMilestoneMessage = () => {
    if (days >= 30) return 'EN MANADS STREAK!';
    if (days >= 7) return 'EN VECKAS STREAK!';
    if (days >= 3) return 'TRE DAGAR I RAD!';
    return `${days} DAGAR!`;
  };

  const getSubtitle = () => {
    if (days >= 30) return 'Du har tranat varje dag i en hel manad. Otroligt!';
    if (days >= 7) return 'Sju dagar i rad - du bygger en stark vana!';
    if (days >= 3) return 'Bra start! Tre dagar i rad visar pa engagemang.';
    return 'Fortsatt sa har!';
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.backdrop, { backgroundColor: colors.overlay }, backdropStyle]}>
        <Animated.View style={[styles.card, { backgroundColor: colors.cardBackground }, cardStyle]}>
          {/* Fire emoji with bounce */}
          <Animated.View style={[styles.fireContainer, fireStyle]}>
            <Text style={styles.fireEmoji}>🔥</Text>
          </Animated.View>

          {/* Streak count badge */}
          <Animated.View style={[styles.streakBadge, { backgroundColor: colors.streak + '20' }, badgeStyle]}>
            <Text style={[styles.streakNumber, { color: colors.streak }]}>{days}</Text>
            <Text variant="caption" style={{ color: colors.streak }}>dagar</Text>
          </Animated.View>

          {/* Message */}
          <Text variant="h2" style={styles.title}>
            {getMilestoneMessage()}
          </Text>
          <Text variant="body" color="secondary" style={styles.subtitle}>
            {getSubtitle()}
          </Text>

          {/* Dismiss button */}
          <Button onPress={onDismiss} fullWidth size="lg">
            GRYM!
          </Button>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: BorderRadius['3xl'],
    padding: Spacing['2xl'],
    alignItems: 'center',
  },
  fireContainer: {
    marginBottom: Spacing.lg,
  },
  fireEmoji: {
    fontSize: 64,
  },
  streakBadge: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  streakNumber: {
    fontSize: FontSize.hero,
    fontFamily: FontFamily.extrabold,
    lineHeight: FontSize.hero * 1.1,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
});
