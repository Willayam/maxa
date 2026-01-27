# Coding Conventions

**Analysis Date:** 2026-01-26

## Naming Patterns

**Files:**
- Components: PascalCase with `.tsx` extension. Example: `FeatureCard.tsx`, `Button.tsx`
- Utilities: camelCase with `.ts` extension. Example: `utils.ts`, `haptics.ts`
- Hooks: camelCase with `use` prefix. Example: `use-color-scheme.ts`
- Page files: lowercase with hyphens for nested routes (Next.js convention). Example: `gamla-prov.tsx`, `[slug]/page.tsx`
- Config files: lowercase or camelCase with dot notation. Example: `tsconfig.json`, `tailwind.config.ts`

**Functions:**
- Use camelCase for all function names
- Component functions are exported as named exports or default exports
- Utility functions are named exports
- Hook functions start with `use` prefix (React convention)

**Variables:**
- Use camelCase for regular variables and constants
- Use UPPERCASE for environment variable references and magic numbers
- Use const by default, avoid let and var
- Descriptive names for function parameters and return types

**Types:**
- PascalCase for type definitions, interfaces, and component prop types
- Example: `ButtonProps`, `FeatureCardProps`, `ButtonVariant`
- Export types explicitly for reusability across modules

## Code Style

**Formatting:**
- ESLint enabled via `eslint-config-expo` (see `eslint.config.js`)
- No Prettier config found; rely on ESLint formatting rules
- Tab width: follows ESLint defaults (typically 2 spaces)
- Line length: no explicit limit enforced

**Linting:**
- ESLint config: `/Users/williamlarsten/conductor/workspaces/maxa/san-antonio-v1/eslint.config.js`
- Uses `eslint-config-expo/flat` preset
- Distc files are ignored (`dist/*`)
- Run linting with: `bun run lint` (per package)

**TypeScript:**
- Strict mode enabled across all packages (`"strict": true`)
- Target: ES2017
- Module resolution: bundler
- JSX preservation for Next.js

## Import Organization

**Order:**
1. React/framework imports (`import React`, `import { useState }`, `import type { Metadata }`)
2. Third-party packages (`import { clsx } from 'clsx'`, `import { Button } from 'react-native'`)
3. Internal absolute imports using path aliases (`import { cn } from '@/lib/utils'`, `import { Button } from '@maxa/shared'`)
4. Relative imports (less common; use absolute imports instead)
5. CSS/style imports

**Path Aliases:**
- `@/*`: Points to app-specific `src/` directory
  - Web: `apps/web/src/*`
  - Mobile: `apps/mobile/*` (root directory)
  - Example: `import { cn } from '@/lib/utils'`
- `@maxa/shared`: Points to shared package
  - Points to: `packages/shared/src`
  - Example: `import { Button } from '@maxa/shared/components'`
- `@maxa/shared/*`: Direct path imports from shared
  - Example: `import { useColorScheme } from '@maxa/shared/hooks'`
- `@convex/_generated/*`: Convex generated types (web only)

**Best Practice:**
- Always use path aliases over relative imports (cleaner, easier to refactor)
- Never use `../../` style relative paths

## Error Handling

**Patterns:**
- Use try-catch blocks in async operations (Convex mutations, API calls)
- Check for null/undefined explicitly before operations
- Return null from providers when configuration is missing (graceful degradation)
- Log warnings to console in development when critical env vars are missing
- Example from `convex-provider.tsx`: Check `NEXT_PUBLIC_CONVEX_URL` before initializing client

**Examples:**
```typescript
// Convex client initialization with graceful degradation
if (!convexUrl) {
  console.warn("NEXT_PUBLIC_CONVEX_URL not set - Convex features disabled");
  return null;
}

// PostHog initialization with optional analytics
if (!POSTHOG_API_KEY) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('PostHog: No API key found, analytics disabled');
  }
  return <>{children}</>;
}
```

## Logging

**Framework:** `console` (browser/Node.js native)

**Patterns:**
- Use `console.warn()` for non-fatal issues during initialization
- Use `console.error()` for runtime errors (if not using error boundaries)
- Log only in development mode when possible
- Provider components log warnings when required env vars are missing

**Example:**
```typescript
if (process.env.NODE_ENV === 'development') {
  console.warn('Message here');
}
```

## Comments

**When to Comment:**
- Complex algorithmic logic (example: 3D animation calculations in buttons)
- Non-obvious business logic (example: sorting tests by year/season)
- Configuration rationale (example: "Duolingo-style design" comments in theme.ts)
- Security-sensitive operations (example: admin secret validation)

**JSDoc/TSDoc:**
- Use JSDoc for exported functions and components, especially in shared packages
- Document component prop interfaces separately
- Document hook return types

**Example:**
```typescript
/**
 * Duolingo-style Button component
 * - 3D pressed effect with border-bottom
 * - Uppercase text with font-black (900) weight
 * - Yellow background for primary
 */
export function Button({ ... }: ButtonProps) {
  // implementation
}

/**
 * Tracks pageviews automatically when navigation changes
 * Required for Next.js App Router since automatic capture doesn't work
 */
function PageViewTracker() {
  // implementation
}
```

## Function Design

**Size:** Functions should be focused and reasonably sized
- Utility functions: typically 5-10 lines
- Component functions: keep complex logic in separate utility functions
- Large functions should be broken into smaller, named helper functions

**Parameters:**
- Prefer object parameters for functions with multiple arguments
- Use TypeScript interfaces for component props
- Keep parameter count ≤ 3 (use objects for more)

**Return Values:**
- Functions should return well-defined types (use TypeScript)
- Void functions should use return type `void`
- Async functions return Promises with typed results
- React components return `ReactNode` or specific JSX types

**Example:**
```typescript
// Good: clear type signature
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Good: interface for props
interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  accentColor: 'ord' | 'las' | 'mek' | 'elf' | 'xyz' | 'kva' | 'nog' | 'dtk';
  delay?: number;
}
```

## Module Design

**Exports:**
- Use named exports for components and functions
- Use `export default` only for page components (Next.js convention)
- Export types and interfaces alongside implementations
- Create barrel files (`index.ts`) for public APIs

**Barrel Files:**
- `packages/shared/src/components/index.ts`: Re-exports UI components
- `packages/shared/src/components/ui/index.ts`: Re-exports individual UI primitives
- `packages/shared/src/hooks/index.ts`: Re-exports hooks
- `packages/shared/src/utils/index.ts`: Re-exports utilities
- Allow clean imports: `import { Button, Card } from '@maxa/shared/components'`

**Example:**
```typescript
// packages/shared/src/components/index.ts
export { Button } from './ui/button';
export { Card } from './ui/card';
export type { ButtonProps } from './ui/button';
```

## React-Specific Patterns

**Client Components:**
- Use `'use client'` directive in components that use hooks, state, or browser APIs
- All interactive components are client components
- Example: `FeatureCard.tsx`, `Button.tsx`, `PostHogProvider.tsx`

**Server Components:**
- Root layouts can be server components
- Use `Suspense` with `fallback={null}` for async boundaries
- Example: `apps/web/src/app/layout.tsx`

**Provider Components:**
- Use functional components with context initialization at module level
- Gracefully handle missing configuration
- Wrap expensive operations in useEffect hooks
- Example: `ConvexClientProvider`, `PostHogProvider`

## Design System & Styling

**Web (Tailwind CSS v4):**
- Use semantic color tokens defined in CSS variables
- Example classes: `bg-primary`, `text-foreground`, `border-border`
- Use theme utilities: `dark:` prefix for dark mode
- Custom utilities in `@layer components` for common patterns
- Example: `.btn-3d` for 3D button base styles
- See `apps/web/src/app/globals.css` for all semantic tokens

**Mobile (React Native):**
- Use design system tokens from `packages/shared/src/constants/theme.ts`
- StyleSheet objects for all styling
- Theme values: Colors, Spacing, BorderRadius, FontFamily, FontSize
- Semantic color objects: `Colors.light` and `Colors.dark`
- Use `useColorScheme()` hook for theme-aware styling

**Shared Design Principles:**
- Duolingo-inspired aesthetic: bold typography, 2px borders, 3D button effects
- Primary color: Golden yellow (#FFC800 light, #F7C948 dark)
- Font: Nunito family (Regular, Medium, SemiBold, Bold, ExtraBold, Black weights)
- Spacing uses 4px base unit (xs: 4px, sm: 8px, md: 12px, lg: 20px, xl: 24px, 2xl: 32px)

---

*Convention analysis: 2026-01-26*
