import { Pressable, Text } from "react-native";

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  className?: string;
}

export function Button({
  onPress,
  title,
  variant = "primary",
  disabled,
  className = "",
}: ButtonProps) {
  const base = "py-3 px-4 rounded-lg items-center justify-center";
  const variants = {
    primary: "bg-blue-600 active:bg-blue-700",
    secondary: "bg-slate-200 active:bg-slate-300",
    outline: "border border-slate-300 bg-transparent active:bg-slate-100",
  };
  const textVariants = {
    primary: "text-white font-semibold",
    secondary: "text-slate-800 font-semibold",
    outline: "text-slate-800 font-semibold",
  };
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${disabled ? "opacity-50" : ""} ${className}`}
    >
      <Text className={textVariants[variant]}>{title}</Text>
    </Pressable>
  );
}
