---
status: complete
phase: 03-normering
source: [03-01-SUMMARY.md, 03-02-SUMMARY.md]
started: 2026-01-27T00:16:28Z
completed: 2026-01-27T00:18:00Z
---

## Current Test

[all tests complete]

## Tests

### 1. Normering section appears on hosten-2025
expected: Navigate to http://localhost:3000/hogskoleprovet/hosten-2025 - A "Normering" section appears below the file downloads with an interactive chart
result: pass

### 2. Bell curve overlay on histogram
expected: The histogram chart shows a blue/primary colored bell curve line overlaying the bars
result: skipped

### 3. Tab switching works (Total/Verbal/Kvantitativ)
expected: Three tabs are visible: "Hela provet", "Verbal del", "Kvantitativ del". Clicking each tab changes the displayed data
result: pass

### 4. Tooltip on hover shows score details
expected: Hovering over a bar shows tooltip with HP-värde (score) and "Topp X%" percentile
result: pass

### 5. Table fallback is accessible
expected: Click "Visa tabell" to expand the data table. Table shows HP-värde, Antal, Andel, Percentil columns
result: pass

### 6. No normering section on tests without data
expected: Navigate to http://localhost:3000/hogskoleprovet/hosten-2024 (or another test without normering data). No normering section appears - just file downloads and related tests
result: pass

## Summary

total: 6
passed: 5
issues: 0
pending: 0
skipped: 1

## Gaps

[none yet]
