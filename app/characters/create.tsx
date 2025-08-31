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

const { BLOODLINES, CULTURES, SKILL_CATALOG, BACKGROUND_FEATURES, FLAWS } = Config;
const CANONICAL_CATS: string[] | undefined = Array.isArray((Config as any).SKILL_CATEGORIES)
  ? ((Config as any).SKILL_CATEGORIES as string[])
  : undefined;

const BLOODLINE_NEWBORN = "Newborn Dream";
const TETHERED_KEY = "Tethered";

// Magical tracks we want to group together
const MAGIC_TRACKS_ORDER = [
  "alchemy",
  "blood",
  "channeling",
  "divination",
  "dream",
  "necromancy",
  "sorcery",
  "summoning",
  "warding",
] as const;
type MagicTrack = (typeof MAGIC_TRACKS_ORDER)[number];

// Force these skills into "Other Magical Arts"
const MAGIC_FORCE_OTHER = new Set<string>(["arcane_tutelage", "spellwright", "elemental_flourish"]);

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function hasKey<T extends object>(obj: T, key: PropertyKey): key is keyof T {
  return key in obj;
}
function titleCase(word: string) {
  return word
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
function tierWeightFromKey(skillKey: string): number {
  if (skillKey.startsWith("apprentice_magic_")) return 0;
  if (skillKey.startsWith("journeyman_magic_")) return 1;
  if (skillKey.startsWith("master_magic_")) return 2;
  if (skillKey.startsWith("gmaster_magic_")) return 3;
  return 99;
}
// Derive a magic track for a given skill (within Magical Arts)
function getMagicTrackForSkill(skillKey: string, cfg: any): MagicTrack | "other" {
  if (MAGIC_FORCE_OTHER.has(skillKey)) return "other";
  const m = skillKey.match(/^(?:apprentice|journeyman|master|gmaster)_magic_([a-z_]+)/);
  if (m) {
    const track = m[1] as string;
    if ((MAGIC_TRACKS_ORDER as readonly string[]).includes(track)) return track as MagicTrack;
  }
  const tryArrays: any[] = [];
  if (cfg?.prereqAll) tryArrays.push(cfg.prereqAll);
  if (cfg?.prereqAny) tryArrays.push(cfg.prereqAny);
  if (cfg?.prereqCounts) tryArrays.push(cfg.prereqCounts.map((x: any) => x.key));
  if (cfg?.prereqAnyCounts) tryArrays.push(cfg.prereqAnyCounts.map((x: any) => x.key));

  for (const arr of tryArrays) {
    if (!Array.isArray(arr)) continue;
    for (const p of arr) {
      if (typeof p !== "string") continue;
      if ((MAGIC_TRACKS_ORDER as readonly string[]).includes(p)) return p as MagicTrack;
      const mm = p.match(/^(?:apprentice|journeyman|master|gmaster)_magic_([a-z_]+)/);
      if (mm) {
        const t = mm[1] as string;
        if ((MAGIC_TRACKS_ORDER as readonly string[]).includes(t)) return t as MagicTrack;
      }
    }
  }
  return "other";
}

function ToggleChip({
  label,
  selected,
  onPress,
  disabled,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={() => {
        if (!disabled) onPress();
      }}
      disabled={disabled}
      style={({ pressed }) => ({
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 999,
        borderWidth: 1,
        margin: 4,
        opacity: disabled ? 0.35 : pressed ? 0.7 : 1,
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

function CollapsibleBlock({
  title,
  rightText,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  rightText?: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: 8 }}>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 10,
          paddingHorizontal: 12,
          borderWidth: 1,
          borderRadius: 8,
          backgroundColor: "#dbeafe", // light blue
          borderColor: "#93c5fd",
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <Text style={{ fontWeight: "600" }}>{expanded ? "▼" : "▶"} {title}</Text>
        {rightText ? <Text style={{ fontSize: 12 }}>{rightText}</Text> : null}
      </Pressable>
      {expanded ? <View style={{ marginTop: 6 }}>{children}</View> : null}
    </View>
  );
}

// Stepper row (for stackable entries) — cost on the RIGHT of the + button
function StepperRow({
  label,
  cost,
  count,
  maxStacks,
  onInc,
  onDec,
  errorText,
  minCount = 0,
}: {
  label: string;
  cost?: number;
  count: number;
  maxStacks?: number;
  onInc: () => void;
  onDec: () => void;
  errorText?: string;
  minCount?: number;
}) {
  const costDisplay = Number.isFinite(cost) ? cost : 0;
  const hasError = !!errorText;
  const max = maxStacks === undefined ? 1 : (maxStacks as number);

  return (
    <View style={{ marginBottom: 6 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderRadius: 8,
          paddingVertical: 10,
          paddingHorizontal: 12,
          backgroundColor: hasError ? "#fff5f5" : "transparent",
          borderColor: hasError ? "red" : undefined,
        }}
      >
        {/* Left: label */}
        <Text style={{ flex: 1, fontSize: 15, color: hasError ? "red" : "black" }}>{label}</Text>

        {/* Middle: stepper */}
        <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 12 }}>
          <Pressable
            onPress={onDec}
            disabled={count <= minCount}
            style={({ pressed }) => ({
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderWidth: 1,
              borderRadius: 6,
              opacity: count <= minCount ? 0.3 : pressed ? 0.7 : 1,
              marginRight: 8,
            })}
          >
            <Text style={{ fontSize: 16 }}>−</Text>
          </Pressable>
          <Text style={{ width: 28, textAlign: "center", fontVariant: ["tabular-nums"] }}>
            {count}
          </Text>
          <Pressable
            onPress={onInc}
            disabled={count >= max}
            style={({ pressed }) => ({
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderWidth: 1,
              borderRadius: 6,
              opacity: count >= max ? 0.3 : pressed ? 0.7 : 1,
              marginLeft: 8,
            })}
          >
            <Text style={{ fontSize: 16 }}>+</Text>
          </Pressable>
        </View>

        {/* Right: cost */}
        <Text
          style={{
            width: 64,
            textAlign: "right",
            fontVariant: ["tabular-nums"],
            marginLeft: 12,
            color: hasError ? "red" : "black",
          }}
        >
          {costDisplay}
        </Text>
      </View>
      {hasError ? (
        <Text style={{ marginTop: 4, marginLeft: 8, color: "red", fontSize: 12 }}>{errorText}</Text>
      ) : null}
    </View>
  );
}

// Click-to-toggle row (for non-stackable entries)
function ToggleRow({
  label,
  cost,
  selected,
  onToggle,
  errorText,
}: {
  label: string;
  cost?: number;
  selected: boolean;
  onToggle: () => void;
  errorText?: string;
}) {
  const costDisplay = Number.isFinite(cost) ? cost : 0;
  const hasError = !!errorText && !selected;
  return (
    <View style={{ marginBottom: 6 }}>
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderRadius: 8,
          paddingVertical: 10,
          paddingHorizontal: 12,
          opacity: pressed ? 0.7 : 1,
          backgroundColor: selected ? "#e5e7eb" : "transparent",
          borderColor: hasError ? "red" : undefined,
        })}
      >
        <Text style={{ flex: 1, fontSize: 15, color: hasError ? "red" : "black" }}>{label}</Text>
        <Text
          style={{
            width: 64,
            textAlign: "right",
            fontVariant: ["tabular-nums"],
            color: hasError ? "red" : "black",
          }}
        >
          {costDisplay}
        </Text>
      </Pressable>
      {hasError ? (
        <Text style={{ marginTop: 4, marginLeft: 8, color: "red", fontSize: 12 }}>{errorText}</Text>
      ) : null}
    </View>
  );
}

export default function CreateCharacter() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [bloodline, setBloodline] = useState<(typeof BLOODLINES)[number] | "">("");

  // Multi-select cultures
  const [selectedCultures, setSelectedCultures] = useState<string[]>([]);
  const [culturesOpen, setCulturesOpen] = useState(true);

  // Background Features (non-stacking)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [featuresOpen, setFeaturesOpen] = useState(true);

  // Flaws with stacks
  const [flawStacks, setFlawStacks] = useState<Record<string, number>>({});
  const [flawsOpen, setFlawsOpen] = useState(true);

  // Skills with stacks
  const [skillStacks, setSkillStacks] = useState<Record<string, number>>({});

  // Per-skill validation errors
  const [skillErrors, setSkillErrors] = useState<Record<string, string>>({});

  // Character Points budget input
  const [cpInput, setCpInput] = useState<string>("0");
  const cpBudget = useMemo(() => {
    const sanitized = cpInput.replace(/[^\d-]/g, "");
    const parsed = parseInt(sanitized || "0", 10);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
  }, [cpInput]);

  // Collapsible categories (skills)
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());

  // helpers
  const getSkillCount = (k: string) => (hasKey(skillStacks, k) ? (skillStacks as any)[k] || 0 : 0);
  const getFlawCount = (k: string) => (hasKey(flawStacks, k) ? (flawStacks as any)[k] || 0 : 0);

  // ---- Visibility & grouping of skills by bloodline
  const visibleSkills = useMemo(() => {
    const entries = Object.entries(SKILL_CATALOG) as [
      string,
      {
        label: string;
        cost?: number;
        category?: string;
        maxStacks?: number;
        allowedBloodlines?: readonly (typeof BLOODLINES[number])[];
      }
    ][];
    if (!bloodline) return entries;
    return entries.filter(
      ([_, v]) => !v.allowedBloodlines || v.allowedBloodlines.includes(bloodline)
    );
  }, [bloodline]);

  const skillGroups = useMemo(() => {
    const groups = new Map<
      string,
      { key: string; label: string; cost?: number; maxStacks?: number }[]
    >();

    for (const [key, v] of visibleSkills) {
      const rawCat = v.category?.trim();
      const cat =
        rawCat && CANONICAL_CATS?.includes(rawCat) ? rawCat : rawCat || "Uncategorized";
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push({ key, label: v.label, cost: v.cost, maxStacks: v.maxStacks });
    }

    if (Array.isArray(CANONICAL_CATS) && CANONICAL_CATS.length) {
      const ordered: Array<[string, { key: string; label: string; cost?: number; maxStacks?: number }[]]> = [];
      for (const cat of CANONICAL_CATS) {
        if (groups.has(cat)) {
          ordered.push([cat, groups.get(cat)!]);
          groups.delete(cat);
        }
      }
      const leftover = Array.from(groups.entries());
      leftover.sort(([a], [b]) => {
        if (a === "Uncategorized") return 1;
        if (b === "Uncategorized") return -1;
        return a.localeCompare(b, undefined, { sensitivity: "base" });
      });
      return [...ordered, ...leftover];
    } else {
      return Array.from(groups.entries()).sort(([a], [b]) => {
        if (a === "Uncategorized") return 1;
        if (b === "Uncategorized") return -1;
        return a.localeCompare(b, undefined, { sensitivity: "base" });
      });
    }
  }, [visibleSkills]);

  // ---- Enforce & prune based on bloodline
  useEffect(() => {
    // prune skills not allowed by bloodline
    const allowedSkills = new Set(visibleSkills.map(([k]) => k));
    setSkillStacks((prev) => {
      const next: Record<string, number> = {};
      for (const [k, c] of Object.entries(prev)) if (allowedSkills.has(k) && c > 0) next[k] = c;
      return next;
    });
    setSkillErrors((prev) => {
      const next = { ...prev };
      for (const k of Object.keys(next)) if (!allowedSkills.has(k)) delete next[k];
      return next;
    });

    // Tethered handling
    setFlawStacks((prev) => {
      const curr = { ...prev };
      if (bloodline === BLOODLINE_NEWBORN) {
        // ensure at least 1 stack of Tethered
        curr[TETHERED_KEY] = Math.max(1, curr[TETHERED_KEY] || 0);
      } else {
        // remove Tethered if not Newborn Dream
        if (hasKey(curr, TETHERED_KEY)) {
          delete curr[TETHERED_KEY];
        }
      }
      return curr;
    });

    // Cultures: Newborn Dream cannot have cultures; clear any selection
    if (bloodline === BLOODLINE_NEWBORN) {
      setSelectedCultures([]);
    }
  }, [visibleSkills, bloodline]);

  // ---- Subtotals
  const skillsSubtotal = useMemo(() => {
    let sum = 0;
    for (const [key, count] of Object.entries(skillStacks)) {
      if (count <= 0) continue;
      const cost =
        hasKey(SKILL_CATALOG, key) && typeof SKILL_CATALOG[key].cost === "number"
          ? (SKILL_CATALOG[key].cost as number)
          : 0;
      sum += cost * count;
    }
    return sum;
  }, [skillStacks]);

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

  // Flaw benefits
  const flawRawBenefit = useMemo(() => {
    let benefit = 0;
    for (const [key, count] of Object.entries(flawStacks)) {
      if (count <= 0) continue;
      const def = hasKey(FLAWS, key) ? FLAWS[key] : undefined;
      if (!def || typeof def.cost !== "number") continue;
      if (def.cost < 0) benefit += -def.cost * count;
    }
    return benefit;
  }, [flawStacks]);

  // Flaw benefit (capped at 10)
  const flawBenefitCapped = Math.min(flawRawBenefit, 10);

  // Multi-culture penalty: 4 per culture beyond the first
  const extraCultures = Math.max(0, selectedCultures.length - 1);
  const multiCulturePenalty = extraCultures * 4;

  // Points Left
  const pointsLeft =
    cpBudget - skillsSubtotal - featuresSubtotal + flawBenefitCapped - multiCulturePenalty;

  // Auto-expand categories with any selected skills
  useEffect(() => {
    const catsWithSelected = new Set<string>();
    for (const [category, items] of skillGroups) {
      if (items.some(({ key }) => getSkillCount(key) > 0)) catsWithSelected.add(category);
    }
    if (catsWithSelected.size) {
      setExpandedCats((prev) => {
        const next = new Set(prev);
        catsWithSelected.forEach((c) => next.add(c));
        return next;
      });
    }
  }, [skillGroups, skillStacks]);

  // ---- Prereq helpers (skills)
  const getSkillLabel = (k: string) =>
    hasKey(SKILL_CATALOG, k) ? (SKILL_CATALOG[k].label || k) : k;

  const getFeatureLabel = (k: string) =>
    hasKey(BACKGROUND_FEATURES, k) ? (BACKGROUND_FEATURES[k].label || k) : k;

  const currentSkillCount = (k: string) =>
    hasKey(skillStacks, k) ? (skillStacks as any)[k] || 0 : 0;

  const unmetPrereqsForSkill = (skillKey: string): string[] => {
    if (!hasKey(SKILL_CATALOG, skillKey)) return ["Unknown skill."];
    const cfg = SKILL_CATALOG[skillKey];

    const missing: string[] = [];

    // Bloodline restriction
    if (cfg.allowedBloodlines && cfg.allowedBloodlines.length) {
      if (!bloodline) {
        missing.push("Choose a bloodline first.");
      } else if (!cfg.allowedBloodlines.includes(bloodline)) {
        const list = cfg.allowedBloodlines.join(" or ");
        missing.push(`Requires bloodline: ${list}`);
      }
    }

    // Background features: all required
    if (cfg.prereqBackgroundAll && cfg.prereqBackgroundAll.length) {
      for (const feat of cfg.prereqBackgroundAll as string[]) {
        if (!selectedFeatures.includes(feat)) {
          missing.push(`Background Feature: ${getFeatureLabel(feat)}`);
        }
      }
    }

    // Skills: all required (at least 1 stack)
    if (cfg.prereqAll && cfg.prereqAll.length) {
      for (const pre of cfg.prereqAll as string[]) {
        if (currentSkillCount(pre) < 1) {
          missing.push(`Skill: ${getSkillLabel(pre)}`);
        }
      }
    }

    // Skills: any-of
    if (cfg.prereqAny && cfg.prereqAny.length) {
      const satisfied = (cfg.prereqAny as string[]).some((k) => currentSkillCount(k) >= 1);
      if (!satisfied) {
        const names = (cfg.prereqAny as string[]).map(getSkillLabel).join(" or ");
        missing.push(`One of: ${names}`);
      }
    }

    // Required stack counts (ALL)
    if (cfg.prereqCounts && cfg.prereqCounts.length) {
      for (const { key, count } of cfg.prereqCounts as { key: string; count: number }[]) {
        const have = currentSkillCount(key);
        if (have < count) {
          missing.push(`Stacks: ${getSkillLabel(key)} ×${count} (have ${have})`);
        }
      }
    }

    // Any-of counts (at least one meets its count)
    if (cfg.prereqAnyCounts && cfg.prereqAnyCounts.length) {
      const satisfied = (cfg.prereqAnyCounts as { key: string; count: number }[]).some(
        ({ key, count }) => currentSkillCount(key) >= count
      );
      if (!satisfied) {
        const list = (cfg.prereqAnyCounts as { key: string; count: number }[])
          .map(({ key, count }) => `${getSkillLabel(key)} ×${count}`)
          .join(" or ");
        missing.push(`Any of: ${list}`);
      }
    }

    return missing;
  };

  // ---- Skill increment/decrement + toggle (default max=1)
  const incrementSkill = (key: string) => {
    if (!bloodline) {
      setSkillErrors((prev) => ({ ...prev, [key]: "Choose a bloodline first." }));
      return;
    }
    if (!hasKey(SKILL_CATALOG, key)) return;

    const cfg = SKILL_CATALOG[key];
    const current = getSkillCount(key);
    const max = cfg.maxStacks === undefined ? 1 : (cfg.maxStacks as number);

    if (current >= max) {
      setSkillErrors((prev) => ({
        ...prev,
        [key]: `Max stacks reached (${Number.isFinite(max) ? max : "∞"}).`,
      }));
      return;
    }

    const missing = unmetPrereqsForSkill(key);
    if (missing.length) {
      setSkillErrors((prev) => ({
        ...prev,
        [key]: `Missing prerequisite(s): ${missing.join("; ")}`,
      }));
      return;
    }

    setSkillStacks((prev) => ({ ...prev, [key]: current + 1 }));
    setSkillErrors((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const decrementSkill = (key: string) => {
    const curr = getSkillCount(key);
    if (curr <= 0) return;
    const next = curr - 1;
    setSkillStacks((prev) => {
      const copy = { ...prev };
      if (next <= 0) delete copy[key];
      else copy[key] = next;
      return copy;
    });
    setSkillErrors((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const toggleSingleSkill = (key: string) => {
    const selected = getSkillCount(key) > 0;

    if (selected) {
      setSkillStacks((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
      setSkillErrors((prev) => {
        const { [key]: _, ...rest } = prev;
        return rest;
      });
      return;
    }

    if (!bloodline) {
      setSkillErrors((prev) => ({ ...prev, [key]: "Choose a bloodline first." }));
      return;
    }
    const missing = unmetPrereqsForSkill(key);
    if (missing.length) {
      setSkillErrors((prev) => ({
        ...prev,
        [key]: `Missing prerequisite(s): ${missing.join("; ")}`,
      }));
      return;
    }

    setSkillStacks((prev) => ({ ...prev, [key]: 1 }));
    setSkillErrors((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  // ---- Save
  const onSave = async () => {
    if (!name.trim()) {
      Alert.alert("Please enter a name");
      return;
    }
    if (!bloodline || !BLOODLINES.includes(bloodline)) {
      Alert.alert("Please pick a valid bloodline");
      return;
    }
    // Enforce required Tethered for Newborn Dream
    if (bloodline === BLOODLINE_NEWBORN) {
      if (!getFlawCount(TETHERED_KEY)) {
        Alert.alert(`"${TETHERED_KEY}" is required for ${BLOODLINE_NEWBORN}.`);
        return;
      }
    }

    const now = new Date().toISOString();
    const distinctSkills = Object.entries(skillStacks)
      .filter(([, c]) => c > 0)
      .map(([k]) => k);
    const distinctFlaws = Object.entries(flawStacks)
      .filter(([, c]) => c > 0)
      .map(([k]) => k);

    await saveCharacter({
      id: uid(),
      name: name.trim(),
      bloodline,
      cultures: selectedCultures,
      backgroundFeatures: selectedFeatures,
      skills: distinctSkills,
      skillStacks,
      flaws: distinctFlaws,
      flawStacks,
      characterPointsBudget: cpBudget,
      createdAt: now,
      updatedAt: now,
    } as any);
    router.replace("/characters");
  };

  // Render helper: Background Features (non-stacking)
  const renderTwoColToggleList = (
    catalog: Record<string, { label: string; cost?: number }>,
    selected: string[],
    setSelected: (next: string[]) => void
  ) => (
    <View>
      {Object.entries(catalog).map(([key, { label, cost }]) => {
        const isSelected = selected.includes(key);
        return (
          <ToggleRow
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

  // UI helpers
  const toggleCategory = (cat: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };
  const selectedCountInCategory = (items: { key: string }[]) =>
    items.reduce((acc, it) => acc + (getSkillCount(it.key) > 0 ? 1 : 0), 0);

  // Magical Arts subgroup renderer (Mana Focus at top without header)
  const renderMagicalArtsGrouped = (
    items: { key: string; label: string; cost?: number; maxStacks?: number }[]
  ) => {
    // Pull out Mana Focus, render first without subheader
    const mana = items.find((i) => i.key === "mana_focus");
    const rest = items.filter((i) => i.key !== "mana_focus");

    // Group remaining by track
    const byTrack = new Map<string, typeof rest>();
    for (const it of rest) {
      const cfg = hasKey(SKILL_CATALOG, it.key) ? SKILL_CATALOG[it.key] : undefined;
      const track = getMagicTrackForSkill(it.key, cfg) || "other";
      if (!byTrack.has(track)) byTrack.set(track, []);
      byTrack.get(track)!.push(it);
    }

    // Order tracks per MAGIC_TRACKS_ORDER; "other" last, then any remaining alphabetically
    const trackOrder: string[] = [];
    for (const t of MAGIC_TRACKS_ORDER) if (byTrack.has(t)) trackOrder.push(t);
    const leftovers: string[] = [];
    for (const t of byTrack.keys()) {
      if (!MAGIC_TRACKS_ORDER.includes(t as MagicTrack) && t !== "other") leftovers.push(t);
    }
    leftovers.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
    if (byTrack.has("other")) leftovers.push("other");
    const finalOrder = [...trackOrder, ...leftovers];

    return (
      <View style={{ marginTop: 6 }}>
        {/* Mana Focus (no header) */}
        {mana ? (
          (() => {
            const count = getSkillCount(mana.key);
            const effectiveMax =
              mana.maxStacks === undefined ? 1 : (mana.maxStacks as number);
            return effectiveMax === 1 ? (
              <ToggleRow
                key={mana.key}
                label={mana.label}
                cost={mana.cost}
                selected={count > 0}
                errorText={skillErrors[mana.key]}
                onToggle={() => toggleSingleSkill(mana.key)}
              />
            ) : (
              <StepperRow
                key={mana.key}
                label={mana.label}
                cost={mana.cost}
                count={count}
                maxStacks={effectiveMax}
                errorText={skillErrors[mana.key]}
                onInc={() => incrementSkill(mana.key)}
                onDec={() => decrementSkill(mana.key)}
              />
            );
          })()
        ) : null}

        {/* Tracks */}
        {finalOrder.map((track) => {
          const list = byTrack.get(track)!;
          // Sort within track: tier order, then label
          list.sort((a, b) => {
            const wa = tierWeightFromKey(a.key);
            const wb = tierWeightFromKey(b.key);
            if (wa !== wb) return wa - wb;
            return a.label.localeCompare(b.label, undefined, { sensitivity: "base" });
          });
          const trackTitle = track === "other" ? "Other Magical Arts" : titleCase(track);
          return (
            <View key={track} style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: "600", marginBottom: 6 }}>{trackTitle}</Text>
              {list.map(({ key, label, cost, maxStacks }) => {
                const count = getSkillCount(key);
                const effectiveMax = maxStacks === undefined ? 1 : (maxStacks as number);

                if (effectiveMax === 1) {
                  return (
                    <ToggleRow
                      key={key}
                      label={label}
                      cost={cost}
                      selected={count > 0}
                      errorText={skillErrors[key]}
                      onToggle={() => toggleSingleSkill(key)}
                    />
                  );
                }

                return (
                  <StepperRow
                    key={key}
                    label={label}
                    cost={cost}
                    count={count}
                    maxStacks={effectiveMax}
                    errorText={skillErrors[key]}
                    onInc={() => incrementSkill(key)}
                    onDec={() => decrementSkill(key)}
                  />
                );
              })}
            </View>
          );
        })}
      </View>
    );
  };

  // Flaw "selected" distinct count (for header)
  const flawDistinctSelected = useMemo(
    () => Object.values(flawStacks).filter((c) => c > 0).length,
    [flawStacks]
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
      keyboardVerticalOffset={Platform.select({ ios: 80, android: 0 })}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 200 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>New Character</Text>

        {/* Character Points (budget) */}
        <Section title="Character Points (Budget)">
          <TextInput
            value={cpInput}
            onChangeText={setCpInput}
            keyboardType={Platform.select({ ios: "number-pad", android: "numeric" })}
            placeholder="Enter your total character points"
            style={{ borderWidth: 1, borderRadius: 8, padding: 10 }}
          />
          <Text style={{ marginTop: 6, fontStyle: "italic" }}>
            Flaw benefit is capped at 10 CP. Multi-culture penalty applies (−4 per extra).
          </Text>
        </Section>

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

        {/* Bloodline (required, single-select) */}
        <Section title="Bloodline">
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {BLOODLINES.map((b) => {
              const isSelected = bloodline === b;
              return (
                <Pressable
                  key={b}
                  onPress={() => setBloodline(b)}
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
          {bloodline === BLOODLINE_NEWBORN ? (
            <Text style={{ marginTop: 6, fontStyle: "italic" }}>
              As {BLOODLINE_NEWBORN}, the flaw “{TETHERED_KEY}” is required, and cultures are disabled.
            </Text>
          ) : null}
        </Section>

        {/* Cultures (multi-select, collapsible, disabled for Newborn Dream) */}
        <CollapsibleBlock
          title="Cultures"
          rightText={`${selectedCultures.length}/${CULTURES.length} selected`}
          expanded={culturesOpen}
          onToggle={() => setCulturesOpen((v) => !v)}
        >
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {CULTURES.map((c) => {
              const isSelected = selectedCultures.includes(c);
              const disabled = bloodline === BLOODLINE_NEWBORN;
              return (
                <ToggleChip
                  key={c}
                  label={c}
                  selected={isSelected}
                  disabled={disabled}
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
          {bloodline === BLOODLINE_NEWBORN ? (
            <Text style={{ marginTop: 6, color: "red" }}>
              Newborn Dream characters may not select cultures.
            </Text>
          ) : extraCultures > 0 ? (
            <Text style={{ marginTop: 6, fontStyle: "italic" }}>
              Multi-culture penalty applied: −{multiCulturePenalty} ({extraCultures} extra)
            </Text>
          ) : null}
        </CollapsibleBlock>

        {/* Background Features (non-stacking, collapsible) */}
        <CollapsibleBlock
          title="Background Features"
          rightText={`${selectedFeatures.length}/${Object.keys(BACKGROUND_FEATURES).length} selected`}
          expanded={featuresOpen}
          onToggle={() => setFeaturesOpen((v) => !v)}
        >
          {renderTwoColToggleList(BACKGROUND_FEATURES, selectedFeatures, setSelectedFeatures)}
        </CollapsibleBlock>

        {/* Flaws (collapsible). Hide Tethered unless Newborn Dream; require min 1 if Newborn Dream; don't show "benefits capped" unless raw benefit >= 10 */}
        <CollapsibleBlock
          title="Flaws"
          rightText={`${flawDistinctSelected}/${Object.keys(FLAWS).length}${
            flawRawBenefit >= 10 ? " • benefits capped" : ""
          }`}
          expanded={flawsOpen}
          onToggle={() => setFlawsOpen((v) => !v)}
        >
          <View>
            {Object.entries(FLAWS).map(([key, def]) => {
              if (key === TETHERED_KEY && bloodline !== BLOODLINE_NEWBORN) {
                return null; // hide Tethered unless Newborn Dream
              }
              const count = getFlawCount(key);
              const effectiveMax = def.maxStacks === undefined ? 1 : (def.maxStacks as number);

              if (effectiveMax === 1) {
                return (
                  <ToggleRow
                    key={key}
                    label={def.label}
                    cost={def.cost}
                    selected={count > 0}
                    onToggle={() => {
                      // Prevent deselecting Tethered for Newborn Dream
                      if (
                        bloodline === BLOODLINE_NEWBORN &&
                        key === TETHERED_KEY &&
                        count > 0
                      ) {
                        return;
                      }
                      setFlawStacks((prev) => {
                        const curr = prev[key] || 0;
                        const next = curr > 0 ? 0 : 1;
                        const copy = { ...prev };
                        if (next <= 0) delete copy[key];
                        else copy[key] = next;
                        return copy;
                      });
                    }}
                  />
                );
              }

              const minCount = bloodline === BLOODLINE_NEWBORN && key === TETHERED_KEY ? 1 : 0;
              return (
                <StepperRow
                  key={key}
                  label={def.label}
                  cost={def.cost}
                  count={count}
                  maxStacks={effectiveMax}
                  minCount={minCount}
                  onInc={() =>
                    setFlawStacks((prev) => {
                      const curr = prev[key] || 0;
                      if (curr >= effectiveMax) return prev;
                      return { ...prev, [key]: curr + 1 };
                    })
                  }
                  onDec={() =>
                    setFlawStacks((prev) => {
                      const curr = prev[key] || 0;
                      if (curr <= minCount) return prev; // enforce min
                      const copy = { ...prev };
                      if (curr - 1 <= 0) delete copy[key];
                      else copy[key] = curr - 1;
                      return copy;
                    })
                  }
                />
              );
            })}
          </View>
          <Text style={{ marginTop: 6, fontStyle: "italic" }}>
            Negative CP from flaws is capped at −10 total benefit.
          </Text>
        </CollapsibleBlock>

        {/* Skills (collapsible, category groups; Magical Arts grouped by track; Mana Focus at top) */}
        <Section title="Skills">
          <View>
            {skillGroups.map(([category, items]) => {
              const expanded = expandedCats.has(category);
              const selCount = selectedCountInCategory(items);
              const isMagical = category === "The Magical Arts";

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
                      backgroundColor: "#dbeafe", // light blue
                      borderColor: "#93c5fd",
                      opacity: pressed ? 0.85 : 1,
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
                    isMagical ? (
                      renderMagicalArtsGrouped(items)
                    ) : (
                      <View style={{ marginTop: 6 }}>
                        {items.map(({ key, label, cost, maxStacks }) => {
                          const count = getSkillCount(key);
                          const effectiveMax = maxStacks === undefined ? 1 : (maxStacks as number);

                          if (effectiveMax === 1) {
                            return (
                              <ToggleRow
                                key={key}
                                label={label}
                                cost={cost}
                                selected={count > 0}
                                errorText={skillErrors[key]}
                                onToggle={() => toggleSingleSkill(key)}
                              />
                            );
                          }

                          return (
                            <StepperRow
                              key={key}
                              label={label}
                              cost={cost}
                              count={count}
                              maxStacks={effectiveMax}
                              errorText={skillErrors[key]}
                              onInc={() => incrementSkill(key)}
                              onDec={() => decrementSkill(key)}
                            />
                          );
                        })}
                      </View>
                    )
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
      </ScrollView>

      {/* Sticky footer */}
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
        <Text
          style={{
            fontWeight: "700",
            fontSize: 16,
            color: pointsLeft < 0 ? "red" : "black",
          }}
        >
          Points Left: {pointsLeft}
        </Text>
        <Button title="Save" onPress={onSave} />
      </View>
    </KeyboardAvoidingView>
  );
}
