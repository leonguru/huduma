import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";

export default function SettingsScreen() {
  const router = useRouter();
  const { profile, signOut } = useAuth();

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-white border-b border-slate-200 px-4 pt-12 pb-4">
        <Pressable onPress={() => router.back()} className="mb-2">
          <Text className="text-blue-600">Back</Text>
        </Pressable>
        <Text className="text-2xl font-bold text-slate-900">Settings</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {profile ? (
          <View className="mb-6">
            <Text className="text-slate-500 text-sm">Logged in as</Text>
            <Text className="text-slate-900 font-medium">{profile.full_name ?? "User"}</Text>
            <Text className="text-slate-500 text-sm capitalize">{profile.role}</Text>
          </View>
        ) : null}
        <Button title="Log out" onPress={() => signOut()} variant="outline" />
      </ScrollView>
    </View>
  );
}
