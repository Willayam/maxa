# Maxa Mobile App — Complete UI Flow

## What This Is

Maxa is "Duolingo for Högskoleprovet" — a mobile app that helps Swedish students (16-25) prepare for the national university admissions test. This milestone delivers a complete, polished UI flow with mock data that real users can test, establishing the foundation before backend integration.

## Core Value

Users can experience the full app flow — from onboarding through quiz practice — with an instant, native-feeling experience that makes test prep feel achievable.

## Requirements

### Validated

- ✓ Tab navigation (Idag, Träna, Jag) — existing
- ✓ Basic Idag dashboard layout — existing
- ✓ Design tokens and theme system — existing
- ✓ PostHog analytics integration — existing

### Active

**Design Audit & Polish:**
- [ ] Audit existing screens (Idag, Träna, Jag) for consistency
- [ ] Refine components to unified quality bar
- [ ] Add micro-interactions (button presses, card transitions)
- [ ] Add haptic feedback on key actions
- [ ] Implement loading states for rare network calls

**Onboarding Flow (8 screens):**
- [ ] Welcome screen (name input, persona picker: gymnasieelev/omtagare/förälder)
- [ ] Dream screen (program search, city picker)
- [ ] Score screen (target HP slider, shows required score)
- [ ] Date screen (exam date picker, countdown display)
- [ ] Time screen (daily commitment: 10/15/25 min options)
- [ ] Plan screen (path summary, baseline CTA)
- [ ] Baseline screen (10 mixed questions, timed)
- [ ] Results screen (current level vs goal, weakest section, account CTA)

**Account Creation:**
- [ ] Account creation after baseline (Apple/Google/Email)
- [ ] Delayed signup pattern (Duolingo-style)

**Main App Tabs:**
- [ ] Idag: Countdown, goal score, daily mission, streak chip, start practice button
- [ ] Träna: Mode selector (svagaste först, delprov-träning, simulera prov)
- [ ] Jag: Progress card, weakness tiles (röd/gul/grön), Max coach box

**Quiz Flow:**
- [ ] Question card with options and optional timer
- [ ] Answer feedback (correct/wrong with animations)
- [ ] Session summary with score and Max celebration
- [ ] Review errors screen with explanations

**Max Coach (Static):**
- [ ] Static personality-based messages (Hype/Lugn/Strikt styles)
- [ ] Coach style settings in Jag tab
- [ ] Trigger on: quiz completion, streaks, encouragement

**Mock Data:**
- [ ] ~10 mock HP questions (mix of verbal + quantitative)
- [ ] Question types: ORD, LÄS, XYZ, KVA (representative sample)
- [ ] Mock scoring and results calculation

### Out of Scope

- Real AI coach responses (Gemini/GPT) — Phase 4, requires backend
- RevenueCat/payments — Phase 5, requires subscription infrastructure
- Push notifications — Phase 4, requires backend triggers
- Real question extraction from PDFs — separate workstream
- Web app changes — mobile-first for this milestone
- Leaderboards/social features — post-v1

## Context

**Existing codebase:**
- Turborepo monorepo with Expo mobile app (apps/mobile/)
- Convex backend set up with tests/files/waitlist schema
- 197 HP PDFs uploaded to Convex storage
- PostHog analytics working on both platforms
- Some screens exist with mock data (tabs partially built)
- Design tokens established (Duolingo-inspired: bold typography, 2px borders, 3D buttons)

**Design approach:**
- Design-as-you-go in code (no Figma handoff)
- Some components are refined, others need work
- Audit existing first, then build new screens
- Screen-by-screen, component-by-component improvement

**Architecture decision:**
- Local-first — all quiz data stored on device
- App should feel instant, no loading spinners for content
- Convex only for live features (auth, sync, leaderboards later)
- Data is trivial in size (~10 questions for demo)

## Constraints

- **Platform**: Mobile only (Expo/React Native) — web is separate
- **Data**: Mock data only — real extraction is a parallel workstream
- **Auth**: UI only — actual auth integration is backend phase
- **AI**: Static messages only — no API calls for coach responses
- **Content**: ~10 questions sufficient for user testing demo

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Local-first architecture | Instant feel, no loading spinners, data is small | — Pending |
| Delayed signup (after baseline) | Reduce friction, Duolingo pattern proven | — Pending |
| Baseline = first mission | Simplify flow, one activation moment | — Pending |
| Design-as-you-go | No Figma, iterate faster in code | — Pending |
| Audit before build | Ensure new screens inherit polish | — Pending |
| ~10 mock questions | Sufficient for demo, keeps scope tight | — Pending |

---
*Last updated: 2026-01-26 after initialization*
