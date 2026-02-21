import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, Text, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

export const ProgressFeedback = ({
  wasCorrect,
  correctCount,
}: {
  wasCorrect: boolean;
  correctCount: number;
}) => {
  return wasCorrect ? (
    <View style={styles.container}>
      <FontAwesome6 name="heart-circle-check" size={24} color="green" />
      <View>
        {correctCount < 3 ? (
          <Text>{correctCount}/3 correct toward mastery </Text>
        ) : (
          <Text>Mastered {correctCount} times!</Text>
        )}
        {correctCount === 3 && (
          <View style={styles.masteredContainer}>
            <ConfettiCannon
              count={200}
              origin={{ x: -30, y: 0 }}
              autoStart={wasCorrect}
              fadeOut
            />
            <Text>Word Mastered, yaay!</Text>
            <MaterialIcons name="celebration" size={24} color="green" />
          </View>
        )}
      </View>
    </View>
  ) : null;
};

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
