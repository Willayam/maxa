# Content Strategy Design

## Overview

Implement a lightweight markdown-based CMS for the Maxa HP website, enabling SEO-optimized content pages driven by markdown files.

## Decisions

- **Content location:** `/content/` at monorepo root
- **Rendering:** `gray-matter` + `react-markdown` + `remark-gfm` (simple, performant)
- **URL structure:** File path mirrors URL path (no frontmatter URL field needed)
- **Existing pages:** Replace `/hogskoleprovet/*` pages entirely with SEO plan structure

## File Structure

```
content/
├── index.md                              → /
├── antagningsstatistik/
│   ├── index.md                          → /antagningsstatistik
│   ├── lakarprogrammet.md                → /antagningsstatistik/lakarprogrammet
│   ├── juristprogrammet.md               → /antagningsstatistik/juristprogrammet
│   ├── psykologprogrammet.md             → /antagningsstatistik/psykologprogrammet
│   ├── industriell-ekonomi.md            → /antagningsstatistik/industriell-ekonomi
│   └── arkitekt.md                       → /antagningsstatistik/arkitekt
├── studieplan/
│   ├── index.md                          → /studieplan
│   ├── 3-manader.md                      → /studieplan/3-manader
│   └── sista-veckan.md                   → /studieplan/sista-veckan
├── gamla-prov.md                         → /gamla-prov
├── normering.md                          → /normering
└── lonestatistik.md                      → /lonestatistik
```

## Technical Implementation

### Dependencies

```json
{
  "gray-matter": "^4.0.3",
  "react-markdown": "^9.0.0",
  "remark-gfm": "^4.0.0"
}
```

### Key Files

| File | Purpose |
|------|---------|
| `apps/web/src/lib/content.ts` | Content loading utilities (`getContentBySlug`, `getAllSlugs`) |
| `apps/web/src/app/[[...slug]]/page.tsx` | Optional catch-all route for all content pages |
| `apps/web/src/components/markdown-renderer.tsx` | Styled markdown output with Tailwind |
| `apps/web/next.config.js` | Path alias to `content/` folder |

### How It Works

1. **Build time:** `generateStaticParams()` crawls `/content/` folder, returns all valid slugs
2. **Static generation:** Each content page becomes static HTML at build time
3. **SEO metadata:** `generateMetadata()` extracts `title` and `description` from frontmatter
4. **Zero JS:** Content pages are pure server components - no client-side hydration

### Frontmatter Schema

```yaml
---
title: Page Title (used for <title> and <h1>)
description: Meta description for SEO
---
```

## Migration

1. Move and reorganize `docs/content/*.md` → `content/` with nested structure
2. Delete `apps/web/src/app/hogskoleprovet/` directory
3. Update internal links in markdown to match new URL structure

## Performance Characteristics

- Full static generation (no SSR at runtime)
- No client JavaScript for content pages
- Markdown parsed once at build time
- Optimal Core Web Vitals (LCP, CLS)

## Future Considerations

- MDX upgrade path if interactive components needed
- Convex integration for dynamic data (admission stats, etc.)
- Content validation/linting in CI
