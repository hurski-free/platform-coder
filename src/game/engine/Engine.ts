import {
  CAMERA_FOLLOW_LERP,
  CAMERA_PLAYER_OFFSET_Y,
  GRAVITY,
  JUMP_VELOCITY_X,
  JUMP_VELOCITY_Y,
  LANDING_TOLERANCE,
  POINTS_PER_PLATFORM,
} from '../constants';
import type { ImmutableFrameView } from '../FrameView';
import type { IGameSession } from '../GameSession';
import { clamp } from '../math';
import { GameWorld } from '../world/GameWorld';
import { Platform } from '../world/Platform';
import { Player } from '../world/Player';
import type { IEngine } from './IEngine';

export class Engine implements IEngine {
  process(
    world: GameWorld,
    frameView: ImmutableFrameView,
    session: IGameSession,
    deltaTime: number,
  ): void {
    const dt = deltaTime / 1000;
    if (dt <= 0) {
      return;
    }

    this.updatePlayer(world, dt);
    this.updateCamera(world, frameView, dt);
    void session;
  }

  /** Вызывается из Game после успешного verify */
  onPlatformSolved(world: GameWorld, session: IGameSession): void {
    session.score += POINTS_PER_PLATFORM;
    this.startJumpToNext(world);
  }

  private startJumpToNext(world: GameWorld): void {
    if (!world.beginJumpToNext()) {
      return;
    }

    const player = world.player;
    const next = world.platforms[player.jumpTargetIndex];
    if (!next) {
      return;
    }

    const targetX = next.x + (next.width - player.size) / 2;
    const dx = targetX - player.x;

    player.vy = JUMP_VELOCITY_Y;
    player.vx = dx >= 0 ? JUMP_VELOCITY_X : -JUMP_VELOCITY_X;
    if (Math.abs(dx) < 40) {
      player.vx = 0;
    }
  }

  private updatePlayer(world: GameWorld, dt: number): void {
    const player = world.player;

    if (player.motion === 'grounded') {
      world.snapPlayerToPlatform(player.platformIndex);
      return;
    }

    player.vy += GRAVITY * dt;
    player.x += player.vx * dt;
    player.y += player.vy * dt;

    if (player.motion === 'jumping' && player.jumpTargetIndex >= 0) {
      const target = world.platforms[player.jumpTargetIndex];
      if (target && this.tryLandOnPlatform(player, target, world)) {
        return;
      }
    }

    if (player.vy > 0 && player.motion === 'jumping') {
      const current = world.platforms[player.platformIndex];
      if (current && player.y > current.y + 80) {
        player.motion = 'falling';
      }
    }
  }

  private tryLandOnPlatform(player: Player, platform: Platform, world: GameWorld): boolean {
    const feetY = player.y + player.size;
    const platformTop = platform.y;

    if (player.vy < 0) {
      return false;
    }

    const horizontallyOver =
      player.x + player.size > platform.x + LANDING_TOLERANCE &&
      player.x < platform.x + platform.width - LANDING_TOLERANCE;

    if (!horizontallyOver) {
      return false;
    }

    if (feetY >= platformTop - LANDING_TOLERANCE && feetY <= platformTop + platform.height + LANDING_TOLERANCE) {
      world.completeJumpLanding();
      return true;
    }

    return false;
  }

  private updateCamera(world: GameWorld, frameView: ImmutableFrameView, dt: number): void {
    const player = world.player;
    const targetCamX = -frameView.halfWidth + player.x + player.size / 2 - frameView.halfWidth * 0.1;
    const targetCamY = -player.y + frameView.halfHeight;

    const lerp = clamp(CAMERA_FOLLOW_LERP * (dt * 60), 0.02, 1);

    frameView.camera[0] += (targetCamX - frameView.camera[0]) * lerp;
    frameView.camera[1] += (targetCamY - frameView.camera[1]) * lerp;
  }
}
