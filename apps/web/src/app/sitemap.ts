import type { MetadataRoute } from 'next'
import { tests } from '@/data/tests'

const BASE_URL = 'https://maxa.se'

export default function sitemap(): MetadataRoute.Sitemap {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/hogskoleprovet`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // Strategy page routes
  const strategyRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/hogskoleprovet/strategier`,
      lastModified: new Date('2026-01-27'),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/hogskoleprovet/strategier/kvantitativa-fallor`,
      lastModified: new Date('2026-01-27'),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/hogskoleprovet/strategier/verbala-fallor`,
      lastModified: new Date('2026-01-27'),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/hogskoleprovet/strategier/vanliga-misstag`,
      lastModified: new Date('2026-01-27'),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/hogskoleprovet/strategier/tidsstrategi`,
      lastModified: new Date('2026-01-27'),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
  ]

  // Dynamic test page routes
  const testRoutes: MetadataRoute.Sitemap = tests.map((test) => ({
    url: `${BASE_URL}/hogskoleprovet/${test.slug}`,
    lastModified: new Date(test.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...strategyRoutes, ...testRoutes]
}
