import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AudioPlayerProps {
  onPlay?: () => void;
  disabled?: boolean;
}

export function AudioPlayer({ onPlay, disabled = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (disabled) return;

    setIsPlaying(true);
    onPlay?.();

    // Mock audio playback - reset after 1.5 seconds
    setTimeout(() => {
      setIsPlaying(false);
    }, 1500);
  };

  return (
    <View className="items-center py-8">
      <Pressable
        onPress={handlePlay}
        disabled={disabled}
        className={`w-24 h-24 rounded-full items-center justify-center ${
          isPlaying ? 'bg-blue-600' : 'bg-blue-500'
        } ${disabled ? 'opacity-50' : ''}`}
      >
        <Ionicons
          name={isPlaying ? 'volume-high' : 'play'}
          size={40}
          color="white"
        />
      </Pressable>
      <Text className="mt-4 text-gray-600 text-center">
        {isPlaying ? 'Playing...' : 'Tap to hear the word'}
      </Text>
      <Text className="mt-1 text-gray-400 text-sm text-center">
        (Audio coming soon)
      </Text>
    </View>
  );
}
