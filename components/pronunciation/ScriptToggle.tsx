import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ScriptType } from '@/types/pronunciation';

interface ScriptToggleProps {
  currentScript: ScriptType;
  onToggle: () => void;
}

export function ScriptToggle({ currentScript, onToggle }: ScriptToggleProps) {
  return (
    <View className="flex-row bg-gray-200 rounded-full p-1">
      <Pressable
        onPress={currentScript === 'malayalam' ? onToggle : undefined}
        className={`px-4 py-2 rounded-full ${
          currentScript === 'manglish' ? 'bg-white shadow' : ''
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
        onPress={currentScript === 'manglish' ? onToggle : undefined}
        className={`px-4 py-2 rounded-full ${
          currentScript === 'malayalam' ? 'bg-white shadow' : ''
        }`}
      >
        <Text
          className={`font-medium ${
            currentScript === 'malayalam' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          മലയാളം
        </Text>
      </Pressable>
    </View>
  );
}
