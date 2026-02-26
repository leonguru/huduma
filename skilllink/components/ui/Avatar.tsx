import { View, Image, Text } from "react-native";

interface AvatarProps {
  uri?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
}

export function Avatar({ uri, name, size = 48, className = "" }: AvatarProps) {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <View
      className={`rounded-full bg-slate-300 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size }}
          className="rounded-full"
        />
      ) : (
        <Text className="text-slate-600 font-semibold" style={{ fontSize: size * 0.4 }}>
          {initials ?? "?"}
        </Text>
      )}
    </View>
  );
}
