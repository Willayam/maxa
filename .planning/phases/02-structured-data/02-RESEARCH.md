# Phase 2: Structured Data - Research

**Researched:** 2026-01-26
**Domain:** JSON-LD Structured Data for SEO
**Confidence:** HIGH

## Summary

This research investigates implementing JSON-LD structured data for Next.js 15 App Router to enable rich snippet eligibility in Google search results. The focus is on two schema types: BreadcrumbList for navigation hierarchy and a suitable schema for test archive pages.

The standard approach in Next.js is to render JSON-LD as a `<script type="application/ld+json">` tag directly in page/layout components. For TypeScript projects, the `schema-dts` package (maintained by Google) provides type safety. Security requires escaping `<` characters to prevent XSS injection.

For test archive pages, **Article** schema (not ScholarlyArticle) is the recommended choice because Google only supports Article, NewsArticle, and BlogPosting for rich results. ScholarlyArticle, while semantically accurate for educational content, does not qualify for Google rich results.

**Primary recommendation:** Use Article schema with datePublished and publisher for test pages, BreadcrumbList for navigation, and validate with Google Rich Results Test before deployment.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| schema-dts | 1.1.5 | TypeScript types for Schema.org JSON-LD | Google-maintained, 100k+ weekly downloads, type-safe authoring |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none needed) | - | - | JSON-LD implementation requires no runtime dependencies |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| schema-dts | Manual typing | Less type safety, more error-prone |
| script tag | next/script | next/script has known hydration issues with JSON-LD |

**Installation:**
```bash
npm install --save-dev schema-dts
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── hogskoleprovet/
│   │   ├── [slug]/
│   │   │   └── page.tsx        # Article + Breadcrumb JSON-LD
│   │   └── page.tsx            # Breadcrumb JSON-LD only
│   └── layout.tsx              # Organization JSON-LD (optional)
├── lib/
│   └── structured-data.ts      # JSON-LD helper functions
```

### Pattern 1: Inline JSON-LD in Page Components
**What:** Render JSON-LD directly in page components using a `<script>` tag
**When to use:** Always for page-specific structured data
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/guides/json-ld
import type { Article, WithContext } from 'schema-dts';

export default function TestPage({ test }: { test: Test }) {
  const jsonLd: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Hogskoleprovet ${test.season} ${test.year}`,
    datePublished: test.date,
    publisher: {
      '@type': 'Organization',
      name: 'Maxa',
      url: 'https://maxa.se',
    },
  };

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      {/* Page content */}
    </section>
  );
}
```

### Pattern 2: BreadcrumbList Schema
**What:** Hierarchical navigation structure for search results
**When to use:** On all pages with navigation depth
**Example:**
```typescript
// Source: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
import type { BreadcrumbList, WithContext } from 'schema-dts';

function generateBreadcrumbs(test: Test): WithContext<BreadcrumbList> {
  const seasonLabel = test.season === 'var' ? 'Varen' : 'Hosten';
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Hem',
        item: 'https://maxa.se',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Gamla prov',
        item: 'https://maxa.se/hogskoleprovet',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${seasonLabel} ${test.year}`,
        // Final item does not need 'item' property
      },
    ],
  };
}
```

### Pattern 3: Multiple Schemas on One Page
**What:** Combine Article and BreadcrumbList schemas
**When to use:** Test detail pages
**Example:**
```typescript
// Multiple schemas can be in separate script tags or combined
return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c'),
      }}
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c'),
      }}
    />
    {/* Page content */}
  </>
);
```

### Anti-Patterns to Avoid
- **Using next/script for JSON-LD:** Known hydration issues cause duplication in RSC payload
- **Using ScholarlyArticle for Google rich results:** Google only supports Article, NewsArticle, BlogPosting
- **Omitting XSS sanitization:** Must escape `<` characters to prevent script injection
- **Putting JSON-LD in Head component:** Does not work reliably in App Router
- **Using single quotes in JSON:** JSON requires double quotes

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| TypeScript types for Schema.org | Custom interfaces | schema-dts | Comprehensive, Google-maintained, auto-updated |
| JSON sanitization | Custom escaping | `.replace(/</g, '\\u003c')` | Official Next.js recommendation, proven safe |
| Schema validation | Manual checking | Google Rich Results Test | Authoritative, catches errors Google cares about |

**Key insight:** JSON-LD implementation is simple (just a script tag), but schema-dts provides compile-time validation that prevents typos and missing required properties.

## Common Pitfalls

### Pitfall 1: Using ScholarlyArticle for Rich Results
**What goes wrong:** Schema validates but never appears in Google rich results
**Why it happens:** ScholarlyArticle is valid schema.org but not in Google's supported list
**How to avoid:** Use Article, NewsArticle, or BlogPosting for rich result eligibility
**Warning signs:** Rich Results Test shows "no rich results detected"

### Pitfall 2: Missing XSS Sanitization
**What goes wrong:** Security vulnerability allowing script injection
**Why it happens:** JSON.stringify does not escape HTML characters
**How to avoid:** Always use `.replace(/</g, '\\u003c')` after JSON.stringify
**Warning signs:** JSON-LD payload contains user-generated content with `<` characters

### Pitfall 3: Hydration Duplication with next/script
**What goes wrong:** JSON-LD appears twice in page source, confuses Google
**Why it happens:** RSC payload re-renders script during hydration
**How to avoid:** Use native `<script>` tag with dangerouslySetInnerHTML, not next/script
**Warning signs:** View source shows duplicate JSON-LD blocks

### Pitfall 4: Missing Position Property in BreadcrumbList
**What goes wrong:** Breadcrumbs don't display correctly in search results
**Why it happens:** Position is required but easy to forget
**How to avoid:** Always include position starting from 1
**Warning signs:** Rich Results Test shows BreadcrumbList errors

### Pitfall 5: Mismatched Breadcrumb Labels
**What goes wrong:** Google may show warning or ignore breadcrumbs
**Why it happens:** JSON-LD breadcrumbs don't match visible page navigation
**How to avoid:** Ensure JSON-LD matches actual navigation hierarchy
**Warning signs:** Manual review shows discrepancy

## Code Examples

Verified patterns from official sources:

### Complete Article Schema for Test Page
```typescript
// Source: https://nextjs.org/docs/app/guides/json-ld
// Source: https://developers.google.com/search/docs/appearance/structured-data/article
import type { Article, WithContext } from 'schema-dts';

interface Test {
  year: number;
  season: 'var' | 'host';
  date: string; // ISO 8601
  slug: string;
}

function generateArticleJsonLd(test: Test): WithContext<Article> {
  const seasonLabel = test.season === 'var' ? 'varen' : 'hosten';

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Hogskoleprovet ${seasonLabel} ${test.year} - PDF, Facit & Normering`,
    datePublished: test.date,
    publisher: {
      '@type': 'Organization',
      name: 'Maxa',
      url: 'https://maxa.se',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://maxa.se/hogskoleprovet/${test.slug}`,
    },
  };
}
```

### Complete BreadcrumbList Schema
```typescript
// Source: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
import type { BreadcrumbList, WithContext } from 'schema-dts';

function generateBreadcrumbJsonLd(
  test: Test
): WithContext<BreadcrumbList> {
  const seasonLabel = test.season === 'var' ? 'Varen' : 'Hosten';

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Hem',
        item: 'https://maxa.se',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Gamla prov',
        item: 'https://maxa.se/hogskoleprovet',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${seasonLabel} ${test.year}`,
        // Final breadcrumb: item property optional
      },
    ],
  };
}
```

### Safe JSON-LD Rendering Component
```typescript
// Source: https://nextjs.org/docs/app/guides/json-ld
interface JsonLdProps {
  data: Record<string, unknown>;
}

function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}

// Usage in page component
export default function Page() {
  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {/* Content */}
    </>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Microdata/RDFa | JSON-LD | ~2020 | Google recommends JSON-LD as easiest to maintain |
| next-seo package | Native script tag | Next.js 13+ | App Router works best with native approach |
| ScholarlyArticle | Article | Always | Google never supported ScholarlyArticle for rich results |

**Deprecated/outdated:**
- **next-seo JsonLd component:** Does not work reliably with App Router
- **JSON-LD in next/head:** App Router removed Head component pattern
- **FAQPage schema for general use:** Google restricted to authoritative sites only (as of 2023)

## Open Questions

Things that couldn't be fully resolved:

1. **Optional Organization schema in layout**
   - What we know: Organization schema can be added globally for site-wide info
   - What's unclear: Whether it provides any SEO benefit for this use case
   - Recommendation: Skip for now (80/20 principle), add later if needed

2. **Image property for Article schema**
   - What we know: Google recommends including images for Article rich results
   - What's unclear: Whether test pages without hero images benefit
   - Recommendation: Omit image property initially; add when OG images are implemented (Phase 5)

## Sources

### Primary (HIGH confidence)
- [Next.js JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld) - Implementation pattern, security
- [Google BreadcrumbList Documentation](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) - Required properties, guidelines
- [Google Article Documentation](https://developers.google.com/search/docs/appearance/structured-data/article) - Supported types, properties
- [Google Structured Data Gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery) - Supported schema types list
- [schema-dts GitHub](https://github.com/google/schema-dts) - v1.1.5, TypeScript types

### Secondary (MEDIUM confidence)
- [Next.js GitHub Discussion #80088](https://github.com/vercel/next.js/discussions/80088) - Hydration issues confirmed
- [schema.org ScholarlyArticle](https://schema.org/ScholarlyArticle) - Type definition (not Google-supported)

### Tertiary (LOW confidence)
- Community blog posts on JSON-LD patterns - Implementation details vary

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Next.js docs and Google-maintained library
- Architecture: HIGH - Direct from Next.js official guide
- Pitfalls: HIGH - Verified through official docs and GitHub issues

**Research date:** 2026-01-26
**Valid until:** 60 days (structured data standards are stable)
