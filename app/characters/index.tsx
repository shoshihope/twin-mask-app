// app/characters/index.tsx
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function CharactersIndex() {
  const router = useRouter();

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">Your Characters</Text>

      {/* Add Character button */}
      <Pressable
        onPress={() => router.push("/characters/new")}
        className="bg-black rounded-2xl p-3 mb-4"
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>➕ Add New Character</Text>
      </Pressable>

      {/* Later you can map over saved characters here */}
    </View>
  );
}
