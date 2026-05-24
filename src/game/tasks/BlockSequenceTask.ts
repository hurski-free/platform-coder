import { arraysEqual, shuffleCopy } from '../math';
import type { IPlatformTask } from './IPlatformTask';
import type { TaskAnswer } from './IVerify';

export interface ISequenceBlock {
  id: string;
  text: string;
}

/** Расстановка блоков в заданном порядке (по id) */
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
    const order = this.normalizeAnswer(answer);
    if (!order) {
      return false;
    }
    return arraysEqual(order, this.expected);
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

  private normalizeAnswer(answer: TaskAnswer): string[] | null {
    if (Array.isArray(answer)) {
      if (!answer.every((id) => typeof id === 'string')) {
        return null;
      }
      return [...answer];
    }

    if (typeof answer !== 'string' || answer.trim().length === 0) {
      return null;
    }

    try {
      const parsed: unknown = JSON.parse(answer);
      if (
        Array.isArray(parsed) &&
        parsed.every((item) => typeof item === 'string')
      ) {
        return parsed;
      }
    } catch {
      return null;
    }

    return null;
  }
}

export function isBlockSequenceTask(
  task: IPlatformTask,
): task is BlockSequenceTask {
  return task.kind === 'block_sequence';
}
