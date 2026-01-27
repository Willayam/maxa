# SEO & Chart Implementation Pitfalls

**Project:** Maxa SEO & Content Enhancement
**Researched:** 2026-01-26
**Focus:** What can go wrong implementing SEO and data visualization in Next.js 15

## Critical Pitfalls (Must Avoid)

### Pitfall 1: Missing `await` in `generateMetadata`

**What goes wrong:** Dynamic metadata functions that don't properly await async data return `undefined` titles and descriptions.

**Why it happens:**
- Convex queries are async but developers forget to await
- TypeScript doesn't always catch missing awaits on promises
- Works in development (fast Convex) but fails in production

**Consequences:**
- Google sees `<title>undefined</title>` or falls back to root layout title
- All test pages get same generic metadata
- Zero SEO value from per-page optimization

**Prevention:**
```typescript
// WRONG: Missing await
export async function generateMetadata({ params }) {
  const test = api.tests.getBySlug({ slug: params.slug }); // Promise, not data!
  return {
    title: `Högskoleprovet ${test.season} ${test.year}`, // undefined.season
  };
}

// CORRECT: Properly awaited
export async function generateMetadata({ params }): Promise<Metadata> {
  const test = await api.tests.getBySlug({ slug: params.slug });
  if (!test) return { title: 'Test Not Found' };
  return {
    title: `Högskoleprovet ${test.season} ${test.year} - Gamla Prov`,
    description: `Ladda ner provpass, facit och normering för HP ${test.season} ${test.year}.`,
  };
}
```

**Detection:**
- View page source: `<title>` shows "undefined" or falls back to root layout
- Google Search Console: Low impressions despite pages being crawled

---

### Pitfall 2: Client-Only Chart Rendering (Zero SEO Value)

**What goes wrong:** Charts rendered entirely in client-side React components are invisible to Google and screen readers.

**Why it happens:**
- Popular chart libraries render via Canvas or client-side SVG
- Developers don't realize bots can't execute JavaScript reliably
- "It looks good in the browser" testing approach

**Consequences:**
- Google doesn't index the normering data (your most valuable content)
- Screen readers announce "graphic" with no data
- Zero ranking for searches like "högskoleprovet normering 2024"
- Competitors with HTML tables rank higher despite worse UX

**Prevention:**
```tsx
// WRONG: Client-only chart
export default function NormeringChart({ data }) {
  return <ResponsiveContainer><LineChart data={data}>...</LineChart></ResponsiveContainer>;
}

// CORRECT: Progressive enhancement
export default function NormeringChart({ data }) {
  return (
    <div>
      {/* Screen readers and bots get this */}
      <table className="sr-only" aria-label="Normering tabell">
        <caption>Poängkonvertering Högskoleprovet {data.test}</caption>
        <thead>
          <tr><th>Rätt svar</th><th>HP-poäng</th></tr>
        </thead>
        <tbody>
          {data.rows.map(row => (
            <tr key={row.correct}>
              <td>{row.correct}</td>
              <td>{row.score}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Visual users get this */}
      <div aria-hidden="true">
        <ResponsiveContainer>
          <LineChart data={data}>...</LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

**Detection:**
- Disable JavaScript in browser - chart disappears completely
- Google Search Console: Pages not ranking for chart data keywords
- Screen reader testing: No data announced

---

### Pitfall 3: Missing or Invalid Structured Data

**What goes wrong:** JSON-LD structured data is malformed, incomplete, or uses wrong schema types.

**Why it happens:**
- Copy-paste from generic examples without validation
- Using wrong schema.org types for educational content
- Not testing with Google's Rich Results Test
- Dynamic data not properly escaped in JSON

**Prevention:**

For Högskoleprovet content, use these schema types:
- `BreadcrumbList` — On all pages for navigation hierarchy
- `Article` or `ScholarlyArticle` — On test pages
- `Dataset` — On normering tables

```typescript
// WRONG: Generic webpage schema (useless)
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Gamla Prov"
}
</script>

// CORRECT: Educational content schema
export function NormeringPageSchema({ test, normeringData }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": `Högskoleprovet Normering ${test.season} ${test.year}`,
    "description": `Poängkonvertering för Högskoleprovet ${test.season} ${test.year}.`,
    "creator": {
      "@type": "Organization",
      "name": "Universitets- och högskolerådet"
    },
    "temporalCoverage": test.date,
    "keywords": ["högskoleprovet", "normering", "poäng", test.season, test.year]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

**Critical validation:** Always test with Google Rich Results Test before deployment.

---

### Pitfall 4: Thin Content Pages (Algorithmic Penalty Risk)

**What goes wrong:** Creating dozens of similar test pages with minimal unique content triggers Google's thin content detection.

**Why it happens:**
- Templated pages with same structure and minimal text
- "Just add all the tests" approach without content strategy
- Focusing on quantity over quality

**Consequences:**
- Domain-wide ranking drop (not just the thin pages)
- Pages stuck in "supplemental index" (rarely shown)
- Competitors with fewer but richer pages outrank you

**Prevention:**

Minimum viable content per test page:
1. Unique description (150+ words) mentioning test-specific context
2. Statistics: attempt rate, average score, difficulty analysis
3. Section breakdown: which delprov were hardest that administration
4. Historical context: any notable changes or patterns
5. Normering visualization with full data table

```tsx
// WRONG: Templated thin page (will be penalized)
export default function TestPage({ test }) {
  return (
    <div>
      <h1>Högskoleprovet {test.season} {test.year}</h1>
      <p>Ladda ner provpass och facit.</p>
      <DownloadButtons files={test.files} />
    </div>
  );
}

// CORRECT: Rich, unique content per test
export default function TestPage({ test, stats, insights }) {
  return (
    <article>
      <h1>Högskoleprovet {test.season} {test.year}</h1>

      <section>
        <h2>Om detta prov</h2>
        <p>{test.uniqueDescription}</p>
      </section>

      <section>
        <h2>Statistik</h2>
        <StatsGrid>
          <Stat label="Antal deltagare" value={stats.participants} />
          <Stat label="Genomsnittligt resultat" value={stats.avgScore} />
        </StatsGrid>
      </section>

      <section>
        <h2>Normering</h2>
        <NormeringChart data={test.normering} />
      </section>

      <section>
        <h2>Ladda ner material</h2>
        <DownloadButtons files={test.files} />
      </section>
    </article>
  );
}
```

---

## Moderate Pitfalls

### Pitfall 5: Swedish Language Tags Incomplete

**What goes wrong:** Missing or incorrect language tags cause Google to index the site as English or show it to wrong geographic audience.

**Prevention:**
```tsx
// Root layout
<html lang="sv-SE" suppressHydrationWarning>

// For pages with potential international audience
export const metadata = {
  alternates: {
    languages: {
      'sv-SE': 'https://maxahp.se/hogskoleprovet',
    },
  },
};
```

---

### Pitfall 6: Robots.txt Blocks Critical Resources

**What goes wrong:** Overly aggressive robots.txt blocks JavaScript, CSS, or images needed for rendering.

**Prevention:**
```txt
# WRONG: Blocks resources Google needs
User-agent: *
Disallow: /_next/
Disallow: /static/

# CORRECT: Allow rendering resources
User-agent: *
Disallow: /api/
Disallow: /admin/
Allow: /_next/static/
Sitemap: https://maxahp.se/sitemap.xml
```

**Critical resources to NEVER block:**
- `/_next/static/*` - Next.js static assets
- `*.css` - Stylesheets
- `*.js` - JavaScript (Google executes it)
- `*.jpg`, `*.png`, `*.svg` - Images

---

### Pitfall 7: Missing Canonical URLs (Duplicate Content)

**What goes wrong:** Multiple URLs serve the same content, diluting page authority.

**Prevention:**
```typescript
// Set canonical on all dynamic pages
export async function generateMetadata({ params }) {
  const test = await api.tests.getBySlug({ slug: params.slug });
  return {
    title: `...`,
    alternates: {
      canonical: `https://maxahp.se/hogskoleprovet/${params.slug}`,
    },
  };
}
```

---

### Pitfall 8: Sitemap Excludes Dynamic Routes

**What goes wrong:** Sitemap only includes static pages, missing all dynamically generated test pages.

**Prevention:**
```typescript
// apps/web/app/sitemap.ts
import { tests } from '@/data/tests'

export default function sitemap() {
  const testUrls = tests.map((test) => ({
    url: `https://maxahp.se/hogskoleprovet/${test.slug}`,
    lastModified: test.date,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    { url: 'https://maxahp.se', lastModified: new Date(), priority: 1 },
    { url: 'https://maxahp.se/hogskoleprovet', lastModified: new Date(), priority: 0.9 },
    ...testUrls,
  ];
}
```

---

### Pitfall 9: Internal Linking Chaos

**What goes wrong:** No consistent internal linking strategy, leaving deep pages orphaned.

**Prevention:**

**Breadcrumb navigation on all pages:**
```tsx
<Breadcrumb items={[
  { label: 'Hem', href: '/' },
  { label: 'Gamla Prov', href: '/hogskoleprovet' },
  { label: `${test.season} ${test.year}`, href: null },
]} />
```

**Contextual internal links:**
Every test page should link to:
- Previous/next test chronologically
- Related study resources
- Hub page (hogskoleprovet)

---

## Minor Pitfalls

### Pitfall 10: Open Graph Images Missing or Generic

**Prevention:**
```typescript
export async function generateMetadata({ params }) {
  return {
    openGraph: {
      title: `Högskoleprovet ${test.season} ${test.year}`,
      images: [{
        url: `https://maxahp.se/og/hogskoleprovet.png`,
        width: 1200,
        height: 630,
      }],
    },
  };
}
```

**Optimal OG image specs:**
- 1200×630px (Facebook/LinkedIn)
- File size <1MB
- Absolute URL (https://...)

---

### Pitfall 11: Loading States Break Accessibility

**Prevention:**
```tsx
// WRONG: Silent loading
{loading && <Spinner />}

// CORRECT: Announced loading
{loading && (
  <div role="status" aria-live="polite">
    <Spinner aria-hidden="true" />
    <span className="sr-only">Laddar normering...</span>
  </div>
)}
```

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Sitemap generation | Excludes dynamic routes | Use async sitemap.ts that queries tests data |
| Metadata implementation | Missing await on queries | Enforce TypeScript strict mode |
| Chart implementation | Client-only rendering | Mandate HTML table fallback |
| Structured data | Invalid JSON-LD syntax | Validate with Rich Results Test before merge |
| Content creation | Copy-paste descriptions | Write 5 exemplar pages first, then template with unique stats |
| Internal linking | No breadcrumb component | Build breadcrumb component before test pages |

---

## Checklist Before Launch

- [ ] All dynamic pages have unique `generateMetadata` functions
- [ ] Metadata functions use `await` for async data
- [ ] Charts have HTML table fallbacks
- [ ] JSON-LD validated with Rich Results Test
- [ ] Robots.txt allows /_next/static/*
- [ ] Sitemap includes all dynamic routes
- [ ] Canonical URLs set on all pages
- [ ] Language tags set to sv-SE
- [ ] Breadcrumbs implemented site-wide
- [ ] Internal links connect all pages (no orphans)
- [ ] OG images are absolute URLs (https://)
- [ ] Test with JavaScript disabled
- [ ] Test with screen reader

---

**Confidence Assessment:**
- Next.js metadata API: HIGH (official documentation patterns)
- Chart accessibility: MEDIUM (WCAG 2.1 standards)
- Structured data schemas: MEDIUM (schema.org docs)
- Swedish SEO specifics: MEDIUM (domain knowledge)
