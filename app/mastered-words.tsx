import { useMasteredWords } from "@/hooks/useMasteredWords";
import { Text, View } from "react-native";
export default function MasteredWordsScreen() {
  const { masteredWords, isLoading } = useMasteredWords();
  console.log("Get MasteredWords", masteredWords);
  return (
    <View>
      <Text> Mastered Words Screen</Text>
    </View>
  );
}
