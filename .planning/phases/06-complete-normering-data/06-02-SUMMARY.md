---
phase: 06-complete-normering-data
plan: 02
subsystem: data
tags: [pdf-extraction, pdftotext, normering, data-processing, validation]

# Dependency graph
requires:
  - phase: 03-normering
    provides: JSON schema and display infrastructure for normering data
  - phase: 06-01
    provides: Established PDF extraction patterns and validation workflow
provides:
  - Complete normering dataset for 2020-2023 period (9 tests)
  - Extraction script for future normering updates
  - Validated distribution data matching official studera.nu sources
affects: [06-03, normering-updates]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "pdftotext with -layout flag for accurate table extraction"
    - "Flexible regex parsing handling varying whitespace in PDF text"
    - "Multi-pass validation (structure, data accuracy, runtime verification)"

key-files:
  created:
    - apps/web/src/data/normering/hosten-2023.json
    - apps/web/src/data/normering/varen-2023.json
    - apps/web/src/data/normering/hosten-2022.json
    - apps/web/src/data/normering/varen-2022.json
    - apps/web/src/data/normering/varen-2022-mars.json
    - apps/web/src/data/normering/hosten-2021.json
    - apps/web/src/data/normering/varen-2021.json
    - apps/web/src/data/normering/varen-2021-mars.json
    - apps/web/src/data/normering/hosten-2020.json
    - scripts/extract-normering-2020-2023.js
  modified:
    - apps/web/public/pdfs/hosten-2023/ (3 PDFs)
    - apps/web/public/pdfs/varen-2023/ (3 PDFs)
    - apps/web/public/pdfs/hosten-2022/ (3 PDFs)
    - apps/web/public/pdfs/varen-2022/ (3 PDFs)
    - apps/web/public/pdfs/varen-2022-mars/ (3 PDFs)
    - apps/web/public/pdfs/hosten-2021/ (3 PDFs)
    - apps/web/public/pdfs/varen-2021/ (3 PDFs)
    - apps/web/public/pdfs/varen-2021-mars/ (3 PDFs)
    - apps/web/public/pdfs/hosten-2020/ (3 PDFs)

key-decisions:
  - "pdftotext preferred over direct PDF API reading for reliable text extraction"
  - "COVID-era tests show reduced participant counts (21k-42k vs normal 40k-60k)"
  - "Extraction script uses flexible whitespace splitting instead of rigid regex for robustness"

patterns-established:
  - "Two-stage PDF table parsing: total (41 rows, 0.05 increment) vs parts (21 rows, 0.1 increment)"
  - "Multi-level validation: row count, cumulative percentage, data accuracy, runtime loading"

# Metrics
duration: 6min
completed: 2026-01-27
---

# Phase 06 Plan 02: Complete Normering Data (2020-2023)

**27 normering PDFs extracted into 9 validated JSON files with distribution data for 2020-2023 tests, including COVID-era dual-date administrations**

## Performance

- **Duration:** 6 min
- **Started:** 2026-01-27T09:12:31Z
- **Completed:** 2026-01-27T09:18:45Z
- **Tasks:** 2
- **Files modified:** 37 (27 PDFs + 9 JSON files + 1 script)

## Accomplishments

- Downloaded 27 normering PDFs (3 per test: helaprovet, verbal, kvantitativ) from studera.nu
- Extracted and validated JSON data for 9 tests covering 2020-2023 period
- Handled dual-date administrations (VT 2021, VT 2022 had both March and May tests)
- All distributions validated: 41 rows (total), 21 rows (verbal/kvant), cumulative ending at 100%
- Participant counts reflect COVID-era reductions (21,871-58,830 participants)

## Task Commits

Each task was committed atomically:

1. **Task 1: Download normering PDFs for 2020-2023 tests** - `eaa37b2` (feat)
2. **Task 2: Extract and validate normering JSON for 2020-2023 tests** - `5fc23fd` (feat)

## Files Created/Modified

**JSON files (created):**
- `apps/web/src/data/normering/hosten-2023.json` - HT 2023 distribution (42,101 participants)
- `apps/web/src/data/normering/varen-2023.json` - VT 2023 distribution (58,830 participants)
- `apps/web/src/data/normering/hosten-2022.json` - HT 2022 distribution (38,334 participants)
- `apps/web/src/data/normering/varen-2022.json` - VT 2022 May distribution (28,358 participants)
- `apps/web/src/data/normering/varen-2022-mars.json` - VT 2022 March distribution (29,315 participants)
- `apps/web/src/data/normering/hosten-2021.json` - HT 2021 distribution (28,165 participants)
- `apps/web/src/data/normering/varen-2021.json` - VT 2021 May distribution (23,556 participants)
- `apps/web/src/data/normering/varen-2021-mars.json` - VT 2021 March distribution (21,871 participants)
- `apps/web/src/data/normering/hosten-2020.json` - HT 2020 distribution (23,288 participants)

**Extraction script (created):**
- `scripts/extract-normering-2020-2023.js` - Automated PDF extraction using pdftotext

**PDFs (downloaded):**
- 27 normering PDFs across 9 test directories (helaprovet, verbal, kvantitativ for each)

## Decisions Made

**1. PDF extraction method:**
- Used pdftotext command-line tool instead of direct PDF API reading
- Rationale: More reliable for Swedish text extraction, consistent with Plan 06-01 approach

**2. Flexible parsing strategy:**
- Used whitespace splitting with pattern matching instead of rigid regex
- Rationale: PDF text formatting varies slightly between years, flexible approach more robust

**3. COVID-era data observation:**
- Documented reduced participant counts for 2020-2021 tests (21k-29k vs normal 40k-60k)
- Rationale: Important context for data interpretation and validation thresholds

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed incorrect PDF URLs**
- **Found during:** Task 1 (PDF download)
- **Issue:** Initial download attempt retrieved HTML 404 pages instead of PDFs due to incorrect URL paths
- **Fix:** Scraped correct PDF URLs from studera.nu web pages, re-downloaded all PDFs
- **Files modified:** All 27 PDF files in public/pdfs/
- **Verification:** `file` command confirmed all PDFs are valid PDF documents
- **Committed in:** eaa37b2 (Task 1 commit)

**2. [Rule 3 - Blocking] Fixed regex patterns for data extraction**
- **Found during:** Task 2 (JSON extraction)
- **Issue:** Initial regex patterns too rigid, failing to match PDF text due to varying whitespace
- **Fix:** Switched to flexible whitespace splitting with pattern detection
- **Files modified:** scripts/extract-normering-2020-2023.js
- **Verification:** All 9 JSON files successfully extracted with correct row counts
- **Committed in:** 5fc23fd (Task 2 commit)

**3. [Rule 1 - Bug] Fixed decimal point regex in mean/stdDev extraction**
- **Found during:** Task 2 (mean/stdDev parsing)
- **Issue:** Regex pattern `[\d,]+` didn't match decimal point, extracting 0 instead of 0.88
- **Fix:** Changed pattern to `[\d,.]+` to include decimal point
- **Files modified:** scripts/extract-normering-2020-2023.js
- **Verification:** All mean and stdDev values correctly extracted (0.84-0.89 range)
- **Committed in:** 5fc23fd (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (1 bug, 2 blocking)
**Impact on plan:** All auto-fixes necessary to complete planned work. No scope changes - fixed technical issues preventing extraction.

## Issues Encountered

**PDF download URL inconsistency:**
- Problem: studera.nu uses varying URL patterns for different test years (normering-ht2022 vs normering-ht-2022-23-oktober)
- Solution: Scraped actual URLs from HTML pages instead of constructing them algorithmically
- Impact: Required additional curl calls but ensured accurate downloads

**PDF text extraction variations:**
- Problem: Whitespace formatting differs slightly between PDF years
- Solution: Used flexible parsing (whitespace splitting + pattern matching) instead of rigid regex
- Impact: More robust extraction that handles format variations gracefully

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready:**
- All 9 JSON files validated and loadable via getNormeringData()
- Extraction script reusable for future normering updates
- Data matches official studera.nu sources (spot-checked against PDFs)

**Notes:**
- tests.ts already has normering file references for all 9 tests (from previous plan)
- Build fails due to pre-existing ESLint errors in unrelated files (strategy pages)
- Normering data itself has no errors - validated via runtime loading test

**For future phases:**
- Script pattern established for extracting remaining historical tests (2013-2019)
- Same validation workflow applies to all normering extractions

---
*Phase: 06-complete-normering-data*
*Completed: 2026-01-27*
