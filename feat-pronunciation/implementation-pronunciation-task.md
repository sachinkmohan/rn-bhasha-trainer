# Malayalam Pronunciation Practice Feature - Implementation Plan

## Overview

Add a dedicated pronunciation practice feature as a 4th tab in your React Native Expo Malayalam learning app. Users will record themselves speaking Malayalam words and receive accuracy feedback using Google Cloud's premium Speech-to-Text service.

## Key Decisions

- **Location**: New dedicated tab in bottom navigation
- **Speech Service**: Google Cloud Speech-to-Text + Text-to-Speech (premium quality, Malayalam support)
- **User Flow**: One word at a time practice with immediate feedback
- **Feedback**: Accuracy score (0-100%), playback recording, correct pronunciation audio, progress tracking
- **Data**: Separate word set specifically for pronunciation practice (not the existing vocabulary words)
- **Recording Storage**: Save to Firebase Storage for later review
- **Setup**: Full Google Cloud Platform setup instructions included

## Technical Architecture

### Speech Recognition: Google Cloud Platform

**Why Google Cloud:**
- Confirmed Malayalam language support (language code: `ml-IN`)
- High-quality WaveNet voices for native pronunciation audio
- Cost-effective: 60 minutes/month free tier
- Integrated ecosystem (STT + TTS in one platform)
- Works with existing Firebase setup

**Cost Estimate (100 active users, 10 words/day):**
- Speech-to-Text: ~$23/month (after 60 min free tier)
- Text-to-Speech: ~$0.03 one-time for audio generation
- Firebase Storage: ~$0.04/month for user recordings
- **Total: ~$25/month**

### Audio Recording: `expo-av`

**Why expo-av:**
- Already in Expo ecosystem
- Cross-platform (iOS, Android, Web)
- Handles permissions, recording, and playback
- Well-maintained (374k+ weekly downloads)

**Audio Format:**
- M4A with AAC encoding
- 44.1kHz sample rate
- Mono channel
- Optimized for speech recognition

### Data Storage: Firebase

**Firestore Collections:**
```
/pronunciationWords (NEW)
  - {wordId}: { word, meaning, audioUrl, level, ... }

/users/{userId}/pronunciationSessions
  - {sessionId}: { wordId, score, timestamp, audioUrl, ... }

/users/{userId} (EXTEND)
  - pronunciationStats: { totalAttempts, averageScore, streak, ... }
```

**Firebase Storage:**
```
/pronunciation-audio/{wordId}.mp3      (Correct pronunciation)
/user-recordings/{userId}/{timestamp}.m4a  (User recordings)
```

## Implementation Steps

### Phase 1: Google Cloud Setup (Before coding)

#### 1.1 Create Google Cloud Account
1. Go to https://console.cloud.google.com
2. Sign in or create new Google account
3. Create new project: "malayalam-pronunciation-app"
4. Enable billing (required for APIs, but free tier available)

#### 1.2 Enable APIs
1. Navigate to "APIs & Services" → "Library"
2. Search and enable:
   - **Cloud Speech-to-Text API**
   - **Cloud Text-to-Speech API**
3. Note: Free tier includes 60 minutes/month for Speech-to-Text

#### 1.3 Create API Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the API key
4. **Restrict the key:**
   - Click "Edit API key"
   - Under "API restrictions", select "Restrict key"
   - Choose "Cloud Speech-to-Text API" and "Cloud Text-to-Speech API"
   - Under "Application restrictions", select "HTTP referrers" for web or "Android/iOS apps" for mobile
5. Save the restricted API key

#### 1.4 Store Credentials Securely
Add to `.env`:
```bash
EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY=your_api_key_here
EXPO_PUBLIC_GOOGLE_CLOUD_PROJECT_ID=malayalam-pronunciation-app
```

**Important:** Ensure `.env` is in `.gitignore` (already is)

### Phase 2: Project Configuration

#### 2.1 Install Dependencies

```bash
npm install @google-cloud/speech @google-cloud/text-to-speech fastest-levenshtein
```

**Note:** For React Native/Expo, you may need to use REST API approach instead of Node.js SDKs. Alternative:
```bash
npm install axios  # For HTTP requests to Google Cloud APIs
```

#### 2.2 Add Microphone Permissions

**File:** `app.json`

Add to the config:
```json
{
  "expo": {
    "ios": {
      "supportsTablet": true,
      "infoPlist": {
        "NSMicrophoneUsageDescription": "We need microphone access to practice Malayalam pronunciation and provide feedback on your speaking"
      }
    },
    "android": {
      "permissions": ["RECORD_AUDIO"],
      "adaptiveIcon": { ... }
    }
  }
}
```

#### 2.3 Configure Firebase Storage Rules

In Firebase Console → Storage → Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public read for pronunciation audio, admin write only
    match /pronunciation-audio/{audioFile} {
      allow read: if true;
      allow write: if false; // Upload via admin SDK or console only
    }

    // Users can read/write their own recordings
    match /user-recordings/{userId}/{recording} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Phase 3: Data Setup

#### 3.1 Create Pronunciation Words Dataset

**File:** `pronunciationWords.json` (NEW)

Create a new dataset specifically for pronunciation practice:
```json
{
  "pronunciationWords": [
    {
      "id": "pron-001",
      "word": {
        "inTranslit": "namaskaram",
        "inNativeScript": "നമസ്കാരം"
      },
      "meaning": "hello/greetings",
      "difficulty": "easy",
      "phoneticNotes": "na-mas-ka-ram",
      "audioUrl": ""
    },
    {
      "id": "pron-002",
      "word": {
        "inTranslit": "sthalam",
        "inNativeScript": "സ്ഥലം"
      },
      "meaning": "place",
      "difficulty": "medium",
      "phoneticNotes": "s-tha-lam (retroflex 't')",
      "audioUrl": ""
    }
  ]
}
```

**Start with 10-15 words focusing on:**
- Common Malayalam sounds not in English (retroflex consonants)
- Vowel length distinctions
- Aspirated vs unaspirated consonants
- Words of varying difficulty

#### 3.2 Generate Pronunciation Audio

**Option A: Manual Script (Recommended for MVP)**

Create: `scripts/generatePronunciationAudio.ts`

```typescript
import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import pronunciationWords from '../pronunciationWords.json';

async function generateAudio() {
  const client = new textToSpeech.TextToSpeechClient({
    apiKey: process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY
  });

  for (const wordObj of pronunciationWords.pronunciationWords) {
    const request = {
      input: { text: wordObj.word.inNativeScript },
      voice: {
        languageCode: 'ml-IN',
        name: 'ml-IN-Wavenet-A', // Female voice (check available voices)
        ssmlGender: 'FEMALE'
      },
      audioConfig: { audioEncoding: 'MP3' }
    };

    const [response] = await client.synthesizeSpeech(request);

    // Save to local file
    const filename = `./assets/audio/${wordObj.id}.mp3`;
    fs.writeFileSync(filename, response.audioContent, 'binary');

    console.log(`Generated: ${filename}`);
  }
}

generateAudio();
```

Run once: `ts-node scripts/generatePronunciationAudio.ts`

**Option B: Upload to Firebase Storage**

After generating, upload MP3 files to Firebase Storage at `/pronunciation-audio/` and update `audioUrl` in JSON.

**Option C: Generate on-the-fly**

Generate audio when user first accesses a word, then cache in Firebase Storage.

### Phase 4: Core Services Implementation

#### 4.1 Audio Recording Service

**File:** `app/utils/audioRecording.ts` (NEW)

```typescript
import { Audio } from 'expo-av';

export async function requestMicrophonePermission(): Promise<boolean> {
  const { status } = await Audio.requestPermissionsAsync();
  return status === 'granted';
}

export async function setupAudioMode(): Promise<void> {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });
}

export async function recordAudio(): Promise<Audio.Recording> {
  const recording = new Audio.Recording();

  await recording.prepareToRecordAsync({
    android: {
      extension: '.m4a',
      outputFormat: Audio.AndroidOutputFormat.MPEG_4,
      audioEncoder: Audio.AndroidAudioEncoder.AAC,
      sampleRate: 44100,
      numberOfChannels: 1,
      bitRate: 128000,
    },
    ios: {
      extension: '.m4a',
      audioQuality: Audio.IOSAudioQuality.HIGH,
      sampleRate: 44100,
      numberOfChannels: 1,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
    web: {
      mimeType: 'audio/webm',
      bitsPerSecond: 128000,
    }
  });

  return recording;
}
```

#### 4.2 Speech Recognition Service

**File:** `app/utils/speechRecognition.ts` (NEW)

```typescript
import axios from 'axios';
import * as FileSystem from 'expo-file-system';

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY;
const STT_ENDPOINT = 'https://speech.googleapis.com/v1/speech:recognize';

export interface TranscriptionResult {
  transcript: string;
  confidence: number;
}

export async function transcribeAudio(
  audioUri: string,
  expectedLanguage: string = 'ml-IN'
): Promise<TranscriptionResult> {
  try {
    // Read audio file as base64
    const audioBase64 = await FileSystem.readAsStringAsync(audioUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const requestBody = {
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 44100,
        languageCode: expectedLanguage,
        enableWordConfidence: true,
        model: 'default',
      },
      audio: {
        content: audioBase64,
      },
    };

    const response = await axios.post(
      `${STT_ENDPOINT}?key=${API_KEY}`,
      requestBody
    );

    const results = response.data.results;
    if (!results || results.length === 0) {
      throw new Error('No transcription results');
    }

    const alternative = results[0].alternatives[0];
    return {
      transcript: alternative.transcript || '',
      confidence: alternative.confidence || 0,
    };
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
}
```

#### 4.3 Pronunciation Scoring Algorithm

**File:** `app/utils/pronunciationScoring.ts` (NEW)

```typescript
import { distance as levenshteinDistance } from 'fastest-levenshtein';

export interface PronunciationScore {
  accuracyScore: number; // 0-100
  confidence: number; // 0-1
  transcribedText: string;
  expectedText: string;
  feedback: string;
  color: 'green' | 'blue' | 'yellow' | 'orange';
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .trim();
}

function generateFeedback(score: number): { message: string; color: string } {
  if (score >= 90) return { message: 'Excellent! 🎉', color: 'green' };
  if (score >= 75) return { message: 'Good job! 👍', color: 'blue' };
  if (score >= 60) return { message: 'Keep trying! 💪', color: 'yellow' };
  return { message: "Let's practice more! 📚", color: 'orange' };
}

export function calculatePronunciationScore(
  expectedText: string,
  transcribedText: string,
  confidence: number
): PronunciationScore {
  const normalizedExpected = normalizeText(expectedText);
  const normalizedTranscribed = normalizeText(transcribedText);

  // Calculate text similarity using Levenshtein distance
  const distance = levenshteinDistance(normalizedExpected, normalizedTranscribed);
  const maxLength = Math.max(normalizedExpected.length, normalizedTranscribed.length);
  const textSimilarity = maxLength > 0 ? 1 - (distance / maxLength) : 0;

  // Combine text similarity (60%) with speech recognition confidence (40%)
  const accuracyScore = Math.round((textSimilarity * 0.6 + confidence * 0.4) * 100);

  const { message, color } = generateFeedback(accuracyScore);

  return {
    accuracyScore: Math.max(0, Math.min(100, accuracyScore)), // Clamp 0-100
    confidence,
    transcribedText,
    expectedText,
    feedback: message,
    color: color as 'green' | 'blue' | 'yellow' | 'orange',
  };
}
```

#### 4.4 Firebase Data Service

**File:** `app/utils/pronunciationData.ts` (NEW)

```typescript
import {
  collection,
  doc,
  setDoc,
  getDoc,
  query,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  increment,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebaseConfig';

export interface PronunciationSession {
  userId: string;
  wordId: string;
  timestamp: Timestamp;
  audioUrl: string;
  transcribedText: string;
  expectedText: string;
  accuracyScore: number;
  confidence: number;
  difficulty: string;
}

export interface PronunciationStats {
  totalAttempts: number;
  averageAccuracy: number;
  wordsAttempted: string[];
  wordsMastered: string[]; // >80% average
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: Timestamp | null;
}

export async function savePronunciationSession(
  session: PronunciationSession
): Promise<void> {
  const sessionRef = doc(
    collection(db, `users/${session.userId}/pronunciationSessions`)
  );

  await setDoc(sessionRef, {
    ...session,
    timestamp: Timestamp.now(),
  });

  await updateUserStats(session);
}

async function updateUserStats(session: PronunciationSession): Promise<void> {
  const userRef = doc(db, `users/${session.userId}`);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) return;

  const currentStats: PronunciationStats = userDoc.data().pronunciationStats || {
    totalAttempts: 0,
    averageAccuracy: 0,
    wordsAttempted: [],
    wordsMastered: [],
    currentStreak: 0,
    longestStreak: 0,
    lastPracticeDate: null,
  };

  const newWordsAttempted = Array.from(
    new Set([...currentStats.wordsAttempted, session.wordId])
  );

  // Calculate new average (simplified - could be weighted by recency)
  const newAverage = Math.round(
    (currentStats.averageAccuracy * currentStats.totalAttempts + session.accuracyScore) /
    (currentStats.totalAttempts + 1)
  );

  // Update streak
  const today = new Date().toDateString();
  const lastPractice = currentStats.lastPracticeDate?.toDate().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  let newStreak = currentStats.currentStreak;
  if (lastPractice !== today) {
    newStreak = lastPractice === yesterday ? currentStats.currentStreak + 1 : 1;
  }

  await updateDoc(userRef, {
    'pronunciationStats.totalAttempts': increment(1),
    'pronunciationStats.averageAccuracy': newAverage,
    'pronunciationStats.wordsAttempted': newWordsAttempted,
    'pronunciationStats.currentStreak': newStreak,
    'pronunciationStats.longestStreak': Math.max(newStreak, currentStats.longestStreak),
    'pronunciationStats.lastPracticeDate': Timestamp.now(),
  });
}

export async function uploadUserRecording(
  userId: string,
  audioUri: string,
  wordId: string
): Promise<string> {
  const response = await fetch(audioUri);
  const blob = await response.blob();

  const timestamp = Date.now();
  const storageRef = ref(storage, `user-recordings/${userId}/${wordId}_${timestamp}.m4a`);

  await uploadBytes(storageRef, blob);
  const downloadUrl = await getDownloadURL(storageRef);

  return downloadUrl;
}

export async function getPronunciationStats(userId: string): Promise<PronunciationStats | null> {
  const userDoc = await getDoc(doc(db, `users/${userId}`));
  return userDoc.data()?.pronunciationStats || null;
}

export async function getRecentSessions(
  userId: string,
  limitCount: number = 10
): Promise<PronunciationSession[]> {
  const sessionsRef = collection(db, `users/${userId}/pronunciationSessions`);
  const q = query(sessionsRef, orderBy('timestamp', 'desc'), limit(limitCount));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => doc.data() as PronunciationSession);
}
```

**Note:** This requires adding Firebase Storage import to `firebaseConfig.ts`:
```typescript
import { getStorage } from 'firebase/storage';
export const storage = getStorage(app);
```

### Phase 5: UI Components

#### 5.1 Record Button Component

**File:** `components/pronunciation/RecordButton.tsx` (NEW)

```typescript
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, Animated } from 'react-native';
import { Audio } from 'expo-av';

interface RecordButtonProps {
  onRecordingComplete: (uri: string) => void;
  isProcessing: boolean;
}

export function RecordButton({ onRecordingComplete, isProcessing }: RecordButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const pulseAnim = useState(new Animated.Value(1))[0];

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulse = () => {
    pulseAnim.setValue(1);
  };

  async function startRecording() {
    try {
      const { setupAudioMode, recordAudio } = await import('@/app/utils/audioRecording');

      await setupAudioMode();
      const newRecording = await recordAudio();
      await newRecording.startAsync();

      setRecording(newRecording);
      setIsRecording(true);
      startPulse();
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) return;

    try {
      setIsRecording(false);
      stopPulse();

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      if (uri) {
        onRecordingComplete(uri);
      }

      setRecording(null);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  }

  return (
    <Pressable
      onPressIn={startRecording}
      onPressOut={stopRecording}
      disabled={isProcessing}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.button,
          isRecording && styles.buttonRecording,
          isProcessing && styles.buttonDisabled,
          { transform: [{ scale: isRecording ? pulseAnim : 1 }] }
        ]}
      >
        <Text style={styles.icon}>{isRecording ? '⏺' : '🎤'}</Text>
      </Animated.View>
      <Text style={styles.label}>
        {isRecording ? 'Recording...' : 'Hold to Record'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonRecording: {
    backgroundColor: '#E74C3C',
  },
  buttonDisabled: {
    backgroundColor: '#95a5a6',
    opacity: 0.6,
  },
  icon: {
    fontSize: 40,
  },
  label: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
```

#### 5.2 Feedback Display Component

**File:** `components/pronunciation/FeedbackDisplay.tsx` (NEW)

```typescript
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { PronunciationScore } from '@/app/utils/pronunciationScoring';
import { Audio } from 'expo-av';

interface FeedbackDisplayProps {
  score: PronunciationScore;
  userRecordingUrl: string;
  correctAudioUrl: string;
}

export function FeedbackDisplay({
  score,
  userRecordingUrl,
  correctAudioUrl
}: FeedbackDisplayProps) {
  const [sound, setSound] = React.useState<Audio.Sound | null>(null);

  async function playAudio(url: string) {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: url });
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const scoreColor = {
    green: '#27AE60',
    blue: '#3498DB',
    yellow: '#F39C12',
    orange: '#E67E22',
  }[score.color];

  return (
    <View style={styles.container}>
      <View style={[styles.scoreCard, { borderColor: scoreColor }]}>
        <Text style={styles.feedbackText}>{score.feedback}</Text>
        <Text style={[styles.scoreText, { color: scoreColor }]}>
          {score.accuracyScore}%
        </Text>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.label}>You said:</Text>
        <Text style={styles.transcribedText}>
          {score.transcribedText || '(not recognized)'}
        </Text>

        <Text style={styles.label}>Expected:</Text>
        <Text style={styles.expectedText}>{score.expectedText}</Text>
      </View>

      <View style={styles.audioControls}>
        <Pressable
          style={styles.playButton}
          onPress={() => playAudio(userRecordingUrl)}
        >
          <Text style={styles.playButtonText}>▶️ Your Recording</Text>
        </Pressable>

        <Pressable
          style={[styles.playButton, styles.correctButton]}
          onPress={() => playAudio(correctAudioUrl)}
        >
          <Text style={styles.playButtonText}>🔊 Correct Pronunciation</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
  },
  scoreCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 3,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  detailsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 8,
    marginBottom: 4,
    fontWeight: '600',
  },
  transcribedText: {
    fontSize: 16,
    color: '#495057',
    fontStyle: 'italic',
  },
  expectedText: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
  },
  audioControls: {
    gap: 12,
  },
  playButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  correctButton: {
    backgroundColor: '#27AE60',
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

#### 5.3 Word Display Component

**File:** `components/pronunciation/WordDisplay.tsx` (NEW)

```typescript
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Audio } from 'expo-av';

interface WordDisplayProps {
  word: {
    inNativeScript: string;
    inTranslit: string;
  };
  meaning: string;
  difficulty: string;
  audioUrl: string;
}

export function WordDisplay({ word, meaning, difficulty, audioUrl }: WordDisplayProps) {
  const [sound, setSound] = React.useState<Audio.Sound | null>(null);

  async function playCorrectPronunciation() {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUrl });
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const difficultyColor = {
    easy: '#27AE60',
    medium: '#F39C12',
    hard: '#E74C3C',
  }[difficulty] || '#95a5a6';

  return (
    <View style={styles.container}>
      <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
        <Text style={styles.difficultyText}>{difficulty.toUpperCase()}</Text>
      </View>

      <Text style={styles.nativeScript}>{word.inNativeScript}</Text>
      <Text style={styles.translit}>{word.inTranslit}</Text>
      <Text style={styles.meaning}>{meaning}</Text>

      <Pressable style={styles.hearButton} onPress={playCorrectPronunciation}>
        <Text style={styles.hearButtonText}>🔊 Hear Word</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    marginVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    position: 'absolute',
    top: 12,
    right: 12,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  nativeScript: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  translit: {
    fontSize: 24,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  meaning: {
    fontSize: 18,
    color: '#95A5A6',
    marginBottom: 20,
  },
  hearButton: {
    backgroundColor: '#3498DB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  hearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

#### 5.4 Progress Stats Component

**File:** `components/pronunciation/ProgressStats.tsx` (NEW)

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PronunciationStats } from '@/app/utils/pronunciationData';

interface ProgressStatsProps {
  stats: PronunciationStats | null;
}

export function ProgressStats({ stats }: ProgressStatsProps) {
  if (!stats) return null;

  return (
    <View style={styles.container}>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{stats.totalAttempts}</Text>
        <Text style={styles.statLabel}>Attempts</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statValue}>{stats.averageAccuracy}%</Text>
        <Text style={styles.statLabel}>Avg Score</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statValue}>{stats.currentStreak} 🔥</Text>
        <Text style={styles.statLabel}>Day Streak</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statValue}>{stats.wordsMastered.length}</Text>
        <Text style={styles.statLabel}>Mastered</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
  },
});
```

### Phase 6: Main Pronunciation Screen

#### 6.1 Create Pronunciation Tab Screen

**File:** `app/(tabs)/pronunciation.tsx` (NEW)

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '@/app/_layout';
import { WordDisplay } from '@/components/pronunciation/WordDisplay';
import { RecordButton } from '@/components/pronunciation/RecordButton';
import { FeedbackDisplay } from '@/components/pronunciation/FeedbackDisplay';
import { ProgressStats } from '@/components/pronunciation/ProgressStats';
import { requestMicrophonePermission } from '@/app/utils/audioRecording';
import { transcribeAudio } from '@/app/utils/speechRecognition';
import { calculatePronunciationScore } from '@/app/utils/pronunciationScoring';
import {
  savePronunciationSession,
  uploadUserRecording,
  getPronunciationStats,
  PronunciationStats
} from '@/app/utils/pronunciationData';
import pronunciationWords from '@/pronunciationWords.json';
import { Timestamp } from 'firebase/firestore';

export default function PronunciationScreen() {
  const { userId } = useAuth();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [userRecordingUrl, setUserRecordingUrl] = useState<string | null>(null);
  const [score, setScore] = useState<any>(null);
  const [stats, setStats] = useState<PronunciationStats | null>(null);

  const currentWord = pronunciationWords.pronunciationWords[currentWordIndex];

  useEffect(() => {
    checkPermission();
    loadStats();
  }, []);

  async function checkPermission() {
    const granted = await requestMicrophonePermission();
    setHasPermission(granted);

    if (!granted) {
      Alert.alert(
        'Microphone Permission Required',
        'Please enable microphone access in settings to practice pronunciation.'
      );
    }
  }

  async function loadStats() {
    if (!userId) return;
    const userStats = await getPronunciationStats(userId);
    setStats(userStats);
  }

  async function handleRecordingComplete(audioUri: string) {
    if (!userId || !currentWord) return;

    setIsProcessing(true);
    setScore(null);
    setUserRecordingUrl(null);

    try {
      // 1. Upload user recording to Firebase Storage
      const uploadedUrl = await uploadUserRecording(userId, audioUri, currentWord.id);
      setUserRecordingUrl(uploadedUrl);

      // 2. Transcribe audio using Google Cloud Speech-to-Text
      const transcription = await transcribeAudio(audioUri, 'ml-IN');

      // 3. Calculate pronunciation score
      const pronunciationScore = calculatePronunciationScore(
        currentWord.word.inTranslit,
        transcription.transcript,
        transcription.confidence
      );

      setScore(pronunciationScore);

      // 4. Save session to Firestore
      await savePronunciationSession({
        userId,
        wordId: currentWord.id,
        timestamp: Timestamp.now(),
        audioUrl: uploadedUrl,
        transcribedText: transcription.transcript,
        expectedText: currentWord.word.inTranslit,
        accuracyScore: pronunciationScore.accuracyScore,
        confidence: transcription.confidence,
        difficulty: currentWord.difficulty,
      });

      // 5. Reload stats
      await loadStats();

    } catch (error) {
      console.error('Error processing recording:', error);
      Alert.alert('Error', 'Failed to process your recording. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }

  function handleNextWord() {
    const nextIndex = (currentWordIndex + 1) % pronunciationWords.pronunciationWords.length;
    setCurrentWordIndex(nextIndex);
    setScore(null);
    setUserRecordingUrl(null);
  }

  if (!hasPermission) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Microphone permission required</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Pronunciation Practice</Text>

      <ProgressStats stats={stats} />

      <WordDisplay
        word={currentWord.word}
        meaning={currentWord.meaning}
        difficulty={currentWord.difficulty}
        audioUrl={currentWord.audioUrl}
      />

      <RecordButton
        onRecordingComplete={handleRecordingComplete}
        isProcessing={isProcessing}
      />

      {isProcessing && (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.processingText}>Analyzing your pronunciation...</Text>
        </View>
      )}

      {score && userRecordingUrl && !isProcessing && (
        <>
          <FeedbackDisplay
            score={score}
            userRecordingUrl={userRecordingUrl}
            correctAudioUrl={currentWord.audioUrl}
          />

          <Pressable style={styles.nextButton} onPress={handleNextWord}>
            <Text style={styles.nextButtonText}>Next Word →</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
  },
  contentContainer: {
    paddingVertical: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#2C3E50',
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
  },
  processingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  processingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7F8C8D',
  },
  nextButton: {
    backgroundColor: '#27AE60',
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

#### 6.2 Add Tab to Navigation

**File:** `app/(tabs)/_layout.tsx` (MODIFY)

Add the new pronunciation tab:

```typescript
<Tabs.Screen
  name="pronunciation"
  options={{
    title: "Practice",
    tabBarIcon: ({ color }) => (
      <IconSymbol size={28} name="mic.fill" color={color} />
    ),
  }}
/>
```

Insert after the "words-lib" screen and before the closing `</Tabs>`.

### Phase 7: Testing & Validation

#### 7.1 Test Checklist

- [ ] Google Cloud API credentials working
- [ ] Microphone permissions requested on first use
- [ ] Audio recording starts/stops correctly
- [ ] Speech-to-Text API returns Malayalam transcription
- [ ] Scoring algorithm calculates reasonable accuracy
- [ ] User recordings upload to Firebase Storage
- [ ] Session data saves to Firestore
- [ ] Stats update correctly after each attempt
- [ ] Correct pronunciation audio plays
- [ ] User recording playback works
- [ ] Tab navigation functions
- [ ] UI renders on iOS
- [ ] UI renders on Android
- [ ] Error handling for network failures
- [ ] Error handling for permission denial

#### 7.2 Test with Sample Word

Start with a simple word like "namaskaram" (നമസ്കാരം) to test the full flow.

#### 7.3 Monitor Costs

- Check Google Cloud Console → Billing
- Monitor Speech-to-Text API usage
- Set up budget alerts at $10, $25, $50

### Phase 8: Optimization & Polish

#### 8.1 Performance Improvements

- Cache pronunciation audio locally after first load
- Implement retry logic for API failures
- Add offline detection with user-friendly message
- Optimize audio file sizes

#### 8.2 UX Enhancements

- Add haptic feedback on record button
- Show waveform animation during recording
- Add celebration animation for high scores (>90%)
- Implement skip word functionality
- Add word history/review screen

#### 8.3 Error Handling

- Network timeout handling
- Graceful degradation if STT API fails
- User-friendly error messages
- Retry mechanism with exponential backoff

## Critical Files to Create/Modify

### New Files (13 total)
1. `pronunciationWords.json` - Pronunciation-specific word dataset
2. `app/utils/audioRecording.ts` - Audio recording setup and permissions
3. `app/utils/speechRecognition.ts` - Google Cloud STT integration
4. `app/utils/pronunciationScoring.ts` - Scoring algorithm
5. `app/utils/pronunciationData.ts` - Firestore data operations
6. `components/pronunciation/RecordButton.tsx` - Recording UI
7. `components/pronunciation/FeedbackDisplay.tsx` - Score display
8. `components/pronunciation/WordDisplay.tsx` - Word card
9. `components/pronunciation/ProgressStats.tsx` - Statistics display
10. `app/(tabs)/pronunciation.tsx` - Main pronunciation screen
11. `scripts/generatePronunciationAudio.ts` - Audio generation script
12. `.env` - Add Google Cloud credentials (if not exists)

### Modified Files (3 total)
1. `app/(tabs)/_layout.tsx` - Add 4th tab
2. `app.json` - Add microphone permissions
3. `app/utils/firebaseConfig.ts` - Export Firebase Storage instance

## Implementation Timeline Estimate

- **Phase 1: GCP Setup** - 1-2 hours
- **Phase 2: Configuration** - 30 minutes
- **Phase 3: Data Setup** - 2-3 hours (creating word list + generating audio)
- **Phase 4: Core Services** - 4-6 hours
- **Phase 5: UI Components** - 4-5 hours
- **Phase 6: Main Screen** - 2-3 hours
- **Phase 7: Testing** - 2-3 hours
- **Phase 8: Polish** - 2-4 hours

**Total: 18-27 hours of development**

## Malayalam-Specific Considerations

### Pronunciation Challenges to Address

1. **Retroflex consonants**: ട (ṭa), ഡ (ḍa), ണ (ṇa) - unique to Malayalam
2. **Vowel length**: അ (a) vs ആ (ā) - phonemic distinction
3. **Aspirated vs unaspirated**: ക (ka) vs ഖ (kha)
4. **Gemination**: Double consonants like ക്ക (kka), പ്പ (ppa)

### Word Selection Strategy

Choose words that:
- Cover different Malayalam-specific sounds
- Progress from easy (common sounds) to hard (unique phonemes)
- Are short (2-3 syllables) for beginners
- Have clear pronunciation differences from English

### Recommended Starting Words

**Easy:**
- നമസ്കാരം (namaskaram) - hello
- വെള്ളം (veḷḷam) - water
- അച്ഛൻ (acchan) - father

**Medium:**
- സ്ഥലം (sthalam) - place (retroflex)
- ഖനി (khani) - mine (aspirated)
- പുസ്തകം (pusthakam) - book

**Hard:**
- ഴ (zha) - unique Malayalam sound
- കൊഴുപ്പ് (kozhupp) - fat (complex consonant clusters)

## Cost Management

### Budget Monitoring

Set up Google Cloud billing alerts:
- Alert 1: $10 spent (50% of estimated monthly)
- Alert 2: $25 spent (100% of estimated monthly)
- Alert 3: $50 spent (200% - investigate usage spike)

### Cost Optimization Tips

1. Use batch recognition mode ($0.004/min instead of $0.016/min) for non-real-time needs
2. Cache pronunciation audio aggressively
3. Implement client-side validation before sending to API
4. Consider implementing daily practice limits per user

## Success Metrics

Track these metrics to measure feature success:

- Daily active users in pronunciation tab
- Average practice sessions per user
- Average accuracy score (target: >70%)
- User retention (users who practice 2+ days)
- Words mastered per user
- Longest practice streak

## Next Steps After MVP

### Future Enhancements

1. **Phoneme-level feedback** - Show which sounds were mispronounced
2. **Progress charts** - Visualize improvement over time
3. **Spaced repetition** - Smart word selection based on forgetting curve
4. **Achievement system** - Badges for streaks, accuracy, consistency
5. **Voice comparison** - Side-by-side waveform comparison
6. **Phrase practice** - Move beyond single words to sentences
7. **Native speaker recordings** - Replace TTS with human voice (higher quality)
8. **Social features** - Share achievements, leaderboards

### Alternative Speech Services (Future)

If higher accuracy needed:
- **SpeechSuper API** - Specialized pronunciation assessment ($0.0024/assessment)
- **Azure Pronunciation Assessment** - If Malayalam support added
- **Custom pronunciation model** - Train on Malayalam-specific phonemes

## Support Resources

- **Google Cloud Speech-to-Text Docs**: https://cloud.google.com/speech-to-text/docs
- **Google Cloud TTS Docs**: https://cloud.google.com/text-to-speech/docs
- **Expo Audio Docs**: https://docs.expo.dev/versions/latest/sdk/audio/
- **Firebase Storage Docs**: https://firebase.google.com/docs/storage
- **Malayalam Unicode**: https://www.unicode.org/charts/PDF/U0D00.pdf

## Summary

This plan provides a complete, production-ready implementation of Malayalam pronunciation practice using premium Google Cloud services. The architecture is scalable, the costs are predictable (~$25/month for 100 active users), and the user experience is comprehensive with accuracy scoring, playback, and progress tracking.

Key advantages of this approach:
- ✅ Confirmed Malayalam language support
- ✅ High-quality native pronunciation audio (WaveNet TTS)
- ✅ Comprehensive user feedback (score + playback + progress)
- ✅ Separate pronunciation word dataset (focused practice)
- ✅ Persistent user recordings (review capability)
- ✅ Integrated with existing Firebase infrastructure
- ✅ Cost-effective with generous free tier

The implementation is broken into logical phases with clear deliverables, making it easy to track progress and test incrementally.
