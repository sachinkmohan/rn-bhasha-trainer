import { useMasteredWords } from "@/hooks/useMasteredWords";
import Entypo from "@expo/vector-icons/Entypo";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
export default function MasteredWordsScreen() {
  const { masteredWords, isLoading } = useMasteredWords();
  const [expandedId, setExpandedID] = useState<string | null>(null);

  function handlePress(wordId: string) {
    if (expandedId === wordId) {
      setExpandedID(null);
      console.log("expandedID", expandedId);
    } else {
      setExpandedID(wordId);
      console.log("else expandedID", expandedId);
    }
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={masteredWords}
        renderItem={({ item }) => {
          const isExpanded = expandedId === item.id;
          return (
            <View style={styles.itemRow}>
              <Pressable onPress={() => handlePress(item.id)}>
                <View style={styles.itemRowHeader}>
                  <Text>{item.word.inTranslit}</Text>
                  <Entypo name="chevron-small-down" size={24} color="black" />
                </View>
              </Pressable>
              {isExpanded && (
                <View>
                  <Text>MALAYALAM: {item.word.inNativeScript}</Text>
                  <Text>MEANING: {item.meaning}</Text>
                </View>
              )}
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
});
