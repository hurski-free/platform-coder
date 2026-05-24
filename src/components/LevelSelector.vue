<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { levelDefinitions } from '../levels';

const { t } = useI18n();

const emit = defineEmits<{
  select: [levelId: string];
}>();

const levels = computed(() =>
  levelDefinitions.map((def) => ({
    id: def.id,
    title: t(def.titleKey),
    description: def.descriptionKey ? t(def.descriptionKey) : '',
    platformCount: def.getLevel().platforms.length,
  })),
);
</script>

<template>
  <div class="level-selector">
    <header class="level-selector-header">
      <h1 class="level-selector-title">{{ t('main.title') }}</h1>
      <p class="level-selector-lead">{{ t('main.lead') }}</p>
      <h2 class="level-selector-subtitle">{{ t('levels.title') }}</h2>
    </header>

    <ul v-if="levels.length > 0" class="level-list">
      <li v-for="level in levels" :key="level.id" class="level-card">
        <h2 class="level-card-title">{{ level.title }}</h2>
        <p v-if="level.description" class="level-card-desc">{{ level.description }}</p>
        <p class="level-card-meta">
          {{ t('levels.platformCount', { count: level.platformCount }) }}
        </p>
        <button type="button" class="level-play-btn" @click="emit('select', level.id)">
          {{ t('levels.play') }}
        </button>
      </li>
    </ul>

    <p v-else class="level-empty">{{ t('levels.empty') }}</p>
  </div>
</template>

<style scoped>
.level-selector {
  max-width: 42rem;
  width: 100%;
  margin: 0 auto;
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.level-selector-header {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.level-selector-title {
  margin: 0;
  font-size: 1.65rem;
}

.level-selector-lead {
  margin: 0;
  color: var(--muted);
  font-size: 0.95rem;
}

.level-selector-subtitle {
  margin: 0.5rem 0 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-h);
}

.level-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.level-card {
  padding: 1.1rem 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  background: var(--surface);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.level-card-title {
  margin: 0;
  font-size: 1.1rem;
}

.level-card-desc {
  margin: 0;
  font-size: 0.92rem;
  color: var(--muted);
  line-height: 1.4;
}

.level-card-meta {
  margin: 0;
  font-size: 0.82rem;
  color: var(--accent-dim);
}

.level-play-btn {
  align-self: flex-start;
  margin-top: 0.25rem;
  font: inherit;
  cursor: pointer;
  padding: 0.45rem 1rem;
  border-radius: 0.35rem;
  border: 1px solid color-mix(in srgb, var(--accent) 55%, var(--border));
  background: color-mix(in srgb, var(--accent) 18%, var(--surface));
  color: var(--text-h);
}

.level-play-btn:hover {
  background: color-mix(in srgb, var(--accent) 28%, var(--surface));
}

.level-empty {
  margin: 0;
  color: var(--muted);
  font-size: 0.95rem;
}
</style>
