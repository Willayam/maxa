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
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

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
import { useProgressStore, useGamificationStore } from '@/stores';

// Mock data for elements not yet connected to stores
// These will come from onboarding (Phase 4) and real tracking
const USER_PROFILE = {
  name: 'Emma', // Will come from auth
  examDate: new Date(2026, 3, 5),
  goalScore: 1.8,
  dreamProgram: 'Läkarprogrammet',
  dreamCity: 'Lund',
};

// Mock data for weekly stats (needs real tracking)
const WEEKLY_STATS = {
  weeklyCorrect: 42,
  weakestSection: 'NOG',
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

  // Check streak on component mount
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

  // Animated fire icon for streak
  const fireScale = useSharedValue(1);

  useEffect(() => {
    fireScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1,
      true
    );
  }, [fireScale]);

  const fireAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fireScale.value }],
  }));

  // Animated pulsing CTA when goal not complete
  const ctaScale = useSharedValue(1);
  const goalComplete = isDailyGoalComplete();

  useEffect(() => {
    if (!goalComplete) {
      ctaScale.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      );
    } else {
      ctaScale.value = withTiming(1, { duration: 200 });
    }
  }, [goalComplete, ctaScale]);

  const ctaAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ctaScale.value }],
  }));

  // Dynamic CTA text based on progress
  const getCtaText = () => {
    if (goalComplete) {
      return 'MAL UPPNATT - TRANA MER?';
    }
    if (dailyProgress === 0) {
      return 'STARTA DAGENS PASS';
    }
    return `FORTSATT (${dailyProgress}/${dailyGoal})`;
  };

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

  const questionsRemaining = Math.max(0, safeGoal - safeProgress);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Compact Header with Greeting + Streak */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(100)}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <View style={styles.greeting}>
              <Text variant="body" color="secondary">
                Välkommen tillbaka,
              </Text>
              <Text variant="hero" style={styles.nameText}>
                {USER_PROFILE.name}
              </Text>
              <Text variant="caption" color="tertiary">
                {totalXP} XP
              </Text>
            </View>

            {/* Streak badge */}
            <Animated.View style={[styles.streakBadge, fireAnimatedStyle]}>
              <View style={[styles.streakInner, { backgroundColor: colorScheme === 'dark' ? '#3D2800' : '#FFF3E0' }]}>
                <Text style={styles.streakIcon}>🔥</Text>
                <Text style={[styles.streakNumber, { color: colors.streak }]}>
                  {currentStreak}
                </Text>
              </View>
            </Animated.View>
          </View>

          {/* Inline daily goal progress */}
          <View style={styles.dailyGoalInline}>
            <View style={styles.dailyGoalHeader}>
              <View style={[styles.dailyGoalBadge, { backgroundColor: colors.primary }]}>
                <Text style={[styles.dailyGoalBadgeStar, { color: colors.textOnPrimary }]}>★</Text>
                <Text style={[styles.dailyGoalBadgeText, { color: colors.textOnPrimary }]}>
                  DAGLIGT MÅL
                </Text>
              </View>
              <Text style={[styles.dailyGoalProgress, { color: colors.text }]}>
                <Text style={styles.dailyGoalCurrent}>{dailyProgress}</Text>
                <Text style={[styles.dailyGoalTotal, { color: colors.textTertiary }]}> / {dailyGoal}</Text>
              </Text>
            </View>
            <ProgressBar progress={progressPercent} size="md" />
          </View>
        </Animated.View>

        {/* Practice Card */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)}>
          <Card style={styles.practiceCard}>
            {/* Section pills */}
            <View style={styles.sectionPills}>
              <Text variant="label" color="tertiary" style={styles.sectionLabel}>
                Dagens mix:
              </Text>
              <View style={styles.pillsRow}>
                {['ORD', 'LÄS', 'XYZ', 'NOG'].map((section) => {
                  const sectionColor = SectionColors[section as keyof typeof SectionColors];
                  return (
                    <SectionPill
                      key={section}
                      section={section}
                      bgColor={
                        colorScheme === 'dark'
                          ? sectionColor.dark
                          : sectionColor.light
                      }
                      textColor={sectionColor.text}
                    />
                  );
                })}
              </View>
            </View>

            <Text variant="bodySm" color="secondary" style={styles.remainingText}>
              {questionsRemaining} frågor kvar för att nå dagens mål
            </Text>

            {/* CTA Button with pulse animation */}
            <Animated.View style={ctaAnimatedStyle}>
              <Button
                fullWidth
                size="xl"
                onPress={handleCtaPress}
              >
                {goalComplete ? '✓ ' : '▶ '}{getCtaText()}
              </Button>
            </Animated.View>
          </Card>
        </Animated.View>

        {/* Stats Row - Countdown & Goal */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(300)}
          style={styles.statsRow}
        >
          {/* Days countdown */}
          <Card style={styles.statCard}>
            <View style={styles.statInner}>
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {daysUntilExam}
              </Text>
              <Text variant="label" color="secondary">
                DAGAR KVAR
              </Text>
              <Text variant="caption" color="tertiary">
                till HP
              </Text>
            </View>
          </Card>

          {/* Goal score */}
          <Card style={styles.statCard}>
            <View style={styles.statInner}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {USER_PROFILE.goalScore.toFixed(1)}
              </Text>
              <Text variant="label" color="secondary">
                DITT MAL
              </Text>
              <Text variant="caption" color="tertiary" numberOfLines={1}>
                {USER_PROFILE.dreamProgram}
              </Text>
            </View>
          </Card>
        </Animated.View>

        {/* Weekly Progress */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(400)}
          style={styles.weeklySection}
        >
          <View style={styles.sectionHeader}>
            <Text variant="h4">Veckans framsteg</Text>
          </View>

          <View style={styles.weeklyStatsRow}>
            <Card style={[styles.weeklyStatCard, { backgroundColor: colors.successLight }]}>
              <Text style={styles.weeklyStatIcon}>✓</Text>
              <Text style={[styles.weeklyStatValue, { color: colors.success }]}>
                +{WEEKLY_STATS.weeklyCorrect}
              </Text>
              <Text variant="caption" color="secondary">
                Ratt denna vecka
              </Text>
            </Card>

            <Card style={[styles.weeklyStatCard, { backgroundColor: colors.errorLight }]}>
              <Text style={styles.weeklyStatIcon}>📉</Text>
              <Text style={[styles.weeklyStatValue, { color: colors.error }]}>
                {WEEKLY_STATS.weakestSection}
              </Text>
              <Text variant="caption" color="secondary">
                Behover traning
              </Text>
            </Card>
          </View>
        </Animated.View>

        {/* AI Coach Teaser */}
        <Animated.View entering={FadeInUp.duration(600).delay(500)}>
          <Card
            onPress={() => {
              triggerImpact(Haptics.ImpactFeedbackStyle.Light);
              console.log('Open Max');
            }}
            style={styles.coachCard}
          >
            <View style={styles.coachContent}>
              <View style={[styles.coachAvatar, { backgroundColor: colors.backgroundTertiary }]}>
                <Text style={styles.coachEmoji}>🤖</Text>
              </View>
              <View style={styles.coachText}>
                <View style={styles.coachNameRow}>
                  <Text variant="h5">Max</Text>
                  <View style={[styles.aiBadge, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.aiBadgeText, { color: colors.textOnPrimary }]}>
                      AI
                    </Text>
                  </View>
                </View>
                <Text variant="bodySm" color="secondary">
                  Bra jobbat igår! Du är på väg mot 2 veckors streak 🔥
                </Text>
              </View>
              <Text style={[styles.coachArrow, { color: colors.textTertiary }]}>→</Text>
            </View>
          </Card>
        </Animated.View>

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
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
  },
  header: {
    marginBottom: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  greeting: {
    flex: 1,
  },
  nameText: {
    letterSpacing: -1.5,
    marginTop: Spacing.xxs,
  },
  streakBadge: {
    marginLeft: Spacing.md,
  },
  streakInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  streakIcon: {
    fontSize: 16,
  },
  streakNumber: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
  },
  dailyGoalInline: {
    gap: Spacing.sm,
  },
  dailyGoalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dailyGoalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: Spacing.xxs,
  },
  dailyGoalBadgeStar: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
  },
  dailyGoalBadgeText: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.black,
    letterSpacing: 0.5,
  },
  dailyGoalProgress: {
    fontSize: FontSize.base,
  },
  dailyGoalCurrent: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.extrabold,
  },
  dailyGoalTotal: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semibold,
  },
  practiceCard: {
    marginBottom: Spacing.lg,
  },
  sectionPills: {
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    marginBottom: Spacing.sm,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  remainingText: {
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
  },
  statInner: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 42,
    fontFamily: FontFamily.extrabold,
    lineHeight: 48,
    letterSpacing: -2,
  },
  weeklySection: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    marginBottom: Spacing.md,
  },
  weeklyStatsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  weeklyStatCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  weeklyStatIcon: {
    fontSize: 20,
    marginBottom: Spacing.sm,
    lineHeight: 28,
  },
  weeklyStatValue: {
    fontSize: FontSize.h2,
    fontFamily: FontFamily.bold,
    lineHeight: FontSize.h2 * 1.2,
    marginBottom: Spacing.xs,
  },
  coachCard: {
    marginBottom: Spacing.lg,
  },
  coachContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coachAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  coachEmoji: {
    fontSize: 24,
  },
  coachText: {
    flex: 1,
  },
  coachNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xxs,
  },
  aiBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  aiBadgeText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
  },
  coachArrow: {
    fontSize: 20,
    marginLeft: Spacing.sm,
  },
  bottomPadding: {
    height: Spacing['4xl'],
  },
});
