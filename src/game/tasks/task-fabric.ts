import { BlockSequenceTask } from './BlockSequenceTask';
import type { ILevelPlatform } from '../level/ILevel';
import type { IPlatformTask } from './IPlatformTask';
import { TextMatchTask } from './TextMatchTask';

export function createTask(config: ILevelPlatform): IPlatformTask {
  switch (config.kind) {
    case 'text_match':
      return new TextMatchTask(config.prompt, config.expected);
    case 'block_sequence':
      return new BlockSequenceTask(config.prompt, config.blocks, config.expected);
  }
}
