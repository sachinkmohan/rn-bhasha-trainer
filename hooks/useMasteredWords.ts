import { Word } from "@/types/pronunciation";
import { PracticeStorage, getWordState } from "@/utils/storage";
import wordsMalayalam from "@/wordsMalayalam.json";
import { useCallback, useEffect, useState } from "react";
export function useMasteredWords() {
  const [isLoading, setIsLoading] = useState(true);
  const [masteredWords, setMasteredWords] = useState<Word[]>([]);

  const getMasteredWords = useCallback(async () => {
    try {
      setIsLoading(true);
      const wordProgress = await PracticeStorage.getWordProgress();
      const filteredWords = wordsMalayalam.wordsMalayalam.filter((words) => {
        const progressIDs = wordProgress[words.id];
        const masteredState = getWordState(progressIDs?.correctCount || 0);
        return masteredState === "mastered";
      });
      setMasteredWords(filteredWords);
    } catch (error) {
      console.error("Failed to load mastered words:", error);
      setMasteredWords([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getMasteredWords();
  }, [getMasteredWords]);

  return {
    getMasteredWords,
    isLoading,
    masteredWords,
  };
}
