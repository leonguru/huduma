import { useState } from "react";
import { Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Button, Input } from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../store/authStore";
import type { Profile } from "../../types";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const setProfile = useAuthStore((s) => s.setProfile);
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password) {
      setError("Email and password required");
      return;
    }
    setLoading(true);
    const { error: err } = await signIn(email.trim(), password);
    if (err) {
      setLoading(false);
      setError(err.message);
      return;
    }
    const { data } = await supabase.auth.getSession();
    const session = data?.session;
    if (session?.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      setProfile(profile as Profile | null);
      setLoading(false);
      if (profile?.role) {
        router.replace(profile.role === "client" ? "/(client)" : "/(technician)/dashboard");
      } else {
        router.replace("/(auth)/role-select");
      }
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
        <Text className="text-2xl font-bold text-slate-900 mb-6">Log in</Text>
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
          placeholder="••••••••"
          secureTextEntry
          className="mb-4"
        />
        {error ? <Text className="text-red-500 text-sm mb-4">{error}</Text> : null}
        <Button title={loading ? "Signing in…" : "Log in"} onPress={handleLogin} disabled={loading} />
        <Pressable onPress={() => router.push("/(auth)/register")} className="mt-4">
          <Text className="text-slate-600 text-center">
            Don't have an account? <Text className="text-blue-600 font-medium">Sign up</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
