import React from "react";
import { Text, View } from "react-native";

// Simple Hello World screen
export default function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Hello World!</Text>
    </View>
  );
}
