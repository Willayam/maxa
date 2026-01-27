---
phase: 04-strategy-content
plan: 02
subsystem: content
tags: [seo, svenska, educational-content, json-ld, strategy]

# Dependency graph
requires:
  - phase: 04-01
    provides: Strategy hub page with ClusterCard pattern and layout

provides:
  - Kvantitativa fallor comprehensive content page (XYZ, KVA, NOG, DTK)
  - Verbala fallor comprehensive content page (ORD, LÄS, MEK, ELF)
  - Three-tier summary pattern (TL;DR + section summaries + recap)
  - Article + BreadcrumbList JSON-LD structured data
  - Cross-linking between strategy pages

affects: [04-03-vanliga-misstag, 04-04-tidsstrategi, future-strategy-content]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Three-tier summary pattern (TL;DR at top, section summaries throughout, final recap)
    - Callout box patterns (warning: red, tip: green)
    - Summary table pattern with overflow-x-auto for mobile
    - Related strategies link section at bottom

key-files:
  created:
    - apps/web/src/app/hogskoleprovet/strategier/kvantitativa-fallor/page.tsx
    - apps/web/src/app/hogskoleprovet/strategier/verbala-fallor/page.tsx
  modified: []

key-decisions:
  - "Swedish &ldquo;du-tilltal&rdquo; (direct address) throughout for friendly but authoritative tone"
  - "Three-tier summary: TL;DR at top (5 key bullets), section summaries (border-l-4 callouts), final numbered recap"
  - "Summary tables with Delprov/Fälla/Mekanism/Motdrag columns for quick reference"
  - "Warning callouts (red) for common mistakes, tip callouts (green) for countermeasures"
  - "All quotes escaped using &ldquo; and &rdquo; HTML entities to pass ESLint"

patterns-established:
  - "Callout pattern: bg-{color}-500/10 border-2 border-{color}-500 rounded-xl p-4"
  - "Section summary: border-l-4 border-primary pl-4 bg-card-background p-4 rounded"
  - "Related link cards: hover:border-primary transition with text-primary arrow"

# Metrics
duration: 8min
completed: 2026-01-27
---

# Phase 04 Plan 02: Kvantitativa och Verbala Fällor Summary

**Two comprehensive Swedish-language strategy pages covering all 8 delprov (XYZ, KVA, NOG, DTK, ORD, LÄS, MEK, ELF) with trap explanations, examples, countermeasures, and SEO optimization**

## Performance

- **Duration:** 8 min
- **Started:** 2026-01-27T09:15:34Z
- **Completed:** 2026-01-27T09:23:36Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Created Kvantitativa fallor page (752 lines) with XYZ, KVA, NOG, DTK trap explanations
- Created Verbala fallor page (735 lines) with ORD, LÄS, MEK, ELF trap explanations
- Implemented three-tier summary pattern (TL;DR + section summaries + final recap) on both pages
- Added Article + BreadcrumbList JSON-LD for SEO on both pages
- Established callout box patterns (warning/tip) and summary table format
- Cross-linked both pages to each other and to strategy hub

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Kvantitativa fallor content page** - `2b9c22c` (feat)
   - XYZ: mellanräkningsfällan, enhetsfällan, algebraiska missuppfattningar
   - KVA: begränsade antaganden, geometriska synvillor
   - NOG: C-fällan, sufficiency vs solving, överinformation
   - DTK: kapade y-axeln, enhetsförbistring, kategoriförbistring, relativa vs absoluta

2. **Task 2: Create Verbala fallor content page** - `e296b76` (feat)
   - ORD: falska vänner (interlingvistiska/intralingvistiska), polysemi och arkaismer
   - LÄS: rimliga men ogrundade svar, generaliseringsfällan, orsak-verkan-omkastning
   - MEK: kontextuell dissonans, stilbrott
   - ELF: Swenglish-fällan, vokabulärförvirring

## Files Created/Modified

- `apps/web/src/app/hogskoleprovet/strategier/kvantitativa-fallor/page.tsx` - Comprehensive Swedish content page covering quantitative traps in XYZ, KVA, NOG, DTK with examples, explanations, and countermeasures
- `apps/web/src/app/hogskoleprovet/strategier/verbala-fallor/page.tsx` - Comprehensive Swedish content page covering verbal traps in ORD, LÄS, MEK, ELF with examples, explanations, and countermeasures

## Decisions Made

1. **Three-tier summary pattern:** TL;DR at top (5 key bullets in bg-primary/10 box), section summaries throughout (border-l-4 border-primary callouts), and final numbered recap. This ensures readers get value regardless of how much they read.

2. **Callout box styling:** Warning callouts (bg-red-500/10 border-2 border-red-500) for common mistakes, tip callouts (bg-green-500/10 border-2 border-green-500) for countermeasures. Used sparingly (3-4 per page max) to maintain impact.

3. **Summary tables:** Added quick reference tables (Delprov/Fälla/Hur den fungerar/Motdrag columns) with overflow-x-auto for mobile responsiveness. Provides at-a-glance review of all traps.

4. **Content rewriting:** All content rewritten from source material in own words using Swedish du-tilltal (direct address). No copy-paste, cherry-picked best examples and mechanisms.

5. **HTML entity escaping:** Used &ldquo; and &rdquo; for all quotes to pass ESLint react/no-unescaped-entities rule.

## Deviations from Plan

None - plan executed exactly as written. All content rewritten from source material, all sections implemented as specified, all SEO metadata and JSON-LD added, all internal links established.

## Issues Encountered

**ESLint quote escaping:** Initial build failed with react/no-unescaped-entities errors (38 instances in kvantitativa-fallor). Fixed by replacing all straight quotes in Swedish text with &ldquo; and &rdquo; HTML entities. No functional impact, pure linting fix.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for 04-03 (Vanliga misstag) and 04-04 (Tidsstrategi):**
- Three-tier summary pattern established and can be reused
- Callout box patterns (warning/tip) documented
- Summary table format ready to replicate
- Related strategies link section pattern established
- Cross-linking structure in place (both pages link to vanliga-misstag and tidsstrategi placeholders)

**Content coverage:**
- All 8 delprov (XYZ, KVA, NOG, DTK, ORD, LÄS, MEK, ELF) trap explanations complete
- Estimated 1800-2000 words per page, well within 1500-2500 target
- Each section 200-400 words as specified

**SEO readiness:**
- Proper metadata with keywords, descriptions, canonicals
- Article schema with publisher Maxa, datePublished
- BreadcrumbList with 4-level hierarchy (final item omits item property per Google docs)
- No competitor links (no MittHP, HPAkademin, etc.)

---
*Phase: 04-strategy-content*
*Completed: 2026-01-27*
