import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { Word } from "./wordTypes";
const WordItem = ({ word }: { word: Word }) => {
  const router = useRouter();
  const openModal = () => {
    router.push({ pathname: "/modal", params: { wordId: word.id } });
  };
  return (
    <Pressable onPress={openModal} style={styles.itemContainer}>
      <Text style={styles.itemText}>{word.word.inTranslit}</Text>
    </Pressable>
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
