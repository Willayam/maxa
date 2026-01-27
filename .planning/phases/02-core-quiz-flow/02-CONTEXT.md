# Phase 2: Core Quiz Flow - Context

**Gathered:** 2026-01-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can complete a quiz session with satisfying visual and haptic feedback on every interaction. This phase connects the existing quiz screens to Zustand state, completes the animation set, and adds error review. Creating quizzes, selecting practice modes, and gamification systems are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Celebration Moments
- **Correct answer feel:** Medium intensity — checkmark animation, satisfying haptic, brief pause to savor (Duolingo-like)
- **XP display:** Research Duolingo's exact XP display behavior during lessons and match it
- **Streak visualization:** Integrated into progress bar (Duolingo-style) — color shifts from green → gold as streak builds, no flame effect (too intense)
- **Wrong answer feel:** Gentle — red highlight, soft shake, brief 'oops' to keep momentum. Research Duolingo's error handling but adapt to be gentler and more encouraging

### Core Quiz Experience
- **Question transition:** Research and match Duolingo's transition behavior (auto-advance vs tap-to-continue)
- **Timer approach:** Research Duolingo's timer approach — goal is to help users build speed awareness without being stressful
- **Question display:** Show category badge (ORD, LÄS, XYZ, KVA) with question
- **Answer options:** Stacked full-width, vertically arranged (mobile-friendly for HP's longer text options)
- **Option dimming after selection:** Claude's discretion — match Duolingo's pattern
- **Skip question:** Research Duolingo's approach, keep it simple
- **Exit during quiz:** Confirm modal — "Are you sure? Progress will be saved"
- **Category badge placement:** Top of question card OR inline with question number (Claude decides based on visual balance)

### Session Summary & Error Review
- **Summary structure:** Research Duolingo — typically celebration → XP → accuracy → time
- **Summary tone:** Very positive and encouraging, growth mindset messaging ("This means you now know better what to focus on")
- **Error review access:** Available from summary screen AND from home/training screens
- **Option to go directly into error review:** If user wants, they can jump straight to reviewing mistakes
- **Daily goal progress on summary:** Match Duolingo's approach
- **Summary animation:** Research and match Duolingo's celebration/stat animations

### Claude's Discretion
- Error review content depth (question + correct answer vs full explanation with reasoning)
- Whether to allow retrying just missed questions (research retention best practices)
- Exact timing of animations and transitions
- Progress bar glow/color implementation details
- Badge placement decision (top vs inline)

</decisions>

<specifics>
## Specific Ideas

- "I want it like Duolingo" — primary reference for quiz flow, celebrations, XP display, transitions, and summary
- Errors should be gentle and encouraging, not punishing — growth mindset throughout
- Progress bar color shifts green → gold with streak (but no flame effect — too intense)
- HP question types (ORD, LÄS, XYZ, KVA) should be visible during quiz as category badges

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-core-quiz-flow*
*Context gathered: 2026-01-26*
