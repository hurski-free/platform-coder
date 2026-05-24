import type { IVerify } from './IVerify';

export type PlatformTaskKind = 'text_match';

/** Задача, привязанная к платформе; расширяется новыми kind */
export interface IPlatformTask extends IVerify {
  readonly kind: PlatformTaskKind;
  readonly prompt: string;
}
