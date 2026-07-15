import { useWordAudio } from "@/utils/audio";
import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayerStatus } from "expo-audio";
import { Pressable } from "react-native";

interface PlayAudioButtonProps {
  audioFile?: string; // e.g., "ithu.mp3"
}
export function PlayAudioButton({ audioFile }: PlayAudioButtonProps) {
  const player = useWordAudio(audioFile);
  useAudioPlayerStatus(player);

  const displayPlayableIcon = () => {
    if (player?.playing) return "volume-high";
    return "play";
  };

  const handlePlay = () => {
    if (!player) return;
    player.seekTo(0);
    player.play();
  };
  return (
    <Pressable onPress={handlePlay} disabled={!player}>
      <Ionicons name={displayPlayableIcon()} size={24} color="black" />
    </Pressable>
  );
}
