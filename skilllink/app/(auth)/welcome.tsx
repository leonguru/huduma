import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "../../components/ui";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-slate-50 justify-center px-6">
      <Text className="text-3xl font-bold text-slate-900 text-center mb-2">
        Skilllink
      </Text>
      <Text className="text-slate-600 text-center mb-8">
        Find trusted local service providers near you
      </Text>
      <View className="gap-3">
        <Button
          title="Log in"
          onPress={() => router.push("/(auth)/login")}
          variant="primary"
        />
        <Button
          title="Create account"
          onPress={() => router.push("/(auth)/register")}
          variant="outline"
        />
      </View>
    </View>
  );
}
