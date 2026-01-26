# Phase 1: SEO Foundation - Research

**Researched:** 2026-01-26
**Domain:** Next.js 15 App Router SEO (sitemap, robots.txt, canonical URLs, metadata)
**Confidence:** HIGH

## Summary

Next.js 15 provides built-in file-based conventions for SEO optimization through `sitemap.ts`, `robots.ts`, and the Metadata API. The standard approach is to use these native features rather than third-party libraries like `next-sitemap`, as they integrate seamlessly with the App Router's static generation and caching mechanisms.

The Maxa web app has 26 historical test pages (2013-2025) in a static data structure, making it ideal for statically-generated SEO files. The pages already use `generateStaticParams` and `generateMetadata`, but lack sitemap, robots.txt, and canonical URLs.

**Primary recommendation:** Use Next.js built-in file conventions (`app/sitemap.ts`, `app/robots.ts`) to implement SEO foundation, coordinating sitemap generation with existing `generateStaticParams` to ensure consistency.

## Standard Stack

The established libraries/tools for Next.js 15 App Router SEO:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js Metadata API | 15.1.0+ | Generate meta tags, canonical URLs, Open Graph | Built into Next.js, optimized for App Router, no dependencies |
| sitemap.ts convention | 15.1.0+ | Generate sitemap.xml via Route Handler | Official Next.js convention, cached by default, supports 50k URL limit splitting |
| robots.ts convention | 15.1.0+ | Generate robots.txt via Route Handler | Official Next.js convention, cached by default, TypeScript support |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| next-sitemap | 4.2+ | Third-party sitemap/robots generator | Legacy projects or Pages Router; AVOID for new App Router projects |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Built-in sitemap.ts | next-sitemap package | More features (robots config, transform) but adds dependency and complexity; built-in is sufficient for 95% of cases |
| Static sitemap.xml | Dynamic sitemap.ts | Static file simpler but requires manual updates; dynamic auto-reflects content changes |

**Installation:**
No additional packages needed - all features are built into Next.js 15.1.0+

## Architecture Patterns

### Recommended Project Structure
```
apps/web/src/app/
├── layout.tsx           # Root metadata with metadataBase
├── sitemap.ts           # Dynamic sitemap generation
├── robots.ts            # Robots.txt generation
├── hogskoleprovet/
│   ├── page.tsx         # List page with static metadata
│   └── [slug]/
│       └── page.tsx     # Detail pages with generateMetadata (add canonical)
```

### Pattern 1: Sitemap Generation with Static Data
**What:** Generate sitemap.xml by iterating over static data structure, coordinating with `generateStaticParams`
**When to use:** When content is in a static data file or can be fetched at build time
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
// apps/web/src/app/sitemap.ts
import type { MetadataRoute } from 'next'
import { tests } from '@/data/tests'

const BASE_URL = 'https://maxa.se'

export default function sitemap(): MetadataRoute.Sitemap {
  // Homepage
  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
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

  // Add all test pages (same data source as generateStaticParams)
  const testPages = tests.map((test) => ({
    url: `${BASE_URL}/hogskoleprovet/${test.slug}`,
    lastModified: new Date(test.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...routes, ...testPages]
}
```

### Pattern 2: Robots.txt with Sitemap Reference
**What:** Generate robots.txt that allows all crawling and references sitemap
**When to use:** Standard configuration for public content sites
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
// apps/web/src/app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'], // Block internal routes
    },
    sitemap: 'https://maxa.se/sitemap.xml',
  }
}
```

### Pattern 3: Canonical URLs with metadataBase
**What:** Set canonical URLs using `alternates.canonical` in metadata, with `metadataBase` in root layout
**When to use:** All pages should have canonical URLs to prevent duplicate content issues
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
// apps/web/src/app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://maxa.se'),
  // ... other metadata
}

// apps/web/src/app/hogskoleprovet/[slug]/page.tsx
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const test = getTestBySlug(slug)

  if (!test) {
    return { title: "Prov hittades inte | Maxa" }
  }

  const seasonLabel = test.season === "vår" ? "våren" : "hösten"
  const title = `Högskoleprovet ${seasonLabel} ${test.year} - PDF, Facit & Normering | Maxa`

  return {
    title,
    description: `Ladda ner högskoleprovet från ${seasonLabel} ${test.year}. Provfrågor, facit och normeringstabell i PDF-format.`,
    alternates: {
      canonical: `/hogskoleprovet/${slug}`, // Relative to metadataBase
    },
    openGraph: {
      title,
      url: `/hogskoleprovet/${slug}`, // Also benefits from metadataBase
      type: "article",
    },
  }
}
```

### Pattern 4: Unique Metadata for Dynamic Routes
**What:** Generate unique title and description for each page using specific keywords
**When to use:** All dynamic routes (test detail pages)
**Example:**
Already implemented in the codebase - each test page has unique metadata based on season and year. Titles follow pattern: `Högskoleprovet [season] [year] - PDF, Facit & Normering | Maxa`

### Anti-Patterns to Avoid
- **Don't use both static sitemap.xml and sitemap.ts** - Choose one approach; sitemap.ts is preferred for dynamic content
- **Don't hardcode absolute URLs when metadataBase is set** - Use relative paths to allow environment-specific base URLs
- **Don't forget to coordinate sitemap with generateStaticParams** - Use the same data source for both to prevent 404s
- **Don't use generic metadata on dynamic pages** - Each page needs unique, keyword-optimized title/description
- **Don't mix metadata export and generateMetadata** - Cannot export both from same component
- **Don't include trailing slashes inconsistently** - Next.js normalizes them, but be aware of metadataBase behavior

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sitemap XML generation | Custom XML builder | Next.js `sitemap.ts` convention | Automatic caching, proper MIME types, integration with routing, TypeScript types |
| Robots.txt generation | Static file management | Next.js `robots.ts` convention | Dynamic generation, environment-aware, TypeScript validation |
| Canonical URL management | Manual link tags in head | Metadata API `alternates.canonical` | Automatic metadataBase resolution, consistent across layouts, type-safe |
| Meta tag generation | Manual head manipulation | Metadata API `generateMetadata` | Automatic deduplication, SSR optimized, integrates with streaming |
| Sitemap pagination (50k+ URLs) | Custom splitting logic | `generateSitemaps` function | Built-in support for Google's 50k limit, proper index sitemap generation |

**Key insight:** Next.js 15 App Router has baked SEO primitives into its file conventions and Metadata API. Custom solutions miss out on automatic caching, proper Route Handler behavior, and integration with static generation.

## Common Pitfalls

### Pitfall 1: Sitemap and generateStaticParams Drift
**What goes wrong:** Sitemap includes URLs that aren't in `generateStaticParams`, or vice versa, causing 404s or missing pages
**Why it happens:** Different data sources or logic for sitemap vs. static params
**How to avoid:** Use the exact same data source and iteration logic for both
**Warning signs:** Google Search Console shows 404 errors for sitemap URLs, or new pages aren't indexed
**Prevention code:**
```typescript
// Share the same helper function
const getAllTestSlugs = () => tests.map(t => t.slug)

// In page.tsx
export function generateStaticParams() {
  return getAllTestSlugs().map(slug => ({ slug }))
}

// In sitemap.ts
export default function sitemap() {
  return getAllTestSlugs().map(slug => ({
    url: `${BASE_URL}/hogskoleprovet/${slug}`,
    // ...
  }))
}
```

### Pitfall 2: Missing metadataBase Causes Invalid OpenGraph URLs
**What goes wrong:** OpenGraph image and canonical URLs are relative instead of absolute, breaking social media previews
**Why it happens:** Forgetting to set `metadataBase` in root layout
**How to avoid:** Always set `metadataBase` in `app/layout.tsx` to your production domain
**Warning signs:** Social media preview tools show broken images or missing metadata
**Code fix:**
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://maxa.se'),
  // Now all relative URLs in metadata resolve correctly
}
```

### Pitfall 3: Duplicate or Generic Metadata on Dynamic Pages
**What goes wrong:** All test pages have the same title/description, hurting SEO and click-through rates
**Why it happens:** Using static `metadata` export instead of `generateMetadata` function
**How to avoid:** Always use `generateMetadata` for dynamic routes to generate unique metadata per page
**Warning signs:** Google Search Console shows "duplicate title tags" warnings
**Solution:** Already correctly implemented in codebase - each test page generates unique metadata

### Pitfall 4: Trailing Slash Inconsistencies
**What goes wrong:** Canonical URLs have unexpected trailing slashes that don't match actual URLs, causing duplicate content signals
**Why it happens:** Next.js normalizes trailing slashes between `metadataBase` and relative paths
**How to avoid:**
- Set `metadataBase` without trailing slash: `new URL('https://maxa.se')`
- Use relative paths without leading slash for canonical: `canonical: 'hogskoleprovet/slug'`
- Or use `canonical: './'` for self-referencing canonical
**Warning signs:** Canonical URLs in source don't match browser address bar
**Reference:** Known issue - see [Next.js Issue #54070](https://github.com/vercel/next.js/issues/54070)

### Pitfall 5: Forgetting to Block Internal Routes in robots.txt
**What goes wrong:** Search engines waste crawl budget on API routes, Next.js internals, or admin pages
**Why it happens:** Default permissive robots.txt allows all paths
**How to avoid:** Explicitly disallow `/api/`, `/_next/`, and any non-public routes
**Warning signs:** Google crawling API endpoints or showing Next.js build files in index
**Code fix:**
```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/admin/'], // Block internals
    },
    sitemap: 'https://maxa.se/sitemap.xml',
  }
}
```

### Pitfall 6: Swedish Character Encoding Issues in Metadata
**What goes wrong:** Swedish characters (å, ä, ö) display incorrectly in search results or social media
**Why it happens:** Missing charset declaration or incorrect encoding
**How to avoid:** Next.js handles this automatically with UTF-8, but verify in browser dev tools that meta charset is set
**Warning signs:** "Ã¥" instead of "å" in search results
**Solution:** Already handled by Next.js - layout.tsx sets `lang="sv"` correctly

### Pitfall 7: Stale lastModified Dates in Sitemap
**What goes wrong:** Search engines don't recrawl pages because lastModified is incorrect
**Why it happens:** Using `new Date()` for all entries or not tracking actual content changes
**How to avoid:** Use the test's actual date from the data structure
**Warning signs:** Google Search Console shows old cached versions of updated pages
**Code fix:**
```typescript
// Use actual test date, not build date
const testPages = tests.map((test) => ({
  url: `${BASE_URL}/hogskoleprovet/${test.slug}`,
  lastModified: new Date(test.date), // Actual test date
  changeFrequency: 'monthly' as const,
  priority: 0.8,
}))
```

### Pitfall 8: Character Limits Exceeded in Metadata
**What goes wrong:** Titles/descriptions are truncated in search results, cutting off important keywords
**Why it happens:** Not adhering to 2026 best practices for character limits
**How to avoid:**
- Titles: 50-60 characters (580 pixels)
- Descriptions: 120-158 characters (for mobile/desktop compatibility)
- Front-load important keywords
**Warning signs:** "..." truncation in Google search results
**Current status:** Existing titles are ~65-70 characters (slightly over), descriptions are within range

## Code Examples

Verified patterns from official sources:

### Complete Sitemap Implementation for Maxa
```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
// apps/web/src/app/sitemap.ts
import type { MetadataRoute } from 'next'
import { tests } from '@/data/tests'

const BASE_URL = 'https://maxa.se'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
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

  const testPages: MetadataRoute.Sitemap = tests.map((test) => ({
    url: `${BASE_URL}/hogskoleprovet/${test.slug}`,
    lastModified: new Date(test.date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...testPages]
}
```

### Complete Robots.txt Implementation
```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
// apps/web/src/app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    sitemap: 'https://maxa.se/sitemap.xml',
  }
}
```

### Add metadataBase to Root Layout
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
// apps/web/src/app/layout.tsx (modify existing)
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://maxa.se'), // ADD THIS
  title: 'Maxa - Högskoleprovet Prep',
  description: 'Plugga smart för Högskoleprovet med Maxa. Gamifierad träning och AI-coach.',
  // ... rest of existing metadata
};
```

### Add Canonical URLs to Test Pages
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
// apps/web/src/app/hogskoleprovet/[slug]/page.tsx (modify existing generateMetadata)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const test = getTestBySlug(slug)

  if (!test) {
    return { title: "Prov hittades inte | Maxa" }
  }

  const seasonLabel = test.season === "vår" ? "våren" : "hösten"
  const title = `Högskoleprovet ${seasonLabel} ${test.year} - PDF, Facit & Normering | Maxa`
  const description = `Ladda ner högskoleprovet från ${seasonLabel} ${test.year}. Provfrågor, facit och normeringstabell i PDF-format.`

  return {
    title,
    description,
    keywords: [
      `högskoleprov ${seasonLabel} ${test.year}`,
      `hp ${test.year}`,
      `högskoleprov ${test.year} facit`,
      `högskoleprov ${test.year} normering`,
      `högskoleprov ${test.year} pdf`,
    ],
    alternates: {
      canonical: `/hogskoleprovet/${slug}`, // ADD THIS (relative to metadataBase)
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/hogskoleprovet/${slug}`, // ADD THIS
    },
  }
}
```

### Add Canonical to List Page
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
// apps/web/src/app/hogskoleprovet/page.tsx (modify existing metadata export)
export const metadata: Metadata = {
  title: "Gamla Högskoleprov - Ladda ner PDF med Facit | Maxa",
  description: "Ladda ner gamla högskoleprov gratis. Provfrågor, facit och normeringstabeller från 2013 till idag. Öva på riktiga HP-frågor.",
  keywords: [
    "gamla högskoleprov",
    "högskoleprov pdf",
    "hp frågor",
    "högskoleprov facit",
    "högskoleprov normering",
    "öva högskoleprov",
  ],
  alternates: {
    canonical: "/hogskoleprovet", // ADD THIS
  },
  openGraph: {
    title: "Gamla Högskoleprov - Ladda ner PDF med Facit",
    description: "Ladda ner gamla högskoleprov gratis med facit och normering.",
    type: "website",
    url: "/hogskoleprovet", // ADD THIS
  },
};
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| next-sitemap package | Built-in sitemap.ts | Next.js 13 (June 2022) | Eliminates dependency, better caching, type safety |
| Static sitemap.xml in public/ | Dynamic sitemap.ts | Next.js 13 (June 2022) | Auto-updates with content, no manual edits |
| Manual meta tags in head | Metadata API | Next.js 13 (June 2022) | Type-safe, SSR-optimized, automatic deduplication |
| Pages Router getStaticProps | App Router generateMetadata | Next.js 13 (June 2022) | Collocated metadata, async/await, better streaming |
| priority/changeFrequency emphasis | lastModified emphasis | Google guidance (ongoing) | Google ignores priority/changefreq, focus on lastmod |

**Deprecated/outdated:**
- **next-sitemap package for App Router**: Still works but adds unnecessary dependency when built-in features suffice
- **Manual link rel="canonical" in components**: Use Metadata API instead for automatic server-side rendering
- **Static robots.txt in public/**: Use robots.ts for dynamic, environment-aware generation
- **Pages Router SEO patterns**: Not applicable to App Router; use new conventions

## Open Questions

Things that couldn't be fully resolved:

1. **Production Domain URL**
   - What we know: Need to set metadataBase to production domain
   - What's unclear: Is the production domain `https://maxa.se` or something else?
   - Recommendation: Use environment variable `NEXT_PUBLIC_BASE_URL` with fallback to `https://maxa.se`, configurable per environment

2. **Trailing Slash Configuration**
   - What we know: Next.js has issues with trailing slash normalization in canonical URLs (Issue #54070)
   - What's unclear: Does the project prefer URLs with or without trailing slashes?
   - Recommendation: Default Next.js behavior (no trailing slash) unless specific requirement exists

3. **Redirect Handling for Old URLs**
   - What we know: Project has redirects from `/gamla-prov` to `/hogskoleprovet` in next.config.js
   - What's unclear: Should canonical URLs reflect the NEW path (`/hogskoleprovet`) even on redirected old URLs?
   - Recommendation: Yes - canonicals should always point to the preferred current URL

4. **Search Intent for Swedish Keywords**
   - What we know: Swedish SEO requires culturally-aware keyword research, not literal translation
   - What's unclear: Have the current keywords been validated with Swedish search intent analysis?
   - Recommendation: Current keywords look good (e.g., "gamla högskoleprov", "högskoleprov pdf") but could benefit from professional Swedish SEO review in later phases

5. **Title Length Optimization**
   - What we know: Current titles are ~65-70 characters, slightly over the 50-60 character recommendation
   - What's unclear: Is the brand name "| Maxa" worth the 7 characters, or should it be removed from detail pages?
   - Recommendation: Keep "| Maxa" on list page (high priority), consider removing from detail pages to prioritize keywords

## Sources

### Primary (HIGH confidence)
- [Next.js Metadata Files: sitemap.xml](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) - Official docs for sitemap.ts convention
- [Next.js Functions: generateSitemaps](https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps) - Official docs for large sitemap splitting
- [Next.js Metadata Files: robots.txt](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) - Official docs for robots.ts convention
- [Next.js Functions: generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) - Official docs for Metadata API

### Secondary (MEDIUM confidence)
- [Meta Title/Description Guide: 2026 Best Practices](https://www.stanventures.com/blog/meta-title-length-meta-description-length/) - Character limit guidelines (50-60 title, 120-158 description)
- [Next.js SEO Best Practices (App Router, 2025 Edition)](https://www.averagedevs.com/blog/nextjs-seo-best-practices) - Common pitfalls and best practices
- [How to Use Canonical Tags and Hreflang in Next.js 15](https://www.buildwithmatija.com/blog/nextjs-advanced-seo-multilingual-canonical-tags) - Canonical URL implementation patterns
- [Building a Swedish SEO Strategy](https://swedishtranslationservices.com/building-a-swedish-seo-strategy/) - Swedish language SEO considerations

### Tertiary (LOW confidence - flagged for validation)
- [Next.js Issue #54070](https://github.com/vercel/next.js/issues/54070) - Known issue with trailing slashes in canonical URLs (workarounds discussed but not officially resolved)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Next.js documentation, verified with WebFetch
- Architecture: HIGH - Official examples from Next.js docs, applicable to project structure
- Pitfalls: MEDIUM - Combination of official docs and community-reported issues

**Research date:** 2026-01-26
**Valid until:** 2026-02-26 (30 days - stable domain with well-established patterns)
