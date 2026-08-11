<template>
  <div class="card">
    <div class="card-head">
      <div class="section-title">🌟 技能树</div>
      <button class="btn-add" @click="addSkill">+ 添加</button>
    </div>
    <div class="skill-list">
      <div
        v-for="(s, i) in store.data.skills"
        :key="i"
        class="skill-item"
        :class="{ locked: !s.unlocked }"
      >
        <span class="skill-icon">{{ s.icon }}</span>
        <div class="skill-body">
          <div class="skill-head">
            <EditableText v-model="s.name" class="skill-name" :style="{ color: s.unlocked ? '#e2e8f0' : '#4a5568' }" />
            <span class="type-badge">{{ s.type }}</span>
            <button class="btn-toggle" :class="{ on: s.unlocked }" @click="s.unlocked = !s.unlocked">
              {{ s.unlocked ? '✓ 已解锁' : '🔒 未解锁' }}
            </button>
          </div>
          <EditableText v-model="s.desc" class="skill-desc" />
        </div>
        <div class="cd-block">
          <div class="cd-label">CD</div>
          <EditableText v-model="s.cd" class="cd-value" :style="{ color: s.unlocked ? '#a8d8ea' : '#4a5568' }" />
        </div>
        <button class="btn-remove" @click="store.data.skills.splice(i, 1)">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EditableText from './EditableText.vue';
import { useDataStore } from '../store';

const store = useDataStore();

function addSkill() {
  store.data.skills.push({ name: '新技能', type: '主动', cd: '-', desc: '技能描述', unlocked: false, icon: '✨' });
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
.skill-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.skill-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
}
.skill-item.locked {
  opacity: 0.5;
}
.skill-icon {
  font-size: 28px;
  width: 40px;
  text-align: center;
}
.skill-body {
  flex: 1;
}
.skill-head {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.skill-name {
  font-size: 14px;
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
.btn-toggle {
  font-size: 10px;
  padding: 2px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  background: rgba(255, 255, 255, 0.04);
  color: #718096;
}
.btn-toggle.on {
  background: rgba(72, 187, 120, 0.1);
  color: #48bb78;
}
.skill-desc {
  font-size: 11px;
  color: var(--c-text-dim);
  margin-top: 2px;
  min-width: 100px;
  display: block;
}
.cd-block {
  text-align: right;
}
.cd-label {
  font-size: 10px;
  color: var(--c-text-dim);
}
.cd-value {
  font-size: 13px;
  font-weight: 600;
  min-width: 40px;
}
.btn-remove {
  font-size: 10px;
  padding: 3px 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: rgba(245, 101, 101, 0.15);
  color: #fc8181;
  font-family: inherit;
}
</style>
