# Phase 3: Main App Experience - Context

**Gathered:** 2026-01-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Polish all three tabs (Idag, Träna, Jag) with consistent design, connect to real Zustand state, add gamification (streaks, daily goals), and integrate Max coach with personality-based messages. The primary daily action must be obvious and always visible.

</domain>

<decisions>
## Implementation Decisions

### Tab Polish & Primary Action
- All three tabs get equal attention — unified polish pass
- Primary daily action must be super obvious and always visible
- Components need hardening for reliability and consistent styling
- User will provide screenshots of broken components for audit
- Claude audits existing components to identify what needs fixing

### Gamification (Streaks, XP, Daily Goals)
- Claude researches best practices from Duolingo, fitness apps, and similar engagement-focused apps
- Streak/XP prominence to be determined by research
- Focus on patterns that drive daily return visits

### Max Coach
- Appears on ALL tabs with contextual messages based on where user is
- Visual representation: Avatar/mascot image (character icon)
- Message tone: Research-driven, focusing on growth mindset for 16-25 year olds
- Message frequency: Claude decides based on engagement best practices

### Träna (Practice) Tab
- Multiple practice modes: by question type (ORD, LÄS, XYZ, KVA), by difficulty, and smart practice
- Smart practice prominence: Claude researches what works best
- Session length: Research best practices for keeping users engaged and feeling like they're winning
- Question type visual treatment: Claude decides, working with existing design system

### Claude's Discretion
- Primary action button design and placement (research-informed)
- Streak/XP display prominence and celebration patterns
- Max message frequency and trigger events
- Smart practice vs manual selection hierarchy
- Session length options
- Question type tile visual treatment
- Specific component fixes (after audit)

</decisions>

<specifics>
## Specific Ideas

- "Make it as much as possible" — maximize engagement patterns
- Growth mindset focus for target audience (16-25 year olds)
- "Feel like they're winning" — session design should create positive reinforcement
- Existing design system/business file should be referenced for visual decisions

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-main-app-experience*
*Context gathered: 2026-01-26*
