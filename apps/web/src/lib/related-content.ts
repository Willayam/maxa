import { tests, type Test } from "@/data/tests";

/**
 * Get related tests based on relevance scoring.
 * Prioritizes: same season > year proximity > recency
 */
export function getRelatedTests(currentTest: Test, limit: number = 4): Test[] {
  return tests
    .filter((t) => t.id !== currentTest.id)
    .map((t) => ({
      test: t,
      score: calculateRelevanceScore(currentTest, t),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.test);
}

function calculateRelevanceScore(current: Test, candidate: Test): number {
  let score = 0;

  // Same season bonus: +10 points
  if (current.season === candidate.season) {
    score += 10;
  }

  // Year proximity: -2 points per year difference
  // Closer years are more relevant
  const yearDiff = Math.abs(current.year - candidate.year);
  score -= yearDiff * 2;

  // Recency bonus: newer tests get slight boost (max +5)
  const currentYear = new Date().getFullYear();
  const ageInYears = currentYear - candidate.year;
  score += Math.max(0, 5 - ageInYears);

  return score;
}
