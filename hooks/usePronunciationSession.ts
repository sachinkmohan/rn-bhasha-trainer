import { useState, useCallback, useEffect } from 'react';
import {
  Word,
  ScriptType,
  PracticeQuestion,
  PracticeAnswer,
  PracticeSession,
} from '@/types/pronunciation';
import { confusablePairs } from '@/data/confusablePairs';
import { PracticeStorage } from '@/utils/storage';
import wordsData from '@/wordsMalayalam.json';

const words: Word[] = wordsData.wordsMalayalam as Word[];

function getWordById(id: string): Word | undefined {
  return words.find((w) => w.id === id);
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateQuestions(
  count: number,
  difficultWordIds?: string[]
): PracticeQuestion[] {
  let availablePairs = [...confusablePairs];

  // If practicing difficult words, filter to only those pairs
  if (difficultWordIds && difficultWordIds.length > 0) {
    availablePairs = availablePairs.filter(
      (pair) =>
        difficultWordIds.includes(pair.wordId) ||
        difficultWordIds.includes(pair.confusableWordId)
    );
  }

  // Shuffle and take the required count
  const shuffledPairs = shuffleArray(availablePairs);
  const selectedPairs = shuffledPairs.slice(0, Math.min(count, shuffledPairs.length));

  return selectedPairs.map((pair, index) => {
    const correctWord = getWordById(pair.wordId);
    const confusableWord = getWordById(pair.confusableWordId);

    if (!correctWord || !confusableWord) {
      throw new Error(`Word not found for pair: ${pair.id}`);
    }

    // Randomly decide which word is the "correct" one to ask about
    const shouldSwap = Math.random() > 0.5;

    return {
      id: `question-${index}`,
      correctWord: shouldSwap ? confusableWord : correctWord,
      confusableWord: shouldSwap ? correctWord : confusableWord,
      reason: pair.reason,
    };
  });
}

interface UsePronunciationSessionOptions {
  questionCount?: number;
  difficultMode?: boolean;
}

export function usePronunciationSession(
  options: UsePronunciationSessionOptions = {}
) {
  const { questionCount = 5, difficultMode = false } = options;

  const [session, setSession] = useState<PracticeSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [difficultWordIds, setDifficultWordIds] = useState<string[]>([]);

  // Load difficult words on mount
  useEffect(() => {
    PracticeStorage.getDifficultWords().then(setDifficultWordIds);
  }, []);

  const startSession = useCallback(
    async (scriptType: ScriptType = 'manglish') => {
      setIsLoading(true);
      try {
        const diffWords = difficultMode
          ? await PracticeStorage.getDifficultWords()
          : undefined;

        const questions = generateQuestions(questionCount, diffWords);

        setSession({
          questions,
          answers: [],
          currentQuestionIndex: 0,
          scriptType,
          isComplete: false,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [questionCount, difficultMode]
  );

  const submitAnswer = useCallback(
    async (selectedWordId: string) => {
      if (!session || session.isComplete) return;

      const currentQuestion = session.questions[session.currentQuestionIndex];
      const isCorrect = selectedWordId === currentQuestion.correctWord.id;

      if (isCorrect) {
        // Track correct answer for word progress
        await PracticeStorage.incrementWordProgress(currentQuestion.correctWord.id);
      } else {
        // If wrong, add to difficult words
        await PracticeStorage.addDifficultWord(currentQuestion.correctWord.id);
      }

      const newAnswer: PracticeAnswer = {
        questionId: currentQuestion.id,
        selectedWordId,
        isCorrect,
      };

      setSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          answers: [...prev.answers, newAnswer],
        };
      });

      return isCorrect;
    },
    [session]
  );

  const nextQuestion = useCallback(async () => {
    if (!session) return;

    const nextIndex = session.currentQuestionIndex + 1;
    const isComplete = nextIndex >= session.questions.length;

    if (isComplete) {
      // Save session result
      const score = session.answers.filter((a) => a.isCorrect).length;
      await PracticeStorage.saveSessionResult(score, session.questions.length);
    }

    setSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        isComplete,
      };
    });
  }, [session]);

  const toggleScript = useCallback(() => {
    setSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        scriptType: prev.scriptType === 'manglish' ? 'malayalam' : 'manglish',
      };
    });
  }, []);

  const resetSession = useCallback(() => {
    setSession(null);
  }, []);

  const currentQuestion = session?.questions[session.currentQuestionIndex];
  const currentAnswer = session?.answers.find(
    (a) => a.questionId === currentQuestion?.id
  );
  const score = session?.answers.filter((a) => a.isCorrect).length ?? 0;
  const hasAnswered = !!currentAnswer;

  return {
    session,
    isLoading,
    startSession,
    submitAnswer,
    nextQuestion,
    toggleScript,
    resetSession,
    currentQuestion,
    currentAnswer,
    score,
    hasAnswered,
    difficultWordIds,
    hasDifficultWords: difficultWordIds.length > 0,
  };
}
