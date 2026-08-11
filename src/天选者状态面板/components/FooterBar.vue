<template>
  <div class="footer">
    <div class="stats-row">
      <div class="stat-block">
        <div class="stat-label">💰 金币</div>
        <EditableNumber v-model="store.data.gold" :min="0" class="stat-value gold" />
      </div>
      <div class="stat-block">
        <div class="stat-label">🏆 成就</div>
        <EditableNumber v-model="store.data.achieve" :min="0" class="stat-value achieve" />
      </div>
      <div class="stat-block">
        <div class="stat-label">👹 Boss</div>
        <EditableNumber v-model="store.data.bossKills" :min="0" class="stat-value boss" />
      </div>
    </div>
    <div class="location-block">
      <div class="stat-label">当前位置</div>
      <EditableText v-model="store.data.location" class="location-value" />
    </div>
  </div>
</template>

<script setup lang="ts">
import EditableText from './EditableText.vue';
import EditableNumber from './EditableNumber.vue';
import { useDataStore } from '../store';

const store = useDataStore();
</script>

<style scoped>
.footer {
  margin-top: 16px;
  background: var(--grad-header);
  border-radius: 20px;
  padding: 18px 24px;
  border: 1px solid var(--c-card-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
}
.stats-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.stat-block {
  text-align: center;
}
.stat-label {
  font-size: 11px;
  color: var(--c-text-dim);
}
.stat-value {
  font-size: 18px;
  font-weight: 700;
  margin-top: 2px;
}
:deep(.gold) {
  color: #ffd54f;
  width: 80px;
}
:deep(.achieve) {
  color: var(--c-accent);
  width: 40px;
}
:deep(.boss) {
  color: #ff6b9d;
  width: 40px;
}
.location-block {
  text-align: right;
}
.location-value {
  font-size: 14px;
  color: var(--c-accent);
  font-weight: 600;
  margin-top: 2px;
  min-width: 150px;
}
</style>
