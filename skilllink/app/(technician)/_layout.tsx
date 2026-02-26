import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";

export default function TechnicianLayout() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.replace("/(auth)/welcome");
    } else if (user && profile && profile.role !== "technician") {
      if (profile.role === "client") router.replace("/(client)");
      else router.replace("/(auth)/role-select");
    }
  }, [user, profile]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
