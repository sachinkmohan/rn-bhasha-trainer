## Changelog

### 2025-11-28

- **Fixed TypeScript JSX compilation error** in `tsconfig.json`:
  - Added `"jsx": "react-native"` compiler option to enable JSX transformation
  - Resolves "Cannot use JSX unless the '--jsx' flag is provided" errors in all `.tsx` files
  - Particularly fixes lines 29-50 in `app/(auth)/signIn.tsx` where JSX components (View, Text, TextInput, Button) are used

- Created `.github/copilot-instructions.md` - Comprehensive AI agent guide covering:
  - Authentication flow with expo-secure-store pattern
  - File-based routing structure and route protection
  - Theme system using ThemedText/ThemedView components
  - Firebase integration patterns and token storage
  - Project state with implemented features and known gaps
  - Development workflow commands and environment setup
  - Platform-specific code patterns (.ios, .web extensions)
  - Common pitfalls and code conventions
  - Quick reference for common operations

### 2025-09-15

- Replaced the contents of `app/(tabs)/index.tsx` with a simple Hello World screen using React Native components.

- Fixed JSX error in `app/(tabs)/index.tsx` by wrapping all elements in a single parent `<View>` and removing invalid sibling elements.
