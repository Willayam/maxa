# Monorepo Web/Mobile Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the current Expo Router app into a Turborepo monorepo with independent mobile (Expo) and web (Next.js) apps that share UI components and design tokens.

**Architecture:** Two independent apps (`apps/mobile` and `apps/web`) sharing code through `packages/shared`. The mobile app uses Expo Router for native navigation. The web app uses Next.js App Router for SEO-optimized marketing pages. Shared UI components use React Native primitives that work on both platforms via `react-native-web`.

**Tech Stack:**
- Turborepo for monorepo orchestration
- Expo SDK 54 + Expo Router for mobile
- Next.js 14 + App Router for web
- TypeScript throughout
- Shared: React Native components compatible with react-native-web

---

## Phase 1: Monorepo Foundation

### Task 1: Initialize Turborepo Structure

**Files:**
- Create: `turbo.json`
- Create: `package.json` (root workspace)
- Create: `apps/.gitkeep`
- Create: `packages/.gitkeep`

**Step 1: Create root turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    }
  }
}
```

**Step 2: Create root package.json**

```json
{
  "name": "maxa",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo dev",
    "dev:mobile": "turbo dev --filter=@maxa/mobile",
    "dev:web": "turbo dev --filter=@maxa/web",
    "build": "turbo build",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck"
  },
  "devDependencies": {
    "turbo": "^2.3.0"
  },
  "packageManager": "bun@1.1.0"
}
```

**Step 3: Create directory structure**

Run: `mkdir -p apps packages`

**Step 4: Commit**

```bash
git add turbo.json package.json apps packages
git commit -m "chore: initialize turborepo monorepo structure"
```

---

### Task 2: Create Shared Package

**Files:**
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/shared/src/index.ts`

**Step 1: Create packages/shared/package.json**

```json
{
  "name": "@maxa/shared",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./theme": "./src/constants/theme.ts",
    "./components": "./src/components/index.ts",
    "./hooks": "./src/hooks/index.ts",
    "./utils": "./src/utils/index.ts"
  },
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint src/"
  },
  "peerDependencies": {
    "react": ">=18",
    "react-native": ">=0.72"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "typescript": "^5.3.0"
  }
}
```

**Step 2: Create packages/shared/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "jsx": "react-jsx",
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 3: Create packages/shared/src/index.ts**

```typescript
// Re-export all shared modules
export * from './constants/theme';
export * from './components';
export * from './hooks';
export * from './utils';
```

**Step 4: Commit**

```bash
git add packages/shared/
git commit -m "chore: add shared package skeleton"
```

---

### Task 3: Move Theme Constants to Shared

**Files:**
- Move: `constants/theme.ts` → `packages/shared/src/constants/theme.ts`
- Create: `packages/shared/src/constants/index.ts`

**Step 1: Copy theme.ts to shared package**

Run: `cp constants/theme.ts packages/shared/src/constants/theme.ts`

**Step 2: Create constants index**

Create `packages/shared/src/constants/index.ts`:

```typescript
export * from './theme';
```

**Step 3: Verify file exists**

Run: `ls packages/shared/src/constants/`
Expected: `index.ts  theme.ts`

**Step 4: Commit**

```bash
git add packages/shared/src/constants/
git commit -m "feat(shared): move theme constants to shared package"
```

---

### Task 4: Move Shared Hooks

**Files:**
- Copy: `hooks/use-color-scheme.ts` → `packages/shared/src/hooks/use-color-scheme.ts`
- Create: `packages/shared/src/hooks/index.ts`

**Step 1: Create hooks directory and copy file**

Run: `mkdir -p packages/shared/src/hooks && cp hooks/use-color-scheme.ts packages/shared/src/hooks/`

**Step 2: Create hooks index**

Create `packages/shared/src/hooks/index.ts`:

```typescript
export { useColorScheme } from './use-color-scheme';
```

**Step 3: Commit**

```bash
git add packages/shared/src/hooks/
git commit -m "feat(shared): move useColorScheme hook to shared package"
```

---

### Task 5: Move Haptics Utility

**Files:**
- Copy: `utils/haptics.ts` → `packages/shared/src/utils/haptics.ts`
- Create: `packages/shared/src/utils/index.ts`

**Step 1: Create utils directory and copy file**

Run: `mkdir -p packages/shared/src/utils && cp utils/haptics.ts packages/shared/src/utils/`

**Step 2: Create utils index**

Create `packages/shared/src/utils/index.ts`:

```typescript
export * from './haptics';
```

**Step 3: Commit**

```bash
git add packages/shared/src/utils/
git commit -m "feat(shared): move haptics utility to shared package"
```

---

## Phase 2: Shared UI Components

### Task 6: Create Shared Components Structure

**Files:**
- Create: `packages/shared/src/components/index.ts`
- Create: `packages/shared/src/components/ui/index.ts`

**Step 1: Create component directories**

Run: `mkdir -p packages/shared/src/components/ui`

**Step 2: Create packages/shared/src/components/ui/index.ts**

```typescript
export { Button } from './button';
export { Card } from './card';
export { Text } from './text';
export { Chip } from './chip';
export { ProgressBar } from './progress-bar';
export { StatBadge } from './stat-badge';
```

**Step 3: Create packages/shared/src/components/index.ts**

```typescript
export * from './ui';
```

**Step 4: Commit**

```bash
git add packages/shared/src/components/
git commit -m "chore(shared): create components structure"
```

---

### Task 7: Move Button Component

**Files:**
- Copy: `components/ui/button.tsx` → `packages/shared/src/components/ui/button.tsx`
- Modify: `packages/shared/src/components/ui/button.tsx` (update imports)

**Step 1: Copy button component**

Run: `cp components/ui/button.tsx packages/shared/src/components/ui/button.tsx`

**Step 2: Update imports in button.tsx**

Replace the import section at the top of `packages/shared/src/components/ui/button.tsx`:

```typescript
import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import {
  Colors,
  BorderRadius,
  Spacing,
  FontFamily,
  FontSize,
  ButtonDepth,
  Primitives,
} from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { triggerImpact } from '../../utils/haptics';
```

**Step 3: Commit**

```bash
git add packages/shared/src/components/ui/button.tsx
git commit -m "feat(shared): move Button component to shared package"
```

---

### Task 8: Move Card Component

**Files:**
- Copy: `components/ui/card.tsx` → `packages/shared/src/components/ui/card.tsx`
- Modify: Update imports

**Step 1: Copy card component**

Run: `cp components/ui/card.tsx packages/shared/src/components/ui/card.tsx`

**Step 2: Update imports in card.tsx**

Replace the import section in `packages/shared/src/components/ui/card.tsx`:

```typescript
import React from "react";
import {
  View,
  ViewProps,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Pressable,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { Colors, BorderRadius, Spacing } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { triggerImpact } from "../../utils/haptics";
```

**Step 3: Commit**

```bash
git add packages/shared/src/components/ui/card.tsx
git commit -m "feat(shared): move Card component to shared package"
```

---

### Task 9: Move Remaining UI Components

**Files:**
- Copy: `components/ui/text.tsx` → `packages/shared/src/components/ui/text.tsx`
- Copy: `components/ui/chip.tsx` → `packages/shared/src/components/ui/chip.tsx`
- Copy: `components/ui/progress-bar.tsx` → `packages/shared/src/components/ui/progress-bar.tsx`
- Copy: `components/ui/stat-badge.tsx` → `packages/shared/src/components/ui/stat-badge.tsx`

**Step 1: Copy all remaining UI components**

Run:
```bash
cp components/ui/text.tsx packages/shared/src/components/ui/
cp components/ui/chip.tsx packages/shared/src/components/ui/
cp components/ui/progress-bar.tsx packages/shared/src/components/ui/
cp components/ui/stat-badge.tsx packages/shared/src/components/ui/
```

**Step 2: Update imports in each file**

For each file, replace `@/constants/theme` with `../../constants/theme` and `@/hooks/use-color-scheme` with `../../hooks/use-color-scheme`.

**Step 3: Commit**

```bash
git add packages/shared/src/components/ui/
git commit -m "feat(shared): move Text, Chip, ProgressBar, StatBadge to shared package"
```

---

### Task 10: Add Shared Package Dependencies

**Files:**
- Modify: `packages/shared/package.json`

**Step 1: Update dependencies**

Add to `packages/shared/package.json`:

```json
{
  "name": "@maxa/shared",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./theme": "./src/constants/theme.ts",
    "./components": "./src/components/index.ts",
    "./hooks": "./src/hooks/index.ts",
    "./utils": "./src/utils/index.ts"
  },
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint src/"
  },
  "dependencies": {
    "react-native-reanimated": "~4.1.1"
  },
  "peerDependencies": {
    "react": ">=18",
    "react-native": ">=0.72",
    "expo-haptics": ">=14.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "typescript": "^5.3.0"
  }
}
```

**Step 2: Commit**

```bash
git add packages/shared/package.json
git commit -m "chore(shared): add component dependencies"
```

---

## Phase 3: Mobile App Setup

### Task 11: Create Mobile App Directory

**Files:**
- Create: `apps/mobile/` (move existing Expo app here)

**Step 1: Create mobile app directory**

Run: `mkdir -p apps/mobile`

**Step 2: Move Expo app files**

Run:
```bash
mv app apps/mobile/
mv app.json apps/mobile/
mv babel.config.js apps/mobile/
mv metro.config.js apps/mobile/
mv tsconfig.json apps/mobile/
mv assets apps/mobile/
mv components apps/mobile/
mv constants apps/mobile/
mv hooks apps/mobile/
mv utils apps/mobile/
mv scripts apps/mobile/
mv expo-env.d.ts apps/mobile/
mv nativewind-env.d.ts apps/mobile/
mv global.css apps/mobile/
mv tailwind.config.js apps/mobile/
```

**Step 3: Commit**

```bash
git add -A
git commit -m "refactor: move Expo app to apps/mobile"
```

---

### Task 12: Create Mobile Package.json

**Files:**
- Create: `apps/mobile/package.json`

**Step 1: Create apps/mobile/package.json**

```json
{
  "name": "@maxa/mobile",
  "version": "1.0.0",
  "private": true,
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "dev": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "lint": "expo lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@expo-google-fonts/nunito": "^0.4.2",
    "@expo/vector-icons": "^15.0.3",
    "@maxa/shared": "workspace:*",
    "@react-navigation/bottom-tabs": "^7.4.0",
    "@react-navigation/elements": "^2.6.3",
    "@react-navigation/native": "^7.1.8",
    "expo": "~54.0.31",
    "expo-constants": "~18.0.13",
    "expo-font": "~14.0.11",
    "expo-haptics": "~15.0.8",
    "expo-image": "~3.0.11",
    "expo-linking": "~8.0.11",
    "expo-router": "~6.0.22",
    "expo-splash-screen": "^31.0.13",
    "expo-status-bar": "~3.0.9",
    "expo-symbols": "~1.0.8",
    "expo-system-ui": "~6.0.9",
    "expo-web-browser": "~15.0.10",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.81.5",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-reanimated": "~4.1.1",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-worklets": "0.5.1"
  },
  "devDependencies": {
    "@types/react": "~19.1.0",
    "typescript": "~5.9.2",
    "eslint": "^9.25.0",
    "eslint-config-expo": "~10.0.0"
  }
}
```

**Step 2: Commit**

```bash
git add apps/mobile/package.json
git commit -m "chore(mobile): create mobile app package.json"
```

---

### Task 13: Update Mobile App Imports

**Files:**
- Modify: `apps/mobile/app/_layout.tsx`
- Modify: `apps/mobile/app/(tabs)/*.tsx`

**Step 1: Update _layout.tsx imports**

In `apps/mobile/app/_layout.tsx`, update the import:

```typescript
import { useColorScheme } from '@maxa/shared/hooks';
```

**Step 2: Update tab screen imports**

In each file under `apps/mobile/app/(tabs)/`, update imports to use:

```typescript
import { Colors, Spacing, Typography } from '@maxa/shared/theme';
import { Button, Card, Text, Chip, ProgressBar, StatBadge } from '@maxa/shared/components';
import { useColorScheme } from '@maxa/shared/hooks';
import { triggerImpact } from '@maxa/shared/utils';
```

**Step 3: Commit**

```bash
git add apps/mobile/
git commit -m "refactor(mobile): update imports to use shared package"
```

---

### Task 14: Remove Web Routes from Mobile

**Files:**
- Delete: `apps/mobile/app/(site)/` directory

**Step 1: Remove site directory**

Run: `rm -rf apps/mobile/app/\(site\)/`

**Step 2: Update _layout.tsx to remove site route**

In `apps/mobile/app/_layout.tsx`, remove the unstable_settings and (site) Stack.Screen:

```typescript
// Remove this line:
// export const unstable_settings = { anchor: Platform.OS === 'web' ? '(site)' : '(tabs)' };

// Remove this Stack.Screen:
// <Stack.Screen name="(site)" />
```

**Step 3: Commit**

```bash
git add -A
git commit -m "refactor(mobile): remove web-only routes from mobile app"
```

---

### Task 15: Update Mobile tsconfig.json

**Files:**
- Modify: `apps/mobile/tsconfig.json`

**Step 1: Update tsconfig for workspace**

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"],
      "@maxa/shared": ["../../packages/shared/src"],
      "@maxa/shared/*": ["../../packages/shared/src/*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts",
    "nativewind-env.d.ts"
  ]
}
```

**Step 2: Commit**

```bash
git add apps/mobile/tsconfig.json
git commit -m "chore(mobile): update tsconfig for monorepo paths"
```

---

## Phase 4: Web App Setup

### Task 16: Create Next.js Web App

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/next.config.js`
- Create: `apps/web/tsconfig.json`

**Step 1: Create web app directory**

Run: `mkdir -p apps/web`

**Step 2: Create apps/web/package.json**

```json
{
  "name": "@maxa/web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@maxa/shared": "workspace:*",
    "next": "^14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-native-web": "~0.19.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0"
  }
}
```

**Step 3: Create apps/web/next.config.js**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@maxa/shared', 'react-native-web', 'react-native-reanimated'],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    };
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];
    return config;
  },
};

module.exports = nextConfig;
```

**Step 4: Create apps/web/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"],
      "@maxa/shared": ["../../packages/shared/src"],
      "@maxa/shared/*": ["../../packages/shared/src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Step 5: Commit**

```bash
git add apps/web/
git commit -m "chore(web): initialize Next.js app structure"
```

---

### Task 17: Create Web App Layout

**Files:**
- Create: `apps/web/src/app/layout.tsx`
- Create: `apps/web/src/app/globals.css`

**Step 1: Create src/app directory**

Run: `mkdir -p apps/web/src/app`

**Step 2: Create apps/web/src/app/layout.tsx**

```tsx
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: 'Maxa - Högskoleprovet Prep',
  description: 'Plugga smart för Högskoleprovet med Maxa',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" className={nunito.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

**Step 3: Create apps/web/src/app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary: #FFC800;
  --color-primary-dark: #E5A400;
  --color-background: #F8F9FA;
  --color-text: #2C3E50;
  --color-text-muted: #6C7A89;
  --color-border: #E0E6EB;
}

body {
  font-family: var(--font-nunito), system-ui, sans-serif;
  background-color: var(--color-background);
  color: var(--color-text);
}
```

**Step 4: Commit**

```bash
git add apps/web/src/
git commit -m "feat(web): create root layout with Nunito font"
```

---

### Task 18: Create Web Tailwind Config

**Files:**
- Create: `apps/web/tailwind.config.ts`
- Create: `apps/web/postcss.config.js`

**Step 1: Create apps/web/tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/shared/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFC800',
          dark: '#E5A400',
          light: '#FFF8E1',
        },
        background: '#F8F9FA',
        'text-primary': '#2C3E50',
        'text-muted': '#6C7A89',
        border: '#E0E6EB',
        success: '#58CC02',
        warning: '#F59E0B',
        error: '#FF2B8F',
        streak: '#FF7A00',
      },
      fontFamily: {
        sans: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};

export default config;
```

**Step 2: Create apps/web/postcss.config.js**

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

**Step 3: Commit**

```bash
git add apps/web/tailwind.config.ts apps/web/postcss.config.js
git commit -m "chore(web): add Tailwind CSS configuration"
```

---

### Task 19: Migrate Web Home Page

**Files:**
- Create: `apps/web/src/app/page.tsx`
- Create: `apps/web/src/components/site/site-header.tsx`
- Create: `apps/web/src/components/site/site-footer.tsx`

**Step 1: Create page.tsx**

Create `apps/web/src/app/page.tsx`:

```tsx
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6 text-center">
          <h1 className="text-5xl font-extrabold text-text-primary mb-6">
            Plugga smart för Högskoleprovet
          </h1>
          <p className="text-xl text-text-muted mb-8 max-w-2xl mx-auto">
            Maxa hjälper dig att förbereda dig för Högskoleprovet med
            personlig träning, statistik och AI-coaching.
          </p>
          <a
            href="#"
            className="inline-block bg-primary text-text-primary font-bold uppercase px-8 py-4 rounded-2xl border-b-[6px] border-primary-dark hover:translate-y-[3px] hover:border-b-[3px] transition-all"
          >
            Ladda ner appen
          </a>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border-2 border-border">
              <h3 className="text-xl font-bold mb-2">Alla 8 delproven</h3>
              <p className="text-text-muted">
                Träna på ORD, LÄS, MEK, ELF, XYZ, KVA, NOG och DTK.
              </p>
            </div>
            <div className="p-6 rounded-2xl border-2 border-border">
              <h3 className="text-xl font-bold mb-2">Personlig statistik</h3>
              <p className="text-text-muted">
                Se din utveckling och identifiera förbättringsområden.
              </p>
            </div>
            <div className="p-6 rounded-2xl border-2 border-border">
              <h3 className="text-xl font-bold mb-2">AI-coach</h3>
              <p className="text-text-muted">
                Få personlig hjälp och förklaringar från din AI-coach.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
```

**Step 2: Create site-header.tsx**

Create `apps/web/src/components/site/site-header.tsx`:

```tsx
import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold text-primary">
          Maxa
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/hogskoleprovet/guide" className="text-text-muted hover:text-text-primary">
            Om provet
          </Link>
          <Link href="/hogskoleprovet/provdatum-2026" className="text-text-muted hover:text-text-primary">
            Provdatum
          </Link>
          <Link href="/hogskoleprovet/poang-antagning" className="text-text-muted hover:text-text-primary">
            Poäng & antagning
          </Link>
        </nav>
        <a
          href="#"
          className="bg-primary text-text-primary font-bold uppercase text-sm px-4 py-2 rounded-xl border-b-[4px] border-primary-dark"
        >
          Ladda ner
        </a>
      </div>
    </header>
  );
}
```

**Step 3: Create site-footer.tsx**

Create `apps/web/src/components/site/site-footer.tsx`:

```tsx
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="bg-white border-t border-border py-12 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-extrabold text-primary mb-4">Maxa</h3>
          <p className="text-text-muted text-sm">
            Plugga smart för Högskoleprovet.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Högskoleprovet</h4>
          <ul className="space-y-2 text-sm text-text-muted">
            <li><Link href="/hogskoleprovet/guide">Guide</Link></li>
            <li><Link href="/hogskoleprovet/provdatum-2026">Provdatum 2026</Link></li>
            <li><Link href="/hogskoleprovet/poang-antagning">Poäng & antagning</Link></li>
            <li><Link href="/hogskoleprovet/ovningsprov">Övningsprov</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Appen</h4>
          <ul className="space-y-2 text-sm text-text-muted">
            <li><a href="#">Ladda ner</a></li>
            <li><a href="#">Funktioner</a></li>
            <li><a href="#">Priser</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Företaget</h4>
          <ul className="space-y-2 text-sm text-text-muted">
            <li><a href="#">Om oss</a></li>
            <li><a href="#">Kontakt</a></li>
            <li><a href="#">Integritetspolicy</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-border text-center text-sm text-text-muted">
        © 2026 Maxa. Alla rättigheter förbehållna.
      </div>
    </footer>
  );
}
```

**Step 4: Create components directory**

Run: `mkdir -p apps/web/src/components/site`

**Step 5: Commit**

```bash
git add apps/web/src/
git commit -m "feat(web): create home page with header and footer"
```

---

### Task 20: Create Högskoleprovet Guide Pages

**Files:**
- Create: `apps/web/src/app/hogskoleprovet/guide/page.tsx`
- Create: `apps/web/src/app/hogskoleprovet/provdatum-2026/page.tsx`
- Create: `apps/web/src/app/hogskoleprovet/poang-antagning/page.tsx`
- Create: `apps/web/src/app/hogskoleprovet/ovningsprov/page.tsx`

**Step 1: Create directory structure**

Run: `mkdir -p apps/web/src/app/hogskoleprovet/{guide,provdatum-2026,poang-antagning,ovningsprov}`

**Step 2: Create guide/page.tsx**

```tsx
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';

export const metadata = {
  title: 'Högskoleprovet Guide - Maxa',
  description: 'Allt du behöver veta om Högskoleprovet',
};

export default function GuidePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-8">Guide till Högskoleprovet</h1>
          {/* Content migrated from apps/mobile/app/(site)/hogskoleprovet/guide.web.tsx */}
          <p className="text-text-muted">Guide content here...</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
```

**Step 3: Create similar pages for provdatum-2026, poang-antagning, ovningsprov**

Follow the same pattern for each page.

**Step 4: Commit**

```bash
git add apps/web/src/app/hogskoleprovet/
git commit -m "feat(web): create Högskoleprovet guide pages"
```

---

## Phase 5: Cleanup and Verification

### Task 21: Delete Old Root Files

**Files:**
- Delete: Root `package.json` dependencies (keep only workspace config)
- Delete: Root config files that moved to apps/mobile

**Step 1: Clean up root**

The root package.json should only contain workspace config (from Task 1).

Delete files that are now in apps/mobile:
- `babel.config.js` (if exists at root)
- `metro.config.js` (if exists at root)
- `tailwind.config.js` (if exists at root)

**Step 2: Commit**

```bash
git add -A
git commit -m "chore: clean up root directory after migration"
```

---

### Task 22: Install Dependencies

**Step 1: Install root dependencies**

Run: `bun install`

**Step 2: Verify installation**

Run: `bun run typecheck`
Expected: No errors

**Step 3: Commit lockfile**

```bash
git add bun.lockb
git commit -m "chore: update lockfile after monorepo migration"
```

---

### Task 23: Test Mobile App

**Step 1: Start mobile dev server**

Run: `bun run dev:mobile`
Expected: Expo dev server starts successfully

**Step 2: Test on iOS simulator**

Run: Press `i` in Expo CLI
Expected: App loads on iOS simulator with all tabs working

**Step 3: Verify shared imports**

Confirm that components from `@maxa/shared` render correctly.

---

### Task 24: Test Web App

**Step 1: Start web dev server**

Run: `bun run dev:web`
Expected: Next.js dev server starts on http://localhost:3000

**Step 2: Test home page**

Open: http://localhost:3000
Expected: Home page renders with header, hero section, features, footer

**Step 3: Test guide pages**

Navigate to `/hogskoleprovet/guide`
Expected: Guide page renders correctly

---

### Task 25: Final Commit

**Step 1: Verify all changes**

Run: `git status`
Ensure all files are committed.

**Step 2: Create final commit**

```bash
git add -A
git commit -m "feat: complete monorepo migration - web and mobile separated

- Created Turborepo monorepo structure
- Moved Expo app to apps/mobile (native only)
- Created Next.js app in apps/web (marketing site)
- Shared UI components in packages/shared
- Removed unstable_settings platform hack
- Each app now builds and deploys independently"
```

---

## Verification Checklist

After completing all tasks, verify:

- [ ] `bun install` succeeds at root
- [ ] `bun run dev:mobile` starts Expo without errors
- [ ] `bun run dev:web` starts Next.js without errors
- [ ] Mobile app renders all 3 tabs (Idag, Träna, Jag)
- [ ] Web app renders home page and guide pages
- [ ] No `Platform.OS` checks in shared components (haptics uses try/catch)
- [ ] No `unstable_settings` in any _layout.tsx
- [ ] TypeScript passes: `bun run typecheck`

---

## File Summary

### Created
- `turbo.json`
- `apps/mobile/` (moved from root)
- `apps/web/` (new Next.js app)
- `packages/shared/` (extracted components)

### Deleted
- `app/(site)/` from mobile app
- `unstable_settings` platform hack

### Modified
- Root `package.json` (workspace config only)
- `apps/mobile/tsconfig.json` (monorepo paths)
- All component imports (use `@maxa/shared`)
