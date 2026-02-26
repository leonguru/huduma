import { useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import type { Role } from "../../types";

export default function RoleSelectScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setRole } = useAuth();
  const router = useRouter();

  const selectRole = async (role: Role) => {
    setError("");
    setLoading(true);
    const { error: err } = await setRole(role);
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (role === "client") {
      router.replace("/(client)");
    } else {
      router.replace("/(technician)/dashboard");
    }
  };

  return (
    <View className="flex-1 bg-slate-50 justify-center px-6">
      <Text className="text-2xl font-bold text-slate-900 text-center mb-2">
        How will you use Skilllink?
      </Text>
      <Text className="text-slate-600 text-center mb-8">
        You can change this later in settings
      </Text>
      {error ? <Text className="text-red-500 text-sm text-center mb-4">{error}</Text> : null}
      <View className="gap-3">
        <Button
          title="I need services"
          onPress={() => selectRole("client")}
          disabled={loading}
        />
        <Button
          title="I'm a technician"
          onPress={() => selectRole("technician")}
          variant="outline"
          disabled={loading}
        />
      </View>
    </View>
  );
}
