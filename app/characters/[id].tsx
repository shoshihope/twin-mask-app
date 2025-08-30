import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Text, View } from "react-native";
import { BACKGROUND_FEATURES, FLAWS, SKILL_CATALOG } from "../../lib/characters/config";
import { Character, deleteCharacter, getCharacter } from "../../lib/storage/characters";

// ---- Generic type guard so TS knows key exists on the object ----
function hasKey<T extends object>(obj: T, key: PropertyKey): key is keyof T {
  return key in obj;
}

export default function CharacterDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [char, setChar] = useState<Character | null>(null);

  useEffect(() => {
    (async () => {
      if (id) {
        const c = await getCharacter(id);
        setChar(c ?? null);
      }
    })();
  }, [id]);

  const skillLabels = useMemo(() => {
    const keys = char?.skills ?? [];
    return keys.map((k) =>
      hasKey(SKILL_CATALOG, k) ? SKILL_CATALOG[k].label : String(k)
    );
  }, [char]);

  const featureLabels = useMemo(() => {
    const keys = char?.backgroundFeatures ?? [];
    return keys.map((k) =>
      hasKey(BACKGROUND_FEATURES, k) ? BACKGROUND_FEATURES[k].label : String(k)
    );
  }, [char]);

  const flawLabels = useMemo(() => {
    const keys = char?.flaws ?? [];
    return keys.map((k) =>
      hasKey(FLAWS, k) ? FLAWS[k].label : String(k)
    );
  }, [char]);

  if (!char) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text>Character not found.</Text>
        <Button title="Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 8 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>{char.name}</Text>
      <Text>Bloodline: {char.bloodline}</Text>
      {char.culture ? <Text>Culture: {char.culture}</Text> : null}

      <Text style={{ marginTop: 8, fontWeight: "600" }}>Background Features</Text>
      <Text>{featureLabels.length ? featureLabels.join(", ") : "—"}</Text>

      <Text style={{ marginTop: 8, fontWeight: "600" }}>Skills</Text>
      <Text>{skillLabels.length ? skillLabels.join(", ") : "—"}</Text>

      <Text style={{ marginTop: 8, fontWeight: "600" }}>Flaws</Text>
      <Text>{flawLabels.length ? flawLabels.join(", ") : "—"}</Text>

      <View style={{ height: 12 }} />

      <Button
        title="Delete"
        color="#b91c1c"
        onPress={() =>
          Alert.alert("Delete character?", "This cannot be undone.", [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: async () => {
                await deleteCharacter(char.id);
                router.replace("/characters");
              },
            },
          ])
        }
      />
    </View>
  );
}
