import { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Button, Input } from "../../components/ui";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../store/authStore";

export default function JobPostScreen() {
  const router = useRouter();
  const { technicianId } = useLocalSearchParams<{ technicianId?: string }>();
  const clientId = useAuthStore((s) => s.user?.id);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!clientId) {
      setError("You must be logged in");
      return;
    }
    setLoading(true);
    const { data, error: err } = await supabase
      .from("job_requests")
      .insert({
        client_id: clientId,
        technician_id: technicianId ?? null,
        title: title.trim(),
        description: description.trim() || null,
        budget_min: budgetMin ? parseFloat(budgetMin) : null,
        budget_max: budgetMax ? parseFloat(budgetMax) : null,
        location: location.trim() || null,
        status: "open",
      })
      .select("id")
      .single();
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.replace("/(client)/bookings");
    if (data?.id) {
      router.push(`/(shared)/chat/${data.id}`);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-slate-50"
    >
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 48 }}>
        <Pressable onPress={() => router.back()} className="mb-4">
          <Text className="text-blue-600">Back</Text>
        </Pressable>
        <Text className="text-2xl font-bold text-slate-900 mb-6">Post a job</Text>
        <Input
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Fix home wiring"
          className="mb-4"
        />
        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the work needed..."
          multiline
          className="mb-4"
        />
        <Input
          label="Budget min (KES)"
          value={budgetMin}
          onChangeText={setBudgetMin}
          placeholder="0"
          className="mb-4"
        />
        <Input
          label="Budget max (KES)"
          value={budgetMax}
          onChangeText={setBudgetMax}
          placeholder="0"
          className="mb-4"
        />
        <Input
          label="Location"
          value={location}
          onChangeText={setLocation}
          placeholder="Address or area"
          className="mb-4"
        />
        {error ? <Text className="text-red-500 text-sm mb-4">{error}</Text> : null}
        <Button
          title={loading ? "Posting…" : "Post job"}
          onPress={handleSubmit}
          disabled={loading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
