# Research Summary: Maxa SEO & Content Enhancement

**Synthesized:** 2026-01-26
**Research Sources:** STACK.md, PITFALLS.md, CONCERNS.md

## Executive Summary

This project adds SEO infrastructure and rich content (normering visualizations, strategy pages) to Maxa's Högskoleprovet web app. The research confirms the technical approach is well-supported by Next.js 15's native APIs and the existing codebase is well-positioned for these enhancements.

**Key Finding:** No external SEO libraries needed. Next.js 15 provides `sitemap.ts`, `robots.ts`, and `generateMetadata` natively.

---

## Technology Decisions

### Confirmed Stack

| Component | Choice | Confidence |
|-----------|--------|------------|
| SEO Infrastructure | Next.js 15 native APIs | HIGH |
| Charts | shadcn/ui charts (Recharts) | HIGH |
| Structured Data | JSON-LD with schema-dts | HIGH |
| Data Tables | Native HTML `<table>` | HIGH |

### Why This Stack

1. **Next.js 15 SEO APIs** — Built-in sitemap.ts, robots.ts, generateMetadata. No next-sitemap or next-seo packages needed.

2. **Recharts via shadcn/ui** — SVG-based charts are bot-crawlable (unlike canvas). Pre-styled components match existing Tailwind design system.

3. **Dual rendering pattern** — Charts for visual users, HTML tables for bots and screen readers. Best of both worlds for SEO and accessibility.

4. **schema-dts** — Type-safe Schema.org JSON-LD generation. Catches errors at compile time.

### Dependencies to Add

```bash
npx shadcn@latest add chart  # Adds Recharts + shadcn chart components
bun add schema-dts           # TypeScript types for Schema.org
```

---

## Critical Patterns

### Pattern 1: Accessible Chart + Data Table

Every normering chart must have an HTML table fallback:

```tsx
export function NormeringChart({ data }) {
  return (
    <div>
      {/* Bot-readable table */}
      <table className="sr-only">
        <caption>Normeringstabell</caption>
        <thead><tr><th>Råpoäng</th><th>HP-poäng</th></tr></thead>
        <tbody>
          {data.map(row => (
            <tr key={row.raw}><td>{row.raw}</td><td>{row.score}</td></tr>
          ))}
        </tbody>
      </table>

      {/* Visual chart */}
      <div aria-hidden="true">
        <LineChart data={data} />
      </div>
    </div>
  );
}
```

### Pattern 2: Dynamic Metadata with Await

All `generateMetadata` functions must properly await async data:

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const test = await getTestBySlug(params.slug);  // Must await!
  return {
    title: `HP ${test.season} ${test.year} - Normering | Maxa`,
    alternates: { canonical: `https://maxahp.se/hogskoleprovet/${params.slug}` },
  };
}
```

### Pattern 3: JSON-LD Structured Data

Use Dataset schema for normering, ScholarlyArticle for test pages:

```typescript
const schema = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  "name": `Högskoleprovet Normering ${test.season} ${test.year}`,
  "creator": { "@type": "Organization", "name": "UHR" },
};
```

---

## Risk Mitigation

### High-Risk Pitfalls to Avoid

| Pitfall | Risk | Mitigation |
|---------|------|------------|
| Client-only chart rendering | Zero SEO value | Always include HTML table fallback |
| Missing await in generateMetadata | Broken metadata | TypeScript strict mode, test in dev |
| Thin content on test pages | Google penalty | Add normering, stats, unique descriptions |
| Blocking /_next/ in robots.txt | Broken rendering | Explicitly allow static assets |

### Validation Before Each Phase

1. **SEO phase:** Test robots.txt with Google URL Inspection
2. **Chart phase:** Verify data visible with JS disabled
3. **Structured data phase:** Validate JSON-LD with Rich Results Test
4. **Content phase:** Ensure each page has 150+ words unique content

---

## Content Strategy Insights

### What Makes Test Pages Rich (Not Thin)

Per-page unique content requirements:
- **Normering data** — Full score conversion table + chart visualization
- **Statistics** — Participants, average scores, difficulty indicators
- **Context** — How this test compares to previous/next administrations
- **Section analysis** — Which delprov were harder/easier

### Strategy Content Hub Structure

```
/hogskoleprovet                     (Hub: All tests listing)
/hogskoleprovet/[slug]              (Test page: Downloads + normering + stats)
/hogskoleprovet/strategier          (Hub: Strategy content)
/hogskoleprovet/strategier/kvant    (Quantitative traps: XYZ, KVA, NOG, DTK)
/hogskoleprovet/strategier/verbal   (Verbal traps: ORD, LÄS, MEK, ELF)
/hogskoleprovet/strategier/misstag  (Common mistakes)
/hogskoleprovet/strategier/tid      (Time management)
```

### Cross-Linking Strategy

- Every test page links to relevant strategy pages
- Strategy pages link to "Practice with real tests" (test pages)
- Breadcrumbs on all pages
- Previous/next test navigation on test pages
- Related tests section on each test page

---

## Phase Recommendations

Based on research findings, recommended phase order:

### Phase 1: SEO Foundation
- sitemap.ts (dynamic with all test pages)
- robots.ts (allow rendering resources)
- Enhanced generateMetadata on all pages
- Canonical URLs

**Why first:** Foundation for all other content. Quick wins, high impact.

### Phase 2: Structured Data
- JSON-LD on test pages (ScholarlyArticle)
- BreadcrumbList schema on all pages
- Dataset schema preparation for normering

**Why second:** Builds on metadata infrastructure. Enables rich snippets.

### Phase 3: Normering Data & Charts
- Extract normering data from PDFs
- Store in structured format (JSON or Convex)
- Build NormeringChart component with table fallback
- Add to all test pages

**Why third:** Highest content value. Differentiates from competitors.

### Phase 4: Strategy Content
- Create strategy page hub
- Write Kvant traps page (from research doc)
- Write Verbal traps page (from research doc)
- Write common mistakes page
- Write time strategy page

**Why fourth:** Parallel-able after phase 1-2. Text content, simpler than charts.

### Phase 5: Cross-Linking & Polish
- Internal linking between test and strategy pages
- Breadcrumb component
- OG images (static initially)
- Final SEO audit

**Why last:** Requires all content to exist for proper linking.

---

## Open Questions

1. **Normering data format:** JSON files in `/data/` or Convex table? (Recommend: static JSON for SSG simplicity)

2. **Chart type for normering:** Line chart or scatter plot? (Recommend: Line chart with dots at data points)

3. **OG images:** Static or dynamic generation? (Recommend: Static for v1, easier to implement)

4. **Strategy content length:** How much detail per trap type? (Recommend: 500-800 words per page, focused on actionable tips)

---

## Confidence Assessment

| Research Area | Confidence | Notes |
|---------------|------------|-------|
| Next.js 15 SEO APIs | HIGH | Verified from official docs |
| Recharts/shadcn | HIGH | Industry standard |
| Accessibility patterns | HIGH | WCAG 2.1 standards |
| Swedish SEO | MEDIUM | Domain knowledge, needs validation |
| Google algorithm | MEDIUM | Based on current guidelines |

---

**Ready for roadmap creation.** Research confirms the project is technically feasible with the existing stack. Main risks are content quality (thin pages) and chart accessibility (client-only rendering), both mitigated by established patterns.
