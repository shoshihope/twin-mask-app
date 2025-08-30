// lib/characters/schema.ts
export type Character = {
  id: string;
  name: string;
  bloodline?: string;
  hp?: number;
  culture?: string;

  // Add/rename categories to match your sheet exactly:
  backgound_features: string[];   // e.g., ["Tactical Lunge", "Iron Stomach"]
  skills: string[];
  blooded_skills: string[];
  flaws: string[];

  // Add more arrays/fields here if your sheet has them:
  // talents?: string[];
  // notes?: string;

  createdAt: number;
};
