import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Card } from "../../components/ui";

export default function TechnicianDashboardScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-white border-b border-slate-200 px-4 pt-12 pb-4">
        <Text className="text-2xl font-bold text-slate-900">Dashboard</Text>
        <Text className="text-slate-600 mt-1">Manage your jobs and profile</Text>
      </View>
      <View className="p-4 gap-3">
        <Pressable onPress={() => router.push("/(technician)/job-requests")}>
          <Card>
            <Text className="font-semibold text-slate-900">Job requests</Text>
            <Text className="text-slate-500 text-sm mt-1">View and accept incoming jobs</Text>
          </Card>
        </Pressable>
        <Pressable onPress={() => router.push("/(technician)/my-profile")}>
          <Card>
            <Text className="font-semibold text-slate-900">My profile</Text>
            <Text className="text-slate-500 text-sm mt-1">Edit bio, rate, availability</Text>
          </Card>
        </Pressable>
        <Pressable onPress={() => router.push("/(technician)/earnings")}>
          <Card>
            <Text className="font-semibold text-slate-900">Earnings</Text>
            <Text className="text-slate-500 text-sm mt-1">Placeholder – coming soon</Text>
          </Card>
        </Pressable>
      </View>
    </View>
  );
}
