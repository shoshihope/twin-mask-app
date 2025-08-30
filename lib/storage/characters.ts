import AsyncStorage from "@react-native-async-storage/async-storage";

export type Character = {
  id: string;
  name: string;
  bloodline: string; // we’ll validate against BLOODLINES at creation
  createdAt: string;
  updatedAt: string;
};

const KEY = "tm_characters";

export async function getCharacters(): Promise<Character[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveCharacter(c: Character): Promise<void> {
  const all = await getCharacters();
  const existingIdx = all.findIndex((x) => x.id === c.id);
  if (existingIdx >= 0) {
    all[existingIdx] = c;
  } else {
    all.push(c);
  }
  await AsyncStorage.setItem(KEY, JSON.stringify(all));
}

export async function getCharacter(id: string): Promise<Character | undefined> {
  const all = await getCharacters();
  return all.find((c) => c.id === id);
}

export async function deleteCharacter(id: string): Promise<void> {
  const all = await getCharacters();
  const filtered = all.filter((c) => c.id !== id);
  await AsyncStorage.setItem(KEY, JSON.stringify(filtered));
}
