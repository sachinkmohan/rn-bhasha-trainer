import { Word } from "@/components/words/wordTypes";
import wordsMalayalam from "@/wordsMalayalam.json";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function ModalScreen() {
  const { wordId } = useLocalSearchParams();
  const clickedWordId = (wordsMalayalam.wordsMalayalam as Word[]).find(
    (item) => item.id === wordId
  );
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">This is a modal</ThemedText>
      <Stack.Screen options={{ title: clickedWordId?.word.inTranslit }} />
      <ThemedText type="title">{clickedWordId?.word.inNativeScript}</ThemedText>
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Go to home screen</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
