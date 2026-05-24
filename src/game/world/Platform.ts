import type { IPlatformTask } from '../tasks/IPlatformTask';
import type { TaskAnswer } from '../tasks/IVerify';

export class Platform {
  solved = false;
  x: number;
  y: number;
  readonly width: number;
  readonly height: number;
  readonly task: IPlatformTask;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    task: IPlatformTask,
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.task = task;
  }

  verify(answer: TaskAnswer): boolean {
    if (this.solved) {
      return true;
    }
    return this.task.verify(answer);
  }

  markSolved(): void {
    this.solved = true;
  }
}
