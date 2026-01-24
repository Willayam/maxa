// apps/mobile/app/quiz/index.tsx

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import {
  QuizHeader,
  OptionButton,
  ExitModal,
  FeedbackFooter,
  type OptionState,
} from '@/components/quiz';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import {
  getQuestionsForSection,
  type Question,
  type OptionLabel,
  type SectionCode,
  type AnswerRecord,
} from '@/constants/mock-questions';
import { QUESTIONS_PER_SESSION } from '@/constants/quiz-config';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { triggerImpact } from '@/utils/haptics';

type QuizPhase = 'answering' | 'feedback';

export default function QuizScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ section: SectionCode }>();
  const section = params.section || 'XYZ';

  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // State management
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<OptionLabel | null>(null);
  const [phase, setPhase] = useState<QuizPhase>('answering');
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const answersRef = useRef<AnswerRecord[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [sessionStartTime] = useState(Date.now());
  const [showExitModal, setShowExitModal] = useState(false);

  // Load questions on mount
  useEffect(() => {
    const loadedQuestions = getQuestionsForSection(section, QUESTIONS_PER_SESSION);
    setQuestions(loadedQuestions);
  }, [section]);

  // Current question
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  // Get option state for rendering
  const getOptionState = (label: OptionLabel): OptionState => {
    if (phase === 'answering') {
      return label === selectedOption ? 'selected' : 'default';
    }
    // Feedback phase
    if (label === currentQuestion?.correctAnswer) return 'correct';
    if (label === selectedOption) return 'incorrect';
    return 'default';
  };

  // Handle option selection
  const handleOptionSelect = (label: OptionLabel) => {
    if (phase === 'answering') {
      setSelectedOption(label);
    }
  };

  // Handle check answer
  const handleCheckAnswer = () => {
    if (!selectedOption || !currentQuestion) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);

    // Record the answer
    const newAnswer: AnswerRecord = {
      questionId: currentQuestion.id,
      selected: selectedOption,
      correct: isCorrect,
      timeSpent,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    answersRef.current = updatedAnswers;

    // Haptic feedback
    if (isCorrect) {
      triggerImpact(Haptics.ImpactFeedbackStyle.Medium);
    }
    // Note: Heavy haptic for incorrect is handled in OptionButton

    // Switch to feedback phase
    setPhase('feedback');
  };

  // Handle continue to next question
  const handleContinue = () => {
    if (isLastQuestion) {
      // Navigate to summary - use ref to ensure we have all answers including the last one
      const totalTime = Math.round((Date.now() - sessionStartTime) / 1000);
      router.replace({
        pathname: '/quiz/summary',
        params: {
          section,
          answers: JSON.stringify(answersRef.current),
          totalTime: String(totalTime),
        },
      });
    } else {
      // Move to next question
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setPhase('answering');
      setQuestionStartTime(Date.now());
    }
  };

  // Handle exit quiz
  const handleClosePress = () => {
    setShowExitModal(true);
  };

  const handleExitCancel = () => {
    setShowExitModal(false);
  };

  const handleExitConfirm = () => {
    setShowExitModal(false);
    router.back();
  };

  // Loading state
  if (questions.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text variant="body" color="secondary" style={styles.loadingText}>
            Laddar frågor...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      {/* Header */}
      <QuizHeader
        currentQuestion={currentIndex + 1}
        totalQuestions={questions.length}
        section={section}
        onClose={handleClosePress}
      />

      {/* Question content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Question content - keyed for animation on transition */}
        <Animated.View
          key={currentQuestion.id}
          entering={FadeInDown.duration(300)}
        >
          {/* Question text */}
          <View style={styles.questionContainer}>
            <Text variant="h3" style={{ color: colors.text }}>
              {currentIndex + 1}. {currentQuestion.text}
            </Text>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option) => (
              <OptionButton
                key={option.label}
                label={option.label}
                text={option.text}
                state={getOptionState(option.label)}
                onPress={() => handleOptionSelect(option.label)}
                disabled={phase === 'feedback'}
              />
            ))}
          </View>
        </Animated.View>

      </ScrollView>

      {/* Bottom section */}
      {phase === 'feedback' && selectedOption ? (
        <FeedbackFooter
          isCorrect={selectedOption === currentQuestion.correctAnswer}
          correctAnswer={currentQuestion.correctAnswer}
          explanation={currentQuestion.explanation}
          onContinue={handleContinue}
          isLastQuestion={isLastQuestion}
        />
      ) : (
        <View
          style={[
            styles.bottomBar,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
            },
          ]}
        >
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleCheckAnswer}
            disabled={!selectedOption}
          >
            Kontrollera
          </Button>
        </View>
      )}

      {/* Exit modal */}
      <ExitModal
        visible={showExitModal}
        onCancel={handleExitCancel}
        onConfirm={handleExitConfirm}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    marginTop: Spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  questionContainer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  optionsContainer: {
    gap: Spacing.md,
  },
  bottomBar: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    borderTopWidth: 1,
  },
});
