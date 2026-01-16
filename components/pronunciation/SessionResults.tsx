import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SessionResultsProps {
  score: number;
  total: number;
  onRestart: () => void;
  onGoHome: () => void;
  onPracticeDifficult: () => void;
  hasDifficultWords: boolean;
}

export function SessionResults({
  score,
  total,
  onRestart,
  onGoHome,
  onPracticeDifficult,
  hasDifficultWords,
}: SessionResultsProps) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const getMessage = () => {
    if (percentage === 100) return "Perfect! You're a pronunciation pro!";
    if (percentage >= 80) return 'Excellent work! Keep it up!';
    if (percentage >= 60) return 'Good effort! Practice makes perfect.';
    return "Don't give up! Try reviewing the difficult words.";
  };

  const getEmoji = () => {
    if (percentage === 100) return 'trophy';
    if (percentage >= 80) return 'star';
    if (percentage >= 60) return 'thumbs-up';
    return 'fitness';
  };

  return (
    <View className="flex-1 items-center justify-center p-6">
      <View className="w-32 h-32 rounded-full bg-blue-100 items-center justify-center mb-6">
        <Ionicons
          name={getEmoji() as keyof typeof Ionicons.glyphMap}
          size={60}
          color="#3b82f6"
        />
      </View>

      <Text className="text-3xl font-bold text-gray-900 mb-2">
        {score}/{total} Correct
      </Text>

      <Text className="text-xl text-gray-600 mb-2">{percentage}%</Text>

      <Text className="text-center text-gray-600 mb-8 px-4">{getMessage()}</Text>

      <View className="w-full space-y-3">
        <Pressable
          onPress={onRestart}
          className="w-full p-4 bg-blue-500 rounded-xl flex-row items-center justify-center"
        >
          <Ionicons name="refresh" size={20} color="white" />
          <Text className="text-white font-bold ml-2">Practice Again</Text>
        </Pressable>

        {hasDifficultWords && (
          <Pressable
            onPress={onPracticeDifficult}
            className="w-full p-4 bg-orange-500 rounded-xl flex-row items-center justify-center mt-3"
          >
            <Ionicons name="fitness" size={20} color="white" />
            <Text className="text-white font-bold ml-2">
              Review Difficult Words
            </Text>
          </Pressable>
        )}

        <Pressable
          onPress={onGoHome}
          className="w-full p-4 bg-gray-200 rounded-xl flex-row items-center justify-center mt-3"
        >
          <Ionicons name="home" size={20} color="#4b5563" />
          <Text className="text-gray-700 font-bold ml-2">Go Home</Text>
        </Pressable>
      </View>
    </View>
  );
}
