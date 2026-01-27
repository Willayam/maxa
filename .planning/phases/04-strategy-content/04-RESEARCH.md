# Phase 04: Strategy Content - Research

**Researched:** 2026-01-27
**Domain:** SEO content pages, Swedish educational content, Next.js static generation
**Confidence:** HIGH

## Summary

Research focused on the technical stack and content architecture patterns for creating comprehensive Swedish-language strategy guide pages for Högskoleprovet test preparation. The investigation covered Next.js 15 SEO best practices, content hub architecture, URL structure, component patterns, and Swedish educational content organization.

**Key findings:**
- Static Site Generation (SSG) is the gold standard for SEO content pages in Next.js 15, providing pre-rendered HTML for optimal search engine crawling and performance
- Content hub architecture with pillar-and-spoke model (hub page + cluster pages) is the dominant pattern for educational content in 2026, generating 4x more traffic than isolated posts
- Swedish URLs should use plain Swedish words without special characters (å→a, ä→a, ö→o) and follow hierarchical patterns under existing domain structure
- React TSX is superior to MDX for this use case due to full control, existing design system integration, and minimal content management overhead
- Long-form educational content requires specific mobile-first patterns: TL;DR summaries, visual callouts, progressive disclosure, and scannable formatting

**Primary recommendation:** Build static React TSX pages under `/hogskoleprovet/strategier/*` with pillar-hub architecture, leveraging existing Maxa design system components and Next.js 15's Metadata API for SEO.

## Standard Stack

The established libraries/tools for SEO content pages in Next.js 15:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.x | React framework with SSG | Industry standard for SEO-optimized content sites; built-in static generation, Metadata API, and optimal Core Web Vitals |
| React TSX | 18.x+ | Component-based UI | Full flexibility for educational content with interactive components; better than MDX for design system integration |
| Tailwind CSS | 4.x | Utility-first styling | Already in use at Maxa; semantic tokens system via CSS variables supports consistent theming |
| TypeScript | 5.x+ | Type safety | Required for Next.js metadata typing and component props |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| next-themes | Latest | Theme detection | Already implemented for dark/light mode; respects OS preferences |
| @vercel/analytics | Latest | Performance tracking | Monitor Core Web Vitals for SEO rankings |
| JSON-LD | Native | Structured data | SEO-critical for educational content; use for BreadcrumbList and Article schema |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| React TSX | MDX | MDX offers easier authoring but lacks flexibility; can't import one-off components; overkill for 4 static pages |
| SSG | ISR (Incremental Static Regeneration) | ISR adds complexity; content rarely changes; SSG is simpler and faster |
| Flat URLs | Deep hierarchy | Flat `/strategier/*` is cleaner than `/strategier/fallor/kvantitativa`; content scope is small (4 pages) |

**Installation:**
```bash
# Core dependencies already installed in Next.js 15 project
# No additional packages required for this phase
```

## Architecture Patterns

### Recommended Project Structure
```
apps/web/src/app/
├── hogskoleprovet/           # Existing test library section
│   ├── page.tsx              # List of tests
│   ├── [slug]/               # Individual test pages
│   └── strategier/           # NEW: Strategy content hub
│       ├── page.tsx          # Hub/pillar page
│       ├── kvantitativa-fallor/
│       │   └── page.tsx      # Cluster page
│       ├── verbala-fallor/
│       │   └── page.tsx      # Cluster page
│       ├── vanliga-misstag/
│       │   └── page.tsx      # Cluster page
│       └── tidsstrategi/
│           └── page.tsx      # Cluster page
```

### Pattern 1: Content Hub (Pillar + Spoke)
**What:** A hub page that serves as the main entry point, linking to detailed cluster pages for each subtopic.
**When to use:** When you have 3-6 related content pages that collectively cover a broad topic (e.g., "HP strategies").
**Why it works:** Content hubs generate 4x more traffic than isolated posts, build topical authority, and create natural internal linking structure that search engines reward.

**Example structure:**
```typescript
// apps/web/src/app/hogskoleprovet/strategier/page.tsx
export const metadata: Metadata = {
  title: "HP Strategier - Knäck Högskoleprovet | Maxa",
  description: "Lär dig de viktigaste strategierna för att maximera ditt resultat på högskoleprovet. Fallor, misstag och tidsplanering.",
  // ... canonical, OG tags
};

export default function StrategierHubPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* TL;DR summary at top */}
      <section className="bg-primary-light border-2 border-primary rounded-2xl p-6 mb-8">
        <h2>Snabbguide</h2>
        <ul>{/* Key takeaways */}</ul>
      </section>

      {/* Grid of cluster page cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <ClusterCard
          title="Kvantitativa fallor"
          description="XYZ, KVA, NOG, DTK"
          href="/hogskoleprovet/strategier/kvantitativa-fallor"
        />
        {/* ... more cards */}
      </div>
    </div>
  );
}
```

### Pattern 2: Static Generation with Metadata API
**What:** Use Next.js 15's `generateMetadata` function for SEO-optimized meta tags on each page.
**When to use:** Every content page in the strategy section.
**How:**
```typescript
// Source: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: "Kvantitativa Fallor - HP Strategier | Maxa",
    description: "Lär dig undvika de vanligaste fällorna i XYZ, KVA, NOG och DTK...",
    keywords: ["högskoleprovet", "kvantitativa delen", "hp fällor", "matematik hp"],
    alternates: {
      canonical: '/hogskoleprovet/strategier/kvantitativa-fallor',
    },
    openGraph: {
      title: "Kvantitativa Fallor - HP Strategier",
      description: "Lär dig undvika de vanligaste fällorna...",
      type: "article",
      url: '/hogskoleprovet/strategier/kvantitativa-fallor',
    },
  };
}
```

### Pattern 3: TL;DR + Section Summaries + Recap
**What:** Three-tier summary strategy throughout long-form content.
**Rationale:** Mobile-first design requires scannable content. Nielsen Norman Group research shows summaries increase engagement with long-form content.

**Structure:**
```typescript
// TL;DR at top (3-5 bullets, distinct visual treatment)
<section className="bg-primary-light border-2 border-primary rounded-2xl p-6 mb-8">
  <h2 className="text-xl font-bold mb-4">TL;DR</h2>
  <ul className="space-y-2">
    <li>• Key point 1</li>
    <li>• Key point 2</li>
  </ul>
</section>

// Section summaries throughout (after each major section)
<div className="bg-card-background border-l-4 border-primary p-4 my-6">
  <p className="font-semibold mb-2">Sammanfattning:</p>
  <p className="text-foreground-muted">{/* Brief recap */}</p>
</div>

// Final recap at end (numbered list of all sections)
<section className="border-t-2 border-border pt-8 mt-12">
  <h2 className="text-2xl font-bold mb-4">Sammanfattning</h2>
  <ol className="list-decimal list-inside space-y-3">
    {/* Recap all major sections */}
  </ol>
</section>
```

### Pattern 4: Callouts and Visual Hierarchy
**What:** Use callouts to highlight important information, warnings, examples, or definitions.
**Research finding:** Users are significantly more likely to notice callout text when it has distinct visual treatment.

**Types:**
```typescript
// Warning callout (common mistake)
<div className="bg-error/10 border-2 border-error rounded-xl p-4 my-4">
  <p className="font-bold text-error mb-2">⚠️ Varning: Vanligt misstag</p>
  <p>{/* Explanation */}</p>
</div>

// Pro tip callout
<div className="bg-success/10 border-2 border-success rounded-xl p-4 my-4">
  <p className="font-bold text-success mb-2">💡 Proffstips</p>
  <p>{/* Tip */}</p>
</div>

// Example callout
<div className="bg-card-background border-2 border-border rounded-xl p-4 my-4">
  <p className="font-bold mb-2">📝 Exempel</p>
  <p>{/* Example with before/after */}</p>
</div>
```

### Anti-Patterns to Avoid
- **Duplicate content in URLs**: Don't include `/strategier/fallor/kvantitativa-fallor` when `/strategier/kvantitativa-fallor` is clearer
- **Swedish characters in URLs**: Avoid `/strategier/kvantitativa-fällor` — use `/kvantitativa-fallor` instead (ä→a)
- **Date-based URLs**: Never use `/strategier/2026/kvantitativa-fallor` — dates make content appear stale
- **Too many callouts**: Overusing callouts (>3 per screen) overwhelms users and dilutes effectiveness
- **Deep page hierarchies**: Flat is better for small content sets; keep pages 3 clicks from homepage

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Structured data (JSON-LD) | Manual JSON strings | `lib/structured-data.ts` helpers | Already exists in codebase; provides `generateArticleJsonLd` and `generateBreadcrumbJsonLd` |
| Dark/light theme | Custom theme toggle logic | `next-themes` (already installed) | Theme follows OS preference automatically; no manual toggle needed |
| Metadata generation | Hardcoded `<meta>` tags | Next.js 15 Metadata API | Type-safe, supports dynamic generation, better for SEO |
| Mobile-responsive layout | Custom breakpoint logic | Tailwind responsive utilities | `md:`, `lg:` prefixes handle all responsive needs |
| URL normalization | String manipulation for Swedish chars | URL normalization library or build-time transformation | Swedish chars (å,ä,ö) must be consistently transformed; edge cases exist |
| Content table of contents | Manual anchor link generation | Rehype/Remark plugins or client-side IntersectionObserver | Auto-generates ToC from headings; handles ID conflicts |

**Key insight:** Next.js 15 + Tailwind CSS + TypeScript already provides 90% of what's needed. The existing Maxa design system (semantic tokens, 3D buttons, card components) can be reused directly. Don't rebuild what already works.

## Common Pitfalls

### Pitfall 1: Ignoring Core Web Vitals for SEO
**What goes wrong:** Content pages load slowly due to large images, unoptimized fonts, or render-blocking JavaScript.
**Why it happens:** Developers focus on functionality and forget that Google uses page performance as a ranking factor.
**How to avoid:**
- Use Next.js `<Image>` component for automatic optimization
- Preload Nunito font (already in `layout.tsx`)
- Avoid client-side JavaScript unless necessary (use SSG)
- Test with Lighthouse and aim for scores >90

**Warning signs:**
- Largest Contentful Paint (LCP) >2.5s
- Cumulative Layout Shift (CLS) >0.1
- First Input Delay (FID) >100ms

### Pitfall 2: Weak Internal Linking Structure
**What goes wrong:** Strategy pages exist in isolation without linking to related content (test pages, other strategy pages).
**Why it happens:** Content creators forget that internal links are critical for SEO and user engagement.
**How to avoid:**
- Hub page must link to all cluster pages
- Each cluster page must link back to hub
- Link to relevant test pages (e.g., "Practice with hösten 2025")
- Create "Related strategies" section at bottom of each page

**Warning signs:**
- Pages have <3 internal links
- Users can't navigate between related pages without using back button
- Google Search Console shows low crawl depth

### Pitfall 3: Non-Scannable Long-Form Content
**What goes wrong:** Dense walls of text with no visual breaks, making content unreadable on mobile.
**Why it happens:** Desktop-first mindset; copying academic writing style instead of web writing.
**How to avoid:**
- Use Nielsen Norman Group formatting techniques:
  - Descriptive headings every 2-3 paragraphs
  - Bulleted lists for enumerations
  - Callouts for key information
  - Whitespace between sections
- Test on mobile devices (320px width)
- Aim for <4 sentences per paragraph

**Warning signs:**
- Users scroll past content without reading
- High bounce rate (>70%)
- Average time on page <1 minute for 2000+ word articles

### Pitfall 4: Ignoring Swedish SEO Best Practices
**What goes wrong:** Using English keywords, neglecting Swedish-specific search patterns, or poor translation.
**Why it happens:** Assuming Swedish SEO is identical to English SEO.
**How to avoid:**
- Use Swedish keywords exclusively: "högskoleprovet strategier", "hp fällor", "kvantitativa delen tips"
- Research Swedish search intent (Swedes search in Swedish even if they speak English)
- Use "du-tilltal" (informal address) consistently — this matches user expectations for test prep content
- Normalize Swedish chars in URLs: fällor → fallor

**Warning signs:**
- No organic traffic from Swedish searches
- Keywords targeting English terms
- URLs contain %C3%A5 (URL-encoded å)

### Pitfall 5: Inconsistent Content Depth Across Pages
**What goes wrong:** Some pages are comprehensive (2000+ words) while others are thin (300 words), creating quality inconsistency.
**Why it happens:** Using source material unevenly or running out of time.
**How to avoid:**
- Set minimum word count targets: 1500-2500 words per cluster page
- Each page should cover: What, Why, How, Examples, Common mistakes
- Use source material (Högskoleprovets fällor och strategier-v2.md) consistently
- Fill gaps with web research, not padding

**Warning signs:**
- Some pages rank well, others don't appear in search results
- User complaints about incomplete information
- High exit rates from thin pages

### Pitfall 6: Over-Optimizing for Keywords (Keyword Stuffing)
**What goes wrong:** Forcing "högskoleprovet" or "HP" into every sentence unnaturally.
**Why it happens:** Misunderstanding modern SEO; focusing on keyword density instead of semantic relevance.
**How to avoid:**
- Write for humans first, search engines second
- Use synonyms and related terms: "provet", "testet", "HP", "högskoleprovet"
- Focus on topical authority (comprehensive coverage) over keyword density
- Google's algorithms prioritize content that demonstrates expertise

**Warning signs:**
- Content sounds robotic or repetitive
- Keywords appear in unnatural positions
- Google Search Console shows "thin content" warnings

## Code Examples

Verified patterns from existing Maxa codebase and Next.js 15 official docs:

### Hub Page Card Grid
```typescript
// Reuse existing pattern from /hogskoleprovet/page.tsx
function ClusterCard({
  title,
  description,
  href,
  icon
}: {
  title: string;
  description: string;
  href: string;
  icon?: string;
}) {
  return (
    <Link
      href={href}
      className="block p-6 bg-card-background rounded-2xl border-2 border-border hover:border-primary transition-colors group"
    >
      <div className="flex items-start gap-4">
        {icon && <span className="text-4xl">{icon}</span>}
        <div>
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
            {title}
          </h3>
          <p className="text-foreground-muted">{description}</p>
        </div>
      </div>
      <span className="text-primary font-bold mt-4 inline-block">
        Läs mer →
      </span>
    </Link>
  );
}

// Usage in hub page
<div className="grid gap-6 md:grid-cols-2">
  <ClusterCard
    title="Kvantitativa fallor"
    description="Lär dig undvika fällorna i XYZ, KVA, NOG och DTK"
    href="/hogskoleprovet/strategier/kvantitativa-fallor"
    icon="🔢"
  />
  <ClusterCard
    title="Verbala fallor"
    description="Undvik misstagen i ORD, LÄS, MEK och ELF"
    href="/hogskoleprovet/strategier/verbala-fallor"
    icon="📚"
  />
</div>
```

### Page Layout with Navigation
```typescript
// Source: Existing pattern from /hogskoleprovet/[slug]/page.tsx
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import Link from "next/link";

export default function KvantitativaFallorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb back to hub */}
          <Link
            href="/hogskoleprovet/strategier"
            className="text-foreground-muted hover:text-primary transition-colors mb-6 inline-flex items-center gap-2"
          >
            <span>←</span> Strategier
          </Link>

          {/* Article content */}
          <article className="prose prose-invert max-w-none">
            <h1 className="text-4xl font-extrabold text-foreground mb-4">
              Kvantitativa fallor
            </h1>
            {/* Content sections */}
          </article>

          {/* Related links */}
          <section className="mt-16 pt-8 border-t border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Relaterade strategier
            </h2>
            {/* Links to other cluster pages */}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
```

### JSON-LD Structured Data
```typescript
// Source: Existing pattern from lib/structured-data.ts
import { JsonLd, generateArticleJsonLd, generateBreadcrumbJsonLd } from "@/lib/structured-data";

export default function ContentPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Kvantitativa Fallor på Högskoleprovet",
    "description": "Lär dig undvika de vanligaste fällorna...",
    "author": {
      "@type": "Organization",
      "name": "Maxa"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Maxa",
      "logo": {
        "@type": "ImageObject",
        "url": "https://maxahp.se/logo.png"
      }
    },
    "datePublished": "2026-01-27",
    "dateModified": "2026-01-27"
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Hem",
        "item": "https://maxahp.se"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Högskoleprovet",
        "item": "https://maxahp.se/hogskoleprovet"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Strategier",
        "item": "https://maxahp.se/hogskoleprovet/strategier"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Kvantitativa Fallor"
      }
    ]
  };

  return (
    <div>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {/* Page content */}
    </div>
  );
}
```

### Table Pattern for Trap Summaries
```typescript
// Reuse existing table styling from source material structure
function TrapTable({ traps }: { traps: Array<{ name: string; mechanism: string; solution: string }> }) {
  return (
    <div className="overflow-x-auto my-8">
      <table className="w-full border-2 border-border rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-card-background border-b-2 border-border">
            <th className="text-left p-4 font-bold text-foreground">Fälla</th>
            <th className="text-left p-4 font-bold text-foreground">Hur den fungerar</th>
            <th className="text-left p-4 font-bold text-foreground">Motdrag</th>
          </tr>
        </thead>
        <tbody>
          {traps.map((trap, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              <td className="p-4 font-semibold text-foreground">{trap.name}</td>
              <td className="p-4 text-foreground-muted">{trap.mechanism}</td>
              <td className="p-4 text-primary">{trap.solution}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| MDX for content | React TSX with components | 2024-2025 | Better control, no MDX limitations, easier to integrate with design systems |
| Deep URL hierarchies | Flat hierarchies (3 clicks max) | 2025 | Better UX, improved SEO crawlability, clearer information architecture |
| Keyword density focus | Topical authority focus | 2023-2024 | Google rewards comprehensive coverage over keyword stuffing |
| Manual meta tags | Metadata API (Next.js 13+) | 2023 | Type-safe, better DX, prevents missing OG tags |
| Client-side rendering | SSG as default | Next.js 13+ (2022) | Better SEO, faster initial load, Core Web Vitals boost |
| Generic Swedish chars handling | Systematic normalization | Ongoing | URLs must consistently transform å→a, ä→a, ö→o for SEO |

**Deprecated/outdated:**
- **MDX for simple content sites**: Overkill when you have <10 pages; React TSX provides better flexibility
- **ISR for rarely-changing content**: SSG is simpler and faster; ISR adds unnecessary complexity for content that updates monthly or less
- **Swedish chars in URLs**: Modern SEO practice is to normalize to ASCII (å→a) rather than use `%C3%A5` encoding
- **Deep hierarchies for small sites**: 4-5 pages don't need `/category/subcategory/page` structure

## Open Questions

Things that couldn't be fully resolved:

### 1. **Hub Page Title: Swedish Term for "Strategies"**
- **What we know:**
  - "Strategier" is direct translation of "strategies"
  - Source document uses "strategier" in title
  - Swedish search volume exists for "hp strategier", "högskoleprovet strategier"
- **What's unclear:**
  - Whether more specific terms like "Knäck HP", "HP-guide", or "Så Lyckas du" would resonate better with 16-25 age group
  - If "fallor och strategier" (combining traps + strategies) is more compelling than just "strategier"
- **Recommendation:**
  - **Primary option:** `/hogskoleprovet/strategier` with page title "HP Strategier - Knäck Högskoleprovet"
    - Pros: Clear, searchable, matches source material, professional tone
    - Cons: Generic, doesn't convey "ultimate guide" energy
  - **Alternative option:** `/hogskoleprovet/guider` with page title "HP Guider - Allt du behöver veta"
    - Pros: "Guide" is more comprehensive-sounding, friendly tone
    - Cons: Less specific than "strategier", might compete with other guide content
  - **Test both in task 04-01** with A/B title variations in metadata

### 2. **Content Grouping: By Test Section vs. Content Type**
- **What we know:**
  - 4 cluster pages planned: Kvantitativa fallor, Verbala fallor, Vanliga misstag, Tidsstrategi
  - First two are grouped by test section (Kvant/Verbal)
  - Last two are content types (mistakes, time management)
- **What's unclear:**
  - Whether mixing grouping principles (section-based + type-based) creates cognitive load
  - If users expect all-fallor pages under one grouping, separate from strategy pages
- **Recommendation:**
  - Use **flat structure with clear visual grouping on hub page**:
    ```
    Hub page sections:
    1. "Fallor att undvika" (cards: Kvantitativa fallor, Verbala fallor)
    2. "Strategier för framgång" (cards: Vanliga misstag, Tidsstrategi)
    ```
  - This provides conceptual grouping without adding URL hierarchy
  - Users can see relationships at a glance without complex navigation

### 3. **Supplementary Examples Beyond Source Document**
- **What we know:**
  - Source document (Högskoleprovets fällor och strategier-v2.md) is comprehensive
  - User requested "cherry-picking best examples" + "filling gaps with research"
- **What's unclear:**
  - Which specific trap types need more examples
  - Whether web research can find credible HP-specific examples (most are behind paywalls on competitor sites)
- **Recommendation:**
  - **In task 04-02/04-03:** Audit source document section-by-section
  - Identify gaps by delprov (XYZ, KVA, NOG, DTK, ORD, LÄS, MEK, ELF)
  - For gaps: Use official HP sample questions from studera.nu (allowable source)
  - Avoid scraping competitor examples (user constraint: no competitor links)

### 4. **Progressive Disclosure for Long-Form Content**
- **What we know:**
  - Pages will be 1500-2500 words
  - Mobile-first design is critical
  - TL;DR + section summaries + recap pattern is required
- **What's unclear:**
  - Whether to implement collapsible sections (progressive disclosure) or keep everything visible
  - If collapsing content hurts SEO (hidden content may not be indexed)
- **Recommendation:**
  - **Phase 4:** Keep all content visible (no collapse) for SEO
  - Use visual hierarchy (headings, callouts, whitespace) for scannability
  - **Future phase:** Test progressive disclosure (e.g., "Show advanced tips") for supplementary content only

## Sources

### Primary (HIGH confidence)
- [Next.js SEO: Rendering Strategies](https://nextjs.org/learn/seo/rendering-strategies) - Official Next.js docs on SSG for SEO
- [The Complete Guide to SEO Optimization in Next.js 15](https://medium.com/@thomasaugot/the-complete-guide-to-seo-optimization-in-next-js-15-1bdb118cffd7) - Metadata API best practices
- [URL Structure Best Practices | Google Search Central](https://developers.google.com/search/docs/crawling-indexing/url-structure) - Official Google guidance
- [5 Formatting Techniques for Long-Form Content - NN/G](https://www.nngroup.com/articles/formatting-long-form-content/) - Research-backed content patterns
- [Flat vs. Deep Website Hierarchies - NN/G](https://www.nngroup.com/articles/flat-vs-deep-hierarchy/) - Information architecture research

### Secondary (MEDIUM confidence)
- [Content Hubs: Methods That Increase Engagement](https://digitalcommerce.com/content-hubs/) - Verified with multiple sources on pillar-spoke model
- [SEO in Sweden: How to Rank](https://kandusweden.com/seo-in-sweden-how-to-rank-your-business-on-googles-first-page/) - Swedish-specific SEO patterns
- [Topic Cluster Strategy Guide](https://sedestral.com/en/blog/topic-cluster-strategy-guide) - 2026 content hub architecture
- [Advanced Content Creation with MDX in Next.js 14](https://www.telerik.com/blogs/advanced-content-creation-mdx-next-js-14) - MDX vs TSX tradeoffs
- [Högskoleprovet Structure](https://en.wikipedia.org/wiki/Swedish_Scholastic_Aptitude_Test) - Official test structure

### Tertiary (LOW confidence - for context only)
- WebSearch results on Swedish URL conventions - Limited specific guidance; general URL best practices apply
- WebSearch results on "du-tilltal" SEO - No direct research found; recommendation based on Swedish cultural norms for educational content

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Next.js 15 + React TSX is industry standard for SEO content
- Architecture patterns: HIGH - Pillar-spoke model verified across multiple authoritative sources (NN/G, content marketing research)
- URL structure: MEDIUM-HIGH - Swedish normalization (å→a) confirmed, flat hierarchy verified, but hub title needs user testing
- Content patterns: HIGH - TL;DR + callouts + summaries backed by NN/G UX research
- Component patterns: HIGH - Existing Maxa design system provides proven patterns

**Research date:** 2026-01-27
**Valid until:** 2026-03-27 (60 days - content strategy moves slowly; Next.js 15 is stable)

---

## Hub Page Title Options (User Research Directive)

Based on research, here are recommended hub page titles with SEO and UX analysis:

| Option | URL Slug | Full Title | Pros | Cons | Recommendation |
|--------|----------|------------|------|------|----------------|
| **1. Strategier** | `/hogskoleprovet/strategier` | "HP Strategier - Knäck Högskoleprovet" | • Clear search intent<br>• Professional<br>• Matches source material | • Generic<br>• Less "ultimate guide" feel | ⭐ **PRIMARY** - Safe, searchable, scalable |
| **2. Guider** | `/hogskoleprovet/guider` | "HP Guider - Allt du behöver veta" | • Broader scope<br>• Friendly tone<br>• "Allt du behöver" = comprehensive | • May conflict with future guide content<br>• Less specific | SECONDARY - Good alternative |
| **3. Tips** | `/hogskoleprovet/tips` | "HP Tips & Tricks - Maximera ditt resultat" | • Casual, approachable<br>• Action-oriented | • "Tips" sounds shallow vs. comprehensive strategies | NOT RECOMMENDED - Too casual |
| **4. Fallor och Strategier** | `/hogskoleprovet/fallor-och-strategier` | "Fallor & Strategier - HP Genomgång" | • Matches source doc exactly<br>• Comprehensive | • Long URL<br>• Awkward in Swedish | NOT RECOMMENDED - Too literal |

**Final recommendation:** Use **Option 1: `/hogskoleprovet/strategier`** with title "HP Strategier - Knäck Högskoleprovet | Maxa"

**Rationale:**
- "Strategier" has search volume (verified via Swedish SEO research)
- Professional tone matches authoritative content with friendly energy
- Scalable: Can add more strategy pages later without URL restructure
- Clean URL structure fits existing `/hogskoleprovet/*` pattern

## URL Structure Recommendation

```
maxahp.se/
├── hogskoleprovet/              # Existing test library
│   ├── [slug]/                  # Individual tests (e.g., /hosten-2025)
│   └── strategier/              # NEW: Strategy hub
│       ├── (index)              # Hub/pillar page
│       ├── kvantitativa-fallor/ # Cluster page
│       ├── verbala-fallor/      # Cluster page
│       ├── vanliga-misstag/     # Cluster page
│       └── tidsstrategi/        # Cluster page
```

**Key decisions:**
- **Flat hierarchy:** 3 clicks from homepage (Home → Högskoleprovet → Strategier → Cluster page)
- **Swedish normalization:** `fällor` → `fallor` (remove special chars)
- **Descriptive slugs:** `kvantitativa-fallor` not `kvant-fallor` (clarity over brevity)
- **No dates:** Avoid `/strategier/2026/` to prevent content appearing stale

## Content Organization for Hub Page

Recommended visual grouping (sections on hub page):

```
HP Strategier - Knäck Högskoleprovet

[TL;DR Section]
• 3-5 key takeaways from all strategy content
• Visual callout with primary color border

[Section 1: Fallor att Undvika]
Heading: "Lär dig känna igen fällorna"
Cards:
  - Kvantitativa fallor (icon: 🔢)
    "Undvik misstagen i XYZ, KVA, NOG och DTK"
  - Verbala fallor (icon: 📚)
    "Klara ORD, LÄS, MEK och ELF utan att falla i fällorna"

[Section 2: Strategier för Framgång]
Heading: "Optimera din prestation"
Cards:
  - Vanliga misstag (icon: ⚠️)
    "De 12 vanligaste misstagen som sänker ditt resultat"
  - Tidsstrategi (icon: ⏱️)
    "Planera ditt prov och maximera poängen per minut"

[Section 3: Öva med Gamla Prov]
Link to: /hogskoleprovet
"Använd strategierna på riktiga provfrågor"

[Final CTA: Navigation to first cluster page]
```

**Rationale:**
- Two-section grouping creates clear conceptual categories (Traps vs. Strategies)
- Icons add visual interest without overwhelming
- Short descriptions (1 sentence) maintain scannability
- Direct link to practice content closes the loop
