# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-26)

**Core value:** Every test page becomes a valuable study resource, not just a download link
**Current focus:** Phase 5 complete, Phase 6 in progress

## Current Position

Phase: 6 of 6 (Complete Normering Data)
Plan: 1 of 3 in current phase
Status: In progress (Phase 5 just completed)
Last activity: 2026-01-27 — Phase 5 (Cross-Linking & Polish) complete

Progress: [█████████░] 90%

## Performance Metrics

**Velocity:**
- Total plans completed: 12
- Average duration: 4min
- Total execution time: 0.7 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1. SEO Foundation | 2/2 | 12min | 6min |
| 2. Structured Data | 1/1 | 5min | 5min |
| 3. Normering | 3/3 | 6min | 2min |
| 4. Strategy Content | 0/3 | - | - |
| 5. Cross-Linking | 3/3 | 10min | 3min |
| 6. Complete Normering Data | 1/3 | 9min | 9min |

**Recent Trend:**
- Last 5 plans: 06-01 (9min), 05-02 (5min), 05-01 (3min), 03-02 (4min), 03-01 (2min)
- Trend: Data extraction tasks take longer (9min) than UI tasks (2-5min)

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

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

### Roadmap Evolution

- Phase 6 added: Complete Normering Data - Parse all historical normeringstabeller and display on test pages
- Phase 3 marked complete: Infrastructure working on hosten-2025, remaining tests handled in Phase 6

## Session Continuity

Last session: 2026-01-27
Stopped at: Phase 5 (Cross-Linking & Polish) complete
Resume file: None

## Next Steps

1. Complete Phase 6 (Complete Normering Data) - 2 more plans (06-02 for 2020-2023, 06-03 for 2013-2019)
2. Plan Phase 4 (Strategy Content) - Swedish strategy pages
3. Consider milestone audit when all phases complete
