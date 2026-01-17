import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={getEmoji() as keyof typeof Ionicons.glyphMap}
          size={60}
          color="#3b82f6"
        />
      </View>

      <Text style={styles.scoreText}>
        {score}/{total} Correct
      </Text>

      <Text style={styles.percentageText}>{percentage}%</Text>

      <Text style={styles.messageText}>{getMessage()}</Text>

      <View style={styles.buttonsContainer}>
        <Pressable
          onPress={onRestart}
          style={styles.restartButton}
        >
          <Ionicons name="refresh" size={20} color="white" />
          <Text style={styles.buttonText}>Practice Again</Text>
        </Pressable>

        {hasDifficultWords && (
          <Pressable
            onPress={onPracticeDifficult}
            style={styles.difficultButton}
          >
            <Ionicons name="fitness" size={20} color="white" />
            <Text style={styles.buttonText}>
              Review Difficult Words
            </Text>
          </Pressable>
        )}

        <Pressable
          onPress={onGoHome}
          style={styles.homeButton}
        >
          <Ionicons name="home" size={20} color="#4b5563" />
          <Text style={styles.homeButtonText}>Go Home</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  scoreText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  percentageText: {
    fontSize: 20,
    color: '#4b5563',
    marginBottom: 8,
  },
  messageText: {
    textAlign: 'center',
    color: '#4b5563',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  buttonsContainer: {
    width: '100%',
    paddingBottom: 32,
  },
  restartButton: {
    width: '100%',
    padding: 16,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  difficultButton: {
    width: '100%',
    padding: 16,
    backgroundColor: '#f97316',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  homeButton: {
    width: '100%',
    padding: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  homeButtonText: {
    color: '#374151',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
