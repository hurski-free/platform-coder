import { PLAYER_SIZE } from '../constants';

export type PlayerMotion = 'grounded' | 'jumping' | 'falling';

export class Player {
  readonly size = PLAYER_SIZE;

  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  motion: PlayerMotion = 'grounded';
  platformIndex = 0;

  /** Platform target index */
  jumpTargetIndex = -1;

  reset(): void {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.motion = 'grounded';
    this.platformIndex = 0;
    this.jumpTargetIndex = -1;
  }
}
