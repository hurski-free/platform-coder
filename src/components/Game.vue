<script setup lang="ts">
import { ref, shallowRef, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { i18n } from '../i18n';
import { createGame } from '../game/fabric';
import type { Game } from '../game/Game';
import { getLevelById } from '../levels';

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    levelId: string;
    autoStart?: boolean;
  }>(),
  {
    autoStart: true,
  },
);

const emit = defineEmits<{
  leave: [];
}>();

const rootRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const answerInputRef = ref<HTMLInputElement | null>(null);
const gameRef = shallowRef<Game | null>(null);
const answerInput = ref('');
const taskFeedback = ref<'ok' | 'wrong' | null>(null);
const displayScore = ref(0);
const taskPrompt = ref('');
const canSubmit = ref(false);
const isLevelComplete = ref(false);
const isJumping = ref(false);
const levelOutcome = ref<'none' | 'won' | 'lost'>('none');

let resizeObserver: ResizeObserver | null = null;
let unbindHud: (() => void) | null = null;
let lastHudPlatformIndex = -1;

function bindHud(game: Game) {
  unbindHud?.();
  unbindHud = game.onHudChange(syncHudFromGame);
  syncHudFromGame();
}

function unbindHudListener() {
  unbindHud?.();
  unbindHud = null;
}

async function focusAnswerInputIfNeeded() {
  await nextTick();
  if (levelOutcome.value !== 'none' || !canSubmit.value || isJumping.value) {
    return;
  }
  answerInputRef.value?.focus();
}

function syncHudFromGame() {
  const game = gameRef.value;
  if (!game) {
    taskPrompt.value = '';
    canSubmit.value = false;
    isLevelComplete.value = false;
    isJumping.value = false;
    levelOutcome.value = 'none';
    displayScore.value = 0;
    return;
  }

  const platformIndex = game.currentPlatformIndex;
  const platformChanged = platformIndex !== lastHudPlatformIndex;
  if (platformChanged) {
    lastHudPlatformIndex = platformIndex;
    taskFeedback.value = null;
    answerInput.value = '';
  }

  taskPrompt.value = game.taskPrompt;
  canSubmit.value = game.canSubmitTask;
  isLevelComplete.value = game.isLevelComplete;
  isJumping.value = game.isJumping;
  levelOutcome.value = game.levelOutcome;
  displayScore.value = game.score;

  if (platformChanged) {
    void focusAnswerInputIfNeeded();
  }
}

function applyCanvasSize() {
  const root = rootRef.value;
  const canvas = canvasRef.value;
  if (!root || !canvas) return;

  const w = root.clientWidth;
  const h = root.clientHeight;
  if (w < 1 || h < 1) return;

  canvas.width = w;
  canvas.height = h;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  gameRef.value?.resizeCanvas(w, h, true);
  syncHudFromGame();
}

function initGame() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  gameRef.value?.stop();

  const level = getLevelById(props.levelId);
  if (!level) {
    return;
  }

  const game = createGame(ctx, i18n.global, level);

  setTimeout(() => {
    gameRef.value = game;
    bindHud(game);
    game.resizeCanvas(canvas.width, canvas.height, true);
    answerInput.value = '';
    taskFeedback.value = null;
    lastHudPlatformIndex = -1;
    syncHudFromGame();

    if (props.autoStart) {
      game.start();
    }
  }, 100);
}

function submitAnswer() {
  const game = gameRef.value;
  if (!game || !canSubmit.value || isJumping.value) return;

  const ok = game.submitAnswer(answerInput.value);
  if (ok) {
    taskFeedback.value = 'ok';
    answerInput.value = '';
  }
  syncHudFromGame();
}

function retryLevel() {
  const game = gameRef.value;
  if (!game) return;

  answerInput.value = '';
  taskFeedback.value = null;
  lastHudPlatformIndex = -1;
  game.retryLevel();
  syncHudFromGame();
  void focusAnswerInputIfNeeded();
}

function onAnswerKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault();
    submitAnswer();
  }
}

function teardownGame() {
  unbindHudListener();
  gameRef.value?.stop();
  gameRef.value = null;
  lastHudPlatformIndex = -1;
}

onMounted(() => {
  nextTick(() => {
    resizeObserver = new ResizeObserver(() => {
      applyCanvasSize();
    });

    if (rootRef.value) {
      resizeObserver.observe(rootRef.value);
    }

    initGame();
  });
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
  teardownGame();
});
</script>

<template>
  <div class="game-shell">
    <header class="game-toolbar">
      <button type="button" class="back-btn" @click="emit('leave')">{{ t('game.back') }}</button>
      <span class="score-badge">{{ t('game.score', { score: displayScore }) }}</span>
    </header>

    <div ref="rootRef" class="canvas-wrap">
      <canvas ref="canvasRef" class="game-canvas" />

      <aside v-if="levelOutcome === 'none'" class="task-panel">
        <p class="task-title">{{ t('game.taskTitle') }}</p>
        <p class="task-prompt">{{ taskPrompt }}</p>
        <form class="task-form" @submit.prevent="submitAnswer">
          <input
            ref="answerInputRef"
            v-model="answerInput"
            type="text"
            class="task-input"
            :placeholder="t('game.answerPlaceholder')"
            :disabled="!canSubmit || isJumping"
            autocomplete="off"
            @keydown="onAnswerKeydown"
          />
          <button
            type="submit"
            class="task-submit"
            :disabled="!canSubmit || isJumping || !answerInput.trim()"
          >
            {{ t('game.submit') }}
          </button>
        </form>
      </aside>

      <div v-if="levelOutcome !== 'none'" class="result-overlay" role="dialog" aria-modal="true">
        <div class="result-dialog">
          <h2 class="result-title">
            {{ levelOutcome === 'won' ? t('game.winTitle') : t('game.loseTitle') }}
          </h2>
          <p class="result-score">{{ t('game.finalScore', { score: displayScore }) }}</p>
          <p class="result-message">
            {{ levelOutcome === 'won' ? t('game.winMessage') : t('game.loseMessage') }}
          </p>
          <div class="result-actions">
            <button
              v-if="levelOutcome === 'lost'"
              type="button"
              class="result-btn result-btn-primary"
              @click="retryLevel"
            >
              {{ t('game.retry') }}
            </button>
            <button type="button" class="result-btn" @click="emit('leave')">
              {{ t('game.backToLevels') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-shell {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  gap: 0.75rem;
}

.game-toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.back-btn,
.toolbar-btn {
  font: inherit;
  cursor: pointer;
  padding: 0.35rem 0.75rem;
  border-radius: 0.35rem;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
}

.back-btn:hover,
.toolbar-btn:hover:not(:disabled) {
  border-color: var(--accent-dim);
  color: var(--text-h);
}

.toolbar-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.score-badge {
  margin-left: auto;
  font-size: 0.95rem;
  color: var(--accent-dim);
  font-weight: 600;
}

.canvas-wrap {
  position: relative;
  flex: 1;
  max-height: calc(100vh - 4rem);
  min-width: 640px;
  min-height: 480px;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  background: var(--input-bg);
  overflow: hidden;
}

.game-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.task-panel {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  width: min(320px, calc(100% - 2rem));
  padding: 1rem 1.1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--surface) 92%, transparent);
  backdrop-filter: blur(6px);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.task-title {
  margin: 0;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted);
}

.task-prompt {
  margin: 0;
  font-size: 1rem;
  color: var(--text-h);
  line-height: 1.35;
}

.task-form {
  display: flex;
  gap: 0.5rem;
}

.task-input {
  flex: 1;
  font: inherit;
  padding: 0.4rem 0.55rem;
  border-radius: 0.35rem;
  border: 1px solid var(--border);
  background: var(--input-bg);
  color: var(--text);
}

.task-input:focus {
  outline: none;
  border-color: var(--accent-dim);
}

.task-submit {
  font: inherit;
  cursor: pointer;
  padding: 0.4rem 0.75rem;
  border-radius: 0.35rem;
  border: 1px solid color-mix(in srgb, var(--accent) 55%, var(--border));
  background: color-mix(in srgb, var(--accent) 18%, var(--surface));
  color: var(--text-h);
}

.task-submit:hover:not(:disabled) {
  background: color-mix(in srgb, var(--accent) 28%, var(--surface));
}

.task-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.task-wrong {
  margin: 0;
  font-size: 0.85rem;
  color: var(--danger);
}

.result-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: color-mix(in srgb, var(--bg) 55%, transparent);
  backdrop-filter: blur(4px);
}

.result-dialog {
  width: min(360px, 100%);
  padding: 1.35rem 1.5rem;
  border-radius: 0.6rem;
  border: 1px solid var(--border);
  background: var(--surface);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-shadow: 0 12px 32px rgba(30, 80, 120, 0.18);
}

.result-title {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-h);
}

.result-score {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--accent-dim);
}

.result-message {
  margin: 0;
  font-size: 0.92rem;
  color: var(--muted);
  line-height: 1.4;
}

.result-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.result-btn {
  font: inherit;
  cursor: pointer;
  padding: 0.45rem 0.9rem;
  border-radius: 0.35rem;
  border: 1px solid var(--border);
  background: var(--input-bg);
  color: var(--text);
}

.result-btn:hover {
  border-color: var(--accent-dim);
  color: var(--text-h);
}

.result-btn-primary {
  border-color: color-mix(in srgb, var(--accent) 55%, var(--border));
  background: color-mix(in srgb, var(--accent) 18%, var(--surface));
  color: var(--text-h);
}

.result-btn-primary:hover {
  background: color-mix(in srgb, var(--accent) 28%, var(--surface));
}
</style>
