# JavaScript/React Callbacks Resources

## Knowledge

- [Callback function — MDN Web Docs Glossary](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)
  Canonical definition: a function passed into another function, invoked by that outer function to complete some action. Covers sync vs. async callbacks. Use for: the core mental model before looking at any React-specific code.
- [Passing Functions to Components — React docs (Meta)](https://legacy.reactjs.org/docs/faq-functions.html)
  Official React FAQ on the exact pattern seen in `AudioPlayer.tsx`: a parent defines a function, passes it down as a prop, the child calls it (`onPlay?.()`, `onPlaybackComplete?.()`). Use for: understanding "callback props" specifically, as distinct from generic JS callbacks.

- [useFocusEffect — React Navigation docs](https://reactnavigation.org/docs/use-focus-effect/)
  Official docs explaining why the callback passed to `useFocusEffect` should be wrapped in `useCallback`: without it, the callback's reference changes every render, causing the effect to re-run more than intended. Use for: reference-stability questions, memoization of callbacks passed to lifecycle-style hooks.
- [useCallback — react.dev](https://react.dev/reference/react/useCallback)
  Documents the canonical `memo` + unnecessary-re-render mechanism via a checkout-form example. Lesson 2 uses a simplified counter/text-input version of the same mechanism (react.dev has no simpler example than the checkout one — confirmed by checking). Use for: the "classic" motivating example, distinct from the useFocusEffect case grounded in this repo.
- [State: A Component's Memory — react.dev](https://react.dev/learn/state-a-components-memory)
  Explains the per-component "hidden array of memory slots" model that all stateful hooks (useState, useCallback, useRef, ...) are built on, and why hook call order matters. Use for: the prerequisite mechanism question — how does any hook remember anything across renders at all.

## Wisdom (Communities)

- Gap: no community identified yet. Revisit once the user has practiced enough to have real questions worth bringing somewhere (e.g. r/reactjs for React-specific callback-prop design questions).

## Gaps
- No resource yet on distinguishing "library API callback" (e.g. `useAudioPlayer`'s internals) from "component-invented callback prop" (e.g. `onPlaybackComplete`) — this is the exact confusion that triggered this mission. Worth searching for a sharper resource, or building this distinction into a reference doc ourselves if nothing good exists.
