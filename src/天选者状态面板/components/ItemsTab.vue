<template>
  <div>
    <!-- 虚空背包 -->
    <div class="card">
      <div class="card-head">
        <div class="section-title">🎒 虚空背包</div>
        <button class="btn-add" @click="addItem">+ 添加</button>
      </div>
      <div class="inv-grid">
        <div v-for="(item, i) in store.data.inventory" :key="i" class="inv-item" :class="item.rarity">
          <span class="inv-icon">{{ item.icon }}</span>
          <EditableText v-model="item.name" class="inv-name" :class="rarityTextClass[item.rarity] ?? ''" />
          <div class="qty-row">
            <span class="qty-x">x</span>
            <EditableNumber v-model="item.qty" :min="0" class="num-qty" />
          </div>
          <button class="btn-remove-sm" @click="store.data.inventory.splice(i, 1)">✕</button>
        </div>
      </div>
    </div>

    <!-- 消耗品 -->
    <div class="card">
      <div class="section-title">🧪 消耗品</div>
      <div class="cons-list">
        <div v-for="(item, i) in store.data.consumables" :key="i" class="cons-item">
          <span class="cons-icon">{{ item.icon }}</span>
          <div class="cons-body">
            <div class="cons-name">{{ item.name }}</div>
            <div class="cons-effect">{{ item.effect }}</div>
          </div>
          <EditableNumber v-model="item.qty" :min="0" />
          <button class="btn-remove-sm" @click="store.data.consumables.splice(i, 1)">✕</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EditableText from './EditableText.vue';
import EditableNumber from './EditableNumber.vue';
import { useDataStore } from '../store';

const store = useDataStore();

const rarityTextClass: Record<string, string> = {
  mythic: 'c-mythic',
  legendary: 'c-legendary',
  epic: 'c-epic',
  rare: 'c-rare',
  common: 'c-common',
};

function addItem() {
  store.data.inventory.push({ name: '新物品', qty: 1, rarity: 'common', icon: '📦' });
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
.inv-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.inv-item {
  padding: 12px 8px;
  border-radius: 10px;
  text-align: center;
}
.inv-icon {
  font-size: 28px;
  display: block;
  margin-bottom: 4px;
}
.inv-name {
  font-size: 10px;
  font-weight: 600;
  min-width: 40px;
  display: block;
}
.qty-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 2px;
}
.qty-x {
  font-size: 10px;
  color: var(--c-text-dim);
}
:deep(.num-qty) {
  width: 36px;
}
.btn-remove-sm {
  font-size: 9px;
  padding: 2px 6px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: rgba(245, 101, 101, 0.15);
  color: #fc8181;
  margin-top: 4px;
  font-family: inherit;
}
.cons-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.cons-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}
.cons-icon {
  font-size: 20px;
}
.cons-body {
  flex: 1;
}
.cons-name {
  font-size: 12px;
  color: var(--c-text);
}
.cons-effect {
  font-size: 11px;
  color: var(--c-text-dim);
}
/* 品级 */
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
