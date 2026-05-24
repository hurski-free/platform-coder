import {
  PLATFORM_HEIGHT,
  PLATFORM_HORIZONTAL_STEP,
  PLATFORM_VERTICAL_GAP,
  PLATFORM_WIDTH,
} from '../constants';
import type { ILevel } from '../level/ILevel';
import { createTask } from '../tasks/task-fabric';
import type { IWorld } from './IWorld';
import { Platform } from './Platform';
import { Player } from './Player';

export interface IWorldCreateConfig {
  /** Базовая X первой платформы; по умолчанию центрируется относительно canvas при reset */
  startX?: number;
  /** Y нижней платформы */
  startY?: number;
}

export class GameWorld implements IWorld {
  readonly player = new Player();
  private _platforms: Platform[] = [];

  private readonly startX: number | undefined;
  private readonly startY: number;

  constructor(cfg: IWorldCreateConfig) {
    this.startX = cfg.startX;
    this.startY = cfg.startY ?? 100;
  }

  get currentPlatform(): Platform | null {
    return this.platforms[this.player.platformIndex] ?? null;
  }

  get currentPlatformIndex(): number {
    return this.player.platformIndex;
  }

  get hasNextPlatform(): boolean {
    return this.player.platformIndex < this.platforms.length - 1;
  }

  get isOnLastPlatform(): boolean {
    return this.player.platformIndex >= this.platforms.length - 1;
  }

  get platforms(): Readonly<Platform[]> {
    return this._platforms;
  }

  canSubmitTask(): boolean {
    const platform = this.currentPlatform;

    return (
      platform !== null &&
      !platform.solved &&
      this.player.motion === 'grounded'
    );
  }

  verifyCurrentPlatform(answer: string): boolean {
    const platform = this.currentPlatform;
    if (!platform || platform.solved) {
      return false;
    }
    return platform.verify(answer);
  }

  markCurrentPlatformSolved(): void {
    this.currentPlatform?.markSolved();
  }

  beginJumpToNext(): boolean {
    if (!this.hasNextPlatform || this.player.motion !== 'grounded') {
      return false;
    }

    const current = this.platforms[this.player.platformIndex];
    if (!current.solved) {
      return false;
    }

    const nextIndex = this.player.platformIndex + 1;
    this.player.jumpTargetIndex = nextIndex;
    this.player.motion = 'jumping';
    return true;
  }

  completeJumpLanding(): void {
    const targetIndex = this.player.jumpTargetIndex;
    if (targetIndex < 0) {
      return;
    }

    this.player.platformIndex = targetIndex;
    this.snapPlayerToPlatform(targetIndex);
    this.player.motion = 'grounded';
    this.player.jumpTargetIndex = -1;
    this.player.vx = 0;
    this.player.vy = 0;
  }

  snapPlayerToPlatform(index: number): void {
    const platform = this.platforms[index];
    if (!platform) {
      return;
    }

    this.player.x = platform.x + (platform.width - this.player.size) / 2;
    this.player.y = platform.y - this.player.size;
  }

  resetPlayerToPlatform(index: number): void {
    this.player.platformIndex = index;
    this.player.jumpTargetIndex = -1;
    this.player.motion = 'grounded';
    this.player.vx = 0;
    this.player.vy = 0;
    this.snapPlayerToPlatform(index);
  }

  clear(): void {
    for (const platform of this.platforms) {
      platform.solved = false;
    }
    this.resetPlayerToPlatform(0);
  }

  freeMemory(): void {
    this._platforms = [];
    this.player.reset();
  }

  buildLevel(level: ILevel): void {
    let baseX = this.startX ?? 200;
    let y = this.startY;

    const platforms = level.platforms.map((platform) => {
      const task = createTask(platform);
      return new Platform(0, 0, PLATFORM_WIDTH, PLATFORM_HEIGHT, task);
    });
    this.shufflePlatforms(platforms);

    platforms.forEach((p, index) => {
      p.x = baseX;
      p.y = y;
      baseX += index % 2 === 0 ? -PLATFORM_HORIZONTAL_STEP : PLATFORM_HORIZONTAL_STEP;
      y -= PLATFORM_VERTICAL_GAP;
    });

    this._platforms = platforms;
    this.resetPlayerToPlatform(0);
  }

  /** Центрирование уровня по ширине canvas */
  layoutForCanvasWidth(canvasWidth: number): void {
    if (this.platforms.length === 0) {
      return;
    }

    let minX = this.platforms[0].x;
    let maxX = this.platforms[0].x + this.platforms[0].width;

    for (const p of this.platforms) {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x + p.width);
    }

    const levelWidth = maxX - minX;
    const offsetX = (canvasWidth - levelWidth) / 2 - minX;

    for (const p of this.platforms) {
      p.x += offsetX;
    }

    this.snapPlayerToPlatform(this.player.platformIndex);
  }

  shufflePlatforms(platforms: Platform[]): void {
    for (let i = platforms.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // swap platforms[i] and platforms[j] with destructuring assignment
      [platforms[i], platforms[j]] = [platforms[j], platforms[i]];
    }
  }
}
