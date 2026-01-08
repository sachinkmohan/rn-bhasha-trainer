# Pronunciation Practice Feature - Implementation Plan

## Overview

Add a pronunciation practice feature where users hear audio, choose from 2 options (correct word vs similar-sounding confusable), then see the word with explanation. Sessions are 5 words, with results summary and ability to revisit difficult words.

**MVP Approach**: Build UI first with mock audio (placeholder), curate similar-sounding word pairs.

---

## File Structure

```
app/
  pronunciation-practice.tsx    # NEW - Main practice screen (stack screen)
  (tabs)/index.tsx              # UPDATE - Wire up navigation

components/pronunciation/
  ScriptToggle.tsx              # NEW - Manglish/Malayalam toggle
  AudioPlayer.tsx               # NEW - Mock audio with replay button
  WordOption.tsx                # NEW - Pressable option card
  FeedbackCard.tsx              # NEW - Shows result after answer
  SessionResults.tsx            # NEW - End-of-session score

data/
  confusablePairs.ts            # NEW - Curated similar-sounding word pairs

hooks/
  usePronunciationSession.ts    # NEW - Session state management

utils/
  storage.ts                    # NEW - AsyncStorage wrapper

types/
  pronunciation.ts              # NEW - TypeScript interfaces
```

---

## Implementation Steps

### Step 1: Types and Data Structure

Create `/types/pronunciation.ts`:

- `Word`, `ConfusablePair`, `ScriptType`, `PracticeQuestion`, `PracticeAnswer`, `PracticeSession` types

Create `/data/confusablePairs.ts` with curated pairs from existing words:
| Word 1 | Word 2 | Reason |
|--------|--------|--------|
| ithu (this) | athu (that) | Minimal vowel difference |
| ithu (this) | ethu (which) | Similar pattern |
| enthu (what) | ente (my) | Both start with "en-" |
| pinneyum (again) | pinne (and) | Same root word |
| munbu (before) | sheSham (after) | Temporal opposites |

### Step 2: Storage Utility

- Install `@react-native-async-storage/async-storage`
- Create `/utils/storage.ts` with:
  - `getDifficultWords()` - Get word IDs user got wrong
  - `addDifficultWord(wordId)` - Save wrong answer
  - `saveSessionResult(score, total)` - Save session history

### Step 3: Session Hook

Create `/hooks/usePronunciationSession.ts`:

- `startSession(scriptType)` - Initialize 5 random questions
- `submitAnswer(wordId)` - Check answer, update state
- `nextQuestion()` - Move to next or complete
- `toggleScript()` - Switch Manglish/Malayalam
- Returns: `session`, `currentQuestion`, `score`, `isComplete`

### Step 4: Components

**ScriptToggle.tsx**

- Two-button toggle: "Manglish" | "മലയാളം"
- Positioned at top of screen
- Uses NativeWind styling

**AudioPlayer.tsx** (mock for now)

- Speaker icon button
- Mock play animation (visual feedback only)
- Replay button functionality

**WordOption.tsx**

- Pressable card showing word in selected script
- States: default, selected, correct (green), incorrect (red)
- Disabled after answer submitted

**FeedbackCard.tsx**

- Shows after user answers
- Displays: correct word (both scripts), meaning, explanation
- "Next" button to proceed

**SessionResults.tsx**

- Score display: "4/5 Correct!"
- Buttons: "Practice Again", "Review Difficult Words", "Go Home"

### Step 5: Main Practice Screen

Create `/app/pronunciation-practice.tsx`:

- Phases: `practice` → `feedback` → `results`
- Uses `usePronunciationSession` hook
- Flow:
  1. Show AudioPlayer + 2 WordOptions
  2. User selects answer → show FeedbackCard
  3. After 5 questions → show SessionResults

### Step 6: Navigation

Update `/app/_layout.tsx`:

```tsx
<Stack.Screen name="pronunciation-practice" options={{ title: "Practice" }} />
```

Update `/app/(tabs)/index.tsx`:

```tsx
import { router } from 'expo-router';
// ...
onPress={() => router.push('/pronunciation-practice')}
```

### Step 7: Difficult Words Mode

- Add query param support: `?mode=difficult`
- Filter questions to only difficult word pairs
- Add button on Home screen: "Review Difficult Words"

---

## Critical Files to Modify

| File                    | Action                              |
| ----------------------- | ----------------------------------- |
| `/app/_layout.tsx`      | Add stack screen                    |
| `/app/(tabs)/index.tsx` | Wire up navigation                  |
| `/wordsMalayalam.json`  | Reference only (word IDs for pairs) |

## Dependencies to Add

- `@react-native-async-storage/async-storage` - For persisting progress

---

## UI Flow Diagram

```
[Home Screen]
     |
     v  (tap "Practice Pronunciation")
[Practice Screen]
     |
     ├─> [Script Toggle] at top (Manglish/Malayalam)
     |
     ├─> [Audio Player] - tap to hear word
     |
     ├─> [Option A] [Option B] - pick one
     |
     v  (after answer)
[Feedback Card]
     |
     ├─> Shows correct word + meaning + explanation
     ├─> Replay audio button
     └─> "Next" button
     |
     v  (after 5 questions)
[Results Screen]
     |
     ├─> Score: 4/5 Correct
     ├─> "Practice Again" → restart
     ├─> "Review Difficult" → filtered mode
     └─> "Go Home" → back to tabs
```

---

## User's Requirements Checklist

- [x] New page for pronunciation practice
- [x] Toggle between Manglish and Malayalam display
- [x] 2 options (similar-sounding words)
- [x] Audio plays first, word revealed after answer
- [x] Replay audio capability
- [x] Short explanation after answering
- [x] 5 words per session
- [x] Results summary at end
- [x] Track and revisit difficult words
