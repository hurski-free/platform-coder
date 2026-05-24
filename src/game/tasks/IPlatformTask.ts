import type { IVerify } from './IVerify';

export type PlatformTaskKind = 'text_match' | 'block_sequence';

/** Задача, привязанная к платформе; расширяется новыми kind */
export interface IPlatformTask extends IVerify {
  readonly kind: PlatformTaskKind;
  readonly prompt: string;
}
