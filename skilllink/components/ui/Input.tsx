import { useState } from "react";
import { View, TextInput, Text, Pressable } from "react-native";

interface InputProps {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  label?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  error?: string;
  className?: string;
  showTogglePassword?: boolean;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  label,
  secureTextEntry,
  multiline,
  error,
  className = "",
  showTogglePassword,
}: InputProps) {
  const [hidden, setHidden] = useState(!!secureTextEntry);

  return (
    <View className={className}>
      {label ? (
        <Text className="text-slate-700 font-medium mb-1">{label}</Text>
      ) : null}
      <View
        className={`border rounded-lg bg-white border-slate-200 flex-row items-center ${
          multiline ? "min-h-[80px]" : ""
        } ${error ? "border-red-500" : ""}`}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          secureTextEntry={showTogglePassword ? hidden : secureTextEntry}
          multiline={multiline}
          className="flex-1 px-3 py-2.5 text-slate-900"
        />
        {showTogglePassword ? (
          <Pressable onPress={() => setHidden((h) => !h)} className="px-3 py-2">
            <Text className="text-xs font-medium text-slate-500">
              {hidden ? "Show" : "Hide"}
            </Text>
          </Pressable>
        ) : null}
      </View>
      {error ? <Text className="text-red-500 text-sm mt-1">{error}</Text> : null}
    </View>
  );
}
