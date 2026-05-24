import type { IPlatformTask } from './IPlatformTask';

export type TextMatchExpected = string | number;

/** Текстовый ответ: число или слово (без учёта регистра по умолчанию) */
export class TextMatchTask implements IPlatformTask {
  readonly kind = 'text_match' as const;
  readonly prompt: string;

  private readonly expected: TextMatchExpected;
  private readonly caseSensitive: boolean;

  constructor(
    prompt: string,
    expected: TextMatchExpected,
    caseSensitive = false,
  ) {
    this.prompt = prompt;
    this.expected = expected;
    this.caseSensitive = caseSensitive;
  }

  verify(answer: string): boolean {
    const trimmed = answer.trim();
    if (trimmed.length === 0) {
      return false;
    }

    if (typeof this.expected === 'number') {
      const value = Number(trimmed.replace(',', '.'));
      return Number.isFinite(value) && value === this.expected;
    }

    if (this.caseSensitive) {
      return trimmed === this.expected;
    }

    return trimmed.toLowerCase() === this.expected.toLowerCase();
  }
}
