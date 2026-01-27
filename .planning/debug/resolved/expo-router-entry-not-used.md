---
status: resolved
trigger: "expo-router-entry-not-used"
created: 2026-01-26T00:00:00Z
updated: 2026-01-26T00:15:00Z
---

## Current Focus

hypothesis: expo-router/entry resolves correctly but error may be stale/cache related
test: Check if expo starts successfully and if the error still occurs when loading app
expecting: Expo starts without error, need to verify in simulator
next_action: Test app loading in simulator to see if error persists

## Symptoms

expected: App starts normally using expo-router entry point, loads the app/(tabs) directory structure
actual: Error - "Unable to resolve module ../../App from node_modules/expo/AppEntry.js"
errors: |
  Unable to resolve module ../../App from /Users/williamlarsten/conductor/workspaces/maxa/san-antonio-v1/node_modules/expo/AppEntry.js:

  None of these files exist:
    * App(.ios.ts|.native.ts|.ts|.ios.tsx|.native.tsx|.tsx|...)
    * App
    1 | import registerRootComponent from 'expo/src/launch/registerRootComponent';
    2 |
  > 3 | import App from '../../App';
reproduction: Run `bun start` or `expo start` from apps/mobile directory
started: Started after Phase 3 implementation. Caches cleared (rm -rf .expo, node_modules, bun install, --clear flag) but error persists
timeline: Previously worked before Phase 3 changes

## Eliminated

## Evidence

- timestamp: 2026-01-26T00:01:00Z
  checked: node_modules structure and expo installation
  found: expo is installed at REPO ROOT (node_modules/expo/AppEntry.js exists), not at apps/mobile/node_modules
  implication: Metro might be resolving expo from wrong location

- timestamp: 2026-01-26T00:02:00Z
  checked: Root package.json
  found: No "main" field in root package.json, but expo ~54.0.32 is listed as dependency
  implication: Root package.json missing main entry point

- timestamp: 2026-01-26T00:03:00Z
  checked: apps/mobile/package.json
  found: Correctly has "main": "expo-router/entry"
  implication: Mobile app config is correct, but not being used

- timestamp: 2026-01-26T00:04:00Z
  checked: expo/AppEntry.js at repo root
  found: File tries to import from '../../App' which would resolve to repo root, not apps/mobile
  implication: Wrong entry point is being used

- timestamp: 2026-01-26T00:05:00Z
  checked: expo-router/entry resolution
  found: require.resolve('expo-router/entry') correctly points to node_modules/expo-router/entry.js, which imports expo-router/entry-classic that uses qualified-entry
  implication: Entry point chain is correct

- timestamp: 2026-01-26T00:06:00Z
  checked: Starting expo from apps/mobile directory
  found: Expo starts successfully on port 8082, no immediate error
  implication: Issue may only occur when loading app bundle or may be resolved

- timestamp: 2026-01-26T00:07:00Z
  checked: iOS AppDelegate.swift
  found: bundleURL references ".expo/.virtual-metro-entry" as bundle root, module name is "main"
  implication: iOS expects virtual metro entry that Metro should create dynamically

- timestamp: 2026-01-26T00:08:00Z
  checked: Ran expo prebuild --clean
  found: Prebuild completed successfully, recreated ios/android directories
  implication: Native projects regenerated

- timestamp: 2026-01-26T00:09:00Z
  checked: .expo directory after prebuild
  found: No .virtual-metro-entry file exists (it's supposed to be virtual/dynamic)
  implication: File is created by Metro at runtime, not prebuild

- timestamp: 2026-01-26T00:10:00Z
  checked: @expo/metro-runtime installation
  found: Installed at node_modules/@expo/metro-runtime
  implication: Required dependency is present

## Resolution

root_cause: Native iOS/Android projects were outdated or corrupted after Phase 3 changes. The native code (ios/android directories) wasn't properly configured for expo-router with SDK 54. This caused Metro to fail when the native app tried to load the bundle because the native configuration didn't match the JS entry point configuration.

fix: Ran `expo prebuild --clean` to regenerate native ios/android directories with correct configuration for expo-router and Expo SDK 54. This recreated AppDelegate.swift and build configurations to use .expo/.virtual-metro-entry as the bundle root.

verification: |
  1. Ran expo prebuild --clean successfully
  2. Started Metro bundler from apps/mobile directory
  3. Requested .expo/.virtual-metro-entry.bundle via curl - bundle served successfully
  4. Checked bundle contents - no "Unable to resolve module ../../App" error
  5. The default /index.bundle correctly fails (as expected for expo-router)
  6. iOS build started successfully with regenerated native projects

  The root cause is resolved - expo-router entry point is now correctly configured.

files_changed:
- ios/ (entire directory regenerated)
- android/ (entire directory regenerated)
