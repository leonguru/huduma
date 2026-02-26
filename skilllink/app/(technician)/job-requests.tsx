import { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, Modal } from "react-native";
import { useRouter } from "expo-router";
import { JobCard } from "../../components/JobCard";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../store/authStore";
import type { JobRequest } from "../../types";
import { COLORS } from "../../constants";

type TechTab = "open" | "my" | "completed";

interface JobWithRelations extends JobRequest {
  client?: { full_name: string | null; avatar_url: string | null } | null;
}

export default function JobRequestsScreen() {
  const router = useRouter();
  const technicianId = useAuthStore((s) => s.user?.id);
  const [tab, setTab] = useState<TechTab>("open");
  const [jobs, setJobs] = useState<JobWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobWithRelations | null>(null);

  useEffect(() => {
    if (!technicianId) return;
    setLoading(true);
    supabase
      .from("job_requests")
      .select(
        "*, client:profiles!job_requests_client_id_fkey(full_name, avatar_url)"
      )
      .or(`technician_id.eq.${technicianId},technician_id.is.null`)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setJobs((data as JobWithRelations[]) ?? []);
        setLoading(false);
      });
  }, [technicianId]);

  const filteredJobs = useMemo(() => {
    if (tab === "completed") {
      return jobs.filter(
        (j) => j.technician_id === technicianId && j.status === "completed"
      );
    }
    if (tab === "my") {
      return jobs.filter(
        (j) =>
          j.technician_id === technicianId &&
          ["open", "accepted", "in_progress"].includes(j.status)
      );
    }
    // open requests
    return jobs.filter((j) => j.status === "open" && !j.technician_id);
  }, [jobs, tab, technicianId]);

  const acceptJob = async (job: JobWithRelations) => {
    if (!technicianId || job.status !== "open" || job.technician_id) return;
    await supabase
      .from("job_requests")
      .update({ technician_id: technicianId, status: "accepted" })
      .eq("id", job.id)
      .eq("status", "open")
      .is("technician_id", null);
    setJobs((prev) =>
      prev.map((j) =>
        j.id === job.id
          ? { ...j, status: "accepted", technician_id: technicianId }
          : j
      )
    );
    setSelectedJob((prev) =>
      prev && prev.id === job.id
        ? { ...prev, status: "accepted", technician_id: technicianId }
        : prev
    );
  };

  const openDetail = (job: JobWithRelations) => setSelectedJob(job);
  const closeDetail = () => setSelectedJob(null);

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <View className="px-4 pt-12 pb-3 border-b border-slate-800 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()} className="mb-1">
          <Text className="text-amber-400">Back</Text>
        </Pressable>
        <Text className="text-xl font-bold text-slate-50">Job requests</Text>
        <View style={{ width: 60 }} />
      </View>

      <View className="px-4 pt-2 pb-2 flex-row gap-2">
        {[
          { key: "open", label: "Open Requests" },
          { key: "my", label: "My Jobs" },
          { key: "completed", label: "Completed" },
        ].map((t) => (
          <Pressable
            key={t.key}
            onPress={() => setTab(t.key as TechTab)}
            className={`flex-1 rounded-full px-3 py-1.5 items-center ${
              tab === t.key ? "bg-amber-500" : "bg-slate-800"
            }`}
          >
            <Text
              className={
                tab === t.key
                  ? "text-slate-900 font-semibold text-xs"
                  : "text-slate-200 text-xs"
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
            <JobCard
              key={job.id}
              job={job}
              personName={job.client?.full_name ?? null}
              personAvatarUrl={job.client?.avatar_url ?? null}
              onPress={() => openDetail(job)}
            />
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

              <View className="mb-3">
                <Text className="text-slate-300 text-sm">
                  Client:{" "}
                  <Text className="font-semibold">
                    {selectedJob.client?.full_name ?? "Unknown"}
                  </Text>
                </Text>
                <Text className="text-slate-300 text-sm mt-1">
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
              </View>

              <View className="flex-row gap-3 mt-2">
                <View className="flex-1">
                  <Button
                    title="Open chat"
                    onPress={() => {
                      closeDetail();
                      router.push(`/(shared)/chat/${selectedJob.id}`);
                    }}
                  />
                </View>
                {selectedJob.status === "open" && !selectedJob.technician_id && (
                  <View className="flex-1">
                    <Button
                      title="Accept job"
                      variant="outline"
                      onPress={() => acceptJob(selectedJob)}
                    />
                  </View>
                )}
                {selectedJob.technician_id === technicianId &&
                  selectedJob.status !== "completed" && (
                    <View className="flex-1">
                      <Button
                        title="Mark completed"
                        variant="outline"
                        onPress={async () => {
                          await supabase
                            .from("job_requests")
                            .update({ status: "completed" })
                            .eq("id", selectedJob.id)
                            .eq("technician_id", technicianId);
                          setJobs((prev) =>
                            prev.map((j) =>
                              j.id === selectedJob.id
                                ? { ...j, status: "completed" }
                                : j
                            )
                          );
                          setSelectedJob((prev) =>
                            prev && prev.id === selectedJob.id
                              ? { ...prev, status: "completed" }
                              : prev
                          );
                        }}
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
