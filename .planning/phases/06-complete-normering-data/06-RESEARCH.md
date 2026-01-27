# Phase 6: Complete Normering Data - Research

**Researched:** 2026-01-27
**Domain:** PDF data extraction, data validation, bulk processing, studera.nu normering archive
**Confidence:** HIGH

## Summary

Phase 6 extends the normering infrastructure built in Phase 3 to cover all historical tests from 2013-2025. The primary challenge is data acquisition and extraction: normeringstabeller PDFs exist on studera.nu for nearly all historical tests, but only hosten-2025 currently has JSON data in the repository. The task is primarily a data processing pipeline: download PDFs, extract tabular data, validate accuracy, and integrate with existing infrastructure.

Key finding: studera.nu maintains a comprehensive archive of normeringstabeller at predictable URLs. The PDF format is consistent across years - simple tables with 4 columns that can be extracted via Claude API vision (as established in Phase 3). The existing JSON schema and display infrastructure handles the data correctly, so the work is mechanical extraction and validation rather than new development.

The scope covers 27 tests in the codebase (2013-2025), but some tests (notably varen-2020 which was cancelled) lack normering data. Based on studera.nu archives, approximately 25-26 tests have normeringstabeller available. Each test has 3 PDFs (helaprovet, verbal, kvantitativ) requiring extraction.

**Primary recommendation:** Create a systematic download-extract-validate pipeline using existing infrastructure. Process PDFs in batches, validate extracted JSON against source PDFs, and update tests.ts with normering file references.

## Standard Stack

This phase uses existing infrastructure from Phase 3. No new libraries needed.

### Core (Already Installed)
| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| Claude API | Latest | PDF table extraction via vision | Used for extracting tables from PDFs |
| Next.js | 15.1.0 | Static generation | JSON files loaded at build time |
| TypeScript | 5.x | Type safety | NormeringData types already defined |

### Supporting
| Tool | Purpose | When to Use |
|------|---------|-------------|
| Python scripts | PDF download automation | Extend existing download script for normering PDFs |
| Zod | Runtime validation | Validate extracted JSON structure |
| Manual verification | Accuracy check | Spot-check extracted data against PDFs |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Claude API extraction | Manual data entry | Manual would take 20+ hours for 75+ PDFs, high error rate |
| Claude API extraction | OCR + regex | Traditional OCR unreliable for Swedish text, table parsing complex |
| Batch processing | One-by-one manual | Batch faster, more consistent, easier to validate |

## Architecture Patterns

### Existing Structure (from Phase 3)
```
apps/web/src/
├── data/
│   ├── normering/
│   │   └── hosten-2025.json        # Existing - 1 of ~26 files needed
│   └── tests.ts                     # Test metadata - needs normering file references
├── lib/normering/
│   ├── types.ts                     # NormeringData, NormeringRow types
│   └── loader.ts                    # getNormeringData() - dynamic import
└── components/charts/
    ├── normering-chart.tsx          # Chart display (working)
    ├── normering-table.tsx          # Table display (working)
    └── normering-section.tsx        # Container component (working)
```

### Pattern 1: PDF Naming Convention on studera.nu

**What:** Consistent URL pattern for all normeringstabeller PDFs
**When to use:** Downloading historical normering PDFs

**URL Pattern:**
```
Base: https://www.studera.nu/globalassets/05-hogskoleprovet/normeringstabeller/

Recent tests (2020+):
/normering-{vt|ht}{YYYY}-{day}-{month}/norm{YY}{a|b}_{verb|kvant|helaprovet}.pdf

Older tests (2013-2019):
/norm{YY}{a|b}_{verb|kvant|helaprovet}.pdf

Examples:
- HT 2025: /normering-ht2025-19-oktober/norm25b_helaprovet.pdf
- VT 2023: /normering-vt-2023-25-mars/norm23a_helaprovet.pdf
- VT 2014: /norm14a_helaprovet.pdf
```

**Season codes:**
- `a` = spring (varen)
- `b` = fall (hosten)

### Pattern 2: JSON File Naming Convention (Local)

**What:** Consistent naming for local JSON files matching test slugs
**When to use:** Storing extracted normering data

```typescript
// Filename matches test slug from tests.ts
const jsonPath = `apps/web/src/data/normering/${test.slug}.json`

// Examples:
// hosten-2025 -> hosten-2025.json
// varen-2022-mars -> varen-2022-mars.json
```

### Pattern 3: Data Extraction with Validation

**What:** Extract PDF table data, validate structure and totals
**When to use:** Processing each normering PDF

```typescript
// Validation checklist for each extracted JSON:
const validations = {
  // 1. Row count check
  totalRowCount: distribution.length === 41, // 0.00 to 2.00 in 0.05 steps
  verbalRowCount: verbal.distribution.length === 21, // 0.0 to 2.0 in 0.1 steps
  kvantRowCount: kvant.distribution.length === 21,

  // 2. Cumulative percentage ends at 100
  cumulativeEndsAt100: distribution[distribution.length - 1].cumulativePercentage === 100,

  // 3. Participants sum matches total
  participantsMatch: distribution.reduce((sum, r) => sum + r.count, 0) === totalParticipants,

  // 4. Mean/stdDev present and reasonable
  meanInRange: mean >= 0.5 && mean <= 1.5,
  stdDevInRange: stdDev >= 0.2 && stdDev <= 0.6,
}
```

### Anti-Patterns to Avoid

- **Extracting without validating:** Always check row counts, totals, and cumulative percentages
- **Processing all at once:** Process in batches of 5-10 tests to catch issues early
- **Ignoring PDF differences:** Older PDFs may have different formatting, verify each era
- **Not updating tests.ts:** Normering files must be registered in tests.ts for display

## Don't Hand-Roll

Problems with existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| PDF text extraction | Custom parser | Claude API vision | Tables are visual, traditional extraction fails |
| Normering display | New components | Existing chart/table | Phase 3 infrastructure handles all display |
| Data loading | Custom loader | getNormeringData() | Existing function handles null gracefully |
| URL construction | Manual URLs | Pattern-based script | Consistent pattern across all years |

**Key insight:** This phase is data work, not code work. The infrastructure exists; we're populating it with data.

## Common Pitfalls

### Pitfall 1: Verbal/Kvant Different Increment

**What goes wrong:** Assuming all tables use 0.05 increments
**Why it happens:** "Helaprovet" uses 0.05 steps (41 rows), but verbal/kvant use 0.10 steps (21 rows)
**How to avoid:** Check row count during extraction, validate against expected structure
**Warning signs:** Row count != 41 for total, != 21 for verbal/kvant

### Pitfall 2: Swedish Number Formatting

**What goes wrong:** Parsing "1 234" as 1 instead of 1234
**Why it happens:** Swedish uses space as thousands separator
**How to avoid:** Strip spaces from numbers before parsing, handle comma as decimal separator
**Warning signs:** Participant counts seem too low (< 1000 when expecting 50,000+)

### Pitfall 3: Missing Tests (Cancelled/Special)

**What goes wrong:** Assuming all tests have normering data
**Why it happens:** VT 2020 was cancelled due to COVID, some years have multiple test dates
**How to avoid:** Verify PDF existence before attempting extraction, log missing tests
**Warning signs:** 404 errors on expected URLs

### Pitfall 4: Tests.ts File Reference Mismatch

**What goes wrong:** JSON file exists but test page doesn't display normering
**Why it happens:** tests.ts not updated with normering file references
**How to avoid:** Update tests.ts with normering files for each test processed
**Warning signs:** Normering section doesn't appear on test page despite JSON existing

### Pitfall 5: URL Pattern Variations

**What goes wrong:** Script fails on some years due to URL inconsistency
**Why it happens:** studera.nu changed URL structure over time
**How to avoid:** Verify URL pattern for each era (2013-2019, 2020-2022, 2023+)
**Warning signs:** 404 errors on constructed URLs

## Code Examples

### Existing Loader (No Changes Needed)

```typescript
// apps/web/src/lib/normering/loader.ts
export async function getNormeringData(slug: string): Promise<NormeringData | null> {
  try {
    const data = await import(`@/data/normering/${slug}.json`)
    return data.default as NormeringData
  } catch {
    return null // Gracefully handles tests without normering
  }
}
```

### Example JSON Structure (Reference)

```json
// apps/web/src/data/normering/{slug}.json
{
  "testId": "hosten-2025",
  "testDate": "2025-10-19",
  "total": {
    "mean": 0.90,
    "stdDev": 0.39,
    "totalParticipants": 56723,
    "distribution": [
      { "hpScore": 0.00, "count": 316, "percentage": 0.6, "cumulativePercentage": 0.6 },
      { "hpScore": 0.05, "count": 381, "percentage": 0.7, "cumulativePercentage": 1.2 },
      // ... 41 rows for total (0.00-2.00 in 0.05 steps)
      { "hpScore": 2.00, "count": 43, "percentage": 0.1, "cumulativePercentage": 100.0 }
    ]
  },
  "verbal": {
    "mean": 0.84,
    "stdDev": 0.43,
    "totalParticipants": 56723,
    "distribution": [
      { "hpScore": 0.0, "count": 2024, "percentage": 3.6, "cumulativePercentage": 3.6 },
      // ... 21 rows for verbal (0.0-2.0 in 0.1 steps)
      { "hpScore": 2.0, "count": 392, "percentage": 0.7, "cumulativePercentage": 100.0 }
    ]
  },
  "kvantitativ": {
    "mean": 0.97,
    "stdDev": 0.46,
    "totalParticipants": 56723,
    "distribution": [
      { "hpScore": 0.0, "count": 1029, "percentage": 1.8, "cumulativePercentage": 1.8 },
      // ... 21 rows for kvantitativ (0.0-2.0 in 0.1 steps)
      { "hpScore": 2.0, "count": 732, "percentage": 1.3, "cumulativePercentage": 100.0 }
    ]
  }
}
```

### Tests.ts Update Pattern

```typescript
// When adding normering to a test in tests.ts
{
  id: "hosten-2024",
  year: 2024,
  season: "host",
  date: "2024-10-20",
  slug: "hosten-2024",
  files: [
    // ... existing provpass, facit, kallhanvisning files ...
    // ADD these three lines:
    { id: "hosten-2024-norm-hela", fileType: "normering", filename: "norm24b-helaprovet.pdf", sizeBytes: 0 },
    { id: "hosten-2024-norm-kvant", fileType: "normering", section: "kvantitativ", filename: "norm24b-kvant.pdf", sizeBytes: 0 },
    { id: "hosten-2024-norm-verb", fileType: "normering", section: "verbal", filename: "norm24b-verb.pdf", sizeBytes: 0 },
  ],
}
```

## Data Inventory

### Tests in Codebase (27 total)

| Test | Slug | Normering JSON | Normering PDFs (studera.nu) |
|------|------|----------------|----------------------------|
| HT 2025 | hosten-2025 | EXISTS | Available |
| VT 2025 | varen-2025 | MISSING | Available |
| HT 2024 | hosten-2024 | MISSING | Available |
| VT 2024 | varen-2024 | MISSING | Available |
| HT 2023 | hosten-2023 | MISSING | Available |
| VT 2023 | varen-2023 | MISSING | Available |
| HT 2022 | hosten-2022 | MISSING | Available |
| VT 2022 (May) | varen-2022 | MISSING | Available |
| VT 2022 (Mar) | varen-2022-mars | MISSING | Available |
| HT 2021 | hosten-2021 | MISSING | Available |
| VT 2021 (May) | varen-2021 | MISSING | Available |
| VT 2021 (Mar) | varen-2021-mars | MISSING | Available |
| HT 2020 | hosten-2020 | MISSING | Available |
| HT 2019 | hosten-2019 | MISSING | Available |
| VT 2019 | varen-2019 | MISSING | Available |
| HT 2018 | hosten-2018 | MISSING | Available |
| VT 2018 | varen-2018 | MISSING | Available |
| HT 2017 | hosten-2017 | MISSING | Available |
| VT 2017 | varen-2017 | MISSING | Available |
| HT 2016 | hosten-2016 | MISSING | Available |
| VT 2016 | varen-2016 | MISSING | Available |
| HT 2015 | hosten-2015 | MISSING | Available |
| VT 2015 | varen-2015 | MISSING | Available |
| HT 2014 | hosten-2014 | MISSING | Available |
| VT 2014 | varen-2014 | MISSING | Available |
| HT 2013 | hosten-2013 | MISSING | Available |

**Note:** VT 2020 was cancelled (COVID-19), no normering exists. The codebase does not include varen-2020.

### Studera.nu URL Catalog

Verified URLs for normeringstabeller pages:

**2025:**
- HT: https://www.studera.nu/hogskoleprov/resultat/resultat/senaste/
- VT: https://www.studera.nu/hogskoleprov/fpn/normeringstabeller-varen-2025/

**2024:**
- HT: https://www.studera.nu/hogskoleprov/fpn/normeringstabeller-hosten-2024/
- VT: https://www.studera.nu/hogskoleprov/fpn/normeringstabeller-varen-2024/

**2023:**
- HT: https://www.studera.nu/hogskoleprov/fpn/normeringstabeller-hosten-20232/
- VT: https://www.studera.nu/hogskoleprov/fpn/normeringstabeller-varen-2023/

**2022:**
- HT: https://www.studera.nu/hogskoleprov/fpn/normeringstabeller-hosten-2022/
- VT (May): https://www.studera.nu/hogskoleprov/fpn/normeringstabeller-varen-2022-7-maj/
- VT (Mar): https://www.studera.nu/hogskoleprov/fpn/normeringstabeller-varen-2022-12-mars/

**2021:**
- HT: https://www.studera.nu/hogskoleprov/fpn/normeringstabeller-hosten-2021/
- VT (May): https://www.studera.nu/hogskoleprov/fpn/normeringstabeller-varen-2021-8-maj/
- VT (Mar): https://www.studera.nu/hogskoleprov/fpn/normeringstabeller-varen-2021-13-mars/

**2020:**
- HT: https://www.studera.nu/hogskoleprov/fpn/normeringstabeller-hosten-2020/
- VT: CANCELLED (COVID-19)

**2019:**
- HT: https://www.studera.nu/hogskoleprov/fpn/normeringstabeller-hosten-2019/
- VT: https://www.studera.nu/hogskoleprov/fpn/normeringstabeller-varen-2019/

**2018:**
- HT: https://www.studera.nu/hogskoleprov/fpn/normeringstabeller-hosten-2018/
- VT: https://www.studera.nu/hogskoleprov/fpn/normeringstabeller-varen-2018/

**2017:**
- HT: https://www.studera.nu/hogskoleprov/fpn/normeringstabeller-hosten-2017/
- VT: https://www.studera.nu/hogskoleprov/fpn/normeringstabellervt2017/

**2016:**
- HT: https://www.studera.nu/hogskoleprov/fpn/normeringstabeller-hosten-20162/
- VT: https://www.studera.nu/hogskoleprov/fpn/normeringstabeller-varen-2016/

**2015:**
- HT: https://www.studera.nu/hogskoleprov/fpn/normeringstabeller-hosten-2015/
- VT: https://www.studera.nu/hogskoleprov/fpn/normeringstabeller-varen-2015/

**2014:**
- HT: https://www.studera.nu/hogskoleprov/fpn/normeringstabell-hosten-2014/
- VT: https://www.studera.nu/hogskoleprov/fpn/normeringstabeller-varen-2014/

**2013:**
- HT: https://www.studera.nu/hogskoleprov/fpn/normeringstabeller-hosten-2013/
- VT: https://www.studera.nu/hogskoleprov/fpn/normeringstabeller-varen-2013/

## State of the Art

| Aspect | Current State | Target State | Gap |
|--------|---------------|--------------|-----|
| JSON files | 1/26 (hosten-2025 only) | 26/26 | 25 files to create |
| Tests.ts normering refs | 1 test | 26 tests | 25 tests to update |
| Chart display | Working | Working | No change needed |
| Validation | None | Per-file validation | New validation step |

## Open Questions

### 1. PDF Download Strategy

**What we know:** Normering PDFs exist on studera.nu but are not currently in the project (except hosten-2025)
**What's unclear:** Should we download and store all normering PDFs locally, or only reference the extracted JSON?
**Recommendation:** Store PDFs locally in `/public/pdfs/{slug}/` for source verification. Provides offline access and backup.

### 2. Extraction Approach

**What we know:** Claude API can extract table data from PDFs reliably
**What's unclear:** Process manually one-by-one, or build automated batch script?
**Recommendation:** Semi-automated approach - script to download PDFs, manual Claude API extraction per file with validation, batch commit per year.

### 3. hosten-2025 Data Accuracy

**What we know:** Current hosten-2025.json contains realistic but mock data (per types.ts comment)
**What's unclear:** Should we re-extract from actual PDF to ensure accuracy?
**Recommendation:** YES - re-extract hosten-2025 from actual PDF (which exists locally) and validate. Current mock data comment in types.ts is outdated if data is real.

## Workflow Recommendation

### Phase 6 Task Breakdown

**Task 1: Download All Normering PDFs**
- Download 75+ PDFs (3 per test x 25 tests) from studera.nu
- Store in `/public/pdfs/{slug}/` matching existing structure
- Update tests.ts with normering file references for each test

**Task 2: Extract & Validate 2024-2025 Tests (Priority)**
- Extract JSON from VT 2025, HT 2024, VT 2024
- Validate against source PDFs
- Verify hosten-2025 data accuracy

**Task 3: Extract & Validate 2021-2023 Tests**
- Process 7 tests (including dual March/May tests)
- Validate cumulative percentages and totals

**Task 4: Extract & Validate 2013-2020 Tests**
- Process remaining 15 tests
- Handle any older PDF format variations

**Task 5: Final Validation & Testing**
- Verify all 26 test pages display normering correctly
- Cross-check sample data points against source PDFs
- Update types.ts to remove "mock data" comment

## Sources

### Primary (HIGH confidence)
- studera.nu normeringstabeller pages - Direct verification of PDF availability and URL patterns
- Local hosten-2025 PDFs - Verified PDF structure and content format
- Phase 3 RESEARCH.md - Existing infrastructure documentation

### Secondary (MEDIUM confidence)
- WebSearch results for studera.nu archive - Confirmed historical availability back to 2013

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Data source availability: HIGH - Verified URLs exist for all tests 2013-2025
- PDF format consistency: HIGH - Verified 2025 PDFs, similar structure expected historically
- Existing infrastructure: HIGH - Phase 3 complete and tested
- URL pattern reliability: MEDIUM - Some variation across years, needs verification per era

**Research date:** 2026-01-27
**Valid until:** Indefinite (historical data, studera.nu archives stable)
