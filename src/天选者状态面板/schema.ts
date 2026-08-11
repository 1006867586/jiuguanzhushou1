// 属性条目
const StatSchema = z.object({
  name: z.string(),
  key: z.string(),
  value: z.coerce.number(),
  max: z.coerce.number(),
  color: z.string(),
  icon: z.string(),
  special: z.boolean().optional(),
});

// 神话装备
const MythicItemSchema = z.object({
  name: z.string(),
  type: z.string(),
  rarity: z.string(),
  desc: z.string(),
  icon: z.string(),
  active: z.coerce.boolean(),
  holder: z.string().optional(),
});

// 当前装备栏
const EquipItemSchema = z.object({
  slot: z.string(),
  name: z.string(),
  rarity: z.string(),
  icon: z.string(),
});

// 背包物品
const InventoryItemSchema = z.object({
  name: z.string(),
  qty: z.coerce.number(),
  rarity: z.string(),
  icon: z.string(),
});

// 消耗品
const ConsumableSchema = z.object({
  name: z.string(),
  qty: z.coerce.number(),
  effect: z.string(),
  icon: z.string(),
});

// 技能
const SkillSchema = z.object({
  name: z.string(),
  type: z.string(),
  cd: z.string(),
  desc: z.string(),
  unlocked: z.coerce.boolean(),
  icon: z.string(),
});

// 进行中任务
const ActiveQuestSchema = z.object({
  name: z.string(),
  grade: z.string(),
  progress: z.coerce.number(),
  desc: z.string(),
  icon: z.string(),
});

// 已完成任务
const CompletedQuestSchema = z.object({
  name: z.string(),
  grade: z.string(),
  icon: z.string(),
});

export const Schema = z
  .object({
    charName: z.string().default('{{user}}'),
    level: z.coerce.number().default(1),
    className: z.string().default('天选者'),
    expCurrent: z.coerce.number().default(0),
    expMax: z.coerce.number().default(100),
    tags: z.array(z.string()).default(['异界转生者', '幸运MAX']),

    partnerLevel: z.coerce.number().default(0),
    bondLevel: z.coerce.number().default(0),

    gold: z.coerce.number().default(50),
    achieve: z.coerce.number().default(0),
    bossKills: z.coerce.number().default(0),
    location: z.string().default('🗺️ 异世界 · 召唤之地'),

    stats: z.array(StatSchema).default([
      { name: '力量 (STR)', key: 'str', value: 5, max: 100, color: '#ff6b6b', icon: '💪' },
      { name: '敏捷 (AGI)', key: 'agi', value: 5, max: 100, color: '#4ecdc4', icon: '⚡' },
      { name: '智力 (INT)', key: 'int', value: 5, max: 100, color: '#667eea', icon: '🧠' },
      { name: '体质 (VIT)', key: 'vit', value: 5, max: 100, color: '#95e1d3', icon: '❤️' },
      { name: '精神 (MND)', key: 'mnd', value: 5, max: 100, color: '#f38181', icon: '🔮' },
      { name: '幸运 (LUK)', key: 'luk', value: 999, max: 999, color: '#ffd54f', icon: '🍀', special: true },
    ]),

    mythicItems: z.array(MythicItemSchema).default([]),

    currentEquip: z.array(EquipItemSchema).default([]),

    inventory: z.array(InventoryItemSchema).default([
      { name: '干粮', qty: 3, rarity: 'common', icon: '🍞' },
      { name: '清水', qty: 2, rarity: 'common', icon: '💧' },
    ]),

    consumables: z.array(ConsumableSchema).default([
      { name: '初级红色恢复药剂', qty: 3, effect: '恢复HP 50', icon: '🔴' },
    ]),

    skills: z.array(SkillSchema).default([
      { name: '普通攻击', type: '主动', cd: '-', desc: '基础物理攻击', unlocked: true, icon: '⚔️' },
    ]),

    activeQuests: z.array(ActiveQuestSchema).default([
      { name: '【主线】初次觉醒', grade: 'D', progress: 0, desc: '在异世界中找到自己的第一个伙伴', icon: '🌟' },
    ]),

    completedQuests: z.array(CompletedQuestSchema).default([]),
  })
  .prefault({});

export type Schema = z.output<typeof Schema>;
