// apps/mobile/app/quiz/review.tsx

import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SectionPill } from '@/components/ui/chip';
import { Colors, Spacing, BorderRadius, FontFamily, SectionColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { SectionCode, AnswerRecord, Question } from '@/constants/mock-questions';

export default function ReviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    section: SectionCode;
    incorrectAnswers: string;
    questions: string;
  }>();

  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Parse params
  const section = params.section || 'XYZ';
  let incorrectRecords: AnswerRecord[] = [];
  let allQuestions: Question[] = [];

  try {
    incorrectRecords = JSON.parse(params.incorrectAnswers || '[]');
    allQuestions = JSON.parse(params.questions || '[]');
  } catch {
    incorrectRecords = [];
    allQuestions = [];
  }

  // Match incorrect answers to their questions
  const reviewItems = incorrectRecords
    .map((record) => {
      const question = allQuestions.find(q => q.id === record.questionId);
      return { record, question };
    })
    .filter((item): item is { record: AnswerRecord; question: Question } =>
      item.question !== undefined
    );

  // Get section colors
  const sectionColor = SectionColors[section as keyof typeof SectionColors];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text variant="h3" style={styles.headerTitle}>
          Granska fel
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Encouragement message */}
      <Animated.View
        entering={FadeInDown.duration(400).delay(100)}
        style={styles.encouragementContainer}
      >
        <Text variant="body" color="secondary" align="center">
          Nu vet du vad du behöver fokusera på! 💪
        </Text>
      </Animated.View>

      {/* Review items */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {reviewItems.map((item, index) => (
          <Animated.View
            key={item.record.questionId}
            entering={FadeInDown.duration(400).delay((index + 1) * 100)}
          >
            <Card style={styles.reviewCard}>
              {/* Question header */}
              <View style={styles.questionHeader}>
                <Text variant="caption" color="secondary">
                  Fråga {index + 1} av {reviewItems.length}
                </Text>
                <SectionPill
                  section={item.question.section}
                  bgColor={colorScheme === 'dark' ? sectionColor?.dark : sectionColor?.light}
                  textColor={sectionColor?.text || colors.text}
                />
              </View>

              {/* Question text */}
              <Text variant="body" style={styles.questionText}>
                {item.question.text}
              </Text>

              {/* User's answer (wrong) */}
              <View style={[styles.answerRow, styles.wrongAnswer]}>
                <Ionicons name="close-circle" size={20} color={colors.error} />
                <View style={styles.answerContent}>
                  <Text
                    variant="caption"
                    color="secondary"
                    style={styles.answerLabel}
                  >
                    Ditt svar:
                  </Text>
                  <Text variant="body" style={[styles.answerText, { color: colors.text }]}>
                    {item.record.selected}{' '}
                    {item.question.options.find(o => o.label === item.record.selected)?.text}
                  </Text>
                </View>
              </View>

              {/* Correct answer */}
              <View style={[styles.answerRow, styles.correctAnswer]}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <View style={styles.answerContent}>
                  <Text
                    variant="caption"
                    color="secondary"
                    style={styles.answerLabel}
                  >
                    Rätt svar:
                  </Text>
                  <Text variant="body" style={[styles.answerText, { color: colors.text }]}>
                    {item.question.correctAnswer}{' '}
                    {item.question.options.find(o => o.label === item.question.correctAnswer)?.text}
                  </Text>
                </View>
              </View>

              {/* Explanation */}
              <View style={styles.explanationContainer}>
                <Text variant="caption" color="secondary" style={styles.explanationLabel}>
                  Förklaring:
                </Text>
                <Text variant="body" color="secondary">
                  {item.question.explanation}
                </Text>
              </View>
            </Card>
          </Animated.View>
        ))}

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom button */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ]}
      >
        <Button variant="primary" size="lg" fullWidth onPress={() => router.back()}>
          Tillbaka till resultat
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  encouragementContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  reviewCard: {
    marginBottom: Spacing.lg,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  questionText: {
    marginBottom: Spacing.lg,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  wrongAnswer: {
    backgroundColor: '#FFF5F5',
  },
  correctAnswer: {
    backgroundColor: '#ECFDF5',
  },
  answerContent: {
    flex: 1,
  },
  answerLabel: {
    marginBottom: Spacing.xxs,
  },
  answerText: {
    fontFamily: FontFamily.semibold,
  },
  explanationContainer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E0E6EB',
  },
  explanationLabel: {
    marginBottom: Spacing.xs,
  },
  bottomPadding: {
    height: Spacing['2xl'],
  },
  bottomBar: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    borderTopWidth: 1,
  },
});
