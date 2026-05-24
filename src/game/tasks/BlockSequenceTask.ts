import { arraysEqual, shuffleCopy } from '../math';
import type { IPlatformTask } from './IPlatformTask';
import type { TaskAnswer } from './IVerify';
import type { ISequenceBlock } from './sequence-blocks';
import { verifySequenceOrder } from './sequence-answer';

export type { ISequenceBlock } from './sequence-blocks';

/** Расстановка всех блоков в заданном порядке (без лишних) */
export class BlockSequenceTask implements IPlatformTask {
  readonly kind = 'block_sequence' as const;
  readonly prompt: string;
  readonly blocks: readonly ISequenceBlock[];

  private readonly expected: readonly string[];

  constructor(
    prompt: string,
    blocks: readonly ISequenceBlock[],
    expected: readonly string[],
  ) {
    this.prompt = prompt;
    this.blocks = blocks;
    this.expected = expected;
  }

  verify(answer: TaskAnswer): boolean {
    return verifySequenceOrder(answer, this.expected);
  }

  /** Начальный порядок блоков (перемешанный) для UI */
  createShuffledOrder(): string[] {
    const ids = this.blocks.map((block) => block.id);
    if (ids.length <= 1) {
      return [...ids];
    }

    let shuffled = shuffleCopy(ids);
    let attempts = 0;
    while (arraysEqual(shuffled, this.expected) && attempts < 8) {
      shuffled = shuffleCopy(ids);
      attempts += 1;
    }

    if (arraysEqual(shuffled, this.expected)) {
      [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
    }

    return shuffled;
  }
}

export function isBlockSequenceTask(
  task: IPlatformTask,
): task is BlockSequenceTask {
  return task.kind === 'block_sequence';
}
