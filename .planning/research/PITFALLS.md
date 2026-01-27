# Domain Pitfalls: React Native Quiz UI

**Domain:** React Native (Expo 54) quiz app with Duolingo-style polish
**Researched:** 2026-01-26
**Stack:** Expo 54, React Native 0.81.5, react-native-reanimated 4.1.1

---

## Critical Pitfalls

Mistakes that cause rewrites, major performance issues, or broken user experience.

---

### Pitfall 1: Reading Shared Values on the JS Thread

**What goes wrong:** Developers access `sharedValue.value` directly in React components or effects, causing the JS thread to block while waiting for the UI thread to sync the value. This creates visible lag and jank in animations.

**Why it happens:** Intuitive to read values directly; documentation requires careful reading to understand threading model.

**Consequences:**
- Animations stutter during state updates
- UI freezes during complex interactions
- Touch responsiveness degrades
- User perceives app as "laggy"

**Warning signs:**
- Using `sharedValue.value` outside of worklets
- Reading animated values in `useEffect` or component body
- Calling `console.log(sharedValue.value)` for debugging

**Prevention:**
```typescript
// BAD: Reading on JS thread
useEffect(() => {
  if (progress.value > 0.5) { // Blocks JS thread!
    doSomething();
  }
}, []);

// GOOD: Use useAnimatedReaction for cross-thread communication
useAnimatedReaction(
  () => progress.value,
  (currentValue) => {
    if (currentValue > 0.5) {
      runOnJS(doSomething)();
    }
  }
);
```

**Phase relevance:** Any phase with animations (quiz flow, progress bars, transitions)

**Confidence:** HIGH (Context7 + official Reanimated docs)

---

### Pitfall 2: Animating Layout-Affecting Properties

**What goes wrong:** Developers animate `width`, `height`, `top`, `left`, `padding`, or `margin` instead of `transform` and `opacity`. Each frame triggers expensive layout recalculation.

**Why it happens:** CSS muscle memory; layout properties feel more intuitive than transforms.

**Consequences:**
- Dropped frames during animations
- Visible jank, especially on Android
- Battery drain from constant layout recalculation
- Poor experience on lower-end devices

**Warning signs:**
- `useAnimatedStyle` returning `width`, `height`, `top`, `left`
- Progress bars animating width instead of scaleX
- Slide-in animations using `left` instead of `translateX`

**Prevention:**
```typescript
// BAD: Animates layout
const animatedStyle = useAnimatedStyle(() => ({
  width: progress.value * 200, // Triggers layout every frame
}));

// GOOD: Animates transform (GPU-accelerated)
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scaleX: progress.value }],
}));
```

**Phase relevance:** Progress bars, quiz transitions, feedback animations

**Confidence:** HIGH (official Reanimated performance docs)

---

### Pitfall 3: Forcing Early Registration in Onboarding

**What goes wrong:** Requiring users to create an account before experiencing any app value. 74% of users abandon apps that force registration upfront.

**Why it happens:** Developers want user data early; business pressure for signups.

**Consequences:**
- Massive drop-off at onboarding
- Only 20-25% Day 1 retention (industry average)
- Users never experience the product's value
- Negative app store reviews

**Warning signs:**
- First screen is login/signup
- No "skip" option for account creation
- Core features locked behind authentication
- Asking for email before showing a single question

**Prevention:**
- Let users try 3-5 questions before any signup prompt
- Offer "Continue as guest" with local progress storage
- Gate only social features (leaderboards, streaks sync) behind auth
- Use progressive profiling: collect info gradually

**Phase relevance:** Onboarding phase, initial user flow

**Confidence:** HIGH (multiple sources: VWO, Plotline, UXCam)

---

### Pitfall 4: Too Many Animated Components Simultaneously

**What goes wrong:** Rendering 100+ animated components at once (e.g., every list item animating on mount). Performance degrades severely, especially on Android.

**Why it happens:** Easy to add `entering={FadeIn}` to list items; looks good in simulator.

**Consequences:**
- FPS drops below 30 on mid-range Android
- UI becomes unresponsive during list renders
- Memory pressure and potential crashes
- "Works on my iPhone" syndrome

**Warning signs:**
- FlatList items with entering animations
- Leaderboards with animated entries
- Summary screens with animated stat cards
- Any screen rendering 50+ animated components

**Prevention:**
- Limit simultaneous animations to ~100 components (Android) / ~500 (iOS)
- Use staggered animations with `delayChildren` approach
- Consider react-native-skia for complex particle effects
- Test on low-end Android devices (not just iPhone 15 Pro)

**Phase relevance:** Summary screens, leaderboards, question lists

**Confidence:** HIGH (official Reanimated docs, community consensus)

---

### Pitfall 5: AsyncStorage for Frequent Read/Write

**What goes wrong:** Using AsyncStorage for quiz state, progress tracking, or any frequently-accessed data. AsyncStorage is async, unencrypted, and ~30x slower than alternatives.

**Why it happens:** AsyncStorage is the "default" React Native storage; tutorials use it everywhere.

**Consequences:**
- Noticeable lag when saving/loading quiz state
- Race conditions with async operations
- Potential data loss on app crashes
- Cannot store sensitive data securely

**Warning signs:**
- `await AsyncStorage.getItem()` in hot paths
- Storing quiz progress in AsyncStorage
- Multiple AsyncStorage calls per question
- Storing auth tokens in AsyncStorage

**Prevention:**
- Use MMKV for performance-critical local storage (30x faster, synchronous)
- Use Expo SecureStore for sensitive data (tokens, credentials)
- MMKV works with Expo via prebuild: `npx expo prebuild`
- Migrate from AsyncStorage using provided migration utilities

```typescript
// MMKV setup for Expo
import { MMKV } from 'react-native-mmkv';
const storage = new MMKV();

// Synchronous reads - no await needed
const progress = storage.getNumber('quiz.progress') ?? 0;
storage.set('quiz.progress', newProgress);
```

**Phase relevance:** Local storage implementation, quiz state persistence

**Confidence:** HIGH (official MMKV docs, community benchmarks)

---

## Moderate Pitfalls

Mistakes that cause delays, poor UX, or technical debt.

---

### Pitfall 6: Missing Haptic Feedback on Interactions

**What goes wrong:** Touch interactions feel flat and unresponsive without haptic feedback. Users can't tell if their tap registered.

**Why it happens:** Haptics are an afterthought; "we'll add polish later."

**Prevention:**
- Use `expo-haptics` for all interactive elements
- Light impact for button taps
- Medium impact for correct answers
- Heavy/error pattern for incorrect answers
- Test on physical devices (haptics don't work in simulator)

**Phase relevance:** Quiz interactions, button components

**Confidence:** HIGH (existing codebase already implements this well)

---

### Pitfall 7: Inline Functions in renderItem

**What goes wrong:** Creating arrow functions inline for FlatList's `renderItem` causes the function to be recreated every render, breaking React's memoization and causing unnecessary re-renders.

**Why it happens:** Convenient syntax; common pattern in React web.

**Prevention:**
```typescript
// BAD: Recreated every render
<FlatList
  data={questions}
  renderItem={({ item }) => <QuestionCard question={item} />}
/>

// GOOD: Stable reference with useCallback
const renderQuestion = useCallback(
  ({ item }) => <QuestionCard question={item} />,
  []
);
<FlatList data={questions} renderItem={renderQuestion} />
```

**Phase relevance:** Any screen with lists (question bank, results, leaderboards)

**Confidence:** HIGH (React Native docs, community best practices)

---

### Pitfall 8: Missing getItemLayout for Fixed-Height Lists

**What goes wrong:** FlatList performs async layout calculations for every item, causing scroll jumps and performance issues.

**Why it happens:** `getItemLayout` is optional and documentation doesn't emphasize it.

**Prevention:**
```typescript
// For fixed-height items (e.g., 80px quiz options)
<FlatList
  data={options}
  getItemLayout={(data, index) => ({
    length: 80, // Item height
    offset: 80 * index,
    index,
  })}
  // ...
/>
```

**Phase relevance:** Quiz options list, results list, any scrollable content

**Confidence:** HIGH (official React Native performance docs)

---

### Pitfall 9: Overloading Gamification Systems

**What goes wrong:** Adding points, badges, leaderboards, streaks, levels, challenges, and achievements all at once. Users get overwhelmed and the motivational impact of each element is diluted.

**Why it happens:** "Duolingo has all these features, so we need them too."

**Prevention:**
- Start with ONE core mechanic (likely streaks for a learning app)
- Add XP/progress visualization second
- Only add leaderboards if user research supports competition
- Each system should have clear, tangible value
- Test with users before adding more gamification

**Phase relevance:** Gamification phase, rewards system

**Confidence:** MEDIUM (UX research sources, Duolingo case studies)

---

### Pitfall 10: Question Difficulty Not Adaptive

**What goes wrong:** Static difficulty causes either frustration (too hard) or boredom (too easy). Users don't feel challenged appropriately.

**Why it happens:** Adaptive difficulty is complex; easier to ship static content.

**Prevention:**
- Track accuracy per question category
- Show harder questions when user is performing well
- Fall back to easier questions after consecutive failures
- Don't need ML - simple rules work: "3 correct in a row = harder"

**Phase relevance:** Quiz engine, spaced repetition implementation

**Confidence:** MEDIUM (gamification research, Duolingo patterns)

---

### Pitfall 11: Not Testing on Low-End Android

**What goes wrong:** App performs well on developer's iPhone 15 Pro but is unusable on budget Android devices that represent a significant user base.

**Why it happens:** Developers use high-end devices; Android emulators are slow so testing is minimized.

**Prevention:**
- Get a physical budget Android (~$150 range)
- Test animations, scrolling, and transitions
- Profile with React DevTools Profiler
- Set performance budgets: "Must maintain 60fps on Pixel 4a"

**Phase relevance:** All phases, especially animation-heavy ones

**Confidence:** HIGH (universal React Native advice)

---

### Pitfall 12: Expo SDK 54 Babel Plugin Conflict

**What goes wrong:** Build fails with "Duplicate plugin/preset detected" error for reanimated/worklets plugins.

**Why it happens:** `react-native-worklets/plugin` is now bundled inside `react-native-reanimated/plugin` but developers add both.

**Prevention:**
```javascript
// babel.config.js - ONLY include reanimated plugin
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    'react-native-reanimated/plugin', // Already includes worklets
    // DON'T add 'react-native-worklets/plugin' separately
  ],
};
```

**Phase relevance:** Initial setup, SDK upgrades

**Confidence:** HIGH (Expo SDK 54 changelog)

---

## Minor Pitfalls

Mistakes that cause annoyance but are fixable.

---

### Pitfall 13: Progress Bar Width Animation

**What goes wrong:** Progress bars animate their `width` property, causing layout thrashing.

**Prevention:** Use `scaleX` transform with `transformOrigin: 'left'` for smooth progress animations.

**Phase relevance:** Quiz progress bar

**Confidence:** HIGH (Reanimated performance docs)

---

### Pitfall 14: Missing Accessibility Labels

**What goes wrong:** Screen readers (VoiceOver/TalkBack) can't navigate the app properly. Announced as "button" or "image" without context.

**Prevention:**
- Add `accessibilityLabel` to all interactive elements
- Use `accessibilityRole` for semantic meaning
- Test with VoiceOver (iOS) and TalkBack (Android)
- Minimum touch target: 44x44 points

**Phase relevance:** All UI components

**Confidence:** HIGH (a11y guidelines)

---

### Pitfall 15: Hardcoded Colors Breaking Theme

**What goes wrong:** UI looks wrong in dark mode because colors are hardcoded instead of using theme tokens.

**Prevention:**
- Always use theme colors from `useColorScheme()` hook
- Never use hex values directly in components
- Existing codebase has good patterns - follow them

**Phase relevance:** All UI components

**Confidence:** HIGH (existing CLAUDE.md guidance)

---

### Pitfall 16: Information Overload in Onboarding

**What goes wrong:** 5+ intro screens explaining features users don't care about yet. Day 1 retention drops significantly.

**Prevention:**
- Maximum 3 onboarding screens
- Show value in under 10 seconds
- Teach through action, not explanation
- Let users skip to the quiz immediately

**Phase relevance:** Onboarding phase

**Confidence:** HIGH (mobile UX research)

---

### Pitfall 17: Remote Debugging Breaks MMKV/JSI

**What goes wrong:** Chrome remote debugging doesn't work with JSI-based libraries like MMKV or Reanimated.

**Prevention:**
- Use Flipper for debugging instead of Chrome
- Use `console.log` with Metro bundler
- React Native DevTools work fine
- This is a known limitation, not a bug

**Phase relevance:** Development workflow

**Confidence:** HIGH (MMKV docs)

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Quiz Flow UI | Layout property animations | Use transform/opacity only |
| Progress Indicators | Width animation | Use scaleX with transformOrigin |
| Onboarding | Early registration requirement | Delay auth until value proven |
| Local Storage | AsyncStorage performance | Migrate to MMKV |
| Gamification | Feature overload | Start with one mechanic |
| Results/Summary | Too many animated components | Stagger animations, limit count |
| List Views | Missing getItemLayout | Always provide for fixed-height items |
| Haptic Feedback | Missing/inconsistent | Follow existing codebase patterns |
| Accessibility | Missing labels | Add accessibilityLabel to all touches |
| Theme Support | Hardcoded colors | Use theme tokens exclusively |

---

## New Architecture Considerations (Expo SDK 54)

The project runs on Expo SDK 54 with React Native 0.81.5, which means New Architecture is enabled by default.

**Specific mitigations:**
- If experiencing flickering during scroll, upgrade to RN 0.81+ (already done) and enable `DISABLE_COMMIT_PAUSING_MECHANISM` flag
- If FPS drops during scrolling, enable `USE_COMMIT_HOOK_ONLY_FOR_REACT_COMMITS` flag
- SDK 55 will REQUIRE New Architecture - no opt-out possible

**Confidence:** HIGH (Expo SDK 54 changelog)

---

## Sources

### High Confidence (Official Documentation)
- [React Native Reanimated Performance Guide](https://docs.swmansion.com/react-native-reanimated/docs/guides/performance/)
- [React Native FlatList Optimization](https://reactnative.dev/docs/optimizing-flatlist-configuration)
- [Expo SDK 54 Changelog](https://expo.dev/changelog/sdk-54)
- [MMKV GitHub](https://github.com/mrousavy/react-native-mmkv)
- [Expo Haptics Documentation](https://docs.expo.dev/versions/latest/sdk/haptics/)

### Medium Confidence (Verified Community Sources)
- [7 React Native Mistakes Slowing Your App (2026)](https://medium.com/@baheer224/7-react-native-mistakes-slowing-your-app-in-2026-19702572796a)
- [React Native Optimization Playbook (2025)](https://medium.com/scaleuptech/react-native-optimization-playbook-what-every-developer-should-know-dec233702a4a)
- [Duolingo Gamification Secrets](https://www.orizon.co/blog/duolingos-gamification-secrets)
- [Mobile App Onboarding Guide (2026)](https://vwo.com/blog/mobile-app-onboarding-guide/)
- [MMKV vs AsyncStorage Comparison](https://reactnativeexpert.com/blog/mmkv-vs-asyncstorage-in-react-native/)

### UX Research Sources
- [Gamification Strategies for Mobile Apps](https://www.storyly.io/post/gamification-strategies-to-increase-app-engagement)
- [Common Mobile Onboarding Mistakes](https://blog.usetiful.com/2025/08/how-to-fix-mobile-onboarding-mistakes.html)
- [Mobile Accessibility Testing Checklist (2025)](https://a11ypros.com/blog/mobile-accessibility-testing-checklist-2025-edition)
