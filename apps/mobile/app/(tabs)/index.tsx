import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  FadeInDown,
  FadeInUp,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SectionPill } from '@/components/ui/chip';
import {
  Colors,
  Spacing,
  BorderRadius,
  FontFamily,
  FontSize,
  SectionColors,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { triggerImpact } from '@/utils/haptics';
import { useProgressStore, useGamificationStore, useCoachStore } from '@/stores';

// Mock data for elements not yet connected to stores
const USER_PROFILE = {
  name: 'Emma',
  examDate: new Date(2026, 3, 5),
  goalScore: 1.8,
  dreamProgram: 'Läkarprogrammet',
  dreamCity: 'Lund',
};

// Days of week for streak calendar
const WEEKDAYS = ['M', 'T', 'O', 'T', 'F', 'L', 'S'];

export default function IdagScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  // Real state from stores
  const totalXP = useProgressStore((state) => state.totalXP);
  const {
    currentStreak,
    dailyProgress,
    dailyGoal,
    isDailyGoalComplete,
    checkAndUpdateStreak,
  } = useGamificationStore();
  const { getMessage, currentPersonality } = useCoachStore();

  const coachMessage = getMessage({ type: 'tab_visit', tab: 'Idag' });

  useEffect(() => {
    checkAndUpdateStreak();
  }, [checkAndUpdateStreak]);

  // Calculate days until exam
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const daysUntilExam = Math.max(
    0,
    Math.ceil((USER_PROFILE.examDate.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24))
  );

  // CTA pulse animation (very subtle)
  const ctaScale = useSharedValue(1);
  const goalComplete = isDailyGoalComplete();

  useEffect(() => {
    if (!goalComplete) {
      ctaScale.value = withRepeat(
        withSequence(
          withTiming(1.015, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      ctaScale.value = withTiming(1, { duration: 200 });
    }
  }, [goalComplete, ctaScale]);

  const ctaAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ctaScale.value }],
  }));

  const handleCtaPress = () => {
    triggerImpact(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/quiz',
      params: { section: 'MIXED' },
    });
  };

  const safeGoal = Math.max(0, dailyGoal);
  const safeProgress = Math.max(0, dailyProgress);
  const progressPercent = safeGoal
    ? Math.min(100, Math.round((safeProgress / safeGoal) * 100))
    : 0;

  // Mock weekly streak data (would come from store)
  const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const weeklyStreak = WEEKDAYS.map((_, i) => i < todayIndex ? true : i === todayIndex ? dailyProgress > 0 : false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: Simple greeting */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(50)}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <Text variant="body" color="secondary">
              Hej, <Text style={[styles.nameInline, { color: colors.text }]}>{USER_PROFILE.name}</Text>
            </Text>
            <View style={[styles.xpBadge, { backgroundColor: colors.text }]}>
              <Text style={[styles.xpText, { color: colors.background }]}>
                {totalXP} XP
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Main Practice Card */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)}>
          <Card style={styles.mainCard}>
            {/* Daily Goal Progress */}
            <View style={styles.dailyGoalSection}>
              <View style={styles.dailyGoalHeader}>
                <Text style={[styles.goalLabel, { color: colors.text }]}>
                  Dagligt mål
                </Text>
                <Text style={[styles.goalFraction, { color: colors.text }]}>
                  <Text style={styles.goalCurrent}>{dailyProgress}</Text>
                  <Text style={[styles.goalDivider, { color: colors.textTertiary }]}>/</Text>
                  <Text style={[styles.goalTotal, { color: colors.textTertiary }]}>{dailyGoal}</Text>
                </Text>
              </View>
              <ProgressBar progress={progressPercent} size="lg" />
            </View>

            {/* Section Pills */}
            <View style={styles.sectionRow}>
              <Text variant="caption" color="tertiary" style={styles.mixLabel}>
                Dagens mix
              </Text>
              <View style={styles.pillsContainer}>
                {['ORD', 'LÄS', 'XYZ', 'NOG'].map((section) => {
                  const sectionColor = SectionColors[section as keyof typeof SectionColors];
                  return (
                    <SectionPill
                      key={section}
                      section={section}
                      bgColor={colorScheme === 'dark' ? sectionColor.dark : sectionColor.light}
                      textColor={sectionColor.text}
                    />
                  );
                })}
              </View>
            </View>

            {/* CTA Button */}
            <Animated.View style={ctaAnimatedStyle}>
              <Button
                fullWidth
                size="xl"
                onPress={handleCtaPress}
                leftIcon={
                  <Ionicons
                    name={goalComplete ? 'checkmark-circle' : 'play'}
                    size={22}
                    color={colors.textOnPrimary}
                  />
                }
              >
                {goalComplete ? 'MÅL KLART' : dailyProgress > 0 ? 'FORTSÄTT' : 'STARTA'}
              </Button>
            </Animated.View>
          </Card>
        </Animated.View>

        {/* Stats Row - Countdown & Goal */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(150)}
          style={styles.statsRow}
        >
          {/* Days Countdown */}
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Text style={[styles.statBigNumber, { color: colors.text }]}>
                {daysUntilExam}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                dagar till <Text style={styles.statLabelBold}>HP</Text>
              </Text>
            </View>
          </Card>

          {/* Goal Score */}
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Text style={[styles.statBigNumber, { color: colors.primary }]}>
                {USER_PROFILE.goalScore.toFixed(1)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                mål för <Text style={styles.statLabelBold}>{USER_PROFILE.dreamProgram}</Text>
              </Text>
            </View>
          </Card>
        </Animated.View>

        {/* Streak + Week Calendar Combined */}
        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
          <Card style={styles.streakCard}>
            {/* Streak Header */}
            <View style={styles.streakHeader}>
              <View style={styles.streakInfo}>
                <Text style={styles.streakFire}>🔥</Text>
                <Text style={[styles.streakCount, { color: colors.streak }]}>
                  {currentStreak}
                </Text>
                <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>
                  dagars streak
                </Text>
              </View>
            </View>

            {/* Week Days */}
            <View style={styles.weekDays}>
              {WEEKDAYS.map((day, i) => {
                const isCompleted = weeklyStreak[i];
                const isToday = i === todayIndex;
                return (
                  <View key={day + i} style={styles.dayColumn}>
                    <Text
                      style={[
                        styles.dayLabel,
                        { color: isToday ? colors.primary : colors.textTertiary },
                      ]}
                    >
                      {day}
                    </Text>
                    <View
                      style={[
                        styles.dayCircle,
                        isCompleted && { backgroundColor: colors.success },
                        !isCompleted && isToday && {
                          backgroundColor: colors.backgroundTertiary,
                          borderWidth: 2,
                          borderColor: colors.primary,
                        },
                        !isCompleted && !isToday && {
                          backgroundColor: colors.backgroundTertiary,
                        },
                      ]}
                    >
                      {isCompleted && (
                        <Ionicons name="checkmark" size={18} color="#fff" />
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </Card>
        </Animated.View>

        {/* Max Coach Section */}
        <Animated.View entering={FadeInUp.duration(500).delay(250)}>
          <Card
            onPress={() => {
              triggerImpact(Haptics.ImpactFeedbackStyle.Light);
              router.push('/(tabs)/jag');
            }}
            style={styles.coachCard}
          >
            <View style={styles.coachLayout}>
              {/* Mascot Avatar */}
              <View style={[styles.mascotContainer, { backgroundColor: colors.primary }]}>
                <Text style={styles.mascotEmoji}>🦉</Text>
              </View>

              {/* Message */}
              <View style={styles.coachTextContainer}>
                <View style={styles.coachNameRow}>
                  <Text style={[styles.coachName, { color: colors.text }]}>
                    Max
                  </Text>
                  <Text style={[styles.personalityLabel, { color: colors.textTertiary }]}>
                    {currentPersonality === 'hype' ? '· Hype' : currentPersonality === 'lugn' ? '· Lugn' : '· Strikt'}
                  </Text>
                </View>
                <Text
                  style={[styles.coachMessage, { color: colors.textSecondary }]}
                  numberOfLines={2}
                >
                  {coachMessage}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textTertiary}
              />
            </View>
          </Card>
        </Animated.View>

        {/* Bottom safe area padding */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing['4xl'] + 20,
  },

  // Header - Simplified
  header: {
    marginBottom: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameInline: {
    fontFamily: FontFamily.bold,
  },
  xpBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  xpText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
  },

  // Main Card
  mainCard: {
    marginBottom: Spacing.lg,
  },
  dailyGoalSection: {
    marginBottom: Spacing.lg,
  },
  dailyGoalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  goalLabel: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semibold,
  },
  goalFraction: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  goalCurrent: {
    fontSize: FontSize['2xl'],
    fontFamily: FontFamily.black,
  },
  goalDivider: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.medium,
    marginHorizontal: 2,
  },
  goalTotal: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semibold,
  },

  // Section Pills
  sectionRow: {
    marginBottom: Spacing.lg,
  },
  mixLabel: {
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pillsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    paddingVertical: Spacing.lg,
  },
  statContent: {
    alignItems: 'center',
  },
  statBigNumber: {
    fontSize: 44,
    fontFamily: FontFamily.black,
    lineHeight: 48,
    letterSpacing: -1,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
    lineHeight: FontSize.sm * 1.4,
  },
  statLabelBold: {
    fontFamily: FontFamily.bold,
  },

  // Streak Card (combined)
  streakCard: {
    marginBottom: Spacing.lg,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  streakFire: {
    fontSize: 24,
  },
  streakCount: {
    fontSize: FontSize['3xl'],
    fontFamily: FontFamily.black,
  },
  streakLabel: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayColumn: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dayLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Coach Card
  coachCard: {
    marginBottom: Spacing.md,
  },
  coachLayout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mascotContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  mascotEmoji: {
    fontSize: 24,
  },
  coachTextContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  coachNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 2,
  },
  coachName: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
  },
  personalityLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
  coachMessage: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontStyle: 'italic',
    lineHeight: FontSize.sm * 1.4,
  },

  // Bottom Spacer
  bottomSpacer: {
    height: Spacing['3xl'],
  },
});
