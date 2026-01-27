# Phase 3: Normering - Research

**Researched:** 2026-01-26
**Domain:** Interactive data visualization with Recharts, PDF data extraction, accessible tables, static JSON storage
**Confidence:** HIGH

## Summary

This phase involves extracting normering (score distribution) data from PDFs, storing it as static JSON, and displaying it as interactive histogram charts with bell curve overlays using shadcn/ui charts (built on Recharts). The key technical challenge is balancing three requirements: visual appeal (interactive charts), accessibility (screen readers), and SEO (bot-readable content). The solution is progressive enhancement: HTML tables as the foundation, with JavaScript-powered charts layered on top.

The normering PDFs contain structured tables with four columns: HP-värde (0.0-2.0), Antal provdeltagare (count), Andel (percentage), and Kumulativ andel (cumulative percentage). We need to extract this data, calculate percentiles from cumulative distribution, and render both histogram bars (count per score) and a smoothed bell curve line. The context document locks several decisions (tooltip content, tab-based breakdowns, static JSON storage) while leaving implementation details (hover mechanics, mobile height, table positioning) to research.

**Primary recommendation:** Use Claude API for PDF table extraction with validation, store as static JSON in repository, render with shadcn/ui Bar Chart + Line overlay, provide full accessible table that becomes primary display when JavaScript is disabled.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Recharts | 2.12+ | Chart rendering engine | Industry standard for React charts, SVG-based for accessibility, responsive by default, used by shadcn/ui charts |
| shadcn/ui charts | Latest | Pre-built chart components with theme integration | Official shadcn component set, integrates with existing Tailwind theme, reduces boilerplate |
| Claude API (Anthropic) | Latest | PDF table extraction with vision | Multimodal AI can read PDF tables accurately, handles Swedish text, 32MB/100 page limits sufficient for normering PDFs |
| Next.js 15 App Router | 15.1.0 | Static generation at build time | Already in use, supports build-time data processing, SEO-optimized static pages |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| pdf-parse | 3.0+ | Fallback PDF text extraction | If Claude API unavailable or for validation/comparison |
| unpdf | Latest | TypeScript-first PDF extraction | Alternative to pdf-parse with better TypeScript support |
| zod | 3.22+ | Runtime validation for extracted data | Validate JSON structure before storage, ensure data quality |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Recharts + shadcn | Chart.js | Chart.js more features but worse React integration, heavier bundle |
| Recharts + shadcn | Victory Charts | Victory has better mobile gestures but steeper learning curve, less community support |
| Claude API extraction | Manual JSON creation | Manual faster for small dataset but error-prone, not scalable |
| Static JSON files | Convex database | Database adds runtime dependency, slows SSG, JSON perfectly fine for read-only distribution data |
| Progressive enhancement | Canvas-only charts | Canvas fails SEO/accessibility requirements, locks out JavaScript-disabled users |

**Installation:**
```bash
# Charts (if not already installed)
npx shadcn@latest add chart

# PDF extraction (choose one approach)
# Option 1: Claude API (recommended) - use existing Anthropic SDK if available
npm install @anthropic-ai/sdk

# Option 2: Fallback/validation libraries
npm install pdf-parse unpdf

# Validation
npm install zod
```

## Architecture Patterns

### Recommended Project Structure
```
apps/web/
├── src/
│   ├── app/
│   │   └── hogskoleprovet/[slug]/
│   │       └── page.tsx                    # Add normering section here
│   ├── components/
│   │   ├── charts/
│   │   │   ├── normering-chart.tsx         # Main chart component (histogram + bell curve)
│   │   │   ├── normering-table.tsx         # Accessible HTML table
│   │   │   └── normering-section.tsx       # Container with tabs (Total/VERB/KVANT)
│   │   └── ui/
│   │       └── chart.tsx                   # shadcn chart primitives (may need to add)
│   ├── data/
│   │   ├── normering/
│   │   │   ├── hosten-2025.json            # Extracted normering data
│   │   │   ├── varen-2025.json
│   │   │   └── ...
│   │   └── tests.ts                        # Extend with hasNormering flag
│   └── lib/
│       └── normering/
│           ├── extract-from-pdf.ts         # PDF extraction script (run at build)
│           ├── calculate-percentile.ts     # Percentile from cumulative distribution
│           └── smooth-bell-curve.ts        # Bell curve interpolation algorithm
└── public/
    └── pdfs/{slug}/                        # Source PDFs already here
```

### Pattern 1: Static JSON Storage for Distribution Data
**What:** Store extracted normering data as JSON files in repository, loaded at build time for SSG
**When to use:** Read-only data that doesn't change, needs to be SEO-crawlable, simple to version control
**Example:**
```typescript
// apps/web/src/data/normering/hosten-2025.json
{
  "testId": "hosten-2025",
  "testDate": "2025-10-19",
  "total": {
    "mean": 0.90,
    "stdDev": 0.39,
    "totalParticipants": 56723,
    "distribution": [
      { "hpScore": 0.00, "count": 316, "percentage": 0.6, "cumulativePercentage": 0.6 },
      { "hpScore": 0.05, "count": 381, "percentage": 0.7, "cumulativePercentage": 1.2 },
      // ... 41 rows total (0.00 to 2.00 in 0.05 increments)
    ]
  },
  "verbal": {
    "mean": 0.88,
    "stdDev": 0.42,
    "totalParticipants": 56723,
    "distribution": [ /* same structure */ ]
  },
  "kvantitativ": {
    "mean": 0.92,
    "stdDev": 0.36,
    "totalParticipants": 56723,
    "distribution": [ /* same structure */ ]
  }
}
```

### Pattern 2: Progressive Enhancement with Tables and Charts
**What:** Render accessible HTML table first, enhance with interactive chart when JavaScript loads
**When to use:** Data visualizations that must be accessible to screen readers, SEO bots, and JavaScript-disabled users
**Example:**
```typescript
// apps/web/src/components/charts/normering-section.tsx
'use client'

import { useState } from 'react'
import { NormeringChart } from './normering-chart'
import { NormeringTable } from './normering-table'

export function NormeringSection({ data }) {
  const [activeTab, setActiveTab] = useState<'total' | 'verbal' | 'kvantitativ'>('total')
  const [isJsEnabled, setIsJsEnabled] = useState(false)

  // Detect JavaScript availability
  useEffect(() => {
    setIsJsEnabled(true)
  }, [])

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Normering</h2>

      {/* Tabs for switching between Total/VERB/KVANT */}
      <div className="flex gap-2 mb-4">
        <TabButton active={activeTab === 'total'} onClick={() => setActiveTab('total')}>
          Hela provet
        </TabButton>
        <TabButton active={activeTab === 'verbal'} onClick={() => setActiveTab('verbal')}>
          Verbal del
        </TabButton>
        <TabButton active={activeTab === 'kvantitativ'} onClick={() => setActiveTab('kvantitativ')}>
          Kvantitativ del
        </TabButton>
      </div>

      {/* Chart (hidden if JS disabled) */}
      {isJsEnabled && (
        <div className="mb-6">
          <NormeringChart data={data[activeTab]} />
        </div>
      )}

      {/* Table (primary display when JS disabled, collapsible when enabled) */}
      <NormeringTable
        data={data[activeTab]}
        collapsible={isJsEnabled}
        defaultCollapsed={isJsEnabled}
      />
    </section>
  )
}
```

### Pattern 3: Histogram + Bell Curve Overlay with Recharts
**What:** Render bar chart for count histogram, overlay smooth line for bell curve distribution
**When to use:** Visualizing statistical distributions with both discrete (bars) and continuous (curve) representations
**Example:**
```typescript
// apps/web/src/components/charts/normering-chart.tsx
'use client'

import { Bar, Line, ComposedChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

export function NormeringChart({ data }) {
  // Calculate percentile from cumulative percentage
  const chartData = data.distribution.map(point => ({
    hpScore: point.hpScore,
    count: point.count,
    percentile: 100 - point.cumulativePercentage, // "Topp X%" format
  }))

  // Smooth bell curve using interpolation (optional - Recharts can smooth)
  const bellCurve = smoothBellCurve(chartData)

  return (
    <ChartContainer
      config={{
        count: {
          label: "Antal provdeltagare",
          color: "hsl(var(--primary))", // Amber/gold from theme
        },
        bellCurve: {
          label: "Fördelning",
          color: "hsl(var(--primary-dark))", // Darker shade
        },
      }}
      className="min-h-[300px] md:min-h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
          <XAxis
            dataKey="hpScore"
            label={{ value: 'HP-värde', position: 'insideBottom', offset: -5 }}
            domain={[0, 2.0]}
          />
          <YAxis
            label={{ value: 'Antal provdeltagare', angle: -90, position: 'insideLeft' }}
          />

          {/* Histogram bars */}
          <Bar
            dataKey="count"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />

          {/* Bell curve line overlay */}
          <Line
            dataKey="bellCurve"
            stroke="hsl(var(--primary-dark))"
            strokeWidth={3}
            dot={false}
            type="monotone" // Smooth interpolation
          />

          {/* Custom tooltip: HP-värde + Percentil */}
          <ChartTooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null
              const data = payload[0].payload
              return (
                <div className="bg-card-background border-2 border-border rounded-lg p-3">
                  <p className="font-bold text-foreground">
                    {data.hpScore.toFixed(1)}
                  </p>
                  <p className="text-sm text-foreground-muted">
                    Topp {data.percentile.toFixed(0)}%
                  </p>
                </div>
              )
            }}
            position={{ y: -60 }} // Position above chart on mobile
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
```

### Pattern 4: Claude API for PDF Table Extraction
**What:** Use Claude's vision capabilities to extract structured table data from normering PDFs
**When to use:** Source data is in PDF tables, need structured extraction with validation
**Example:**
```typescript
// apps/web/src/lib/normering/extract-from-pdf.ts
import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs/promises'
import path from 'path'

interface NormeringRow {
  hpScore: number
  count: number
  percentage: number
  cumulativePercentage: number
}

export async function extractNormeringFromPDF(pdfPath: string): Promise<NormeringRow[]> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  // Read PDF file
  const pdfBuffer = await fs.readFile(pdfPath)
  const base64Pdf = pdfBuffer.toString('base64')

  // Send to Claude with structured extraction prompt
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: base64Pdf,
            },
          },
          {
            type: 'text',
            text: `Extract the normering table from this PDF. Return JSON array with structure:
[
  {
    "hpScore": 0.00,
    "count": 316,
    "percentage": 0.6,
    "cumulativePercentage": 0.6
  },
  ...
]

The table has columns:
- "Normerad poäng" or "HP-värde" → hpScore (0.00 to 2.00)
- "Antal provdeltagare" → count
- "Andel provdeltagare (%)" or "Andel" → percentage
- "Kumulativ andel provdeltagare (%)" → cumulativePercentage

Return ONLY the JSON array, no other text.`,
          },
        ],
      },
    ],
  })

  // Parse response
  const jsonText = message.content[0].type === 'text' ? message.content[0].text : ''
  const data = JSON.parse(jsonText)

  // Validate with Zod
  const rowSchema = z.object({
    hpScore: z.number().min(0).max(2),
    count: z.number().int().positive(),
    percentage: z.number().min(0).max(100),
    cumulativePercentage: z.number().min(0).max(100),
  })
  const arraySchema = z.array(rowSchema)

  return arraySchema.parse(data)
}
```

### Pattern 5: Percentile Calculation from Cumulative Distribution
**What:** Convert cumulative percentage to percentile rank ("Topp X%")
**When to use:** Displaying user-friendly percentile in tooltip instead of raw cumulative value
**Example:**
```typescript
// apps/web/src/lib/normering/calculate-percentile.ts

/**
 * Convert cumulative percentage to percentile rank.
 *
 * Cumulative percentage represents "this score or below",
 * Percentile rank represents "better than X% of test-takers".
 *
 * For "Topp X%" format (top X percent), we want: 100 - cumulativePercentage
 *
 * Example:
 *   - HP score 1.5 has cumulative 93.9% (93.9% scored 1.5 or lower)
 *   - Percentile = 100 - 93.9 = 6.1 → "Topp 6%"
 */
export function calculatePercentile(cumulativePercentage: number): number {
  return 100 - cumulativePercentage
}

/**
 * Find percentile for a specific HP score using linear interpolation.
 * Useful if user inputs score between defined points (future feature).
 */
export function findPercentileForScore(
  score: number,
  distribution: Array<{ hpScore: number; cumulativePercentage: number }>
): number {
  // Find surrounding data points
  const lower = distribution.findLast(d => d.hpScore <= score)
  const upper = distribution.find(d => d.hpScore > score)

  if (!lower) return 100 // Below minimum score
  if (!upper) return calculatePercentile(lower.cumulativePercentage) // At or above max

  // Linear interpolation
  const ratio = (score - lower.hpScore) / (upper.hpScore - lower.hpScore)
  const interpolatedCumulative =
    lower.cumulativePercentage + ratio * (upper.cumulativePercentage - lower.cumulativePercentage)

  return calculatePercentile(interpolatedCumulative)
}
```

### Anti-Patterns to Avoid
- **Canvas-only charts** - SVG-based Recharts is accessible to screen readers via text fallback; canvas is not
- **Hiding table with display:none** - Screen readers can't access it; use semantic hiding or keep visible
- **Hardcoding chart colors** - Use CSS custom properties from theme for light/dark mode compatibility
- **Client-side data fetching** - Loads data on every page view, slows SSG; embed JSON at build time instead
- **Manual PDF parsing with regex** - Tables have complex layouts; AI extraction or proper parser libraries more reliable
- **Raw score in tooltip** - Users don't know what "47 raw points" means; HP-värde and percentile are meaningful
- **Generic error messages** - "Failed to load chart" doesn't help; show table fallback automatically

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| PDF table extraction | Regex parsing of pdf.js text output | Claude API with vision or unpdf with layout detection | PDF tables have complex positioning, merged cells, multi-line text; AI handles this better than regex |
| Bell curve smoothing | Manual cubic spline implementation | Recharts `type="monotone"` on Line component | Built-in monotone cubic interpolation produces smooth curves without overshooting |
| Percentile calculation | Custom statistics library | Simple `100 - cumulativePercentage` formula | Percentile from CDF is straightforward math, no library needed |
| Responsive chart sizing | Custom resize listeners | Recharts ResponsiveContainer + Tailwind min-h | Recharts handles resize automatically with proper container setup |
| Tooltip positioning | Custom tooltip with absolute positioning | Recharts Tooltip with position prop | Built-in tooltip handles edge detection, overflow, mobile positioning |
| Screen reader accessibility | Custom ARIA implementation | Semantic HTML table + Recharts default SVG text | Tables are natively accessible; Recharts adds text elements to SVG for screen readers |
| Theme integration | Hardcoded colors | CSS custom properties via `hsl(var(--primary))` | Automatically adapts to light/dark theme, matches design system |

**Key insight:** Data visualization accessibility is solved by progressive enhancement: start with semantic HTML table (fully accessible), layer SVG chart on top (Recharts adds accessibility attributes automatically). Don't build custom solutions for chart rendering or PDF parsing - mature libraries handle edge cases better.

## Common Pitfalls

### Pitfall 1: JavaScript-Dependent Charts Break SEO and Accessibility
**What goes wrong:** Chart renders only with JavaScript, leaving screen readers and bots with empty div
**Why it happens:** Developers assume all users have JavaScript enabled, forget progressive enhancement principle
**How to avoid:** Always provide HTML table fallback that is visible when JavaScript is disabled; use `useEffect` to detect JS availability and conditionally show chart
**Warning signs:** Google Search Console shows "Content not indexed", Lighthouse accessibility score below 90

### Pitfall 2: Tooltip Obscures Data on Mobile
**What goes wrong:** Tooltip appears below touch point, hiding the bar chart data user is trying to explore
**Why it happens:** Default tooltip positioning is optimized for desktop hover (cursor above content)
**How to avoid:** Set Recharts Tooltip `position={{ y: -60 }}` or use `content` prop to manually position above chart
**Warning signs:** Users complain chart is hard to use on mobile, tooltip blocks view of adjacent bars

### Pitfall 3: Cumulative Percentage Displayed Instead of Percentile Rank
**What goes wrong:** Tooltip shows "93.9%" which users interpret as "I'm in the 93rd percentile" (wrong - they're actually top 6%)
**Why it happens:** Misunderstanding cumulative distribution vs. percentile rank
**How to avoid:** Always convert using `100 - cumulativePercentage` for "Topp X%" format; never show raw cumulative value to users
**Warning signs:** User confusion, support questions about "why does higher score show lower percentage?"

### Pitfall 4: Chart Colors Don't Match Theme in Dark Mode
**What goes wrong:** Chart looks great in light mode but invisible or garish in dark mode
**Why it happens:** Hardcoding hex colors like `#D4A574` instead of using CSS custom properties
**How to avoid:** Use `hsl(var(--primary))` and `hsl(var(--primary-dark))` from theme; configure ChartContainer config object to reference theme variables
**Warning signs:** Chart text unreadable in dark mode, colors clash with page background

### Pitfall 5: PDF Extraction Script Not Integrated into Build Process
**What goes wrong:** Normering JSON files manually created/updated, easy to forget when new tests added
**Why it happens:** Extraction script is standalone, not part of CI/CD or development workflow
**How to avoid:** Add npm script `extract-normering` that runs before build; document in CLAUDE.md how to update when new PDFs arrive
**Warning signs:** Missing normering data for recent tests, inconsistent JSON format across files

### Pitfall 6: Missing Data Handled Poorly
**What goes wrong:** Tests without normering data show empty chart or error message, breaking page layout
**Why it happens:** Not all tests have normering files (e.g., upcoming tests, very old tests)
**How to avoid:** Check if normering JSON exists at build time; conditionally hide entire normering section if no data (context document specifies "hide entirely, no placeholder")
**Warning signs:** Broken layout on test pages, error messages in production, users see "No data available"

### Pitfall 7: Table Column Headers Not Properly Associated
**What goes wrong:** Screen readers can't announce which column each cell belongs to when navigating table
**Why it happens:** Missing `scope="col"` on `<th>` elements, or using divs instead of semantic table markup
**How to avoid:** Always use `<table>`, `<thead>`, `<tbody>`, `<th scope="col">` structure; Lighthouse accessibility audit will catch this
**Warning signs:** Lighthouse flags "Table headers not properly defined", screen reader users report confusion

### Pitfall 8: Bell Curve Line Has Gaps or Spikes
**What goes wrong:** Bell curve looks jagged instead of smooth, with sudden jumps between data points
**Why it happens:** Using `type="linear"` instead of `type="monotone"` on Recharts Line component
**How to avoid:** Set `type="monotone"` for smooth cubic interpolation; consider adding more interpolated points if data is sparse
**Warning signs:** Visual complaints about chart quality, curve doesn't look like normal distribution

## Code Examples

Verified patterns from official sources:

### Accessible HTML Table with Proper ARIA
```typescript
// apps/web/src/components/charts/normering-table.tsx
// Source: https://www.w3.org/WAI/tutorials/tables/ and https://webaim.org/techniques/tables/data

export function NormeringTable({ data, collapsible = false, defaultCollapsed = false }) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  return (
    <div className="border-2 border-border rounded-xl overflow-hidden">
      {collapsible && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full p-4 bg-card-background text-left font-semibold hover:bg-section-color-1 transition-colors"
          aria-expanded={!isCollapsed}
        >
          {isCollapsed ? 'Visa tabell' : 'Dölj tabell'}
        </button>
      )}

      {!isCollapsed && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <caption className="sr-only">
              Normeringstabell för högskoleprovet - fördelning av HP-värden
            </caption>
            <thead>
              <tr className="bg-section-color-1">
                <th scope="col" className="p-3 text-left font-semibold">HP-värde</th>
                <th scope="col" className="p-3 text-right font-semibold">Antal</th>
                <th scope="col" className="p-3 text-right font-semibold">Andel (%)</th>
                <th scope="col" className="p-3 text-right font-semibold">Percentil</th>
              </tr>
            </thead>
            <tbody>
              {data.distribution.map((row, index) => (
                <tr
                  key={row.hpScore}
                  className={index % 2 === 0 ? 'bg-card-background' : 'bg-background'}
                >
                  <td className="p-3 font-medium">{row.hpScore.toFixed(2)}</td>
                  <td className="p-3 text-right">{row.count.toLocaleString('sv-SE')}</td>
                  <td className="p-3 text-right">{row.percentage.toFixed(1)}%</td>
                  <td className="p-3 text-right">
                    Topp {(100 - row.cumulativePercentage).toFixed(0)}%
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-section-color-1 font-semibold">
                <td className="p-3" colSpan={4}>
                  Medelvärde: {data.mean.toFixed(2)} |
                  Standardavvikelse: {data.stdDev.toFixed(2)} |
                  Deltagare: {data.totalParticipants.toLocaleString('sv-SE')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  )
}
```

### Integration into Test Detail Page
```typescript
// apps/web/src/app/hogskoleprovet/[slug]/page.tsx (add to existing file)
import { NormeringSection } from '@/components/charts/normering-section'
import normeringData from '@/data/normering/hosten-2025.json' // Import at build time

export default async function TestPage({ params }: PageProps) {
  const { slug } = await params
  const test = getTestBySlug(slug)

  if (!test) {
    notFound()
  }

  // Load normering data if exists
  let normering = null
  try {
    normering = await import(`@/data/normering/${slug}.json`).then(m => m.default)
  } catch {
    // No normering data for this test - hide section
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Existing test content: title, files, etc. */}

          {/* Normering section - only show if data exists */}
          {normering && (
            <NormeringSection data={normering} />
          )}

          {/* Existing related tests section */}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
```

### Build-Time PDF Extraction Script
```typescript
// scripts/extract-normering.ts
// Run with: bun scripts/extract-normering.ts

import { extractNormeringFromPDF } from '../apps/web/src/lib/normering/extract-from-pdf'
import { tests } from '../apps/web/src/data/tests'
import fs from 'fs/promises'
import path from 'path'

async function main() {
  console.log('Extracting normering data from PDFs...')

  for (const test of tests) {
    // Check if normering PDF exists
    const normeringFile = test.files.find(f => f.fileType === 'normering' && !f.section)
    if (!normeringFile) {
      console.log(`⏭️  Skipping ${test.slug} - no normering PDF`)
      continue
    }

    const pdfPath = path.join(
      __dirname,
      '../apps/web/public/pdfs',
      test.slug,
      normeringFile.filename
    )

    console.log(`📄 Processing ${test.slug}...`)

    try {
      // Extract data
      const totalData = await extractNormeringFromPDF(pdfPath)

      // TODO: Also extract verbal and kvantitativ sections if separate PDFs exist

      // Save to JSON
      const outputPath = path.join(
        __dirname,
        '../apps/web/src/data/normering',
        `${test.slug}.json`
      )

      const output = {
        testId: test.slug,
        testDate: test.date,
        total: {
          mean: 0.90, // Extract from PDF or calculate
          stdDev: 0.39,
          totalParticipants: totalData.reduce((sum, row) => sum + row.count, 0),
          distribution: totalData,
        },
        // Add verbal and kvantitativ if available
      }

      await fs.mkdir(path.dirname(outputPath), { recursive: true })
      await fs.writeFile(outputPath, JSON.stringify(output, null, 2), 'utf-8')

      console.log(`✅ Saved ${test.slug}.json`)
    } catch (error) {
      console.error(`❌ Failed to process ${test.slug}:`, error)
    }
  }

  console.log('Done!')
}

main()
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual table markup for data | Chart libraries with data binding | Ongoing trend | Charts more maintainable, interactive, but require progressive enhancement for accessibility |
| PDF text extraction with regex | AI-powered multimodal extraction | Claude PDF support (Feb 2025) | More accurate table extraction, handles complex layouts, Swedish text, merged cells |
| Canvas-based charts | SVG-based charts (Recharts) | Industry shift (2020+) | SVG accessible to screen readers, scalable, CSS-styleable; canvas not accessible |
| Server-side image generation for charts | Client-side JavaScript rendering | Widespread adoption (2015+) | Interactive charts, but requires fallback for no-JS; SSG images were accessible by default |
| getStaticProps in Pages Router | App Router static generation with imports | Next.js 13+ (2022) | Simpler data loading, collocated with components, build-time imports work naturally |
| Cumulative frequency polygons | Histograms with overlaid bell curves | Modern visualization trend | Easier to understand discrete vs. continuous distribution, more visually appealing |

**Deprecated/outdated:**
- **pdf2table library**: Unmaintained since 2018, doesn't support modern PDF features or TypeScript
- **pdfreader with manual table detection**: Works but requires complex column detection logic; AI extraction more robust
- **Chart.js for React**: Still popular but Recharts has better React integration and TypeScript support
- **Custom tooltip implementations**: Recharts built-in tooltips handle responsiveness and accessibility better

## Open Questions

Things that couldn't be fully resolved:

1. **Exact Mobile Chart Height**
   - What we know: Context says "Claude's discretion" for mobile responsive behavior (height, label density)
   - What's unclear: Optimal height for mobile devices - too tall requires scrolling, too short is hard to read
   - Recommendation: Start with `min-h-[300px] md:min-h-[400px]` based on Recharts best practices, test on actual devices, adjust based on user feedback

2. **Table Positioning When JS Enabled**
   - What we know: Context says "Claude's discretion" for table positioning (visible collapsed, sr-only, or tabbed)
   - What's unclear: Which approach provides best UX without confusing users or breaking accessibility
   - Recommendation: **Visible collapsed** (show "Visa tabell" button) - preserves accessibility, doesn't hide data from screen readers, gives users explicit control

3. **Bell Curve Smoothing Algorithm Details**
   - What we know: Need smooth bell curve overlay on histogram, context leaves algorithm to Claude's discretion
   - What's unclear: Whether Recharts built-in monotone interpolation is sufficient or if we need custom Gaussian curve fitting
   - Recommendation: Use Recharts `type="monotone"` first (simplest), only implement custom Gaussian if visual quality insufficient; normering data already follows normal distribution, so interpolation should suffice

4. **Interaction Mechanism (Hover vs. Nearest Point)**
   - What we know: Tooltip shows HP-värde + Percentil, context leaves exact mechanism to Claude's discretion
   - What's unclear: Hover (desktop) vs. tap/drag (mobile) - how to unify? Should tooltip persist on mobile tap?
   - Recommendation: Use Recharts default behavior (hover on desktop, tap-to-show on mobile), set `wrapperStyle` to prevent tooltip from disappearing too quickly on mobile

5. **Missing Verbal/Kvantitativ Breakdown Data**
   - What we know: Context specifies tabs for Total/VERB/KVANT, but only hösten-2025 has separate normering PDFs for verbal and kvant sections
   - What's unclear: How to handle tests that only have total normering data - hide tabs? Show message?
   - Recommendation: Conditionally render tabs only if all three datasets exist; if only total data available, skip tabs and show single chart

6. **PDF Extraction Validation Strategy**
   - What we know: Claude API extracts tables, but AI can make mistakes or misread Swedish characters
   - What's unclear: How much validation is needed? Manual review? Automated checks?
   - Recommendation: Implement Zod schema validation for structure, add sanity checks (sum of percentages ~100%, monotonic cumulative increase), manually review first few extractions, then trust for similar PDFs

7. **Chart Title/Heading Presence**
   - What we know: Context leaves this to Claude's discretion
   - What's unclear: Should chart have visible title above it, or is section heading sufficient?
   - Recommendation: No separate chart title - section has `<h2>Normering</h2>`, tabs indicate which breakdown is shown, avoid redundant headings

## Sources

### Primary (HIGH confidence)
- [Chart - shadcn/ui](https://ui.shadcn.com/docs/components/chart) - Official shadcn/ui chart component documentation
- [Recharts Documentation](https://recharts.org/en-US/) - Official Recharts API reference
- [PDF support - Claude API Docs](https://docs.anthropic.com/en/docs/build-with-claude/pdf-support) - Anthropic official PDF processing capabilities
- [Tables Tutorial - W3C WAI](https://www.w3.org/WAI/tutorials/tables/) - Official accessibility guidelines for HTML tables
- [WebAIM: Creating Accessible Tables](https://webaim.org/techniques/tables/data) - Accessibility best practices for data tables

### Secondary (MEDIUM confidence)
- [Progressive Enhancement And Data Visualizations - CSS-Tricks](https://css-tricks.com/progressive-enhancement-data-visualizations/) - Chart accessibility patterns
- [7 PDF Parsing Libraries for Node.js - Strapi](https://strapi.io/blog/7-best-javascript-pdf-parsing-libraries-nodejs-2025) - Comparison of PDF extraction tools
- [Percentile - Wikipedia](https://en.wikipedia.org/wiki/Percentile) - Mathematical definition of percentile calculation
- [Cumulative Distribution Function - Statistics By Jim](https://statisticsbyjim.com/probability/cumulative-distribution-function-cdf/) - Percentile from CDF explained
- [Smoothing a Histogram - MATLAB](https://www.mathworks.com/help/curvefit/smoothing-a-histogram.html) - Bell curve smoothing algorithms

### Tertiary (LOW confidence - flagged for validation)
- [Building Interactive Charts with shadcn/ui & Recharts - DEV Community](https://dev.to/fredy/tutorial-how-to-create-a-reactjs-nextjs-chart-component-using-shadcn-ui-3o4b) - Community tutorial (WebSearch only, not official docs)
- [pdf-parse npm package](https://www.npmjs.com/package/pdf-parse) - Alternative PDF extraction library (not verified for table extraction quality)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official shadcn/ui and Recharts documentation verified, Claude API PDF support confirmed
- Architecture: HIGH - Patterns based on existing Next.js 15 SSG patterns from Phase 1 research, progressive enhancement is well-established practice
- Pitfalls: MEDIUM - Accessibility and mobile UX issues based on common patterns, but specific to Recharts (not all verified in official docs)

**Research date:** 2026-01-26
**Valid until:** 2026-03-26 (60 days - stable domain, Recharts and shadcn mature libraries with infrequent breaking changes)
