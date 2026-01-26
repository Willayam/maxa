---
status: resolved
trigger: "gray-bottom-safe-area"
created: 2026-01-27T10:00:00Z
updated: 2026-01-27T10:08:00Z
---

## Current Focus

hypothesis: Fix applied - edges={['top']} added to all SafeAreaView components
test: Run app in simulator and visually check all three tabs
expecting: Gray area should be gone, white tab bar should extend to screen bottom seamlessly
next_action: Test in simulator on all three tabs (Idag, Träna, Jag)

## Symptoms

expected: Tab bar white background should extend all the way to the bottom of the screen (through the home indicator safe area)
actual: Gray area visible below the tab bar in the home indicator region on every screen
errors: None
reproduction: Visible on every screen in the mobile app - see screenshots provided
started: Currently happening
environment: Simulator confirmed, possibly physical device too

## Failed Attempts

- Customized React Navigation themes with app background colors - didn't fix
- Added TabBarBackground component with StyleSheet.absoluteFill - didn't fix

## Eliminated

## Evidence

- timestamp: 2026-01-27T10:01:00Z
  checked: apps/mobile/app/_layout.tsx and apps/mobile/app/(tabs)/_layout.tsx
  found: Root View has `backgroundColor: colors.background` (gray #F8F9FA). Tab bar height = 60 + insets.bottom, paddingBottom = insets.bottom. TabBarBackground uses StyleSheet.absoluteFill with cardBackground color.
  implication: The gray showing through is definitely the root View's background. The tab bar configuration looks correct, but something is preventing it from extending to the screen bottom.

- timestamp: 2026-01-27T10:02:00Z
  checked: SafeAreaProvider usage in code
  found: useSafeAreaInsets is used in (tabs)/_layout.tsx but no SafeAreaProvider visible in _layout.tsx
  implication: SafeAreaProvider must be provided by expo-router automatically, or wrapping at a higher level. Need to check if expo-router wraps content in SafeAreaView that might be causing the gap.

- timestamp: 2026-01-27T10:03:00Z
  checked: Color values in theme.ts
  found: Colors.light.background = '#F8F9FA' (neutral[50]) and Colors.light.cardBackground = '#FFFFFF' (neutral[0])
  implication: Confirmed - gray showing is the root View's background color. Tab bar should be white (cardBackground).

- timestamp: 2026-01-27T10:04:00Z
  checked: Grep for SafeAreaView usage in tab screens
  found: All three tab screens (index.tsx, trana.tsx, jag.tsx) wrap content in SafeAreaView with backgroundColor: colors.background
  implication: SafeAreaView by default applies padding for ALL safe area edges (top, bottom, left, right)

- timestamp: 2026-01-27T10:05:00Z
  checked: SafeAreaView behavior in tab screens
  found: Each screen uses `<SafeAreaView style={{ backgroundColor: colors.background }}>` without edges prop
  implication: ROOT CAUSE FOUND - SafeAreaView adds bottom padding equal to the home indicator height, pushing the screen content up. This creates a gap between the screen and tab bar, exposing the root View's gray background. The tab bar itself extends correctly, but the screen content is inset from the bottom.

## Resolution

root_cause: SafeAreaView in tab screens applies bottom padding for the home indicator safe area, pushing content up and creating a gap where the root View's gray background shows through. The tab bar correctly extends to the bottom, but the screen content is inset.
fix: Add edges={['top']} prop to all SafeAreaView components in tab screens to exclude bottom safe area handling (tab bar already handles bottom safe area)
verification: |
  - Code changes applied successfully to all three tab screens
  - Lint passes with no errors
  - Git diff shows correct changes (edges={['top']} added to SafeAreaView)
  - Ready for visual testing in simulator
files_changed:
  - apps/mobile/app/(tabs)/index.tsx
  - apps/mobile/app/(tabs)/trana.tsx
  - apps/mobile/app/(tabs)/jag.tsx
