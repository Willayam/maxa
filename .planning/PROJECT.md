# Maxa SEO & Content Enhancement

## What This Is

A comprehensive SEO and content platform for Maxa's Hogskoleprovet web app. Test download pages are now rich, SEO-optimized study resources with interactive normering (score conversion) visualizations, comprehensive Swedish strategy content, and complete technical SEO infrastructure. 72 statically generated pages establish Maxa as an authority on Hogskoleprovet-related searches.

## Core Value

**Every test page becomes a valuable study resource, not just a download link.** Users find actionable data (normering charts) and strategy insights, while search engines see structured, crawlable content that establishes Maxa as an authority on Hogskoleprovet.

## Requirements

### Validated

- ✓ Test listing page at `/hogskoleprovet` with all historical tests — existing
- ✓ Test detail pages at `/hogskoleprovet/[slug]` with PDF downloads — existing
- ✓ Static site generation for test pages (good for SEO) — existing
- ✓ Convex backend for file storage and metadata — existing
- ✓ PostHog analytics integration — existing
- ✓ Dark/light theme support — existing
- ✓ Permanent redirects from old URLs (`/gamla-prov/*`) — existing
- ✓ SEO-01: Dynamic sitemap.xml (34 URLs incl. test + strategy pages) — v1.0
- ✓ SEO-02: robots.txt with crawler directives — v1.0
- ✓ SEO-03: JSON-LD structured data (Article + BreadcrumbList) — v1.0
- ✓ SEO-04: Canonical URLs on all pages — v1.0
- ✓ SEO-05: Dynamic OpenGraph images (dark theme branding) — v1.0
- ✓ SEO-06: Enhanced page metadata optimized for search intent — v1.0
- ✓ NORM-01: Normering data extracted from PDFs to JSON — v1.0
- ✓ NORM-02: Static JSON normering storage (SSG-compatible) — v1.0
- ✓ NORM-03: Interactive Recharts histogram with bell curve — v1.0
- ✓ NORM-04: Accessible HTML data table for bots/screen readers — v1.0
- ✓ NORM-05: Normering section on all test detail pages — v1.0
- ✓ NORM-06: Complete normering data for all 26 tests (2013-2025) — v1.0
- ✓ STRAT-01: Kvantitativa fallor page (XYZ, KVA, NOG, DTK) — v1.0
- ✓ STRAT-02: Verbala fallor page (ORD, LAS, MEK, ELF) — v1.0
- ✓ STRAT-03: Vanliga misstag page — v1.0
- ✓ STRAT-04: Tidsstrategi page — v1.0
- ✓ STRAT-05: Swedish content rewritten from research — v1.0
- ✓ LINK-01: Strategy links from test detail pages — v1.0
- ✓ LINK-02: Test links from strategy pages (RecentTests) — v1.0
- ✓ LINK-03: Related tests section with relevance scoring — v1.0
- ✓ LINK-04: Breadcrumb navigation on all pages — v1.0

### Active

(No active requirements — next milestone TBD)

### Out of Scope

- Interactive trap examples/visualizations on strategy pages — complexity, defer to v2
- Video content — different content type, separate initiative
- User accounts/progress tracking — separate feature milestone
- Mobile app content sync — app has different content strategy
- Paid/premium content gating — monetization is separate decision
- A/B testing of content — optimize after baseline established

## Context

**Current State (v1.0 shipped 2026-01-27):**
- 72 statically generated pages (27 test pages, 5 strategy pages, hub, list, root + OG images)
- 7,911 lines of TypeScript/TSX in web app
- Tech stack: Next.js 15 (App Router, SSG), Tailwind CSS, Convex, Recharts
- 26 normering JSON datasets covering all historical tests (2013-2025)
- 3,155 lines of Swedish strategy content across 4 pages
- Complete SEO: sitemap, robots, canonical URLs, JSON-LD, OG images
- Production build passes cleanly with zero errors

**Source Material:**
Research document "Hogskoleprovets fallor och strategier" — fully consumed into strategy pages.

## Constraints

- **Tech stack**: Next.js 15 / Convex / Tailwind CSS
- **Charts**: Recharts (chosen over shadcn charts for direct control)
- **SEO**: Data must be bot-readable (HTML table fallbacks, not canvas-only)
- **Language**: All user-facing content in Swedish
- **Content source**: Strategy content rewritten from research (not copy-paste)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Start with SEO foundation before content | Foundation for all other work, quick wins, high impact | ✓ Good |
| 7 phases with quick depth | Balanced structure for 21 requirements | ✓ Good |
| Text-only strategy pages for v1 | Ship basics first, add interactive examples in v2 | ✓ Good |
| Recharts for normering visualization | Direct control over histogram + bell curve, SSG-compatible | ✓ Good |
| Dynamic OG images via ImageResponse | No external dependencies, dark theme branding | ✓ Good |
| Static JSON for normering data | SSG-compatible, no runtime DB calls, fast loads | ✓ Good |
| Swedish du-tilltal style | Authoritative but friendly educational tone | ✓ Good |
| Progressive enhancement (table-first) | Accessible to bots and screen readers without JS | ✓ Good |
| Same-season priority in related tests | Better relevance for students preparing for specific test | ✓ Good |
| Phase 7 gap closure after audit | Systematic quality assurance before shipping | ✓ Good |

---
*Last updated: 2026-01-27 after v1.0 milestone*
