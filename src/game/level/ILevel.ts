import type { ISequenceBlock } from '../tasks/BlockSequenceTask';
import type { PlatformTaskKind } from '../tasks/IPlatformTask';
import type { TextMatchExpected } from '../tasks/TextMatchTask';

export interface ILevelPlatformTextMatch {
  kind: 'text_match';
  prompt: string;
  expected: TextMatchExpected;
}

export interface ILevelPlatformBlockSequence {
  kind: 'block_sequence';
  prompt: string;
  blocks: ISequenceBlock[];
  expected: string[];
}

export type ILevelPlatform = ILevelPlatformTextMatch | ILevelPlatformBlockSequence;

export interface ILevel {
  platforms: ILevelPlatform[];
}

export type { PlatformTaskKind };
