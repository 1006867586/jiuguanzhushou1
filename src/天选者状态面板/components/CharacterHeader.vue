<template>
  <div class="card char-card">
    <div class="avatar">👤</div>
    <EditableText
      v-model="store.data.charName"
      class="char-name"
      :format="formatCharName"
    />
    <div class="char-class">
      Lv.<EditableNumber v-model="store.data.level" :min="0" class="num-sm" />
      <EditableText v-model="store.data.className" class="text-sm" />
    </div>
    <div class="tags">
      <span
        v-for="(tag, i) in store.data.tags"
        :key="i"
        class="tag"
        :style="tagStyle(i)"
      >{{ tag }}</span>
    </div>
    <div class="exp-section">
      <div class="exp-label">
        <span>EXP</span>
        <span>
          <EditableNumber v-model="store.data.expCurrent" :min="0" class="num-md" />
          / <EditableNumber v-model="store.data.expMax" :min="1" class="num-md" />
        </span>
      </div>
      <div class="stat-track">
        <div class="stat-fill exp-fill" :style="{ width: exp_pct + '%' }"></div>
      </div>
      <div class="exp-hint">↑ {{ exp_pct.toFixed(1) }}% — 距离 Lv.{{ store.data.level + 1 }} 还需 {{ Math.max(0, store.data.expMax - store.data.expCurrent) }} EXP</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EditableText from './EditableText.vue';
import EditableNumber from './EditableNumber.vue';
import { useDataStore } from '../store';

const store = useDataStore();

const exp_pct = computed(() => Math.min(100, (store.data.expCurrent / store.data.expMax) * 100 || 0));

function formatCharName(v: string) {
  // 替换酒馆宏 {{user}}
  return substitudeMacros(v || '{{user}}');
}

const tag_styles = [
  { bg: 'rgba(102,126,234,0.15)', color: '#a8b9ff', border: 'rgba(102,126,234,0.3)' },
  { bg: 'rgba(255,193,7,0.12)', color: '#ffd54f', border: 'rgba(255,193,7,0.3)' },
  { bg: 'rgba(72,187,120,0.12)', color: '#68d391', border: 'rgba(72,187,120,0.3)' },
];
function tagStyle(i: number) {
  const s = tag_styles[i % tag_styles.length];
  return { background: s.bg, color: s.color, borderColor: s.border };
}
</script>

<style lang="scss" scoped>
.card {
  background: var(--grad-card);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid var(--c-card-border);
  box-shadow: var(--c-card-shadow);
}

.char-card {
  text-align: center;
  padding: 24px 16px;
}

.avatar {
  width: 110px;
  height: 110px;
  margin: 0 auto 12px;
  background: linear-gradient(135deg, #2d3561, #1e1e3f);
  border-radius: 50%;
  border: 3px solid #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 52px;
}

.char-name {
  display: inline-block;
  font-size: 18px;
  font-weight: 700;
  color: var(--c-text-bright);
  min-width: 80px;
}

.char-class {
  font-size: 13px;
  color: var(--c-accent);
  margin-top: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.text-sm {
  min-width: 60px;
}

.tags {
  display: flex;
  gap: 6px;
  justify-content: center;
  margin-top: 10px;
  flex-wrap: wrap;
}

.tag {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid;
}

.exp-section {
  margin-top: 16px;
}

.exp-label {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--c-text-dim);
  margin-bottom: 4px;
}

.exp-fill {
  background: var(--grad-primary);
}

.exp-hint {
  font-size: 11px;
  color: #ffd54f;
  margin-top: 4px;
  text-align: right;
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

:deep(.num-sm) {
  width: 30px;
}
:deep(.num-md) {
  width: 50px;
}
</style>
