import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { formatCurrency, formatDateShort } from "../lib/utils";
import type { JobRequest } from "../types";

interface JobCardProps {
  job: JobRequest;
  onPress?: () => void;
}

export function JobCard({ job, onPress }: JobCardProps) {
  const router = useRouter();
  const handlePress = () => {
    if (onPress) onPress();
    else router.push(`/(shared)/chat/${job.id}`);
  };

  const budget =
    job.budget_min != null || job.budget_max != null
      ? `${job.budget_min != null ? formatCurrency(job.budget_min) : "?"} - ${
          job.budget_max != null ? formatCurrency(job.budget_max) : "?"
        }`
      : "Not set";

  const statusColors: Record<string, string> = {
    open: "bg-amber-100 text-amber-800",
    accepted: "bg-blue-100 text-blue-800",
    in_progress: "bg-sky-100 text-sky-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-slate-100 text-slate-600",
  };
  const statusClass = statusColors[job.status] ?? "bg-slate-100 text-slate-800";

  return (
    <Pressable
      onPress={handlePress}
      className="bg-white rounded-xl border border-slate-200 p-4 mb-3 active:bg-slate-50"
    >
      <Text className="font-semibold text-slate-900">{job.title}</Text>
      {job.description ? (
        <Text className="text-slate-600 text-sm mt-1 numberOfLines={2}">
          {job.description}
        </Text>
      ) : null}
      <View className="flex-row flex-wrap items-center gap-2 mt-2">
        <View className={`rounded px-2 py-0.5 ${statusClass}`}>
          <Text className="text-xs font-medium capitalize">
            {job.status.replace("_", " ")}
          </Text>
        </View>
        <Text className="text-slate-500 text-sm">{budget}</Text>
        {job.location ? (
          <Text className="text-slate-500 text-sm">• {job.location}</Text>
        ) : null}
      </View>
      <Text className="text-slate-400 text-xs mt-1">{formatDateShort(job.created_at)}</Text>
    </Pressable>
  );
}
