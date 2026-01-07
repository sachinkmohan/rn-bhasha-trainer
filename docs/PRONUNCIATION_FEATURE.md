# Pronunciation Practice Feature - Technical Documentation

This document explains the pronunciation practice feature implementation for the Malayalam language learning app.

---

## Table of Contents
1. [Feature Overview](#feature-overview)
2. [User Flow Diagram](#user-flow-diagram)
3. [File Structure](#file-structure)
4. [Detailed File Explanations](#detailed-file-explanations)
5. [Data Flow](#data-flow)
6. [How Components Work Together](#how-components-work-together)

---

## Feature Overview

The pronunciation practice feature helps users learn Malayalam words by:
- Playing audio of a word (mock for now)
- Showing 2 similar-sounding word options
- User picks the correct one
- Feedback is shown with explanation
- Session tracks score and difficult words for review

**Key Features:**
- 5 questions per session
- Toggle between Manglish (Malayalam in English letters) and Malayalam script
- Tracks words user got wrong for later review
- Shows results at end of session

---

## User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              HOME SCREEN                                     │
│                                                                             │
│   ┌─────────────────────────────────────────┐                              │
│   │  Hello Alex 👋                          │                              │
│   │  Ready to practice?                     │                              │
│   │                                         │                              │
│   │  ┌─────────────────────┐               │                              │
│   │  │   Your Progress     │               │                              │
│   │  │      2/10           │               │                              │
│   │  │   Words Learned     │               │                              │
│   │  └─────────────────────┘               │                              │
│   │                                         │                              │
│   │  ┌─────────────────────────────────┐   │                              │
│   │  │   Practice Pronunciation        │◄──┼── User taps this button      │
│   │  └─────────────────────────────────┘   │                              │
│   └─────────────────────────────────────────┘                              │
└───────────────────────────────┬─────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PRACTICE SCREEN                                      │
│                                                                             │
│   ┌──────────────────────────────────────────────────────────────────────┐ │
│   │  [Manglish] [Malayalam]                              1/5             │ │
│   │         ▲                                             │              │ │
│   │         │                                             │              │ │
│   │    Script Toggle                              Progress Counter       │ │
│   └──────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│   ┌──────────────────────────────────────────────────────────────────────┐ │
│   │                                                                      │ │
│   │                         🔊 (Play Button)                             │ │
│   │                                                                      │ │
│   │                      Tap to hear the word                            │ │
│   │                      (Audio coming soon)                             │ │
│   │                                                                      │ │
│   └──────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│   ┌─────────────────────┐         ┌─────────────────────┐                  │
│   │                     │         │                     │                  │
│   │       ithu          │         │       athu          │                  │
│   │      (this)         │         │      (that)         │                  │
│   │                     │         │                     │                  │
│   └─────────────────────┘         └─────────────────────┘                  │
│           ▲                                 ▲                              │
│           │                                 │                              │
│           └────────── User picks one ───────┘                              │
│                                                                             │
└───────────────────────────────┬─────────────────────────────────────────────┘
                                │
                                ▼ (After selection)
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FEEDBACK CARD                                        │
│                                                                             │
│   ┌──────────────────────────────────────────────────────────────────────┐ │
│   │  ✓ Great job!  (or)  ℹ Keep practicing!                             │ │
│   │                                                                      │ │
│   │  The word was:                                                       │ │
│   │  ithu                                                                │ │
│   │  ഇത് / ഇതു                                                           │ │
│   │                                                                      │ │
│   │  Meaning:                                                            │ │
│   │  this                                                                │ │
│   │                                                                      │ │
│   │  ┌────────────────────────────────────────────────────────────────┐ │ │
│   │  │ Why these sound similar:                                       │ │ │
│   │  │ Minimal vowel difference - 'i' vs 'a' at the start            │ │ │
│   │  └────────────────────────────────────────────────────────────────┘ │ │
│   │                                                                      │ │
│   │  [🔊 Replay]                                    [Next ▶]            │ │
│   └──────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└───────────────────────────────┬─────────────────────────────────────────────┘
                                │
                                ▼ (After 5 questions)
┌─────────────────────────────────────────────────────────────────────────────┐
│                         RESULTS SCREEN                                       │
│                                                                             │
│                              🏆                                             │
│                                                                             │
│                          4/5 Correct                                        │
│                             80%                                             │
│                                                                             │
│                   Excellent work! Keep it up!                               │
│                                                                             │
│                  ┌─────────────────────────┐                               │
│                  │    Practice Again       │                               │
│                  └─────────────────────────┘                               │
│                                                                             │
│                  ┌─────────────────────────┐                               │
│                  │ Review Difficult Words  │ ◄── Only shows if you         │
│                  └─────────────────────────┘     got some wrong            │
│                                                                             │
│                  ┌─────────────────────────┐                               │
│                  │       Go Home           │                               │
│                  └─────────────────────────┘                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
rn-bhasha-trainer/
│
├── app/
│   ├── _layout.tsx                    # MODIFIED - Added stack screen route
│   ├── pronunciation-practice.tsx     # NEW - Main practice screen
│   └── (tabs)/
│       └── index.tsx                  # MODIFIED - Button navigates to practice
│
├── components/
│   └── pronunciation/                 # NEW FOLDER
│       ├── ScriptToggle.tsx           # Toggle Manglish/Malayalam
│       ├── AudioPlayer.tsx            # Play button (mock audio)
│       ├── WordOption.tsx             # Clickable word cards
│       ├── FeedbackCard.tsx           # Shows result after answer
│       └── SessionResults.tsx         # Final score screen
│
├── hooks/
│   └── usePronunciationSession.ts     # NEW - Session state management
│
├── utils/
│   └── storage.ts                     # NEW - AsyncStorage for progress
│
├── types/
│   └── pronunciation.ts               # NEW - TypeScript interfaces
│
├── data/
│   └── confusablePairs.ts             # NEW - Similar-sounding word pairs
│
└── wordsMalayalam.json                # EXISTING - Word database (unchanged)
```

---

## Detailed File Explanations

### 1. Types (`/types/pronunciation.ts`)

Defines TypeScript interfaces for type safety:

| Type | Purpose |
|------|---------|
| `Word` | Structure of a word from wordsMalayalam.json |
| `ConfusablePair` | Links two similar-sounding words |
| `ScriptType` | Either 'manglish' or 'malayalam' |
| `PracticeQuestion` | A question with correct word + confusable |
| `PracticeAnswer` | User's answer (which word, correct/wrong) |
| `PracticeSession` | Full session state |
| `PersistedPracticeData` | What gets saved to phone storage |

---

### 2. Confusable Pairs (`/data/confusablePairs.ts`)

Maps which words sound similar:

```typescript
{
  id: 'pair-1',
  wordId: '595ae022-...',      // ithu (this)
  confusableWordId: '43847693-...',  // athu (that)
  reason: "Minimal vowel difference - 'i' vs 'a' at the start"
}
```

**Current pairs:**
| Word 1 | Word 2 | Why confusable |
|--------|--------|----------------|
| ithu (this) | athu (that) | Vowel difference |
| ithu (this) | ethu (which) | Similar pattern |
| enthu (what) | ente (my) | Both start with "en-" |
| pinneyum (again) | pinne (and) | Same root |
| munbu (before) | sheSham (after) | Opposites |
| padikkuka (study) | uranguka (sleep) | -uka verbs |
| kazhikkuka (eat) | uranguka (sleep) | -uka verbs |
| eppozhum (always) | pinneyum (again) | -um ending |
| uccha (afternoon) | ravile (morning) | Time words |
| Enikku (I) | ente (my) | First-person |

---

### 3. Storage Utility (`/utils/storage.ts`)

Saves user progress to phone using AsyncStorage:

```typescript
PracticeStorage.getDifficultWords()    // Get words user got wrong
PracticeStorage.addDifficultWord(id)   // Save wrong answer
PracticeStorage.removeDifficultWord(id) // Remove from difficult
PracticeStorage.saveSessionResult()     // Save score history
```

---

### 4. Session Hook (`/hooks/usePronunciationSession.ts`)

Manages all practice session logic:

```typescript
const {
  session,           // Current session state
  startSession,      // Start new session
  submitAnswer,      // Submit user's answer
  nextQuestion,      // Go to next question
  toggleScript,      // Switch Manglish/Malayalam
  resetSession,      // Clear session
  currentQuestion,   // Current question data
  score,             // Current score
  hasAnswered,       // Did user answer current question?
  hasDifficultWords  // Are there words to review?
} = usePronunciationSession();
```

**How it works:**
1. `startSession()` - Picks 5 random confusable pairs
2. `submitAnswer(wordId)` - Checks if correct, saves wrong ones
3. `nextQuestion()` - Moves to next or marks complete
4. `toggleScript()` - Switches display script

---

### 5. Components

#### ScriptToggle
```
┌─────────────────────────────────┐
│  [Manglish]  [Malayalam]        │
└─────────────────────────────────┘
```
- Two buttons in a pill shape
- Selected one is highlighted
- Calls `onToggle()` when clicked

#### AudioPlayer
```
┌─────────────────────────────────┐
│           🔊                    │
│    Tap to hear the word         │
│    (Audio coming soon)          │
└─────────────────────────────────┘
```
- Big play button
- Shows "Playing..." when tapped
- Mock for now (no real audio)

#### WordOption
```
┌─────────────────┐
│      ithu       │
│     Correct!    │  (shown after answer)
└─────────────────┘
```
- Shows word in current script
- Changes color based on state:
  - Default: Gray border
  - Selected: Blue border
  - Correct: Green background
  - Wrong: Red background

#### FeedbackCard
```
┌─────────────────────────────────┐
│ ✓ Great job!                    │
│                                 │
│ The word was: ithu              │
│ ഇത് / ഇതു                        │
│                                 │
│ Meaning: this                   │
│                                 │
│ Why similar: Vowel difference   │
│                                 │
│ [Replay]              [Next]    │
└─────────────────────────────────┘
```
- Shows correct answer
- Explains why words sound similar
- Replay and Next buttons

#### SessionResults
```
┌─────────────────────────────────┐
│              🏆                 │
│          4/5 Correct            │
│             80%                 │
│                                 │
│   Excellent work! Keep it up!   │
│                                 │
│      [Practice Again]           │
│   [Review Difficult Words]      │
│         [Go Home]               │
└─────────────────────────────────┘
```
- Shows final score
- Different emoji based on score
- Option to review difficult words

---

### 6. Main Practice Screen (`/app/pronunciation-practice.tsx`)

Orchestrates everything:

```
Phase: loading → practice → feedback → results
         │          │          │          │
         ▼          ▼          ▼          ▼
      Spinner    Audio +    Feedback   Final
                 Options    Card       Score
```

**State machine:**
1. `loading` - Fetching questions
2. `practice` - Showing audio + 2 options
3. `feedback` - Showing result after answer
4. `results` - Session complete, show score

---

## Data Flow

```
┌──────────────────┐
│ wordsMalayalam   │  (24 Malayalam words with translations)
│     .json        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ confusablePairs  │  (10 pairs of similar-sounding words)
│     .ts          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│usePronunciation  │  (Picks 5 random pairs, manages state)
│   Session.ts     │
└────────┬─────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌───────┐
│ UI    │ │Storage│  (Saves difficult words)
│Comps  │ │  .ts  │
└───────┘ └───────┘
```

---

## How Components Work Together

```
pronunciation-practice.tsx (Main Screen)
│
├── usePronunciationSession() ──── Hook manages all state
│        │
│        ├── Reads: confusablePairs.ts
│        ├── Reads: wordsMalayalam.json
│        └── Uses: storage.ts (save progress)
│
├── <ScriptToggle />
│        │
│        └── onToggle → hook.toggleScript()
│
├── <AudioPlayer />
│        │
│        └── Mock play (future: real audio)
│
├── <WordOption /> × 2
│        │
│        └── onSelect → hook.submitAnswer(wordId)
│
├── <FeedbackCard />
│        │
│        ├── onNext → hook.nextQuestion()
│        └── onReplay → (mock for now)
│
└── <SessionResults />
         │
         ├── onRestart → hook.resetSession() + startSession()
         ├── onPracticeDifficult → navigate with ?mode=difficult
         └── onGoHome → router.back()
```

---

## Navigation

```
app/_layout.tsx
│
├── (tabs) ─────────────────── Tab navigator (Home, Explore, Words)
│     │
│     └── index.tsx ────────── "Practice Pronunciation" button
│                                      │
│                                      ▼
├── pronunciation-practice ──── Stack screen (this feature)
│
└── modal ─────────────────── Example modal (not used)
```

---

## Future Improvements

1. **Real Audio**: Replace mock AudioPlayer with `expo-av`
2. **More Word Pairs**: Add more confusable pairs as vocabulary grows
3. **Spaced Repetition**: Weight questions based on error history
4. **Progress Dashboard**: Show historical accuracy trends
5. **Daily Streaks**: Motivation through consistency tracking

---

## Quick Reference

| Action | File | Function |
|--------|------|----------|
| Start practice | index.tsx | `router.push('/pronunciation-practice')` |
| Generate questions | usePronunciationSession.ts | `generateQuestions()` |
| Submit answer | usePronunciationSession.ts | `submitAnswer()` |
| Save wrong answer | storage.ts | `addDifficultWord()` |
| Toggle script | usePronunciationSession.ts | `toggleScript()` |
| Show results | SessionResults.tsx | Component |
| Review difficult | pronunciation-practice.tsx | `?mode=difficult` query param |
