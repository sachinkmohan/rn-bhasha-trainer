# Function Declaration vs Arrow Function for React Components

## Syntax A: Arrow function assigned to const

```tsx
export const ComponentName = () => {
  return (
    <View>
      <Text>Dummy Text</Text>
    </View>
  );
};
```

**Advantages**
- Concise, especially for small components with implicit-return bodies
- `this` is lexically bound (irrelevant for function components, matters for class components/callbacks)
- Common in codebases that prefer a uniform "everything is a const" style

**Disadvantages**
- Not hoisted — must be defined before it's used in the file
- Anonymous at the syntax level; relies on variable-name inference for the name shown in stack traces/React DevTools (usually fine with modern bundlers, but can be lost in some transpile/minify setups)

## Syntax B: Function declaration

```tsx
export function ComponentName() {
  return (
    <View>
      <Text>Dummy Text</Text>
    </View>
  );
}
```

**Advantages**
- Hoisted — can be referenced above its definition in the file
- Always has a real, explicit name — reliable in stack traces and React DevTools
- Airbnb JS Style Guide's default recommendation for named functions

**Disadvantages**
- Slightly more verbose for one-line bodies
- No implicit-return shorthand

## Final Verdict

Functionally interchangeable for React function components — no framework-level reason to prefer one. The right choice is **whichever matches your codebase's existing convention**, since consistency beats either style in isolation.

In this repo (`components/pronunciation/`), 5 of 7 existing components use `export function ComponentName(...)` — so match that.

Airbnb's style guide (a widely-used industry default) also recommends function declarations as the default for named functions, reserving arrow functions for anonymous callbacks (e.g. `.map()`, `.filter()`).

## Top 3 Resources

1. [Your First Component — react.dev (official React docs)](https://react.dev/learn/your-first-component) — the canonical React documentation; every component example on this page (and throughout the official docs) uses `function ComponentName() {}`, making it the closest thing to an authoritative default for the ecosystem.
2. [Function Forms — Kent C. Dodds](https://kentcdodds.com/blog/function-forms) — written by a widely-followed React educator (Testing Library, Epic React); walks through hoisting, lexical `this`, and implicit-return trade-offs specifically in the context of when to reach for each form, rather than declaring one universally correct.
3. [Airbnb JavaScript Style Guide (GitHub)](https://github.com/airbnb/javascript) — see below for why this counts as an industry standard rather than one opinion among many; states the explicit rule of function declarations for named functions, arrow functions reserved for expressions/callbacks.

**Why the Airbnb guide carries weight:** it isn't just a document people read — it ships as `eslint-config-airbnb`, an installable ESLint config that thousands of production codebases enforce directly. It's maintained by a company running JavaScript at scale, and predates most competing style guides, which is why other guides and tools are frequently compared against it rather than the reverse.
