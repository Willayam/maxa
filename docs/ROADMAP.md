# Maxa Product Roadmap

## Vision
Maxa är Duolingo för Högskoleprovet - den snabbaste, roligaste vägen att nå ditt drömresultat.

## Target User
- Swedish students (16-25) preparing for Högskoleprovet
- Goal: Get into competitive university programs
- Motivation: Dream education in dream city

---

## Development Approach

**UI-First Strategy:**
1. Build all screens with mock data
2. Perfect the user experience and animations
3. Connect backend services once UI is solid

This allows faster iteration on UX without backend dependencies.

---

## User Flow Overview

```mermaid
flowchart LR
    A[App Launch] --> B{Has account?}
    B -->|No| C[Onboarding]
    C --> D[Baseline Test]
    D --> E[First Mission]
    E --> F[Create Account]
    F --> G[Main App]
    B -->|Yes| G
    G --> H[Quiz Flow]
    H --> G
    G --> I[Paywall - inline]
    N[Notifications] -.->|Re-engage| A
```

**Activation:** Set exam date + goal score → complete baseline → finish first mission → create account.

---

### Authentication Flow

Account creation delayed until after first mission (reduces friction).

```mermaid
flowchart TD
    A[App Launch] --> B{Has account?}
    B -->|No| C[Start Onboarding]
    B -->|Yes| D{Logged in?}
    D -->|No| E[Sign In]
    D -->|Yes| F[Dashboard]
    E --> F
    C --> G[Onboarding + Baseline + First Mission]
    G --> H[Create Account]
    H --> F
```

---

### Onboarding Flow

Goal: Get to activation fast. No fluff.

```mermaid
flowchart TD
    A["<b>1. Welcome</b><br/>• Name (optional)<br/>• Persona: Gymnasieelev / Omtagare / Förälder"]
    A --> B["<b>2. Dream</b><br/>• Program search<br/>• City picker"]
    B --> C["<b>3. Score</b><br/>• HP target slider<br/>• Shows required score for program"]
    C --> D["<b>4. Date</b><br/>• Exam date picker<br/>• '87 dagar kvar till HP'"]
    D --> E["<b>5. Time</b><br/>• Daily commitment<br/>• 10 / 15 / 25 min options"]
    E --> F["<b>6. Plan</b><br/>• Your path summary<br/>• CTA: 'Starta baseline-testet'"]
    F --> G["<b>7. Baseline</b><br/>• 10-20 mixed questions<br/>• Real timing, no paywall"]
    G --> H["<b>8. Results</b><br/>• Current level vs goal<br/>• Weakest section<br/>• CTA: 'Kör dagens pass nu'"]
    H --> I["<b>9. Account</b><br/>• Apple / Google / Email<br/>• After first mission complete"]
    I --> J[Dashboard]
```

**Removed from onboarding:**
- Meet Max / Choose coach style → moved to Jag tab
- Paywall → triggers on daily limit, not during onboarding

---

### Main App Navigation (3 Tabs)

```mermaid
flowchart LR
    A["<b>📅 Idag</b><br/>• Countdown till HP<br/>• Målscore → program<br/>• Dagens mål: ~25 frågor<br/>• 'Starta dagens pass'<br/>• Streak chip<br/>• Paywall when limit hit"]
    B["<b>📚 Träna</b><br/>• Svagaste först (default)<br/>• Delprov-träning<br/>• Simulera prov (Pro)"]
    C["<b>👤 Jag</b><br/>• Progress: HP vs Goal<br/>• Weakness tiles (röd/gul/grön)<br/>• AI Coach box<br/>• Coach style settings"]
```

---

### Quiz Flow

```mermaid
flowchart TD
    A["<b>Question Card</b><br/>• Question + options<br/>• Timer (optional)"]
    A --> B["<b>Answer Feedback</b><br/>• Correct: success animation<br/>• Wrong: explanation shown"]
    B --> C{More?}
    C -->|Yes| A
    C -->|No| D["<b>Session Summary</b><br/>• Score summary<br/>• Max celebration<br/>• Return to Idag"]
```

---

### Paywall Flow (Inline on Idag Tab)

Shown when daily limit (~25 questions) reached. One core offer.

```mermaid
flowchart LR
    A["<b>Limit Reached</b><br/>• Inline on Idag tab<br/>• 'Du har gjort dagens gratispass'"]
    A --> B["<b>Offer</b><br/>• Pro: 99 kr/mån<br/>• Founders Lifetime: 899 kr"]
    B --> C["<b>RevenueCat</b><br/>• Process payment<br/>• Unlock premium"]
```

---

### Social Flow (Post-v1)

Cut for v1 to focus on activation. Add once churn data shows where unlockables help.

```mermaid
flowchart LR
    A["<b>Post-v1 Features</b><br/>• Leaderboards<br/>• Friends<br/>• Badges beyond streak"]
```

---

### Notifications Flow

```mermaid
flowchart LR
    A["<b>Streak Reminder</b><br/>• 8 PM check<br/>• Push if not practiced"]
    B["<b>Milestone</b><br/>• Streak celebration<br/>• Progress notification"]
```

---

## Execution Phases

### Phase 1: UI Foundation
**Focus:** Build all screens with mock data, NativeWind styling

| Task | Description |
|------|-------------|
| NativeWind setup | Configure Tailwind for React Native |
| Base UI components | Button, Card, Input, ProgressBar, Slider |
| Onboarding screens | Welcome, Dream, Score, Date, Time, Plan, Baseline, Results |
| Tab navigation | Set up 3-tab layout (Idag, Träna, Jag) |
| Idag UI | Countdown, goal, daily mission, streak chip |
| Träna UI | Mode selector, quiz flow |
| Jag UI | Progress card, weakness tiles, coach box |
| Quiz UI | Question card, feedback, session summary |

### Phase 2: Animations & Polish
**Focus:** Make it feel premium and fast

| Task | Description |
|------|-------------|
| Micro-interactions | Button presses, card transitions |
| Quiz feedback | Correct/wrong animations |
| Max animations | Avatar expressions, celebration |
| Loading states | Skeletons, shimmer effects |
| Haptic feedback | Success/error vibrations |

### Phase 3: Backend Integration
**Focus:** Connect UI to real data

| Task | Description |
|------|-------------|
| Convex setup | Initialize, deploy schema |
| Clerk auth | Google, Apple, Email/Password |
| User flow | Real auth → onboarding → app |
| Data persistence | Questions, sessions, progress |
| Real-time updates | Streaks, leaderboard |

### Phase 4: AI & Engagement
**Focus:** Max coach and retention features

| Task | Description |
|------|-------------|
| Vercel AI SDK | Set up Gemini gateway |
| Max responses | Personality-based prompts |
| Push notifications | Expo Notifications setup |
| Daily challenges | Server-generated goals |

### Phase 5: Monetization
**Focus:** Revenue

| Task | Description |
|------|-------------|
| RevenueCat setup | Products, entitlements |
| Paywall screen | Connect to purchases |
| Referral system | Deep links, rewards |
| PostHog analytics | Funnel tracking |

---

## Screen Inventory

### Auth Flow (1 screen)
| Screen | File | Key Components |
|--------|------|----------------|
| Sign In | `(auth)/sign-in.tsx` | Apple/Google/Email (returning users) |

### Onboarding (8 screens)
| Screen | File | Key Components |
|--------|------|----------------|
| Welcome | `(onboarding)/welcome.tsx` | Name, persona picker |
| Dream | `(onboarding)/dream.tsx` | Program search, city picker |
| Score | `(onboarding)/score.tsx` | Target HP slider |
| Date | `(onboarding)/date.tsx` | Exam date, countdown |
| Time | `(onboarding)/time.tsx` | Daily commitment (10/15/25 min) |
| Plan | `(onboarding)/plan.tsx` | Your path summary, baseline CTA |
| Baseline | `(onboarding)/baseline.tsx` | 10-20 question test |
| Results | `(onboarding)/results.tsx` | Score, gap, first mission CTA |

### Main App (3 tabs + 2 screens)
| Screen | File | Key Components |
|--------|------|----------------|
| Idag | `(app)/(tabs)/index.tsx` | Countdown, goal, daily mission, streak |
| Träna | `(app)/(tabs)/trana.tsx` | Svagaste först, delprov, simulera |
| Jag | `(app)/(tabs)/jag.tsx` | Progress, weaknesses, AI coach |
| Quiz | `(app)/quiz/[id].tsx` | Questions, timer, feedback |
| Review | `(app)/review.tsx` | Wrong answers explanation |

**Total: 14 screens**

---

## Gamification System

### Streaks
| Milestone | Reward |
|-----------|--------|
| 7 days | Bronze flame badge |
| 30 days | Silver flame badge |
| 100 days | Gold flame badge |
| 365 days | Diamond flame badge |

---

## Max AI Coach

### Personalities (3 styles)

| Style | Swedish | Tone | Example Message |
|-------|---------|------|-----------------|
| Hype | Hype | Energetic, excited | "YEEEES! Du körde helt sjukt bra! Ingen kan stoppa dig nu!" |
| Calm | Lugn | Supportive, gentle | "Bra jobbat. Du gör framsteg varje dag. Fortsätt i din egen takt." |
| Strict | Strikt | Tough love, direct | "Okej resultat. Men du kan bättre. Kör en runda till." |

### Trigger Events
- Streak milestone reached
- Wrong answer (offer explanation)
- Inactivity (24h+)
- Daily challenge completed

### Rate Limits
- Free tier: 10 AI messages/day
- Premium: Unlimited

---

## Pricing

| Plan | Price | Features |
|------|-------|----------|
| Free | 0 kr | ~25 questions/day, 3 AI asks/day |
| Pro | 99 kr/mån | Unlimited questions, unlimited AI coach, full HP sim |
| Founders Lifetime | 899 kr | Forever access (limited offer) |

---

## Success Metrics

### North Star
**Weekly Active Users (WAU)** practicing 3+ days

### Key Metrics
| Metric | Target |
|--------|--------|
| D1 Retention | >40% |
| D7 Retention | >25% |
| D30 Retention | >15% |
| Free → Paid | >5% |
| Referral rate | >10% |
| Avg. streak | >7 days |

---

## HP Sections Reference

| Code | Name | Type |
|------|------|------|
| ORD | Ordförståelse | Verbal |
| LÄS | Läsförståelse | Verbal |
| MEK | Meningskomplettering | Verbal |
| ELF | Engelsk läsförståelse | Verbal |
| XYZ | Matematisk problemlösning | Kvantitativ |
| KVA | Kvantitativa jämförelser | Kvantitativ |
| NOG | Kvantitativa resonemang | Kvantitativ |
| DTK | Diagram, tabeller, kartor | Kvantitativ |
