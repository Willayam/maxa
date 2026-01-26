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
  examDate: new Date(2026, 3, 5),
  goalScore: 1.8,
  dreamProgram: 'Läkarprogrammet',
};

// Days of week for streak calendar
const WEEKDAYS = ['M', 'T', 'O', 'T', 'F', 'L', 'S'];

// Helper to get time-appropriate greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'God morgon';
  if (hour < 17) return 'God eftermiddag';
  return 'God kväll';
};

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

  // Mock weekly streak data
  const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const weeklyStreak = WEEKDAYS.map((_, i) => i < todayIndex ? true : i === todayIndex ? dailyProgress > 0 : false);

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting Header */}
        <Animated.View entering={FadeInDown.duration(300)} style={styles.greetingSection}>
          <Text style={[styles.greetingLabel, { color: colors.textSecondary }]}>
            {getGreeting()}
          </Text>
          <Text style={[styles.greetingName, { color: colors.text }]}>
            Redo att plugga?
          </Text>
        </Animated.View>

        {/* Top Stats Bar - Duolingo Style */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(50)}
          style={styles.topStatsBar}
        >
          {/* XP Stat */}
          <View style={[styles.topStat, { backgroundColor: colors.primaryLight, borderColor: colors.primaryDark }]}>
            <Text style={styles.topStatIcon}>⭐</Text>
            <Text style={[styles.topStatValue, { color: colors.primaryDark }]}>
              {totalXP}
            </Text>
          </View>

          {/* Streak Stat */}
          <View style={[styles.topStat, { backgroundColor: colors.warningLight, borderColor: colors.streak + '40' }]}>
            <Text style={styles.topStatIcon}>🔥</Text>
            <Text style={[styles.topStatValue, { color: colors.streak }]}>
              {currentStreak}
            </Text>
          </View>

          {/* Goal Stat */}
          <View style={[styles.topStat, { backgroundColor: colors.successLight, borderColor: colors.success + '40' }]}>
            <Text style={styles.topStatIcon}>🎯</Text>
            <Text style={[styles.topStatValue, { color: colors.success }]}>
              {USER_PROFILE.goalScore.toFixed(1)}
            </Text>
          </View>
        </Animated.View>

        {/* Main Practice Card */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <Card style={styles.mainCard}>
            {/* Accent bar at top */}
            <View style={[styles.cardAccent, { backgroundColor: colors.primary }]} />

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

        {/* Stats Row - Countdown & Program */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(150)}
          style={styles.statsRow}
        >
          {/* Days Countdown */}
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Text style={[styles.statBigNumber, { color: colors.text }]}>
                {daysUntilExam}
              </Text>
              <Text style={[styles.statSubtext, { color: colors.textSecondary }]}>
                dagar till
              </Text>
              <Text style={[styles.statEmphasis, { color: colors.text }]}>
                Högskoleprovet
              </Text>
            </View>
          </Card>

          {/* Goal / Program */}
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Text style={[styles.statBigNumber, styles.statBigNumberAccent, { color: colors.primary }]}>
                {USER_PROFILE.goalScore.toFixed(1)}
              </Text>
              <Text style={[styles.statSubtext, { color: colors.textSecondary }]}>
                mål för
              </Text>
              <Text style={[styles.statEmphasis, { color: colors.text }]} numberOfLines={1}>
                {USER_PROFILE.dreamProgram}
              </Text>
            </View>
          </Card>
        </Animated.View>

        {/* Week Calendar */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)}>
          <Card style={styles.weekCard}>
            <Text style={[styles.weekLabel, { color: colors.textTertiary }]}>
              DENNA VECKA
            </Text>
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
                        isToday && styles.dayLabelToday,
                      ]}
                    >
                      {day}
                    </Text>
                    <View
                      style={[
                        styles.dayCircle,
                        isCompleted && { backgroundColor: colors.success },
                        !isCompleted && isToday && [
                          styles.dayCircleToday,
                          {
                            backgroundColor: colors.primaryLight,
                            borderColor: colors.primary,
                          },
                        ],
                        !isCompleted && !isToday && {
                          backgroundColor: colors.backgroundTertiary,
                        },
                      ]}
                    >
                      {isCompleted ? (
                        <Ionicons name="checkmark" size={18} color="#fff" />
                      ) : isToday ? (
                        <View style={[styles.todayDot, { backgroundColor: colors.primary }]} />
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>
          </Card>
        </Animated.View>

        {/* Max Coach Section */}
        <Animated.View entering={FadeInUp.duration(400).delay(250)}>
          <Card
            onPress={() => {
              triggerImpact(Haptics.ImpactFeedbackStyle.Light);
              router.push('/(tabs)/jag');
            }}
            style={styles.coachCard}
          >
            <View style={styles.coachLayout}>
              {/* Mascot Avatar */}
              <View style={[styles.mascotContainer, { backgroundColor: colors.primary, borderColor: colors.primaryDark }]}>
                <Text style={styles.mascotEmoji}>🦉</Text>
              </View>

              {/* Message */}
              <View style={styles.coachTextContainer}>
                <View style={styles.coachNameRow}>
                  <Text style={[styles.coachName, { color: colors.text }]}>
                    Max
                  </Text>
                  <Text style={[styles.personalityLabel, { color: colors.textTertiary }]}>
                    · {currentPersonality === 'hype' ? 'Hype' : currentPersonality === 'lugn' ? 'Lugn' : 'Strikt'}
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
    paddingTop: Spacing.sm,
    paddingBottom: Spacing['4xl'] + 20,
  },

  // Greeting Section
  greetingSection: {
    marginBottom: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  greetingLabel: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
  },
  greetingName: {
    fontSize: FontSize['3xl'],
    fontFamily: FontFamily.black,
    letterSpacing: -0.5,
  },

  // Top Stats Bar
  topStatsBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  topStat: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
    borderWidth: 1,
  },
  topStatIcon: {
    fontSize: 18,
  },
  topStatValue: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.black,
  },

  // Main Card
  mainCard: {
    marginBottom: Spacing.lg,
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
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
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  goalFraction: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  goalCurrent: {
    fontSize: FontSize['4xl'],
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
    fontSize: 40,
    fontFamily: FontFamily.black,
    lineHeight: 44,
    letterSpacing: 0,
  },
  statBigNumberAccent: {
    letterSpacing: -0.5,
  },
  statSubtext: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    lineHeight: FontSize.sm * 1.2,
  },
  statEmphasis: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    textAlign: 'center',
    lineHeight: FontSize.sm * 1.2,
  },

  // Week Card
  weekCard: {
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  weekLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: Spacing.md,
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
    fontFamily: FontFamily.semibold,
  },
  dayLabelToday: {
    fontFamily: FontFamily.black,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleToday: {
    borderWidth: 3,
  },
  todayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    borderWidth: 2,
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
    fontSize: FontSize.lg,
    fontFamily: FontFamily.black,
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
