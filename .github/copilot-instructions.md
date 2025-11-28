# AI Agent Instructions - rn-bhasha-trainer

## Project Overview

React Native (Expo SDK 54) Malayalam language learning app with file-based routing (expo-router), Firebase authentication, and TypeScript. Users sign in to track vocabulary learning progress.

## Critical Architecture Patterns

### 1. Authentication Flow

**Token Storage**: Uses `expo-secure-store` (NOT AsyncStorage) - critical for production security.

```typescript
// Access auth state anywhere in the app
import { useAuth } from "@/app/_layout";
const { isAuthenticated, isLoading, signOut } = useAuth();
```

**Auth Context**: Provided by `app/_layout.tsx` via `AuthProvider` - wraps entire app tree. Listens to Firebase `onAuthStateChanged` + checks stored tokens on startup.

**Route Protection**:

- `app/(auth)/_layout.tsx` - Redirects authenticated users to tabs
- `app/(tabs)/_layout.tsx` - Protected route group (auth required)
- Root layout uses `anchor: "(tabs)"` for authenticated default

### 2. File-Based Routing

Expo Router with typed routes enabled (`experiments.typedRoutes: true`):

- `app/(auth)/` - Auth screens (sign in/up)
- `app/(tabs)/` - Main app (home, explore, words-lib)
- Navigation: `import { router } from 'expo-router'` → `router.replace('/(tabs)')`

### 3. Theme System

**Always use themed components** for consistent dark/light mode:

- `<ThemedText>` and `<ThemedView>` from `components/`
- Props: `lightColor` and `darkColor` for custom colors
- Hooks: `useColorScheme()` for current theme, `useThemeColor()` for theme-aware values

## Development Workflow

### Commands

```bash
npm start          # Expo dev server with QR code
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run lint       # ESLint check
```

### Environment Setup

**Required**: `.env` file with Firebase credentials (see `.env.example` if created):

```
EXPO_PUBLIC_FIREBASE_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
EXPO_PUBLIC_FIREBASE_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
```

App validates all env vars at startup (`app/utils/firebaseConfig.ts:23-27`) and throws if missing.

## Key Files & Their Purpose

### Core Configuration

- `app.json` - Expo config with React 19 + React Compiler + New Architecture enabled
- `tsconfig.json` - Path alias `@/*` maps to project root
- `app/_layout.tsx` - Root layout providing AuthProvider + ThemeProvider

### Authentication System

- `app/utils/firebaseConfig.ts` - Firebase initialization, auth functions, secure token storage
  - `signUpWithEmail()` - Creates user + Firestore doc + stores token
  - `signInWithEmail()` - Authenticates + stores token
  - `signOutUser()` - Signs out + clears tokens
- `app/(auth)/signIn.tsx` - Sign-in UI (no sign-up screen yet - identified gap)

### Data Model

- `wordsMalayalam.json` - Malayalam vocabulary dataset:

  ```json
  {
    "id": "uuid",
    "word": { "inTranslit": "...", "inNativeScript": "..." },
    "meaning": "...",
    "figureOfSpeech": "...",
    "wordLevel": "A1",
    "pronunciation": ""
  }
  ```

- **Firestore** `users/{userId}`:
  - email, nickname, name, learningLanguage, languageLevel, roles, instaHandle, growthPoints

## Platform-Specific Code Patterns

Files with `.ios.tsx`, `.android.tsx`, `.web.ts` extensions handle platform differences:

- Example: `components/ui/icon-symbol.ios.tsx` vs `icon-symbol.tsx`
- When editing cross-platform features, check for these variants

## Project State & Known Gaps

### Implemented ✅

- Firebase Auth with email/password
- Secure token storage (expo-secure-store)
- Auth context with persistence
- Sign-in UI
- Protected routing
- Theme system

### Missing ⚠️

- **Sign-up screen** - function exists but no UI
- Password reset flow
- Token refresh handling (Firebase tokens expire in 1 hour)
- Form validation (email format, password strength)
- Error message mapping (Firebase errors → user-friendly)

### Planned Features 🚧

See `feat-pronunciation/implementation-pronunciation-task.md` for detailed pronunciation practice feature plan using Google Cloud Speech-to-Text.

## Code Style & Conventions

### Import Patterns

```typescript
// Use @ alias for project imports
import { useAuth } from "@/app/_layout";
import { ThemedText } from "@/components/themed-text";
import { db, auth } from "@/app/utils/firebaseConfig";
```

### Component Structure

- Functional components with TypeScript
- Hooks at top of component body
- Styled with StyleSheet.create (not inline)
- Use React 19 features (compiler handles optimization)

### Error Handling

Current pattern: callbacks `onSuccess` and `onError` in auth functions. Consider adding proper error boundary for production.

## Firebase Specifics

### Firestore Rules (Production TODO)

Currently default rules - need to add:

- Users can only read/write their own data
- Admin-only access for word collections

### Authentication Validation

Validates email/password before Firebase calls:

```typescript
if (!email || !email.includes("@")) throw new Error("Invalid email");
if (!password || password.length < 6)
  throw new Error("Password must be at least 6 characters");
```

## Testing Approach

- No test suite currently configured
- Manual testing on iOS simulator + Android emulator
- Test auth flow: sign up → sign in → token persistence → sign out

## Common Pitfalls to Avoid

1. **Don't use AsyncStorage** for tokens - use expo-secure-store
2. **Don't skip platform checks** - check for `.ios` and `.web` file variants
3. **Don't hardcode colors** - use ThemedText/ThemedView components
4. **Don't forget env validation** - app validates on startup
5. **Import paths** - always use `@/` alias, never relative `../../`

## When Making Changes

### Adding New Screens

1. Create in appropriate route group: `app/(tabs)/newscreen.tsx` or `app/(auth)/newscreen.tsx`
2. Update `_layout.tsx` if adding to tabs
3. Use themed components for consistency
4. Check if auth protection needed

### Firebase Changes

1. Update types in `firebaseConfig.ts`
2. Add environment variables to `.env`
3. Validate env vars in config
4. Test token persistence flow

### UI Components

1. Create in `components/` or `components/ui/`
2. Support light/dark themes via props or themed components
3. Use TypeScript for prop types
4. Export named functions, not default

## Quick Reference

**Get current user**: `const { isAuthenticated } = useAuth();`  
**Navigate**: `router.push('/path')` or `router.replace('/path')`  
**Theme-aware styling**: `<ThemedView>` or `useThemeColor()`  
**Firebase operations**: Import from `@/app/utils/firebaseConfig`  
**Path alias**: `@/` = project root

## Additional Context

- React Native New Architecture enabled
- Experimental React Compiler enabled
- Expo Router typed routes enabled
- Branch `BS-2` focused on auth implementation
- See `BS-2-PROGRESS-ASSESSMENT.md` for detailed feature status and roadmap
- See `CLAUDE.md` for legacy AI instructions (consider migrating relevant sections)
