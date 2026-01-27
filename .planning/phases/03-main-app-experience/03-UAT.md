---
status: testing
phase: 03-main-app-experience
source: 03-01-SUMMARY.md, 03-02-SUMMARY.md, 03-03-SUMMARY.md
started: 2026-01-26T21:30:00Z
updated: 2026-01-26T21:30:00Z
---

## Current Test

number: 3
name: Trana Tab Mode Selection
expected: |
  Go to Träna (Practice) tab. You should be able to:
  - Select a practice mode (Smart, Section, Mixed)
  - Tap the start button to navigate to quiz with selected mode
awaiting: fix in progress - invoking frontend-design skill

## Tests

### 1. Idag Tab Display
expected: Idag tab shows countdown to HP exam, goal score, daily mission progress (X/20 questions), and streak chip with current streak count
result: pass
note: Fixed after design iteration - top stats bar with 3 pills (XP/Streak/Goal), proper button shadow, tightened typography, improved week calendar

### 2. Idag Tab CTA Pulsing
expected: If daily goal is not yet complete, the main CTA button pulses subtly (1.02 scale animation). Button text shows "STARTA" (no progress), "FORTSÄTT" (mid-progress), or "MÅL UPPNÅTT" (goal complete)
result: pass

### 3. Trana Tab Mode Selection
expected: Go to Träna (Practice) tab. You can select a practice mode (Smart, Section, Mixed). Tapping the start button navigates to the quiz with the selected mode
result: issue
reported: "Multiple UI issues: 1) Visual hierarchy unclear - mode selectors look same as info card, 2) Swedish åäö characters not rendering (shows 'ova' instead of 'öva'), 3) Välj delprov section layout broken - verbal/kvantitativa tiles misaligned and truncated, 4) '4 delprov' tab text hard to read, 5) Checkmark off-brand, 6) PRO tag ugly/off-brand, 7) Button copy too long - should use icons not emoji, 8) 'Starta simulerat prov' button text truncates"
severity: major

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
passed: 2
issues: 1
pending: 7
skipped: 0

## Gaps

- truth: "Träna tab has clear visual hierarchy, proper Swedish character rendering, and polished UI components"
  status: failed
  reason: "User reported: Multiple UI issues - unclear visual hierarchy between selectors and info cards, Swedish åäö not rendering, layout broken on delprov section, hard to read tabs, off-brand checkmarks and PRO tag, button copy too long with emoji instead of icons, button text truncation"
  severity: major
  test: 3
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
