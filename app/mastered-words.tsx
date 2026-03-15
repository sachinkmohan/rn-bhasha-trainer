import { useMasteredWords } from "@/hooks/useMasteredWords";
import { FlatList, StyleSheet, Text, View } from "react-native";
export default function MasteredWordsScreen() {
  const { masteredWords, isLoading } = useMasteredWords();
  console.log("Get MasteredWords", masteredWords);
  return (
    <View style={styles.container}>
      <FlatList
        data={masteredWords}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text>{item.word.inTranslit}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    flex: 1,
    paddingBottom: 8,
  },
  itemRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 12,
  },
});
