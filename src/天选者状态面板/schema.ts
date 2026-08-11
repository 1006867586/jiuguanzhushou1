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
    level: z.coerce.number().default(87),
    className: z.string().default('天选者'),
    expCurrent: z.coerce.number().default(87450),
    expMax: z.coerce.number().default(92000),
    tags: z.array(z.string()).default(['异界转生者', '幸运MAX']),

    partnerLevel: z.coerce.number().default(82),
    bondLevel: z.coerce.number().default(10),

    gold: z.coerce.number().default(128450),
    achieve: z.coerce.number().default(47),
    bossKills: z.coerce.number().default(23),
    location: z.string().default('🗺️ 黄昏之门 · 最终战场'),

    stats: z.array(StatSchema).default([
      { name: '力量 (STR)', key: 'str', value: 68, max: 100, color: '#ff6b6b', icon: '💪' },
      { name: '敏捷 (AGI)', key: 'agi', value: 75, max: 100, color: '#4ecdc4', icon: '⚡' },
      { name: '智力 (INT)', key: 'int', value: 82, max: 100, color: '#667eea', icon: '🧠' },
      { name: '体质 (VIT)', key: 'vit', value: 71, max: 100, color: '#95e1d3', icon: '❤️' },
      { name: '精神 (MND)', key: 'mnd', value: 88, max: 100, color: '#f38181', icon: '🔮' },
      { name: '幸运 (LUK)', key: 'luk', value: 999, max: 999, color: '#ffd54f', icon: '🍀', special: true },
    ]),

    mythicItems: z.array(MythicItemSchema).default([
      { name: '命运之骰', type: '饰品', rarity: 'mythic', desc: '可重掷任何随机结果，每日3次', icon: '🎲', active: true },
      { name: '虚空背包', type: '容器', rarity: 'mythic', desc: '无限容量，内部时间静止', icon: '🎒', active: true },
      { name: '时之沙漏', type: '饰品', rarity: 'mythic', desc: '局部时间回溯5秒，冷却1小时', icon: '⏳', active: true },
      { name: '永恒誓约之剑', type: '武器', rarity: 'mythic', desc: '伤害与羁绊深度挂钩', icon: '⚔️', active: true },
      { name: '万灵图鉴', type: '道具', rarity: 'mythic', desc: '收录任何怪物/技能，可复制使用', icon: '📖', active: true },
      { name: '世界树之种', type: '消耗品', rarity: 'mythic', desc: '存档当前世界状态，一次性', icon: '🌱', active: true },
      { name: '七弦圣琴', type: '武器', rarity: 'mythic', desc: '艾米莉亚专属，奏响可逆转因果', icon: '🎵', active: false, holder: '艾米莉亚' },
    ]),

    currentEquip: z.array(EquipItemSchema).default([
      { slot: '主手', name: '永恒誓约之剑 +12', rarity: 'mythic', icon: '⚔️' },
      { slot: '副手', name: '命运之骰', rarity: 'mythic', icon: '🎲' },
      { slot: '头部', name: '天选者之冠', rarity: 'legendary', icon: '👑' },
      { slot: '身体', name: '虚空行者斗篷 +8', rarity: 'epic', icon: '🧥' },
      { slot: '饰品', name: '时之沙漏', rarity: 'mythic', icon: '⏳' },
      { slot: '鞋子', name: '风行者软靴 +5', rarity: 'rare', icon: '👢' },
    ]),

    inventory: z.array(InventoryItemSchema).default([
      { name: '传说强化石', qty: 12, rarity: 'legendary', icon: '💎' },
      { name: '史诗附魔卷轴', qty: 5, rarity: 'epic', icon: '📜' },
      { name: '怪物图鉴残页', qty: 47, rarity: 'rare', icon: '📄' },
      { name: '艾米莉亚的画像', qty: 1, rarity: 'mythic', icon: '🖼️' },
      { name: '异世界奶茶配方', qty: 1, rarity: 'epic', icon: '🧋' },
      { name: '母亲的眼镜盒', qty: 1, rarity: 'legendary', icon: '👓' },
      { name: '设计草图集', qty: 1, rarity: 'common', icon: '📐' },
      { name: '鲁特琴弦', qty: 3, rarity: 'common', icon: '🎸' },
    ]),

    consumables: z.array(ConsumableSchema).default([
      { name: '高级红色恢复药剂', qty: 25, effect: '恢复HP 500', icon: '🔴' },
      { name: '高级蓝色魔力药剂', qty: 18, effect: '恢复MP 400', icon: '🔵' },
      { name: '绿色解毒剂', qty: 10, effect: '解除中毒', icon: '🟢' },
      { name: '黄色活力药剂', qty: 8, effect: '解除疲劳', icon: '🟡' },
      { name: '复活羽毛', qty: 3, effect: '原地复活', icon: '🪶' },
    ]),

    skills: z.array(SkillSchema).default([
      { name: '命运重掷', type: '主动', cd: '3次/日', desc: '重掷任何随机结果', unlocked: true, icon: '🎲' },
      { name: '虚空收纳', type: '被动', cd: '-', desc: '无限背包空间', unlocked: true, icon: '🎒' },
      { name: '时间回溯', type: '主动', cd: '1小时', desc: '回溯5秒时间', unlocked: true, icon: '⏳' },
      { name: '誓约斩击', type: '主动', cd: '15秒', desc: '基于羁绊造成伤害', unlocked: true, icon: '⚔️' },
      { name: '万灵复制', type: '主动', cd: '30秒', desc: '复制敌人技能', unlocked: true, icon: '📖' },
      { name: '世界存档', type: '主动', cd: '一次性', desc: '存档世界状态', unlocked: true, icon: '🌱' },
      { name: '天选觉醒', type: '终极', cd: '剧情触发', desc: '改写世界规则', unlocked: false, icon: '✨' },
    ]),

    activeQuests: z.array(ActiveQuestSchema).default([
      { name: '【终章】七弦圣琴', grade: 'SSS', progress: 85, desc: '与艾米莉亚共同奏响七弦圣琴，阻止诸神黄昏', icon: '🎵' },
      { name: '【主线】银弦家的复兴', grade: 'S', progress: 60, desc: '收集散落的家族典籍，恢复银弦家声誉', icon: '📚' },
    ]),

    completedQuests: z.array(CompletedQuestSchema).default([
      { name: '时之迷宫探索', grade: 'A', icon: '⏳' },
      { name: '王都地下游击战', grade: 'S', icon: '⚔️' },
      { name: '知识深渊调查', grade: 'A', icon: '📖' },
      { name: '世界树之森修行', grade: 'SS', icon: '🌳' },
      { name: '莫里亚蒂讨伐', grade: 'S', icon: '👹' },
    ]),
  })
  .prefault({});

export type Schema = z.output<typeof Schema>;
