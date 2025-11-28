// Sign In page
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../_layout";
import { signInWithEmail } from "../utils/firebaseConfig";

export default function SignIn() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await signInWithEmail(
      email,
      password,
      () => {
        setLoading(false);
        signIn();
      },
      (error) => {
        setLoading(false);
        Alert.alert("Login failed", error?.message || "Unknown error");
      }
    );
  };
  return (
    <View className="px-6" style={styles.container}>
      <Text style={styles.title}>Welcome back!</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Pressable
        className="bg-blue-600 rounded-full px-6 py-3 w-full shadow-lg"
        onPress={handleLogin}
        disabled={loading}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={loading ? "Logging in..." : "Login"}
      >
        <Text className="text-white text-center">
          {loading ? "Logging in..." : "Login"}
        </Text>
      </Pressable>

      <View className="flex-row mt-4 items-center w-full">
        {/* // horizonal line */}
        <View className="h-px bg-gray-300 flex-1" />
        <Text className="mx-2 text-gray-500">Or</Text>
        <View className="h-px bg-gray-300 flex-1" />
      </View>

      <Pressable
        className="border border-blue-300 rounded-full px-6 py-3 w-full mt-4"
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Create new account"
      >
        <Text className="text-center text-blue-600">Create new account</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f4ff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
});
