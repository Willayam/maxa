# Coding Conventions

**Analysis Date:** 2026-01-26

## Naming Patterns

**Files:**
- PascalCase for React components: `Button.tsx`, `WaitlistForm.tsx`, `SiteHeader.tsx`
- camelCase for utilities and hooks: `utils.ts`, `theme.ts`, `use-color-scheme.ts`
- Lowercase with hyphens for page routes: `[slug]/page.tsx`, `gamla-prov/page.tsx`, `hogskoleprovet/page.tsx`
- Index files for barrel exports: `src/components/ui/index.ts` exports all UI components

**Functions:**
- camelCase for functions: `formatDate()`, `groupFiles()`, `getPdfUrl()`
- PascalCase for React functional components: `Button()`, `Card()`, `WaitlistForm()`
- `use` prefix for React hooks: `useColorScheme()`, `useMutation()`, `useQuery()`

**Variables:**
- camelCase for all variables: `email`, `testsByYear`, `errorMessage`
- UPPERCASE for constants: `ButtonDepth = 6`, `Primitives.yellow.500`
- Semantic naming for state: `status`, `mounted`, `isDisabled` (boolean prefixed with `is` or `has`)

**Types:**
- PascalCase for interfaces and types: `ButtonProps`, `CardProps`, `InputProps`, `PageProps`
- Props interfaces extend HTML element types: `extends ButtonHTMLAttributes<HTMLButtonElement>`
- Suffix with `Props` for component prop interfaces: `WaitlistFormProps`, `FeatureCardProps`

## Code Style

**Formatting:**
- Tool: ESLint with Expo config
- Configuration: `eslint.config.js` uses `eslint-config-expo/flat`
- Line length: No hard limit enforced
- Semicolons: Always included
- Quotes: Double quotes for strings in TypeScript/JavaScript

**Linting:**
- ESLint configuration: `/Users/williamlarsten/conductor/workspaces/maxa/trenton-v1/eslint.config.js`
- Extends `eslint-config-expo/flat` for both web and mobile
- Ignores: `dist/*` directory

## Import Organization

**Order:**
1. React imports: `import React`, `import { useState }`, `import type { ...Props }`
2. External libraries: `import Link from "next/link"`, `import { useMutation } from 'convex/react'`
3. Sibling/child imports: `import { Button } from '@/components/ui/button'`
4. Internal utilities and providers: `import { cn } from '@/lib/utils'`, `import { PostHogProvider }`
5. Styles: `import './globals.css'`

**Path Aliases:**
- Web app: `@/*` maps to `/apps/web/src/*`
- Mobile app: `@/*` maps to `/apps/mobile/*` and `@maxa/shared` maps to `../../packages/shared/src`
- Convex: `@convex/_generated/*` for generated API types in web app
- Example usage: `import { cn } from '@/lib/utils'`, `import { Button } from '@/components/ui/button'`

## Error Handling

**Patterns:**
- Try-catch blocks for async operations: `try { await joinWaitlist(...) } catch { setStatus('error') }`
- Error state management with status flags: `status: 'idle' | 'loading' | 'success' | 'error'`
- User-facing error messages stored in state: `errorMessage: string`
- Graceful fallbacks for async operations with `await` in handlers
- Next.js error boundaries: `error.tsx` for error boundaries, `not-found.tsx` for 404 handling

## Logging

**Framework:** Console methods (no logging library detected)

**Patterns:**
- No centralized logging observed in codebase
- Console used implicitly during development
- Error states tracked through React state for UI feedback
- `status` state used to communicate async operation results to users

## Comments

**When to Comment:**
- JSDoc comments for component prop interfaces
- Inline comments for non-obvious logic
- Section dividers in large constants files using `// ============` style

**JSDoc/TSDoc:**
- Component function comments explaining purpose: `/** Duolingo-style Button component */`
- Parameter descriptions in complex functions
- Return type descriptions for utility functions
- Comments describe intent, not implementation

## Function Design

**Size:** Functions range from 20-50 lines; keep focused on single responsibility

**Parameters:**
- Use destructuring for component props: `({ className, variant = 'primary', children, ...props }, ref)`
- Prefer object parameters over multiple positional params
- Use `forwardRef` for UI components that need ref support

**Return Values:**
- React components return JSX
- Event handlers return `void` or promise (async handlers in forms)
- Utility functions return explicit types: `string`, `number`, `boolean`, or objects

## Module Design

**Exports:**
- Named exports for components: `export function Button()`, `export const Card = forwardRef()`
- Named exports for interfaces: `export interface ButtonProps`
- Default exports only for page components in Next.js
- Components include `displayName` property when using `forwardRef`: `Button.displayName = 'Button'`

**Barrel Files:**
- Web app components organized by feature: `src/components/ui/` (UI primitives), `src/components/site/` (layout)
- Mobile app shared UI components in `packages/shared/src/components/ui/`
- Exports consolidated: `export { Button } from '@/components/ui/button'`

## UI Component Conventions

**Component Structure:**
- UI primitives use `forwardRef` to support ref forwarding: `const Button = forwardRef<HTMLButtonElement, ButtonProps>(...)`
- Props interfaces extend HTML element types for full HTML attribute support
- Variant and size props are optional with sensible defaults: `variant = 'primary'`, `size = 'md'`
- CSS classes managed with `cn()` utility from `clsx` and `tailwind-merge`

**Styling Approach - Web (Semantic Tokens):**
- Use CSS custom properties (variables) for theming in `globals.css`
- Define colors in both light and dark modes: `:root { --color-primary: #FFC800 }` and `.dark { --color-primary: #F7C948 }`
- Map variables to Tailwind in `tailwind.config.ts`: `primary: 'var(--color-primary)'`
- **Always use semantic token classes, never hardcoded hex values**
- Example: `<button className="bg-primary text-primary-foreground">` (correct) vs `<button className="bg-[#FFC800]">` (incorrect)

**Semantic Token Usage:**
- `bg-background`, `text-foreground`: Base page colors
- `bg-card-background`, `border-border`: Container colors
- `bg-primary`, `text-primary-foreground`: Brand accent (amber-gold)
- `text-foreground-muted`: Secondary/muted text
- Section colors for HP test parts: `border-l-section-ord`, `border-l-section-las`, etc.

**3D Button Effect (Duolingo-inspired):**
- Web: `border-b-[4px] border-primary-dark` + `hover:translate-y-[2px] hover:border-b-[2px]` + `active:translate-y-[4px] active:border-b-0`
- Mobile (React Native): Animated press with `Animated.createAnimatedComponent(Pressable)`, `withTiming`, and haptic feedback
- Always apply effect to primary variant only, skip for ghost variant

**Component Composition:**
- Break complex forms into sections: `FileSection`, `TestCard` as helper components
- Use helper functions within components for rendering logic: `getVariantStyles()`, `getSizeStyles()`
- Props interfaces with optional properties for customization: `className?`, `accentColor?`, `hover?`

**Styling Approach - Mobile (StyleSheet + Design Tokens):**
- Use `StyleSheet.create()` for static styles with layout logic
- Reference design tokens from `constants/theme.ts`: `Colors[colorScheme]`, `Spacing`, `BorderRadius`, `FontFamily`
- Combine static and dynamic styles: `[styles.base, variantStyles.container, sizeStyles.container, style]`
- No NativeWind/Tailwind for React Native; pure StyleSheet approach
- Button component: `Nunito_900Black` font for uppercase text (font-black weight 900)

## SEO and Metadata Patterns

**Metadata Export (Next.js):**
- Use `export const metadata: Metadata` in layout and page files
- Root layout metadata in `src/app/layout.tsx` with core site metadata
- Per-page metadata in route files: `apps/web/src/app/hogskoleprovet/page.tsx`
- Dynamic metadata using `generateMetadata()` async function with params:
  ```typescript
  export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const test = getTestBySlug(slug);
    return { title: `..., description: ..., keywords: [...] };
  }
  ```

**Metadata Structure:**
- `title`: Page title (shown in browser tab and search results)
- `description`: Meta description for search results (110-160 chars optimal)
- `keywords`: Array of relevant search terms
- `openGraph`: OG tags for social sharing
  - `title`: OG title (can differ from page title)
  - `description`: OG description for preview
  - `type`: `'website'` for pages, `'article'` for content pages

**Semantic HTML:**
- Use semantic heading hierarchy: `<h1>` once per page, `<h2>` for sections, `<h3>` for subsections
- Use `<section>` elements for distinct content areas with descriptive headings
- Use `<main>` for primary content: `<main className="flex-1 pt-24 pb-12 px-6">`
- Use `<article>` for self-contained content

**SEO Content Sections:**
- Include descriptive content after main interactive sections
- Example: "Hur använder jag gamla högskoleprov?" section with how-to content
- Use `<ol>` or `<ul>` for structured lists that search engines understand
- Target keywords naturally in headings and body text

**Link Patterns:**
- Use Next.js `<Link>` component for internal navigation (SEO-friendly): `<Link href="/hogskoleprovet/${test.slug}">`
- Use semantic link text that describes the destination, not "click here"
- Example: `<Link href="/hogskoleprovet">Alla högskoleprov</Link>` (good) vs `<Link href="/hogskoleprovet">läs mer</Link>` (less clear)

**Static Site Generation:**
- Use `generateStaticParams()` to pre-render dynamic routes at build time (SEO benefit)
- Example: `export function generateStaticParams() { return tests.map((test) => ({ slug: test.slug })); }`
- All test pages pre-rendered as static HTML for optimal SEO

## Accessibility Patterns

**HTML Practices:**
- Set `lang` attribute on `<html>` element: `<html lang="sv">` (Swedish)
- Use `alt` text for images and icons (though not heavily used in codebase)
- Focus states: `focus:outline-none focus:ring-2 focus:ring-primary` on interactive elements
- Focus ring offset for contrast: `focus:ring-offset-2 focus:ring-offset-background`

**Form Inputs:**
- Use semantic `<input>` types: `type="email"` with validation
- Link labels to inputs (pattern not shown but should be followed)
- Error states with aria-describedby pattern implied: `error && 'border-error'`
- Disabled state styling to prevent interaction: `disabled:opacity-50 disabled:cursor-not-allowed`

**Interactive Elements:**
- Buttons show `disabled` state visually: `disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`
- Form errors displayed near input with color coding: `text-error` class
- Loading indicators during async operations: `<Loader2 className="w-5 h-5 animate-spin" />`

## Configuration Management

**Environment Variables:**
- Web: `NEXT_PUBLIC_POSTHOG_KEY` for PostHog analytics (public key, safe for client)
- Mobile: `EXPO_PUBLIC_POSTHOG_KEY` for PostHog analytics
- Convex: Uses `CONVEX_DEPLOYMENT` configured via Next.js/Expo environment setup
- Analytics gracefully disabled if keys not set (checked at provider initialization)

**TypeScript Configuration:**
- Web: `tsconfig.json` with strict mode enabled, ESNext target, bundler module resolution
- Mobile: Extends `expo/tsconfig.base` with strict mode, path aliases for shared packages
- Both use `isolatedModules: true` for faster builds

---

*Conventions analysis: 2026-01-26*
