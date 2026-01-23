// apps/mobile/constants/quiz-config.ts

/**
 * Quiz configuration constants
 * - Target times per section (based on real HP timing)
 * - Scoring thresholds for performance feedback
 */

// Target time per question in seconds (based on real HP: ~22-24 questions in 50-55 min)
export const TARGET_TIME_PER_QUESTION: Record<string, number> = {
  // Verbal sections - slightly faster
  ORD: 120, // 2 min
  LÄS: 150, // 2.5 min (reading comprehension takes longer)
  MEK: 120, // 2 min
  ELF: 150, // 2.5 min (English reading)
  // Quantitative sections - need more calculation time
  XYZ: 150, // 2.5 min
  KVA: 120, // 2 min
  NOG: 150, // 2.5 min
  DTK: 150, // 2.5 min (diagrams/tables)
};

// Default if section not found
export const DEFAULT_TARGET_TIME = 120;

// Questions per session
export const QUESTIONS_PER_SESSION = 10;

// Scoring thresholds for summary screen
export const SCORE_THRESHOLDS = {
  excellent: 90, // 90-100%: "Fantastiskt!"
  good: 70,      // 70-89%: "Bra jobbat!"
  okay: 50,      // 50-69%: "Fortsätt öva!"
  // Below 50%: "Nästa gång!"
};

// Pace status thresholds (percentage over target)
export const PACE_THRESHOLDS = {
  onPace: 0,      // avg <= target: "I fas"
  slightlySlow: 20, // 1-20% over: "Lite långsam"
  // >20% over: "Öva tempo"
};

// Summary screen copy
export const SUMMARY_TITLES = {
  excellent: { title: 'Fantastiskt!', icon: '🌟' },
  good: { title: 'Bra jobbat!', icon: '🎯' },
  okay: { title: 'Fortsätt öva!', icon: '💪' },
  poor: { title: 'Nästa gång!', icon: '📚' },
};

export const PACE_STATUS = {
  onPace: { label: 'I fas', icon: '✅' },
  slightlySlow: { label: 'Lite långsam', icon: '⚠️' },
  tooSlow: { label: 'Öva tempo', icon: '🔴' },
};
