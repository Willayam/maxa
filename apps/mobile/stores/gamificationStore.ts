import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { zustandStorage } from './storage'
import { differenceInCalendarDays, format, startOfDay } from 'date-fns'

/**
 * Get today's date as YYYY-MM-DD string
 */
const getTodayString = () => format(new Date(), 'yyyy-MM-dd')

/**
 * Calculate XP required to complete a given level
 * Uses polynomial curve: quick early wins, gradual mid-game, steep late-game
 */
function xpRequiredForLevel(level: number): number {
  if (level <= 1) return 0
  if (level <= 10) {
    // Linear early game: 100, 200, 300... quick progression
    return level * 100
  }
  if (level <= 30) {
    // Polynomial mid game: gradual increase
    return Math.floor(Math.pow(level, 1.5) * 50)
  }
  // Steep late game: meaningful milestones
  return Math.floor(Math.pow(level, 2) * 30)
}

/**
 * Calculate total XP needed to reach a level from level 1
 */
function getTotalXPForLevel(level: number): number {
  let total = 0
  for (let i = 1; i <= level; i++) {
    total += xpRequiredForLevel(i)
  }
  return total
}

/**
 * Calculate level from total XP accumulated
 */
function calculateLevelFromXP(totalXP: number): number {
  let level = 1
  let accumulatedXP = 0

  while (true) {
    const xpForNextLevel = xpRequiredForLevel(level + 1)
    if (accumulatedXP + xpForNextLevel > totalXP) {
      break
    }
    accumulatedXP += xpForNextLevel
    level++
  }

  return level
}

interface GamificationState {
  // Streak tracking
  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null // YYYY-MM-DD format
  streakFreezes: number // 0-2 max

  // Daily goals
  dailyGoal: number // questions target (default 20)
  dailyProgress: number // questions completed today
  lastProgressDate: string | null // YYYY-MM-DD for daily reset

  // XP and leveling
  totalXP: number
  level: number

  // Actions
  checkAndUpdateStreak: () => void // Call on app open
  recordActivity: () => void // Call when completing a question
  addDailyProgress: (questions: number) => void
  awardXP: (amount: number) => void
  useStreakFreeze: () => boolean
  awardStreakFreeze: () => void
  setDailyGoal: (goal: number) => void

  // Computed getters
  xpForNextLevel: () => number
  xpProgressInLevel: () => number
  isDailyGoalComplete: () => boolean
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      streakFreezes: 0,
      dailyGoal: 20,
      dailyProgress: 0,
      lastProgressDate: null,
      totalXP: 0,
      level: 1,

      // Check and update streak on app open
      checkAndUpdateStreak: () => {
        const state = get()
        const today = getTodayString()
        const lastDate = state.lastActivityDate

        if (!lastDate) {
          // First time user, no streak yet
          return
        }

        const lastActivityDay = startOfDay(new Date(lastDate))
        const todayDay = startOfDay(new Date())
        const daysSinceActivity = differenceInCalendarDays(todayDay, lastActivityDay)

        if (daysSinceActivity === 0) {
          // Already logged in today, no change
          return
        }

        if (daysSinceActivity === 1) {
          // Normal streak continuation - increment when recording activity
          // Just checking here, actual increment happens in recordActivity
          return
        }

        if (daysSinceActivity === 2 && state.streakFreezes > 0) {
          // Use freeze to save streak (missed yesterday)
          set({
            streakFreezes: state.streakFreezes - 1,
          })
          // Streak maintained, will continue when they record activity today
          return
        }

        // Gap > 2 days, or gap = 2 and no freeze: reset streak
        set({
          currentStreak: 0,
        })
      },

      // Record activity and update streak
      recordActivity: () => {
        const state = get()
        const today = getTodayString()

        if (state.lastActivityDate === today) {
          // Already recorded activity today
          return
        }

        const lastDate = state.lastActivityDate
        let newStreak = state.currentStreak

        if (!lastDate) {
          // First activity ever
          newStreak = 1
        } else {
          const lastActivityDay = startOfDay(new Date(lastDate))
          const todayDay = startOfDay(new Date())
          const daysSinceActivity = differenceInCalendarDays(todayDay, lastActivityDay)

          if (daysSinceActivity === 1) {
            // Consecutive day, increment streak
            newStreak = state.currentStreak + 1
          } else if (daysSinceActivity === 2 && state.streakFreezes >= 0) {
            // Freeze was already consumed in checkAndUpdateStreak
            newStreak = state.currentStreak + 1
          } else if (daysSinceActivity > 0) {
            // Gap in activity, start new streak
            newStreak = 1
          }
        }

        const newLongestStreak = Math.max(state.longestStreak, newStreak)

        // Check for streak freeze awards at milestones
        let freezesToAdd = 0
        if (newStreak === 7 && state.currentStreak < 7 && state.streakFreezes < 2) {
          freezesToAdd = 1
        }
        if (newStreak === 30 && state.currentStreak < 30 && state.streakFreezes < 2) {
          freezesToAdd = 1
        }

        set({
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          lastActivityDate: today,
          streakFreezes: Math.min(2, state.streakFreezes + freezesToAdd),
        })
      },

      // Add progress to daily goal
      addDailyProgress: (questions: number) => {
        const state = get()
        const today = getTodayString()

        // Check if we need to reset for a new day
        if (state.lastProgressDate !== today) {
          set({
            dailyProgress: questions,
            lastProgressDate: today,
          })
        } else {
          set({
            dailyProgress: state.dailyProgress + questions,
          })
        }
      },

      // Award XP and update level
      awardXP: (amount: number) => {
        const state = get()
        const newTotalXP = state.totalXP + amount
        const newLevel = calculateLevelFromXP(newTotalXP)

        set({
          totalXP: newTotalXP,
          level: newLevel,
        })
      },

      // Use a streak freeze (returns true if successful)
      useStreakFreeze: () => {
        const state = get()
        if (state.streakFreezes > 0) {
          set({
            streakFreezes: state.streakFreezes - 1,
          })
          return true
        }
        return false
      },

      // Award a streak freeze (max 2)
      awardStreakFreeze: () => {
        const state = get()
        if (state.streakFreezes < 2) {
          set({
            streakFreezes: state.streakFreezes + 1,
          })
        }
      },

      // Set daily goal
      setDailyGoal: (goal: number) => {
        set({ dailyGoal: goal })
      },

      // Get XP needed to complete current level
      xpForNextLevel: () => {
        const state = get()
        return xpRequiredForLevel(state.level + 1)
      },

      // Get XP progress within current level
      xpProgressInLevel: () => {
        const state = get()
        const xpForCurrentLevel = getTotalXPForLevel(state.level)
        return state.totalXP - xpForCurrentLevel
      },

      // Check if daily goal is complete
      isDailyGoalComplete: () => {
        const state = get()
        const today = getTodayString()

        // Reset check for new day
        if (state.lastProgressDate !== today) {
          return false
        }

        return state.dailyProgress >= state.dailyGoal
      },
    }),
    {
      name: 'gamification-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
)
