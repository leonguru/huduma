import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";

export default function SharedLayout() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.replace("/(auth)/welcome");
    }
  }, [user]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
