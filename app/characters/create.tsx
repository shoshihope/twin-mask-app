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

export default function CreateCharacter() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [bloodline, setBloodline] = useState<(typeof BLOODLINES)[number] | "">("");
  const [culture, setCulture] = useState<(typeof CULTURES)[number] | "">("");

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedFlaws, setSelectedFlaws] = useState<string[]>([]);

  // Filter visible skills by bloodline; unrestricted skills are always visible.
  const visibleSkills = useMemo(() => {
    const entries = Object.entries(SKILL_CATALOG) as [string, { label: string; allowedBloodlines?: readonly (typeof BLOODLINES[number])[] }][];
    if (!bloodline) return entries;
    return entries.filter(([_, v]) => !v.allowedBloodlines || v.allowedBloodlines.includes(bloodline));
  }, [bloodline]);

  // PRUNE invalid selected skills when bloodline changes (avoid setState during render)
  useEffect(() => {
    const allowed = new Set(visibleSkills.map(([k]) => k));
    setSelectedSkills((prev) => prev.filter((k) => allowed.has(k)));
  }, [visibleSkills]);

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

  const renderChipGrid = (
    items: Record<string, { label: string }>,
    selected: string[],
    setSelected: (next: string[]) => void
  ) => (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      {Object.entries(items).map(([key, { label }]) => {
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
      keyboardVerticalOffset={Platform.select({ ios: 80, android: 0 })} // adjust if header overlaps
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 48 }} // paddingBottom ensures last inputs aren't hidden
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
          {renderChipGrid(BACKGROUND_FEATURES, selectedFeatures, setSelectedFeatures)}
        </Section>

        {/* Skills (bloodline-aware) */}
        <Section title="Skills">
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {visibleSkills.map(([key, { label }]) => {
              const isSelected = selectedSkills.includes(key);
              return (
                <ToggleChip
                  key={key}
                  label={label}
                  selected={isSelected}
                  onPress={() =>
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
          {renderChipGrid(FLAWS, selectedFlaws, setSelectedFlaws)}
        </Section>

        <View style={{ height: 16 }} />
        <Button title="Save" onPress={onSave} />
        <View style={{ height: 24 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
