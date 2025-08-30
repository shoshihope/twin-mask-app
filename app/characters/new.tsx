// app/characters/new.tsx
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { buildCharacter, totalCostFromCounts, type Counts, type CreatorInputs } from "../../lib/characters/compute";
import {
    BACKGROUND_FEATURES,
    BLOODLINES, CULTURES,
    FLAWS,
    SKILL_CATALOG,
    type BackgroundFeatureKey,
    type FlawKey,
    type SkillKey
} from "../../lib/characters/config";
import type { Character } from "../../lib/characters/schema";
import { saveCharacter } from "../../lib/storage";

const uuid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// --- tiny helpers for counts ---
const getMax = (k: SkillKey) => SKILL_CATALOG[k].maxStacks ?? 1;
function inc<K extends string>(counts: Counts<K>, key: K, max = 1): Counts<K> {
  const cur = counts[key] ?? 0;
  if (cur >= max) return counts;
  return { ...counts, [key]: cur + 1 };
}
function dec<K extends string>(counts: Counts<K>, key: K): Counts<K> {
  const cur = counts[key] ?? 0;
  if (cur <= 1) {
    // keep the key with 0; harmless and type-clean
    return { ...counts, [key]: 0 };
  }
  return { ...counts, [key]: cur - 1 };
}


export default function NewCharacter() {
  const router = useRouter();

  // ✅ use charName instead of name to avoid DOM 'name' deprecation warnings
  const [charName, setCharName] = useState("");
  const [bloodline, setBloodline] = useState<string>("");
  const [culture, setCulture] = useState<string>("");
  const [hp, setHp] = useState<string>("");

  // counts for each costed set (keys map to counts)
  const [backgroundCounts, setBackgroundCounts] = useState<Counts<BackgroundFeatureKey>>({});
  const [skillCounts, setSkillCounts] = useState<Counts<SkillKey>>({});
  const [flawCounts, setFlawCounts] = useState<Counts<FlawKey>>({});

  // Live total cost preview
  const liveTotal = useMemo(() => {
    const inputLike: CreatorInputs = {
      name: charName,
      bloodline,
      culture,
      hp,
      background_counts: backgroundCounts,
      skill_counts: skillCounts,
      flaw_counts: flawCounts,
    };
    return totalCostFromCounts(inputLike);
  }, [charName, bloodline, culture, hp, backgroundCounts, skillCounts, flawCounts]);

  const onSave = async () => {
    if (!charName.trim()) return Alert.alert("Name required");
    if (!bloodline) return Alert.alert("Bloodline required");

    const inputs: CreatorInputs = {
      name: charName,
      bloodline,
      culture,
      hp,
      background_counts: backgroundCounts,
      skill_counts: skillCounts,
      flaw_counts: flawCounts,
    };

    const built = buildCharacter(inputs);
    if (!built.ok) {
      const stackMsg = built.stackIssues.map(i =>
        `${i.kind} ${("key" in i ? String(i.key) : "")}: ${i.count}/${i.max}`
      ).join("; ");
      const prereqMsg = built.prereqIssues.map(p => {
        const andMsg = p.missingAll.length ? `missing: ${p.missingAll.join(", ")}` : "";
        const orMsg = p.missingAny.length ? `requires one of: ${p.missingAny.join(", ")}` : "";
        return `${p.key} (${[andMsg, orMsg].filter(Boolean).join(" | ")})`;
      }).join("; ");
      const msg = [stackMsg, prereqMsg].filter(Boolean).join("\n");
      return Alert.alert("Cannot save", msg || "Please fix selections.");
    }

    const character: Character = {
      id: uuid(),
      createdAt: Date.now(),
      ...built.character,
    };

    await saveCharacter(character);
    router.replace("/characters");
  };

  return (
    <View className="flex-1">
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Text className="text-2xl font-semibold">New Character</Text>

        <Text>Name</Text>
        <TextInput
          value={charName}
          onChangeText={setCharName}
          placeholder="Character name"
          className="border rounded-2xl p-3"
        />

        <Text>Bloodline</Text>
        <View className="flex-row flex-wrap gap-2">
          {BLOODLINES.map(b => (
            <Pressable key={b} onPress={() => setBloodline(b)}
              className={`px-3 py-2 rounded-2xl ${bloodline === b ? "bg-black" : "border"}`}>
              <Text style={{ color: bloodline === b ? "#fff" : "#000" }}>{b}</Text>
            </Pressable>
          ))}
        </View>

        <Text>Culture (optional)</Text>
        <View className="flex-row flex-wrap gap-2">
          {CULTURES.map(c => (
            <Pressable key={c} onPress={() => setCulture(c)}
              className={`px-3 py-2 rounded-2xl ${culture === c ? "bg-black" : "border"}`}>
              <Text style={{ color: culture === c ? "#fff" : "#000" }}>{c}</Text>
            </Pressable>
          ))}
        </View>

        <Text>HP (optional)</Text>
        <TextInput
          value={hp}
          onChangeText={setHp}
          inputMode="numeric"
          keyboardType="number-pad"
          placeholder="Leave blank if not used"
          className="border rounded-2xl p-3"
        />

        {/* Background features (once or stackable via maxStacks) */}
        <Text className="text-xl font-semibold mt-6">Background Features</Text>
        <View className="flex-row flex-wrap">
          {(Object.keys(BACKGROUND_FEATURES) as BackgroundFeatureKey[]).map(k => {
            const item = BACKGROUND_FEATURES[k];
            const count = backgroundCounts[k] ?? 0;
            const max = item.maxStacks ?? 1;
            const canAdd = count < max;
            return (
              <View key={k} style={{ margin: 6, padding: 8 }} className="border rounded-2xl">
                <Text>{item.label} ({item.cost})</Text>
                <Text style={{ opacity: 0.7 }}>{count}/{max === Infinity ? "∞" : max}</Text>
                <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
                  <Pressable onPress={() => setBackgroundCounts(x => dec(x, k))}
                    disabled={count === 0} className="border rounded-2xl px-3 py-2">
                    <Text>−</Text>
                  </Pressable>
                  <Pressable onPress={() => setBackgroundCounts(x => inc(x, k, max))}
                    disabled={!canAdd} className="border rounded-2xl px-3 py-2">
                    <Text>＋</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>

        {/* Skills (stacking + prereqs handled elsewhere; this is UI) */}
        <Text className="text-xl font-semibold mt-6">Skills</Text>
        <View className="flex-row flex-wrap">
          {(Object.keys(SKILL_CATALOG) as SkillKey[]).map(k => {
            const item = SKILL_CATALOG[k];
            const count = skillCounts[k] ?? 0;
            const max = item.maxStacks ?? 1;
            const canAdd = count < max;
            return (
              <View key={k} style={{ margin: 6, padding: 8 }} className="border rounded-2xl">
                <Text>{item.label} ({item.cost})</Text>
                <Text style={{ opacity: 0.7 }}>{item.category}</Text>
                <Text style={{ opacity: 0.7 }}>{count}/{max === Infinity ? "∞" : max}</Text>
                <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
                  <Pressable onPress={() => setSkillCounts(x => dec(x, k))}
                    disabled={count === 0} className="border rounded-2xl px-3 py-2">
                    <Text>−</Text>
                  </Pressable>
                  <Pressable onPress={() => setSkillCounts(x => inc(x, k, max))}
                    disabled={!canAdd} className="border rounded-2xl px-3 py-2">
                    <Text>＋</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>

        {/* Flaws (some can stack) */}
        <Text className="text-xl font-semibold mt-6">Flaws</Text>
        <View className="flex-row flex-wrap">
          {(Object.keys(FLAWS) as FlawKey[]).map(k => {
            const item = FLAWS[k];
            const count = flawCounts[k] ?? 0;
            const max = item.maxStacks ?? 1;
            const canAdd = count < max;
            return (
              <View key={k} style={{ margin: 6, padding: 8 }} className="border rounded-2xl">
                <Text>{item.label} ({item.cost})</Text>
                <Text style={{ opacity: 0.7 }}>{count}/{max === Infinity ? "∞" : max}</Text>
                <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
                  <Pressable onPress={() => setFlawCounts(x => dec(x, k))}
                    disabled={count === 0} className="border rounded-2xl px-3 py-2">
                    <Text>−</Text>
                  </Pressable>
                  <Pressable onPress={() => setFlawCounts(x => inc(x, k, max))}
                    disabled={!canAdd} className="border rounded-2xl px-3 py-2">
                    <Text>＋</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>

        <Text className="text-lg font-semibold mt-8">Total cost: {liveTotal}</Text>

        <Pressable onPress={onSave} className="bg-black rounded-2xl p-3 items-center mt-4">
          <Text style={{ color: "#fff", fontWeight: "600" }}>Save character</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
