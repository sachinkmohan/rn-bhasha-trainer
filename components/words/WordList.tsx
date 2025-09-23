import wordsDataMalayalam from "@/wordsMalayalam.json";
import { useEffect, useState } from "react";
import { View } from "react-native";
import WordListContainer from "./WordListContainer";
import { Word } from "./wordTypes";

const WordList = () => {
  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    setWords(wordsDataMalayalam.wordsMalayalam as Word[]);
  }, []);
  return (
    <View>
      <WordListContainer words={words} />
    </View>
  );
};

export default WordList;
