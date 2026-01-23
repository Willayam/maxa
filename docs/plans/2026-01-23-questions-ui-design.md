# Questions UI Design

## Overview

Add a quiz experience where users answer HP (Högskoleprovet) multiple-choice questions with Duolingo-style interaction patterns. Focus on UI first with mock data.

## Screen Flow

```
trana.tsx (existing)
    ↓ tap "Start" with section selected
app/quiz/index.tsx (NEW)
    ↓ complete 10 questions
app/quiz/summary.tsx (NEW)
    ↓ tap "Done" or "Review"
    → back to trana.tsx OR app/quiz/review.tsx (optional)
```

## Quiz Screen (`app/quiz/index.tsx`)

### Layout Structure

```
┌─────────────────────────────────────┐
│  [X]     ████████░░░░  [XYZ pill]   │  ← Header (fixed)
├─────────────────────────────────────┤
│                                     │
│  5.                                 │  ← Question number (bold)
│                                     │
│  ┌─────────────────────────────┐   │
│  │      [optional image]        │   │  ← Question image
│  └─────────────────────────────┘   │
│                                     │
│  Question text with **bold**        │  ← Question text
│  emphasis on key parts.             │
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │  A    Option text            │   │  ← Options (A, B, C, D)
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │  B    Option text            │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │  C    Option text            │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │  D    Option text            │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │         KONTROLLERA          │   │  ← Primary button
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Header Components

- **X button** (left): Exit quiz with confirmation modal
- **Progress bar** (center): Shows progress (e.g., 3/10 questions)
- **Section pill** (right): Shows section code (XYZ, DTK, etc.) with section color

### Option States

| State | Border | Background | Icon |
|-------|--------|------------|------|
| Default | 2px gray (#E0E6EB) | White | None |
| Selected | 2px yellow (#FFC800) | Light yellow (#FFF9E5) | None |
| Correct | 2px green (#4CAF50) | Light green (#E8F5E9) | ✓ checkmark |
| Incorrect | 2px red (#F44336) | Light red (#FFEBEE) | ✗ |

### Button States

1. **Disabled**: Gray, no 3D effect (until option selected)
2. **"Kontrollera"**: Yellow primary button (after selection)
3. **"Fortsätt"**: Yellow primary button (after feedback shown)

### Interaction Flow (Duolingo-style)

1. User reads question
2. User taps an option → option becomes "selected" state
3. User taps "Kontrollera" button
4. System reveals correct/incorrect:
   - **Correct**: Selected option turns green, medium haptic, button changes to "Fortsätt"
   - **Incorrect**: Selected option turns red, correct option turns green, heavy haptic, explanation card slides up
5. User taps "Fortsätt" → next question

## Explanation Card (Wrong Answers)

Slides up from bottom when user answers incorrectly:

```
┌─────────────────────────────────────┐
│  ╔═══════════════════════════════╗  │
│  ║  ❌ Inte riktigt               ║  │  ← Red accent header
│  ╠═══════════════════════════════╣  │
│  ║  Rätt svar: C                 ║  │  ← Correct answer
│  ║                               ║  │
│  ║  Explanation text describing  ║  │  ← Why it's correct
│  ║  why the correct answer is    ║  │
│  ║  right...                     ║  │
│  ╚═══════════════════════════════╝  │
│  ┌─────────────────────────────┐   │
│  │         FORTSÄTT             │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Styling:**
- Slides up with spring animation
- 2px border with red accent on top edge
- White background
- Takes up bottom ~40% of screen
- Scrollable if explanation is long

## Exit Confirmation Modal

When user taps X button:

```
┌─────────────────────────────────┐
│                                 │
│   Vill du avsluta?              │
│                                 │
│   Din progress sparas inte.     │
│                                 │
│   [Avsluta]  [Fortsätt öva]     │
│                                 │
└─────────────────────────────────┘
```

## Summary Screen (`app/quiz/summary.tsx`)

```
┌─────────────────────────────────────┐
│                                     │
│           🎯                        │  ← Icon based on score
│        Bra jobbat!                  │  ← Title varies by score
│                                     │
│  ┌─────────────────────────────┐   │
│  │      8 / 10 rätt            │   │  ← Big score
│  │         80%                  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  ⏱  Total tid      4:32     │   │
│  │  📊  Sektion        XYZ      │   │
│  ├─────────────────────────────┤   │
│  │  ⚡  Snitt/fråga    27 sek   │   │  ← Avg time per question
│  │      Mål: 45 sek    ✅ I fas │   │  ← Target + pace status
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │      GRANSKA FEL (2)         │   │  ← Only if errors
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │           KLAR               │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Title & Icon by Performance

| Score | Title | Icon |
|-------|-------|------|
| 90-100% | Fantastiskt! | 🌟 |
| 70-89% | Bra jobbat! | 🎯 |
| 50-69% | Fortsätt öva! | 💪 |
| <50% | Nästa gång! | 📚 |

### Time Pace Indicators

| Status | Condition | Color |
|--------|-----------|-------|
| ✅ I fas | avg ≤ target | Green |
| ⚠️ Lite långsam | avg 1-20% over target | Yellow |
| 🔴 Öva tempo | avg >20% over target | Red |

### Target Times per Section

Based on real HP timing (~22-24 questions in 50-55 min):
- Verbal sections (ORD, LÄS, MEK, ELF): ~2 min/question (120 sec)
- Quantitative sections (XYZ, KVA, NOG, DTK): ~2.5 min/question (150 sec)

Store as constants in a config file.

## Mock Data Structure

```typescript
interface Question {
  id: string;
  section: 'ORD' | 'LÄS' | 'MEK' | 'ELF' | 'XYZ' | 'KVA' | 'NOG' | 'DTK';
  number: number;
  text: string;
  image?: string; // optional image URI
  options: {
    label: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

interface QuizSession {
  section: string;
  questions: Question[];
  currentIndex: number;
  answers: {
    questionId: string;
    selected: string;
    correct: boolean;
    timeSpent: number; // seconds
  }[];
  startTime: number;
}
```

## New Files to Create

```
app/quiz/
  index.tsx          # Main quiz screen
  summary.tsx        # Results screen
  _layout.tsx        # Stack layout for quiz routes

components/quiz/
  QuestionCard.tsx   # Question display component
  OptionButton.tsx   # Individual option (A, B, C, D)
  ExplanationCard.tsx # Wrong answer explanation
  QuizHeader.tsx     # X button, progress, section pill
  ExitModal.tsx      # Confirmation modal

constants/
  questions.ts       # Mock questions data
  quiz-config.ts     # Target times, scoring thresholds
```

## Styling Guidelines

Follow existing app design system:
- **Font**: Nunito (all weights)
- **Primary color**: #FFC800 (yellow)
- **Borders**: 2px, no shadows
- **Border radius**: 20px (cards), 12px (buttons)
- **Button depth**: 6px 3D effect
- **Animations**: react-native-reanimated with spring (damping: 15, stiffness: 400)
- **Haptics**: Light (option tap), Medium (correct), Heavy (incorrect)
- **Section colors**: Use existing SectionColors from theme.ts

## Session Configuration

- **Questions per session**: Fixed 10 questions
- **Exit behavior**: X button with confirmation, progress lost if quit
- **Navigation**: Pass section code from trana.tsx to quiz screen
