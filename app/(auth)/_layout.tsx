import { Redirect, Stack } from "expo-router";
import { useAuth } from "../_layout";

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }
  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
    </Stack>
  );
}
