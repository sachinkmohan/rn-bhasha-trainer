# Teaching Notes

- Used `./teach-assets/` instead of `./assets/` for shared lesson components — this repo's `./assets/` is the actual React Native app's asset folder (audio, images), so reusing it would collide with real app resources.
- User is learning while shipping a real feature (extracting `PlayAudioButton` from `AudioPlayer.tsx`) — keep lessons grounded in that exact code rather than generic examples where possible.
- User already showed, unprompted, that they could trace `audioFile` into `useWordAudio` and correctly identify `onPlay`/`onPlaybackComplete` weren't defined in `utils/audio.ts` — just hadn't yet named *why* (callback prop pattern). Lesson 0001 targets that exact gap.
