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

  // Dynamic test page routes
  const testRoutes: MetadataRoute.Sitemap = tests.map((test) => ({
    url: `${BASE_URL}/hogskoleprovet/${test.slug}`,
    lastModified: new Date(test.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...testRoutes]
}
