import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, Text, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

export const ProgressFeedback = ({
  wasCorrect,
  correctCount,
  wordLabel,
}: {
  wasCorrect: boolean;
  correctCount: number;
  wordLabel: string;
}) => {
  const progressNotYetMasteredText = `${wordLabel}: ${correctCount}/3 correct toward mastery`;
  const progressMasteredText = ` ${wordLabel}: Mastered ${correctCount} times!`;
  const isNotYetMastered = correctCount > 0 && correctCount < 3;
  const isMasteredMoreTimes = correctCount > 3;
  const isMastered = correctCount === 3;

  return wasCorrect ? (
    <View style={styles.container}>
      <FontAwesome6 name="heart-circle-check" size={24} color="green" />
      <View>
        {isNotYetMastered ? (
          <Text>{progressNotYetMasteredText}</Text>
        ) : isMasteredMoreTimes ? (
          <Text>{progressMasteredText}</Text>
        ) : null}
        {isMastered && (
          <View style={styles.masteredContainer}>
            <ConfettiCannon count={200} origin={{ x: -30, y: 0 }} fadeOut />
            <Text>{wordLabel}: Word Mastered, yaay!</Text>
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
