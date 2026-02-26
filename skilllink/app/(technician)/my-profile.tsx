import { useState, useEffect } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Button, Input } from "../../components/ui";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../store/authStore";

export default function MyProfileScreen() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("electrician");
  const [hourlyRate, setHourlyRate] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;
    supabase
      .from("technician_profiles")
      .select("*")
      .eq("id", userId)
      .single()
      .then(({ data }) => {
        if (data) {
          setBio((data as { bio: string }).bio ?? "");
          setCategory((data as { category: string }).category ?? "electrician");
          setHourlyRate(String((data as { hourly_rate: number }).hourly_rate ?? ""));
          setIsAvailable((data as { is_available: boolean }).is_available ?? true);
        }
        setLoading(false);
      });
  }, [userId]);

  const handleSave = async () => {
    if (!userId) return;
    setError("");
    setSaving(true);
    const { error: upsertErr } = await supabase.from("technician_profiles").upsert(
      {
        id: userId,
        bio: bio.trim() || null,
        category: category || "electrician",
        hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
        is_available: isAvailable,
      },
      { onConflict: "id" }
    );
    setSaving(false);
    if (upsertErr) setError(upsertErr.message);
    else router.back();
  };

  if (loading) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <Text className="text-slate-500">Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-slate-50"
    >
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 48 }}>
        <Pressable onPress={() => router.back()} className="mb-4">
          <Text className="text-blue-600">Back</Text>
        </Pressable>
        <Text className="text-2xl font-bold text-slate-900 mb-6">My profile</Text>
        <Input
          label="Bio"
          value={bio}
          onChangeText={setBio}
          placeholder="Tell clients about your experience..."
          multiline
          className="mb-4"
        />
        <Input
          label="Hourly rate (KES)"
          value={hourlyRate}
          onChangeText={setHourlyRate}
          placeholder="0"
          className="mb-4"
        />
        <Pressable
          onPress={() => setIsAvailable(!isAvailable)}
          className="flex-row items-center mb-4"
        >
          <View
            className={`w-6 h-6 rounded border-2 mr-2 ${isAvailable ? "bg-green-500 border-green-500" : "bg-white border-slate-300"}`}
          />
          <Text className="text-slate-700">Available for new jobs</Text>
        </Pressable>
        {error ? <Text className="text-red-500 text-sm mb-4">{error}</Text> : null}
        <Button title={saving ? "Saving…" : "Save"} onPress={handleSave} disabled={saving} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
