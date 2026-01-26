# Phase 3: Normering - Context

**Gathered:** 2026-01-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Display interactive normering data on test pages showing HP score distribution with accessible table fallback. Users can explore the bell curve distribution to understand where different scores fall. Data extraction from PDFs and storage included. Creating user score tracking or comparisons are separate concerns.

</domain>

<decisions>
## Implementation Decisions

### Chart interactions
- Tooltip shows: HP-värde + Percentil (e.g., "1.9 — Topp 5%")
- No raw score in tooltip — HP value and percentile are what users care about
- No score input field — pure exploration mode
- Mobile: Swipe/drag to explore, tooltip positioned above chart to avoid obscuring data
- Use shadcn charts out-of-box behavior where possible

### Visual design
- Chart type: Histogram bars (count per score) + bell curve line overlay
- X-axis: HP-värde (0.0-2.0), Y-axis: count of people
- Colors: Primary amber/gold for bars, darker shade for curve line (matches Maxa brand)
- Tabs to switch between: Total (default), VERB, KVANT breakdowns

### Data extraction
- Automated PDF parsing with AI validation
- Storage: JSON files in repo (e.g., /data/normering/ht2025.json)
- Static rendering for performance and SEO — no backend queries needed
- Missing data: Hide normering section entirely on those pages (no placeholder)

### Table fallback
- Full table visible when JavaScript disabled (becomes primary display)
- Columns: HP-värde, Råpoäng, Antal, Percentil

### Claude's Discretion
- Exact interaction mechanism (hover vs nearest-point detection)
- Mobile responsive behavior (height, label density)
- Chart title/heading presence
- Table positioning when JS enabled (visible collapsed, sr-only, or tabbed)
- PDF parsing implementation approach
- Bell curve smoothing algorithm

</decisions>

<specifics>
## Specific Ideas

- "I want a bar chart, a bunch of bars of the number of people and then a line that represents the bell curve distribution"
- Tooltip should not obscure the data on mobile — position above
- Performance priority: static JSON, no runtime fetches, SEO-friendly
- Reference PDF structure: https://www.studera.nu/globalassets/05-hogskoleprovet/normeringstabeller/

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-normering*
*Context gathered: 2026-01-26*
