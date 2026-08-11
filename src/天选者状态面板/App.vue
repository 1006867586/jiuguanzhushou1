<template>
  <div class="container">
    <!-- 顶部标题栏 -->
    <div class="header">
      <div class="header-icon">🎲</div>
      <div class="header-text">
        <div class="header-title">天选者 · 实时状态面板</div>
        <div class="header-sub">点击蓝色高亮文字即可编辑 · 数据自动保存</div>
      </div>
    </div>

    <div class="main-grid">
      <!-- 左栏 -->
      <div class="left-col">
        <CharacterHeader />
        <StatsPanel />
        <PartnerCard />
      </div>

      <!-- 右栏 -->
      <div class="right-col">
        <nav class="tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="tab-btn"
            :class="{ active: active_tab === tab.id }"
            @click="active_tab = tab.id"
          >
            {{ tab.label }}
          </button>
        </nav>

        <div v-show="active_tab === 'equipment'"><EquipmentTab /></div>
        <div v-show="active_tab === 'items'"><ItemsTab /></div>
        <div v-show="active_tab === 'skills'"><SkillsTab /></div>
        <div v-show="active_tab === 'quests'"><QuestsTab /></div>
      </div>
    </div>

    <FooterBar />
  </div>
</template>

<script setup lang="ts">
import CharacterHeader from './components/CharacterHeader.vue';
import StatsPanel from './components/StatsPanel.vue';
import PartnerCard from './components/PartnerCard.vue';
import EquipmentTab from './components/EquipmentTab.vue';
import ItemsTab from './components/ItemsTab.vue';
import SkillsTab from './components/SkillsTab.vue';
import QuestsTab from './components/QuestsTab.vue';
import FooterBar from './components/FooterBar.vue';

const tabs = [
  { id: 'equipment', label: '⚔️ 装备' },
  { id: 'items', label: '🎒 背包' },
  { id: 'skills', label: '✨ 技能' },
  { id: 'quests', label: '📜 任务' },
] as const;

const active_tab = useLocalStorage<string>('rpg_status:active_tab', 'equipment');
</script>

<style lang="scss" scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
}

.header {
  background: var(--grad-header);
  border-radius: 20px;
  padding: 20px 24px;
  margin-bottom: 16px;
  border: 1px solid rgba(45, 53, 97, 0.6);
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: var(--grad-primary);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.header-text {
  flex: 1;
}

.header-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--c-text-bright);
}

.header-sub {
  font-size: 11px;
  color: var(--c-text-dim);
}

.main-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 16px;
}

.left-col,
.right-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tabs {
  display: flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 4px;
}

.tab-btn {
  flex: 1;
  padding: 10px 14px;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  background: transparent;
  color: var(--c-text-dim);
  transition: all 0.2s;
  font-family: inherit;
}

.tab-btn:hover {
  color: var(--c-text);
}

.tab-btn.active {
  background: var(--grad-primary);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

@media (max-width: 768px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}
</style>
