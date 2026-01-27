# Phase 5: Cross-Linking & Polish - Research

**Researched:** 2026-01-27
**Domain:** Internal linking, navigation UI, OpenGraph image generation
**Confidence:** HIGH

## Summary

Phase 5 focuses on interconnecting all content through strategic internal linking and adding polish with social sharing support. The research covers four primary domains: (1) Next.js Link component patterns for optimal prefetching and navigation, (2) related content strategies for finding contextually relevant test pages, (3) breadcrumb navigation UI with full accessibility compliance, and (4) OpenGraph image generation (both static and dynamic approaches).

**Key findings:** Next.js 15's Link component provides automatic prefetching and accessibility features out of the box. For related content, simple algorithms based on chronological ordering and shared attributes (same season, adjacent years) work well for the test page structure. Breadcrumb UI requires semantic HTML (`<nav>` + `<ol>`) with `aria-label` and `aria-current` attributes. For OG images, Next.js offers both static file-based and dynamic ImageResponse API approaches, with the latter using Satori under the hood with specific CSS limitations.

**Primary recommendation:** Start with visual breadcrumbs using shadcn/ui component, implement contextual links using descriptive anchor text with varied patterns, use chronological + attribute-based algorithms for related tests, and begin with static OG images (simplest path) while keeping dynamic generation as a future upgrade option.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next/link | Next.js 15 | Client-side navigation with prefetching | Built-in, optimized for Next.js routing |
| next/og | Next.js 15 | Dynamic OG image generation via ImageResponse | Official Next.js solution for dynamic social images |
| shadcn/ui breadcrumb | Latest | Accessible breadcrumb component | ARIA-compliant, integrates with existing shadcn setup |
| React hooks (usePathname) | React 18+ | Active route detection for link styling | Client component standard for navigation state |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| schema-dts | Latest | TypeScript types for BreadcrumbList JSON-LD | Already used in Phase 2 for structured data |
| @vercel/og fonts | N/A | Custom font loading in ImageResponse | Only if dynamic OG images need custom typography |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| shadcn breadcrumb | Custom component | Shadcn provides accessibility built-in, no need to reinvent |
| ImageResponse API | Canvas-based generation (Playwright) | ImageResponse is simpler, no browser automation needed |
| Related posts algorithm | ML-based similarity | Overkill for structured historical test data with clear attributes |

**Installation:**
```bash
# Breadcrumb component (shadcn CLI)
npx shadcn@latest add breadcrumb

# No additional packages needed - next/link and next/og are built into Next.js 15
```

## Architecture Patterns

### Recommended Project Structure
```
apps/web/src/
├── app/
│   ├── opengraph-image.tsx         # Root OG image (static or dynamic)
│   └── hogskoleprovet/
│       ├── [slug]/
│       │   └── opengraph-image.tsx # Test-specific OG images (dynamic)
│       └── strategier/              # Future: strategy pages (Phase 4)
│           └── [slug]/
│               └── opengraph-image.tsx
├── components/
│   ├── navigation/
│   │   ├── breadcrumbs.tsx         # Visual breadcrumb component
│   │   └── related-tests.tsx       # Related tests section
│   └── ui/
│       └── breadcrumb.tsx          # shadcn breadcrumb primitives
└── lib/
    ├── related-content.ts          # Related test algorithm
    └── og-templates/               # Reusable OG image layouts
        └── test-card.tsx
```

### Pattern 1: Link Component with Prefetching
**What:** Use Next.js Link for all internal navigation to enable automatic prefetching
**When to use:** Every internal link in the app
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/components/link
import Link from 'next/link'

// Basic usage with automatic prefetching (production only)
<Link href="/hogskoleprovet/hosten-2024">
  Hösten 2024
</Link>

// Disable prefetch for links that are rarely visited
<Link href="/arkiv" prefetch={false}>
  Arkiv
</Link>

// Active link styling (client component)
'use client'
import { usePathname } from 'next/navigation'

const pathname = usePathname()
<Link
  href="/strategier"
  className={pathname.startsWith('/strategier') ? 'active' : ''}
>
  Strategier
</Link>
```

### Pattern 2: Contextual Internal Links with Descriptive Anchor Text
**What:** Links within content body using natural, descriptive anchor text
**When to use:** Strategy page → test page links, test page → strategy page links
**Example:**
```typescript
// Source: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
// GOOD: Descriptive, contextual anchor text
<p>
  För att förstå hur XYZ-frågor fungerar, ladda ner{' '}
  <Link href="/hogskoleprovet/hosten-2025">
    högskoleprovet från hösten 2025
  </Link>
  {' '}och träna på provpass 1.
</p>

// BAD: Generic anchor text
<p>
  För att träna mer, <Link href="/hogskoleprovet/hosten-2025">klicka här</Link>.
</p>

// Anchor text variety (mix these patterns):
// - Exact match (5-10%): "högskoleprovet hösten 2025"
// - Partial match (30-40%): "provfrågor från hösten 2025"
// - Semantic (50-60%): "träna med riktiga prov", "ladda ner gamla prov"
```

### Pattern 3: Related Content Algorithm
**What:** Find related tests based on chronological proximity and shared attributes
**When to use:** "Fler högskoleprov" section on test detail pages
**Example:**
```typescript
// Simple algorithm for test pages
import { tests, type Test } from '@/data/tests'

export function getRelatedTests(currentTest: Test, limit: number = 4): Test[] {
  return tests
    .filter(t => t.id !== currentTest.id) // Exclude current test
    .sort((a, b) => {
      // Sort by date descending (most recent first)
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .slice(0, limit)
}

// Enhanced: Same season + adjacent years
export function getRelatedTestsSmart(currentTest: Test, limit: number = 4): Test[] {
  const related = tests
    .filter(t => t.id !== currentTest.id)
    .map(t => ({
      test: t,
      score: calculateRelevanceScore(currentTest, t)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(r => r.test)

  return related
}

function calculateRelevanceScore(current: Test, candidate: Test): number {
  let score = 0

  // Same season: +10 points
  if (current.season === candidate.season) score += 10

  // Year proximity: -1 point per year difference
  const yearDiff = Math.abs(current.year - candidate.year)
  score -= yearDiff

  // Recency bonus: newer tests get slight boost
  const ageInYears = new Date().getFullYear() - candidate.year
  score += Math.max(0, 5 - ageInYears)

  return score
}
```

### Pattern 4: Accessible Breadcrumb Navigation
**What:** Semantic breadcrumb with ARIA attributes for navigation landmark
**When to use:** All pages with hierarchical structure (test detail, strategy pages)
**Example:**
```typescript
// Source: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
// Using shadcn/ui breadcrumb component
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function TestBreadcrumbs({ test }: { test: Test }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Hem</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/hogskoleprovet">
            Gamla prov
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>
            {formatSeasonLabel(test.season)} {test.year}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

// Manual implementation (if not using shadcn)
<nav aria-label="Breadcrumb">
  <ol className="flex items-center gap-2">
    <li><Link href="/">Hem</Link></li>
    <li aria-hidden="true">/</li>
    <li><Link href="/hogskoleprovet">Gamla prov</Link></li>
    <li aria-hidden="true">/</li>
    <li><span aria-current="page">Hösten 2025</span></li>
  </ol>
</nav>
```

### Pattern 5: Static OpenGraph Images
**What:** Place static PNG/JPG files in route segments for OG images
**When to use:** Start here for simplicity; upgrade to dynamic later if needed
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image

// File structure:
// app/opengraph-image.png (1200x630)
// app/opengraph-image.alt.txt ("Maxa - Högskoleprovet Prep")
// app/hogskoleprovet/opengraph-image.png
// app/hogskoleprovet/[slug]/opengraph-image.png (if dynamic, use .tsx)

// Next.js automatically adds these meta tags:
// <meta property="og:image" content="https://maxa.se/opengraph-image.png" />
// <meta property="og:image:type" content="image/png" />
// <meta property="og:image:width" content="1200" />
// <meta property="og:image:height" content="1200" />

// File constraints:
// - OpenGraph: Max 8MB
// - Twitter: Max 5MB
// - Formats: .jpg, .jpeg, .png, .gif
```

### Pattern 6: Dynamic OpenGraph Images
**What:** Generate OG images on-demand using ImageResponse API
**When to use:** When content varies per page (test-specific, strategy-specific)
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/image-response
// File: app/hogskoleprovet/[slug]/opengraph-image.tsx

import { ImageResponse } from 'next/og'
import { getTestBySlug } from '@/data/tests'

export const alt = 'Högskoleprovet - Maxa'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const test = getTestBySlug(slug)

  if (!test) return new Response('Not found', { status: 404 })

  const seasonLabel = test.season === 'vår' ? 'Våren' : 'Hösten'

  return new ImageResponse(
    (
      <div style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1E1A2D',
        color: '#F5F5F5',
      }}>
        <div style={{ fontSize: 72, fontWeight: 'bold' }}>
          Högskoleprovet
        </div>
        <div style={{ fontSize: 60, marginTop: 20 }}>
          {seasonLabel} {test.year}
        </div>
        <div style={{ fontSize: 32, marginTop: 40, opacity: 0.8 }}>
          PDF, Facit & Normering | Maxa
        </div>
      </div>
    ),
    { ...size }
  )
}
```

### Anti-Patterns to Avoid
- **Generic anchor text**: "Click here", "Read more" - no SEO value, poor accessibility
- **Link stuffing**: Too many links in one paragraph - dilutes link equity, confuses users
- **External-looking internal links**: Using `target="_blank"` for internal navigation
- **Client-side only navigation**: Not using Link component, breaking prefetch optimization
- **Non-semantic breadcrumbs**: Missing `<nav>`, `aria-label`, or `aria-current` attributes
- **Canvas-only OG images**: Using complex libraries when ImageResponse suffices

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Breadcrumb component | Custom div-based breadcrumbs | shadcn/ui breadcrumb | ARIA compliance is complex; shadcn handles `aria-current`, `aria-label`, semantic HTML automatically |
| Active link detection | Custom context or prop drilling | `usePathname()` hook | Built-in Next.js hook, optimized for client components, handles edge cases |
| OG image generation | Puppeteer/Playwright screenshot | ImageResponse API | 500KB vs 50MB bundle size, no browser automation, built into Next.js |
| Related content UI | Manual sorting and filtering JSX | Reusable component with algorithm | Algorithm complexity grows (same category, date proximity, exclusions) |
| Link prefetching | Custom intersection observer | Link component default behavior | Next.js handles viewport detection, production/dev modes, static vs dynamic routes |

**Key insight:** Next.js 15 provides built-in solutions for most navigation and social sharing needs. The ecosystem (shadcn, React hooks) fills remaining gaps. Custom implementations add maintenance burden without meaningful benefits for this use case.

## Common Pitfalls

### Pitfall 1: ImageResponse CSS Limitations
**What goes wrong:** Developers try to use CSS Grid, animations, or complex layouts in ImageResponse, leading to broken OG images
**Why it happens:** ImageResponse uses Satori, which only supports Flexbox and a subset of CSS properties
**How to avoid:**
- Stick to Flexbox layouts (`display: flex`, `flexDirection`, `alignItems`, `justifyContent`)
- Use inline styles only (no external stylesheets)
- Test images locally before deploying
- Avoid: `display: grid`, `position: sticky`, `transform: rotate3d()`, `z-index`, WOFF2 fonts
**Warning signs:**
- Image doesn't render at all (returns empty PNG)
- Layout breaks when using CSS Grid
- Fonts don't load (check format: use TTF/OTF, not WOFF2)

### Pitfall 2: Missing metadataBase Breaks OG URLs
**What goes wrong:** OpenGraph URLs show as relative paths (`/opengraph-image.png`) instead of absolute URLs, breaking social media previews
**Why it happens:** Next.js requires `metadataBase` in root layout for relative metadata URLs to resolve correctly
**How to avoid:**
- Set `metadataBase: new URL('https://maxa.se')` in root layout metadata (already done)
- Use relative paths in page-level metadata, let Next.js resolve to absolute
- Verify with Facebook Debugger or Twitter Card Validator
**Warning signs:**
- Social media preview shows broken image
- `og:image` meta tag contains relative URL instead of `https://...`
- LinkedIn/Facebook/Twitter don't fetch image

### Pitfall 3: Breadcrumb Without aria-current
**What goes wrong:** Screen readers don't announce current page in breadcrumb trail
**Why it happens:** Developers forget `aria-current="page"` on the final breadcrumb item
**How to avoid:**
- Always add `aria-current="page"` to the last item in breadcrumb
- Use shadcn breadcrumb component (handles this automatically via `<BreadcrumbPage>`)
- Test with screen reader (VoiceOver on Mac, NVDA on Windows)
**Warning signs:**
- Accessibility audit flags missing `aria-current`
- Screen reader doesn't differentiate current page from links

### Pitfall 4: Over-Prefetching Rare Links
**What goes wrong:** Next.js prefetches every link on page load, causing unnecessary network requests and slower performance
**Why it happens:** Default prefetch behavior (`prefetch={true}` or `null`) works for common navigation but hurts with many rarely-used links
**How to avoid:**
- Use `prefetch={false}` for footer links, archive pages, rarely visited routes
- Keep default prefetch for primary navigation (header, related content)
- Monitor Network tab for excessive prefetch requests
**Warning signs:**
- Waterfall of prefetch requests in DevTools Network tab
- Slow page load on initial visit
- High bandwidth usage reported by users

### Pitfall 5: Anchor Text Patterns Too Uniform
**What goes wrong:** All internal links use exact-match anchor text (e.g., "högskoleprovet hösten 2024"), triggering over-optimization flags
**Why it happens:** Developers optimize for SEO but forget natural language variation
**How to avoid:**
- Mix anchor text types: 5-10% exact match, 30-40% partial match, 50-60% semantic/branded
- Use contextual phrases: "träna med provfrågor från hösten 2024" not just "hösten 2024"
- Write for humans first, SEO second
- Vary patterns across pages (don't template all links identically)
**Warning signs:**
- All links to a page use identical anchor text
- Anchor text looks unnatural in sentence flow
- SEO tools flag "over-optimized internal links"

### Pitfall 6: Related Tests Algorithm Too Complex
**What goes wrong:** Developers build ML-based or complex similarity algorithms for related content, slowing SSG and adding maintenance burden
**Why it happens:** Over-engineering for a simple chronological content structure
**How to avoid:**
- Start with chronological + attribute matching (same season, year proximity)
- Keep algorithm synchronous and fast (runs at build time for SSG)
- Avoid database queries or external APIs in related content logic
- Test with `bun dev:web` to ensure fast page generation
**Warning signs:**
- Build time increases significantly with related content enabled
- Algorithm requires database queries or external services
- Related content feels random or irrelevant (signals bad algorithm)

## Code Examples

Verified patterns from official sources:

### Link with Active Styling (Client Component)
```typescript
// Source: https://nextjs.org/docs/app/api-reference/components/link
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavigationLinks() {
  const pathname = usePathname()

  return (
    <nav>
      <Link
        href="/hogskoleprovet"
        className={pathname === '/hogskoleprovet' ? 'text-primary font-bold' : 'text-foreground'}
      >
        Gamla prov
      </Link>
      <Link
        href="/strategier"
        className={pathname.startsWith('/strategier') ? 'text-primary font-bold' : 'text-foreground'}
      >
        Strategier
      </Link>
    </nav>
  )
}
```

### Related Tests Section
```typescript
// File: components/navigation/related-tests.tsx
import Link from 'next/link'
import { tests, type Test } from '@/data/tests'

export function RelatedTests({ currentTest }: { currentTest: Test }) {
  const related = tests
    .filter(t => t.id !== currentTest.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4)

  return (
    <section className="mt-16 pt-8 border-t border-border">
      <h2 className="text-xl font-bold text-foreground mb-4">
        Fler högskoleprov
      </h2>
      <div className="grid gap-3">
        {related.map(t => (
          <Link
            key={t.id}
            href={`/hogskoleprovet/${t.slug}`}
            className="flex items-center justify-between p-4 bg-card-background rounded-xl border-2 border-border hover:border-primary transition-colors group"
          >
            <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {t.season === 'vår' ? 'Våren' : 'Hösten'} {t.year}
            </span>
            <span className="text-foreground-muted group-hover:text-primary">→</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
```

### Contextual Link in Content
```typescript
// Strategy page example
<p className="text-foreground mb-4">
  XYZ-frågor är kända för att innehålla distraktorer som ser korrekta ut men
  innehåller små fel. För att träna på att upptäcka dessa mönster, öva med{' '}
  <Link
    href="/hogskoleprovet/hosten-2025"
    className="text-primary hover:underline"
  >
    provpass 1 från hösten 2025
  </Link>
  {' '}där flera typiska XYZ-fallor förekommer.
</p>
```

### Breadcrumb Component (shadcn)
```typescript
// Source: https://ui.shadcn.com/docs/components/breadcrumb
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function TestBreadcrumbs({ test }: { test: Test }) {
  const seasonLabel = test.season === 'vår' ? 'Våren' : 'Hösten'

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Hem</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/hogskoleprovet">Gamla prov</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{seasonLabel} {test.year}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
```

### Static OG Image Setup
```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image

// File: app/opengraph-image.png (1200x630 static image)
// File: app/opengraph-image.alt.txt
// Content: "Maxa - Högskoleprovet Prep. Gamifierad träning och AI-coach."

// Next.js auto-generates these tags:
// <meta property="og:image" content="https://maxa.se/opengraph-image.png" />
// <meta property="og:image:alt" content="Maxa - Högskoleprovet Prep..." />
// <meta property="og:image:width" content="1200" />
// <meta property="og:image:height" content="630" />
// <meta property="og:image:type" content="image/png" />
```

### Dynamic OG Image (Minimal)
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/image-response
// File: app/hogskoleprovet/[slug]/opengraph-image.tsx

import { ImageResponse } from 'next/og'
import { getTestBySlug } from '@/data/tests'

export const alt = 'Högskoleprovet - Maxa'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const test = getTestBySlug(slug)

  if (!test) return new Response('Not found', { status: 404 })

  const seasonLabel = test.season === 'vår' ? 'Våren' : 'Hösten'

  return new ImageResponse(
    (
      <div style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1E1A2D', // card-background dark mode
        color: '#F5F5F5',
        fontFamily: 'sans-serif',
      }}>
        <div style={{ fontSize: 72, fontWeight: 'bold', marginBottom: 20 }}>
          Högskoleprovet
        </div>
        <div style={{ fontSize: 60 }}>
          {seasonLabel} {test.year}
        </div>
        <div style={{
          fontSize: 32,
          marginTop: 40,
          opacity: 0.8,
          textAlign: 'center',
        }}>
          PDF, Facit & Normering
        </div>
      </div>
    ),
    { ...size }
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual breadcrumbs with divs | Semantic `<nav>` + `<ol>` + ARIA | 2021 WCAG 2.1 AA | Screen readers can navigate breadcrumbs as landmark |
| Generic "click here" links | Descriptive contextual anchor text | Ongoing SEO evolution | Better accessibility, stronger internal linking signals |
| Static OG images only | Dynamic ImageResponse API | Next.js 13+ (2022) | Per-page customization without image editing tools |
| Canvas-based OG generation (Puppeteer) | Satori/ImageResponse (Flexbox + JSX) | 2022-2023 | Lighter bundle size (500KB vs 50MB), faster generation |
| Prefetch all links | Selective prefetch with `prefetch` prop | Next.js 13+ | Reduced bandwidth usage, faster initial page load |

**Deprecated/outdated:**
- **legacyBehavior on Link**: Removed in Next.js 15, no longer needed for custom components
- **WOFF2 in ImageResponse**: Not supported by Satori; use TTF/OTF instead
- **External stylesheets in OG images**: ImageResponse requires inline styles only

## Open Questions

Things that couldn't be fully resolved:

1. **Strategy page URLs**
   - What we know: Phase 4 will create strategy pages at `/strategier/[slug]`
   - What's unclear: Final URL structure and slug format not determined yet
   - Recommendation: Use placeholder paths in research examples; planner will define exact structure when Phase 4 CONTEXT.md exists

2. **Related content complexity threshold**
   - What we know: Simple chronological + attribute algorithms work well for test pages
   - What's unclear: Whether strategy pages need different related content logic (by topic vs chronology)
   - Recommendation: Start simple for test pages; revisit for strategy pages in Phase 4 planning

3. **OG image brand assets**
   - What we know: Maxa logo/brand colors exist in design system
   - What's unclear: Whether logo files are available in format suitable for ImageResponse (TTF/OTF/PNG as base64)
   - Recommendation: Start with text-only OG images; can add logo in future iteration if assets are available

## Sources

### Primary (HIGH confidence)
- [Next.js Link Component API](https://nextjs.org/docs/app/api-reference/components/link) - Link features, prefetching, active styling
- [Next.js OpenGraph Image API](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) - Static and dynamic OG image generation
- [Next.js ImageResponse API](https://nextjs.org/docs/app/api-reference/functions/image-response) - Dynamic image generation with JSX
- [W3C WAI-ARIA Breadcrumb Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/) - Accessibility requirements for breadcrumbs
- [Google SEO Link Best Practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) - Crawlable links and anchor text guidance
- [shadcn/ui Breadcrumb Component](https://ui.shadcn.com/docs/components/breadcrumb) - React breadcrumb implementation

### Secondary (MEDIUM confidence)
- [Internal Linking Strategy Guide 2026](https://www.ideamagix.com/blog/internal-linking-strategy-seo-guide-2026/) - Topic clusters and pillar pages
- [Internal Linking SEO Benefits 2026](https://www.clickrank.ai/internal-links-in-seo/) - Link equity distribution and AI impact
- [Anchor Text Optimization Guide](https://www.seoclarity.net/blog/anchor-text-seo) - Natural anchor text patterns and variety
- [Complete Guide to Dynamic OG Images in Next.js 15](https://www.buildwithmatija.com/blog/complete-guide-dynamic-og-image-generation-for-next-js-15) - ImageResponse implementation examples
- [React Aria Breadcrumbs](https://react-spectrum.adobe.com/react-aria/Breadcrumbs.html) - aria-current implementation patterns

### Tertiary (LOW confidence)
- WordPress related posts plugins - General related content algorithm concepts, not directly applicable to Next.js
- Social media algorithm articles - Chronological vs algorithmic feeds, tangential to web navigation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Next.js APIs, established patterns, shadcn component library
- Architecture: HIGH - Patterns verified from official docs and W3C standards
- Pitfalls: HIGH - Based on official documentation limitations (Satori CSS support, metadataBase requirement) and community experiences

**Research date:** 2026-01-27
**Valid until:** 30 days (stable domain - Next.js 15 is current stable, WAI-ARIA patterns don't change frequently)
