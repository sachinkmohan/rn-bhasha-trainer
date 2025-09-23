import WordList from "@/components/words/WordList";
import { ScrollView, StyleSheet } from "react-native";

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <WordList />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#f0f4ff",
  },
});
