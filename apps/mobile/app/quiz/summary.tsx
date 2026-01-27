// apps/mobile/app/quiz/summary.tsx

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Colors, Spacing, BorderRadius, FontFamily, FontSize, SectionColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { SectionCode, AnswerRecord } from '@/constants/mock-questions';
import { calculateSessionXP } from '@/constants/mock-questions';
import {
  TARGET_TIME_PER_QUESTION,
  DEFAULT_TARGET_TIME,
  SCORE_THRESHOLDS,
  PACE_THRESHOLDS,
  SUMMARY_TITLES,
  PACE_STATUS,
} from '@/constants/quiz-config';
import { useProgressStore } from '@/stores/progressStore';
import { useQuizStore } from '@/stores/quizStore';
import { useCoachStore, useGamificationStore } from '@/stores';
import { StreakMilestone } from '@/components/celebrations/StreakMilestone';

/**
 * Format seconds as M:SS
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get the summary title based on score percentage
 */
function getSummaryTitle(percentage: number): { title: string; icon: string } {
  if (percentage >= SCORE_THRESHOLDS.excellent) return SUMMARY_TITLES.excellent;
  if (percentage >= SCORE_THRESHOLDS.good) return SUMMARY_TITLES.good;
  if (percentage >= SCORE_THRESHOLDS.okay) return SUMMARY_TITLES.okay;
  return SUMMARY_TITLES.poor;
}

/**
 * Get the pace status based on percentage over target
 */
function getPaceStatus(pacePercentOver: number): { label: string; icon: string } {
  if (pacePercentOver <= PACE_THRESHOLDS.onPace) return PACE_STATUS.onPace;
  if (pacePercentOver <= PACE_THRESHOLDS.slightlySlow) return PACE_STATUS.slightlySlow;
  return PACE_STATUS.tooSlow;
}

export default function SummaryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    section: SectionCode;
    answers: string;
    totalTime: string;
  }>();

  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Get store actions
  const { addXP, completeSession, updateStreak } = useProgressStore();
  const { currentQuestions, resetSession } = useQuizStore();

  // Store questions in local state since we'll need them for review even after navigating
  const [sessionQuestions] = useState(currentQuestions);

  // Track if we've already updated progress (prevent double-updates)
  const [hasUpdatedProgress, setHasUpdatedProgress] = useState(false);

  // Coach and gamification stores
  const { getMessage } = useCoachStore();
  const { currentStreak } = useGamificationStore();

  // Streak celebration state
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);

  // Parse params
  const section = params.section || 'XYZ';
  let answers: AnswerRecord[] = [];
  try {
    answers = JSON.parse(params.answers || '[]');
  } catch {
    answers = [];
  }
  const totalTime = parseInt(params.totalTime, 10) || 0;

  // Calculate stats
  const correctCount = answers.filter((a) => a.correct).length;
  const totalQuestions = answers.length || 1; // Prevent division by zero
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const avgTimePerQuestion = Math.round(totalTime / totalQuestions);
  const targetTime = TARGET_TIME_PER_QUESTION[section] || DEFAULT_TARGET_TIME;
  const pacePercentOver = ((avgTimePerQuestion - targetTime) / targetTime) * 100;

  // Calculate XP earned
  const xpResult = calculateSessionXP(answers);
  const xpEarned = xpResult.xp;

  // Determine title and pace status
  const summaryTitle = getSummaryTitle(percentage);
  const paceStatus = getPaceStatus(pacePercentOver);

  // Count incorrect answers
  const incorrectCount = totalQuestions - correctCount;

  // Section colors
  const sectionColor = SectionColors[section as keyof typeof SectionColors];

  // Get coach message based on quiz results
  const coachMessage = getMessage({
    type: 'quiz_complete',
    correct: correctCount,
    total: totalQuestions,
  });

  // Update progress store once on mount
  useEffect(() => {
    if (!hasUpdatedProgress && answers.length > 0) {
      addXP(xpEarned);
      completeSession(correctCount, totalQuestions);
      updateStreak();
      setHasUpdatedProgress(true);
    }
  }, [hasUpdatedProgress, answers.length, xpEarned, correctCount, totalQuestions, addXP, completeSession, updateStreak]);

  // Celebration haptic on mount
  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  // Check for streak milestone after progress update
  useEffect(() => {
    const streakMilestones = [3, 7, 14, 30, 60, 100];
    if (hasUpdatedProgress && streakMilestones.includes(currentStreak)) {
      // Small delay to let the UI render first
      const timer = setTimeout(() => {
        setShowStreakCelebration(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [hasUpdatedProgress, currentStreak]);

  // Handle navigation
  const handleDone = () => {
    resetSession(); // Clear quizStore
    router.dismissAll(); // Return to trana screen
  };

  const handleReviewErrors = () => {
    const incorrectAnswers = answers.filter(a => !a.correct);
    router.push({
      pathname: '/quiz/review',
      params: {
        section,
        incorrectAnswers: JSON.stringify(incorrectAnswers),
        questions: JSON.stringify(sessionQuestions),
      },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title section with emoji */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.titleSection}
        >
          <Text style={styles.titleIcon}>{summaryTitle.icon}</Text>
          <Text variant="hero" align="center" style={{ color: colors.text }}>
            {summaryTitle.title}
          </Text>
        </Animated.View>

        {/* XP Card - Duolingo-style celebration */}
        <Animated.View entering={FadeInDown.duration(400).delay(150)}>
          <Card style={[styles.xpCard, { backgroundColor: colors.primaryLight }]}>
            <View style={styles.xpContent}>
              <Text style={styles.xpIcon}>⚡</Text>
              <View style={styles.xpTextContainer}>
                <Text style={[styles.xpAmount, { color: colors.primary }]}>
                  +{xpEarned}
                </Text>
                <Text variant="body" color="secondary">XP tjänat</Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Score card */}
        <Animated.View entering={FadeInDown.duration(400).delay(300)}>
          <Card style={styles.scoreCard}>
            <View style={styles.scoreContent}>
              <View style={styles.scoreMain}>
                <Text style={[styles.scoreNumber, { color: colors.text }]}>
                  {correctCount}
                </Text>
                <Text style={[styles.scoreDivider, { color: colors.textTertiary }]}>
                  {' / '}
                </Text>
                <Text style={[styles.scoreTotal, { color: colors.textSecondary }]}>
                  {totalQuestions}
                </Text>
                <Text
                  variant="h4"
                  color="secondary"
                  style={styles.scoreLabel}
                >
                  {' rätt'}
                </Text>
              </View>

              {/* Percentage badge */}
              <View
                style={[
                  styles.percentageBadge,
                  {
                    backgroundColor:
                      percentage >= SCORE_THRESHOLDS.good
                        ? colors.success + '20'
                        : percentage >= SCORE_THRESHOLDS.okay
                        ? colors.warning + '20'
                        : colors.error + '20',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.percentageText,
                    {
                      color:
                        percentage >= SCORE_THRESHOLDS.good
                          ? colors.success
                          : percentage >= SCORE_THRESHOLDS.okay
                          ? colors.warning
                          : colors.error,
                    },
                  ]}
                >
                  {percentage}%
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Stats card */}
        <Animated.View entering={FadeInDown.duration(400).delay(450)}>
          <Card style={styles.statsCard}>
            {/* Total time */}
            <View style={styles.statRow}>
              <Text variant="body" color="secondary">
                Total tid
              </Text>
              <Text variant="h4" style={{ color: colors.text }}>
                {formatTime(totalTime)}
              </Text>
            </View>

            <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />

            {/* Section */}
            <View style={styles.statRow}>
              <Text variant="body" color="secondary">
                Sektion
              </Text>
              <View style={styles.sectionBadge}>
                <View
                  style={[
                    styles.sectionCodeBadge,
                    {
                      backgroundColor:
                        colorScheme === 'dark' ? sectionColor?.dark : sectionColor?.light,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.sectionCode,
                      { color: sectionColor?.text || colors.text },
                    ]}
                  >
                    {section}
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />

            {/* Average time per question */}
            <View style={styles.statRow}>
              <Text variant="body" color="secondary">
                Snitt/fraga
              </Text>
              <View style={styles.timeInfo}>
                <Text variant="h4" style={{ color: colors.text }}>
                  {formatTime(avgTimePerQuestion)}
                </Text>
                <Text variant="caption" color="tertiary" style={styles.targetText}>
                  Mal: {formatTime(targetTime)}
                </Text>
              </View>
            </View>

            <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />

            {/* Pace status */}
            <View style={styles.statRow}>
              <Text variant="body" color="secondary">
                Tempo
              </Text>
              <View style={styles.paceContainer}>
                <Text style={styles.paceIcon}>{paceStatus.icon}</Text>
                <Text
                  variant="body"
                  weight="semibold"
                  style={{
                    color:
                      pacePercentOver <= PACE_THRESHOLDS.onPace
                        ? colors.success
                        : pacePercentOver <= PACE_THRESHOLDS.slightlySlow
                        ? colors.warning
                        : colors.error,
                  }}
                >
                  {paceStatus.label}
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Max Coach Feedback */}
        <Animated.View entering={FadeInDown.duration(400).delay(600)}>
          <Card style={styles.coachCard}>
            <View style={styles.coachContent}>
              <View style={[styles.coachAvatar, { backgroundColor: colors.backgroundTertiary }]}>
                <Text style={styles.coachEmoji}>🤖</Text>
              </View>
              <View style={styles.coachTextContent}>
                <View style={styles.coachNameRow}>
                  <Text variant="h5">Max</Text>
                  <View style={[styles.aiBadge, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.aiBadgeText, { color: colors.textOnPrimary }]}>AI</Text>
                  </View>
                </View>
                <Text variant="bodySm" color="secondary">
                  {coachMessage}
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom buttons */}
      <Animated.View
        entering={FadeInDown.duration(400).delay(600)}
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ]}
      >
        {incorrectCount > 0 && (
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onPress={handleReviewErrors}
            style={styles.reviewButton}
          >
            Granska fel ({incorrectCount})
          </Button>
        )}
        <Button variant="primary" size="lg" fullWidth onPress={handleDone}>
          Klar
        </Button>
      </Animated.View>

      {/* Streak Milestone Celebration */}
      <StreakMilestone
        visible={showStreakCelebration}
        days={currentStreak}
        onDismiss={() => setShowStreakCelebration(false)}
      />
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
    paddingTop: Spacing['3xl'],
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  titleIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  xpCard: {
    marginBottom: Spacing.lg,
  },
  xpContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  xpIcon: {
    fontSize: 40,
    marginRight: Spacing.md,
  },
  xpTextContainer: {
    flex: 1,
  },
  xpAmount: {
    fontSize: FontSize['3xl'],
    fontFamily: FontFamily.bold,
  },
  scoreCard: {
    marginBottom: Spacing.lg,
  },
  scoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreMain: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreNumber: {
    fontSize: FontSize['4xl'],
    fontFamily: FontFamily.bold,
    lineHeight: FontSize['4xl'] * 1.2,
  },
  scoreDivider: {
    fontSize: FontSize.h2,
    fontFamily: FontFamily.bold,
  },
  scoreTotal: {
    fontSize: FontSize.h2,
    fontFamily: FontFamily.bold,
  },
  scoreLabel: {
    marginLeft: Spacing.xs,
  },
  percentageBadge: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
  },
  percentageText: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
  },
  statsCard: {
    marginBottom: Spacing.lg,
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
  coachTextContent: {
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
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  statDivider: {
    height: 1,
  },
  sectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionCodeBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  sectionCode: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
  },
  timeInfo: {
    alignItems: 'flex-end',
  },
  targetText: {
    marginTop: Spacing.xxs,
  },
  paceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  paceIcon: {
    fontSize: 16,
  },
  bottomPadding: {
    height: Spacing['4xl'],
  },
  bottomBar: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    borderTopWidth: 1,
    gap: Spacing.md,
  },
  reviewButton: {
    marginBottom: 0,
  },
});
