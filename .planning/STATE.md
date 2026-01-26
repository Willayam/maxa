# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-26)

**Core value:** Every test page becomes a valuable study resource, not just a download link
**Current focus:** Phase 3 - Normering

## Current Position

Phase: 3 of 5 (Normering)
Plan: 2 of 3 in current phase
Status: In progress
Last activity: 2026-01-27 — Completed 03-02-PLAN.md (Normering Visualization Components)

Progress: [█████░░░░░] 50%

## Performance Metrics

**Velocity:**
- Total plans completed: 5
- Average duration: 5min
- Total execution time: 0.4 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1. SEO Foundation | 2/2 | 12min | 6min |
| 2. Structured Data | 1/1 | 5min | 5min |
| 3. Normering | 2/3 | 6min | 3min |
| 4. Strategy Content | 0/3 | - | - |
| 5. Cross-Linking | 0/3 | - | - |

**Recent Trend:**
- Last 5 plans: 03-02 (4min), 03-01 (2min), 02-01 (5min), 01-02 (4min), 01-01 (8min)
- Trend: Consistently fast execution on UI and data tasks

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

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-01-27 23:10:49Z
Stopped at: Completed 03-02-PLAN.md (Normering Visualization Components)
Resume file: None

## Next Steps

1. Execute 03-03-PLAN.md (Normering Page Integration)
2. Phase 3 delivers: Interactive normering tables with score lookup on test detail pages
3. Phase 4: Strategy Content (SEO landing pages)
