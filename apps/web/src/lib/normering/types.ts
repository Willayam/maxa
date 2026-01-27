/**
 * Normering (score normalization) data types for Högskoleprovet
 *
 * DATA FORMAT NOTES:
 * - Total (hela provet): HP scores in 0.05 increments (0.00, 0.05, 0.10, ... 2.00)
 * - Verbal and Kvantitativ: HP scores in 0.10 increments (0.00, 0.10, 0.20, ... 2.00)
 *
 * TODO: Current data in hosten-2025.json is MOCK DATA with realistic distribution.
 * Real data should be extracted from official studera.nu PDFs:
 * - norm{YY}{season}-helaprovet.pdf (total)
 * - norm{YY}{season}-verb.pdf (verbal)
 * - norm{YY}{season}-kvant.pdf (kvantitativ)
 */

export interface NormeringRow {
  hpScore: number // 0.00 to 2.00
  count: number // Number of test-takers with this score
  percentage: number // Percentage of total (0-100)
  cumulativePercentage: number // Cumulative percentage, max 100 (for percentile calc)
}

export interface NormeringDistribution {
  mean: number
  stdDev: number
  totalParticipants: number
  distribution: NormeringRow[]
}

export interface NormeringData {
  testId: string // e.g., "hosten-2025"
  testDate: string // ISO date
  total: NormeringDistribution
  verbal?: NormeringDistribution
  kvantitativ?: NormeringDistribution
}
