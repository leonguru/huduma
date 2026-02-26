import { View, Text } from "react-native";

interface RatingStarsProps {
  rating: number;
  max?: number;
  showValue?: boolean;
  size?: "sm" | "md";
}

export function RatingStars({
  rating,
  max = 5,
  showValue = true,
  size = "md",
}: RatingStarsProps) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = max - full - half;
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <View className="flex-row items-center gap-0.5">
      {Array.from({ length: full }, (_, i) => (
        <Text key={`f-${i}`} className={textSize}>
          ★
        </Text>
      ))}
      {half ? <Text className={textSize}>★</Text> : null}
      {Array.from({ length: empty }, (_, i) => (
        <Text key={`e-${i}`} className={`${textSize} text-slate-300`}>
          ★
        </Text>
      ))}
      {showValue ? (
        <Text className={`${textSize} text-slate-600 ml-1`}>
          {rating.toFixed(1)}
        </Text>
      ) : null}
    </View>
  );
}
