import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { zustandStorage } from './storage'

interface ProgressState {
  // State
  totalXP: number
  sessionsCompleted: number
  currentStreak: number
  lastSessionDate: string | null
  totalCorrect: number
  totalAnswered: number

  // Actions
  addXP: (amount: number) => void
  completeSession: (correct: number, total: number) => void
  updateStreak: () => void

  // Helper getter
  accuracyPercent: () => number
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      // Initial state
      totalXP: 0,
      sessionsCompleted: 0,
      currentStreak: 0,
      lastSessionDate: null,
      totalCorrect: 0,
      totalAnswered: 0,

      // Actions
      addXP: (amount) => set((state) => ({
        totalXP: state.totalXP + amount,
      })),

      completeSession: (correct, total) => set((state) => ({
        sessionsCompleted: state.sessionsCompleted + 1,
        totalCorrect: state.totalCorrect + correct,
        totalAnswered: state.totalAnswered + total,
        lastSessionDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      })),

      updateStreak: () => set((state) => {
        const today = new Date().toISOString().split('T')[0]
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]

        if (state.lastSessionDate === today) {
          // Already practiced today, streak unchanged
          return state
        } else if (state.lastSessionDate === yesterday) {
          // Practiced yesterday, increment streak
          return { currentStreak: state.currentStreak + 1 }
        } else {
          // Gap in practice, reset streak
          return { currentStreak: 1 }
        }
      }),

      // Helper
      accuracyPercent: () => {
        const state = get()
        if (state.totalAnswered === 0) return 0
        return Math.round((state.totalCorrect / state.totalAnswered) * 100)
      },
    }),
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
)
