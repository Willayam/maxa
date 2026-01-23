// apps/mobile/app/quiz/summary.tsx

import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Colors, Spacing, BorderRadius, FontFamily, FontSize, SectionColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { SectionCode, AnswerRecord } from '@/constants/mock-questions';
import {
  TARGET_TIME_PER_QUESTION,
  DEFAULT_TARGET_TIME,
  SCORE_THRESHOLDS,
  PACE_THRESHOLDS,
  SUMMARY_TITLES,
  PACE_STATUS,
} from '@/constants/quiz-config';

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

/**
 * Get section display name
 */
const SECTION_NAMES: Record<SectionCode, string> = {
  ORD: 'Ordförståelse',
  LÄS: 'Läsförståelse',
  MEK: 'Meningskomplettering',
  ELF: 'Engelsk läsförståelse',
  XYZ: 'Matematisk problemlösning',
  KVA: 'Kvantitativa jämförelser',
  NOG: 'Kvantitativa resonemang',
  DTK: 'Diagram, tabeller, kartor',
};

export default function SummaryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    section: SectionCode;
    answers: string;
    totalTime: string;
  }>();

  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Parse params
  const section = params.section || 'XYZ';
  const answers: AnswerRecord[] = JSON.parse(params.answers || '[]');
  const totalTime = parseInt(params.totalTime || '0', 10);

  // Calculate stats
  const correctCount = answers.filter((a) => a.correct).length;
  const totalQuestions = answers.length || 1; // Prevent division by zero
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const avgTimePerQuestion = Math.round(totalTime / totalQuestions);
  const targetTime = TARGET_TIME_PER_QUESTION[section] || DEFAULT_TARGET_TIME;
  const pacePercentOver = ((avgTimePerQuestion - targetTime) / targetTime) * 100;

  // Determine title and pace status
  const summaryTitle = getSummaryTitle(percentage);
  const paceStatus = getPaceStatus(pacePercentOver);

  // Count incorrect answers
  const incorrectCount = totalQuestions - correctCount;

  // Section colors
  const sectionColor = SectionColors[section as keyof typeof SectionColors];

  // Handle navigation
  const handleDone = () => {
    router.dismissAll(); // Return to trana screen
  };

  const handleReviewErrors = () => {
    // TODO: Navigate to review errors screen
    console.log('Review errors');
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
          entering={FadeInDown.duration(500).delay(100)}
          style={styles.titleSection}
        >
          <Text style={styles.titleIcon}>{summaryTitle.icon}</Text>
          <Text variant="hero" align="center" style={{ color: colors.text }}>
            {summaryTitle.title}
          </Text>
        </Animated.View>

        {/* Score card */}
        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
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
        <Animated.View entering={FadeInDown.duration(500).delay(300)}>
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
                Snitt/fråga
              </Text>
              <View style={styles.timeInfo}>
                <Text variant="h4" style={{ color: colors.text }}>
                  {formatTime(avgTimePerQuestion)}
                </Text>
                <Text variant="caption" color="tertiary" style={styles.targetText}>
                  Mål: {formatTime(targetTime)}
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

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom buttons */}
      <Animated.View
        entering={FadeInDown.duration(500).delay(400)}
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
