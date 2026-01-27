# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-26)

**Core value:** Every test page becomes a valuable study resource, not just a download link
**Current focus:** Phase 6 - Complete Normering Data

## Current Position

Phase: 5 of 6 (Cross-Linking & Polish)
Plan: 1 of 3 in current phase
Status: In progress
Last activity: 2026-01-27 — Completed 05-01-PLAN.md (Breadcrumb Navigation)

Progress: [███████░░░] 70%

## Performance Metrics

**Velocity:**
- Total plans completed: 7
- Average duration: 3min
- Total execution time: 0.4 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1. SEO Foundation | 2/2 | 12min | 6min |
| 2. Structured Data | 1/1 | 5min | 5min |
| 3. Normering | 3/3 | 6min | 2min |
| 4. Strategy Content | 0/3 | - | - |
| 5. Cross-Linking | 1/3 | 3min | 3min |
| 6. Complete Normering Data | 0/3 | - | - |

**Recent Trend:**
- Last 5 plans: 05-01 (3min), 03-02 (4min), 03-01 (2min), 02-01 (5min), 01-02 (4min)
- Trend: Consistently fast execution on UI and navigation tasks

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

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

### Roadmap Evolution

- Phase 6 added: Complete Normering Data - Parse all historical normeringstabeller and display on test pages
- Phase 3 marked complete: Infrastructure working on hosten-2025, remaining tests handled in Phase 6

## Session Continuity

Last session: 2026-01-27 09:00:04Z
Stopped at: Completed 05-01-PLAN.md (Breadcrumb Navigation)
Resume file: None

## Next Steps

1. Continue Phase 5 (Cross-Linking & Polish) - 2 more plans
2. Plan and execute Phase 6 (Complete Normering Data)
3. Consider Phase 4 (Strategy Content) priority based on launch timeline
