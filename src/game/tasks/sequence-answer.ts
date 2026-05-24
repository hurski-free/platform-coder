import { arraysEqual, arraysEqualIgnoreOrder } from '../math';
import type { TaskAnswer } from './IVerify';

export function normalizeSequenceAnswer(answer: TaskAnswer): string[] | null {
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

export function verifySequenceOrder(
  answer: TaskAnswer,
  expected: readonly string[],
): boolean {
  const order = normalizeSequenceAnswer(answer);
  if (!order) {
    return false;
  }
  return arraysEqual(order, expected);
}

export function verifySequenceOrderIgnoreOrder(
  answer: TaskAnswer,
  expected: readonly string[],
): boolean {
  const order = normalizeSequenceAnswer(answer);
  if (!order) {
    return false;
  }
  return arraysEqualIgnoreOrder(order, expected);
}