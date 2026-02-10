import { View, Text, TextInput } from "react-native";

export default function Input({
  label,
  containerClass = "",
  labelClass = "",
  inputClass = "",
  ...props
}) {
  return (
    <View className={`mb-5 ${containerClass}`}>
      <Text
        className={`text-sm font-bold mb-1 text-black dark:text-gray-200 ${labelClass}`}
      >
        {label}
      </Text>

      <View className="bg-slate-800 rounded-xl px-4 h-12 justify-center">
        <TextInput
          {...props}
          placeholderTextColor="#94a3b8"
          className={`text-white ${inputClass} `}
        />
      </View>
    </View>
  );
}