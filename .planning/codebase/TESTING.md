# Testing Patterns

**Analysis Date:** 2026-01-26

## Test Framework

**Status:** Not currently implemented

**Note:** The codebase contains no test files (no `.test.ts`, `.spec.ts`, `.test.tsx`, or `.spec.tsx` files found in `/apps/web`, `/apps/mobile`, `/packages/shared`, or `/convex`).

## Test Infrastructure Available

**Type Checking:**
- TypeScript enabled with `--strict` mode
- Run with: `bun run typecheck` (per workspace)
- Catches type errors at build time

**Linting:**
- ESLint configured via `eslint-config-expo`
- Run with: `bun run lint` (per workspace)
- Config: `eslint.config.js` at repository root

## Recommended Testing Setup

For future implementation, consider the following approach based on project structure:

**Test Framework:**
- **Unit Tests:** Vitest or Jest (lightweight for this project)
- **React Component Tests:** React Testing Library
- **Integration Tests:** Vitest with mocking
- **E2E Tests:** Playwright or Cypress (optional for web)

**Setup Instructions:**

```bash
# Install testing dependencies
bun add -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom

# For React Native component testing
bun add -D @testing-library/react-native
```

**Package-Level Commands:**
```bash
# In apps/web/package.json
"test": "vitest",
"test:ui": "vitest --ui",
"test:coverage": "vitest --coverage"

# In apps/mobile/package.json
"test": "vitest",
"test:coverage": "vitest --coverage"

# In packages/shared/package.json
"test": "vitest",
"test:coverage": "vitest --coverage"
```

## Test File Organization

**Recommended Location:**
- Web components: `apps/web/src/**/__tests__/ComponentName.test.tsx`
- Mobile components: `apps/mobile/app/**/__tests__/ComponentName.test.tsx`
- Shared package: `packages/shared/src/**/__tests__/function.test.ts`
- Convex mutations/queries: `convex/**/__tests__/queries.test.ts`

**Naming:**
- Test files: `*.test.ts`, `*.test.tsx` (or `.spec.*` as alternative)
- Test suites per component/function
- Co-located with source code for easy navigation

## Test Structure (Recommended)

**Pattern for React Components:**
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button', () => {
  describe('rendering', () => {
    it('renders button with text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('applies variant class', () => {
      render(<Button variant="primary">Submit</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-primary');
    });
  });

  describe('interactions', () => {
    it('calls onClick handler when clicked', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click</Button>);

      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledOnce();
    });

    it('disables when disabled prop is true', async () => {
      const handleClick = vi.fn();
      render(<Button disabled onClick={handleClick}>Disabled</Button>);

      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });
});
```

**Pattern for Utilities:**
```typescript
import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('merges class names', () => {
    const result = cn('px-4', 'py-2');
    expect(result).toContain('px-4');
    expect(result).toContain('py-2');
  });

  it('handles conditional classes', () => {
    const result = cn('px-4', false && 'hidden', true && 'block');
    expect(result).toContain('px-4');
    expect(result).toContain('block');
    expect(result).not.toContain('hidden');
  });

  it('resolves Tailwind conflicts', () => {
    const result = cn('bg-red-500', 'bg-blue-500');
    expect(result).toContain('bg-blue-500');
  });
});
```

**Pattern for Hooks:**
```typescript
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useColorScheme } from './use-color-scheme';

describe('useColorScheme', () => {
  it('returns the system color scheme', () => {
    const { result } = renderHook(() => useColorScheme());
    expect(['light', 'dark', null]).toContain(result.current);
  });
});
```

## Mocking

**Framework:** Vitest provides `vi` object for mocking

**Patterns:**

```typescript
// Mock functions
const mockFn = vi.fn();
const mockFnWithReturnValue = vi.fn().mockReturnValue(42);

// Mock modules
vi.mock('@/lib/utils', () => ({
  cn: vi.fn((args) => args.join(' '))
}));

// Mock environment variables
process.env.NEXT_PUBLIC_CONVEX_URL = 'https://example.convex.cloud';

// Mock browser APIs
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
```

**What to Mock:**
- External API calls (Convex queries/mutations)
- Browser APIs (window.location, localStorage)
- Third-party services (PostHog)
- Environment-dependent values
- Heavy dependencies (file uploads, large libraries)

**What NOT to Mock:**
- React components being tested
- Utilities and helper functions (test real behavior)
- Built-in DOM APIs like querySelector
- Styling utilities like `cn()` (test actual Tailwind merging)

## Fixtures and Factories

**Test Data Pattern:**
```typescript
// constants/test-data.ts
export const mockTest = {
  _id: 'test_123' as Id<'tests'>,
  year: 2024,
  season: 'höst' as const,
  date: '2024-10-20',
  slug: 'hosten-2024',
  sourceUrl: null,
};

export const mockTestFile = {
  _id: 'file_123' as Id<'testFiles'>,
  testId: mockTest._id,
  storageId: 'storage_123' as Id<'_storage'>,
  fileType: 'provpass' as const,
  section: 'verbal' as const,
  passNumber: 1,
  originalFilename: 'hosten-2024-provpass-verbal-1.pdf',
  sizeBytes: 2048576,
};

export const mockButtonProps = {
  children: 'Click me',
  variant: 'primary' as const,
  size: 'md' as const,
};
```

**Location:**
- `apps/web/src/__tests__/fixtures/` for web test data
- `apps/mobile/app/__tests__/fixtures/` for mobile test data
- `packages/shared/src/__tests__/fixtures/` for shared test data
- `convex/__tests__/fixtures/` for backend test data

## Coverage

**Recommended Target:** 70-80% coverage for libraries, 50-60% for applications

**View Coverage:**
```bash
bun run test:coverage
```

**Coverage Focus Areas:**
- Critical business logic (Convex mutations, API interactions)
- Shared components (higher coverage priority)
- Utility functions (high coverage recommended)
- Page routes (lower priority; focus on integration testing instead)

## Test Types

**Unit Tests:**
- **Scope:** Individual functions, utilities, single components
- **Approach:** Test in isolation with mocked dependencies
- **Example:** Testing the `cn()` utility, button variants, form validation
- **Location:** Co-located with source files in `__tests__` directories

**Integration Tests:**
- **Scope:** Multiple components working together, component + hooks
- **Approach:** Render components with real providers where possible
- **Example:** Testing form submission with validation, page with data loading
- **Location:** `__tests__/integration/` subdirectories

**E2E Tests (Optional):**
- **Framework:** Playwright for web; native testing frameworks for mobile
- **Scope:** Full user workflows across pages
- **Example:** Sign up → Browse tests → Download PDF
- **Location:** `e2e/` directory at project root

## Async Testing (Recommended Pattern)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestPage } from './page';

describe('TestPage', () => {
  it('loads and displays tests', async () => {
    const mockQuery = vi.fn().mockResolvedValue([
      { _id: 'test_1', slug: 'hosten-2024' }
    ]);

    render(<TestPage />);

    // Wait for async data to load
    await waitFor(() => {
      expect(screen.getByText('hösten 2024')).toBeInTheDocument();
    });
  });

  it('handles loading state', async () => {
    const mockQuery = vi.fn().mockImplementation(() =>
      new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<TestPage />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });
});
```

## Error Testing (Recommended Pattern)

```typescript
describe('ConvexClientProvider', () => {
  it('handles missing CONVEX_URL gracefully', () => {
    delete process.env.NEXT_PUBLIC_CONVEX_URL;

    const { container } = render(
      <ConvexClientProvider>
        <div>Content</div>
      </ConvexClientProvider>
    );

    // Should render children without Convex
    expect(container.textContent).toBe('Content');
  });

  it('logs warning when required env var is missing', () => {
    const warnSpy = vi.spyOn(console, 'warn');
    delete process.env.NEXT_PUBLIC_CONVEX_URL;

    render(<ConvexClientProvider><div>Content</div></ConvexClientProvider>);

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('NEXT_PUBLIC_CONVEX_URL')
    );
  });
});
```

## Testing Theme System (Mobile)

Since the mobile app uses theme.ts with design tokens:

```typescript
import { describe, it, expect } from 'vitest';
import { Colors, FontFamily, Spacing, BorderRadius } from '@maxa/shared/constants/theme';

describe('Theme tokens', () => {
  it('defines light mode colors', () => {
    expect(Colors.light.primary).toBe('#FFC800');
    expect(Colors.light.text).toBe('#2C3E50');
  });

  it('defines dark mode colors', () => {
    expect(Colors.dark.primary).toBe('#F7C948');
    expect(Colors.dark.background).toBe('#0F0D1A');
  });

  it('defines typography tokens', () => {
    expect(FontFamily.black).toBe('Nunito_900Black');
    expect(FontFamily.regular).toBe('Nunito_400Regular');
  });

  it('defines spacing scale', () => {
    expect(Spacing.xs).toBe(4);
    expect(Spacing.lg).toBe(20);
  });
});
```

## Important Notes

- **No Testing Infrastructure Currently:** Tests must be added from scratch
- **Strict TypeScript:** Leverage type system as first line of defense
- **Manual QA Focus:** Currently relying on manual testing and linting
- **Recommended Priority:** Start with utility functions and shared components before UI components
- **Testing Convex:** May require mocking Convex client; consider using `@convex-dev/convex-test-library` when available

---

*Testing analysis: 2026-01-26*
