# Content Management Guide - Bhasha Trainer

A complete guide for managing word content, recording audio, and making the app fully functional.

---

## Table of Contents

1. [Content Structure Overview](#1-content-structure-overview)
2. [Word Data: Adding & Editing Words](#2-word-data-adding--editing-words)
3. [Recording Audio Files](#3-recording-audio-files)
4. [Audio Storage Options](#4-audio-storage-options)
5. [Connecting Audio to Words](#5-connecting-audio-to-words)
6. [Code Changes for Audio Playback](#6-code-changes-for-audio-playback)
7. [Content Workflow Summary](#7-content-workflow-summary)

---

## 1. Content Structure Overview

### Current File Structure

```
rn-bhasha-trainer/
├── wordsMalayalam.json          # Main word database
├── data/
│   └── confusablePairs.ts       # Word pairs for practice questions
└── assets/
    └── audio/                   # (NEW) Audio files go here
        ├── words/               # Individual word pronunciations
        └── examples/            # (Optional) Example sentence audio
```

### Word Data Fields Explained

Each word in `wordsMalayalam.json` has:

| Field | Purpose | Example |
|-------|---------|---------|
| `id` | Unique identifier (UUID) | "f7ec48ae-43cc-4258-904a-a69c85705f19" |
| `word.inTranslit` | Romanized spelling (Manglish) | "ithu" |
| `word.inNativeScript` | Malayalam script | "ഇത്" |
| `meaning` | English translation | "this" |
| `figureOfSpeech` | Grammar category | "pronoun", "verb", "noun" |
| `examples` | Usage examples (array) | See below |
| `wordLevel` | CEFR difficulty level | "A1", "A2", "B1" |
| `pronunciation` | Audio file path (currently empty) | "./assets/audio/words/ithu.mp3" |

---

## 2. Word Data: Adding & Editing Words

### File Location

**Main word database:** `wordsMalayalam.json` (root directory)

### Adding a New Word

1. Open `wordsMalayalam.json`
2. Add a new entry to the `wordsMalayalam` array:

```json
{
  "id": "GENERATE-NEW-UUID",
  "word": {
    "inTranslit": "nanni",
    "inNativeScript": "നന്ദി"
  },
  "meaning": "thank you",
  "figureOfSpeech": "interjection",
  "examples": [
    {
      "inTranslit": "Sahaayathinu nanni",
      "translation": "Thank you for the help",
      "inNativeScript": "സഹായത്തിനു നന്ദി"
    }
  ],
  "wordLevel": "A1",
  "pronunciation": ""
}
```

### Generating UUIDs

Use one of these methods:

**Option A: Online generator**
- Go to [uuidgenerator.net](https://www.uuidgenerator.net/)
- Copy a new UUID for each word

**Option B: Command line**
```bash
# Mac/Linux
uuidgen

# Or use Node.js
node -e "console.log(require('crypto').randomUUID())"
```

**Option C: VS Code extension**
- Install "UUID Generator" extension
- Use `Cmd+Shift+P` → "Generate UUID"

### Editing Existing Words

Find the word by its `inTranslit` value and edit the fields:

```json
{
  "id": "595ae022-4413-4371-92a4-a8df5773203b",
  "word": {
    "inTranslit": "ithu",
    "inNativeScript": "ഇത് / ഇതു"
  },
  "meaning": "this",                    // ← Edit meaning here
  "figureOfSpeech": "pronoun",          // ← Edit grammar type here
  "examples": [                         // ← Edit/add examples here
    {
      "inTranslit": "Ithu car aanu",
      "translation": "This is a car",
      "inNativeScript": "ഇത് കാർ ആണ്"
    },
    {
      // Add more examples...
    }
  ],
  "wordLevel": "A1",                    // ← Edit difficulty level
  "pronunciation": ""                   // ← Add audio path later
}
```

### Word Level Guidelines (CEFR)

| Level | Description | Word Examples |
|-------|-------------|---------------|
| A1 | Beginner - Basic words | this, that, I, you, is, house |
| A2 | Elementary - Common words | want, go, come, eat, work |
| B1 | Intermediate - Conversational | because, although, should |
| B2 | Upper Intermediate - Complex | nevertheless, circumstances |

### Adding Confusable Pairs

When adding words that sound similar, also update `data/confusablePairs.ts`:

```typescript
// data/confusablePairs.ts
export const confusablePairs: ConfusablePair[] = [
  // ... existing pairs ...

  // Add new pair
  {
    id: 'pair-nanni-nalla',
    wordId: 'YOUR-NANNI-UUID',           // The "correct" word ID
    confusableWordId: 'YOUR-NALLA-UUID', // The similar-sounding word ID
    reason: 'Both start with "na-" sound',
  },
];
```

---

## 3. Recording Audio Files

### Audio Specifications

| Spec | Requirement | Why |
|------|-------------|-----|
| Format | MP3 or M4A | Best compatibility, small file size |
| Sample Rate | 44.1 kHz | Standard quality |
| Bit Rate | 128 kbps | Good quality, reasonable size |
| Channels | Mono | Sufficient for speech, half the file size |
| Duration | 1-3 seconds per word | Keep it concise |

### Recording Equipment

**Minimum (Phone):**
- Any smartphone with Voice Memos app
- Record in a quiet room
- Hold phone 6-8 inches from mouth

**Better (USB Microphone):**
- Blue Yeti, Audio-Technica AT2020, or similar
- $50-150 investment for clear audio
- Connect to computer, use recording software

**Best (Professional):**
- Condenser microphone + audio interface
- Treated recording space
- Professional editing software

### Recording Software (Free Options)

| Platform | Software | Notes |
|----------|----------|-------|
| Mac | GarageBand | Built-in, easy to use |
| Mac | QuickTime | Simple recording |
| Windows | Audacity | Free, full-featured |
| Any | Voice Memos (phone) | Quick and easy |
| Online | [vocaroo.com](https://vocaroo.com) | No install needed |

### Recording Tips

1. **Environment**
   - Quiet room, no echo
   - Turn off fans/AC while recording
   - Close windows

2. **Speaking**
   - Speak clearly and naturally
   - Consistent volume across all words
   - Leave 0.5 second silence before/after word
   - Record each word 2-3 times, pick the best

3. **Pronunciation**
   - Native or near-native pronunciation preferred
   - Be consistent with dialect (if applicable)
   - For Malayalam, consider regional variations

### Recording Workflow

```
1. Create a word list (spreadsheet with IDs and words)
         |
         v
2. Set up recording environment
         |
         v
3. Record all words in one session (consistency)
         |
         v
4. Edit: trim silence, normalize volume
         |
         v
5. Export as MP3, name files by word
         |
         v
6. Place in assets/audio/words/
```

### File Naming Convention

Use the `inTranslit` value (lowercase, no spaces):

| Word | File Name |
|------|-----------|
| ithu | `ithu.mp3` |
| athu | `athu.mp3` |
| ente | `ente.mp3` |
| Enikku | `enikku.mp3` |
| aaNu | `aanu.mp3` |

**Important:** Keep names lowercase and simple for consistency.

### Batch Recording Script

Create a checklist to track progress:

```
Recording Checklist - Malayalam Words
=====================================
Date: ___________
Recorder: ___________

[ ] aaNu (is/am/are)
[ ] ithu (this)
[ ] athu (that)
[ ] ente (my/mine)
[ ] Enikku (I)
[ ] peru (name)
... (continue for all words)
```

---

## 4. Audio Storage Options

### Option A: Local Storage (In App Bundle)

**How it works:** Audio files are bundled with the app and ship to users.

**Pros:**
- Works offline
- Fast playback (no download needed)
- Simple implementation
- No server costs

**Cons:**
- Increases app size (~50KB per word × 50 words = 2.5MB)
- Users must update app to get new audio
- All audio downloads even if not used

**Best for:** MVP with < 100 words

**File structure:**
```
assets/
└── audio/
    └── words/
        ├── ithu.mp3
        ├── athu.mp3
        ├── ente.mp3
        └── ... (all word files)
```

### Option B: Cloud Storage (Firebase Storage)

**How it works:** Audio files stored in Firebase, downloaded on-demand.

**Pros:**
- Small app size
- Update audio without app update
- Add new words anytime
- Pay only for what's used

**Cons:**
- Requires internet connection
- Slight delay on first play (download)
- More complex implementation
- Monthly costs (usually minimal)

**Best for:** Apps with 100+ words or frequent content updates

**Firebase costs estimate:**
- Storage: $0.026/GB/month
- Downloads: $0.12/GB
- 50 words × 50KB = 2.5MB → Essentially free

### Recommendation for MVP

**Start with Local Storage (Option A)**

Reasons:
1. Simpler to implement
2. Works offline
3. 50 words × 50KB = ~2.5MB (acceptable app size increase)
4. You can migrate to cloud later if needed

---

## 5. Connecting Audio to Words

### Step 5.1: Create Audio Directory

```bash
mkdir -p assets/audio/words
```

### Step 5.2: Add Audio Files

Copy your recorded MP3 files to `assets/audio/words/`:

```
assets/audio/words/
├── aanu.mp3
├── ithu.mp3
├── athu.mp3
├── ente.mp3
├── enikku.mp3
└── ... (one file per word)
```

### Step 5.3: Update wordsMalayalam.json

Add the audio path to each word's `pronunciation` field:

**Before:**
```json
{
  "id": "595ae022-4413-4371-92a4-a8df5773203b",
  "word": {
    "inTranslit": "ithu",
    "inNativeScript": "ഇത് / ഇതു"
  },
  "meaning": "this",
  "pronunciation": ""
}
```

**After:**
```json
{
  "id": "595ae022-4413-4371-92a4-a8df5773203b",
  "word": {
    "inTranslit": "ithu",
    "inNativeScript": "ഇത് / ഇതు"
  },
  "meaning": "this",
  "pronunciation": "ithu.mp3"
}
```

### Step 5.4: Audio Mapping Reference

Create this reference while adding audio:

| Word ID | inTranslit | Audio File | Recorded? |
|---------|------------|------------|-----------|
| f7ec48ae-... | aaNu | aanu.mp3 | [ ] |
| 595ae022-... | ithu | ithu.mp3 | [ ] |
| 43847693-... | athu | athu.mp3 | [ ] |
| c93b83c4-... | ente | ente.mp3 | [ ] |
| 2675be2b-... | Enikku | enikku.mp3 | [ ] |

---

## 6. Code Changes for Audio Playback

To make audio actually play in the app, you'll need these code changes:

### Step 6.1: Install expo-av

```bash
npx expo install expo-av
```

### Step 6.2: Create Audio Utility

Create a new file `utils/audio.ts`:

```typescript
// utils/audio.ts
import { Audio } from 'expo-av';

// Audio file imports (local storage approach)
const audioFiles: Record<string, any> = {
  'aanu.mp3': require('@/assets/audio/words/aanu.mp3'),
  'ithu.mp3': require('@/assets/audio/words/ithu.mp3'),
  'athu.mp3': require('@/assets/audio/words/athu.mp3'),
  'ente.mp3': require('@/assets/audio/words/ente.mp3'),
  'enikku.mp3': require('@/assets/audio/words/enikku.mp3'),
  // Add all your audio files here...
};

let currentSound: Audio.Sound | null = null;

export async function playWordAudio(filename: string): Promise<void> {
  try {
    // Stop any currently playing audio
    if (currentSound) {
      await currentSound.unloadAsync();
      currentSound = null;
    }

    const audioFile = audioFiles[filename];
    if (!audioFile) {
      console.warn(`Audio file not found: ${filename}`);
      return;
    }

    const { sound } = await Audio.Sound.createAsync(audioFile);
    currentSound = sound;
    await sound.playAsync();

    // Clean up when done
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
        currentSound = null;
      }
    });
  } catch (error) {
    console.error('Error playing audio:', error);
  }
}

export async function stopAudio(): Promise<void> {
  if (currentSound) {
    await currentSound.stopAsync();
    await currentSound.unloadAsync();
    currentSound = null;
  }
}
```

### Step 6.3: Update AudioPlayer Component

Update `components/pronunciation/AudioPlayer.tsx` to use real audio:

```typescript
// components/pronunciation/AudioPlayer.tsx
import React, { useState } from 'react';
import { Pressable, Text, View, ActivityIndicator } from 'react-native';
import { playWordAudio } from '@/utils/audio';

interface AudioPlayerProps {
  audioFile?: string;  // e.g., "ithu.mp3"
}

export function AudioPlayer({ audioFile }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    if (!audioFile) {
      console.warn('No audio file provided');
      return;
    }

    setIsPlaying(true);
    await playWordAudio(audioFile);

    // Reset after approximate playback duration
    setTimeout(() => setIsPlaying(false), 2000);
  };

  return (
    <View className="items-center my-4">
      <Pressable
        onPress={handlePlay}
        disabled={isPlaying}
        className={`w-20 h-20 rounded-full items-center justify-center ${
          isPlaying ? 'bg-blue-300' : 'bg-blue-500'
        }`}
      >
        {isPlaying ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-3xl">▶</Text>
        )}
      </Pressable>
      <Text className="mt-2 text-gray-600">
        {audioFile ? 'Tap to hear' : 'Audio coming soon'}
      </Text>
    </View>
  );
}
```

### Step 6.4: Pass Audio to Components

In your practice screen, pass the audio filename:

```typescript
// In pronunciation-practice.tsx or wherever AudioPlayer is used
<AudioPlayer audioFile={currentQuestion?.correctWord.pronunciation} />
```

---

## 7. Content Workflow Summary

### Adding New Words (Complete Process)

```
1. PLAN
   └── Decide on words to add (aim for themed batches)

2. CREATE WORD ENTRIES
   └── Add to wordsMalayalam.json
   └── Generate UUIDs
   └── Write meanings and examples

3. RECORD AUDIO
   └── Set up recording environment
   └── Record all new words
   └── Edit and export as MP3

4. ADD AUDIO FILES
   └── Copy to assets/audio/words/
   └── Update pronunciation field in JSON

5. UPDATE CONFUSABLE PAIRS (if applicable)
   └── Add new pairs to data/confusablePairs.ts

6. TEST
   └── Run app and verify audio plays
   └── Check all new words appear correctly
```

### Quick Edit Checklist

| What to Edit | File Location |
|--------------|---------------|
| Word spelling (Manglish) | `wordsMalayalam.json` → `word.inTranslit` |
| Word spelling (Malayalam) | `wordsMalayalam.json` → `word.inNativeScript` |
| Word meaning | `wordsMalayalam.json` → `meaning` |
| Word examples | `wordsMalayalam.json` → `examples` array |
| Word difficulty | `wordsMalayalam.json` → `wordLevel` |
| Audio file | `wordsMalayalam.json` → `pronunciation` |
| Practice pairs | `data/confusablePairs.ts` |

### Content Quality Checklist

Before releasing new content:

- [ ] All words have unique UUIDs
- [ ] Manglish spelling is consistent
- [ ] Malayalam script is accurate
- [ ] Meanings are clear and concise
- [ ] At least one example per word
- [ ] Audio is clear and audible
- [ ] Audio filename matches JSON
- [ ] Confusable pairs are logical

---

## Appendix: Word Template

Copy this template when adding new words:

```json
{
  "id": "PASTE-NEW-UUID-HERE",
  "word": {
    "inTranslit": "",
    "inNativeScript": ""
  },
  "meaning": "",
  "figureOfSpeech": "",
  "examples": [
    {
      "inTranslit": "",
      "translation": "",
      "inNativeScript": ""
    }
  ],
  "wordLevel": "A1",
  "pronunciation": ""
}
```

---

## Appendix: Bulk Audio Import Script

If you have many audio files, use this Node.js script to generate the audioFiles mapping:

```javascript
// scripts/generate-audio-imports.js
const fs = require('fs');
const path = require('path');

const audioDir = path.join(__dirname, '../assets/audio/words');
const files = fs.readdirSync(audioDir).filter(f => f.endsWith('.mp3'));

console.log('// Paste this into utils/audio.ts\n');
console.log('const audioFiles: Record<string, any> = {');
files.forEach(file => {
  console.log(`  '${file}': require('@/assets/audio/words/${file}'),`);
});
console.log('};');
```

Run with:
```bash
node scripts/generate-audio-imports.js
```

---

## Need Help?

- **Expo AV Documentation**: https://docs.expo.dev/versions/latest/sdk/av/
- **Audio Recording Tips**: Search "podcast recording basics" for general tips
- **Malayalam Pronunciation**: Consider consulting native speakers for accuracy
