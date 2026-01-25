# Convex File Storage for Högskoleprovet PDFs

**Date:** 2026-01-25
**Status:** Phase 1 Complete
**Branch:** `Willayam/hp-tests-script`

## Overview

Store and serve historical Högskoleprovet PDFs through Convex file storage, enabling the `/gamla-prov` section of the website.

## What Was Built

### Phase 1: File Storage (Complete)

| Component | Description |
|-----------|-------------|
| `convex/schema.ts` | Data model with `tests` and `testFiles` tables |
| `convex/tests.ts` | Queries/mutations for test metadata |
| `convex/files.ts` | File upload URLs and serving |
| `scripts/upload-to-convex.ts` | Batch upload script for PDFs |
| `scripts/download_hogskoleprovet_tests.py` | Scraper for studera.nu |
| `/gamla-prov` page | List of all historical tests |
| `/gamla-prov/[slug]` page | Test detail with downloadable PDFs |

### Data Uploaded

- **197 PDFs** from 25 test administrations (2013-2025)
- File types: provpass, facit, normering, kallhanvisning
- Total ~150MB in Convex file storage

## Schema

```typescript
tests: {
  year: number,           // 2024
  season: "vår" | "höst",
  date: string,           // "2024-10-20"
  slug: string,           // "hosten-2024"
  sourceUrl: string,
}

testFiles: {
  testId: Id<"tests">,
  storageId: Id<"_storage">,
  fileType: "provpass" | "facit" | "kallhanvisning" | "normering",
  section: "verbal" | "kvantitativ" | null,
  passNumber: number | null,
  originalFilename: string,
  sizeBytes: number,
}
```

## Phase 2: PDF Extraction (Next)

Extract structured data from PDFs to populate the question database.

| Task | Description |
|------|-------------|
| Question extraction | Parse provpass PDFs for questions + options |
| Answer extraction | Parse facit PDFs for correct answers |
| Normering tables | Parse score conversion tables |
| Källhänvisningar | Parse source references |
| Eval workflow | Compare extracted vs original for QA |

### Extraction Approach

1. Use Claude PDF extraction skill for initial parsing
2. Store extracted data alongside files
3. Render prettified content on `/gamla-prov/[slug]` pages
4. Compare side-by-side with original PDFs for validation
5. Iterate on extraction scripts based on spotted errors

## Phase 3: Continuous Updates

| Task | Description |
|------|-------------|
| Automated detection | Watch studera.nu for new tests |
| Upload pipeline | Script to download + upload new tests |
| CI integration | Trigger on schedule or manual |

## Files Reference

```
convex/
├── schema.ts           # Data model
├── tests.ts            # Test queries/mutations
├── files.ts            # File handling
└── _generated/         # Auto-generated types

scripts/
├── download_hogskoleprovet_tests.py  # Fetch PDFs from studera.nu
└── upload-to-convex.ts               # Upload to Convex storage

apps/web/src/app/gamla-prov/
├── page.tsx            # Test list
└── [slug]/page.tsx     # Test detail
```

## Usage

```bash
# Download new PDFs from studera.nu
python scripts/download_hogskoleprovet_tests.py

# Upload to Convex (requires convex dev running)
bun scripts/upload-to-convex.ts

# Dry run to preview
bun scripts/upload-to-convex.ts --dry-run
```
