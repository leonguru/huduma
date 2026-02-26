import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";

export default function ClientLayout() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.replace("/(auth)/welcome");
    } else if (user && profile && profile.role !== "client") {
      if (profile.role === "technician") router.replace("/(technician)/dashboard");
      else router.replace("/(auth)/role-select");
    }
  }, [user, profile]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
