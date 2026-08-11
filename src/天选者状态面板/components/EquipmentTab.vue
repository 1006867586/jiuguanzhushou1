<template>
  <div>
    <!-- 神话装备 -->
    <div class="card">
      <div class="card-head">
        <div class="section-title">🔥 神话装备</div>
        <button class="btn-add" @click="addMythic">+ 添加</button>
      </div>
      <div class="mythic-list">
        <div
          v-for="(item, i) in store.data.mythicItems"
          :key="i"
          class="mythic-item"
          :class="[item.rarity, { inactive: !item.active }]"
        >
          <span class="item-icon-lg">{{ item.icon }}</span>
          <div class="item-body">
            <div class="item-head">
              <EditableText v-model="item.name" class="item-name" :class="rarityTextClass[item.rarity] ?? ''" />
              <span class="type-badge">{{ item.type }}</span>
              <span v-if="item.holder" class="holder">👤 {{ item.holder }}</span>
            </div>
            <EditableText v-model="item.desc" class="item-desc" />
          </div>
          <button class="btn-toggle" :class="{ on: item.active }" @click="item.active = !item.active">
            {{ item.active ? '● 已激活' : '○ 未激活' }}
          </button>
          <button class="btn-remove" @click="store.data.mythicItems.splice(i, 1)">✕</button>
        </div>
      </div>
    </div>

    <!-- 当前装备 -->
    <div class="card">
      <div class="section-title">🛡️ 当前装备</div>
      <div class="equip-grid">
        <div v-for="(item, i) in store.data.currentEquip" :key="i" :class="item.rarity" class="equip-slot">
          <div class="slot-name">{{ item.slot }}</div>
          <div class="slot-icon">{{ item.icon }}</div>
          <EditableText v-model="item.name" class="equip-name" :class="rarityTextClass[item.rarity] ?? ''" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EditableText from './EditableText.vue';
import { useDataStore } from '../store';

const store = useDataStore();

const rarityTextClass: Record<string, string> = {
  mythic: 'c-mythic',
  legendary: 'c-legendary',
  epic: 'c-epic',
  rare: 'c-rare',
  common: 'c-common',
};

function addMythic() {
  store.data.mythicItems.push({
    name: '新装备',
    type: '饰品',
    rarity: 'mythic',
    desc: '描述',
    icon: '✨',
    active: true,
  });
}
</script>

<style scoped>
.card {
  background: var(--grad-card);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid var(--c-card-border);
  box-shadow: var(--c-card-shadow);
  margin-bottom: 14px;
}
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
.section-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--c-text-bright);
  margin: 0;
}
.btn-add {
  padding: 5px 12px;
  font-size: 11px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.08);
  color: var(--c-text-muted);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-family: inherit;
}
.btn-add:hover {
  background: rgba(255, 255, 255, 0.12);
  color: var(--c-text);
}
.mythic-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.mythic-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--c-mythic-bg);
  border: 1px solid var(--c-mythic-border);
}
.mythic-item.inactive {
  opacity: 0.5;
}
.item-icon-lg {
  font-size: 26px;
  width: 36px;
  text-align: center;
}
.item-body {
  flex: 1;
}
.item-head {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.item-name {
  font-size: 13px;
  font-weight: 600;
  min-width: 60px;
}
.type-badge {
  font-size: 10px;
  color: var(--c-text-dim);
  background: rgba(255, 255, 255, 0.06);
  padding: 1px 6px;
  border-radius: 4px;
}
.holder {
  font-size: 10px;
  color: var(--c-accent);
}
.item-desc {
  font-size: 11px;
  color: var(--c-text-dim);
  margin-top: 2px;
  min-width: 100px;
  display: block;
}
.btn-toggle {
  font-size: 11px;
  padding: 4px 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.06);
  color: #718096;
}
.btn-toggle.on {
  background: rgba(72, 187, 120, 0.15);
  color: #48bb78;
}
.btn-remove {
  font-size: 11px;
  padding: 4px 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: rgba(245, 101, 101, 0.15);
  color: #fc8181;
  margin-left: 4px;
  font-family: inherit;
}
.equip-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.equip-slot {
  padding: 12px 8px;
  border-radius: 10px;
  text-align: center;
}
.slot-name {
  font-size: 11px;
  color: var(--c-text-dim);
  margin-bottom: 4px;
}
.slot-icon {
  font-size: 28px;
  margin-bottom: 4px;
}
.equip-name {
  font-size: 11px;
  font-weight: 600;
  min-width: 60px;
}
/* 品级背景与文字色 */
.mythic { background: var(--c-mythic-bg); border: 1px solid var(--c-mythic-border); }
.legendary { background: var(--c-legendary-bg); border: 1px solid var(--c-legendary-border); }
.epic { background: var(--c-epic-bg); border: 1px solid var(--c-epic-border); }
.rare { background: var(--c-rare-bg); border: 1px solid var(--c-rare-border); }
.common { background: var(--c-common-bg); border: 1px solid var(--c-common-border); }
.c-mythic { color: var(--c-mythic); }
.c-legendary { color: var(--c-legendary); }
.c-epic { color: var(--c-epic); }
.c-rare { color: var(--c-rare); }
.c-common { color: var(--c-common); }
</style>
