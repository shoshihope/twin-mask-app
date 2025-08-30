// lib/characters/compute.ts
import {
    BACKGROUND_FEATURES, type BackgroundFeatureKey,
    FLAWS, type FlawKey,
    SKILL_CATALOG, type SkillKey,
} from "./config";
import type { Character } from "./schema";

/** ------ Types your creator will pass in (key -> count) ------ */
export type Counts<K extends string> = Partial<Record<K, number>>;

export type CreatorInputs = {
  name: string;
  bloodline?: string;
  culture?: string;
  hp?: string; // user entry (optional)

  // counts (so we can support once-only, capped, unlimited)
  background_counts: Counts<BackgroundFeatureKey>;
  skill_counts: Counts<SkillKey>;
  flaw_counts: Counts<FlawKey>;

  // If you later allow picking extra blooded skills:
  // blooded_override_counts?: Counts<BloodedSkillKey>;
};

/** ------ Small helpers ------ */
const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

const getMaxBG = (k: BackgroundFeatureKey) => BACKGROUND_FEATURES[k].maxStacks ?? 1;
const getMaxSkill = (k: SkillKey) => SKILL_CATALOG[k].maxStacks ?? 1;
const getMaxFlaw = (k: FlawKey) => FLAWS[k].maxStacks ?? 1;

const hasCount = <K extends string>(counts: Counts<K>, k: K) => (counts[k] ?? 0) > 0;

/** ------ Prerequisite checking (AND / OR) for SKILLS only ------ */
export type PrereqIssue = {
  key: SkillKey;
  missingAll: SkillKey[];         // AND prereqs not present
  missingAny: SkillKey[];         // none of these OR options are present
};

export function unmetPrereqsForSkill(skillCounts: Counts<SkillKey>, key: SkillKey): PrereqIssue | null {
  const s = SKILL_CATALOG[key];
  const missingAll = (s.prereqAll ?? []).filter(req => !hasCount(skillCounts, req));
  const any = s.prereqAny ?? [];
  const anyOk = any.length === 0 ? true : any.some(req => hasCount(skillCounts, req));
  const missingAny = anyOk ? [] : any;
  if (missingAll.length === 0 && missingAny.length === 0) return null;
  return { key, missingAll, missingAny };
}

/** ------ Stack validation (caps) ------ */
export type StackIssue =
  | { kind: "background"; key: BackgroundFeatureKey; count: number; max: number }
  | { kind: "skill"; key: SkillKey; count: number; max: number }
  | { kind: "flaw"; key: FlawKey; count: number; max: number };

export function validateStacks(inputs: CreatorInputs): StackIssue[] {
  const issues: StackIssue[] = [];

  (Object.keys(inputs.background_counts) as BackgroundFeatureKey[]).forEach(k => {
    const n = inputs.background_counts[k] ?? 0;
    const max = getMaxBG(k);
    if (n > max) issues.push({ kind: "background", key: k, count: n, max });
  });

  (Object.keys(inputs.skill_counts) as SkillKey[]).forEach(k => {
    const n = inputs.skill_counts[k] ?? 0;
    const max = getMaxSkill(k);
    if (n > max) issues.push({ kind: "skill", key: k, count: n, max });
  });

  (Object.keys(inputs.flaw_counts) as FlawKey[]).forEach(k => {
    const n = inputs.flaw_counts[k] ?? 0;
    const max = getMaxFlaw(k);
    if (n > max) issues.push({ kind: "flaw", key: k, count: n, max });
  });

  return issues;
}

export function validatePrereqs(inputs: CreatorInputs): PrereqIssue[] {
  const issues: PrereqIssue[] = [];
  (Object.keys(inputs.skill_counts) as SkillKey[]).forEach(k => {
    if ((inputs.skill_counts[k] ?? 0) > 0) {
      const prob = unmetPrereqsForSkill(inputs.skill_counts, k);
      if (prob) issues.push(prob);
    }
  });
  return issues;
}

/** ------ Convert counts → label arrays (matches your schema.ts) ------ */
function repeat<T>(t: T, times: number): T[] {
  const out: T[] = [];
  for (let i = 0; i < times; i++) out.push(t);
  return out;
}

export function backgroundCountsToLabels(counts: Counts<BackgroundFeatureKey>): string[] {
  const out: string[] = [];
  (Object.keys(counts) as BackgroundFeatureKey[]).forEach(k => {
    const n = clamp(counts[k] ?? 0, 0, getMaxBG(k));
    out.push(...repeat(BACKGROUND_FEATURES[k].label, n));
  });
  return out;
}

export function skillCountsToLabels(counts: Counts<SkillKey>): string[] {
  const out: string[] = [];
  (Object.keys(counts) as SkillKey[]).forEach(k => {
    const n = clamp(counts[k] ?? 0, 0, getMaxSkill(k));
    out.push(...repeat(SKILL_CATALOG[k].label, n));
  });
  return out;
}

export function flawCountsToLabels(counts: Counts<FlawKey>): string[] {
  const out: string[] = [];
  (Object.keys(counts) as FlawKey[]).forEach(k => {
    const n = clamp(counts[k] ?? 0, 0, getMaxFlaw(k));
    out.push(...repeat(FLAWS[k].label, n));
  });
  return out;
}

/** ------ Build a Character object (labels only) ------ */
export type BuildResult =
  | { ok: true; character: Omit<Character, "id" | "createdAt"> }
  | { ok: false; stackIssues: StackIssue[]; prereqIssues: PrereqIssue[] };

export function buildCharacter(inputs: CreatorInputs): BuildResult {
  // Validate
  const stackIssues = validateStacks(inputs);
  const prereqIssues = validatePrereqs(inputs);

  if (stackIssues.length || prereqIssues.length) {
    return { ok: false, stackIssues, prereqIssues };
  }

  const backgound_features = backgroundCountsToLabels(inputs.background_counts);
  const skills             = skillCountsToLabels(inputs.skill_counts);
  const flaws              = flawCountsToLabels(inputs.flaw_counts);

  // Later, when you add blooded catalogs:
  // const autoBloodedKeys: BloodedSkillKey[] = BLOODED_SKILLS_BY_BLOODLINE[inputs.bloodline ?? ""] || [];
  // const blooded_skills = autoBloodedKeys.map(k => BLOODED_SKILL_CATALOG[k].label);
  const blooded_skills: string[] = [];

  const c: Omit<Character, "id" | "createdAt"> = {
    name: inputs.name.trim(),
    bloodline: inputs.bloodline || undefined,
    culture: inputs.culture || undefined,
    hp: inputs.hp && inputs.hp.trim() !== "" ? Number(inputs.hp) : undefined,

    // keep exact field spelling from your schema
    backgound_features,
    skills,
    blooded_skills,
    flaws,
  };

  return { ok: true, character: c };
}

/** ------ Cost maps (label → cost) ------ */
const BG_LABEL_COST: Record<string, number> = Object.values(BACKGROUND_FEATURES)
  .reduce((m, v) => (m[v.label] = v.cost, m), {} as Record<string, number>);

const SKILL_LABEL_COST: Record<string, number> = Object.values(SKILL_CATALOG)
  .reduce((m, v) => (m[v.label] = v.cost, m), {} as Record<string, number>);

const FLAW_LABEL_COST: Record<string, number> = Object.values(FLAWS)
  .reduce((m, v) => (m[v.label] = v.cost, m), {} as Record<string, number>);

/** ------ Cost helpers (from saved labels) ------ */
export function costOfBackgroundFeaturesFromLabels(labels: string[]): number {
  return labels.reduce((sum, label) => sum + (BG_LABEL_COST[label] ?? 0), 0);
}

export function costOfSkillsFromLabels(labels: string[]): number {
  return labels.reduce((sum, label) => sum + (SKILL_LABEL_COST[label] ?? 0), 0);
}

export function costOfFlawsFromLabels(labels: string[]): number {
  return labels.reduce((sum, label) => sum + (FLAW_LABEL_COST[label] ?? 0), 0);
}

export function totalCostFromCharacter(c: Character): number {
  return (
    costOfBackgroundFeaturesFromLabels(c.backgound_features) +
    costOfSkillsFromLabels(c.skills) +
    // When you add blooded catalogs, include them similarly:
    // costOfBloodedFromLabels(c.blooded_skills) +
    costOfFlawsFromLabels(c.flaws)
  );
}

/** ------ Cost helpers (from counts) ------ */
export function costOfBackgroundFeatureCounts(counts: Counts<BackgroundFeatureKey>): number {
  return sum(
    (Object.keys(counts) as BackgroundFeatureKey[]).map(k => {
      const n = clamp(counts[k] ?? 0, 0, getMaxBG(k));
      return n * BACKGROUND_FEATURES[k].cost;
    })
  );
}

export function costOfSkillCounts(counts: Counts<SkillKey>): number {
  return sum(
    (Object.keys(counts) as SkillKey[]).map(k => {
      const n = clamp(counts[k] ?? 0, 0, getMaxSkill(k));
      return n * SKILL_CATALOG[k].cost;
    })
  );
}

export function costOfFlawCounts(counts: Counts<FlawKey>): number {
  return sum(
    (Object.keys(counts) as FlawKey[]).map(k => {
      const n = clamp(counts[k] ?? 0, 0, getMaxFlaw(k));
      return n * FLAWS[k].cost;
    })
  );
}

export function totalCostFromCounts(inputs: CreatorInputs): number {
  return (
    costOfBackgroundFeatureCounts(inputs.background_counts) +
    costOfSkillCounts(inputs.skill_counts) +
    costOfFlawCounts(inputs.flaw_counts)
  );
}

/** ------ Convenience: quick preview without save ------ */
export function buildPreview(inputs: CreatorInputs) {
  const bg = backgroundCountsToLabels(inputs.background_counts);
  const sk = skillCountsToLabels(inputs.skill_counts);
  const fl = flawCountsToLabels(inputs.flaw_counts);

  const preview: Character = {
    id: "preview",
    name: inputs.name.trim() || "(Unnamed)",
    bloodline: inputs.bloodline || undefined,
    culture: inputs.culture || undefined,
    hp: inputs.hp && inputs.hp.trim() !== "" ? Number(inputs.hp) : undefined,
    backgound_features: bg,
    skills: sk,
    blooded_skills: [],
    flaws: fl,
    createdAt: Date.now(),
  };

  const total = totalCostFromCharacter(preview);
  return { preview, total };
}
