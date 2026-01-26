# Roadmap: Maxa SEO & Content Enhancement

## Overview

Transform Maxa's basic test download pages into rich, SEO-optimized study resources. We start with technical SEO foundation (sitemap, robots, metadata), add structured data for rich snippets, integrate interactive normering visualizations, create Swedish strategy content hub, and complete with cross-linking and polish. Each phase builds on the previous to establish Maxa as the authority on Hogskoleprovet-related searches.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3, 4, 5): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: SEO Foundation** - Sitemap, robots.txt, metadata, and canonical URLs
- [ ] **Phase 2: Structured Data** - JSON-LD schemas for rich snippets and breadcrumbs
- [ ] **Phase 3: Normering** - Data extraction, chart component, and page integration
- [ ] **Phase 4: Strategy Content** - Swedish strategy pages from research source material
- [ ] **Phase 5: Cross-Linking & Polish** - Internal links, navigation, and OG images

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
- [ ] 01-01-PLAN.md — Create sitemap.xml and robots.txt
- [ ] 01-02-PLAN.md — Add metadataBase and canonical URLs

### Phase 2: Structured Data
**Goal**: Pages qualify for rich snippets in search results via JSON-LD
**Depends on**: Phase 1
**Requirements**: SEO-03
**Success Criteria** (what must be TRUE):
  1. Test pages include ScholarlyArticle JSON-LD with datePublished and publisher
  2. All pages include BreadcrumbList JSON-LD showing navigation hierarchy
  3. JSON-LD validates without errors in Google Rich Results Test
**Plans**: TBD

Plans:
- [ ] 02-01: JSON-LD schema implementation for all page types

### Phase 3: Normering
**Goal**: Every test page displays interactive normering data that is both visually compelling and bot-readable
**Depends on**: Phase 2
**Requirements**: NORM-01, NORM-02, NORM-03, NORM-04, NORM-05
**Success Criteria** (what must be TRUE):
  1. Normering data extracted from PDFs and stored in structured format
  2. Test detail pages display interactive line chart showing raw score to HP score conversion
  3. Chart has accessible HTML table fallback visible to screen readers and bots
  4. Normering section appears on all test pages that have normering data available
  5. Chart renders correctly with JavaScript disabled (table fallback visible)
**Plans**: TBD

Plans:
- [ ] 03-01: Normering data extraction and storage
- [ ] 03-02: Chart component with accessible table fallback
- [ ] 03-03: Integration on test detail pages

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
**Plans**: TBD

Plans:
- [ ] 04-01: Strategy hub page and routing setup
- [ ] 04-02: Kvantitativa and Verbala fallor content pages
- [ ] 04-03: Vanliga misstag and Tidsstrategi content pages

### Phase 5: Cross-Linking & Polish
**Goal**: All pages are interconnected with contextual links and proper social sharing support
**Depends on**: Phase 3, Phase 4 (needs all content to exist)
**Requirements**: LINK-01, LINK-02, LINK-03, LINK-04, SEO-05
**Success Criteria** (what must be TRUE):
  1. Test detail pages link to relevant strategy pages with contextual anchor text
  2. Strategy pages link to test pages with "Practice with real tests" CTAs
  3. Test detail pages show related tests section (previous/next, same season)
  4. All pages have breadcrumb navigation showing hierarchy
  5. Social sharing displays branded OG image with page-specific content
**Plans**: TBD

Plans:
- [ ] 05-01: Internal linking implementation (test-strategy bidirectional)
- [ ] 05-02: Breadcrumb navigation and related tests section
- [ ] 05-03: OpenGraph images for social sharing

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5
(Phase 4 can run in parallel with Phase 3 after Phase 1 completes)

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. SEO Foundation | 0/2 | Planned | - |
| 2. Structured Data | 0/1 | Not started | - |
| 3. Normering | 0/3 | Not started | - |
| 4. Strategy Content | 0/3 | Not started | - |
| 5. Cross-Linking & Polish | 0/3 | Not started | - |

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
| LINK-01 | Phase 5 | Strategy links from test pages |
| LINK-02 | Phase 5 | Test links from strategy pages |
| LINK-03 | Phase 5 | Related tests section |
| LINK-04 | Phase 5 | Breadcrumb navigation |

**Coverage: 20/20 requirements mapped**
