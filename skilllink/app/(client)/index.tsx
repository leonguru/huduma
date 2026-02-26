import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { TechnicianCard } from "../../components/TechnicianCard";
import { useTechnicians } from "../../hooks/useTechnicians";

export default function ClientHomeScreen() {
  const router = useRouter();
  const { technicians, loading, error } = useTechnicians({ isAvailable: true });

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-white border-b border-slate-200 px-4 pt-12 pb-4">
        <Text className="text-2xl font-bold text-slate-900">Find trusted pros near you</Text>
        <Pressable
          onPress={() => router.push("/(client)/search")}
          className="mt-3 bg-slate-100 rounded-lg py-3 px-4"
        >
          <Text className="text-slate-500">Search by category, rate, location...</Text>
        </Pressable>
      </View>
      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 24 }}>
        {loading ? (
          <Text className="text-slate-500 py-8 text-center">Loading...</Text>
        ) : error ? (
          <Text className="text-red-500 py-8 text-center">{error.message}</Text>
        ) : technicians.length === 0 ? (
          <Text className="text-slate-500 py-8 text-center">No technicians found yet</Text>
        ) : (
          technicians.map((t) => <TechnicianCard key={t.id} technician={t} />)
        )}
      </ScrollView>
    </View>
  );
}
