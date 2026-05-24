<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Game from './Game.vue';
import LevelSelector from './LevelSelector.vue';
import { LOCALE_STORAGE_KEY, type SupportedLanguages } from '../i18n';

const { locale, t } = useI18n();

type AppScreen = 'levels' | 'game';

const screen = ref<AppScreen>('levels');
const selectedLevelId = ref<string | null>(null);

function onLocaleChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value as SupportedLanguages;
  locale.value = value;
  localStorage.setItem(LOCALE_STORAGE_KEY, value);
}

function onLevelSelect(levelId: string) {
  selectedLevelId.value = levelId;
  screen.value = 'game';
}

function leaveGame() {
  selectedLevelId.value = null;
  screen.value = 'levels';
}
</script>

<template>
  <main class="main">
    <label v-if="screen !== 'game'" class="locale-switcher">
      <select
        class="locale-select"
        :value="locale"
        :aria-label="t('main.language')"
        @change="onLocaleChange"
      >
        <option value="ru">RU</option>
        <option value="en">EN</option>
      </select>
    </label>

    <LevelSelector v-if="screen === 'levels'" @select="onLevelSelect" />

    <Game
      v-else-if="screen === 'game' && selectedLevelId"
      :key="selectedLevelId"
      :level-id="selectedLevelId"
      @leave="leaveGame"
    />
  </main>
</template>

<style scoped>
.main {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: 100%;
  margin: 0 auto;
  gap: 1.25rem;
}

.locale-switcher {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--muted);
}

.locale-select {
  font: inherit;
  cursor: pointer;
  padding: 0.3rem 0.5rem;
  border-radius: 0.35rem;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
}

.locale-select:hover {
  border-color: var(--accent-dim);
  color: var(--text-h);
}
</style>
