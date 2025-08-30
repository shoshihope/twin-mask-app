import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Button, FlatList, Pressable, Text, View } from "react-native";
import { Character, getCharacters } from "../../lib/storage/characters";

export default function CharactersScreen() {
  const router = useRouter();
  const [chars, setChars] = useState<Character[]>([]);

  const load = async () => setChars(await getCharacters());

  useEffect(() => { load(); }, []);
  useFocusEffect(useCallback(() => { load(); }, []));

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Button title="Create New Character" onPress={() => router.push("/characters/create")} />

      {chars.length === 0 ? (
        <Text style={{ marginTop: 12 }}>No characters yet.</Text>
      ) : (
        <FlatList
          data={chars}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/characters/${item.id}`)}
              style={({ pressed }) => ({
                padding: 12,
                borderWidth: 1,
                borderRadius: 8,
                marginVertical: 6,
                opacity: pressed ? 0.6 : 1
              })}
            >
              <Text style={{ fontWeight: "600" }}>{item.name}</Text>
              <Text>{item.bloodline}</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
