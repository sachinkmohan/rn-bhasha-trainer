import { ScriptType, Word } from "@/types/pronunciation";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface FeedbackCardProps {
  correctWord: Word;
  wasCorrect: boolean;
  reason: string;
  scriptType: ScriptType;
  showActions?: boolean;
  onNext?: () => void;
  isLastQuestion?: boolean;
}

export function FeedbackCard({
  correctWord,
  wasCorrect,
  reason,
  scriptType,
  showActions = true,
  onNext,
  isLastQuestion = false,
}: FeedbackCardProps) {
  return (
    <View
      className={`p-6 rounded-xl ${wasCorrect ? "bg-green-50" : "bg-orange-50"}`}
    >
      <View className="flex-row items-center mb-4">
        <Ionicons
          name={wasCorrect ? "checkmark-circle" : "information-circle"}
          size={28}
          color={wasCorrect ? "#16a34a" : "#ea580c"}
        />
        <Text
          className={`ml-2 text-lg font-bold ${
            wasCorrect ? "text-green-700" : "text-orange-700"
          }`}
        >
          {wasCorrect ? "Great job!" : "Keep practicing!"}
        </Text>
      </View>

      <View className="mb-4">
        <Text className="text-gray-600 mb-1">The word was:</Text>
        <Text className="text-2xl font-bold text-gray-900">
          {scriptType === "manglish"
            ? correctWord.word.inTranslit
            : correctWord.word.inNativeScript}
        </Text>
        <Text className="text-gray-500 mt-1">
          {scriptType === "manglish"
            ? correctWord.word.inNativeScript
            : correctWord.word.inTranslit}
        </Text>
      </View>

      <View className="mb-4">
        <Text className="text-gray-600 mb-1">Meaning:</Text>
        <Text className="text-lg text-gray-900">{correctWord.meaning}</Text>
      </View>

      <View
        className={`p-3 bg-white rounded-lg ${showActions && onNext ? "mb-6" : "mb-0"}`}
      >
        <Text className="text-gray-600 text-sm">
          <Text className="font-medium">Why these sound similar: </Text>
          {reason}
        </Text>
      </View>

      {showActions && onNext && (
        <Pressable
          onPress={onNext}
          className="w-full py-4 bg-blue-500 rounded-lg items-center flex-row justify-center"
        >
          <Text className="text-white font-bold text-lg mr-2">
            {isLastQuestion ? "See Results" : "Next Question"}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </Pressable>
      )}
    </View>
  );
}
