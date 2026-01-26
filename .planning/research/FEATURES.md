# Feature Landscape: EdTech Quiz App UI/UX Patterns

**Domain:** EdTech mobile quiz app (Duolingo-style Swedish test prep)
**Researched:** 2026-01-26
**Confidence:** MEDIUM-HIGH (verified against multiple sources, Duolingo patterns well-documented)

---

## Table Stakes

Features users expect from a polished edtech quiz app. Missing = product feels amateur or incomplete.

| Feature | Why Expected | Complexity | Implementation Notes |
|---------|--------------|------------|---------------------|
| Immediate answer feedback | Users need instant confirmation that input was registered | Low | Green/red color + sound within 100ms of selection |
| Progress indicator | Users need to know how far through a session they are | Low | Horizontal progress bar, animate fill on correct answers |
| Correct/incorrect visual states | Clear visual distinction between answer outcomes | Low | Green (#58CC02) for correct, red/coral (#FF4B4B) for incorrect |
| Touch responsiveness | Mobile-first means instant feedback on all interactions | Low | Button press states within 100ms, no perceived delay |
| Clear typography hierarchy | Educational content needs scannable text | Low | Already using Nunito ExtraBold for headings in theme.ts |
| Exit/close confirmation | Prevent accidental progress loss | Low | Modal asking "Are you sure?" when leaving mid-quiz |
| Loading states | Users need feedback when content is fetching | Low | Skeleton screens or spinner, never blank screens |

## Differentiators

Features that set the app apart. Not expected, but create the "polish" that drives engagement and retention.

### Quiz Flow Micro-interactions

| Feature | Value Proposition | Complexity | Timing/Specs |
|---------|-------------------|------------|--------------|
| **Answer selection animation** | Makes interaction feel tactile and responsive | Medium | Scale to 0.95 on press (100ms), bounce back (200ms spring) |
| **Correct answer celebration** | Dopamine hit reinforces learning behavior | Medium | Green glow + checkmark scale-in (200ms) + optional confetti |
| **Wrong answer shake** | Clear error feedback without harsh punishment | Medium | Horizontal shake (3 cycles, 50ms each, 6px amplitude) |
| **Progress bar pulse** | Intensifies engagement, shows momentum | Medium | Pulse glow on correct, use existing primary color |
| **Character reactions** | Emotional connection increases retention | High | Implement with Rive/Lottie for Max AI coach reactions |
| **Streak counter animation** | Celebrates consecutive correct answers | Medium | Pop-in animation (300ms spring) at 3, 5, 10 correct in a row |

### Lesson Completion Celebration

| Feature | Value Proposition | Complexity | Timing/Specs |
|---------|-------------------|------------|--------------|
| **Confetti burst** | Marks achievement, triggers joy | Medium | 2-3 second burst, fade out, use brand colors (gold, coral) |
| **XP earned animation** | Makes progress tangible and rewarding | Medium | Count-up animation (500ms), slight overshoot then settle |
| **Stats summary card** | Gives sense of accomplishment and progress | Low | Accuracy %, time taken, XP earned, streak maintained |
| **Character celebration** | Emotional reward from AI coach | High | Max coach with "Great job!" message, personality-appropriate |
| **"Continue" vs "Review mistakes"** | Respects user agency | Low | Primary CTA for continue, secondary for review |

### Onboarding Excellence

| Feature | Value Proposition | Complexity | Timing/Specs |
|---------|-------------------|------------|--------------|
| **Delayed registration** | Removes friction, lets value speak first | Medium | Allow full baseline test before account creation |
| **Progress bar in onboarding** | Reduces abandonment by showing end in sight | Low | Show "Step X of 8" or visual progress dots |
| **Personalization questions** | Creates investment and relevance | Low | Goal selection, experience level, study time preference |
| **"Play first" pattern** | Duolingo's signature - experience before commitment | High | Full quiz flow accessible without account |
| **Coach introduction** | Establishes AI companion relationship early | Medium | Max appears with personality style selection |

### Gamification System

| Feature | Value Proposition | Complexity | Timing/Specs |
|---------|-------------------|------------|--------------|
| **Daily streak** | 3.6x higher long-term engagement (Duolingo data) | Medium | Visual flame icon, number counter, streak freeze option |
| **XP system** | Makes progress tangible across sessions | Low | Points per correct answer, bonus for perfect rounds |
| **Level/rank display** | Shows long-term progression | Low | Circular progress ring showing XP to next level |
| **Achievement badges** | Milestone recognition (30% higher course completion) | Medium | Unlock animations, badge gallery in profile |
| **Streak widget** | 60% increased commitment (Duolingo iOS data) | High | iOS/Android home screen widget showing streak |

---

## Animation Timing Reference

Based on Nielsen Norman Group research and industry patterns.

### Quick Reference Table

| Interaction Type | Duration | Notes |
|-----------------|----------|-------|
| Touch feedback (button press) | 100ms | Must feel instant |
| Toggle/checkbox | 100ms | Simple state change |
| Answer selection highlight | 100-150ms | Color change + scale |
| Correct/incorrect reveal | 200-300ms | Include icon animation |
| Modal entrance | 200-300ms | Ease-out curve |
| Modal exit | 200-250ms | Slightly faster than entrance |
| Progress bar fill | 300ms | Smooth ease-in-out |
| Page/screen transition | 300-400ms | Slide or fade |
| Confetti celebration | 2000-3000ms | Total duration with fade |
| XP count-up | 400-500ms | With slight overshoot |
| Shake animation | 150ms total | 3 cycles at 50ms each |

### Easing Functions

| Use Case | Recommended Easing |
|----------|-------------------|
| Element entering | ease-out (deceleration) |
| Element exiting | ease-in (acceleration) |
| State change | ease-in-out |
| Bounce/spring | spring(damping: 15, stiffness: 150) - already in theme.ts |
| Celebration | spring(damping: 10, stiffness: 200) for bouncier feel |

---

## Feedback Patterns: Correct vs Wrong Answers

### Correct Answer Flow

```
1. Selection (0-100ms)
   - Button scales to 0.95
   - Background shifts to light green tint

2. Confirmation (100-300ms)
   - Checkmark icon scales in (spring animation)
   - Button background fully green (#58CC02)
   - Optional: success sound chime

3. Celebration (300-600ms)
   - Progress bar animates forward with pulse
   - XP indicator briefly appears "+10 XP"
   - If streak milestone: streak counter pops

4. Transition (600-1000ms)
   - Auto-advance to next question (or manual tap)
   - Previous answer fades/slides out
```

### Wrong Answer Flow

```
1. Selection (0-100ms)
   - Button scales to 0.95
   - Background shifts to light red/coral tint

2. Error indication (100-300ms)
   - X icon fades in
   - Button background red/coral (#FF4B4B)
   - Shake animation (3 cycles, 50ms each)
   - Optional: soft error sound

3. Correction display (300-800ms)
   - Show correct answer highlighted in green
   - Brief explanation if applicable
   - "Got it" button to acknowledge

4. Transition (user-initiated)
   - User taps to continue
   - Track for "review mistakes" at end
```

### Visual Specifications

| State | Background | Border | Icon | Text Color |
|-------|------------|--------|------|------------|
| Unselected | white/card-background | 2px border (neutral-200) | none | text primary |
| Selected (pending) | primary-light | 2px primary | none | text primary |
| Correct | success-light (#D1FAE5) | 2px success (#58CC02) | checkmark (green) | text primary |
| Incorrect | error-light (#FFE5E5) | 2px error (#FF4B4B) | X mark (red) | text primary |
| Correct answer reveal | success-light | 2px success | checkmark | text primary |

---

## Onboarding Best Practices

### Duolingo's Proven Pattern (verified via UserGuiding analysis)

1. **Value-first approach**: Let users experience core value before asking for anything
2. **7-step mobile flow** with visible progress
3. **Personalization questions**: Motivation, experience level, goals
4. **Delayed registration**: Account creation only after demonstrating value
5. **Gamification from start**: Daily goals introduced during onboarding

### Recommended Maxa Onboarding Flow (8 screens)

| Screen | Purpose | Key Elements |
|--------|---------|--------------|
| 1. Welcome | Brand introduction | Logo, tagline, "Get Started" CTA |
| 2. Goal selection | Personalization + investment | "Why are you here?" multi-select |
| 3. Experience level | Content calibration | "Have you taken HP before?" |
| 4. Study commitment | Sets expectations | "How much time per day?" |
| 5. Coach introduction | Establish AI relationship | Meet Max, select personality style |
| 6. Baseline test intro | Explain value of assessment | "Let's see where you're starting" |
| 7. Baseline test | Core value demonstration | Actual quiz experience |
| 8. Account creation | Convert after value shown | Email/social sign-up, "Save your progress" |

### Critical Anti-Patterns to Avoid

| Anti-Pattern | Why Bad | Alternative |
|--------------|---------|-------------|
| Registration-first | 77% day-1 abandonment rate for apps | Delayed registration after value demo |
| Information overload | Cognitive overwhelm, abandonment | One concept per screen |
| Skippable onboarding | Misses personalization opportunity | Make it feel like part of the experience |
| Generic content | Feels impersonal, low investment | Ask questions, use answers |
| No progress indicator | User doesn't know when it ends | Always show progress bar/dots |

---

## Anti-Features

Features to explicitly NOT build. Common mistakes in edtech quiz apps.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Punitive lives system** | Frustrating for beginners (2x more likely to run out), discourages learning from mistakes | Energy system that recharges, or no limit for baseline features |
| **Forced registration first** | 77% day-1 abandonment for apps that do this | Delayed registration after baseline test |
| **Overly long sessions** | Cognitive fatigue reduces retention | Chunk into 5-10 question mini-lessons |
| **Dense text explanations** | Mobile users won't read paragraphs | Bullet points, visuals, progressive disclosure |
| **Harsh error sounds** | Creates anxiety, discourages experimentation | Soft, non-judgmental feedback tones |
| **Hidden progress** | Users feel lost, uncertain of progress | Always visible progress indicators |
| **Identical flows for all users** | Students, test-takers have different needs | User segmentation from onboarding |
| **Gamification without substance** | "Overjustification effect" - external rewards reduce intrinsic motivation | Ensure core learning is valuable independent of points/badges |
| **Too many notification prompts** | Notification fatigue, perceived as spam | Ask once, respect the answer |
| **Leaderboards without opt-out** | Can increase anxiety and burnout | Make competitive features optional |

---

## Feature Dependencies

```
Onboarding Flow
    |
    +-- Goal Selection --> Personalized content recommendations
    |
    +-- Baseline Test --> Initial skill assessment
           |
           +-- Account Creation --> Progress persistence
                  |
                  +-- Streak System --> Daily engagement
                  |
                  +-- XP System --> Long-term progression
                         |
                         +-- Badges/Achievements --> Milestone recognition
                         |
                         +-- Leaderboards (optional) --> Social engagement
```

### Phase-by-Phase Build Order

**Phase 1: Core Quiz Flow (MVP)**
- Answer selection with feedback (correct/wrong states)
- Progress bar
- Basic celebration on completion
- Stats summary screen

**Phase 2: Onboarding**
- 8-screen onboarding flow
- Coach introduction (Max)
- Delayed account creation
- Baseline test integration

**Phase 3: Gamification**
- Streak system
- XP tracking
- Level progression
- Basic achievements

**Phase 4: Polish & Delight**
- Confetti celebrations
- Character reactions (Rive animations)
- Home screen widget
- Advanced achievements

---

## MVP Recommendation

For initial polished UI, prioritize:

1. **Immediate answer feedback** (table stakes) - green/red states with timing
2. **Progress bar animation** (table stakes) - shows session progress
3. **Correct answer celebration** (differentiator) - checkmark + subtle confetti
4. **Wrong answer shake** (differentiator) - clear but not punishing
5. **Stats summary screen** (differentiator) - XP earned, accuracy, time

Defer to post-MVP:
- **Character reactions**: Requires Rive integration, high complexity
- **Streak widget**: Platform-specific, high complexity
- **Advanced achievements**: Needs backend support for tracking
- **Leaderboards**: Social features can increase anxiety if poorly implemented

---

## Sources

### Animation Timing
- [Nielsen Norman Group: Animation Duration](https://www.nngroup.com/articles/animation-duration/) - HIGH confidence
- [BricxLabs: Micro Animation Examples 2025](https://bricxlabs.com/blogs/micro-interactions-2025-examples) - MEDIUM confidence
- [Design Shack: Microinteractions in Mobile UX](https://designshack.net/articles/ux-design/microinteractions-mobile-ux/) - MEDIUM confidence

### Duolingo Patterns
- [UserGuiding: Duolingo Onboarding UX Breakdown](https://userguiding.com/blog/duolingo-onboarding-ux) - HIGH confidence
- [Orizon: Duolingo Gamification Secrets](https://www.orizon.co/blog/duolingos-gamification-secrets) - MEDIUM confidence
- [Duolingo Blog: Energy System](https://blog.duolingo.com/duolingo-energy/) - HIGH confidence (official)
- [Duolingo Blog: Shape Language Art Style](https://blog.duolingo.com/shape-language-duolingos-art-style/) - HIGH confidence (official)

### Onboarding & Engagement
- [Appcues: Gradual Engagement](https://www.appcues.com/blog/gradual-engagement-mobile-app-first-screen) - HIGH confidence
- [UserPilot: EdTech Onboarding Best Practices](https://userpilot.com/blog/customer-onboarding-in-edtech/) - MEDIUM confidence
- [UXCam: App Onboarding Guide 2025](https://uxcam.com/blog/10-apps-with-great-user-onboarding/) - MEDIUM confidence

### Gamification Psychology
- [Plotline: Streaks for Gamification](https://www.plotline.so/blog/streaks-for-gamification-in-mobile-apps) - MEDIUM confidence
- [BadgeOS: Psychology of Gamification](https://badgeos.org/the-psychology-of-gamification-and-learning-why-points-badges-motivate-users/) - MEDIUM confidence
- [Gamize: Streak Gamification & Surprise Rewards](https://gamize.com/trending/streak-gamification-surprise-rewards-user-retention/) - LOW confidence

### EdTech Anti-Patterns
- [Adam Fard: Educational App Design UX Challenges](https://adamfard.com/blog/educational-app-design) - MEDIUM confidence
- [DigitalDefynd: EdTech Startup Mistakes](https://digitaldefynd.com/IQ/edtech-startup-mistakes/) - LOW confidence

### Quiz UI Patterns
- [Mobbin: Mobile Quiz Design](https://mobbin.com/explore/mobile/screens/quiz) - HIGH confidence (real app screenshots)
- [UIHut: Quiz App Mobile UI Kit](https://uihut.com/designs/25770) - MEDIUM confidence
