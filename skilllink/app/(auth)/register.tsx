import { useState } from "react";
import { Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Button, Input } from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../store/authStore";
import type { Profile } from "../../types";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const setUser = useAuthStore((s) => s.setUser);
  const setProfile = useAuthStore((s) => s.setProfile);
  const router = useRouter();

  const handleRegister = async () => {
    setError("");
    if (!email.trim() || !password || !confirmPassword) {
      setError("Email and both password fields are required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    const { error: err } = await signUp(email.trim(), password, fullName.trim() || undefined);
    if (err) {
      setLoading(false);
      setError(err.message);
      return;
    }
    const { data } = await supabase.auth.getSession();
    const session = data?.session;
    if (session?.user) {
      setUser(session.user);
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      setProfile(profile as Profile | null);
      setLoading(false);
      router.replace("/(auth)/role-select");
    } else {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-slate-50"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}>
        <Text className="text-2xl font-bold text-slate-900 mb-6">Create account</Text>
        <Input
          label="Full name"
          value={fullName}
          onChangeText={setFullName}
          placeholder="John Doe"
          className="mb-4"
        />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          className="mb-4"
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="At least 6 characters"
          secureTextEntry
          showTogglePassword
          className="mb-4"
        />
        <Input
          label="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Type password again"
          secureTextEntry
          showTogglePassword
          className="mb-4"
        />
        {error ? <Text className="text-red-500 text-sm mb-4">{error}</Text> : null}
        <Button
          title={loading ? "Creating account…" : "Sign up"}
          onPress={handleRegister}
          disabled={loading}
        />
        <Pressable onPress={() => router.push("/(auth)/login")} className="mt-4">
          <Text className="text-slate-600 text-center">
            Already have an account? <Text className="text-blue-600 font-medium">Log in</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
