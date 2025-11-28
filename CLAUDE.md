# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native Expo app for learning Malayalam language (`rn-bhasha-trainer`). The app uses file-based routing (expo-router) and Firebase for authentication and data storage. Users can sign up, sign in, and track their Malayalam vocabulary learning progress.

## Development Commands

### Starting the Development Server
```bash
npm start          # Start Expo dev server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run in web browser
```

### Code Quality
```bash
npm run lint       # Run ESLint
```

### Project Reset
```bash
npm run reset-project  # Moves starter code to app-example, creates blank app dir
```

## Architecture

### Routing Structure
The app uses Expo Router's file-based routing with two main route groups:

- **`app/(auth)/`** - Authentication screens (sign in, sign up)
  - Protected by `_layout.tsx` which redirects authenticated users to tabs
  - Entry point is `index.tsx` (renders SignIn component)

- **`app/(tabs)/`** - Main app screens (home, explore, words library)
  - Protected by authentication - users must be signed in to access
  - Three tabs: index (home), explore, words-lib

- **`app/_layout.tsx`** - Root layout providing:
  - `AuthProvider` context for global authentication state
  - Theme provider for dark/light mode
  - Route configuration for (auth) and (tabs) groups

### Authentication System
Authentication is centralized in `app/utils/firebaseConfig.ts`:

- **Token Storage**: Uses `expo-secure-store` (NOT AsyncStorage) for storing auth tokens and user IDs securely
- **Auth Functions**:
  - `signUpWithEmail()` - Creates user, stores Firestore document, saves token
  - `signInWithEmail()` - Authenticates user, saves token
  - `signOutUser()` - Signs out and clears stored tokens
  - `getStoredAuthToken()` / `getStoredUserId()` - Retrieve stored credentials

- **Auth Context** (`app/_layout.tsx`):
  - Provides `isAuthenticated`, `isLoading`, `signIn()`, `signOut()` throughout app
  - Listens to Firebase `onAuthStateChanged` events
  - Initializes auth state from stored tokens on app launch

### Firebase Configuration
Firebase config requires these environment variables in `.env`:
```
EXPO_PUBLIC_FIREBASE_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
EXPO_PUBLIC_FIREBASE_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
```

The app validates all required environment variables at startup (`app/utils/firebaseConfig.ts:23-27`).

### Data Model
- **Malayalam Words**: Stored in `wordsMalayalam.json` with structure:
  ```json
  {
    "id": "uuid",
    "word": { "inTranslit": "...", "inNativeScript": "..." },
    "meaning": "...",
    "figureOfSpeech": "...",
    "examples": [...],
    "wordLevel": "A1",
    "pronunciation": ""
  }
  ```

- **User Document** (Firestore): Created on sign-up with fields:
  - email, nickname, name, learningLanguage, languageLevel, roles, instaHandle, growthPoints

### TypeScript Configuration
- Uses `@/*` path alias mapping to project root (configured in `tsconfig.json`)
- Strict mode enabled
- Expo's experimental features enabled: `typedRoutes` and `reactCompiler`

### Platform-Specific Code
The codebase uses platform-specific files (e.g., `icon-symbol.ios.tsx` vs `icon-symbol.tsx`, `use-color-scheme.web.ts` vs `use-color-scheme.ts`). When modifying cross-platform features, check for these variants.

## Key Patterns

### Accessing Auth State
```typescript
import { useAuth } from '@/app/_layout';

const { isAuthenticated, isLoading, signOut } = useAuth();
```

### Themed Components
Use themed wrappers from `components/` directory:
- `ThemedText` - Automatically adapts to dark/light theme
- `ThemedView` - View with theme-aware styling

### Navigation
```typescript
import { router } from 'expo-router';

router.replace('/(tabs)');      // Navigate and replace history
router.push('/modal');           // Push onto stack
```

## Important Notes

- **Security**: Never commit `.env` file (already in `.gitignore`). Auth tokens are stored in expo-secure-store, not AsyncStorage.
- **React Compiler**: Expo's experimental React Compiler is enabled (`app.json:46`)
- **New Architecture**: React Native's new architecture is enabled (`app.json:10`)
- **Main Branch**: PRs should target `main` branch (not master)
