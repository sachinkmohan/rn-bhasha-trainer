import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

// Simple Hello World screen
export default function HomeScreen() {
  return (
    <View className="p-6 flex-1 justify-between">
      <View className="top-0">
        <View>
          <Text className="pt-4 text-2xl">Hello Alex 👋</Text>
          <Text>Ready to practice?</Text>
        </View>
      </View>
      <View>
        <Text style={styles.welcome}>Welcome</Text>
        <Text style={styles.user}>User</Text>
        <View style={styles.progressBox}>
          <Text>Your Progress</Text>
          <Text style={styles.progressText}>2/10</Text>
          <Text style={styles.wordsLearned}>Words Learned</Text>
        </View>
      </View>
      <View>
        <Pressable
          className="bg-green-500 mt-6 p-4 rounded-lg"
          onPress={() => alert("Button Pressed!")}
        >
          <Text className="text-white text-center font-bold">
            Practice Pronunciation
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f4ff",
  },
  welcome: {
    color: "#2D5D7B",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  user: {
    fontSize: 16,
    color: "#4B7F52",
  },
  progressBox: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#737ae6ff",
    borderRadius: 12,
    width: 220,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  progressText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 5,
  },
  wordsLearned: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
});
