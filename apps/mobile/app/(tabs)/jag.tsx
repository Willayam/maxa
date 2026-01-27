import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
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
import {
  useGamificationStore,
  useProgressStore,
} from '@/stores';

// Snappy animation config
const PRESS_IN_CONFIG = { duration: 80, easing: Easing.out(Easing.ease) };
const PRESS_OUT_CONFIG = { duration: 120, easing: Easing.out(Easing.ease) };

// User profile data (needs real tracking later)
const USER_PROFILE = {
  name: 'Emma',
  currentScore: 1.2,
  goalScore: 1.8,
  dreamProgram: 'Läkarprogrammet',
  dreamCity: 'Stockholm',
  isPro: false,
  // Weakness data - sorted by weakness
  weakestSections: ['NOG', 'KVA'],
};

// Days of week for streak calendar
const WEEKDAYS = ['M', 'T', 'O', 'T', 'F', 'L', 'S'];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function JagScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  // Connect to stores for real data
  const {
    currentStreak,
    longestStreak,
    dailyProgress,
    level,
    xpForNextLevel,
    xpProgressInLevel,
  } = useGamificationStore();

  const { totalAnswered, accuracyPercent } = useProgressStore();

  // Calculate progress toward goal
  const progressToGoal = USER_PROFILE.goalScore > 0
    ? Math.min(100, Math.max(0, Math.round((USER_PROFILE.currentScore / USER_PROFILE.goalScore) * 100)))
    : 0;

  const pointsToGo = (USER_PROFILE.goalScore - USER_PROFILE.currentScore).toFixed(1);

  // Mock weekly streak data
  const today = new Date();
  const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const weeklyStreak = WEEKDAYS.map((_, i) => i < todayIndex ? true : i === todayIndex ? dailyProgress > 0 : false);

  const handleStartTraining = () => {
    triggerImpact(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(tabs)/trana');
  };

  const handleUpgradePress = () => {
    triggerImpact(Haptics.ImpactFeedbackStyle.Light);
    console.log('Open upgrade flow');
  };

  // Press animation for cards
  const upgradeScale = useSharedValue(1);
  const upgradeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: upgradeScale.value }],
  }));

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Stats Bar - matches Idag pattern */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(50)}
          style={styles.topStatsBar}
        >
          <View style={[styles.topStat, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="star" size={16} color={colors.primaryDark} />
            <Text style={[styles.topStatValue, { color: colors.primaryDark }]}>
              {level}
            </Text>
          </View>
          <View style={[styles.topStat, { backgroundColor: colors.warningLight }]}>
            <Ionicons name="flame" size={16} color={colors.streak} />
            <Text style={[styles.topStatValue, { color: colors.streak }]}>
              {currentStreak}
            </Text>
          </View>
          <View style={[styles.topStat, { backgroundColor: colors.successLight }]}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={[styles.topStatValue, { color: colors.success }]}>
              {accuracyPercent()}%
            </Text>
          </View>
        </Animated.View>

        {/* Header - Name */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(75)}
          style={styles.header}
        >
          <Text variant="hero" style={styles.heroTitle}>{USER_PROFILE.name}</Text>
          <Text variant="bodyLg" color="secondary">
            {xpProgressInLevel()}/{xpForNextLevel()} XP till nivå {level + 1}
          </Text>
        </Animated.View>

        {/* Hero Card: Score Progress */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <Card style={styles.heroCard}>
            {/* Score Display */}
            <View style={styles.scoreSection}>
              <View style={styles.scoreLeft}>
                <Text variant="caption" color="secondary" style={styles.scoreLabel}>
                  DITT RESULTAT
                </Text>
                <Text style={[styles.scoreBig, { color: colors.text }]}>
                  {USER_PROFILE.currentScore.toFixed(1)}
                </Text>
                <Text variant="bodySm" color="secondary">
                  av {USER_PROFILE.goalScore.toFixed(1)} för {USER_PROFILE.dreamProgram}
                </Text>
              </View>

              {/* Progress Badge */}
              <View style={[styles.progressBadge, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.progressPercent, { color: colors.primary }]}>
                  {progressToGoal}%
                </Text>
                <Text variant="caption" color="secondary">
                  av målet
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.goalProgress}>
              <View style={styles.goalProgressHeader}>
                <Text variant="bodySm" color="secondary">
                  Kvar till målet
                </Text>
                <Text style={[styles.goalProgressValue, { color: colors.streak }]}>
                  +{pointsToGo}
                </Text>
              </View>
              <ProgressBar progress={progressToGoal} size="lg" />
            </View>

            {/* CTA */}
            <Button
              fullWidth
              size="xl"
              onPress={handleStartTraining}
              leftIcon={<Ionicons name="play" size={20} color={colors.textOnPrimary} />}
            >
              FORTSÄTT TRÄNA
            </Button>
          </Card>
        </Animated.View>

        {/* Streak Card */}
        <Animated.View entering={FadeInDown.duration(400).delay(150)}>
          <Card style={styles.streakCard}>
            <View style={styles.streakHeader}>
              <View style={styles.streakLeft}>
                <View style={[styles.streakIconContainer, { backgroundColor: colors.warningLight }]}>
                  <Ionicons name="flame" size={24} color={colors.streak} />
                </View>
                <View>
                  <Text style={[styles.streakValue, { color: colors.streak }]}>
                    {currentStreak} dagar
                  </Text>
                  <Text variant="caption" color="tertiary">
                    Bästa: {longestStreak} dagar
                  </Text>
                </View>
              </View>
            </View>

            {/* Week Calendar */}
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
                        !isCompleted && isToday && {
                          backgroundColor: colors.primaryLight,
                          borderWidth: 2,
                          borderColor: colors.primary,
                        },
                        !isCompleted && !isToday && {
                          backgroundColor: colors.backgroundTertiary,
                        },
                      ]}
                    >
                      {isCompleted ? (
                        <Ionicons name="checkmark" size={16} color="#fff" />
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

        {/* Stats Row - horizontal layout like Idag */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(200)}
          style={styles.statsRow}
        >
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Text style={[styles.statBigNumber, { color: colors.text }]}>
                {totalAnswered}
              </Text>
              <Text style={[styles.statSubtext, { color: colors.textSecondary }]}>
                frågor
              </Text>
              <Text style={[styles.statEmphasis, { color: colors.text }]}>
                besvarade
              </Text>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Text style={[styles.statBigNumber, { color: colors.success }]}>
                {accuracyPercent()}%
              </Text>
              <Text style={[styles.statSubtext, { color: colors.textSecondary }]}>
                av alla
              </Text>
              <Text style={[styles.statEmphasis, { color: colors.text }]}>
                rätt
              </Text>
            </View>
          </Card>
        </Animated.View>

        {/* Focus Areas */}
        <Animated.View entering={FadeInDown.duration(400).delay(250)}>
          <View style={styles.focusSection}>
            <View style={styles.focusHeader}>
              <Text variant="h4">Fokusera på</Text>
              <Text variant="caption" color="tertiary">
                Dina svagaste områden
              </Text>
            </View>
            <View style={styles.focusPills}>
              {USER_PROFILE.weakestSections.map((section) => {
                const sectionColor = SectionColors[section as keyof typeof SectionColors];
                return (
                  <Pressable
                    key={section}
                    onPress={() => {
                      triggerImpact(Haptics.ImpactFeedbackStyle.Light);
                      router.push({
                        pathname: '/quiz',
                        params: { section },
                      });
                    }}
                    style={[
                      styles.focusTile,
                      {
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.cardBorder,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.focusCodeBadge,
                        {
                          backgroundColor: colorScheme === 'dark' ? sectionColor?.dark : sectionColor?.light,
                        },
                      ]}
                    >
                      <Text style={[styles.focusCode, { color: sectionColor?.text }]}>
                        {section}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Animated.View>

        {/* PRO Upgrade Banner (subtle) */}
        {!USER_PROFILE.isPro && (
          <Animated.View entering={FadeInDown.duration(400).delay(300)}>
            <AnimatedPressable
              style={upgradeAnimatedStyle}
              onPressIn={() => {
                upgradeScale.value = withTiming(0.98, PRESS_IN_CONFIG);
              }}
              onPressOut={() => {
                upgradeScale.value = withTiming(1, PRESS_OUT_CONFIG);
              }}
              onPress={handleUpgradePress}
            >
              <View
                style={[
                  styles.proBanner,
                  {
                    backgroundColor: colors.primaryLight,
                    borderColor: colors.primary,
                  },
                ]}
              >
                <View style={styles.proBannerContent}>
                  <View style={[styles.proIconContainer, { backgroundColor: colors.primary }]}>
                    <Ionicons name="star" size={18} color={colors.textOnPrimary} />
                  </View>
                  <View style={styles.proBannerText}>
                    <Text variant="h5" style={{ color: colors.text }}>
                      Lås upp obegränsad träning
                    </Text>
                    <Text variant="caption" color="secondary">
                      Mer Max, fler frågor, simulerade prov
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.primary} />
              </View>
            </AnimatedPressable>
          </Animated.View>
        )}

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
    paddingTop: Spacing.sm,
    paddingBottom: Spacing['4xl'] + 20,
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
  },
  topStatValue: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.black,
  },

  // Header
  header: {
    marginBottom: Spacing['2xl'],
  },
  heroTitle: {
    letterSpacing: -1.5,
    marginBottom: Spacing.xs,
  },

  // Hero Card
  heroCard: {
    marginBottom: Spacing.lg,
  },
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  scoreLeft: {
    flex: 1,
  },
  scoreLabel: {
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  scoreBig: {
    fontSize: 56,
    fontFamily: FontFamily.black,
    lineHeight: 60,
    letterSpacing: -2,
  },
  progressBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius['2xl'],
    marginLeft: Spacing.md,
  },
  progressPercent: {
    fontSize: FontSize.h2,
    fontFamily: FontFamily.bold,
    lineHeight: FontSize.h2 * 1.1,
  },
  goalProgress: {
    marginBottom: Spacing.lg,
  },
  goalProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  goalProgressValue: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
  },

  // Streak Card
  streakCard: {
    marginBottom: Spacing.lg,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  streakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  streakIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakValue: {
    fontSize: FontSize.h3,
    fontFamily: FontFamily.bold,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Stats Row - matches Idag pattern
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
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

  // Focus Section
  focusSection: {
    marginBottom: Spacing.lg,
  },
  focusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  focusPills: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  focusTile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.base,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 2,
  },
  focusCodeBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  focusCode: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
  },

  // PRO Banner
  proBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.base,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 2,
  },
  proBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  proIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proBannerText: {
    flex: 1,
  },

  // Bottom
  bottomPadding: {
    height: Spacing['3xl'],
  },
});
