import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Avatar, Button, RatingStars } from "@/app/_components";
import { useTechnician } from "@/app/_hooks";
import { formatCurrency, supabase } from "@/app/_lib";
import { useAuthStore } from "@/app/_store";
import type { PortfolioPhoto } from "@/app/_types";
import { useState, useEffect } from "react";

export default function TechnicianProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { technician, loading, error } = useTechnician(id ?? null);
  const user = useAuthStore((s) => s.user);
  const [portfolio, setPortfolio] = useState<PortfolioPhoto[]>([]);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("portfolio_photos")
      .select("*")
      .eq("technician_id", id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setPortfolio((data as PortfolioPhoto[]) ?? []));
  }, [id]);

  if (loading || !technician) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <Text className="text-slate-500">Loading...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <Text className="text-red-500">{error.message}</Text>
      </View>
    );
  }

  const profile = technician.profiles;
  const name = profile?.full_name ?? "Technician";

  const handleBook = () => {
    if (!user) return;
    router.push({
      pathname: "/(client)/job-post",
      params: { technicianId: technician.id },
    });
  };

  return (
    <ScrollView className="flex-1 bg-slate-50">
      <View className="bg-white border-b border-slate-200 p-4">
        <Pressable onPress={() => router.back()} className="mb-2">
          <Text className="text-blue-600">Back</Text>
        </Pressable>
        <View className="flex-row items-center">
          <Avatar uri={profile?.avatar_url} name={name} size={80} />
          <View className="ml-4 flex-1">
            <Text className="text-xl font-bold text-slate-900">{name}</Text>
            {technician.category ? (
              <Text className="text-slate-500 capitalize">{technician.category}</Text>
            ) : null}
            <RatingStars rating={technician.avg_rating ?? 0} />
            <Text className="text-slate-700 font-medium mt-1">
              {formatCurrency(technician.hourly_rate ?? 0)} / hr
            </Text>
            {technician.is_available ? (
              <View className="bg-green-100 self-start px-2 py-0.5 rounded mt-1">
                <Text className="text-green-700 text-sm">Available</Text>
              </View>
            ) : null}
          </View>
        </View>
        {technician.bio ? (
          <Text className="text-slate-600 mt-4">{technician.bio}</Text>
        ) : null}
      </View>
      {portfolio.length > 0 ? (
        <View className="p-4">
          <Text className="font-semibold text-slate-900 mb-2">Portfolio</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
            {portfolio.map((p) => (
              <View key={p.id} className="w-32 h-32 rounded-lg bg-slate-200 overflow-hidden">
                {/* Optional: Image component with p.photo_url */}
                <Text className="p-2 text-slate-600 text-sm">{p.caption ?? "Photo"}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      ) : null}
      <View className="p-4 gap-2">
        <Button title="Book / Post job" onPress={handleBook} />
        <Button
          title="Message (post a job first)"
          variant="outline"
          onPress={() => router.push({ pathname: "/(client)/job-post", params: { technicianId: id } })}
        />
      </View>
    </ScrollView>
  );
}
