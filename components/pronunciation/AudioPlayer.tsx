import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWordAudio } from '@/utils/audio';

interface AudioPlayerProps {
  audioFile?: string; // e.g., "ithu.mp3"
  onPlay?: () => void;
  onPlaybackComplete?: () => void;
  disabled?: boolean;
}

export function AudioPlayer({
  audioFile,
  onPlay,
  onPlaybackComplete,
  disabled = false,
}: AudioPlayerProps) {
  const player = useWordAudio(audioFile);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Reset state when audio file changes (new question)
  useEffect(() => {
    setIsPlaying(false);
    setHasPlayed(false);
    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [audioFile]);

  // Track playing state from player
  useEffect(() => {
    if (player?.playing) {
      setIsPlaying(true);
    } else if (isPlaying && !player?.playing) {
      // Just stopped playing
      setIsPlaying(false);
      if (hasPlayed) {
        // Only call completion after first play finished
        onPlaybackComplete?.();
      }
    }
  }, [player?.playing, isPlaying, hasPlayed, onPlaybackComplete]);

  // Pulsing animation when playing
  useEffect(() => {
    if (isPlaying) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isPlaying, pulseAnim]);

  const handlePlay = () => {
    if (disabled || !audioFile || !player) return;

    try {
      // Clear any previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set to playing state immediately for visual feedback
      setIsPlaying(true);

      // Always replay from start
      player.seekTo(0);
      player.play();
      setHasPlayed(true);
      onPlay?.();

      // Fallback: Stop visual "playing" state after 2.5 seconds (max audio length)
      // This ensures button returns to blue and options get enabled
      timeoutRef.current = setTimeout(() => {
        setIsPlaying(false);
        onPlaybackComplete?.();
        timeoutRef.current = null;
      }, 2500);
    } catch (error) {
      console.error('Error playing audio:', error);
      // Enable options even on error
      setIsPlaying(false);
      setTimeout(() => {
        onPlaybackComplete?.();
      }, 1000);
    }
  };

  return (
    <View className="items-center py-8">
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Pressable
          onPress={handlePlay}
          disabled={disabled || !audioFile}
          className={`w-28 h-28 rounded-full items-center justify-center shadow-lg ${
            isPlaying ? 'bg-green-500' : 'bg-blue-500'
          } ${disabled || !audioFile ? 'opacity-50' : ''}`}
        >
          <Ionicons
            name={isPlaying ? 'volume-high' : 'play'}
            size={48}
            color="white"
          />
        </Pressable>
      </Animated.View>

      <View className="mt-4 items-center">
        <Text className={`text-center font-bold text-lg ${isPlaying ? 'text-green-600' : 'text-gray-700'}`}>
          {isPlaying
            ? '🔊 Playing Audio...'
            : audioFile
              ? '▶️ Tap to Play'
              : 'Audio not available'}
        </Text>

        {audioFile && !disabled && (
          <Text className="mt-2 text-blue-600 text-sm text-center font-medium">
            {hasPlayed ? '✓ You can replay anytime' : 'Listen carefully!'}
          </Text>
        )}

        {!audioFile && (
          <Text className="mt-1 text-gray-400 text-sm text-center">
            (Audio coming soon)
          </Text>
        )}
      </View>
    </View>
  );
}
