import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { StyleSheet, Text, View } from "react-native";
import * as Progress from "react-native-progress";

export const MasteryProgressBadge = ({
  correctCount,
}: {
  correctCount: number;
}) => {
  return (
    <View style={styles.container}>
      <View>
        {correctCount < 3 && (
          <View>
            <View style={styles.progressTitleRow}>
              <Text> Word Mastery</Text>
              <Text> {correctCount}/3</Text>
            </View>
            <Progress.Bar progress={correctCount / 3} />
          </View>
        )}
        {correctCount >= 3 && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text>Mastered {correctCount} Times!</Text>
            <MaterialCommunityIcons name="star-face" size={24} color="black" />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0fdf4",
    alignSelf: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#22c55e",
  },
  progressTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 4,
  },
});
