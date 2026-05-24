import type { Translator } from '../../i18n';
import {
  CLOUD_PARALLAX_X,
  CLOUD_PARALLAX_Y,
  COLOR_HUD_TEXT,
  COLOR_PLATFORM,
  COLOR_PLATFORM_ACTIVE,
  COLOR_PLATFORM_SOLVED,
  COLOR_PLAYER,
  COLOR_PLAYER_JUMPING,
  COLOR_SKY_BOTTOM,
  COLOR_SKY_TOP,
  PLAYER_SIZE,
} from '../constants';
import type { ImmutableFrameView } from '../FrameView';
import type { ImmutableGameSession } from '../GameSession';
import { PI_MUL_2 } from '../math';
import { GameWorld } from '../world/GameWorld';
import { Platform } from '../world/Platform';
import type { IRender } from './IRender';

interface IRenderCreateConfig {
  ctx: CanvasRenderingContext2D;
  translator: Translator;
}

interface CloudAnchor {
  x: number;
  y: number;
  scale: number;
}

/** Позиции облаков (доли ширины/высоты экрана) */
const CLOUD_ANCHORS: CloudAnchor[] = [
  { x: 0.08, y: 0.14, scale: 1.05 },
  { x: 0.38, y: 0.08, scale: 0.85 },
  { x: 0.72, y: 0.18, scale: 1.15 },
  { x: 0.22, y: 0.32, scale: 0.75 },
  { x: 0.58, y: 0.28, scale: 0.95 },
  { x: 0.88, y: 0.1, scale: 0.7 },
  { x: 0.5, y: 0.42, scale: 0.65 },
];

export class Render implements IRender {
  private readonly ctx: CanvasRenderingContext2D;
  readonly translator: Translator;

  constructor(cfg: IRenderCreateConfig) {
    this.ctx = cfg.ctx;
    this.translator = cfg.translator;
  }

  render(world: GameWorld, frameView: ImmutableFrameView, session: ImmutableGameSession): void {
    const { ctx } = this;
    const { width, height } = frameView;

    this.drawBackground(ctx, width, height);
    this.drawClouds(ctx, width, height, frameView.camera[0], frameView.camera[1]);

    ctx.save();
    ctx.translate(frameView.camera[0], frameView.camera[1]);

    for (let i = 0; i < world.platforms.length; i++) {
      this.drawPlatform(ctx, world.platforms[i], i === world.currentPlatformIndex);
    }

    this.drawPlayer(ctx, world);
    ctx.restore();

    this.drawHud(ctx, frameView, session);
  }

  private drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, COLOR_SKY_TOP);
    gradient.addColorStop(1, COLOR_SKY_BOTTOM);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  private drawClouds(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    cameraX: number,
    cameraY: number,
  ): void {
    const offsetX = cameraX * CLOUD_PARALLAX_X;
    const offsetY = cameraY * CLOUD_PARALLAX_Y;

    for (const anchor of CLOUD_ANCHORS) {
      const baseX = anchor.x * width;
      const baseY = anchor.y * height;
      const x = baseX - offsetX;
      const y = baseY + offsetY;
      this.drawCloud(ctx, x, y, anchor.scale);
    }
  }

  private drawCloud(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    scale: number,
  ): void {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.shadowColor = 'rgba(120, 170, 210, 0.35)';
    ctx.shadowBlur = 12 * scale;
    ctx.shadowOffsetY = 4 * scale;

    const blobs = [
      { dx: 0, dy: 0, rx: 42, ry: 20 },
      { dx: 28, dy: -6, rx: 34, ry: 22 },
      { dx: -26, dy: 2, rx: 30, ry: 18 },
      { dx: 14, dy: 8, rx: 36, ry: 16 },
    ];

    for (const blob of blobs) {
      ctx.beginPath();
      ctx.ellipse(
        centerX + blob.dx * scale,
        centerY + blob.dy * scale,
        blob.rx * scale,
        blob.ry * scale,
        0,
        0,
        PI_MUL_2,
      );
      ctx.fill();
    }

    ctx.restore();
  }

  private drawPlatform(ctx: CanvasRenderingContext2D, platform: Platform, isCurrent: boolean): void {
    if (platform.solved) {
      ctx.fillStyle = COLOR_PLATFORM_SOLVED;
    } else if (isCurrent) {
      ctx.fillStyle = COLOR_PLATFORM_ACTIVE;
    } else {
      ctx.fillStyle = COLOR_PLATFORM;
    }

    const radius = 4;
    const { x, y, width, height } = platform;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  private drawPlayer(ctx: CanvasRenderingContext2D, world: GameWorld): void {
    const { player } = world;
    ctx.fillStyle = player.motion === 'grounded' ? COLOR_PLAYER : COLOR_PLAYER_JUMPING;
    ctx.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);

    ctx.strokeStyle = 'rgba(30, 60, 90, 0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(player.x + 1, player.y + 1, PLAYER_SIZE - 2, PLAYER_SIZE - 2);
  }

  private drawHud(
    ctx: CanvasRenderingContext2D,
    frameView: ImmutableFrameView,
    session: ImmutableGameSession,
  ): void {
    const label = this.translator.t('game.score', { score: session.score });
    ctx.font = '600 18px system-ui, sans-serif';
    ctx.fillStyle = COLOR_HUD_TEXT;
    ctx.fillText(label, 16, 32);

    if (session.gameState === 'paused') {
      const paused = this.translator.t('game.paused');
      ctx.font = '600 22px system-ui, sans-serif';
      ctx.fillStyle = 'rgba(30, 58, 82, 0.75)';
      const w = ctx.measureText(paused).width;
      ctx.fillText(paused, (frameView.width - w) / 2, frameView.height / 2);
    }
  }
}
