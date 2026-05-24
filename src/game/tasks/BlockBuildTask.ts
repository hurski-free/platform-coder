import { shuffleCopy } from '../math';
import type { IPlatformTask } from './IPlatformTask';
import type { TaskAnswer } from './IVerify';
import type { ISequenceBlock } from './sequence-blocks';
import { verifySequenceOrder, verifySequenceOrderIgnoreOrder } from './sequence-answer';

/** Сборка последовательности из пула (есть лишние блоки) */
export class BlockBuildTask implements IPlatformTask {
  readonly kind = 'block_build' as const;
  readonly prompt: string;
  readonly blocks: readonly ISequenceBlock[];
  readonly saveSequence: boolean;

  private readonly expected: readonly string[];

  constructor(
    prompt: string,
    blocks: readonly ISequenceBlock[],
    expected: readonly string[],
    saveSequence = false,
  ) {
    this.prompt = prompt;
    this.blocks = blocks;
    this.expected = expected;
    this.saveSequence = saveSequence;
  }

  get expectedLength(): number {
    return this.expected.length;
  }

  verify(answer: TaskAnswer): boolean {
    if (this.saveSequence) {
      return verifySequenceOrder(answer, this.expected);
    }
    return verifySequenceOrderIgnoreOrder(answer, this.expected);
  }

  /** Перемешанный порядок блоков в пуле для UI */
  createShuffledPool(): string[] {
    return shuffleCopy(this.blocks.map((block) => block.id));
  }
}

export function isBlockBuildTask(task: IPlatformTask): task is BlockBuildTask {
  return task.kind === 'block_build';
}
