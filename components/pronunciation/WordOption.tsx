import { ScriptType, Word } from "@/types/pronunciation";
import { useWordAudio } from "@/utils/audio";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
    scriptType === "manglish" ? word.word.inTranslit : word.word.inNativeScript;

  const [isPlaying, setIsPlaying] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const player = useWordAudio(word.pronunciation);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handlePlayAudio = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsPlaying(true);
    player?.seekTo(0);
    player?.play();
    const duration = player?.duration * 1000 || 1500; // Fallback to 1.5s if duration unknown
    timeoutRef.current = setTimeout(() => {
      setIsPlaying(false);
    }, duration);
  };

  const getBorderColor = () => {
    if (!showResult) {
      return isSelected ? "#3b82f6" : "#d1d5db";
    }
    if (isCorrect) {
      return "#22c55e";
    }
    if (isSelected && !isCorrect) {
      return "#ef4444";
    }
    return "#d1d5db";
  };

  const getBackgroundColor = () => {
    if (!showResult) {
      return isSelected ? "#eff6ff" : "#ffffff";
    }
    if (isCorrect) {
      return "#f0fdf4";
    }
    if (isSelected && !isCorrect) {
      return "#fef2f2";
    }
    return "#ffffff";
  };

  return (
    <Pressable
      onPress={onSelect}
      disabled={disabled}
      style={[
        styles.container,
        {
          borderColor: getBorderColor(),
          backgroundColor: getBackgroundColor(),
        },
        disabled && styles.disabled,
      ]}
    >
      <Text
        style={[
          styles.wordText,
          scriptType === "malayalam" && styles.wordTextMalayalam,
        ]}
      >
        {displayText}
      </Text>
      {showResult && (
        <View style={styles.resultContainer}>
          {isCorrect && <Text style={styles.correctText}>Correct!</Text>}
          {isSelected && !isCorrect && (
            <Text style={styles.incorrectText}>Incorrect</Text>
          )}
        </View>
      )}
      {showResult && (
        <Pressable
          style={styles.secondaryAudioButton}
          accessibilityLabel="Playing the word's pronunciation"
          accessibilityRole="button"
          onPress={handlePlayAudio}
        >
          <Ionicons
            name="play-circle"
            size={32}
            color={isPlaying ? "#22c55e" : "#3b82f6"}
          />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 8,
    padding: 24,
    borderRadius: 12,
    borderWidth: 2,
    position: "relative",
  },
  secondaryAudioButton: {
    position: "absolute",
    right: 8,
    bottom: 8,
  },
  disabled: {
    opacity: 0.7,
  },
  wordText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
  },
  wordTextMalayalam: {
    fontSize: 24,
  },
  resultContainer: {
    marginTop: 8,
  },
  correctText: {
    textAlign: "center",
    color: "#16a34a",
    fontSize: 14,
  },
  incorrectText: {
    textAlign: "center",
    color: "#dc2626",
    fontSize: 14,
  },
});
