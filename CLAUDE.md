# Maxa Agent Guide

## What this repo is
- Turborepo monorepo with mobile app (Expo) and web app (Next.js) for Maxa (Högskoleprovet prep)
- Shared Convex backend for real-time DB and file storage
- Design is Duolingo-inspired: bold typography, 2px card borders, 3D button press effects

## Quick start
```bash
bun install            # Install all dependencies
bun dev                # Start all dev servers (turbo)
bun dev:mobile         # Expo only
bun dev:web            # Next.js only
bunx convex dev        # Convex dev server (run separately)
bun run lint           # Lint all packages
```

## Repo structure
```
maxa/
├── apps/
│   ├── mobile/        # Expo app (React Native)
│   └── web/           # Next.js app
├── packages/
│   └── shared/        # Shared code
├── convex/            # Shared Convex backend
├── content/           # Static content (PDFs, not in git)
├── scripts/           # Upload/download scripts
└── docs/              # Documentation
```

## Key files

### Convex backend (shared)
- `convex/schema.ts` - Database schema (tests, testFiles)
- `convex/tests.ts` - Test queries: `list`, `getBySlug`, `create`
- `convex/files.ts` - File queries: `getByTest`, `getUrl`, `generateUploadUrl`, `createFile`

### Web app (`apps/web/`)
- `src/app/gamla-prov/page.tsx` - Browse all historical HP tests
- `src/app/gamla-prov/[slug]/page.tsx` - View/download PDFs for a test
- `src/components/convex-provider.tsx` - Convex client provider

### Mobile app (`apps/mobile/`)
- `app/(tabs)/` - Tab screens (Idag, Träna, Jag)
- `components/ui/` - Design system components
- `constants/theme.ts` - Design tokens

### Scripts
- `scripts/download_hogskoleprovet_tests.py` - Scrape PDFs from studera.nu
- `scripts/upload-to-convex.ts` - Upload PDFs to Convex storage

## Conventions
- Use `@/` path alias for imports
- Mobile uses NativeWind (Tailwind for RN), web uses Tailwind CSS v4
- Convex queries/mutations are in `convex/` at repo root, shared by both apps

## Data flow
- Web and mobile apps both connect to same Convex deployment
- Historical HP tests stored in Convex: metadata in `tests` table, PDFs in file storage
- `testFiles` table links tests to their PDF files with type metadata

## Scripts usage
```bash
# Download HP PDFs from studera.nu (requires Python)
python scripts/download_hogskoleprovet_tests.py

# Upload downloaded PDFs to Convex
bun scripts/upload-to-convex.ts
bun scripts/upload-to-convex.ts --dry-run  # Preview only
```

## Docs
- `docs/ARCHITECTURE.md` - System architecture and schema
- `docs/ROADMAP.md` - Product roadmap and phases
- `docs/plans/` - Implementation plans
