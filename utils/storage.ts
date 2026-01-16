import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistedPracticeData, WordProgress, WordState } from '@/types/pronunciation';

const STORAGE_KEY = 'pronunciation_practice_data';

const defaultData: PersistedPracticeData = {
  difficultWordIds: [],
  sessionHistory: [],
  wordProgress: {},
};

export function getWordState(correctCount: number): WordState {
  if (correctCount === 0) return 'new';
  if (correctCount < 3) return 'learning';
  return 'mastered';
}

async function getData(): Promise<PersistedPracticeData> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue != null) {
      const parsed = JSON.parse(jsonValue) as PersistedPracticeData;
      // Ensure wordProgress has a default for older persisted data
      return {
        ...parsed,
        wordProgress: parsed.wordProgress ?? {},
      };
    }
    return defaultData;
  } catch {
    return defaultData;
  }
}

async function saveData(data: PersistedPracticeData): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.error('Failed to save practice data');
  }
}

export const PracticeStorage = {
  async getDifficultWords(): Promise<string[]> {
    const data = await getData();
    return data.difficultWordIds;
  },

  async addDifficultWord(wordId: string): Promise<void> {
    const data = await getData();
    if (!data.difficultWordIds.includes(wordId)) {
      data.difficultWordIds.push(wordId);
      await saveData(data);
    }
  },

  async removeDifficultWord(wordId: string): Promise<void> {
    const data = await getData();
    data.difficultWordIds = data.difficultWordIds.filter((id) => id !== wordId);
    await saveData(data);
  },

  async saveSessionResult(score: number, totalQuestions: number): Promise<void> {
    const data = await getData();
    data.sessionHistory.push({
      date: new Date().toISOString(),
      score,
      totalQuestions,
    });
    await saveData(data);
  },

  async getSessionHistory(): Promise<PersistedPracticeData['sessionHistory']> {
    const data = await getData();
    return data.sessionHistory;
  },

  async clearDifficultWords(): Promise<void> {
    const data = await getData();
    data.difficultWordIds = [];
    await saveData(data);
  },

  async getWordProgress(): Promise<Record<string, WordProgress>> {
    const data = await getData();
    return data.wordProgress ?? {};
  },

  async incrementWordProgress(wordId: string): Promise<void> {
    const data = await getData();
    if (!data.wordProgress) {
      data.wordProgress = {};
    }

    const existing = data.wordProgress[wordId];
    data.wordProgress[wordId] = {
      wordId,
      correctCount: (existing?.correctCount ?? 0) + 1,
      lastPracticed: new Date().toISOString(),
    };
    await saveData(data);
  },
};
