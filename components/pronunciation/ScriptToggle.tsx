import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ScriptType } from '@/types/pronunciation';

interface ScriptToggleProps {
  currentScript: ScriptType;
  onToggle: () => void;
}

export function ScriptToggle({ currentScript, onToggle }: ScriptToggleProps) {
  const handleManglishPress = () => {
    if (currentScript !== 'manglish') {
      onToggle();
    }
  };

  const handleMalayalamPress = () => {
    if (currentScript !== 'malayalam') {
      onToggle();
    }
  };

  return (
    <View className="flex-row bg-gray-200 rounded-full p-1">
      <Pressable
        onPress={handleManglishPress}
        className={`px-4 py-2 rounded-full ${
          currentScript === 'manglish' ? 'bg-white' : ''
        }`}
      >
        <Text
          className={`font-medium ${
            currentScript === 'manglish' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          Manglish
        </Text>
      </Pressable>
      <Pressable
        onPress={handleMalayalamPress}
        className={`px-4 py-2 rounded-full ${
          currentScript === 'malayalam' ? 'bg-white' : ''
        }`}
      >
        <Text
          className={`font-medium ${
            currentScript === 'malayalam' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          Malayalam
        </Text>
      </Pressable>
    </View>
  );
}
