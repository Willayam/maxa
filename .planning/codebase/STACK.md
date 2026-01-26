# Technology Stack

**Analysis Date:** 2026-01-26

## Languages

**Primary:**
- TypeScript 5.3+ - Used across all packages (web, mobile, backend, shared)
  - Target: ES2017
  - Strict mode enabled

**Secondary:**
- JavaScript - Configuration files and scripts

## Runtime

**Environment:**
- Node.js (web/backend)
- Bun (package manager and dev runtime)
- React Native 0.81.5 (mobile via Expo)

**Package Manager:**
- Bun 1.1.0 (root package manager)
- Lockfile: `bun.lockb` (Bun format)
- Monorepo: Turborepo 2.3.0 for orchestration

## Frameworks

**Web (Next.js):**
- Next.js 15.1.0 (App Router with TypeScript)
- React 19.1.0
- React DOM 19.1.0

**Mobile (React Native):**
- Expo 54.0.31 (managed React Native platform)
- Expo Router 6.0.22 (file-based routing)
- React 19.1.0
- React Native 0.81.5

**Backend:**
- Convex 1.31.6 (real-time database and serverless functions)
  - Query/mutation/action-based architecture
  - File storage built-in

**Testing:**
- No test framework detected in configuration

**Build/Dev:**
- Turbo 2.3.0 - Monorepo build orchestration
- Next.js build system (via `next build`, `next dev`)
- Expo dev server (via `expo start`)
- TypeScript compiler (`tsc --noEmit` for typecheck)

## Front-End Stack (Web)

**UI Framework:**
- Tailwind CSS 3.4.0 - Utility-first CSS with PostCSS pipeline
- CSS Custom Properties (variables) for semantic theming

**Components & Animation:**
- Lucide React 0.563.0 - Icon library
- Framer Motion 12.29.0 - Animation and motion primitives
- React Markdown 10.1.0 - Markdown rendering with GFM support

**Theming:**
- next-themes 0.4.6 - Dark mode with system preference detection
- Light/dark mode via CSS variables in `apps/web/src/app/globals.css`
- Semantic color tokens: primary, foreground, border, background, section colors

**Styling Features:**
- 2px card borders (design system)
- 3D button press effects via CSS (border-bottom animation)
- Custom animations: float, fade-in-up, pulse-glow
- Custom border radius (2xl=20px, 3xl=24px)
- Custom shadows for cards and 3D effects

**Fonts:**
- Nunito font family (hosted via Google Fonts CDN)
- System UI fallback
- Loaded in `apps/web/src/app/layout.tsx` via `<link rel="preconnect">` and CSS import
- Single font import with weights: 400, 500, 600, 700, 800, 900

**Utilities:**
- clsx 2.1.1 - Class name merging and conditionals
- tailwind-merge 3.4.0 - Merge Tailwind classes safely

## Mobile-Specific Stack

**UI Components:**
- React Native Web 0.19.0 - Share web components with mobile
- NativeWind 4+ implied (Tailwind for React Native)
- Expo Vector Icons 15.0.3 - Native icon library
- React Navigation 7.1.8 - Navigation across tabs and stacks
- React Native Gesture Handler 2.28.0 - Native gesture support
- React Native Reanimated 4.1.1 - Performant animations
- React Native Safe Area Context 5.6.0 - Safe area boundaries

**Fonts (Mobile):**
- @expo-google-fonts/nunito 0.4.2 - Nunito font for Expo

**Platform APIs:**
- Expo Font 14.0.11 - Font loading
- Expo Localization 17.0.8 - i18n support
- Expo Haptics 15.0.8 - Haptic feedback
- Expo Image 3.0.11 - Optimized image loading
- Expo Linking 8.0.11 - Deep linking
- Expo Status Bar 3.0.9 - Status bar control
- Expo Symbols 1.0.8 - SF Symbols support
- Expo System UI 6.0.9 - System UI customization

## Key Dependencies

**Critical:**
- Convex 1.31.6 - Backend database, file storage, and serverless actions
  - Shared `convex/` directory at repo root
  - Schema in `convex/schema.ts`: tests, testFiles, waitlist tables
  - Queries/mutations in `convex/tests.ts`, `convex/files.ts`, `convex/waitlist.ts`

- React 19.1.0 - UI framework (web and mobile)
- React Native 0.81.5 - Mobile platform

**Analytics & Monitoring:**
- posthog-js 1.335.2 (web) - Event analytics and product insights
  - Client-side initialization with manual pageview tracking
  - Respects DNT (Do Not Track) browser setting
  - Session recording disabled by default
  - GDPR compliant: defaults to EU server (https://eu.i.posthog.com)

- posthog-react-native 4.24.0 (mobile) - Event analytics for Expo
  - Auto-captures screen views and app lifecycle events
  - Deep link tracking enabled

**Content & Rendering:**
- gray-matter 4.0.3 - YAML frontmatter parsing
- remark-gfm 4.0.1 - GitHub Flavored Markdown support

**Build & Configuration:**
- Autoprefixer 10.4.0 - CSS vendor prefixing
- PostCSS 8.4.0 - CSS transformation

## Configuration

**Environment:**
- `.env.example` at repo root defines required variables
- Environment-specific configs:
  - Web: `apps/web/.env.local`
  - Mobile: `apps/mobile/.env.local`

**Key Environment Variables:**
- `NEXT_PUBLIC_CONVEX_URL` - Convex backend URL (required for web)
- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog API key (web analytics, optional)
- `NEXT_PUBLIC_POSTHOG_HOST` - PostHog host endpoint (defaults to EU: https://eu.i.posthog.com)
- `EXPO_PUBLIC_POSTHOG_KEY` - PostHog API key (mobile analytics, optional)
- `EXPO_PUBLIC_POSTHOG_HOST` - PostHog host endpoint (mobile, defaults to EU)
- `NEXT_PUBLIC_APP_URL` - App base URL for confirmation links (defaults to https://maxahp.se)
- `RESEND_API_KEY` - Email service API key (backend only, in Convex)

**TypeScript:**
- Web: `apps/web/tsconfig.json`
  - Target: ES2017
  - Module resolution: bundler
  - Path aliases: `@/*` → `./src/*`, `@maxa/shared`, `@convex/_generated/*`

- Mobile: `apps/mobile/tsconfig.json` (expo lint)

**Build (Next.js):**
- `apps/web/next.config.js`
  - Transpiles: `@maxa/shared`, `react-native-web`, `react-native-reanimated`
  - Webpack alias for react-native → react-native-web
  - Redirects: `/gamla-prov*` → `/hogskoleprovet*` (permanent 301)

**CSS:**
- `apps/web/postcss.config.js` - PostCSS with Tailwind and Autoprefixer
- `apps/web/tailwind.config.ts` - Custom theme with semantic tokens
- `apps/web/src/app/globals.css` - Global styles, CSS variables, dark mode

## SEO & Metadata

**Next.js Metadata API:**
- `apps/web/src/app/layout.tsx` exports `metadata` object
- Metadata includes:
  - Title: "Maxa - Högskoleprovet Prep"
  - Description: Swedish HP test prep messaging
  - Keywords: HP test-related terms
  - OpenGraph: Social sharing metadata

**Fonts Optimization:**
- Google Fonts with preconnect links for performance
- Single font family (Nunito) reduces requests

**SEO Tools/Services:**
- Not detected: No sitemap generator, robots.txt generator, structured data/JSON-LD tools
- No external SEO SDK dependencies

## Platform Requirements

**Development:**
- Node.js 18+
- Bun 1.1.0
- TypeScript 5.3+

**Web Production:**
- Next.js deployment target (Vercel-ready)
- Requires: `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_POSTHOG_KEY` (optional)

**Mobile Production:**
- Expo managed service
- Requires: `EXPO_PUBLIC_POSTHOG_KEY` (optional)

---

*Stack analysis: 2026-01-26*
