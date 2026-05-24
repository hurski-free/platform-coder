import type { IEngine } from './engine/IEngine';
import type { IFrameView } from './FrameView';
import type { IGameSession, LevelOutcome } from './GameSession';
import type { ILevel } from './level/ILevel';
import type { IRender } from './render/IRender';
import { BlockBuildTask, isBlockBuildTask } from './tasks/BlockBuildTask';
import {
  BlockSequenceTask,
  isBlockSequenceTask,
} from './tasks/BlockSequenceTask';
import type { PlatformTaskKind } from './tasks/IPlatformTask';
import type { TaskAnswer } from './tasks/IVerify';
import { GameWorld } from './world/GameWorld';

/**
 * non-optimized game class
 * For SoA just use number for indexes
 */
export class Game {
  private readonly world: GameWorld;
  private readonly engine: IEngine;
  private readonly renderer: IRender;
  private readonly frameView: IFrameView;
  private readonly gameSession: IGameSession;

  protected animationFrameId: number = 0;
  protected _prevTimestamp: DOMHighResTimeStamp = 0;

  private readonly hudListeners = new Set<() => void>();
  private lastHudPlatformIndex = -1;
  private lastHudMotion = '';
  private lastHudScore = -1;
  private lastHudLevelComplete = false;
  private lastHudLevelOutcome: LevelOutcome = 'none';

  private readonly level: ILevel;

  constructor(
    world: GameWorld,
    engine: IEngine,
    renderer: IRender,
    frameView: IFrameView,
    gameSession: IGameSession,
    level: ILevel,
  ) {
    this.world = world;
    this.engine = engine;
    this.renderer = renderer;
    this.frameView = frameView;
    this.gameSession = gameSession;
    this.level = level;
  }

  get gameState() {
    return this.gameSession.gameState;
  }

  get score() {
    return this.gameSession.score;
  }

  get taskPrompt(): string {
    return this.world.currentPlatform?.task.prompt ?? '';
  }

  get taskKind(): PlatformTaskKind {
    return this.world.currentPlatform?.task.kind ?? 'text_match';
  }

  getBlockSequenceTask(): BlockSequenceTask | null {
    const task = this.world.currentPlatform?.task;
    if (!task || !isBlockSequenceTask(task)) {
      return null;
    }
    return task;
  }

  getBlockBuildTask(): BlockBuildTask | null {
    const task = this.world.currentPlatform?.task;
    if (!task || !isBlockBuildTask(task)) {
      return null;
    }
    return task;
  }

  get levelOutcome(): LevelOutcome {
    return this.gameSession.levelOutcome;
  }

  get isLevelEnded(): boolean {
    return this.gameSession.levelOutcome !== 'none';
  }

  get canSubmitTask(): boolean {
    return (
      this.gameSession.gameState === 'running' &&
      this.gameSession.levelOutcome === 'none' &&
      this.world.canSubmitTask()
    );
  }

  get isJumping(): boolean {
    return this.world.player.motion === 'jumping';
  }

  get isLevelComplete(): boolean {
    return this.gameSession.levelOutcome === 'won';
  }

  get currentPlatformIndex(): number {
    return this.world.currentPlatformIndex;
  }

  /** Подписка на смену состояния задачи / платформы (для Vue UI) */
  onHudChange(listener: () => void): () => void {
    this.hudListeners.add(listener);
    return () => {
      this.hudListeners.delete(listener);
    };
  }

  private emitHudChange(): void {
    for (const listener of this.hudListeners) {
      listener();
    }
  }

  private syncHudIfChanged(): void {
    const platformIndex = this.world.currentPlatformIndex;
    const motion = this.world.player.motion;
    const score = this.gameSession.score;
    const levelComplete = this.isLevelComplete;
    const levelOutcome = this.gameSession.levelOutcome;

    if (
      platformIndex === this.lastHudPlatformIndex &&
      motion === this.lastHudMotion &&
      score === this.lastHudScore &&
      levelComplete === this.lastHudLevelComplete &&
      levelOutcome === this.lastHudLevelOutcome
    ) {
      return;
    }

    this.lastHudPlatformIndex = platformIndex;
    this.lastHudMotion = motion;
    this.lastHudScore = score;
    this.lastHudLevelComplete = levelComplete;
    this.lastHudLevelOutcome = levelOutcome;
    this.emitHudChange();
  }

  private resetHudTracking(): void {
    this.lastHudPlatformIndex = -1;
    this.lastHudMotion = '';
    this.lastHudScore = -1;
    this.lastHudLevelComplete = false;
    this.lastHudLevelOutcome = 'none';
    this.syncHudIfChanged();
  }

  private endLevel(outcome: 'won' | 'lost'): void {
    if (this.gameSession.levelOutcome !== 'none') {
      return;
    }

    this.gameSession.levelOutcome = outcome;

    if (this.gameSession.gameState === 'running') {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
      this.gameSession.gameState = 'finished';
    }

    this.renderer.render(this.world, this.frameView, this.gameSession);
    this.syncHudIfChanged();
  }

  /** Проверка ответа; при успехе — очки и прыжок; при ошибке — проигрыш */
  submitAnswer(answer: TaskAnswer): boolean {
    if (!this.canSubmitTask) {
      return false;
    }

    if (!this.world.verifyCurrentPlatform(answer)) {
      this.endLevel('lost');
      return false;
    }

    this.world.markCurrentPlatformSolved();
    this.engine.onPlatformSolved(this.world, this.gameSession);

    if (this.world.isOnLastPlatform) {
      this.endLevel('won');
    }

    this.syncHudIfChanged();
    return true;
  }

  start() {
    if (this.gameSession.gameState === 'wait_for_start') {
      this.gameSession.gameState = 'running';
      this.gameSession.score = 0;
      this.gameSession.levelOutcome = 'none';

      this.syncCameraToPlayer();
      this.resetHudTracking();
      this._prevTimestamp = performance.now();
      this.animationFrameId = requestAnimationFrame((now) => this.tick(now));
    }
  }

  tick(now: DOMHighResTimeStamp) {
    if (this.gameSession.gameState === 'running') {
      const deltaTime = now - this._prevTimestamp;
      this._prevTimestamp = now;

      if (deltaTime > 200) {
        this.animationFrameId = requestAnimationFrame((now) => this.tick(now));
      } else {
        this.engine.process(this.world, this.frameView, this.gameSession, deltaTime);
        this.renderer.render(this.world, this.frameView, this.gameSession);
        this.syncHudIfChanged();
        this.animationFrameId = requestAnimationFrame((now) => this.tick(now));
      }
    }
  }

  pause() {
    if (this.gameSession.gameState === 'running') {
      this.gameSession.gameState = 'paused';
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
    }
  }

  resume() {
    if (this.gameSession.gameState === 'paused') {
      this.gameSession.gameState = 'running';

      this._prevTimestamp = performance.now();
      this.animationFrameId = requestAnimationFrame((now) => this.tick(now));
    }
  }

  stop() {
    if (this.gameSession.gameState !== 'wait_for_start') {
      this.gameSession.gameState = 'wait_for_start';
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
      this.gameSession.score = 0;
      this.gameSession.levelOutcome = 'none';
      this.world.clear();
      this.resetHudTracking();
      this.renderer.render(this.world, this.frameView, this.gameSession);
    }
  }

  restart() {
    this.stop();
    this.start();
  }

  /** Новая попытка: пересобрать уровень и начать заново */
  retryLevel(): void {
    if (this.gameSession.gameState === 'running') {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
    }

    this.gameSession.gameState = 'wait_for_start';
    this.gameSession.score = 0;
    this.gameSession.levelOutcome = 'none';

    this.world.buildLevel(this.level);
    this.world.layoutForCanvasWidth(this.frameView.width);
    this.resetHudTracking();
    this.syncCameraToPlayer();
    this.renderer.render(this.world, this.frameView, this.gameSession);
    this.start();
  }

  resizeCanvas(width: number, height: number, cameraSet = false) {
    this.frameView.width = width;
    this.frameView.height = height;
    this.frameView.halfWidth = width / 2;
    this.frameView.halfHeight = height / 2;

    this.world.layoutForCanvasWidth(width);

    if (cameraSet) {
      this.syncCameraToPlayer();
    }
  }

  private syncCameraToPlayer() {
    const player = this.world.player;
    this.frameView.camera[0] = -this.frameView.halfWidth + player.x + player.size / 2;
    this.frameView.camera[1] = -player.y + this.frameView.halfHeight;
  }
}
