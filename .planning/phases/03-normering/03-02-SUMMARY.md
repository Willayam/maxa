---
phase: 03-normering
plan: 02
subsystem: ui
tags: [recharts, visualization, accessibility, progressive-enhancement, histogram, bell-curve]

# Dependency graph
requires:
  - phase: 03-01
    provides: Normering data types and loader function
provides:
  - Interactive histogram chart with bell curve overlay using Recharts
  - Accessible HTML table fallback with semantic markup
  - Progressive enhancement container with JavaScript detection
  - Tab-based section switcher for total/verbal/kvantitativ views

affects: [03-03, seo, gamla-prov-pages]

# Tech tracking
tech-stack:
  added: [recharts ^2.12.0]
  patterns: [Progressive enhancement (table-first, chart when JS loads), Accessible data visualization, Tab-based content switching]

key-files:
  created:
    - apps/web/src/components/ui/chart.tsx
    - apps/web/src/components/charts/normering-chart.tsx
    - apps/web/src/components/charts/normering-table.tsx
    - apps/web/src/components/charts/normering-section.tsx
  modified:
    - apps/web/package.json

key-decisions:
  - "Manual Recharts installation instead of shadcn CLI due to missing components.json"
  - "Progressive enhancement: table always visible, chart added when JavaScript loads"
  - "Collapsible table when JavaScript enabled, expanded by default when disabled"
  - "Percentile calculated as 100 - cumulativePercentage for 'Topp X%' format"

patterns-established:
  - "Progressive enhancement pattern: Core content (table) visible by default, enhanced experience (chart) layered via JavaScript detection"
  - "Accessibility-first: semantic HTML tables with sr-only captions, proper th scope attributes"
  - "Theme-aware charting: Use hsl(var(--primary)) for Recharts colors to match design system"

# Metrics
duration: 4min
completed: 2026-01-27
---

# Phase 3 Plan 02: Normering Visualization Components Summary

**Interactive histogram with bell curve overlay using Recharts, progressive enhancement with accessible HTML table fallback**

## Performance

- **Duration:** 4 min
- **Started:** 2026-01-26T23:06:44Z
- **Completed:** 2026-01-26T23:10:49Z
- **Tasks:** 4
- **Files modified:** 5

## Accomplishments
- Installed shadcn/ui chart primitives with Recharts ^2.12.0
- Built NormeringChart component with ComposedChart (histogram bars + bell curve line)
- Created accessible NormeringTable with semantic HTML and collapsible functionality
- Implemented NormeringSection container with tab switching and JavaScript detection

## Task Commits

Each task was committed atomically:

1. **Task 1: Install shadcn/ui charts and create chart primitives** - `d7a97c0` (chore)
2. **Task 2: Create NormeringChart component (histogram + bell curve)** - `b89ac0a` (feat)
3. **Task 3: Create NormeringTable component (accessible fallback)** - `59b5c9d` (feat)
4. **Task 4: Create NormeringSection container with tabs and JS detection** - `1d24b54` (feat)

## Files Created/Modified

- `apps/web/package.json` - Added recharts ^2.12.0 dependency
- `apps/web/src/components/ui/chart.tsx` - shadcn/ui chart primitives (ChartContainer, ChartTooltip, ChartLegend)
- `apps/web/src/components/charts/normering-chart.tsx` - Interactive histogram with bell curve using Recharts ComposedChart
- `apps/web/src/components/charts/normering-table.tsx` - Accessible HTML table with collapsible functionality
- `apps/web/src/components/charts/normering-section.tsx` - Container with tabs and progressive enhancement

## Decisions Made

1. **Manual Recharts installation**: shadcn CLI required components.json setup, so manually added recharts to package.json and created chart.tsx primitives from shadcn/ui source
2. **Progressive enhancement strategy**: Table rendered by default (works without JavaScript), chart added via useEffect when JavaScript loads
3. **Collapsible table behavior**: When JavaScript enabled, table is collapsible and defaults to collapsed (chart is primary); when JavaScript disabled, table is always visible
4. **Percentile calculation**: Used `100 - cumulativePercentage` to show "Topp X%" format in both chart tooltip and table
5. **Theme integration**: Used `hsl(var(--primary))` for chart colors to match Maxa design system

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**shadcn CLI missing components.json**: Attempted `npx shadcn@latest add chart --yes` but CLI prompted for components.json creation. Resolved by manually adding recharts to package.json and creating chart.tsx from shadcn/ui source code.

## Next Phase Readiness

Ready for 03-03 (Normering Page Integration):
- All visualization components built and tested (TypeScript compilation passes)
- Progressive enhancement ensures accessibility for all users (bots, screen readers, no-JS)
- Components follow Maxa design patterns (2px borders, theme CSS variables)
- Tabs conditionally render based on data availability (verbal/kvantitativ optional)

Next plan will integrate these components into gamla-prov test pages.

---
*Phase: 03-normering*
*Completed: 2026-01-27*
