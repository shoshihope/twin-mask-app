import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Button, Pressable, Text, TextInput, View } from "react-native";
import {
    BACKGROUND_FEATURES,
    BLOODLINES,
    CULTURES,
    FLAWS,
    SKILL_CATALOG,
} from "../../lib/characters/config";
import { saveCharacter } from "../../lib/storage/characters";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Small reusable list chips (toggleable)
function ToggleChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 999,
        borderWidth: 1,
        margin: 4,
        opacity: pressed ? 0.7 : 1,
        backgroundColor: selected ? "#ddd" : "transparent",
      })}
    >
      <Text>{label}</Text>
    </Pressable>
  );
}

// Simple section wrapper
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 8 }}>{title}</Text>
      {children}
    </View>
  );
}

export default function CreateCharacter() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [bloodline, setBloodline] = useState<(typeof BLOODLINES)[number] | "">("");
  const [culture, setCulture] = useState<(typeof CULTURES)[number] | "">("");

  // Multi-select states store KEYS (ids)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedFlaws, setSelectedFlaws] = useState<string[]>([]);

  // ---- Bloodline-aware skills ----
  // If a skill lists allowedBloodlines, show only when current bloodline is in that list.
  // Otherwise (no restriction) it's always shown.
  const visibleSkills = useMemo(() => {
    const entries = Object.entries(SKILL_CATALOG); // [key, {label, allowedBloodlines?}]
    if (!bloodline) return entries;
    return entries.filter(([_, v]) =>
      !v.allowedBloodlines || v.allowedBloodlines.includes(bloodline)
    );
  }, [bloodline]);

  // Clean up selected skills if user changes bloodline and some picks are no longer allowed
  const prunedSelectedSkills = useMemo(() => {
    const visibleKeys = new Set(visibleSkills.map(([k]) => k));
    return selectedSkills.filter((k) => visibleKeys.has(k));
  }, [selectedSkills, visibleSkills]);

  // (Keep UI state in sync)
  if (prunedSelectedSkills.length !== selectedSkills.length) {
    setSelectedSkills(prunedSelectedSkills);
  }

  const onSave = async () => {
    if (!name.trim()) {
      Alert.alert("Please enter a name");
      return;
    }
    if (!bloodline || !BLOODLINES.includes(bloodline)) {
      Alert.alert("Please pick a valid bloodline");
      return;
    }
    // Culture is optional; make it required if you want:
    // if (!culture) { Alert.alert("Pick a culture"); return; }

    const now = new Date().toISOString();
    await saveCharacter({
      id: uid(),
      name: name.trim(),
      bloodline,
      culture: culture || undefined,
      backgroundFeatures: selectedFeatures,
      skills: selectedSkills,
      flaws: selectedFlaws,
      createdAt: now,
      updatedAt: now,
    });
    router.replace("/characters");
  };

  // Helper to render a flexible grid of chips from a record
  const renderChipGrid = (
    items: Record<string, { label: string }>,
    selected: string[],
    setSelected: (next: string[]) => void
  ) => {
    const data = Object.entries(items); // [key,{label}]
    return (
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {data.map(([key, { label }]) => {
          const isSelected = selected.includes(key);
          return (
            <ToggleChip
              key={key}
              label={label}
              selected={isSelected}
              onPress={() =>
                setSelected(isSelected ? selected.filter((k) => k !== key) : [...selected, key])
              }
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>New Character</Text>

      {/* Name */}
      <Section title="Name">
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter name"
          style={{ borderWidth: 1, borderRadius: 8, padding: 10 }}
        />
      </Section>

      {/* Bloodline (single-select list using chips) */}
      <Section title="Bloodline">
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {BLOODLINES.map((b) => (
            <ToggleChip
              key={b}
              label={b}
              selected={bloodline === b}
              onPress={() => setBloodline(b)}
            />
          ))}
        </View>
      </Section>

      {/* Culture (single-select) */}
      <Section title="Culture">
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {CULTURES.map((c) => (
            <ToggleChip
              key={c}
              label={c}
              selected={culture === c}
              onPress={() => setCulture(c)}
            />
          ))}
        </View>
      </Section>

      {/* Background Features (multi-select) */}
      <Section title="Background Features">
        {renderChipGrid(BACKGROUND_FEATURES, selectedFeatures, setSelectedFeatures)}
      </Section>

      {/* Skills (multi-select, bloodline-aware) */}
      <Section title="Skills">
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {visibleSkills.map(([key, { label }]) => (
            <ToggleChip
              key={key}
              label={label}
              selected={selectedSkills.includes(key)}
              onPress={() => {
                const isSelected = selectedSkills.includes(key);
                setSelectedSkills(
                  isSelected
                    ? selectedSkills.filter((k) => k !== key)
                    : [...selectedSkills, key]
                );
              }}
            />
          ))}
        </View>
        {!bloodline ? (
          <Text style={{ marginTop: 6, fontStyle: "italic" }}>
            Select a bloodline to see bloodline-restricted skills.
          </Text>
        ) : null}
      </Section>

      {/* Flaws (multi-select) */}
      <Section title="Flaws">
        {renderChipGrid(FLAWS, selectedFlaws, setSelectedFlaws)}
      </Section>

      <View style={{ height: 16 }} />
      <Button title="Save" onPress={onSave} />
      <View style={{ height: 24 }} />
    </View>
  );
}
