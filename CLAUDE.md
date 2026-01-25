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
- `src/app/layout.tsx` - Root layout with PostHogProvider, ConvexClientProvider, ThemeProvider
- `src/components/convex-provider.tsx` - Convex client provider
- `src/providers/posthog-provider.tsx` - PostHog analytics with manual pageview tracking

### Mobile app (`apps/mobile/`)
- `app/_layout.tsx` - Root stack with PostHogProvider, theme provider, Nunito font loading
- `app/(tabs)/` - Tab screens (Idag, Träna, Jag)
- `components/ui/` - Design system components
- `constants/theme.ts` - Design tokens
- `providers/posthog-provider.tsx` - PostHog analytics with auto screen tracking

### Scripts
- `scripts/download_hogskoleprovet_tests.py` - Scrape PDFs from studera.nu
- `scripts/upload-to-convex.ts` - Upload PDFs to Convex storage

## Environment setup
- See `.env.example` for required env vars
- PostHog: Set `EXPO_PUBLIC_POSTHOG_KEY` (mobile) or `NEXT_PUBLIC_POSTHOG_KEY` (web)
- Analytics disabled gracefully if keys not set

## Conventions
- Use `@/` path alias for imports
- Mobile uses NativeWind (Tailwind for RN), web uses Tailwind CSS v4
- Convex queries/mutations are in `convex/` at repo root, shared by both apps

## Web app design tokens (apps/web)
The web app uses CSS custom properties (variables) mapped through Tailwind for theming. **Always use semantic tokens instead of hardcoded hex values.**

### Color token structure
Defined in `apps/web/src/app/globals.css` with light/dark mode variants:
- `--color-background`, `--color-foreground`: base page colors
- `--color-card-background`, `--color-border`: container colors
- `--color-primary`, `--color-primary-dark`, `--color-primary-light`: brand accent (amber-gold)
- `--color-primary-foreground`: text color on primary backgrounds (for contrast)
- `--color-foreground-muted`: secondary/muted text

### Using tokens in components
Tailwind maps these via `tailwind.config.ts`. Use semantic class names:
```tsx
// CORRECT: Uses semantic tokens that adapt to theme
<button className="bg-primary text-primary-foreground">
<div className="bg-card-background text-foreground border-border">

// WRONG: Hardcoded colors break theming
<button className="bg-primary text-[#1a1625]">
<div className="bg-[#1E1A2D] text-white border-[#3A3550]">
```

### Adding new tokens
1. Add CSS variable to both `:root` (light) and `.dark` in `globals.css`
2. Map to Tailwind in `tailwind.config.ts` under `theme.extend.colors`
3. Use the Tailwind class (e.g., `text-primary-foreground`) in components

### Theme behavior
- Uses `next-themes` with `defaultTheme="system"` - respects OS preference automatically
- No manual toggle needed; theme follows computer settings

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
