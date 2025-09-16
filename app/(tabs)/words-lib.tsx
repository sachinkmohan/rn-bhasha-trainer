import wordsMalayalam from "@/wordsMalayalam.json";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      {wordsMalayalam.wordsMalayalam.map((entry, index) => (
        <View key={entry.id}>
          <Text style={styles.word}>{entry.word.inTranslit}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#f0f4ff",
  },
  word: {
    fontSize: 18,
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingVertical: 10,
  },
});
