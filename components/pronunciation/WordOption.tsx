import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Word, ScriptType } from '@/types/pronunciation';

interface WordOptionProps {
  word: Word;
  scriptType: ScriptType;
  isSelected: boolean;
  isCorrect?: boolean; // undefined before answer, true/false after
  showResult: boolean;
  onSelect: () => void;
  disabled: boolean;
}

export function WordOption({
  word,
  scriptType,
  isSelected,
  isCorrect,
  showResult,
  onSelect,
  disabled,
}: WordOptionProps) {
  const displayText =
    scriptType === 'manglish' ? word.word.inTranslit : word.word.inNativeScript;

  const getBorderColor = () => {
    if (!showResult) {
      return isSelected ? 'border-blue-500' : 'border-gray-300';
    }
    if (isCorrect) {
      return 'border-green-500';
    }
    if (isSelected && !isCorrect) {
      return 'border-red-500';
    }
    return 'border-gray-300';
  };

  const getBackgroundColor = () => {
    if (!showResult) {
      return isSelected ? 'bg-blue-50' : 'bg-white';
    }
    if (isCorrect) {
      return 'bg-green-50';
    }
    if (isSelected && !isCorrect) {
      return 'bg-red-50';
    }
    return 'bg-white';
  };

  return (
    <Pressable
      onPress={onSelect}
      disabled={disabled}
      className={`flex-1 mx-2 p-6 rounded-xl border-2 ${getBorderColor()} ${getBackgroundColor()} ${
        disabled ? 'opacity-70' : ''
      }`}
    >
      <Text
        className={`text-center text-xl font-semibold ${
          scriptType === 'malayalam' ? 'text-2xl' : ''
        }`}
      >
        {displayText}
      </Text>
      {showResult && (
        <View className="mt-2">
          {isCorrect && (
            <Text className="text-center text-green-600 text-sm">Correct!</Text>
          )}
          {isSelected && !isCorrect && (
            <Text className="text-center text-red-600 text-sm">Incorrect</Text>
          )}
        </View>
      )}
    </Pressable>
  );
}
