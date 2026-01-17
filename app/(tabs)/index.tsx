import { useWordProgress } from "@/hooks/useWordProgress";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const { newCount, learningCount, masteredCount, totalWords, refresh } =
    useWordProgress();

  // Refresh progress when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [refresh])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View>
          <View style={styles.greetingBox}>
            <Text style={styles.greetingText}>
              Hello <Ionicons name="hand-right" size={32} color="#ffd700" />
            </Text>
            <Text style={styles.welcomeText}>
              Welcome back! Let's continue learning Malayalam.
            </Text>
          </View>
        </View>
        <View>
          <View style={styles.progressBox}>
            <Text style={styles.progressLabel}>Your Progress</Text>
            <Text style={styles.progressText}>
              {masteredCount}/{totalWords}
            </Text>
            <Text style={styles.wordsLearned}>Words Mastered</Text>
            <View style={styles.stateBreakdown}>
              <Text style={styles.stateItem}>
                <Text style={styles.newDot}>New: {newCount}</Text>
              </Text>
              <Text style={styles.stateSeparator}> | </Text>
              <Text style={styles.stateItem}>
                <Text style={styles.learningDot}>
                  Learning: {learningCount}
                </Text>
              </Text>
              <Text style={styles.stateSeparator}> | </Text>
              <Text style={styles.stateItem}>
                <Text style={styles.masteredDot}>
                  Mastered: {masteredCount}
                </Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.practiceButton}
            onPress={() => router.push("/pronunciation-practice")}
          >
            <Text style={styles.practiceButtonText}>
              Practice Pronunciation
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  content: {
    padding: 24,
    flex: 1,
    justifyContent: "space-between",
  },
  greetingBox: {
    backgroundColor: "#f0fdf4",
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  greetingText: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 40,
  },
  welcomeText: {
    fontSize: 18,
    color: "#4b5563",
  },
  progressBox: {
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#737ae6ff",
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  progressLabel: {
    fontSize: 14,
    color: "#666",
  },
  progressText: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 4,
    color: "#22c55e",
  },
  wordsLearned: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  stateBreakdown: {
    flexDirection: "row",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  stateItem: {
    fontSize: 12,
  },
  stateSeparator: {
    fontSize: 12,
    color: "#ccc",
  },
  newDot: {
    color: "#9ca3af",
  },
  learningDot: {
    color: "#f59e0b",
  },
  masteredDot: {
    color: "#22c55e",
  },
  buttonContainer: {
    paddingBottom: 24,
  },
  practiceButton: {
    backgroundColor: "#22c55e",
    marginTop: 24,
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  practiceButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
