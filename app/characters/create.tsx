import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Button,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
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

// --- Generic type guard: proves "key" exists on "obj" ---
function hasKey<T extends object>(obj: T, key: PropertyKey): key is keyof T {
  return key in obj;
}

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 8 }}>{title}</Text>
      {children}
    </View>
  );
}

// --- Reusable two-column row (label | cost) ---
function TwoColRow({
  label,
  cost,
  selected,
  onToggle,
}: {
  label: string;
  cost?: number;
  selected: boolean;
  onToggle: () => void;
}) {
  const costDisplay = Number.isFinite(cost) ? cost : 0;
  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginVertical: 6,
        opacity: pressed ? 0.7 : 1,
        backgroundColor: selected ? "#e5e7eb" : "transparent",
      })}
    >
      {/* Left column: name */}
      <Text style={{ flex: 1, fontSize: 15 }}>{label}</Text>
      {/* Right column: cost */}
      <Text style={{ width: 64, textAlign: "right", fontVariant: ["tabular-nums"] }}>
        {costDisplay}
      </Text>
    </Pressable>
  );
}

export default function CreateCharacter() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [bloodline, setBloodline] = useState<(typeof BLOODLINES)[number] | "">("");
  const [culture, setCulture] = useState<(typeof CULTURES)[number] | "">("");

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedFlaws, setSelectedFlaws] = useState<string[]>([]);

  // Filter visible skills by bloodline
  const visibleSkills = useMemo(() => {
    const entries = Object.entries(SKILL_CATALOG) as [
      string,
      { label: string; cost?: number; allowedBloodlines?: readonly (typeof BLOODLINES[number])[] }
    ][];
    if (!bloodline) return entries;
    return entries.filter(
      ([_, v]) => !v.allowedBloodlines || v.allowedBloodlines.includes(bloodline)
    );
  }, [bloodline]);

  // PRUNE invalid selected skills when bloodline changes
  useEffect(() => {
    const allowed = new Set(visibleSkills.map(([k]) => k));
    setSelectedSkills((prev) => prev.filter((k) => allowed.has(k)));
  }, [visibleSkills]);

  // --- Subtotals (safe indexing via type guards) ---
  const skillsSubtotal = useMemo(() => {
    let sum = 0;
    for (const key of selectedSkills) {
      const cost =
        hasKey(SKILL_CATALOG, key) && typeof SKILL_CATALOG[key].cost === "number"
          ? (SKILL_CATALOG[key].cost as number)
          : 0;
      sum += cost;
    }
    return sum;
  }, [selectedSkills]);

  const featuresSubtotal = useMemo(() => {
    let sum = 0;
    for (const key of selectedFeatures) {
      const cost =
        hasKey(BACKGROUND_FEATURES, key) && typeof BACKGROUND_FEATURES[key].cost === "number"
          ? (BACKGROUND_FEATURES[key].cost as number)
          : 0;
      sum += cost;
    }
    return sum;
  }, [selectedFeatures]);

  const flawsSubtotal = useMemo(() => {
    let sum = 0;
    for (const key of selectedFlaws) {
      const cost =
        hasKey(FLAWS, key) && typeof FLAWS[key].cost === "number"
          ? (FLAWS[key].cost as number)
          : 0;
      sum += cost;
    }
    return sum;
  }, [selectedFlaws]);

  const characterPoints = skillsSubtotal + featuresSubtotal + flawsSubtotal;

  const onSave = async () => {
    if (!name.trim()) {
      Alert.alert("Please enter a name");
      return;
    }
    if (!bloodline || !BLOODLINES.includes(bloodline)) {
      Alert.alert("Please pick a valid bloodline");
      return;
    }
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

  // Helper to render a toggle list (two-column rows)
  const renderTwoColToggleList = (
    catalog: Record<string, { label: string; cost?: number }>,
    selected: string[],
    setSelected: (next: string[]) => void
  ) => (
    <View>
      {Object.entries(catalog).map(([key, { label, cost }]) => {
        const isSelected = selected.includes(key);
        return (
          <TwoColRow
            key={key}
            label={label}
            cost={cost}
            selected={isSelected}
            onToggle={() =>
              setSelected(isSelected ? selected.filter((k) => k !== key) : [...selected, key])
            }
          />
        );
      })}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
      keyboardVerticalOffset={Platform.select({ ios: 80, android: 0 })}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>New Character</Text>

        {/* Name */}
        <Section title="Name">
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter name"
            style={{ borderWidth: 1, borderRadius: 8, padding: 10 }}
            returnKeyType="done"
          />
        </Section>

        {/* Bloodline */}
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

        {/* Culture */}
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

        {/* Background Features */}
        <Section title="Background Features">
          {renderTwoColToggleList(BACKGROUND_FEATURES, selectedFeatures, setSelectedFeatures)}
        </Section>

        {/* Skills */}
        <Section title="Skills">
          <View>
            {visibleSkills.map(([key, { label, cost }]) => {
              const isSelected = selectedSkills.includes(key);
              return (
                <TwoColRow
                  key={key}
                  label={label}
                  cost={cost}
                  selected={isSelected}
                  onToggle={() =>
                    setSelectedSkills(
                      isSelected
                        ? selectedSkills.filter((k) => k !== key)
                        : [...selectedSkills, key]
                    )
                  }
                />
              );
            })}
          </View>
          {!bloodline ? (
            <Text style={{ marginTop: 6, fontStyle: "italic" }}>
              Select a bloodline to see bloodline-restricted skills.
            </Text>
          ) : null}
        </Section>

        {/* Flaws */}
        <Section title="Flaws">
          {renderTwoColToggleList(FLAWS, selectedFlaws, setSelectedFlaws)}
        </Section>
      </ScrollView>

      {/* Sticky footer: Character Points + Save */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderTopWidth: 1,
          backgroundColor: "white",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontWeight: "700", fontSize: 16 }}>
          Character Points: {characterPoints}
        </Text>
        <Button title="Save" onPress={onSave} />
      </View>
    </KeyboardAvoidingView>
  );
}
