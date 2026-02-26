import { View } from "react-native";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <View className={`bg-white rounded-xl border border-slate-200 p-4 ${className}`}>
      {children}
    </View>
  );
}
