import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hello and welcome to the Twin Mask App!</Text>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button
          title="Go to settings"
          onPress={() => router.push("/settings")}
        />
      </View>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button
          title="Go to Characters"
          onPress={() => router.push("/characters")}
        />
      </View>

    </View>
  );
}
