# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-26)

**Core value:** Every test page becomes a valuable study resource, not just a download link
**Current focus:** Phase 4 - Strategy Content

## Current Position

Phase: 4 of 6 (Strategy Content)
Plan: 2 of 3 in current phase
Status: In progress
Last activity: 2026-01-27 — Completed 04-02-PLAN.md (Kvantitativa och Verbala Fällor)

Progress: [█████████░] 94%

## Performance Metrics

**Velocity:**
- Total plans completed: 18
- Average duration: 5min
- Total execution time: 1.5 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1. SEO Foundation | 2/2 | 12min | 6min |
| 2. Structured Data | 1/1 | 5min | 5min |
| 3. Normering | 3/3 | 6min | 2min |
| 4. Strategy Content | 2/3 | 11min | 5.5min |
| 5. Cross-Linking | 3/3 | 10min | 3min |
| 6. Complete Normering Data | 3/3 | 43min | 14min |

**Recent Trend:**
- Last 5 plans: 04-02 (8min), 06-02 (6min), 04-01 (3min), 06-03 (14min), 06-01 (9min)
- Trend: UI/content tasks fast (3-8min), data extraction with PDF parsing slower (6-14min)

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Roadmap: 5 phases derived from 20 requirements (quick depth)
- Phase order: SEO foundation first for quick wins and high impact
- metadataBase set to https://maxa.se (no trailing slash) for URL resolution
- Using relative URLs for canonicals to leverage metadataBase
- Adding both canonical and og:url tags for maximum SEO compatibility
- Sitemap uses test.date for lastModified instead of build date for accuracy
- Priority hierarchy: homepage=1.0 > list page=0.9 > test pages=0.8
- Data source consistency: sitemap sources from same @/data/tests as generateStaticParams
- schema-dts for TypeScript types ensuring schema.org compliance
- Article schema (not ScholarlyArticle) per Google rich results requirements
- WithContext<Thing> base type for flexible JsonLd component
- Normering data stored as static JSON for SSG and SEO optimization
- Loader returns null for tests without normering (graceful degradation)
- Bell curve distribution with 41 data points (0.00 to 2.00 in 0.05 increments)
- Manual Recharts installation (shadcn CLI requires components.json setup)
- Progressive enhancement: table-first, chart when JavaScript loads
- Collapsible table when JS enabled, expanded by default when disabled
- Percentile format: "Topp X%" calculated as 100 - cumulativePercentage
- Manual breadcrumb component creation (no shadcn CLI due to missing components.json)
- Breadcrumbs placed before page title for clear navigation hierarchy
- Next.js ImageResponse API for OG image generation (no external dependencies)
- Swedish season labels in OG images: "Våren" / "Hösten" for localization
- Dark theme OG images (#1E1A2D bg, #D4A017 accent) matching site branding
- System sans-serif for OG images (reliability over custom fonts)
- Same-season tests prioritized in related content (+10 bonus over year proximity)
- Related tests algorithm: season match > year proximity > recency for optimal recommendations
- Reusable RelatedTests component for cross-linking (ready for Phase 4 strategy pages)
- PDF extraction via pdftotext with -layout flag for accurate table parsing
- Multiple PDF format handling: comma/period decimals, space-separated thousands, varying score formats
- Full historical normering coverage: 26/26 tests (excluding cancelled VT 2020) have distribution data
- Flexible whitespace splitting for robust PDF text parsing across format variations
- 2020-2023 normering data: COVID-era reduced participation (21k-42k vs normal 40k-60k)
- Extraction script reusable for future normering updates
- TL;DR section uses bg-primary/10 border-2 border-primary styling for visual prominence
- ClusterCard component pattern for hub-to-cluster navigation (local to page, not extracted)
- Strategy hub structure: Back link → Header → TL;DR → Card sections → CTA
- Three-tier summary pattern: TL;DR at top + section summaries throughout + final recap for comprehensive learning
- Callout box patterns: warning (red bg-red-500/10) for mistakes, tip (green bg-green-500/10) for countermeasures
- Summary table pattern with Delprov/Fälla/Mekanism/Motdrag columns for quick reference
- Swedish du-tilltal (direct address) for authoritative but friendly educational content
- HTML entity escaping (&ldquo; &rdquo;) for quotes to pass ESLint react/no-unescaped-entities

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

### Roadmap Evolution

- Phase 6 added: Complete Normering Data - Parse all historical normeringstabeller and display on test pages
- Phase 3 marked complete: Infrastructure working on hosten-2025, remaining tests handled in Phase 6

## Session Continuity

Last session: 2026-01-27 09:23:36Z
Stopped at: Completed 04-02-PLAN.md (Kvantitativa och Verbala Fällor)
Resume file: None

## Next Steps

1. Complete Phase 4 (Strategy Content) - 1 more plan (04-03 for vanliga-misstag and tidsstrategi)
2. Consider milestone audit when all phases complete
3. Monitor for new normeringstabeller releases to keep data current
