# Codebase Structure

**Analysis Date:** 2026-01-26

## Directory Layout

```
maxa/
├── apps/                           # Multi-platform applications
│   ├── mobile/                     # Expo/React Native mobile app
│   │   ├── app/                    # Expo Router pages
│   │   │   ├── _layout.tsx         # Root layout with providers
│   │   │   ├── (tabs)/             # Tab navigation group
│   │   │   │   ├── _layout.tsx     # Tab navigation setup
│   │   │   │   ├── index.tsx       # "Idag" (Today) dashboard screen
│   │   │   │   ├── trana.tsx       # "Träna" (Practice) screen
│   │   │   │   ├── jag.tsx         # "Jag" (Profile) screen
│   │   │   │   └── explore.tsx     # (Hidden/deprecated)
│   │   │   ├── quiz/               # Quiz flow group
│   │   │   │   ├── _layout.tsx
│   │   │   │   ├── index.tsx       # Quiz start screen
│   │   │   │   └── summary.tsx     # Quiz results screen
│   │   │   └── modal.tsx           # Modal overlay screen
│   │   ├── constants/              # App-specific constants
│   │   │   ├── theme.ts            # Design tokens (colors, spacing, shadows)
│   │   │   ├── quiz-config.ts      # Quiz settings
│   │   │   ├── mock-questions.ts   # Test question data
│   │   │   └── site.ts
│   │   ├── providers/              # Provider components
│   │   │   └── posthog-provider.tsx # Analytics setup (auto-screen tracking)
│   │   ├── components/             # App-specific components
│   │   │   ├── ui/                 # Design system components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── text.tsx
│   │   │   │   ├── progress-bar.tsx
│   │   │   │   ├── chip.tsx
│   │   │   │   ├── stat-badge.tsx
│   │   │   │   ├── icon-symbol.tsx
│   │   │   │   └── index.ts        # Barrel export
│   │   │   ├── haptic-tab.tsx      # Haptic feedback for tabs
│   │   │   ├── themed-text.tsx     # Text with theme awareness
│   │   │   ├── themed-view.tsx     # View with theme awareness
│   │   │   └── parallax-scroll-view.tsx # Animation component
│   │   ├── utils/                  # App utilities
│   │   │   └── haptics.ts          # Haptic feedback helpers
│   │   └── hooks/                  # App hooks
│   │       └── use-color-scheme.ts # Color scheme detection
│   │
│   └── web/                        # Next.js web app
│       ├── src/
│       │   ├── app/                # Next.js App Router pages
│       │   │   ├── layout.tsx      # Root layout with providers
│       │   │   ├── page.tsx        # Home/landing page (/)
│       │   │   ├── globals.css     # Global styles + CSS variables (theme)
│       │   │   ├── gamla-prov/     # Test browsing pages
│       │   │   │   ├── page.tsx    # List all tests
│       │   │   │   └── [slug]/
│       │   │   │       └── page.tsx # Test detail + file downloads
│       │   │   ├── error.tsx       # Error boundary
│       │   │   ├── not-found.tsx   # 404 page
│       │   │   └── _old-content-pages/ # Archived pages
│       │   ├── components/         # Reusable components
│       │   │   ├── ui/             # Design system components
│       │   │   │   ├── button.tsx
│       │   │   │   ├── card.tsx
│       │   │   │   ├── input.tsx
│       │   │   │   └── theme-toggle.tsx
│       │   │   ├── site/           # Site layout components
│       │   │   │   ├── site-header.tsx # Navigation header
│       │   │   │   └── site-footer.tsx # Footer
│       │   │   ├── convex-provider.tsx # Convex client setup
│       │   │   ├── theme-provider.tsx  # next-themes setup
│       │   │   ├── waitlist-form.tsx   # Waitlist signup form
│       │   │   ├── app-preview-mockup.tsx # Phone mockup visuals
│       │   │   ├── phone-mockup.tsx
│       │   │   ├── feature-card.tsx    # Feature showcase card
│       │   │   ├── markdown-renderer.tsx # Markdown to JSX
│       │   │   └── hello-wave.tsx
│       │   ├── providers/          # Provider components
│       │   │   └── posthog-provider.tsx # Analytics (manual pageview tracking)
│       │   ├── lib/                # Utilities
│       │   │   ├── utils.ts        # Helper functions
│       │   │   └── content.ts      # Content loading
│       │   ├── data/               # Static data
│       │   │   └── tests.ts        # Test definitions + helpers (getTestBySlug, getPdfUrl)
│       │   └── public/             # Static assets
│       │       ├── pdfs/           # Test PDFs organized by slug
│       │       │   └── {slug}/
│       │       │       ├── provpass-1-verbal.pdf
│       │       │       ├── facit.pdf
│       │       │       └── ...
│       │       └── screenshots/    # Marketing screenshots
│       ├── next.config.js          # Next.js configuration
│       ├── tailwind.config.ts      # Tailwind CSS config with theme tokens
│       └── tsconfig.json           # TypeScript paths: @/*, @maxa/shared/*
│
├── packages/                       # Shared libraries
│   └── shared/                     # Shared component library (@maxa/shared)
│       ├── src/
│       │   ├── components/         # Cross-platform components
│       │   │   ├── ui/
│       │   │   │   ├── button.tsx      # Supports both web/mobile
│       │   │   │   ├── card.tsx        # Supports both web/mobile
│       │   │   │   ├── text.tsx        # Cross-platform text wrapper
│       │   │   │   ├── progress-bar.tsx
│       │   │   │   ├── chip.tsx
│       │   │   │   ├── stat-badge.tsx
│       │   │   │   └── index.ts        # Barrel export
│       │   │   └── index.ts            # Component exports
│       │   ├── constants/          # Shared constants
│       │   │   └── theme.ts        # Design tokens (colors, spacing, borders, shadows)
│       │   ├── hooks/              # Shared hooks
│       │   │   ├── use-color-scheme.ts # Re-exports from react-native
│       │   │   └── index.ts
│       │   ├── utils/              # Shared utilities
│       │   │   ├── haptics.ts      # Haptic feedback
│       │   │   └── index.ts
│       │   └── index.ts            # Main export file
│       ├── tsconfig.json
│       └── package.json
│
├── convex/                         # Shared Convex backend
│   ├── _generated/                 # Auto-generated types (do not edit)
│   ├── schema.ts                   # Database schema (tests, testFiles, waitlist)
│   ├── tests.ts                    # Queries: list, getBySlug | Mutations: create
│   ├── files.ts                    # Queries: getByTest, getUrl | Mutations: generateUploadUrl, createFile
│   ├── waitlist.ts                 # Mutations: add
│   └── convex.json                 # Convex config
│
├── scripts/                        # Utility scripts
│   ├── download_hogskoleprovet_tests.py # Scrape PDFs from studera.nu
│   └── upload-to-convex.ts               # Upload PDFs to Convex storage
│
├── docs/                           # Documentation
│   ├── ARCHITECTURE.md
│   ├── ROADMAP.md
│   └── plans/                      # Implementation plans
│
├── content/                        # Static content (not in git)
│   ├── studieplan/                 # Study plans
│   └── antagningsstatistik/        # Admission stats
│
├── .planning/
│   └── codebase/                   # Codebase analysis docs (this directory)
│
├── turbo.json                      # Turborepo workspace config
├── package.json                    # Root workspace manifest
├── bun.lock                        # Dependency lock file
└── .env.example                    # Example env vars
```

## Directory Purposes

**apps/mobile/app/:**
- Purpose: Expo Router navigation and screens
- Contains: Route handlers, screens, layout definitions
- Pattern: Nested file-based routing (`(tabs)` for groups, `[slug]` for dynamic)

**apps/mobile/constants/:**
- Purpose: App configuration and design tokens
- Contains: Theme definitions, quiz settings, mock data
- Key files: `theme.ts` (Colors, Spacing, BorderRadius, FontFamily, Shadows)

**apps/mobile/providers/:**
- Purpose: Context providers and integrations
- Contains: PostHog analytics setup with auto-screen tracking

**apps/mobile/components/ui/:**
- Purpose: Mobile-specific UI components
- Contains: React Native components with StyleSheet styling
- Note: Some re-export shared components from `@maxa/shared`

**apps/web/src/app/:**
- Purpose: Next.js App Router routes
- Pattern: File-based routing with `layout.tsx`, `page.tsx`, `[slug]`, groups
- Key files: `layout.tsx` (root setup), `page.tsx` (home), `globals.css` (theme)

**apps/web/src/components/site/:**
- Purpose: Layout components used across pages
- Contains: Header, footer, common site structure

**apps/web/src/data/:**
- Purpose: Static data and helper functions
- Key files: `tests.ts` (test list, type definitions, helper functions like `getTestBySlug`, `getPdfUrl`)

**packages/shared/src/components/ui/:**
- Purpose: Shared design system for both platforms
- Contains: Button, Card, Text, ProgressBar, Chip, StatBadge (cross-platform)
- Implementation: Conditional imports or platform-agnostic React patterns

**packages/shared/src/constants/:**
- Purpose: Centralized design tokens
- Key files: `theme.ts` (colors for light/dark, spacing, borders, shadows, font sizes)
- Used by: Both `apps/mobile` and `apps/web` for consistent theming

**convex/:**
- Purpose: Backend database and file storage
- Contains: Schema definitions, queries, mutations
- Key files: `schema.ts` (tests, testFiles, waitlist tables), `tests.ts`, `files.ts`
- Shared by: Both web and mobile via Convex client

## Key File Locations

**Entry Points:**
- `apps/web/src/app/layout.tsx` - Web root layout
- `apps/web/src/app/page.tsx` - Home page
- `apps/mobile/app/_layout.tsx` - Mobile root layout

**Configuration:**
- `apps/web/tsconfig.json` - TypeScript paths (includes `@/`, `@maxa/shared/*`, `@convex/*`)
- `apps/mobile/tsconfig.json` - Mobile TypeScript config
- `apps/web/tailwind.config.ts` - Tailwind theme configuration
- `apps/web/next.config.js` - Next.js build config
- `turbo.json` - Workspace task configuration

**Core Logic:**
- `apps/web/src/data/tests.ts` - Test data and type definitions
- `convex/schema.ts` - Database schema (source of truth for entities)
- `convex/tests.ts` - Test queries and mutations
- `convex/files.ts` - File storage queries and mutations
- `packages/shared/src/constants/theme.ts` - Design token definitions

**Testing:**
- No test files detected yet (test coverage gap)

**Styling & Theme:**
- `apps/web/src/app/globals.css` - CSS variables for colors, mapped to Tailwind
- `apps/mobile/constants/theme.ts` - JavaScript theme object with light/dark variants
- `packages/shared/src/constants/theme.ts` - Shared theme constants

**Providers:**
- `apps/web/src/components/convex-provider.tsx` - Lazy Convex client initialization
- `apps/web/src/components/theme-provider.tsx` - next-themes setup
- `apps/web/src/providers/posthog-provider.tsx` - Web analytics with manual pageview tracking
- `apps/mobile/providers/posthog-provider.tsx` - Mobile analytics with auto-screen tracking

## Naming Conventions

**Files:**
- Page/route files: `page.tsx` (Next.js), `index.tsx` (Expo screens)
- Layout files: `layout.tsx` or `_layout.tsx`
- Component files: PascalCase, e.g., `WaitlistForm.tsx`, `SiteHeader.tsx`
- Utility files: kebab-case, e.g., `use-color-scheme.ts`, `haptics.ts`
- Style files: `styles.ts` (StyleSheet objects in mobile), inline styles (web with Tailwind)
- Index barrel files: `index.ts` (exports from directories)

**Directories:**
- Route groups (navigation): Parentheses e.g., `(tabs)`, `(auth)`
- Dynamic routes: Square brackets e.g., `[slug]`, `[id]`
- Private/internal: Leading underscore e.g., `_layout.tsx`, `_generated`
- Nested features: Lowercase plural, e.g., `components/`, `providers/`, `constants/`

**Functions:**
- Hooks: `useXxx` (React convention)
- Helpers: camelCase, descriptive e.g., `getTestBySlug`, `formatFileSize`, `groupFiles`
- Components: PascalCase

**Variables:**
- camelCase for all variables, const, let
- CONSTANT_CASE for true constants (rarely used; prefer const)
- Boolean variables: Prefix with `is`, `has`, `can` e.g., `isLoading`, `hasError`

**Types:**
- PascalCase for interfaces and types, e.g., `Test`, `TestFile`, `Props`
- Suffix compound types with behavior, e.g., `HandleClick`, `OnChange`

## Where to Add New Code

**New Feature (e.g., quiz questions):**
- Primary code: `apps/mobile/app/quiz/` (if mobile-focused)
- Shared logic: `packages/shared/src/` (if used by both platforms)
- Backend: `convex/` (queries/mutations for data)
- Tests: Co-locate in same directory with `.test.tsx` or `.spec.ts` suffix

**New Component/Module:**
- Shared across platforms: `packages/shared/src/components/`
- Web-only: `apps/web/src/components/`
- Mobile-only: `apps/mobile/components/`
- Always: Create subdirectory by feature (e.g., `components/quiz/`, `components/ui/`)

**Utilities:**
- Shared helpers: `packages/shared/src/utils/`
- Platform-specific: `apps/web/src/lib/` or `apps/mobile/utils/`

**Constants:**
- Shared tokens (colors, spacing): `packages/shared/src/constants/theme.ts`
- App-specific config: `apps/mobile/constants/` or `apps/web/src/constants/`

**API/Queries:**
- All backend operations: `convex/` (single source of truth)
- Query hooks: Use Convex React client (auto subscription)
- No separate API layer; Convex is the backend

## Special Directories

**apps/web/public/pdfs/:**
- Purpose: Static PDF storage for tests
- Generated: No (manually added)
- Committed: Yes (if small) or managed via scripts (if large)
- Structure: `/pdfs/{slug}/{filename}` (e.g., `/pdfs/hosten-2024/provpass-1-verbal.pdf`)

**convex/_generated/:**
- Purpose: Auto-generated Convex types and API
- Generated: Yes (by Convex CLI)
- Committed: Yes (contains type definitions)
- Do Not Edit: Regenerated on `convex dev` changes

**apps/web/.next/:**
- Purpose: Next.js build output
- Generated: Yes (build time)
- Committed: No (added to .gitignore)

**.planning/codebase/:**
- Purpose: Codebase analysis documents (for GSD mapper)
- Generated: No (manually created by analysis tools)
- Committed: Yes (planning reference)

**content/:**
- Purpose: Static content files (PDFs, study plans)
- Generated: No
- Committed: No (large files managed separately)

---

*Structure analysis: 2026-01-26*
