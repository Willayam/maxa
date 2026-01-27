---
phase: 04-strategy-content
plan: 03
wave: 2
subsystem: content-strategy
status: complete
tags:
  - seo
  - content
  - strategy
  - swedish
  - structured-data
requires:
  - 04-01-hub-page
provides:
  - vanliga-misstag-page
  - tidsstrategi-page
  - strategy-behavior-content
affects:
  - future-strategy-content
  - internal-linking
tech-stack:
  added: []
  patterns:
    - three-tier-summary-pattern
    - section-summary-callouts
    - quick-reference-lists
key-files:
  created:
    - apps/web/src/app/hogskoleprovet/strategier/vanliga-misstag/page.tsx
    - apps/web/src/app/hogskoleprovet/strategier/tidsstrategi/page.tsx
  modified: []
decisions:
  - id: three-tier-summary
    decision: Use TL;DR + section summaries + final recap pattern
    rationale: Multiple entry points for different reader types (skimmers vs deep readers)
    alternatives: Single summary only
  - id: numbered-reference-lists
    decision: Include numbered quick-reference lists in addition to prose
    rationale: Provides scannable takeaway format for quick review
    alternatives: Prose-only format
  - id: callout-colors
    decision: Green for summaries, red for warnings, primary for TL;DR
    rationale: Visual hierarchy matches semantic meaning (positive=green, caution=red)
    alternatives: Single color for all callouts
metrics:
  duration: 9min
  completed: 2026-01-27
---

# Phase 04 Plan 03: Vanliga Misstag & Tidsstrategi Content Summary

**One-liner:** Strategy pages covering common HP mistakes (strategic/technical/mental) and time management (budgeting, prioritization, guessing, training)

## What Was Built

Created two comprehensive Swedish-language content pages completing the strategy hub:

### 1. Vanliga Misstag (Common Mistakes)
- **Strategic mistakes:** Tidsoptimism, perfektionism, lämna blankt, fel prioritering
- **Technical mistakes:** Provteknik vs kunskap, läsa för snabbt, inte eliminera, enhetsmisstag
- **Mental mistakes:** Panikreaktion, trötthet, övertro på känsla
- Quick reference list of all 11 common mistakes
- Each mistake with: description, why it happens, countermeasure

### 2. Tidsstrategi (Time Strategy)
- **Time frames:** Breakdown of 5 test sessions with time per question
- **Time budget:** Fast vs slow questions, 2-minute rule
- **Prioritization:** Two-pass strategy, identifying time traps
- **Guessing strategy:** Elimination technique, guessing letter, last-minute protocol
- **Training:** Progressive training, building stamina, full simulation
- Test day checklist with step-by-step strategy

## Content Quality

Both pages follow established patterns from hub page:

**Three-tier summary pattern:**
- TL;DR section at top (5 key bullets, bg-primary/10 styling)
- Section summaries after each major section (green callout boxes)
- Final recap at end (comprehensive numbered summary)

**Structure:**
- Back link to hub
- H1 + subtitle
- TL;DR
- 3-5 main content sections (h2) with subsections (h3)
- Section summary callouts
- Quick reference box (numbered or checklist format)
- Final recap
- Related strategies grid (links to other pages + /hogskoleprovet)

**SEO & Metadata:**
- Article JSON-LD with headline, publisher, datePublished
- BreadcrumbList JSON-LD (4 levels: Hem > Högskoleprovet > Strategier > [Page])
- Semantic metadata (title, description, keywords, canonical, og tags)

**Design tokens:**
- All styling uses semantic tokens (bg-primary/10, bg-card-background, text-foreground, text-foreground-muted, border-border, border-primary)
- Warning callouts: bg-red-500/10 border-2 border-red-500
- Success/summary callouts: bg-green-500/10 border-2 border-green-500
- Info callouts: bg-card-background border-2 border-border

## Technical Implementation

**Page specs:**
- **Vanliga misstag:** 619 lines, ~2400 words Swedish content
- **Tidsstrategi:** 788 lines, ~3000 words Swedish content

**Content sourcing:**
- Original Swedish text rewritten from source material (Högskoleprovets fällor och strategier-v2.md)
- No copy-paste — all content adapted and reorganized for web consumption
- du-tilltal throughout, authoritative but friendly tone

**Internal linking:**
- Both pages link back to /hogskoleprovet/strategier (hub)
- Cross-link to kvantitativa-fallor and verbala-fallor (created by parallel agent)
- Link to /hogskoleprovet for practice application
- 4-card related strategies grid at bottom

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

**Ready for:**
- Cross-linking phase (pages are now linkable from test pages)
- Future strategy content (pattern established)
- SEO optimization (structured data in place)

**Pattern established:**
- Three-tier summary structure can be reused for other content pages
- Section summary callouts provide consistent UX across strategy pages
- Quick reference formats (numbered lists, checklists) improve scannability

## Commits

| Task | Commit | Files | Description |
|------|--------|-------|-------------|
| 1 | f4aba6c | vanliga-misstag/page.tsx | Vanliga misstag strategy content page |
| 2 | 83153b7 | tidsstrategi/page.tsx | Tidsstrategi strategy content page |

## Verification

Build completed successfully:
- Both pages render at /hogskoleprovet/strategier/vanliga-misstag and /hogskoleprovet/strategier/tidsstrategi
- No ESLint errors (all quotes escaped with &quot;)
- JSON-LD validates (Article + BreadcrumbList schemas)
- Semantic tokens used throughout
- Internal links functional
- Content is Swedish with du-tilltal

## Lessons Learned

1. **ESLint quote escaping:** Direct quotes in Swedish prose trigger react/no-unescaped-entities. Always use &quot; instead of " in JSX text content.

2. **Three-tier summary works:** Multiple summary levels cater to different reader behaviors:
   - Skimmers read TL;DR only
   - Section readers use section summaries
   - Deep readers appreciate final comprehensive recap

3. **Visual hierarchy matters:** Different colored callouts for different purposes (green=summary, red=warning, primary=key info) helps readers parse long content quickly.

4. **Quick reference formats:** Numbered lists and checklists provide scannable takeaway format that complements prose sections.

## Quality Metrics

- **Content depth:** Both pages exceed plan minimum of 150 lines (619 and 788 lines)
- **SEO coverage:** All required metadata present (title, description, keywords, canonical, og tags, JSON-LD)
- **Internal linking:** All required links present (hub, related strategies, practice)
- **Design consistency:** Semantic tokens throughout, no hardcoded colors
- **Tone:** Swedish du-tilltal, authoritative but approachable

## Dependencies Delivered

Wave 2 strategy content complete. Hub page (04-01) links to all four strategy pages:
- Kvantitativa fallor (created by parallel agent)
- Verbala fallor (created by parallel agent)
- Vanliga misstag (this plan)
- Tidsstrategi (this plan)

Strategy content hub fully functional with comprehensive coverage of HP strategies.
