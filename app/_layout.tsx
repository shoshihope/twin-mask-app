import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Twin Mask" }} />
      <Stack.Screen name="characters/index" options={{ title: "Characters" }} />
      <Stack.Screen name="characters/create" options={{ title: "Create Character" }} />
      <Stack.Screen name="characters/[id]" options={{ title: "Character" }} />
    </Stack>
  );
}
