<template>
  <div class="container">
    <!-- 顶部标题栏 -->
    <div class="header">
      <div class="header-icon">🎲</div>
      <div class="header-text">
        <div class="header-title">天选者 · 状态面板</div>
        <div class="header-sub">点击蓝色文字编辑</div>
      </div>
    </div>

    <!-- 单栏紧凑布局 -->
    <div class="main-col">
      <CharacterHeader />
      <StatsPanel />
      <PartnerCard />

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
  { id: 'equipment', label: '⚔️装备' },
  { id: 'items', label: '🎒背包' },
  { id: 'skills', label: '✨技能' },
  { id: 'quests', label: '📜任务' },
] as const;

const active_tab = useLocalStorage<string>('rpg_status:active_tab', 'equipment');
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  margin: 0;
}

.header {
  background: var(--grad-header);
  border-radius: 12px;
  padding: 10px 12px;
  margin-bottom: 8px;
  border: 1px solid rgba(45, 53, 97, 0.6);
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  width: 32px;
  height: 32px;
  background: var(--grad-primary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.header-text {
  flex: 1;
  min-width: 0;
}

.header-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--c-text-bright);
  line-height: 1.2;
}

.header-sub {
  font-size: 10px;
  color: var(--c-text-dim);
  margin-top: 2px;
}

.main-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tabs {
  display: flex;
  gap: 2px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  padding: 3px;
}

.tab-btn {
  flex: 1;
  padding: 6px 8px;
  border: none;
  border-radius: 6px;
  font-size: 11px;
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
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}
</style>
