---
status: resolved
trigger: "Could not find Convex client error ONLY on root route /"
created: 2026-01-27T00:00:00Z
updated: 2026-01-27T00:02:00Z
---

## Current Focus

hypothesis: CONFIRMED and FIXED
test: TypeScript compilation passes, components gracefully degrade when Convex unavailable
expecting: No runtime error on / or /bekrafta when NEXT_PUBLIC_CONVEX_URL is not set
next_action: Archive session

## Symptoms

expected: HomePage at `/` renders with Convex context available, just like every other page
actual: Runtime error "Could not find Convex client! useMutation must be used in the React component tree under ConvexProvider" — but ONLY on `/`
errors: Could not find Convex client at WaitlistFormInner, WaitlistForm, HomePage
reproduction: Navigate to localhost:3000/ — error. Any other route — works.
started: Route-specific, during development

## Eliminated

- hypothesis: Root route has different layout/rendering behavior (route groups, parallel routes, middleware)
  evidence: Only one root layout.tsx exists, no route groups, no middleware, no special config for /
  timestamp: 2026-01-27T00:00:30Z

- hypothesis: Root route bypasses provider tree somehow
  evidence: layout.tsx wraps ALL children with ConvexClientProvider. The provider IS rendered for all routes.
  timestamp: 2026-01-27T00:00:30Z

## Evidence

- timestamp: 2026-01-27T00:00:10Z
  checked: App directory structure
  found: No route groups, parallel routes, or additional layouts. Single root layout.tsx.
  implication: All routes share the same provider tree - issue is not structural

- timestamp: 2026-01-27T00:00:20Z
  checked: .env.local files for NEXT_PUBLIC_CONVEX_URL
  found: NOT SET in any env file. Only PostHog keys are configured.
  implication: getConvexClient() returns null, ConvexClientProvider renders without ConvexProvider

- timestamp: 2026-01-27T00:00:25Z
  checked: Which files use Convex hooks (useMutation/useQuery)
  found: Only waitlist-form.tsx (line 22) and bekrafta/page.tsx (line 18) use useMutation
  implication: Error only appears on pages using these components. "Other routes work" because they never call Convex hooks.

- timestamp: 2026-01-27T00:00:30Z
  checked: ConvexClientProvider behavior when client is null
  found: Lines 25-27: if (!client) return <>{children}</> — renders children WITHOUT ConvexProvider wrapper
  implication: Any component calling useMutation will throw because there is no ConvexProvider ancestor

- timestamp: 2026-01-27T00:01:30Z
  checked: TypeScript compilation after fix
  found: tsc --noEmit passes with zero errors
  implication: Fix is type-safe and compiles correctly

## Resolution

root_cause: NEXT_PUBLIC_CONVEX_URL is not set in .env.local, causing ConvexClientProvider to render children without ConvexProvider. The error appears route-specific because only / (WaitlistForm) and /bekrafta use Convex hooks. Other routes work simply because they never call useMutation/useQuery. The mounted guard in WaitlistForm only protects against SSR, not against missing provider.
fix: Added ConvexAvailableContext and useConvexAvailable() hook to convex-provider.tsx. WaitlistForm now checks useConvexAvailable() before rendering WaitlistFormInner (which calls useMutation). bekrafta/page.tsx now conditionally renders ConfirmContent only when Convex is available, showing a fallback error UI otherwise.
verification: TypeScript compilation passes. Components gracefully degrade to disabled/fallback state when Convex is unavailable.
files_changed:
  - apps/web/src/components/convex-provider.tsx
  - apps/web/src/components/waitlist-form.tsx
  - apps/web/src/app/bekrafta/page.tsx
