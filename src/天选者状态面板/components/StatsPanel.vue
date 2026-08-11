<template>
  <div class="card">
    <div class="section-title">
      📊 基础属性
      <span class="hint">(点击数字修改)</span>
    </div>
    <div class="stats-list">
      <div v-for="(s, i) in store.data.stats" :key="i" class="stat-row">
        <span class="stat-icon">{{ s.icon }}</span>
        <span class="stat-name">{{ s.name }}</span>
        <div class="stat-track">
          <div
            class="stat-fill"
            :style="{ width: statPct(s) + '%', background: s.color, boxShadow: '0 0 8px ' + s.color + '40' }"
          ></div>
        </div>
        <EditableNumber v-model="s.value" :min="0" class="num-input" />
        <span class="sep">/</span>
        <EditableNumber v-model="s.max" :min="1" class="num-input" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EditableNumber from './EditableNumber.vue';
import { useDataStore } from '../store';

const store = useDataStore();

function statPct(s: { special?: boolean; value: number; max: number }) {
  if (s.special) return 100;
  return Math.min(100, (s.value / s.max) * 100 || 0);
}
</script>

<style scoped>
.card {
  background: var(--grad-card);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid var(--c-card-border);
  box-shadow: var(--c-card-shadow);
}
.section-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--c-text-bright);
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.hint {
  font-size: 11px;
  color: var(--c-text-dim);
  font-weight: 400;
}
.stats-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.stat-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.stat-icon {
  font-size: 15px;
  width: 22px;
  text-align: center;
}
.stat-name {
  font-size: 12px;
  color: var(--c-text-muted);
  width: 85px;
}
.stat-track {
  flex: 1;
  height: 10px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 5px;
  overflow: hidden;
}
.stat-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.5s ease;
}
.num-input {
  width: 55px;
}
.sep {
  font-size: 11px;
  color: var(--c-text-dim);
}
</style>
