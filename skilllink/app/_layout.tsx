import "../global.css";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Component, type ReactNode } from "react";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/authStore";
import type { Profile } from "../types";

class RootErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fef2f2" }}>
          <Text style={{ fontSize: 18, color: "#b91c1c", textAlign: "center" }}>
            App error: {this.state.error.message}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function RootLayout() {
  const setUser = useAuthStore((s) => s.setUser);
  const setProfile = useAuthStore((s) => s.setProfile);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single()
            .then(({ data }) => setProfile(data as Profile | null));
        } else {
          setProfile(null);
        }
      })
      .catch(() => {
        setUser(null);
        setProfile(null);
      });
  }, [setUser, setProfile]);

  return (
    <RootErrorBoundary>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </RootErrorBoundary>
  );
}
