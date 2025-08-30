// lib/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Character } from "./characters/schema";

export const STORAGE_KEY = "tm.characters.v1";

// Load all characters
export async function loadCharacters(): Promise<Character[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as Character[] : [];
  } catch {
    return [];
  }
}

// Save (append) a new character
export async function saveCharacter(c: Character): Promise<void> {
  const list = await loadCharacters();
  list.push(c);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// Replace the entire list (useful after edit/delete)
export async function replaceCharacters(list: Character[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// Convenience helpers (optional)

// Get one by id
export async function getCharacterById(id: string): Promise<Character | undefined> {
  const list = await loadCharacters();
  return list.find(c => c.id === id);
}

// Upsert edit by id
export async function upsertCharacter(updated: Character): Promise<void> {
  const list = await loadCharacters();
  const idx = list.findIndex(c => c.id === updated.id);
  if (idx === -1) list.push(updated);
  else list[idx] = updated;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// Delete one by id
export async function deleteCharacter(id: string): Promise<void> {
  const list = await loadCharacters();
  const next = list.filter(c => c.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
