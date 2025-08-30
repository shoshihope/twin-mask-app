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
import * as Config from "../../lib/characters/config";
import { saveCharacter } from "../../lib/storage/characters";

// Pull what we need; SKILL_CATEGORIES might not exist in config
const { BLOODLINES, CULTURES, SKILL_CATALOG, BACKGROUND_FEATURES, FLAWS } = Config;
const CANONICAL_CATS: string[] | undefined = Array.isArray((Config as any).SKILL_CATEGORIES)
  ? ((Config as any).SKILL_CATEGORIES as string[])
  : undefined;

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

  // MULTI-SELECT cultures
  const [selectedCultures, setSelectedCultures] = useState<string[]>([]);

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedFlaws, setSelectedFlaws] = useState<string[]>([]);

  // Collapsed/expanded state per skill category
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());

  // Filter visible skills by bloodline; unrestricted skills are always visible.
  const visibleSkills = useMemo(() => {
    const entries = Object.entries(SKILL_CATALOG) as [
      string,
      {
        label: string;
        cost?: number;
        category?: string;
        allowedBloodlines?: readonly (typeof BLOODLINES[number])[];
      }
    ][];
    if (!bloodline) return entries;
    return entries.filter(
      ([_, v]) => !v.allowedBloodlines || v.allowedBloodlines.includes(bloodline)
    );
  }, [bloodline]);

  // Group visible skills by category (respect canonical order if present)
  const skillGroups = useMemo(() => {
    const groups = new Map<string, { key: string; label: string; cost?: number }[]>();

    for (const [key, v] of visibleSkills) {
      const rawCat = v.category?.trim();
      const cat =
        rawCat && CANONICAL_CATS?.includes(rawCat) ? rawCat : rawCat || "Uncategorized";
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push({ key, label: v.label, cost: v.cost });
    }

    if (Array.isArray(CANONICAL_CATS) && CANONICAL_CATS.length) {
      const ordered: Array<[string, { key: string; label: string; cost?: number }[]]> = [];
      for (const cat of CANONICAL_CATS) {
        if (groups.has(cat)) {
          ordered.push([cat, groups.get(cat)!]);
          groups.delete(cat);
        }
      }
      // leftovers (unknowns + maybe "Uncategorized")
      const leftover = Array.from(groups.entries());
      leftover.sort(([a], [b]) => {
        if (a === "Uncategorized") return 1;
        if (b === "Uncategorized") return -1;
        return a.localeCompare(b, undefined, { sensitivity: "base" });
      });
      return [...ordered, ...leftover];
    } else {
      // alphabetical fallback with "Uncategorized" last
      return Array.from(groups.entries()).sort(([a], [b]) => {
        if (a === "Uncategorized") return 1;
        if (b === "Uncategorized") return -1;
        return a.localeCompare(b, undefined, { sensitivity: "base" });
      });
    }
  }, [visibleSkills]);

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

  // Auto-expand categories that have any selected skills.
  // We ONLY add categories to the expanded set; we do not auto-collapse.
  useEffect(() => {
    const catsWithSelected = new Set<string>();
    for (const [category, items] of skillGroups) {
      if (items.some(({ key }) => selectedSkills.includes(key))) {
        catsWithSelected.add(category);
      }
    }
    if (catsWithSelected.size) {
      setExpandedCats((prev) => {
        const next = new Set(prev);
        catsWithSelected.forEach((c) => next.add(c));
        return next;
      });
    }
  }, [skillGroups, selectedSkills]);

  const onSave = async () => {
    if (!name.trim()) {
      Alert.alert("Please enter a name");
      return;
    }
    // REQUIRED single-select bloodline (exactly one must be chosen)
    if (!bloodline || !BLOODLINES.includes(bloodline)) {
      Alert.alert("Please pick a valid bloodline");
      return;
    }
    const now = new Date().toISOString();
    await saveCharacter({
      id: uid(),
      name: name.trim(),
      bloodline,
      cultures: selectedCultures, // multi-select cultures
      backgroundFeatures: selectedFeatures,
      skills: selectedSkills,
      flaws: selectedFlaws,
      createdAt: now,
      updatedAt: now,
    } as any); // remove `as any` once Character type includes `cultures?: string[]`
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

  // Toggle a skill category open/closed
  const toggleCategory = (cat: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  // Count selected skills in a category (to show in header)
  const selectedCountInCategory = (items: { key: string }[]) =>
    items.reduce((acc, it) => acc + (selectedSkills.includes(it.key) ? 1 : 0), 0);

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

        {/* Bloodline (required, single-select; cannot unselect by tapping again) */}
        <Section title="Bloodline">
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {BLOODLINES.map((b) => {
              const isSelected = bloodline === b;
              return (
                <Pressable
                  key={b}
                  onPress={() => setBloodline(b)} // always set; never clear to ""
                  style={({ pressed }) => ({
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 999,
                    borderWidth: 1,
                    margin: 4,
                    opacity: pressed ? 0.7 : 1,
                    backgroundColor: isSelected ? "#ddd" : "transparent",
                  })}
                >
                  <Text>{b}</Text>
                </Pressable>
              );
            })}
          </View>
          {!bloodline ? (
            <Text style={{ marginTop: 6, color: "red" }}>You must choose a bloodline.</Text>
          ) : null}
        </Section>

        {/* Cultures (multi-select) */}
        <Section title="Cultures">
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {CULTURES.map((c) => {
              const isSelected = selectedCultures.includes(c);
              return (
                <ToggleChip
                  key={c}
                  label={c}
                  selected={isSelected}
                  onPress={() =>
                    setSelectedCultures(
                      isSelected
                        ? selectedCultures.filter((k) => k !== c)
                        : [...selectedCultures, c]
                    )
                  }
                />
              );
            })}
          </View>
        </Section>

        {/* Background Features (two-column rows) */}
        <Section title="Background Features">
          {renderTwoColToggleList(BACKGROUND_FEATURES, selectedFeatures, setSelectedFeatures)}
        </Section>

        {/* Skills grouped by (optional) canonical category order - COLLAPSIBLE */}
        <Section title="Skills">
          <View>
            {skillGroups.map(([category, items]) => {
              const expanded = expandedCats.has(category);
              const selCount = selectedCountInCategory(items);
              return (
                <View key={category} style={{ marginBottom: 8 }}>
                  <Pressable
                    onPress={() => toggleCategory(category)}
                    accessibilityRole="button"
                    style={({ pressed }) => ({
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderWidth: 1,
                      borderRadius: 8,
                      backgroundColor: "#f7f7f7",
                      opacity: pressed ? 0.7 : 1,
                    })}
                  >
                    <Text style={{ fontWeight: "600" }}>
                      {expanded ? "▼" : "▶"} {category}
                    </Text>
                    <Text style={{ fontSize: 12 }}>
                      {selCount}/{items.length} selected
                    </Text>
                  </Pressable>

                  {expanded ? (
                    <View style={{ marginTop: 6 }}>
                      {items.map(({ key, label, cost }) => {
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
                  ) : null}
                </View>
              );
            })}
          </View>
          {!bloodline ? (
            <Text style={{ marginTop: 6, fontStyle: "italic" }}>
              Select a bloodline to see bloodline-restricted skills.
            </Text>
          ) : null}
        </Section>

        {/* Flaws (two-column rows) */}
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
