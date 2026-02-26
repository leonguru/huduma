import { Redirect } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";
import { useAuthStore } from "../store/authStore";

export default function Index() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);

  if (user === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8fafc" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Loading…</Text>
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/welcome" />;
  }
  if (!profile?.role) {
    return <Redirect href="/(auth)/role-select" />;
  }
  if (profile.role === "client") {
    return <Redirect href="/(client)" />;
  }
  return <Redirect href="/(technician)/dashboard" />;
}
