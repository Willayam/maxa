---
status: testing
phase: 03-main-app-experience
source: 03-01-SUMMARY.md, 03-02-SUMMARY.md, 03-03-SUMMARY.md
started: 2026-01-26T21:30:00Z
updated: 2026-01-26T21:30:00Z
---

## Current Test

number: 1
name: Idag Tab Display
expected: |
  Open the app and go to the Idag (Today) tab. You should see:
  - Countdown to HP exam date
  - Goal score display
  - Daily mission progress (questions completed today / daily goal)
  - Streak chip showing current streak count
awaiting: user response

## Tests

### 1. Idag Tab Display
expected: Idag tab shows countdown to HP exam, goal score, daily mission progress (X/20 questions), and streak chip with current streak count
result: issue
reported: "Fire emoji pulsing too intensively, not balanced. Redundant info (both '20 questions left' AND '0/20'). Button text cut off, shadow not rounded, should use icon not emoji, text not centered. '69 Dagar kvar' spacing/fonts ugly. 1.8 goal too light barely visible. Screen cuts off above tab menu. Veckans framsteg section could be better. Max AI section lame needs real mascot vibes like Duolingo."
severity: major

### 2. Idag Tab CTA Pulsing
expected: If daily goal is not yet complete, the main CTA button pulses subtly (1.02 scale animation). Button text shows "STARTA" (no progress), "FORTSÄTT" (mid-progress), or "MÅL UPPNÅTT" (goal complete)
result: [pending]

### 3. Trana Tab Mode Selection
expected: Go to Träna (Practice) tab. You can select a practice mode (Smart, Section, Mixed). Tapping the start button navigates to the quiz with the selected mode
result: [pending]

### 4. Jag Tab Progress Display
expected: Go to Jag (Profile) tab. You should see a progress card showing: level badge next to username, XP progress bar, total questions answered, and accuracy percentage
result: [pending]

### 5. Jag Tab Weakness Tiles
expected: Jag tab shows weakness tiles (color-coded by performance) indicating which HP sections need more practice
result: [pending]

### 6. Max Coach Message Display
expected: Jag tab shows a Max coach message in an italicized speech-bubble style. The message changes based on your current state (streak, daily progress)
result: [pending]

### 7. Coach Personality Selection
expected: In Jag tab, you can select Max's personality (Hype/Lugn/Strikt). The selection persists when you close and reopen the app
result: [pending]

### 8. Personality Affects Messages
expected: After changing coach personality, Max's messages change tone. Hype = energetic ("Bra jobbat!"), Lugn = calm ("Ta det lugnt..."), Strikt = direct/demanding
result: [pending]

### 9. Streak Counter Tracking
expected: Complete a quiz session. Your streak counter increments if you haven't practiced today. The streak persists across app restarts
result: [pending]

### 10. Quiz Summary Coach Feedback
expected: After completing a quiz, the summary screen shows a Max coach feedback message that matches your selected personality
result: [pending]

## Summary

total: 10
passed: 0
issues: 1
pending: 9
skipped: 0

## Gaps

- truth: "Idag tab shows polished, balanced UI with countdown, goal, daily progress, and streak"
  status: failed
  reason: "User reported: Fire emoji pulsing too intensively. Redundant info display. Button issues (cut off, shadow, centering). Ugly countdown typography. Goal score too light. Screen cutoff. Veckans framsteg needs work. Max AI section needs real mascot vibes."
  severity: major
  test: 1
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
