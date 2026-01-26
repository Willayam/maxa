// apps/web/src/lib/normering/loader.ts

import type { NormeringData } from './types'

/**
 * Load normering data for a test by slug.
 * Returns null if no normering data exists for this test.
 * Uses dynamic import so data is included at build time (SSG-friendly).
 */
export async function getNormeringData(slug: string): Promise<NormeringData | null> {
  try {
    const data = await import(`@/data/normering/${slug}.json`)
    return data.default as NormeringData
  } catch {
    // No normering data for this test
    return null
  }
}
