import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useWordProgress } from "@/hooks/useWordProgress";

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
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-6 flex-1 justify-between">
      <View className="top-0">
        <View className="bg-green-50 rounded-2xl px-6 py-8">
          <View className="w-16 h-16 rounded-full bg-green-100 items-center justify-center mb-4">
            <Ionicons name="hand-right" size={32} color="#22c55e" />
          </View>
          <Text className="text-4xl font-bold mb-2">Hello Alex</Text>
          <Text className="text-lg text-gray-600">Welcome back! Let's continue learning Malayalam.</Text>
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
              <Text style={styles.learningDot}>Learning: {learningCount}</Text>
            </Text>
            <Text style={styles.stateSeparator}> | </Text>
            <Text style={styles.stateItem}>
              <Text style={styles.masteredDot}>Mastered: {masteredCount}</Text>
            </Text>
          </View>
        </View>
      </View>
      <View>
        <Pressable
          className="bg-green-500 mt-6 p-4 rounded-lg"
          onPress={() => router.push("/pronunciation-practice")}
        >
          <Text className="text-white text-center font-bold">
            Practice Pronunciation
          </Text>
        </Pressable>
      </View>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
});
