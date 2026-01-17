import { ScriptType, Word } from "@/types/pronunciation";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface FeedbackCardProps {
  correctWord: Word;
  wasCorrect: boolean;
  reason: string;
  scriptType: ScriptType;
  showActions?: boolean;
  onNext?: () => void;
  isLastQuestion?: boolean;
}

export function FeedbackCard({
  correctWord,
  wasCorrect,
  reason,
  scriptType,
  showActions = true,
  onNext,
  isLastQuestion = false,
}: FeedbackCardProps) {
  return (
    <View
      style={[
        styles.container,
        wasCorrect ? styles.containerCorrect : styles.containerIncorrect,
      ]}
    >
      <View style={styles.header}>
        <Ionicons
          name={wasCorrect ? "checkmark-circle" : "information-circle"}
          size={28}
          color={wasCorrect ? "#16a34a" : "#ea580c"}
        />
        <Text
          style={[
            styles.headerText,
            wasCorrect ? styles.headerTextCorrect : styles.headerTextIncorrect,
          ]}
        >
          {wasCorrect ? "Great job!" : "Keep practicing!"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>The word was:</Text>
        <Text style={styles.wordText}>
          {scriptType === "manglish"
            ? correctWord.word.inTranslit
            : correctWord.word.inNativeScript}
        </Text>
        <Text style={styles.alternateText}>
          {scriptType === "manglish"
            ? correctWord.word.inNativeScript
            : correctWord.word.inTranslit}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Meaning:</Text>
        <Text style={styles.meaningText}>{correctWord.meaning}</Text>
      </View>

      <View
        style={[
          styles.reasonContainer,
          showActions && onNext ? styles.reasonContainerWithAction : styles.reasonContainerNoAction,
        ]}
      >
        <Text style={styles.reasonText}>
          <Text style={styles.reasonBold}>Why these sound similar: </Text>
          {reason}
        </Text>
      </View>

      {showActions && onNext && (
        <Pressable
          onPress={onNext}
          style={styles.nextButton}
        >
          <Text style={styles.nextButtonText}>
            {isLastQuestion ? "See Results" : "Next Question"}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 12,
  },
  containerCorrect: {
    backgroundColor: '#f0fdf4',
  },
  containerIncorrect: {
    backgroundColor: '#fff7ed',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTextCorrect: {
    color: '#15803d',
  },
  headerTextIncorrect: {
    color: '#c2410c',
  },
  section: {
    marginBottom: 16,
  },
  label: {
    color: '#4b5563',
    marginBottom: 4,
  },
  wordText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  alternateText: {
    color: '#6b7280',
    marginTop: 4,
  },
  meaningText: {
    fontSize: 18,
    color: '#111827',
  },
  reasonContainer: {
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  reasonContainerWithAction: {
    marginBottom: 24,
  },
  reasonContainerNoAction: {
    marginBottom: 0,
  },
  reasonText: {
    color: '#4b5563',
    fontSize: 14,
  },
  reasonBold: {
    fontWeight: '500',
  },
  nextButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 8,
  },
});
