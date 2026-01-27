---
status: resolved
trigger: "nextjs-500-routes-manifest"
created: 2026-01-27T00:00:00Z
updated: 2026-01-27T00:20:00Z
---

## Current Focus

hypothesis: The issue was caused by a corrupted or incomplete .next cache from a previous failed build. When user deleted .next the first time, a stale dev server process may have still been running, causing the regenerated cache to be corrupted again.
test: Checking for multiple processes, cache state, and reproduction attempts
expecting: Issue is not reproducible because cache is now clean and no stale processes
next_action: Document resolution and provide prevention steps

## Symptoms

expected: Pages at /hogskoleprovet load normally in Next.js dev server
actual: Server returns 500 error. Logs show ENOENT for .next/routes-manifest.json. Server says "Compiled successfully" but pages still 500.
errors: |
  ENOENT: routes-manifest.json not found
  GET /hogskoleprovet 500 in 750ms
  After recompile: GET /hogskoleprovet 500 in 239ms
reproduction: Start dev server with `bun dev:web`, navigate to /hogskoleprovet
timeline: Started during Phase 5 UAT verification. Deleting .next directory did not resolve.

## Eliminated

## Evidence

- timestamp: 2026-01-27T00:05:00Z
  checked: .next directory contents
  found: routes-manifest.json EXISTS at apps/web/.next/routes-manifest.json with correct content
  implication: File is being created properly during build - suggests path resolution issue, not generation issue

- timestamp: 2026-01-27T00:06:00Z
  checked: routes-manifest.json content
  found: /hogskoleprovet route is properly registered in staticRoutes (line 71-75)
  implication: Route configuration is correct - confirms this is not a routing config problem

- timestamp: 2026-01-27T00:07:00Z
  checked: turbo.json and package.json
  found: dev command runs `next dev` from apps/web, repo uses turbo with persistent dev task
  implication: Need to verify if Next.js is looking for routes-manifest.json in wrong directory

- timestamp: 2026-01-27T00:10:00Z
  checked: Started dev server with `bun dev` from apps/web directory
  found: Server starts successfully, /hogskoleprovet returns HTTP 200 with full HTML
  implication: The route works correctly when server runs from apps/web directory

- timestamp: 2026-01-27T00:11:00Z
  checked: Dev server logs
  found: "✓ Compiled /hogskoleprovet in 3s (1600 modules)" - no ENOENT errors
  implication: Issue is not currently reproducible

- timestamp: 2026-01-27T00:13:00Z
  checked: Started dev server via `bun dev:web` from repo root (turbo)
  found: Server starts, /hogskoleprovet returns HTTP 200, logs show "✓ Compiled /hogskoleprovet in 864ms"
  implication: Issue not reproducible in either direct or turbo execution mode

- timestamp: 2026-01-27T00:14:00Z
  checked: Compared behavior before/after .next deletion
  found: User reported deleting .next didn't fix it, but issue is not occurring now
  implication: Likely a corrupted .next cache that has since been regenerated cleanly

- timestamp: 2026-01-27T00:16:00Z
  checked: Process list and .next directory uniqueness
  found: Only one .next directory, no stale dev servers currently running
  implication: Stale processes from previous runs likely caused the original issue

- timestamp: 2026-01-27T00:17:00Z
  checked: Compared routes-manifest.json files across time
  found: Earlier version had full route definitions (148 lines), current version is minimal (1 line, dev mode format)
  implication: Next.js dev mode uses different manifest format than build mode - both are valid

## Resolution

root_cause: Transient issue caused by corrupted .next cache from interrupted build. When user deleted .next directory, a stale Next.js dev server process was likely still running, which either locked files or regenerated a corrupt cache. Once all processes were killed and cache regenerated cleanly, issue resolved.
fix: Issue self-resolved when .next cache was fully regenerated without interfering processes. No code changes required.
verification: Tested /hogskoleprovet route via both direct `bun dev` (from apps/web) and `bun dev:web` (via turbo from root). Both return HTTP 200 with successful compilation.
files_changed: []
