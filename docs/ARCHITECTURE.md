# RN Bhasha Trainer - Architecture Documentation

> **Last Updated:** February 14, 2026
> **Version:** 1.0.0

## Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Navigation Architecture](#navigation-architecture)
5. [State Management](#state-management)
6. [Data Models & Types](#data-models--types)
7. [Core Features](#core-features)
8. [Audio System](#audio-system)
9. [Storage & Persistence](#storage--persistence)
10. [Component Architecture](#component-architecture)
11. [Code Conventions & Patterns](#code-conventions--patterns)
12. [Development Workflow](#development-workflow)
13. [Deployment & Build](#deployment--build)
14. [Related Documentation](#related-documentation)

---

## System Overview

**RN Bhasha Trainer** is a Malayalam language learning application focused on pronunciation practice. The app helps learners distinguish between confusable Malayalam word pairs through audio-based interactive exercises.

### Core Value Proposition

- **Offline-First**: All word data and audio files bundled with app
- **Audio-Centric**: Pronunciation practice driven by native audio playback
- **Confusable Pairs Focus**: Targets commonly confused words (e.g., retroflex vs. regular consonants)
- **Progress Tracking**: Mastery-based word states (new → learning → mastered)

### Target Platforms

- iOS (via Expo)
- Android (via Expo)
- Web (via Expo Web)

### High-Level User Flow

```
┌─────────────┐
│  Home Screen│
│             │
│  [Start     │
│   Practice] │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Practice Session    │
│                     │
│ 1. Play Audio       │
│ 2. Select Answer    │
│ 3. View Feedback    │
│ 4. Next Question    │
└──────┬──────────────┘
       │
       ▼
┌─────────────┐
│   Results   │
│   Screen    │
│             │
│  Score: 4/5 │
└─────────────┘
```

---

## Technology Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React Native | 0.81.5 | Cross-platform mobile development |
| **Build System** | Expo | ~54.0.31 | Build toolchain and native modules |
| **Language** | TypeScript | ~5.9.2 | Type-safe JavaScript |
| **Routing** | Expo Router | ~6.0.21 | File-based navigation |
| **Audio** | expo-audio | ~1.1.1 | Audio playback |
| **Storage** | AsyncStorage | ^2.2.0 | Local data persistence |
| **Navigation** | React Navigation | ^7.1.8 | Navigation primitives |
| **UI** | React Native Core | 19.1.0 | Built-in components |
| **Icons** | Expo Vector Icons | ^15.0.2 | Icon library |

---

## Project Structure

```
/rn-bhasha-trainer
├── /app                    # Expo Router screens (file-based routing)
│   ├── /(tabs)            # Tab navigation group
│   │   ├── _layout.tsx    # Tab navigator config
│   │   ├── index.tsx      # Home screen
│   │   ├── explore.tsx    # Explore screen
│   │   └── words-lib.tsx  # Words library screen
│   ├── _layout.tsx        # Root stack navigator
│   ├── pronunciation-practice.tsx  # Practice session screen
│   └── modal.tsx          # Modal screen
│
├── /components             # UI components
│   ├── /pronunciation     # Practice-specific components
│   │   ├── AudioPlayer.tsx      # Audio playback button
│   │   ├── WordOption.tsx       # Selectable word button
│   │   ├── FeedbackCard.tsx     # Post-answer explanation
│   │   ├── ScriptToggle.tsx     # Manglish/Malayalam toggle
│   │   └── SessionResults.tsx   # Results summary
│   ├── /ui                # Reusable UI primitives
│   │   ├── IconSymbol.tsx
│   │   └── Collapsible.tsx
│   └── ...                # Themed components
│
├── /hooks                  # Custom React hooks
│   ├── usePronunciationSession.ts  # Session lifecycle
│   ├── useWordProgress.ts          # Progress calculations
│   └── use-color-scheme.ts         # Theme detection
│
├── /utils                  # Utility functions
│   ├── storage.ts         # AsyncStorage wrapper (PracticeStorage)
│   └── audio.ts           # Audio file mapping (getAudioSource)
│
├── /data                   # Static data
│   └── confusablePairs.ts # Confusable word pair definitions
│
├── /types                  # TypeScript interfaces
│   └── pronunciation.ts   # Core data types
│
├── /constants              # App constants
│   └── theme.ts           # Colors, fonts
│
├── /assets                 # Static assets
│   ├── /audio             # Audio files
│   │   └── /confusing-pairs/*.mp3
│   ├── /images            # App images
│   └── /fonts             # Custom fonts
│
├── /docs                   # Documentation
│   ├── ARCHITECTURE.md    # This file
│   ├── PRONUNCIATION_FEATURE.md
│   ├── AUDIO_SYSTEM_GUIDE.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── ...
│
├── wordsMalayalam.json     # Word database (1000+ words)
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript config
```

---

## Navigation Architecture

### File-Based Routing with Expo Router

RN Bhasha Trainer uses **Expo Router v6** for file-based routing. File structure directly maps to app navigation:

```
Navigation Hierarchy:

Root Stack (app/_layout.tsx)
├── (tabs)                  # Tab Navigator Group
│   ├── index               # → Home Screen (/)
│   ├── explore             # → Explore Screen (/explore)
│   └── words-lib           # → Words Library (/words-lib)
│
├── pronunciation-practice  # → Practice Screen (/pronunciation-practice)
└── modal                   # → Modal Screen (/modal)
```

### Root Stack Navigator

From `/app/_layout.tsx`:

```tsx
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen
          name="pronunciation-practice"
          options={{
            title: 'Practice',
            headerBackTitle: 'Home',
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
```

### Tab Navigator

From `/app/(tabs)/_layout.tsx`:

```tsx
<Tabs
  screenOptions={{
    tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
    headerShown: false,
    tabBarButton: HapticTab,
    tabBarStyle: { display: 'none' }, // Hidden in current version
  }}
>
  <Tabs.Screen name="index" options={{ title: "Home" }} />
  <Tabs.Screen name="explore" options={{ title: "Explore" }} />
  <Tabs.Screen name="words-lib" options={{ title: "Words" }} />
</Tabs>
```

### Navigation Patterns

**Push to Practice Screen:**
```tsx
import { router } from 'expo-router';

// Navigate to practice
router.push('/pronunciation-practice');

// Navigate with params
router.push('/pronunciation-practice?mode=difficult');
```

**Go Back:**
```tsx
router.back();
```

---

## State Management

### Philosophy: Local-First with React Hooks

RN Bhasha Trainer does **not** use Redux, MobX, or other global state libraries. All state is managed through:

- **React hooks** (useState, useEffect, useCallback)
- **Custom hooks** for complex logic encapsulation
- **AsyncStorage** for persistence

### State Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│           React Component Layer                 │
│  (pronunciation-practice.tsx)                   │
│                                                  │
│  - Phase state (loading/practice/feedback)      │
│  - UI state (selectedWordId, hasHeardAudio)     │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│         Custom Hooks Layer                      │
│                                                  │
│  usePronunciationSession()                      │
│  ├─ Session generation                          │
│  ├─ Answer submission                           │
│  └─ Progress tracking                           │
│                                                  │
│  useWordAudio(filename)                         │
│  └─ Audio playback wrapper                      │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│         Persistence Layer                       │
│                                                  │
│  PracticeStorage (utils/storage.ts)             │
│  └─ AsyncStorage wrapper                        │
└─────────────────────────────────────────────────┘
```

### Key Custom Hooks

#### 1. `usePronunciationSession`

**Location:** `/hooks/usePronunciationSession.ts`

**Purpose:** Manages complete practice session lifecycle

**State:**
```tsx
{
  session: PracticeSession | null,     // Current session
  isLoading: boolean,                   // Loading state
  currentQuestion: PracticeQuestion,    // Active question
  currentAnswer: PracticeAnswer,        // User's answer
  score: number,                        // Correct count
  hasAnswered: boolean,                 // Answer submitted
  difficultWordIds: string[]            // Tracked difficult words
}
```

**Key Methods:**
- `startSession(scriptType)` - Initialize new session with generated questions
- `submitAnswer(wordId)` - Submit answer and update progress
- `nextQuestion()` - Advance to next question or complete session
- `toggleScript()` - Switch between Manglish ↔ Malayalam
- `resetSession()` - Clear session state

**Session Flow:**

```
┌─────────────────┐
│  startSession() │
│                 │
│  Generate 5-10  │
│  questions from │
│  confusable     │
│  pairs          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐        ┌──────────────────┐
│  Practice Phase │───────▶│ submitAnswer()   │
│                 │        │                  │
│  Audio played   │        │ - Check correct  │
│  Answer select  │        │ - Update progress│
└─────────────────┘        └────────┬─────────┘
                                    │
                                    ▼
                           ┌──────────────────┐
                           │  Feedback Phase  │
                           │                  │
                           │  Show result +   │
                           │  explanation     │
                           └────────┬─────────┘
                                    │
                                    ▼
                           ┌──────────────────┐
                           │  nextQuestion()  │
                           │                  │
                           │  Advance or      │
                           │  complete        │
                           └──────────────────┘
```

#### 2. `useWordProgress`

**Location:** `/hooks/useWordProgress.ts` (inferred)

**Purpose:** Calculate word mastery statistics

**Word States:**
- **new**: 0 correct answers
- **learning**: 1-2 correct answers
- **mastered**: 3+ correct answers

**Logic** (from `/utils/storage.ts`):
```tsx
export function getWordState(correctCount: number): WordState {
  if (correctCount === 0) return 'new';
  if (correctCount < 3) return 'learning';
  return 'mastered';
}
```

#### 3. `useWordAudio`

**Location:** `/utils/audio.ts`

**Purpose:** Wrapper for expo-audio playback

```tsx
export function useWordAudio(filename: string | undefined) {
  const audioSource = filename ? getAudioSource(filename) : null;
  return useAudioPlayer(audioSource);
}
```

**Usage:**
```tsx
const player = useWordAudio('ithu.mp3');

// Play audio
player.play();

// Seek to beginning
player.seekTo(0);
```

---

## Data Models & Types

All core types are defined in `/types/pronunciation.ts`.

### Core Interfaces

#### `Word` - Base Word Structure

```tsx
export interface Word {
  id: string;                    // UUID
  word: {
    inTranslit: string;          // "ithu" (Manglish)
    inNativeScript: string;      // "ഇത്" (Malayalam)
  };
  meaning: string;               // "this"
  figureOfSpeech: string;        // "pronoun"
  examples: Array<{
    inTranslit: string;
    translation: string;
    inNativeScript: string;
  }>;
  wordLevel: string;             // CEFR level: A1, A2, B1, B2
  pronunciation: string;         // Audio filename: "ithu.mp3"
}
```

#### `ConfusablePair` - Word Pair Relationship

```tsx
export interface ConfusablePair {
  id: string;                    // "pair-1"
  wordId: string;                // UUID of first word
  confusableWordId: string;      // UUID of second word
  reason: string;                // Linguistic explanation
}
```

**Example:**
```tsx
{
  id: "pair-2",
  wordId: "595ae022-4413-4371-92a4-a8df5773203b",  // ithu (this)
  confusableWordId: "43847693-3593-46c3-9a02-25a5363c22bf",  // athu (that)
  reason: "Minimal vowel difference - 'i' vs 'a' at the start"
}
```

#### `PracticeQuestion` - Question Structure

```tsx
export interface PracticeQuestion {
  id: string;                    // "question-0"
  correctWord: Word;             // The word in the audio
  confusableWord: Word;          // The alternate option
  reason: string;                // Why they're confusable
}
```

#### `PracticeSession` - Session State

```tsx
export interface PracticeSession {
  questions: PracticeQuestion[];
  answers: PracticeAnswer[];
  currentQuestionIndex: number;
  scriptType: ScriptType;        // 'manglish' | 'malayalam'
  isComplete: boolean;
}
```

#### `WordProgress` - Progress Tracking

```tsx
export interface WordProgress {
  wordId: string;
  correctCount: number;          // Number of times answered correctly
  lastPracticed: string;         // ISO date
}
```

#### `PersistedPracticeData` - AsyncStorage Data

```tsx
export interface PersistedPracticeData {
  difficultWordIds: string[];    // Words to review
  sessionHistory: Array<{
    date: string;
    score: number;
    totalQuestions: number;
  }>;
  wordProgress?: Record<string, WordProgress>;
}
```

### Type Relationships

```
┌──────────────────────────────────────────────┐
│            wordsMalayalam.json               │
│         (1000+ Word objects)                 │
└────────────────┬─────────────────────────────┘
                 │
                 │ Referenced by
                 ▼
┌──────────────────────────────────────────────┐
│          confusablePairs.ts                  │
│      (28 ConfusablePair objects)             │
│                                               │
│  Uses wordId + confusableWordId              │
└────────────────┬─────────────────────────────┘
                 │
                 │ Generates
                 ▼
┌──────────────────────────────────────────────┐
│         PracticeQuestion[]                   │
│     (Session questions array)                │
│                                               │
│  correctWord: Word                           │
│  confusableWord: Word                        │
└────────────────┬─────────────────────────────┘
                 │
                 │ Wrapped in
                 ▼
┌──────────────────────────────────────────────┐
│         PracticeSession                      │
│     (Active session state)                   │
└──────────────────────────────────────────────┘
```

---

## Core Features

### 7.1 Pronunciation Practice System

> **📖 Reference:** See [PRONUNCIATION_FEATURE.md](./PRONUNCIATION_FEATURE.md) for detailed user flow

**Session Lifecycle Phases:**

1. **Loading** → Generate questions from confusable pairs
2. **Practice** → Play audio → User selects answer
3. **Feedback** → Show correctness with explanation
4. **Next** → Advance to next question
5. **Results** → Display score and session summary

**Phase State Machine:**

From `/app/pronunciation-practice.tsx`:

```tsx
type Phase = "loading" | "practice" | "feedback" | "results";

// Phase transitions based on session state
useEffect(() => {
  if (isLoading) {
    setPhase("loading");
  } else if (session?.isComplete) {
    setPhase("results");
  } else if (hasAnswered) {
    setPhase("feedback");
  } else if (session) {
    setPhase("practice");
  }
}, [isLoading, session, hasAnswered]);
```

**Key Files:**

- `/app/pronunciation-practice.tsx` - Main screen with phase state machine
- `/hooks/usePronunciationSession.ts` - Session logic and question generation
- `/components/pronunciation/AudioPlayer.tsx` - Audio playback UI
- `/components/pronunciation/WordOption.tsx` - Word selection buttons
- `/components/pronunciation/FeedbackCard.tsx` - Post-answer feedback
- `/components/pronunciation/SessionResults.tsx` - End-of-session summary

**Question Generation Logic:**

From `/hooks/usePronunciationSession.ts`:

```tsx
function generateQuestions(
  count: number,
  difficultWordIds?: string[]
): PracticeQuestion[] {
  let availablePairs = [...confusablePairs];

  // Filter to difficult words if in difficult mode
  if (difficultWordIds && difficultWordIds.length > 0) {
    availablePairs = availablePairs.filter(
      (pair) =>
        difficultWordIds.includes(pair.wordId) ||
        difficultWordIds.includes(pair.confusableWordId)
    );
  }

  // Shuffle and select
  const shuffledPairs = shuffleArray(availablePairs);
  const selectedPairs = shuffledPairs.slice(0, Math.min(count, shuffledPairs.length));

  // Randomly swap correct/confusable for variety
  return selectedPairs.map((pair, index) => {
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

### 7.2 Progress Tracking

**Word Mastery Calculation:**

- **New**: Never answered correctly (correctCount = 0)
- **Learning**: Answered correctly 1-2 times
- **Mastered**: Answered correctly 3+ times

**Difficult Words Tracking:**

When a user answers incorrectly, the word is automatically added to their difficult words list:

```tsx
const submitAnswer = async (selectedWordId: string) => {
  const isCorrect = selectedWordId === currentQuestion.correctWord.id;

  if (isCorrect) {
    await PracticeStorage.incrementWordProgress(currentQuestion.correctWord.id);
  } else {
    await PracticeStorage.addDifficultWord(currentQuestion.correctWord.id);
  }
};
```

**Session History:**

All completed sessions are persisted with score and date:

```tsx
// On session completion
await PracticeStorage.saveSessionResult(score, session.questions.length);
```

**Key Files:**
- `/hooks/useWordProgress.ts` - Progress calculations
- `/utils/storage.ts` - Persistence layer

### 7.3 Word Library

**Data Source:** `/wordsMalayalam.json`

**Structure:**
- 1000+ Malayalam words
- UUID-based identification
- CEFR word levels (A1, A2, B1, B2)
- Native script + transliteration
- Example sentences with translations

**UUID Identification:**

All words use UUIDs for stable identification across app versions:
```json
{
  "id": "595ae022-4413-4371-92a4-a8df5773203b",
  "word": {
    "inTranslit": "ithu",
    "inNativeScript": "ഇത്"
  }
}
```

> **📖 Reference:** See [WORD_UUID_REFERENCE.md](./WORD_UUID_REFERENCE.md) for complete word ID mapping

---

## Audio System

> **📖 Reference:** See [AUDIO_SYSTEM_GUIDE.md](./AUDIO_SYSTEM_GUIDE.md) for implementation details

### Architecture Overview

```
┌──────────────────────────────────────────────┐
│         Component Layer                      │
│  <AudioPlayer audioFile="ithu.mp3" />        │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│         Hook Wrapper                         │
│  useWordAudio(filename)                      │
│  └─ useAudioPlayer(audioSource)              │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│         Audio Mapping                        │
│  getAudioSource(filename)                    │
│  └─ require('@/assets/audio/...')            │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│         expo-audio v1.1.1                    │
│  (Native audio playback)                     │
└──────────────────────────────────────────────┘
```

### Audio Files Location

All audio files stored at: `/assets/audio/confusing-pairs/*.mp3`

### Audio Mapping Function

From `/utils/audio.ts`:

```tsx
const audioFiles: Record<string, any> = {
  "ithu.mp3": require("@/assets/audio/confusing-pairs/ithu.mp3"),
  "athu.mp3": require("@/assets/audio/confusing-pairs/athu.mp3"),
  // ... 30+ audio files
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

### Error Handling Strategy

**Graceful Degradation:**

```tsx
const handleAudioError = (error: Error) => {
  console.error("Audio playback error:", error);
  setAudioError("Audio failed to play. You can still select an answer.");
  // Enable options even on audio failure
  setHasHeardAudio(true);
};
```

Users can continue practice even if audio fails to load.

---

## Storage & Persistence

### AsyncStorage Configuration

**Storage Key:** `"pronunciation_practice_data"`

**What Gets Persisted:**

```tsx
{
  difficultWordIds: string[],              // User's difficult words
  sessionHistory: Array<{                  // Practice history
    date: string,
    score: number,
    totalQuestions: number
  }>,
  wordProgress: Record<string, {           // Individual word stats
    wordId: string,
    correctCount: number,
    lastPracticed: string
  }>
}
```

### PracticeStorage API

**Location:** `/utils/storage.ts`

**Methods:**

```tsx
// Difficult Words Management
PracticeStorage.getDifficultWords(): Promise<string[]>
PracticeStorage.addDifficultWord(wordId: string): Promise<void>
PracticeStorage.removeDifficultWord(wordId: string): Promise<void>
PracticeStorage.clearDifficultWords(): Promise<void>

// Session History
PracticeStorage.saveSessionResult(score: number, totalQuestions: number): Promise<void>
PracticeStorage.getSessionHistory(): Promise<SessionHistory[]>

// Word Progress
PracticeStorage.getWordProgress(): Promise<Record<string, WordProgress>>
PracticeStorage.incrementWordProgress(wordId: string): Promise<void>
```

**Example Usage:**

```tsx
// After correct answer
await PracticeStorage.incrementWordProgress(wordId);

// After incorrect answer
await PracticeStorage.addDifficultWord(wordId);

// On session complete
await PracticeStorage.saveSessionResult(4, 5); // 4 out of 5 correct
```

**Data Migration:**

The storage layer handles backward compatibility:

```tsx
async function getData(): Promise<PersistedPracticeData> {
  const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
  if (jsonValue != null) {
    const parsed = JSON.parse(jsonValue);
    // Ensure wordProgress exists for older data
    return {
      ...parsed,
      wordProgress: parsed.wordProgress ?? {},
    };
  }
  return defaultData;
}
```

---

## Component Architecture

### Component Organization Strategy

**1. Feature Components** (`/components/pronunciation`)
- Domain-specific to pronunciation practice
- Tightly coupled to practice flow
- Examples: AudioPlayer, WordOption, FeedbackCard

**2. UI Primitives** (`/components/ui`)
- Reusable across features
- Generic, composition-friendly
- Examples: IconSymbol, Collapsible

**3. Themed Components** (root `/components`)
- Light/dark mode aware
- App-wide styling
- Examples: ThemedView, ThemedText

### Key Pronunciation Components

#### AudioPlayer

**File:** `/components/pronunciation/AudioPlayer.tsx`

**Props:**
```tsx
interface AudioPlayerProps {
  audioFile?: string;              // "ithu.mp3"
  onPlay?: () => void;
  onPlaybackComplete?: () => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
}
```

**Features:**
- Pulsing animation during playback
- Visual state: blue (ready) → green (playing)
- Fallback timeout (2.5s) for completion
- Error handling with user feedback

**State Management:**
```tsx
const [isPlaying, setIsPlaying] = useState(false);
const [hasPlayed, setHasPlayed] = useState(false);
const pulseAnim = useRef(new Animated.Value(1)).current;
```

#### WordOption

**File:** `/components/pronunciation/WordOption.tsx`

**Props:**
```tsx
interface WordOptionProps {
  word: Word;
  scriptType: ScriptType;          // 'manglish' | 'malayalam'
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;             // Show feedback colors
  onSelect: () => void;
  disabled: boolean;
}
```

**Visual States:**
- Default: Gray border
- Selected (before answer): Blue border
- Correct (after answer): Green background
- Incorrect (after answer): Red background

#### FeedbackCard

**File:** `/components/pronunciation/FeedbackCard.tsx`

**Purpose:** Display post-answer explanation

**Content:**
- Correctness indicator (✓ or ✗)
- Correct word display
- Linguistic reason for confusion
- Example sentence

#### ScriptToggle

**File:** `/components/pronunciation/ScriptToggle.tsx`

**Purpose:** Switch between Manglish ↔ Malayalam script

```tsx
<ScriptToggle
  currentScript={session.scriptType}
  onToggle={toggleScript}
/>
```

#### SessionResults

**File:** `/components/pronunciation/SessionResults.tsx`

**Purpose:** End-of-session summary

**Features:**
- Score display (e.g., "4 out of 5")
- Performance message
- Action buttons: Restart, Practice Difficult, Go Home

### Component Composition Example

Practice screen component hierarchy:

```
PronunciationPracticeScreen
├── ScriptToggle
├── AudioPlayer
│   └── Pressable (play button)
│       └── Animated.View (pulse animation)
│           └── Ionicons (play/volume icon)
├── WordOption (×2)
│   └── Pressable
│       └── Text (word display)
├── FeedbackCard
│   └── View
│       ├── Text (explanation)
│       └── Text (example)
└── SessionResults
    └── View
        ├── Text (score)
        └── Button actions
```

---

## Code Conventions & Patterns

### File Naming

- **Files:** `kebab-case.tsx` (e.g., `pronunciation-practice.tsx`)
- **Components:** `PascalCase.tsx` (e.g., `AudioPlayer.tsx`)
- **Utilities:** `camelCase.ts` (e.g., `storage.ts`)

### Import Aliases

The `@/` alias maps to project root:

```tsx
import { Word } from '@/types/pronunciation';
import { PracticeStorage } from '@/utils/storage';
import { AudioPlayer } from '@/components/pronunciation/AudioPlayer';
```

**Configuration** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### TypeScript Patterns

**Strict Mode:** No `any` types

```tsx
// ❌ Bad
const data: any = await fetchData();

// ✅ Good
const data: Word[] = await fetchData();
```

**Interface over Type:**

```tsx
// ✅ Preferred for object shapes
export interface Word { ... }

// Use `type` for unions/aliases
export type ScriptType = 'manglish' | 'malayalam';
```

### Component Pattern

**Functional Components + Hooks:**

```tsx
interface MyComponentProps {
  title: string;
  onPress: () => void;
}

export function MyComponent({ title, onPress }: MyComponentProps) {
  const [count, setCount] = useState(0);

  const handlePress = useCallback(() => {
    setCount(c => c + 1);
    onPress();
  }, [onPress]);

  return (
    <Pressable onPress={handlePress}>
      <Text>{title} - {count}</Text>
    </Pressable>
  );
}
```

### Styling Pattern

**StyleSheet.create():**

```tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
});
```

### Error Handling

**Try/Catch with Graceful Fallbacks:**

```tsx
async function loadData() {
  try {
    const data = await PracticeStorage.getDifficultWords();
    setDifficultWords(data);
  } catch (error) {
    console.error('Failed to load difficult words:', error);
    // Graceful fallback
    setDifficultWords([]);
  }
}
```

### Async Patterns

**useCallback with Async Functions:**

```tsx
const startSession = useCallback(
  async (scriptType: ScriptType = 'manglish') => {
    setIsLoading(true);
    try {
      const questions = generateQuestions(questionCount);
      setSession({ questions, ... });
    } finally {
      setIsLoading(false);
    }
  },
  [questionCount]
);
```

---

## Development Workflow

### Setup

```bash
# Install dependencies
npm install

# Start development server
npx expo start
```

### Running the App

**iOS Simulator:**
```bash
npm run ios
# or press 'i' in Expo dev server
```

**Android Emulator:**
```bash
npm run android
# or press 'a' in Expo dev server
```

**Expo Go App:**
1. Install Expo Go on your device
2. Scan QR code from dev server
3. App loads over network

**Web:**
```bash
npm run web
# or press 'w' in Expo dev server
```

### Adding New Words

> **📖 Reference:** See [CONTENT_MANAGEMENT_GUIDE.md](./CONTENT_MANAGEMENT_GUIDE.md)

1. Add word entry to `/wordsMalayalam.json`
2. Generate UUID for word ID
3. Add audio file to `/assets/audio/confusing-pairs/`
4. Update audio mapping in `/utils/audio.ts`
5. Create confusable pair in `/data/confusablePairs.ts`

### Adding New Features

**Follow Existing Patterns:**

1. **New Screen:** Add file to `/app/`
2. **New Component:** Add to `/components/[feature]/`
3. **New Hook:** Add to `/hooks/`
4. **New Type:** Add to `/types/`

**Example: Adding a Vocabulary Quiz Feature**

```
1. Create /app/vocabulary-quiz.tsx
2. Create /components/vocabulary/QuizCard.tsx
3. Create /hooks/useVocabularyQuiz.ts
4. Add types to /types/vocabulary.ts
5. Update navigation in /app/_layout.tsx
```

### Testing

**Current State:** Manual testing only

**Test Checklist:**
- [ ] Audio playback works on all platforms
- [ ] Practice session completes successfully
- [ ] Progress persists after app restart
- [ ] Script toggle works correctly
- [ ] Difficult words tracking functions
- [ ] Results screen displays accurate score

---

## Deployment & Build

> **📖 Reference:** See detailed guides:
> - [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - iOS deployment
> - [ANDROID_DEPLOYMENT_GUIDE.md](./ANDROID_DEPLOYMENT_GUIDE.md) - Android deployment

### Expo Build Process

**Build for iOS:**
```bash
eas build --platform ios
```

**Build for Android:**
```bash
eas build --platform android
```

**Configuration:** `/eas.json`

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

### Platform-Specific Considerations

**iOS:**
- Apple Developer account required
- Code signing certificates
- App Store Connect setup

**Android:**
- Google Play Console account
- Keystore management
- App signing configuration

**Web:**
- Static build: `npx expo export:web`
- Deploy to Vercel, Netlify, etc.

---

## Related Documentation

### Feature Guides

- **[PRONUNCIATION_FEATURE.md](./PRONUNCIATION_FEATURE.md)** - Detailed pronunciation practice flow
- **[AUDIO_SYSTEM_GUIDE.md](./AUDIO_SYSTEM_GUIDE.md)** - Audio implementation and troubleshooting
- **[CONTENT_MANAGEMENT_GUIDE.md](./CONTENT_MANAGEMENT_GUIDE.md)** - Managing word data and audio

### Reference

- **[WORD_UUID_REFERENCE.md](./WORD_UUID_REFERENCE.md)** - Complete word ID mapping

### Deployment

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - iOS build and deployment
- **[ANDROID_DEPLOYMENT_GUIDE.md](./ANDROID_DEPLOYMENT_GUIDE.md)** - Android build and deployment

### Planning Documents

- **[pron-feature-plan.md](./pron-feature-plan.md)** - Original pronunciation feature plan
- **[word-states-plan.md](./word-states-plan.md)** - Word state system design

---

## Appendix: Quick Reference

### Common File Paths

| Purpose | Path |
|---------|------|
| Practice Screen | `/app/pronunciation-practice.tsx` |
| Session Hook | `/hooks/usePronunciationSession.ts` |
| Storage API | `/utils/storage.ts` |
| Audio Utils | `/utils/audio.ts` |
| Type Definitions | `/types/pronunciation.ts` |
| Confusable Pairs | `/data/confusablePairs.ts` |
| Word Database | `/wordsMalayalam.json` |
| Audio Files | `/assets/audio/confusing-pairs/*.mp3` |

### Key Commands

```bash
# Development
npm start                 # Start Expo dev server
npm run ios              # Run on iOS simulator
npm run android          # Run on Android emulator
npm run web              # Run web version

# Build
eas build -p ios         # Build for iOS
eas build -p android     # Build for Android

# Linting
npm run lint             # Run ESLint
```

### Architecture at a Glance

```
┌─────────────────────────────────────────────────────┐
│                  User Interface                     │
│     (Screens: Home, Practice, Results)              │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│              Component Layer                        │
│  (AudioPlayer, WordOption, FeedbackCard)            │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│               Hook Layer                            │
│  (usePronunciationSession, useWordAudio)            │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│           Storage & Data Layer                      │
│  (PracticeStorage, confusablePairs, words)          │
└─────────────────────────────────────────────────────┘
```

---

**End of Architecture Documentation**

For questions or contributions, please refer to the main README.md or open an issue on GitHub.
