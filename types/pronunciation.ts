// Word structure from wordsMalayalam.json
export interface Word {
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

// Confusable pair relationship
export interface ConfusablePair {
  id: string;
  wordId: string;
  confusableWordId: string;
  reason: string;
}

// Script display preference
export type ScriptType = 'manglish' | 'malayalam';

// Single question in a session
export interface PracticeQuestion {
  id: string;
  correctWord: Word;
  confusableWord: Word;
  reason: string;
}

// User's answer for a question
export interface PracticeAnswer {
  questionId: string;
  selectedWordId: string;
  isCorrect: boolean;
}

// Current session state
export interface PracticeSession {
  questions: PracticeQuestion[];
  answers: PracticeAnswer[];
  currentQuestionIndex: number;
  scriptType: ScriptType;
  isComplete: boolean;
}

// Persisted data structure for AsyncStorage
export interface PersistedPracticeData {
  difficultWordIds: string[];
  sessionHistory: Array<{
    date: string;
    score: number;
    totalQuestions: number;
  }>;
}
