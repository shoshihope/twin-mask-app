
// lib/characters/config.ts


// All possible bloodlines the user can choose from
export const BLOODLINES = [
  "Human", "Effendal", "Celestial-blooded", "Demon-blooded", "Dragon-blooded", "Fae-blooded", "Newborn Dream"
] as const;

export type Bloodline = typeof BLOODLINES[number];

// All possible cultures
export const CULTURES = [
  "Castle Thorn",
  "Celestine",
  "Cestral",
  "Cole",
  "Dace",
  "Hastings",
  "Nadine ",
  "Vein",
  "Drir",
  "Ko'att",
  "Myre",
  "Trahazi",
  "Vicaul",
  "Bastion",
  "Breach",
  "Redemption",
  "Citadel",
  "Paradox - Dawn",
  "Paradox - Dusk"
] as const;

// Background features list
export type BackgroundFeatureKey =
  | "Magical Aptitude"
  | "Prophetic Dreamer"
  | "Nobility"
  | "Military Experience"
  | "Bardic Knowledge"
  | "Native Lore";

export const BACKGROUND_FEATURES: Record<
  BackgroundFeatureKey,
  { label: string; cost: number; maxStacks?: number }
> = {
  "Magical Aptitude":   { label: "Magical Aptitude",   cost: 4 },
  "Prophetic Dreamer":  { label: "Prophetic Dreamer",  cost: 4 },
  "Nobility":           { label: "Nobility",           cost: 6 },
  "Military Experience":{ label: "Military Experience",cost: 4 },
  "Bardic Knowledge":   { label: "Bardic Knowledge",   cost: 4 },
  "Native Lore":        { label: "Native Lore",        cost: 0, maxStacks: Infinity },
};


// ---- Skills (costed) ----
export type SkillKey =
    // weapon proficiencies
  | "short_weapons"
  | "one_handed_weapons"
  | "two_handed_weapons"
  | "oversized_weapon_use"
  | "thrown_weapons"
  | "bow_and_arrow"
  | "two_weapon_fighting"
    // armor proficiencies
  | "armored_training_light"
  | "armored_training_heavy"
  | "shield_use"
  | "helmet_mastery"
    // general combat skills
  | "toughness"
  | "dodge"
  | "willpower"
  | "parry"
  | "guardian"
  | "stamina_training"
  | "great_stamina"
  | "great_strike"
  | "tactical_lunge"
  | "stun"
    //archery
  | "precision"
  | "master_precision"
  | "disarming_shot"
  | "pinning_shot"
  | "repelling_shot"
  | "one_shot_one_kill"
  | "volley"
  | "faster_than_the_eye"
    //officer training
  | "sudden_motivation"
  | "inspirational_speech"
  | "defensive_instruction"
  | "evasive_instruction"
  | "offensive_instruction"
  | "military_drill"
  | "self_observation"
    //art of dueling
  | "disarm"
  | "feint"
  | "invoke_challenge"
  | "salute"
  | "stylish_hat"
  | "witty_repartee"
  | "blade_dance"
  | "pure_of_heart"
    //school of suffering
  | "armored_forearms"
  | "armored_shins"
  | "slow_bleeding"
  | "meditative_stillness"
  | "slow_death"
  | "torture_resistance"
  | "torture_immunity"
    //assassin's arts
  | "stealth_attack"
  | "ten_damage_strike"
  | "studied_killer"
  | "twist_the_knife"
  | "shin_kick"
  | "sand_in_your_eyes"
  | "hidden_weapon"
  | "leap"
  | "leap_attack"
  | "deathly_vault"
  | "rope_use"
    //path of the berserker
  | "battle_rage"
  | "enduring_rage"
  | "hatred"
  | "break_limb"
  | "break_shield"
    //mundane healing
  | "examine_wounds"
  | "detect_poison"
  | "administer_antidote"
  | "detect_disease"
  | "apply_pressure"
  | "set_bone"
  | "bandage"
  | "trauma_patch"
  | "surgery"
  | "battlefield_medicine"
    //religious worship
  | "prayer"
  | "secondary_prayer"
  | "tertiary_prayer"
  | "priesthood_one"
  | "priesthood_two"
  | "priesthood_three"
  | "priesthood_four"
  | "rite_mastery"
  | "repentance"
    //bardic arts
  | "commanding_presence"
  | "serenade"
  | "dance_lesson"
  | "true_greatness"
  | "drinking_song"
  | "meditative_song"
  | "hymn"
  | "requiem"
    //magical arts
  | "mana_focus"
        //apprentice magic
  | "apprentice_magic_alchemy"
  | "apprentice_magic_channeling"
  | "apprentice_magic_divination"
  | "apprentice_magic_warding"
  | "apprentice_magic_dream"
  | "apprentice_magic_blood"
  | "apprentice_magic_sorcery"
  | "apprentice_magic_summoning"
  | "apprentice_magic_necro"
        // journeyman magic
  | "journeyman_magic_alchemy"
  | "journeyman_magic_channeling"
  | "journeyman_magic_divination"
  | "journeyman_magic_warding"
  | "journeyman_magic_dream"
  | "journeyman_magic_blood"
  | "journeyman_magic_sorcery"
  | "journeyman_magic_summoning"
  | "journeyman_magic_necro"
        //master magic
  | "master_magic_alchemy"
  | "master_magic_channeling"
  | "master_magic_divination"
  | "master_magic_warding"
  | "master_magic_dream"
  | "master_magic_blood"
  | "master_magic_summoning"
  | "master_magic_necro"
  | "master_magic_sorcery"
        //gm magic
  | "gmaster_magic_alchemy"
  | "gmaster_magic_channeling"
  | "gmaster_magic_divination"
  | "gmaster_magic_warding"
  | "gmaster_magic_dream"
  | "gmaster_magic_blood"
  | "gmaster_magic_summoning"
  | "gmaster_magic_necro"
  | "gmaster_magic_sorcery"
        //other magic skills
  | "weapon_casting"
  | "elemental_flourish"
  | "armored_casting"
  | "combat_mimic"
  | "internal_reserves"
  | "arcane_tutelage"
  | "arcane_obversvation"
  | "spellwright"
    //skullduggery
  | "disguise"
  | "master_disguise"
  | "detect_disguise"
  | "escape"
  | "poison_resistance"
  | "poison_immunity"
  | "lockpicking_apprentice"
  | "lockpicking_journeyman"
  | "lockpicking_master"
  | "lockpicking_gmaster"
  | "gambling"
  | "torture"
    //knowledge
  | "restricted_lore"
  | "research"
  | "alchemical_examination"
        //magic lores
  | "alchemy"
  | "blood"
  | "channeling"
  | "divination"
  | "dream"
  | "necromancy"
  | "sorcery"
  | "summoning"
  | "warding"
  | "rituals"
        //creatures
  | "celestials"
  | "demons"
  | "fae"
  | "dragons"
  | "undead"
        //religions
  | "blood_cauldron"
  | "celestine_faith"
  | "church_of_chorus"
  | "demon_faiths"
  | "dragon_worship"
  | "lady_of_the_mists"
  | "nameless_faith"
  | "old_ways"
  | "trahazi_zodiac"
        //history
  | "ware_of_wine"
  | "purges"
  | "first_crusade"
  | "war_of_radiance"
  | "second_crusade"
  | "war_of_giants"
        //misc
  | "rules_of_society"
  | "nature"
  | "anatomy"
  | "medicine"
  | "knighthood"
    //influence
  | "academic_standing"
  | "economic_standing"
  | "political_standing"
  | "underworld_standing"
  | "military_standing"
    //Gathering
  | "mining"
  | "herbalism"
  | "woodcutting"
  | "hunting"
  | "mercantile"
  | "black_market"
    //crafting - metalworking
  | "blacksmithing"
  | "weaponsmithing"
  | "armorsmithing"
  | "fortify_armor"
  | "field_repair"
  | "shieldsmithing"
  | "repair_shield"
  | "locksmithing"
    //crafting - arcane
  | "enchanting"
  | "scroll_scribing"
  | "recipe_scribing"
  | "new_edition"
  | "artificing"
    //crafting - edible
  | "cooking"
  | "grand_feast"
  | "stable_alchemy"
    //crafting - other
  | "tailoring"
  | "fletching"
  | "engineering"
  | "reconstruct"
  | "inventor"
    //Bloodline restricted skills
        // restricted human skills
  | "unburdened"
  | "good_enough"
  | "pillar_of_the_community"
  | "force_of_will"
  | "pursuit_of_knowledge"
        // restricted effendal skills
  | "effendal_senses"
  | "effendal_agility"
  | "patience"
  | "weapon_master"
  | "scion_of_the_land"
        // fae skills
  | "slipery"
  | "magic_resistant"
  | "charmed_misstep"
  | "glamour"
  | "dominating_gesture"
        // celestial skills
  | "rallying_cry"
  | "healing_touch"
  | "resurrection"
  | "rise_towards_the_light"
        // demon skills
  | "draining_touch"
  | "abhorrent_sign"
  | "captivating_gaze"
  | "sink_into_darkness"
        // dragon skills
  | "natural_armor"
  | "iron_stomach"
  | "draconic_roar"
  | "bones_of_the_earth"
        //supernatural strength
  | "supernatural_strength"
        //newborn dream skills
  | "grasp_of_the_waking"
  | "methond_in_madness"
  | "drawn_to_the_muse"
  | "infinite_possibility"
  | "slumber_sight";

type PrereqCount = { key: SkillKey; count: number };

type PrereqAnyCount = { key: SkillKey; count: number };

type SkillConfig = {
  label: string;            // What the user will see the skill called
  cost: number;             // CP cost
  category: string;         // type of skill
  maxStacks?: number;       // number of times the user can add this skill
  prereqAll?: SkillKey[];   // AND (at least 1 each)
  prereqAny?: SkillKey[];   // OR  (at least 1 of these)
  prereqCounts?: PrereqCount[]; // requires N stacks of a skill
  prereqBackgroundAll?: BackgroundFeatureKey[]; // if a background feature is a prereq
  prereqAnyCounts?: PrereqAnyCount[];   // this checks how many times a user has taken a skill
  allowedBloodlines?: Bloodline[];      // to indicate bloodline restricted skills
};

// Crafting skills set (treat these as normal skills in your union & catalog)
export const CRAFTING_KEYS = [
  "blacksmithing","weaponsmithing","armorsmithing","shieldsmithing","locksmithing",
  "enchanting","scroll_scribing","artificing","cooking","stable_alchemy",
  "tailoring","fletching","engineering",
] as const;

export type CraftingSkillKey = typeof CRAFTING_KEYS[number];



export const SKILL_CATALOG: Record<SkillKey, SkillConfig>= {
    //weapons
  short_weapons:        { label: "Short Weapons",        cost: 1, category: "Weapon Proficiencies" },
  one_handed_weapons:   { label: "One-handed Weapons",   cost: 2, category: "Weapon Proficiencies", prereqAll: ["short_weapons"] },
  two_handed_weapons:   { label: "Two-handed Weapons",   cost: 3, category: "Weapon Proficiencies", prereqAll: ["one_handed_weapons"] },
  oversized_weapon_use: { label: "Oversized Weapon Use", cost: 2, category: "Weapon Proficiencies", prereqAll: ["two_handed_weapons"] },
  thrown_weapons:       { label: "Thrown Weapons",       cost: 2, category: "Weapon Proficiencies" },
  bow_and_arrow:        { label: "Bow and Arrow",        cost: 3, category: "Weapon Proficiencies" },
  two_weapon_fighting:  { label: "Two-Weapon Fighting",  cost: 6, category: "Weapon Proficiencies" },
    //armor
  armored_training_light:{ label: "Armored Training: Light", cost: 2, category: "Armor Proficiencies" },
  armored_training_heavy:{ label: "Armored Training: Heavy", cost: 2, category: "Armor Proficiencies", prereqAll: ["armored_training_light"] },
  shield_use:            { label: "Shield Use",             cost: 6, category: "Armor Proficiencies" },
  helmet_mastery:        { label: "Helmet Mastery",         cost: 2, category: "Armor Proficiencies" },
    //general combat skills
  toughness:        { label: "Toughness",                  cost: 3, category: "General Combat Skills", maxStacks: 5 },
  dodge:            { label: "Dodge",                      cost: 6, category: "General Combat Skills", maxStacks: Infinity },
  willpower:        { label: "Willpower",                  cost: 6, category: "General Combat Skills", maxStacks: Infinity },
  parry:            { label: "Parry",                      cost: 4, category: "General Combat Skills", maxStacks: Infinity },
  guardian:         { label: "Guardian",                   cost: 4, category: "General Combat Skills", prereqAll: ["parry"] },
  stamina_training: { label: "Stamina Training",           cost: 2, category: "General Combat Skills" },
  great_stamina:    { label: "Greater Stamina",            cost: 3, category: "General Combat Skills", prereqAll: ["stamina_training"] },
  great_strike:     { label: "Great Strike",               cost: 3, category: "General Combat Skills", maxStacks: Infinity },
  tactical_lunge:   { label: "Tactical Lunge",             cost: 8, category: "General Combat Skills", prereqAll: ["great_strike", "parry"] },
  stun:             { label: "Stun",                       cost: 3, category: "General Combat Skills", maxStacks: Infinity },
    //archery
  precision:            { label: "Precision",                   cost: 7, category: "Archery", prereqAll: ["bow_and_arrow"] },
  master_precision:     { label: "Master Precision",            cost: 7, category: "Archery", prereqAll: ["precision"] },
  disarming_shot:       { label: "Disarming Shot",              cost: 4, category: "Archery", prereqAll: ["precision"], maxStacks: Infinity },
  pinning_shot:         { label: "Pinning Shot",                cost: 2, category: "Archery", prereqAll: ["precision"], maxStacks: Infinity },
  repelling_shot:       { label: "Repelling Shot",              cost: 2, category: "Archery", prereqAll: ["pinning_shot"], maxStacks: Infinity },
  one_shot_one_kill:    { label: "One Shot, One Kill",          cost: 5, category: "Archery", 
    prereqAll: ["master_precision", "repelling_shot"], maxStacks: Infinity },
  volley:               { label: "Volley",                      cost: 10, category: "Archery", prereqAll: ["master_precision"]},
  faster_than_the_eye:  { label: "Faster than the Eye",         cost: 8, category: "Archery", prereqAll: ["master_precision", "stealth_attack"] },
    //officer training
  sudden_motivation:        { label: "Sudden Motivation",               cost: 1, category: "Officer Training", maxStacks: Infinity },
  inspirational_speech:     { label: "Inspirational Speech",            cost: 2, category: "Officer Training", maxStacks: Infinity },
  defensive_instruction:    { label: "Defensive Instruction",           cost: 4, category: "Officer Training", prereqAll: ["parry"], maxStacks: Infinity },
  evasive_instruction:      { label: "Evasive Instruction",             cost: 6, category: "Officer Training", prereqAll: ["dodge"], maxStacks: Infinity },
  offensive_instruction:    { label: "Offensive Instruction",           cost: 3, category: "Officer Training", prereqAll: ["great_strike"], maxStacks: Infinity },
  military_drill:           { label: "Military Drill",                  cost: 10, category: "Officer Training", 
                                                                        prereqAny:["defensive_instruction", "evasive_instruction", "offensive_instruction"]},
  self_observation:         { label: "Military Drill",                  cost: 4, category: "Officer Training", 
                                                                        prereqAny:["defensive_instruction", "evasive_instruction", "offensive_instruction"]},
    //art of dueling
 disarm:                { label: "Disarm",                  cost: 4, category: "The Art of Dueling", maxStacks: Infinity },
 feint:                 { label: "Feint",                   cost: 1, category: "The Art of Dueling", maxStacks: Infinity },
 invoke_challenge:      { label: "Invoke Challenge",        cost: 5, category: "The Art of Dueling"},
 salute:                { label: "Salute",                  cost: 4, category: "The Art of Dueling"},
 stylish_hat:           { label: "Stylish Hat",             cost: 2, category: "The Art of Dueling", prereqAll: ["salute"]},
 witty_repartee:        { label: "Witty Repartee",          cost: 7, category: "The Art of Dueling"},
 blade_dance:           { label: "Blade Dance",             cost: 5, category: "The Art of Dueling", prereqAll: ["great_strike", "leap"]},
 pure_of_heart:         { label: "Pure of Heart",           cost: 3, category: "The Art of Dueling"},
    //school of suffering
 armored_forearms:      { label: "Armored Forearms",        cost: 6, category: "The School of Suffering"},
 armored_shins:         { label: "Armored Shins",           cost: 9, category: "The School of Suffering", prereqAll: ["armored_forearms"]},
 slow_bleeding:         { label: "Slow Bleeding",           cost: 3, category: "The School of Suffering"},
 meditative_stillness:  { label: "Meditative Stillness",    cost: 2, category: "The School of Suffering", prereqAll: ["slow_bleeding"]},
 slow_death:            { label: "Slow Death",              cost: 3, category: "The School of Suffering", prereqAll: ["meditative_stillness"]},
 torture_resistance:    { label: "Torture Resistance",      cost: 3, category: "The School of Suffering", maxStacks: 3},
 torture_immunity:      { label: "Torture Immunity",        cost: 4, category: "The School of Suffering", prereqCounts: [{key: "torture_resistance", count: 3}]},
    //assassin's arts
 stealth_attack:         { label: "Stealth Attack",             cost: 6, 
                         category: "The Asassin's Arts", prereqAny: ["short_weapons", "thrown_weapons", "bow_and_arrow"]},
 ten_damage_strike:      { label: "10-Damage Strike",           cost: 8, 
                        category: "The Assassin's Arts", maxStacks: Infinity, prereqAny: ["short_weapons", "thrown_weapons", "bow_and_arrow"]},
 studied_killer:        { label: "Studied Killer",              cost: 6, category: "The Assassin's Arts", prereqAll: ["stealth_attack"]},
 twist_the_knife:       { label: "Twist the Knife",             cost: 10, category: "The Assassin's Arts", prereqAll: ["stealth_attack"]},
 shin_kick:             { label: "Shin Kick",                   cost: 3, category: "The Assassin's Arts", maxStacks: Infinity, prereqAll: ["stun"]},
 sand_in_your_eyes:     { label: "Sand in your Eyes",           cost: 3, category: "The Assassin's Arts", maxStacks: Infinity, prereqAll: ["stun"]},
 hidden_weapon:         { label: "Hidden Weapon",               cost: 3, category: "The Assassin's Arts", prereqAll: ["short_weapons"]},
 leap:                  { label: "Leap",                        cost: 2, category: "The Assassin's Arts", maxStacks: Infinity},
 leap_attack:           { label: "Leap Attack",                 cost: 4, category: "The Assassin's Arts", prereqAll: ["leap"]},
 deathly_vault:         { label: "Deathly Vault",               cost: 4, category: "The Assassin's Arts", prereqAll: ["stealth_attack", "leap"]},
 rope_use:              { label: "Rope Use",                    cost: 3, category: "The Assassin's Arts"},
    //path of the Berserker
 battle_rage:       { label: "Battle Rage",     cost: 7, category: "The Honored Path of the Berserker", maxStacks: Infinity},
 enduring_rage:     { label: "Enduring Rage",   cost: 6, category: "The Honored Path of the Berserker"},
 hatred:            { label: "Hatred",          cost: 4, category: "The Honored Path of the Berserker", prereqAll: ["battle_rage"]},
 break_limb:        { label: "Break Limb",      cost: 5, category: "The Honored Path of the Berserker", maxStacks: Infinity},
 break_shield:      { label: "Battle Rage",     cost: 5, category: "The Honored Path of the Berserker", prereqAll: ["break_limb", "two_handed_weapons"]},
    //mundane healing
 examine_wounds:        { label: "Examine Wounds",          cost: 2, category: "Mundane Healing"},
 detect_poison:         { label: "Detect Poison",           cost: 2, category: "Mundane Healing", prereqAll: ["examine_wounds"]},
 administer_antidote:   { label: "Administer Antidote",     cost: 2, category: "Mundane Healing", prereqAll: ["detect_poison"], maxStacks: Infinity},
 detect_disease:        { label: "Detect Disease",          cost: 2, category: "Mundane Healing", prereqAll: ["examine_wounds"]},
 apply_pressure:        { label: "Apply Pressure",          cost: 1, category: "Mundane Healing", prereqAll: ["examine_wounds"]},
 set_bone:              { label: "Set Bone",                cost: 3, category: "Mundane Healing", prereqAll: ["apply_pressure"]},
 bandage:               { label: "Bandage",                 cost: 4, category: "Mundane Healing", prereqAll: ["set_bone"]},
 trauma_patch:          { label: "Trauma Patch",            cost: 4, category: "Mundane Healing", maxStacks: Infinity, prereqAll: ["bandage"]},
 surgery:               { label: "Examine Wounds",          cost: 5, category: "Mundane Healing", prereqAll: ["bandage", "anatomy"]},
 battlefield_medicine:  { label: "Examine Wounds",          cost: 2, category: "Mundane Healing", prereqAll: ["surgery"]},
    //religious worship
 prayer:                {label: "Prayer",               cost: 4, category: "Religious Worship"},
 secondary_prayer:      {label: "Secondary Prayer",     cost: 4, category: "Religious Worship", prereqAll: ["priesthood_two"]},
 tertiary_prayer:       {label: "Tertiary Prayer",      cost: 4, category: "Religious Worship", prereqAll: ["priesthood_four"]},
 priesthood_one:        {label: "Priesthood: Rank 1",   cost: 6, category: "Religious Worship", prereqAll: ["prayer"]},
 priesthood_two:        {label: "Priesthood: Rank 2",   cost: 6, category: "Religious Worship", prereqAll: ["priesthood_one"]},
 priesthood_three:      {label: "Priesthood: Rank 3",   cost: 6, category: "Religious Worship", prereqAll: ["priesthood_two"]},
 priesthood_four:       {label: "Priesthood: Rank 4",   cost: 6, category: "Religious Worship", prereqAll: ["priesthood_three"]},
 rite_mastery:          {label: "Rite Mastery",         cost: 4, category: "Religious Worship", maxStacks: Infinity, prereqAll: ["prayer"]},
 repentance:            {label: "Repentance",           cost: 2, category: "Religious Worship"},
    //bardic arts
 commanding_presence:   {label: "Commanding Presence",  cost: 3, category: "The Bardic Arts", maxStacks: Infinity},
 serenade:              {label: "Serenade",             cost: 8, category: "The Bardic Arts", prereqAll: ["willpower"], maxStacks: Infinity},
 dance_lesson:          {label: "Dance Lesson",         cost: 8, category: "The Bardic Arts", prereqAll: ["dodge"], maxStacks: Infinity},
 true_greatness:        {label: "True Greatness",       cost: 4, category: "The Bardic Arts", maxStacks: Infinity},
 drinking_song:         {label: "Drinking Song",        cost: 6, category: "The Bardic Arts"},
 meditative_song:       {label: "Meditative Song",      cost: 10, category: "The Bardic Arts", prereqCounts: [{key: "mana_focus", count: 3}]},
 hymn:                  {label: "Hymn",                 cost: 2, category: "The Bardic Arts"},
 requiem:               {label: "Requiem",              cost: 3, category: "The Bardic Arts"},
    //magical arts
 mana_focus:                    {label: "Mana Focus",                       cost: 1, category: "The Magical Arts", maxStacks: Infinity},
        //apprentice magic
 apprentice_magic_alchemy:      {label: "Apprentice Magic: Alchemy",        cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 5}], prereqAll: ["alchemy"]}, 
 apprentice_magic_blood:        {label: "Apprentice Magic: Blood",          cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 5}], prereqAll: ["blood"]},
 apprentice_magic_channeling:   {label: "Apprentice Magic: Channeling",     cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 5}], prereqAll: ["channeling"]},
 apprentice_magic_divination:   {label: "Apprentice Magic: Divination",     cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 5}], prereqAll: ["divination"]},
 apprentice_magic_dream:        {label: "Apprentice Magic: Dream",          cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 5}], prereqAll: ["dream"]},
 apprentice_magic_necro:        {label: "Apprentice Magic: Necromancy",     cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 5}], prereqAll: ["necromancy"]},
 apprentice_magic_summoning:    {label: "Apprentice Magic: Summoning",      cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 5}], prereqAll: ["summoning"]},
 apprentice_magic_sorcery:      {label: "Apprentice Magic: Sorcery",        cost: 6,
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 5}], prereqAll: ["sorcery"] }, 
 apprentice_magic_warding:      {label: "Apprentice Magic: Warding",        cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 5}], prereqAll: ["warding"]}, 
        //journeyman magic
 journeyman_magic_alchemy:      {label: "Journeyman Magic: Alchemy",        cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 10}], 
                                    prereqAll: ["alchemy", "apprentice_magic_alchemy"]}, 
 journeyman_magic_blood:        {label: "Journeyman Magic: Blood",          cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 10}], 
                                    prereqAll: ["blood", "apprentice_magic_blood"]}, 
 journeyman_magic_channeling:   {label: "Journeyman Magic: Channeling",     cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 10}], 
                                    prereqAll: ["channeling", "apprentice_magic_channeling"]}, 
 journeyman_magic_divination:   {label: "Journeyman Magic: Divination",     cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 10}], 
                                    prereqAll: ["divination", "apprentice_magic_divination"]}, 
 journeyman_magic_dream:        {label: "Journeyman Magic: Dream",          cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 10}], 
                                    prereqAll: ["dream", "apprentice_magic_dream"]}, 
 journeyman_magic_necro:        {label: "Journeyman Magic: Necromancy",     cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 10}], 
                                    prereqAll: ["necromancy", "apprentice_magic_necro"]}, 
 journeyman_magic_sorcery:      {label: "Journeyman Magic: Sorcery",        cost: 6,
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 10}], 
                                    prereqAll: ["sorcery", "apprentice_magic_sorcery"] }, 
 journeyman_magic_summoning:    {label: "Journeyman Magic: Summoning",      cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 10}], 
                                    prereqAll: ["summoning", "apprentice_magic_summoning"]}, 
 journeyman_magic_warding:      {label: "Journeyman Magic: Warding",        cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 10}], 
                                    prereqAll: ["warding", "apprentice_magic_warding"]},
        // master magic
 master_magic_alchemy:          {label: "Master Magic: Alchemy",            cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 15}], 
                                    prereqAll: ["alchemy", "journeyman_magic_alchemy"]}, 
 master_magic_blood:            {label: "Master Magic: Blood",              cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 15}], 
                                    prereqAll: ["blood", "journeyman_magic_blood"]}, 
 master_magic_channeling:       {label: "Master Magic: Channeling",         cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 15}], 
                                    prereqAll: ["channeling", "journeyman_magic_channeling"]},
 master_magic_divination:       {label: "Master Magic: Divination",         cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 15}], 
                                    prereqAll: ["divination", "journeyman_magic_divination"]},
 master_magic_dream:            {label: "Master Magic: Dream",              cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 15}], 
                                    prereqAll: ["dream", "journeyman_magic_dream"]},
 master_magic_necro:            {label: "Master Magic: Necromancy",         cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 15}], 
                                    prereqAll: ["necromancy", "journeyman_magic_necro"]},
 master_magic_sorcery:          {label: "Master Magic: Sorcery",            cost: 6,
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 15}], 
                                    prereqAll: ["sorcery", "journeyman_magic_sorcery"] }, 
 master_magic_summoning:        {label: "Master Magic: Summoning",          cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 15}], 
                                    prereqAll: ["summoning", "journeyman_magic_summoning"]},
 master_magic_warding:          {label: "Master Magic: Warding",            cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 15}], 
                                    prereqAll: ["warding", "journeyman_magic_warding"]},
        // grandmaster magic
 gmaster_magic_alchemy:         {label: "Grandmaster Magic: Alchemy",       cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 20}], 
                                    prereqAll: ["alchemy", "master_magic_alchemy"]}, 
 gmaster_magic_blood:           {label: "Grandmaster Magic: Blood",         cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 20}], 
                                    prereqAll: ["blood", "master_magic_blood"]}, 
 gmaster_magic_channeling:      {label: "Grandmaster Magic: Channeling",    cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 20}],
                                    prereqAll: ["channeling", "master_magic_channeling"]},
 gmaster_magic_divination:      {label: "Grandmaster Magic: Divination",    cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 20}], 
                                    prereqAll: ["divination", "master_magic_divination"]},
 gmaster_magic_dream:           {label: "Grandmaster Magic: Dream",         cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 20}], 
                                    prereqAll: ["dream", "master_magic_dream"]},
 gmaster_magic_necro:           {label: "Grandmaster Magic: Necromancy",    cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 20}], 
                                    prereqAll: ["necromancy", "master_magic_necro"]},
 gmaster_magic_sorcery:         {label: "Grandmaster Magic: Sorcery",       cost: 6,
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 20}], 
                                    prereqAll: ["sorcery", "master_magic_sorcery"] }, 
 gmaster_magic_summoning:       {label: "Grandmaster Magic: Summoning",     cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 20}], 
                                    prereqAll: ["summoning", "master_magic_summoning"]},
 gmaster_magic_warding:         {label: "Grandmaster Magic: Warding",       cost: 6, 
                                    category: "The Magical Arts", prereqCounts: [{key: "mana_focus", count: 20}], 
                                    prereqAll: ["warding", "master_magic_warding"]}, 
        // other magic skills
 weapon_casting:                {label: "Weapon Casting",                   cost: 8, category: "The Magical Arts", prereqBackgroundAll: ["Magical Aptitude"]},
 elemental_flourish:            {label: "Elemental Flourish",               cost: 4, category: "The Magical Arts", 
                                    prereqAll:["apprentice_magic_sorcery", "great_strike"] },
 armored_casting:               {label: "Armored Casting",                  cost: 6, category: "The Magical Arts", prereqBackgroundAll: ["Magical Aptitude"] },
 combat_mimic:                  {label: "Combat Mimic",                     cost: 4, category: "The Magical Arts", 
                                    prereqAll: ["weapon_casting"], maxStacks: Infinity},
 internal_reserves:             {label: "Internal Reserves",                cost: 4, category: "The Magical Arts", 
                                    prereqCounts: [{key: "mana_focus", count: 10}]},
 arcane_tutelage:               {label: "Arcane Tutelage",                  cost: 10, category: "The Magical Arts", prereqAll: ["research"], 
                                    prereqAny: ["gmaster_magic_alchemy", "gmaster_magic_blood", "gmaster_magic_channeling",
                                    "gmaster_magic_divination", "gmaster_magic_dream", "gmaster_magic_necro",
                                    "gmaster_magic_sorcery", "gmaster_magic_summoning", "gmaster_magic_warding"]},
 arcane_obversvation:           {label: "Arcane Observation",               cost: 4, category: "The Magical Arts", prereqAll: ["arcane_tutelage"]},
 spellwright:                   {label: "Spellwright", cost: 2, category: "The Magical Arts", prereqAll: ["research"], 
                                    prereqAny: ["gmaster_magic_alchemy", "gmaster_magic_blood", "gmaster_magic_channeling", 
                                    "gmaster_magic_divination", "gmaster_magic_dream", "gmaster_magic_necro", "gmaster_magic_sorcery",
                                    "gmaster_magic_summoning", "gmaster_magic_warding"]},
    //skullduggery
 disguise:                  {label: "Disguise",                 cost: 4, category: "Skullduggery"},
 master_disguise:           {label: "Master Disguise",          cost: 6, category: "Skullduggery", prereqAll: ["disguise"]},
 detect_disguise:           {label: "Detect Disguise",          cost: 4, category: "Skullduggery"},
 escape:                    {label: "Escape",                   cost: 3, category: "Skullduggery", maxStacks: Infinity},
 poison_resistance:         {label: "Poison Resistance",        cost: 2, category: "Skullduggery", maxStacks: 3},
 poison_immunity:           {label: "Poison Immunity",          cost: 4, category: "Skullduggery", prereqCounts: [{key: "poison_resistance", count: 3}]},
 lockpicking_apprentice:    {label: "Lockpicking: Apprentice",  cost: 4, category: "Skullduggery"},
 lockpicking_journeyman:    {label: "Lockpicking: Journeyman",  cost: 4, category: "Skullduggery", prereqAll: ["lockpicking_apprentice"]},
 lockpicking_master:        {label: "Lockpicking: Master",      cost: 4, category: "Skullduggery", prereqAll: ["lockpicking_journeyman"]},
 lockpicking_gmaster:       {label: "Lockpicking: Grandmaster", cost: 4, category: "Skullduggery", prereqAll: ["lockpicking_master"]},
 gambling:                  {label: "Gambling",                 cost: 2, category: "Skullduggery", maxStacks: Infinity},
 torture:                   {label: "Disguise",                 cost: 2, category: "Skullduggery", maxStacks: Infinity},
    // knowledge
 restricted_lore:           {label: "Restriced Lore",           cost: 4, category: "Knowledge", maxStacks: Infinity},
 research:                  {label: "Research",                 cost: 6, category: "Knowledge"},
 alchemical_examination:    {label: "Alchemical Examination",   cost: 3, category: "Knowledge", prereqAll: ["alchemy"]},
        //magic lores
 alchemy:                   {label: "Lore: Alchemy",            cost: 4, category: "Knowledge"},
 blood:                     {label: "Lore: Blood Magic",        cost: 4, category: "Knowledge"},
 channeling:                {label: "Lore: Channeling",         cost: 4, category: "Knowledge"},
 divination:                {label: "Lore: Divination",         cost: 4, category: "Knowledge"},
 dream:                     {label: "Lore: Dream Magic",        cost: 4, category: "Knowledge"},
 necromancy:                {label: "Lore: Necromancy",         cost: 4, category: "Knowledge"},
 sorcery:                   {label: "Lore: Sorcery",            cost: 4, category: "Knowledge"},
 summoning:                 {label: "Lore: Summoning",          cost: 4, category: "Knowledge" },
 warding:                   {label: "Lore: Warding",            cost: 4, category: "Knowledge"},
 rituals:                   {label: "Lore: Ritual Magic",       cost: 4, category: "Knowledge"},
        // creature lores
 celestials:                {label: "Lore: Celestials",         cost: 4, category: "Knowledge"},
 demons:                    {label: "Lore: Demons",             cost: 4, category: "Knowledge"},
 fae:                       {label: "Lore: Fae",                cost: 4, category: "Knowledge"},
 dragons:                   {label: "Lore: Dragons",            cost: 4, category: "Knowledge"},
 undead:                    {label: "Lore: Undead",             cost: 4, category: "Knowledge"},
        //religion lores
 blood_cauldron:            {label: "Lore: The Blood Cauldron", cost: 4, category: "Knowledge"},
 celestine_faith:           {label: "Lore: The Celestine Faith", cost: 4, category: "Knowledge"},
 church_of_chorus:          {label: "Lore: Church of Chorus",   cost: 4, category: "Knowledge"},
 demon_faiths:              {label: "Lore: Demon Faiths",       cost: 4, category: "Knowledge"},
 dragon_worship:            {label: "Lore: Dragon Worship",     cost: 4, category: "Knowledge"},
 lady_of_the_mists:         {label: "Lore: The Lady of the Mists", cost: 4, category: "Knowledge"},
 nameless_faith:            {label: "Lore: The Nameless Faith", cost: 4, category: "Knowledge"},
 old_ways:                  {label: "Lore: Old Ways",           cost: 4, category: "Knowledge"},
 trahazi_zodiac:            {label: "Lore: Trahazi Zodiance",   cost: 4, category: "Knowledge"},
        //history
 ware_of_wine:              {label: "Lore: Ware of Wine",       cost: 4, category: "Knowledge"},
 purges:                    {label: "Lore: Purges",             cost: 4, category: "Knowledge"},
 first_crusade:             {label: "Lore: The First Crusade",  cost: 4, category: "Knowledge"},
 war_of_radiance:           {label: "Lore: The War of Radiance", cost: 4, category: "Knowledge"},
 second_crusade:            {label: "Lore: The Second Crusade", cost: 4, category: "Knowledge"},
 war_of_giants:             {label: "Lore: The War of Giants",  cost: 4, category: "Knowledge"},
        //misc lores
 rules_of_society:          {label: "Lore: Rules of Society",   cost: 4, category: "Knowledge"},
 nature:                    {label: "Lore: Nature",             cost: 4, category: "Knowledge"},
 anatomy:                   {label: "Lore: Anatomy",            cost: 4, category: "Knowledge"},
 medicine:                  {label: "Lore: Medicine",           cost: 4, category: "Knowledge"},
 knighthood:                {label: "Lore: Knighthood",         cost: 4, category: "Knowledge"},
    //ranks of influence
        // I didn't program them all separately, just made it so you can take each standing 4 times
 academic_standing:     {label: "Academic Standing",    cost: 4, category: "Influence", maxStacks: 4},
 economic_standing:     {label: "Economic Standing",    cost: 4, category: "Influence", maxStacks: 4},
 political_standing:    {label: "Political Standing",   cost: 4, category: "Influence", maxStacks: 4},
 underworld_standing:   {label: "Underworld Standing",  cost: 4, category: "Influence", maxStacks: 4},
 military_standing:     {label: "Military Standing",    cost: 4, category: "Influence", maxStacks: 4},
    //gathering
 mining:                {label: "Mining",       cost: 4, category: "Category", maxStacks: 4},
 herbalism:             {label: "Herbalism",    cost: 4, category: "Category", maxStacks: 4},
 woodcutting:           {label: "Woodcutting",  cost: 4, category: "Category", maxStacks: 4},
 hunting:               {label: "Hunting",      cost: 4, category: "Category", maxStacks: 4},
 mercantile:            {label: "Mercantile",   cost: 4, category: "Category", maxStacks: 4},
 black_market:          {label: "Black Market", cost: 4, category: "Category", maxStacks: 4},
    //crafting - metalworking
 blacksmithing:     {label: "Blacksmithing",    cost: 6, category: "Crafting - Metalworking", maxStacks: 4},
 weaponsmithing:    {label: "Weaponsmithing",   cost: 6, category: "Crafting - Metalworking", maxStacks: 4},
 armorsmithing:     {label: "Armorsmithing",    cost: 6, category: "Crafting - Metalworking", maxStacks: 4},
 fortify_armor:     {label: "Fortify Armor",    cost: 3, category: "Crafting - Metalworking", prereqAny: ["armorsmithing", "tailoring"]},
 field_repair:      {label: "Field Repair",     cost: 2, category: "Crafting - Metalworking", maxStacks: Infinity, prereqAny: ["fortify_armor", "repair_shield"]},
 shieldsmithing:    {label: "Shieldsmithing",   cost: 6, category: "Crafting - Metalworking", maxStacks: 4},
 repair_shield:     {label: "Repair Shield",    cost: 3, category: "Crafting - Metalworking", prereqAll: ["shieldsmithing"]},
 locksmithing:      {label: "Locksmithing",     cost: 6, category: "Crafting - Metalworking", maxStacks: 4},
    //crafting - arcane
 enchanting:        {label: "Enchanting",       cost: 6, category: "Crafting - Arcane", maxStacks: 4},
 scroll_scribing:   {label: "Scroll Scribing",  cost: 6, category: "Crafting - Arcane", maxStacks: 4},
 recipe_scribing:   {label: "Recipe Scribing",  cost: 2, category: "Crafting - Arcane", prereqAll: ["scroll_scribing"]},
 new_edition:       {label: "New Edition",      cost: 3, category: "Crafting - Arcane", prereqAll: ["scroll_scribing"]},
 artificing:        {label: "Artificing",       cost: 6, category: "Crafting - Arcane", maxStacks: 4},
    //crafting - edible
 cooking:           {label: "Cooking",          cost: 6, category: "Crafting - Edible", maxStacks: 4},
 grand_feast:       {label: "Grand Feast",      cost: 10, category: "Crafting - Edible", prereqCounts: [{key: "cooking", count: 4}]},
 stable_alchemy:    {label: "Stable Alchemy",   cost: 6, category: "Crafting - Edible", maxStacks: 4},
    //crafting - other
 tailoring: {label: "Tailoring", cost: 6, category: "Crafting - Other", maxStacks: 4},
 fletching: {label: "Fletching", cost: 6, category: "Crafting - Other", maxStacks: 4},
 engineering: {label: "Engineering", cost: 6, category: "Crafting - Other", maxStacks: 4},
 reconstruct: {label: "Reconstruct", cost: 1, category: "Crafting - Other", prereqAny: [
    "blacksmithing", "weaponsmithing", "armorsmithing", "shieldsmithing", "locksmithing", "enchanting", "scroll_scribing", "artificing",
    "cooking", "stable_alchemy", "tailoring", "fletching", "engineering"
    ]},
 inventor: {
        label: "Inventor",
        cost: 6,                      // set per your sheet
        category: "Crafting",
        prereqAll: ["research"],      // must have Research
        // Must have ANY ONE crafting skill taken at least 4 times
        prereqAnyCounts: CRAFTING_KEYS.map(k => ({ key: k as SkillKey, count: 4 })),
        },
    // restricted bloodline skills
        // human skills
 unburdened:                {label: "Unburdened",               cost: 3, category: "Restricted Bloodline Skills", allowedBloodlines: ["Human"]},
 good_enough:               {label: "Good Enough",              cost: 4, category: "Restricted Bloodline Skills", allowedBloodlines: ["Human"]},
 pillar_of_the_community:   {label: "Pillar of the Community",  cost: 2, category: "Restricted Bloodline Skills", allowedBloodlines: ["Human"]},
 force_of_will:             {label: "Force of Will",            cost: 4, category: "Restricted Bloodline Skills", 
                                maxStacks: Infinity, allowedBloodlines: ["Human"]},
 pursuit_of_knowledge:      {label: "Pursuit of Knowledge",      cost: 4, category: "Restricted Bloodline Skills", allowedBloodlines: ["Human"]},
        //effendal skills
 effendal_senses:   {label: "Effendal Senses",      cost: 2, category: "Restricted Bloodline Skills", allowedBloodlines: ["Effendal"]},
 effendal_agility:  {label: "Effendal Agility",     cost: 5, category: "Restricted Bloodline Skills", allowedBloodlines: ["Effendal"]},
 patience:          {label: "Patience",             cost: 4, category: "Restricted Bloodline Skills", allowedBloodlines: ["Effendal"]},
 weapon_master:     {label: "Weapon Master",        cost: 6, category: "Restricted Bloodline Skills", allowedBloodlines: ["Effendal"]},
 scion_of_the_land: {label: "Effendal Senses",      cost: 4, category: "Restricted Bloodline Skills", allowedBloodlines: ["Effendal"]},
        // fae blooded skills
 slipery:           {label: "Slippery",         cost: 7, category: "Retricted Bloodline Skills", allowedBloodlines: ["Fae-blooded"]},
 magic_resistant:   {label: "Magic Resistant",  cost: 5, category: "Restricted Bloodline Skills", allowedBloodlines: ["Fae-blooded"], maxStacks: Infinity},
 charmed_misstep:   {label: "Charmed Misstep",  cost: 3, category: "Restricted Bloodline Skills", allowedBloodlines: ["Fae-blooded"], maxStacks: Infinity},
 glamour:           {label: "Glamour",          cost: 7, category: "Restricted Bloodline Skills", allowedBloodlines: ["Fae-blooded"]},
 dominating_gesture:{label: "Dominating Gesture", cost: 8, category: "Restricted Bloodline Skills", allowedBloodlines: ["Fae-blooded"], maxStacks: Infinity},
        // celestial blooded skills
 rallying_cry:              {label: "Rallying Cry",         cost: 3, category: "Restricted Bloodline Skills", 
                                allowedBloodlines: ["Celestial-blooded"], maxStacks: Infinity},
 healing_touch:             {label: "Healing Touch",        cost: 6, category: "Restricted Bloodline Skills", 
                                allowedBloodlines: ["Celestial-blooded"], maxStacks: Infinity},
 resurrection:              {label: "Resurrection",         cost: 10, category: "Restricted Bloodline Skills", 
                                allowedBloodlines: ["Celestial-blooded"], maxStacks: Infinity},
 rise_towards_the_light:    {label: "Rise Toward the Light",cost: 5, category: "Restricted Bloodline Skills", 
                                allowedBloodlines: ["Celestial-blooded"]},
        // demon blooded skills
 draining_touch:    {label: "Draining Touch",   cost: 5, category: "Restricted Bloodline Skills", allowedBloodlines: ["Demon-blooded"]},
 abhorrent_sign:    {label: "Abhorrent Sign",   cost: 3, category: "Restricted Bloodline Skills", allowedBloodlines: ["Demon-blooded"], maxStacks: Infinity},
 captivating_gaze:  {label: "Captivating Gaze", cost: 8, category: "Restricted Bloodline Skills", allowedBloodlines: ["Demon-blooded"], maxStacks: Infinity},
 sink_into_darkness:{label: "Sink into Darkness", cost: 5, category: "Restricted Bloodline Skills", allowedBloodlines: ["Demon-blooded"]},
        //dragon skills
 natural_armor:     {label: "Natural Armor",    cost: 7, category: "Restricted Bloodline Skills", allowedBloodlines: ["Dragon-blooded"]},
 iron_stomach:      {label: "Iron Stomach",     cost: 4, category: "Restricted Bloodline Skills", allowedBloodlines: ["Dragon-blooded"]},
 draconic_roar:     {label: "Draconic Roar",    cost: 4, category: "Restricted Bloodline Skills", allowedBloodlines: ["Dragon-blooded"], maxStacks: Infinity},
 bones_of_the_earth:{label: "Bones of the Earth", cost: 8, category: "Restricted Bloodline Skills", allowedBloodlines: ["Dragon-blooded"], maxStacks: Infinity},
        //supernatural strength
 supernatural_strength: {label: "Supernatural Strength", cost: 10, category: "Restricted Bloodline Skills", 
                            allowedBloodlines: ["Celestial-blooded", "Dragon-blooded", "Demon-blooded"]},
        // newborn dream skills
 grasp_of_the_waking:   {label: "Grasp of the Waking",  cost: 4, category: "Restricted Bloodline Skills", allowedBloodlines: ["Newborn Dream"]},
 methond_in_madness:    {label: "Method in Madness",    cost: 4, category: "Restricted Bloodline Skills", allowedBloodlines: ["Newborn Dream"]},
 drawn_to_the_muse:     {label: "Drawn to the Muse",    cost: 3, category: "Restricted Bloodline Skills", allowedBloodlines: ["Newborn Dream"]},
 infinite_possibility:  {label: "Infinite Possibility", cost: 4, category: "Restricted Bloodline Skills", allowedBloodlines: ["Newborn Dream"]},
 slumber_sight:         {label: "Slumber Sight",        cost: 8, category: "Restricted Bloodline Skills", 
                            allowedBloodlines: ["Newborn Dream"], maxStacks: Infinity},
};


// ---- Blooded Skills (by bloodline, each has a fixed cost) ----
// export type BloodedSkillKey =
//   | "iron_stomach"
//   | "draconic_roar"; // add more…

//export const BLOODED_SKILL_CATALOG: Record<BloodedSkillKey, { label: string; cost: number }> = {
  //iron_stomach:  { label: "Iron Stomach",  cost: 2 },
  //draconic_roar: { label: "Draconic Roar", cost: 3 },
  //
//};

// If some bloodlines unlock multiple blooded skills, list them all here:
//export const BLOODED_SKILLS_BY_BLOODLINE: Record<string, BloodedSkillKey[]> = {
  //Human:      ["iron_stomach"],                             // example
  //Effendal:   ["iron_stomach"],                             // example
  //Dragonborn: ["iron_stomach", "draconic_roar"],            // multiple allowed
  // …
//};

// ---- Flaws (have a fixed cost) ----
export type FlawKey = 
    "Sovereign Zeal" |
    "Religious Zeal" |
    "Corrupted" |
    "Frail" |
    "Clouded Memory" |
    "Fractured Memory" |
    "Fading Memory" |
    "Illiterate" |
    "Oath Bound" |
    "Tethered";

export const FLAWS: Record<
  FlawKey,
  { label: string; cost: number, maxStacks?: number }
    > = {
        "Sovereign Zeal":  { label: "Sovereign Zeal",  cost: -2 },
        "Religious Zeal":  { label: "Religious Zeal",  cost: -2 },
        "Corrupted":       { label: "Corrupted",       cost: -6 },
        "Frail":           { label: "Frail",           cost: -3, maxStacks: Infinity },
        "Clouded Memory":  { label: "Clouded Memory",  cost: -2 },
        "Fractured Memory":{ label: "Fractured Memory",cost: -4 },
        "Fading Memory":   { label: "Fading Memory",   cost: -4 },
        "Illiterate":      { label: "Illiterate",      cost: -4 },
        "Oath Bound":      { label: "Oath Bound",      cost: -6 },
        "Tethered":        { label: "Tethered",        cost: -10 },
    };
