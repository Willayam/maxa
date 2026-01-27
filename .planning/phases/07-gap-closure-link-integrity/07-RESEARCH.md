---
phase: 07-gap-closure-link-integrity
researched: 2026-01-27
status: complete
---

# Phase 7: Gap Closure & Link Integrity - Research Findings

## Research Objective

**Question:** What do I need to know to PLAN this phase well?

**Answer:** This research identifies the technical root causes, impact, and implementation patterns needed to close all remaining gaps from the v1 milestone audit: fix the OG image build blocker, complete sitemap coverage, implement bidirectional linking between tests and strategy content, and clean up tech debt.

---

## Executive Summary

Phase 7 closes 3 critical gaps and 2 tech debt items identified in the v1 milestone audit:

1. **Build Blocker (CRITICAL):** OG image generation fails for 8 older tests (2013-2017) due to missing `display: 'flex'` on nested divs in Satori (ImageResponse)
2. **SEO Gap (HIGH):** 5 strategy pages missing from sitemap.xml, undermining content discoverability
3. **Linking Gap (HIGH):** No bidirectional links between test pages and strategy content (LINK-01, LINK-02)
4. **Tech Debt (LOW):** Outdated TODO comment in types.ts about mock data
5. **Tech Debt (MEDIUM):** No OG images for strategy pages

**Key Finding:** All gaps have straightforward fixes. No architectural changes needed. Linking implementation requires design decisions about mapping strategy content to test types and selecting relevant tests for each strategy page.

---

## Gap 1: OG Image Build Blocker (CRITICAL)

### Problem Description

**Severity:** CRITICAL - blocks production deployment
**Affected:** 8 tests (2013-2017 tests specifically)
**Error:** "Expected <div> to have explicit 'display: flex' or 'display: none' if it has more than one child node."

**Root Cause Analysis:**

The file `apps/web/src/app/hogskoleprovet/[slug]/opengraph-image.tsx` uses Next.js ImageResponse API (powered by Satori) to generate dynamic OG images. Satori has strict flexbox layout requirements:

- All `<div>` elements with multiple children MUST have explicit `display: 'flex'` or `display: 'none'`
- This is a Satori limitation, not a Next.js issue

**Current Code Structure (lines 49-114):**

```tsx
return new ImageResponse(
  (
    <div style={{ display: "flex", ... }}> {/* ROOT - HAS display:flex ✓ */}
      <div style={{ display: "flex", ... }}> {/* INNER - HAS display:flex ✓ */}
        <div style={{ fontSize: 36, ... }}> {/* TEXT CHILD - MISSING display */}
          Högskoleprovet
        </div>
        <div style={{ fontSize: 80, ... }}> {/* TEXT CHILD - MISSING display */}
          {seasonLabel} {test.year}
        </div>
        <div style={{ fontSize: 32, ... }}> {/* TEXT CHILD - MISSING display */}
          PDF, Facit & Normering
        </div>
        <div style={{ display: "flex", ... }}> {/* BUTTON - HAS display:flex ✓ */}
          <div style={{ backgroundColor: "#D4A017", ... }}> {/* MISSING display */}
            Maxa
          </div>
        </div>
      </div>
    </div>
  ),
  { ...size }
);
```

**Issue:** Lines 72-93 have nested `<div>` elements without `display: 'flex'`. While these divs only contain text (not multiple child nodes), Satori's parser may be tripping on the parent-child relationships at lines 94-112 (the button container with a styled child div).

**Why Only 8 Tests Fail:**

Build errors occur during static generation at build time. The error message shows:
- `/hogskoleprovet/hosten-2017/opengraph-image`
- `/hogskoleprovet/varen-2017/opengraph-image`
- `/hogskoleprovet/hosten-2016/opengraph-image`
- `/hogskoleprovet/varen-2016/opengraph-image`
- `/hogskoleprovet/hosten-2015/opengraph-image`
- `/hogskoleprovet/varen-2015/opengraph-image`
- `/hogskoleprovet/hosten-2014/opengraph-image`
- (8th test likely `/hogskoleprovet/varen-2014/opengraph-image`)

**Hypothesis:** This is likely a race condition or resource exhaustion during parallel static generation. Satori may be more strict when under memory pressure, causing failures for tests generated later in the build process (2013-2017 being older tests).

### Fix Strategy

**Option A: Explicit display:flex on all divs (RECOMMENDED)**
- Add `display: 'flex'` to ALL `<div>` elements in the JSX
- Use `flexDirection: 'column'` for vertical stacking (text elements)
- Most reliable, explicit approach

**Option B: Flatten structure**
- Remove nested divs where possible
- Use margin/padding for spacing instead of container divs
- Reduces complexity but may affect layout control

**Recommendation:** Option A. Adding `display: 'flex'` with `flexDirection: 'column'` is explicit, maintains layout control, and follows Satori's requirements exactly.

### Implementation Details

**File:** `apps/web/src/app/hogskoleprovet/[slug]/opengraph-image.tsx`

**Changes needed:**
1. Line 72-79: Add `display: 'flex'` to "Högskoleprovet" text container
2. Line 81-83: Add `display: 'flex'` to season/year text container
3. Line 84-91: Add `display: 'flex'` to "PDF, Facit & Normering" text container
4. Line 100-108: Add `display: 'flex'` to "Maxa" button inner div

**Pattern:**
```tsx
<div
  style={{
    display: 'flex',
    flexDirection: 'column', // or 'row' for horizontal
    // ... rest of styles
  }}
>
```

### Verification

**Test:** Run `bun run build` and verify no OG image errors
**Expected:** All 28 test pages (26 from tests.ts + homepage + list page) generate OG images successfully
**Evidence:** Build completes without "Expected <div> to have explicit display" errors

---

## Gap 2: Strategy Pages Missing from Sitemap (HIGH)

### Problem Description

**Severity:** HIGH - SEO impact
**Affected:** 5 strategy pages not in sitemap.xml
**Impact:** Search engines may not efficiently discover strategy content

**Missing URLs:**
1. `/hogskoleprovet/strategier` (hub page)
2. `/hogskoleprovet/strategier/kvantitativa-fallor`
3. `/hogskoleprovet/strategier/verbala-fallor`
4. `/hogskoleprovet/strategier/vanliga-misstag`
5. `/hogskoleprovet/strategier/tidsstrategi`

### Current Sitemap Structure

**File:** `apps/web/src/app/sitemap.ts`

```typescript
export default function sitemap(): MetadataRoute.Sitemap {
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

  const testRoutes: MetadataRoute.Sitemap = tests.map((test) => ({
    url: `${BASE_URL}/hogskoleprovet/${test.slug}`,
    lastModified: new Date(test.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...testRoutes]
}
```

**Current priority hierarchy:**
- Homepage: 1.0
- Test list page: 0.9
- Test detail pages: 0.8

### Fix Strategy

**Add strategy routes section:**

```typescript
const strategyRoutes: MetadataRoute.Sitemap = [
  {
    url: `${BASE_URL}/hogskoleprovet/strategier`,
    lastModified: new Date('2026-01-27'), // Phase 4 completion date
    changeFrequency: 'monthly',
    priority: 0.85, // Between list page (0.9) and test pages (0.8)
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

return [...staticRoutes, ...strategyRoutes, ...testRoutes]
```

**Priority Rationale:**
- Strategy pages (0.85) > Test pages (0.8): Strategy content is evergreen educational material
- Strategy pages (0.85) < List page (0.9): List page is primary navigation hub
- All strategy pages equal priority (0.85): Similar content depth and importance

**lastModified Rationale:**
- Use Phase 4 completion date (2026-01-27) when strategy content was written
- All 5 pages created in same phase, use same date
- changeFrequency 'monthly': Strategy content may be refined but rarely changes

### Alternative: Data-Driven Approach

**Could create strategy data file:**
```typescript
// apps/web/src/data/strategies.ts
export const strategies = [
  { slug: 'kvantitativa-fallor', title: '...', publishedDate: '2026-01-27' },
  { slug: 'verbala-fallor', title: '...', publishedDate: '2026-01-27' },
  // ...
]
```

**Pros:** Easier to maintain if strategy pages grow
**Cons:** Adds abstraction for only 5 pages, overkill for current scope

**Recommendation:** Inline strategy routes (no data file). Only 5 pages, unlikely to grow significantly in v1.

### Verification

**Test:** Visit `http://localhost:3000/sitemap.xml` and verify 5 strategy URLs present
**Expected:** Sitemap contains 33 URLs (1 homepage + 1 list page + 5 strategy pages + 26 test pages)
**Evidence:** XML response includes all `/hogskoleprovet/strategier` paths with priority 0.85

---

## Gap 3: Bidirectional Linking (HIGH)

### Problem Description

**Severity:** HIGH - user discovery flow broken
**Requirements:** LINK-01, LINK-02
**Impact:** Users on test pages cannot discover strategy content; strategy readers cannot jump to specific practice tests

**LINK-01: Strategy links from test pages**
- **Current state:** Test detail pages have NO links to strategy content
- **Required:** Test pages should link to relevant strategy content based on test type/content

**LINK-02: Test links from strategy pages**
- **Current state:** Strategy pages only link generically to `/hogskoleprovet` (list page)
- **Required:** Strategy pages should link to specific practice tests, not just generic list

### Current Linking Architecture

**Test Pages → Strategy (LINK-01):**
- **File:** `apps/web/src/app/hogskoleprovet/[slug]/page.tsx`
- **Current links:** Breadcrumb → List page, Back link → List page, RelatedTests → Other test pages
- **Missing:** No "Learn strategies" or "How to avoid common mistakes" section

**Strategy Pages → Tests (LINK-02):**
- **File:** `apps/web/src/app/hogskoleprovet/strategier/*/page.tsx`
- **Current links:** All 4 strategy pages have a CTA section at the bottom:
  ```tsx
  <Link href="/hogskoleprovet" className="...">
    <h3>Gamla högskoleprov</h3>
    <p>Provfrågor, facit och normering från 2013 till idag</p>
  </Link>
  ```
- **Issue:** Generic link to list page, no specific test recommendations

### Fix Strategy: LINK-01 (Test → Strategy)

**Design Decision Required:** Where to place strategy links on test pages?

**Option A: After RelatedTests section (RECOMMENDED)**
```tsx
<RelatedTests currentTest={test} />

{/* NEW: Strategy content section */}
<section className="mt-16 pt-8 border-t border-border">
  <h2 className="text-xl font-bold text-foreground mb-4">
    Lär dig strategier
  </h2>
  <p className="text-foreground-muted mb-6">
    Förbättra ditt resultat genom att lära dig känna igen vanliga fallor och optimera din tidsplanering.
  </p>
  <div className="grid gap-3">
    <Link href="/hogskoleprovet/strategier/kvantitativa-fallor" className="...">
      Kvantitativa fällor →
    </Link>
    <Link href="/hogskoleprovet/strategier/verbala-fallor" className="...">
      Verbala fällor →
    </Link>
    <Link href="/hogskoleprovet/strategier/vanliga-misstag" className="...">
      Vanliga misstag →
    </Link>
    <Link href="/hogskoleprovet/strategier/tidsstrategi" className="...">
      Tidsstrategi →
    </Link>
  </div>
</section>
```

**Option B: Between test files and normering**
- Places strategies earlier in page flow
- User sees strategies before diving into normering data
- Con: Breaks existing flow (Provpass → Facit → Normering)

**Option C: Component extraction**
```tsx
// apps/web/src/components/navigation/strategy-links.tsx
export function StrategyLinks() {
  return (/* same JSX as Option A */);
}
```

**Recommendation:** Option A with inline JSX. Simple, visible after main content, matches RelatedTests pattern. Component extraction (Option C) is premature optimization for a static list of 4 links.

**Alternative: Conditional Strategy Links**

Could show only relevant strategies based on test content:
- Tests with strong kvantitativ focus → Highlight kvantitativa-fallor
- Tests with strong verbal focus → Highlight verbala-fallor

**Issue:** No metadata in `tests.ts` indicates test content focus. All tests have both sections.

**Decision:** Show all 4 strategy links on every test page. Uniform UX, no complex logic needed.

### Fix Strategy: LINK-02 (Strategy → Tests)

**Current Implementation:**

All 4 strategy content pages (`kvantitativa-fallor`, `verbala-fallor`, `vanliga-misstag`, `tidsstrategi`) have identical CTA sections at the bottom:

```tsx
<section className="pt-8 border-t border-border">
  <h2>Öva med gamla prov</h2>
  <p>Nu när du känner till strategierna – testa dem på riktiga högskoleprov.</p>
  <Link href="/hogskoleprovet" className="...">
    <h3>Gamla högskoleprov</h3>
    <p>Provfrågor, facit och normering från 2013 till idag</p>
  </Link>
</section>
```

**Problem:** Generic link to `/hogskoleprovet` (test list page). No specific test recommendations.

**Design Decision Required:** Which tests to recommend on each strategy page?

**Option A: Recent tests (RECOMMENDED)**
- Show 3-4 most recent tests
- Rationale: Newer tests have normering data, more likely to be useful for practice
- Implementation: `tests.slice(0, 4)` (tests.ts is sorted newest first)

**Option B: Smart matching**
- `kvantitativa-fallor` → Tests with strong KVA/NOG/DTK content (requires metadata)
- `verbala-fallor` → Tests with strong ORD/LÄS/MEK content (requires metadata)
- Issue: No test content metadata available in `tests.ts`

**Option C: Same season priority**
- Show tests from upcoming season (if våren page, show våren tests)
- Issue: Strategy pages are not seasonal, they're evergreen

**Option D: All tests with better UX**
- Replace single generic link with a grid of recent tests
- Similar to RelatedTests component but without "related" logic

**Recommendation:** Option A (Recent tests). Show 4 most recent tests in a grid, replacing the generic link to `/hogskoleprovet`. Simple, no complex logic, gives users immediate practice options.

**Implementation Pattern:**

```tsx
// Replace current CTA section with:
<section className="pt-8 border-t border-border">
  <h2 className="text-2xl font-bold text-foreground mb-2">
    Öva med gamla prov
  </h2>
  <p className="text-foreground-muted mb-6">
    Nu när du känner till strategierna – testa dem på riktiga högskoleprov.
  </p>
  <div className="grid gap-3">
    {tests.slice(0, 4).map((test) => {
      const seasonLabel = test.season === "vår" ? "Våren" : "Hösten";
      return (
        <Link
          key={test.id}
          href={`/hogskoleprovet/${test.slug}`}
          className="block p-4 bg-card-background rounded-xl border-2 border-border hover:border-primary transition-colors group"
        >
          <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {seasonLabel} {test.year}
          </span>
          <span className="text-foreground-muted group-hover:text-primary ml-2">
            →
          </span>
        </Link>
      );
    })}
  </div>
  <Link
    href="/hogskoleprovet"
    className="block mt-4 text-primary hover:underline text-center"
  >
    Se alla prov →
  </Link>
</section>
```

**Note:** This reuses the same card styling as RelatedTests component for consistency.

### Component Extraction Consideration

Both LINK-01 and LINK-02 implementations are inline JSX. Should we extract components?

**Option A: Inline JSX (RECOMMENDED for Phase 7)**
- Pros: Faster implementation, clear what's happening, no premature abstraction
- Cons: Duplication across 4 strategy pages (LINK-02)

**Option B: Extract components**
```tsx
// apps/web/src/components/navigation/strategy-links.tsx
export function StrategyLinks() { /* ... */ }

// apps/web/src/components/navigation/recent-tests.tsx
export function RecentTests({ count = 4 }) { /* ... */ }
```
- Pros: DRY, easier to update all pages at once
- Cons: Adds abstraction layer, more files to manage

**Recommendation for Phase 7:** Inline JSX for LINK-01 (only 1 file to update: [slug]/page.tsx). For LINK-02, since we need to update 4 strategy pages, we should extract a `RecentTests` component for maintainability.

**Revised LINK-02 Implementation:**

```tsx
// apps/web/src/components/navigation/recent-tests.tsx
import Link from "next/link";
import { tests } from "@/data/tests";

interface RecentTestsProps {
  count?: number;
}

export function RecentTests({ count = 4 }: RecentTestsProps) {
  const recentTests = tests.slice(0, count);

  return (
    <section className="pt-8 border-t border-border">
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Öva med gamla prov
      </h2>
      <p className="text-foreground-muted mb-6">
        Nu när du känner till strategierna – testa dem på riktiga högskoleprov.
      </p>
      <div className="grid gap-3">
        {recentTests.map((test) => {
          const seasonLabel = test.season === "vår" ? "Våren" : "Hösten";
          return (
            <Link
              key={test.id}
              href={`/hogskoleprovet/${test.slug}`}
              className="block p-4 bg-card-background rounded-xl border-2 border-border hover:border-primary transition-colors group"
            >
              <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {seasonLabel} {test.year}
              </span>
              <span className="text-foreground-muted group-hover:text-primary ml-2">
                →
              </span>
            </Link>
          );
        })}
      </div>
      <Link
        href="/hogskoleprovet"
        className="block mt-4 text-primary hover:underline text-center"
      >
        Se alla prov →
      </Link>
    </section>
  );
}
```

**Usage in strategy pages:**

```tsx
// In all 4 strategy pages: kvantitativa-fallor, verbala-fallor, vanliga-misstag, tidsstrategi
import { RecentTests } from "@/components/navigation/recent-tests";

// Replace current CTA section with:
<RecentTests count={4} />
```

### Verification: LINK-01 & LINK-02

**LINK-01 Test:**
1. Visit `http://localhost:3000/hogskoleprovet/hosten-2025`
2. Scroll to bottom after RelatedTests
3. Verify "Lär dig strategier" section with 4 strategy links
4. Click each link, verify navigation to strategy pages

**LINK-02 Test:**
1. Visit `http://localhost:3000/hogskoleprovet/strategier/kvantitativa-fallor`
2. Scroll to bottom
3. Verify "Öva med gamla prov" section shows 4 recent tests (not generic link)
4. Click test links, verify navigation to test pages
5. Click "Se alla prov →" link, verify navigation to `/hogskoleprovet`

---

## Gap 4: Outdated TODO Comment (LOW)

### Problem Description

**Severity:** LOW - tech debt, no functional impact
**Location:** `apps/web/src/lib/normering/types.ts` line 8
**Issue:** Comment states "TODO: Current data in hosten-2025.json is MOCK DATA" but Phase 6 completed normering data extraction for all 26 tests

**Current Comment:**

```typescript
/**
 * Normering (score normalization) data types for Högskoleprovet
 *
 * DATA FORMAT NOTES:
 * - Total (hela provet): HP scores in 0.05 increments (0.00, 0.05, 0.10, ... 2.00)
 * - Verbal and Kvantitativ: HP scores in 0.10 increments (0.00, 0.10, 0.20, ... 2.00)
 *
 * TODO: Current data in hosten-2025.json is MOCK DATA with realistic distribution.
 * Real data should be extracted from official studera.nu PDFs:
 * - norm{YY}{season}-helaprovet.pdf (total)
 * - norm{YY}{season}-verb.pdf (verbal)
 * - norm{YY}{season}-kvant.pdf (kvantitativ)
 */
```

### Fix Strategy

**Option A: Remove TODO entirely**
- Rationale: Phase 6 completed all normering data extraction, no mock data remains
- Con: Loses context about data source

**Option B: Update TODO to reference data source (RECOMMENDED)**

```typescript
/**
 * Normering (score normalization) data types for Högskoleprovet
 *
 * DATA FORMAT NOTES:
 * - Total (hela provet): HP scores in 0.05 increments (0.00, 0.05, 0.10, ... 2.00)
 * - Verbal and Kvantitativ: HP scores in 0.10 increments (0.00, 0.10, 0.20, ... 2.00)
 *
 * DATA SOURCE:
 * Normering data extracted from official studera.nu PDFs:
 * - norm{YY}{season}-helaprovet.pdf (total)
 * - norm{YY}{season}-verb.pdf (verbal)
 * - norm{YY}{season}-kvant.pdf (kvantitativ)
 *
 * All data stored in src/data/normering/*.json (26 tests: 2013-2025, both seasons)
 */
```

**Recommendation:** Option B. Keeps documentation about data source but removes misleading TODO about mock data.

### Verification

**Test:** Read `apps/web/src/lib/normering/types.ts`
**Expected:** No TODO comment, clear documentation about data source and format
**Evidence:** File contains "DATA SOURCE:" section instead of "TODO:" comment

---

## Gap 5: No OG Images for Strategy Pages (MEDIUM)

### Problem Description

**Severity:** MEDIUM - social sharing limited but not broken
**Affected:** 5 strategy pages have no OG images
**Impact:** When shared on social media, strategy pages use fallback metadata (text-only, no custom image)

**Missing OG images:**
1. `/hogskoleprovet/strategier/opengraph-image.tsx` (hub page)
2. `/hogskoleprovet/strategier/kvantitativa-fallor/opengraph-image.tsx`
3. `/hogskoleprovet/strategier/verbala-fallor/opengraph-image.tsx`
4. `/hogskoleprovet/strategier/vanliga-misstag/opengraph-image.tsx`
5. `/hogskoleprovet/strategier/tidsstrategi/opengraph-image.tsx`

### Current OG Image Pattern

**Existing implementations:**
- `apps/web/src/app/opengraph-image.tsx` - Root page OG image
- `apps/web/src/app/hogskoleprovet/opengraph-image.tsx` - Test list page OG image
- `apps/web/src/app/hogskoleprovet/[slug]/opengraph-image.tsx` - Dynamic test page OG images

**Common pattern:**
```typescript
import { ImageResponse } from "next/og";

export const alt = "Högskoleprovet - Maxa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", /* dark theme styling */ }}>
        {/* Content */}
      </div>
    ),
    { ...size }
  );
}
```

**Design tokens (from Phase 5):**
- Background: `#1E1A2D` (dark theme)
- Accent: `#D4A017` (gold)
- Text: `#F5F5F5` (light)
- Font: System sans-serif (reliability over custom fonts)
- Size: 1200x630 (standard OG image size)

### Fix Strategy

**Option A: Static OG images for each page**
- Create 5 separate `opengraph-image.tsx` files
- Each file renders its specific page title
- Pros: Simple, explicit, full control over each image
- Cons: 5 files to maintain, duplication

**Option B: Dynamic OG image generation**
- Create single `opengraph-image.tsx` at `/strategier/` level
- Use route params to determine which strategy page
- Pros: DRY, easier to update styling
- Cons: More complex, requires param handling

**Option C: Skip OG images (NOT RECOMMENDED)**
- Let Next.js use text metadata only
- Pros: No work needed
- Cons: Poor social sharing UX, inconsistent with test pages

**Recommendation:** Option A (Static OG images). Strategy pages are small set (5 pages), each has unique branding needs. Static approach is simpler and more maintainable than dynamic generation for this scale.

### Implementation Pattern

**Template for strategy OG images:**

```typescript
// apps/web/src/app/hogskoleprovet/strategier/kvantitativa-fallor/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const alt = "Kvantitativa Fällor - Högskoleprovet Strategier - Maxa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1E1A2D",
          color: "#F5F5F5",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 36,
              opacity: 0.7,
              marginBottom: 16,
            }}
          >
            HP Strategier
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: "bold",
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            Kvantitativa Fällor
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              opacity: 0.8,
              textAlign: "center",
            }}
          >
            Undvik fallor i XYZ, KVA, NOG och DTK
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 60,
            }}
          >
            <div
              style={{
                display: "flex",
                backgroundColor: "#D4A017",
                color: "#1E1A2D",
                padding: "12px 32px",
                borderRadius: 12,
                fontSize: 28,
                fontWeight: "bold",
              }}
            >
              Maxa
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
```

**Content for each page:**

1. **kvantitativa-fallor:**
   - Title: "Kvantitativa Fällor"
   - Subtitle: "Undvik fallor i XYZ, KVA, NOG och DTK"

2. **verbala-fallor:**
   - Title: "Verbala Fällor"
   - Subtitle: "Undvik fallor i ORD, LÄS, MEK och ELF"

3. **vanliga-misstag:**
   - Title: "Vanliga Misstag"
   - Subtitle: "De 12 misstagen som sänker ditt resultat"

4. **tidsstrategi:**
   - Title: "Tidsstrategi"
   - Subtitle: "Maximera poängen per minut"

5. **strategier (hub):**
   - Title: "HP Strategier"
   - Subtitle: "Knäck högskoleprovet med rätt teknik"

**CRITICAL:** All divs must have `display: 'flex'` to avoid the same Satori issue affecting test page OG images (Gap 1).

### Verification

**Test:** Use social media debugger tools
- https://cards-dev.twitter.com/validator
- https://developers.facebook.com/tools/debug/

**URLs to test:**
- `/hogskoleprovet/strategier`
- `/hogskoleprovet/strategier/kvantitativa-fallor`
- `/hogskoleprovet/strategier/verbala-fallor`
- `/hogskoleprovet/strategier/vanliga-misstag`
- `/hogskoleprovet/strategier/tidsstrategi`

**Expected:**
- All pages show custom OG image
- Dark theme (#1E1A2D background)
- Gold accent (#D4A017 on Maxa button)
- Correct title and subtitle for each page
- 1200x630 size, proper cropping

---

## Implementation Dependencies & Order

### Dependency Graph

```
Gap 1 (OG Image Fix) → Gap 5 (Strategy OG Images)
   ↓
Gap 2 (Sitemap)
   ↓
Gap 3 (Bidirectional Links)
   ↓
Gap 4 (TODO Cleanup)
```

**Rationale:**
1. **Gap 1 must be first:** Fixes the build blocker. Cannot deploy anything else until build succeeds.
2. **Gap 5 depends on Gap 1:** Uses same pattern, must apply flexbox fix to avoid same error.
3. **Gap 2 independent:** Can be done after Gap 1, before or after Gap 3.
4. **Gap 3 independent:** Can be done after Gap 1, before or after Gap 2.
5. **Gap 4 last:** Tech debt cleanup, no dependencies, can be done anytime.

### Recommended Implementation Order

**Phase 7.1: Fix Build Blocker**
- Gap 1: OG image flexbox fix
- Verify: `bun run build` succeeds

**Phase 7.2: Add Strategy OG Images**
- Gap 5: Create 5 OG image files for strategy pages
- Verify: Social debugger shows images

**Phase 7.3: Complete Sitemap**
- Gap 2: Add 5 strategy routes to sitemap
- Verify: sitemap.xml contains all 33 URLs

**Phase 7.4: Implement Bidirectional Linking**
- Gap 3a (LINK-01): Add strategy links section to test detail pages
- Gap 3b (LINK-02): Create RecentTests component and update 4 strategy pages
- Verify: Manual navigation testing

**Phase 7.5: Cleanup Tech Debt**
- Gap 4: Update TODO comment in types.ts
- Verify: No remaining TODOs in normering code

---

## Success Criteria Mapping

From Phase 7 requirements, here's how each gap closure maps to success criteria:

| Criteria | Gap | Implementation | Verification |
|----------|-----|----------------|--------------|
| 1. OG image generation works for all tests including 2013-2017 | Gap 1 | Add `display: 'flex'` to all divs in opengraph-image.tsx | Build succeeds without errors |
| 2. Sitemap includes all 5 strategy page URLs | Gap 2 | Add strategyRoutes array to sitemap.ts | Visit /sitemap.xml, count 33 URLs |
| 3. Test detail pages link to relevant strategy content (LINK-01) | Gap 3 | Add "Lär dig strategier" section after RelatedTests | Manual click testing on test pages |
| 4. Strategy pages link to specific practice tests (LINK-02) | Gap 3 | Replace generic link with RecentTests component | Manual click testing on strategy pages |
| 5. OG images exist for strategy pages | Gap 5 | Create 5 opengraph-image.tsx files | Social debugger validation |
| 6. Every internal link on site resolves (zero 404s) | Gap 3 | Correct href paths in all new links | Manual testing + potential link checker tool |
| 7. Outdated TODO in types.ts cleaned up | Gap 4 | Remove/update TODO comment | Read file, verify no TODO |

---

## Risk Assessment

### Low Risk Items
- **Gap 2 (Sitemap):** Straightforward array addition, no complexity
- **Gap 4 (TODO):** Simple comment update, zero functional impact
- **Gap 1 (OG Image):** Clear fix pattern, well-understood issue

### Medium Risk Items
- **Gap 5 (Strategy OG Images):** Must apply same flexbox fix as Gap 1, otherwise introduces same build blocker
- **Gap 3 (LINK-02):** Component extraction across 4 pages, risk of inconsistency if one page missed

### Mitigation Strategies

**For Gap 5:**
- Copy exact pattern from Gap 1 fix
- Verify `display: 'flex'` on ALL divs before testing
- Test build locally before committing

**For Gap 3 (LINK-02):**
- Extract RecentTests component first
- Update all 4 strategy pages in single commit
- Verify all 4 pages render correctly before marking complete

**General:**
- Test build after each gap closure
- Manual verification of all links before final commit
- Use browser's link checker extension to verify zero 404s

---

## Open Questions for Planning

### Question 1: LINK-01 Placement
**Q:** Should strategy links section go before or after RelatedTests on test pages?
**Recommendation:** After RelatedTests. Keeps existing page flow (breadcrumb → content → related → strategies).

### Question 2: LINK-02 Test Count
**Q:** Show 3, 4, or 5 recent tests on strategy pages?
**Recommendation:** 4 tests. Matches RelatedTests count for consistency.

### Question 3: Strategy Hub OG Image
**Q:** Should strategy hub page (`/strategier`) have unique OG image content vs individual pages?
**Recommendation:** Yes. Hub shows "HP Strategier - Knäck högskoleprovet med rätt teknik" (more general), individual pages show specific content (e.g., "Kvantitativa Fällor").

### Question 4: Sitemap Priority for Strategy Pages
**Q:** Should all strategy pages have same priority (0.85) or should hub be higher?
**Recommendation:** Same priority (0.85). Hub is navigation page, individual pages are content. Equal SEO value.

### Question 5: Link Validation
**Q:** Should we add automated link checking to CI/CD?
**Recommendation:** Out of scope for Phase 7. Manual verification sufficient for v1 milestone. Consider for future enhancement.

---

## Prior Art & Patterns

### From Phase 5 (Cross-Linking & Polish)

**RelatedTests component pattern:**
- Algorithm in `lib/related-content.ts` (separation of concerns)
- Component in `components/navigation/related-tests.tsx` (presentation)
- Reusable, props-based API

**Apply to Phase 7:**
- RecentTests should follow same pattern
- Algorithm (tests.slice) is trivial, can be inline
- Component handles presentation, keeps strategy pages DRY

### From Phase 1 (SEO Foundation)

**Sitemap pattern:**
- Static routes hardcoded
- Dynamic routes from data (tests.ts)
- Clear priority hierarchy

**Apply to Phase 7:**
- Strategy routes follow same pattern as static routes
- Use same priority structure (homepage > list > content > detail)

### From Phase 5 (OG Images)

**ImageResponse pattern:**
- System sans-serif (no custom font loading)
- Dark theme consistent with site design
- Explicit exports: alt, size, contentType, default
- generateStaticParams for dynamic routes

**Apply to Phase 7:**
- Strategy OG images use exact same styling
- CRITICAL: Apply flexbox fix from Gap 1 to all new OG images

---

## References & Documentation

### External Resources

1. **Next.js ImageResponse API:**
   - https://nextjs.org/docs/app/api-reference/functions/image-response
   - Powered by Satori + Resvg

2. **Satori Flexbox Requirements:**
   - https://github.com/vercel/satori#css
   - All multi-child divs must have explicit `display: 'flex'` or `display: 'none'`

3. **Sitemap Protocol:**
   - https://www.sitemaps.org/protocol.html
   - Priority: 0.0 to 1.0, changeFrequency: always/hourly/daily/weekly/monthly/yearly/never

4. **OpenGraph Protocol:**
   - https://ogp.me/
   - Standard: 1200x630 for og:image

### Internal References

1. **Phase 5 VERIFICATION.md:**
   - `/Users/williamlarsten/conductor/workspaces/maxa/trenton-v1/.planning/phases/05-cross-linking-polish/05-VERIFICATION.md`
   - Reference for OG image patterns, RelatedTests implementation

2. **v1 Milestone Audit:**
   - `/Users/williamlarsten/conductor/workspaces/maxa/trenton-v1/.planning/v1-MILESTONE-AUDIT.md`
   - Source of all gaps, requirements, and success criteria

3. **Existing Components:**
   - `apps/web/src/components/navigation/related-tests.tsx` - Pattern for RecentTests
   - `apps/web/src/app/hogskoleprovet/[slug]/opengraph-image.tsx` - Pattern for OG images
   - `apps/web/src/app/sitemap.ts` - Pattern for sitemap structure

---

## Conclusion

Phase 7 has clear, well-defined fixes for all 5 gaps. No architectural changes needed. Main implementation work is:

1. **Fix flexbox in existing OG image** (Gap 1) - 15 minutes
2. **Create 5 strategy OG images** (Gap 5) - 45 minutes
3. **Add 5 routes to sitemap** (Gap 2) - 10 minutes
4. **Add strategy links to test pages** (Gap 3a) - 20 minutes
5. **Create RecentTests component and update 4 strategy pages** (Gap 3b) - 30 minutes
6. **Update TODO comment** (Gap 4) - 5 minutes

**Estimated total:** 2-2.5 hours of implementation + testing

**Critical path:** Gap 1 (build blocker) must be fixed first. All other gaps can be parallelized or done in any order.

**Risks:** Low to medium. Main risk is forgetting to apply flexbox fix to new OG images (Gap 5). Mitigation: Test build after each change.

---

**Research Status:** COMPLETE
**Next Step:** Create detailed execution plan (07-PLAN.md) with specific file changes, code snippets, and verification steps.
