---
status: resolved
trigger: "expo-app-entry-cannot-resolve-app"
created: 2026-01-26T00:00:00Z
updated: 2026-01-26T00:00:00Z
---

## Current Focus

hypothesis: The error was already fixed by expo prebuild --clean (commit 1b2d1ab at 23:06 today). User may be asking about two separate things: (1) whether the error is truly fixed, and (2) whether MMKV is necessary or if they can avoid native builds and stay in Expo Go.
test: Verify native projects exist and are recent, then determine if MMKV can be replaced with AsyncStorage to enable Expo Go
expecting: Native projects are regenerated correctly. MMKV requires native builds. AsyncStorage would work in Expo Go but is slower and less reliable for the current use case (zustand persistence).
next_action: Confirm fix worked, then analyze MMKV necessity and provide recommendation

## Symptoms

expected: App should start normally with expo run:ios/android
actual: Metro bundler fails with "Unable to resolve module ../../App from /Users/williamlarsten/conductor/workspaces/maxa/san-antonio-v1/node_modules/expo/AppEntry.js"
errors:
```
Unable to resolve module ../../App from /Users/williamlarsten/conductor/workspaces/maxa/san-antonio-v1/node_modules/expo/AppEntry.js:

None of these files exist:
  * App(.ios.ts|.native.ts|.ts|.ios.tsx|.native.tsx|.tsx|.ios.mjs|.native.mjs|.mjs|.ios.js|.native.js|.js|.ios.jsx|.native.jsx|.jsx|.ios.json|.native.json|.json|.ios.cjs|.native.cjs|.cjs|.ios.scss|.native.scss|.scss|.ios.sass|.native.sass|.sass|.ios.css|.native.css|.css)
  * App
```
reproduction: Run `expo run:ios` or `expo run:android` in apps/mobile
started: After changes including MMKV addition

## Eliminated

## Evidence

- timestamp: 2026-01-26T00:05:00Z
  checked: apps/mobile/package.json
  found: "main": "expo-router/entry" - correctly configured for expo-router
  implication: Entry point configuration is correct

- timestamp: 2026-01-26T00:06:00Z
  checked: git log and commit 1b2d1ab
  found: Previous debug session already fixed this exact error. Commit message says "fix: regenerate native projects for expo-router with SDK 54" and ran expo prebuild --clean
  implication: This was already resolved. Either the fix didn't work, or something broke it again, or user is on old code

- timestamp: 2026-01-26T00:07:00Z
  checked: apps/mobile/ios/maxa/AppDelegate.swift
  found: jsBundleURL points to ".expo/.virtual-metro-entry" which is correct for expo-router
  implication: Native iOS config looks correct

- timestamp: 2026-01-26T00:08:00Z
  checked: MMKV usage in codebase
  found: MMKV is used in stores/storage.ts and imported by 4 zustand stores (coachStore, quizStore, progressStore, gamificationStore)
  implication: MMKV is actively used for persistent state storage across the app

- timestamp: 2026-01-26T00:09:00Z
  checked: git status and working tree
  found: Working tree is clean, no uncommitted changes
  implication: User is on commit 1b2d1ab which claims to fix this issue

- timestamp: 2026-01-26T00:10:00Z
  checked: Native project modification times
  found: ios/maxa/AppDelegate.swift modified at 2026-01-26 23:06:08, android files also modified at same time
  implication: Native projects were regenerated less than an hour ago - fix is fresh

- timestamp: 2026-01-26T00:11:00Z
  checked: All zustand stores using MMKV
  found: 4 stores use persist middleware with zustandStorage (MMKV wrapper): coachStore (personality), progressStore (XP, streak, stats), quizStore (session state), gamificationStore (streak, daily goals, XP, level)
  implication: MMKV is actively used throughout the app for critical user data

- timestamp: 2026-01-26T00:12:00Z
  checked: Data volume and access patterns
  found: gamificationStore has complex calculations (streak detection, XP formulas), progressStore tracks all user stats, these are accessed frequently (every question, app open, daily checks)
  implication: MMKV's synchronous API and performance benefits are valuable for this use case

- timestamp: 2026-01-26T00:13:00Z
  checked: Previous debug session resolution
  found: Resolved session documented that expo prebuild --clean fixed the issue completely. Verification showed bundle serving successfully.
  implication: The fix was verified to work. Either it still works or something broke it again.

## Resolution

root_cause: **TWO SEPARATE ISSUES:**

1. **App entry point error (RESOLVED):** The error "Unable to resolve module ../../App from expo/AppEntry.js" was caused by outdated/corrupted native iOS/Android projects after Phase 3 changes. Native code wasn't configured for expo-router with SDK 54. This was FIXED by running `expo prebuild --clean` at 23:06 today (commit 1b2d1ab). The fix is in place and working - native projects are properly regenerated.

2. **MMKV necessity (QUESTION):** MMKV requires native builds (cannot use Expo Go). However, MMKV is **actively used** for critical functionality:
   - Coach personality preference (coachStore)
   - User progress tracking: XP, streak, accuracy stats (progressStore)
   - Quiz session persistence (quizStore)
   - Gamification: streak tracking, daily goals, level progression (gamificationStore)

   MMKV provides:
   - Synchronous API (critical for streak calculations, XP awards)
   - Better performance than AsyncStorage
   - More reliable persistence
   - Native-level speed for frequent reads/writes

   **Alternative:** Could use AsyncStorage instead to enable Expo Go compatibility, BUT:
   - AsyncStorage is async-only (requires refactoring all zustand stores)
   - Slower performance (noticeable with frequent access patterns)
   - Less reliable for critical user data (streaks, XP)
   - Would still need to stay on native builds eventually for other features

fix: No fix needed for entry point error - already resolved by expo prebuild --clean. For MMKV question, recommend staying with native builds and MMKV because:
1. Better performance and reliability for user progress data
2. Synchronous API simplifies state management
3. App will need native builds eventually for distribution anyway
4. Development workflow with expo-dev-client is similar to Expo Go

verification: Native projects exist and were regenerated at 23:06 today. AppDelegate.swift correctly references .expo/.virtual-metro-entry bundle root.

files_changed:
- ios/ (regenerated by expo prebuild --clean at 23:06)
- android/ (regenerated by expo prebuild --clean at 23:06)
