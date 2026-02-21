import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, Text, View } from "react-native";

const ProgressFeedback = ({
  wasCorrect,
  correctCount,
}: {
  wasCorrect: boolean;
  correctCount: number;
}) => {
  const iconName = wasCorrect ? "heart-circle-check" : "heart-crack";
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: wasCorrect ? "#f0fdf4" : "#fef2f2" },
      ]}
    >
      <FontAwesome6
        name={iconName}
        size={24}
        color={wasCorrect ? "green" : "red"}
      />
      <View>
        {correctCount < 3 ? (
          <Text>{correctCount}/3 correct toward mastery </Text>
        ) : (
          <Text>Mastered {correctCount} times!</Text>
        )}
        {correctCount === 3 && (
          <View style={styles.masteredContainer}>
            <Text>Word Mastered, added to Mastered list</Text>
            <MaterialIcons name="celebration" size={24} color="green" />
          </View>
        )}
      </View>
    </View>
  );
};

export { ProgressFeedback };

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#f0fdf4",
    borderRadius: 8,
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  masteredContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
