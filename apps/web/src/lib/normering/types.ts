// apps/web/src/lib/normering/types.ts

export interface NormeringRow {
  hpScore: number      // 0.00 to 2.00 in 0.05 increments
  count: number        // Number of test-takers with this score
  percentage: number   // Percentage of total (0-100)
  cumulativePercentage: number  // Cumulative percentage (for percentile calculation)
}

export interface NormeringDistribution {
  mean: number
  stdDev: number
  totalParticipants: number
  distribution: NormeringRow[]
}

export interface NormeringData {
  testId: string       // e.g., "hosten-2025"
  testDate: string     // ISO date
  total: NormeringDistribution
  verbal?: NormeringDistribution
  kvantitativ?: NormeringDistribution
}
