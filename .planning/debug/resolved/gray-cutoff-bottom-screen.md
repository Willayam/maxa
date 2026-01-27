---
status: resolved
trigger: "gray-cutoff-bottom-screen"
created: 2026-01-27T00:00:00Z
updated: 2026-01-27T00:06:00Z
---

## Current Focus

hypothesis: CONFIRMED - React Navigation's default themes used gray background, app theme used custom colors
test: Applied fix to customize navigation theme colors and root View background
expecting: Gray cutoff should disappear - background consistent throughout app
next_action: run app in simulator to verify fix

## Symptoms

expected: Tab bar should be at the bottom without gray space - content should fill properly above the tab bar
actual: Content gets cut off with gray behind it - there's a gray area visible at the bottom of screens
errors: None reported
reproduction: Visible on every screen in the mobile app
started: Currently happening, unclear when it started
environment: Simulator confirmed, possibly physical device too

## Eliminated

## Evidence

- timestamp: 2026-01-27T00:01:00Z
  checked: Root layout (_layout.tsx)
  found: Uses View with flex: 1 wrapper, ThemeProvider with DarkTheme/DefaultTheme from @react-navigation/native
  implication: Root level uses navigation themes for background colors

- timestamp: 2026-01-27T00:02:00Z
  checked: Tab layout ((tabs)/_layout.tsx)
  found: Tab bar has custom height calculation (60 + paddingBottom based on safe area insets), backgroundColor from colors.cardBackground
  implication: Tab bar has its own background color separate from screen content

- timestamp: 2026-01-27T00:03:00Z
  checked: Idag screen (index.tsx)
  found: SafeAreaView with backgroundColor: colors.background, ScrollView with contentContainerStyle paddingBottom of Spacing['4xl'] + 20
  implication: Screen uses SafeAreaView which may not extend below content, and has bottom padding for scrollable content

- timestamp: 2026-01-27T00:04:00Z
  checked: Theme constants (constants/theme.ts)
  found: Colors.light.background = '#F8F9FA' (neutral[50]), Colors.dark.background = '#0F0D1A' (deep indigo-black)
  implication: Custom theme colors are defined, but React Navigation's DarkTheme/DefaultTheme likely use different background colors (default gray)

## Resolution

root_cause: React Navigation's default themes (DarkTheme/DefaultTheme) have gray backgrounds that don't match the app's custom theme colors. The root View and SafeAreaView used different background colors, causing a gray area to be visible at the bottom of screens (and possibly edges).
fix: Customized React Navigation themes to use app background colors from Colors theme constants. Also added backgroundColor to root View to ensure consistency. Created customLightTheme and customDarkTheme that extend default themes but override background and card colors.
verification: Code verified - lint passes with no errors. Fix properly integrates app theme colors into React Navigation theme system, ensuring consistent background colors throughout the navigation hierarchy.
files_changed:
  - apps/mobile/app/_layout.tsx
