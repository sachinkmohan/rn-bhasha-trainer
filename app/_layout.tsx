import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
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
    // Check for stored authentication on app start
    const initializeAuth = async () => {
      console.log("Initializing auth state...");

      // Check if we have stored auth token
      const storedToken = await getStoredAuthToken();
      const storedUserId = await getStoredUserId();

      if (storedToken && storedUserId) {
        console.log("Found stored auth token, user should be authenticated");
        setIsAuthenticated(true);
        setIsLoading(false);
      } else {
        console.log("No stored auth token found");
        setIsLoading(false);
      }
    };
    initializeAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(
        "Auth state changed:",
        user ? "authenticated" : "not authenticated"
      );
      setIsAuthenticated(!!user);
      setIsLoading(false); // Auth state is determined
    });
    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      signIn: () => setIsAuthenticated(true),
      signOut: async () => {
        await signOutUser();
        setIsAuthenticated(false);
        // Force redirect to login screen
        router.replace("/(auth)/sign-in");
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
