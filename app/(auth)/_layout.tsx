import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../_layout";

/**
 * Layout component that directs authenticated users to the main tabs and displays authentication screens for unauthenticated users.
 *
 * While the authentication state is loading, renders a centered loading indicator. When authenticated, redirects to `/(tabs)`. When not authenticated, renders a navigation stack containing the auth index screen with the header hidden.
 *
 * @returns A React element: a centered ActivityIndicator while loading, a `Redirect` to `/(tabs)` when authenticated, or a `Stack` with the auth `index` screen (header hidden) when not authenticated.
 */
export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  console.log("is Authenticated", isAuthenticated);
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
