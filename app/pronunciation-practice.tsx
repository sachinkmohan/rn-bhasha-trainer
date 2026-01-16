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
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading practice session...</Text>
      </SafeAreaView>
    );
  }

  if (phase === "results") {
    return (
      <SafeAreaView className="flex-1 bg-white">
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
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with toggle and progress - fixed at top */}
      <View className="px-4 pt-4 pb-2 flex-row items-center justify-between border-b border-gray-100">
        <ScriptToggle
          currentScript={session.scriptType}
          onToggle={toggleScript}
        />
        <Text className="text-gray-600 font-medium">
          {session.currentQuestionIndex + 1}/{session.questions.length}
        </Text>
      </View>

      {/* Scrollable content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          padding: 16,
          paddingBottom: hasAnswered ? 80 : 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Mode indicator */}
        {difficultMode && (
          <View className="bg-orange-100 px-3 py-1 rounded-full self-start mb-4">
            <Text className="text-orange-700 text-sm font-medium">
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
          <View className="bg-orange-50 border-2 border-orange-300 px-4 py-3 rounded-lg mb-4 mx-4">
            <Text className="text-orange-800 text-center text-sm font-semibold mb-2">
              ⚠️ {audioError}
            </Text>
            <Text className="text-orange-700 text-center text-xs">
              You can try the audio button again, or proceed to select your
              answer.
            </Text>
          </View>
        )}

        {/* Instructions - Always visible to prevent UI jump */}
        <View className="bg-blue-50 px-4 py-3 rounded-lg mb-4 mx-4 min-h-[52px]">
          {!hasHeardAudio && !hasAnswered ? (
            <Text className="text-blue-800 text-center text-sm font-medium">
              👆 Listen to the audio first before selecting an answer
            </Text>
          ) : hasHeardAudio && !hasAnswered ? (
            <Text className="text-green-700 text-center text-sm font-medium">
              ✓ Great! Now choose the word you heard
            </Text>
          ) : (
            <View className="h-[20px]" />
          )}
        </View>

        {/* Word Options */}
        <View className="flex-row mb-6">
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
        <View className="px-4 pb-12 pt-3 bg-white border-t border-gray-200">
          <Pressable
            onPress={handleNext}
            className="w-full py-4 bg-blue-500 rounded-lg items-center flex-row justify-center"
          >
            <Text className="text-white text-lg font-bold mr-2">
              {isLastQuestion ? "See Results" : "Next Question"}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
