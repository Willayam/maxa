# PDF Storage

This directory contains PDFs for historical Hogskoleprovet tests.

## Directory Structure

```
pdfs/
  hosten-2024/
    provpass-1-verbal.pdf
    provpass-2-kvantitativ.pdf
    provpass-3-verbal.pdf
    provpass-4-kvantitativ.pdf
    facit.pdf
    normering.pdf
  varen-2024/
    ...
```

## Adding New Tests

1. Create a folder with the test slug (e.g., `hosten-2024`)
2. Add PDF files following the naming convention
3. Update `src/data/tests.ts` with file metadata
