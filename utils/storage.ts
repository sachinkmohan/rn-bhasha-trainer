import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistedPracticeData } from '@/types/pronunciation';

const STORAGE_KEY = 'pronunciation_practice_data';

const defaultData: PersistedPracticeData = {
  difficultWordIds: [],
  sessionHistory: [],
};

async function getData(): Promise<PersistedPracticeData> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : defaultData;
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
};
