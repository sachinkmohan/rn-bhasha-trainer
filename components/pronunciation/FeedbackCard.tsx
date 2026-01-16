import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Word, ScriptType } from '@/types/pronunciation';

interface FeedbackCardProps {
  correctWord: Word;
  wasCorrect: boolean;
  reason: string;
  scriptType: ScriptType;
  onNext: () => void;
  onReplay: () => void;
  isLastQuestion: boolean;
}

export function FeedbackCard({
  correctWord,
  wasCorrect,
  reason,
  scriptType,
  onNext,
  onReplay,
  isLastQuestion,
}: FeedbackCardProps) {
  return (
    <View
      className={`p-6 rounded-xl ${wasCorrect ? 'bg-green-50' : 'bg-orange-50'}`}
    >
      <View className="flex-row items-center mb-4">
        <Ionicons
          name={wasCorrect ? 'checkmark-circle' : 'information-circle'}
          size={28}
          color={wasCorrect ? '#16a34a' : '#ea580c'}
        />
        <Text
          className={`ml-2 text-lg font-bold ${
            wasCorrect ? 'text-green-700' : 'text-orange-700'
          }`}
        >
          {wasCorrect ? 'Great job!' : 'Keep practicing!'}
        </Text>
      </View>

      <View className="mb-4">
        <Text className="text-gray-600 mb-1">The word was:</Text>
        <Text className="text-2xl font-bold text-gray-900">
          {scriptType === 'manglish'
            ? correctWord.word.inTranslit
            : correctWord.word.inNativeScript}
        </Text>
        <Text className="text-gray-500 mt-1">
          {scriptType === 'manglish'
            ? correctWord.word.inNativeScript
            : correctWord.word.inTranslit}
        </Text>
      </View>

      <View className="mb-4">
        <Text className="text-gray-600 mb-1">Meaning:</Text>
        <Text className="text-lg text-gray-900">{correctWord.meaning}</Text>
      </View>

      <View className="mb-6 p-3 bg-white rounded-lg">
        <Text className="text-gray-600 text-sm">
          <Text className="font-medium">Why these sound similar: </Text>
          {reason}
        </Text>
      </View>

      <View className="flex-row justify-between">
        <Pressable
          onPress={onReplay}
          className="flex-row items-center px-4 py-3 bg-gray-200 rounded-lg"
        >
          <Ionicons name="play-circle" size={20} color="#4b5563" />
          <Text className="ml-2 text-gray-700 font-medium">Replay</Text>
        </Pressable>

        <Pressable
          onPress={onNext}
          className="flex-row items-center px-6 py-3 bg-blue-500 rounded-lg"
        >
          <Text className="text-white font-bold">
            {isLastQuestion ? 'See Results' : 'Next'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </Pressable>
      </View>
    </View>
  );
}
