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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

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
