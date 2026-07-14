# JavaScript/React Callbacks Resources

## Knowledge

- [Callback function — MDN Web Docs Glossary](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)
  Canonical definition: a function passed into another function, invoked by that outer function to complete some action. Covers sync vs. async callbacks. Use for: the core mental model before looking at any React-specific code.
- [Passing Functions to Components — React docs (Meta)](https://legacy.reactjs.org/docs/faq-functions.html)
  Official React FAQ on the exact pattern seen in `AudioPlayer.tsx`: a parent defines a function, passes it down as a prop, the child calls it (`onPlay?.()`, `onPlaybackComplete?.()`). Use for: understanding "callback props" specifically, as distinct from generic JS callbacks.

## Wisdom (Communities)

- Gap: no community identified yet. Revisit once the user has practiced enough to have real questions worth bringing somewhere (e.g. r/reactjs for React-specific callback-prop design questions).

## Gaps
- No resource yet on distinguishing "library API callback" (e.g. `useAudioPlayer`'s internals) from "component-invented callback prop" (e.g. `onPlaybackComplete`) — this is the exact confusion that triggered this mission. Worth searching for a sharper resource, or building this distinction into a reference doc ourselves if nothing good exists.
