<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ISequenceBlock } from '../game/tasks/sequence-blocks';

type DragSource =
  | { zone: 'pool'; id: string }
  | { zone: 'answer'; index: number };

const props = defineProps<{
  blocks: ISequenceBlock[];
  poolIds: string[];
  buildOrder: string[];
  saveSequence?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  'update:buildOrder': [order: string[]];
}>();

const { t } = useI18n();

const dragSource = ref<DragSource | null>(null);

const poolBlocks = computed(() =>
  props.poolIds
    .filter((id) => !props.buildOrder.includes(id))
    .map((id) => props.blocks.find((block) => block.id === id))
    .filter((block): block is ISequenceBlock => block != null),
);

function blockText(id: string): string {
  return props.blocks.find((block) => block.id === id)?.text ?? id;
}

function onDragStart(source: DragSource) {
  if (props.disabled) {
    return;
  }
  dragSource.value = source;
}

function onDragEnd() {
  dragSource.value = null;
}

function onDragOver(event: DragEvent) {
  if (props.disabled) {
    return;
  }
  event.preventDefault();
}

function insertAt(order: string[], index: number, id: string): string[] {
  const next = [...order];
  next.splice(index, 0, id);
  return next;
}

function onDropAnswer(dropIndex: number) {
  if (props.disabled) {
    return;
  }

  const source = dragSource.value;
  if (!source) {
    return;
  }

  let next = [...props.buildOrder];

  if (source.zone === 'pool') {
    if (next.includes(source.id)) {
      return;
    }
    next = insertAt(next, dropIndex, source.id);
  } else {
    const [moved] = next.splice(source.index, 1);
    const targetIndex = source.index < dropIndex ? dropIndex - 1 : dropIndex;
    next = insertAt(next, targetIndex, moved);
  }

  emit('update:buildOrder', next);
  dragSource.value = null;
}

function onDropPool() {
  if (props.disabled) {
    return;
  }

  const source = dragSource.value;
  if (!source || source.zone !== 'answer') {
    return;
  }

  const next = [...props.buildOrder];
  next.splice(source.index, 1);
  emit('update:buildOrder', next);
  dragSource.value = null;
}

function appendFromPool(id: string) {
  if (props.disabled || props.buildOrder.includes(id)) {
    return;
  }
  emit('update:buildOrder', [...props.buildOrder, id]);
}

function removeFromAnswer(index: number) {
  if (props.disabled) {
    return;
  }
  const next = [...props.buildOrder];
  next.splice(index, 1);
  emit('update:buildOrder', next);
}
</script>

<template>
  <div class="block-build">
    <p class="block-hint">{{ t('game.blockBuildHint') }}</p>
    <p v-if="saveSequence" class="block-saved-hint">{{ t('game.blockBuildSaveHint') }}</p>

    <section class="block-zone">
      <h3 class="zone-title">
        {{ t('game.blockBuildYour') }}
      </h3>
      <ul
        v-if="buildOrder.length > 0"
        class="block-list"
        role="list"
        @dragover="onDragOver"
        @drop="onDropAnswer(buildOrder.length)"
      >
        <li
          v-for="(blockId, index) in buildOrder"
          :key="`answer-${blockId}-${index}`"
          class="block-item block-item--answer"
          :class="{ 'block-item--disabled': disabled }"
          :draggable="!disabled"
          @dragstart="onDragStart({ zone: 'answer', index })"
          @dragend="onDragEnd"
          @dragover="onDragOver"
          @drop.stop="onDropAnswer(index)"
        >
          <span class="block-grip" aria-hidden="true">⋮⋮</span>
          <span class="block-text">{{ blockText(blockId) }}</span>
          <button
            type="button"
            class="block-remove"
            :disabled="disabled"
            :aria-label="t('game.blockBuildRemove')"
            @click="removeFromAnswer(index)"
          >
            ×
          </button>
        </li>
      </ul>
      <p
        v-else
        class="zone-empty"
        @dragover="onDragOver"
        @drop="onDropAnswer(0)"
      >
        {{ t('game.blockBuildDropHere') }}
      </p>
    </section>

    <section
      class="block-zone block-zone--pool"
      @dragover="onDragOver"
      @drop="onDropPool"
    >
      <h3 class="zone-title">{{ t('game.blockBuildPool') }}</h3>
      <ul v-if="poolBlocks.length > 0" class="block-list block-list--pool" role="list">
        <li
          v-for="block in poolBlocks"
          :key="`pool-${block.id}`"
          class="block-item block-item--pool"
          :class="{ 'block-item--disabled': disabled }"
          :draggable="!disabled"
          @dragstart="onDragStart({ zone: 'pool', id: block.id })"
          @dragend="onDragEnd"
          @dblclick="appendFromPool(block.id)"
        >
          <span class="block-grip" aria-hidden="true">⋮⋮</span>
          <span class="block-text">{{ block.text }}</span>
        </li>
      </ul>
      <p v-else class="zone-empty zone-empty--muted">{{ t('game.blockBuildPoolEmpty') }}</p>
    </section>
  </div>
</template>

<style scoped>
.block-build {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.block-hint {
  margin: 0;
  font-size: 0.82rem;
  color: var(--muted);
}

.block-saved-hint {
  margin: 0;
  font-size: 0.78rem;
  color: var(--accent-dim);
}

.block-zone {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.block-zone--pool {
  padding: 0.5rem;
  border-radius: 0.35rem;
  border: 1px dashed var(--border);
  background: color-mix(in srgb, var(--input-bg) 80%, transparent);
  min-height: 3rem;
}

.zone-title {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.zone-empty {
  margin: 0;
  padding: 0.5rem;
  font-size: 0.85rem;
  color: var(--muted);
  border-radius: 0.35rem;
  border: 1px dashed color-mix(in srgb, var(--border) 80%, transparent);
  text-align: center;
}

.zone-empty--muted {
  border: none;
  padding: 0.25rem;
}

.block-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.block-list--pool {
  flex-direction: row;
  flex-wrap: wrap;
}

.block-item {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 0.5rem;
  border-radius: 0.35rem;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  cursor: grab;
  user-select: none;
}

.block-item--pool {
  flex: 0 1 auto;
}

.block-item--answer {
  cursor: grab;
}

.block-item:hover:not(.block-item--disabled) {
  border-color: var(--accent-dim);
  box-shadow: 0 2px 8px rgba(42, 159, 214, 0.1);
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
  font-size: 0.9rem;
}

.block-remove {
  font: inherit;
  line-height: 1;
  padding: 0 0.35rem;
  border: none;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  font-size: 1.1rem;
}

.block-remove:hover:not(:disabled) {
  color: var(--danger);
}

.block-remove:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
