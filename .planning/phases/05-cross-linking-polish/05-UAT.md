---
status: testing
phase: 05-cross-linking-polish
source: 05-01-SUMMARY.md, 05-02-SUMMARY.md, 05-03-SUMMARY.md
started: 2026-01-27T10:00:00Z
updated: 2026-01-27T10:00:00Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 1
name: Breadcrumb on Test List Page
expected: |
  Navigate to /hogskoleprovet. You should see a breadcrumb trail showing "Hem > Gamla prov" above the page title. "Hem" should be a clickable link back to the homepage.
awaiting: user response

## Tests

### 1. Breadcrumb on Test List Page
expected: Navigate to /hogskoleprovet. Breadcrumb shows "Hem > Gamla prov" above the page title. "Hem" is a clickable link.
result: [pending]

### 2. Breadcrumb on Test Detail Page
expected: Navigate to any test page (e.g., /hogskoleprovet/hosten-2025). Breadcrumb shows "Hem > Gamla prov > Hösten 2025" above the title. "Hem" and "Gamla prov" are clickable links. Current page name is not a link.
result: [pending]

### 3. Related Tests Section
expected: On a test detail page (e.g., /hogskoleprovet/hosten-2025), scroll down to see a "Related Tests" section showing up to 4 related tests. Same-season tests should be prioritized. The current test should NOT appear in its own related list.
result: [pending]

### 4. Related Tests Navigation
expected: Click any related test link. It navigates to that test's detail page. The related test's page also shows its own related tests section.
result: [pending]

### 5. OG Image - Root Page
expected: Check the page source or meta tags on the root page (/). There should be an og:image meta tag pointing to an OpenGraph image URL.
result: [pending]

### 6. OG Image - Test Detail Page
expected: Check a test detail page (e.g., /hogskoleprovet/hosten-2025) meta tags. The og:image should point to a dynamic image. If you can access the image URL directly, it should show a 1200x630 image with dark background, gold accent, and the test name (e.g., "Hösten 2025").
result: [pending]

## Summary

total: 6
passed: 0
issues: 0
pending: 6
skipped: 0

## Gaps

[none yet]
