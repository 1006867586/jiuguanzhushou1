<template>
  <div>
    <!-- 进行中 -->
    <div class="card">
      <div class="card-head">
        <div class="section-title">📍 进行中</div>
        <button class="btn-add" @click="addQuest">+ 添加</button>
      </div>
      <div class="active-list">
        <div v-for="(q, i) in store.data.activeQuests" :key="i" class="quest-active">
          <div class="quest-head">
            <span class="quest-icon">{{ q.icon }}</span>
            <EditableText v-model="q.name" class="quest-name" />
            <span class="grade-badge">{{ q.grade }}级</span>
            <button class="btn-complete" @click="completeQuest(i)">✓ 完成</button>
            <button class="btn-remove" @click="store.data.activeQuests.splice(i, 1)">✕</button>
          </div>
          <EditableText v-model="q.desc" class="quest-desc" />
          <div class="progress-row">
            <div class="progress-track">
              <div class="progress-fill" :style="{ width: q.progress + '%' }"></div>
            </div>
            <EditableNumber v-model="q.progress" :min="0" :max="100" class="num-progress" />
            <span class="progress-pct">%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 已完成 -->
    <div class="card">
      <div class="section-title">✅ 已完成</div>
      <div class="completed-list">
        <div v-for="(q, i) in store.data.completedQuests" :key="i" class="quest-done">
          <span class="quest-icon-sm">{{ q.icon }}</span>
          <span class="done-name">{{ q.name }}</span>
          <span class="done-grade">{{ q.grade }} ✓</span>
          <button class="btn-undo" @click="uncompleteQuest(i)">↩</button>
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

function addQuest() {
  store.data.activeQuests.push({ name: '新任务', grade: 'C', progress: 0, desc: '任务描述', icon: '📌' });
}

function completeQuest(index: number) {
  const q = store.data.activeQuests.splice(index, 1)[0];
  store.data.completedQuests.push({ name: q.name, grade: q.grade, icon: q.icon });
}

function uncompleteQuest(index: number) {
  const q = store.data.completedQuests.splice(index, 1)[0];
  store.data.activeQuests.push({ name: q.name, grade: q.grade, progress: 100, desc: '', icon: q.icon });
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
.active-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.quest-active {
  padding: 12px;
  border-radius: 10px;
  background: rgba(102, 126, 234, 0.06);
  border: 1px solid rgba(102, 126, 234, 0.2);
}
.quest-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.quest-icon {
  font-size: 20px;
}
.quest-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--c-text);
  flex: 1;
  min-width: 80px;
}
.grade-badge {
  font-size: 10px;
  color: #fc8181;
  background: rgba(245, 101, 101, 0.12);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
}
.btn-complete {
  font-size: 10px;
  padding: 3px 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: rgba(72, 187, 120, 0.15);
  color: #48bb78;
  font-family: inherit;
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
.quest-desc {
  font-size: 11px;
  color: var(--c-text-dim);
  margin-bottom: 8px;
  min-width: 100px;
  display: block;
}
.progress-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.progress-track {
  flex: 1;
  height: 8px;
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
:deep(.num-progress) {
  width: 45px;
}
.progress-pct {
  font-size: 11px;
  color: var(--c-text-dim);
}
.completed-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.quest-done {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
}
.quest-icon-sm {
  font-size: 18px;
}
.done-name {
  font-size: 12px;
  color: #718096;
  flex: 1;
  text-decoration: line-through;
}
.done-grade {
  font-size: 10px;
  color: #48bb78;
  background: rgba(72, 187, 120, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}
.btn-undo {
  font-size: 10px;
  padding: 2px 6px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.06);
  color: var(--c-text-dim);
  font-family: inherit;
}
</style>
