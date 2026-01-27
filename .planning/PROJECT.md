# Maxa SEO & Content Enhancement

## What This Is

A comprehensive SEO and content enhancement project for Maxa's Hogskoleprovet web app. We're transforming basic test download pages into rich, SEO-optimized study resources with interactive normering (score conversion) visualizations and strategic study content. The goal is to establish topical authority for Hogskoleprovet-related searches through content depth, proper technical SEO, and internal linking.

## Core Value

**Every test page becomes a valuable study resource, not just a download link.** Users find actionable data (normering charts) and strategy insights, while search engines see structured, crawlable content that establishes Maxa as an authority on Hogskoleprovet.

## Requirements

### Validated

- [x] Test listing page at `/hogskoleprovet` with all historical tests — existing
- [x] Test detail pages at `/hogskoleprovet/[slug]` with PDF downloads — existing
- [x] Static site generation for test pages (good for SEO) — existing
- [x] Convex backend for file storage and metadata — existing
- [x] PostHog analytics integration — existing
- [x] Dark/light theme support — existing
- [x] Permanent redirects from old URLs (`/gamla-prov/*`) — existing

### Active

**SEO Infrastructure**
- [ ] SEO-01: Dynamic sitemap.xml generation including all test pages
- [ ] SEO-02: robots.txt with proper crawler directives
- [ ] SEO-03: JSON-LD structured data on all pages (BreadcrumbList, Article/ScholarlyArticle)
- [ ] SEO-04: Canonical URLs on all pages
- [ ] SEO-05: OpenGraph images for social sharing (static or dynamic)
- [ ] SEO-06: Enhanced page metadata (titles, descriptions) optimized for search intent

**Normering Visualizations**
- [ ] NORM-01: Extract normering data from existing PDF files into structured format
- [ ] NORM-02: Store normering data (Convex or static JSON)
- [ ] NORM-03: Interactive normering chart component (shadcn charts)
- [ ] NORM-04: Accessible data table (bot-readable) alongside charts
- [ ] NORM-05: Normering section on all test detail pages

**Strategy Content Hub**
- [ ] STRAT-01: Kvantitativa fallor page (XYZ, KVA, NOG, DTK traps)
- [ ] STRAT-02: Verbala fallor page (ORD, LAS, MEK, ELF traps)
- [ ] STRAT-03: Vanliga misstag page (common mistakes and countermeasures)
- [ ] STRAT-04: Tidsstrategi page (time management and test-taking strategy)
- [ ] STRAT-05: Content in Swedish, rewritten for web from research source material

**Cross-Linking & Navigation**
- [ ] LINK-01: Strategy page links from test detail pages (contextual)
- [ ] LINK-02: Test page links from strategy pages ("Practice with real tests")
- [ ] LINK-03: Related tests section on each test page
- [ ] LINK-04: Breadcrumb navigation on all pages

### Out of Scope

- Interactive trap examples/visualizations on strategy pages — complexity, defer to v2
- Video content — different content type, separate initiative
- User accounts/progress tracking — separate feature milestone
- Mobile app content sync — app has different content strategy
- Paid/premium content gating — monetization is separate decision
- A/B testing of content — optimize after baseline established

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SEO-01 | Phase 1 | Pending |
| SEO-02 | Phase 1 | Pending |
| SEO-03 | Phase 2 | Pending |
| SEO-04 | Phase 1 | Pending |
| SEO-05 | Phase 5 | Pending |
| SEO-06 | Phase 1 | Pending |
| NORM-01 | Phase 3 | Pending |
| NORM-02 | Phase 3 | Pending |
| NORM-03 | Phase 3 | Pending |
| NORM-04 | Phase 3 | Pending |
| NORM-05 | Phase 3 | Pending |
| STRAT-01 | Phase 4 | Complete |
| STRAT-02 | Phase 4 | Complete |
| STRAT-03 | Phase 4 | Complete |
| STRAT-04 | Phase 4 | Complete |
| STRAT-05 | Phase 4 | Complete |
| LINK-01 | Phase 5 | Pending |
| LINK-02 | Phase 5 | Pending |
| LINK-03 | Phase 5 | Pending |
| LINK-04 | Phase 5 | Pending |

## Context

**Source Material:**
Research document "Hogskoleprovets fallor och strategier" provides comprehensive analysis of:
- Test construction mechanisms and cognitive traps
- Quantitative section traps (XYZ, KVA, NOG, DTK)
- Verbal section traps (ORD, LAS, MEK, ELF)
- Common mistakes and countermeasures
- Study methodology recommendations

This research needs to be rewritten as web-optimized Swedish content for the strategy pages.

**Existing Codebase:**
- Next.js 15 with App Router (SSG for test pages)
- Tailwind CSS with semantic design tokens
- Convex for backend/file storage
- Tests stored in `/apps/web/src/data/tests.ts` with PDFs in `/public/pdfs/`
- Normering PDFs already exist and contain the source data

**SEO Gaps Identified:**
- No sitemap.xml or robots.txt
- No JSON-LD structured data
- No canonical URLs
- No OpenGraph images
- Test pages are thin on content (just download links)

## Constraints

- **Tech stack**: Must use existing Next.js/Convex/Tailwind stack
- **Charts**: Use shadcn/ui charts (already compatible with stack)
- **SEO**: Data must be bot-readable (not canvas-only charts)
- **Language**: All user-facing content in Swedish
- **Content source**: Strategy content must be rewritten from research (not copy-paste)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Start with SEO foundation before content | Foundation for all other work, quick wins, high impact | Accepted |
| 5 phases with quick depth | Balanced structure for 20 requirements | Accepted |
| Text-only strategy pages for v1 | Ship basics first, add interactive examples in v2 | Accepted |
| shadcn charts for visualization | Already compatible with stack, good accessibility | Accepted |
| Static OG images before dynamic | Simpler implementation, can upgrade later | Accepted |

---
*Last updated: 2026-01-26 after roadmap creation*
