import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWordAudio } from '@/utils/audio';

interface AudioPlayerProps {
  audioFile?: string; // e.g., "ithu.mp3"
  onPlay?: () => void;
  onPlaybackComplete?: () => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
}

export function AudioPlayer({
  audioFile,
  onPlay,
  onPlaybackComplete,
  onError,
  disabled = false,
}: AudioPlayerProps) {
  const player = useWordAudio(audioFile);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset state when audio file changes (new question)
  useEffect(() => {
    setIsPlaying(false);
    setHasPlayed(false);
    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [audioFile]);

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

      if (onError) {
        onError(error instanceof Error ? error : new Error('Audio playback failed'));
      }

      // Fallback: call completion
      timeoutRef.current = setTimeout(() => {
        onPlaybackComplete?.();
        timeoutRef.current = null;
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Pressable
          onPress={handlePlay}
          disabled={disabled || !audioFile}
          style={[
            styles.playButton,
            isPlaying ? styles.playButtonPlaying : styles.playButtonDefault,
            (disabled || !audioFile) && styles.playButtonDisabled,
          ]}
        >
          <Ionicons
            name={isPlaying ? 'volume-high' : 'play'}
            size={48}
            color="white"
          />
        </Pressable>
      </Animated.View>

      <View style={styles.textContainer}>
        <Text style={[
          styles.statusText,
          isPlaying ? styles.statusTextPlaying : styles.statusTextDefault,
        ]}>
          {isPlaying
            ? '🔊 Playing Audio...'
            : audioFile
              ? '▶️ Tap to Play'
              : 'Audio not available'}
        </Text>

        {audioFile && !disabled && (
          <Text style={styles.hintText}>
            {hasPlayed ? '✓ You can replay anytime' : 'Listen carefully!'}
          </Text>
        )}

        {!audioFile && (
          <Text style={styles.unavailableText}>
            (Audio coming soon)
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  playButton: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playButtonDefault: {
    backgroundColor: '#3b82f6',
  },
  playButtonPlaying: {
    backgroundColor: '#22c55e',
  },
  playButtonDisabled: {
    opacity: 0.5,
  },
  textContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  statusText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  statusTextDefault: {
    color: '#374151',
  },
  statusTextPlaying: {
    color: '#16a34a',
  },
  hintText: {
    marginTop: 8,
    color: '#2563eb',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  unavailableText: {
    marginTop: 4,
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
  },
});
