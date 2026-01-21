# Maxa Agent Guide

## What this repo is
- Expo Router app for Maxa (Hogskoleprovet prep). Current state is UI-first with mock data in screens.
- Design is Duolingo-inspired: bold typography, 2px card borders, 3D button press effects, haptics.
- Backend/auth/payment described in docs, but not implemented in code yet.

## Quick start
- Install: `bun install`
- Run dev server: `bun start` (same as `expo start`)
- Platforms: `bun run ios`, `bun run android`, `bun run web`
- Lint: `bun run lint`

## Repo map (high-signal)
- `app/_layout.tsx`: root stack, theme provider, Nunito font loading, splash screen handling.
- `app/(tabs)/_layout.tsx`: tab bar config (Idag, Trana, Jag). `explore` tab is hidden.
- `app/(tabs)/index.tsx`: Idag (dashboard) screen with mock data, streak animation, daily goal.
- `app/(tabs)/trana.tsx`: Trana (training) hub with mode cards and section tiles.
- `app/(tabs)/jag.tsx`: Jag (profile/progress) screen with stats and coach style selector.
- `app/(tabs)/explore.tsx`: Expo template screen, kept but not shown.
- `app/modal.tsx`: template modal screen.
- `components/ui/*`: design-system components (Button, Card, Text, Chip, ProgressBar, StatBadge).
- `constants/theme.ts`: design tokens (colors, spacing, typography, radius, shadows, section colors).
- `utils/haptics.ts`: haptics helper that no-ops on web.
- `hooks/use-color-scheme.ts`: color scheme hook re-export; `hooks/use-theme-color.ts` maps theme colors.

## Conventions and patterns
- Use path alias `@/` for imports (configured in `tsconfig.json`).
- Prefer `components/ui` + `constants/theme.ts` tokens over ad-hoc styles.
- Buttons and tab presses use haptics via `triggerImpact` from `utils/haptics.ts`.
- Animations are done with `react-native-reanimated` (e.g., `FadeInDown`, `withSpring`).
- Fonts: Nunito is loaded in `app/_layout.tsx`. Avoid rendering UI before fonts are loaded.
- Icons: `components/ui/icon-symbol` uses SF Symbols on iOS and Material Icons elsewhere.

## Data and state
- Screens use local mock objects (e.g., `MOCK_USER`). No API, auth, or storage wiring yet.
- If you add data, keep it local/stateful or plan an integration layer; avoid mixing mock and real data silently.

## Config notes
- `app.json` enables new architecture, typed routes, and splash screen configuration.
- `conductor.json` defines `bun`-based setup/run scripts used by automation.

## Docs and gaps
- `docs/ARCHITECTURE.md` and `docs/ROADMAP.md` describe future plans (Convex, Clerk, RevenueCat, AI).
- The directories mentioned there (e.g., `convex/`, `lib/`) do not exist in this repo yet.
- Template leftovers: `components/themed-*`, `components/hello-wave`, and `app/(tabs)/explore.tsx`.

## Adding or changing screens
- Create a file under `app/` (file-based routes). For tab screens, place under `app/(tabs)/`.
- Update `app/(tabs)/_layout.tsx` if adding/removing a tab.
- Build layouts using `SafeAreaView`, `ScrollView`, and the UI components for consistency.
- Use theme tokens (`Spacing`, `BorderRadius`, `Colors`) to keep styling aligned with the design system.
