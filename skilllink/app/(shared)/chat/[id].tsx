import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChatBubble } from "@/app/_components";
import { useChat } from "@/app/_hooks";
import { supabase } from "@/app/_lib";
import { useAuthStore } from "@/app/_store";
import type { Message } from "@/app/_types";

export default function ChatScreen() {
  const { id: jobId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);
  const { messages, loading, error, sendMessage } = useChat(jobId ?? null);
  const [input, setInput] = useState("");
  const [profileMap, setProfileMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const ids = [...new Set(messages.map((m: Message) => m.sender_id))];
    if (ids.length === 0) return;
    supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", ids)
      .then(({ data }: { data: { id: string; full_name: string | null }[] | null }) => {
        const map: Record<string, string> = {};
        (data ?? []).forEach((p) => {
          map[p.id] = p.full_name ?? "User";
        });
        setProfileMap(map);
      });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !userId) return;
    setInput("");
    await sendMessage(text, userId);
  };

  if (!jobId) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <Text className="text-slate-500">No chat selected</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
      className="flex-1 bg-slate-50"
    >
      <View className="bg-white border-b border-slate-200 px-4 pt-12 pb-2">
        <Pressable onPress={() => router.back()} className="mb-2">
          <Text className="text-blue-600">Back</Text>
        </Pressable>
        <Text className="text-lg font-semibold text-slate-900">Chat</Text>
      </View>
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-slate-500">Loading messages...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500">{error.message}</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
            renderItem={({ item }) => (
              <ChatBubble
                content={item.content}
                isOwn={item.sender_id === userId}
                createdAt={item.created_at}
                senderName={item.sender_id === userId ? undefined : profileMap[item.sender_id]}
              />
            )}
          />
          <View className="flex-row items-end border-t border-slate-200 bg-white p-2">
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type a message..."
              placeholderTextColor="#94a3b8"
              className="flex-1 bg-slate-100 rounded-full px-4 py-2.5 mr-2 text-slate-900 max-h-24"
              multiline
              onSubmitEditing={handleSend}
            />
            <Pressable
              onPress={handleSend}
              className="bg-blue-600 rounded-full px-4 py-2.5"
            >
              <Text className="text-white font-semibold">Send</Text>
            </Pressable>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
}
