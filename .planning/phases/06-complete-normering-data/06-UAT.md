---
status: testing
phase: 06-complete-normering-data
source: 06-01-SUMMARY.md, 06-02-SUMMARY.md, 06-03-SUMMARY.md
started: 2026-01-27T12:00:00Z
updated: 2026-01-27T12:00:00Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 1
name: Recent test normering chart (VT 2025)
expected: |
  Navigate to the VT 2025 test page (/gamla-prov/varen-2025). A normering section should display with an interactive histogram chart showing score distribution. The chart should show 74,609 total participants with mean 0.87.
awaiting: user response

## Tests

### 1. Recent test normering chart (VT 2025)
expected: Navigate to /gamla-prov/varen-2025. A normering section displays with interactive histogram chart showing score distribution for 74,609 participants (mean 0.87).
result: [pending]

### 2. 2024 test normering chart (HT 2024)
expected: Navigate to /gamla-prov/hosten-2024. Normering section displays with chart showing 49,037 participants (mean 0.89).
result: [pending]

### 3. COVID-era test normering (HT 2020)
expected: Navigate to /gamla-prov/hosten-2020. Normering section displays with chart showing 23,288 participants (mean ~0.84-0.89 range). Lower participant count reflects COVID-era testing.
result: [pending]

### 4. Oldest test normering (HT 2013)
expected: Navigate to /gamla-prov/hosten-2013. Normering section displays with chart showing 54,350 participants (mean 0.91). Data extracted from older PDF format.
result: [pending]

### 5. Verbal/Kvantitativ sub-distributions
expected: On any test page with normering (e.g., /gamla-prov/varen-2025), the normering section should allow viewing verbal and kvantitativ sub-distributions separately, not just total score.
result: [pending]

### 6. Table fallback for normering data
expected: On any test page with normering data, an accessible HTML table should be visible (either always shown or in a collapsible section) showing the raw normering data with scores and percentages.
result: [pending]

## Summary

total: 6
passed: 0
issues: 0
pending: 6
skipped: 0

## Gaps

[none yet]
