# Mission: JavaScript/React Callbacks

## Why
I'm returning to the `rn-bhasha-trainer` codebase after time away and getting blocked by callback-heavy code (e.g. `onPlay`, `onPlaybackComplete` in `AudioPlayer.tsx`) while building a new `PlayAudioButton` component. I want to rebuild fluency with callbacks as a JS concept so I can read and write this kind of code confidently again, not just patch around it.

## Success looks like
- Can explain, unprompted, what a callback is and why a function would accept one as an argument
- Can look at a component's props list and correctly identify which are "invented" callback props (for a parent to hook into) versus data props
- Can trace a callback from where it's defined, to where it's passed down, to where it's actually invoked — in real code in this repo
- Can design a new component's callback props (naming, when to fire, what to pass) without needing to copy an existing pattern

## Constraints
- Learning happens alongside shipping a real feature (extracting `PlayAudioButton` from `AudioPlayer.tsx`) — lessons should stay grounded in that code, not abstract exercises
- Prior React/JS experience exists but is rusty — this is refresh, not first-time learning

## Out of scope
- Deep async/event-loop internals (microtasks, call stack mechanics) unless something in this repo actually requires it
- Class-component `this`-binding history — this codebase is all function components/hooks
