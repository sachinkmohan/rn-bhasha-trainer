# Audio System Guide - How Pronunciation Practice Works

A complete technical guide explaining the audio matching system, question generation, and practice flow in the Bhasha Trainer app.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Why Only Limited Questions?](#why-only-limited-questions)
3. [Complete Audio Matching Flow](#complete-audio-matching-flow)
4. [Key Components](#key-components)
5. [Question Generation Logic](#question-generation-logic)
6. [Audio Playback System](#audio-playback-system)
7. [Answer Matching Logic](#answer-matching-logic)
8. [Adding More Questions](#adding-more-questions)
9. [Code Reference](#code-reference)

---

## System Overview

The pronunciation practice system works by:
1. **Defining confusable word pairs** (words that sound similar)
2. **Generating questions** from these pairs
3. **Playing audio** of the correct word
4. **Showing two options** (correct word + confusable word)
5. **Checking the user's answer** by comparing word IDs

**Number of questions = Number of pairs in `confusablePairs.ts`**

---

## Why Only Limited Questions?

The number of practice questions is determined by the **number of pairs defined in `confusablePairs.ts`**.

### Current State

**File:** `data/confusablePairs.ts`

```typescript
export const confusablePairs: ConfusablePair[] = [
  {
    id: 'pair-1',
    wordId: '595ae022-4413-4371-92a4-a8df5773203b', // ithu (this)
    confusableWordId: '43847693-3593-46c3-9a02-25a5363c22bf', // athu (that)
    reason: "Minimal vowel difference - 'i' vs 'a' at the start",
  },
  {
    id: 'pair-2',
    wordId: '595ae022-4413-4371-92a4-a8df5773203b', // ithu (this)
    confusableWordId: '0d98e3a5-08a3-4651-9e71-cddfec8f0da8', // ethu (which)
    reason: "Similar consonant pattern, different initial vowel sound",
  },
  {
    id: 'pair-3',
    wordId: 'f63ca11a-3259-4aab-bad7-d3b349201512', // enthu (what)
    confusableWordId: 'c93b83c4-da8b-431b-93ef-af20ec1e83a3', // ente (my)
    reason: "Both start with 'en-' sound, easy to confuse",
  },
  {
    id: 'pair-10',
    wordId: '2675be2b-8553-4e25-ad38-371ac0b6abd3', // enikku (I)
    confusableWordId: 'c93b83c4-da8b-431b-93ef-af20ec1e83a3', // ente (my)
    reason: "Both are first-person pronouns starting with 'e'",
  },
];
```

**Result:** 4 pairs = 4 questions maximum

### Available Resources

- **Total words in database:** 28 words (in `wordsMalayalam.json`)
- **Words with audio:** 28 audio files (in `assets/audio/confusing-pairs/`)
- **Current pairs defined:** 4 pairs
- **Potential for more:** You can create many more pairs from the 28 available words

---

## Complete Audio Matching Flow

### End-to-End Example

Let's trace how a single question works from start to finish:

#### 1. Pair Definition (confusablePairs.ts)

```typescript
{
  id: 'pair-1',
  wordId: '595ae022-4413-4371-92a4-a8df5773203b', // ithu
  confusableWordId: '43847693-3593-46c3-9a02-25a5363c22bf', // athu
  reason: "Minimal vowel difference - 'i' vs 'a' at the start"
}
```

#### 2. Question Generation (usePronunciationSession.ts)

```javascript
// System fetches full word data from wordsMalayalam.json
const correctWord = {
  id: '595ae022-4413-4371-92a4-a8df5773203b',
  word: {
    inTranslit: 'ithu',
    inNativeScript: 'ഇത് / ഇതു'
  },
  meaning: 'this',
  pronunciation: 'ithu.mp3'  // ← Audio file to play
}

const confusableWord = {
  id: '43847693-3593-46c3-9a02-25a5363c22bf',
  word: {
    inTranslit: 'athu',
    inNativeScript: 'അത് / അതു'
  },
  meaning: 'that',
  pronunciation: 'athu.mp3'
}

// Random swap (50% chance)
const shouldSwap = Math.random() > 0.5;

const question = {
  correctWord: shouldSwap ? confusableWord : correctWord,
  confusableWord: shouldSwap ? correctWord : confusableWord,
  reason: "Minimal vowel difference..."
}
```

#### 3. Audio Playback

```typescript
// In pronunciation-practice.tsx
<AudioPlayer
  audioFile={currentQuestion.correctWord.pronunciation}
  // Plays: ithu.mp3 from assets/audio/confusing-pairs/
/>
```

**Audio System:**
- File: `utils/audio.ts`
- Uses: `expo-audio` with `useAudioPlayer` hook
- Maps filename to `require('@/assets/audio/confusing-pairs/ithu.mp3')`

#### 4. User Interface

```typescript
// Options are shuffled so position is random
const options = [correctWord, confusableWord];
const shuffledOptions = /* randomly ordered */

// User sees two buttons:
// [ ithu ] [ athu ]  or  [ athu ] [ ithu ]
```

#### 5. User Interaction

```
1. 🔊 Audio plays: "ithu.mp3"
2. 👀 User sees: [ ithu ] [ athu ] (random order)
3. 👆 User taps: "ithu"
4. ⚙️ System receives: selectedWordId = '595ae022-4413-4371-92a4-a8df5773203b'
```

#### 6. Answer Checking (usePronunciationSession.ts)

```typescript
const submitAnswer = async (selectedWordId: string) => {
  const currentQuestion = session.questions[session.currentQuestionIndex];

  // ✅ THE KEY MATCHING LOGIC
  const isCorrect = selectedWordId === currentQuestion.correctWord.id;

  // Compare:
  // selectedWordId: '595ae022-4413-4371-92a4-a8df5773203b' (ithu)
  // correctWord.id:  '595ae022-4413-4371-92a4-a8df5773203b' (ithu)
  // Result: TRUE ✅

  if (isCorrect) {
    // Track progress
    await PracticeStorage.incrementWordProgress(currentQuestion.correctWord.id);
  } else {
    // Mark as difficult
    await PracticeStorage.addDifficultWord(currentQuestion.correctWord.id);
  }

  return isCorrect;
}
```

#### 7. Result Display

```typescript
// User gets feedback
if (isCorrect) {
  // Show: "✓ Correct! That was ithu"
  // Green checkmark on selected option
} else {
  // Show: "✗ Wrong. The correct word was ithu"
  // Red X on selected, green checkmark on correct
}
```

---

## Key Components

### 1. confusablePairs.ts

**Location:** `data/confusablePairs.ts`

**Purpose:** Defines which word pairs should be tested together

**Structure:**
```typescript
interface ConfusablePair {
  id: string;              // Unique pair identifier
  wordId: string;          // UUID of first word
  confusableWordId: string; // UUID of second word (easily confused with first)
  reason: string;          // Why these words are confusing
}
```

**Example:**
```typescript
{
  id: 'pair-1',
  wordId: '595ae022-4413-4371-92a4-a8df5773203b', // ithu
  confusableWordId: '43847693-3593-46c3-9a02-25a5363c22bf', // athu
  reason: "Minimal vowel difference - 'i' vs 'a' at the start"
}
```

### 2. wordsMalayalam.json

**Location:** `wordsMalayalam.json` (root directory)

**Purpose:** Complete word database with all details

**Structure:**
```json
{
  "id": "595ae022-4413-4371-92a4-a8df5773203b",
  "word": {
    "inTranslit": "ithu",
    "inNativeScript": "ഇത് / ഇതു"
  },
  "meaning": "this",
  "figureOfSpeech": "pronoun",
  "examples": [...],
  "wordLevel": "A1",
  "pronunciation": "ithu.mp3"  // ← Links to audio file
}
```

### 3. usePronunciationSession Hook

**Location:** `hooks/usePronunciationSession.ts`

**Purpose:** Manages the entire practice session lifecycle

**Key Functions:**

| Function | Purpose |
|----------|---------|
| `generateQuestions()` | Creates questions from confusable pairs |
| `getWordById()` | Fetches full word data using UUID |
| `startSession()` | Initializes a new practice session |
| `submitAnswer()` | Checks if selected answer is correct |
| `nextQuestion()` | Moves to next question or completes session |

### 4. Audio System

**Location:** `utils/audio.ts`

**Purpose:** Manages audio playback using expo-audio

**Key Components:**
```typescript
// Audio file mapping
const audioFiles: Record<string, any> = {
  'ithu.mp3': require('@/assets/audio/confusing-pairs/ithu.mp3'),
  'athu.mp3': require('@/assets/audio/confusing-pairs/athu.mp3'),
  // ... all 28 files
};

// Hook for playing audio
export function useWordAudio(filename: string) {
  const audioSource = getAudioSource(filename);
  return useAudioPlayer(audioSource);
}
```

### 5. AudioPlayer Component

**Location:** `components/pronunciation/AudioPlayer.tsx`

**Features:**
- Pulsing animation during playback
- Visual feedback (blue → green button)
- Multiple replay capability
- Completion detection

### 6. Pronunciation Practice Screen

**Location:** `app/pronunciation-practice.tsx`

**Purpose:** Main UI for the practice session

**Key Elements:**
- Audio player
- Word options (two choices)
- Feedback display
- Progress tracking
- Script toggle (Manglish ↔ Malayalam)

---

## Question Generation Logic

**File:** `hooks/usePronunciationSession.ts:28-65`

```typescript
function generateQuestions(
  count: number,
  difficultWordIds?: string[]
): PracticeQuestion[] {
  // 1. Get available pairs
  let availablePairs = [...confusablePairs];

  // 2. Filter for difficult mode (if enabled)
  if (difficultWordIds && difficultWordIds.length > 0) {
    availablePairs = availablePairs.filter(
      (pair) =>
        difficultWordIds.includes(pair.wordId) ||
        difficultWordIds.includes(pair.confusableWordId)
    );
  }

  // 3. Shuffle and select
  const shuffledPairs = shuffleArray(availablePairs);
  const selectedPairs = shuffledPairs.slice(0, Math.min(count, shuffledPairs.length));

  // 4. Create questions from pairs
  return selectedPairs.map((pair, index) => {
    // Fetch full word data
    const correctWord = getWordById(pair.wordId);
    const confusableWord = getWordById(pair.confusableWordId);

    if (!correctWord || !confusableWord) {
      throw new Error(`Word not found for pair: ${pair.id}`);
    }

    // Randomly swap to vary which word is "correct"
    const shouldSwap = Math.random() > 0.5;

    return {
      id: `question-${index}`,
      correctWord: shouldSwap ? confusableWord : correctWord,
      confusableWord: shouldSwap ? correctWord : confusableWord,
      reason: pair.reason,
    };
  });
}
```

**Key Points:**
1. Takes pairs from `confusablePairs.ts`
2. Optionally filters for difficult words
3. Shuffles pairs for randomization
4. Fetches complete word data from JSON
5. Randomly swaps which word is "correct" (50/50 chance)
6. Returns array of questions ready for practice

---

## Audio Playback System

### File Structure

```
assets/
└── audio/
    └── confusing-pairs/
        ├── aaNu.mp3
        ├── ithu.mp3
        ├── athu.mp3
        ├── ethu.mp3
        ├── enthu.mp3
        ├── ente.mp3
        ├── enikku.mp3
        └── ... (28 total files)
```

### Audio Mapping (utils/audio.ts)

```typescript
const audioFiles: Record<string, any> = {
  'aaNu.mp3': require('@/assets/audio/confusing-pairs/aaNu.mp3'),
  'aana.mp3': require('@/assets/audio/confusing-pairs/aana.mp3'),
  'athu.mp3': require('@/assets/audio/confusing-pairs/athu.mp3'),
  // ... all 28 files mapped
};

export function getAudioSource(filename: string) {
  const audioFile = audioFiles[filename];
  if (!audioFile) {
    console.warn(`Audio file not found: ${filename}`);
    return null;
  }
  return audioFile;
}
```

### Playback Flow

```typescript
// 1. Question has pronunciation field
currentQuestion.correctWord.pronunciation = "ithu.mp3"

// 2. AudioPlayer receives filename
<AudioPlayer audioFile="ithu.mp3" />

// 3. useWordAudio hook gets audio source
const player = useWordAudio("ithu.mp3");
// → Looks up: audioFiles['ithu.mp3']
// → Returns: require('@/assets/audio/confusing-pairs/ithu.mp3')

// 4. expo-audio plays the file
player.play(); // Plays the audio
```

### Visual Feedback States

| State | Button Color | Icon | Animation | Text |
|-------|-------------|------|-----------|------|
| Idle | Blue | ▶ play | None | "▶️ Tap to Play" |
| Playing | Green | 🔊 volume-high | Pulsing (1.0→1.15) | "🔊 Playing Audio..." |
| After Play | Blue | ▶ play | None | "✓ You can replay anytime" |

---

## Answer Matching Logic

**File:** `hooks/usePronunciationSession.ts:110-141`

### The Core Matching Function

```typescript
const submitAnswer = useCallback(
  async (selectedWordId: string) => {
    if (!session || session.isComplete) return;

    const currentQuestion = session.questions[session.currentQuestionIndex];

    // ✅ THE KEY LOGIC: Simple UUID comparison
    const isCorrect = selectedWordId === currentQuestion.correctWord.id;

    // Track progress
    if (isCorrect) {
      await PracticeStorage.incrementWordProgress(currentQuestion.correctWord.id);
    } else {
      await PracticeStorage.addDifficultWord(currentQuestion.correctWord.id);
    }

    // Save answer
    const newAnswer: PracticeAnswer = {
      questionId: currentQuestion.id,
      selectedWordId,
      isCorrect,
    };

    setSession((prev) => ({
      ...prev,
      answers: [...prev.answers, newAnswer],
    }));

    return isCorrect;
  },
  [session]
);
```

### Why UUID Comparison Works

**Word IDs are unique identifiers:**
```typescript
// Example IDs from wordsMalayalam.json
const ithu = {
  id: '595ae022-4413-4371-92a4-a8df5773203b',
  word: { inTranslit: 'ithu' }
};

const athu = {
  id: '43847693-3593-46c3-9a02-25a5363c22bf',
  word: { inTranslit: 'athu' }
};
```

**Matching process:**
1. User taps word option → Gets word's UUID
2. System compares: `selectedId === correctWord.id`
3. If match → Correct answer
4. No string comparison of word text needed!

### Progress Tracking

**Correct Answer:**
```typescript
await PracticeStorage.incrementWordProgress(wordId);
// Tracks: How many times this word was answered correctly
```

**Wrong Answer:**
```typescript
await PracticeStorage.addDifficultWord(wordId);
// Adds to "difficult words" list for targeted practice
```

---

## Adding More Questions

To expand the practice session with more questions, add more pairs to `confusablePairs.ts`.

### Step 1: Choose Word Pairs

Use the **Word UUID Reference** (see `docs/WORD_UUID_REFERENCE.md`) to find word IDs.

Example words available:
- aaNu (is/am/are)
- ithu (this)
- athu (that)
- ethu (which)
- enthu (what)
- ente (my)
- enikku (I)
- peru (name)
- padikkuka (to study)
- kazhikkuka (to eat)
- karaNam (because)
- And 17 more...

### Step 2: Add Pairs

**Example 1: Similar sounding verbs**
```typescript
{
  id: 'pair-5',
  wordId: 'c7a81809-ec64-4548-8549-c99bc488a3af', // padikkuka (to study)
  confusableWordId: '2a1b0c9d-8e7f-4d6c-5e4d-3f2e1a0b9c8d', // pattikkuka
  reason: "Both are -uka suffix verbs with similar 'pa' sound"
},
```

**Example 2: Pronunciation variants**
```typescript
{
  id: 'pair-6',
  wordId: 'aa03b3e9-71f8-468d-b832-b3fc0bfb2b3b', // peru (name)
  confusableWordId: '9f8e7d6f-5e4d-4a3f-2b1c-0d9e8f7d6e5f', // peRu-2 (variant)
  reason: "Same word with different pronunciation variants"
},
```

**Example 3: Minimal pairs**
```typescript
{
  id: 'pair-7',
  wordId: '6f9d8e7c-5b4a-4d3e-8c2f-7d6e5a4b3c2d', // palam
  confusableWordId: '8d7e6f5c-4b3a-4e2d-9c1f-8d7e6f5c4d3e', // palli
  reason: "Minimal difference in consonants: 'm' vs 'lli'"
},
```

### Step 3: Verify Audio Files

Make sure both words in the pair have audio files:

```bash
# Check if audio files exist
ls assets/audio/confusing-pairs/padikkuka.mp3
ls assets/audio/confusing-pairs/pattikkuka.mp3
```

### Step 4: Test

Run the app and verify:
- [ ] Questions increase (e.g., 4 → 7 questions)
- [ ] Audio plays correctly for both words
- [ ] Both options are clickable
- [ ] Answer checking works correctly

---

## Code Reference

### File Locations

| Component | File Path |
|-----------|-----------|
| Word Database | `wordsMalayalam.json` |
| Confusable Pairs | `data/confusablePairs.ts` |
| Session Logic | `hooks/usePronunciationSession.ts` |
| Audio Utility | `utils/audio.ts` |
| Audio Player Component | `components/pronunciation/AudioPlayer.tsx` |
| Practice Screen | `app/pronunciation-practice.tsx` |
| Audio Files | `assets/audio/confusing-pairs/*.mp3` |
| Storage Utility | `utils/storage.ts` |

### Key Functions Reference

**usePronunciationSession.ts:**
```typescript
// Generate questions from pairs
function generateQuestions(count: number, difficultWordIds?: string[]): PracticeQuestion[]

// Get word by UUID
function getWordById(id: string): Word | undefined

// Shuffle array
function shuffleArray<T>(array: T[]): T[]

// Start new session
const startSession = (scriptType?: ScriptType) => Promise<void>

// Check answer
const submitAnswer = (selectedWordId: string) => Promise<boolean>

// Move to next question
const nextQuestion = () => Promise<void>
```

**audio.ts:**
```typescript
// Get audio source from filename
export function getAudioSource(filename: string): any | null

// Hook for audio playback
export function useWordAudio(filename: string): AudioPlayer
```

### Type Definitions

```typescript
interface Word {
  id: string;
  word: {
    inTranslit: string;
    inNativeScript: string;
  };
  meaning: string;
  figureOfSpeech: string;
  examples: Array<{
    inTranslit: string;
    translation: string;
    inNativeScript: string;
  }>;
  wordLevel: string;
  pronunciation: string;
}

interface ConfusablePair {
  id: string;
  wordId: string;
  confusableWordId: string;
  reason: string;
}

interface PracticeQuestion {
  id: string;
  correctWord: Word;
  confusableWord: Word;
  reason: string;
}

interface PracticeAnswer {
  questionId: string;
  selectedWordId: string;
  isCorrect: boolean;
}

interface PracticeSession {
  questions: PracticeQuestion[];
  answers: PracticeAnswer[];
  currentQuestionIndex: number;
  scriptType: 'manglish' | 'malayalam';
  isComplete: boolean;
}
```

---

## Summary Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ 1. confusablePairs.ts                                       │
│    Defines: ithu ↔ athu                                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. generateQuestions()                                      │
│    - Fetches full word data from wordsMalayalam.json       │
│    - Randomly assigns which is "correct"                   │
│    - Creates question object                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Practice Screen (pronunciation-practice.tsx)             │
│    - Shows current question                                 │
│    - Plays audio: correctWord.pronunciation                │
│    - Displays two options (shuffled order)                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. AudioPlayer Component                                    │
│    - Loads: utils/audio.ts → getAudioSource('ithu.mp3')   │
│    - Plays: expo-audio → useAudioPlayer(audioSource)       │
│    - Visual: Blue → Green button with pulsing              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. User Interaction                                         │
│    - Hears audio: "ithu"                                   │
│    - Sees options: [ithu] [athu]                           │
│    - Taps one option → selectedWordId                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. submitAnswer()                                           │
│    - Compares: selectedWordId === correctWord.id           │
│    - If match: ✅ Correct! Increment progress              │
│    - If not:   ❌ Wrong! Add to difficult words            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Show Feedback & Move to Next Question                   │
│    - Display result                                         │
│    - Show explanation (pair.reason)                        │
│    - nextQuestion() → Repeat from step 3                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Need Help?

- **Word UUID Reference**: See `docs/WORD_UUID_REFERENCE.md` for all word IDs
- **Content Management**: See `docs/CONTENT_MANAGEMENT_GUIDE.md` for adding/editing words
- **Audio Issues**: Check that:
  - Word has `pronunciation` field in `wordsMalayalam.json`
  - Audio file exists in `assets/audio/confusing-pairs/`
  - Filename is mapped in `utils/audio.ts`

---

**Last Updated:** 2026-01-16
