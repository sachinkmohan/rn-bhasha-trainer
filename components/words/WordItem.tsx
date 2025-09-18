import { StyleSheet, Text, View } from "react-native";
import { Word } from "./wordTypes";
const WordItem = ({ word }: { word: Word }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{word.word.inTranslit}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  itemText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  itemContainer: {
    padding: 15,
    borderRadius: 12,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
});

export default WordItem;
