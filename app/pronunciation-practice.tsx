import { AudioPlayer } from "@/components/pronunciation/AudioPlayer";
import { FeedbackCard } from "@/components/pronunciation/FeedbackCard";
import { ScriptToggle } from "@/components/pronunciation/ScriptToggle";
import { SessionResults } from "@/components/pronunciation/SessionResults";
import { WordOption } from "@/components/pronunciation/WordOption";
import { usePronunciationSession } from "@/hooks/usePronunciationSession";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Phase = "loading" | "practice" | "feedback" | "results";

export default function PronunciationPracticeScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const difficultMode = mode === "difficult";

  const {
    session,
    isLoading,
    startSession,
    submitAnswer,
    nextQuestion,
    toggleScript,
    resetSession,
    currentQuestion,
    currentAnswer,
    score,
    hasAnswered,
    hasDifficultWords,
  } = usePronunciationSession({ difficultMode });

  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [hasHeardAudio, setHasHeardAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Start session on mount
  useEffect(() => {
    startSession();
  }, [startSession]);

  // Update phase based on session state
  useEffect(() => {
    if (isLoading) {
      setPhase("loading");
    } else if (session?.isComplete) {
      setPhase("results");
    } else if (hasAnswered) {
      setPhase("feedback");
    } else if (session) {
      setPhase("practice");
    }
  }, [isLoading, session, hasAnswered]);

  const handleAudioError = (error: Error) => {
    console.error("Audio playback error:", error);
    setAudioError("Audio failed to play. You can still select an answer.");
    // Enable options even on audio failure
    setHasHeardAudio(true);
  };

  const handleSelectWord = async (wordId: string) => {
    if (hasAnswered) return;
    setSelectedWordId(wordId);
    await submitAnswer(wordId);
  };

  const handleNext = async () => {
    setSelectedWordId(null);
    setHasHeardAudio(false); // Reset for next question
    setAudioError(null); // Reset error state
    await nextQuestion();
  };

  const handleRestart = () => {
    resetSession();
    setSelectedWordId(null);
    setHasHeardAudio(false);
    setAudioError(null);
    startSession(session?.scriptType);
  };

  const handlePracticeDifficult = () => {
    resetSession();
    setSelectedWordId(null);
    setHasHeardAudio(false);
    setAudioError(null);
    router.replace("/pronunciation-practice?mode=difficult");
  };

  const handleGoHome = () => {
    router.back();
  };

  if (phase === "loading" || !session) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading practice session...</Text>
      </SafeAreaView>
    );
  }

  if (phase === "results") {
    return (
      <SafeAreaView style={styles.container}>
        <SessionResults
          score={score}
          total={session.questions.length}
          onRestart={handleRestart}
          onGoHome={handleGoHome}
          onPracticeDifficult={handlePracticeDifficult}
          hasDifficultWords={hasDifficultWords}
        />
      </SafeAreaView>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  const isLastQuestion =
    session.currentQuestionIndex === session.questions.length - 1;

  // Randomize option order (but keep it stable for the question)
  const options = [currentQuestion.correctWord, currentQuestion.confusableWord];
  const shuffledOptions =
    currentQuestion.id.charCodeAt(currentQuestion.id.length - 1) % 2 === 0
      ? options
      : [...options].reverse();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with toggle and progress - fixed at top */}
      <View style={styles.header}>
        <ScriptToggle
          currentScript={session.scriptType}
          onToggle={toggleScript}
        />
        <Text style={styles.progressText}>
          {session.currentQuestionIndex + 1}/{session.questions.length}
        </Text>
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: hasAnswered ? 80 : 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Mode indicator */}
        {difficultMode && (
          <View style={styles.modeIndicator}>
            <Text style={styles.modeIndicatorText}>
              Reviewing Difficult Words
            </Text>
          </View>
        )}

        {/* Audio Player */}
        <AudioPlayer
          audioFile={currentQuestion.correctWord.pronunciation}
          disabled={phase === "feedback"}
          onPlaybackComplete={() => setHasHeardAudio(true)}
          onError={handleAudioError}
        />

        {/* Audio Error Warning */}
        {audioError && phase !== "feedback" && (
          <View style={styles.audioErrorContainer}>
            <Text style={styles.audioErrorTitle}>
              ⚠️ {audioError}
            </Text>
            <Text style={styles.audioErrorMessage}>
              You can try the audio button again, or proceed to select your
              answer.
            </Text>
          </View>
        )}

        {/* Instructions - Always visible to prevent UI jump */}
        <View style={styles.instructionsContainer}>
          {!hasHeardAudio && !hasAnswered ? (
            <Text style={styles.instructionTextBlue}>
              👆 Listen to the audio first before selecting an answer
            </Text>
          ) : hasHeardAudio && !hasAnswered ? (
            <Text style={styles.instructionTextGreen}>
              ✓ Great! Now choose the word you heard
            </Text>
          ) : (
            <View style={styles.instructionSpacer} />
          )}
        </View>

        {/* Word Options */}
        <View style={styles.optionsContainer}>
          {shuffledOptions.map((word) => (
            <WordOption
              key={word.id}
              word={word}
              scriptType={session.scriptType}
              isSelected={selectedWordId === word.id}
              isCorrect={word.id === currentQuestion.correctWord.id}
              showResult={hasAnswered}
              onSelect={() => handleSelectWord(word.id)}
              disabled={hasAnswered || !hasHeardAudio}
            />
          ))}
        </View>

        {/* Feedback Card (shown after answer) */}
        {phase === "feedback" && currentAnswer && (
          <FeedbackCard
            correctWord={currentQuestion.correctWord}
            wasCorrect={currentAnswer.isCorrect}
            reason={currentQuestion.reason}
            scriptType={session.scriptType}
            showActions={false}
          />
        )}
      </ScrollView>

      {/* Fixed bottom action button - only show after answer */}
      {hasAnswered && (
        <View style={styles.bottomBar}>
          <Pressable
            onPress={handleNext}
            style={styles.nextButton}
          >
            <Text style={styles.nextButtonText}>
              {isLastQuestion ? "See Results" : "Next Question"}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 16,
    color: "#4b5563",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  progressText: {
    color: "#4b5563",
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  modeIndicator: {
    backgroundColor: "#fed7aa",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  modeIndicatorText: {
    color: "#c2410c",
    fontSize: 14,
    fontWeight: "500",
  },
  audioErrorContainer: {
    backgroundColor: "#fff7ed",
    borderWidth: 2,
    borderColor: "#fdba74",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  audioErrorTitle: {
    color: "#92400e",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  audioErrorMessage: {
    color: "#c2410c",
    textAlign: "center",
    fontSize: 12,
  },
  instructionsContainer: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    marginHorizontal: 16,
    minHeight: 52,
  },
  instructionTextBlue: {
    color: "#1e40af",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  instructionTextGreen: {
    color: "#15803d",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  instructionSpacer: {
    height: 20,
  },
  optionsContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingBottom: 48,
    paddingTop: 12,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  nextButton: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  nextButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
});
