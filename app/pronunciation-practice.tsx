import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { usePronunciationSession } from '@/hooks/usePronunciationSession';
import { ScriptToggle } from '@/components/pronunciation/ScriptToggle';
import { AudioPlayer } from '@/components/pronunciation/AudioPlayer';
import { WordOption } from '@/components/pronunciation/WordOption';
import { FeedbackCard } from '@/components/pronunciation/FeedbackCard';
import { SessionResults } from '@/components/pronunciation/SessionResults';

type Phase = 'loading' | 'practice' | 'feedback' | 'results';

export default function PronunciationPracticeScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const difficultMode = mode === 'difficult';

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
  const [phase, setPhase] = useState<Phase>('loading');

  // Start session on mount
  useEffect(() => {
    startSession();
  }, [startSession]);

  // Update phase based on session state
  useEffect(() => {
    if (isLoading) {
      setPhase('loading');
    } else if (session?.isComplete) {
      setPhase('results');
    } else if (hasAnswered) {
      setPhase('feedback');
    } else if (session) {
      setPhase('practice');
    }
  }, [isLoading, session, hasAnswered]);

  const handleSelectWord = async (wordId: string) => {
    if (hasAnswered) return;
    setSelectedWordId(wordId);
    await submitAnswer(wordId);
  };

  const handleNext = async () => {
    setSelectedWordId(null);
    await nextQuestion();
  };

  const handleRestart = () => {
    resetSession();
    setSelectedWordId(null);
    startSession(session?.scriptType);
  };

  const handlePracticeDifficult = () => {
    resetSession();
    setSelectedWordId(null);
    router.replace('/pronunciation-practice?mode=difficult');
  };

  const handleGoHome = () => {
    router.back();
  };

  if (phase === 'loading' || !session) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading practice session...</Text>
      </SafeAreaView>
    );
  }

  if (phase === 'results') {
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
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with toggle and progress */}
        <View className="flex-row items-center justify-between mb-4">
          <ScriptToggle
            currentScript={session.scriptType}
            onToggle={toggleScript}
          />
          <Text className="text-gray-600 font-medium">
            {session.currentQuestionIndex + 1}/{session.questions.length}
          </Text>
        </View>

        {/* Mode indicator */}
        {difficultMode && (
          <View className="bg-orange-100 px-3 py-1 rounded-full self-start mb-4">
            <Text className="text-orange-700 text-sm font-medium">
              Reviewing Difficult Words
            </Text>
          </View>
        )}

        {/* Audio Player */}
        <AudioPlayer disabled={phase === 'feedback'} />

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
              disabled={hasAnswered}
            />
          ))}
        </View>

        {/* Feedback Card (shown after answer) */}
        {phase === 'feedback' && currentAnswer && (
          <FeedbackCard
            correctWord={currentQuestion.correctWord}
            wasCorrect={currentAnswer.isCorrect}
            reason={currentQuestion.reason}
            scriptType={session.scriptType}
            onNext={handleNext}
            onReplay={() => {
              // Mock replay - in the future, this would trigger audio
            }}
            isLastQuestion={isLastQuestion}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
