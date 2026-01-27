---
plan: 001
type: execute
wave: 1
depends_on: []
files_modified:
  - apps/mobile/app/(tabs)/_layout.tsx
  - apps/mobile/app/(tabs)/index.tsx
autonomous: true

must_haves:
  truths:
    - "Idag tab label is clearly visible and engaging in both light and dark modes"
    - "Dashboard feels visually premium with clear hierarchy and energy"
    - "Design maintains Duolingo-inspired aesthetic while feeling polished"
  artifacts:
    - path: "apps/mobile/app/(tabs)/_layout.tsx"
      provides: "Enhanced tab bar with visible, stylish Idag label"
    - path: "apps/mobile/app/(tabs)/index.tsx"
      provides: "Redesigned Idag screen with improved visual hierarchy and polish"
  key_links:
    - from: "apps/mobile/app/(tabs)/index.tsx"
      to: "constants/theme.ts"
      via: "theme tokens for consistent styling"
---

<objective>
Redesign the Idag (Today) tab to be visually stunning with improved typography, hierarchy, and engagement.

Purpose: Transform a functional but boring dashboard into a premium, energizing experience that motivates users to practice daily.

Output: A polished Idag screen with bold typography, clear visual hierarchy, engaging micro-interactions, and a visible/stylish tab label.
</objective>

<context>
@apps/mobile/app/(tabs)/index.tsx
@apps/mobile/app/(tabs)/_layout.tsx
@apps/mobile/constants/theme.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix tab bar label visibility and add visual flair</name>
  <files>apps/mobile/app/(tabs)/_layout.tsx</files>
  <action>
  Update the tab bar styling to make "Idag" and other labels more visible and engaging:

  1. **Tab label styling** - Increase font size from 11 to 13, use FontFamily.bold (Nunito_700Bold), add letter-spacing for premium feel

  2. **Active state enhancement** - When active, the label should use the primary color (#FFC800 light / #F7C948 dark) with stronger contrast

  3. **Inactive state** - Use textSecondary color instead of tabIconDefault for better visibility

  4. **Import FontFamily** from theme.ts and apply to tabBarLabelStyle

  Specific changes to tabBarLabelStyle:
  ```tsx
  tabBarLabelStyle: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
    marginTop: 4,
    letterSpacing: 0.3,
  }
  ```

  And update screenOptions to include:
  ```tsx
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.textSecondary, // Changed from tabIconDefault
  ```
  </action>
  <verify>Run `bun dev:mobile` and visually confirm that "Idag" tab label is clearly visible in both light and dark mode, with a bolder, more premium appearance.</verify>
  <done>Tab labels are clearly visible with bold Nunito font, proper sizing, and good contrast in both themes.</done>
</task>

<task type="auto">
  <name>Task 2: Redesign Idag screen with visual hierarchy and polish</name>
  <files>apps/mobile/app/(tabs)/index.tsx</files>
  <action>
  Transform the Idag screen from boring to stunning with these specific changes:

  **A. Add a bold greeting header section (after SafeAreaView, before ScrollView content):**
  ```tsx
  // Add inside ScrollView, at the very top before topStatsBar
  <Animated.View entering={FadeInDown.duration(300)} style={styles.greetingSection}>
    <Text style={[styles.greetingLabel, { color: colors.textSecondary }]}>
      {getGreeting()}
    </Text>
    <Text style={[styles.greetingName, { color: colors.text }]}>
      Redo att plugga?
    </Text>
  </Animated.View>
  ```

  Add helper function:
  ```tsx
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'God morgon';
    if (hour < 17) return 'God eftermiddag';
    return 'God kväll';
  };
  ```

  Add styles:
  ```tsx
  greetingSection: {
    marginBottom: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  greetingLabel: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
  },
  greetingName: {
    fontSize: FontSize['3xl'], // 28px
    fontFamily: FontFamily.black,
    letterSpacing: -0.5,
  },
  ```

  **B. Enhance top stats bar with more visual weight:**
  - Add a subtle border (1px) to each stat pill
  - Increase icon size slightly to 18
  - Make stat values use FontSize.xl (20) for more impact

  Update styles:
  ```tsx
  topStat: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: 'transparent', // Will be set inline per stat
  },
  topStatIcon: {
    fontSize: 18,
  },
  topStatValue: {
    fontSize: FontSize.xl, // Increased from lg
    fontFamily: FontFamily.black,
  },
  ```

  Add border colors inline:
  - XP pill: `borderColor: colors.primaryDark` (gives golden border)
  - Streak pill: `borderColor: colors.streak + '40'` (40% opacity orange)
  - Goal pill: `borderColor: colors.success + '40'`

  **C. Elevate the main practice card with a gradient-like effect:**
  Add a subtle accent bar at the top of the main card using a View with primary color:
  ```tsx
  <Card style={styles.mainCard}>
    {/* Accent bar at top */}
    <View style={[styles.cardAccent, { backgroundColor: colors.primary }]} />
    {/* Rest of card content... */}
  </Card>
  ```

  Add style:
  ```tsx
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
  },
  ```

  **D. Improve daily goal section typography:**
  - Change "Dagligt mål" label to uppercase with letter-spacing
  - Make the fraction display more dramatic with larger current number

  Update:
  ```tsx
  goalLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  goalCurrent: {
    fontSize: FontSize['4xl'], // 32px - bigger for drama
    fontFamily: FontFamily.black,
  },
  ```

  **E. Week calendar visual upgrade:**
  - Add subtle separating lines between days
  - Make completed day circles larger (40px instead of 36px)
  - Add a small label "Denna vecka" above the days

  Add to weekCard content:
  ```tsx
  <Text style={[styles.weekLabel, { color: colors.textTertiary }]}>
    DENNA VECKA
  </Text>
  ```

  Add styles:
  ```tsx
  weekLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ```

  **F. Max coach section polish:**
  - Add a subtle gradient/glow effect to mascot container using a ring
  - Make the coach name bolder

  Update:
  ```tsx
  mascotContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    borderWidth: 2,
    borderColor: colors.primaryDark, // Golden ring effect
  },
  coachName: {
    fontSize: FontSize.lg, // Bigger
    fontFamily: FontFamily.black, // Bolder
  },
  ```
  </action>
  <verify>Run `bun dev:mobile` and verify:
  1. Greeting section shows time-appropriate greeting with bold "Redo att plugga?"
  2. Stats bar pills have subtle borders and larger numbers
  3. Main card has a golden accent bar at top
  4. "DAGLIGT MAL" is uppercase with letter-spacing
  5. Week calendar has "DENNA VECKA" label and larger circles
  6. Max coach has a golden ring around the owl emoji
  </verify>
  <done>Idag screen looks visually premium with clear hierarchy: bold greeting at top, enhanced stats, accent-highlighted main card, polished weekly calendar, and refined coach section.</done>
</task>

</tasks>

<verification>
After both tasks complete:
1. Launch app with `bun dev:mobile`
2. Navigate to Idag tab - label should be clearly visible in tab bar
3. Screen should feel energizing and premium, not boring
4. Test in both light and dark modes for proper theming
5. All animations should be smooth and purposeful
</verification>

<success_criteria>
- Tab bar "Idag" label is clearly visible with bold typography
- Greeting section provides personalized, welcoming header
- Visual hierarchy guides eye from greeting -> stats -> main action -> progress -> coach
- Design feels Duolingo-inspired but polished: bold, playful, engaging
- No regressions in functionality (all buttons, navigation still work)
- Both light and dark mode look great
</success_criteria>

<output>
After completion, create `.planning/quick/001-redesign-idag-tab-visual-upgrade/001-SUMMARY.md`
</output>
