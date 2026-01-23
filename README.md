# Maxa

Expo app with file-based routing. Uses **bun** as package manager.

## Quick Start

```bash
# Install dependencies
bun install

# Start dev server
bun start

# Platform-specific
bun run ios      # iOS simulator
bun run android  # Android emulator
bun run web      # Web browser
```

## Web (Next.js)

The web app lives in `apps/web`.

```bash
bun run dev --filter=@maxa/web
```

## Deploy (Vercel)

This repo is a monorepo, so deploy from the repo root. The `vercel.json` in the root
defines the install and build commands for the web app.

## Project Structure

```
app/           # Routes (file-based routing via expo-router)
  (tabs)/      # Tab navigation group
  _layout.tsx  # Root layout
components/    # Reusable UI components
constants/     # Theme, colors
hooks/         # Custom React hooks
assets/        # Images, fonts
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun start` | Start Expo dev server |
| `bun run ios` | Run on iOS simulator |
| `bun run android` | Run on Android emulator |
| `bun run web` | Run in web browser |
| `bun run lint` | Run ESLint |
| `bun run reset-project` | Reset to blank app directory |

## Tech Stack

- **Expo SDK 54** - React Native framework
- **expo-router** - File-based routing with typed routes
- **React 19** - UI library
- **React Native 0.81** - New Architecture enabled
- **TypeScript** - Type safety
- **bun** - Package manager

## Docs

- [Architecture](./docs/ARCHITECTURE.md) - Project architecture details
- [Expo docs](https://docs.expo.dev/)
- [expo-router docs](https://docs.expo.dev/router/introduction/)
