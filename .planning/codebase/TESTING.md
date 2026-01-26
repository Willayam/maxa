# Testing Patterns

**Analysis Date:** 2026-01-26

## Test Framework

**Status:** Not detected in current codebase

**Runner:**
- No test runner configured (Jest, Vitest, or similar not found in workspace)
- `package.json` scripts include `lint` and `typecheck` but no test commands
- No `jest.config.js`, `vitest.config.ts`, or test configuration files in project root or apps

**Assertion Library:**
- Not applicable (no testing setup detected)

**Run Commands:**
```bash
# Currently unavailable - testing infrastructure not set up
# Proposed future patterns:
npm run test              # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

## Test File Organization

**Current State:**
- No test files in `/apps/web/src/` or `/apps/mobile/app/`
- Test dependencies not included in `package.json` for either app

**Recommended Future Setup:**

**Location:**
- Co-located with source files (recommended pattern)
- Example: `src/components/ui/button.tsx` → `src/components/ui/button.test.tsx`

**Naming:**
- `*.test.tsx` for React component tests
- `*.test.ts` for utility/logic tests
- `*.spec.tsx` as alternative (not currently used)

**Structure:**
```
src/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── button.test.tsx
│   │   ├── card.tsx
│   │   └── card.test.tsx
│   ├── site/
│   │   ├── site-header.tsx
│   │   └── site-header.test.tsx
├── lib/
│   ├── utils.ts
│   └── utils.test.ts
└── app/
    ├── page.tsx
    └── page.test.tsx
```

## Test Structure (Recommended)

**Suite Organization:**

```typescript
// Example: src/components/ui/button.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button', () => {
  describe('Rendering', () => {
    it('renders children text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('applies primary variant by default', () => {
      const { container } = render(<Button>Click</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('bg-primary');
    });

    it('applies specified variant', () => {
      const { container } = render(<Button variant="secondary">Click</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('border-2', 'border-border');
    });
  });

  describe('User Interaction', () => {
    it('calls onClick handler when clicked', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click</Button>);
      await userEvent.click(screen.getByText('Click'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('disables click when disabled prop is true', async () => {
      const handleClick = jest.fn();
      render(<Button disabled onClick={handleClick}>Click</Button>);
      await userEvent.click(screen.getByText('Click'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('shows focus ring on focus', async () => {
      const { container } = render(<Button>Click</Button>);
      const button = container.querySelector('button');
      button?.focus();
      expect(button).toHaveFocus();
    });

    it('is keyboard accessible', async () => {
      render(<Button>Click</Button>);
      const button = screen.getByText('Click');
      button?.focus();
      await userEvent.keyboard('{Enter}');
      // Verify behavior
    });
  });
});
```

**Patterns:**
- Use `describe()` to group related tests by feature (Rendering, User Interaction, Accessibility)
- Test both happy path and edge cases
- Test visual state changes (CSS classes applied)
- Test accessibility concerns (focus, keyboard navigation)
- Use descriptive test names that explain what is being tested

**Setup/Teardown:**
- No global test setup file observed
- Would use `beforeEach()` for test initialization
- Would use `afterEach()` for cleanup
- Could centralize render wrapper with providers in test utilities

**Assertion Pattern:**
- Use `expect()` with matcher methods: `toBeInTheDocument()`, `toHaveClass()`, `toHaveBeenCalled()`
- Assert on DOM state, not implementation details
- Test user-visible behavior, not internal state

## Mocking

**Framework:** Not yet established

**Recommended Patterns:**

```typescript
// Mocking Convex queries/mutations in web components
jest.mock('convex/react', () => ({
  useMutation: jest.fn(() => jest.fn()),
  useQuery: jest.fn(() => null),
  useConvex: jest.fn(() => ({})),
}));

// Mocking Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    pathname: '/',
  })),
  usePathname: jest.fn(() => '/'),
}));

// Mocking external libraries (Framer Motion)
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    form: ({ children, ...props }) => <form {...props}>{children}</form>,
  },
  AnimatePresence: ({ children }) => children,
}));
```

**What to Mock:**
- External API calls (Convex queries/mutations)
- Next.js navigation functions (`useRouter`, `usePathname`, `useSearchParams`)
- Complex animation libraries when not testing animations themselves (Framer Motion)
- PostHog analytics provider
- File system operations in utilities

**What NOT to Mock:**
- React hooks (`useState`, `useEffect`) - test actual behavior
- Native HTML elements
- Custom utility functions - test these directly
- Context providers unless testing error states
- CSS/styling (test that classes are applied, not the CSS itself)

## Fixtures and Factories

**Test Data:**

```typescript
// Example: tests/fixtures/test-data.ts

export const mockTest = {
  id: 'hp-2023-hosten',
  year: 2023,
  season: 'höst' as const,
  slug: 'hosten-2023',
  date: '2023-09-16',
  files: [
    {
      id: 'hp-2023-hosten-pass1',
      filename: 'HP_hösten_2023_provpass_1.pdf',
      fileType: 'provpass' as const,
      passNumber: 1,
      sizeBytes: 1024000,
    },
  ],
};

export const mockTests = [
  mockTest,
  { ...mockTest, id: 'hp-2022-hosten', year: 2022 },
];

export const mockWaitlistEntry = {
  email: 'test@example.com',
  source: 'homepage',
  confirmedAt: new Date().toISOString(),
};
```

**Location:**
- `tests/fixtures/test-data.ts` for shared test data
- `tests/mocks/handlers.ts` for API mocking (if using MSW)
- Fixtures should be minimal and focused on required properties

## Coverage

**Requirements:** Not enforced

**Target:** Not specified (recommended: 80%+ for critical paths)

**View Coverage:**
```bash
# Would be configured in test setup
npm run test:coverage

# Typically generates report in coverage/ directory
# Open coverage/lcov-report/index.html in browser
```

## Test Types

**Unit Tests (Recommended Focus):**
- Scope: Individual components and utilities
- Approach: Test component props, event handlers, state changes, CSS application
- Example: `button.test.tsx` tests Button component in isolation
- Example: `utils.test.ts` tests utility functions like `formatDate()`, `formatFileSize()`

**Integration Tests (Important for Complex Flows):**
- Scope: Multiple components working together
- Approach: Test complete user flows (e.g., form submission with Convex mutation)
- Example: Test WaitlistForm from input to API call to success message
- Example: Test navigation between pages with metadata changes

**E2E Tests:**
- Framework: Not configured
- Recommendation: Use Playwright or Cypress for web app
- Would test: Complete user journeys (visit page → fill form → submit → verify success)
- Mobile: Could use Detox or native testing frameworks

## Common Patterns

**Async Testing (Component with Convex):**

```typescript
// Testing form submission with async mutation
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WaitlistForm } from './waitlist-form';

describe('WaitlistForm', () => {
  it('submits form and shows success message', async () => {
    // Setup mock mutation
    const mockJoinWaitlist = jest.fn().mockResolvedValue({ success: true });
    jest.mocked(useMutation).mockReturnValue(mockJoinWaitlist);

    render(<WaitlistForm />);

    // User enters email
    const input = screen.getByPlaceholderText('Din e-postadress');
    await userEvent.type(input, 'test@example.com');

    // User submits
    const submitButton = screen.getByText('Få tidig tillgång');
    await userEvent.click(submitButton);

    // Wait for mutation and success message
    await waitFor(() => {
      expect(screen.getByText(/Kolla din inkorg/)).toBeInTheDocument();
    });

    expect(mockJoinWaitlist).toHaveBeenCalledWith({
      email: 'test@example.com',
      source: undefined,
    });
  });

  it('shows error message on mutation failure', async () => {
    const mockJoinWaitlist = jest.fn().mockRejectedValue(new Error('API Error'));
    jest.mocked(useMutation).mockReturnValue(mockJoinWaitlist);

    render(<WaitlistForm />);

    await userEvent.type(screen.getByPlaceholderText('Din e-postadress'), 'test@example.com');
    await userEvent.click(screen.getByText('Få tidig tillgång'));

    await waitFor(() => {
      expect(screen.getByText('Något gick fel. Försök igen.')).toBeInTheDocument();
    });
  });
});
```

**Error Testing:**

```typescript
describe('Error Handling', () => {
  it('validates email format before submission', async () => {
    render(<WaitlistForm />);

    await userEvent.type(
      screen.getByPlaceholderText('Din e-postadress'),
      'invalid-email'
    );
    await userEvent.click(screen.getByText('Få tidig tillgång'));

    expect(screen.getByText('Ange en giltig e-postadress')).toBeInTheDocument();
  });

  it('shows error state with red border on input', async () => {
    render(<WaitlistForm />);

    // Trigger error state
    await userEvent.type(screen.getByPlaceholderText('Din e-postadress'), 'bad');
    await userEvent.click(screen.getByText('Få tidig tillgång'));

    // Check error styling applied
    const input = screen.getByPlaceholderText('Din e-postadress');
    expect(input).toHaveClass('border-error');
  });
});
```

**SEO/Metadata Testing (Next.js pages):**

```typescript
// Testing metadata generation
import { generateMetadata } from './[slug]/page';
import { getTestBySlug } from '@/data/tests';

describe('Test Page Metadata', () => {
  it('generates correct metadata for a test', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'hosten-2023' }),
    });

    expect(metadata.title).toContain('hösten 2023');
    expect(metadata.description).toContain('Ladda ner');
    expect(metadata.keywords).toContain('högskoleprov 2023');
    expect(metadata.openGraph?.type).toBe('article');
  });

  it('returns proper metadata for non-existent test', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'non-existent' }),
    });

    expect(metadata.title).toContain('hittades inte');
  });
});
```

## Recommended Testing Setup

**Suggested Stack:**
- Test Runner: Vitest (fast, Vite-native) or Jest with Next.js support
- Assertion Library: Vitest's expect or Jest built-in
- Component Testing: `@testing-library/react` for DOM testing
- User Interaction: `@testing-library/user-event` for realistic interactions
- API Mocking: MSW (Mock Service Worker) for Convex queries/mutations
- E2E: Playwright for cross-platform testing

**Installation (Future):**
```bash
bun install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event msw
```

**Configuration File (vitest.config.ts):**
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
```

## Known Coverage Gaps

**Areas Without Tests:**
- UI components (Button, Card, Input) - no test files present
- Page components (Homepage, Test browser pages) - no test files
- Utilities (formatDate, formatFileSize, cn) - no test files
- API integration (Convex mutations/queries) - no test files
- SEO/Metadata generation - no test files
- Error boundaries (error.tsx, not-found.tsx) - no test files

**Priority for Implementation:**
1. High: Core UI components (Button, Card, Input)
2. High: Form components (WaitlistForm, Input with validation)
3. Medium: Page components and metadata generation
4. Medium: Utility functions
5. Low: Layout components (Header, Footer)

---

*Testing analysis: 2026-01-26*
