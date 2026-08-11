<template>
  <div class="card">
    <div class="section-title">💕 羁绊伙伴</div>
    <div class="partner">
      <div class="partner-avatar">🎵</div>
      <div class="partner-info">
        <div class="partner-name">艾米莉亚</div>
        <div class="partner-class">
          Lv.<EditableNumber v-model="store.data.partnerLevel" :min="0" class="num-xs" />
          圣音使徒(准)
        </div>
        <div class="bond">
          <div class="bond-label">
            ❤️ 羁绊 Lv.<EditableNumber v-model="store.data.bondLevel" :min="0" class="num-xs" />
          </div>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: bond_pct + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EditableNumber from './EditableNumber.vue';
import { useDataStore } from '../store';

const store = useDataStore();
const bond_pct = computed(() => Math.min(100, (store.data.bondLevel / 10) * 100));
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
}
.partner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: rgba(168, 216, 234, 0.04);
  border-radius: 12px;
  border: 1px solid rgba(168, 216, 234, 0.1);
}
.partner-avatar {
  width: 44px;
  height: 44px;
  background: var(--grad-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}
.partner-info {
  flex: 1;
}
.partner-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--c-text-bright);
}
.partner-class {
  font-size: 11px;
  color: var(--c-accent);
  display: flex;
  align-items: center;
  gap: 4px;
}
.bond {
  margin-top: 4px;
}
.bond-label {
  font-size: 11px;
  color: #ff6b9d;
  display: flex;
  align-items: center;
  gap: 4px;
}
.progress-track {
  height: 5px;
  margin-top: 2px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--grad-primary);
  border-radius: 4px;
  transition: width 0.5s ease;
}
:deep(.num-xs) {
  width: 24px;
}
</style>
