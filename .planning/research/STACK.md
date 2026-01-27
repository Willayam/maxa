# Technology Stack: SEO-Optimized Data Visualization

**Project:** Maxa SEO & Content Enhancement
**Researched:** 2026-01-26
**Focus:** Adding normering charts and technical SEO to Next.js 15 site

## Recommended Stack

### Core Framework & SEO APIs

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next.js 15 | 15.1.0+ | App Router with native SEO APIs | Built-in `sitemap.ts`, `robots.ts`, `generateMetadata`, and static generation — first-class SEO without libraries |
| Metadata Files API | Built-in | Dynamic sitemap/robots generation | File-based convention (`app/sitemap.ts`, `app/robots.ts`) auto-served by Next.js |

**Confidence: HIGH** — Verified from official Next.js 15.1.4 documentation

**Why these choices:**
- Next.js 15 natively handles all technical SEO needs without external libraries
- `sitemap.ts` and `robots.ts` are TypeScript files that export configurations — type-safe and dynamic
- `generateMetadata` on each page route provides per-page meta tags, Open Graph, and Twitter cards
- No need for `next-sitemap` or other third-party SEO plugins

### Data Visualization

| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| Recharts | ^2.13.3 | Chart rendering engine | Mature, accessible, SVG-based (bot-crawlable), standard choice for shadcn/ui charts |
| shadcn/ui Charts | Latest | Pre-styled chart components | Built on Recharts, matches existing Tailwind design tokens, includes accessible defaults |
| Custom data tables | Native HTML | Bot-readable data alongside charts | `<table>` with semantic markup ensures search bots can parse normering data even without JavaScript |

**Confidence: MEDIUM-HIGH**

**Why these choices:**
- **Recharts over Chart.js**: SVG output (not canvas) is crawlable by search bots, better for SEO
- **shadcn/ui charts over raw Recharts**: Pre-configured with accessibility labels, matches existing Tailwind design system, minimal setup
- **Dual rendering (chart + table)**: Chart for humans, table for bots and screen readers — best of both worlds

### Structured Data

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| schema-dts | ^1.1.2 | TypeScript types for Schema.org | Type-safe JSON-LD generation, catches schema errors at compile time |
| JSON-LD injection | Native | Structured data output | Use `<script type="application/ld+json">` in page components — Google's recommended format |

**Confidence: HIGH** — Standard approach for Next.js structured data

**Schema types for Maxa:**
- `BreadcrumbList` — On all pages for navigation hierarchy
- `Article` or `ScholarlyArticle` — On test pages (scholarly content about exams)
- `Dataset` — On normering data (score conversion tables are datasets)
- `FAQPage` — If adding FAQ sections (common for SEO content)

### Installation

```bash
# shadcn/ui charts (includes Recharts dependency)
npx shadcn@latest add chart

# Schema.org TypeScript types (optional but recommended)
bun add schema-dts

# No other dependencies needed — Next.js 15 handles SEO APIs natively
```

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Sitemap generation | `app/sitemap.ts` | next-sitemap | Next.js 15 native API is simpler, no build plugin needed |
| Charts | Recharts | Chart.js | Chart.js uses canvas (not SEO-friendly), Recharts uses SVG |
| Charts | shadcn/ui | D3.js | D3 is low-level, requires custom accessibility work |
| Structured data | JSON-LD | Microdata | JSON-LD is Google's preferred format, easier to maintain |

## What NOT to Use

### 1. Canvas-based Charts (Chart.js, Plotly)
**Why avoid:** Canvas is rendered as pixels, not DOM elements. Search bots cannot read the data inside.

**What to do instead:** Use Recharts (SVG) + data table fallback.

### 2. Client-side-only Rendering for Content
**Why avoid:** If normering data only renders in `useEffect`, search bots may not see it.

**What to do instead:** Use Next.js static generation (`generateStaticParams`) so HTML contains data at build time.

### 3. next-sitemap Package
**Why avoid:** Redundant with Next.js 15's native `sitemap.ts`. Adds build complexity for no benefit.

### 4. External SEO Libraries (next-seo, etc.)
**Why avoid:** Next.js 15's `generateMetadata` covers all use cases these libraries addressed.

## Implementation Patterns

### Pattern 1: Dynamic Sitemap (app/sitemap.ts)

```typescript
import type { MetadataRoute } from 'next'
import { tests } from '@/data/tests'

export default function sitemap(): MetadataRoute.Sitemap {
  const testPages = tests.map((test) => ({
    url: `https://maxahp.se/hogskoleprovet/${test.slug}`,
    lastModified: test.date,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: 'https://maxahp.se',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://maxahp.se/hogskoleprovet',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...testPages,
  ]
}
```

### Pattern 2: Structured Data (JSON-LD in page component)

```typescript
import { Article, WithContext } from 'schema-dts'

export default function TestPage({ test }) {
  const jsonLd: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: `Högskoleprovet ${test.season} ${test.year}`,
    datePublished: test.date,
    author: {
      '@type': 'Organization',
      name: 'Maxa',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Page content */}
    </>
  )
}
```

### Pattern 3: Accessible Chart + Data Table

```tsx
export function NormeringChart({ data }) {
  return (
    <div>
      {/* Interactive chart for visual users */}
      <LineChart
        data={data}
        accessibilityLabel="Normeringstabell visar sambandet mellan råpoäng och normerad poäng"
        aria-describedby="normering-table"
      />

      {/* Bot-readable table (can be visually hidden or accordion) */}
      <table id="normering-table" className="mt-4">
        <caption>Normeringstabell: Kvantitativ del</caption>
        <thead>
          <tr>
            <th>Råpoäng</th>
            <th>Normerad poäng</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.raw}>
              <td>{row.raw}</td>
              <td>{row.normalized}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

### Pattern 4: Per-Page Metadata

```typescript
import type { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const test = await getTest(params.slug)

  return {
    title: `Högskoleprovet ${test.season} ${test.year} - Normering & Facit | Maxa`,
    description: `Se normeringstabell, ladda ner PDF med facit för högskoleprovet ${test.season} ${test.year}. ${test.files.length} filer tillgängliga.`,
    openGraph: {
      title: `HP ${test.season} ${test.year}`,
      description: `Normering, facit och provfrågor`,
      images: ['/og-images/hogskoleprovet.png'],
    },
    alternates: {
      canonical: `https://maxahp.se/hogskoleprovet/${test.slug}`,
    },
  }
}
```

## Technical SEO Checklist

- [x] **Sitemap**: `app/sitemap.ts` with dynamic test pages
- [x] **Robots.txt**: `app/robots.ts` allowing all crawlers, linking sitemap
- [x] **Canonical URLs**: Set in `generateMetadata` for every page
- [x] **Structured Data**: JSON-LD on test pages (Article/ScholarlyArticle schema)
- [x] **Open Graph**: Title, description, image for social sharing
- [x] **Bot-readable charts**: Data tables alongside visualizations

## Migration from Current State

Current state (per package.json):
- Next.js 15.1.0 ✓
- Tailwind CSS ✓
- No chart library ✗
- No schema types ✗

Changes needed:
1. Add shadcn/ui charts: `npx shadcn@latest add chart`
2. Add schema-dts: `bun add schema-dts`
3. Create `app/sitemap.ts`
4. Create `app/robots.ts`
5. Add JSON-LD to test page components
6. Add normering data extraction (separate task)

---

**Key takeaway:** Next.js 15 provides all SEO infrastructure natively. The only additions needed are Recharts (via shadcn/ui) for visualization and schema-dts for type-safe structured data. The combination of SVG charts + HTML tables ensures both humans and bots can access normering data.
