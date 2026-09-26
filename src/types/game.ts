export type Gender = 'male' | 'female';

export interface PlayerStats {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  level: number;
  exp: number;
  expToNext: number;
  gold: number;
}

export interface PlayerProfile {
  name: string;
  gender: Gender;
  title: string;
  avatarId: string;
  stats: PlayerStats;
  equippedCostumeId: string;
  equippedHatId: string;
  equippedWeaponId: string;
  inventory: string[]; // item IDs
  completedQuests: string[];
  activeQuests: string[];
  unlockedRegions: string[];
  defeatedBosses: string[];
  currentRegionId: string;
  triviaScore: number;
  triviaStreak: number;
}

export interface VietPhucItem {
  id: string;
  name: string;
  category: 'costume' | 'hat' | 'relic' | 'weapon' | 'accessory';
  dynastyOrRegion: string; // e.g. "Thời Lý - Trần", "Đồng bằng Bắc Bộ", "Triều Nguyễn"
  description: string;
  lore: string;
  statsBonus: {
    hp?: number;
    attack?: number;
    defense?: number;
    expBonus?: number;
  };
  color: string;
  secondaryColor: string;
  icon: string;
  pixelDesign: string; // design key for custom renderer
  unlocked: boolean;
  price?: number;
}

export interface Quest {
  id: string;
  title: string;
  regionId: string;
  npcName: string;
  npcAvatar: string;
  npcDialogue: string[];
  completionDialogue: string[];
  objective: string;
  type: 'talk' | 'defeat_monsters' | 'find_item' | 'trivia';
  targetCount?: number;
  currentCount?: number;
  targetId?: string;
  rewardExp: number;
  rewardGold: number;
  rewardItemId?: string;
  isHidden?: boolean;
}

export interface SubAreaLocation {
  id: string;
  name: string;
  subTitle: string;
  description: string;
  sceneryType: 'ancient_house' | 'citadel_north' | 'silk_village' | 'imperial_hue' | 'river_hue' | 'hoian_lantern' | 'highland_rong' | 'highland_waterfall' | 'south_floating_market' | 'south_orchard' | 'islands_milestone' | 'islands_lighthouse' | 'void_realm';
  width: number;
  height: number;
  spawnPoint: { x: number; y: number };
  portals: {
    targetSubAreaId: string;
    portalName: string;
    x: number;
    y: number;
    w: number;
    h: number;
  }[];
  npcs: {
    id: string;
    name: string;
    x: number;
    y: number;
    avatar: string;
    role: string;
  }[];
  chests: {
    id: string;
    x: number;
    y: number;
    rewardItemId?: string;
    gold?: number;
    opened?: boolean;
  }[];
  interactables?: {
    id: string;
    name: string;
    badge: string;
    x: number;
    y: number;
    dialogue: string[];
    healHp?: number;
  }[];
}

export interface RegionLocation {
  id: string;
  name: string;
  vietnameseName: string;
  subTitle: string;
  description: string;
  mapX: number; // percentage on S-map 0-100
  mapY: number; // percentage on S-map 0-100
  recommendedLevel: number;
  bgTheme: 'north' | 'central' | 'highland' | 'south' | 'islands' | 'void';
  unlocked: boolean;
  landmark: string;
  specialtyCloth: string;
  subAreas?: SubAreaLocation[];
  npcs: {
    id: string;
    name: string;
    x: number;
    y: number;
    avatar: string;
    role: string;
  }[];
  chests: {
    id: string;
    x: number;
    y: number;
    rewardItemId?: string;
    gold?: number;
    opened: boolean;
  }[];
}

export interface Enemy {
  id: string;
  name: string;
  title: string;
  maxHp: number;
  hp: number;
  attack: number;
  defense: number;
  expReward: number;
  goldReward: number;
  dropItemId?: string;
  spriteType:
    | 'glitch_minion'
    | 'shadow_spirit'
    | 'river_fiend'
    | 'forest_beast'
    | 'boss_virus'
    | 'miniboss_north'
    | 'miniboss_central'
    | 'miniboss_highland'
    | 'miniboss_south'
    | 'miniboss_islands';
  phase?: number;
  attackCooldown: number;
  color: string;
  quote?: string;
}

export interface TriviaQuestion {
  id: string;
  category: 'Lịch sử' | 'Cổ phục' | 'Văn hóa' | 'Dệt may';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export type GameScreen = 
  | 'intro'
  | 'menu'
  | 'character_create'
  | 'vietnam_map'
  | 'overworld_explore'
  | 'combat'
  | 'trivia_arena'
  | 'gallery'
  | 'shop'
  | 'styling_studio'
  | 'outro';
