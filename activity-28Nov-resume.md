# Activity Summary - November 28, 2025
## Sign-Up Feature Implementation Session

### Session Goal
Implement the sign-up UI screen for the Malayalam learning app, guided by the coding-mentor-guide agent.

---

## Context
- Working on branch: `BS-2`
- Reference document: `BS-2-PROGRESS-ASSESSMENT.md`
- Critical gap identified: No sign-up UI exists, although `signUpWithEmail()` function is already implemented in `app/utils/firebaseConfig.ts`

---

## Decisions Made So Far

### 1. Form Fields (Question 1)
**Decision:** The sign-up form will collect these 4 fields:
- `email` ✅
- `password` ✅
- `name` ✅
- `languageLevel` ✅

**Deferred:** What to do with the other required parameters for `signUpWithEmail()`:
- `instaHandle` - need to decide: default value or optional?
- `nickname` - could derive from name or use empty string?
- `learningLanguage` - should probably default to "Malayalam"
- `roles` - need default value

### 2. Form Design (Question 2)
**Decision:** One long form (not multi-step)

### 3. File Location (Question 3)
**Decision:** Add the sign-up screen in `app/(auth)/` directory (same location as `signIn.tsx`)

---

## Current Status: Building the UI

### Reference Template
Using `app/(auth)/signIn.tsx` as a template. Key patterns to replicate:
- State management (lines 9-11): `email`, `password`, `loading`
- TextInput components (lines 31-45)
- Button handling (lines 46-50)
- Styling patterns (lines 55-78)

---

## Pending Questions to Answer

### Question 1: File Setup
- **File path:** Where exactly should the file be created? (Following signIn.tsx pattern)
- **File name:** What should it be called? `signUp.tsx`? Something else?

### Question 2: State Variables
For the 4 form fields (email, password, name, languageLevel):
- How many state variables needed?
- What should they be called?
- Don't forget: also need `loading` and potentially `error` state

### Question 3: Language Level Input
Since `languageLevel` should be one of: "A1", "A2", "B1", "B2", "C1", "C2"
- Should users type this manually in a TextInput?
- Or use a Picker/dropdown component?
- Consider UX: which is easier for users?

### Question 4: Starting Template
Which specific parts of `signIn.tsx` can be copied as starting point?
- Imports?
- Component structure?
- Styling?

---

## Next Steps (When Resuming)

1. **Answer the pending questions above**
   - Decide on file name and exact location
   - Determine state variables needed
   - Choose input type for languageLevel

2. **Create the file**
   - Use signIn.tsx as template
   - Start with basic structure first

3. **Build incrementally**
   - First: Get basic UI showing (inputs visible on screen)
   - Then: Add form submission logic
   - Finally: Wire up to `signUpWithEmail()` function

4. **Come back to strategic decisions**
   - Decide on default values for instaHandle, nickname, learningLanguage, roles
   - This is needed to actually call the `signUpWithEmail()` function

---

## Key Files to Reference

- **Existing sign-in screen:** `app/(auth)/signIn.tsx`
- **Firebase auth functions:** `app/utils/firebaseConfig.ts` (lines 44-94 for `signUpWithEmail`)
- **Auth context:** `app/_layout.tsx`
- **Assessment document:** `BS-2-PROGRESS-ASSESSMENT.md`

---

## Coaching Approach Being Used

Using the `coding-mentor-guide` agent - this means:
- Being guided through questions and hints
- NOT receiving complete code solutions
- Learning to think systematically about the implementation
- Building incrementally and learning patterns

---

## Important Reminders

1. **Don't overthink it initially** - Start with basic structure, improve later
2. **Look at signIn.tsx** - It's your best reference for patterns
3. **Incremental approach** - Get UI showing first, then add functionality
4. **The signUpWithEmail function exists** - You're just building the UI to call it

---

## Resume Command

When ready to continue, say:
> "I want to continue implementing the sign-up UI from activity-28Nov-resume.md"

Or reference specific questions:
> "Ready to answer the pending questions about the sign-up UI structure"
