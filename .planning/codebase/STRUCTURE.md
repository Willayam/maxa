# Codebase Structure

**Analysis Date:** 2026-01-26

## Directory Layout

```
trenton-v1/
├── apps/
│   ├── web/                           # Next.js web app (maxa.app)
│   │   ├── src/
│   │   │   ├── app/                   # App Router pages & layouts
│   │   │   │   ├── layout.tsx          # Root layout with providers
│   │   │   │   ├── page.tsx            # Home page (/)
│   │   │   │   ├── globals.css         # CSS custom properties & Tailwind
│   │   │   │   ├── hogskoleprovet/     # Test pages
│   │   │   │   │   ├── page.tsx        # Test listing (/hogskoleprovet)
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx    # Test detail (/hogskoleprovet/[slug])
│   │   │   │   ├── bekrafta/           # Email confirmation
│   │   │   │   │   └── page.tsx        # Confirm waitlist signup
│   │   │   │   └── _old-content-pages/ # Unused/deprecated content routes
│   │   │   ├── components/             # Reusable React components
│   │   │   │   ├── site/               # Layout components (header, footer)
│   │   │   │   ├── ui/                 # Design system (button, input, card)
│   │   │   │   ├── app-preview-mockup.tsx
│   │   │   │   ├── waitlist-form.tsx
│   │   │   │   ├── feature-card.tsx
│   │   │   │   ├── convex-provider.tsx
│   │   │   │   ├── theme-provider.tsx
│   │   │   │   └── [other components]
│   │   │   ├── providers/               # Custom context providers
│   │   │   │   └── posthog-provider.tsx
│   │   │   ├── lib/                    # Utilities & helpers
│   │   │   │   ├── content.ts          # File-system based content loading
│   │   │   │   └── utils.ts
│   │   │   └── data/                   # Static data (tests list)
│   │   │       └── tests.ts            # Test metadata + helper functions
│   │   ├── public/
│   │   │   └── pdfs/                   # PDF files organized by test slug
│   │   │       ├── hosten-2024/
│   │   │       ├── varen-2024/
│   │   │       └── [other tests]/
│   │   ├── next.config.js              # Next.js config (redirects, webpack)
│   │   ├── tailwind.config.ts          # Tailwind config with custom tokens
│   │   └── tsconfig.json               # TypeScript config with path aliases
│   │
│   └── mobile/                         # Expo React Native app
│       └── app/                        # Expo Router structure
│           ├── _layout.tsx             # Root layout (Expo Stack)
│           ├── (tabs)/                 # Tabbed interface
│           │   ├── _layout.tsx
│           │   ├── index.tsx           # Home/Idag tab
│           │   ├── trana.tsx           # Training tab
│           │   ├── jag.tsx             # Profile tab
│           │   └── explore.tsx
│           ├── quiz/                   # Quiz flows
│           ├── modal.tsx
│           └── [other routes]/
│
├── packages/
│   └── shared/                         # Shared code (both apps)
│       └── src/
│           ├── components/
│           ├── hooks/
│           ├── constants/
│           └── utils/
│
├── convex/                             # Shared backend
│   ├── schema.ts                       # Database schema (tests, testFiles, waitlist)
│   ├── tests.ts                        # Test queries (list, getBySlug, create)
│   ├── files.ts                        # File storage queries
│   ├── waitlist.ts                     # Waitlist mutations (signup, confirm)
│   ├── emails/                         # Email templates
│   └── _generated/                     # Auto-generated Convex types
│
├── content/                            # Static markdown content (for future content pages)
│   ├── studieplan/
│   └── antagningsstatistik/
│
├── scripts/                            # Utility scripts
│   ├── download_hogskoleprovet_tests.py
│   └── upload-to-convex.ts
│
├── docs/                               # Project documentation
│   ├── ARCHITECTURE.md
│   ├── ROADMAP.md
│   └── plans/                          # Implementation plans
│
├── .planning/
│   └── codebase/                       # GSD codebase analysis documents
│       ├── ARCHITECTURE.md
│       ├── STRUCTURE.md
│       ├── CONVENTIONS.md
│       ├── TESTING.md
│       ├── CONCERNS.md
│       ├── STACK.md
│       └── INTEGRATIONS.md
│
├── CLAUDE.md                           # Project instructions
├── turbo.json                          # Turborepo config
└── package.json                        # Root package (workspaces)
```

## Directory Purposes

**apps/web/src/app/**
- Purpose: Next.js App Router pages and layouts using file-based routing
- Contains: `.tsx` files that map to URL routes, `layout.tsx` for nesting
- Key files: `page.tsx` (route handlers), `[slug]/page.tsx` (dynamic routes), `layout.tsx` (layouts)
- Pattern: Each directory = route segment. Nested directories create nested routes.

**apps/web/src/components/**
- Purpose: Reusable React components shared across multiple pages
- Contains: Component files (`.tsx`), organized by feature/domain
- Key subdirectories:
  - `site/`: Layout shell components (header, footer) used on all pages
  - `ui/`: Headless UI components (button, input, card, theme-toggle)
  - Root level: Page-specific or cross-page components (waitlist-form, app-preview-mockup)

**apps/web/src/providers/**
- Purpose: React context providers that wrap the app
- Contains: Custom provider components that manage global state/config
- Key files: `posthog-provider.tsx` (analytics initialization and pageview tracking)

**apps/web/src/lib/**
- Purpose: Utilities, helpers, and data access functions
- Contains: Non-component code (functions, constants, utility modules)
- Key files: `content.ts` (file-system based markdown loading), `utils.ts` (misc helpers)

**apps/web/src/data/**
- Purpose: Static data (constants) used at build time and runtime
- Contains: TypeScript data arrays and type definitions
- Key files: `tests.ts` (test metadata array + `getTestBySlug()`, `getPdfUrl()` helpers)

**apps/web/public/pdfs/**
- Purpose: Static PDF files served directly by Next.js
- Contains: PDF files organized into subdirectories by test slug
- Example: `/public/pdfs/hosten-2024/provpass-1-kvant.pdf` maps to `/pdfs/hosten-2024/provpass-1-kvant.pdf` in browser

**convex/**
- Purpose: Shared backend code (database schema, queries, mutations, file storage)
- Contains: TypeScript files defining Convex functions and schema
- Key files:
  - `schema.ts`: Database tables (tests, testFiles, waitlist) with indexes and validation
  - `tests.ts`, `files.ts`, `waitlist.ts`: Query/mutation functions
  - `emails/`: Email templates (Resend integration for waitlist confirmations)

**packages/shared/**
- Purpose: Code shared between web and mobile apps (design system, hooks, utilities)
- Contains: Components, hooks, constants that work in both React and React Native environments
- Usage: Imported via `@maxa/shared` alias configured in both tsconfig files

## Key File Locations

**Entry Points:**

- `apps/web/src/app/layout.tsx`: Root HTML structure, provider setup, metadata
- `apps/web/src/app/page.tsx`: Home page (landing with waitlist form)
- `apps/web/src/app/hogskoleprovet/page.tsx`: Browse all tests
- `apps/web/src/app/hogskoleprovet/[slug]/page.tsx`: View single test with PDFs
- `apps/web/src/app/bekrafta/page.tsx`: Email confirmation flow

**Configuration:**

- `apps/web/tsconfig.json`: TypeScript config with path aliases (`@/`, `@maxa/shared`, `@convex/_generated`)
- `apps/web/tailwind.config.ts`: Tailwind theme extensions (custom colors, animations)
- `apps/web/next.config.js`: Next.js config (transpile shared packages, redirects)
- `apps/web/src/app/globals.css`: CSS custom properties for theming

**Core Logic:**

- `convex/schema.ts`: Database schema definitions (tables, indexes, types)
- `convex/waitlist.ts`: Email signup/confirmation mutations
- `apps/web/src/data/tests.ts`: Test data structure and helper functions
- `apps/web/src/components/convex-provider.tsx`: Convex client initialization (client-only)

**Testing:**

- No test files found in current structure (testing infrastructure not yet set up)

## Naming Conventions

**Files:**

- Page files: `page.tsx` (required by App Router)
- Layout files: `layout.tsx` (wraps child routes)
- Component files: PascalCase (e.g., `WaitlistForm.tsx`, `SiteHeader.tsx`)
- Utility files: camelCase (e.g., `utils.ts`, `content.ts`)
- Type-only files: No special suffix (types in same file as implementation)

**Directories:**

- Route segments: kebab-case (e.g., `hogskoleprovet`, `bekrafta`, `_old-content-pages`)
- Grouped routes (private): Wrapped in parentheses (e.g., `(tabs)/` in mobile app)
- Dynamic segments: Surrounded by brackets (e.g., `[slug]`, `[...parts]`)
- Feature folders: camelCase or descriptive names (e.g., `components/site/`, `components/ui/`)

**Variables & Functions:**

- Exported functions: PascalCase if component, camelCase if utility
- Type names: PascalCase (e.g., `Test`, `TestFile`, `ContentPage`)
- Constants: UPPER_SNAKE_CASE (e.g., `POSTHOG_API_KEY`, `POSTHOG_HOST`)

**CSS Classes:**

- Tailwind utility classes (see `globals.css` and component usage)
- Component layer classes: `.btn-3d` for 3D button styling
- CSS custom properties: `--color-*` for semantic colors (background, foreground, primary, border)

## Where to Add New Code

**New Test-Related Page Feature:**
- Page code: `apps/web/src/app/hogskoleprovet/` (or subdirectory)
- Components: `apps/web/src/components/` (if reusable) or inline in page
- Styles: Tailwind classes in component + CSS custom properties if new theme tokens needed
- Data: Extend `apps/web/src/data/tests.ts` with new fields/helpers

**New Interactive Component (Form, UI Element):**
- Implementation: `apps/web/src/components/` (pick subdirectory: `ui/` for reusable, `site/` for layout)
- If used in page: Import in page file
- If shared with mobile: Place in `packages/shared/src/components/`
- Styles: Use Tailwind + CSS custom properties (not inline styles)

**New Convex Feature (Query/Mutation):**
- Type definitions: Add to `convex/schema.ts` table or create new table
- Implementation: New file or add to existing (e.g., `convex/tests.ts`, `convex/waitlist.ts`)
- Export from: `convex/` file to be used via `api.path.functionName()` in components
- Tests table: Already has `by_slug` index for fast lookups

**Utilities & Helpers:**
- Shared across apps: `packages/shared/src/utils/`
- Web-only: `apps/web/src/lib/`
- Naming: camelCase file, export named or default function

**New Markdown Content Page:**
- Markdown files: `content/` directory with nested structure
- Route: Automatically mapped by `getAllContentSlugs()` and `getContentBySlug()` in `apps/web/src/lib/content.ts`
- Example: `content/guides/index.md` → `/guides`, `content/guides/getting-started.md` → `/guides/getting-started`

## Special Directories

**apps/web/public/:**
- Purpose: Static assets served directly by Next.js (no processing)
- Generated: No
- Committed: PDFs are committed (large files), but can be excluded in `.gitignore` for bandwidth
- Usage: Reference with `/path` (e.g., `/pdfs/hosten-2024/file.pdf`)

**apps/web/.next/**
- Purpose: Next.js build output (compiled pages, static assets)
- Generated: Yes (created during `bun build` or `bun dev`)
- Committed: No (in `.gitignore`)

**convex/_generated/**
- Purpose: Auto-generated Convex types and client code
- Generated: Yes (created by `convex dev` or `bunx convex codegen`)
- Committed: No (committed for type safety, but regenerated on `convex dev`)

**node_modules/**
- Purpose: Installed dependencies
- Generated: Yes (created by `bun install`)
- Committed: No (in `.gitignore`)

**.turbo/daemon/**
- Purpose: Turbo daemon cache
- Generated: Yes
- Committed: No (in `.gitignore`)

**.claude/skills/**
- Purpose: Skill context for Claude (design system, frontend patterns)
- Generated: No
- Committed: Yes (source control)

**content/**
- Purpose: Static markdown content for future content pages (unused currently)
- Generated: No
- Committed: Yes (source control)

## Path Aliases

**TypeScript/import aliases (tsconfig.json):**

- `@/*`: `apps/web/src/*` (local imports in web app)
- `@maxa/shared`: `packages/shared/src` (shared code)
- `@maxa/shared/*`: `packages/shared/src/*` (submodule imports from shared)
- `@convex/_generated/*`: `convex/_generated/*` (Convex-generated types)

**Usage in components:**
```tsx
// Instead of: import { WaitlistForm } from '../../../components/waitlist-form';
import { WaitlistForm } from '@/components/waitlist-form';

// Instead of: import { useColorScheme } from '../../packages/shared/hooks';
import { useColorScheme } from '@maxa/shared/hooks';
```

## Rendering Strategies

**Static Site Generation (SSG):**
- Pages: `apps/web/src/app/hogskoleprovet/page.tsx`, `apps/web/src/app/hogskoleprovet/[slug]/page.tsx`
- Method: No `'use client'` directive, uses `generateStaticParams()` and `generateMetadata()`
- Timing: Built at build time, served as static HTML
- Why: SEO, fast performance, no server overhead for test listing

**Client-Side Rendering (CSR):**
- Pages: `apps/web/src/app/page.tsx` (home), `apps/web/src/app/bekrafta/page.tsx` (confirmation)
- Method: `'use client'` directive at top of file
- Timing: Sent to browser as JS bundle, rendered in browser
- Why: Need interactivity (forms, animations, real-time state from Convex)

**Hybrid (SSG + CSR):**
- `apps/web/src/app/hogskoleprovet/[slug]/page.tsx` is SSG page, but can include client components
- Test detail page is static HTML, but could include interactive rating component (not currently)

## Build & Development Workflow

**Local Development:**
```bash
bun install          # Install all workspace dependencies
bun dev              # Start all dev servers (turbo orchestrates)
bun dev:web          # Start web app only (hot reload on changes)
bunx convex dev      # Start Convex dev server (separate terminal)
```

**Build:**
```bash
bun build            # Build all apps (turbo)
# Web output: apps/web/.next/
# Mobile output: apps/mobile/.expo/ or other build artifact
```

**Deploy:**
- Web: Vercel (Next.js deployment recommended)
- Convex: Automatic on commit to main (Convex cloud)
- Mobile: EAS Build (Expo) or local development

## Component Hierarchy

**Root → Providers:**
```
layout.tsx
├── PostHogProvider
│   └── ConvexClientProvider
│       └── ThemeProvider
│           └── {children}
```

**Page Layout (test listing, detail, home):**
```
<SiteHeader /> (fixed, sticky)
<main>
  {children / page content}
</main>
<SiteFooter />
```

**Component Reuse Pattern:**
- Design system components in `components/ui/` (used everywhere)
- Layout components in `components/site/` (used in pages)
- Page-specific components inline in page directory or `components/` root
