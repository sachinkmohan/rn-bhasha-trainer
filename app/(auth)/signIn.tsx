// Sign In page
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../_layout";
import { signInWithEmail } from "../utils/firebaseConfig";

/**
 * Renders a sign-in screen with email and password inputs and a submit button.
 *
 * Attempts to authenticate with the entered credentials when the button is pressed; on successful authentication it triggers the app's sign-in flow, and on failure it shows an alert with the error message.
 *
 * @returns A React element containing the sign-in form: email and password fields and a button that displays "Logging in..." while the sign-in is in progress.
 */
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
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      <Button
        title={loading ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={loading}
      />
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
    maxWidth: 320,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
});
