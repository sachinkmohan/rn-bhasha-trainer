import { useMasteredWords } from "@/hooks/useMasteredWords";
import { FlatList, StyleSheet, Text, View } from "react-native";
export default function MasteredWordsScreen() {
  const { masteredWords, isLoading } = useMasteredWords();

  return (
    <View style={styles.container}>
      <FlatList
        data={masteredWords}
        renderItem={({ item }) => {
          return (
            <View style={styles.itemRow}>
              <View style={styles.itemRowHeader}>
                <Text style={styles.itemRowHeaderText}>
                  {item.word.inTranslit}
                </Text>
              </View>
              <View style={styles.itemRowBody}>
                <Text style={styles.itemRowBodyNative}>
                  {" "}
                  {item.word.inNativeScript}
                </Text>
                <Text>|</Text>
                <Text style={styles.itemRowBodyMeaning}> {item.meaning}</Text>
              </View>
            </View>
          );
        }}
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
  itemRowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemRowHeaderText: {
    fontSize: 20,
    fontWeight: "600",
  },
  itemRowBody: {
    marginTop: 8,
    flexDirection: "row",
    gap: 8,
  },
  itemRowBodyNative: {
    fontWeight: "600",
  },
  itemRowBodyMeaning: {
    color: "#555",
  },
});
