// utils/audio.ts
import { useAudioPlayer } from 'expo-audio';

// Audio file imports (local storage approach)
// All audio files are in assets/audio/confusing-pairs/
const audioFiles: Record<string, any> = {
  'aaNu.mp3': require('@/assets/audio/confusing-pairs/aaNu.mp3'),
  'aana.mp3': require('@/assets/audio/confusing-pairs/aana.mp3'),
  'athu.mp3': require('@/assets/audio/confusing-pairs/athu.mp3'),
  'eNeekku.mp3': require('@/assets/audio/confusing-pairs/eNeekku.mp3'),
  'enikku.mp3': require('@/assets/audio/confusing-pairs/enikku.mp3'),
  'ente.mp3': require('@/assets/audio/confusing-pairs/ente.mp3'),
  'enthu-2.mp3': require('@/assets/audio/confusing-pairs/enthu-2.mp3'),
  'enthu.mp3': require('@/assets/audio/confusing-pairs/enthu.mp3'),
  'ethu.mp3': require('@/assets/audio/confusing-pairs/ethu.mp3'),
  'ithu.mp3': require('@/assets/audio/confusing-pairs/ithu.mp3'),
  'karaNam-2.mp3': require('@/assets/audio/confusing-pairs/karaNam-2.mp3'),
  'karaNam.mp3': require('@/assets/audio/confusing-pairs/karaNam.mp3'),
  'karikkuka.mp3': require('@/assets/audio/confusing-pairs/karikkuka.mp3'),
  'kazhikkuka.mp3': require('@/assets/audio/confusing-pairs/kazhikkuka.mp3'),
  'paLLi-2.mp3': require('@/assets/audio/confusing-pairs/paLLi-2.mp3'),
  'paLam-2.mp3': require('@/assets/audio/confusing-pairs/paLam-2.mp3'),
  'paNi-2.mp3': require('@/assets/audio/confusing-pairs/paNi-2.mp3'),
  'padikkuka.mp3': require('@/assets/audio/confusing-pairs/padikkuka.mp3'),
  'palam.mp3': require('@/assets/audio/confusing-pairs/palam.mp3'),
  'palli.mp3': require('@/assets/audio/confusing-pairs/palli.mp3'),
  'pani.mp3': require('@/assets/audio/confusing-pairs/pani.mp3'),
  'pattikkuka.mp3': require('@/assets/audio/confusing-pairs/pattikkuka.mp3'),
  'peRu-2.mp3': require('@/assets/audio/confusing-pairs/peRu-2.mp3'),
  'peru.mp3': require('@/assets/audio/confusing-pairs/peru.mp3'),
  'thuNi.mp3': require('@/assets/audio/confusing-pairs/thuNi.mp3'),
  'thunni.mp3': require('@/assets/audio/confusing-pairs/thunni.mp3'),
  'uRa-2.mp3': require('@/assets/audio/confusing-pairs/uRa-2.mp3'),
  'ura.mp3': require('@/assets/audio/confusing-pairs/ura.mp3'),
};

/**
 * Get the audio source for a given filename
 * @param filename - The audio filename (e.g., "ithu.mp3")
 * @returns The audio source or null if not found
 */
export function getAudioSource(filename: string) {
  const audioFile = audioFiles[filename];
  if (!audioFile) {
    console.warn(`Audio file not found: ${filename}`);
    return null;
  }
  return audioFile;
}

/**
 * Hook to play word audio using expo-audio
 * Usage:
 * ```tsx
 * const player = useWordAudio('ithu.mp3');
 * <Button onPress={() => player.play()} />
 * ```
 */
export function useWordAudio(filename: string | undefined) {
  // Only get audio source if filename is provided and non-empty
  const audioSource = filename ? getAudioSource(filename) : null;
  return useAudioPlayer(audioSource);
}
