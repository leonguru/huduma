import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function EarningsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-white border-b border-slate-200 px-4 pt-12 pb-4">
        <Pressable onPress={() => router.back()} className="mb-2">
          <Text className="text-blue-600">Back</Text>
        </Pressable>
        <Text className="text-2xl font-bold text-slate-900">Earnings</Text>
      </View>
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-slate-500 text-center">
          Earnings and payouts will be available here soon.
        </Text>
      </View>
    </View>
  );
}
