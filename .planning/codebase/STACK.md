# Technology Stack

**Analysis Date:** 2026-01-26

## Languages

**Primary:**
- TypeScript 5.3-5.9 - Used across all packages (web, mobile, shared, scripts)
- JavaScript - Configuration files and build tools

**Secondary:**
- Python - Content scraping script (`scripts/download_hogskoleprovet_tests.py`)
- CSS - Styling in web app with Tailwind CSS

## Runtime

**Environment:**
- Node.js (via Bun package manager)
- Bun 1.1.0 - Package manager and script runner (specified in `package.json` packageManager field)

**Execution Contexts:**
- Web: Next.js 15.1.0 running on Node.js
- Mobile: Expo 54.0.31 running on React Native 0.81.5
- Backend: Convex serverless backend
- Scripts: Bun for TypeScript script execution

## Frameworks

**Web Application:**
- Next.js 15.1.0 (`apps/web/`) - React framework with App Router
- React 19.1.0 - UI library for web
- React DOM 19.1.0 - DOM rendering

**Mobile Application:**
- Expo 54.0.31 (`apps/mobile/`) - React Native development platform
- React Native 0.81.5 - Cross-platform mobile framework
- React 19.1.0 - UI library for mobile
- Expo Router 6.0.22 - File-based routing for Expo

**Backend:**
- Convex 1.31.6 - Serverless backend with real-time database and file storage
  - Shared across both web and mobile apps
  - Queries and mutations in `convex/schema.ts`, `convex/tests.ts`, `convex/files.ts`, `convex/waitlist.ts`

**Shared Code:**
- @maxa/shared (workspace package) - Shared components, hooks, utils, themes

## Key Dependencies

**Critical:**
- convex 1.31.6 - Backend database, real-time sync, file storage
- next 15.1.0 - Web framework with SSR/SSG support
- expo 54.0.31 - Mobile development framework
- react 19.1.0 - React library (19.1.0)
- react-native 0.81.5 - Mobile framework
- posthog-js 1.335.2 - Analytics for web (via `apps/web/src/providers/posthog-provider.tsx`)
- posthog-react-native 4.24.0 - Analytics for mobile (via `apps/mobile/providers/posthog-provider.tsx`)

**UI & Styling:**
- tailwindcss 3.4.0 - CSS utility framework for web app
- next-themes 0.4.6 - Theme switching (light/dark mode via CSS variables)
- lucide-react 0.563.0 - Icon library for web
- @expo/vector-icons 15.0.3 - Icon library for mobile
- react-native-web 0.19.0 - Web support for React Native components in web app
- clsx 2.1.1 - Conditional className utility
- tailwind-merge 3.4.0 - Tailwind class merging utility
- framer-motion 12.29.0 - Animation library for web

**Content & Markdown:**
- react-markdown 10.1.0 - Markdown rendering for web
- remark-gfm 4.0.1 - GitHub Flavored Markdown support
- gray-matter 4.0.3 - Front matter parsing

**Mobile UI Components:**
- @react-navigation/native 7.1.8 - React Native navigation
- @react-navigation/bottom-tabs 7.4.0 - Tab navigation
- react-native-gesture-handler 2.28.0 - Gesture handling
- react-native-reanimated 4.1.1 - Performant animations (used in shared package)
- react-native-screens 4.16.0 - Native screen component optimization
- react-native-safe-area-context 5.6.0 - Safe area handling
- @react-native-community/slider 5.1.2 - Slider component

**Fonts:**
- @expo-google-fonts/nunito 0.4.2 - Nunito font family (used throughout)
- expo-font 14.0.11 - Font loading in Expo

**Expo Utilities:**
- expo-router 6.0.22 - File-based routing
- expo-constants 18.0.13 - App constants
- expo-application 7.0.8 - Application info
- expo-device 8.0.10 - Device information
- expo-splash-screen 31.0.13 - Splash screen management
- expo-status-bar 3.0.9 - Status bar styling
- expo-system-ui 6.0.9 - System UI styling
- expo-localization 17.0.8 - Localization support
- expo-haptics 15.0.8 - Haptic feedback
- expo-image 3.0.11 - Image component
- expo-symbols 1.0.8 - SF Symbols
- expo-linking 8.0.11 - Deep linking
- expo-web-browser 15.0.10 - Web browser integration

## Build & Development Tools

**Build/Dev Tools:**
- turbo 2.3.0 - Monorepo task orchestration
- autoprefixer 10.4.0 - CSS vendor prefixing
- postcss 8.4.0 - CSS transformation
- eslint 9.25.0 - Code linting
- eslint-config-expo 10.0.0 - Expo linting rules
- typescript 5.3-5.9 - Type checking and compilation

**Type Definitions:**
- @types/node 20.0.0 - Node.js type definitions
- @types/react 19.1.0 - React type definitions
- @types/react-dom 19.1.0 - React DOM type definitions

## Configuration

**Environment Variables:**

Web app (`apps/web/`):
- `NEXT_PUBLIC_CONVEX_URL` - Convex backend URL (required for database access)
- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog API key (optional, analytics disabled if not set)
- `NEXT_PUBLIC_POSTHOG_HOST` - PostHog host (defaults to `https://eu.i.posthog.com` for GDPR)
- `NODE_ENV` - Runtime environment (development/production)

Mobile app (`apps/mobile/`):
- `EXPO_PUBLIC_POSTHOG_KEY` - PostHog API key (optional, analytics disabled if not set)
- `EXPO_PUBLIC_POSTHOG_HOST` - PostHog host (defaults to `https://eu.i.posthog.com` for GDPR)

Backend (`convex/`):
- `ADMIN_SECRET` - Secret token for admin mutations (test/file upload operations)
- `CONVEX_URL` - Set automatically by Convex deployment

**Build Configuration Files:**
- `apps/web/next.config.js` - Next.js configuration
  - Transpiles shared package and React Native Web/Reanimated
  - Webpack config for React Native aliases
- `apps/web/tailwind.config.ts` - Tailwind CSS configuration
  - Light/dark mode with CSS custom properties
  - Design tokens for colors, fonts, shadows
  - Custom animations (float, fadeInUp, pulseGlow)
- `apps/web/tsconfig.json` - TypeScript configuration (minimal, extends expo base)
- `convex/` - No package.json in convex directory (files are deployed to Convex cloud)

**Package Manager Config:**
- `bun.lockb` - Bun lockfile (binary format)
- Package manager: Bun 1.1.0 (defined in root `package.json`)

**Root Monorepo:**
- `package.json` - Root workspace configuration with Turbo scripts
  - Workspaces: `apps/*`, `packages/*`
  - Convex dependency at root for shared access

## Platform Requirements

**Development:**
- Bun 1.1.0 or compatible Node.js version
- TypeScript 5.3+
- macOS/Linux/Windows environment
- Expo CLI (via `bun dev:mobile`)
- For Python scraping: Python 3.x

**Production - Web:**
- Node.js runtime (via Vercel, Next.js compatible hosting)
- Convex deployment URL (`NEXT_PUBLIC_CONVEX_URL`)

**Production - Mobile:**
- iOS app distributed via App Store or TestFlight
- Android app distributed via Google Play or similar
- Convex backend URL (embedded in Expo build)

**Deployment:**
- Convex backend deployed to Convex cloud (`bunx convex deploy`)
- Web app deployable to Vercel, Netlify, or any Node.js host
- Mobile app built via EAS Build or local Expo development

---

*Stack analysis: 2026-01-26*
