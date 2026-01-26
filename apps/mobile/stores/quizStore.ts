import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Question, AnswerRecord, SectionCode } from '@/constants/mock-questions'
import { zustandStorage } from './storage'

interface QuizState {
  // State
  currentQuestionIndex: number
  answers: AnswerRecord[]
  sessionStartTime: number | null
  currentQuestions: Question[]
  section: SectionCode | null

  // Actions
  startSession: (questions: Question[], section: SectionCode) => void
  submitAnswer: (answer: AnswerRecord) => void
  nextQuestion: () => void
  endSession: () => void
  resetSession: () => void
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      // Initial state
      currentQuestionIndex: 0,
      answers: [],
      sessionStartTime: null,
      currentQuestions: [],
      section: null,

      // Actions
      startSession: (questions, section) => set({
        currentQuestions: questions,
        section,
        currentQuestionIndex: 0,
        answers: [],
        sessionStartTime: Date.now(),
      }),

      submitAnswer: (answer) => set((state) => ({
        answers: [...state.answers, answer],
      })),

      nextQuestion: () => set((state) => ({
        currentQuestionIndex: state.currentQuestionIndex + 1,
      })),

      endSession: () => set({
        sessionStartTime: null,
      }),

      resetSession: () => set({
        currentQuestionIndex: 0,
        answers: [],
        sessionStartTime: null,
        currentQuestions: [],
        section: null,
      }),
    }),
    {
      name: 'quiz-session',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
)
