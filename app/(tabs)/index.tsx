import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../_layout";

// Simple Hello World screen
export default function HomeScreen() {
  const { signOut } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome</Text>
      <Text style={styles.user}>User</Text>
      <View style={styles.progressBox}>
        <Text>Your Progress</Text>
        <Text style={styles.progressText}>2/10</Text>
        <Text style={styles.wordsLearned}>Words Learned</Text>
      </View>
      <Button title="Sign Out" onPress={signOut} color="#FF3D00" />
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
