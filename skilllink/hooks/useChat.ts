import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { Message } from "../types";

export function useChat(jobId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(!!jobId);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("messages")
      .select("*")
      .eq("job_id", jobId)
      .order("created_at", { ascending: true });
    if (err) setError(err as unknown as Error);
    else setMessages((data as Message[]) ?? []);
    setLoading(false);
  }, [jobId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (!jobId) return;
    const channel = supabase
      .channel(`messages:${jobId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `job_id=eq.${jobId}` },
        () => fetch()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId, fetch]);

  const sendMessage = useCallback(
    async (content: string, senderId: string) => {
      if (!jobId) return { error: new Error("No job") };
      const { error: err } = await supabase.from("messages").insert({
        job_id: jobId,
        sender_id: senderId,
        content,
      });
      return { error: err };
    },
    [jobId]
  );

  return { messages, loading, error, sendMessage, refetch: fetch };
}
