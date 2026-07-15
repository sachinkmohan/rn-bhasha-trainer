# Lesson 2 assumed a foundation the user didn't have

After Lesson 2 (why useCallback wraps the useFocusEffect callback), the user said they still didn't understand why useCallback is used. Narrowing questions revealed the real gap: not "why does reference stability matter" (Lesson 2's actual content) but "I don't know anything about this react hook" — meaning the prerequisite concept of *how any hook persists data across renders at all* was never taught. Lesson 2 jumped straight to useCallback's specific behavior on top of an assumed foundation.

Implication: don't assume hook fundamentals (the per-component memory-slot model) are known just because the user has used `useState` successfully in practice (they built working `useState` code in the senior-mindset session) — using a hook correctly via trial and error is not the same as understanding the persistence mechanism. Lesson 0003 was built to backfill this specific gap before returning to Lesson 2.
