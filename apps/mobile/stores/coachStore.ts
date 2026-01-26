import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { zustandStorage } from './storage'

export type CoachPersonality = 'Hype' | 'Lugn' | 'Strikt'

export type MessageContext =
  | { type: 'quiz_complete'; correct: number; total: number }
  | { type: 'streak_milestone'; days: number }
  | { type: 'streak_broken' }
  | { type: 'daily_goal_complete' }
  | { type: 'level_up'; level: number }
  | { type: 'tab_visit'; tab: 'Idag' | 'Trana' | 'Jag' }

interface CoachState {
  personality: CoachPersonality

  // Actions
  setPersonality: (personality: CoachPersonality) => void
  getMessage: (context: MessageContext) => string
}

/**
 * Get a contextual message from Max coach based on personality and event
 * Messages follow growth mindset principles: focus on PROCESS not OUTCOME
 */
function getCoachMessage(personality: CoachPersonality, context: MessageContext): string {
  if (context.type === 'quiz_complete') {
    const percent = Math.round((context.correct / context.total) * 100)

    if (personality === 'Hype') {
      if (percent >= 80) return `${context.correct}/${context.total} ratt! Du ar pa gang!`
      if (percent >= 50) return `Bra jobbat! ${context.correct}/${context.total} - fortsatt sa!`
      return `${context.correct}/${context.total} idag. Varje forsok gor dig starkare!`
    }

    if (personality === 'Lugn') {
      if (percent >= 80) return `Riktigt bra. ${context.correct} av ${context.total} ratt visar pa god forstaelse.`
      if (percent >= 50) return `${context.correct}/${context.total} ratt. Bra att du tranar regelbundet.`
      return `${context.correct}/${context.total} idag. Fokusera pa vad du lart dig.`
    }

    // Strikt
    if (percent >= 80) return `${context.correct}/${context.total}. Fortsatt i denna takt for att na ditt mal.`
    if (percent >= 50) return `${context.correct}/${context.total}. Oka traningen inom svaga omraden.`
    return `${context.correct}/${context.total}. Analysera misstagen och ova mer.`
  }

  if (context.type === 'streak_milestone') {
    if (personality === 'Hype') {
      if (context.days === 7) return `EN VECKA! 7 dagar i rad - du ar oslagbar!`
      if (context.days === 30) return `EN MANAD! 30 dagar i rad - legendariskt!`
      return `${context.days} dagar i rad - fortsatt krossa det!`
    }

    if (personality === 'Lugn') {
      if (context.days === 7) return `Bra jobbat. En veckas konsistent traning.`
      if (context.days === 30) return `Imponerande. 30 dagars disciplin.`
      return `${context.days} dagar i rad visar pa konsistens.`
    }

    // Strikt
    if (context.days === 7) return `7 dagars streak. Fortsatt sa har.`
    if (context.days === 30) return `30 dagar. Bra disciplin.`
    return `${context.days} dagars streak. Hag nivan.`
  }

  if (context.type === 'streak_broken') {
    if (personality === 'Hype') return `Ny dag, ny chans! Lat oss starta en annu langre streak!`
    if (personality === 'Lugn') return `Det hander. Det viktiga ar att du fortsatter trana.`
    return `Streak bruten. Borja om med battre konsistens.`
  }

  if (context.type === 'daily_goal_complete') {
    if (personality === 'Hype') return `DAGENS MAL KLARAT! Du ar en maskin!`
    if (personality === 'Lugn') return `Dagens mal uppnatt. Bra jobbat med konsistensen.`
    return `Dagens mal klarat. Sikta pa samma imorgon.`
  }

  if (context.type === 'level_up') {
    if (personality === 'Hype') return `LEVEL UP! Du ar nu niva ${context.level}!`
    if (personality === 'Lugn') return `Grattis till niva ${context.level}. Stadig framgang.`
    return `Niva ${context.level}. Fortsatt.`
  }

  if (context.type === 'tab_visit') {
    if (context.tab === 'Idag') {
      if (personality === 'Hype') return `Redo att krossa det idag?`
      if (personality === 'Lugn') return `Valkommen tillbaka. Lat oss trana.`
      return `Dags att trana. Fokus.`
    }

    if (context.tab === 'Trana') {
      if (personality === 'Hype') return `Lat oss kora! Valj en ovning.`
      if (personality === 'Lugn') return `Valj vad du vill fokusera pa idag.`
      return `Valj ovningsomrade.`
    }

    if (context.tab === 'Jag') {
      if (personality === 'Hype') return `Kolla in dina framsteg - du ar grym!`
      if (personality === 'Lugn') return `Har ser du din utveckling.`
      return `Din statistik.`
    }
  }

  return ''
}

export const useCoachStore = create<CoachState>()(
  persist(
    (set, get) => ({
      personality: 'Hype' as CoachPersonality,

      setPersonality: (personality: CoachPersonality) => {
        set({ personality })
      },

      getMessage: (context: MessageContext) => {
        const { personality } = get()
        return getCoachMessage(personality, context)
      },
    }),
    {
      name: 'coach-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ personality: state.personality }), // Only persist personality
    }
  )
)
