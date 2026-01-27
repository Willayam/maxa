# Roadmap: Maxa SEO & Content Enhancement

## Overview

Transform Maxa's basic test download pages into rich, SEO-optimized study resources. We start with technical SEO foundation (sitemap, robots, metadata), add structured data for rich snippets, integrate interactive normering visualizations, create Swedish strategy content hub, and complete with cross-linking and polish. Each phase builds on the previous to establish Maxa as the authority on Hogskoleprovet-related searches.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3, 4, 5): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: SEO Foundation** - Sitemap, robots.txt, metadata, and canonical URLs
- [x] **Phase 2: Structured Data** - JSON-LD schemas for rich snippets and breadcrumbs
- [x] **Phase 3: Normering** - Data extraction, chart component, and page integration
- [ ] **Phase 4: Strategy Content** - Swedish strategy pages from research source material
- [x] **Phase 5: Cross-Linking & Polish** - Internal links, navigation, and OG images
- [x] **Phase 6: Complete Normering Data** - Parse all historical normeringstabeller and display on test pages

## Phase Details

### Phase 1: SEO Foundation
**Goal**: Search engines can efficiently crawl and index all pages with proper metadata
**Depends on**: Nothing (first phase)
**Requirements**: SEO-01, SEO-02, SEO-04, SEO-06
**Success Criteria** (what must be TRUE):
  1. Sitemap at /sitemap.xml lists all test pages with correct URLs
  2. Robots.txt at /robots.txt allows crawling of content pages and static assets
  3. Every page has a canonical URL meta tag pointing to its primary URL
  4. Every test page has unique title and description optimized for search intent
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md — Create sitemap.xml and robots.txt
- [x] 01-02-PLAN.md — Add metadataBase and canonical URLs

### Phase 2: Structured Data
**Goal**: Pages qualify for rich snippets in search results via JSON-LD
**Depends on**: Phase 1
**Requirements**: SEO-03
**Success Criteria** (what must be TRUE):
  1. Test pages include Article JSON-LD with datePublished and publisher
  2. All pages include BreadcrumbList JSON-LD showing navigation hierarchy
  3. JSON-LD validates without errors in Google Rich Results Test
**Plans**: 1 plan

Plans:
- [x] 02-01-PLAN.md — Add Article and BreadcrumbList JSON-LD to hogskoleprovet pages

### Phase 3: Normering
**Goal**: Every test page displays interactive normering data that is both visually compelling and bot-readable
**Depends on**: Phase 2
**Requirements**: NORM-01, NORM-02, NORM-03, NORM-04, NORM-05
**Success Criteria** (what must be TRUE):
  1. Normering data extracted from PDFs and stored in structured format
  2. Test detail pages display interactive histogram chart with bell curve overlay
  3. Chart has accessible HTML table fallback visible to screen readers and bots
  4. Normering section appears on all test pages that have normering data available
  5. Chart renders correctly with JavaScript disabled (table fallback visible)
**Plans**: 3 plans

Plans:
- [x] 03-01-PLAN.md — Create normering data infrastructure and extract hosten-2025 data
- [x] 03-02-PLAN.md — Build chart components (histogram, bell curve, table fallback)
- [x] 03-03-PLAN.md — Integrate NormeringSection into test detail pages

### Phase 4: Strategy Content
**Goal**: Users can learn Hogskoleprovet strategies through comprehensive Swedish-language content
**Depends on**: Phase 1 (needs metadata for SEO)
**Requirements**: STRAT-01, STRAT-02, STRAT-03, STRAT-04, STRAT-05
**Success Criteria** (what must be TRUE):
  1. Kvantitativa fallor page exists with XYZ, KVA, NOG, DTK trap explanations
  2. Verbala fallor page exists with ORD, LAS, MEK, ELF trap explanations
  3. Vanliga misstag page exists with common mistakes and countermeasures
  4. Tidsstrategi page exists with time management guidance
  5. All content is written in Swedish, rewritten from research (not copy-paste)
**Plans**: 3 plans

Plans:
- [ ] 04-01-PLAN.md — Strategy hub page with routing, SEO metadata, and card grid
- [ ] 04-02-PLAN.md — Kvantitativa and Verbala fallor content pages
- [ ] 04-03-PLAN.md — Vanliga misstag and Tidsstrategi content pages

### Phase 5: Cross-Linking & Polish
**Goal**: Navigation and social sharing polished with breadcrumbs, improved related tests, and OG images
**Depends on**: Phase 3 (normering infrastructure)
**Requirements**: LINK-03, LINK-04, SEO-05
**Note**: LINK-01 and LINK-02 (bidirectional test-strategy linking) deferred until Phase 4 completes
**Success Criteria** (what must be TRUE):
  1. Test detail pages show related tests section with smart algorithm
  2. All pages have breadcrumb navigation showing hierarchy
  3. Social sharing displays branded OG image with page-specific content
**Plans**: 3 plans

Plans:
- [x] 05-01-PLAN.md — Breadcrumb navigation with shadcn component
- [x] 05-02-PLAN.md — Related tests enhancement with relevance algorithm
- [x] 05-03-PLAN.md — OpenGraph images for social sharing

### Phase 6: Complete Normering Data
**Goal**: All historical tests with normeringstabeller have their data parsed and displayed on their pages
**Depends on**: Phase 3 (needs normering infrastructure)
**Requirements**: NORM-06
**Success Criteria** (what must be TRUE):
  1. All available normeringstabeller PDFs identified and catalogued
  2. Normering data extracted from all historical tests into JSON format
  3. Every test page with normering data displays the interactive chart
  4. Data validated for accuracy against source PDFs
**Plans**: 3 plans

Plans:
- [x] 06-01-PLAN.md — Download and extract normering data for 2024-2025 tests (VT 2025, HT 2024, VT 2024)
- [x] 06-02-PLAN.md — Download and extract normering data for 2020-2023 tests (9 tests)
- [x] 06-03-PLAN.md — Download and extract normering data for 2013-2019 tests (13 tests)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6
(Phase 4 can run in parallel with Phase 3 after Phase 1 completes)
(Phase 5 can run before Phase 4 - bidirectional linking deferred)
(Phase 6 requires Phase 3 infrastructure to be complete)

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. SEO Foundation | 2/2 | Complete | 2026-01-26 |
| 2. Structured Data | 1/1 | Complete | 2026-01-26 |
| 3. Normering | 3/3 | Complete | 2026-01-27 |
| 4. Strategy Content | 0/3 | Not started | - |
| 5. Cross-Linking & Polish | 3/3 | Complete | 2026-01-27 |
| 6. Complete Normering Data | 3/3 | Complete | 2026-01-27 |

## Requirement Coverage

| Requirement | Phase | Description |
|-------------|-------|-------------|
| SEO-01 | Phase 1 | Dynamic sitemap.xml generation |
| SEO-02 | Phase 1 | robots.txt with crawler directives |
| SEO-03 | Phase 2 | JSON-LD structured data |
| SEO-04 | Phase 1 | Canonical URLs on all pages |
| SEO-05 | Phase 5 | OpenGraph images for social sharing |
| SEO-06 | Phase 1 | Enhanced page metadata |
| NORM-01 | Phase 3 | Extract normering data from PDFs |
| NORM-02 | Phase 3 | Store normering data (JSON) |
| NORM-03 | Phase 3 | Interactive normering chart component |
| NORM-04 | Phase 3 | Accessible data table for bots |
| NORM-05 | Phase 3 | Normering section on test pages |
| STRAT-01 | Phase 4 | Kvantitativa fallor page |
| STRAT-02 | Phase 4 | Verbala fallor page |
| STRAT-03 | Phase 4 | Vanliga misstag page |
| STRAT-04 | Phase 4 | Tidsstrategi page |
| STRAT-05 | Phase 4 | Swedish content rewritten from research |
| LINK-01 | Phase 5+ | Strategy links from test pages (after Phase 4) |
| LINK-02 | Phase 5+ | Test links from strategy pages (after Phase 4) |
| LINK-03 | Phase 5 | Related tests section |
| LINK-04 | Phase 5 | Breadcrumb navigation |
| NORM-06 | Phase 6 | Complete normering data for all tests |

**Coverage: 21/21 requirements mapped**
