import { View } from "react-native";
import WordItem from "./WordItem";
import { Word } from "./wordTypes";
const WordListContainer = ({ words }: { words: Word[] }) => {
  return (
    <View style={{ paddingBottom: 50 }}>
      {words.map((word) => (
        <WordItem key={word.id} word={word} />
      ))}
    </View>
  );
};

export default WordListContainer;
