import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { JobCard } from "../../components/JobCard";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../store/authStore";
import type { JobRequest } from "../../types";
import { COLORS } from "../../constants";

type StatusTab = "active" | "completed" | "cancelled";

interface JobWithRelations extends JobRequest {
  technician?: { full_name: string | null; avatar_url: string | null } | null;
  client?: { full_name: string | null; avatar_url: string | null } | null;
}

export default function BookingsScreen() {
  const router = useRouter();
  const clientId = useAuthStore((s) => s.user?.id);
  const [jobs, setJobs] = useState<JobWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewedJobIds, setReviewedJobIds] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<StatusTab>("active");
  const [selectedJob, setSelectedJob] = useState<JobWithRelations | null>(null);

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    supabase
      .from("job_requests")
      .select(
        "*, technician:profiles!job_requests_technician_id_fkey(full_name, avatar_url), client:profiles!job_requests_client_id_fkey(full_name, avatar_url)"
      )
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setJobs((data as JobWithRelations[]) ?? []);
        setLoading(false);
      });
    supabase
      .from("reviews")
      .select("job_id")
      .eq("client_id", clientId)
      .then(({ data }) => {
        const ids = new Set<string>();
        (data as { job_id: string }[] | null)?.forEach((r) =>
          ids.add(r.job_id)
        );
        setReviewedJobIds(ids);
      });
  }, [clientId]);

  const filteredJobs = useMemo(() => {
    if (tab === "completed") {
      return jobs.filter((j) => j.status === "completed");
    }
    if (tab === "cancelled") {
      return jobs.filter((j) => j.status === "cancelled");
    }
    // active
    return jobs.filter((j) =>
      ["open", "accepted", "in_progress"].includes(j.status)
    );
  }, [jobs, tab]);

  const cancelJob = async (job: JobWithRelations) => {
    if (job.status !== "open") return;
    await supabase
      .from("job_requests")
      .update({ status: "cancelled" })
      .eq("id", job.id)
      .eq("client_id", clientId);
    setJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, status: "cancelled" } : j))
    );
    setSelectedJob((prev) =>
      prev && prev.id === job.id ? { ...prev, status: "cancelled" } : prev
    );
  };

  const openDetail = (job: JobWithRelations) => {
    setSelectedJob(job);
  };

  const closeDetail = () => setSelectedJob(null);

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <View className="px-4 pt-12 pb-3 border-b border-slate-800 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()} className="mb-1">
          <Text className="text-amber-400">Back</Text>
        </Pressable>
        <Text className="text-xl font-bold text-slate-50">My bookings</Text>
        <View style={{ width: 60 }} />
      </View>

      <View className="px-4 pt-2 pb-2 flex-row gap-2">
        {[
          { key: "active", label: "Active" },
          { key: "completed", label: "Completed" },
          { key: "cancelled", label: "Cancelled" },
        ].map((t) => (
          <Pressable
            key={t.key}
            onPress={() => setTab(t.key as StatusTab)}
            className={`flex-1 rounded-full px-3 py-1.5 items-center ${
              tab === t.key
                ? "bg-amber-500"
                : "bg-slate-800"
            }`}
          >
            <Text
              className={
                tab === t.key
                  ? "text-slate-900 font-semibold text-sm"
                  : "text-slate-200 text-sm"
              }
            >
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        className="flex-1 px-4 pt-2"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {loading ? (
          <Text className="text-slate-400 py-8 text-center">Loading…</Text>
        ) : filteredJobs.length === 0 ? (
          <Text className="text-slate-400 py-8 text-center">
            No jobs in this tab yet.
          </Text>
        ) : (
          filteredJobs.map((job) => (
            <View key={job.id}>
              <JobCard
                job={job}
                personName={job.technician?.full_name ?? null}
                personAvatarUrl={job.technician?.avatar_url ?? null}
                onPress={() => openDetail(job)}
              />
              {job.status === "completed" &&
              !reviewedJobIds.has(job.id) ? (
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/(shared)/leave-review",
                      params: { jobId: job.id },
                    })
                  }
                  className="mb-3 bg-amber-500/10 border border-amber-400 rounded-xl px-3 py-2"
                >
                  <Text className="text-amber-300 text-sm">
                    Rate your experience with{" "}
                    {job.technician?.full_name ?? "this technician"}
                  </Text>
                </Pressable>
              ) : null}
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={!!selectedJob}
        animationType="slide"
        transparent
        onRequestClose={closeDetail}
      >
        <View className="flex-1 justify-end bg-black/40">
          {selectedJob && (
            <View className="bg-slate-900 rounded-t-3xl p-4 pb-6">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-slate-50 font-semibold text-lg">
                  {selectedJob.title}
                </Text>
                <Pressable onPress={closeDetail}>
                  <Text className="text-slate-400 text-sm">Close</Text>
                </Pressable>
              </View>

              <Text className="text-slate-400 text-sm mb-3">
                {selectedJob.description || "No description provided."}
              </Text>

              <View className="flex-row items-center gap-2 mb-3">
                {["open", "accepted", "in_progress", "completed"].map((s, idx) => {
                  const statusOrder: Record<string, number> = {
                    open: 0,
                    accepted: 1,
                    in_progress: 2,
                    completed: 3,
                  };
                  const activeIndex = statusOrder[selectedJob.status] ?? 0;
                  const active = idx <= activeIndex;
                  const labels: Record<string, string> = {
                    open: "Open",
                    accepted: "Accepted",
                    in_progress: "In progress",
                    completed: "Completed",
                  };
                  return (
                    <View key={s} className="flex-row items-center">
                      <View
                        className={`w-2 h-2 rounded-full ${
                          active ? "bg-amber-400" : "bg-slate-600"
                        }`}
                      />
                      <Text
                        className={`ml-1 text-xs ${
                          active ? "text-slate-100" : "text-slate-500"
                        }`}
                      >
                        {labels[s]}
                      </Text>
                      {idx < 3 && (
                        <View className="w-4 h-px bg-slate-700 mx-1" />
                      )}
                    </View>
                  );
                })}
              </View>

              <View className="mb-3">
                <Text className="text-slate-300 text-sm">
                  Budget:{" "}
                  <Text className="font-semibold">
                    {selectedJob.budget_min || selectedJob.budget_max
                      ? `${selectedJob.budget_min ?? "?"} – ${
                          selectedJob.budget_max ?? "?"
                        } KES`
                      : "Not set"}
                  </Text>
                </Text>
                <Text className="text-slate-300 text-sm mt-1">
                  Location:{" "}
                  <Text className="font-semibold">
                    {selectedJob.location || "Not specified"}
                  </Text>
                </Text>
                <Text className="text-slate-300 text-sm mt-1">
                  Technician:{" "}
                  <Text className="font-semibold">
                    {selectedJob.technician?.full_name ?? "Not assigned yet"}
                  </Text>
                </Text>
              </View>

              <View className="flex-row gap-3 mt-2">
                {selectedJob.technician_id && (
                  <View className="flex-1">
                    <Button
                      title="Message technician"
                      onPress={() => {
                        closeDetail();
                        router.push(`/(shared)/chat/${selectedJob.id}`);
                      }}
                    />
                  </View>
                )}
                {selectedJob.status === "open" && (
                  <View className="flex-1">
                    <Button
                      title="Cancel job"
                      variant="outline"
                      onPress={() => cancelJob(selectedJob)}
                    />
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}
