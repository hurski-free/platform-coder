<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ISequenceBlock } from '../game/tasks/BlockSequenceTask';

const props = defineProps<{
  blocks: ISequenceBlock[];
  order: string[];
  disabled?: boolean;
}>();

const emit = defineEmits<{
  'update:order': [order: string[]];
}>();

const { t } = useI18n();

const dragFromIndex = ref<number | null>(null);

function blockText(id: string): string {
  return props.blocks.find((block) => block.id === id)?.text ?? id;
}

function onDragStart(index: number) {
  if (props.disabled) {
    return;
  }
  dragFromIndex.value = index;
}

function onDragEnd() {
  dragFromIndex.value = null;
}

function onDragOver(event: DragEvent) {
  if (props.disabled) {
    return;
  }
  event.preventDefault();
}

function onDrop(dropIndex: number) {
  if (props.disabled) {
    return;
  }

  const fromIndex = dragFromIndex.value;
  if (fromIndex === null || fromIndex === dropIndex) {
    return;
  }

  const next = [...props.order];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(dropIndex, 0, moved);
  emit('update:order', next);
  dragFromIndex.value = null;
}
</script>

<template>
  <div class="block-sequence">
    <p class="block-hint">{{ t('game.blockSequenceHint') }}</p>
    <ul class="block-list" role="list">
      <li
        v-for="(blockId, index) in order"
        :key="blockId"
        class="block-item"
        :class="{
          'block-item--dragging': dragFromIndex === index,
          'block-item--disabled': disabled,
        }"
        :draggable="!disabled"
        @dragstart="onDragStart(index)"
        @dragend="onDragEnd"
        @dragover="onDragOver"
        @drop="onDrop(index)"
      >
        <span class="block-grip" aria-hidden="true">⋮⋮</span>
        <span class="block-text">{{ blockText(blockId) }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.block-sequence {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.block-hint {
  margin: 0;
  font-size: 0.82rem;
  color: var(--muted);
}

.block-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.block-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.55rem;
  border-radius: 0.35rem;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  cursor: grab;
  user-select: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.block-item:hover:not(.block-item--disabled) {
  border-color: var(--accent-dim);
  box-shadow: 0 2px 8px rgba(42, 159, 214, 0.12);
}

.block-item--dragging {
  opacity: 0.55;
  border-style: dashed;
}

.block-item--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.block-grip {
  font-size: 0.75rem;
  color: var(--muted);
  letter-spacing: -0.12em;
  line-height: 1;
}

.block-text {
  flex: 1;
  font-size: 0.92rem;
}
</style>
