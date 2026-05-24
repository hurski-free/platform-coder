import type { ILevel, ILevelPlatform } from "../game/level/ILevel";
import { rndInt } from "../utils/generators";
import type { ILevelDefinition } from "./level-definition";

function createSumPlatform(digits: number): ILevelPlatform {
  const a = rndInt(digits);
  const b = rndInt(digits);

  return {
    kind: 'text_match',
    prompt: `${a} + ${b} = ?`,
    expected: a + b,
  };
}

function createSubtractionPlatform(digits: number): ILevelPlatform {
  const a = rndInt(digits);
  const b = rndInt(digits);

  return {
    kind: 'text_match',
    prompt: `${a} - ${b} = ?`,
    expected: a - b,
  };
}

function createMultiplicationPlatform(digits: number): ILevelPlatform {
  const a = rndInt(digits);
  const b = rndInt(digits);

  return {
    kind: 'text_match',
    prompt: `${a} * ${b} = ?`,
    expected: a * b,
  };
}

function createDivisionPlatform(resultDigits: number, dividerDigits: number): ILevelPlatform {
  const result = rndInt(resultDigits);
  const divider = rndInt(dividerDigits, true);

  const dividend = result * divider;

  return {
    kind: 'text_match',
    prompt: `${dividend} / ${divider} = ?`,
    expected: result,
  };
}

function createMathLevel(): ILevel {
  return {
    platforms: [
      ...Array.from({ length: 5 }).map(() => createSumPlatform(1)),
      ...Array.from({ length: 3 }).map(() => createSumPlatform(2)),
      ...Array.from({ length: 2 }).map(() => createSumPlatform(3)),
      ...Array.from({ length: 3 }).map(() => createSubtractionPlatform(1)),
      ...Array.from({ length: 3 }).map(() => createSubtractionPlatform(2)),
      ...Array.from({ length: 5 }).map(() => createMultiplicationPlatform(1)),
      ...Array.from({ length: 2 }).map(() => createMultiplicationPlatform(2)),
      ...Array.from({ length: 2 }).map(() => createDivisionPlatform(1, 1)),
      ...Array.from({ length: 2 }).map(() => createDivisionPlatform(2, 1)),
    ],
  };
}

export const levelDefinition: ILevelDefinition = {
  id: 'math',
  titleKey: 'levels.math.title',
  descriptionKey: 'levels.math.description',
  getLevel: createMathLevel,
};
