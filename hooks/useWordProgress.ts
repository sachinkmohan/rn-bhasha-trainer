import { useState, useEffect, useCallback } from 'react';
import { PracticeStorage, getWordState } from '@/utils/storage';
import { WordState } from '@/types/pronunciation';
import wordsData from '@/wordsMalayalam.json';

interface WordProgressStats {
  newCount: number;
  learningCount: number;
  masteredCount: number;
  totalWords: number;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export function useWordProgress(): WordProgressStats {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    newCount: 0,
    learningCount: 0,
    masteredCount: 0,
  });

  const totalWords = wordsData.wordsMalayalam.length;

  const loadProgress = useCallback(async () => {
    setIsLoading(true);
    try {
      const wordProgress = await PracticeStorage.getWordProgress();

      let newCount = 0;
      let learningCount = 0;
      let masteredCount = 0;

      // Count each word's state
      for (const word of wordsData.wordsMalayalam) {
        const progress = wordProgress[word.id];
        const correctCount = progress?.correctCount ?? 0;
        const state: WordState = getWordState(correctCount);

        switch (state) {
          case 'new':
            newCount++;
            break;
          case 'learning':
            learningCount++;
            break;
          case 'mastered':
            masteredCount++;
            break;
        }
      }

      setStats({ newCount, learningCount, masteredCount });
    } catch (error) {
      console.error('Failed to load word progress:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return {
    ...stats,
    totalWords,
    isLoading,
    refresh: loadProgress,
  };
}
