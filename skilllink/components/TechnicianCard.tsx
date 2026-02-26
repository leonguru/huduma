import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Avatar } from "./ui/Avatar";
import { RatingStars } from "./RatingStars";
import { formatCurrency } from "../lib/utils";
import type { TechnicianWithProfile } from "../hooks/useTechnicians";

interface TechnicianCardProps {
  technician: TechnicianWithProfile;
}

export function TechnicianCard({ technician }: TechnicianCardProps) {
  const router = useRouter();
  const profile = technician.profiles;
  const name = profile?.full_name ?? "Technician";
  const rate = technician.hourly_rate ?? 0;
  const rating = technician.avg_rating ?? 0;

  return (
    <Pressable
      onPress={() => router.push(`/(client)/technician/${technician.id}`)}
      className="bg-white rounded-xl border border-slate-200 p-4 mb-3 active:bg-slate-50"
    >
      <View className="flex-row">
        <Avatar uri={profile?.avatar_url} name={name} size={56} />
        <View className="flex-1 ml-3 justify-center">
          <Text className="font-semibold text-slate-900">{name}</Text>
          {technician.category ? (
            <Text className="text-slate-500 text-sm capitalize">{technician.category}</Text>
          ) : null}
          <RatingStars rating={rating} size="sm" />
          <View className="flex-row items-center mt-1">
            <Text className="text-slate-700 font-medium">
              {formatCurrency(rate)}
            </Text>
            <Text className="text-slate-400 text-sm ml-1">/hr</Text>
            {technician.is_available ? (
              <View className="ml-2 bg-green-100 px-2 py-0.5 rounded">
                <Text className="text-green-700 text-xs">Available</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
