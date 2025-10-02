import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";
import {
  auth,
  getStoredAuthToken,
  getStoredUserId,
  signOutUser,
} from "./utils/firebaseConfig";

export const unstable_settings = {
  anchor: "(tabs)",
};

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provides authentication state, actions, and loading status to descendant components.
 *
 * Initializes authentication state from stored credentials, subscribes to Firebase auth state changes,
 * and exposes `isAuthenticated`, `isLoading`, `signIn`, and `signOut` through AuthContext.
 *
 * @returns The AuthContext provider React element that wraps the given `children`.
 */
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      console.log("Initializing auth state...");

      const storedToken = await getStoredAuthToken();
      const storedUserId = await getStoredUserId();

      if (mounted) {
        if (storedToken && storedUserId) {
          console.log("Found stored user token, user should be authenticated");
          setIsAuthenticated(true);
        }
        setIsLoading(false);
      }
    };
    initializeAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(
        "Auth state changed",
        user ? "authenticated" : "not authenticated"
      );
      if (mounted) {
        setIsAuthenticated(!!user);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      signIn: () => setIsAuthenticated(true),
      signOut: async () => {
        try {
          await signOutUser();
          router.replace("/(auth)/signIn");
        } catch (error) {
          console.warn("Error signing out:", error);
        }
      },
    }),
    [isAuthenticated, isLoading]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Accesses the authentication context provided by AuthProvider.
 *
 * @returns The auth context object with `isAuthenticated`, `isLoading`, `signIn`, and `signOut`.
 *
 * @throws If called outside an `AuthProvider`, throws an `Error`.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/**
 * Root layout component that provides theming and authentication around the app navigation.
 *
 * Renders a ThemeProvider (selecting dark or default theme based on the device color scheme), an AuthProvider that wraps the app navigation Stack with routes for authentication, main tabs, and a modal, and a StatusBar.
 *
 * @returns A JSX element containing the themed AuthProvider-wrapped navigation stack and a status bar.
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
