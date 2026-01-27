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
  type OptionLabel,
  type SectionCode,
  type AnswerRecord,
} from '@/constants/mock-questions';
import { QUESTIONS_PER_SESSION } from '@/constants/quiz-config';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { triggerImpact } from '@/utils/haptics';
import { useQuizStore } from '@/stores/quizStore';

type QuizPhase = 'answering' | 'feedback';

export default function QuizScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ section: SectionCode }>();
  const section = params.section || 'XYZ';

  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Zustand store for quiz session
  const {
    currentQuestionIndex,
    answers,
    currentQuestions,
    sessionStartTime,
    startSession,
    submitAnswer,
    nextQuestion,
  } = useQuizStore();

  // Local UI state (not persisted)
  const [selectedOption, setSelectedOption] = useState<OptionLabel | null>(null);
  const [phase, setPhase] = useState<QuizPhase>('answering');
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const answersRef = useRef<AnswerRecord[]>([]);

  // Load questions on mount or resume session
  useEffect(() => {
    // Check if there's an active session to resume
    if (currentQuestions.length > 0 && sessionStartTime !== null) {
      // Resume existing session - keep answersRef in sync
      answersRef.current = answers;
    } else {
      // Start new session
      const loadedQuestions = getQuestionsForSection(section, QUESTIONS_PER_SESSION);
      startSession(loadedQuestions, section);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  // Keep answersRef in sync with store
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // Current question
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === currentQuestions.length - 1;

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

    // Submit to store
    submitAnswer(newAnswer);

    // Track for pulse animation
    setLastAnswerCorrect(isCorrect);

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
      const totalTime = sessionStartTime
        ? Math.round((Date.now() - sessionStartTime) / 1000)
        : 0;
      router.replace({
        pathname: '/quiz/summary',
        params: {
          section,
          answers: JSON.stringify(answersRef.current),
          totalTime: String(totalTime),
        },
      });
    } else {
      // Move to next question in store
      nextQuestion();
      setSelectedOption(null);
      setPhase('answering');
      setLastAnswerCorrect(false);
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
  if (currentQuestions.length === 0) {
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
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={currentQuestions.length}
        section={section}
        onClose={handleClosePress}
        shouldPulse={lastAnswerCorrect}
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
              {currentQuestionIndex + 1}. {currentQuestion.text}
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
