import { View, Text } from "react-native";
import { formatDate } from "../lib/utils";

interface ChatBubbleProps {
  content: string;
  isOwn: boolean;
  createdAt: string;
  senderName?: string | null;
}

export function ChatBubble({ content, isOwn, createdAt, senderName }: ChatBubbleProps) {
  return (
    <View
      className={`mb-2 max-w-[85%] ${isOwn ? "self-end bg-blue-600" : "self-start bg-slate-200"}`}
      style={{ alignSelf: isOwn ? "flex-end" : "flex-start" }}
    >
      <View className={`rounded-2xl px-4 py-2 ${isOwn ? "bg-blue-600" : "bg-slate-200"}`}>
        {!isOwn && senderName ? (
          <Text className="text-slate-600 text-xs font-medium mb-0.5">{senderName}</Text>
        ) : null}
        <Text className={isOwn ? "text-white" : "text-slate-900"}>{content}</Text>
        <Text
          className={`text-xs mt-0.5 ${isOwn ? "text-blue-200" : "text-slate-500"}`}
        >
          {formatDate(createdAt)}
        </Text>
      </View>
    </View>
  );
}
