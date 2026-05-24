import type { ISequenceBlock } from '../tasks/sequence-blocks';
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

export interface ILevelPlatformBlockBuild {
  kind: 'block_build';
  prompt: string;
  blocks: ISequenceBlock[];
  expected: string[];
  /** Сохранять собранную последовательность между визитами на платформу (sessionStorage) */
  saveSequence?: boolean;
}

export type ILevelPlatform =
  | ILevelPlatformTextMatch
  | ILevelPlatformBlockSequence
  | ILevelPlatformBlockBuild;

export interface ILevel {
  platforms: ILevelPlatform[];
}

export type { PlatformTaskKind };
