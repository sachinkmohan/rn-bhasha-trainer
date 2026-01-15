# Word States Implementation Plan

## Overview

Add word mastery tracking to give users a sense of progress. Words will have three states: New, Learning, and Mastered. Progress will be displayed on the home screen and used to prioritize which words to practice.

---

## Word States Definition

| State | Definition | Visual |
|-------|------------|--------|
| **New** | Never practiced (0 correct answers) | Gray |
| **Learning** | Practiced but < 3 correct answers | Yellow/Orange |
| **Mastered** | 3+ correct answers total | Green |

---

## File Changes

```
types/
  pronunciation.ts              # UPDATE - Add WordProgress type

utils/
  storage.ts                    # UPDATE - Add word progress tracking methods

hooks/
  usePronunciationSession.ts    # UPDATE - Track correct answers per word
  useWordProgress.ts            # NEW - Hook for home screen progress display

app/
  (tabs)/index.tsx              # UPDATE - Display dynamic progress from storage
```

---

## Implementation Steps

### Step 1: Update Types (`types/pronunciation.ts`)

Add new types for word progress tracking:

```typescript
// Individual word progress
export interface WordProgress {
  wordId: string;
  correctCount: number;
  lastPracticed: string; // ISO date
}

// Word mastery state
export type WordState = 'new' | 'learning' | 'mastered';

// Extend PersistedPracticeData
export interface PersistedPracticeData {
  difficultWordIds: string[];
  sessionHistory: Array<{...}>;
  wordProgress: Record<string, WordProgress>;  // NEW
}
```

- [x] Add `WordProgress` interface
- [x] Add `WordState` type
- [x] Update `PersistedPracticeData` to include `wordProgress`

### Step 2: Extend Storage (`utils/storage.ts`)

Add methods for tracking word progress:

```typescript
// New methods to add
async incrementWordProgress(wordId: string): Promise<void>
async getWordProgress(): Promise<Record<string, WordProgress>>
async getWordState(wordId: string): Promise<WordState>
```

- [x] Update `defaultData` to include empty `wordProgress`
- [x] Add `incrementWordProgress()` method
- [x] Add `getWordProgress()` method
- [x] Add helper `getWordState()` to compute state from correctCount

### Step 3: Update Session Hook (`hooks/usePronunciationSession.ts`)

Track correct answers when user answers correctly:

```typescript
// In submitAnswer function:
if (isCorrect) {
  await PracticeStorage.incrementWordProgress(currentQuestion.correctWord.id);
}
```

- [x] Call `incrementWordProgress` on correct answers
- [x] Keep existing `addDifficultWord` for wrong answers

### Step 4: Create Progress Hook (`hooks/useWordProgress.ts`)

New hook for home screen to display progress:

```typescript
export function useWordProgress() {
  // Returns:
  return {
    newCount,        // Words never practiced
    learningCount,   // Words with 1-2 correct
    masteredCount,   // Words with 3+ correct
    totalWords,      // Total words in app
    isLoading,
  };
}
```

- [x] Create new file `hooks/useWordProgress.ts`
- [x] Load word progress from storage
- [x] Count words from `wordsMalayalam.json`
- [x] Compute counts for each state

### Step 5: Update Home Screen (`app/(tabs)/index.tsx`)

Replace hardcoded "2/10" with dynamic progress:

```typescript
// Before:
<Text style={styles.progressText}>2/10</Text>
<Text style={styles.wordsLearned}>Words Learned</Text>

// After:
<Text style={styles.progressText}>{masteredCount}/{totalWords}</Text>
<Text style={styles.wordsLearned}>Words Mastered</Text>

// Optional: Show breakdown
<Text>New: {newCount} | Learning: {learningCount} | Mastered: {masteredCount}</Text>
```

- [x] Import and use `useWordProgress` hook
- [x] Display mastered/total count
- [x] Show state breakdown

---

## Data Flow

```
User answers correctly
        ↓
submitAnswer() in usePronunciationSession
        ↓
PracticeStorage.incrementWordProgress(wordId)
        ↓
AsyncStorage updated with new correctCount
        ↓
Home screen calls useWordProgress()
        ↓
Progress display updates
```

---

## Testing Checklist

- [ ] Answer word correctly → correctCount increments
- [ ] Answer same word correctly 3x → state becomes "mastered"
- [ ] Home screen shows accurate counts
- [ ] Progress persists after app restart
- [ ] New words show as "new" (correctCount = 0)

---

## Future Enhancements (Not in MVP)

- Prioritize "learning" words in session generation
- Visual word list showing all words with their states
- Reset progress option in settings
- Spaced repetition based on lastPracticed date
